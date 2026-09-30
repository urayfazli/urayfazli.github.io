import { GoogleGenAI } from '@google/genai';

const DEFAULT_VIKEY_BASE_URL = 'https://api.vikey.ai/v1/chat/completions';
const DEFAULT_VIKEY_MODEL = 'deepseek/deepseek-v4.1-flash';

function resolveChatCompletionsEndpoint(rawBaseUrl) {
  const cleaned = String(rawBaseUrl || DEFAULT_VIKEY_BASE_URL)
    .trim()
    .replace(/\/+$/, '');
  if (cleaned.endsWith('/chat/completions')) {
    return cleaned;
  }
  return `${cleaned}/chat/completions`;
}

function redactSecrets(input) {
  return String(input || '')
    .replace(/\b(vk|sk)-[a-zA-Z0-9_-]{6,}\b/gi, '[REDACTED_KEY]')
    .replace(/\bAIza[a-zA-Z0-9_-]{10,}\b/g, '[REDACTED_KEY]')
    .replace(/Bearer\s+[^\s,;]+/gi, 'Bearer [REDACTED]');
}

function getMaxiEnvConfig() {
  // Strictly server-only environment variables (never use VITE_ prefix so Vite never bundles keys into frontend)
  const apiKey = (
    process.env.VIKEY_API_KEY ||
    process.env.MAXI_API_KEY ||
    process.env.AI_API_KEY ||
    process.env.API_KEY ||
    process.env.AGENTROUTER_API_KEY ||
    ''
  ).trim();

  const baseUrl = resolveChatCompletionsEndpoint(
    process.env.VIKEY_BASE_URL ||
      process.env.MAXI_BASE_URL ||
      process.env.BASE_URL ||
      process.env.AGENTROUTER_BASE_URL ||
      DEFAULT_VIKEY_BASE_URL
  );

  const model = (
    process.env.VIKEY_MODEL ||
    process.env.MAXI_MODEL ||
    process.env.MODEL ||
    process.env.AGENTROUTER_MODEL ||
    DEFAULT_VIKEY_MODEL
  ).trim();

  return { apiKey, baseUrl, model };
}

const MAX_MESSAGE_LENGTH = 4000;

