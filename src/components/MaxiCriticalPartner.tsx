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
  lookOffsetRef?: React.MutableRefObject<{ x: number; y: number }>;
  showBones?: boolean;
}

/**
 * Hierarchical 2D Skeletal Rig System for MAXI AI Companion
 * Driven by a dedicated 60fps requestAnimationFrame Forward/Inverse Kinematics (FK/IK) solver
 * applying native SVG user-space `transform="rotate(deg, pivotX, pivotY)"` attributes.
 * This guarantees 100% cross-browser & Vercel production animation fidelity without
 * WAAPI / CSS transform-box / prefers-reduced-motion freezes or scroll re-renders.
 *
 * Articulated Bone Hierarchy:
 *   Root/Pelvis (60,82)
 *   ├── Leg.L (48,86 -> 45,101)
 *   ├── Leg.R (72,86 -> 75,101)
 *   └── Spine/Torso (60,76)
 *       ├── Arm.L Shoulder (34,58) -> Forearm.L Elbow (22,66) -> Red-Team Magnifier Prop
 *       ├── Arm.R Shoulder (86,58) -> Forearm.R Elbow (98,66) -> Sketchbook Quill Pen Prop
 *       └── Neck/Head (60,48)
 *           ├── Eyes & Brow Rig (2D gaze tracking + natural blink + brow tilt)
 *           └── Antenna Joint (60,18 -> 60,6)
 */
