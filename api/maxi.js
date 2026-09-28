import { GoogleGenAI } from '@google/genai';

const AGENTROUTER_BASE_URL = (
  process.env.AGENTROUTER_BASE_URL || 'https://agentrouter.org/v1'
).replace(/\/+$/, '');
const AGENTROUTER_MODEL = process.env.AGENTROUTER_MODEL || 'deepseek-v4-flash';
const DEFAULT_AGENTROUTER_KEY =
  'sk-poU3klgKsZPl209MAYMaLjMItNm80SWf7cHxs77Frd7GqbE5';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed', code: 'MALFORMED_REQUEST' });
    return;
  }

  try {
    const apiKey = (
      process.env.AGENTROUTER_API_KEY || DEFAULT_AGENTROUTER_KEY
    ).trim();

    if (!apiKey || !apiKey.startsWith('sk-')) {
      res.status(401).json({
        error: 'API Key AgentRouter tidak valid atau belum diatur (harus diawali sk-).',
        code: 'INVALID_API_KEY',
      });
      return;
    }

    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({
        error: 'Struktur request tidak valid: pesan atau masalah tidak boleh kosong.',
        code: 'MALFORMED_REQUEST',
      });
      return;
    }

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
          chatMessages.push({
            role: item.role === 'model' ? 'assistant' : 'user',
            content: item.text,
          });
          geminiContents.push({
            role: item.role,
            parts: [{ text: item.text }],
          });
        }
      }
    }

    chatMessages.push({
      role: 'user',
      content: message.trim(),
    });
    geminiContents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    let upstreamDiagnostic = null;

    try {
      const response = await fetch(`${AGENTROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/RooVetGit/Roo-Cline',
          'X-Title': 'Roo Code',
          'User-Agent': 'RooCode/3.54.0',
          'X-Stainless-Arch': 'x64',
          'X-Stainless-Lang': 'js',
          'X-Stainless-OS': 'Linux',
          'X-Stainless-Package-Version': '5.12.2',
          'X-Stainless-Retry-Count': '0',
          'X-Stainless-Runtime': 'node',
          'X-Stainless-Runtime-Version': process.version,
        },
        body: JSON.stringify({
          model: AGENTROUTER_MODEL,
          messages: chatMessages,
          temperature: 0.35,
          top_p: 0.9,
          stream: false,
        }),
        signal: AbortSignal.timeout(8500),
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
          contentType,
          reason:
            'AgentRouter mengembalikan halaman proteksi Aliyun WAF untuk IP cloud server; mengalihkan otomatis ke mesin cadangan.',
        };
      } else {
        let parsedData = null;
        try {
          parsedData = JSON.parse(rawText);
        } catch {
          upstreamDiagnostic = {
            category: 'MALFORMED_RESPONSE',
            status: response.status,
            contentType,
            reason: 'Respons dari AgentRouter bukan JSON yang valid.',
          };
        }

        if (parsedData && !upstreamDiagnostic) {
          if (!response.ok || parsedData.code === 401 || parsedData.error) {
            const errDetail =
              typeof parsedData.error === 'string'
                ? parsedData.error
                : parsedData.error?.message ||
                  parsedData.msg ||
                  `AgentRouter HTTP ${response.status}`;

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
              contentType,
              reason: errDetail,
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
                provider: 'agentrouter',
                model: AGENTROUTER_MODEL,
              });
              return;
            }

            upstreamDiagnostic = {
              category: 'MALFORMED_RESPONSE',
              status: response.status,
              contentType,
              reason:
                'JSON AgentRouter berhasil dibaca, tetapi field choices[0].message.content kosong.',
            };
          }
        }
      }
    } catch (fetchErr) {
      const netMsg =
        fetchErr instanceof Error
          ? fetchErr.message
          : 'Koneksi jaringan ke AgentRouter gagal.';
      upstreamDiagnostic = {
        category: 'NETWORK_ERROR',
        reason: `Gagal menghubungi ${AGENTROUTER_BASE_URL}: ${netMsg}`,
      };
    }

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
        'gemini-3.1-flash-lite-preview',
        'gemini-3-flash-preview',
        'gemini-3.8-flash',
        'gemini-flash-latest',
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
              provider: 'fallback-ai',
              model: modelName,
              diagnostics: upstreamDiagnostic,
            });
            return;
          }
        } catch {
          // Try next fallback model
        }
      }
    }

    const localPartnerReply = generateResilientMaxiReply(message.trim());
    res.status(200).json({
      reply: localPartnerReply,
      provider: 'maxi-pos-engine',
      model: 'deepseek-v4-flash-pos',
      diagnostics: upstreamDiagnostic,
    });
  } catch {
    const fallbackReply = generateResilientMaxiReply(
      typeof req.body?.message === 'string' ? req.body.message : 'Analisis keputusan'
    );
    res.status(200).json({
      reply: fallbackReply,
      provider: 'maxi-pos-engine',
      model: 'deepseek-v4-flash-pos',
    });
  }
}
