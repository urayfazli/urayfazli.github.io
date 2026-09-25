export interface NetworkInfo {
  id: string;
  name: string;
  role: string;
  category: string;
  description: string;
  logoType: 'aptos' | 'sei' | 'subquery';
  status: 'Active' | 'Mainnet & Testnet' | 'Synchronized';
  hardware: {
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
  };
  highlights: string[];
  tools: string[];
  websiteUrl: string;
  explorerUrl?: string;
  docsUrl?: string;
}

export interface SocialLinks {
  github: string;
  githubUrl: string;
  twitter: string;
  twitterUrl: string;
  email: string;
}
