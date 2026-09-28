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
    {
      role: 'system',
      content: `${CLIENT_MAXI_SYSTEM_PROMPT}\n\nJawab spesifik sesuai pertanyaan pengguna saat ini dan jangan memberikan template generik yang berulang.`,
    },
    ...history.slice(-8).map((item) => ({
      role: item.role === 'model' ? 'assistant' : 'user',
      content: item.text,
    })),
    { role: 'user', content: message },
  ];

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 2200));
      }
      const resp = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai-fast',
          reasoning_effort: 'low',
          seed: Math.floor(Math.random() * 1000000),
          messages: chatMessages,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (resp.ok) {
        const data = await resp.json();
        const reply = (
          data?.choices?.[0]?.message?.content ||
          data?.choices?.[0]?.text ||
          ''
        ).trim();
        if (reply && !/^maaf,\s*saya tidak (bisa|dapat)/i.test(reply)) {
          return reply;
        }
      }
    } catch {
      // Retry on transient error
    }
  }

  return buildClientFallbackAnalysis(message);
}

export type MaxiRigPose = 'idle' | 'inspect' | 'scribe' | 'wave' | 'analyzing';

interface Maxi2DRigProps {
  isOpen: boolean;
  isLoading: boolean;
  isTyping?: boolean;
  pose?: MaxiRigPose;
  lookOffset?: { x: number; y: number };
  showBones?: boolean;
}

/**
 * Hierarchical 2D Skeletal Rig System for MAXI AI Companion
 * Articulated Bone Hierarchy:
 *   Root/Pelvis (60,82)
 *   ├── Leg.L (48,84 -> 46,104)
 *   ├── Leg.R (72,84 -> 74,104)
 *   └── Spine/Torso (60,76)
 *       ├── Arm.L Shoulder (34,58) -> Forearm.L Elbow (22,66) -> Red-Team Magnifier Prop
 *       ├── Arm.R Shoulder (86,58) -> Forearm.R Elbow (98,66) -> Sketchbook Quill Pen Prop
 *       └── Neck/Head (60,46)
 *           ├── Eyes & Brow Rig (2D gaze tracking + blink + brow tilt)
 *           └── Antenna Joint (60,16 -> 60,5)
 */
