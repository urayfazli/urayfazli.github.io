import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  CrownDoodle,
  ChibiMiniAvatar,
  HandXIcon,
  HandGithubIcon,
  HandEmailIcon,
  HandDrawnCardCornerDoodles,
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
  fieldStory?: string;
  quote?: string;
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
    'roadmap-started': {
      id: 'roadmap-started',
      category: 'Adventure Roadmap · Step 01 (2022)',
      title: 'Started Web3 — First On-Chain Footsteps',
      subtitle: 'Self-Custody Foundations, DeFi Mechanics & Multi-Chain Exploration',
      annotation: 'Day 1 Explorer!',
      summary:
        'The Web3 adventure began in 2022 out of a deep curiosity about how permissionless, decentralized networks operate without intermediaries. Setting up the very first non-custodial wallet, executing initial DEX swaps, and bridging assets across networks laid the security-first mindset that powers every step since.',
      fieldStory:
        'In this genesis chapter, every single transaction was a hands-on lesson: understanding Ethereum gas dynamics, exploring Layer 2 rollups like Arbitrum, Optimism, and Polygon, and learning to verify contract calls directly on block explorers. Strict seed-phrase security, separating cold vault wallets from hot exploration wallets, and building a structured DYOR framework became daily habits from day one.',
      quote:
        '"Every great Web3 expedition begins with a single signed block and an relentless curiosity to learn how the chain works under the hood."',
      highlights: [
        'Architected a multi-wallet security setup separating Cold Vaults from Hot Exploration Wallets',
        'Mastered AMM DEX swaps, liquidity provisioning, lending markets, and cross-chain bridges across 10+ early chains',
        'Developed a disciplined DYOR research workflow analyzing tokenomics, smart-contract permissions, and on-chain flows',
        'Joined global builder and explorer communities early to exchange alpha and technical insights',
      ],
      metrics: [
        { label: 'Genesis Era', value: '2022' },
        { label: 'Initial Chains', value: 'ETH · BNB · Polygon · L2' },
        { label: 'Core Focus', value: 'Self-Custody & DeFi' },
        { label: 'Milestone Status', value: 'Completed ✓' },
      ],
      illustrationKey: 'aboutChibiImg',
    },
    'roadmap-testnet': {
      id: 'roadmap-testnet',
      category: 'Adventure Roadmap · Step 02 (2023)',
      title: '100+ Testnet Quest — Pre-Mainnet Vanguard',
      subtitle: 'Protocol Stress-Testing, Bug Reporting & Early Ecosystem Contributions',
      annotation: 'Early Tester Alpha',
      summary:
        'In 2023, the journey evolved from being an everyday DeFi user into an active pre-mainnet protocol tester across 100+ devnets and incentivized testnets—helping core engineering teams battle-test their infrastructure before public launch.',
      fieldStory:
        'From hunting scarce testnet faucets during high-traffic stress tests to bridging experimental assets and testing governance modules, every protocol interaction was treated like a field mission. Detailed UX friction logs and reproducible bug reports were shared directly with project teams on Discord and GitHub, earning Early Contributor and OG roles across dozens of emerging ecosystems.',
      quote:
        '"Testing protocols before mainnet is not just about chasing incentives—it is about helping pave the roads before the city is built."',
      highlights: [
        'Actively participated in 100+ devnet, public testnet, and incentivized testnet campaigns',
        'Stress-tested smart contracts, cross-chain bridges, staking modules, and decentralized orderbooks under load',
        'Submitted structured bug reports and actionable UX improvements directly to core developers',
        'Earned OG and Early Contributor roles across multiple Layer 1, Layer 2, and ZK-Rollup communities',
      ],
      metrics: [
        { label: 'Testnets Joined', value: '100+ Networks' },
        { label: 'Contribution', value: 'QA, Bug Reports & UX' },
        { label: 'Community Standing', value: 'OG & Early Roles' },
        { label: 'Milestone Status', value: 'Completed ✓' },
      ],
      illustrationKey: 'backpackWalkerImg',
    },
    'roadmap-node': {
      id: 'roadmap-node',
      category: 'Adventure Roadmap · Step 03 (2023–2024)',
      title: 'First Node — Powering The Network Backbone',
      subtitle: 'Full Node & Indexer Infrastructure on Aptos, Sei & SubQuery',
      annotation: 'Node Run The Chain!',
      summary:
        'The biggest technical leap in the journey: transitioning from protocol tester to dedicated infrastructure operator. By provisioning custom Linux servers, the focus expanded into running high-uptime full nodes and indexers on Aptos, Sei Network, and SubQuery Network.',
      fieldStory:
        'Operating production-grade nodes demands 24/7 engineering discipline. From tuning NVMe RAID-0 storage and orchestrating Docker + Postgres containers for SubQuery indexing to building automated Prometheus + Grafana alerting and failover scripts, this chapter achieved a 99.94% uptime SLA while serving over 250,000 multi-chain GraphQL queries.',
      quote:
        '"Behind every fast, trustless blockchain transaction stands a network of resilient nodes quietly keeping consensus and data alive 24/7."',
      highlights: [
        'Deployed and maintained high-availability Full Nodes on Aptos Network and Sei Network',
        'Operated decentralized Indexer Nodes on SubQuery Network serving 250,000+ GraphQL queries',
        'Engineered automated Prometheus + Grafana telemetry pipelines and health-check scripts with 99.94% uptime',
        'Executed zero-downtime binary upgrades across epochs and shared troubleshooting guides with fellow operators',
      ],
      metrics: [
        { label: 'Core Networks', value: 'Aptos · Sei · SubQuery' },
        { label: 'Uptime SLA', value: '99.94%' },
        { label: 'Queries Served', value: '250K+ GraphQL' },
        { label: 'Milestone Status', value: 'Active Node ✓' },
      ],
      illustrationKey: 'nodeOperatorImg',
    },
    'roadmap-airdrop': {
      id: 'roadmap-airdrop',
      category: 'Adventure Roadmap · Step 04 (2024)',
      title: 'Airdrop Success — Harvesting Consistency & Alpha',
      subtitle: '1,000+ On-Chain Quests, Major Allocations & Meme Coin Narrative Rotation',
      annotation: 'Small Steps Big Bags!',
      summary:
        'In 2024, years of daily on-chain consistency bore fruit. The combination of organic DeFi usage, early testnet contributions, node operations, and sharp narrative timing resulted in multiple milestone airdrop allocations and profitable on-chain rotations.',
      fieldStory:
        'Rather than mindless sybil spamming, the strategy focused on high-signal organic footprint: genuine liquidity retention, governance voting, and consistent multi-month usage across 25+ ecosystems. Rewards harvested from airdrops were systematically paired with disciplined early-narrative meme coin trading on Solana, Base, and Ethereum—enforcing strict position sizing and principal protection.',
      quote:
        '"Small, disciplined on-chain steps taken consistently during quiet markets create the biggest harvests when the cycle blooms."',
      highlights: [
        'Completed 1,000+ on-chain quests, Galxe/Layer3 campaigns, and native dApp interactions across 25+ chains',
        'Secured major token allocations from L2 infrastructure, restaking, DeFi, and node ecosystems',
        'Combined airdrop rewards with disciplined early-narrative meme coin momentum trading on Raydium & Uniswap',
        'Applied strict portfolio risk management to lock profits into core assets and server infrastructure',
      ],
      metrics: [
        { label: 'Quests Completed', value: '1,000+ Campaigns' },
        { label: 'Ecosystem Reach', value: '25+ Active Chains' },
        { label: 'Capital Strategy', value: 'Airdrop + Meme Alpha' },
        { label: 'Milestone Status', value: 'Harvested ✓' },
      ],
      illustrationKey: 'heroChibiImg',
    },
    'roadmap-horizon': {
      id: 'roadmap-horizon',
      category: 'Adventure Roadmap · Step 05 (2025+)',
      title: 'Next Web3 Horizon — Scaling & Global Collaboration',
      subtitle: 'Modular Blockchains, AI-Chain Infrastructure & Ecosystem Partnerships',
      annotation: 'Web3 No Limits!',
      summary:
        'The expedition continues into its most exciting frontier yet. In 2025 and beyond, the focus is on scaling node and validator operations into next-generation modular blockchains, restaking layers, and decentralized AI networks while collaborating with builders worldwide.',
      fieldStory:
        'Armed with hands-on experience running nodes, testing 100+ pre-mainnet networks, and navigating on-chain liquidity cycles, the next chapter is all about deeper ecosystem impact—providing resilient infrastructure, early technical QA, and strategic community growth alongside ambitious Web3 teams and fellow explorers.',
      quote:
        '"The Web3 map expands every single day—and the best compass is to keep building, keep exploring, and grow together."',
      highlights: [
        'Scaling full node, validator, and prover operations into Modular, Restaking, and AI-Chain ecosystems',
        'Conducting daily on-chain alpha research across next-gen DeFi primitives and early incentive programs',
        'Sharing technical node guides, testnet walkthroughs, and market insights with the broader community',
        'Open 24/7 for strategic collaborations with Web3 projects, builders, node operators, and alpha hunters',
      ],
      metrics: [
        { label: 'Next Frontier', value: 'Modular & AI Chains' },
        { label: 'Infrastructure', value: 'Next-Gen Nodes' },
        { label: 'Collaboration', value: 'Open 24/7' },
        { label: 'Milestone Status', value: 'In Progress 🚀' },
      ],
      illustrationKey: 'peekingBottomImg',
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
    'roadmap-started': {
      id: 'roadmap-started',
      category: 'Jurnal Adventure Roadmap · Step 01 (2022)',
      title: 'Started Web3 — Langkah Pertama On-Chain',
      subtitle: 'Fondasi Self-Custody, DeFi & Eksplorasi Multi-Chain',
      annotation: 'Day 1 Explorer!',
      summary:
        'Perjalanan di dunia Web3 dimulai pada tahun 2022 dari rasa ingin tahu yang besar terhadap bagaimana jaringan terdesentralisasi bekerja tanpa perantara. Dari membuat dompet non-kustodian pertama hingga mengeksekusi swap DEX dan jembatan lintas jaringan (cross-chain bridge), fase ini membangun mentalitas keamanan dan riset mandiri yang menjadi fondasi seluruh perjalanan berikutnya.',
      fieldStory:
        'Di fase awal ini, setiap transaksi adalah pelajaran berharga: memahami mekanisme gas fee di Ethereum, mencoba kecepatan Layer 2 seperti Arbitrum, Optimism, dan Polygon, serta mempelajari cara membaca transaksi langsung di block explorer. Disiplin menjaga seed phrase, memisahkan dompet utama (vault) dari dompet eksplorasi (burner), dan menyaring proyek menggunakan kerangka DYOR menjadi kebiasaan wajib sejak hari pertama.',
      quote:
        '"Setiap penjelajah Web3 hebat memulai dari satu blok transaksi pertama dan rasa penasaran yang tak pernah padam."',
      highlights: [
        'Membangun sistem keamanan multi-wallet (pemisahan Cold/Vault Wallet & Hot Exploration Wallet)',
        'Mempelajari mekanisme AMM DEX, Liquidity Pool, Lending/Borrowing, dan Cross-Chain Bridge di 10+ jaringan awal',
        'Mengembangkan alur riset mandiri (DYOR) berbasis pembacaan smart contract dasar, tokenomics, dan aktivitas on-chain',
        'Aktif bergabung di komunitas pengembang dan diskusi ekosistem global sejak era 2022',
      ],
      metrics: [
        { label: 'Era Mulai', value: '2022 (Genesis)' },
        { label: 'Ekosistem Awal', value: 'ETH · BNB · Polygon · L2' },
        { label: 'Fokus Utama', value: 'Self-Custody & DeFi' },
        { label: 'Status Milestone', value: 'Tuntas ✓' },
      ],
      illustrationKey: 'aboutChibiImg',
    },
    'roadmap-testnet': {
      id: 'roadmap-testnet',
      category: 'Jurnal Adventure Roadmap · Step 02 (2023)',
      title: '100+ Testnet Quest — Penjelajah Pra-Mainnet',
      subtitle: 'Stress-Testing Protokol, Laporan Bug & Kontribusi Ekosistem Awal',
      annotation: 'Early Tester Alpha',
      summary:
        'Memasuki tahun 2023, eksplorasi beralih dari sekadar pengguna menjadi penguji awal (early tester) di lebih dari 100 jaringan devnet dan incentivized testnet. Sebelum sebuah protokol meluncur ke mainnet, setiap fitur diuji secara menyeluruh untuk membantu tim pengembang menemukan celah dan menyempurnakan pengalaman pengguna.',
      fieldStory:
        'Mulai dari berburu faucet token uji coba di tengah kemacetan jaringan, menguji jembatan lintas-chain eksperimental, hingga menyimulasikan likuiditas dan governance voting. Setiap temuan kendala antarmuka (UX) maupun bug transaksi didokumentasikan dan dikirimkan melalui kanal feedback resmi pengembang, menghasilkan berbagai peran kontributor awal (Early Role / OG) di puluhan komunitas protokol.',
      quote:
        '"Menguji protokol sebelum mainnet bukan sekadar mencari insentif, melainkan ikut membangun jalan sebelum kota besarnya berdiri."',
      highlights: [
        'Berpartisipasi aktif di 100+ kampanye devnet, public testnet, dan incentivized testnet lintas ekosistem',
        'Menguji ketahanan smart contract, alur bridge, modul staking, dan eksekusi orderbook di kondisi jaringan padat',
        'Menyusun laporan bug teknis serta masukan UX terstruktur langsung kepada tim core developer',
        'Mengamankan status OG / Early Tester Role di berbagai proyek infrastruktur Layer 1, Layer 2, dan ZK-Rollup',
      ],
      metrics: [
        { label: 'Testnet Diikuti', value: '100+ Jaringan' },
        { label: 'Kontribusi', value: 'QA, Bug Report & UX' },
        { label: 'Peran Komunitas', value: 'OG & Early Contributor' },
        { label: 'Status Milestone', value: 'Tuntas ✓' },
      ],
      illustrationKey: 'backpackWalkerImg',
    },
    'roadmap-node': {
      id: 'roadmap-node',
      category: 'Jurnal Adventure Roadmap · Step 03 (2023–2024)',
      title: 'First Node — Menjaga Denyut Jaringan',
      subtitle: 'Infrastruktur Full Node & Indexer di Aptos, Sei & SubQuery',
      annotation: 'Node Run The Chain!',
      summary:
        'Titik balik teknis terbesar dalam perjalanan Web3: bertransformasi dari pengguna aplikasi menjadi operator infrastruktur jaringan. Dengan menyiapkan server Linux khusus, perjalanan menjalankan node dimulai pada jaringan berkinerja tinggi seperti Aptos, Sei Network, dan SubQuery Network.',
      fieldStory:
        'Menjalankan node menuntut kesiagaan 24/7. Dari mengonfigurasi NVMe RAID-0, menyusun orkestrasi Docker & Postgres untuk indexer SubQuery, hingga membangun sistem pemantauan telemetri otomatis dengan Prometheus, Grafana, dan skrip auto-restart/failover. Hasilnya adalah rekor uptime 99.94% dan ratusan ribu kueri data on-chain yang berhasil dilayani dengan latensi sangat rendah.',
      quote:
        '"Di balik setiap transaksi on-chain yang cepat, ada barisan node yang bekerja tanpa henti menjaga konsensus dan ketersediaan data."',
      highlights: [
        'Menjalankan dan memelihara Full Node di Aptos Network & Sei Network dengan finalitas blok sub-detik',
        'Mengoperasikan Indexer Node di SubQuery Network yang telah melayani 250.000+ kueri GraphQL multi-chain',
        'Membangun pipeline monitoring Prometheus + Grafana serta skrip health-check otomatis dengan SLA uptime 99.94%',
        'Melakukan upgrade binary tepat waktu di setiap pergantian epoch dan membantu sesama operator di komunitas',
      ],
      metrics: [
        { label: 'Jaringan Inti', value: 'Aptos · Sei · SubQuery' },
        { label: 'Rekor Uptime', value: '99.94% SLA' },
        { label: 'Kueri Terindeks', value: '250K+ GraphQL' },
        { label: 'Status Milestone', value: 'Node Aktif ✓' },
      ],
      illustrationKey: 'nodeOperatorImg',
    },
    'roadmap-airdrop': {
      id: 'roadmap-airdrop',
      category: 'Jurnal Adventure Roadmap · Step 04 (2024)',
      title: 'Airdrop Success — Panen Konsistensi & Alpha',
      subtitle: '1.000+ Quest On-Chain, Alokasi Utama & Rotasi Narasi Meme Coin',
      annotation: 'Small Steps Big Bags!',
      summary:
        'Tahun 2024 menjadi musim panen dari ribuan langkah kecil yang dilakukan secara konsisten sejak 2022. Kombinasi partisipasi organik di berbagai protokol DeFi, kontribusi testnet, operasional node, serta kejelian membaca pergeseran narasi pasar menghasilkan pencapaian alokasi airdrop signifikan.',
      fieldStory:
        'Strategi yang diterapkan bukan sekadar mengejar kuantitas, melainkan kualitas interaksi on-chain: menjaga volume organik, retensi likuiditas, serta tata kelola lintas 25+ jaringan. Selain itu, modal dari hasil panen airdrop dikelola secara disiplin untuk menangkap momentum narasi awal meme coin di Solana, Base, dan Ethereum dengan aturan manajemen risiko dan pengamanan modal (take-profit) yang ketat.',
      quote:
        '"Konsistensi kecil yang dilakukan setiap hari di saat pasar sepi adalah kunci panen terbesar saat ekosistem berkembang."',
      highlights: [
        'Menuntaskan 1.000+ kampanye quest on-chain, Galxe, Layer3, dan interaksi protokol langsung di 25+ ekosistem',
        'Berhasil meraih alokasi reward dari proyek-proyek infrastruktur, Layer 2, DeFi, dan ekosistem node',
        'Menggabungkan strategi panen airdrop dengan rotasi tren likuiditas meme coin di Raydium & Uniswap secara terukur',
        'Menerapkan manajemen portofolio disiplin untuk mengunci profit ke aset utama dan ekspansi infrastruktur',
      ],
      metrics: [
        { label: 'Kampanye Digarap', value: '1.000+ Quest' },
        { label: 'Jangkauan Chain', value: '25+ Ekosistem' },
        { label: 'Strategi Modal', value: 'Airdrop + Meme Alpha' },
        { label: 'Status Milestone', value: 'Harvested ✓' },
      ],
      illustrationKey: 'heroChibiImg',
    },
    'roadmap-horizon': {
      id: 'roadmap-horizon',
      category: 'Jurnal Adventure Roadmap · Step 05 (2025+)',
      title: 'Next Web3 Horizon — Ekspansi & Kolaborasi',
      subtitle: 'Modular Blockchain, AI-Chain Infrastructure & Kemitraan Global',
      annotation: 'Web3 No Limits!',
      summary:
        'Petualangan belum berakhir—bahkan baru memasuki babak paling menarik. Di era 2025 dan seterusnya, fokus diarahkan pada ekspansi infrastruktur node ke jaringan blockchain modular, restaking, dan jaringan terdesentralisasi berbasis AI (DePIN / AI-Chain), sembari memperluas kolaborasi dengan para builder global.',
      fieldStory:
        'Dengan bekal pengalaman mengoperasikan node, menguji 100+ testnet, dan memahami dinamika komunitas serta likuiditas on-chain, langkah selanjutnya adalah berkontribusi lebih dalam pada ekosistem generasi baru. Baik melalui penyediaan infrastruktur validator/node yang andal, pengujian teknis pra-mainnet, maupun kolaborasi riset dan pertumbuhan komunitas bersama tim proyek Web3.',
      quote:
        '"Peta Web3 selalu bertambah luas setiap harinya—dan kompas terbaik adalah terus membangun, menjelajah, serta berkolaborasi."',
      highlights: [
        'Memperluas operasional full node, validator, dan prover ke ekosistem Modular Blockchain, Restaking & AI-Chain',
        'Melanjutkan riset alpha harian pada protokol DeFi generasi baru, narasi on-chain, dan insentif ekosistem awal',
        'Berbagi insight teknis, panduan node, serta analisis peluang Web3 bersama komunitas kreator dan peneliti',
        'Terbuka 24/7 untuk kolaborasi strategis bersama proyek, builder, sesama node operator, dan alpha hunter',
      ],
      metrics: [
        { label: 'Fokus Ekspansi', value: 'Modular & AI Chains' },
        { label: 'Infrastruktur', value: 'Next-Gen Nodes' },
        { label: 'Kolaborasi', value: 'Terbuka 24/7' },
        { label: 'Status Milestone', value: 'In Progress 🚀' },
      ],
      illustrationKey: 'peekingBottomImg',
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
                  {entry.subtitle && (
                    <div className="mt-0.5 truncate font-journal text-xs font-bold text-[#8C4F04] sm:text-[13px]">
                      {entry.subtitle}
                    </div>
                  )}
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
                  {entry.fieldStory && (
                    <p className="mt-2.5 font-journal text-[13.5px] leading-relaxed text-[#1E3554] md:text-[14.5px]">
                      {entry.fieldStory}
                    </p>
                  )}
                  {entry.quote && (
                    <blockquote className="mt-3 rounded-[185px_12px_195px_12px/12px_195px_12px_185px] border-2 border-[#091526] bg-[#FFFDF7] px-3.5 py-2 font-journal text-xs italic font-bold text-[#091526] shadow-[2.5px_3px_0px_#091526] sm:text-[13px]">
                      ✎ {entry.quote}
                    </blockquote>
                  )}
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

                {/* Right Artwork & Metrics (Hand-Drawn Card Frame) */}
                <div className="sketch-card-exp group relative flex flex-col justify-between p-4 text-[#F3EBDD] md:col-span-5">
                  <HandDrawnCardCornerDoodles variant="exp" />
                  <div className="relative z-10 overflow-hidden rounded-xl bg-[#091525]/70">
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
                  <div className="relative z-10 mt-3 space-y-2 border-t-2 border-dashed border-[#2A4B78]/70 pt-3">
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
                  className="sketch-input cursor-pointer px-4 py-1.5 font-journal text-xs font-bold text-[#091526] transition-colors hover:bg-[#E5D8C3] sm:text-sm"
                >
                  {isId ? 'Tutup' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onConnectClick();
                  }}
                  className="sketch-pill-dark cursor-pointer px-5 py-2 font-journal text-xs font-semibold text-[#F3EBDD] sm:text-sm"
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

export interface CollaborationNote {
  id: string;
  senderName: string;
  senderHandle: string;
  topic: string;
  message: string;
  createdAt: string;
  createdAtMs: number;
  expiresAtMs: number;
  authorToken?: string;
  isOwn?: boolean;
}

const COLLAB_NOTES_COLLECTION = 'collaboration_notes';
const COLLAB_AUTHOR_TOKEN_KEY = 'uray_collab_author_token_v1';
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 Days (1 Month) Auto-Deletion TTL

function getOrCreateAuthorToken(): string {
  try {
    const existing = window.localStorage.getItem(COLLAB_AUTHOR_TOKEN_KEY);
    if (existing && existing.length >= 8) return existing;
    const generated = `author-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(COLLAB_AUTHOR_TOKEN_KEY, generated);
    return generated;
  } catch {
    return 'anonymous-explorer';
  }
}

function getRemainingDays(expiresAtMs: number): number {
  const diff = expiresAtMs - Date.now();
  if (diff <= 0) return 0;
  return Math.max(1, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

const SEED_NOW_MS = Date.now();
const DEFAULT_COLLAB_NOTES: CollaborationNote[] = [
  {
    id: 'seed-note-1',
    senderName: 'Raka Pratama',
    senderHandle: '@rakaw3_node',
    topic: 'Node Infrastructure',
    message:
      'Halo bro Uray! Mantap setup full node Aptos & Sei-nya. Ayo diskusi bareng soal monitoring RPC & validator testnet terbaru.',
    createdAt: new Date(SEED_NOW_MS - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAtMs: SEED_NOW_MS - 2 * 24 * 60 * 60 * 1000,
    expiresAtMs: SEED_NOW_MS + 28 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-note-2',
    senderName: 'Kevin Solana',
    senderHandle: '@kevinsol_alpha',
    topic: 'Airdrop & Quest Alpha',
    message:
      'Salam kenal! Sering pantau garapan testnet & modular L2 juga. Siap kolaborasi tukar info early alpha.',
    createdAt: new Date(SEED_NOW_MS - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAtMs: SEED_NOW_MS - 1 * 24 * 60 * 60 * 1000,
    expiresAtMs: SEED_NOW_MS + 29 * 24 * 60 * 60 * 1000,
  },
];

interface ConnectModalProps {
  isOpen: boolean;
  lang?: Language;
  onClose: () => void;
  onCopyText: (label: string, value: string) => void;
  onToast?: (message: string) => void;
}

export const ConnectJournalModal: React.FC<ConnectModalProps> = ({
  isOpen,
  lang = 'id',
  onClose,
  onCopyText,
  onToast,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderHandle, setSenderHandle] = useState('');
  const [topic, setTopic] = useState('Node Infrastructure');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedNote, setLastSubmittedNote] = useState<CollaborationNote | null>(null);
  const [notes, setNotes] = useState<CollaborationNote[]>(DEFAULT_COLLAB_NOTES);
  const hasSeededFirestoreRef = useRef(false);

  const isId = lang === 'id';

  // Real-Time Firebase Firestore subscription + automatic 1-month expiration cleanup
  useEffect(() => {
    if (!isOpen) {
      setFormError(null);
      return;
    }

    const myAuthorToken = getOrCreateAuthorToken();
    const notesRef = collection(db, COLLAB_NOTES_COLLECTION);
    const notesQuery = query(notesRef, orderBy('createdAtMs', 'desc'), limit(30));

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const now = Date.now();
        const validNotes: CollaborationNote[] = [];

        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const createdAtMs =
            typeof data.createdAtMs === 'number'
              ? data.createdAtMs
              : Date.parse(String(data.createdAt || '')) || now;
          const expiresAtMs =
            typeof data.expiresAtMs === 'number'
              ? data.expiresAtMs
              : createdAtMs + ONE_MONTH_MS;

          // Automatic 1-Month (30-Day) Deletion: Purge expired notes from Firestore immediately
          if (now >= expiresAtMs || now - createdAtMs >= ONE_MONTH_MS) {
            deleteDoc(doc(db, COLLAB_NOTES_COLLECTION, docSnap.id)).catch((err) => {
              handleFirestoreError(err, OperationType.DELETE, `${COLLAB_NOTES_COLLECTION}/${docSnap.id}`);
            });
            return;
          }

          validNotes.push({
            id: docSnap.id,
            senderName: String(data.senderName || 'Web3 Explorer'),
            senderHandle: String(data.senderHandle || 'Explorer'),
            topic: String(data.topic || 'Node Infrastructure'),
            message: String(data.message || ''),
            createdAt: String(data.createdAt || new Date(createdAtMs).toISOString()),
            createdAtMs,
            expiresAtMs,
            authorToken: typeof data.authorToken === 'string' ? data.authorToken : undefined,
            isOwn: Boolean(data.authorToken && data.authorToken === myAuthorToken),
          });
        });

        // Seed initial community notes once if Firestore collection is brand new
        if (snapshot.empty && !hasSeededFirestoreRef.current) {
          hasSeededFirestoreRef.current = true;
          DEFAULT_COLLAB_NOTES.forEach((seed) => {
            setDoc(doc(db, COLLAB_NOTES_COLLECTION, seed.id), {
              senderName: seed.senderName,
              senderHandle: seed.senderHandle,
              topic: seed.topic,
              message: seed.message,
              createdAt: seed.createdAt,
              createdAtMs: seed.createdAtMs,
              expiresAtMs: seed.expiresAtMs,
              expiresAt: Timestamp.fromMillis(seed.expiresAtMs),
              authorToken: 'seed-community',
            }).catch((err) => {
              handleFirestoreError(err, OperationType.CREATE, `${COLLAB_NOTES_COLLECTION}/${seed.id}`);
            });
          });
          setNotes(DEFAULT_COLLAB_NOTES);
          return;
        }

        setNotes(validNotes);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLAB_NOTES_COLLECTION);
      }
    );

    // Periodic check while modal remains open to purge any note that crosses the 1-month mark
    const expiryCheckInterval = window.setInterval(() => {
      const now = Date.now();
      setNotes((prev) =>
        prev.filter((note) => {
          if (now >= note.expiresAtMs) {
            deleteDoc(doc(db, COLLAB_NOTES_COLLECTION, note.id)).catch(() => {});
            return false;
          }
          return true;
        })
      );
    }, 60000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      unsubscribe();
      window.clearInterval(expiryCheckInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const formatTopicLabel = (rawTopic: string) => {
    if (!isId) return rawTopic;
    switch (rawTopic) {
      case 'Node Infrastructure':
        return 'Infrastruktur Node';
      case 'Testnet Exploration':
        return 'Eksplorasi Testnet';
      case 'Airdrop & Quest Alpha':
        return 'Airdrop & Quest Alpha';
      case 'Meme Coin & Community':
        return 'Meme Coin & Komunitas';
      default:
        return rawTopic;
    }
  };

  const buildFormattedDispatchText = (note: CollaborationNote) => {
    return isId
      ? `Halo Uray Fazli Alman! 👋\n\n[Catatan Kolaborasi Web3 - ${formatTopicLabel(note.topic)}]\nDari: ${note.senderName} (${note.senderHandle})\nPesan: ${note.message}`
      : `Hello Uray Fazli Alman! 👋\n\n[Web3 Collaboration Note - ${note.topic}]\nFrom: ${note.senderName} (${note.senderHandle})\nMessage: ${note.message}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = senderName.trim();
    const cleanHandle = senderHandle.trim();
    const cleanMessage = message.trim();

    if (!cleanName) {
      setFormError(
        isId
          ? 'Mohon isi Nama / Alias Anda terlebih dahulu.'
          : 'Please enter your Name / Alias first.'
      );
      return;
    }
    if (!cleanMessage) {
      setFormError(
        isId
          ? 'Mohon tulis isi catatan kolaborasi Anda.'
          : 'Please write your collaboration note message.'
      );
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const nowMs = Date.now();
    const expiresAtMs = nowMs + ONE_MONTH_MS;
    const createdAtIso = new Date(nowMs).toISOString();
    const authorToken = getOrCreateAuthorToken();
    const safeName = cleanName.slice(0, 60);
    const safeHandle = (cleanHandle || (isId ? 'Explorer Web3' : 'Web3 Explorer')).slice(0, 80);
    const safeTopic = topic.slice(0, 60);
    const safeMessage = cleanMessage.slice(0, 500);

    try {
      const docRef = await addDoc(collection(db, COLLAB_NOTES_COLLECTION), {
        senderName: safeName,
        senderHandle: safeHandle,
        topic: safeTopic,
        message: safeMessage,
        createdAt: createdAtIso,
        createdAtMs: nowMs,
        expiresAtMs,
        expiresAt: Timestamp.fromMillis(expiresAtMs),
        authorToken,
      });

      const savedNote: CollaborationNote = {
        id: docRef.id,
        senderName: safeName,
        senderHandle: safeHandle,
        topic: safeTopic,
        message: safeMessage,
        createdAt: createdAtIso,
        createdAtMs: nowMs,
        expiresAtMs,
        authorToken,
        isOwn: true,
      };

      setLastSubmittedNote(savedNote);
      setSenderName('');
      setSenderHandle('');
      setMessage('');
      if (onToast) {
        onToast(
          isId
            ? `Catatan dari ${savedNote.senderName} tersimpan di Firebase (otomatis terhapus 1 bulan)!`
            : `Note from ${savedNote.senderName} saved to Firebase (auto-deletes in 1 month)!`
        );
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, COLLAB_NOTES_COLLECTION);
      setFormError(
        isId
          ? 'Gagal menyimpan catatan ke database. Silakan coba lagi.'
          : 'Failed to save note to database. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
              {/* Direct Channels Grid (Hand-Drawn Cards) */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {channels.map((ch) => (
                  <div
                    key={ch.label}
                    className="sketch-card-exp group relative flex items-center justify-between px-3.5 py-2.5 text-[#F3EBDD]"
                  >
                    <HandDrawnCardCornerDoodles variant="exp" />
                    <div className="relative z-10 flex min-w-0 items-center gap-2.5">
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
                        className="relative z-10 ml-2 shrink-0 cursor-pointer rounded-lg border-2 border-[#FAF6EE]/80 bg-[#122644] px-2.5 py-1 font-journal text-xs font-bold text-[#F3EBDD] shadow-[2px_2px_0px_#030913] transition-transform hover:-translate-y-0.5 hover:border-[#F5D78E] hover:text-[#F5D78E]"
                      >
                        {isId ? 'Salin' : 'Copy'}
                      </button>
                    ) : (
                      <a
                        href={ch.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 ml-2 shrink-0 rounded-lg border-2 border-[#FAF6EE]/80 bg-[#122644] px-2.5 py-1 font-journal text-xs font-bold text-[#F3EBDD] shadow-[2px_2px_0px_#030913] transition-transform hover:-translate-y-0.5 hover:border-[#F5D78E] hover:text-[#F5D78E]"
                      >
                        {isId ? 'Buka ↗' : 'Open ↗'}
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Interactive Journal Note Form ("Tinggalkan Catatan Kolaborasi") */}
              <div className="mt-5 border-t-2 border-dashed border-[#0B192C]/25 pt-4 sm:mt-6 sm:pt-5">
                {lastSubmittedNote ? (
                  <div className="sketch-card-exp relative p-5 text-center text-[#F3EBDD]">
                    <HandDrawnCardCornerDoodles variant="exp" />
                    <div className="relative z-10">
                      <CrownDoodle className="mx-auto mb-1.5 h-7 w-8" color="#F5D78E" />
                      <h4 className="font-brush text-2xl text-[#F5EFE6] sm:text-3xl">
                        {isId
                          ? 'Catatan Tercatat di Jurnal Kolaborasi!'
                          : 'Note Logged in Collaboration Journal!'}
                      </h4>
                      <p className="mt-1 font-journal text-xs text-[#C7D8EE] sm:text-sm">
                        {isId
                          ? `Terima kasih, ${lastSubmittedNote.senderName}! Catatan Anda tentang "${formatTopicLabel(
                              lastSubmittedNote.topic
                            )}" sudah tersimpan di papan jurnal di bawah.`
                          : `Thanks, ${lastSubmittedNote.senderName}! Your note regarding "${lastSubmittedNote.topic}" is saved on the journal board below.`}
                      </p>

                      {/* Preview of the saved note */}
                      <div className="mx-auto mt-3 max-w-lg rounded-xl border border-dashed border-[#F5D78E]/50 bg-[#06101E]/90 px-3.5 py-2.5 text-left font-journal text-xs text-[#FAF6EE]">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#F5D78E]">
                          <span>
                            ✍️ {lastSubmittedNote.senderName} ({lastSubmittedNote.senderHandle})
                          </span>
                          <span>• {formatTopicLabel(lastSubmittedNote.topic)}</span>
                        </div>
                        <p className="mt-1 leading-relaxed text-[#E4ECF7]">
                          &ldquo;{lastSubmittedNote.message}&rdquo;
                        </p>
                      </div>

                      {/* Real Dispatch Actions: Email Direct, Copy Formatted Message, or Write Another */}
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                        <a
                          href={`mailto:fazliuray@gmail.com?subject=${encodeURIComponent(
                            `[Web3 Collaboration - ${lastSubmittedNote.topic}] from ${lastSubmittedNote.senderName}`
                          )}&body=${encodeURIComponent(
                            buildFormattedDispatchText(lastSubmittedNote)
                          )}`}
                          className="sketch-pill inline-flex cursor-pointer items-center gap-1.5 bg-[#F5D78E] px-4 py-1.5 font-journal text-xs font-bold text-[#091526] hover:bg-[#FCE5A8]"
                        >
                          <HandEmailIcon className="h-3.5 w-3.5" />
                          <span>{isId ? 'Kirim via Email ↗' : 'Dispatch via Email ↗'}</span>
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            onCopyText(
                              isId ? 'Catatan Kolaborasi' : 'Collaboration Note',
                              buildFormattedDispatchText(lastSubmittedNote)
                            )
                          }
                          className="sketch-pill cursor-pointer px-4 py-1.5 font-journal text-xs font-bold text-[#FAF6EE]"
                        >
                          {isId ? 'Salin Pesan' : 'Copy Note'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setLastSubmittedNote(null)}
                          className="sketch-pill cursor-pointer bg-[#122644] px-4 py-1.5 font-journal text-xs font-semibold text-[#F5D78E]"
                        >
                          {isId ? '+ Tulis Catatan Lagi' : '+ Write Another Note'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-brush text-2xl text-[#091526] sm:text-[26px]">
                          {isId
                            ? 'Tinggalkan Catatan Kolaborasi'
                            : 'Leave a Quick Collaboration Note'}
                        </h4>
                        <CrownDoodle className="h-4 w-5" color="#091526" />
                      </div>
                      <span className="font-journal text-xs font-bold text-[#233F6B]">
                        Node • Testnet • Airdrop Alpha
                      </span>
                    </div>

                    {formError && (
                      <div
                        role="alert"
                        className="rounded-xl border-2 border-[#991B1B] bg-[#FEF2F2] px-3.5 py-2 font-journal text-xs font-bold text-[#991B1B] shadow-[2px_2px_0px_#991B1B]"
                      >
                        ⚠️ {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label
                          htmlFor="collab-sender-name"
                          className="mb-1 block font-journal text-[11px] font-bold text-[#091526]"
                        >
                          {isId ? 'Nama / Alias *' : 'Name / Alias *'}
                        </label>
                        <input
                          id="collab-sender-name"
                          type="text"
                          required
                          value={senderName}
                          onChange={(e) => {
                            setSenderName(e.target.value);
                            if (formError) setFormError(null);
                          }}
                          placeholder={isId ? 'Misal: Budi Web3' : 'e.g. Alex Web3'}
                          className="sketch-input w-full px-3.5 py-2 font-journal text-sm text-[#091526] placeholder-[#091526]/45"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="collab-sender-handle"
                          className="mb-1 block font-journal text-[11px] font-bold text-[#091526]"
                        >
                          {isId ? 'Kontak (X / Email / Telegram)' : 'Contact (X / Email / TG)'}
                        </label>
                        <input
                          id="collab-sender-handle"
                          type="text"
                          value={senderHandle}
                          onChange={(e) => setSenderHandle(e.target.value)}
                          placeholder="@username / email"
                          className="sketch-input w-full px-3.5 py-2 font-journal text-sm text-[#091526] placeholder-[#091526]/45"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="collab-topic"
                          className="mb-1 block font-journal text-[11px] font-bold text-[#091526]"
                        >
                          {isId ? 'Topik Kolaborasi' : 'Collaboration Topic'}
                        </label>
                        <select
                          id="collab-topic"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="sketch-input w-full cursor-pointer px-3.5 py-2 font-journal text-sm font-semibold text-[#091526]"
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
                    </div>

                    <div>
                      <label
                        htmlFor="collab-message"
                        className="mb-1 block font-journal text-[11px] font-bold text-[#091526]"
                      >
                        {isId ? 'Pesan / Ide Kolaborasi *' : 'Collaboration Message / Pitch *'}
                      </label>
                      <textarea
                        id="collab-message"
                        rows={2}
                        required
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder={
                          isId
                            ? 'Tulis ajakan kolaborasi, setup node, info testnet, atau alpha airdrop...'
                            : 'Write your collaboration idea, node setup, testnet alpha, or opportunity...'
                        }
                        className="sketch-input w-full resize-none px-3.5 py-2 font-journal text-sm text-[#091526] placeholder-[#091526]/45"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="font-journal text-[11px] font-semibold text-[#233F6B]">
                        {isId
                          ? '✨ Tersimpan real-time di Firebase & otomatis terhapus setelah 1 bulan (30 hari)'
                          : '✨ Saved real-time to Firebase & automatically deleted after 1 month (30 days)'}
                      </span>
                      <div className="flex items-center justify-end gap-2.5 ml-auto">
                        <button
                          type="button"
                          onClick={onClose}
                          className="sketch-input cursor-pointer px-4 py-2 font-journal text-xs font-bold text-[#091526] hover:bg-[#E5D8C3] sm:text-sm"
                        >
                          {isId ? 'Tutup' : 'Close'}
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="sketch-pill-dark shrink-0 cursor-pointer px-5 py-2 font-journal text-xs font-bold text-[#F3EBDD] disabled:opacity-60 sm:px-6 sm:text-sm"
                        >
                          {isSubmitting
                            ? isId
                              ? 'Menyimpan...'
                              : 'Saving...'
                            : isId
                              ? 'Simpan & Kirim Catatan →'
                              : 'Save & Post Note →'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Live Collaboration Notes Wall ("Papan Catatan Kolaborasi") */}
              <div className="mt-5 border-t-2 border-dashed border-[#0B192C]/25 pt-4">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <h5 className="font-brush text-xl text-[#091526] sm:text-2xl">
                    {isId
                      ? `Papan Catatan Kolaborasi (${notes.length})`
                      : `Collaboration Notes Board (${notes.length})`}
                  </h5>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#091526]/30 bg-[#FFFDF7] px-2.5 py-0.5 font-journal text-[10.5px] font-bold text-[#233F6B]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                    <span>
                      {isId
                        ? 'Auto-hapus 1 Bulan'
                        : '1-Month Auto-Delete'}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {notes.slice(0, 12).map((item) => {
                    const daysLeft = getRemainingDays(item.expiresAtMs);
                    return (
                      <div
                        key={item.id}
                        className="sketch-note-card flex flex-col justify-between p-3 text-[#091526]"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className="block truncate font-journal text-xs font-bold text-[#091526]">
                                {item.senderName}
                              </span>
                              <span className="block truncate font-mono-num text-[10.5px] text-[#233F6B]">
                                {item.senderHandle}
                              </span>
                            </div>
                            <span className="shrink-0 font-journal text-[10px] font-bold text-[#1B365C]">
                              {formatTopicLabel(item.topic)}
                            </span>
                          </div>
                          <p className="mt-1.5 font-journal text-xs leading-snug text-[#102136]">
                            &ldquo;{item.message}&rdquo;
                          </p>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-1 border-t border-dashed border-[#091526]/20 pt-1.5 text-[10px] text-[#233F6B]">
                          <div className="flex items-center gap-1.5">
                            <span>
                              {new Date(item.createdAt).toLocaleDateString(
                                isId ? 'id-ID' : 'en-US',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </span>
                            <span
                              className="rounded bg-[#F5D78E]/45 px-1.5 py-0.2 font-journal text-[9.5px] font-bold text-[#8C4F04]"
                              title={
                                isId
                                  ? 'Otomatis terhapus dari Firebase setelah 1 bulan'
                                  : 'Automatically deleted from Firebase after 1 month'
                              }
                            >
                              ⏳ {isId ? `${daysLeft} hari lagi` : `${daysLeft}d left`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onCopyText(
                                  item.senderName,
                                  `${item.senderName} (${item.senderHandle}) - ${item.message}`
                                )
                              }
                              className="cursor-pointer font-journal font-bold text-[#091526] underline hover:text-[#233F6B]"
                            >
                              {isId ? 'Salin' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </JournalPageOpenShell>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