const Maxi2DRigCharacter: React.FC<Maxi2DRigProps> = React.memo(({
  isOpen,
  isLoading,
  isTyping = false,
  pose = 'idle',
  lookOffsetRef,
  showBones = false,
}) => {
  const activeMode: MaxiRigPose = isLoading
    ? 'analyzing'
    : isTyping
      ? 'scribe'
      : pose;

  // Keep latest props in a ref for the 60fps animation loop without restarting rAF
  const rigPropsRef = useRef({
    activeMode,
  });
  rigPropsRef.current = {
    activeMode,
  };

  // Direct SVG DOM refs for 60fps native SVG attribute transforms
  const shadowRef = useRef<SVGEllipseElement | null>(null);
  const pelvisRef = useRef<SVGGElement | null>(null);
  const leftLegRef = useRef<SVGGElement | null>(null);
  const rightLegRef = useRef<SVGGElement | null>(null);
  const torsoRef = useRef<SVGGElement | null>(null);
  const leftArmRef = useRef<SVGGElement | null>(null);
  const leftForearmRef = useRef<SVGGElement | null>(null);
  const rightArmRef = useRef<SVGGElement | null>(null);
  const rightForearmRef = useRef<SVGGElement | null>(null);
  const coreStarRef = useRef<SVGPathElement | null>(null);
  const headRef = useRef<SVGGElement | null>(null);
  const antennaRef = useRef<SVGGElement | null>(null);
  const eyeGroupRef = useRef<SVGGElement | null>(null);
  const mouthWaveRef = useRef<SVGPathElement | null>(null);

  // Damped kinematic state for smooth spring transitions between poses
  const currentBonesRef = useRef({
    pelvisY: 0,
    pelvisRot: 0,
    leftLegRot: 0,
    rightLegRot: 0,
    torsoRot: 0,
    leftArmRot: -12,
    leftForearmRot: -10,
    rightArmRot: 10,
    rightForearmRot: 8,
    headRot: 0,
    headX: 0,
    headY: 0,
    antennaRot: 0,
    eyeX: 0,
    eyeY: 0,
    coreRot: 0,
  });

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let lastRenderTime = 0;
    // Offset phase slightly per instance so multiple rigs feel organic
    const phaseOffset = Math.random() * 1.5;

    const animateRig = (now: number) => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        lastTime = now;
        rafId = window.requestAnimationFrame(animateRig);
        return;
      }

      const { activeMode: mode } = rigPropsRef.current;
      // Throttle background idle frames to ~30fps when closed & idle, full 60fps when open or active
      const minFrameInterval = !isOpen && mode === 'idle' ? 32 : 0;
      if (minFrameInterval > 0 && now - lastRenderTime < minFrameInterval) {
        rafId = window.requestAnimationFrame(animateRig);
        return;
      }
      lastRenderTime = now;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now / 1000 + phaseOffset;

      const rawLook = lookOffsetRef?.current ?? { x: 0, y: 0 };
      const lookX = Math.max(-3.5, Math.min(3.5, rawLook.x));
      const lookY = Math.max(-2.6, Math.min(2.6, rawLook.y));
      const cur = currentBonesRef.current;

      // Target bone angles & translations computed from harmonic oscillators
      let targetPelvisY = 0;
      let targetPelvisRot = 0;
      let targetLeftLegRot = 0;
      let targetRightLegRot = 0;
      let targetTorsoRot = 0;
      let targetLeftArmRot = 0;
      let targetLeftForearmRot = 0;
      let targetRightArmRot = 0;
      let targetRightForearmRot = 0;
      let targetHeadRot = 0;
      let targetAntennaRot = 0;
      let coreSpinSpeed = 28;

      if (mode === 'analyzing') {
        // High-energy Red-Team Deep Scan kinematics
        const fast = t * 5.8;
        targetPelvisY = Math.sin(fast) * -4.2 - 1.5;
        targetPelvisRot = Math.cos(fast * 0.5) * 2.8;
        targetLeftLegRot = Math.sin(fast) * 11 - 3;
        targetRightLegRot = -Math.sin(fast) * 11 + 3;
        targetTorsoRot = Math.sin(fast * 0.7) * 5.5;
        targetLeftArmRot = -44 + Math.sin(fast * 1.1) * 16;
        targetLeftForearmRot = -26 + Math.cos(fast * 1.3) * 18;
        targetRightArmRot = -28 + Math.cos(fast * 1.1) * 14;
        targetRightForearmRot = -14 + Math.sin(fast * 1.4) * 16;
        targetHeadRot = Math.sin(fast * 0.85) * 7.5;
        targetAntennaRot = Math.sin(fast * 1.8) * 22;
        coreSpinSpeed = 160;
      } else if (mode === 'scribe') {
        // Scribe IK Mode: right hand actively writing notes with quill pen
        const writeCycle = t * 6.5;
        targetPelvisY = Math.sin(t * 3.0) * -2.2;
        targetPelvisRot = 1.2 + Math.sin(t * 1.8) * 1.2;
        targetLeftLegRot = -3 + Math.sin(t * 2.5) * 3.5;
        targetRightLegRot = 4 + Math.cos(t * 2.5) * 3.5;
        targetTorsoRot = 3.2 + Math.sin(t * 2.2) * 2.2;
        targetLeftArmRot = -18 + Math.sin(t * 2.0) * 6;
        targetLeftForearmRot = -14 + Math.cos(t * 2.0) * 6;
        targetRightArmRot = -38 + Math.sin(writeCycle * 0.5) * 9;
        targetRightForearmRot = -22 + Math.sin(writeCycle) * 22;
        targetHeadRot = 4.8 + Math.sin(writeCycle * 0.5) * 3.2;
        targetAntennaRot = Math.sin(writeCycle * 0.8) * 12;
        coreSpinSpeed = 75;
      } else if (mode === 'inspect') {
        // Inspect Mode: raises Red-Team magnifying glass up to visor eye level
        const scan = t * 3.2;
        targetPelvisY = Math.sin(scan) * -2.8;
        targetPelvisRot = -1.8 + Math.sin(scan * 0.6) * 1.5;
        targetLeftLegRot = -4 + Math.sin(scan) * 4.5;
        targetRightLegRot = 4 - Math.sin(scan) * 4.5;
        targetTorsoRot = -4.5 + Math.sin(scan * 0.8) * 2.8;
        targetLeftArmRot = -56 + Math.sin(scan * 1.1) * 10;
        targetLeftForearmRot = -38 + Math.cos(scan * 1.1) * 12;
        targetRightArmRot = 12 + Math.sin(scan * 0.8) * 6;
        targetRightForearmRot = 10 + Math.cos(scan * 0.8) * 8;
        targetHeadRot = -6.5 + Math.sin(scan * 0.9) * 4.5;
        targetAntennaRot = -8 + Math.sin(scan * 1.6) * 14;
        coreSpinSpeed = 60;
      } else if (mode === 'wave') {
        // Friendly Enthusiastic Wave Mode
        const wave = t * 6.2;
        targetPelvisY = Math.abs(Math.sin(wave * 0.5)) * -4.2;
        targetPelvisRot = Math.sin(wave * 0.5) * 3.5;
        targetLeftLegRot = Math.sin(wave * 0.5) * 8;
        targetRightLegRot = -Math.sin(wave * 0.5) * 8;
        targetTorsoRot = Math.sin(wave * 0.5) * 4.5;
        targetLeftArmRot = -68 + Math.sin(wave) * 20;
        targetLeftForearmRot = -25 + Math.cos(wave) * 28;
        targetRightArmRot = 14 + Math.sin(wave * 0.5) * 8;
        targetRightForearmRot = 12 + Math.cos(wave * 0.5) * 10;
        targetHeadRot = Math.sin(wave * 0.5) * 6.5;
        targetAntennaRot = Math.sin(wave * 1.2) * 18;
        coreSpinSpeed = 90;
      } else {
        // Lively Idle Mode: continuous breathing, floating bob, arm sway, & periodic curiosity check
        const breath = t * 2.6;
        // Every ~7 seconds, perform a subtle magnifying-glass curiosity glance so idle is visibly dynamic
        const curiosityPulse = Math.max(0, Math.sin(t * 0.9) - 0.65) / 0.35;

        targetPelvisY = Math.sin(breath) * -3.2 - 0.8;
        targetPelvisRot = Math.sin(breath * 0.5) * 2.0;
        targetLeftLegRot = -3.5 + Math.sin(breath) * 5.5;
        targetRightLegRot = 3.5 - Math.sin(breath) * 5.5;
        targetTorsoRot = Math.sin(breath * 0.75) * 3.2 - curiosityPulse * 2.5;
        targetLeftArmRot =
          -14 + Math.sin(breath + 0.4) * 9 - curiosityPulse * 28;
        targetLeftForearmRot =
          -10 + Math.cos(breath + 0.8) * 11 - curiosityPulse * 18;
        targetRightArmRot =
          12 - Math.sin(breath + 0.4) * 8 + curiosityPulse * 6;
        targetRightForearmRot =
          8 - Math.cos(breath + 0.8) * 10 + Math.sin(t * 4.2) * 5;
        targetHeadRot =
          Math.sin(breath * 0.85 - 0.3) * 4.2 +
          lookX * 1.2 -
          curiosityPulse * 4;
        targetAntennaRot = Math.sin(breath * 1.5 - 0.6) * 12;
        coreSpinSpeed = 38;
      }

      // Smooth exponential spring damping (frame-rate independent)
      const smooth = Math.min(1, dt * 10.5);
      cur.pelvisY += (targetPelvisY - cur.pelvisY) * smooth;
      cur.pelvisRot += (targetPelvisRot - cur.pelvisRot) * smooth;
      cur.leftLegRot += (targetLeftLegRot - cur.leftLegRot) * smooth;
      cur.rightLegRot += (targetRightLegRot - cur.rightLegRot) * smooth;
      cur.torsoRot += (targetTorsoRot - cur.torsoRot) * smooth;
      cur.leftArmRot += (targetLeftArmRot - cur.leftArmRot) * smooth;
      cur.leftForearmRot += (targetLeftForearmRot - cur.leftForearmRot) * smooth;
      cur.rightArmRot += (targetRightArmRot - cur.rightArmRot) * smooth;
      cur.rightForearmRot += (targetRightForearmRot - cur.rightForearmRot) * smooth;
      cur.headRot += (targetHeadRot - cur.headRot) * smooth;
      cur.headX += (lookX * 0.65 - cur.headX) * smooth;
      cur.headY += (lookY * 0.45 - cur.headY) * smooth;
      cur.antennaRot += (targetAntennaRot - cur.antennaRot) * smooth;
      cur.eyeX += (lookX - cur.eyeX) * Math.min(1, dt * 14);
      cur.eyeY += (lookY - cur.eyeY) * Math.min(1, dt * 14);
      cur.coreRot = (cur.coreRot + dt * coreSpinSpeed) % 360;

      // Natural periodic blink every ~3.4 seconds
      const blinkCycle = (t % 3.4) / 3.4;
      let blinkScaleY = 1;
      if (blinkCycle > 0.47 && blinkCycle < 0.53) {
        const norm = Math.abs(blinkCycle - 0.5) / 0.03;
        blinkScaleY = 0.1 + norm * 0.9;
      }

      // Apply native SVG user-space transforms directly to DOM nodes
      if (shadowRef.current) {
        const shadowScale = Math.max(0.8, Math.min(1.08, 1 + cur.pelvisY * 0.035));
        const shadowOpacity = Math.max(0.18, Math.min(0.36, 0.32 + cur.pelvisY * 0.02));
        shadowRef.current.setAttribute('rx', (26 * shadowScale).toFixed(2));
        shadowRef.current.setAttribute('opacity', shadowOpacity.toFixed(2));
      }

      if (pelvisRef.current) {
        pelvisRef.current.setAttribute(
          'transform',
          `translate(0 ${cur.pelvisY.toFixed(2)}) rotate(${cur.pelvisRot.toFixed(2)} 60 82)`
        );
      }

      if (leftLegRef.current) {
        leftLegRef.current.setAttribute(
          'transform',
          `rotate(${cur.leftLegRot.toFixed(2)} 48 86)`
        );
      }

      if (rightLegRef.current) {
        rightLegRef.current.setAttribute(
          'transform',
          `rotate(${cur.rightLegRot.toFixed(2)} 72 86)`
        );
      }

      if (torsoRef.current) {
        torsoRef.current.setAttribute(
          'transform',
          `rotate(${cur.torsoRot.toFixed(2)} 60 76)`
        );
      }

      if (leftArmRef.current) {
        leftArmRef.current.setAttribute(
          'transform',
          `rotate(${cur.leftArmRot.toFixed(2)} 34 58)`
        );
      }

      if (leftForearmRef.current) {
        leftForearmRef.current.setAttribute(
          'transform',
          `rotate(${cur.leftForearmRot.toFixed(2)} 22 66)`
        );
      }

      if (rightArmRef.current) {
        rightArmRef.current.setAttribute(
          'transform',
          `rotate(${cur.rightArmRot.toFixed(2)} 86 58)`
        );
      }

      if (rightForearmRef.current) {
        rightForearmRef.current.setAttribute(
          'transform',
          `rotate(${cur.rightForearmRot.toFixed(2)} 98 66)`
        );
      }

      if (coreStarRef.current) {
        coreStarRef.current.setAttribute(
          'transform',
          `rotate(${cur.coreRot.toFixed(1)} 60 68)`
        );
      }

      if (headRef.current) {
        headRef.current.setAttribute(
          'transform',
          `translate(${cur.headX.toFixed(2)} ${cur.headY.toFixed(2)}) rotate(${cur.headRot.toFixed(2)} 60 48)`
        );
      }

      if (antennaRef.current) {
        antennaRef.current.setAttribute(
          'transform',
          `rotate(${cur.antennaRot.toFixed(2)} 60 18)`
        );
      }

      if (eyeGroupRef.current) {
        eyeGroupRef.current.setAttribute(
          'transform',
          `translate(${cur.eyeX.toFixed(2)} ${cur.eyeY.toFixed(2)}) translate(60 33) scale(1 ${blinkScaleY.toFixed(2)}) translate(-60 -33)`
        );
      }

      if (mouthWaveRef.current) {
        const mouthScaleX = 0.85 + Math.sin(t * 11) * 0.2;
        mouthWaveRef.current.setAttribute(
          'transform',
          `translate(60 40.5) scale(${mouthScaleX.toFixed(2)} 1) translate(-60 -40.5)`
        );
      }

      rafId = window.requestAnimationFrame(animateRig);
    };

    rafId = window.requestAnimationFrame(animateRig);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className="maxi-2d-rig-svg h-full w-full overflow-visible"
      aria-hidden="true"
    >
      {/* Ground Shadow */}
      <ellipse
        ref={shadowRef}
        cx="60"
        cy="111"
        rx="26"
        ry="5"
        fill="#091526"
        opacity="0.32"
      />

      {/* ROOT / PELVIS BONE (60, 82) */}
      <g ref={pelvisRef}>
        {/* BONE: LEFT LEG (Hip Joint 48, 86) */}
        <g ref={leftLegRef}>
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
        </g>

        {/* BONE: RIGHT LEG (Hip Joint 72, 86) */}
        <g ref={rightLegRef}>
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
        </g>

        {/* BONE: SPINE / TORSO CHASSIS (Pivot 60, 76) */}
        <g ref={torsoRef}>
          {/* BONE: LEFT ARM 2-JOINT IK CHAIN (Shoulder 34, 58) */}
          <g ref={leftArmRef}>
            {/* Upper Left Arm */}
            <path
              d="M34 58L22 66"
              stroke="#091526"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="34" cy="58" r="4" fill="#F5D78E" stroke="#091526" strokeWidth="2.2" />

            {/* Left Forearm + Hand (Elbow 22, 66) */}
            <g ref={leftForearmRef}>
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
            </g>
          </g>

          {/* BONE: RIGHT ARM 2-JOINT IK CHAIN (Shoulder 86, 58) */}
          <g ref={rightArmRef}>
            {/* Upper Right Arm */}
            <path
              d="M86 58L98 66"
              stroke="#091526"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="86" cy="58" r="4" fill="#F5D78E" stroke="#091526" strokeWidth="2.2" />

            {/* Right Forearm + Hand (Elbow 98, 66) */}
            <g ref={rightForearmRef}>
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
            </g>
          </g>

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
              ref={coreStarRef}
              d="M60 63.8L61.1 66.9L64.2 68L61.1 69.1L60 72.2L58.9 69.1L55.8 68L58.9 66.9L60 63.8Z"
              fill={activeMode === 'analyzing' ? '#091526' : '#F5D78E'}
            />
          </g>

          {/* BONE: NECK & HEAD UNIT (Pivot 60, 48) */}
          <g ref={headRef}>
            {/* BONE: ANTENNA CREST (Pivot 60, 18) */}
            <g ref={antennaRef}>
              <line x1="60" y1="18" x2="60" y2="7" stroke="#091526" strokeWidth="3.4" strokeLinecap="round" />
              <circle
                cx="60"
                cy="6"
                r="4.2"
                fill={activeMode === 'analyzing' ? '#E05A47' : '#F5D78E'}
                stroke="#091526"
                strokeWidth="2.2"
              />
            </g>

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
            <g ref={eyeGroupRef}>
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
                y1={activeMode === 'analyzing' || activeMode === 'inspect' ? '27.5' : '28.5'}
                x2="54"
                y2={activeMode === 'analyzing' || activeMode === 'inspect' ? '29.8' : '28'}
                stroke="#FAF6EE"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="75.5"
                y1={activeMode === 'analyzing' || activeMode === 'inspect' ? '27.5' : '28.5'}
                x2="66"
                y2={activeMode === 'analyzing' || activeMode === 'inspect' ? '29.8' : '28'}
                stroke="#FAF6EE"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* Mouth / Phoneme Visor Wave */}
            {activeMode === 'analyzing' ? (
              <path
                ref={mouthWaveRef}
                d="M53 40.5Q56.5 37.5 60 40.5T67 40.5"
                stroke="#F5D78E"
                strokeWidth="2.2"
                strokeLinecap="round"
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
          </g>

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
        </g>
      </g>
    </svg>
  );
});

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

