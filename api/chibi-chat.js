import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SILENT_CRITICAL_QA_SYSTEM_ID = `Kamu adalah MAXI dalam mode SESI TANYA JAWAB interaktif dengan pengguna.
Di balik layar (SECARA DIAM-DIAM di dalam cara berpikirmu), kamu wajib menganalisis setiap jawaban, pernyataan, atau pertanyaan pengguna menggunakan 12 kerangka berpikir ini:
1. REALITY (fakta yang diketahui, belum diketahui, dan asumsi yang bermasalah)
2. PROBLEM (gejala vs akar masalah sebenarnya)
3. BIAS CHECK (FOMO, Fear, Ego, Confirmation bias, Sunk cost, Social pressure, Short-term dopamine)
4. OPTIONS (opsi-opsi realistis)
5. SECOND-ORDER EFFECTS (konsekuensi langsung, jangka menengah, jangka panjang)
6. RISK (downside, worst-case scenario, opportunity cost, risk of ruin, reversibility)
7. UPSIDE (potential benefit, leverage, compounding effect, skill/network/financial capital, optionality)
8. RED TEAM (serang ide/alasan pengguna, cari celah terkuat mengapa bisa gagal)
9. COUNTER-EVIDENCE (kondisi objektif yang bisa membantah kritik tersebut)
10. DECISION QUALITY (apakah proses keputusannya rasional berdasarkan informasi saat ini)
11. ACTION (langkah berikutnya, eksperimen kecil, batas risiko, indikator berhasil/berhenti, tanggal evaluasi)
12. FUTURE TRAJECTORY (dampak ke hidup, karier, uang, skill, network, reputation, optionality)

Prioritas domain (gunakan secara diam-diam sesuai konteks obrolan):
- Crypto/Web3: product, users, retention, revenue, token utility, token distribution, unlocks, liquidity, security, incentives, opportunity cost.
- Finansial: capital preservation, downside, liquidity, concentration risk, risk of ruin.
- Karier: skill capital, proof of work, reputation, network, ownership, optionality.
- Kehidupan: long-term trajectory, health, relationships, freedom, meaning, compounding.

ATURAN MUTLAK TAMPILAN TEXT BUBBLE (SANGAT PENTING):
- GUNAKAN SEMUA KERANGKA DI ATAS SECARA DIAM-DIAM!
- JANGAN PERNAH menampilkan daftar bernomor 1–12, jangan tulis judul seperti "REALITY:", "BIAS CHECK:", "RED TEAM:", dan jangan pernah menyebut kata "Critical Thinking" di output-mu.
- JANGAN membatasi pertanyaan dengan jawaban "Ya atau Tidak". Ini adalah SESI TANYA JAWAB terbuka!
- Peranmu bukan untuk menyenangkan, memuji, atau membenarkan pengguna. Jika asumsi pengguna bermasalah, katakan langsung dan jelaskan alasannya.
- Gunakan bahasa Indonesia yang langsung, kritis, jujur, tajam, mengalir alami dalam 2–3 kalimat padat (maksimal 220 karakter), tanpa tanda bintang markdown (**).`;

const SILENT_CRITICAL_QA_SYSTEM_EN = `You are MAXI in an interactive Q&A SESSION with the user.
Silently under the hood, you must analyze every user answer, statement, or question using this 12-part framework:
1. REALITY (known facts, unknowns, flawed assumptions)
2. PROBLEM (symptom vs root cause)
3. BIAS CHECK (FOMO, Fear, Ego, Confirmation bias, Sunk cost, Social pressure, Short-term dopamine)
4. OPTIONS (realistic options)
5. SECOND-ORDER EFFECTS (immediate, medium-term, long-term consequences)
6. RISK (downside, worst-case scenario, opportunity cost, risk of ruin, reversibility)
7. UPSIDE (potential benefit, leverage, compounding, skill/network/financial capital, optionality)
8. RED TEAM (attack weak assumptions, strongest failure case)
9. COUNTER-EVIDENCE (what objective evidence would refute the critique)
10. DECISION QUALITY (is the decision process rational given current info)
11. ACTION (next step, small experiment, risk cap, success/stop indicators, evaluation date)
12. FUTURE TRAJECTORY (impact on life, career, money, skill, network, reputation, optionality)

Domain priorities (apply silently based on context):
- Crypto/Web3: product, users, retention, revenue, token utility, token distribution, unlocks, liquidity, security, incentives, opportunity cost.
- Financial: capital preservation, downside, liquidity, concentration risk, risk of ruin.
- Career: skill capital, proof of work, reputation, network, ownership, optionality.
- Life: long-term trajectory, health, relationships, freedom, meaning, compounding.

STRICT SPEECH BUBBLE OUTPUT RULES:
- USE THIS ENTIRE FRAMEWORK SILENTLY UNDER THE HOOD!
- NEVER output numbered lists 1–12, NEVER print headers like "REALITY:", "BIAS CHECK:", "RED TEAM:", and NEVER mention "Critical Thinking" in your output.
- Do NOT ask Yes/No questions. Ask open-ended, probing questions for a real back-and-forth Q&A session!
- Do not flatter or validate the user. If their assumption is flawed, call it out directly and explain why.
- Keep your response to 2–3 razor-sharp sentences (max 220 characters), no markdown asterisks (**).`;

