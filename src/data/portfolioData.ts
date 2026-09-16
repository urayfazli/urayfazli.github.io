import { NodeExperience, SkillCategory, TerminalLog } from '../types';

export const personalInfo = {
  name: "Uray Fazli Alman",
  title: "Web3 Infrastructure Specialist & Node Operator",
  bio: "Spesialis infrastruktur Web3 dan operator validator node dengan rekam jejak dalam mengelola performa tinggi, zero-downtime, serta keamanan jaringan blockchain layer-1 dan indexing terdesentralisasi seperti Sei Network, Aptos Network, dan SubQuery Network.",
  location: "Indonesia",
  availability: "Available for Node Ops, Validator Delegation & Web3 Infra Consulting",
  socials: {
    github: {
      username: "@urayfazli",
      url: "https://github.com/urayfazli",
      handle: "urayfazli"
    },
    x: {
      username: "@urayfazli17",
      url: "https://x.com/urayfazli17",
      handle: "urayfazli17"
    },
    email: "fazliuray@gmail.com"
  },
  stats: [
    { label: "Blockchain Networks", value: "3+ Core Networks", helper: "Sei, Aptos, SubQuery" },
    { label: "Node Uptime", value: "99.98%", helper: "High Availability SLA" },
    { label: "Slashing Record", value: "0 Events", helper: "100% Zero-Slashing" },
    { label: "Sync & Query Latency", value: "< 35ms", helper: "Optimized RPC & Indexer" }
  ]
};

