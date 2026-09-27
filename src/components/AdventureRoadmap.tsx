import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CrownDoodle,
  ChibiMiniAvatar,
  BackpackWalkerChibi,
  HandArrowRight,
  GoldBitcoinDoodle,
  EthereumCoinDoodle,
  SolanaCoinDoodle,
  MemeDogeCoinMiniDoodle,
  MiniAirdropParachuteDoodle,
  RocketSketchDoodle,
  HandDrawnCardCornerDoodles,
} from './SketchIllustrations';
import { Language } from './JournalModals';

export interface RoadmapMilestone {
  id: string;
  stepNumber: string;
  year: string;
  title: Record<Language, string>;
  tag: Record<Language, string>;
  shortDesc: Record<Language, string>;
  fullStory: Record<Language, string>;
  achievements: Record<Language, string[]>;
  metrics: { label: Record<Language, string>; value: string }[];
  journalEntryId: string;
  annotation: string;
  iconType: 'started' | 'testnet' | 'node' | 'airdrop' | 'future';
}

const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    id: 'started-web3',
    stepNumber: '01',
    year: '2022',
    title: {
      id: 'Started Web3',
      en: 'Started Web3',
    },
    tag: {
      id: 'Awal Petualangan On-Chain',
      en: 'First On-Chain Footsteps',
    },
    shortDesc: {
      id: 'Membuat wallet pertama, belajar transaksi DEX, & eksplorasi dasar DeFi.',
      en: 'Created first self-custody wallet, learned DEX swaps, & explored DeFi basics.',
    },
    fullStory: {
      id: 'Titik awal perjalanan di dunia Web3 dimulai dengan mempelajari keamanan self-custody wallet, memahami cara kerja gas fee, menavigasi bridge lintas jaringan, serta mencoba berbagai protokol DeFi generasi awal.',
      en: 'The adventure began by mastering self-custody wallet security, understanding gas mechanics, navigating cross-chain bridges, and experimenting with foundational DeFi protocols.',
    },
    achievements: {
      id: [
        'Menguasai manajemen dompet non-kustodian & keamanan transaksi on-chain',
        'Eksplorasi lebih dari 10 jaringan Layer 1 & Layer 2 sejak hari pertama',
        'Membangun fondasi riset mandiri (DYOR) untuk menyaring proyek potensial',
      ],
      en: [
        'Mastered non-custodial wallet hygiene & safe on-chain transaction signing',
        'Explored 10+ Layer 1 & Layer 2 ecosystems from the ground up',
        'Built a disciplined DYOR research workflow to filter high-signal projects',
      ],
    },
    metrics: [
      { label: { id: 'Fase Awal', en: 'Genesis Era' }, value: '2022' },
      { label: { id: 'Ekosistem Awal', en: 'Initial Chains' }, value: 'ETH · BNB · Polygon' },
      { label: { id: 'Status', en: 'Status' }, value: 'Completed ✓' },
    ],
    journalEntryId: 'roadmap-started',
    annotation: 'Day 1 Explorer!',
    iconType: 'started',
  },
  {
    id: 'testnet-voyage',
    stepNumber: '02',
    year: '2023',
    title: {
      id: '100+ Testnet Quest',
      en: '100+ Testnet Quest',
    },
    tag: {
      id: 'Eksplorasi Protokol Pra-Mainnet',
      en: 'Pre-Mainnet Protocol Testing',
    },
    shortDesc: {
      id: 'Aktif menguji 100+ jaringan devnet & incentivized testnet lebih awal.',
      en: 'Actively stress-tested 100+ devnets & incentivized testnets early.',
    },
    fullStory: {
      id: 'Menyelami puluhan ekosistem baru sebelum peluncuran mainnet—mulai dari menguji fitur cross-chain bridge, staking, hingga mengirimkan laporan bug & masukan UX langsung kepada tim pengembang.',
      en: 'Diving deep into emerging ecosystems prior to mainnet launch—testing cross-chain bridges, staking modules, and submitting actionable bug reports and UX feedback to core builders.',
    },
    achievements: {
      id: [
        'Berpartisipasi aktif di 100+ kampanye incentivized testnet & devnet',
        'Menguji ketahanan smart contract, dApps, dan likuiditas simulasi',
        'Meraih peran kontributor awal (Early Role / OG) di berbagai komunitas',
      ],
      en: [
        'Actively participated in 100+ incentivized testnet & devnet phases',
        'Stress-tested smart contracts, dApps, and simulated liquidity pools',
        'Earned early contributor & OG roles across multiple protocol communities',
      ],
    },
    metrics: [
      { label: { id: 'Testnet Diikuti', en: 'Testnets Joined' }, value: '100+ Networks' },
      { label: { id: 'Fokus Kontribusi', en: 'Contribution' }, value: 'QA & Bug Reports' },
      { label: { id: 'Status', en: 'Status' }, value: 'Completed ✓' },
    ],
    journalEntryId: 'roadmap-testnet',
    annotation: 'Early Tester Alpha',
    iconType: 'testnet',
  },
  {
    id: 'first-node',
    stepNumber: '03',
    year: '2023–2024',
    title: {
      id: 'First Node',
      en: 'First Node',
    },
    tag: {
      id: 'Infrastruktur Aptos, Sei & SubQuery',
      en: 'Aptos, Sei & SubQuery Infrastructure',
    },
    shortDesc: {
      id: 'Menjalankan full node & indexer node dengan uptime tinggi 99.9%+.',
      en: 'Deployed & maintained full nodes and indexers with 99.9%+ uptime.',
    },
    fullStory: {
      id: 'Melangkah lebih jauh ke sisi teknis dengan membangun server Linux sendiri untuk menjalankan full node dan indexer di jaringan Aptos, Sei Network, dan SubQuery—lengkap dengan pemantauan telemetri otomatis.',
      en: 'Leveled up into technical infrastructure by provisioning dedicated Linux servers to operate full nodes and indexers on Aptos, Sei Network, and SubQuery—complete with automated telemetry monitoring.',
    },
    achievements: {
      id: [
        'Menjaga rekor uptime 99.94% dengan skrip health-check & failover otomatis',
        'Mengelola sinkronisasi blok cepat di jaringan Aptos & Sei Network',
        'Melayani 250K+ kueri data on-chain melalui indexer node SubQuery',
      ],
      en: [
        'Maintained 99.94% uptime record with automated health-check & failover scripts',
        'Managed rapid block state synchronization on Aptos & Sei Network',
        'Served 250K+ on-chain GraphQL queries via SubQuery indexer node',
      ],
    },
    metrics: [
      { label: { id: 'Jaringan Utama', en: 'Core Networks' }, value: 'Aptos · Sei · SubQuery' },
      { label: { id: 'Rekor Uptime', en: 'Uptime SLA' }, value: '99.94%' },
      { label: { id: 'Status', en: 'Status' }, value: 'Active Node ✓' },
    ],
    journalEntryId: 'roadmap-node',
    annotation: 'Node Run The Chain!',
    iconType: 'node',
  },
  {
    id: 'airdrop-success',
    stepNumber: '04',
    year: '2024',
    title: {
      id: 'Airdrop Success',
      en: 'Airdrop Success',
    },
    tag: {
      id: 'Panen Alokasi & Momentum Meme Coin',
      en: 'Major Allocations & Meme Alpha',
    },
    shortDesc: {
      id: 'Berhasil memanen reward dari konsistensi garapan quest & narasi awal.',
      en: 'Harvested major rewards from consistent on-chain quests & early narratives.',
    },
    fullStory: {
      id: 'Konsistensi selama bertahun-tahun membuahkan hasil melalui pencapaian berbagai alokasi airdrop utama dan kesuksesan menangkap tren awal meme coin di ekosistem Solana, Base, serta Ethereum dengan manajemen risiko terukur.',
      en: 'Years of disciplined on-chain consistency paid off through multiple milestone airdrop allocations and catching early meme coin narrative waves across Solana, Base, and Ethereum with strict risk sizing.',
    },
    achievements: {
      id: [
        'Menyelesaikan 1.000+ quest on-chain dengan manajemen gas & dompet yang rapi',
        'Meraih alokasi reward dari partisipasi testnet, node, dan ekosistem DeFi',
        'Mengombinasikan hasil airdrop dengan rotasi tren meme coin secara disiplin',
      ],
      en: [
        'Completed 1,000+ on-chain quests with disciplined gas & wallet management',
        'Harvested token allocations from testnet, node, and DeFi ecosystem participation',
        'Combined airdrop rewards with disciplined early-narrative meme coin trading',
      ],
    },
    metrics: [
      { label: { id: 'Peluang Digarap', en: 'Quests Tracked' }, value: '1,000+ Campaigns' },
      { label: { id: 'Ekosistem Aktif', en: 'Active Chains' }, value: '25+ Networks' },
      { label: { id: 'Status', en: 'Status' }, value: 'Harvested ✓' },
    ],
    journalEntryId: 'roadmap-airdrop',
    annotation: 'Small Steps Big Bags!',
    iconType: 'airdrop',
  },
  {
    id: 'next-horizon',
    stepNumber: '05',
    year: '2025+',
    title: {
      id: 'Next Web3 Horizon',
      en: 'Next Web3 Horizon',
    },
    tag: {
      id: 'Ekspansi Node & Kolaborasi Global',
      en: 'Scaling Nodes & Open Collaboration',
    },
    shortDesc: {
      id: 'Ekspansi node modular generasi baru & kolaborasi bersama builder Web3.',
      en: 'Scaling next-gen modular nodes & collaborating with Web3 builders.',
    },
    fullStory: {
      id: 'Petualangan terus berlanjut! Fokus saat ini adalah memperluas infrastruktur validator/node ke blockchain modular & AI-chain terbaru, berburu alpha generasi berikutnya, serta membangun kemitraan strategis.',
      en: 'The journey continues! Currently focused on expanding node operations into next-gen modular & AI blockchains, hunting new ecosystem alpha, and building strategic collaborations across Web3.',
    },
    achievements: {
      id: [
        'Ekspansi infrastruktur node ke jaringan modular & restaking terbaru',
        'Riset harian narasi on-chain, likuiditas DEX, dan peluang insentif awal',
        'Terbuka untuk kolaborasi riset, komunitas, dan kemitraan ekosistem Web3',
      ],
      en: [
        'Expanding node infrastructure into emerging modular & restaking networks',
        'Daily research on on-chain narratives, DEX liquidity, and early incentives',
        'Open for research partnerships, community growth, and Web3 collaborations',
      ],
    },
    metrics: [
      { label: { id: 'Target Berikutnya', en: 'Next Focus' }, value: 'Modular & AI Chains' },
      { label: { id: 'Kolaborasi', en: 'Collaboration' }, value: 'Open 24/7' },
      { label: { id: 'Status', en: 'Status' }, value: 'In Progress 🚀' },
    ],
    journalEntryId: 'roadmap-horizon',
    annotation: 'Web3 No Limits!',
    iconType: 'future',
  },
];

