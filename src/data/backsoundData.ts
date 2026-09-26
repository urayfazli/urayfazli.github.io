/**
 * ============================================================================
 * KONFIGURASI DAFTAR LAGU / BACKSOUND 8-BIT & MP3 (DJ BEAT-BOT PLAYER)
 * ============================================================================
 *
 * Daftar file audio yang tersedia di dalam source code (`public/audio/`):
 * 1. `public/audio/cozy-node-cafe-8bit.wav`     (8-bit Lofi Chiptune)
 * 2. `public/audio/midnight-validator-8bit.wav` (16-bit Synthwave)
 * 3. `public/audio/starlight-blocks-8bit.wav`   (Chrono Nostalgia 8-Bit)
 * 4. `public/audio/cyber-consensus-8bit.wav`    (Arcade Outrun 8-Bit)
 */

export interface RetroTrack {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  /**
   * Path ke file audio (.wav / .mp3 / .ogg) di folder `public/audio/`
   */
  audioSrc?: string;
  isCustomFile?: boolean;
  melody: string[];
  bass: string[];
  chords: string[][];
}

const BASE_AUDIO_PATH = `${import.meta.env.BASE_URL || '/'}audio`;

export const BACKSOUND_TRACKS: RetroTrack[] = [
  {
    id: 'cozy-cafe',
    title: 'Chubina',
    genre: 'east duo',
    bpm: 112,
    audioSrc: `${BASE_AUDIO_PATH}/cozy-node-cafe-8bit.wav`,
    melody: [
      'E4', 'G4', 'A4', 'B4', 'C5', 'B4', 'A4', 'G4',
      'E4', 'G4', 'A4', 'G4', 'E4', 'D4', 'C4', 'D4',
      'E4', 'G4', 'A4', 'B4', 'D5', 'C5', 'B4', 'A4',
      'G4', 'A4', 'G4', 'E4', 'D4', 'C4', 'D4', 'REST',
    ],
    bass: [
      'C3', 'REST', 'C3', 'REST', 'A2', 'REST', 'A2', 'REST',
      'F2', 'REST', 'F2', 'REST', 'G2', 'REST', 'G2', 'REST',
      'C3', 'REST', 'C3', 'REST', 'A2', 'REST', 'A2', 'REST',
      'F2', 'REST', 'F2', 'REST', 'G2', 'G2', 'G2', 'REST',
    ],
    chords: [
      ['C4', 'E4', 'G4'],
      ['A3', 'C4', 'E4'],
      ['F3', 'A3', 'C4'],
      ['G3', 'B3', 'D4'],
    ],
  },
  {
    id: 'midnight-validator',
    title: 'Golden brown',
    genre: 'the stranglers',
    bpm: 126,
    audioSrc: `${BASE_AUDIO_PATH}/midnight-validator-8bit.wav`,
    melody: [
      'A4', 'C5', 'E5', 'D5', 'C5', 'A4', 'G4', 'E4',
      'A4', 'C5', 'D5', 'E5', 'G5', 'E5', 'D5', 'C5',
      'F4', 'A4', 'C5', 'D5', 'C5', 'A4', 'G4', 'F4',
      'G4', 'B4', 'D5', 'B4', 'G4', 'E4', 'D4', 'REST',
    ],
    bass: [
      'A2', 'A2', 'C3', 'A2', 'A2', 'A2', 'G2', 'E2',
      'A2', 'A2', 'C3', 'A2', 'A2', 'A2', 'G2', 'E2',
      'F2', 'F2', 'A2', 'F2', 'F2', 'F2', 'A2', 'F2',
      'G2', 'G2', 'B2', 'G2', 'E2', 'E2', 'G2', 'REST',
    ],
    chords: [
      ['A3', 'C4', 'E4'],
      ['A3', 'C4', 'E4'],
      ['F3', 'A3', 'C4'],
      ['G3', 'B3', 'D4'],
    ],
  },
  {
    id: 'starlight-blocks',
    title: 'Soulder poet king',
    genre: 'the oh hellos',
    bpm: 96,
    audioSrc: `${BASE_AUDIO_PATH}/starlight-blocks-8bit.wav`,
    melody: [
      'C5', 'B4', 'G4', 'E4', 'G4', 'A4', 'C5', 'REST',
      'D5', 'C5', 'A4', 'F4', 'A4', 'B4', 'D5', 'REST',
      'E5', 'D5', 'B4', 'G4', 'B4', 'C5', 'E5', 'REST',
      'D5', 'B4', 'G4', 'D4', 'E4', 'G4', 'C4', 'REST',
    ],
    bass: [
      'C3', 'REST', 'E3', 'REST', 'A2', 'REST', 'C3', 'REST',
      'F2', 'REST', 'A2', 'REST', 'G2', 'REST', 'B2', 'REST',
      'A2', 'REST', 'C3', 'REST', 'E2', 'REST', 'G2', 'REST',
      'F2', 'REST', 'A2', 'REST', 'G2', 'REST', 'C3', 'REST',
    ],
    chords: [
      ['C4', 'E4', 'G4'],
      ['F3', 'A3', 'C4'],
      ['A3', 'C4', 'E4'],
      ['G3', 'B3', 'D4'],
    ],
  },
  {
    id: 'cyber-consensus',
    title: 'ethereal',
    genre: 'txmy',
    bpm: 132,
    audioSrc: `${BASE_AUDIO_PATH}/cyber-consensus-8bit.wav`,
    melody: [
      'E5', 'B4', 'C5', 'D5', 'C5', 'B4', 'A4', 'A4',
      'C5', 'E5', 'D5', 'C5', 'B4', 'C5', 'D5', 'E5',
      'C5', 'A4', 'A4', 'REST', 'D5', 'F5', 'A5', 'G5',
      'F5', 'E5', 'C5', 'E5', 'D5', 'C5', 'B4', 'REST',
    ],
    bass: [
      'E2', 'E3', 'E2', 'E3', 'A2', 'A3', 'A2', 'A3',
      'G2', 'G3', 'G2', 'G3', 'E2', 'E3', 'B2', 'D3',
      'A2', 'A3', 'A2', 'A3', 'D3', 'D3', 'F2', 'F3',
      'C3', 'C3', 'G2', 'G3', 'E2', 'G2', 'B2', 'REST',
    ],
    chords: [
      ['E3', 'G3', 'B3'],
      ['A3', 'C4', 'E4'],
      ['D3', 'F3', 'A3'],
      ['G3', 'B3', 'D4'],
    ],
  },
];

