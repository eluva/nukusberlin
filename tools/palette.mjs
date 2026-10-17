/* Extract the palette from assets/avatar.jpg (decoded in Chromium). */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

const CHROME = 'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const PORT = 9343;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const b64 = readFileSync(new URL('../assets/avatar.jpg', import.meta.url)).toString('base64');
const dataUri = 'data:image/jpeg;base64,' + b64;

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu',
  '--no-first-run', '--user-data-dir=' + process.env.TEMP + '\\berlin-pal', 'about:blank'], { stdio: 'ignore' });

let ws, id = 0; const pending = new Map();
const send = (m, p = {}, s) => new Promise((res, rej) => { const n = ++id; pending.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method: m, params: p, sessionId: s })); });
let url;
for (let i = 0; i < 40; i++) { try { url = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; break; } catch { await sleep(250); } }
ws = new WebSocket(url);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
});
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Runtime.enable');

const r = await S('Runtime.evaluate', {
  returnByValue: true, awaitPromise: true,
  expression: `(async()=>{
    const img = new Image();
    img.src = ${JSON.stringify(dataUri)};
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0);
    const { data } = x.getImageData(0, 0, c.width, c.height);

    const toHsl = (r,g,b) => { r/=255;g/=255;b/=255;
      const mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2; let h=0,s=0;
      if(mx!==mn){ const d=mx-mn; s=l>.5?d/(2-mx-mn):d/(mx+mn);
        h = mx===r?((g-b)/d+(g<b?6:0)) : mx===g?((b-r)/d+2) : ((r-g)/d+4); h*=60; }
      return [h, s*100, l*100]; };
    const hex = a => '#' + a.map(v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');

    const buckets = new Map();
    let ps=[0,0,0], pn=0, core=[0,0,0], cn=0;
    for (let i=0;i<data.length;i+=4){
      const R=data[i],G=data[i+1],B=data[i+2],A=data[i+3];
      if(A<200) continue;
      const [h,s,l]=toHsl(R,G,B);
      if(s<15||l>93||l<5) continue;
      buckets.set([R,G,B].map(v=>Math.round(v/12)*12).join(','), (buckets.get([R,G,B].map(v=>Math.round(v/12)*12).join(','))||0)+1);
      if(h>=245&&h<=320&&s>25){ ps[0]+=R;ps[1]+=G;ps[2]+=B;pn++;
        if(s>45&&l>25&&l<60){ core[0]+=R;core[1]+=G;core[2]+=B;cn++; } }
    }
    const top=[...buckets.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,n])=>{
      const rgb=k.split(',').map(Number); const [h,s,l]=toHsl(...rgb);
      return { hex:hex(rgb), hsl:[h,s,l].map(Math.round), px:n };
    });
    return {
      size:[c.width,c.height], top,
      purpleAvg: pn?{hex:hex(ps.map(v=>v/pn)), hsl:toHsl(...ps.map(v=>v/pn)).map(Math.round), px:pn}:null,
      purpleCore: cn?{hex:hex(core.map(v=>v/cn)), hsl:toHsl(...core.map(v=>v/cn)).map(Math.round), px:cn}:null
    };
  })()`
});

if (r.exceptionDetails) {
  console.log('ERROR:', r.exceptionDetails.exception?.description || r.exceptionDetails.text);
} else {
  const p = r.result.value;
  console.log(`\nAvatar ${p.size[0]}x${p.size[1]} — dominant colours (white/grey excluded):`);
  for (const t of p.top) console.log(`  ${t.hex}   hsl(${t.hsl[0]} ${t.hsl[1]}% ${t.hsl[2]}%)   ${t.px} px`);
  console.log(`\n→ Purple, all pixels:  ${p.purpleAvg?.hex}  hsl(${p.purpleAvg?.hsl.join(' ')})  [${p.purpleAvg?.px} px]`);
  console.log(`→ Purple, saturated core: ${p.purpleCore?.hex}  hsl(${p.purpleCore?.hsl.join(' ')})  [${p.purpleCore?.px} px]`);
}
ws.close(); chrome.kill(); process.exit(0);
