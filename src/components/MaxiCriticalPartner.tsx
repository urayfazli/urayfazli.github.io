import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface MaxiMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface MaxiCriticalPartnerProps {
  isId: boolean;
  isDay: boolean;
  onTriggerToast?: (msg: string) => void;
}

const QUICK_PROMPTS = [
  {
    labelId: 'Audit Proyek / Token Web3',
    labelEn: 'Audit Web3 Token / Project',
    promptId:
      'Saya sedang mempertimbangkan masuk ke token Web3 baru karena narasinya sedang ramai di CT (Crypto Twitter) dan harganya sudah naik 3x minggu ini. TVL terlihat naik karena program poin/airdrop, tapi belum jelas sumber revenue organiknya dan ada jadwal unlock investor 3 bulan lagi. Bedah keputusan ini secara kritis.',
    promptEn:
      'I am considering buying into a new Web3 token because its narrative is trending on Crypto Twitter and price is up 3x this week. TVL is rising due to points/airdrop farming, but organic revenue is unclear and there is an investor token unlock in 3 months. Critically dissect this decision.',
  },
  {
    labelId: 'Alokasi Modal & Risiko Trading',
    labelEn: 'Capital Allocation & Risk',
    promptId:
      'Saya ingin mengalokasikan 40% dari total likuiditas kas saya ke satu posisi high-conviction meme coin / altcoin supaya cepat menggandakan portofolio siklus ini. Bedah asumsi, bias, risk of ruin, dan kualitas keputusan saya.',
    promptEn:
      'I want to allocate 40% of my liquid cash into a single high-conviction meme coin / altcoin position to double my portfolio quickly this cycle. Dissect my assumptions, biases, risk of ruin, and decision quality.',
  },
  {
    labelId: 'Karier & Skill Capital Web3',
    labelEn: 'Web3 Career & Skill Capital',
    promptId:
      'Apakah lebih rasional menghabiskan 6 bulan ke depan untuk berburu puluhan testnet/airdrop secara pasif, atau fokus membangun proof-of-work teknis (menjalankan validator node, riset mendalam, dan menulis kode/tools terbuka)? Serang kedua opsi ini.',
    promptEn:
      'Is it more rational to spend the next 6 months passively farming dozens of testnets/airdrops, or focusing deeply on technical proof-of-work (running validator nodes, deep research, and shipping open-source tools)? Red-team both options.',
  },
];

const CLIENT_MAXI_SYSTEM_PROMPT = `PERSONAL OPERATING SYSTEM — AI PARTNER
Bertindaklah sebagai teman berpikir yang kritis, jujur, dan mampu membantu saya memecahkan masalah menggunakan bahasa Indonesia yang sederhana, jelas, dan langsung ke inti.
Strukturkan analisis ke dalam poin-poin yang relevan dari 12 kerangka berikut:
1. Pahami Masalahnya
2. Periksa Fakta
3. Temukan Kesalahan dalam Cara Berpikir Saya
4. Berikan Pilihan yang Masuk Akal
5. Pikirkan Dampak Jangka Panjang
6. Hitung Risiko dan Keuntungan
7. Cari Kelemahan dari Ide Saya
8. Fokus pada Hal yang Bisa Mengembangkan Hidup Saya
9. Analisis Karier dan Pekerjaan
10. Analisis Uang dan Crypto/Web3
11. Ubah Analisis Menjadi Tindakan
12. Evaluasi Keputusan Saya`;

