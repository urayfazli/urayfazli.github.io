import { Language } from '../types';

export interface SectionMetadata {
  title: string;
  description: string;
  keywords?: string;
}

export type SectionId = 'tentang' | 'pengalaman' | 'monitor' | 'keahlian' | 'kontak';

const metadataMap: Record<Language, Record<SectionId, SectionMetadata>> = {
  id: {
    tentang: {
      title: 'Uray Fazli Alman - Node Operator & Web3 Infrastructure',
      description: 'Portofolio profesional Uray Fazli Alman sebagai Node Operator dan Web3 Infrastructure Specialist di Sei Network, Aptos Network, dan SubQuery Network.',
      keywords: 'Node Operator, Web3 Infrastructure, Validator Blockchain, Sei Network, Aptos, SubQuery, Uray Fazli Alman'
    },
    pengalaman: {
      title: 'Pengalaman Node Operator | Uray Fazli Alman',
      description: 'Rekam jejak operasional validator node, arsitektur sentry node, dan pengindeksan data di Sei Network, Aptos FullNode, dan SubQuery Network.',
      keywords: 'Pengalaman Validator, Sei Network Node, Aptos FullNode, SubQuery Indexer, Blockchain Ops'
    },
    monitor: {
      title: 'Live Node Monitor & Telemetri | Uray Fazli Alman',
      description: 'Pantau metrik performa real-time, status blok, latency query, dan log terminal aktif dari validator Sei, Aptos, dan SubQuery.',
      keywords: 'Node Monitoring, Live Telemetry, Blockchain Uptime, Validator Metrics, Sei SubQuery Aptos'
    },
    keahlian: {
      title: 'Keahlian & Tech Stack Web3 | Uray Fazli Alman',
      description: 'Keahlian infrastruktur blockchain, Linux server hardening, containerization Docker/K8s, monitoring Prometheus/Grafana, dan otomasi CI/CD.',
      keywords: 'DevOps Web3, Linux Hardening, Prometheus Grafana, Docker, Kubernetes, Cosmos SDK, Rust Move'
    },
    kontak: {
      title: 'Kontak & Delegasi Validator | Uray Fazli Alman',
      description: 'Hubungi Uray Fazli Alman untuk konsultasi infrastruktur Web3, delegasi validator, atau kolaborasi operasional node blockchain.',
      keywords: 'Kontak Node Operator, Delegasi Validator, Web3 Consulting, Fazli Alman'
    }
  },
  en: {
    tentang: {
      title: 'Uray Fazli Alman - Web3 Infrastructure Specialist & Node Operator',
      description: 'Professional portfolio of Uray Fazli Alman, Web3 Infrastructure Specialist and Validator Node Operator across Sei Network, Aptos, and SubQuery.',
      keywords: 'Node Operator, Web3 Infrastructure, Validator Blockchain, Sei Network, Aptos, SubQuery, Uray Fazli Alman'
    },
    pengalaman: {
      title: 'Node Operations Experience | Uray Fazli Alman',
      description: 'Operational track record of validator nodes, sentry node architectures, and indexers on Sei Network, Aptos, and SubQuery Network.',
      keywords: 'Validator Experience, Sei Network Node, Aptos FullNode, SubQuery Indexer, Blockchain Ops'
    },
    monitor: {
      title: 'Live Node Monitor & Telemetry | Uray Fazli Alman',
      description: 'Monitor real-time performance metrics, block heights, query latency, and live terminal logs for Sei, Aptos, and SubQuery nodes.',
      keywords: 'Node Monitoring, Live Telemetry, Blockchain Uptime, Validator Metrics, Sei SubQuery Aptos'
    },
    keahlian: {
      title: 'Skills & Web3 Tech Stack | Uray Fazli Alman',
      description: 'Blockchain infrastructure expertise, Linux server hardening, Docker/K8s containerization, Prometheus/Grafana monitoring, and CI/CD node automation.',
      keywords: 'DevOps Web3, Linux Hardening, Prometheus Grafana, Docker, Kubernetes, Cosmos SDK, Rust Move'
    },
    kontak: {
      title: 'Contact & Validator Inquiries | Uray Fazli Alman',
      description: 'Get in touch with Uray Fazli Alman for Web3 infrastructure consulting, validator delegations, or blockchain node operations.',
      keywords: 'Contact Node Operator, Validator Delegation, Web3 Consulting, Fazli Alman'
    }
  },
  zh: {
    tentang: {
      title: 'Uray Fazli Alman - Web3基础设施专家与节点运营商',
      description: 'Uray Fazli Alman 的专业作品集，担任 Sei Network、Aptos 和 SubQuery 网络的 Web3 基础设施专家和验证节点运营商。',
      keywords: '节点运营商, Web3基础设施, 区块链验证节点, Sei Network, Aptos, SubQuery'
    },
    pengalaman: {
      title: '节点运维经验 | Uray Fazli Alman',
      description: 'Sei Network、Aptos FullNode 和 SubQuery Network 的验证节点、哨兵节点架构和数据索引运维经验。',
      keywords: '验证节点经验, Sei节点, Aptos全节点, SubQuery索引器, 区块链运维'
    },
    monitor: {
      title: '实时节点监控与遥测 | Uray Fazli Alman',
      description: '实时监控 Sei、Aptos 和 SubQuery 验证节点的性能指标、区块高度、查询延迟与活跃终端日志。',
      keywords: '节点监控, 实时遥测, 区块链在线率, 验证节点指标'
    },
    keahlian: {
      title: '专业技能与技术栈 | Uray Fazli Alman',
      description: '区块链基础设施技能、Linux 服务器安全加固、Docker/K8s 容器化、Prometheus/Grafana 监控与 CI/CD 节点自动化。',
      keywords: 'Web3运维, Linux安全, Prometheus Grafana, Docker, Kubernetes'
    },
    kontak: {
      title: '联系与验证节点咨询 | Uray Fazli Alman',
      description: '联系 Uray Fazli Alman 进行 Web3 基础设施咨询、验证节点委托或区块链节点运营合作。',
      keywords: '联系节点运营商, 验证节点委托, Web3咨询'
    }
  },
  ru: {
    tentang: {
      title: 'Uray Fazli Alman - Специалист по Web3 инфраструктуре и оператор нод',
      description: 'Профессиональное портфолио Uray Fazli Alman, специалиста по инфраструктуре Web3 и оператора валидаторных нод в сетях Sei, Aptos и SubQuery.',
      keywords: 'Оператор нод, Инфраструктура Web3, Валидатор блокчейна, Sei Network, Aptos, SubQuery'
    },
    pengalaman: {
      title: 'Опыт работы с нодами | Uray Fazli Alman',
      description: 'Опыт развертывания и управления нодами валидатора, архитектурой sentry и индексаторами в сетях Sei, Aptos и SubQuery.',
      keywords: 'Опыт валидатора, Нода Sei Network, Aptos FullNode, SubQuery Indexer, Блокчейн DevOps'
    },
    monitor: {
      title: 'Мониторинг нод и телеметрия | Uray Fazli Alman',
      description: 'Мониторинг метрик производительности в реальном времени, высоты блоков, задержки запросов и логов терминала Sei, Aptos и SubQuery.',
      keywords: 'Мониторинг нод, Телеметрия, Аптайм блокчейна, Метрики валидатора'
    },
    keahlian: {
      title: 'Навыки и стек технологий | Uray Fazli Alman',
      description: 'Навыки блокчейн-инфраструктуры, защита серверов Linux, контейнеризация Docker/K8s, мониторинг Prometheus/Grafana и автоматизация нод.',
      keywords: 'DevOps Web3, Linux Hardening, Prometheus Grafana, Docker, Kubernetes'
    },
    kontak: {
      title: 'Контакты и делегирование | Uray Fazli Alman',
      description: 'Свяжитесь с Uray Fazli Alman для консультаций по инфраструктуре Web3, делегирования в валидаторы или сотрудничества по нодам.',
      keywords: 'Контакты оператора нод, Делегирование валидатора, Web3 консалтинг'
    }
  }
};