export const NPC_GREETING_DIALOGUE_ID =
  'Halo ser! Selamat datang di web Uray! Yuk nyalain BGM sambil berburu airdrop & testnet! 🎧✨';

export const NPC_GREETING_DIALOGUE_EN =
  "Hello ser! Welcome to Uray's web! Turn on the BGM while hunting airdrops & testnets! 🎧✨";

export const NPC_ANGRY_DIALOGUES_ID = [
  '😤 Woi ser! Betah amat bengong di web ini lama-lama?! Jangan cuma rebahan, sana upgrade skill atau garap testnet dulu! ⚡',
  '😤 Udah lama banget mantengin layar! Kalau lagi nganggur jangan pasrah aja, ayo gerak cari peluang & klaim airdrop! 🪂',
  '🔥 CPU aku sampe ngebul liat kamu diem bae! Yuk produktif—klik kontak Uray atau nyalain musik biar semangat! 🎧',
];

export const NPC_ANGRY_DIALOGUES_EN = [
  '😤 Hey ser! Why are you spacing out on this page so long?! Stop slacking—go upgrade your skills or grind testnets! ⚡',
  '😤 Staring at the screen forever?! If you are between jobs, do not just sit there—go hunt opportunities & airdrops! 🪂',
  '🔥 My CPU is overheating watching you idle! Get productive—collab with Uray or play a track to boost your energy! 🎧',
];

export const NPC_DIZZY_DIALOGUES_ID = [
  '😵‍💫 Aduh pusing ser! Scroll-nya pelan-pelan napa, berasa naik candle meme coin pump & dump! 🤢',
  '😵 Waduh mabuk darat nih! Jangan ngebut-ngebut scroll-nya ser, mata CRT aku sampe muter-muter!',
  '🤢 Goyang dombret! Pelan dikit ser scroll-nya, sensor gyro aku sampe oleng nih! ⚡',
];

export const NPC_DIZZY_DIALOGUES_EN = [
  '😵‍💫 Whoa dizzy ser! Slow down the scroll—feels like riding a meme coin pump & dump candle! 🤢',
  '😵 Ugh motion sickness! Do not speed-scroll so fast ser, my CRT eyes are spinning!',
  '🤢 Whoa easy there! Scroll a bit slower ser, my gyro sensors are totally wobbling! ⚡',
];

export const NPC_IDLE_DIALOGUES_ID = [
  'gm ser! Sudah klaim faucet & garap testnet hari ini belum? 💧⛓️',
  'Ngaku pemburu cuan, tapi tiap hari cuma scroll layar sambil rebahan? Bangun woi, nasib gak berubah kalau cuma bengong! 🛋️⚡',
  'Lagi nganggur bukan berarti gagal ser! Gunakan waktu luangmu buat upgrade skill, riset Web3, dan bangun portofolio! 💪🚀',
  'Dompet siap, node validator nyala... tinggal tunggu snapshot airdrop! 🪂✨',
  'Pengangguran elit: sibuk ngetawain meme coin orang, giliran disuruh belajar skill baru & kirim CV malah alasan besok aja! 📉😤',
  'Semua builder hebat pernah mulai dari nol! Hari ini belum dapet kerja? Tetap konsisten belajar & garap peluang, rejeki gak kemana! 🌱✨',
  'Psst... klik aku buat nyalain BGM sambil hunting meme coin 100x! 🐸🚀',
  'Rebahan terus sampe bantal gepeng gak bakal bikin dompet tebal ser! Kurangin ngeluh, tambahin eksekusi! 🛑🔥',
  'Jangan minder status pengangguran! Satu skill baru yang kamu pelajari hari ini bisa jadi tiket menuju kebebasan finansial besok! 🎯💎',
  'Lagi pantau floor price NFT atau sibuk nge-bridge ke testnet baru? 🖼️🌉',
  'Jangan cuma nunggu keajaiban atau airdrop jatuh dari langit kalau usaha aja masih setengah-setengah! 🤨⏳',
  'Capek ditolak kerja? Istirahat sebentar sambil dengerin beat 8-bit, lalu bangkit lagi lebih kuat! Kamu pasti tembus! 🎧🔥',
  'Jangan lupa interaksi on-chain biar gak kena filter sybil pas airdrop! 🛡️🪂',
  'Market crypto lagi sideways? Santai, nyalain musik 8-bit dulu ser! 🎧📈',
];