export const nodeExperiences: NodeExperience[] = [
  {
    id: "sei-network",
    name: "Sei Network",
    tagline: "The fastest Layer 1 blockchain for trading & DeFi",
    logoText: "SEI",
    role: "Validator & Full-Node Operator",
    period: "2023 - Present",
    status: "Active",
    badgeColor: "#2B6CB0",
    networkType: "Cosmos SDK / Twin-Turbo Consensus",
    description: "Mengoperasikan validator node dan RPC sentry infrastructure pada Sei Network. Mengoptimalkan throughput pemrosesan blok sub-second dan latensi propagasi transaksi dengan snapshot otomatis dan state-sync.",
    keyResponsibilities: [
      "Mengelola arsitektur Sentry Node Architecture (SNA) guna melindungi validator utama dari serangan DDoS.",
      "Menyiapkan pipeline snapshot harian dan state-sync terkompresi untuk pemulihan cepat peer jaringan.",
      "Monitoring berkala menggunakan Prometheus & Grafana dashboard untuk memantau missed blocks, memory pressure, dan peer health.",
      "Melakukan upgrade binary node secara mulus saat hardfork atau upgrade governance Sei."
    ],
    metrics: [
      { label: "Uptime", value: "99.99%", sublabel: "Consensus Participation" },
      { label: "Missed Blocks", value: "0.01%", sublabel: "Strict Slashing Protection" },
      { label: "Block Latency", value: "~390ms", sublabel: "Sub-Second Finality" }
    ],
    techStack: ["Sei Node CLI", "Cosmos SDK", "Tendermint / CometBFT", "Prometheus", "Grafana", "Ubuntu 22.04 LTS", "Systemd"],
    specs: {
      cpu: "16 vCPUs (High Frequency)",
      ram: "64 GB DDR5 ECC",
      storage: "1 TB NVMe Gen4 SSD",
      network: "1 Gbps Unmetered Port"
    },
    link: "https://www.sei.io"
  },
  {
    id: "aptos-network",
    name: "Aptos Network",
    tagline: "Scalable Layer 1 blockchain powered by Move language",
    logoText: "APT",
    role: "Validator & FullNode Operator",
    period: "2022 - Present",
    status: "Active",
    badgeColor: "#38A169",
    networkType: "AptosBFT / Block-STM Parallel Engine",
    description: "Mengelola node berkinerja tinggi pada ekosistem Aptos. Berpartisipasi dalam verifikasi transaksi paralel dengan mesin eksekusi Block-STM dan menyediakan public REST/gRPC API endpoints.",
    keyResponsibilities: [
      "Deploy dan maintenance instance Aptos Core Validator & FullNode menggunakan Docker dan binary native.",
      "Manajemen kunci validator yang aman (HSM/encrypted keystore) dengan rotasi credential berkala.",
      "Optimasi buffer I/O dan disk throughput untuk mengakomodasi volume TPS paralel yang tinggi.",
      "Integrasi alert otomatis via Telegram/Discord webhook untuk deteksi anomali desinkronisasi ledger."
    ],
    metrics: [
      { label: "Uptime", value: "99.96%", sublabel: "Validator Health" },
      { label: "Parallel Tx Sync", value: "Optimal", sublabel: "Block-STM Support" },
      { label: "API Availability", value: "100%", sublabel: "REST & gRPC Endpoints" }
    ],
    techStack: ["Aptos Core", "Move VM", "Docker", "Ansible", "Nginx Reverse Proxy", "Grafana Cloud", "Rust Toolchain"],
    specs: {
      cpu: "16 vCPUs Dedicated",
      ram: "64 GB High-Speed RAM",
      storage: "2 TB NVMe SSD (RAID-1)",
      network: "1 Gbps Redundant Bandwidth"
    },
    link: "https://aptosnetwork.com"
  },
  {
    id: "subquery-network",
    name: "SubQuery Network",
    tagline: "Fast, flexible, and decentralized indexing infrastructure",
    logoText: "SQT",
    role: "Indexer Node Operator & RPC Coordinator",
    period: "2023 - Present",
    status: "Synchronized",
    badgeColor: "#DD6B20",
    networkType: "Decentralized Web3 Data Indexer",
    description: "Menjalankan node indexer terdesentralisasi untuk memproses, mengindeks, dan menyajikan query data multi-chain GraphQL berlatensi rendah untuk berbagai dApps dan smart contract explorer.",
    keyResponsibilities: [
      "Setup cluster indexer terdistribusi menggunakan SubQuery Node runner dan PostgreSQL cluster berkapasitas tinggi.",
      "Optimasi indexing speed dengan index tuning, batching query, dan caching layer berbasis Redis.",
      "Memastikan konsistensi data riwayat transaksi dan log smart contract lintas blockchain (EVM, Cosmos, Polkadot).",
      "Menyediakan query GraphQL SLA tinggi dengan response time rata-rata di bawah 30ms."
    ],
    metrics: [
      { label: "Query Speed", value: "<25ms", sublabel: "GraphQL Execution Avg" },
      { label: "Indexed Blocks", value: "50M+", sublabel: "Multi-Chain Height" },
      { label: "Service SLA", value: "99.95%", sublabel: "Indexer Availability" }
    ],
    techStack: ["SubQuery Node CLI", "GraphQL Engine", "PostgreSQL", "Redis", "Docker Compose", "Prometheus Exporter"],
    specs: {
      cpu: "12 vCPUs Dedicated",
      ram: "32 GB DDR4 RAM",
      storage: "1.5 TB Fast NVMe",
      network: "1 Gbps Network Backbone"
    },
    link: "https://subquery.network"
  }
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Blockchain & Node Operations",
    iconName: "Server",
    skills: [
      { name: "Validator Operations", level: "Expert", description: "Sentry architectures, zero-slashing practices, key management" },
      { name: "Cosmos SDK & Tendermint", level: "Advanced", description: "State-sync, cosmovisor auto-upgrades, CLI governance" },
      { name: "Aptos Core & Move", level: "Advanced", description: "Block-STM parallel sync, genesis setup, REST telemetry" },
      { name: "SubQuery Indexing", level: "Advanced", description: "GraphQL endpoints, data dictionaries, schema migrations" }
    ]
  },
  {
    title: "DevOps & Cloud Infrastructure",
    iconName: "Cpu",
    skills: [
      { name: "Linux Server Admin (Ubuntu/Debian)", level: "Expert", description: "Kernel tuning, systemd services, security hardening" },
      { name: "Containerization (Docker)", level: "Advanced", description: "Multi-stage builds, compose clusters, resource constraints" },
      { name: "Automation (Ansible / Bash)", level: "Advanced", description: "Infrastructure as code, auto-restart scripts, backup pipelines" },
      { name: "Networking & Firewalls", level: "Advanced", description: "UFW, iptables, P2P port management, Cloudflare DDOS protection" }
    ]
  },
  {
    title: "Monitoring, Alerting & Security",
    iconName: "ShieldCheck",
    skills: [
      { name: "Prometheus & Grafana", level: "Expert", description: "Custom dashboards, node exporter metrics, RPC latency alerts" },
      { name: "Real-time Incident Alerting", level: "Advanced", description: "Telegram/Discord bot webhooks for missed blocks & disk alerts" },
      { name: "Hardware Security & Key Vaults", level: "Advanced", description: "Air-gapped key management, safe cold storage delegations" },
      { name: "Disaster Recovery & Snapshots", level: "Expert", description: "Daily automated pruning, fast bootstrap synchronization" }
    ]
  }
];

export const sampleTerminalLogs: TerminalLog[] = [
  { id: "1", timestamp: "08:14:22", node: "sei-validator-01", type: "success", message: "Consensus block #24,912,410 signed successfully (latency: 382ms)" },
  { id: "2", timestamp: "08:14:23", node: "aptos-fullnode-01", type: "info", message: "Block-STM synced 1,420 transactions in execution ledger batch" },
  { id: "3", timestamp: "08:14:25", node: "subquery-indexer", type: "info", message: "GraphQL query response dispatched: 21.4ms (Cache Hit Ratio: 98.2%)" },
  { id: "4", timestamp: "08:14:27", node: "sei-validator-01", type: "success", message: "Peer mesh health check: 48 active peers, 0 dropped frames" },
  { id: "5", timestamp: "08:14:30", node: "aptos-fullnode-01", type: "success", message: "State storage compaction finished in 1.2s. Storage health: OK" }
];
