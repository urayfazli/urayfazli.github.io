import { Language, LanguageOption, NodeExperience, SkillCategory, MilestoneItem } from '../types';

export const languageOptions: LanguageOption[] = [
  { code: 'id', label: 'ID', name: 'Bahasa Indonesia', nativeName: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'EN', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', name: 'Mandarin (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ru', label: 'RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
];

export interface TranslationDictionary {
  nav: {
    about: string;
    nodeExperience: string;
    liveTelemetry: string;
    skills: string;
    contact: string;
    roleBadge: string;
  };
  hero: {
    tagline: string;
    greeting: string;
    name: string;
    bio: string;
    operatingNetworksTitle: string;
    viewExperienceBtn: string;
    contactBtn: string;
    stats: {
      networksLabel: string;
      networksHelper: string;
      uptimeLabel: string;
      uptimeHelper: string;
      slashingLabel: string;
      slashingHelper: string;
      latencyLabel: string;
      latencyHelper: string;
    };
  };
  profileCard: {
    verifiedBadge: string;
    statusOnline: string;
    availability: string;
    roleTitle: string;
    location: string;
    contactDirect: string;
    copyEmail: string;
    copied: string;
    openProfile: string;
    statsHeading: string;
  };
  experience: {
    badge: string;
    heading: string;
    subheading: string;
    visitNetworkBtn: string;
    responsibilitiesTitle: string;
    hardwareSpecsTitle: string;
    metricsTitle: string;
    techStackTitle: string;
    timelineBadge: string;
    timelineTitle: string;
    timelineSubheading: string;
    milestones: MilestoneItem[];
    nodes: NodeExperience[];
  };
  telemetry: {
    badge: string;
    heading: string;
    subheading: string;
    liveStreamActive: string;
    paused: string;
    pauseStream: string;
    resumeStream: string;
    testPing: string;
    testing: string;
    activeNodesCard: string;
    validatorStatusCard: string;
    p2pLatencyCard: string;
    terminalHeader: string;
    filterAll: string;
    liveLogsStream: string;
  };
  skills: {
    badge: string;
    heading: string;
    subheading: string;
    bestPractice: string;
    verified: string;
    securityBannerTitle: string;
    securityBannerDesc: string;
    discussBtn: string;
    categories: SkillCategory[];
  };
  contact: {
    badge: string;
    heading: string;
    subheading: string;
    profileSummaryRole: string;
    profileSummarySubtitle: string;
    githubLabel: string;
    xLabel: string;
    emailLabel: string;
    copyUsername: string;
    copyEmail: string;
    copied: string;
    openLink: string;
    sendEmailAction: string;
    availabilityNotice: string;
    formTitle: string;
    formNameLabel: string;
    formNamePlaceholder: string;
    formEmailLabel: string;
    formEmailPlaceholder: string;
    formTopicLabel: string;
    formTopicPlaceholder: string;
    formMessageLabel: string;
    formMessagePlaceholder: string;
    submitBtn: string;
    successTitle: string;
    successDesc: string;
    sendAnotherBtn: string;
  };
  footer: {
    description: string;
    backToTop: string;
    rightsReserved: string;
    slaNote: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  // ======================== BAHASA INDONESIA ========================
  id: {
    nav: {
      about: 'Tentang',
      nodeExperience: 'Pengalaman Node',
      liveTelemetry: 'Live Telemetry',
      skills: 'Keahlian',
      contact: 'Kontak',
      roleBadge: 'Operator Node'
    },
    hero: {
      tagline: 'Web3 Node Operator & Infrastructure Specialist',
      greeting: 'Halo, saya',
      name: 'Uray Fazli Alman',
      bio: 'Mengoperasikan validator & full-node berkinerja tinggi serta infrastruktur indexing terdesentralisasi dengan prinsip zero-slashing, arsitektur sentry terlindungi, dan pemantauan real-time 24/7.',
      operatingNetworksTitle: 'Node Operator di Jaringan:',
      viewExperienceBtn: 'Lihat Pengalaman Node',
      contactBtn: 'Hubungi Saya',
      stats: {
        networksLabel: '3+ Jaringan Utama',
        networksHelper: 'Sei, Aptos, SubQuery',
        uptimeLabel: '99.98%',
        uptimeHelper: 'SLA Ketersediaan Tinggi',
        slashingLabel: '0 Insiden',
        slashingHelper: '100% Zero-Slashing Record',
        latencyLabel: '< 35ms',
        latencyHelper: 'RPC & Indexer Teroptimasi'
      }
    },
    profileCard: {
      verifiedBadge: 'Verified Node Operator',
      statusOnline: 'ONLINE',
      availability: 'Tersedia untuk Operasi Node, Delegasi Validator & Konsultasi Web3',
      roleTitle: 'Web3 Infrastructure Specialist & Node Operator',
      location: 'Indonesia',
      contactDirect: 'Kontak Langsung',
      copyEmail: 'Salin Email',
      copied: 'Tersalin!',
      openProfile: 'Buka Profil',
      statsHeading: 'Metrik Operasional'
    },
    experience: {
      badge: 'Pengalaman Validator & Indexer',
      heading: 'Operasional Node & Infrastruktur Web3',
      subheading: 'Dedikasi tinggi dalam mengelola validator consensus, sinkronisasi state ledger paralel, dan sistem indexing data terdesentralisasi.',
      visitNetworkBtn: 'Website Jaringan',
      responsibilitiesTitle: 'Tanggung Jawab & Eksekusi Utama',
      hardwareSpecsTitle: 'Spesifikasi Server & Arsitektur',
      metricsTitle: 'Metrik Performa Node',
      techStackTitle: 'Teknologi & Tooling',
      timelineBadge: 'Linimasa Perjalanan Operasional',
      timelineTitle: 'Milestone & Rekam Jejak Infrastruktur',
      timelineSubheading: 'Perjalanan profesional mengoperasikan validator consensus, pengamanan arsitektur bare-metal, dan ekspansi indexing multi-chain dari masa ke masa.',
      milestones: [
        {
          id: 'm1',
          year: '2021',
          period: 'Q3 2021 - Q4 2021',
          title: 'Inisiasi Operasional & Riset Node Proof-of-Stake',
          role: 'Infrastruktur & Linux Systems Engineer',
          network: 'Cosmos & PoS Testnets',
          badgeColor: '#718096',
          description: 'Memulai perjalanan operasional node blockchain dengan mengeksplorasi Cosmos SDK, konfigurasi Linux server hardening (UFW, SSH key authentication), automasi systemd, dan partisipasi aktif dalam testnet terdistribusi.',
          achievements: [
            'Setup server bare-metal dan VPS terisolasi dengan optimasi memory swap dan firewall bertingkat.',
            'Mempelajari mekanika konsensus Tendermint/CometBFT serta mitigasi slashing akibat double-signing.',
            'Mengembangkan automated shell scripts untuk monitoring resource dan rotasi log berkala.'
          ],
          metrics: [
            { label: 'Eksperimen Testnet', value: '4+ Jaringan' },
            { label: 'Uptime Awal', value: '99.8%' }
          ]
        },
        {
          id: 'm2',
          year: '2022',
          period: 'Q3 2022 - Sekarang',
          title: 'Validator Aptos Mainnet & Eksekusi Mesin Block-STM',
          role: 'Validator & FullNode Operator',
          network: 'Aptos Network',
          badgeColor: '#38A169',
          description: 'Berpartisipasi dalam peluncuran Aptos Mainnet (AIT3 Testnet ke Mainnet), mengoperasikan validator berkemampuan tinggi dengan mesin eksekusi transaksi paralel Block-STM dan arsitektur key management berbasis hardware/vault.',
          achievements: [
            'Mengimplementasikan zero-downtime maintenance pipeline menggunakan Docker container orchestration.',
            'Menyediakan public REST dan gRPC API endpoint berkapasitas tinggi untuk ekosistem dApps Move.',
            'Mencatatkan rekor 100% zero-slashing dan tingkat keandalan sinkronisasi ledger paralel tinggi.'
          ],
          metrics: [
            { label: 'Uptime Konsensus', value: '99.96%' },
            { label: 'Insiden Slashing', value: '0 Insiden' }
          ]
        },
        {
          id: 'm3',
          year: '2023',
          period: 'Q1 2023 - Sekarang',
          title: 'Validator Sei Network & Arsitektur Sentry (SNA)',
          role: 'Lead Validator Operator',
          network: 'Sei Network',
          badgeColor: '#2B6CB0',
          description: 'Mengoperasikan validator node dan cluster RPC publik pada Layer 1 tercepat untuk trading. Mengadopsi Sentry Node Architecture (SNA) berlapis untuk memitigasi serangan DDoS dan memaksimalkan throughput konsensus Twin-Turbo sub-second.',
          achievements: [
            'Membangun sistem kompresi snapshot harian otomatis untuk mempercepat peer bootstrap < 5 menit.',
            'Menerapkan telemetry real-time Prometheus & Grafana untuk mendeteksi latensi p2p dan missed proposal.',
            'Berhasil melewati seluruh hardfork dan governance upgrade Sei tanpa downtime konsensus.'
          ],
          metrics: [
            { label: 'Block Latency', value: '~390ms' },
            { label: 'Partisipasi Blok', value: '99.99%' }
          ]
        },
        {
          id: 'm4',
          year: '2023 - 2024',
          period: 'Q3 2023 - Sekarang',
          title: 'Infrastruktur SubQuery Data Indexing & Multi-Chain RPC',
          role: 'Indexer Node Operator & RPC Coordinator',
          network: 'SubQuery Network',
          badgeColor: '#DD6B20',
          description: 'Memperluas kapabilitas ke layer indexing data terdesentralisasi. Mengelola node runner SubQuery terhubung ke PostgreSQL cluster berperforma tinggi untuk menyajikan GraphQL API latensi rendah ke dApps multi-chain.',
          achievements: [
            'Optimasi arsitektur database dengan tuning indexing query, buffer cache Redis, dan connection pool.',
            'Mengindeks lebih dari 50 juta blok lintas ekosistem EVM, Cosmos, dan Substrate.',
            'Menjamin ketersediaan API 99.95% SLA dengan response time eksekusi rata-rata di bawah 25ms.'
          ],
          metrics: [
            { label: 'Query SLA', value: '99.95%' },
            { label: 'Response Time', value: '<25ms' }
          ]
        },
        {
          id: 'm5',
          year: '2024 - Sekarang',
          period: '2024 - Present',
          title: 'Automasi Skala Penuh, Zero-Slashing & High-Availability',
          role: 'Principal Node Infrastructure Specialist',
          network: 'Multi-Network Fleet',
          badgeColor: '#2B6CB0',
          isCurrent: true,
          description: 'Mengonsolidasikan seluruh node dalam sistem manajemen terpadu dengan failover otomatis, pemantauan status kesehatan sentry multi-region, dan sistem alert webhook instan untuk kesiapan operasional enterprise 24/7.',
          achievements: [
            'Mempertahankan rekor 0 slashing di seluruh validator mainnet dan testnet aktif.',
            'Membangun infrastruktur backup terenkripsi otomatis dengan offsite snapshot synchronization.',
            'Membuka layanan konsultasi deployment node dan delegasi staking terpercaya untuk komunitas Web3.'
          ],
          metrics: [
            { label: 'Total Track Record', value: '100% Zero-Slashing' },
            { label: 'Monitoring SLA', value: '24/7 Real-Time' }
          ]
        }
      ],
      nodes: [
        {
          id: 'sei-network',
          name: 'Sei Network',
          tagline: 'Layer 1 tercepat untuk trading dan DeFi terdesentralisasi',
          logoText: 'SEI',
          role: 'Validator & Full-Node Operator',
          period: '2023 - Sekarang',
          status: 'Active',
          badgeColor: '#2B6CB0',
          networkType: 'Cosmos SDK / Twin-Turbo Consensus',
          description: 'Mengoperasikan validator node dan RPC sentry infrastructure pada Sei Network. Mengoptimalkan throughput pemrosesan blok sub-second dan latensi propagasi transaksi dengan snapshot otomatis dan state-sync.',
          keyResponsibilities: [
            'Mengelola arsitektur Sentry Node Architecture (SNA) guna melindungi validator utama dari serangan DDoS.',
            'Menyiapkan pipeline snapshot harian dan state-sync terkompresi untuk pemulihan cepat peer jaringan.',
            'Monitoring berkala menggunakan Prometheus & Grafana dashboard untuk memantau missed blocks, memory pressure, dan peer health.',
            'Melakukan upgrade binary node secara mulus saat hardfork atau upgrade governance Sei.'
          ],
          metrics: [
            { label: 'Uptime', value: '99.99%', sublabel: 'Partisipasi Konsensus' },
            { label: 'Missed Blocks', value: '0.01%', sublabel: 'Proteksi Slashing Ketat' },
            { label: 'Block Latency', value: '~390ms', sublabel: 'Finalitas Sub-Second' }
          ],
          techStack: ['Sei Node CLI', 'Cosmos SDK', 'Tendermint / CometBFT', 'Prometheus', 'Grafana', 'Ubuntu 22.04 LTS', 'Systemd'],
          specs: {
            cpu: '16 vCPUs (High Frequency)',
            ram: '64 GB DDR5 ECC',
            storage: '1 TB NVMe Gen4 SSD',
            network: '1 Gbps Unmetered Port'
          },
          link: 'https://www.sei.io'
        },
        {
          id: 'aptos-network',
          name: 'Aptos Network',
          tagline: 'Blockchain Layer 1 berkinerja tinggi berbasis bahasa pemrograman Move',
          logoText: 'APT',
          role: 'Validator & FullNode Operator',
          period: '2022 - Sekarang',
          status: 'Active',
          badgeColor: '#38A169',
          networkType: 'AptosBFT / Block-STM Parallel Engine',
          description: 'Mengelola node berkinerja tinggi pada ekosistem Aptos. Berpartisipasi dalam verifikasi transaksi paralel dengan mesin eksekusi Block-STM dan menyediakan public REST/gRPC API endpoints.',
          keyResponsibilities: [
            'Deploy dan maintenance instance Aptos Core Validator & FullNode menggunakan Docker dan binary native.',
            'Manajemen kunci validator yang aman (HSM/encrypted keystore) dengan rotasi credential berkala.',
            'Optimasi buffer I/O dan disk throughput untuk mengakomodasi volume TPS paralel yang tinggi.',
            'Integrasi alert otomatis via Telegram/Discord webhook untuk deteksi anomali desinkronisasi ledger.'
          ],
          metrics: [
            { label: 'Uptime', value: '99.96%', sublabel: 'Kesehatan Validator' },
            { label: 'Parallel Sync', value: 'Optimal', sublabel: 'Dukungan Block-STM' },
            { label: 'API Availability', value: '100%', sublabel: 'Endpoint REST & gRPC' }
          ],
          techStack: ['Aptos Core', 'Move VM', 'Docker', 'Ansible', 'Nginx Reverse Proxy', 'Grafana Cloud', 'Rust Toolchain'],
          specs: {
            cpu: '16 vCPUs Dedicated',
            ram: '64 GB High-Speed RAM',
            storage: '2 TB NVMe SSD (RAID-1)',
            network: '1 Gbps Redundant Bandwidth'
          },
          link: 'https://aptosnetwork.com'
        },
        {
          id: 'subquery-network',
          name: 'SubQuery Network',
          tagline: 'Infrastruktur indexing data terdesentralisasi yang cepat dan fleksibel',
          logoText: 'SQT',
          role: 'Indexer Node Operator & RPC Coordinator',
          period: '2023 - Sekarang',
          status: 'Synchronized',
          badgeColor: '#DD6B20',
          networkType: 'Decentralized Web3 Data Indexer',
          description: 'Menjalankan node indexer terdesentralisasi untuk memproses, mengindeks, dan menyajikan query data multi-chain GraphQL berlatensi rendah untuk berbagai dApps dan smart contract explorer.',
          keyResponsibilities: [
            'Setup cluster indexer terdistribusi menggunakan SubQuery Node runner dan PostgreSQL cluster berkapasitas tinggi.',
            'Optimasi indexing speed dengan index tuning, batching query, dan caching layer berbasis Redis.',
            'Memastikan konsistensi data riwayat transaksi dan log smart contract lintas blockchain (EVM, Cosmos, Polkadot).',
            'Menyediakan query GraphQL SLA tinggi dengan response time rata-rata di bawah 30ms.'
          ],
          metrics: [
            { label: 'Query Speed', value: '<25ms', sublabel: 'Rata-rata Eksekusi GraphQL' },
            { label: 'Indexed Blocks', value: '50M+', sublabel: 'Multi-Chain Block Height' },
            { label: 'Service SLA', value: '99.95%', sublabel: 'Ketersediaan Indexer' }
          ],
          techStack: ['SubQuery Node CLI', 'GraphQL Engine', 'PostgreSQL', 'Redis', 'Docker Compose', 'Prometheus Exporter'],
          specs: {
            cpu: '12 vCPUs Dedicated',
            ram: '32 GB DDR4 RAM',
            storage: '1.5 TB Fast NVMe',
            network: '1 Gbps Network Backbone'
          },
          link: 'https://subquery.network'
        }
      ]
    },
    telemetry: {
      badge: 'Live Telemetry & Node Health',
      heading: 'Simulasi Status Real-time Node Operator',
      subheading: 'Visualisasi metrik operasional, pemantauan konsensus, dan log audit dari instance aktif.',
      liveStreamActive: 'Live Telemetry Aktif',
      paused: 'Streaming Dijeda',
      pauseStream: 'Jeda Log',
      resumeStream: 'Lanjutkan Log',
      testPing: 'Uji Ping RPC',
      testing: 'Menguji...',
      activeNodesCard: 'Node Berjalan',
      validatorStatusCard: 'Status Konsensus',
      p2pLatencyCard: 'Latensi Peer RPC',
      terminalHeader: 'Terminal Audit & Log Jaringan',
      filterAll: 'Semua Node',
      liveLogsStream: 'Live Logs Stream'
    },
    skills: {
      badge: 'Keahlian Teknis',
      heading: 'Infrastruktur, DevOps & Keamanan Validator',
      subheading: 'Kombinasi keahlian mendalam dalam protokol blockchain layer-1, manajemen server bare-metal & cloud, serta automasi pipeline monitoring.',
      bestPractice: 'Praktik Terbaik Industri',
      verified: 'Terverifikasi',
      securityBannerTitle: 'Prinsip Keamanan Tanpa Kompromi (Zero-Slashing)',
      securityBannerDesc: 'Mengutamakan isolasi privkey validator, backup snapshot terenkripsi, serta multi-sentry node redundancy untuk memastikan node tetap aman dan selalu online.',
      discussBtn: 'Diskusi Kolaborasi Node',
      categories: [
        {
          title: 'Operasional Blockchain & Node',
          iconName: 'Server',
          skills: [
            { name: 'Validator Operations', level: 'Expert', description: 'Arsitektur sentry, zero-slashing practices, dan manajemen kunci aman.' },
            { name: 'Cosmos SDK & Tendermint', level: 'Advanced', description: 'State-sync, cosmovisor auto-upgrades, dan governance via CLI.' },
            { name: 'Aptos Core & Move', level: 'Advanced', description: 'Block-STM parallel sync, genesis setup, dan telemetri REST.' },
            { name: 'SubQuery Indexing', level: 'Advanced', description: 'GraphQL endpoints, data dictionaries, dan migrasi schema.' }
          ]
        },
        {
          title: 'DevOps & Infrastruktur Cloud',
          iconName: 'Cpu',
          skills: [
            { name: 'Admin Server Linux (Ubuntu/Debian)', level: 'Expert', description: 'Kernel tuning, systemd services, dan hardening keamanan.' },
            { name: 'Kontainerisasi (Docker)', level: 'Advanced', description: 'Multi-stage builds, compose clusters, dan resource constraints.' },
            { name: 'Automasi (Ansible / Bash)', level: 'Advanced', description: 'Infrastructure as Code, script auto-restart, dan pipeline backup.' },
            { name: 'Jaringan & Firewall', level: 'Advanced', description: 'UFW, iptables, manajemen port P2P, proteksi DDoS Cloudflare.' }
          ]
        },
        {
          title: 'Monitoring, Alerting & Keamanan',
          iconName: 'ShieldCheck',
          skills: [
            { name: 'Prometheus & Grafana', level: 'Expert', description: 'Custom dashboards, node exporter metrics, RPC latency alerts.' },
            { name: 'Notifikasi Insiden Real-time', level: 'Advanced', description: 'Webhook bot Telegram/Discord untuk missed blocks & disk alerts.' },
            { name: 'Hardware Security & Key Vaults', level: 'Advanced', description: 'Manajemen kunci air-gapped dan delegasi cold storage aman.' },
            { name: 'Disaster Recovery & Snapshot', level: 'Expert', description: 'Automasi pruning harian dan sinkronisasi cepat bootstrap.' }
          ]
        }
      ]
    },
    contact: {
      badge: 'Hubungi Saya',
      heading: 'Terhubung & Kolaborasi',
      subheading: 'Terbuka untuk kolaborasi node operator, validator delegation, konsultasi arsitektur Web3, atau diskusi infrastruktur blockchain.',
      profileSummaryRole: 'Node Operator & Web3 Infra',
      profileSummarySubtitle: 'Sei • Aptos • SubQuery',
      githubLabel: 'GitHub',
      xLabel: 'X (Twitter)',
      emailLabel: 'Email Langsung',
      copyUsername: 'Salin Username',
      copyEmail: 'Salin Email',
      copied: 'Tersalin!',
      openLink: 'Buka Tautan',
      sendEmailAction: 'Kirim Email',
      availabilityNotice: 'Respon aktif untuk proposal validator testnet/mainnet dan kolaborasi devnet.',
      formTitle: 'Kirim Pesan / Proposal Node',
      formNameLabel: 'Nama Lengkap / Proyek *',
      formNamePlaceholder: 'Contoh: Alex / DeFi Labs',
      formEmailLabel: 'Email Kontak *',
      formEmailPlaceholder: 'nama@domain.com',
      formTopicLabel: 'Jaringan / Kategori Topik',
      formTopicPlaceholder: 'Contoh: Sei Network, Aptos, SubQuery Indexer, atau Lainnya',
      formMessageLabel: 'Pesan atau Detail Kebutuhan *',
      formMessagePlaceholder: 'Jelaskan kebutuhan validator, pertanyaan teknis, atau proposal kerja sama...',
      submitBtn: 'Kirim Pesan ke Uray Fazli Alman',
      successTitle: 'Membuka Klien Email Anda',
      successDesc: 'Format pesan telah disiapkan. Terima kasih telah menghubungi Uray Fazli Alman!',
      sendAnotherBtn: 'Kirim pesan lain'
    },
    footer: {
      description: 'Node Operator & Web3 Infrastructure • Sei Network | Aptos Network | SubQuery Network',
      backToTop: 'Kembali ke atas',
      rightsReserved: 'All rights reserved.',
      slaNote: 'High-Availability Decentralized Blockchain Node Operations'
    }
  },

  // ======================== ENGLISH ========================
  en: {
    nav: {
      about: 'About',
      nodeExperience: 'Node Experience',
      liveTelemetry: 'Live Telemetry',
      skills: 'Skills',
      contact: 'Contact',
      roleBadge: 'Node Operator'
    },
    hero: {
      tagline: 'Web3 Node Operator & Infrastructure Specialist',
      greeting: "Hello, I'm",
      name: 'Uray Fazli Alman',
      bio: 'Operating high-performance validator & full-nodes and decentralized indexing infrastructure with a strict zero-slashing record, protected sentry architecture, and 24/7 real-time monitoring.',
      operatingNetworksTitle: 'Node Operator across Networks:',
      viewExperienceBtn: 'View Node Experience',
      contactBtn: 'Get in Touch',
      stats: {
        networksLabel: '3+ Core Networks',
        networksHelper: 'Sei, Aptos, SubQuery',
        uptimeLabel: '99.98%',
        uptimeHelper: 'High Availability SLA',
        slashingLabel: '0 Incidents',
        slashingHelper: '100% Zero-Slashing Track Record',
        latencyLabel: '< 35ms',
        latencyHelper: 'Optimized RPC & Indexer'
      }
    },
    profileCard: {
      verifiedBadge: 'Verified Node Operator',
      statusOnline: 'ONLINE',
      availability: 'Available for Node Ops, Validator Delegation & Web3 Infra Consulting',
      roleTitle: 'Web3 Infrastructure Specialist & Node Operator',
      location: 'Indonesia',
      contactDirect: 'Direct Contact',
      copyEmail: 'Copy Email',
      copied: 'Copied!',
      openProfile: 'Open Profile',
      statsHeading: 'Operational Metrics'
    },
    experience: {
      badge: 'Validator & Indexer Experience',
      heading: 'Node Operations & Web3 Infrastructure',
      subheading: 'Proven track record in managing consensus validators, parallel state ledger syncing, and decentralized multi-chain indexing.',
      visitNetworkBtn: 'Network Website',
      responsibilitiesTitle: 'Key Responsibilities & Deliverables',
      hardwareSpecsTitle: 'Hardware Specifications & Architecture',
      metricsTitle: 'Node Performance Metrics',
      techStackTitle: 'Technologies & Tooling',
      timelineBadge: 'Operational Journey Timeline',
      timelineTitle: 'Infrastructure Milestones & Track Record',
      timelineSubheading: 'A chronological journey of professional node operations, bare-metal server hardening, consensus security, and decentralized indexing expansion.',
      milestones: [
        {
          id: 'm1',
          year: '2021',
          period: 'Q3 2021 - Q4 2021',
          title: 'Proof-of-Stake Node Operations & Research Genesis',
          role: 'Infrastructure & Linux Systems Engineer',
          network: 'Cosmos & PoS Testnets',
          badgeColor: '#718096',
          description: 'Initiated the blockchain validator journey by mastering Cosmos SDK architectures, Linux enterprise server hardening (UFW firewall rules, key-based SSH), systemd service automations, and decentralized testnet deployments.',
          achievements: [
            'Configured bare-metal and dedicated servers with memory swap optimizations and defense-in-depth firewalls.',
            'Analyzed Tendermint/CometBFT consensus mechanisms and implemented safeguards against double-signing slashing.',
            'Developed automated bash toolsets for real-time node health monitoring and log rotation.'
          ],
          metrics: [
            { label: 'Testnet Labs', value: '4+ Networks' },
            { label: 'Early Uptime', value: '99.8%' }
          ]
        },
        {
          id: 'm2',
          year: '2022',
          period: 'Q3 2022 - Present',
          title: 'Aptos Mainnet Validator & Block-STM Engine Execution',
          role: 'Validator & FullNode Operator',
          network: 'Aptos Network',
          badgeColor: '#38A169',
          description: 'Participated in the Aptos Mainnet genesis launch (AIT3 Testnet transition to Mainnet), deploying high-throughput validator infrastructure optimized for Block-STM parallel execution engine and hardware-secured key management.',
          achievements: [
            'Engineered zero-downtime maintenance workflows leveraging Docker container orchestration and live health checks.',
            'Provided high-bandwidth public REST and gRPC API endpoints supporting the Move ecosystem.',
            'Maintained a spotless 100% zero-slashing track record with uninterrupted parallel ledger synchronization.'
          ],
          metrics: [
            { label: 'Consensus Uptime', value: '99.96%' },
            { label: 'Slashing Incidents', value: '0 Incidents' }
          ]
        },
        {
          id: 'm3',
          year: '2023',
          period: 'Q1 2023 - Present',
          title: 'Sei Network Validator & Sentry Node Architecture (SNA)',
          role: 'Lead Validator Operator',
          network: 'Sei Network',
          badgeColor: '#2B6CB0',
          description: 'Deployed validator node and public RPC cluster on the fastest Layer 1 trading blockchain. Implemented multi-tier Sentry Node Architecture (SNA) to isolate validators from DDoS vectors and sustain sub-second Twin-Turbo consensus.',
          achievements: [
            'Built automated high-compression daily snapshot pipelines, slashing peer bootstrap time to under 5 minutes.',
            'Deployed full-stack Prometheus & Grafana dashboards tracking peer latency, memory pressure, and block proposals.',
            'Seamlessly executed all protocol hardforks and governance upgrades with zero validator downtime.'
          ],
          metrics: [
            { label: 'Block Latency', value: '~390ms' },
            { label: 'Block Participation', value: '99.99%' }
          ]
        },
        {
          id: 'm4',
          year: '2023 - 2024',
          period: 'Q3 2023 - Present',
          title: 'SubQuery Decentralized Indexer & Multi-Chain RPC Fleet',
          role: 'Indexer Node Operator & RPC Coordinator',
          network: 'SubQuery Network',
          badgeColor: '#DD6B20',
          description: 'Expanded infrastructure capabilities into the decentralized data indexing layer. Managed SubQuery node runners paired with high-performance PostgreSQL clusters to serve sub-30ms GraphQL queries across multi-chain ecosystems.',
          achievements: [
            'Fine-tuned relational indexing queries, Redis buffer caches, and connection pooling for maximum throughput.',
            'Successfully indexed over 50 million blocks across EVM, Cosmos, and Substrate networks.',
            'Delivered enterprise-grade 99.95% API SLA availability with average execution response times below 25ms.'
          ],
          metrics: [
            { label: 'Query SLA', value: '99.95%' },
            { label: 'Response Time', value: '<25ms' }
          ]
        },
        {
          id: 'm5',
          year: '2024 - Present',
          period: '2024 - Present',
          title: 'Full-Spectrum Node Automation, Zero-Slashing & Enterprise HA',
          role: 'Principal Node Infrastructure Specialist',
          network: 'Multi-Network Fleet',
          badgeColor: '#2B6CB0',
          isCurrent: true,
          description: 'Consolidated multi-network operations into a unified management architecture with automatic failover, multi-region sentry telemetry, and instant webhook alert dispatch for round-the-clock enterprise reliability.',
          achievements: [
            'Maintained an unbroken 100% zero-slashing record across all active production mainnet and testnet validators.',
            'Engineered encrypted offsite snapshot distribution and automated disaster recovery protocols.',
            'Provided validator delegation infrastructure and institutional consulting services for Web3 builders.'
          ],
          metrics: [
            { label: 'Track Record', value: '100% Zero-Slashing' },
            { label: 'Monitoring SLA', value: '24/7 Real-Time' }
          ]
        }
      ],
      nodes: [
        {
          id: 'sei-network',
          name: 'Sei Network',
          tagline: 'The fastest Layer 1 blockchain for high-frequency trading and DeFi',
          logoText: 'SEI',
          role: 'Validator & Full-Node Operator',
          period: '2023 - Present',
          status: 'Active',
          badgeColor: '#2B6CB0',
          networkType: 'Cosmos SDK / Twin-Turbo Consensus',
          description: 'Operating validator node and RPC sentry infrastructure on Sei Network. Optimized sub-second block processing throughput and fast transaction propagation via automated snapshots and state-sync.',
          keyResponsibilities: [
            'Architected Sentry Node Architecture (SNA) to isolate and shield the validator from DDoS vectors.',
            'Built automated daily snapshot and compressed state-sync pipelines for rapid network peer bootstrapping.',
            'Continuous telemetry via Prometheus & Grafana to monitor missed blocks, memory saturation, and peer health.',
            'Executed seamless zero-downtime binary upgrades during Sei governance hardforks.'
          ],
          metrics: [
            { label: 'Uptime', value: '99.99%', sublabel: 'Consensus Participation' },
            { label: 'Missed Blocks', value: '0.01%', sublabel: 'Strict Slashing Protection' },
            { label: 'Block Latency', value: '~390ms', sublabel: 'Sub-Second Finality' }
          ],
          techStack: ['Sei Node CLI', 'Cosmos SDK', 'Tendermint / CometBFT', 'Prometheus', 'Grafana', 'Ubuntu 22.04 LTS', 'Systemd'],
          specs: {
            cpu: '16 vCPUs (High Frequency)',
            ram: '64 GB DDR5 ECC',
            storage: '1 TB NVMe Gen4 SSD',
            network: '1 Gbps Unmetered Port'
          },
          link: 'https://www.sei.io'
        },
        {
          id: 'aptos-network',
          name: 'Aptos Network',
          tagline: 'High-throughput Layer 1 blockchain powered by the Move programming language',
          logoText: 'APT',
          role: 'Validator & FullNode Operator',
          period: '2022 - Present',
          status: 'Active',
          badgeColor: '#38A169',
          networkType: 'AptosBFT / Block-STM Parallel Engine',
          description: 'Managing enterprise-grade validator instances on Aptos. Actively validating parallel transactions powered by the Block-STM execution engine with public REST and gRPC API endpoints.',
          keyResponsibilities: [
            'Deployed and maintained Aptos Core Validator & FullNode instances via Docker and native binaries.',
            'Enforced strict cryptographic key vault security (HSM/encrypted keystores) with periodic credential rotation.',
            'Tuned I/O buffers and NVMe throughput to support ultra-high parallel transaction volumes.',
            'Configured automated real-time incident alerts via Telegram/Discord for instantaneous desync mitigation.'
          ],
          metrics: [
            { label: 'Uptime', value: '99.96%', sublabel: 'Validator Health' },
            { label: 'Parallel Sync', value: 'Optimal', sublabel: 'Block-STM Engine' },
            { label: 'API Availability', value: '100%', sublabel: 'REST & gRPC Endpoints' }
          ],
          techStack: ['Aptos Core', 'Move VM', 'Docker', 'Ansible', 'Nginx Reverse Proxy', 'Grafana Cloud', 'Rust Toolchain'],
          specs: {
            cpu: '16 vCPUs Dedicated',
            ram: '64 GB High-Speed RAM',
            storage: '2 TB NVMe SSD (RAID-1)',
            network: '1 Gbps Redundant Bandwidth'
          },
          link: 'https://aptosnetwork.com'
        },
        {
          id: 'subquery-network',
          name: 'SubQuery Network',
          tagline: 'Fast, flexible, and decentralized indexing infrastructure for Web3 dApps',
          logoText: 'SQT',
          role: 'Indexer Node Operator & RPC Coordinator',
          period: '2023 - Present',
          status: 'Synchronized',
          badgeColor: '#DD6B20',
          networkType: 'Decentralized Web3 Data Indexer',
          description: 'Operating decentralized indexer nodes to parse, index, and serve sub-30ms GraphQL queries for multi-chain dApps, explorers, and decentralized protocols.',
          keyResponsibilities: [
            'Configured high-capacity distributed indexer clusters using SubQuery Node runners and optimized PostgreSQL.',
            'Maximized indexing speed through relational index tuning, multi-threaded batching, and Redis caching layers.',
            'Guaranteed transaction log and state consistency across EVM, Cosmos, and Polkadot networks.',
            'Delivered enterprise-grade GraphQL query SLA with average response times under 25ms.'
          ],
          metrics: [
            { label: 'Query Speed', value: '<25ms', sublabel: 'GraphQL Execution Avg' },
            { label: 'Indexed Blocks', value: '50M+', sublabel: 'Multi-Chain Block Height' },
            { label: 'Service SLA', value: '99.95%', sublabel: 'Indexer Availability' }
          ],
          techStack: ['SubQuery Node CLI', 'GraphQL Engine', 'PostgreSQL', 'Redis', 'Docker Compose', 'Prometheus Exporter'],
          specs: {
            cpu: '12 vCPUs Dedicated',
            ram: '32 GB DDR4 RAM',
            storage: '1.5 TB Fast NVMe',
            network: '1 Gbps Network Backbone'
          },
          link: 'https://subquery.network'
        }
      ]
    },
    telemetry: {
      badge: 'Live Telemetry & Node Health',
      heading: 'Real-time Node Operations Simulation',
      subheading: 'Live visualization of operational metrics, consensus validation, and audit logs from running instances.',
      liveStreamActive: 'Live Telemetry Active',
      paused: 'Stream Paused',
      pauseStream: 'Pause Logs',
      resumeStream: 'Resume Logs',
      testPing: 'Test RPC Ping',
      testing: 'Testing...',
      activeNodesCard: 'Active Nodes',
      validatorStatusCard: 'Consensus Health',
      p2pLatencyCard: 'Peer RPC Latency',
      terminalHeader: 'Network Audit & Telemetry Terminal',
      filterAll: 'All Nodes',
      liveLogsStream: 'Live Logs Stream'
    },
    skills: {
      badge: 'Technical Capabilities',
      heading: 'Infrastructure, DevOps & Validator Security',
      subheading: 'Comprehensive expertise spanning Layer 1 consensus protocols, bare-metal server management, and automated telemetry pipelines.',
      bestPractice: 'Industry Best Practices',
      verified: 'Verified',
      securityBannerTitle: 'Zero-Slashing & Uncompromising Security',
      securityBannerDesc: 'Prioritizing validator private key isolation, encrypted snapshot backups, and multi-sentry redundancy to keep nodes 100% online.',
      discussBtn: 'Discuss Node Collaboration',
      categories: [
        {
          title: 'Blockchain & Node Operations',
          iconName: 'Server',
          skills: [
            { name: 'Validator Operations', level: 'Expert', description: 'Sentry architectures, zero-slashing practices, and key management.' },
            { name: 'Cosmos SDK & Tendermint', level: 'Advanced', description: 'State-sync, cosmovisor auto-upgrades, and governance via CLI.' },
            { name: 'Aptos Core & Move', level: 'Advanced', description: 'Block-STM parallel sync, genesis setup, and REST telemetry.' },
            { name: 'SubQuery Indexing', level: 'Advanced', description: 'GraphQL endpoints, data dictionaries, and schema migrations.' }
          ]
        },
        {
          title: 'DevOps & Cloud Infrastructure',
          iconName: 'Cpu',
          skills: [
            { name: 'Linux Server Admin (Ubuntu/Debian)', level: 'Expert', description: 'Kernel tuning, systemd services, and security hardening.' },
            { name: 'Containerization (Docker)', level: 'Advanced', description: 'Multi-stage builds, compose clusters, and resource constraints.' },
            { name: 'Automation (Ansible / Bash)', level: 'Advanced', description: 'Infrastructure as Code, auto-restart scripts, backup pipelines.' },
            { name: 'Networking & Firewalls', level: 'Advanced', description: 'UFW, iptables, P2P port routing, Cloudflare DDoS shielding.' }
          ]
        },
        {
          title: 'Monitoring, Alerting & Security',
          iconName: 'ShieldCheck',
          skills: [
            { name: 'Prometheus & Grafana', level: 'Expert', description: 'Custom dashboards, node exporter metrics, RPC latency alerts.' },
            { name: 'Real-time Incident Alerting', level: 'Advanced', description: 'Telegram/Discord webhook bots for missed blocks & disk alerts.' },
            { name: 'Hardware Security & Key Vaults', level: 'Advanced', description: 'Air-gapped key management and secure cold storage delegation.' },
            { name: 'Disaster Recovery & Snapshots', level: 'Expert', description: 'Automated daily pruning and rapid bootstrap synchronization.' }
          ]
        }
      ]
    },
    contact: {
      badge: 'Get in Touch',
      heading: 'Connect & Collaborate',
      subheading: 'Open for validator node delegation, testnet/mainnet operator proposals, Web3 infrastructure consulting, and blockchain devops discussions.',
      profileSummaryRole: 'Node Operator & Web3 Infra',
      profileSummarySubtitle: 'Sei • Aptos • SubQuery',
      githubLabel: 'GitHub',
      xLabel: 'X (Twitter)',
      emailLabel: 'Direct Email',
      copyUsername: 'Copy Username',
      copyEmail: 'Copy Email',
      copied: 'Copied!',
      openLink: 'Open Link',
      sendEmailAction: 'Send Email',
      availabilityNotice: 'Active turnaround for validator testnet/mainnet node proposals and devnet collaborations.',
      formTitle: 'Send Message / Node Proposal',
      formNameLabel: 'Full Name / Project *',
      formNamePlaceholder: 'e.g. Alex / DeFi Labs',
      formEmailLabel: 'Contact Email *',
      formEmailPlaceholder: 'name@domain.com',
      formTopicLabel: 'Network / Topic Category',
      formTopicPlaceholder: 'e.g. Sei Network, Aptos, SubQuery Indexer, or Other',
      formMessageLabel: 'Message or Project Requirements *',
      formMessagePlaceholder: 'Describe your validator node needs, technical inquiries, or partnership proposals...',
      submitBtn: 'Send Message to Uray Fazli Alman',
      successTitle: 'Opening Your Email Client',
      successDesc: 'Email template prepared. Thank you for reaching out to Uray Fazli Alman!',
      sendAnotherBtn: 'Send another message'
    },
    footer: {
      description: 'Node Operator & Web3 Infrastructure • Sei Network | Aptos Network | SubQuery Network',
      backToTop: 'Back to top',
      rightsReserved: 'All rights reserved.',
      slaNote: 'High-Availability Decentralized Blockchain Node Operations'
    }
  },

  // ======================== MANDARIN CHINESE (简体中文) ========================
  zh: {
    nav: {
      about: '关于',
      nodeExperience: '节点经验',
      liveTelemetry: '实时遥测',
      skills: '技术栈',
      contact: '联系我',
      roleBadge: '节点运营者'
    },
    hero: {
      tagline: 'Web3 节点运营与区块链基础设施专家',
      greeting: '你好，我是',
      name: 'Uray Fazli Alman',
      bio: '运营高性能验证者节点、全节点以及去中心化多链索引基础设施，秉持零罚没（Zero-Slashing）记录、哨兵防护架构与全天候 24/7 实时监控。',
      operatingNetworksTitle: '运营网络与区块链生态：',
      viewExperienceBtn: '查看节点经验',
      contactBtn: '联系我',
      stats: {
        networksLabel: '3+ 核心网络',
        networksHelper: 'Sei, Aptos, SubQuery',
        uptimeLabel: '99.98%',
        uptimeHelper: '高可用性 SLA 保证',
        slashingLabel: '0 次惩罚',
        slashingHelper: '100% 零罚没运营记录',
        latencyLabel: '< 35ms',
        latencyHelper: '深度优化 RPC 与索引'
      }
    },
    profileCard: {
      verifiedBadge: '已认证验证者节点运营商',
      statusOnline: '在线',
      availability: '随时承接节点运营、验证者质押委托及 Web3 基础设施顾问',
      roleTitle: 'Web3 基础设施专家 & 节点运营者',
      location: '印度尼西亚',
      contactDirect: '直接联系',
      copyEmail: '复制邮箱',
      copied: '已复制！',
      openProfile: '打开主页',
      statsHeading: '运营核心指标'
    },
    experience: {
      badge: '验证者与索引器运营经验',
      heading: '节点运营与 Web3 基础设施',
      subheading: '深耕共识验证者维护、并行状态账本同步及去中心化多链数据索引系统。',
      visitNetworkBtn: '访问网络官网',
      responsibilitiesTitle: '核心职责与执行成果',
      hardwareSpecsTitle: '硬件配置与服务器架构',
      metricsTitle: '节点运行表现指标',
      techStackTitle: '技术栈与工具链',
      timelineBadge: '专业运营发展时间线',
      timelineTitle: '基础设施里程碑与成长历程',
      timelineSubheading: '记录从 PoS 测试网初探、裸金属服务器加固，到 Layer 1 共识验证与去中心化数据索引集群的完整技术进阶。',
      milestones: [
        {
          id: 'm1',
          year: '2021',
          period: '2021年 Q3 - Q4',
          title: 'PoS 节点运营与底层区块链基建探索',
          role: 'Linux 系统与基础设施工程师',
          network: 'Cosmos & PoS 测试网',
          badgeColor: '#718096',
          description: '开启区块链节点运营之旅，深入 Cosmos SDK 架构，完成 Linux 企业级服务器加固（UFW 防火墙配置、SSH 密钥认证）、systemd 服务守护及多测试网部署。',
          achievements: [
            '配置独立裸金属与 VPS 服务器，深度优化 Swap 内存交换与纵深防御防火墙规则。',
            '钻研 Tendermint/CometBFT 共识机制，严格规避双签名惩罚（Double-Signing Slashing）。',
            '编写自动化 Shell 运维脚本，实现资源水位监控与定时日志轮替。'
          ],
          metrics: [
            { label: '测试网实验室', value: '4+ 网络' },
            { label: '初期在线率', value: '99.8%' }
          ]
        },
        {
          id: 'm2',
          year: '2022',
          period: '2022年 Q3 - 至今',
          title: 'Aptos 主网验证者部署与 Block-STM 并行架构',
          role: '验证者 & 全节点运营商',
          network: 'Aptos Network',
          badgeColor: '#38A169',
          description: '深度参与 Aptos 主网创世上线（AIT3 测试网平滑过渡至主网），部署适配 Block-STM 并行执行引擎的高吞吐量验证者与全节点，采用硬件/金库级密钥隔离。',
          achievements: [
            '基于 Docker 容器编排构建零停机热升级与实时健康探针。',
            '为 Move 生态 dApps 提供高并发公共 REST 与 gRPC API 接入点。',
            '保持 100% 零罚没记录，并行账本同步稳定可靠。'
          ],
          metrics: [
            { label: '共识在线率', value: '99.96%' },
            { label: '罚没事件', value: '0 次' }
          ]
        },
        {
          id: 'm3',
          year: '2023',
          period: '2023年 Q1 - 至今',
          title: 'Sei Network 极速验证者与哨兵防护体系 (SNA)',
          role: '主验证者运维负责人',
          network: 'Sei Network',
          badgeColor: '#2B6CB0',
          description: '在最快交易公链 Sei Network 上部署主网验证者与公共 RPC 集群。实施多层哨兵节点架构（SNA），抵御外部 DDoS 攻击，支撑 Twin-Turbo 亚秒级极速出块。',
          achievements: [
            '搭建高压缩比每日快照自动化流水线，将新节点引导时间缩短至 5 分钟以内。',
            '部署 Prometheus & Grafana 监控大屏，实时追踪 P2P 延迟、内存负载及区块提案状态。',
            '零故障完成所有硬分叉升级与链上治理决策。'
          ],
          metrics: [
            { label: '出块延迟', value: '~390ms' },
            { label: '出块参与率', value: '99.99%' }
          ]
        },
        {
          id: 'm4',
          year: '2023 - 2024',
          period: '2023年 Q3 - 至今',
          title: 'SubQuery 去中心化多链数据索引与 RPC 集群',
          role: '索引器节点运营商 & RPC 协调员',
          network: 'SubQuery Network',
          badgeColor: '#DD6B20',
          description: '拓展基础设施能力至去中心化数据索引层。管理 SubQuery 运行节点与高性能 PostgreSQL 数据库集群，为多链应用提供低于 30ms 的 GraphQL 查询服务。',
          achievements: [
            '调优关系型数据库索引、Redis 高速缓存及连接池参数以释放极致吞吐。',
            '成功索引跨 EVM、Cosmos 与 Substrate 生态超 5000 万区块高度数据。',
            '提供企业级 99.95% API SLA 可用性保障，平均查询响应时间低于 25ms。'
          ],
          metrics: [
            { label: '服务 SLA', value: '99.95%' },
            { label: '响应延迟', value: '<25ms' }
          ]
        },
        {
          id: 'm5',
          year: '2024 - 至今',
          period: '2024 - Present',
          title: '全链路自动化运维、零罚没记录与企业级高可用',
          role: '首席节点基础设施架构师',
          network: '多网络节点集群',
          badgeColor: '#2B6CB0',
          isCurrent: true,
          description: '统一多链多网络运营体系，引入自动故障转移、多地域哨兵遥测与即时 Webhook 告警系统，确保 7x24 小时不间断的企业级安全与稳定性。',
          achievements: [
            '全网所有活跃主网与测试网验证者始终保持 100% 零罚没（Zero-Slashing）记录。',
            '构建加密异地快照同步与灾难恢复机制。',
            '为 Web3 项目与质押委托者提供专业的节点部署咨询与托管服务。'
          ],
          metrics: [
            { label: '历史惩罚', value: '100% 零罚没' },
            { label: '监控保障', value: '24/7 实时' }
          ]
        }
      ],
      nodes: [
        {
          id: 'sei-network',
          name: 'Sei Network',
          tagline: '专为高频交易与去中心化金融打造的最快 Layer 1 区块链',
          logoText: 'SEI',
          role: '验证者 & 全节点运营商',
          period: '2023 - 至今',
          status: 'Active',
          badgeColor: '#2B6CB0',
          networkType: 'Cosmos SDK / Twin-Turbo 共识',
          description: '在 Sei Network 上运营验证者节点与 RPC 哨兵基础设施。通过自动化快照与 state-sync 优化亚秒级区块处理吞吐量及交易广播延迟。',
          keyResponsibilities: [
            '部署哨兵节点架构（SNA），有效隔离并抵御 DDoS 攻击威胁。',
            '搭建自动化每日快照与高压缩比 state-sync 流水线，保障对等节点秒级恢复。',
            '基于 Prometheus & Grafana 监控漏块率、内存压力与 P2P 节点健康度。',
            '在 Sei 治理硬分叉与二进制升级期间实现零停机无缝迁移。'
          ],
          metrics: [
            { label: '正常运行率', value: '99.99%', sublabel: '共识参与度' },
            { label: '漏块率', value: '0.01%', sublabel: '严格防罚没保障' },
            { label: '出块延迟', value: '~390ms', sublabel: '亚秒级终局确认' }
          ],
          techStack: ['Sei Node CLI', 'Cosmos SDK', 'Tendermint / CometBFT', 'Prometheus', 'Grafana', 'Ubuntu 22.04 LTS', 'Systemd'],
          specs: {
            cpu: '16 vCPU (高主频计算型)',
            ram: '64 GB DDR5 ECC 内存',
            storage: '1 TB NVMe Gen4 固态硬盘',
            network: '1 Gbps 独享无限流量带宽'
          },
          link: 'https://www.sei.io'
        },
        {
          id: 'aptos-network',
          name: 'Aptos Network',
          tagline: '基于 Move 智能合约语言驱动的高性能并行 Layer 1 区块链',
          logoText: 'APT',
          role: '验证者 & 全节点运营商',
          period: '2022 - 至今',
          status: 'Active',
          badgeColor: '#38A169',
          networkType: 'AptosBFT / Block-STM 并行引擎',
          description: '在 Aptos 生态中管理企业级验证者节点。深度参与 Block-STM 并行交易验证，并提供对外公共 REST 与 gRPC API 服务。',
          keyResponsibilities: [
            '使用 Docker 与原生二进制部署维护 Aptos Core Validator 及 FullNode 节点。',
            '实施严格的硬件安全模块（HSM）与加密私钥管理，并保持定期密钥轮换。',
            '优化 I/O 缓冲区与 NVMe 写入性能，以承载超高并发并行 TPS 负载。',
            '集成 Telegram/Discord 告警机器人，实时检测账本不同步并迅速自愈。'
          ],
          metrics: [
            { label: '运行正常率', value: '99.96%', sublabel: '验证者健康状态' },
            { label: '并行同步', value: '极佳', sublabel: 'Block-STM 引擎支持' },
            { label: 'API 可用性', value: '100%', sublabel: 'REST & gRPC 服务' }
          ],
          techStack: ['Aptos Core', 'Move VM', 'Docker', 'Ansible', 'Nginx Reverse Proxy', 'Grafana Cloud', 'Rust Toolchain'],
          specs: {
            cpu: '16 vCPU 独享计算核心',
            ram: '64 GB 高速内存',
            storage: '2 TB NVMe SSD (RAID-1 镜像)',
            network: '1 Gbps 双冗余网络'
          },
          link: 'https://aptosnetwork.com'
        },
        {
          id: 'subquery-network',
          name: 'SubQuery Network',
          tagline: '快速、灵活且去中心化的 Web3 多链数据索引基础设施',
          logoText: 'SQT',
          role: '索引节点运营商 & RPC 协调员',
          period: '2023 - 至今',
          status: 'Synchronized',
          badgeColor: '#DD6B20',
          networkType: '去中心化 Web3 数据索引器',
          description: '运营去中心化索引节点，为各类 dApp、区块链浏览器及智能合约提供低延迟（<30ms）的 GraphQL 多链数据查询服务。',
          keyResponsibilities: [
            '基于 SubQuery Node 与高性能 PostgreSQL 集群搭建高容量分布式索引系统。',
            '通过数据库索引调优、批量查询与 Redis 缓存层大幅提升数据索引速度。',
            '确保跨链（EVM、Cosmos、Polkadot）交易历史与智能合约事件日志的数据一致性。',
            '提供企业级 GraphQL 查询 SLA，平均响应时间保持在 25ms 以内。'
          ],
          metrics: [
            { label: '查询响应速度', value: '<25ms', sublabel: 'GraphQL 平均执行延迟' },
            { label: '已索引区块', value: '5000万+', sublabel: '多链总高度' },
            { label: '服务 SLA', value: '99.95%', sublabel: '索引器高可用性' }
          ],
          techStack: ['SubQuery Node CLI', 'GraphQL Engine', 'PostgreSQL', 'Redis', 'Docker Compose', 'Prometheus Exporter'],
          specs: {
            cpu: '12 vCPU 独享核心',
            ram: '32 GB DDR4 内存',
            storage: '1.5 TB 高速 NVMe 存储',
            network: '1 Gbps 骨干网络连接'
          },
          link: 'https://subquery.network'
        }
      ]
    },
    telemetry: {
      badge: '实时遥测与节点健康',
      heading: '节点运营实时模拟监控台',
      subheading: '实时展现运行实例的操作指标、共识验证状态及网络审计日志。',
      liveStreamActive: '实时遥测连接正常',
      paused: '数据流已暂停',
      pauseStream: '暂停日志',
      resumeStream: '继续更新',
      testPing: '测试 RPC 延迟',
      testing: '测试中...',
      activeNodesCard: '活跃运行节点',
      validatorStatusCard: '共识健康状况',
      p2pLatencyCard: 'P2P RPC 延迟',
      terminalHeader: '网络遥测与审计终端',
      filterAll: '全部节点',
      liveLogsStream: '实时日志流'
    },
    skills: {
      badge: '技术专长',
      heading: '基础设施、DevOps 与验证者安全',
      subheading: '结合 Layer 1 区块链底层协议、裸金属服务器运维与自动化监控告警的综合技术实力。',
      bestPractice: '行业最高实践标准',
      verified: '已官方验证',
      securityBannerTitle: '零惩罚（Zero-Slashing）与不妥协安全原则',
      securityBannerDesc: '严格实施验证节点私钥隔离、加密快照定时备份与多哨兵节点（Multi-Sentry）冗余架构，确保节点长效稳定运行。',
      discussBtn: '探讨节点合作',
      categories: [
        {
          title: '区块链协议与节点运维',
          iconName: 'Server',
          skills: [
            { name: 'Validator Operations', level: '专家 (Expert)', description: '哨兵网络架构、零罚没规范与安全私钥管理。' },
            { name: 'Cosmos SDK & Tendermint', level: '高级 (Advanced)', description: 'State-sync 快速同步、cosmovisor 自动升级与命令行治理。' },
            { name: 'Aptos Core & Move', level: '高级 (Advanced)', description: 'Block-STM 并行同步、创世创世配置与 REST 遥测。' },
            { name: 'SubQuery Indexing', level: '高级 (Advanced)', description: 'GraphQL 接口开发、数据字典与 Schema 数据库迁移。' }
          ]
        },
        {
          title: 'DevOps 与云端基础设施',
          iconName: 'Cpu',
          skills: [
            { name: 'Linux 服务器运维 (Ubuntu/Debian)', level: '专家 (Expert)', description: '内核性能调优、systemd 服务配置与系统安全加固。' },
            { name: '容器化技术 (Docker)', level: '高级 (Advanced)', description: '多阶段构建、Docker Compose 集群与资源限额配额。' },
            { name: '自动化脚本 (Ansible / Bash)', level: '高级 (Advanced)', description: '基础设施即代码（IaC）、自动重启守护与定时备份。' },
            { name: '网络路由与防火墙', level: '高级 (Advanced)', description: 'UFW、iptables、P2P 端口定向与 Cloudflare DDoS 防护。' }
          ]
        },
        {
          title: '监控、告警与安全防护',
          iconName: 'ShieldCheck',
          skills: [
            { name: 'Prometheus & Grafana', level: '专家 (Expert)', description: '定制化监控大屏、Node Exporter 指标与 RPC 延迟告警。' },
            { name: '实时事件报警系统', level: '高级 (Advanced)', description: 'Telegram/Discord Webhook 实时告警（漏块、磁盘容量）。' },
            { name: '硬件安全与私钥保险库', level: '高级 (Advanced)', description: '物理隔离私钥管理（Air-gapped）与冷存储委托安全。' },
            { name: '灾难恢复与快照机制', level: '专家 (Expert)', description: '自动化每日账本修剪（Pruning）与快速节点拉起。' }
          ]
        }
      ]
    },
    contact: {
      badge: '联系我',
      heading: '建立联系与项目合作',
      subheading: '欢迎洽谈节点质押委托、测试网/主网节点运营提案、Web3 基础设施咨询与技术交流。',
      profileSummaryRole: '节点运营与 Web3 基础设施',
      profileSummarySubtitle: 'Sei • Aptos • SubQuery',
      githubLabel: 'GitHub',
      xLabel: 'X (Twitter)',
      emailLabel: '直接邮件',
      copyUsername: '复制用户名',
      copyEmail: '复制邮箱',
      copied: '已复制！',
      openLink: '打开链接',
      sendEmailAction: '发送邮件',
      availabilityNotice: '积极响应验证者测试网/主网提案与开发者网络合作。',
      formTitle: '发送消息 / 节点合作意向',
      formNameLabel: '姓名 / 项目名称 *',
      formNamePlaceholder: '例如：Alex / DeFi Labs',
      formEmailLabel: '联系邮箱 *',
      formEmailPlaceholder: 'name@domain.com',
      formTopicLabel: '网络 / 咨询类别',
      formTopicPlaceholder: '例如：Sei Network, Aptos, SubQuery 或其他生态',
      formMessageLabel: '合作需求或咨询内容 *',
      formMessagePlaceholder: '请详细描述您的验证者需求、技术咨询或合作意向...',
      submitBtn: '发送消息给 Uray Fazli Alman',
      successTitle: '正在唤起您的邮件客户端',
      successDesc: '邮件模板已为您生成。感谢您联系 Uray Fazli Alman！',
      sendAnotherBtn: '发送另一条消息'
    },
    footer: {
      description: 'Web3 节点运营与区块链基础设施 • Sei Network | Aptos Network | SubQuery Network',
      backToTop: '回到顶部',
      rightsReserved: '保留所有权利。',
      slaNote: '高可用性去中心化区块链节点运营'
    }
  },

  // ======================== RUSSIAN (Русский) ========================
  ru: {
    nav: {
      about: 'Обо мне',
      nodeExperience: 'Опыт нод',
      liveTelemetry: 'Телеметрия',
      skills: 'Навыки',
      contact: 'Контакты',
      roleBadge: 'Оператор нод'
    },
    hero: {
      tagline: 'Оператор нод и специалист по инфраструктуре Web3',
      greeting: 'Привет, я',
      name: 'Uray Fazli Alman',
      bio: 'Управление высокопроизводительными валидаторами, полными нодами и децентрализованной инфраструктурой индексации с абсолютным отсутствием слэшинга (Zero-Slashing), архитектурой Sentry и круглосуточным мониторингом 24/7.',
      operatingNetworksTitle: 'Оператор нод в сетях:',
      viewExperienceBtn: 'Смотреть опыт нод',
      contactBtn: 'Связаться со мной',
      stats: {
        networksLabel: '3+ Основные сети',
        networksHelper: 'Sei, Aptos, SubQuery',
        uptimeLabel: '99.98%',
        uptimeHelper: 'SLA высокой доступности',
        slashingLabel: '0 Инцидентов',
        slashingHelper: '100% история без слэшинга',
        latencyLabel: '< 35мс',
        latencyHelper: 'Оптимизированный RPC и индексатор'
      }
    },
    profileCard: {
      verifiedBadge: 'Верифицированный оператор нод',
      statusOnline: 'ОНЛАЙН',
      availability: 'Доступен для валидации, делегаций и консалтинга Web3 инфраструктуры',
      roleTitle: 'Web3 Infrastructure Specialist & Node Operator',
      location: 'Индонезия',
      contactDirect: 'Прямая связь',
      copyEmail: 'Скопировать Email',
      copied: 'Скопировано!',
      openProfile: 'Открыть профиль',
      statsHeading: 'Операционные метрики'
    },
    experience: {
      badge: 'Опыт валидатора и индексатора',
      heading: 'Операции с нодами и Web3 инфраструктура',
      subheading: 'Успешный опыт в управлении консенсус-валидаторами, параллельной синхронизации реестра и мультичейн индексировании.',
      visitNetworkBtn: 'Сайт сети',
      responsibilitiesTitle: 'Ключевые обязанности и задачи',
      hardwareSpecsTitle: 'Характеристики серверов и архитектура',
      metricsTitle: 'Метрики производительности нод',
      techStackTitle: 'Стек технологий и инструменты',
      timelineBadge: 'Хронология профессионального опыта',
      timelineTitle: 'Инфраструктурные вехи и трек-рекорд',
      timelineSubheading: 'Хронологический путь: от тестирования PoS сетей и харденинга серверов до валидации Layer 1 и мультичейн индексации.',
      milestones: [
        {
          id: 'm1',
          year: '2021',
          period: 'Q3 2021 - Q4 2021',
          title: 'Запуск операций с нодами PoS и исследование инфраструктуры',
          role: 'Инженер Linux-систем и инфраструктуры',
          network: 'Cosmos & PoS Testnets',
          badgeColor: '#718096',
          description: 'Начало пути оператора блокчейн-нод: изучение Cosmos SDK, глубокий харденинг серверов Linux (фаервол UFW, аутентификация по SSH-ключам), автоматизация systemd и участие в распределенных тестнетах.',
          achievements: [
            'Настройка bare-metal и VPS-серверов с оптимизацией swap-памяти и эшелонированной защитой.',
            'Изучение консенсуса Tendermint/CometBFT и предотвращение слэшинга за двойную подпись (Double-Signing).',
            'Разработка автоматических Bash-скриптов мониторинга нагрузки и ротации логов.'
          ],
          metrics: [
            { label: 'Тестнет-лаборатории', value: '4+ Сети' },
            { label: 'Начальный аптайм', value: '99.8%' }
          ]
        },
        {
          id: 'm2',
          year: '2022',
          period: 'Q3 2022 - Настоящее время',
          title: 'Валидатор Aptos Mainnet и оптимизация движка Block-STM',
          role: 'Validator & FullNode Operator',
          network: 'Aptos Network',
          badgeColor: '#38A169',
          description: 'Участие в запуске Aptos Mainnet (переход из AIT3 тестнета в основную сеть), развертывание высокопроизводительных нод с движком параллельного исполнения Block-STM и аппаратной изоляцией ключей.',
          achievements: [
            'Создание пайплайна обновлений без простоя на базе Docker-контейнеризации.',
            'Предоставление публичных REST и gRPC API для инфраструктуры dApps Move.',
            'Безупречный рекорд 100% Zero-Slashing и стабильная параллельная синхронизация.'
          ],
          metrics: [
            { label: 'Аптайм консенсуса', value: '99.96%' },
            { label: 'Инциденты слэшинга', value: '0 Инцидентов' }
          ]
        },
        {
          id: 'm3',
          year: '2023',
          period: 'Q1 2023 - Настоящее время',
          title: 'Валидатор Sei Network и архитектура Sentry (SNA)',
          role: 'Lead Validator Operator',
          network: 'Sei Network',
          badgeColor: '#2B6CB0',
          description: 'Развертывание валидатора и публичного RPC-кластера в быстрейшем блокчейне Layer 1. Внедрение многоуровневой архитектуры Sentry Node (SNA) для защиты от DDoS и поддержки субсекундного консенсуса Twin-Turbo.',
          achievements: [
            'Создание автоматических сжатых снапшотов с ускорением бутстрапа пиров до < 5 минут.',
            'Дашборды Prometheus & Grafana для отслеживания задержек p2p и пропущенных блоков в реальном времени.',
            'Успешное прохождение всех хардфорков протокола и обновлений governance без даунтайма.'
          ],
          metrics: [
            { label: 'Задержка блока', value: '~390мс' },
            { label: 'Участие в блоках', value: '99.99%' }
          ]
        },
        {
          id: 'm4',
          year: '2023 - 2024',
          period: 'Q3 2023 - Настоящее время',
          title: 'Децентрализованная индексация SubQuery и мультичейн RPC',
          role: 'Indexer Node Operator & RPC Coordinator',
          network: 'SubQuery Network',
          badgeColor: '#DD6B20',
          description: 'Расширение инфраструктурного стека на уровень индексации данных. Управление нодами SubQuery в связке с кластером PostgreSQL для мгновенных GraphQL-запросов (<30мс) для мультичейн dApps.',
          achievements: [
            'Тюнинг SQL-индексов, кэширование Redis и оптимизация пулов соединений.',
            'Успешная индексация более 50 миллионов блоков в сетях EVM, Cosmos и Substrate.',
            'Гарантия SLA доступности API 99.95% со средним временем выполнения запроса менее 25мс.'
          ],
          metrics: [
            { label: 'SLA сервиса', value: '99.95%' },
            { label: 'Время ответа', value: '<25мс' }
          ]
        },
        {
          id: 'm5',
          year: '2024 - Настоящее время',
          period: '2024 - Present',
          title: 'Комплексная автоматизация, 100% Zero-Slashing и Enterprise HA',
          role: 'Principal Node Infrastructure Specialist',
          network: 'Мультичейн флот нод',
          badgeColor: '#2B6CB0',
          isCurrent: true,
          description: 'Консолидация мультичейн операций в единую систему управления с автоматическим failover, многорегиональной телеметрией sentry и мгновенными Webhook-оповещениями для надежности 24/7.',
          achievements: [
            '100% Zero-Slashing рекорд на всех активных валидаторах mainnet и testnet.',
            'Зашифрованная синхронизация снапшотов и автоматические протоколы disaster recovery.',
            'Консалтинг по развертыванию нод и инфраструктура стейкинг-делегаций для Web3 сообщества.'
          ],
          metrics: [
            { label: 'История слэшинга', value: '100% Zero-Slashing' },
            { label: 'Мониторинг SLA', value: '24/7 Real-Time' }
          ]
        }
      ],
      nodes: [
        {
          id: 'sei-network',
          name: 'Sei Network',
          tagline: 'Самый быстрый блокчейн Layer 1 для высокочастотного трейдинга и DeFi',
          logoText: 'SEI',
          role: 'Validator & Full-Node Operator',
          period: '2023 - Настоящее время',
          status: 'Active',
          badgeColor: '#2B6CB0',
          networkType: 'Cosmos SDK / Twin-Turbo Consensus',
          description: 'Управление нодой валидатора и sentry-инфраструктурой RPC в сети Sei Network. Оптимизация субсекундной пропускной способности блоков и быстрая передача транзакций с помощью автоматических снапшотов и state-sync.',
          keyResponsibilities: [
            'Развертывание архитектуры Sentry Node (SNA) для полной защиты валидатора от DDoS-атак.',
            'Настройка ежедневных снапшотов и сжатых пайплайнов state-sync для быстрого бутстрапа пиров сети.',
            'Непрерывный мониторинг через Prometheus и Grafana: пропущенные блоки, нагрузка на память и здоровье пиров.',
            'Бесшовное обновление бинарников ноды во время хардфорков и голосований Sei governance.'
          ],
          metrics: [
            { label: 'Аптайм', value: '99.99%', sublabel: 'Участие в консенсусе' },
            { label: 'Пропуск блоков', value: '0.01%', sublabel: 'Строгая защита от слэшинга' },
            { label: 'Задержка блока', value: '~390мс', sublabel: 'Субсекундная финализация' }
          ],
          techStack: ['Sei Node CLI', 'Cosmos SDK', 'Tendermint / CometBFT', 'Prometheus', 'Grafana', 'Ubuntu 22.04 LTS', 'Systemd'],
          specs: {
            cpu: '16 vCPU (Высокочастотные)',
            ram: '64 GB DDR5 ECC',
            storage: '1 TB NVMe Gen4 SSD',
            network: '1 Gbps безлимитный порт'
          },
          link: 'https://www.sei.io'
        },
        {
          id: 'aptos-network',
          name: 'Aptos Network',
          tagline: 'Масштабируемый блокчейн Layer 1 на базе языка программирования Move',
          logoText: 'APT',
          role: 'Validator & FullNode Operator',
          period: '2022 - Настоящее время',
          status: 'Active',
          badgeColor: '#38A169',
          networkType: 'AptosBFT / Движок параллелизма Block-STM',
          description: 'Управление валидатором корпоративного уровня в экосистеме Aptos. Валидация параллельных транзакций на базе Block-STM с предоставлением публичных API-эндпоинтов REST и gRPC.',
          keyResponsibilities: [
            'Развертывание и обслуживание Aptos Core Validator & FullNode через Docker и нативные бинарники.',
            'Надежное управление криптографическими ключами (HSM/зашифрованные хранилища) с регулярной ротацией.',
            'Тюнинг дискового ввода-вывода и NVMe для поддержки экстремально высоких объемов параллельных TPS.',
            'Интеграция автоматических алертов в Telegram/Discord для мгновенного устранения рассинхронизации.'
          ],
          metrics: [
            { label: 'Аптайм', value: '99.96%', sublabel: 'Здоровье валидатора' },
            { label: 'Параллельная синхронизация', value: 'Отлично', sublabel: 'Движок Block-STM' },
            { label: 'Доступность API', value: '100%', sublabel: 'Эндпоинты REST и gRPC' }
          ],
          techStack: ['Aptos Core', 'Move VM', 'Docker', 'Ansible', 'Nginx Reverse Proxy', 'Grafana Cloud', 'Rust Toolchain'],
          specs: {
            cpu: '16 vCPU Dedicated',
            ram: '64 GB High-Speed RAM',
            storage: '2 TB NVMe SSD (RAID-1)',
            network: '1 Gbps резервированный канал'
          },
          link: 'https://aptosnetwork.com'
        },
        {
          id: 'subquery-network',
          name: 'SubQuery Network',
          tagline: 'Быстрая, гибкая и децентрализованная инфраструктура индексации Web3',
          logoText: 'SQT',
          role: 'Indexer Node Operator & RPC Coordinator',
          period: '2023 - Настоящее время',
          status: 'Synchronized',
          badgeColor: '#DD6B20',
          networkType: 'Децентрализованный мультичейн индексатор',
          description: 'Запуск децентрализованных нод-индексаторов для обработки и предоставления быстрых GraphQL-запросов (<30мс) для dApps, обозревателей блоков и смарт-контрактов.',
          keyResponsibilities: [
            'Настройка распределенного кластера индексаторов с SubQuery Node и высоконагруженным PostgreSQL.',
            'Оптимизация скорости индексации с помощью тюнинга индексов БД, пакетной обработки и кэширования Redis.',
            'Обеспечение консистентности истории транзакций и логов контрактов между сетями EVM, Cosmos и Polkadot.',
            'Предоставление высокого SLA для GraphQL-запросов со средним временем ответа менее 25мс.'
          ],
          metrics: [
            { label: 'Скорость запросов', value: '<25мс', sublabel: 'Среднее время GraphQL' },
            { label: 'Проиндексировано блоков', value: '50M+', sublabel: 'Мультичейн высота' },
            { label: 'SLA сервиса', value: '99.95%', sublabel: 'Доступность индексатора' }
          ],
          techStack: ['SubQuery Node CLI', 'GraphQL Engine', 'PostgreSQL', 'Redis', 'Docker Compose', 'Prometheus Exporter'],
          specs: {
            cpu: '12 vCPU Dedicated',
            ram: '32 GB DDR4 RAM',
            storage: '1.5 TB Fast NVMe',
            network: '1 Gbps сетевой магистральный канал'
          },
          link: 'https://subquery.network'
        }
      ]
    },
    telemetry: {
      badge: 'Телеметрия и статус нод',
      heading: 'Симуляция статуса оператора нод в реальном времени',
      subheading: 'Визуализация операционных метрик, мониторинг консенсуса и журнал аудита активных инстансов.',
      liveStreamActive: 'Телеметрия в реальном времени активна',
      paused: 'Поток приостановлен',
      pauseStream: 'Пауза логов',
      resumeStream: 'Возобновить логи',
      testPing: 'Тест пинга RPC',
      testing: 'Проверка...',
      activeNodesCard: 'Активные ноды',
      validatorStatusCard: 'Здоровье консенсуса',
      p2pLatencyCard: 'Пинг пиров RPC',
      terminalHeader: 'Терминал аудита и телеметрии сети',
      filterAll: 'Все ноды',
      liveLogsStream: 'Поток логов'
    },
    skills: {
      badge: 'Технические навыки',
      heading: 'Инфраструктура, DevOps и безопасность валидатора',
      subheading: 'Глубокие знания протоколов консенсуса Layer 1, администрирования выделенных серверов и автоматизации систем мониторинга.',
      bestPractice: 'Лучшие практики индустрии',
      verified: 'Проверено',
      securityBannerTitle: 'Бескомпромиссная безопасность (Zero-Slashing)',
      securityBannerDesc: 'Приоритет изоляции приватных ключей, зашифрованных снапшотов и архитектуры multi-sentry для непрерывного аптайма нод.',
      discussBtn: 'Обсудить сотрудничество по нодам',
      categories: [
        {
          title: 'Блокчейн и операции с нодами',
          iconName: 'Server',
          skills: [
            { name: 'Validator Operations', level: 'Эксперт', description: 'Архитектура Sentry, практики zero-slashing и управление ключами.' },
            { name: 'Cosmos SDK & Tendermint', level: 'Продвинутый', description: 'State-sync, автоматические апгрейды cosmovisor и governance CLI.' },
            { name: 'Aptos Core & Move', level: 'Продвинутый', description: 'Параллельная синхронизация Block-STM, настройка genesis и REST телеметрия.' },
            { name: 'SubQuery Indexing', level: 'Продвинутый', description: 'Эндпоинты GraphQL, словари данных и миграции схем.' }
          ]
        },
        {
          title: 'DevOps и облачная инфраструктура',
          iconName: 'Cpu',
          skills: [
            { name: 'Администрирование Linux (Ubuntu/Debian)', level: 'Эксперт', description: 'Тюнинг ядра, службы systemd и харденинг безопасности.' },
            { name: 'Контейнеризация (Docker)', level: 'Продвинутый', description: 'Многоэтапные сборки, Docker Compose кластеры и лимиты ресурсов.' },
            { name: 'Автоматизация (Ansible / Bash)', level: 'Продвинутый', description: 'Инфраструктура как код (IaC), скрипты автоперезапуска и бэкапы.' },
            { name: 'Сети и фаерволы', level: 'Продвинутый', description: 'UFW, iptables, маршрутизация портов P2P, защита Cloudflare DDoS.' }
          ]
        },
        {
          title: 'Мониторинг, оповещения и безопасность',
          iconName: 'ShieldCheck',
          skills: [
            { name: 'Prometheus & Grafana', level: 'Эксперт', description: 'Кастомные дашборды, метрики Node Exporter, алерты задержки RPC.' },
            { name: 'Оповещения об инцидентах', level: 'Продвинутый', description: 'Telegram/Discord боты для алертов о пропущенных блоках и диске.' },
            { name: 'Аппаратная безопасность и хранилища ключей', level: 'Продвинутый', description: 'Изолированное хранение ключей (Air-gapped) и безопасные холодные делегации.' },
            { name: 'Аварийное восстановление и снапшоты', level: 'Эксперт', description: 'Автоматическая очистка реестра (pruning) и быстрый бутстрап.' }
          ]
        }
      ]
    },
    contact: {
      badge: 'Связаться со мной',
      heading: 'Связь и сотрудничество',
      subheading: 'Открыт для делегаций в валидатор, предложений по запуску нод в тестнетах/майннетах, консалтинга Web3 инфраструктуры и блокчейн-DevOps.',
      profileSummaryRole: 'Оператор нод и Web3 инфраструктура',
      profileSummarySubtitle: 'Sei • Aptos • SubQuery',
      githubLabel: 'GitHub',
      xLabel: 'X (Twitter)',
      emailLabel: 'Прямой Email',
      copyUsername: 'Скопировать ник',
      copyEmail: 'Скопировать Email',
      copied: 'Скопировано!',
      openLink: 'Открыть ссылку',
      sendEmailAction: 'Отправить Email',
      availabilityNotice: 'Быстрый отклик на предложения валидации в тестнетах/майннетах и совместные проекты в девнете.',
      formTitle: 'Отправить сообщение / Предложение по ноде',
      formNameLabel: 'Полное имя / Проект *',
      formNamePlaceholder: 'Например: Alex / DeFi Labs',
      formEmailLabel: 'Контактный Email *',
      formEmailPlaceholder: 'name@domain.com',
      formTopicLabel: 'Сеть / Категория темы',
      formTopicPlaceholder: 'Например: Sei Network, Aptos, SubQuery Indexer или другое',
      formMessageLabel: 'Сообщение или требования к проекту *',
      formMessagePlaceholder: 'Опишите ваши потребности в валидаторе, технические вопросы или предложения о партнерстве...',
      submitBtn: 'Отправить сообщение Uray Fazli Alman',
      successTitle: 'Открываем ваш почтовый клиент',
      successDesc: 'Шаблон письма подготовлен. Спасибо за обращение к Uray Fazli Alman!',
      sendAnotherBtn: 'Отправить еще одно сообщение'
    },
    footer: {
      description: 'Оператор нод и инфраструктура Web3 • Sei Network | Aptos Network | SubQuery Network',
      backToTop: 'Наверх',
      rightsReserved: 'Все права защищены.',
      slaNote: 'Высокодоступные децентрализованные операции с блокчейн-нодами'
    }
  }
};