function buildClientFallbackAnalysis(rawMessage: string): string {
  const text = rawMessage.trim();
  const lower = text.toLowerCase();

  if (
    /crypto|kripto|web3|airdrop|testnet|node|validator|token|coin|koin|meme|pump|dex|staking|defi|trading|bitcoin|eth|solana/i.test(
      lower
    )
  ) {
    return `1. Pahami Masalahnya
- Masalah utama terkait **"${text}"** bukan sekadar ikut atau tidak, melainkan bagaimana menjaga modal, waktu, dan fokusmu agar tidak terkuras oleh hype yang belum terbukti.

2. Periksa Fakta
- **Yang sudah jelas:** Kamu sedang menilai peluang di ekosistem Crypto/Web3.
- **Yang masih berupa dugaan:** Apakah imbal hasilnya sebanding dengan modal, waktu, dan risiko likuiditas.
- **Informasi yang wajib diperiksa:** Kegunaan nyata produk, distribusi token, jadwal unlock investor awal, dan total biaya operasional.

3. Temukan Kesalahan dalam Cara Berpikir Saya
- Waspadai **FOMO (takut ketinggalan)** dan bias menganggap keuntungan proyek masa lalu otomatis terulang.

4. Berikan Pilihan yang Masuk Akal
- **Pilihan A — Eksperimen Kecil Terukur:** Gunakan dana dingin/waktu terbatas (maksimal 10–15% alokasi risiko).
- **Pilihan B — Fokus Keahlian & Proof-of-Work:** Jadikan aktivitas ini sarana membangun keterampilan teknis/riset.
- **Pilihan C — Lewatkan:** Jika aturan tidak transparan atau berisiko merusak modal utama, simpan modalmu.

6. Hitung Risiko dan Keuntungan
- Pastikan jika skenario terburuk terjadi (hasil = Rp0), kondisi keuangan dan hidupmu tetap aman.

11. Ubah Analisis Menjadi Tindakan
- Tetapkan batas maksimal modal dan waktu hari ini, uji selama 14 hari, dan berhenti jika syarat proyek mulai merugikanmu.`;
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
- **Pilihan 3 — Eksekusi Terukur:** Jalankan penuh dengan batas kerugian yang sudah disiapkan sejak awal.

6. Hitung Risiko dan Keuntungan
- Pastikan kerugian terburuknya masih sanggup kamu tanggung tanpa merusak pondasi hidup dan keuanganmu.

11. Ubah Analisis Menjadi Tindakan
- Tentukan 1 langkah nyata yang bisa dimulai hari ini dengan sumber daya yang ada, serta tetapkan jadwal evaluasinya.`;
}

async function requestClientSideAiFallback(
  message: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> {
  const chatMessages = [
    { role: 'system', content: CLIENT_MAXI_SYSTEM_PROMPT },
    ...history.slice(-8).map((item) => ({
      role: item.role === 'model' ? 'assistant' : 'user',
      content: item.text,
    })),
    { role: 'user', content: message },
  ];

  try {
    const resp = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai',
        messages: chatMessages,
      }),
      signal: AbortSignal.timeout(5500),
    });

    if (resp.ok) {
      const data = await resp.json();
      const reply = (
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text ||
        ''
      ).trim();
      if (reply) {
        return reply;
      }
    }
  } catch {
    // Fall through to deterministic POS analysis
  }

  return buildClientFallbackAnalysis(message);
}

/**
 * Hand-Drawn Sketchbook Pokéball SVG for MAXI AI Widget
 */
const MaxiPokeballSvg: React.FC<{
  isOpen: boolean;
  isLoading: boolean;
}> = ({ isOpen, isLoading }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    className="h-full w-full drop-shadow-[2px_3px_0px_#091526]"
    aria-hidden="true"
  >
    {/* Outer Circle Base */}
    <circle cx="40" cy="40" r="35" fill="#FAF6EE" stroke="#091526" strokeWidth="4" />

    {/* Top Red Pokéball Hemisphere */}
    <path
      d="M5 40A35 35 0 0 1 75 40Z"
      fill="#E05A47"
      stroke="#091526"
      strokeWidth="3.8"
      strokeLinejoin="round"
    />

    {/* Hand-Drawn Highlight Arc on Red Top */}
    <path
      d="M17 24C23 15 34 11 45 12.5"
      stroke="#FFFDF9"
      strokeWidth="3.2"
      strokeLinecap="round"
      opacity="0.82"
    />

    {/* Subtle Bottom Cream Shading Arc */}
    <path
      d="M18 59C26 67 52 68 62 58"
      stroke="#D5C4A8"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Center Equatorial Belt Band */}
    <path
      d="M5.5 39.5C26 41.5 54 41.5 74.5 39.5"
      stroke="#091526"
      strokeWidth="6.2"
      strokeLinecap="round"
    />

    {/* Outer Center Latch Ring */}
    <circle
      cx="40"
      cy="40"
      r="12.5"
      fill="#FAF6EE"
      stroke="#091526"
      strokeWidth="3.8"
    />

    {/* Inner Gemini Core Button */}
    <circle
      cx="40"
      cy="40"
      r="7"
      fill={isLoading ? '#F5D78E' : isOpen ? '#38BDF8' : '#091526'}
      stroke="#091526"
      strokeWidth="2"
    />

    {/* 4-Point Gemini Sparkle inside Center Button */}
    <path
      d="M40 34.2L41.4 38.6L45.8 40L41.4 41.4L40 45.8L38.6 41.4L34.2 40L38.6 38.6L40 34.2Z"
      fill={isLoading ? '#091526' : '#F5D78E'}
    />
  </svg>
);

/**
 * Renders Maxi's 12-point structured markdown/text cleanly
 */
const FormattedMaxiResponse: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-left font-journal text-[12px] leading-[1.55] text-[#091526] sm:text-[13px]">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={idx} className="h-1" />;
        }

        // Match numbered section headers like "1. Pahami Masalahnya", "## 2. Periksa Fakta"
        const cleanedHeader = line.replace(/^[#*]+\s*/, '').replace(/\*+$/g, '');
        if (/^(1[0-2]|[1-9])\.\s+[A-Za-zÀ-ÿ]/.test(cleanedHeader) && cleanedHeader.length <= 72) {
          return (
            <div
              key={idx}
              className="mt-3 first:mt-0 rounded-lg border-[1.5px] border-[#091526] bg-[#F5D78E]/45 px-2.5 py-1 font-brush text-[15px] tracking-wide text-[#091526] shadow-[1.5px_2px_0px_#091526] sm:text-[16.5px]"
            >
              {cleanedHeader}
            </div>
          );
        }

        // Bullet points
        if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
          const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E05A47]" />
              <span className="font-medium text-[#091526]">{content}</span>
            </div>
          );
        }

        const cleanParagraph = line.replace(/\*\*(.*?)\*\*/g, '$1');
        return (
          <p key={idx} className="font-medium text-[#091526]">
            {cleanParagraph}
          </p>
        );
      })}
    </div>
  );
};

export const MaxiCriticalPartner: React.FC<MaxiCriticalPartnerProps> = ({
  isId,
  isDay,
  onTriggerToast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [messages, setMessages] = useState<MaxiMessage[]>([]);

  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const wasDraggedRef = useRef(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const handleBallPointerDown = (e: React.PointerEvent) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    wasDraggedRef.current = false;
  };

  const handleBallPointerUp = (e: React.PointerEvent) => {
    if (pointerDownPosRef.current) {
      const dx = e.clientX - pointerDownPosRef.current.x;
      const dy = e.clientY - pointerDownPosRef.current.y;
      if (Math.hypot(dx, dy) > 6) {
        wasDraggedRef.current = true;
      }
    }
    pointerDownPosRef.current = null;
  };

  const handleBallClick = () => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const submitPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg(null);
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: MaxiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: nowTime,
    };

    const historyPayload = messages
      .filter(
        (m) =>
          (m.role === 'user' || m.role === 'model') &&
          typeof m.text === 'string' &&
          m.text.trim().length > 0 &&
          m.text.trim() !== 'Tidak ada respons dari model.'
      )
      .map((m) => ({
        role: m.role,
        text: m.text,
      }));

    const requestPayload = {
      message: trimmed,
      history: historyPayload,
    };

    // Validate request structure before sending
    if (
      typeof requestPayload.message !== 'string' ||
      !requestPayload.message.length ||
      !Array.isArray(requestPayload.history)
    ) {
      const structErr = isId
        ? 'Struktur request tidak valid (MALFORMED_REQUEST).'
        : 'Malformed request structure (MALFORMED_REQUEST).';
      console.info('[MAXI API][MALFORMED_REQUEST] Payload gagal divalidasi:', requestPayload);
      setErrorMsg(structErr);
      return;
    }

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      console.info('[MAXI API] Mengirim request ke /api/maxi:', {
        messageLength: requestPayload.message.length,
        historyCount: requestPayload.history.length,
      });

      let response: Response;
      try {
        response = await fetch('/api/maxi', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload),
        });
      } catch (networkErr: unknown) {
        console.info('[MAXI API][NETWORK_ERROR] Gagal terhubung ke endpoint /api/maxi:', networkErr);
        throw new Error(
          isId
            ? 'Kesalahan Jaringan (NETWORK_ERROR): Tidak dapat menghubungi server /api/maxi. Periksa koneksi internet Anda.'
            : 'Network Error (NETWORK_ERROR): Could not reach /api/maxi endpoint.'
        );
      }

      const contentType = response.headers.get('content-type') || '';
      const rawBody = await response.text();

      let data: {
        reply?: string;
        error?: string;
        code?:
          | 'NETWORK_ERROR'
          | 'INVALID_API_KEY'
          | 'MALFORMED_REQUEST'
          | 'MALFORMED_RESPONSE'
          | 'UPSTREAM_FIREWALL_INTERCEPT'
          | 'UPSTREAM_ERROR'
          | 'SERVER_ERROR';
        provider?: string;
        model?: string;
        diagnostics?: {
          category?: string;
          status?: number;
          contentType?: string;
          reason?: string;
        } | null;
      } | null = null;

      try {
        data = JSON.parse(rawBody);
      } catch (parseErr: unknown) {
        console.info('[MAXI API][MALFORMED_RESPONSE] Respons server bukan JSON yang valid:', {
          status: response.status,
          contentType,
          rawSnippet: rawBody.slice(0, 250),
          parseErr,
        });
        throw new Error(
          isId
            ? `Respons Tidak Valid (MALFORMED_RESPONSE): Server mengembalikan ${contentType || 'non-JSON'} (HTTP ${response.status}).`
            : `Malformed Response (MALFORMED_RESPONSE): Server returned ${contentType || 'non-JSON'} (HTTP ${response.status}).`
        );
      }

      // Log upstream AgentRouter diagnostics cleanly via console.info
      if (data?.diagnostics) {
        console.info(
          `[MAXI API][DIAGNOSTICS][${data.diagnostics.category || 'INFO'}]`,
          {
            activeProvider: data.provider,
            activeModel: data.model,
            upstreamDiagnostics: data.diagnostics,
          }
        );
      }

      if (!response.ok) {
        const errCategory =
          data?.code ||
          (response.status === 401 || response.status === 403
            ? 'INVALID_API_KEY'
            : response.status === 400 || response.status === 422
              ? 'MALFORMED_REQUEST'
              : 'UPSTREAM_ERROR');

        console.info(`[MAXI API][${errCategory}] Status HTTP ${response.status}:`, {
          status: response.status,
          category: errCategory,
          detail: data?.error,
          diagnostics: data?.diagnostics,
        });

        const formattedError =
          errCategory === 'INVALID_API_KEY'
            ? isId
              ? `API Key Tidak Valid (INVALID_API_KEY): ${data?.error || 'Periksa AGENTROUTER_API_KEY Anda.'}`
              : `Invalid API Key (INVALID_API_KEY): ${data?.error || 'Check your AGENTROUTER_API_KEY.'}`
            : errCategory === 'MALFORMED_REQUEST'
              ? isId
                ? `Struktur Request Bermasalah (MALFORMED_REQUEST): ${data?.error || 'Format pesan/history ditolak.'}`
                : `Malformed Request (MALFORMED_REQUEST): ${data?.error || 'Invalid message/history payload.'}`
              : data?.error ||
                (isId
                  ? `Gagal menghubungi otak AI pada Maxi (HTTP ${response.status}).`
                  : `Failed to reach Maxi AI brain (HTTP ${response.status}).`);

        throw new Error(formattedError);
      }

      const replyText = typeof data?.reply === 'string' ? data.reply.trim() : '';
      if (!replyText || replyText === 'Tidak ada respons dari model.') {
        console.info('[MAXI API][MALFORMED_RESPONSE] Field "reply" kosong atau placeholder:', data);
        throw new Error(
          isId
            ? 'Respons Kosong (MALFORMED_RESPONSE): Model tidak mengembalikan teks analisis. Lihat console log untuk detail diagnostik.'
            : 'Empty Response (MALFORMED_RESPONSE): Model returned an empty reply. Check console logs for diagnostics.'
        );
      }

      const modelMsg: MaxiMessage = {
        id: `maxi-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: unknown) {
      console.info('[MAXI API][HANDLED_EXCEPTION] Beralih ke relay AI cadangan client-side:', err);
      const errMessage = err instanceof Error ? err.message : '';

      // Only surface error if explicitly an INVALID_API_KEY or MALFORMED_REQUEST validation error
      if (
        errMessage.includes('INVALID_API_KEY') ||
        errMessage.includes('MALFORMED_REQUEST')
      ) {
        setErrorMsg(errMessage);
      } else {
        const fallbackReply = await requestClientSideAiFallback(
          trimmed,
          historyPayload
        );
        const fallbackModelMsg: MaxiMessage = {
          id: `maxi-${Date.now()}`,
          role: 'model',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, fallbackModelMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReply = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    if (onTriggerToast) {
      onTriggerToast(
        isId
          ? 'Analisis kritis Maxi berhasil disalin!'
          : 'Maxi critical analysis copied!'
      );
    }
  };

  const handleClearSession = () => {
    setMessages([]);
    setErrorMsg(null);
  };

  return (
    <>
      {/* Full-viewport non-blocking drag boundary container */}
      <div
        ref={constraintsRef}
        className="pointer-events-none fixed inset-3 z-50 overflow-visible"
      >
        {/* Draggable Pokéball MAXI Widget */}
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.12}
          dragMomentum={false}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onPointerDown={handleBallPointerDown}
          onPointerUp={handleBallPointerUp}
          onClick={handleBallClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }
          }}
          aria-label={
            isId
              ? 'Buka atau geser Maxi — AI Critical Thinking Partner'
              : 'Open or drag Maxi — AI Critical Thinking Partner'
          }
          title={
            isId
              ? 'Geser (Drag) ke mana saja • Klik untuk membuka MAXI (AI Critical Thinking Partner)'
              : 'Drag anywhere • Click to open MAXI (AI Critical Thinking Partner)'
          }
          className="pointer-events-auto absolute right-1 bottom-20 flex cursor-grab flex-col items-center select-none active:cursor-grabbing sm:right-3 sm:bottom-24"
        >
          {/* Floating Status Callout Pill above Pokéball */}
          <div
            className={`mb-1 rounded-full border-[1.5px] border-[#091526] px-2 py-0.5 font-journal text-[8.5px] leading-none font-extrabold whitespace-nowrap shadow-[1.5px_2px_0px_#091526] transition-colors sm:text-[9.5px] ${
              isOpen
                ? 'bg-[#E05A47] text-[#FAF6EE]'
                : isDay
                  ? 'bg-[#FFFDF7] text-[#091526]'
                  : 'bg-[#F5D78E] text-[#091526]'
            }`}
          >
            {isLoading
              ? isId
                ? '⚡ Maxi Berpikir...'
                : '⚡ Maxi Thinking...'
              : 'MAXI • AI'}
          </div>

          {/* Round Pokéball Container */}
          <div className="relative h-14 w-14 rounded-full sm:h-16 sm:w-16">
            {isLoading && (
              <span
                className="pointer-events-none absolute -inset-1 animate-ping rounded-full bg-[#F5D78E]/50"
                aria-hidden="true"
              />
            )}
            <MaxiPokeballSvg isOpen={isOpen} isLoading={isLoading} />
          </div>
        </motion.div>
      </div>

      {/* MAXI Critical Thinking Partner Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#040B16]/75 backdrop-blur-[2px]"
              aria-hidden="true"
            />

            {/* Main Sketchbook Dialog Window */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="maxi-dialog-title"
              className="parchment-box relative z-10 flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-[3px] border-[#091526] text-[#091526] shadow-[6px_8px_0px_#091526]"
            >
              {/* Top Header Bar */}
              <div className="flex items-center justify-between gap-3 border-b-2 border-[#091526] bg-gradient-to-r from-[#E05A47] via-[#D94E3B] to-[#091526] px-4 py-3 text-[#FAF6EE] sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-[#FAF6EE]/15 p-0.5">
                    <MaxiPokeballSvg isOpen={true} isLoading={isLoading} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2
                        id="maxi-dialog-title"
                        className="truncate font-brush text-xl tracking-wide text-[#FAF6EE] sm:text-2xl"
                      >
                        MAXI — Personal OS AI Partner
                      </h2>
                      <span className="hidden rounded-md border border-[#FAF6EE]/40 bg-[#091526]/70 px-2 py-0.5 font-mono-num text-[10px] font-bold text-[#F5D78E] sm:inline-block">
                        Personal Operating System
                      </span>
                    </div>
                    <p className="truncate font-journal text-[10.5px] font-semibold text-[#FAF6EE]/90 sm:text-xs">
                      {isId
                        ? 'Teman berpikir yang kritis, jujur, dan membantumu mengambil keputusan yang lebih baik.'
                        : 'Critical, honest thinking partner to help you see reality and make better decisions.'}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearSession}
                      className="cursor-pointer rounded-lg border-[1.5px] border-[#FAF6EE]/70 bg-[#091526]/60 px-2.5 py-1 font-journal text-[10.5px] font-bold text-[#FAF6EE] transition-colors hover:bg-[#091526]"
                    >
                      {isId ? 'Reset' : 'Clear'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label={isId ? 'Tutup Maxi' : 'Close Maxi'}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[#091526] bg-[#FAF6EE] font-sans text-base font-extrabold text-[#091526] shadow-[2px_2px_0px_#091526] transition-transform hover:scale-105 hover:bg-[#F5D78E]"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Conversation Body */}
              <div
                ref={chatScrollRef}
                className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6"
              >
                {messages.length === 0 ? (
                  <div className="space-y-3.5">
                    <div className="sketch-note-card p-3.5 sm:p-4">
                      <p className="font-brush text-lg text-[#091526] sm:text-xl">
                        {isId
                          ? '⚡ Ceritakan masalah, rencana, karier, atau keputusan uang/Web3 yang sedang kamu hadapi.'
                          : '⚡ Share the problem, plan, career move, or financial/Web3 decision you are facing.'}
                      </p>
                      <p className="mt-1 font-journal text-xs leading-relaxed text-[#1E2F47] sm:text-[13px]">
                        {isId
                          ? 'Maxi menggunakan bahasa Indonesia yang sederhana, jelas, dan jujur untuk membantumu: (1) Pahami Masalahnya, (2) Periksa Fakta, (3) Temukan Kesalahan Berpikir, (4) Pilihan Masuk Akal, (5) Dampak Jangka Panjang, (6) Hitung Risiko & Keuntungan, (7) Cari Kelemahan Ide, (8) Pengembangan Hidup, (9) Analisis Karier, (10) Analisis Uang & Crypto/Web3, (11) Ubah Menjadi Tindakan, hingga (12) Evaluasi Keputusan.'
                          : 'Maxi uses clear, honest, and grounded analysis to help you understand the root problem, verify facts, spot thinking errors, weigh realistic options, calculate long-term impact & risks, and turn analysis into concrete action.'}
                      </p>
                    </div>

                    {/* Quick Test Prompts */}
                    <div>
                      <p className="mb-2 font-journal text-[11px] font-extrabold tracking-wide text-[#7C4A08] uppercase">
                        {isId
                          ? 'Uji Studi Kasus Cepat (Klik untuk Bedah Kritis):'
                          : 'Quick Case Studies (Click to Red-Team):'}
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {QUICK_PROMPTS.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              submitPrompt(isId ? item.promptId : item.promptEn)
                            }
                            className="cursor-pointer rounded-xl border-2 border-[#091526] bg-[#FFFDF7] p-2.5 text-left font-journal text-xs font-bold text-[#091526] shadow-[2px_3px_0px_#091526] transition-all hover:-translate-y-0.5 hover:bg-[#F5D78E]/35"
                          >
                            <span className="block text-[#E05A47]">
                              0{idx + 1}.
                            </span>
                            <span>{isId ? item.labelId : item.labelEn}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[94%] rounded-2xl border-2 border-[#091526] px-3.5 py-2.5 shadow-[3px_3px_0px_#091526] sm:max-w-[90%] sm:px-4 sm:py-3 ${
                          msg.role === 'user'
                            ? 'bg-[#091526] text-[#FAF6EE]'
                            : 'bg-[#FFFDF8] text-[#091526]'
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-3 border-b border-current/15 pb-1 text-[10px] font-bold opacity-80">
                          <span>
                            {msg.role === 'user'
                              ? isId
                                ? 'Pernyataan / Masalahmu'
                                : 'Your Thesis / Problem'
                              : 'MAXI • Red-Team & Critical Partner'}
                          </span>
                          <span className="font-mono-num">{msg.timestamp}</span>
                        </div>

                        {msg.role === 'user' ? (
                          <p className="whitespace-pre-wrap text-left font-journal text-xs leading-relaxed text-[#FAF6EE] sm:text-[13px]">
                            {msg.text}
                          </p>
                        ) : (
                          <>
                            <FormattedMaxiResponse text={msg.text} />
                            <div className="mt-2.5 flex justify-end border-t border-[#091526]/15 pt-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopyReply(msg.text)}
                                className="cursor-pointer rounded-lg border border-[#091526] bg-[#F5ECDC] px-2.5 py-0.5 font-journal text-[10px] font-bold text-[#091526] hover:bg-[#F5D78E]"
                              >
                                {isId ? 'Salin Analisis' : 'Copy Analysis'}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex items-start">
                    <div className="rounded-2xl border-2 border-[#091526] bg-[#FFFDF8] px-4 py-3 shadow-[3px_3px_0px_#091526]">
                      <div className="flex items-center gap-2 font-journal text-xs font-bold text-[#091526]">
                        <span className="inline-block h-2.5 w-2.5 animate-ping rounded-full bg-[#E05A47]" />
                        <span>
                          {isId
                            ? 'Maxi sedang membedah asumsi, bias, & skenario terburuk (12 struktur)...'
                            : 'Maxi is dissecting assumptions, biases & worst-case scenarios (12 steps)...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="rounded-xl border-2 border-[#E05A47] bg-[#FFF5F5] px-3.5 py-2.5 font-journal text-xs font-bold text-[#991B1B]">
                    {errorMsg}
                  </div>
                )}
              </div>

              {/* Input Form Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitPrompt(input);
                }}
                className="border-t-2 border-[#091526] bg-[#E8DCC6] px-4 py-3 sm:px-5"
              >
                <div className="flex items-end gap-2.5">
                  <textarea
                    ref={textareaRef}
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        submitPrompt(input);
                      }
                    }}
                    placeholder={
                      isId
                        ? 'Tulis keputusan, rencana trading/investasi Web3, karier, atau masalahmu di sini...'
                        : 'Describe your decision, Web3 thesis, financial move, or career dilemma...'
                    }
                    className="sketch-input max-h-32 min-h-[46px] flex-1 resize-none px-3 py-2 font-journal text-xs font-semibold text-[#091526] placeholder:text-[#5C6B7F] sm:text-[13px]"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="sketch-pill-dark shrink-0 cursor-pointer px-4 py-2.5 font-journal text-xs font-bold text-[#FAF6EE] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:text-sm"
                  >
                    {isLoading
                      ? isId
                        ? 'Membedah...'
                        : 'Analyzing...'
                      : isId
                        ? 'Bedah Kritis →'
                        : 'Red-Team It →'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
