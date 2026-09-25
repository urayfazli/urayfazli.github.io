import { NetworkInfo, SocialLinks } from '../types';

export const SOCIAL_DATA: SocialLinks = {
  github: '@urayfazli',
  githubUrl: 'https://github.com/urayfazli',
  twitter: '@urayfazli17',
  twitterUrl: 'https://x.com/urayfazli17',
  email: 'fazliuray@gmail.com',
};

export const NETWORKS_DATA: NetworkInfo[] = [
  {
    id: 'aptos',
    name: 'Aptos Network',
    role: 'Node Operator',
    category: 'Layer 1 Blockchain (Move VM)',
    logoType: 'aptos',
    status: 'Active',
    description:
      'Operating production-grade validator and fullnode infrastructure on Aptos Network. Ensuring rapid state synchronization, high throughput, and seamless node consensus participation.',
    hardware: {
      cpu: '16 vCPU (High Performance)',
      ram: '32 GB DDR5 RAM',
      storage: '1 TB NVMe SSD (PCIe Gen4)',
      bandwidth: '1 Gbps Unmetered',
    },
    highlights: [
      'Operated high-availability Fullnode and Validator instances',
      'Configured Aptos state synchronization and automated snapshot restoring',
      'Integrated Prometheus metrics with custom Grafana alerting dashboards',
      'Zero slashing penalties and timely daemon upgrades across network epochs',
    ],
    tools: ['Docker', 'Ubuntu Linux', 'Prometheus', 'Grafana', 'systemd', 'Aptos CLI'],
    websiteUrl: 'https://aptosfoundation.org',
    explorerUrl: 'https://explorer.aptoslabs.com',
    docsUrl: 'https://aptos.dev',
  },
  {
    id: 'sei',
    name: 'Sei Network',
    role: 'Node Operator',
    category: 'Parallelized Layer 1 EVM',
    logoType: 'sei',
    status: 'Active',
    description:
      'Participated in Sei Network node operations, powering the fastest Layer-1 blockchain for high-speed trading and decentralized applications with twin-turbo consensus.',
    hardware: {
      cpu: '32 vCPU (AMD EPYC)',
      ram: '64 GB ECC RAM',
      storage: '2 TB NVMe SSD Raid-1',
      bandwidth: '1 Gbps Low Latency',
    },
    highlights: [
      'Maintained low-latency block validation and consensus participation',
      'Implemented automated node failover & key security protection (KMS)',
      'Optimized RPC query latency for ecosystem dApps & indexers',
      'Tracked governance proposals and timely chain upgrades',
    ],
    tools: ['Cosmovisor', 'Seid CLI', 'Prometheus', 'Grafana', 'Telegram Alert Bot', 'Docker'],
    websiteUrl: 'https://www.sei.io',
    explorerUrl: 'https://seitrace.com',
    docsUrl: 'https://docs.sei.io',
  },
  {
    id: 'subquery',
    name: 'SubQuery Network',
    role: 'Node Operator',
    category: 'Decentralized Data Indexing & RPC',
    logoType: 'subquery',
    status: 'Active',
    description:
      'Running SubQuery Indexer and RPC node services, processing multi-chain data and providing decentralized query responses for developers worldwide.',
    hardware: {
      cpu: '16 vCPU Intel Xeon',
      ram: '32 GB RAM',
      storage: '1.5 TB Fast NVMe',
      bandwidth: '1 Gbps Uplink',
    },
    highlights: [
      'Indexed high-frequency blockchain projects with sub-second response times',
      'Provided reliable GraphQL queries and RPC endpoints for Web3 builders',
      'Earned indexer rewards through consistent service uptime and staking',
      'Deployed automated maintenance scripts with zero service disruption',
    ],
    tools: ['PostgreSQL', 'SubQuery Coordinator', 'Docker Compose', 'NGINX Reverse Proxy', 'Certbot'],
    websiteUrl: 'https://subquery.network',
    explorerUrl: 'https://app.subquery.network',
    docsUrl: 'https://academy.subquery.network',
  },
];
