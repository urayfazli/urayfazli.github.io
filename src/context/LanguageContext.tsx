import React, { createContext, useContext, useState, useEffect } from 'react';
import { NetworkInfo } from '../types';
import { NETWORKS_DATA } from '../data/portfolioData';

export type Language = 'id' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  networks: NetworkInfo[];
}

const STORAGE_KEY = 'uray_portfolio_language';

const NETWORKS_ID_TRANSLATIONS: Record<
  string,
  Pick<NetworkInfo, 'role' | 'category' | 'status' | 'description' | 'highlights'>
> = {
  aptos: {
    role: 'Operator Node',
    category: 'Blockchain Layer 1 (Move VM)',
    status: 'Aktif',
    description:
      'Mengoperasikan infrastruktur validator dan fullnode kelas produksi di jaringan Aptos. Memastikan sinkronisasi state yang cepat, throughput tinggi, dan partisipasi konsensus tanpa hambatan.',
    highlights: [
      'Mengoperasikan instance Fullnode dan Validator dengan ketersediaan tinggi (High-Availability)',
      'Mengonfigurasi sinkronisasi state Aptos dan pemulihan snapshot otomatis',
      'Mengintegrasikan metrik Prometheus dengan dashboard peringatan Grafana kustom',
      'Nol penalti slashing dan pembaruan daemon tepat waktu di setiap epoch jaringan',
    ],
  },
  sei: {
    role: 'Operator Node',
    category: 'Layer 1 EVM Paralel',
    status: 'Aktif',
    description:
      'Berpartisipasi dalam operasional node Sei Network, mendukung blockchain Layer-1 tercepat untuk perdagangan berkecepatan tinggi dan aplikasi terdesentralisasi dengan konsensus twin-turbo.',
    highlights: [
      'Menjaga validasi blok berlatensi rendah dan partisipasi konsensus aktif',
      'Menerapkan failover node otomatis & perlindungan keamanan kunci kriptografi (KMS)',
      'Mengoptimalkan latensi kueri RPC untuk ekosistem dApps & indexer',
      'Memantau proposal tata kelola (governance) dan upgrade jaringan tepat waktu',
    ],
  },
  subquery: {
    role: 'Operator Node',
    category: 'Pengindeksan Data & RPC Terdesentralisasi',
    status: 'Aktif',
    description:
      'Menjalankan layanan SubQuery Indexer dan node RPC, memproses data multi-chain serta menyediakan respons kueri terdesentralisasi bagi pengembang di seluruh dunia.',
    highlights: [
      'Mengindeks proyek blockchain berfrekuensi tinggi dengan waktu respons sub-detik',
      'Menyediakan kueri GraphQL dan endpoint RPC andal bagi pengembang Web3',
      'Memperoleh reward indexer melalui konsistensi uptime layanan dan staking',
      'Menerapkan skrip pemeliharaan otomatis tanpa gangguan layanan (zero downtime)',
    ],
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'id',
  setLang: () => {},
  toggleLang: () => {},
  networks: NETWORKS_DATA,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'id' || saved === 'en') return saved;
    } catch {
      // Ignore storage errors
    }
    return 'id';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignore storage errors
    }
  }, [lang]);

  const setLang = (next: Language) => {
    setLangState(next);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const localizedNetworks: NetworkInfo[] =
    lang === 'en'
      ? NETWORKS_DATA
      : NETWORKS_DATA.map((net) => {
          const tr = NETWORKS_ID_TRANSLATIONS[net.id];
          if (!tr) return net;
          return {
            ...net,
            role: tr.role,
            category: tr.category,
            status: tr.status,
            description: tr.description,
            highlights: tr.highlights,
          };
        });

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        networks: localizedNetworks,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
