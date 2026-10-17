/* ═══════════════════════════════════════════════════════════
   i18n — Qaraqalpaqsha (kaa) · Oʻzbekcha (uz) · Русский (ru)
   Applies to [data-i18n], [data-i18n-attr="attr:key"].
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEFAULT_LANG = 'kaa';
  var STORE_KEY = 'berlin.lang';

  var LANGS = {
    kaa: { code: 'kaa', short: 'QQ', htmlLang: 'kaa' },
    uz:  { code: 'uz',  short: 'UZ', htmlLang: 'uz'  },
    ru:  { code: 'ru',  short: 'RU', htmlLang: 'ru'  }
  };

  /* ═══════════════ QARAQALPAQSHA ═══════════════ */
  var kaa = {
    'meta.title': 'BERLIN — Nemis tili orayı | Nókis',
    'meta.desc': 'Nókistegi «Berlin» nemis tili orayı. 0 den C1 ge shekem nemis tili, ÖSD hám telc tayarlıq, Germaniyaǵa barıw jolları.',
    'a11y.skip': 'Formaǵa ótiw',
    'a11y.play': 'Qosıw',
    'a11y.pause': 'Toqtatıw',

    'brand.sub': 'Nemis tili orayı · Nókis',



    'gov.k': 'Mámleketlik qollaw',
    'gov.t': 'Siz 2 ay tóleysiz — qalǵan 6 aydı mámleket tóleydi',
    'gov.p': '«2+6» mámleketlik baǵdarlaması boyınsha nemis tili kursınıń 8 ayınan tek 2 ayın ózińiz tóleysiz. Qalǵan bólegin mámleket kóteredi. Orınlar sanı shekli.',
    'gov.cta': 'Baǵdarlama boyınsha sorań',

    'nav.why': 'Nege biz',
    'nav.programs': 'Kurslar',
    'nav.path': 'Germaniya',
    'nav.reel': 'Video',
    'nav.results': 'Nátiyjeler',
    'nav.teachers': 'Oqıtıwshılar',
    'nav.price': 'Baha',
    'nav.faq': 'FAQ',

    'cta.apply': 'Dárislerge jazılıw',
    'cta.applyShort': 'Jazılıw',
    'cta.watch': 'Oray haqqında video',
    'cta.pick': 'Tańlaw',
    'cta.consult': 'Keńes alıw',

    'hero.h1a': 'Noldan',
    'hero.h1b': 'C1 ge shekem',
    'hero.h1c': 'nemis tili',
    'hero.lead': 'Nókistegi «Berlin» orayı. Sóylewden baslaymız, grammatikanı sońınan bekitemiz — hám sizdi Germaniyaǵa shekem alıp baramız.',


    'why.kick': 'Nege «Berlin»',
    'why.h': 'Til úyreniw — qıyın emes. Durıs sistemanı tabıw qıyın.',
    'why.p': 'Jıllar dawamında ne isleytuǵının anıq bilemiz. Mine sol sistema.',
    'why.c1.t': 'Birinshi sabaqtan sóylew',
    'why.c1.p': 'Grammatika kitabın jattaw emes. Hár sabaqta waqıttıń 60 procenti — sóylew hám tıńlaw. Qáte islewden qorqpaytuǵın orta dúzemiz.',
    'why.c2.t': 'Kishi toparlar',
    'why.c2.p': '10–12 oqıwshı. Hár birewine gezek jetedi, hesh kim artta qalmaydı.',
    'why.c3.t': 'ÖSD hám telc formatı',
    'why.c3.p': 'Dárisler xalıqaralıq sertifikat formatında ótedi — imtixanda tanıs emes nárse bolmaydı.',
    'why.c4.t': 'Tilden keyin — jol',
    'why.c4.p': 'Ausbildung, Studium, FSJ. Hújjet, motivaciya xatı hám viza boyınsha qollaw.',
    'why.c5.t': 'Hár 2 háptede baqlaw',
    'why.c5.p': 'Kishkene test, aytılıw baqlawı hám jeke keri baylanıs. Progress sezilip turadı.',
    'why.c6.t': 'Sprachclub — háptede bir márte',
    'why.c6.p': 'Dáristen tıs erkin sóylesiw klubı. Tek nemisshe. Barlıq deńgeyler ushın ashıq hám biypul.',

    'prog.kick': 'Kurslar',
    'prog.h': 'Óz deńgeyińizdi tańlań',
    'prog.p': 'Hár modul 3 ay. Háptesine 4 sabaq, hár biri 120 minut. Barlıq dárisler orayda ótedi.',
    'prog.badge.pop': 'Eń kóp tańlanǵan',
    'prog.badge.int': 'Intensiv',

    'prog.p1.t': 'Noldan baslawshılar',
    'prog.p1.p': 'Álipbeden baslaymız. 6 ay ishinde ózińiz haqqıńızda sóylep, kúndelik jaǵdaylarda erkin islesesiz.',
    'prog.p1.l1': 'Aytılıw hám álipbe bazası',
    'prog.p1.l2': '1200+ sózlik minimum',
    'prog.p1.l3': 'Hár sabaqta dialog',
    'prog.p1.dur': '6 ay',

    'prog.p2.t': 'B1 — sheshiwshi deńgey',
    'prog.p2.p': 'Germaniyaǵa barıw ushın eń kem talap etiletuǵın deńgey. Ausbildung hám jumıs vizasınıń tiykarı.',
    'prog.p2.l1': 'Barlıq tiykarǵı grammatika',
    'prog.p2.l2': 'Xat hám arza jazıw',
    'prog.p2.l3': 'Imtixan bólimleri boyınsha shınıǵıw',
    'prog.p2.dur': '3 ay',

    'prog.p3.t': 'Joqarı deńgey',
    'prog.p3.p': 'Universitet, medicina hám kásiplik taraw ushın. Akademiyalıq til hám erkin pikir bildiriw.',
    'prog.p3.l1': 'Akademiyalıq leksika',
    'prog.p3.l2': 'Diskussiya hám prezentaciya',
    'prog.p3.l3': 'Kásiplik nemis tili',
    'prog.p3.dur': '6 ay',

    'prog.p4.t': 'Imtixanǵa tayarlıq',
    'prog.p4.p': '6 hápte ishinde formattı tolıq ózlestiremiz: tıńlaw, oqıw, jazıw, sóylew — hám waqıt basqarıw.',
    'prog.p4.l1': 'Haqıyqıy formattaǵı 8 sınaq imtixan',
    'prog.p4.l2': 'Sprechen bólimi boyınsha jeke tayarlıq',
    'prog.p4.l3': 'Qátelerdi dúzetiw boyınsha jeke joba',
    'prog.p4.dur': '6 hápte',

    'prog.p5.t': 'Ausbildung paketi',
    'prog.p5.p': 'Til + hújjet. B1 ge shekem oqıtamız hám Germaniyadaǵı jumıs beriwshi menen baylanıs, shártnama, viza basqıshlarında janıńızda bolamız.',
    'prog.p5.l1': 'Lebenslauf hám motivaciya xatı',
    'prog.p5.l2': 'Hújjetlerdi tayarlaw hám tárjima',
    'prog.p5.l3': 'Sáwbetke (Vorstellungsgespräch) tayarlıq',
    'prog.p5.dur': 'Jeke grafik',

    'path.kick': 'Tilden keyin',
    'path.h': 'Nókisten Germaniyaǵa shekem — 4 jol',
    'path.p': 'Til — tek ǵana birinshi basqısh. Qaysı jol sizge tuwrı keletuǵının birgelikte tańlaymız.',
    'path.w1.t': 'Ausbildung',
    'path.w1.p': 'Germaniyadaǵı 3 jıllıq kásiplik oqıw. Oqıw dáwirinde aylıq alasız hám pitkergennen soń jumısqa ornalasasız.',
    'path.w1.r': 'Talap: B1',
    'path.w2.t': 'Studium',
    'path.w2.p': 'Mámleketlik universitetlerde oqıw. Kópshiliginde oqıw tólemi joq — tek semestr jıyını.',
    'path.w2.r': 'Talap: B2 / C1',
    'path.w3.t': 'Gastronomie · Pflege',
    'path.w3.p': 'Aspazshılıq, miymanxana hám medicinalıq kútim tarawları — jumısshı eń kóp izlenetuǵın baǵdarlar.',
    'path.w3.r': 'Talap: B1',
    'path.w4.t': 'FSJ · Au-Pair',
    'path.w4.p': 'Jas óspirimler ushın eń ápiwayı baslaw. Bir jıl jámiyetlik xızmet yaki shańaraqta jasaw.',
    'path.w4.r': 'Talap: A2 / B1',

    'reel.kick': 'Video',
    'reel.h': '30 sekundta — oray haqqında',
    'reel.s1': 'Nemis tili orayı · Nókis',
    'reel.s2': 'Tolıq jol — bir orayda',
    'reel.s3': 'Hár sabaq — jańa sózler, jańa múmkinshilik',
    'reel.s4': '4 500 km. Bir sheshim menen baslanadı.',
    'reel.s5': 'Maqset — qaǵaz emes, haqıyqıy nátiyje',
    'reel.s6k': 'Toparǵa qabıl ashıq',
    'reel.s6h': 'Búgin baslań',
    'reel.ch1': 'Oray',
    'reel.ch2': 'Deńgeyler',
    'reel.ch3': 'Sózler',
    'reel.ch4': 'Jol',
    'reel.ch5': 'Sertifikat',
    'reel.ch6': 'Baslaw',

    'res.kick': 'Nátiyjeler',
    'res.h': 'Oqıwshılarımız ne deydi',
    'res.p': 'Instagram\'daǵı NÁTIYJELER bóliminde júzlegen sertifikat hám video pikirler bar.',
    'res.q1': 'Men noldan basladım. 8 aydan keyin ÖSD B1 di birinshi urınıwda tapsırdım. Eń úlken ayırmashılıq — bul jerde seni sóylewge májbúrleydi, jattawǵa emes.',
    'res.q1n': 'B1 · Ausbildung, Leipzig',
    'res.q2': 'Hújjetler boyınsha eń qıyın jeri — motivaciya xatı edi. Ustazlar menen birgelikte 4 márte qayta jazdıq. Viza birden shıqtı.',
    'res.q2n': 'B1 · Gastronomie, München',
    'res.q3': 'Men «2+6» baǵdarlaması arqalı oqıdım — tek 2 ayın tólep, tolıq kurstı pitkerdim. Háptesine 4 sabaq bolǵanı ushın temp tez, biraq úlgeriwge boladı.',
    'res.q3n': 'B1 · «2+6» baǵdarlaması',
    'res.q4': 'Sprachclub maǵan eń kóp járdem berdi. Dáriste qorqıp sóylemeytuǵın edim, klubta erkin sóylesip kettim.',
    'res.q4n': 'A2 → B1',

    'tch.kick': 'Komanda',
    'tch.h': 'Sizdi oqıtatuǵınlar',
    'tch.p': 'Hár bir oqıtıwshı — sertifikatlanǵan hám ózi de usı joldı basıp ótken.',
    'tch.t1r': 'Tiykarǵı oqıtıwshı · A1–B1',
    'tch.t1b': 'C1 sertifikatı. 6 jıl tájiriybe, 400+ pitkeriwshi. Aytılıw hám sóylew boyınsha qánige.',
    'tch.t2r': 'Oqıtıwshı · B2–C1, ÖSD',
    'tch.t2b': 'Germaniyada 3 jıl oqıǵan. Imtixan formatı hám akademiyalıq til boyınsha isleydi.',
    'tch.t3r': 'Ausbildung koordinatorı',
    'tch.t3b': 'Hújjet, shártnama hám viza basqıshları. 150+ oqıwshını Germaniyaǵa shıǵarǵan.',

    'pr.kick': 'Bahalar',
    'pr.h': 'Ashıq hám túsinikli',
    'pr.p': 'Jasırın tólem joq. Materiallar bahaǵa kiredi.',
    'pr.mo': 'sum / ay',
    'pr.g.badge': 'Mámleketlik baǵdarlama',
    'pr.g.t': '«2+6» baǵdarlaması',
    'pr.g.d': '8 aylıq kurstıń tek 2 ayın tóleysiz',
    'pr.g.sub': 'sum — pútkil kurs ushın',
    'pr.g.1': '2 aylıq tólem — qalǵan 6 ayın mámleket tóleydi',
    'pr.g.2': 'Noldan B1 ge shekem tolıq kurs',
    'pr.g.3': 'Offlayn topar menen birdey baǵdarlama',
    'pr.g.4': 'Hújjetlerdi rásmiylestiriwde járdem beremiz',
    'pr.g.5': 'Orınlar sanı shekli',
    'pr.b.t': 'Offlayn topar',
    'pr.b.d': 'Orayda, janlı dáris',
    'pr.b.1': 'Háptesine 4 sabaq · 120 min',
    'pr.b.2': 'Toparda 10–12 oqıwshı',
    'pr.b.3': 'Sprachclub — biypul',
    'pr.b.4': 'Basıp shıǵarılǵan materiallar',
    'pr.b.5': 'Hár 2 háptede baqlaw testi',
    'pr.c.t': 'Ausbildung paketi',
    'pr.c.d': 'Til + hújjet + viza qollawı',
    'pr.c.val': 'Jeke',
    'pr.c.sub': 'sáwbetten keyin',
    'pr.c.1': 'B1 ge shekem tolıq oqıw',
    'pr.c.2': 'Lebenslauf hám motivaciya xatı',
    'pr.c.3': 'Jumıs beriwshi menen baylanıs',
    'pr.c.4': 'Viza hújjetleri boyınsha qollaw',
    'pr.c.5': 'Sáwbetke tayarlıq',


    'faq.kick': 'Sorawlar',
    'faq.h': 'Jiyi berilgen sorawlar',
    'faq.q1': 'Men pútkilley noldan baslayman. Úlgere alaman ba?',
    'faq.a1': 'Álbette. Oqıwshılarımızdıń kópshiligi noldan baslaǵan. A1 toparı dál sol ushın: birinshi sabaqta álipbe hám aytılıw, úshinshi háptede ózińiz haqqıńızda sóyley alasız. Aldın-ala bilim talap etilmeydi.',
    'faq.q2': 'Germaniyaǵa barıw ushın qaysı deńgey kerek?',
    'faq.a2': 'Kópshilik jaǵdayda B1. Ausbildung, jumıs vizası hám shańaraq vizası ushın B1 jetkilikli. Universitetke kiriw ushın B2 yaki C1 talap etiledi. Aspazshılıq hám medicinalıq kútim tarawlarında da B1 menen baslaw múmkin.',
    'faq.q3': 'Qansha waqıtta B1 ge jetemen?',
    'faq.a3': 'Noldan baslaǵanda ortasha 8 ay: A1 → A2 → B1. Háptesine 4 sabaq hám hár biri 120 minut bolǵanı ushın temp tez. Mámleketlik «2+6» baǵdarlaması dál usı 8 aylıq múddetke esaplanǵan.',
    'faq.q4': 'Sertifikattı qay jerde tapsıraman?',
    'faq.a4': 'ÖSD hám telc imtixanları Tashkentte hám basqa oraylarda ótkeriledi. Biz imtixanǵa tolıq tayarlaymız, dizimnen ótiw hám barıw máselelerinde járdem beremiz.',
    'faq.q5': 'Sabaqlardı jiberip alsam ne boladı?',
    'faq.a5': 'Hár sabaqtıń konspekti hám tapsırmaları Telegram toparına júklenedi. Sonday-aq oqıtıwshı menen kelisip, jiberip alǵan temanı ayrıqsha tákirarlaw múmkin.',
    'faq.q6': 'Tólemdi qalay ámelge asıraman?',
    'faq.a6': 'Ay sayın, oqıw baslanǵanǵa shekem. Click, Payme, naq pul yaki bank karta arqalı.',
    'faq.q7': '«2+6» mámleketlik baǵdarlaması degen ne?',
    'faq.a7': 'Bul — mámleket tárepinen qollap-quwatlanatuǵın baǵdarlama. 8 aylıq nemis tili kursınıń tek 2 ayın ózińiz tóleysiz, qalǵan 6 ayın mámleket tóleydi. Orınlar sanı shekli, sonlıqtan aldınnan jazılıw kerek. Hújjetlerdi rásmiylestiriwde biz járdem beremiz — arza qaldırıń, detallardı aytıp beremiz.',

    'ap.kick': 'Arza',
    'ap.h': 'Biypul sınaq sabaqqa jazılıń',
    'ap.p': 'Formanı toltırıń — 24 saat ishinde qońıraw etip, sizge tuwrı keletuǵın topardı usınamız.',
    'ap.l1': 'Birinshi sabaq — biypul',
    'ap.l2': 'Deńgeydi biz anıqlaymız',
    'ap.l3': 'Májbúriyat joq',
    'ap.tg': 'Tezirek juwap',
    'ap.ig': 'Nátiyjeler hám videolar',
    'ap.f.name': 'Atıńız *',
    'ap.f.namePh': 'Atıńız hám familiyańız',
    'ap.f.phone': 'Telefon *',
    'ap.f.level': 'Házirgi deńgeyińiz',
    'ap.f.lv0': 'Noldan baslayman',
    'ap.f.lvU': 'Bilmeymen — sınań',
    'ap.f.goal': 'Maqsetińiz',
    'ap.g1': 'Ausbildung',
    'ap.g2': 'Studium',
    'ap.g3': 'Jumıs',
    'ap.g4': 'Ózim ushın',
    'ap.f.time': 'Qolay waqıt',
    'ap.t1': 'Tańǵı',
    'ap.t2': 'Kúndizgi',
    'ap.t3': 'Keshki',
    'ap.f.note': 'Qosımsha (májbúriy emes)',
    'ap.f.notePh': 'Sorawıńız bar ma?',
    'ap.f.submit': 'Arzanı jiberiw',
    'ap.f.legal': 'Arzanı jiberip, siz benen baylanısıwǵa razılıq bildiresiz. Maǵlıwmatlarıńız úshinshi tereplerge berilmeydi.',
    'ap.ok.h': 'Arza qabıl etildi',
    'ap.ok.p': 'Raxmet! 24 saat ishinde qońıraw etemiz. Tezirek baylanısıw ushın Telegram\'ǵa jazıń.',
    'ap.ok.tg': 'Telegram\'da jazıw',
    'ap.ok.again': 'Jáne bir arza jiberiw',

    'err.name': 'Atıńızdı jazıń (keminde 2 háribi)',
    'err.phone': 'Durıs telefon nomerin kiritiń',

    'ftr.nav': 'Bólimler',
    'ftr.contact': 'Baylanıs',
    'ftr.addr': 'Nókis qalası, 23-mikrorayon, 6',
    'ftr.hours': 'Dú–Ju 09:00–20:00 · Sh 09:00–15:00',
    'ftr.tag': 'Noldan C1 ge shekem nemis tili. Nókis, Qaraqalpaqstan.',
    'ftr.made': 'Nókiste islengen'
  };

  /* ═══════════════ OʻZBEKCHA ═══════════════ */
  var uz = {
    'meta.title': 'BERLIN — Nemis tili markazi | Nukus',
    'meta.desc': 'Nukusdagi «Berlin» nemis tili markazi. 0 dan C1 gacha nemis tili, ÖSD va telc tayyorgarligi, Germaniyaga borish yo‘llari.',
    'a11y.skip': 'Formaga o‘tish',
    'a11y.play': 'Ijro etish',
    'a11y.pause': 'To‘xtatish',

    'brand.sub': 'Nemis tili markazi · Nukus',



    'gov.k': 'Davlat ko‘magi',
    'gov.t': 'Siz 2 oy to‘laysiz — qolgan 6 oyni davlat to‘laydi',
    'gov.p': '«2+6» davlat dasturi bo‘yicha nemis tili kursining 8 oyidan faqat 2 oyini o‘zingiz to‘laysiz. Qolgan qismini davlat qoplaydi. O‘rinlar soni cheklangan.',
    'gov.cta': 'Dastur haqida so‘rash',

    'nav.why': 'Nega biz',
    'nav.programs': 'Kurslar',
    'nav.path': 'Germaniya',
    'nav.reel': 'Video',
    'nav.results': 'Natijalar',
    'nav.teachers': 'O‘qituvchilar',
    'nav.price': 'Narx',
    'nav.faq': 'FAQ',

    'cta.apply': 'Darslarga yozilish',
    'cta.applyShort': 'Yozilish',
    'cta.watch': 'Markaz haqida video',
    'cta.pick': 'Tanlash',
    'cta.consult': 'Maslahat olish',

    'hero.h1a': 'Noldan',
    'hero.h1b': 'C1 gacha',
    'hero.h1c': 'nemis tili',
    'hero.lead': 'Nukusdagi «Berlin» markazi. Gapirishdan boshlaymiz, grammatikani keyin mustahkamlaymiz — va sizni Germaniyagacha olib boramiz.',


    'why.kick': 'Nega «Berlin»',
    'why.h': 'Til o‘rganish — qiyin emas. To‘g‘ri tizimni topish qiyin.',
    'why.p': 'Yillar davomida nima ish berishini aniq bilamiz. Mana o‘sha tizim.',
    'why.c1.t': 'Birinchi darsdan gapirish',
    'why.c1.p': 'Grammatika kitobini yodlash emas. Har darsda vaqtning 60 foizi — gapirish va tinglash. Xato qilishdan qo‘rqmaydigan muhit yaratamiz.',
    'why.c2.t': 'Kichik guruhlar',
    'why.c2.p': '10–12 o‘quvchi. Har biriga navbat yetadi, hech kim ortda qolmaydi.',
    'why.c3.t': 'ÖSD va telc formati',
    'why.c3.p': 'Darslar xalqaro sertifikat formatida o‘tadi — imtihonda notanish narsa bo‘lmaydi.',
    'why.c4.t': 'Tildan keyin — yo‘l',
    'why.c4.p': 'Ausbildung, Studium, FSJ. Hujjat, motivatsiya xati va viza bo‘yicha ko‘mak.',
    'why.c5.t': 'Har 2 haftada nazorat',
    'why.c5.p': 'Kichik test, talaffuz nazorati va shaxsiy fikr-mulohaza. Progress sezilib turadi.',
    'why.c6.t': 'Sprachclub — haftada bir marta',
    'why.c6.p': 'Darsdan tashqari erkin suhbat klubi. Faqat nemischa. Barcha darajalar uchun ochiq va bepul.',

    'prog.kick': 'Kurslar',
    'prog.h': 'O‘z darajangizni tanlang',
    'prog.p': 'Har modul 3 oy. Haftasiga 4 dars, har biri 120 daqiqa. Barcha darslar markazda o‘tadi.',
    'prog.badge.pop': 'Eng ko‘p tanlangan',
    'prog.badge.int': 'Intensiv',

    'prog.p1.t': 'Noldan boshlovchilar',
    'prog.p1.p': 'Alifbodan boshlaymiz. 6 oy ichida o‘zingiz haqingizda gapirib, kundalik vaziyatlarda erkin muloqot qilasiz.',
    'prog.p1.l1': 'Talaffuz va alifbo bazasi',
    'prog.p1.l2': '1200+ so‘zlik minimum',
    'prog.p1.l3': 'Har darsda dialog',
    'prog.p1.dur': '6 oy',

    'prog.p2.t': 'B1 — hal qiluvchi daraja',
    'prog.p2.p': 'Germaniyaga borish uchun eng kam talab qilinadigan daraja. Ausbildung va ish vizasining asosi.',
    'prog.p2.l1': 'Barcha asosiy grammatika',
    'prog.p2.l2': 'Xat va ariza yozish',
    'prog.p2.l3': 'Imtihon bo‘limlari bo‘yicha mashq',
    'prog.p2.dur': '3 oy',

    'prog.p3.t': 'Yuqori daraja',
    'prog.p3.p': 'Universitet, tibbiyot va kasbiy soha uchun. Akademik til va erkin fikr bildirish.',
    'prog.p3.l1': 'Akademik leksika',
    'prog.p3.l2': 'Diskussiya va prezentatsiya',
    'prog.p3.l3': 'Kasbiy nemis tili',
    'prog.p3.dur': '6 oy',

    'prog.p4.t': 'Imtihonga tayyorgarlik',
    'prog.p4.p': '6 hafta ichida formatni to‘liq o‘zlashtiramiz: tinglash, o‘qish, yozish, gapirish — va vaqtni boshqarish.',
    'prog.p4.l1': 'Haqiqiy formatdagi 8 sinov imtihon',
    'prog.p4.l2': 'Sprechen bo‘limi bo‘yicha shaxsiy tayyorgarlik',
    'prog.p4.l3': 'Xatolar ustida ishlash bo‘yicha shaxsiy reja',
    'prog.p4.dur': '6 hafta',

    'prog.p5.t': 'Ausbildung paketi',
    'prog.p5.p': 'Til + hujjat. B1 gacha o‘qitamiz va Germaniyadagi ish beruvchi bilan aloqa, shartnoma, viza bosqichlarida yoningizda bo‘lamiz.',
    'prog.p5.l1': 'Lebenslauf va motivatsiya xati',
    'prog.p5.l2': 'Hujjatlarni tayyorlash va tarjima',
    'prog.p5.l3': 'Suhbatga (Vorstellungsgespräch) tayyorgarlik',
    'prog.p5.dur': 'Shaxsiy jadval',

    'path.kick': 'Tildan keyin',
    'path.h': 'Nukusdan Germaniyagacha — 4 yo‘l',
    'path.p': 'Til — bu faqat birinchi bosqich. Qaysi yo‘l sizga to‘g‘ri kelishini birgalikda tanlaymiz.',
    'path.w1.t': 'Ausbildung',
    'path.w1.p': 'Germaniyadagi 3 yillik kasbiy ta’lim. O‘qish davomida oylik olasiz va tugatgach ishga joylashasiz.',
    'path.w1.r': 'Talab: B1',
    'path.w2.t': 'Studium',
    'path.w2.p': 'Davlat universitetlarida o‘qish. Ko‘pchiligida o‘qish to‘lovi yo‘q — faqat semestr yig‘imi.',
    'path.w2.r': 'Talab: B2 / C1',
    'path.w3.t': 'Gastronomie · Pflege',
    'path.w3.p': 'Oshpazlik, mehmonxona va tibbiy parvarish sohalari — ishchi eng ko‘p izlanadigan yo‘nalishlar.',
    'path.w3.r': 'Talab: B1',
    'path.w4.t': 'FSJ · Au-Pair',
    'path.w4.p': 'Yoshlar uchun eng oddiy boshlanish. Bir yil ijtimoiy xizmat yoki oilada yashash.',
    'path.w4.r': 'Talab: A2 / B1',

    'reel.kick': 'Video',
    'reel.h': '30 soniyada — markaz haqida',
    'reel.s1': 'Nemis tili markazi · Nukus',
    'reel.s2': 'To‘liq yo‘l — bitta markazda',
    'reel.s3': 'Har dars — yangi so‘zlar, yangi imkoniyat',
    'reel.s4': '4 500 km. Bitta qaror bilan boshlanadi.',
    'reel.s5': 'Maqsad — qog‘oz emas, haqiqiy natija',
    'reel.s6k': 'Guruhga qabul ochiq',
    'reel.s6h': 'Bugun boshlang',
    'reel.ch1': 'Markaz',
    'reel.ch2': 'Darajalar',
    'reel.ch3': 'So‘zlar',
    'reel.ch4': 'Yo‘l',
    'reel.ch5': 'Sertifikat',
    'reel.ch6': 'Boshlash',

    'res.kick': 'Natijalar',
    'res.h': 'O‘quvchilarimiz nima deydi',
    'res.p': 'Instagram\'dagi NÁTIYJELER bo‘limida yuzlab sertifikat va video fikrlar bor.',
    'res.q1': 'Men noldan boshladim. 8 oydan keyin ÖSD B1 ni birinchi urinishda topshirdim. Eng katta farq — bu yerda seni gapirishga majbur qiladi, yodlashga emas.',
    'res.q1n': 'B1 · Ausbildung, Leipzig',
    'res.q2': 'Hujjatlar bo‘yicha eng qiyin joyi — motivatsiya xati edi. Ustozlar bilan birgalikda 4 marta qayta yozdik. Viza birdan chiqdi.',
    'res.q2n': 'B1 · Gastronomie, München',
    'res.q3': 'Men «2+6» dasturi orqali o‘qidim — faqat 2 oyini to‘lab, to‘liq kursni tugatdim. Haftasiga 4 dars bo‘lgani uchun temp tez, lekin ulgurish mumkin.',
    'res.q3n': 'B1 · «2+6» dasturi',
    'res.q4': 'Sprachclub menga eng ko‘p yordam berdi. Darsda qo‘rqib gapirmasdim, klubda erkin suhbatlashib ketdim.',
    'res.q4n': 'A2 → B1',

    'tch.kick': 'Jamoa',
    'tch.h': 'Sizni o‘qitadiganlar',
    'tch.p': 'Har bir o‘qituvchi — sertifikatlangan va o‘zi ham shu yo‘lni bosib o‘tgan.',
    'tch.t1r': 'Asosiy o‘qituvchi · A1–B1',
    'tch.t1b': 'C1 sertifikati. 6 yil tajriba, 400+ bitiruvchi. Talaffuz va nutq bo‘yicha mutaxassis.',
    'tch.t2r': 'O‘qituvchi · B2–C1, ÖSD',
    'tch.t2b': 'Germaniyada 3 yil o‘qigan. Imtihon formati va akademik til bo‘yicha ishlaydi.',
    'tch.t3r': 'Ausbildung koordinatori',
    'tch.t3b': 'Hujjat, shartnoma va viza bosqichlari. 150+ o‘quvchini Germaniyaga chiqargan.',

    'pr.kick': 'Narxlar',
    'pr.h': 'Ochiq va tushunarli',
    'pr.p': 'Yashirin to‘lov yo‘q. Materiallar narxga kiradi.',
    'pr.mo': 'so‘m / oy',
    'pr.g.badge': 'Davlat dasturi',
    'pr.g.t': '«2+6» dasturi',
    'pr.g.d': '8 oylik kursning faqat 2 oyini to‘laysiz',
    'pr.g.sub': 'so‘m — butun kurs uchun',
    'pr.g.1': '2 oylik to‘lov — qolgan 6 oyni davlat to‘laydi',
    'pr.g.2': 'Noldan B1 gacha to‘liq kurs',
    'pr.g.3': 'Oflayn guruh bilan bir xil dastur',
    'pr.g.4': 'Hujjatlarni rasmiylashtirishda yordam beramiz',
    'pr.g.5': 'O‘rinlar soni cheklangan',
    'pr.b.t': 'Oflayn guruh',
    'pr.b.d': 'Markazda, jonli dars',
    'pr.b.1': 'Haftasiga 4 dars · 120 daq',
    'pr.b.2': 'Guruhda 10–12 o‘quvchi',
    'pr.b.3': 'Sprachclub — bepul',
    'pr.b.4': 'Bosma materiallar',
    'pr.b.5': 'Har 2 haftada nazorat testi',
    'pr.c.t': 'Ausbildung paketi',
    'pr.c.d': 'Til + hujjat + viza ko‘magi',
    'pr.c.val': 'Shaxsiy',
    'pr.c.sub': 'suhbatdan keyin',
    'pr.c.1': 'B1 gacha to‘liq o‘qish',
    'pr.c.2': 'Lebenslauf va motivatsiya xati',
    'pr.c.3': 'Ish beruvchi bilan aloqa',
    'pr.c.4': 'Viza hujjatlari bo‘yicha ko‘mak',
    'pr.c.5': 'Suhbatga tayyorgarlik',


    'faq.kick': 'Savollar',
    'faq.h': 'Ko‘p beriladigan savollar',
    'faq.q1': 'Men mutlaqo noldan boshlayman. Ulgura olamanmi?',
    'faq.a1': 'Albatta. O‘quvchilarimizning ko‘pchiligi noldan boshlagan. A1 guruhi aynan shuning uchun: birinchi darsda alifbo va talaffuz, uchinchi haftada o‘zingiz haqingizda gapira olasiz. Oldindan bilim talab qilinmaydi.',
    'faq.q2': 'Germaniyaga borish uchun qaysi daraja kerak?',
    'faq.a2': 'Ko‘pchilik holatda B1. Ausbildung, ish vizasi va oila vizasi uchun B1 yetarli. Universitetga kirish uchun B2 yoki C1 talab qilinadi. Oshpazlik va tibbiy parvarish sohalarida ham B1 bilan boshlash mumkin.',
    'faq.q3': 'Qancha vaqtda B1 ga yetaman?',
    'faq.a3': 'Noldan boshlaganda o‘rtacha 8 oy: A1 → A2 → B1. Haftasiga 4 dars va har biri 120 daqiqa bo‘lgani uchun temp tez. Davlatning «2+6» dasturi aynan shu 8 oylik muddatga mo‘ljallangan.',
    'faq.q4': 'Sertifikatni qayerda topshiraman?',
    'faq.a4': 'ÖSD va telc imtihonlari Toshkentda va boshqa markazlarda o‘tkaziladi. Biz imtihonga to‘liq tayyorlaymiz, ro‘yxatdan o‘tish va borish masalalarida yordam beramiz.',
    'faq.q5': 'Darslarni o‘tkazib yuborsam nima bo‘ladi?',
    'faq.a5': 'Har darsning konspekti va vazifalari Telegram guruhiga yuklanadi. Shuningdek o‘qituvchi bilan kelishib, o‘tkazib yuborilgan mavzuni alohida takrorlash mumkin.',
    'faq.q6': 'To‘lovni qanday amalga oshiraman?',
    'faq.a6': 'Oyma-oy, o‘qish boshlanishidan oldin. Click, Payme, naqd pul yoki bank kartasi orqali.',
    'faq.q7': 'Davlatning «2+6» dasturi nima?',
    'faq.a7': 'Bu — davlat tomonidan qo‘llab-quvvatlanadigan dastur. 8 oylik nemis tili kursining faqat 2 oyini o‘zingiz to‘laysiz, qolgan 6 oyini davlat to‘laydi. O‘rinlar soni cheklangan, shuning uchun oldindan yozilish kerak. Hujjatlarni rasmiylashtirishda biz yordam beramiz — ariza qoldiring, tafsilotlarni aytib beramiz.',

    'ap.kick': 'Ariza',
    'ap.h': 'Bepul sinov darsga yoziling',
    'ap.p': 'Formani to‘ldiring — 24 soat ichida qo‘ng‘iroq qilib, sizga mos guruhni taklif qilamiz.',
    'ap.l1': 'Birinchi dars — bepul',
    'ap.l2': 'Darajani biz aniqlaymiz',
    'ap.l3': 'Majburiyat yo‘q',
    'ap.tg': 'Tezroq javob',
    'ap.ig': 'Natijalar va videolar',
    'ap.f.name': 'Ismingiz *',
    'ap.f.namePh': 'Ismingiz va familiyangiz',
    'ap.f.phone': 'Telefon *',
    'ap.f.level': 'Hozirgi darajangiz',
    'ap.f.lv0': 'Noldan boshlayman',
    'ap.f.lvU': 'Bilmayman — sinab ko‘ring',
    'ap.f.goal': 'Maqsadingiz',
    'ap.g1': 'Ausbildung',
    'ap.g2': 'Studium',
    'ap.g3': 'Ish',
    'ap.g4': 'O‘zim uchun',
    'ap.f.time': 'Qulay vaqt',
    'ap.t1': 'Ertalabki',
    'ap.t2': 'Kunduzgi',
    'ap.t3': 'Kechki',
    'ap.f.note': 'Qo‘shimcha (majburiy emas)',
    'ap.f.notePh': 'Savolingiz bormi?',
    'ap.f.submit': 'Arizani yuborish',
    'ap.f.legal': 'Arizani yuborib, siz bilan bog‘lanishga rozilik bildirasiz. Ma’lumotlaringiz uchinchi shaxslarga berilmaydi.',
    'ap.ok.h': 'Ariza qabul qilindi',
    'ap.ok.p': 'Rahmat! 24 soat ichida qo‘ng‘iroq qilamiz. Tezroq bog‘lanish uchun Telegram\'ga yozing.',
    'ap.ok.tg': 'Telegram\'da yozish',
    'ap.ok.again': 'Yana bir ariza yuborish',

    'err.name': 'Ismingizni yozing (kamida 2 harf)',
    'err.phone': 'To‘g‘ri telefon raqamini kiriting',

    'ftr.nav': 'Bo‘limlar',
    'ftr.contact': 'Aloqa',
    'ftr.addr': 'Nukus shahri, 23-mikrorayon, 6',
    'ftr.hours': 'Du–Ju 09:00–20:00 · Sh 09:00–15:00',
    'ftr.tag': 'Noldan C1 gacha nemis tili. Nukus, Qoraqalpog‘iston.',
    'ftr.made': 'Nukusda ishlangan'
  };

  /* ═══════════════ РУССКИЙ ═══════════════ */
  var ru = {
    'meta.title': 'BERLIN — центр немецкого языка | Нукус',
    'meta.desc': 'Центр немецкого языка «Berlin» в Нукусе. Немецкий с 0 до C1, подготовка к ÖSD и telc, пути в Германию.',
    'a11y.skip': 'Перейти к форме',
    'a11y.play': 'Воспроизвести',
    'a11y.pause': 'Пауза',

    'brand.sub': 'Центр немецкого языка · Нукус',



    'gov.k': 'Государственная поддержка',
    'gov.t': 'Вы платите за 2 месяца — остальные 6 оплачивает государство',
    'gov.p': 'По государственной программе «2+6» из 8 месяцев курса немецкого языка вы оплачиваете только 2. Остальное берёт на себя государство. Количество мест ограничено.',
    'gov.cta': 'Спросить о программе',

    'nav.why': 'Почему мы',
    'nav.programs': 'Курсы',
    'nav.path': 'Германия',
    'nav.reel': 'Видео',
    'nav.results': 'Результаты',
    'nav.teachers': 'Преподаватели',
    'nav.price': 'Цены',
    'nav.faq': 'Вопросы',

    'cta.apply': 'Записаться на курс',
    'cta.applyShort': 'Записаться',
    'cta.watch': 'Видео о центре',
    'cta.pick': 'Выбрать',
    'cta.consult': 'Консультация',

    'hero.h1a': 'Немецкий',
    'hero.h1b': 'с нуля до C1',
    'hero.h1c': 'в Нукусе',
    'hero.lead': 'Центр «Berlin» в Нукусе. Начинаем с речи, грамматику закрепляем после — и доводим вас до Германии.',


    'why.kick': 'Почему «Berlin»',
    'why.h': 'Выучить язык — несложно. Сложно найти правильную систему.',
    'why.p': 'За годы работы мы точно знаем, что работает. Вот эта система.',
    'why.c1.t': 'Речь с первого занятия',
    'why.c1.p': 'Не зубрёжка учебника грамматики. 60% времени каждого урока — говорение и аудирование. Создаём среду, где не страшно ошибаться.',
    'why.c2.t': 'Маленькие группы',
    'why.c2.p': '10–12 учеников. Очередь доходит до каждого, никто не остаётся позади.',
    'why.c3.t': 'Формат ÖSD и telc',
    'why.c3.p': 'Занятия идут в формате международного сертификата — на экзамене не будет ничего незнакомого.',
    'why.c4.t': 'После языка — путь',
    'why.c4.p': 'Ausbildung, Studium, FSJ. Поддержка по документам, мотивационному письму и визе.',
    'why.c5.t': 'Контроль каждые 2 недели',
    'why.c5.p': 'Небольшой тест, проверка произношения и личная обратная связь. Прогресс виден.',
    'why.c6.t': 'Sprachclub — раз в неделю',
    'why.c6.p': 'Разговорный клуб вне занятий. Только по-немецки. Открыт для всех уровней и бесплатен.',

    'prog.kick': 'Курсы',
    'prog.h': 'Выберите свой уровень',
    'prog.p': 'Каждый модуль — 3 месяца. 4 занятия в неделю по 120 минут. Все занятия проходят в центре.',
    'prog.badge.pop': 'Выбирают чаще всего',
    'prog.badge.int': 'Интенсив',

    'prog.p1.t': 'Начинающие с нуля',
    'prog.p1.p': 'Начинаем с алфавита. За 6 месяцев вы расскажете о себе и будете свободно справляться в бытовых ситуациях.',
    'prog.p1.l1': 'База произношения и алфавита',
    'prog.p1.l2': 'Словарный минимум 1200+ слов',
    'prog.p1.l3': 'Диалог на каждом занятии',
    'prog.p1.dur': '6 месяцев',

    'prog.p2.t': 'B1 — решающий уровень',
    'prog.p2.p': 'Минимальный уровень для выезда в Германию. Основа для Ausbildung и рабочей визы.',
    'prog.p2.l1': 'Вся базовая грамматика',
    'prog.p2.l2': 'Письма и заявления',
    'prog.p2.l3': 'Отработка по разделам экзамена',
    'prog.p2.dur': '3 месяца',

    'prog.p3.t': 'Продвинутый уровень',
    'prog.p3.p': 'Для университета, медицины и профессиональной сферы. Академический язык и свободное выражение мысли.',
    'prog.p3.l1': 'Академическая лексика',
    'prog.p3.l2': 'Дискуссия и презентация',
    'prog.p3.l3': 'Профессиональный немецкий',
    'prog.p3.dur': '6 месяцев',

    'prog.p4.t': 'Подготовка к экзамену',
    'prog.p4.p': 'За 6 недель полностью осваиваем формат: аудирование, чтение, письмо, речь — и тайм-менеджмент.',
    'prog.p4.l1': '8 пробных экзаменов в реальном формате',
    'prog.p4.l2': 'Индивидуальная подготовка к части Sprechen',
    'prog.p4.l3': 'Личный план работы над ошибками',
    'prog.p4.dur': '6 недель',

    'prog.p5.t': 'Пакет Ausbildung',
    'prog.p5.p': 'Язык + документы. Доводим до B1 и сопровождаем на этапах связи с работодателем в Германии, договора и визы.',
    'prog.p5.l1': 'Lebenslauf и мотивационное письмо',
    'prog.p5.l2': 'Подготовка и перевод документов',
    'prog.p5.l3': 'Подготовка к собеседованию (Vorstellungsgespräch)',
    'prog.p5.dur': 'Личный график',

    'path.kick': 'После языка',
    'path.h': 'Из Нукуса в Германию — 4 пути',
    'path.p': 'Язык — только первый шаг. Какой путь подходит именно вам, выберем вместе.',
    'path.w1.t': 'Ausbildung',
    'path.w1.p': 'Трёхлетнее профессиональное обучение в Германии. Во время учёбы получаете зарплату, после выпуска — трудоустройство.',
    'path.w1.r': 'Требование: B1',
    'path.w2.t': 'Studium',
    'path.w2.p': 'Учёба в государственных университетах. В большинстве из них нет платы за обучение — только семестровый взнос.',
    'path.w2.r': 'Требование: B2 / C1',
    'path.w3.t': 'Gastronomie · Pflege',
    'path.w3.p': 'Кулинария, гостиничное дело и медицинский уход — направления с самым высоким спросом на работников.',
    'path.w3.r': 'Требование: B1',
    'path.w4.t': 'FSJ · Au-Pair',
    'path.w4.p': 'Самый простой старт для молодёжи. Год социальной службы или проживание в семье.',
    'path.w4.r': 'Требование: A2 / B1',

    'reel.kick': 'Видео',
    'reel.h': 'О центре — за 30 секунд',
    'reel.s1': 'Центр немецкого языка · Нукус',
    'reel.s2': 'Весь путь — в одном центре',
    'reel.s3': 'Каждый урок — новые слова, новая возможность',
    'reel.s4': '4 500 км. Начинается с одного решения.',
    'reel.s5': 'Цель — не бумага, а реальный результат',
    'reel.s6k': 'Набор в группы открыт',
    'reel.s6h': 'Начните сегодня',
    'reel.ch1': 'Центр',
    'reel.ch2': 'Уровни',
    'reel.ch3': 'Слова',
    'reel.ch4': 'Путь',
    'reel.ch5': 'Сертификат',
    'reel.ch6': 'Старт',

    'res.kick': 'Результаты',
    'res.h': 'Что говорят наши ученики',
    'res.p': 'В разделе NÁTIYJELER в Instagram — сотни сертификатов и видеоотзывов.',
    'res.q1': 'Я начинала с нуля. Через 8 месяцев сдала ÖSD B1 с первой попытки. Главное отличие — здесь тебя заставляют говорить, а не зубрить.',
    'res.q1n': 'B1 · Ausbildung, Лейпциг',
    'res.q2': 'Самым сложным в документах было мотивационное письмо. Вместе с преподавателями переписали его 4 раза. Визу дали сразу.',
    'res.q2n': 'B1 · Gastronomie, Мюнхен',
    'res.q3': 'Я училась по программе «2+6» — заплатила только за 2 месяца и закончила полный курс. Занятий 4 раза в неделю, темп быстрый, но успеваешь.',
    'res.q3n': 'B1 · программа «2+6»',
    'res.q4': 'Больше всего мне помог Sprachclub. На уроке я боялась говорить, а в клубе разговорилась.',
    'res.q4n': 'A2 → B1',

    'tch.kick': 'Команда',
    'tch.h': 'Кто будет вас учить',
    'tch.p': 'Каждый преподаватель сертифицирован и сам прошёл этот путь.',
    'tch.t1r': 'Ведущий преподаватель · A1–B1',
    'tch.t1b': 'Сертификат C1. 6 лет опыта, 400+ выпускников. Специалист по произношению и речи.',
    'tch.t2r': 'Преподаватель · B2–C1, ÖSD',
    'tch.t2b': 'Учился в Германии 3 года. Работает с форматом экзамена и академическим языком.',
    'tch.t3r': 'Координатор Ausbildung',
    'tch.t3b': 'Документы, договор и этапы визы. Вывел в Германию 150+ учеников.',

    'pr.kick': 'Цены',
    'pr.h': 'Прозрачно и понятно',
    'pr.p': 'Никаких скрытых платежей. Материалы входят в стоимость.',
    'pr.mo': 'сум / месяц',
    'pr.g.badge': 'Государственная программа',
    'pr.g.t': 'Программа «2+6»',
    'pr.g.d': 'Из 8 месяцев курса вы платите только за 2',
    'pr.g.sub': 'сум — за весь курс',
    'pr.g.1': 'Оплата за 2 месяца — остальные 6 платит государство',
    'pr.g.2': 'Полный курс с нуля до B1',
    'pr.g.3': 'Та же программа, что и в офлайн-группе',
    'pr.g.4': 'Поможем оформить документы',
    'pr.g.5': 'Количество мест ограничено',
    'pr.b.t': 'Офлайн-группа',
    'pr.b.d': 'В центре, живое занятие',
    'pr.b.1': '4 занятия в неделю · 120 мин',
    'pr.b.2': '10–12 учеников в группе',
    'pr.b.3': 'Sprachclub — бесплатно',
    'pr.b.4': 'Печатные материалы',
    'pr.b.5': 'Контрольный тест каждые 2 недели',
    'pr.c.t': 'Пакет Ausbildung',
    'pr.c.d': 'Язык + документы + поддержка по визе',
    'pr.c.val': 'Индивидуально',
    'pr.c.sub': 'после консультации',
    'pr.c.1': 'Полное обучение до B1',
    'pr.c.2': 'Lebenslauf и мотивационное письмо',
    'pr.c.3': 'Связь с работодателем',
    'pr.c.4': 'Поддержка по визовым документам',
    'pr.c.5': 'Подготовка к собеседованию',


    'faq.kick': 'Вопросы',
    'faq.h': 'Частые вопросы',
    'faq.q1': 'Я начинаю совсем с нуля. Справлюсь ли я?',
    'faq.a1': 'Конечно. Большинство наших учеников начинали с нуля. Группа A1 создана именно для этого: на первом занятии — алфавит и произношение, на третьей неделе вы уже расскажете о себе. Предварительных знаний не требуется.',
    'faq.q2': 'Какой уровень нужен для выезда в Германию?',
    'faq.a2': 'В большинстве случаев B1. Для Ausbildung, рабочей визы и визы воссоединения семьи достаточно B1. Для поступления в университет требуется B2 или C1. В кулинарии и медицинском уходе тоже можно начинать с B1.',
    'faq.q3': 'За сколько времени я дойду до B1?',
    'faq.a3': 'С нуля — в среднем 8 месяцев: A1 → A2 → B1. Занятия 4 раза в неделю по 120 минут, поэтому темп быстрый. Государственная программа «2+6» рассчитана ровно на этот срок.',
    'faq.q4': 'Где я буду сдавать сертификат?',
    'faq.a4': 'Экзамены ÖSD и telc проводятся в Ташкенте и других центрах. Мы полностью готовим к экзамену и помогаем с регистрацией и поездкой.',
    'faq.q5': 'Что будет, если я пропущу занятия?',
    'faq.a5': 'Конспект и задания каждого урока загружаются в группу Telegram. Кроме того, с преподавателем можно договориться и отдельно разобрать пропущенную тему.',
    'faq.q6': 'Как производится оплата?',
    'faq.a6': 'Ежемесячно, до начала занятий. Click, Payme, наличными или банковской картой.',
    'faq.q7': 'Что такое государственная программа «2+6»?',
    'faq.a7': 'Это программа с государственной поддержкой. Из 8 месяцев курса немецкого языка вы оплачиваете только 2, остальные 6 оплачивает государство. Количество мест ограничено, поэтому записываться нужно заранее. С оформлением документов мы помогаем — оставьте заявку, и мы расскажем детали.',

    'ap.kick': 'Заявка',
    'ap.h': 'Запишитесь на бесплатное пробное занятие',
    'ap.p': 'Заполните форму — в течение 24 часов позвоним и предложим подходящую вам группу.',
    'ap.l1': 'Первое занятие — бесплатно',
    'ap.l2': 'Уровень определим мы',
    'ap.l3': 'Без обязательств',
    'ap.tg': 'Ответим быстрее',
    'ap.ig': 'Результаты и видео',
    'ap.f.name': 'Ваше имя *',
    'ap.f.namePh': 'Имя и фамилия',
    'ap.f.phone': 'Телефон *',
    'ap.f.level': 'Ваш текущий уровень',
    'ap.f.lv0': 'Начинаю с нуля',
    'ap.f.lvU': 'Не знаю — проверьте',
    'ap.f.goal': 'Ваша цель',
    'ap.g1': 'Ausbildung',
    'ap.g2': 'Studium',
    'ap.g3': 'Работа',
    'ap.g4': 'Для себя',
    'ap.f.time': 'Удобное время',
    'ap.t1': 'Утро',
    'ap.t2': 'День',
    'ap.t3': 'Вечер',
    'ap.f.note': 'Дополнительно (необязательно)',
    'ap.f.notePh': 'Есть вопрос?',
    'ap.f.submit': 'Отправить заявку',
    'ap.f.legal': 'Отправляя заявку, вы соглашаетесь на связь с вами. Ваши данные не передаются третьим лицам.',
    'ap.ok.h': 'Заявка принята',
    'ap.ok.p': 'Спасибо! Мы позвоним в течение 24 часов. Чтобы связаться быстрее — напишите в Telegram.',
    'ap.ok.tg': 'Написать в Telegram',
    'ap.ok.again': 'Отправить ещё одну заявку',

    'err.name': 'Укажите имя (минимум 2 буквы)',
    'err.phone': 'Введите корректный номер телефона',

    'ftr.nav': 'Разделы',
    'ftr.contact': 'Контакты',
    'ftr.addr': 'г. Нукус, 23-й микрорайон, 6',
    'ftr.hours': 'Пн–Пт 09:00–20:00 · Сб 09:00–15:00',
    'ftr.tag': 'Немецкий с нуля до C1. Нукус, Каракалпакстан.',
    'ftr.made': 'Сделано в Нукусе'
  };

  var DICT = { kaa: kaa, uz: uz, ru: ru };

  /* ═══════════════ ENGINE ═══════════════ */
  var current = DEFAULT_LANG;

  function t(key, lang) {
    var d = DICT[lang || current];
    if (d && Object.prototype.hasOwnProperty.call(d, key)) return d[key];
    if (DICT[DEFAULT_LANG] && Object.prototype.hasOwnProperty.call(DICT[DEFAULT_LANG], key)) {
      return DICT[DEFAULT_LANG][key];
    }
    return key;
  }

  function detect() {
    var saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* private mode */ }
    if (saved && DICT[saved]) return saved;

    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    nav = nav.toLowerCase();
    if (nav.indexOf('kaa') === 0) return 'kaa';
    if (nav.indexOf('uz') === 0) return 'uz';
    if (nav.indexOf('ru') === 0) return 'ru';
    return DEFAULT_LANG;
  }

  function apply(lang) {
    if (!DICT[lang]) lang = DEFAULT_LANG;
    current = lang;

    document.documentElement.lang = LANGS[lang].htmlLang;
    document.documentElement.setAttribute('data-lang', lang);

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'), lang);
      if (el.textContent !== v) el.textContent = v;
    });

    // Attributes — data-i18n-attr="placeholder:key" (comma separated for several)
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length === 2) el.setAttribute(bits[0].trim(), t(bits[1].trim(), lang));
      });
    });

    // Document meta
    document.title = t('meta.title', lang);
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('meta.desc', lang));

    // Switcher chrome
    var cur = document.getElementById('langCur');
    if (cur) cur.textContent = LANGS[lang].short;
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.getAttribute('data-set-lang') === lang));
    });

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* ignore */ }

    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: lang } }));
  }

  window.I18N = {
    t: t,
    apply: apply,
    detect: detect,
    get lang() { return current; },
    langs: LANGS,
    DEFAULT: DEFAULT_LANG
  };
})();
