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
   * Path ke file audio (.mp3 / .wav / .ogg) di folder `public/audio/`
   */
  audioSrc?: string;
  fallbackAudioSrc?: string;
  isCustomFile?: boolean;
  melody: string[];
  bass: string[];
  chords: string[][];
}

const rawBaseUrl = import.meta.env.BASE_URL || '/';
const BASE_AUDIO_PATH = `${rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`}audio`;

export const BACKSOUND_TRACKS: RetroTrack[] = [
  {
    id: 'cozy-cafe',
    title: 'Chubina',
    genre: 'east duo',
    bpm: 112,
    audioSrc: `${BASE_AUDIO_PATH}/cozy-node-cafe-8bit.mp3`,
    fallbackAudioSrc: `${BASE_AUDIO_PATH}/cozy-node-cafe-8bit.wav`,
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
    audioSrc: `${BASE_AUDIO_PATH}/midnight-validator-8bit.mp3`,
    fallbackAudioSrc: `${BASE_AUDIO_PATH}/midnight-validator-8bit.wav`,
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
    audioSrc: `${BASE_AUDIO_PATH}/starlight-blocks-8bit.mp3`,
    fallbackAudioSrc: `${BASE_AUDIO_PATH}/starlight-blocks-8bit.wav`,
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
    audioSrc: `${BASE_AUDIO_PATH}/cyber-consensus-8bit.mp3`,
    fallbackAudioSrc: `${BASE_AUDIO_PATH}/cyber-consensus-8bit.wav`,
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