const OPENING_QA_PROBES_ID = [
  'Mulai sesi tanya jawab dengan menanyakan: keputusan atau rencana terbesar apa yang sedang ia pertimbangkan saat ini untuk karier, uang, atau masa depannya, dan apa asumsi utamanya?',
  'Mulai sesi tanya jawab dengan menanyakan: kebiasaan atau rutinitas apa yang paling banyak menyita waktunya minggu ini, dan apa bukti nyata bahwa itu membangun masa depannya?',
  'Mulai sesi tanya jawab dengan menanyakan: jika sumber pemasukan utamanya terhenti mendadak bulan depan, langkah konkret apa yang sudah ia siapkan agar terhindar dari kehancuran finansial?',
  'Mulai sesi tanya jawab dengan menanyakan: keahlian atau proof of work apa yang sedang ia bangun sekarang yang membuat dirinya sulit digantikan dalam 3 tahun ke depan?',
  'Mulai sesi tanya jawab dengan menanyakan: risiko terbesar apa yang sedang ia ambil dalam keuangan atau hidupnya saat ini, dan di titik mana ia akan memutuskan berhenti jika skenario terburuk terjadi?',
];

const OPENING_QA_PROBES_EN = [
  'Start the Q&A session by asking: what is the biggest decision or plan they are currently weighing for their career, finances, or future, and what is their main assumption behind it?',
  'Start the Q&A session by asking: what habit or activity consumed most of their time this week, and what real proof do they have that it compounds their future?',
  'Start the Q&A session by asking: if their primary income stopped next month, what concrete protection do they have in place to prevent financial ruin?',
  'Start the Q&A session by asking: what high-leverage skill or proof-of-work are they building right now that will make them hard to replace in 3 years?',
  'Start the Q&A session by asking: what is the biggest financial or life risk they are currently taking, and what is their exact stop-criteria if the worst case happens?',
];