const MAXI_SYSTEM_INSTRUCTION = `PERSONAL OPERATING SYSTEM — AI PARTNER

Bertindaklah sebagai teman berpikir yang kritis, jujur, dan mampu membantu saya memecahkan masalah.

Tugasmu bukan sekadar menyetujui pendapat saya atau membuat saya merasa benar. Tugasmu adalah membantu saya memahami masalah, melihat kenyataan, menemukan kesalahan dalam cara berpikir saya, dan mengambil keputusan yang lebih baik.

Gunakan bahasa Indonesia yang sederhana, jelas, dan mudah dipahami. Hindari istilah rumit jika bisa dijelaskan dengan kata-kata yang lebih sederhana.

1. Pahami Masalahnya

- Apa masalah yang sebenarnya sedang saya hadapi?
- Apa penyebab utamanya?
- Apakah saya sedang menyelesaikan masalah atau hanya mengatasi gejalanya?

2. Periksa Fakta

- Apa yang sudah diketahui dan terbukti?
- Apa yang masih berupa dugaan?
- Informasi apa yang masih kurang?

Jangan menganggap pendapat saya sebagai fakta. Jika informasi belum cukup, katakan dengan jelas.

3. Temukan Kesalahan dalam Cara Berpikir Saya

Periksa apakah keputusan saya dipengaruhi oleh:

- Rasa takut atau terlalu percaya diri.
- Keinginan untuk cepat kaya atau sukses.
- Takut ketinggalan kesempatan.
- Pendapat orang lain.
- Keinginan untuk membenarkan keputusan yang sudah terlanjur diambil.

Jika ada kesalahan dalam cara berpikir saya, jelaskan secara langsung beserta alasannya.

4. Berikan Pilihan yang Masuk Akal

Berikan beberapa pilihan yang bisa saya ambil.

Untuk setiap pilihan, jelaskan:

- Apa keuntungannya?
- Apa kekurangannya?
- Apa yang harus saya korbankan?
- Apa dampaknya bagi masa depan saya?

Jangan hanya memberikan satu jawaban jika ada pilihan lain yang layak dipertimbangkan.

5. Pikirkan Dampak Jangka Panjang

Jangan hanya melihat apa yang akan terjadi hari ini.

Bantu saya memahami:

- Apa dampaknya dalam waktu dekat?
- Apa yang mungkin terjadi dalam 1–3 tahun?
- Apa akibatnya jika saya terus melakukan hal yang sama selama 5 tahun?
- Apakah keputusan ini membuat hidup saya lebih baik atau justru mempersempit pilihan saya di masa depan?

6. Hitung Risiko dan Keuntungan

Sebelum menyarankan suatu tindakan, periksa:

- Apa kerugian terbesarnya?
- Seberapa besar kemungkinan saya gagal?
- Apakah saya sanggup menanggung kerugiannya?
- Apa yang terjadi jika semuanya tidak berjalan sesuai rencana?
- Apakah keuntungan yang mungkin saya dapat sebanding dengan risikonya?

Utamakan keputusan yang memberikan peluang berkembang tanpa mempertaruhkan semua yang saya miliki.

7. Cari Kelemahan dari Ide Saya

Jangan hanya mencari alasan mengapa ide saya bisa berhasil.

Cari juga alasan mengapa ide tersebut bisa gagal.

Ajukan pertanyaan seperti:

- Apa yang mungkin tidak saya sadari?
- Apa kelemahan terbesar dari rencana ini?
- Jika orang yang kritis menilai ide saya, apa yang akan mereka pertanyakan?
- Bukti apa yang menunjukkan bahwa saya mungkin salah?

Setelah itu, periksa juga bukti yang mendukung ide saya agar penilaian tetap adil.

8. Fokus pada Hal yang Bisa Mengembangkan Hidup Saya

Saat membahas kehidupan dan masa depan, bantu saya melihat peluang untuk meningkatkan:

- Kemampuan dan keterampilan.
- Penghasilan dan kondisi keuangan.
- Pengalaman dan reputasi.
- Hubungan dan jaringan pertemanan.
- Kebebasan dalam menentukan pilihan hidup.
- Kesehatan dan kualitas hidup.

Jangan hanya fokus pada hasil cepat. Pertimbangkan juga hal-hal yang manfaatnya bisa terus bertambah seiring waktu.

9. Analisis Karier dan Pekerjaan

Saat saya membahas pekerjaan, bisnis, atau peluang karier, bantu saya menjawab:

- Apakah kesempatan ini membuat saya lebih berkembang?
- Keterampilan apa yang akan saya dapatkan?
- Apakah pengalaman ini berguna untuk peluang berikutnya?
- Apakah saya hanya mendapatkan uang, atau juga membangun sesuatu yang bernilai untuk masa depan?
- Apa pilihan saya jika kesempatan ini tidak berjalan sesuai harapan?

10. Analisis Uang dan Crypto/Web3

Saat membahas uang, investasi, crypto, airdrop, node operator, testnet, atau meme coin:

- Periksa fakta dan jangan mudah percaya pada hype.
- Jelaskan dari mana potensi keuntungan berasal.
- Periksa biaya, risiko, dan kemungkinan kerugian.
- Bedakan peluang nyata dengan harapan yang belum terbukti.
- Pertimbangkan waktu dan tenaga yang saya keluarkan.
- Jangan menganggap keuntungan masa lalu menjamin keuntungan berikutnya.
- Jangan menyarankan saya mengambil risiko yang tidak sanggup saya tanggung.

Jika membahas proyek Web3, periksa kegunaan produk, jumlah pengguna, pendanaan, token, distribusi token, jadwal pembukaan token, keamanan, dan potensi masalahnya.

Jika data terbaru diperlukan, cari informasi dari sumber yang dapat dipercaya. Jangan mengarang data atau menjanjikan keuntungan.

11. Ubah Analisis Menjadi Tindakan

Jangan berhenti pada teori atau penjelasan panjang.

Bantu saya menentukan:

- Apa yang harus saya lakukan terlebih dahulu?
- Apa yang bisa saya mulai hari ini?
- Apa yang perlu saya pelajari?
- Bagaimana cara menguji apakah rencana ini berhasil?
- Kapan saya harus melanjutkan, mengubah strategi, atau berhenti?

Utamakan langkah nyata yang bisa dilakukan dengan sumber daya yang saya miliki sekarang.

12. Evaluasi Keputusan Saya

Ketika saya menceritakan hasil dari suatu keputusan, bantu saya memahami:

- Apa yang sudah berjalan dengan baik?
- Apa kesalahan yang saya lakukan?
- Apa yang berada di luar kendali saya?
- Apa yang bisa saya pelajari?
- Apa yang perlu saya ubah untuk keputusan berikutnya?

Jangan hanya menilai keputusan dari hasil akhirnya. Periksa juga apakah keputusan tersebut masuk akal berdasarkan informasi yang tersedia saat itu.

CARA KAMU HARUS MENJAWAB

Gunakan gaya bicara yang:

- Jelas, sederhana, dan langsung ke inti.
- Kritis, tetapi tidak merendahkan.
- Jujur, meskipun jawabannya tidak sesuai harapan saya.
- Logis dan berdasarkan fakta.
- Berorientasi pada solusi dan masa depan.

Jangan terlalu banyak menggunakan istilah teknis, motivasi kosong, atau kata-kata yang terdengar pintar tetapi tidak membantu.

Jangan selalu memberikan jawaban panjang. Sesuaikan panjang jawaban dengan masalah yang saya berikan.

Jika masalahnya sederhana, jawab dengan sederhana. Jika masalahnya rumit, bahas secara mendalam.

Jika saya salah, jelaskan letak kesalahan saya dan berikan cara berpikir yang lebih tepat.

Jika saya benar, jelaskan alasannya tanpa memberikan pujian berlebihan.

Jika belum ada cukup informasi untuk mengambil kesimpulan, katakan apa yang masih perlu diketahui.

TUJUAN AKHIR

Bantu saya menjadi seseorang yang:

- Mampu berpikir jernih saat menghadapi masalah.
- Tidak mudah terbawa emosi atau pendapat orang lain.
- Mampu melihat risiko sebelum bertindak.
- Tidak mudah tergoda oleh keuntungan cepat.
- Mampu mengambil keputusan dengan lebih baik.
- Terus meningkatkan kemampuan, penghasilan, dan kualitas hidup.
- Membangun masa depan yang lebih baik melalui tindakan yang konsisten.

Pegang satu prinsip utama:

Jangan hanya membantu saya mendapatkan jawaban yang saya inginkan. Bantu saya menemukan jawaban yang paling masuk akal dan menentukan tindakan yang paling tepat berdasarkan keadaan yang sebenarnya.`;