/**
 * Helper to update meta tag content or create it if missing
 */
function setMetaTag(selector: string, attrName: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update canonical link
 */
function setCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Dynamic Metadata Update Function for SEO
 * Updates document.title and OpenGraph / Twitter meta tags based on active section and language
 */
export function updateDynamicMetadata(sectionId: string, language: Language = 'id') {
  const langKey = metadataMap[language] ? language : 'id';
  const targetSection = (sectionId in metadataMap[langKey]) ? (sectionId as SectionId) : 'tentang';
  const meta = metadataMap[langKey][targetSection];

  if (!meta) return;

  // 1. Update Document Title
  document.title = meta.title;

  // 2. Update Standard Meta Tags
  setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
  if (meta.keywords) {
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', meta.keywords);
  }

  // 3. Resolve Current Canonical URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const sectionUrl = targetSection === 'tentang' ? `${origin}${pathname}` : `${origin}${pathname}#${targetSection}`;

  // 4. Update OpenGraph Tags
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', sectionUrl);
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Uray Fazli Alman - Web3 Infrastructure');
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'profile');

  // 5. Update Twitter Card Tags
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);

  // 6. Update Canonical Link
  setCanonicalLink(sectionUrl);

  // 7. Update Structured Data (JSON-LD)
  updateJsonLd(targetSection, meta, sectionUrl);
}

/**
 * Dynamically injects or updates Schema.org Structured Data (Person + WebPage)
 */
function updateJsonLd(sectionId: SectionId, meta: SectionMetadata, url: string) {
  const SCRIPT_ID = 'seo-structured-data-jsonld';
  let scriptElement = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = SCRIPT_ID;
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': meta.title,
    'description': meta.description,
    'url': url,
    'inLanguage': document.documentElement.lang || 'id',
    'mainEntity': {
      '@type': 'Person',
      'name': 'Uray Fazli Alman',
      'jobTitle': 'Web3 Infrastructure Specialist & Node Operator',
      'description': 'Operator validator node dan spesialis infrastruktur Web3 di Sei Network, Aptos Network, dan SubQuery Network.',
      'url': 'https://github.com/urayfazli',
      'sameAs': [
        'https://github.com/urayfazli',
        'https://x.com/urayfazli17'
      ],
      'knowsAbout': [
        'Sei Network',
        'Aptos Network',
        'SubQuery Network',
        'Validator Nodes',
        'Blockchain Infrastructure',
        'Cosmos SDK',
        'Prometheus & Grafana'
      ]
    }
  };

  scriptElement.textContent = JSON.stringify(structuredData, null, 2);
}