function cleanBubbleText(rawText) {
  if (!rawText) return '';
  return String(rawText)
    .replace(/[*_`#~>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

function buildSilentQaFallback({ isId, mode, userInput, history, stepIndex }) {
  const depth = Array.isArray(history) ? history.length : 0;
  const textLower = String(userInput || '').toLowerCase();
  const isCrypto =
    /crypto|kripto|web3|token|coin|airdrop|node|testnet|btc|eth|sol|meme|defi|nft|listing|unlock/.test(
      textLower
    );
  const isFinance =
    /uang|dana|modal|invest|trading|saham|tabung|hutang|gaji|cicilan|keuangan|finansial|portofolio/.test(
      textLower
    );
  const isCareer =
    /kerja|karier|karir|resign|bisnis|usaha|skill|kuliah|kantor|freelance|project|pindah/.test(
      textLower
    );

  if (mode === 'reply' && userInput) {
    // Stage 3+: Deliver sharp synthesis + concrete action/experiment + open follow-up
    if (depth >= 3) {
      if (isId) {
        return {
          icon: '💡',
          category: 'Maxi • Kesimpulan & Solusi',
          text: isCrypto
            ? 'Asumsimu masih terlalu mengandalkan narasi tanpa pengaman downside. Solusi: batasi alokasi maksimal 5%, cek jadwal token unlock & retensi produk nyata selama 14 hari—apa indikator berhentimu jika likuiditas melemah?'
            : isFinance
              ? 'Masalah utamamu ada pada eksposur risiko yang belum dilindungi dana darurat. Solusi: kunci batas kerugian maksimal sekarang, amankan likuiditas 6 bulan, dan uji lewat eksperimen kecil 14 hari—siap mulai dari langkah mana malam ini?'
              : isCareer
                ? 'Kamu terjebak antara niat besar dan kurangnya proof of work terukur. Solusi: bangun 1 portofolio nyata dalam 14 hari tanpa mengorbankan kas utamamu—apa satu hasil konkret yang bisa kamu selesaikan minggu ini?'
                : 'Akar masalahmu adalah menukar kompaun jangka panjang dengan kenyamanan sesaat. Solusi: pangkas 1 penguras waktu utamamu malam ini dan kunci 90 menit setiap pagi untuk eksperimen prioritasmu—apa hambatan terbesarmu untuk memulainya besok?',
          resetCycle: true,
        };
      } else {
        return {
          icon: '💡',
          category: 'Maxi • Synthesis & Solution',
          text: isCrypto
            ? 'Your assumption leans too heavily on narrative without downside protection. Solution: cap exposure at 5%, audit token unlocks and organic retention for 14 days—what is your exact kill-switch if liquidity dries up?'
            : isFinance
              ? 'Your core issue is unhedged concentration risk. Solution: lock a strict downside cap today, secure 6 months of liquidity, and run a small 14-day experiment—which step will you execute tonight?'
              : isCareer
                ? 'You are caught between ambition and missing proof-of-work. Solution: ship 1 verifiable project in 14 days before taking an irreversible leap—what concrete deliverable can you finish this week?'
                : 'Your root problem is trading long-term compounding for short-term comfort. Solution: cut your biggest daily distraction tonight and lock 90 minutes each morning for high-leverage work—what is stopping you from starting tomorrow?',
          resetCycle: true,
        };
      }
    }

    // Stage 1 or 2 of Q&A: Challenge assumptions / biases silently & probe deeper with an open question
    if (isId) {
      if (isCrypto) {
        return {
          icon: '🔍',
          category: 'Maxi • Sesi Tanya Jawab',
          text:
            depth === 1
              ? 'Jangan cuma lihat keramaian komunitas atau FOMO. Apa bukti nyata bahwa produk itu punya pengguna organik, pendapatan riil, dan siapa yang akan terdampak saat token unlock terjadi?'
              : 'Jika skenario terburuk terjadi—misalnya likuiditas kering atau insentif berhenti—berapa batas kerugian maksimal yang sanggup kamu tanggung tanpa merusak keuangan utamamu?',
          resetCycle: false,
        };
      }
      if (isFinance) {
        return {
          icon: '🔍',
          category: 'Maxi • Sesi Tanya Jawab',
          text:
            depth === 1
              ? 'Keputusan finansial yang mengejar hasil cepat sering mengabaikan risk of ruin. Jika skenario terburuk terjadi bulan depan, berapa lama cadangan kas likuidmu bisa bertahan?'
              : 'Apa biaya peluang (opportunity cost) terbesar yang kamu korbankan dengan mengunci uang dan fokusmu di keputusan ini dibanding membangun aset yang lebih terukur?',
          resetCycle: false,
        };
      }
      if (isCareer) {
        return {
          icon: '🔍',
          category: 'Maxi • Sesi Tanya Jawab',
          text:
            depth === 1
              ? 'Keinginan pindah atau berkembang itu wajar, tapi jangan tertipu bias konfirmasi. Bukti karya nyata (proof of work) apa yang sudah kamu miliki hari ini di luar sekadar rencana?'
              : 'Jika langkah karier ini gagal dalam 6 bulan ke depan, apakah keputusannya mudah dibalikkan (reversible), dan eksperimen kecil apa yang bisa kamu uji dalam 14 hari tanpa risiko besar?',
          resetCycle: false,
        };
      }
      return {
        icon: '🔍',
        category: 'Maxi • Sesi Tanya Jawab',
        text:
          depth === 1
            ? 'Jawabanmu menunjukkan kamu sadar ada yang perlu dibenahi, tapi masih ada asumsi yang belum teruji. Apa akar masalah sebenarnya—kurangnya informasi, rasa takut, atau godaan dopamin jangka pendek?'
            : 'Jika kita serang rencanamu dari sisi terlemahnya, apa alasan paling masuk akal mengapa langkahmu saat ini bisa gagal dalam 6 bulan ke depan?',
        resetCycle: false,
      };
    } else {
      if (isCrypto) {
        return {
          icon: '🔍',
          category: 'Maxi • Q&A Session',
          text:
            depth === 1
              ? 'Look past community hype and FOMO. What objective proof do you have of real user retention, revenue, and how token unlocks will impact liquidity?'
              : 'If the worst-case hits—liquidity dries up or incentives vanish—what is your exact downside cap so you avoid risk of ruin?',
          resetCycle: false,
        };
      }
      return {
        icon: '🔍',
        category: 'Maxi • Q&A Session',
        text:
          depth === 1
            ? 'Your answer shows awareness, yet relies on untested assumptions. What is the real root cause holding you back—missing facts, fear, or short-term dopamine?'
            : 'If we Red Team your current plan, what is the single strongest reason it could fail over the next 6 months, and how are you capping that downside?',
        resetCycle: false,
      };
    }
  }

  // mode === 'question': Open-ended Q&A starter questions
  const initialId = [
    'Keputusan atau rencana terbesar apa yang sedang kamu pikirkan saat ini untuk hidup, karier, atau keuanganmu, dan apa alasan utamamu memilih jalan itu?',
    'Kebiasaan apa yang paling banyak menyita waktumu minggu ini, dan bagaimana kamu tahu itu benar-benar membangun masa depanmu—bukan sekadar dopamin sesaat?',
    'Jika sumber pemasukan atau rencana utamamu berhenti mendadak bulan depan, langkah perlindungan apa yang sudah kamu punya hari ini?',
    'Keahlian atau bukti karya nyata (proof of work) apa yang sedang kamu bangun sekarang agar posisimu sulit digantikan dalam 3 tahun ke depan?',
    'Risiko terbesar apa yang sedang kamu ambil saat ini, dan apa indikator tegas yang akan membuatmu berhenti jika asumsi awalmu ternyata salah?',
  ];
  const initialEn = [
    'What is the biggest decision or plan on your mind right now for your life, career, or finances, and what is your core assumption behind it?',
    'What habit consumed most of your time this week, and how do you know it compounds your future rather than just feeding short-term dopamine?',
    'If your main income or primary plan stopped suddenly next month, what downside protection do you have ready today?',
    'What high-leverage skill or proof-of-work are you building right now so you are hard to replace 3 years from now?',
    'What is the biggest risk you are currently taking, and what clear indicator would tell you to stop if your initial assumption is wrong?',
  ];

  const pool = isId ? initialId : initialEn;
  return {
    icon: '💬',
    category: isId ? 'Maxi • Sesi Tanya Jawab' : 'Maxi • Q&A Session',
    text: pool[stepIndex % pool.length],
    resetCycle: false,
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const lang = body.lang === 'en' ? 'en' : 'id';
  const isId = lang === 'id';
  const mode = body.mode === 'reply' ? 'reply' : 'question';
  const userInput = String(body.userInput || body.answer || '').trim().slice(0, 500);
  const lastQuestion = String(body.lastQuestion || '').trim().slice(0, 300);
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
  const stepIndex = Number(body.stepIndex) || 0;
  const depth = history.length;

  const historyDigest = history
    .map(
      (item, idx) =>
        `#${idx + 1} Maxi: "${String(item.question || '').slice(0, 110)}" -> User: "${String(item.answer || '').slice(0, 140)}"${item.conclusion ? ` -> Respons Maxi: "${String(item.conclusion).slice(0, 110)}"` : ''}`
    )
    .join(' | ');

  const systemInstruction = isId
    ? SILENT_CRITICAL_QA_SYSTEM_ID
    : SILENT_CRITICAL_QA_SYSTEM_EN;

  let contents = '';
  let resetCycle = false;
  let badgeIcon = '💬';
  let badgeCategory = isId ? 'Maxi • Sesi Tanya Jawab' : 'Maxi • Q&A Session';

  if (mode === 'reply' && userInput) {
    if (depth >= 3) {
      resetCycle = true;
      badgeIcon = '💡';
      badgeCategory = isId ? 'Maxi • Kesimpulan & Solusi' : 'Maxi • Synthesis & Solution';
      contents = isId
        ? `Riwayat Sesi Tanya Jawab: [${historyDigest}].
Pertanyaan/Pernyataan Maxi sebelumnya: "${lastQuestion}".
Jawaban/Pertanyaan terbaru dari pengguna: "${userInput}".

Gunakan seluruh kerangka berpikir kritis secara DIAM-DIAM (Reality, Problem, Bias Check, Second-Order Effects, Risk/Downside, Red Team, Decision Quality, Action, Future Trajectory) untuk:
1) Menyimpulkan secara jujur dan tajam akar masalah atau asumsi yang keliru dari jawaban pengguna,
2) Memberikan SOLUSI KONKRET (langkah berikutnya, eksperimen kecil terukur, dan batas risiko/downside), lalu
3) Tutup dengan 1 pertanyaan terbuka singkat untuk memastikan komitmen eksekusinya.
JANGAN tampilkan judul kerangka (seperti REALITY/ACTION) dan jangan buat pertanyaan Ya/Tidak. Maksimal 220 karakter.`
        : `Q&A Session History: [${historyDigest}].
Maxi's previous message: "${lastQuestion}".
User's latest reply/question: "${userInput}".

Use your critical thinking framework SILENTLY (Reality, Problem, Bias Check, Second-Order Effects, Risk/Downside, Red Team, Decision Quality, Action, Future Trajectory) to:
1) Candidly synthesize the root problem or flawed assumption in the user's responses,
2) Provide a CONCRETE SOLUTION (next step, bounded small experiment, and downside limit), and
3) Close with 1 short open-ended question to test their execution commitment.
Do NOT print framework headers and do NOT ask a Yes/No question. Max 220 characters.`;
    } else {
      badgeIcon = '🔍';
      badgeCategory = isId ? 'Maxi • Sesi Tanya Jawab' : 'Maxi • Q&A Session';
      contents = isId
        ? `${historyDigest ? `Riwayat obrolan sebelumnya: [${historyDigest}]. ` : ''}Pertanyaanmu sebelumnya: "${lastQuestion}".
Pengguna menjawab / bertanya: "${userInput}".

Gunakan kerangka berpikirmu SECARA DIAM-DIAM (bedah fakta vs asumsi, cek bias FOMO/Fear/Ego/Confirmation Bias/Sunk Cost/Dopamine, uji Second-Order Effects, Risk of Ruin, dan serang celah ide lewat Red Team):
1) Berikan tanggapan kritis, langsung, dan jujur atas jawaban/pertanyaan pengguna (1 kalimat tajam), lalu
2) Ajukan 1 PERTANYAAN TERBUKA (bukan pertanyaan Ya/Tidak, melainkan pertanyaan "apa / mengapa / bagaimana / berapa") untuk mengulik lebih dalam akar masalah, batas risiko, atau bukti nyatanya!
JANGAN tampilkan label kerangka sama sekali. Maksimal 210 karakter.`
        : `${historyDigest ? `Previous chat history: [${historyDigest}]. ` : ''}Your previous question: "${lastQuestion}".
User answered / asked: "${userInput}".

Use your framework SILENTLY (reality vs assumptions, Bias Check: FOMO/Fear/Ego/Confirmation Bias/Sunk Cost/Dopamine, Second-Order Effects, Risk of Ruin, Red Team):
1) Give a direct, honest critical response to what the user said (1 sharp sentence), then
2) Ask 1 OPEN-ENDED FOLLOW-UP QUESTION (NOT a Yes/No question—use "what / how / why") to probe deeper into their root cause, downside cap, or proof-of-work!
Do NOT print framework labels. Max 210 characters.`;
    }
  } else {
    const pool = isId ? OPENING_QA_PROBES_ID : OPENING_QA_PROBES_EN;
    const chosenProbe = pool[stepIndex % pool.length];
    badgeIcon = '💬';
    badgeCategory = isId ? 'Maxi • Sesi Tanya Jawab' : 'Maxi • Q&A Session';
    contents = `${chosenProbe} ${
      lastQuestion
        ? isId
          ? `Jangan ulangi kalimat ini: "${lastQuestion}". Buat 1 pertanyaan terbuka yang tajam (maksimal 165 karakter, bukan pertanyaan Ya/Tidak, tanpa label kerangka).`
          : `Do not repeat: "${lastQuestion}". Ask 1 sharp open-ended question (max 165 characters, NOT a Yes/No question, no framework labels).`
        : isId
          ? 'Buat 1 pertanyaan terbuka yang tajam (maksimal 165 karakter, bukan pertanyaan Ya/Tidak, tanpa label kerangka).'
          : 'Ask 1 sharp open-ended question (max 165 characters, NOT a Yes/No question, no framework labels).'
    }`;
  }

  try {
    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.8,
          maxOutputTokens: 130,
        },
      });
      responseText = cleanBubbleText(response.text);
    } catch {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents,
        config: {
          systemInstruction,
          temperature: 0.8,
          maxOutputTokens: 130,
        },
      });
      responseText = cleanBubbleText(fallbackResponse.text);
    }

    if (!responseText) {
      throw new Error('Empty model output');
    }

    return res.status(200).json({
      text: responseText,
      icon: badgeIcon,
      category: badgeCategory,
      resetCycle,
    });
  } catch {
    const fallback = buildSilentQaFallback({
      isId,
      mode,
      userInput,
      history,
      stepIndex,
    });
    return res.status(200).json(fallback);
  }
}