/** Hand-drawn milestone badge icons */
const MilestoneSketchIcon: React.FC<{
  type: RoadmapMilestone['iconType'];
  isActive: boolean;
}> = ({ type, isActive }) => {
  const ringBg = isActive ? '#F5D78E' : '#FAF6EE';
  const stroke = '#091526';

  switch (type) {
    case 'started':
      return (
        <svg viewBox="0 0 52 52" fill="none" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
          <circle cx="26" cy="26" r="22" fill={ringBg} stroke={stroke} strokeWidth="2.6" />
          <circle cx="26" cy="26" r="15" fill="#FFF9EE" stroke={stroke} strokeWidth="2" />
          <path
            d="M22 30L25 21L34 18L31 27L22 30Z"
            fill="#E05A47"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="26" cy="26" r="2" fill={stroke} />
          <path d="M26 13V15M26 37V39M13 26H15M37 26H39" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'testnet':
      return (
        <svg viewBox="0 0 52 52" fill="none" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
          <circle cx="26" cy="26" r="22" fill={ringBg} stroke={stroke} strokeWidth="2.6" />
          <path
            d="M26 13L37 19.5V32.5L26 39L15 32.5V19.5L26 13Z"
            fill="#63A1F8"
            stroke={stroke}
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
          <path
            d="M15 19.5L26 26L37 19.5M26 26V39"
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="26" cy="19" r="2" fill="#FFF9EE" />
        </svg>
      );
    case 'node':
      return (
        <svg viewBox="0 0 52 52" fill="none" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
          <circle cx="26" cy="26" r="22" fill={ringBg} stroke={stroke} strokeWidth="2.6" />
          <rect x="15" y="15" width="22" height="9" rx="2.5" fill="#142B4B" stroke={stroke} strokeWidth="2.2" />
          <rect x="15" y="27" width="22" height="9" rx="2.5" fill="#1E3D6B" stroke={stroke} strokeWidth="2.2" />
          <circle cx="20" cy="19.5" r="1.7" fill="#4ADE80" />
          <circle cx="25" cy="19.5" r="1.7" fill="#F5D78E" />
          <circle cx="20" cy="31.5" r="1.7" fill="#4ADE80" />
          <circle cx="25" cy="31.5" r="1.7" fill="#63B3ED" />
          <path d="M30 19.5H34M30 31.5H34" stroke="#FAF6EE" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'airdrop':
      return (
        <svg viewBox="0 0 52 52" fill="none" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
          <circle cx="26" cy="26" r="22" fill={ringBg} stroke={stroke} strokeWidth="2.6" />
          <path
            d="M14 23C14 15 19 11 26 11C33 11 38 15 38 23C33 21 29 22 26 24C23 22 19 21 14 23Z"
            fill="#5C95EC"
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M17 23L23 32M35 23L29 32M26 23V32" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <rect x="20" y="31" width="12" height="9" rx="2" fill="#E8A838" stroke={stroke} strokeWidth="2.2" />
          <path d="M20 35.5H32M26 31V40" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case 'future':
    default:
      return (
        <svg viewBox="0 0 52 52" fill="none" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
          <circle cx="26" cy="26" r="22" fill={ringBg} stroke={stroke} strokeWidth="2.6" />
          <path
            d="M33 15C26 15 21 19 19 25L15 28L19 31L22 35L25 31C31 29 35 24 35 18C35 16 34 15 33 15Z"
            fill="#E05A47"
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="22" r="2.5" fill="#FFF9EE" stroke={stroke} strokeWidth="1.5" />
          <path d="M15 36C17 34 19 34 20 36C17 37 15 37 15 36Z" fill="#F5D78E" stroke={stroke} strokeWidth="1.8" />
        </svg>
      );
  }
};

interface AdventureRoadmapSectionProps {
  lang: Language;
  isDay?: boolean;
  onSelectEntry: (entryId: string) => void;
  onOpenConnect: () => void;
}

export const AdventureRoadmapSection: React.FC<AdventureRoadmapSectionProps> = ({
  lang,
  isDay = false,
  onSelectEntry,
  onOpenConnect,
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(2); // Default to 'First Node'
  const isId = lang === 'id';
  const activeMilestone = ROADMAP_MILESTONES[activeIdx] || ROADMAP_MILESTONES[0];

  // Progress ratio (0% to 100%) along the 5 milestones
  const progressPercent = (activeIdx / (ROADMAP_MILESTONES.length - 1)) * 100;

  return (
    <section
      id="roadmap"
      className="relative z-20 mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-4 pb-6 sm:px-8 lg:pt-5 lg:pb-8"
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HEADER ROW: Hand-Drawn Compass + "Adventure Roadmap" + Journey Controls
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, x: -18, y: 12 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 flex flex-col justify-between gap-3.5 sm:flex-row sm:items-end"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Hand-drawn Treasure Map Compass Rose Icon */}
          <svg
            viewBox="0 0 44 44"
            fill="none"
            className="h-9 w-9 shrink-0 text-[#F5D78E] sm:h-10 sm:w-10"
            aria-hidden="true"
          >
            <circle
              cx="22"
              cy="22"
              r="18"
              fill={isDay ? '#FFFDF8' : '#0B192E'}
              stroke="#FAF6EE"
              strokeWidth="2.4"
            />
            <circle
              cx="22"
              cy="22"
              r="14"
              stroke="#9BB8DF"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <path
              d="M22 7L25.5 18.5L37 22L25.5 25.5L22 37L18.5 25.5L7 22L18.5 18.5L22 7Z"
              fill="#F5D78E"
              stroke="#091526"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="22" cy="22" r="2.5" fill="#091526" />
          </svg>

          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <h2 className="font-brush text-3xl leading-none text-[#FAF6EE] sm:text-[36px]">
                Adventure Roadmap
              </h2>
              <CrownDoodle className="h-6 w-7 -rotate-6" color="#F5E1B5" />
              <span className="font-journal text-xs font-bold text-[#F5D78E] sm:text-[13px]">
                {isId ? '· Jejak Perjalanan Web3 (2022–2025+)' : '· Web3 Explorer Trail (2022–2025+)'}
              </span>
            </div>
            <svg
              viewBox="0 0 240 10"
              fill="none"
              className="mt-0.5 h-2.5 w-48 sm:w-56"
              aria-hidden="true"
            >
              <path
                d="M2 6C75 2 165 2 238 5.5"
                stroke="#FAF6EE"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Right: Interactive Step-by-Step Path Navigator */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
          <div className="hidden items-center gap-1.5 select-none xl:flex">
            <GoldBitcoinDoodle className="h-7 w-8" />
            <span className="-rotate-1 font-journal text-xs font-bold text-[#D2DFEE]">
              {isId
                ? 'Klik titik milestone di peta untuk membuka catatan!'
                : 'Click any milestone stop on the trail to inspect!'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveIdx((prev) =>
                  prev > 0 ? prev - 1 : ROADMAP_MILESTONES.length - 1
                )
              }
              aria-label={isId ? 'Milestone Sebelumnya' : 'Previous Milestone'}
              className="sketch-pill min-h-[36px] cursor-pointer bg-[#0B1B32] px-3.5 py-1.5 font-journal text-xs font-bold text-[#FAF6EE] hover:text-[#F5D78E]"
            >
              ← {isId ? 'Sebelumnya' : 'Prev'}
            </button>
            <span className="font-mono-num px-1 text-xs font-bold text-[#F5D78E]">
              {activeMilestone.stepNumber} / 0{ROADMAP_MILESTONES.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setActiveIdx((prev) =>
                  prev < ROADMAP_MILESTONES.length - 1 ? prev + 1 : 0
                )
              }
              aria-label={isId ? 'Milestone Berikutnya' : 'Next Milestone'}
              className="sketch-pill min-h-[36px] cursor-pointer bg-[#0B1B32] px-3.5 py-1.5 font-journal text-xs font-bold text-[#FAF6EE] hover:text-[#F5D78E]"
            >
              {isId ? 'Berikutnya' : 'Next'} →
            </button>
          </div>
        </div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HAND-DRAWN TREASURE TRAIL & MILESTONE STOPS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative pt-5 pb-3">
        {/* Desktop Winding Hand-Drawn SVG Path Connecting the 5 Milestones (lg+) */}
        <div
          className="pointer-events-none absolute inset-x-8 top-[68px] z-0 hidden h-28 lg:block"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1200 120"
            fill="none"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            {/* Outer Faint Sketchbook Trail Shadow */}
            <path
              d="M 40 62 C 190 10, 310 112, 460 58 C 610 6, 730 110, 880 56 C 1000 14, 1095 88, 1160 52"
              stroke={isDay ? '#D6C4A6' : '#030914'}
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Base Unexplored Hand-Drawn Dashed Map Trail */}
            <path
              d="M 40 58 C 190 6, 310 108, 460 54 C 610 2, 730 106, 880 52 C 1000 10, 1095 84, 1160 48"
              stroke="#3B5E8C"
              strokeWidth="4"
              strokeDasharray="12 10"
              strokeLinecap="round"
            />
            {/* Second Crooked Pencil Line for Authentic Hand-Drawn Feel */}
            <path
              d="M 40 61 C 190 12, 310 104, 460 57 C 610 7, 730 102, 880 55 C 1000 15, 1095 80, 1160 51"
              stroke="#9BB8DF"
              strokeOpacity="0.32"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Active Illuminated Gold Ink Path up to Selected Milestone */}
            <path
              d="M 40 58 C 190 6, 310 108, 460 54 C 610 2, 730 106, 880 52 C 1000 10, 1095 84, 1160 48"
              stroke="#F5D78E"
              strokeWidth="4.5"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={100 - progressPercent}
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
            {/* Little Treasure Map 'X' Doodles along the path */}
            <g stroke="#F5D78E" strokeWidth="2" strokeLinecap="round" opacity="0.65">
              <path d="M225 26L233 34M233 26L225 34" />
              <path d="M675 24L683 32M683 24L675 32" />
              <path d="M995 22L1003 30M1003 22L995 30" />
            </g>
          </svg>
        </div>

        {/* Mobile Vertical Hand-Drawn Dashed Spine (< sm) */}
        <div
          className="pointer-events-none absolute top-6 bottom-6 left-6 z-0 w-1 border-l-[3px] border-dashed border-[#4A72A8]/65 sm:hidden"
          aria-hidden="true"
        />

        {/* 5 Interactive Milestone Cards Along the Hand-Drawn Path */}
        <div className="relative z-10 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {ROADMAP_MILESTONES.map((milestone, idx) => {
            const isActive = idx === activeIdx;
            const isReached = idx <= activeIdx;
            const waveOffsetClass =
              idx % 2 === 1 ? 'lg:translate-y-3' : 'lg:translate-y-0';

            return (
              <div
                key={milestone.id}
                className={`relative flex flex-col ${waveOffsetClass} ${
                  idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Floating Active Chibi Explorer Pin (Anchored absolutely so card heights never jump!) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.92 }}
                      transition={{ duration: 0.2 }}
                      className="-top-4 left-3.5 absolute z-30 flex items-center gap-1.5 select-none"
                    >
                      <ChibiMiniAvatar className="h-7 w-7 border-[#F5D78E]" />
                      <span className="rounded-[225px_12px_205px_12px/12px_205px_12px_225px] border-2 border-[#091526] bg-[#F5D78E] px-2.5 py-0.5 font-journal text-[10.5px] font-bold text-[#091526] shadow-[2px_2px_0px_#030913]">
                        {isId ? '📍 Posisi Saat Ini' : '📍 Active Stop'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-pressed={isActive}
                  className={`sketch-card group relative flex h-full w-full cursor-pointer flex-col justify-between px-4 pt-5 pb-4 text-left transition-all ${
                    isActive
                      ? 'sketch-card-active-milestone !border-[#F5D78E] bg-[#0F2442] ring-2 ring-[#F5D78E]/50'
                      : isReached
                        ? 'border-[#E8DEC8]/90 opacity-95 hover:opacity-100'
                        : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <HandDrawnCardCornerDoodles
                    variant={isActive ? 'tape' : 'default'}
                  />

                  <div>
                    {/* Top Row: Icon Badge + Step & Year */}
                    <div className="relative z-10 flex items-start justify-between gap-2">
                      <MilestoneSketchIcon
                        type={milestone.iconType}
                        isActive={isActive}
                      />
                      <div className="text-right">
                        <span className="font-mono-num block text-[11px] font-bold text-[#F5D78E]">
                          STEP {milestone.stepNumber}
                        </span>
                        <span className="font-journal text-[11px] font-semibold text-[#9BB8DF]">
                          {milestone.year}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Milestone Title & Subtitle */}
                    <div className="relative z-10 mt-3">
                      <h3
                        className={`font-brush text-xl leading-tight transition-colors sm:text-[22px] ${
                          isActive
                            ? 'text-[#F5D78E]'
                            : 'text-[#FAF6EE] group-hover:text-[#F5D78E]'
                        }`}
                      >
                        {milestone.title[lang]}
                      </h3>
                      <div className="mt-0.5 font-journal text-[11px] font-bold text-[#9BB8DF]">
                        {milestone.tag[lang]}
                      </div>
                      <p className="mt-1.5 font-journal text-xs leading-relaxed text-[#D8E5F7]">
                        {milestone.shortDesc[lang]}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Handwritten Callout + Direct Journal Trigger */}
                  <div className="relative z-10 mt-3.5 flex items-center justify-between gap-1.5 border-t border-dashed border-[#2E5487]/60 pt-2.5">
                    <span className="-rotate-2 truncate font-journal text-[10px] font-bold text-[#F5D78E]">
                      ✎ {milestone.annotation}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIdx(idx);
                        onSelectEntry(milestone.journalEntryId);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveIdx(idx);
                          onSelectEntry(milestone.journalEntryId);
                        }
                      }}
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-journal text-[10px] font-bold transition-colors ${
                        isDay
                          ? 'border-[#091526] bg-[#FFFDF7] !text-[#091526] shadow-[1.5px_1.5px_0px_#091526] hover:bg-[#F5D78E]'
                          : 'border-[#F5D78E]/55 bg-[#122849]/85 text-[#FAF6EE] hover:border-[#F5D78E] hover:bg-[#F5D78E] hover:!text-[#091526]'
                      }`}
                    >
                      <span>📖 {isId ? 'Buka Jurnal' : 'Open Journal'}</span>
                      <HandArrowRight className="h-2.5 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          INTERACTIVE TORN-PARCHMENT MILESTONE FIELD LOG INSPECTOR + EXPLORER CHIBI
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mt-6 grid grid-cols-1 items-end gap-5 lg:mt-8 lg:grid-cols-12 lg:gap-5">
        {/* LEFT 9 COLS: Interactive Torn-Parchment Milestone Field Log Inspector */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative px-5 pt-6 pb-6 text-[#091526] sm:px-7 sm:pt-7 sm:pb-7 lg:px-8">
                {/* Irregular Torn-Parchment SVG Background */}
                <svg
                  viewBox="0 0 1100 260"
                  fill="none"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M20 16L88 11L176 18L278 12L390 18L510 11L630 18L752 12L868 18L982 12L1072 18L1092 32L1086 92L1094 158L1086 226L1068 248L970 242L856 249L734 242L612 248L486 241L362 248L240 241L128 248L32 242L12 222L18 154L10 88Z"
                    fill={isDay ? '#9E8869' : '#040A14'}
                    opacity={isDay ? '0.38' : '0.58'}
                  />
                  <path
                    d="M16 12L84 7L172 14L274 8L386 14L506 7L626 14L748 8L864 14L978 8L1068 14L1088 28L1082 88L1090 154L1082 222L1064 244L966 238L852 245L730 238L608 244L482 237L358 244L236 237L124 244L28 238L8 218L14 150L6 84Z"
                    fill={isDay ? '#FFFDF8' : '#EFE5D4'}
                    stroke="#091526"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-12 lg:gap-5">
                  {/* Left 7 Cols: Milestone Story & Achievements */}
                  <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-2 font-journal text-xs font-bold text-[#233F6B]">
                      <span>MILESTONE {activeMilestone.stepNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeMilestone.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#091526]">{activeMilestone.tag[lang]}</span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2.5">
                      <h3 className="font-brush text-2xl leading-none text-[#091526] sm:text-3xl">
                        {activeMilestone.title[lang]}
                      </h3>
                      <span className="-rotate-2 font-journal text-xs font-bold text-[#1B365C]">
                        — &ldquo;{activeMilestone.annotation}&rdquo;
                      </span>
                    </div>

                    <p className="mt-2.5 font-journal text-[12.5px] leading-relaxed font-semibold text-[#102136] sm:text-[13.5px]">
                      {activeMilestone.fullStory[lang]}
                    </p>

                    <ul className="mt-3 space-y-1.5 font-journal text-xs font-semibold text-[#091526] sm:text-[13px]">
                      {activeMilestone.achievements[lang].map((ach, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.6px] border-[#091526] bg-[#F5D78E] text-[10px] font-bold text-[#091526]">
                            ✓
                          </span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right 5 Cols: Hand-Drawn Dark Summary Card + Action Triggers */}
                  <div className="lg:col-span-5">
                    <div className="sketch-card-exp group relative p-4 text-[#FAF6EE] sm:p-5">
                      <HandDrawnCardCornerDoodles variant="exp" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-2 border-b border-dashed border-[#2E5487] pb-3">
                          <div className="flex items-center gap-2.5">
                            <MilestoneSketchIcon
                              type={activeMilestone.iconType}
                              isActive={true}
                            />
                            <div>
                              <div className="font-journal text-[11px] text-[#9BB8DF]">
                                {isId ? 'Catatan Log Petualangan' : 'Adventure Field Log'}
                              </div>
                              <div className="font-brush text-xl text-[#F5D78E] sm:text-2xl">
                                {activeMilestone.title[lang]} ({activeMilestone.year})
                              </div>
                            </div>
                          </div>
                          <div className="hidden items-center -space-x-1.5 sm:flex">
                            <MiniAirdropParachuteDoodle className="h-8 w-7" />
                            <RocketSketchDoodle className="h-7 w-7" />
                          </div>
                        </div>

                        {/* Metrics List */}
                        <div className="mt-3 space-y-2">
                          {activeMilestone.metrics.map((m, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between gap-2 font-journal text-xs"
                            >
                              <span className="text-[#B2C5DF]">{m.label[lang]}</span>
                              <span className="font-mono-num font-bold text-[#FAF6EE]">
                                {m.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Buttons: Open Journal Entry Modal or Collaborate */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-dashed border-[#2E5487] pt-3.5">
                          <button
                            type="button"
                            onClick={() => onSelectEntry(activeMilestone.journalEntryId)}
                            className="sketch-pill min-h-[38px] flex-1 cursor-pointer bg-[#F5D78E] px-3.5 py-1.5 text-center font-journal text-xs font-bold text-[#091526] hover:bg-[#FCE5A8]"
                          >
                            {isId ? '📖 Buka Halaman Jurnal' : '📖 Open Journal Page'}
                          </button>
                          <button
                            type="button"
                            onClick={onOpenConnect}
                            className="sketch-pill min-h-[38px] cursor-pointer bg-[#122644] px-3.5 py-1.5 font-journal text-xs font-bold text-[#FAF6EE] hover:text-[#F5D78E]"
                          >
                            {isId ? 'Kolaborasi →' : 'Collaborate →'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Crypto Coins Strip under Inspector Box */}
                    <div className="mt-2.5 flex flex-wrap items-center justify-end gap-1.5 select-none">
                      <span className="font-journal text-[11px] font-bold text-[#091526]">
                        {isId ? 'Jejak Ekosistem:' : 'Ecosystem Trail:'}
                      </span>
                      <GoldBitcoinDoodle className="h-6 w-7" />
                      <EthereumCoinDoodle className="h-6 w-7" />
                      <SolanaCoinDoodle className="h-6 w-7" />
                      <MemeDogeCoinMiniDoodle className="h-6 w-7" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT 3 COLS: Relocated Backpack Explorer Chibi Character + Hand-Drawn Trail Annotations */}
        <motion.div
          initial={{ opacity: 0, x: 20, y: 14 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center justify-end pt-2 lg:col-span-3 lg:pt-0"
        >
          <div className="relative flex items-end justify-center gap-2">
            <BackpackWalkerChibi />

            <div className="mb-4 -ml-1 flex flex-col items-start select-none">
              <div className="mb-1 flex items-center -space-x-1.5">
                <MiniAirdropParachuteDoodle className="h-8 w-7" />
                <GoldBitcoinDoodle className="h-7 w-8" />
                <MemeDogeCoinMiniDoodle className="h-7 w-8" />
              </div>

              <div className="-rotate-8">
                <div className="relative font-journal text-xs leading-[1.15] font-bold text-[#FAF6EE] sm:text-[13px]">
                  <span className="-top-1 -left-2.5 absolute text-xs text-[#F5D78E]" aria-hidden="true">
                    ⑊
                  </span>
                  <span className="block">
                    {isId ? 'Terus Jelajahi' : 'Keep Exploring'}
                  </span>
                  <span className="block text-[#F5D78E]">
                    {isId ? 'Jejak Web3!' : 'The Web3 Trail!'}
                  </span>
                </div>
                <svg
                  viewBox="0 0 82 8"
                  fill="none"
                  className="mt-0.5 h-2 w-18"
                  aria-hidden="true"
                >
                  <path
                    d="M2 5C28 2 54 2 80 5"
                    stroke="#F5D78E"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="mt-0.5 block font-journal text-[10px] font-bold text-[#9BB8DF]">
                  {isId ? 'Step ' : 'Stop '}
                  {activeMilestone.stepNumber} · {activeMilestone.year}
                </span>
              </div>
            </div>
          </div>

          {/* Hand-drawn Sketchbook Ground Line under the Explorer Chibi */}
          <svg
            viewBox="0 0 240 10"
            fill="none"
            className="-mt-0.5 h-2.5 w-52 max-w-full select-none"
            aria-hidden="true"
          >
            <path
              d="M6 5C72 2.5 168 2.5 234 5.5M38 8C95 6.5 148 6.5 202 8"
              stroke="#9BB8DF"
              strokeOpacity="0.6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