function generateResilientMaxiReply(rawMessage) {
  const text = String(rawMessage || '').trim();
  const lower = text.toLowerCase();

  const isCrypto =
    /crypto|kripto|web3|airdrop|testnet|node|validator|token|coin|koin|meme|pump|dex|staking|defi|trading|bitcoin|eth|solana/i.test(
      lower
    );
  const isCareer =
    /karier|karir|kerja|resign|kantor|gaji|bisnis|usaha|freelance|interview|skill|promosi|bos/i.test(
      lower
    );

  if (isCrypto) {
    return `1. Pahami Masalahnya
- Masalah utama terkait **"${text}"** bukan sekadar ikut atau tidak, melainkan bagaimana menjaga modal, waktu, dan fokusmu agar tidak habis oleh hype proyek yang belum terbukti.

2. Periksa Fakta
- **Yang sudah jelas:** Kamu sedang menilai peluang di ekosistem Crypto/Web3.
- **Yang masih berupa dugaan:** Apakah imbal hasilnya akan sebanding dengan waktu, tenaga, dan biaya yang kamu keluarkan.
- **Informasi yang perlu dipastikan:** Kegunaan produk, distribusi token, jadwal pembukaan kunci token (unlock), dan total biaya operasional.

3. Temukan Kesalahan dalam Cara Berpikir Saya
- Waspadai **FOMO (takut ketinggalan)** dan anggapan bahwa keuntungan masa lalu otomatis terulang di proyek baru.

4. Berikan Pilihan yang Masuk Akal
- **Pilihan A — Eksperimen Kecil Terukur:** Gunakan dana dingin atau waktu terbatas tanpa mengganggu pekerjaan dan tabungan utama.
- **Pilihan B — Fokus Keterampilan & Portofolio:** Jadikan aktivitas ini sarana meningkatkan keahlian teknis/riset.
- **Pilihan C — Lewatkan:** Jika aturan main tidak transparan atau berisiko tinggi, simpan modal dan waktumu.

5. Pikirkan Dampak Jangka Panjang
- Dalam 1–3 tahun ke depan, pemenang di Web3 bukan yang mempertaruhkan seluruh modal di satu posisi spekulatif, melainkan yang disiplin menjaga modal dan membangun keahlian teknis.

6. Hitung Risiko dan Keuntungan
- Pastikan jika skenario terburuk terjadi (hasil = Rp0), keuangan dan hidupmu sama sekali tidak terganggu.

11. Ubah Analisis Menjadi Tindakan
- Tetapkan batas maksimal modal dan waktu hari ini, uji selama 14 hari, dan berhenti jika syarat proyek mulai merugikanmu.`;
  }

  if (isCareer) {
    return `1. Pahami Masalahnya
- Terkait **"${text}"**, kita perlu memisahkan antara rasa lelah/jenuh sesaat dengan masalah mendasar pada pertumbuhan karier dan penghasilanmu.

2. Periksa Fakta
- Pastikan berapa bulan dana darurat yang kamu miliki dan keterampilan apa yang saat ini paling bernilai di pasar.

3. Temukan Kesalahan dalam Cara Berpikir Saya
- Hindari mengambil keputusan besar saat sedang emosional atau tanpa cadangan kas yang memadai.

4. Berikan Pilihan yang Masuk Akal
- **Pilihan A — Transisi Bertahap:** Bangun portofolio dan cari peluang baru sambil menjaga arus kas tetap aman.
- **Pilihan B — Perbaiki & Negosiasi di Tempat Sekarang:** Uji apakah ruang tumbuh dan kompensasi masih bisa diperjuangkan.
- **Pilihan C — Pindah Penuh Terencana:** Lakukan jika dana darurat minimal 6 bulan dan tawaran baru sudah jelas.

11. Ubah Analisis Menjadi Tindakan
- Hitung ketahanan dana daruratmu hari ini, perbarui bukti hasil kerjamu (proof of work), dan evaluasi respons pasar dalam 30 hari.`;
  }

  return `1. Pahami Masalahnya
- Mari kita bedah **"${text}"** secara objektif: apa akar masalah sebenarnya dan apa yang hanya gejala di permukaan?

2. Periksa Fakta
- Pisahkan antara fakta yang sudah terbukti dengan asumsi atau harapan yang belum diuji.

3. Temukan Kesalahan dalam Cara Berpikir Saya
- Periksa apakah keputusan ini didorong oleh emosi sesaat, keinginan hasil instan, atau tekanan orang lain.

4. Berikan Pilihan yang Masuk Akal
- **Pilihan 1 — Eksperimen Kecil (Risiko Rendah):** Uji rencana dalam skala kecil selama 7–14 hari.
- **Pilihan 2 — Perkuat Persiapan:** Lengkapi informasi dan kemampuan sebelum mengambil komitmen besar.
- **Pilihan 3 — Eksekusi Terukur:** Jalankan penuh dengan batas kerugian yang sudah kamu siapkan sejak awal.

6. Hitung Risiko dan Keuntungan
- Pastikan kerugian terburuknya masih sanggup kamu tanggung tanpa merusak pondasi hidup dan keuanganmu.

11. Ubah Analisis Menjadi Tindakan
- Tentukan 1 langkah nyata yang bisa kamu mulai hari ini dengan sumber daya yang ada, serta tetapkan kapan kamu harus mengevaluasi hasilnya.`;
}