export const NPC_IDLE_DIALOGUES_EN = [
  'gm ser! Have you claimed your faucet & farmed testnets today? 💧⛓️',
  'Calling yourself a profit hunter while just doomscrolling in bed all day? Wake up ser, nothing changes if you do nothing! 🛋️⚡',
  'Being unemployed right now does not mean you failed! Use your free time to upgrade skills, research Web3, and build a portfolio! 💪🚀',
  'Wallet ready, validator node synced... just waiting for the airdrop snapshot! 🪂✨',
  'Unemployed habit: laughing at meme coins all day, but when it is time to learn a new skill or send CVs, "maybe tomorrow"! 📉😤',
  'Every great builder started from zero! No job offer yet? Stay consistent learning & grinding opportunities—your breakthrough is coming! 🌱✨',
  'Psst... click me to play 8-bit BGM while hunting 100x meme coins! 🐸🚀',
  'Flattening your pillow all day will not fatten your wallet ser! Less complaining, more executing! 🛑🔥',
  'Do not feel down about being between jobs! One new skill learned today could be your ticket to financial freedom tomorrow! 🎯💎',
  'Watching NFT floor prices or bridging to a new incentivized testnet? 🖼️🌉',
  'Stop waiting for miracles or airdrops to fall from the sky if you barely put in half the effort! 🤨⏳',
  'Tired of job rejections? Rest a bit to this 8-bit beat, then rise back stronger! Your time to shine will come! 🎧🔥',
  'Keep those on-chain txns active so you never miss the next big airdrop! 🛡️🪂',
  'Crypto market crabbing? Chill out and turn on some chiptune beats! 🎧📈',
];

export const getNpcPlayDialogues = (trackTitle: string, bpm: number, lang: 'id' | 'en') =>
  lang === 'id'
    ? [
        `🎵 Spin: ${trackTitle} (${bpm} BPM) — musik wajib para pemburu airdrop & pejuang karir! 🪂`,
        'Masih nganggur tapi cuma rebahan? Ayo bangun ser, jadikan beat 8-bit ini bensin buat belajar skill baru hari ini! 🔥💻',
        'Vibes 8-bit bikin garap task testnet, klaim faucet & poles portofolio makin anti-ngantuk! 💧⚡',
        'Jangan biarin status pengangguran bikin mental drop! Terus asah skill, bangun karya, dan buktikan kamu bisa sukses! 💪🚀',
        'Meme coin boleh pump & dump, tapi semangat cari cuan & uptime node validator harus tetap 99.9%! 🐸🔥',
        'Sindiran buat yang suka nunda-nunda: kapan mau finansial freedom kalau buka laptop aja males-malesan?! 😤📈',
        'Sambil dengerin beat ini, semoga lamaran kerjamu tembus & wallet kamu JP airdrop tier S+! 🪂💰',
        'Gas fee lagi murah nih ser, waktunya mint NFT, push transaksi testnet, dan tetap produktif! 🖼️⛽',
        'WAGMI! Mau market bearish atau lagi berjuang cari kerja, kita pasti bakal sampai di puncak! 🚀🎶',
      ]
    : [
        `🎵 Spinning: ${trackTitle} (${bpm} BPM) — official soundtrack for airdrop hunters & career grinders! 🪂`,
        'Unemployed and still just lying in bed? Get up ser, let this 8-bit beat fuel you to learn a high-income skill today! 🔥💻',
        '8-bit synth vibes make grinding testnet tasks, faucets & polishing your portfolio 10x faster! 💧⚡',
        'Do not let unemployment break your spirit! Keep sharpening your skills, ship projects, and prove them all wrong! 💪🚀',
        'Meme coins may pump & dump, but your hustle & validator uptime stay locked at 99.9%! 🐸🔥',
        'Friendly roast: how do you expect financial freedom if you keep procrastinating every single day?! 😤📈',
        'Manifesting a dream job offer and an S-tier airdrop allocation for you while this beat plays! 🪂💰',
        'Gas fees are low ser—perfect time to mint NFTs, push testnet txns, and stay productive! 🖼️⛽',
        'WAGMI! Bear market or job hunting season, keep grinding and we are all gonna make it! 🚀🎶',
      ];