export const MaxiCriticalPartner: React.FC<MaxiCriticalPartnerProps> = React.memo(({
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
  const [isFloatingHovered, setIsFloatingHovered] = useState(false);
  const [showRigBones, setShowRigBones] = useState(false);

  // Ref-based 2D gaze offset (0 React re-renders on pointermove or scroll)
  const lookOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Viewport-locked drag state (100% immune to window.scrollY & Framer Motion projection bugs)
  const floatingWidgetRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragSessionRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    originX: number;
    originY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    isDragging: boolean;
  } | null>(null);
  const wasDraggedRef = useRef(false);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isTyping = input.trim().length > 0;

  // Apply viewport-clamped translate3d directly to floating widget DOM node
  const applyFloatingTransform = (x: number, y: number, scale = 1) => {
    const el = floatingWidgetRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale})`;
  };

  // Keep dragged widget inside viewport on window resize / mobile URL bar collapse
  useEffect(() => {
    const clampToViewport = () => {
      const el = floatingWidgetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const curX = dragOffsetRef.current.x;
      const curY = dragOffsetRef.current.y;
      const pad = 8;
      let nextX = curX;
      let nextY = curY;

      if (rect.left < pad) nextX += pad - rect.left;
      if (rect.right > window.innerWidth - pad) {
        nextX -= rect.right - (window.innerWidth - pad);
      }
      if (rect.top < pad) nextY += pad - rect.top;
      if (rect.bottom > window.innerHeight - pad) {
        nextY -= rect.bottom - (window.innerHeight - pad);
      }

      if (nextX !== curX || nextY !== curY) {
        dragOffsetRef.current = { x: nextX, y: nextY };
        applyFloatingTransform(nextX, nextY, 1);
      }
    };

    window.addEventListener('resize', clampToViewport, { passive: true });
    return () => window.removeEventListener('resize', clampToViewport);
  }, []);

  // Global cursor & scroll gaze tracking (updates lookOffsetRef directly with 0 re-renders)
  useEffect(() => {
    let lastScrollY = window.scrollY || 0;

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isOpen) return;
      const widgetEl = floatingWidgetRef.current;
      if (widgetEl) {
        const rect = widgetEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) / Math.max(window.innerWidth * 0.35, 180);
        const dy = (e.clientY - centerY) / Math.max(window.innerHeight * 0.35, 180);
        lookOffsetRef.current = {
          x: Math.max(-3.2, Math.min(3.2, dx * 3.2)),
          y: Math.max(-2.4, Math.min(2.4, dy * 2.4)),
        };
      }
    };

    const handleWindowScroll = () => {
      if (isOpen) return;
      const currentScrollY = window.scrollY || 0;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      if (Math.abs(deltaY) > 1) {
        lookOffsetRef.current = {
          x: lookOffsetRef.current.x * 0.9,
          y: Math.max(-2.4, Math.min(2.4, (deltaY > 0 ? 1.6 : -1.6))),
        };
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [isOpen]);

  const handleDialogPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 6;
    const normY = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 4.5;
    lookOffsetRef.current = {
      x: Math.max(-3.2, Math.min(3.2, normX)),
      y: Math.max(-2.4, Math.min(2.4, normY)),
    };
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages.length, isLoading, isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const handleBallPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const el = floatingWidgetRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const curX = dragOffsetRef.current.x;
    const curY = dragOffsetRef.current.y;
    const baseLeft = rect.left - curX;
    const baseTop = rect.top - curY;
    const pad = 8;

    dragSessionRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      originX: curX,
      originY: curY,
      minX: pad - baseLeft,
      maxX: window.innerWidth - pad - (baseLeft + rect.width),
      minY: pad - baseTop,
      maxY: window.innerHeight - pad - (baseTop + rect.height),
      isDragging: false,
    };
    wasDraggedRef.current = false;
  };

  const handleBallPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    const dx = e.clientX - session.startClientX;
    const dy = e.clientY - session.startClientY;

    if (!session.isDragging) {
      if (Math.hypot(dx, dy) <= 6) return;
      session.isDragging = true;
      wasDraggedRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture unavailable
      }
    }

    const clampedX = Math.max(session.minX, Math.min(session.maxX, session.originX + dx));
    const clampedY = Math.max(session.minY, Math.min(session.maxY, session.originY + dy));
    dragOffsetRef.current = { x: clampedX, y: clampedY };
    applyFloatingTransform(clampedX, clampedY, 1.04);
  };

  const handleBallPointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    if (session.isDragging) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore release errors
      }
    }
    dragSessionRef.current = null;
    applyFloatingTransform(
      dragOffsetRef.current.x,
      dragOffsetRef.current.y,
      isFloatingHovered ? 1.05 : 1
    );
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
      if (!response.ok) {
        const errCategory =
          data?.code ||
          (response.status === 400 || response.status === 422
            ? 'MALFORMED_REQUEST'
            : 'UPSTREAM_ERROR');

        const formattedError =
          errCategory === 'MALFORMED_REQUEST'
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
    const fallbackCopy = () => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        // Ignore fallback errors
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(fallbackCopy);
    } else {
      fallbackCopy();
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
      {/* Viewport-Fixed Draggable MAXI Companion (Zero scroll-offset drift on Vercel) */}
      <div
        ref={floatingWidgetRef}
        onPointerEnter={() => {
          setIsFloatingHovered(true);
          if (!dragSessionRef.current?.isDragging) {
            applyFloatingTransform(dragOffsetRef.current.x, dragOffsetRef.current.y, 1.06);
          }
        }}
        onPointerLeave={() => {
          setIsFloatingHovered(false);
          if (!dragSessionRef.current?.isDragging) {
            applyFloatingTransform(dragOffsetRef.current.x, dragOffsetRef.current.y, 1);
          }
        }}
        onPointerDown={handleBallPointerDown}
        onPointerMove={handleBallPointerMove}
        onPointerUp={handleBallPointerUpOrCancel}
        onPointerCancel={handleBallPointerUpOrCancel}
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
        className="fixed right-3 bottom-20 z-50 flex cursor-grab flex-col items-center select-none touch-none will-change-transform active:cursor-grabbing sm:right-5 sm:bottom-24"
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
            : 'MAXI'}
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
            pose={isFloatingHovered && !isOpen ? 'wave' : rigPose}
            lookOffsetRef={lookOffsetRef}
            showBones={showRigBones}
          />
        </div>
      </div>

      {/* MAXI Critical Thinking Partner Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6">
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
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              onPointerMove={handleDialogPointerMove}
              onPointerLeave={() => {
                lookOffsetRef.current = { x: 0, y: 0 };
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="maxi-dialog-title"
              className="parchment-box relative z-10 flex max-h-[76dvh] w-[92vw] max-w-[368px] flex-col overflow-hidden rounded-2xl border-[2.5px] border-[#091526] text-[#091526] shadow-[4px_5px_0px_#091526] sm:max-h-[86vh] sm:w-full sm:max-w-2xl sm:rounded-3xl sm:border-[3px] sm:shadow-[6px_8px_0px_#091526]"
            >
              {/* Top Header Bar */}
              <div className="maxi-header-light-text flex items-center justify-between gap-2 border-b-2 border-[#091526] bg-gradient-to-r from-[#E05A47] via-[#D94E3B] to-[#091526] px-3 py-2 text-[#FFFDF7] sm:gap-3 sm:px-5 sm:py-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <div className="h-9 w-9 shrink-0 sm:h-12 sm:w-12">
                    <Maxi2DRigCharacter
                      isOpen={true}
                      isLoading={isLoading}
                      isTyping={isTyping}
                      pose={rigPose}
                      lookOffsetRef={lookOffsetRef}
                      showBones={showRigBones}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h2
                        id="maxi-dialog-title"
                        className="maxi-header-light-text font-brush text-[15px] leading-tight tracking-wide text-[#FFFDF7] sm:truncate sm:text-2xl"
                      >
                        MAXI — Personal OS AI Partner
                      </h2>
                      <span className="maxi-header-badge hidden rounded-md border border-[#FFFDF7]/40 bg-[#091526] px-2 py-0.5 font-mono-num text-[10px] font-bold text-[#F5D78E] sm:inline-block">
                        2D Rig • Personal OS
                      </span>
                    </div>
                    <p className="maxi-header-light-text line-clamp-1 font-journal text-[9.5px] leading-snug font-semibold text-[#FFFDF7]/95 sm:truncate sm:text-xs">
                      {isId
                        ? 'Teman berpikir yang kritis, jujur, dan membantumu mengambil keputusan yang lebih baik.'
                        : 'Critical, honest thinking partner to help you see reality and make better decisions.'}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearSession}
                      className="maxi-header-light-text cursor-pointer rounded-lg border-[1.5px] border-[#FFFDF7]/70 bg-[#091526]/75 px-2 py-0.5 font-journal text-[9.5px] font-bold text-[#FFFDF7] transition-colors hover:bg-[#091526] sm:px-2.5 sm:py-1 sm:text-[10.5px]"
                    >
                      {isId ? 'Reset' : 'Clear'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label={isId ? 'Tutup Maxi' : 'Close Maxi'}
                    className="maxi-close-btn flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#091526] bg-[#FFFDF7] font-sans text-sm font-extrabold text-[#091526] shadow-[1.5px_1.5px_0px_#091526] transition-transform hover:scale-105 hover:bg-[#F5D78E] sm:h-8 sm:w-8 sm:text-base sm:shadow-[2px_2px_0px_#091526]"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Interactive 2D Skeletal Rig Animation Stage & Pose Controller Bar */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 border-b-2 border-[#091526] bg-[#FFF9EC] px-2.5 py-1.5 text-[#091526] sm:gap-2 sm:px-5 sm:py-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#091526] bg-[#F5D78E] px-1.5 py-0.5 font-mono-num text-[8.5px] font-extrabold text-[#091526] sm:px-2 sm:text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E05A47]" />
                    <span className="sm:hidden">2D RIG</span>
                    <span className="hidden sm:inline">2D RIG SYSTEM</span>
                  </span>
                  <span className="hidden font-journal text-[11px] font-bold text-[#1E2F47] sm:inline">
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
                        className={`cursor-pointer rounded-md border-[1.5px] border-[#091526] px-1.5 py-0.5 font-journal text-[9px] font-extrabold transition-all sm:rounded-lg sm:px-2 sm:text-[10px] ${
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
                    className={`cursor-pointer rounded-md border-[1.5px] border-[#091526] px-1.5 py-0.5 font-mono-num text-[9px] font-extrabold transition-all sm:rounded-lg sm:px-2 sm:text-[10px] ${
                      showRigBones
                        ? 'bg-[#091526] text-[#38BDF8] shadow-[1.5px_1.5px_0px_#E05A47]'
                        : 'bg-[#F5ECDC] text-[#091526] hover:bg-[#F5D78E]'
                    }`}
                  >
                    {showRigBones ? '🦴 ON' : '🦴 Rig'}
                  </button>
                </div>
              </div>

              {/* Conversation Body */}
              <div
                ref={chatScrollRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#F7EFE0] px-3 py-2.5 sm:space-y-4 sm:px-6 sm:py-4"
              >
                {messages.length === 0 ? (
                  <div className="space-y-2.5 sm:space-y-3.5">
                    <div className="sketch-note-card flex flex-row items-start gap-2.5 p-2.5 sm:gap-3.5 sm:p-4">
                      {/* Featured 2D Rig Character Showcase inside Empty State */}
                      <div className="flex shrink-0 flex-col items-center">
                        <div className="h-14 w-14 sm:h-24 sm:w-24">
                          <Maxi2DRigCharacter
                            isOpen={true}
                            isLoading={isLoading}
                            isTyping={isTyping}
                            pose={rigPose}
                            lookOffsetRef={lookOffsetRef}
                            showBones={showRigBones}
                          />
                        </div>
                        <span className="mt-1 rounded-full border border-[#091526] bg-[#F5D78E] px-1.5 py-0.5 font-mono-num text-[7.5px] font-extrabold text-[#091526] sm:mt-1.5 sm:px-2 sm:text-[9px]">
                          IK 2D RIG
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 text-left">
                        <p className="font-brush text-[15px] leading-snug text-[#091526] sm:text-xl">
                          {isId
                            ? '⚡ Ceritakan masalah, rencana, karier, atau keputusan uang/Web3 yang sedang kamu hadapi.'
                            : '⚡ Share the problem, plan, career move, or financial/Web3 decision you are facing.'}
                        </p>
                        <p className="mt-1 font-journal text-[10.5px] leading-relaxed text-[#1E2F47] sm:text-[13px]">
                          <span className="sm:hidden">
                            {isId
                              ? 'Maxi membantumu membedah akar masalah, menguji fakta & bias berpikir, menghitung risiko, serta menyusun langkah tindakan nyata.'
                              : 'Maxi helps dissect the root problem, verify facts, spot cognitive biases, weigh risks, and build concrete action steps.'}
                          </span>
                          <span className="hidden sm:inline">
                            {isId
                              ? 'Maxi menggunakan bahasa Indonesia yang sederhana, jelas, dan jujur untuk membantumu: (1) Pahami Masalahnya, (2) Periksa Fakta, (3) Temukan Kesalahan Berpikir, (4) Pilihan Masuk Akal, (5) Dampak Jangka Panjang, (6) Hitung Risiko & Keuntungan, (7) Cari Kelemahan Ide, (8) Pengembangan Hidup, (9) Analisis Karier, (10) Analisis Uang & Crypto/Web3, (11) Ubah Menjadi Tindakan, hingga (12) Evaluasi Keputusan.'
                              : 'Maxi uses clear, honest, and grounded analysis to help you understand the root problem, verify facts, spot thinking errors, weigh realistic options, calculate long-term impact & risks, and turn analysis into concrete action.'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Quick Test Prompts */}
                    <div>
                      <p className="mb-1.5 font-journal text-[10px] font-extrabold tracking-wide text-[#7C4A08] uppercase sm:mb-2 sm:text-[11px]">
                        {isId
                          ? 'Uji Studi Kasus Cepat (Klik untuk Bedah Kritis):'
                          : 'Quick Case Studies (Click to Red-Team):'}
                      </p>
                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:gap-2">
                        {QUICK_PROMPTS.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              submitPrompt(isId ? item.promptId : item.promptEn)
                            }
                            className="cursor-pointer rounded-xl border-2 border-[#091526] bg-[#FFFDF7] px-2.5 py-1.5 text-left font-journal text-[11px] font-bold text-[#091526] shadow-[2px_2px_0px_#091526] transition-all hover:-translate-y-0.5 hover:bg-[#F5D78E]/45 sm:p-2.5 sm:text-xs sm:shadow-[2px_3px_0px_#091526]"
                          >
                            <span className="mr-1 inline font-extrabold text-[#E05A47] sm:mr-0 sm:block">
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
                        className={`max-w-[95%] rounded-2xl border-2 border-[#091526] px-3 py-2 shadow-[2.5px_2.5px_0px_#091526] sm:max-w-[90%] sm:px-4 sm:py-3 sm:shadow-[3px_3px_0px_#091526] ${
                          msg.role === 'user'
                            ? isDay
                              ? 'maxi-user-textbox bg-[#FDE6A8] text-[#091526]'
                              : 'bg-[#122847] text-[#FFFDF7]'
                            : 'maxi-model-textbox bg-[#FFFDF9] text-[#091526]'
                        }`}
                      >
                        <div
                          className={`mb-1 flex items-center justify-between gap-2 border-b pb-1 text-[9.5px] font-extrabold sm:gap-3 sm:text-[10px] ${
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
                            className={`whitespace-pre-wrap text-left font-journal text-[11.5px] leading-relaxed font-semibold sm:text-[13px] ${
                              isDay ? 'text-[#091526]' : 'text-[#FFFDF7]'
                            }`}
                          >
                            {msg.text}
                          </p>
                        ) : (
                          <>
                            <FormattedMaxiResponse text={msg.text} />
                            <div className="mt-2 flex justify-end border-t border-[#091526]/15 pt-1.5 sm:mt-2.5">
                              <button
                                type="button"
                                onClick={() => handleCopyReply(msg.text)}
                                className="cursor-pointer rounded-lg border border-[#091526] bg-[#F5ECDC] px-2 py-0.5 font-journal text-[9.5px] font-bold text-[#091526] hover:bg-[#F5D78E] sm:px-2.5 sm:text-[10px]"
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
                    <div className="maxi-model-textbox rounded-2xl border-2 border-[#091526] bg-[#FFFDF9] px-3 py-2.5 shadow-[2.5px_2.5px_0px_#091526] sm:px-4 sm:py-3 sm:shadow-[3px_3px_0px_#091526]">
                      <div className="flex items-center gap-2 font-journal text-[11px] font-bold text-[#091526] sm:gap-2.5 sm:text-xs">
                        <span className="inline-block h-2 w-2 shrink-0 animate-ping rounded-full bg-[#E05A47] sm:h-2.5 sm:w-2.5" />
                        <span>
                          {isId
                            ? 'Maxi sedang membedah asumsi, bias, & skenario terburuk...'
                            : 'Maxi is dissecting assumptions, biases & worst-case scenarios...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="rounded-xl border-2 border-[#E05A47] bg-[#FFF5F5] px-3 py-2 font-journal text-[11px] font-bold text-[#991B1B] sm:px-3.5 sm:py-2.5 sm:text-xs">
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
                className="maxi-input-footer border-t-2 border-[#091526] bg-[#EFE3CE] px-3 py-2 sm:px-5 sm:py-3"
              >
                <div className="flex items-end gap-2 sm:gap-2.5">
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
                        ? 'Tulis keputusan, rencana Web3, karier, atau masalahmu...'
                        : 'Describe your decision, Web3 thesis, or dilemma...'
                    }
                    className="sketch-input maxi-input-textarea max-h-24 min-h-[40px] flex-1 resize-none bg-[#FFFFFF] px-2.5 py-1.5 font-journal text-[11.5px] font-semibold text-[#091526] placeholder:text-[#52657C] focus:bg-[#FFFDF9] sm:max-h-32 sm:min-h-[48px] sm:px-3.5 sm:py-2.5 sm:text-[13px]"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="sketch-pill-dark shrink-0 cursor-pointer px-3 py-2 font-journal text-[11px] font-bold text-[#FAF6EE] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
                  >
                    {isLoading
                      ? isId
                        ? 'Membedah...'
                        : 'Analyzing...'
                      : isId
                        ? 'Bedah →'
                        : 'Analyze →'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});
