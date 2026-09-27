import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CrownDoodle,
  ChibiMiniAvatar,
  HandXIcon,
  HandGithubIcon,
  HandEmailIcon,
  GENERATED_ASSETS,
} from './SketchIllustrations';

const CloseIconSvg: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5 5L15 15M15 5L5 15"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 3D Sketchbook Page-Turn / Page-Opening Shell
 * Simulates physically opening a bound Web3 explorer journal page from its left spine
 * with an underlying paper stack, turning cover leaf, spine binder rings, and page-curl shadow sweep.
 */
const JournalPageOpenShell: React.FC<{
  pageKey: string;
  children: React.ReactNode;
}> = ({ pageKey, children }) => (
  <div
    className="relative flex w-full max-w-2xl items-center justify-center"
    style={{ perspective: '1600px' }}
    onClick={(e) => e.stopPropagation()}
  >
    {/* Stacked Underlying Journal Pages (gives physical book depth behind the opening page) */}
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: 1.5 }}
      animate={{ opacity: 1, scale: 1, rotate: 1.1 }}
      exit={{ opacity: 0, scale: 0.94, rotate: 0.5, transition: { duration: 0.24 } }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 rounded-[26px_22px_28px_24px] border-2 border-[#091526] bg-[#D9C9B0] shadow-[0_24px_48px_rgba(2,7,15,0.85)]"
      aria-hidden="true"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.94, rotate: -0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: -0.5 }}
      exit={{ opacity: 0, scale: 0.95, rotate: 0, transition: { duration: 0.22 } }}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute inset-0 translate-x-1 translate-y-1 rounded-[26px_22px_28px_24px] border-2 border-[#091526] bg-[#E5D7C1]"
      aria-hidden="true"
    />

    {/* Turning Front Cover Leaf that swings open to the left along the spine */}
    <motion.div
      key={`${pageKey}-turning-leaf`}
      style={{ transformOrigin: '0% 50%', transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0.95, rotateY: -6, scaleY: 0.98 }}
      animate={{
        opacity: [0.95, 0.65, 0],
        rotateY: [-6, -78, -128],
        scaleY: [0.98, 1, 0.97],
      }}
      exit={{
        opacity: [0, 0.55, 0],
        rotateY: [-110, -35, 0],
        transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={{ duration: 0.62, times: [0, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute inset-0 z-30 rounded-[26px_22px_28px_24px] border-2 border-[#091526] bg-gradient-to-r from-[#091526] via-[#EFE5D4] to-[#DFD1BA] shadow-2xl"
      aria-hidden="true"
    />

    {/* Main Active Journal Page Unfolding from Spine */}
    <motion.div
      key={pageKey}
      style={{ transformOrigin: '0% 50%', transformStyle: 'preserve-3d' }}
      initial={{
        opacity: 0,
        rotateY: -68,
        rotateX: 5,
        rotateZ: -1.2,
        scale: 0.91,
        x: -14,
      }}
      animate={{
        opacity: 1,
        rotateY: 0,
        rotateX: 0,
        rotateZ: 0,
        scale: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        rotateY: -54,
        rotateX: 4,
        rotateZ: -0.8,
        scale: 0.93,
        x: -10,
        transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={{
        duration: 0.62,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="parchment-box relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-[26px_22px_28px_24px] border-2 border-[#0B192C] p-5 pl-7 text-[#0B192C] shadow-2xl sm:max-h-[90vh] sm:p-6 sm:pl-9 md:p-8 md:pl-10"
    >
      {/* Dynamic Page-Curl Shadow Sweep across the Parchment as it opens */}
      <motion.div
        initial={{ opacity: 0.85, x: '0%' }}
        animate={{ opacity: 0, x: '100%' }}
        transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-[#091526]/45 via-[#091526]/15 to-transparent"
        aria-hidden="true"
      />

      {/* Permanent Left Journal Spine Crease & Hand-Drawn Binder Rings */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-5 flex-col items-center justify-evenly bg-gradient-to-r from-[#091526]/18 via-[#8C765A]/10 to-transparent py-6 sm:w-6"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4, 5].map((ringIdx) => (
          <div key={ringIdx} className="relative flex items-center">
            <span className="h-2.5 w-2.5 rounded-full border-[1.8px] border-[#091526] bg-[#FAF6EE] shadow-2xs" />
            <span className="-ml-3 h-1 w-3.5 rounded-full bg-[#091526]" />
          </div>
        ))}
      </div>

      {/* Subtle Ruled Journal Background Texture Lines */}
      <svg
        viewBox="0 0 600 420"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-25"
        aria-hidden="true"
      >
        <path
          d="M36 96H576M36 160H576M36 224H576M36 288H576M36 352H576"
          stroke="#8C765A"
          strokeWidth="1"
          strokeDasharray="5 7"
        />
      </svg>

      {/* Bottom-Right Dog-Ear Curled Page Corner */}
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className="pointer-events-none right-0 bottom-0 absolute z-20 h-7 w-7 sm:h-8 sm:w-8"
        aria-hidden="true"
      >
        <path d="M36 0L0 36H36V0Z" fill="#D5C4AA" />
        <path
          d="M36 0C22 2 14 10 0 36C12 32 24 28 36 36V0Z"
          fill="#FAF6EE"
          stroke="#091526"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      {/* Staggered Page Content Reveal */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.42, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex min-h-0 flex-1 flex-col"
      >
        {children}
      </motion.div>
    </motion.div>
  </div>
);

export type Language = 'id' | 'en';

export interface JournalEntryData {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  annotation: string;
  summary: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
  illustrationKey: keyof typeof GENERATED_ASSETS;
}

export const JOURNAL_ENTRIES_BY_LANG: Record<Language, Record<string, JournalEntryData>> = {
  en: {
    aptos: {
      id: 'aptos',
      category: 'Node Experience',
      title: 'Aptos Network',
      subtitle: 'Node Operator',
      annotation: 'Node Run The Chain',
      summary:
        'Operating and maintaining high-availability full node infrastructure on the Aptos Move-based Layer 1 network, ensuring consistent state synchronization, low-latency peer connectivity, and continuous telemetry monitoring.',
      highlights: [
        'Run full node with automated health-check & failover scripts',
        'Monitor & maintain validator/fullnode sync parity across epoch upgrades',
        'Support network stability through prompt binary updates and peer tuning',
      ],
      metrics: [
        { label: 'Uptime Record', value: '99.94%' },
        { label: 'Storage Layer', value: 'NVMe RAID-0' },
        { label: 'Network Role', value: 'Full Node' },
      ],
      illustrationKey: 'nodeOperatorImg',
    },
    sei: {
      id: 'sei',
      category: 'Node Experience',
      title: 'Sei Network',
      subtitle: 'Node Operator',
      annotation: 'Good Nodes Good Future',
      summary:
        'Running dedicated node infrastructure on Sei Network, the parallelized EVM and trading-optimized Layer 1 blockchain, focusing on rapid block propagation, state-sync snapshots, and ecosystem reliability.',
      highlights: [
        'Run full node optimized for high-frequency block finality',
        'Sync & monitoring with Prometheus + Grafana alerting pipelines',
        'Contribute to ecosystem testing, upgrades, and community node guides',
      ],
      metrics: [
        { label: 'Block Finality', value: '< 400ms' },
        { label: 'Sync Status', value: 'Active / Synced' },
        { label: 'Network Role', value: 'Full Node' },
      ],
      illustrationKey: 'nodeOperatorImg',
    },
    subquery: {
      id: 'subquery',
      category: 'Node Experience',
      title: 'SubQuery Network',
      subtitle: 'Node Operator',
      annotation: 'Data Indexing The Multi-Chain',
      summary:
        'Operating decentralized indexer node infrastructure on SubQuery Network to index, transform, and serve fast GraphQL on-chain data queries for multi-chain dApps and builders.',
      highlights: [
        'Run indexer node with containerized Docker & Postgres orchestration',
        'Process on-chain data across multiple supported Web3 networks',
        'Support data infrastructure with high query reliability and low latency',
      ],
      metrics: [
        { label: 'Indexed Queries', value: '250K+ Served' },
        { label: 'SLA Score', value: '99.8%' },
        { label: 'Network Role', value: 'Indexer Node' },
      ],
      illustrationKey: 'nodeOperatorImg',
    },
    airdrop: {
      id: 'airdrop',
      category: 'Web3 Activity',
      title: 'Airdrop Hunter',
      subtitle: 'Early Ecosystem Participant',
      annotation: 'Free Tokens = Freedom',
      summary:
        'Systematically researching and participating in early-stage DeFi protocols, Layer 1 / Layer 2 ecosystems, restaking platforms, and modular blockchain campaigns before token generation events.',
      highlights: [
        'Follow latest project launches, seed rounds, and ecosystem grants',
        'Complete quests & tasks across Galxe, Layer3, Zealy, and native on-chain dApps',
        'Farm early opportunities with disciplined gas management and wallet hygiene',
      ],
      metrics: [
        { label: 'Campaigns Tracked', value: '1,000+' },
        { label: 'Chains Explored', value: '25+ Ecosystems' },
        { label: 'Focus', value: 'On-Chain Interaction' },
      ],
      illustrationKey: 'heroChibiImg',
    },
    memecoin: {
      id: 'memecoin',
      category: 'Web3 Activity',
      title: 'Meme Coin Trader',
      subtitle: 'On-Chain Trend & Liquidity Trader',
      annotation: 'Meme Culture → Profit',
      summary:
        'Analyzing on-chain narrative shifts, DEX liquidity flows, and community momentum across Solana, Base, and Ethereum while enforcing strict position sizing and take-profit rules.',
      highlights: [
        'Spot early trends by tracking social velocity and smart-wallet flows',
        'Manage risk using strict stop-loss rules and principal recovery targets',
        'Ride the hype (responsibly) without over-exposing core portfolio capital',
      ],
      metrics: [
        { label: 'Risk Discipline', value: 'Strict Sizing' },
        { label: 'Primary DEXs', value: 'Raydium / Uniswap' },
        { label: 'Strategy', value: 'Narrative & Volume' },
      ],
      illustrationKey: 'peekingBottomImg',
    },
    testnet: {
      id: 'testnet',
      category: 'Web3 Activity',
      title: 'Testnet Explorer',
      subtitle: 'Early Protocol Tester & Contributor',
      annotation: 'Web3 Friends = More Opportunities',
      summary:
        'Hands-on testing of pre-mainnet protocols, bridges, DEXs, and consensus clients—submitting actionable bug reports, stress-testing smart contracts, and helping teams refine UX.',
      highlights: [
        'Join new projects from devnet and incentivized testnet phases',
        'Test features including cross-chain bridges, staking, and governance',
        'Get early access & rewards while building deep technical familiarity',
      ],
      metrics: [
        { label: 'Testnets Joined', value: '100+' },
        { label: 'Years Active', value: '3+ Years' },
        { label: 'Feedback Submitted', value: 'Bug Reports & UX' },
      ],
      illustrationKey: 'backpackWalkerImg',
    },
  },
  id: {
    aptos: {
      id: 'aptos',
      category: 'Pengalaman Node',
      title: 'Aptos Network',
      subtitle: 'Operator Node',
      annotation: 'Node Run The Chain',
      summary:
        'Mengoperasikan dan memelihara infrastruktur full node berkinerja tinggi di jaringan Layer 1 Aptos berbasis Move, memastikan sinkronisasi state yang konsisten, konektivitas peer berlatensi rendah, dan pemantauan telemetri berkelanjutan.',
      highlights: [
        'Menjalankan full node dengan skrip health-check & failover otomatis',
        'Memantau & menjaga keselarasan sinkronisasi di setiap pembaruan epoch',
        'Mendukung stabilitas jaringan melalui pembaruan binary tepat waktu dan optimasi peer',
      ],
      metrics: [
        { label: 'Rekor Uptime', value: '99.94%' },
        { label: 'Lapisan Storage', value: 'NVMe RAID-0' },
        { label: 'Peran Jaringan', value: 'Full Node' },
      ],
      illustrationKey: 'nodeOperatorImg',
    },
    sei: {
      id: 'sei',
      category: 'Pengalaman Node',
      title: 'Sei Network',
      subtitle: 'Operator Node',
      annotation: 'Good Nodes Good Future',
      summary:
        'Menjalankan infrastruktur node khusus di Sei Network, blockchain Layer 1 paralel yang dioptimalkan untuk kecepatan transaksi, dengan fokus pada propagasi blok cepat, state-sync snapshot, dan keandalan ekosistem.',
      highlights: [
        'Menjalankan full node yang dioptimalkan untuk finalitas blok frekuensi tinggi',
        'Sinkronisasi & pemantauan menggunakan pipeline peringatan Prometheus + Grafana',
        'Berkontribusi pada pengujian ekosistem, upgrade jaringan, dan panduan komunitas',
      ],
      metrics: [
        { label: 'Finalitas Blok', value: '< 400ms' },
        { label: 'Status Sinkronisasi', value: 'Aktif / Tersinkron' },
        { label: 'Peran Jaringan', value: 'Full Node' },
      ],
      illustrationKey: 'nodeOperatorImg',
    },
    subquery: {
      id: 'subquery',
      category: 'Pengalaman Node',
      title: 'SubQuery Network',
      subtitle: 'Operator Node',
      annotation: 'Data Indexing The Multi-Chain',
      summary:
        'Mengoperasikan infrastruktur node indexer terdesentralisasi di SubQuery Network untuk mengindeks, mengolah, dan menyajikan kueri data on-chain GraphQL yang cepat bagi dApps dan pengembang multi-chain.',
      highlights: [
        'Menjalankan node indexer dengan orkestrasi kontainer Docker & Postgres',
        'Memproses data on-chain di berbagai jaringan Web3 yang didukung',
        'Mendukung infrastruktur data dengan keandalan kueri tinggi dan latensi rendah',
      ],
      metrics: [
        { label: 'Kueri Terindeks', value: '250K+ Dilayani' },
        { label: 'Skor SLA', value: '99.8%' },
        { label: 'Peran Jaringan', value: 'Indexer Node' },
      ],
      illustrationKey: 'nodeOperatorImg',
    },
    airdrop: {
      id: 'airdrop',
      category: 'Aktivitas Web3',
      title: 'Airdrop Hunter',
      subtitle: 'Partisipan Awal Ekosistem',
      annotation: 'Free Tokens = Freedom',
      summary:
        'Secara sistematis meneliti dan berpartisipasi dalam protokol DeFi tahap awal, ekosistem Layer 1 / Layer 2, platform restaking, dan kampanye blockchain modular sebelum peluncuran token (TGE).',
      highlights: [
        'Mengikuti peluncuran proyek terbaru, pendanaan awal, dan hibah ekosistem',
        'Menyelesaikan quest & tugas di Galxe, Layer3, Zealy, dan dApps on-chain',
        'Menggarap peluang awal dengan manajemen gas yang disiplin dan keamanan dompet',
      ],
      metrics: [
        { label: 'Kampanye Diikuti', value: '1,000+' },
        { label: 'Chain Dijelajahi', value: '25+ Ekosistem' },
        { label: 'Fokus Utama', value: 'Interaksi On-Chain' },
      ],
      illustrationKey: 'heroChibiImg',
    },
    memecoin: {
      id: 'memecoin',
      category: 'Aktivitas Web3',
      title: 'Meme Coin Trader',
      subtitle: 'Trader Tren & Likuiditas On-Chain',
      annotation: 'Meme Culture → Profit',
      summary:
        'Menganalisis pergeseran narasi on-chain, arus likuiditas DEX, dan momentum komunitas di Solana, Base, serta Ethereum sambil menerapkan ukuran posisi dan aturan ambil-untung yang disiplin.',
      highlights: [
        'Mendeteksi tren awal dengan memantau kecepatan sosial dan pergerakan smart-wallet',
        'Mengelola risiko menggunakan aturan stop-loss ketat dan pengamanan modal utama',
        'Mengikuti momentum hype secara bijak tanpa mempertaruhkan portofolio inti',
      ],
      metrics: [
        { label: 'Disiplin Risiko', value: 'Terukur Ketat' },
        { label: 'DEX Utama', value: 'Raydium / Uniswap' },
        { label: 'Strategi', value: 'Narasi & Volume' },
      ],
      illustrationKey: 'peekingBottomImg',
    },
    testnet: {
      id: 'testnet',
      category: 'Aktivitas Web3',
      title: 'Testnet Explorer',
      subtitle: 'Penguji Protokol Awal & Kontributor',
      annotation: 'Web3 Friends = More Opportunities',
      summary:
        'Menguji langsung protokol pra-mainnet, bridge lintas chain, DEX, dan klien konsensus—mengirimkan laporan bug, menguji ketahanan smart contract, serta membantu tim menyempurnakan UX.',
      highlights: [
        'Bergabung di proyek baru sejak fase devnet dan incentivized testnet',
        'Menguji fitur seperti cross-chain bridge, staking, dan tata kelola (governance)',
        'Mendapatkan akses awal & reward sekaligus membangun pemahaman teknis mendalam',
      ],
      metrics: [
        { label: 'Testnet Diikuti', value: '100+' },
        { label: 'Tahun Aktif', value: '3+ Tahun' },
        { label: 'Kontribusi', value: 'Laporan Bug & UX' },
      ],
      illustrationKey: 'backpackWalkerImg',
    },
  },
};

interface DetailModalProps {
  entry: JournalEntryData | null;
  lang?: Language;
  onClose: () => void;
  onConnectClick: () => void;
}

export const JournalDetailModal: React.FC<DetailModalProps> = ({
  entry,
  lang = 'id',
  onClose,
  onConnectClick,
}) => {
  useEffect(() => {
    if (!entry) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [entry, onClose]);

  const isId = lang === 'id';

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          key="detail-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#040B14]/80 p-3 sm:p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="journal-entry-title"
        >
          <JournalPageOpenShell pageKey={entry.id}>
            {/* Pinned Top bar */}
            <div className="flex shrink-0 items-start justify-between gap-3 border-b-2 border-dashed border-[#0B192C]/25 pb-3.5 sm:gap-4 sm:pb-4">
              <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                <ChibiMiniAvatar className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
                <div className="min-w-0">
                  <div className="truncate font-journal text-[11px] font-semibold tracking-wide text-[#2A4B78] sm:text-xs">
                    {entry.category} · {entry.annotation}
                  </div>
                  <h3
                    id="journal-entry-title"
                    className="font-brush text-2xl leading-tight text-[#091526] sm:text-3xl md:text-4xl"
                  >
                    {entry.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="sketch-pill-dark flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 font-journal text-xs font-bold text-[#FAF6EE] sm:px-4 sm:text-sm"
                aria-label={isId ? 'Tutup kartu' : 'Close card'}
              >
                <CloseIconSvg className="h-3.5 w-3.5 text-[#F5D78E] sm:h-4 sm:w-4" />
                <span>{isId ? 'Tutup' : 'Close'}</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="mt-4 flex-1 overflow-y-auto pr-1 sm:mt-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
                <div className="md:col-span-7">
                  <p className="font-journal text-sm leading-relaxed text-[#162842] md:text-[15px]">
                    {entry.summary}
                  </p>
                  <h4 className="mt-4 font-brush text-xl text-[#091526]">
                    {isId ? 'Catatan Utama:' : 'Key Field Notes:'}
                  </h4>
                  <ul className="mt-2 space-y-2 font-journal text-sm text-[#122238]">
                    {entry.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-[#091526]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Artwork & Metrics */}
                <div className="flex flex-col justify-between rounded-2xl bg-[#091525] p-4 text-[#F3EBDD] md:col-span-5">
                  <div className="relative overflow-hidden rounded-xl bg-[#091525]">
                    <img
                      src={GENERATED_ASSETS[entry.illustrationKey]}
                      alt={entry.title}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      referrerPolicy="no-referrer"
                      className="mx-auto h-32 w-full object-contain sm:h-36"
                    />
                  </div>
                  <div className="mt-3 space-y-2 border-t border-[#2A4B78]/60 pt-3">
                    {entry.metrics.map((m, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate text-[#9BB8DF]">{m.label}</span>
                        <span className="font-mono-num shrink-0 text-right font-semibold text-[#F5EFE6]">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Footer actions */}
            <div className="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-[#0B192C]/25 pt-3.5 sm:mt-5 sm:pt-4">
              <div className="hidden items-center gap-2 font-journal text-xs font-semibold text-[#1E385B] sm:flex">
                <span>— Uray Fazli Alman • Web3 Adventure Journal —</span>
                <CrownDoodle className="h-4 w-5" color="#091526" />
              </div>
              <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-full border-2 border-[#091526] bg-[#FFF9EE] px-4 py-1.5 font-journal text-xs font-bold text-[#091526] transition-colors hover:bg-[#E5D8C3] sm:text-sm"
                >
                  {isId ? 'Tutup' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onConnectClick();
                  }}
                  className="cursor-pointer rounded-full bg-[#091526] px-5 py-2 font-journal text-xs font-semibold text-[#F3EBDD] transition-transform hover:-translate-y-0.5 sm:text-sm"
                >
                  {isId ? 'Diskusi Kolaborasi →' : 'Discuss Collaboration →'}
                </button>
              </div>
            </div>
          </JournalPageOpenShell>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ConnectModalProps {
  isOpen: boolean;
  lang?: Language;
  onClose: () => void;
  onCopyText: (label: string, value: string) => void;
}

export const ConnectJournalModal: React.FC<ConnectModalProps> = ({
  isOpen,
  lang = 'id',
  onClose,
  onCopyText,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderHandle, setSenderHandle] = useState('');
  const [topic, setTopic] = useState('Node Infrastructure');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const isId = lang === 'id';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const channels = [
    {
      label: 'X (Twitter)',
      handle: '@urayfazli17',
      href: 'https://x.com/urayfazli17',
      icon: <HandXIcon className="h-4 w-4" />,
    },
    {
      label: 'GitHub',
      handle: '@urayfazli',
      href: 'https://github.com/urayfazli',
      icon: <HandGithubIcon className="h-4 w-4" />,
    },
    {
      label: 'Email',
      handle: 'fazliuray@gmail.com',
      copyValue: 'fazliuray@gmail.com',
      icon: <HandEmailIcon className="h-4 w-4" />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="connect-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#040B14]/80 p-3 sm:p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="connect-modal-title"
        >
          <JournalPageOpenShell pageKey="connect-modal-card">
        {/* Pinned Top bar */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b-2 border-dashed border-[#0B192C]/25 pb-3.5 sm:items-center sm:gap-4 sm:pb-4">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <ChibiMiniAvatar className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
            <div className="min-w-0">
              <h3
                id="connect-modal-title"
                className="font-brush text-2xl leading-tight text-[#091526] sm:text-3xl md:text-4xl"
              >
                {isId ? 'Mari Terhubung & Berkolaborasi' : "Let's Connect & Build Together"}
              </h3>
              <p className="font-journal text-[11px] text-[#233F6B] sm:text-xs">
                {isId
                  ? 'Kanal kontak langsung & kolaborasi Web3 bersama Uray Fazli Alman'
                  : 'Direct channels & Web3 collaboration dispatch for Uray Fazli Alman'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="sketch-pill-dark flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 font-journal text-xs font-bold text-[#FAF6EE] sm:px-4 sm:text-sm"
            aria-label={isId ? 'Tutup modal' : 'Close modal'}
          >
            <CloseIconSvg className="h-3.5 w-3.5 text-[#F5D78E] sm:h-4 sm:w-4" />
            <span>{isId ? 'Tutup' : 'Close'}</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1 sm:mt-5">
          {/* Direct Channels Grid */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {channels.map((ch) => (
              <div
                key={ch.label}
                className="flex items-center justify-between rounded-xl bg-[#091526] px-3.5 py-2.5 text-[#F3EBDD]"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="shrink-0 text-[#F5D78E]">{ch.icon}</span>
                  <div className="truncate">
                    <div className="font-journal text-[11px] text-[#9BB8DF]">{ch.label}</div>
                    <div className="font-mono-num truncate text-xs font-semibold text-[#F5EFE6]">
                      {ch.handle}
                    </div>
                  </div>
                </div>
                {ch.copyValue ? (
                  <button
                    type="button"
                    onClick={() => onCopyText(ch.label, ch.copyValue!)}
                    className="ml-2 shrink-0 cursor-pointer rounded-lg border border-[#3A629C] bg-[#122644] px-2.5 py-1 font-journal text-xs text-[#F3EBDD] hover:bg-[#1B3761]"
                  >
                    {isId ? 'Salin' : 'Copy'}
                  </button>
                ) : (
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 shrink-0 rounded-lg border border-[#3A629C] bg-[#122644] px-2.5 py-1 font-journal text-xs text-[#F3EBDD] hover:bg-[#1B3761]"
                  >
                    {isId ? 'Buka ↗' : 'Open ↗'}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Journal Note Form */}
          <div className="mt-5 border-t-2 border-dashed border-[#0B192C]/25 pt-4 sm:mt-6 sm:pt-5">
            {submitted ? (
              <div className="rounded-2xl bg-[#091526] p-5 text-center text-[#F3EBDD]">
                <CrownDoodle className="mx-auto mb-2 h-7 w-8" color="#F5D78E" />
                <h4 className="font-brush text-2xl text-[#F5EFE6]">
                  {isId
                    ? 'Pesan Tercatat di Jurnal Explorer!'
                    : 'Message Logged in Explorer Journal!'}
                </h4>
                <p className="mt-1 font-journal text-sm text-[#B8C9DF]">
                  {isId
                    ? `Terima kasih, ${senderName}! Uray Fazli Alman akan menghubungi melalui ${
                        senderHandle || 'kontak Anda'
                      } terkait ${topic}.`
                    : `Thanks, ${senderName}! Uray Fazli Alman will reach out via ${
                        senderHandle || 'your contact channel'
                      } regarding ${topic}.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSenderName('');
                    setSenderHandle('');
                    setMessage('');
                  }}
                  className="sketch-pill mt-4 cursor-pointer px-5 py-1.5 font-journal text-xs font-semibold text-[#F3EBDD]"
                >
                  {isId ? 'Kirim Catatan Lain' : 'Send Another Note'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h4 className="font-brush text-2xl text-[#091526]">
                    {isId ? 'Tinggalkan Catatan Kolaborasi' : 'Leave a Quick Collaboration Note'}
                  </h4>
                  <span className="font-journal text-xs text-[#233F6B]">
                    Node • Testnet • Airdrop Alpha
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder={isId ? 'Nama / Alias Anda' : 'Your Name / Alias'}
                    className="rounded-xl border-2 border-[#091526]/30 bg-[#FFF9EE] px-3.5 py-2 font-journal text-sm text-[#091526] placeholder-[#091526]/50 focus:border-[#091526] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={senderHandle}
                    onChange={(e) => setSenderHandle(e.target.value)}
                    placeholder="X / Email / GitHub"
                    className="rounded-xl border-2 border-[#091526]/30 bg-[#FFF9EE] px-3.5 py-2 font-journal text-sm text-[#091526] placeholder-[#091526]/50 focus:border-[#091526] focus:outline-none"
                  />
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="rounded-xl border-2 border-[#091526]/30 bg-[#FFF9EE] px-3.5 py-2 font-journal text-sm text-[#091526] focus:border-[#091526] focus:outline-none"
                  >
                    <option value="Node Infrastructure">
                      {isId ? 'Infrastruktur Node' : 'Node Infrastructure'}
                    </option>
                    <option value="Testnet Exploration">
                      {isId ? 'Eksplorasi Testnet' : 'Testnet Exploration'}
                    </option>
                    <option value="Airdrop & Quest Alpha">Airdrop &amp; Quest Alpha</option>
                    <option value="Meme Coin & Community">
                      {isId ? 'Meme Coin & Komunitas' : 'Meme Coin & Community'}
                    </option>
                  </select>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                  <input
                    type="text"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isId
                        ? 'Ceritakan proyek, jaringan node, atau peluang kolaborasi...'
                        : 'Tell Uray about your project, node network, or opportunity...'
                    }
                    className="flex-1 rounded-xl border-2 border-[#091526]/30 bg-[#FFF9EE] px-3.5 py-2 font-journal text-sm text-[#091526] placeholder-[#091526]/50 focus:border-[#091526] focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="cursor-pointer rounded-xl border-2 border-[#091526] bg-[#FFF9EE] px-4 py-2.5 font-journal text-xs font-bold text-[#091526] transition-colors hover:bg-[#E5D8C3] sm:text-sm"
                    >
                      {isId ? 'Tutup' : 'Close'}
                    </button>
                    <button
                      type="submit"
                      className="shrink-0 cursor-pointer rounded-xl bg-[#091526] px-5 py-2.5 font-journal text-xs font-semibold text-[#F3EBDD] transition-transform hover:-translate-y-0.5 sm:px-6 sm:text-sm"
                    >
                      {isId ? 'Kirim Pesan →' : 'Send Dispatch →'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
          </JournalPageOpenShell>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