const Maxi2DRigCharacter: React.FC<Maxi2DRigProps> = ({
  isOpen,
  isLoading,
  isTyping = false,
  pose = 'idle',
  lookOffset = { x: 0, y: 0 },
  showBones = false,
}) => {
  const activeMode: MaxiRigPose = isLoading
    ? 'analyzing'
    : isTyping
      ? 'scribe'
      : pose;

  const torsoRotate =
    activeMode === 'analyzing'
      ? [-3, 3.5, -3]
      : activeMode === 'scribe'
        ? [1.5, 4, 1.5]
        : activeMode === 'inspect'
          ? [-4, -1.5, -4]
          : activeMode === 'wave'
            ? [-2.5, 2.5, -2.5]
            : [-1.2, 1.2, -1.2];

  const headRotate =
    activeMode === 'analyzing'
      ? [-5, 5, -5]
      : activeMode === 'scribe'
        ? [3, 6.5, 3]
        : activeMode === 'inspect'
          ? [-7, -3, -7]
          : activeMode === 'wave'
            ? [4, -4, 4]
            : [-2, 2, -2];

  const leftArmRotate =
    activeMode === 'analyzing' || activeMode === 'inspect'
      ? [-38, -26, -38]
      : activeMode === 'wave'
        ? [-58, -22, -58]
        : [-8, 4, -8];

  const leftForearmRotate =
    activeMode === 'analyzing' || activeMode === 'inspect'
      ? [-28, -12, -28]
      : activeMode === 'wave'
        ? [-35, 18, -35]
        : [-6, 6, -6];

  const rightArmRotate =
    activeMode === 'scribe'
      ? [-32, -18, -32]
      : activeMode === 'analyzing'
        ? [-24, -10, -24]
        : [8, -4, 8];

  const rightForearmRotate =
    activeMode === 'scribe'
      ? [-25, 15, -25]
      : activeMode === 'analyzing'
        ? [-18, 12, -18]
        : [6, -6, 6];

  const antennaRotate =
    activeMode === 'analyzing'
      ? [-18, 18, -18]
      : activeMode === 'wave'
        ? [-14, 14, -14]
        : [-6, 6, -6];

  const cycleDuration =
    activeMode === 'analyzing'
      ? 1.1
      : activeMode === 'scribe' || activeMode === 'wave'
        ? 1.35
        : 2.6;

  const pupilX = Math.max(-3.2, Math.min(3.2, lookOffset.x));
  const pupilY = Math.max(-2.4, Math.min(2.4, lookOffset.y));

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className="maxi-2d-rig-svg h-full w-full overflow-visible drop-shadow-[2.5px_3.5px_0px_#091526]"
      aria-hidden="true"
    >
      {/* Ground Shadow */}
      <motion.ellipse
        cx="60"
        cy="111"
        rx="26"
        ry="5"
        fill="#091526"
        opacity="0.32"
        animate={{ scaleX: [1, 0.88, 1], opacity: [0.32, 0.22, 0.32] }}
        transition={{ duration: cycleDuration, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ROOT / PELVIS BONE (60, 82) */}
      <motion.g
        style={{ transformOrigin: '60px 82px' }}
        animate={{
          y: activeMode === 'analyzing' ? [0, -4.5, 0] : [0, -2.5, 0],
        }}
        transition={{ duration: cycleDuration, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* BONE: LEFT LEG (Hip Joint 48, 86) */}
        <motion.g
          style={{ transformOrigin: '48px 86px' }}
          animate={{
            rotate: activeMode === 'analyzing' ? [-10, 10, -10] : [-4, 4, -4],
          }}
          transition={{ duration: cycleDuration, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M48 85L45 101"
            stroke="#091526"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <rect
            x="38"
            y="99"
            width="14"
            height="7.5"
            rx="3.8"
            fill="#E05A47"
            stroke="#091526"
            strokeWidth="2.8"
          />
        </motion.g>

        {/* BONE: RIGHT LEG (Hip Joint 72, 86) */}
        <motion.g
          style={{ transformOrigin: '72px 86px' }}
          animate={{
            rotate: activeMode === 'analyzing' ? [10, -10, 10] : [4, -4, 4],
          }}
          transition={{ duration: cycleDuration, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M72 85L75 101"
            stroke="#091526"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <rect
            x="68"
            y="99"
            width="14"
            height="7.5"
            rx="3.8"
            fill="#E05A47"
            stroke="#091526"
            strokeWidth="2.8"
          />
        </motion.g>

        {/* BONE: SPINE / TORSO CHASSIS (Pivot 60, 76) */}
        <motion.g
          style={{ transformOrigin: '60px 76px' }}
          animate={{ rotate: torsoRotate }}
          transition={{ duration: cycleDuration, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* BONE: LEFT ARM 2-JOINT IK CHAIN (Shoulder 34, 58) */}
          <motion.g
            style={{ transformOrigin: '34px 58px' }}
            animate={{ rotate: leftArmRotate }}
            transition={{ duration: cycleDuration, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Upper Left Arm */}
            <path
              d="M34 58L22 66"
              stroke="#091526"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="34" cy="58" r="4" fill="#F5D78E" stroke="#091526" strokeWidth="2.2" />

            {/* Left Forearm + Hand (Elbow 22, 66) */}
            <motion.g
              style={{ transformOrigin: '22px 66px' }}
              animate={{ rotate: leftForearmRotate }}
              transition={{ duration: cycleDuration * 0.85, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M22 66L13 58"
                stroke="#091526"
                strokeWidth="5.2"
                strokeLinecap="round"
              />
              <circle cx="13" cy="58" r="4.5" fill="#FAF6EE" stroke="#091526" strokeWidth="2.4" />

              {/* Red-Team Magnifying Glass Prop */}
              <g transform="translate(3, 42)">
                <line x1="9" y1="15" x2="5" y2="9" stroke="#7C4A08" strokeWidth="3" strokeLinecap="round" />
                <circle
                  cx="3"
                  cy="5"
                  r="6.5"
                  fill="#38BDF8"
                  fillOpacity="0.38"
                  stroke="#091526"
                  strokeWidth="2.4"
                />
                <circle cx="1.5" cy="3.5" r="2" fill="#FFFDF7" opacity="0.85" />
              </g>
            </motion.g>
          </motion.g>

          {/* BONE: RIGHT ARM 2-JOINT IK CHAIN (Shoulder 86, 58) */}
          <motion.g
            style={{ transformOrigin: '86px 58px' }}
            animate={{ rotate: rightArmRotate }}
            transition={{ duration: cycleDuration, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Upper Right Arm */}
            <path
              d="M86 58L98 66"
              stroke="#091526"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="86" cy="58" r="4" fill="#F5D78E" stroke="#091526" strokeWidth="2.2" />

            {/* Right Forearm + Hand (Elbow 98, 66) */}
            <motion.g
              style={{ transformOrigin: '98px 66px' }}
              animate={{ rotate: rightForearmRotate }}
              transition={{ duration: cycleDuration * 0.75, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M98 66L107 57"
                stroke="#091526"
                strokeWidth="5.2"
                strokeLinecap="round"
              />
              <circle cx="107" cy="57" r="4.5" fill="#FAF6EE" stroke="#091526" strokeWidth="2.4" />

              {/* Sketchbook Nib Fountain Pen Prop */}
              <g transform="translate(107, 56) rotate(-36)">
                <rect
                  x="-2"
                  y="-14"
                  width="4.2"
                  height="13"
                  rx="1.5"
                  fill="#F5D78E"
                  stroke="#091526"
                  strokeWidth="2"
                />
                <path d="M-2 -14L0 -20L2.2 -14Z" fill="#E05A47" stroke="#091526" strokeWidth="1.8" />
              </g>
            </motion.g>
          </motion.g>

          {/* TORSO ARMOR SHELL (Poké-Core Body) */}
          <g>
            <rect
              x="35"
              y="50"
              width="50"
              height="38"
              rx="16"
              fill="#FAF6EE"
              stroke="#091526"
              strokeWidth="3.4"
            />
            {/* Red Top Chest Plate */}
            <path
              d="M35 66C35 56.5 42 50 51 50H69C78 50 85 56.5 85 66V68H35V66Z"
              fill="#E05A47"
              stroke="#091526"
              strokeWidth="3.2"
            />
            {/* Equatorial Belt Line */}
            <line x1="35" y1="68" x2="85" y2="68" stroke="#091526" strokeWidth="4.5" />
            {/* Center Core Reactor Latch */}
            <circle cx="60" cy="68" r="9.5" fill="#FAF6EE" stroke="#091526" strokeWidth="3" />
            <circle
              cx="60"
              cy="68"
              r="5.2"
              fill={
                activeMode === 'analyzing'
                  ? '#F5D78E'
                  : activeMode === 'scribe'
                    ? '#38BDF8'
                    : isOpen
                      ? '#38BDF8'
                      : '#091526'
              }
              stroke="#091526"
              strokeWidth="1.8"
            />
            <path
              d="M60 63.8L61.1 66.9L64.2 68L61.1 69.1L60 72.2L58.9 69.1L55.8 68L58.9 66.9L60 63.8Z"
              fill={activeMode === 'analyzing' ? '#091526' : '#F5D78E'}
            />
          </g>

          {/* BONE: NECK & HEAD UNIT (Pivot 60, 48) */}
          <motion.g
            style={{ transformOrigin: '60px 48px' }}
            animate={{ rotate: headRotate }}
            transition={{ duration: cycleDuration, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* BONE: ANTENNA CREST (Pivot 60, 18) */}
            <motion.g
              style={{ transformOrigin: '60px 18px' }}
              animate={{ rotate: antennaRotate }}
              transition={{ duration: cycleDuration * 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <line x1="60" y1="18" x2="60" y2="7" stroke="#091526" strokeWidth="3.4" strokeLinecap="round" />
              <circle
                cx="60"
                cy="6"
                r="4.2"
                fill={activeMode === 'analyzing' ? '#E05A47' : '#F5D78E'}
                stroke="#091526"
                strokeWidth="2.2"
              />
            </motion.g>

            {/* Side Ear Comms */}
            <rect x="27" y="28" width="6" height="13" rx="3" fill="#F5D78E" stroke="#091526" strokeWidth="2.4" />
            <rect x="87" y="28" width="6" height="13" rx="3" fill="#F5D78E" stroke="#091526" strokeWidth="2.4" />

            {/* Main Head Helmet */}
            <rect
              x="32"
              y="16"
              width="56"
              height="34"
              rx="15"
              fill="#FAF6EE"
              stroke="#091526"
              strokeWidth="3.4"
            />
            {/* Red Crown Visor Cap */}
            <path
              d="M33 27C35 19.5 42 16 50 16H70C78 16 85 19.5 87 27H33Z"
              fill="#E05A47"
              stroke="#091526"
              strokeWidth="2.8"
            />

            {/* Dark Face Visor Screen */}
            <rect
              x="38"
              y="24"
              width="44"
              height="21"
              rx="8"
              fill="#091526"
              stroke="#091526"
              strokeWidth="2"
            />

            {/* 2D EYE GAZE + BLINK RIG */}
            <motion.g
              animate={{
                x: pupilX,
                y: pupilY,
                scaleY: [1, 1, 0.12, 1, 1],
              }}
              transition={{
                scaleY: { duration: 3.8, repeat: Infinity, times: [0, 0.46, 0.5, 0.54, 1] },
                x: { type: 'spring', stiffness: 260, damping: 22 },
                y: { type: 'spring', stiffness: 260, damping: 22 },
              }}
              style={{ transformOrigin: '60px 33px' }}
            >
              {/* Left Eye */}
              <circle
                cx="49.5"
                cy="33"
                r="4"
                fill={activeMode === 'analyzing' ? '#F5D78E' : '#38BDF8'}
              />
              <circle cx="51" cy="31.5" r="1.3" fill="#FFFDF7" />

              {/* Right Eye */}
              <circle
                cx="70.5"
                cy="33"
                r="4"
                fill={activeMode === 'analyzing' ? '#F5D78E' : '#38BDF8'}
              />
              <circle cx="72" cy="31.5" r="1.3" fill="#FFFDF7" />

              {/* Articulated Left & Right Eyebrow Bones */}
              <line
                x1="44.5"
                y1={activeMode === 'analyzing' ? '27.5' : '28.5'}
                x2="54"
                y2={activeMode === 'analyzing' ? '29.8' : '28'}
                stroke="#FAF6EE"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="75.5"
                y1={activeMode === 'analyzing' ? '27.5' : '28.5'}
                x2="66"
                y2={activeMode === 'analyzing' ? '29.8' : '28'}
                stroke="#FAF6EE"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Mouth / Phoneme Visor Wave */}
            {activeMode === 'analyzing' ? (
              <motion.path
                d="M53 40.5Q56.5 37.5 60 40.5T67 40.5"
                stroke="#F5D78E"
                strokeWidth="2.2"
                strokeLinecap="round"
                animate={{ scaleX: [0.85, 1.15, 0.85] }}
                transition={{ duration: 0.55, repeat: Infinity }}
                style={{ transformOrigin: '60px 40.5px' }}
              />
            ) : activeMode === 'scribe' ? (
              <circle cx="60" cy="40.5" r="2.3" fill="#38BDF8" />
            ) : (
              <path
                d="M54.5 39.5C56.5 42 63.5 42 65.5 39.5"
                stroke="#F5D78E"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            )}
          </motion.g>

          {/* OPTIONAL 2D SKELETAL RIG BONE & JOINT GIZMO OVERLAY */}
          {showBones && (
            <g className="pointer-events-none" opacity="0.95">
              {/* Spine & Limb Bone Vectors */}
              <line x1="60" y1="82" x2="60" y2="48" stroke="#38BDF8" strokeWidth="1.8" strokeDasharray="2 2" />
              <line x1="60" y1="48" x2="60" y2="18" stroke="#38BDF8" strokeWidth="1.8" strokeDasharray="2 2" />
              <line x1="60" y1="58" x2="34" y2="58" stroke="#38BDF8" strokeWidth="1.6" />
              <line x1="60" y1="58" x2="86" y2="58" stroke="#38BDF8" strokeWidth="1.6" />
              <line x1="60" y1="82" x2="48" y2="86" stroke="#38BDF8" strokeWidth="1.6" />
              <line x1="60" y1="82" x2="72" y2="86" stroke="#38BDF8" strokeWidth="1.6" />
              {/* Joint Pivot Nodes */}
              {[
                { x: 60, y: 82 }, // Root Pelvis
                { x: 60, y: 68 }, // Spine Core
                { x: 60, y: 48 }, // Neck
                { x: 60, y: 18 }, // Antenna Base
                { x: 34, y: 58 }, // Shoulder.L
                { x: 86, y: 58 }, // Shoulder.R
                { x: 48, y: 86 }, // Hip.L
                { x: 72, y: 86 }, // Hip.R
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="3"
                  fill="#F5D78E"
                  stroke="#091526"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          )}
        </motion.g>
      </motion.g>
    </svg>
  );
};

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
  const [rigPose, setRigPose] = useState<MaxiRigPose>('idle');
  const [showRigBones, setShowRigBones] = useState(false);
  const [lookOffset, setLookOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const wasDraggedRef = useRef(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isTyping = input.trim().length > 0;

  const handleDialogPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 6;
    const normY = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 4.5;
    setLookOffset({
      x: Math.max(-3.2, Math.min(3.2, normX)),
      y: Math.max(-2.4, Math.min(2.4, normY)),
    });
  };

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

      let replyText = typeof data?.reply === 'string' ? data.reply.trim() : '';
      if (data?.provider === 'maxi-pos-engine') {
        const liveClientReply = await requestClientSideAiFallback(
          trimmed,
          historyPayload
        );
        if (liveClientReply) {
          replyText = liveClientReply;
        }
      }

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
          {/* Floating Status Callout Pill above 2D Rig Companion */}
          <div
            className={`mb-1 rounded-full border-[1.5px] border-[#091526] px-2.5 py-0.5 font-journal text-[8.5px] leading-none font-extrabold whitespace-nowrap shadow-[1.5px_2px_0px_#091526] transition-colors sm:text-[9.5px] ${
              isOpen
                ? 'maxi-header-light-text bg-[#E05A47] text-[#FFFDF7]'
                : isDay
                  ? 'bg-[#F5D78E] text-[#091526]'
                  : 'bg-[#F5D78E] text-[#091526]'
            }`}
          >
            {isLoading
              ? isId
                ? '⚡ Maxi Menganalisis...'
                : '⚡ Maxi Analyzing...'
              : 'MAXI • 2D AI'}
          </div>

          {/* 2D Skeletal Rig Companion Container (No Card) */}
          <div className="relative h-16 w-16 sm:h-20 sm:w-20">
            {isLoading && (
              <span
                className="pointer-events-none absolute -inset-1 animate-ping rounded-full bg-[#F5D78E]/50"
                aria-hidden="true"
              />
            )}
            <Maxi2DRigCharacter
              isOpen={isOpen}
              isLoading={isLoading}
              isTyping={isTyping}
              pose={rigPose}
              lookOffset={lookOffset}
              showBones={showRigBones}
            />
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
              onPointerMove={handleDialogPointerMove}
              onPointerLeave={() => setLookOffset({ x: 0, y: 0 })}
              role="dialog"
              aria-modal="true"
              aria-labelledby="maxi-dialog-title"
              className="parchment-box relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-[3px] border-[#091526] text-[#091526] shadow-[6px_8px_0px_#091526]"
            >
              {/* Top Header Bar */}
              <div className="maxi-header-light-text flex items-center justify-between gap-3 border-b-2 border-[#091526] bg-gradient-to-r from-[#E05A47] via-[#D94E3B] to-[#091526] px-4 py-3 text-[#FFFDF7] sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-12 w-12 shrink-0">
                    <Maxi2DRigCharacter
                      isOpen={true}
                      isLoading={isLoading}
                      isTyping={isTyping}
                      pose={rigPose}
                      lookOffset={lookOffset}
                      showBones={showRigBones}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        id="maxi-dialog-title"
                        className="maxi-header-light-text truncate font-brush text-xl tracking-wide text-[#FFFDF7] sm:text-2xl"
                      >
                        MAXI — Personal OS AI Partner
                      </h2>
                      <span className="maxi-header-badge hidden rounded-md border border-[#FFFDF7]/40 bg-[#091526] px-2 py-0.5 font-mono-num text-[10px] font-bold text-[#F5D78E] sm:inline-block">
                        2D Rig • Personal OS
                      </span>
                    </div>
                    <p className="maxi-header-light-text truncate font-journal text-[10.5px] font-semibold text-[#FFFDF7]/95 sm:text-xs">
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
                      className="maxi-header-light-text cursor-pointer rounded-lg border-[1.5px] border-[#FFFDF7]/70 bg-[#091526]/75 px-2.5 py-1 font-journal text-[10.5px] font-bold text-[#FFFDF7] transition-colors hover:bg-[#091526]"
                    >
                      {isId ? 'Reset' : 'Clear'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label={isId ? 'Tutup Maxi' : 'Close Maxi'}
                    className="maxi-close-btn flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[#091526] bg-[#FFFDF7] font-sans text-base font-extrabold text-[#091526] shadow-[2px_2px_0px_#091526] transition-transform hover:scale-105 hover:bg-[#F5D78E]"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Interactive 2D Skeletal Rig Animation Stage & Pose Controller Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#091526] bg-[#FFF9EC] px-4 py-2 text-[#091526] sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#091526] bg-[#F5D78E] px-2 py-0.5 font-mono-num text-[10px] font-extrabold text-[#091526]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E05A47]" />
                    2D RIG SYSTEM
                  </span>
                  <span className="font-journal text-[11px] font-bold text-[#1E2F47]">
                    {isLoading
                      ? isId
                        ? 'Pose Aktif: Red-Team Deep Scan'
                        : 'Active Pose: Red-Team Deep Scan'
                      : isTyping
                        ? isId
                          ? 'Pose Aktif: Mencatat Tesis (Scribe IK)'
                          : 'Active Pose: Scribe IK Mode'
                        : isId
                          ? 'Gerakkan kursor untuk Eye-Tracking • Pilih Pose:'
                          : 'Move cursor for Eye-Tracking • Select Pose:'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  {(
                    [
                      { id: 'idle', labelId: 'Siaga', labelEn: 'Idle' },
                      { id: 'inspect', labelId: 'Inspeksi', labelEn: 'Inspect' },
                      { id: 'scribe', labelId: 'Catat', labelEn: 'Scribe' },
                      { id: 'wave', labelId: 'Sapa', labelEn: 'Wave' },
                    ] as const
                  ).map((p) => {
                    const active = !isLoading && !isTyping && rigPose === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setRigPose(p.id)}
                        className={`cursor-pointer rounded-lg border-[1.5px] border-[#091526] px-2 py-0.5 font-journal text-[10px] font-extrabold transition-all ${
                          active
                            ? 'bg-[#E05A47] text-[#FFFDF7] shadow-[1.5px_1.5px_0px_#091526]'
                            : 'bg-[#FFFDF7] text-[#091526] hover:bg-[#F5D78E]/60'
                        }`}
                      >
                        {isId ? p.labelId : p.labelEn}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowRigBones((prev) => !prev)}
                    title={
                      isId
                        ? 'Tampilkan/Sembunyikan Struktur Tulang & Sendi 2D Rig'
                        : 'Toggle 2D Skeletal Bones & Joints Overlay'
                    }
                    className={`cursor-pointer rounded-lg border-[1.5px] border-[#091526] px-2 py-0.5 font-mono-num text-[10px] font-extrabold transition-all ${
                      showRigBones
                        ? 'bg-[#091526] text-[#38BDF8] shadow-[1.5px_1.5px_0px_#E05A47]'
                        : 'bg-[#F5ECDC] text-[#091526] hover:bg-[#F5D78E]'
                    }`}
                  >
                    {showRigBones ? '🦴 Rig: ON' : '🦴 Rig'}
                  </button>
                </div>
              </div>

              {/* Conversation Body */}
              <div
                ref={chatScrollRef}
                className="flex-1 space-y-4 overflow-y-auto bg-[#F7EFE0] px-4 py-4 sm:px-6"
              >
                {messages.length === 0 ? (
                  <div className="space-y-3.5">
                    <div className="sketch-note-card flex flex-col items-center gap-3.5 p-3.5 sm:flex-row sm:items-start sm:p-4">
                      {/* Featured 2D Rig Character Showcase inside Empty State */}
                      <div className="flex shrink-0 flex-col items-center">
                        <div className="h-24 w-24">
                          <Maxi2DRigCharacter
                            isOpen={true}
                            isLoading={isLoading}
                            isTyping={isTyping}
                            pose={rigPose}
                            lookOffset={lookOffset}
                            showBones={showRigBones}
                          />
                        </div>
                        <span className="mt-1.5 rounded-full border border-[#091526] bg-[#F5D78E] px-2 py-0.5 font-mono-num text-[9px] font-extrabold text-[#091526]">
                          IK 2D SKELETAL RIG
                        </span>
                      </div>

                      <div className="flex-1 text-left">
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
                            className="cursor-pointer rounded-xl border-2 border-[#091526] bg-[#FFFDF7] p-2.5 text-left font-journal text-xs font-bold text-[#091526] shadow-[2px_3px_0px_#091526] transition-all hover:-translate-y-0.5 hover:bg-[#F5D78E]/45"
                          >
                            <span className="block font-extrabold text-[#E05A47]">
                              0{idx + 1}.
                            </span>
                            <span className="text-[#091526]">
                              {isId ? item.labelId : item.labelEn}
                            </span>
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
                            ? isDay
                              ? 'maxi-user-textbox bg-[#FDE6A8] text-[#091526]'
                              : 'bg-[#122847] text-[#FFFDF7]'
                            : 'maxi-model-textbox bg-[#FFFDF9] text-[#091526]'
                        }`}
                      >
                        <div
                          className={`mb-1 flex items-center justify-between gap-3 border-b pb-1 text-[10px] font-extrabold ${
                            msg.role === 'user'
                              ? isDay
                                ? 'border-[#091526]/25 text-[#091526]'
                                : 'border-[#FFFDF7]/20 text-[#F5D78E]'
                              : 'border-[#091526]/15 text-[#7C4A08]'
                          }`}
                        >
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
                          <p
                            className={`whitespace-pre-wrap text-left font-journal text-xs leading-relaxed font-semibold sm:text-[13px] ${
                              isDay ? 'text-[#091526]' : 'text-[#FFFDF7]'
                            }`}
                          >
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
                    <div className="maxi-model-textbox rounded-2xl border-2 border-[#091526] bg-[#FFFDF9] px-4 py-3 shadow-[3px_3px_0px_#091526]">
                      <div className="flex items-center gap-2.5 font-journal text-xs font-bold text-[#091526]">
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
                className="maxi-input-footer border-t-2 border-[#091526] bg-[#EFE3CE] px-4 py-3 sm:px-5"
              >
                <div className="flex items-end gap-2.5">
                  <textarea
                    ref={textareaRef}
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => {
                      if (!isLoading) setRigPose('scribe');
                    }}
                    onBlur={() => {
                      if (!isLoading && !input.trim()) setRigPose('idle');
                    }}
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
                    className="sketch-input maxi-input-textarea max-h-32 min-h-[48px] flex-1 resize-none bg-[#FFFFFF] px-3.5 py-2.5 font-journal text-xs font-semibold text-[#091526] placeholder:text-[#52657C] focus:bg-[#FFFDF9] sm:text-[13px]"
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