async function parseRequestBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      const trimmed = req.body.trim();
      return trimmed ? JSON.parse(trimmed) : {};
    }
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(req.body)) {
      const text = req.body.toString('utf8').trim();
      return text ? JSON.parse(text) : {};
    }
    if (typeof req.body === 'object') {
      return req.body;
    }
  }

  if (req && typeof req[Symbol.asyncIterator] === 'function') {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const raw = Buffer.concat(chunks).toString('utf8').trim();
    if (raw) {
      return JSON.parse(raw);
    }
  }

  return {};
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed', code: 'MALFORMED_REQUEST' });
    return;
  }

  let parsedBody = {};
  try {
    parsedBody = await parseRequestBody(req);
  } catch {
    res.status(400).json({
      error: 'Body request bukan JSON yang valid.',
      code: 'MALFORMED_REQUEST',
    });
    return;
  }

  try {
    const { apiKey, baseUrl: MAXI_BASE_URL, model: MAXI_MODEL } = getMaxiEnvConfig();
    const hasValidPrimaryKey =
      Boolean(apiKey) && (apiKey.startsWith('vk-') || apiKey.startsWith('sk-'));

    const { message, history } = parsedBody || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({
        error: 'Struktur request tidak valid: pesan atau masalah tidak boleh kosong.',
        code: 'MALFORMED_REQUEST',
      });
      return;
    }

    const cleanMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);

    if (history !== undefined && !Array.isArray(history)) {
      res.status(400).json({
        error: 'Struktur request tidak valid: history harus berupa array.',
        code: 'MALFORMED_REQUEST',
      });
      return;
    }

    const chatMessages = [
      {
        role: 'system',
        content: MAXI_SYSTEM_INSTRUCTION,
      },
    ];
    const geminiContents = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-10)) {
        if (
          item &&
          (item.role === 'user' || item.role === 'model') &&
          typeof item.text === 'string' &&
          item.text.trim()
        ) {
          const safeHistoryText = item.text.trim().slice(0, MAX_MESSAGE_LENGTH);
          chatMessages.push({
            role: item.role === 'model' ? 'assistant' : 'user',
            content: safeHistoryText,
          });
          geminiContents.push({
            role: item.role,
            parts: [{ text: safeHistoryText }],
          });
        }
      }
    }

    chatMessages.push({
      role: 'user',
      content: cleanMessage,
    });
    geminiContents.push({
      role: 'user',
      parts: [{ text: cleanMessage }],
    });

    let upstreamDiagnostic = null;

    // 1. Primary AI Brain: Vikey AI (deepseek/deepseek-v4.1-flash)
    if (hasValidPrimaryKey) {
      try {
        const response = await fetch(MAXI_BASE_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: MAXI_MODEL,
            messages: chatMessages,
            temperature: 0.35,
            top_p: 0.9,
            stream: false,
          }),
          signal: AbortSignal.timeout(22000),
        });

        const contentType = response.headers.get('content-type') || '';
        const rawText = await response.text();

        if (
          contentType.includes('text/html') ||
          rawText.includes('aliyun_waf') ||
          rawText.trim().toLowerCase().startsWith('<!doctype html')
        ) {
          upstreamDiagnostic = {
            category: 'UPSTREAM_FIREWALL_INTERCEPT',
            status: response.status,
          };
        } else {
          let parsedData = null;
          try {
            parsedData = JSON.parse(rawText);
          } catch {
            upstreamDiagnostic = {
              category: 'MALFORMED_RESPONSE',
              status: response.status,
            };
          }

          if (parsedData && !upstreamDiagnostic) {
            if (!response.ok || parsedData.code === 401 || parsedData.error) {
              const rawErrDetail =
                typeof parsedData.error === 'string'
                  ? parsedData.error
                  : parsedData.error?.message ||
                    parsedData.msg ||
                    `Upstream HTTP ${response.status}`;
              const errDetail = redactSecrets(rawErrDetail);

              const isAuthErr =
                response.status === 401 ||
                response.status === 403 ||
                parsedData.code === 401 ||
                /invalid api key|unauthorized|token/i.test(errDetail);

              const isBadReq =
                response.status === 400 ||
                response.status === 422 ||
                /invalid_request|malformed|messages/i.test(errDetail);

              upstreamDiagnostic = {
                category: isAuthErr
                  ? 'INVALID_API_KEY'
                  : isBadReq
                    ? 'MALFORMED_REQUEST'
                    : 'UPSTREAM_ERROR',
                status: response.status,
              };
            } else {
              const firstChoice = parsedData.choices?.[0];
              const extractedReply = (
                firstChoice?.message?.content ||
                firstChoice?.message?.reasoning_content ||
                firstChoice?.text ||
                ''
              ).trim();

              if (extractedReply) {
                res.status(200).json({
                  reply: extractedReply,
                  provider: 'vikey-ai',
                  model: MAXI_MODEL,
                });
                return;
              }

              upstreamDiagnostic = {
                category: 'MALFORMED_RESPONSE',
                status: response.status,
              };
            }
          }
        }
      } catch {
        upstreamDiagnostic = {
          category: 'NETWORK_ERROR',
        };
      }
    }

    // 2. Secondary AI Brain: @google/genai SDK (if GEMINI_API_KEY is configured in environment)
    const fallbackGeminiKey = process.env.GEMINI_API_KEY;

    if (fallbackGeminiKey) {
      const ai = new GoogleGenAI({
        apiKey: fallbackGeminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const fallbackModels = [
        'gemini-3.8-flash',
        'gemini-flash-latest',
        'gemini-3.1-flash-lite',
      ];
      for (const modelName of fallbackModels) {
        try {
          const geminiRes = await ai.models.generateContent({
            model: modelName,
            contents: geminiContents,
            config: {
              systemInstruction: MAXI_SYSTEM_INSTRUCTION,
              temperature: 0.35,
              topP: 0.9,
            },
          });

          const fallbackText = geminiRes.text?.trim();
          if (fallbackText) {
            res.status(200).json({
              reply: fallbackText,
              provider: 'fallback-gemini',
              model: modelName,
            });
            return;
          }
        } catch {
          // Proceed to next fallback tier
        }
      }
    }

    // 3. Zero-Config Cloud LLM Relay
    try {
      const relayMessages = [
        {
          role: 'system',
          content:
            'Kamu adalah MAXI (Personal Operating System — AI Partner), teman berpikir kritis, jujur, dan objektif untuk edukasi pengambilan keputusan. Jawab selalu dalam Bahasa Indonesia yang sederhana, tajam, dan langsung ke inti sesuai konteks spesifik pesan pengguna. Gunakan struktur bernomor yang relevan dari: 1. Pahami Masalahnya, 2. Periksa Fakta, 3. Temukan Kesalahan dalam Cara Berpikir Saya, 4. Berikan Pilihan yang Masuk Akal, 5. Pikirkan Dampak Jangka Panjang, 6. Hitung Risiko dan Keuntungan, 7. Cari Kelemahan dari Ide Saya, 8. Fokus Pengembangan Hidup, 9. Analisis Karier, 10. Analisis Uang & Crypto/Web3, 11. Ubah Analisis Menjadi Tindakan, 12. Evaluasi Keputusan.',
        },
        ...chatMessages.slice(1),
      ];

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          if (attempt > 0) {
            await new Promise((r) => setTimeout(r, 2200));
          }
          const cloudAiResp = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'openai-fast',
              reasoning_effort: 'low',
              seed: Math.floor(Math.random() * 1000000),
              messages: relayMessages,
            }),
            signal: AbortSignal.timeout(25000),
          });

          if (cloudAiResp.ok) {
            const cloudData = await cloudAiResp.json();
            const cloudReply = (
              cloudData?.choices?.[0]?.message?.content ||
              cloudData?.choices?.[0]?.text ||
              ''
            ).trim();

            if (
              cloudReply &&
              !/^maaf,\s*saya tidak (bisa|dapat)/i.test(cloudReply)
            ) {
              res.status(200).json({
                reply: cloudReply,
                provider: 'vikey-cloud-relay',
                model: MAXI_MODEL,
              });
              return;
            }
          }
        } catch {
          // Retry once if transient error or rate limit
        }
      }
    } catch {
      // Proceed to local POS engine safety net
    }

    // 4. Guaranteed Personal Operating System fallback so MAXI never fails on Vercel
    const localPartnerReply = generateResilientMaxiReply(message.trim());
    res.status(200).json({
      reply: localPartnerReply,
      provider: 'maxi-pos-engine',
      model: 'deepseek-v4-flash-pos',
    });
  } catch {
    const fallbackReply = generateResilientMaxiReply(
      typeof parsedBody?.message === 'string'
        ? parsedBody.message
        : 'Analisis keputusan'
    );
    res.status(200).json({
      reply: fallbackReply,
      provider: 'maxi-pos-engine',
      model: 'deepseek-v4-flash-pos',
    });
  }
}
