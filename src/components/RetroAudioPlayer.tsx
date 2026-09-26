import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { retroAudio } from '../utils/retroAudioEngine';
import { robotSound } from '../utils/robotSoundEngine';
import { RetroCassetteDoodle, RetroSpeakerDoodle } from './Doodles';
import { useLanguage } from '../context/LanguageContext';

export type DjBotMood = 'greeting' | 'normal' | 'angry' | 'dizzy';

/**
 * Rigged Multi-Part Animated DJ Character for the BGM Widget Button
 * Grooves, bobs head, waves hello on initial visit, gets hilariously angry when user stays too long,
 * gets dizzy/motion-sick when the user scrolls too fast, and reacts playfully when dragged across the screen.
 */
const BGMCharacterAvatar: React.FC<{
  isPlaying: boolean;
  isExpanded: boolean;
  isDragging: boolean;
  mood: DjBotMood;
  step: number;
}> = ({ isPlaying, isExpanded, isDragging, mood, step }) => {
  const isAngry = mood === 'angry' && !isDragging;
  const isDizzy = mood === 'dizzy' && !isDragging;
  const isGreeting = mood === 'greeting' && !isDragging;

  return (
    <div className="relative w-16 h-18 sm:w-24 sm:h-25 flex items-center justify-center pointer-events-none select-none">
      {/* Floating Emotes: Angry 💢, Greeting 👋, or Musical Notes ♫ (immediately removed when expression/music stops) */}
      {isAngry && (
        <>
          <motion.span
            key="angry-vein-emote"
            initial={{ opacity: 0, scale: 0.3, rotate: -15 }}
            animate={{
              opacity: 1,
              scale: [1, 1.28, 1],
              rotate: [-10, 10, -10],
            }}
            transition={{ duration: 0.38, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 right-0 sm:top-0 sm:right-1 text-sm sm:text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] z-20"
          >
            💢
          </motion.span>
          <motion.span
            key="angry-steam"
            initial={{ opacity: 0, y: 4 }}
            animate={{
              opacity: [0, 0.95, 0],
              y: [-2, -20],
              x: [-8, -16],
              scale: [0.7, 1.15],
            }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }}
            className="absolute top-0 left-1 text-xs sm:text-sm z-20"
          >
            💨
          </motion.span>
        </>
      )}

      {isGreeting && (
        <motion.span
          key="greeting-wave-emote"
          initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
          animate={{
            opacity: 1,
            scale: [1, 1.2, 1],
            rotate: [-16, 24, -16],
            y: [0, -3, 0],
          }}
          transition={{ duration: 0.48, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '75% 80%' }}
          className="absolute -top-1 right-0 sm:top-0 sm:right-0.5 text-sm sm:text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] z-20"
        >
          👋
        </motion.span>
      )}

      {isDizzy && (
        <motion.span
          key="dizzy-spiral-emote"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{
            opacity: 1,
            scale: [1, 1.2, 1],
            rotate: [-15, 15, -15],
            y: [0, -3, 0],
          }}
          transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 right-0 sm:top-0 sm:right-0.5 text-sm sm:text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] z-20"
        >
          😵‍💫
        </motion.span>
      )}

      {isPlaying && !isAngry && !isDizzy && !isGreeting && (
        <>
          <motion.span
            key="note-1"
            initial={{ opacity: 0, y: 6, x: -12, scale: 0.6 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-2, -26],
              x: [-14, -24],
              rotate: [-12, -25],
              scale: [0.7, 1.1, 0.8],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            className="absolute top-1 left-2 font-hand text-base sm:text-lg text-[#e59b63] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-20"
          >
            ♪
          </motion.span>
          <motion.span
            key="note-2"
            initial={{ opacity: 0, y: 6, x: 12, scale: 0.6 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-4, -30],
              x: [14, 26],
              rotate: [10, 24],
              scale: [0.7, 1.15, 0.85],
            }}
            transition={{
              duration: 1.8,
              delay: 0.6,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute top-0 right-1 font-hand text-base sm:text-lg text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-20"
          >
            ♫
          </motion.span>
        </>
      )}

      <svg
        viewBox="0 0 110 115"
        className="w-full h-full overflow-visible drop-shadow-[0_8px_14px_rgba(0,0,0,0.7)]"
        fill="none"
      >
        {/* Ground Shadow (shrinks slightly when lifted/dragged) */}
        <motion.ellipse
          cx="55"
          cy="108"
          rx="34"
          ry="5"
          fill="#05080D"
          animate={
            isDragging
              ? { scaleX: 0.7, opacity: 0.4 }
              : { scaleX: 1, opacity: 0.75 }
          }
        />

        {/* Ambient Pulse Ring on Ground when Playing, Angry, or Dizzy */}
        {(isPlaying || isAngry || isDizzy) && (
          <motion.ellipse
            cx="55"
            cy="108"
            rx="34"
            ry="5"
            stroke={isAngry ? '#EF4444' : isDizzy ? '#A3E635' : '#22C55E'}
            strokeWidth="1.5"
            animate={{ scaleX: [0.9, 1.25, 0.9], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: isAngry ? 0.55 : isDizzy ? 0.65 : 0.9, repeat: Infinity }}
          />
        )}

        {/* Torso & Mini DJ Boombox Deck */}
        <motion.g
          animate={
            isDragging
              ? { x: 0, y: -6, rotate: -4 }
              : isDizzy
              ? { x: [-2.5, 2.5, -2.5], y: [0, 1.5, -1.5, 0], rotate: [-4.5, 4.5, -4.5] }
              : isAngry
              ? { x: [-1.5, 1.5, -1.5], y: [0, -3, 0], rotate: 0 }
              : isGreeting
              ? { x: 0, y: [0, -3, 0], rotate: [-1.5, 1.5, -1.5] }
              : isPlaying
              ? { x: 0, y: [0, -2.5, 0], rotate: 0 }
              : { x: 0, y: [0, -1, 0], rotate: 0 }
          }
          transition={{
            duration: isDizzy
              ? 0.65
              : isAngry
              ? 0.25
              : isGreeting
              ? 0.6
              : isPlaying
              ? 0.45
              : 2,
            repeat: isDragging ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 70%' }}
        >
          {/* Cute Chibi Feet (with proper SVG fill-box transformOrigin so rotation never swings around 0,0) */}
          <motion.rect
            x="36"
            y="96"
            width="12"
            height="9"
            rx="4.5"
            fill={isAngry ? '#B91C1C' : '#9D613C'}
            stroke="#FBEEE0"
            strokeWidth="1.8"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            animate={
              isDragging
                ? { x: 0, y: [-2, 3, -2], rotate: [-8, 8, -8] }
                : isDizzy
                ? { x: 0, y: [-2, 2, -2], rotate: [-8, 8, -8] }
                : isAngry
                ? { x: 0, y: [0, -4, 0], rotate: 0 }
                : { x: 0, y: 0, rotate: 0 }
            }
            transition={{
              duration: isDizzy ? 0.5 : isAngry ? 0.28 : 0.35,
              repeat: isDragging || isAngry || isDizzy ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
          <motion.rect
            x="62"
            y="96"
            width="12"
            height="9"
            rx="4.5"
            fill={isAngry ? '#B91C1C' : '#9D613C'}
            stroke="#FBEEE0"
            strokeWidth="1.8"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            animate={
              isDragging
                ? { x: 0, y: [3, -2, 3], rotate: [8, -8, 8] }
                : isDizzy
                ? { x: 0, y: [2, -2, 2], rotate: [8, -8, 8] }
                : isAngry
                ? { x: 0, y: [-4, 0, -4], rotate: 0 }
                : { x: 0, y: 0, rotate: 0 }
            }
            transition={{
              duration: isDizzy ? 0.5 : isAngry ? 0.28 : 0.35,
              repeat: isDragging || isAngry || isDizzy ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />

          {/* Hoodie Body */}
          <path
            d="M30 66C30 60 35 56 41 56H69C75 56 80 60 80 66L83 96H27L30 66Z"
            fill={isAngry ? '#2A1215' : '#162233'}
            stroke="#FBEEE0"
            strokeWidth="2"
          />

          {/* Front Chest Boombox / Turntable Deck */}
          <rect
            x="31"
            y="72"
            width="48"
            height="22"
            rx="5"
            fill="#0B1018"
            stroke={isAngry ? '#EF4444' : '#E59B63'}
            strokeWidth="1.8"
          />

          {/* Left Speaker Woofer */}
          <motion.circle
            cx="41"
            cy="83"
            r="6"
            fill="#141C28"
            stroke="#FBEEE0"
            strokeWidth="1.5"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            animate={isPlaying || isAngry ? { scale: [1, 1.16, 1] } : { scale: 1 }}
            transition={{ duration: isAngry ? 0.25 : 0.35, repeat: Infinity }}
          />
          <circle cx="41" cy="83" r="2" fill={isAngry ? '#EF4444' : '#E59B63'} />

          {/* Center Mini Equalizer / Cassette Window */}
          <rect
            x="50"
            y="78"
            width="10"
            height="10"
            rx="2"
            fill="#101824"
            stroke={isAngry ? '#EF4444' : '#9D613C'}
            strokeWidth="1.2"
          />
          <line
            x1="52.5"
            y1="86"
            x2="52.5"
            y2={isPlaying || isAngry ? (step % 2 === 0 ? '80' : '84') : '84'}
            stroke={isAngry ? '#EF4444' : '#22C55E'}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="55"
            y1="86"
            x2="55"
            y2={isPlaying || isAngry ? (step % 3 === 0 ? '79' : '83') : '84'}
            stroke="#E59B63"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="57.5"
            y1="86"
            x2="57.5"
            y2={isPlaying || isAngry ? (step % 2 === 1 ? '80' : '84') : '84'}
            stroke={isAngry ? '#EF4444' : '#22C55E'}
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Right Speaker Woofer */}
          <motion.circle
            cx="69"
            cy="83"
            r="6"
            fill="#141C28"
            stroke="#FBEEE0"
            strokeWidth="1.5"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            animate={isPlaying || isAngry ? { scale: [1, 1.16, 1] } : { scale: 1 }}
            transition={{ duration: isAngry ? 0.25 : 0.35, repeat: Infinity }}
          />
          <circle cx="69" cy="83" r="2" fill={isAngry ? '#EF4444' : '#E59B63'} />
        </motion.g>

        {/* Orbiting Halo of Stars When Dizzy/Mabuk (Kept outside Head fill-box group so Head pivot never shifts) */}
        {isDizzy && (
          <motion.g
            animate={{ x: [-3, 3, -3], rotate: [-5, 5, -5] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
          >
            <ellipse
              cx="55"
              cy="2"
              rx="26"
              ry="5.5"
              stroke="#A3E635"
              strokeWidth="1.4"
              strokeDasharray="3 3"
              fill="none"
            />
            <motion.circle
              cx="29"
              cy="2"
              r="2.8"
              fill="#E59B63"
              stroke="#090E16"
              strokeWidth="1"
              animate={{ x: [0, 52, 0] }}
              transition={{ duration: 0.95, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="81"
              cy="2"
              r="2.8"
              fill="#A3E635"
              stroke="#090E16"
              strokeWidth="1"
              animate={{ x: [0, -52, 0] }}
              transition={{ duration: 0.95, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.g>
        )}

        {/* Animated Head + Giant DJ Headphones */}
        <motion.g
          animate={
            isDragging
              ? { x: 0, y: -7, rotate: [-5, 5, -5] }
              : isDizzy
              ? {
                  x: [-3, 3, -3],
                  y: [0, -2.5, 1.5, 0],
                  rotate: [-8, 8, -8],
                }
              : isAngry
              ? {
                  x: 0,
                  y: [0, -3.5, 0],
                  rotate: [-3.5, 3.5, -3.5],
                }
              : isGreeting
              ? {
                  x: 0,
                  y: [0, -4, 0],
                  rotate: [-5, 5, -5],
                }
              : isPlaying
              ? {
                  x: 0,
                  y: [0, -5, 0],
                  rotate: [-4, 4, -4],
                }
              : {
                  x: 0,
                  y: [0, -2.5, 0],
                  rotate: [-1, 1, -1],
                }
          }
          transition={{
            duration: isDragging
              ? 0.35
              : isDizzy
              ? 0.65
              : isAngry
              ? 0.28
              : isGreeting
              ? 0.65
              : isPlaying
              ? 0.55
              : 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 65%' }}
        >
          {/* Thick Caramel Headphone Band */}
          <path
            d="M19 39C19 17 34 7 55 7C76 7 91 17 91 39"
            stroke={isAngry ? '#EF4444' : isDizzy ? '#A3E635' : '#E59B63'}
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Top Antenna */}
          <line
            x1="55"
            y1="7"
            x2="55"
            y2="-1"
            stroke="#FBEEE0"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <motion.circle
            cx="55"
            cy="-2"
            r="3.8"
            fill={isAngry ? '#EF4444' : isDizzy ? '#A3E635' : isPlaying ? '#22C55E' : '#E59B63'}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            animate={
              isAngry || isDizzy
                ? { scale: [1, 1.55, 1], opacity: [1, 0.6, 1] }
                : isPlaying
                ? { scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }
                : { scale: [1, 1.1, 1], opacity: 1 }
            }
            transition={{ duration: isAngry || isDizzy ? 0.35 : 0.7, repeat: Infinity }}
          />

          {/* Left & Right Cushioned DJ Earcups */}
          <rect
            x="12"
            y="28"
            width="11"
            height="24"
            rx="5.5"
            fill={isAngry ? '#991B1B' : '#9D613C'}
            stroke="#FBEEE0"
            strokeWidth="2"
          />
          <rect
            x="87"
            y="28"
            width="11"
            height="24"
            rx="5.5"
            fill={isAngry ? '#991B1B' : '#9D613C'}
            stroke="#FBEEE0"
            strokeWidth="2"
          />

          {/* Main CRT Head Shell */}
          <rect
            x="22"
            y="14"
            width="66"
            height="46"
            rx="14"
            fill="#FBEEE0"
            stroke="#141C28"
            strokeWidth="2.2"
          />
          <rect
            x="24"
            y="16"
            width="62"
            height="42"
            rx="12"
            fill="none"
            stroke={isAngry ? '#EF4444' : isDizzy ? '#A3E635' : '#9D613C'}
            strokeWidth="1.5"
          />

          {/* Dark CRT Face Visor */}
          <rect
            x="29"
            y="21"
            width="52"
            height="32"
            rx="8"
            fill="#090E16"
            stroke={isAngry ? '#7F1D1D' : isDizzy ? '#4D7C0F' : '#26364D'}
            strokeWidth="1.6"
          />

          {/* Glass Glint */}
          <path
            d="M33 25H43L38 32H32V26C32 25.4 32.4 25 33 25Z"
            fill="#FFFFFF"
            fillOpacity="0.12"
          />

          {/* Dynamic Visor Face: Dragged vs Dizzy vs Angry vs Greeting vs Jamming vs Idle */}
          {isDragging ? (
            <g>
              {/* Excited Starry/Wide Eyes > < when being dragged */}
              <path
                d="M37 31L45 35L37 39"
                stroke="#22C55E"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M73 31L65 35L73 39"
                stroke="#22C55E"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="55" cy="43" r="3.2" fill="#E59B63" />
            </g>
          ) : isDizzy ? (
            <g>
              {/* Left Spinning Spiral Eye (@) with symmetric r=7 bounding circle so rotation stays dead-center */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
              >
                <circle cx="42" cy="34" r="7" fill="transparent" />
                <path
                  d="M42 34m-1 0a1.5 1.5 0 1 0 3 0a3 3 0 1 0 -6 0a4.5 4.5 0 1 0 9 0a5.5 5.5 0 1 0 -11 0"
                  stroke="#A3E635"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.g>
              {/* Right Counter-Spinning Spiral Eye (@) with symmetric r=7 bounding circle */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
              >
                <circle cx="68" cy="34" r="7" fill="transparent" />
                <path
                  d="M68 34m-1 0a1.5 1.5 0 1 0 3 0a3 3 0 1 0 -6 0a4.5 4.5 0 1 0 9 0a5.5 5.5 0 1 0 -11 0"
                  stroke="#E59B63"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.g>
              {/* Queasy Greenish Motion-Sick Cheeks */}
              <rect x="32.5" y="40.5" width="5.5" height="2.5" rx="1.2" fill="#84CC16" />
              <rect x="72" y="40.5" width="5.5" height="2.5" rx="1.2" fill="#84CC16" />
              {/* Wobbly Nauseous Wavy Mouth (〰️) */}
              <motion.path
                d="M44 45.5C46.5 42 49 49 51.5 45.5C54 42 56.5 49 59 45.5C61.5 42 64 49 66 45.5"
                stroke="#FBEEE0"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                animate={{ x: [-1.5, 1.5, -1.5] }}
                transition={{ duration: 0.35, repeat: Infinity }}
              />
            </g>
          ) : isAngry ? (
            <g>
              {/* Fierce Slanted Angry Eyebrows \ / */}
              <line
                x1="36"
                y1="28"
                x2="48"
                y2="33"
                stroke="#EF4444"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <line
                x1="74"
                y1="28"
                x2="62"
                y2="33"
                stroke="#EF4444"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              {/* Glowing Red Angry Eyes */}
              <rect x="39" y="33" width="7" height="6" rx="2" fill="#EF4444" />
              <rect x="64" y="33" width="7" height="6" rx="2" fill="#EF4444" />
              {/* Angry Red Blush */}
              <rect x="33" y="40" width="5.5" height="2.5" rx="1.2" fill="#EF4444" />
              <rect x="71.5" y="40" width="5.5" height="2.5" rx="1.2" fill="#EF4444" />
              {/* Grumpy Jagged Mouth */}
              <path
                d="M46 46L50.5 42.5L55 46L59.5 42.5L64 46"
                stroke="#FBEEE0"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ) : isGreeting ? (
            <g>
              {/* Welcoming Cheerful Arcs ^ ^ */}
              <path
                d="M37 35C39.5 29.5 45 29.5 47.5 35"
                stroke="#E59B63"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M62.5 35C65 29.5 70.5 29.5 73 35"
                stroke="#E59B63"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              {/* Warm Cheeks */}
              <rect x="33" y="39" width="5.5" height="2.5" rx="1.2" fill="#E59B63" />
              <rect x="71.5" y="39" width="5.5" height="2.5" rx="1.2" fill="#E59B63" />
              {/* Big Open Welcoming Smile */}
              <path
                d="M48 41C50.5 47 59.5 47 62 41Z"
                fill="#E59B63"
                stroke="#FBEEE0"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </g>
          ) : isPlaying ? (
            <g>
              {/* Happy Jamming Arcs ^ ^ */}
              <path
                d="M37 35C39.5 30 45 30 47.5 35"
                stroke="#22C55E"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M62.5 35C65 30 70.5 30 73 35"
                stroke="#22C55E"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Warm Blush Cheeks */}
              <rect x="33" y="39" width="5.5" height="2.5" rx="1.2" fill="#E59B63" />
              <rect x="71.5" y="39" width="5.5" height="2.5" rx="1.2" fill="#E59B63" />
              {/* Singing / Jamming Smile */}
              <path
                d="M49 41C51.5 46 58.5 46 61 41"
                stroke="#FBEEE0"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <g>
              {/* Blinking Idle LED Eyes */}
              <motion.rect
                x="39"
                y="30"
                width="6.5"
                height="9.5"
                rx="3.2"
                fill="#E59B63"
                animate={{ scaleY: [1, 1, 0.12, 1] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  times: [0, 0.46, 0.5, 1],
                }}
              />
              <motion.rect
                x="64.5"
                y="30"
                width="6.5"
                height="9.5"
                rx="3.2"
                fill="#E59B63"
                animate={{ scaleY: [1, 1, 0.12, 1] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  times: [0, 0.46, 0.5, 1],
                }}
              />
              {/* Cute Little Smile */}
              <path
                d="M50 43C52 45.5 58 45.5 60 43"
                stroke="#FBEEE0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )}
        </motion.g>

        {/* Animated Chibi Hands (Hold Head on Dizzy, Wave on Greeting, Shake Fists on Angry!) */}
        <motion.circle
          cx={isDizzy ? 16 : isAngry ? 19 : isPlaying ? 18 : 26}
          cy={isDizzy ? 34 : isAngry ? 54 : isPlaying ? 44 : 78}
          r="5.5"
          fill="#FBEEE0"
          stroke={isDizzy ? '#A3E635' : isAngry ? '#EF4444' : '#9D613C'}
          strokeWidth="1.8"
          animate={
            isDragging
              ? { x: 0, y: [-8, -2, -8] }
              : isDizzy
              ? { x: [-3, 3, -3], y: [-4, 4, -4] }
              : isAngry
              ? { y: [-6, 4, -6], x: [-2, 2, -2] }
              : isPlaying
              ? { y: [0, -5, 0], x: [0, 2, 0] }
              : { x: 0, y: [0, -2, 0] }
          }
          transition={{
            duration: isDizzy ? 0.55 : isAngry ? 0.24 : isPlaying ? 0.45 : 1.8,
            repeat: Infinity,
          }}
        />

        {/* Waving Motion Lines when Greeting */}
        {isGreeting && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.95, 0.3] }}
            transition={{ duration: 0.45, repeat: Infinity }}
          >
            <path
              d="M99 20C103 23 104 28 102 33"
              stroke="#E59B63"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M103 17C108 21 109 28 106 35"
              stroke="#FBEEE0"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </motion.g>
        )}

        <motion.circle
          cx={isDizzy ? 94 : isGreeting ? 95 : isAngry ? 91 : isPlaying ? 92 : 84}
          cy={isDizzy ? 34 : isGreeting ? 30 : isAngry ? 54 : isPlaying ? 44 : 78}
          r="5.5"
          fill="#FBEEE0"
          stroke={isDizzy ? '#A3E635' : isGreeting ? '#E59B63' : isAngry ? '#EF4444' : '#9D613C'}
          strokeWidth="1.8"
          animate={
            isDragging
              ? { x: 0, y: [-2, -8, -2] }
              : isDizzy
              ? { x: [3, -3, 3], y: [4, -4, 4] }
              : isGreeting
              ? { x: [-4, 5, -4], y: [-4, 2, -4] }
              : isAngry
              ? { y: [4, -6, 4], x: [2, -2, 2] }
              : isPlaying
              ? { y: [-4, 1, -4], x: [0, -2, 0] }
              : { x: 0, y: [0, -2, 0] }
          }
          transition={{
            duration: isDizzy ? 0.55 : isGreeting ? 0.36 : isAngry ? 0.24 : isPlaying ? 0.45 : 1.8,
            repeat: Infinity,
          }}
        />

        {/* Small Indicator Badge on Corner */}
        {isExpanded && (
          <circle
            cx="88"
            cy="16"
            r="6"
            fill="#9D613C"
            stroke="#FBEEE0"
            strokeWidth="1.5"
          />
        )}
      </svg>
    </div>
  );
};

const NPC_GREETING_DIALOGUE_ID =
  'Halo ser! Selamat datang di web Uray! Yuk nyalain BGM sambil berburu airdrop & testnet! 🎧✨';

const NPC_GREETING_DIALOGUE_EN =
  "Hello ser! Welcome to Uray's web! Turn on the BGM while hunting airdrops & testnets! 🎧✨";

const NPC_ANGRY_DIALOGUES_ID = [
  '😤 Woi ser! Betah amat bengong di web ini lama-lama?! Jangan cuma rebahan, sana upgrade skill atau garap testnet dulu! ⚡',
  '😤 Udah lama banget mantengin layar! Kalau lagi nganggur jangan pasrah aja, ayo gerak cari peluang & klaim airdrop! 🪂',
  '🔥 CPU aku sampe ngebul liat kamu diem bae! Yuk produktif—klik kontak Uray atau nyalain musik biar semangat! 🎧',
];

const NPC_ANGRY_DIALOGUES_EN = [
  '😤 Hey ser! Why are you spacing out on this page so long?! Stop slacking—go upgrade your skills or grind testnets! ⚡',
  '😤 Staring at the screen forever?! If you are between jobs, do not just sit there—go hunt opportunities & airdrops! 🪂',
  '🔥 My CPU is overheating watching you idle! Get productive—collab with Uray or play a track to boost your energy! 🎧',
];

const NPC_DIZZY_DIALOGUES_ID = [
  '😵‍💫 Aduh pusing ser! Scroll-nya pelan-pelan napa, berasa naik candle meme coin pump & dump! 🤢',
  '😵 Waduh mabuk darat nih! Jangan ngebut-ngebut scroll-nya ser, mata CRT aku sampe muter-muter!',
  '🤢 Goyang dombret! Pelan dikit ser scroll-nya, sensor gyro aku sampe oleng nih! ⚡',
];

const NPC_DIZZY_DIALOGUES_EN = [
  '😵‍💫 Whoa dizzy ser! Slow down the scroll—feels like riding a meme coin pump & dump candle! 🤢',
  '😵 Ugh motion sickness! Do not speed-scroll so fast ser, my CRT eyes are spinning!',
  '🤢 Whoa easy there! Scroll a bit slower ser, my gyro sensors are totally wobbling! ⚡',
];

const NPC_IDLE_DIALOGUES_ID = [
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

const NPC_IDLE_DIALOGUES_EN = [
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

const getNpcPlayDialogues = (trackTitle: string, bpm: number, lang: 'id' | 'en') =>
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

interface RetroAudioPlayerProps {
  isReady?: boolean;
}

export const RetroAudioPlayer: React.FC<RetroAudioPlayerProps> = ({ isReady = true }) => {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(retroAudio.getIsPlaying());
  const [isShuffle, setIsShuffle] = useState(retroAudio.getIsShuffle());
  const [currentTrack, setCurrentTrack] = useState(retroAudio.getCurrentTrack());
  const [volume, setVolume] = useState(retroAudio.getVolume());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(retroAudio.getIsWidgetVisible());
  const [step, setStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Interactive NPC Dialogue State (Paused -> Sedang Mengetik -> Typewriter with punctuation pauses -> Reading) + Mood ('greeting' | 'normal' | 'angry' | 'dizzy')
  const [hasBootSynced, setHasBootSynced] = useState(false);
  const [mood, setMood] = useState<DjBotMood>('greeting');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [angryDialogueIndex, setAngryDialogueIndex] = useState(0);
  const [dizzyDialogueIndex, setDizzyDialogueIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [npcPhase, setNpcPhase] = useState<'paused' | 'composing' | 'typing' | 'reading'>('composing');
  const [npcTalkBounce, setNpcTalkBounce] = useState(false);
  const lastDizzyRecoveredAtRef = useRef<number>(0);
  const hasUserDraggedRef = useRef<boolean>(false);
  const initialAnchorTopRef = useRef<number | null>(null);
  const lastViewportWidthRef = useRef<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const moodRef = useRef<DjBotMood>(mood);
  const npcPhaseRef = useRef<'paused' | 'composing' | 'typing' | 'reading'>(npcPhase);
  moodRef.current = mood;
  npcPhaseRef.current = npcPhase;

  // Direct top-left viewport coordinates (x = left px, y = top px) immune to mobile URL-bar height changes on scroll
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [viewportInfo, setViewportInfo] = useState<{
    openDownward: boolean;
    bubbleOnLeft: boolean;
    cardShiftX: number;
  }>({
    openDownward: true,
    bubbleOnLeft: true,
    cardShiftX: 0,
  });

  const widgetRef = useRef<HTMLDivElement>(null);
  const botButtonRef = useRef<HTMLButtonElement>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const clearThresholdTimerRef = useRef<number | null>(null);
  const dragSessionRef = useRef<{
    active: boolean;
    mode: 'mouse' | 'touch' | 'pointer' | null;
    touchId: number | null;
    startClientX: number;
    startClientY: number;
    startOffsetX: number;
    startOffsetY: number;
    movedBeyondThreshold: boolean;
  }>({
    active: false,
    mode: null,
    touchId: null,
    startClientX: 0,
    startClientY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    movedBeyondThreshold: false,
  });

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    const unsubscribe = retroAudio.subscribe(() => {
      setIsPlaying(retroAudio.getIsPlaying());
      setIsShuffle(retroAudio.getIsShuffle());
      setCurrentTrack(retroAudio.getCurrentTrack());
      setVolume(retroAudio.getVolume());
      setIsWidgetVisible(retroAudio.getIsWidgetVisible());
      setStep(retroAudio.getCurrentStep());
    });
    return unsubscribe;
  }, []);

  /**
   * Clamp DJ Bot (left, top) coordinates so the character can be dragged freely across 100% of the screen
   * while auto-flipping the cloud bubble and keeping the cassette card inside the viewport.
   */
  const clampAndInspectBounds = useCallback(
    (rawX: number, rawY: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 8;

      const botEl = botButtonRef.current || widgetRef.current;
      const defaultBotW = isWidgetVisible ? (vw >= 640 ? 96 : 64) : 44;
      const defaultBotH = isWidgetVisible ? (vw >= 640 ? 100 : 72) : 44;
      const botWidth = botEl ? botEl.offsetWidth || defaultBotW : defaultBotW;
      const botHeight = botEl ? botEl.offsetHeight || defaultBotH : defaultBotH;

      const minX = margin;
      const maxX = Math.max(minX, vw - botWidth - margin);
      const minY = margin;
      const maxY = Math.max(minY, vh - botHeight - margin);

      const clampedX = Math.min(Math.max(rawX, minX), maxX);
      const clampedY = Math.min(Math.max(rawY, minY), maxY);

      const currentLeft = clampedX;
      const currentTop = clampedY;
      const botCenterX = currentLeft + botWidth / 2;

      // Ensure Expanded Cassette Card (254px on mobile, 280px on desktop) never clips left or right screen edges
      const cardWidth = vw >= 640 ? 280 : 254;
      let cardShiftX = 0;
      if (currentLeft + cardWidth > vw - margin) {
        cardShiftX = vw - margin - (currentLeft + cardWidth);
      }
      if (currentLeft + cardShiftX < margin) {
        cardShiftX = margin - currentLeft;
      }

      setViewportInfo((prev) => {
        const openDownward = prev.openDownward ? currentTop < 350 : currentTop < 310;
        const bubbleWidth = vw >= 640 ? 270 : 215;
        const wouldOverflowRight = currentLeft + bubbleWidth > vw - margin;
        const bubbleOnLeft =
          wouldOverflowRight ||
          (prev.bubbleOnLeft ? botCenterX > vw * 0.46 : botCenterX > vw * 0.54);

        if (
          prev.openDownward === openDownward &&
          prev.bubbleOnLeft === bubbleOnLeft &&
          Math.abs(prev.cardShiftX - cardShiftX) < 1
        ) {
          return prev;
        }
        return { openDownward, bubbleOnLeft, cardShiftX };
      });

      return { x: clampedX, y: clampedY };
    },
    [isWidgetVisible]
  );

  /**
   * Compute initial (left, top) so DJ Bot stands on the right side vertically aligned ("sejajar")
   * with the "Operator Node" badge (#hero-operator-node-badge), immune to page scroll & mobile address bar resize.
   */
  const computeHeroAnchorOffset = useCallback(
    (forceRemeasureBadge = false) => {
      const vw = window.innerWidth;
      const botEl = botButtonRef.current || widgetRef.current;
      const defaultBotW = isWidgetVisible ? (vw >= 640 ? 96 : 64) : 44;
      const defaultBotH = isWidgetVisible ? (vw >= 640 ? 100 : 72) : 44;
      const botWidth = botEl ? botEl.offsetWidth || defaultBotW : defaultBotW;
      const botHeight = botEl ? botEl.offsetHeight || defaultBotH : defaultBotH;

      const rightMargin = vw >= 1024 ? 32 : vw >= 640 ? 24 : 16;
      let topTarget =
        initialAnchorTopRef.current !== null && !forceRemeasureBadge
          ? initialAnchorTopRef.current
          : vw >= 640
          ? 255
          : 225;

      if (initialAnchorTopRef.current === null || forceRemeasureBadge) {
        const badgeEl = document.getElementById('hero-operator-node-badge');
        if (badgeEl) {
          const badgeRect = badgeEl.getBoundingClientRect();
          const badgeDocCenterY = badgeRect.top + window.scrollY + badgeRect.height / 2;
          // Align DJ Bot's center vertically with the "Operator Node" badge at the top of the page
          topTarget = Math.max(76, badgeDocCenterY - botHeight * 0.52);
          initialAnchorTopRef.current = topTarget;
        }
      }

      const rawX = vw - botWidth - rightMargin;
      const rawY = topTarget;
      return clampAndInspectBounds(rawX, rawY);
    },
    [clampAndInspectBounds, isWidgetVisible]
  );

  // Keep DJ Bot at its initial right-side position on horizontal viewport resize (ignoring mobile scroll URL-bar height changes)
  useEffect(() => {
    const syncPosition = (forceRemeasure = false) => {
      if (!hasUserDraggedRef.current && !dragSessionRef.current.active) {
        const anchorOffset = computeHeroAnchorOffset(forceRemeasure);
        offsetRef.current = anchorOffset;
        if (widgetRef.current) {
          widgetRef.current.style.transform = `translate3d(${anchorOffset.x}px, ${anchorOffset.y}px, 0)`;
        }
        setOffset(anchorOffset);
        return;
      }

      setOffset((prev) => {
        const next = clampAndInspectBounds(prev.x, prev.y);
        offsetRef.current = next;
        if (widgetRef.current) {
          widgetRef.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
        }
        return next;
      });
    };

    syncPosition(true);

    const handleWindowResize = () => {
      const currentVw = window.innerWidth;
      const widthChanged = Math.abs(currentVw - lastViewportWidthRef.current) > 2;
      lastViewportWidthRef.current = currentVw;
      // On mobile scroll, only innerHeight changes when the browser address bar hides/shows.
      // Ignoring height-only resize when DJ Bot is at its initial top-right anchor prevents any scroll jump.
      if (!widthChanged && !hasUserDraggedRef.current) {
        return;
      }
      syncPosition(widthChanged);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [clampAndInspectBounds, computeHeroAnchorOffset, isWidgetVisible]);

  // Global window-level Mouse & Touch drag listeners (immune to child button focus, fast cursor motion, and mobile scroll cancellation)
  useEffect(() => {
    const updateDragPosition = (clientX: number, clientY: number, originalEvent?: Event) => {
      const session = dragSessionRef.current;
      if (!session.active) return;

      const dx = clientX - session.startClientX;
      const dy = clientY - session.startClientY;
      const distance = Math.hypot(dx, dy);

      // 6px threshold cleanly separates an intentional drag from a tap/click on buttons
      if (!session.movedBeyondThreshold && distance > 6) {
        session.movedBeyondThreshold = true;
        hasUserDraggedRef.current = true;
        setIsDragging(true);
      }

      if (session.movedBeyondThreshold) {
        if (originalEvent && originalEvent.cancelable) {
          originalEvent.preventDefault();
        }
        const next = clampAndInspectBounds(
          session.startOffsetX + dx,
          session.startOffsetY + dy
        );
        offsetRef.current = next;
        if (widgetRef.current) {
          widgetRef.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
        }
        setOffset(next);
      }
    };

    const finishDragSession = () => {
      const session = dragSessionRef.current;
      if (!session.active) return;

      const wasDragging = session.movedBeyondThreshold;
      session.active = false;
      session.mode = null;
      session.touchId = null;

      if (wasDragging) {
        setIsDragging(false);
        const clamped = clampAndInspectBounds(offsetRef.current.x, offsetRef.current.y);
        offsetRef.current = clamped;
        setOffset(clamped);

        if (clearThresholdTimerRef.current !== null) {
          window.clearTimeout(clearThresholdTimerRef.current);
        }
        clearThresholdTimerRef.current = window.setTimeout(() => {
          dragSessionRef.current.movedBeyondThreshold = false;
          clearThresholdTimerRef.current = null;
        }, 140);
      }
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      const session = dragSessionRef.current;
      if (!session.active || session.mode !== 'mouse') return;
      // If mouse button was released outside window, end session cleanly
      if (e.buttons === 0) {
        finishDragSession();
        return;
      }
      updateDragPosition(e.clientX, e.clientY, e);
    };

    const handleWindowMouseUp = () => {
      const session = dragSessionRef.current;
      if (!session.active || session.mode !== 'mouse') return;
      finishDragSession();
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      const session = dragSessionRef.current;
      if (!session.active || session.mode !== 'touch') return;
      let matchedTouch: Touch | null = null;
      for (let i = 0; i < e.touches.length; i += 1) {
        if (e.touches[i].identifier === session.touchId) {
          matchedTouch = e.touches[i];
          break;
        }
      }
      if (!matchedTouch && e.touches.length > 0) {
        matchedTouch = e.touches[0];
      }
      if (!matchedTouch) return;
      updateDragPosition(matchedTouch.clientX, matchedTouch.clientY, e);
    };

    const handleWindowTouchEnd = (e: TouchEvent) => {
      const session = dragSessionRef.current;
      if (!session.active || session.mode !== 'touch') return;
      if (session.touchId !== null) {
        for (let i = 0; i < e.touches.length; i += 1) {
          if (e.touches[i].identifier === session.touchId) {
            return; // Tracked finger is still on screen
          }
        }
      }
      finishDragSession();
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: false });
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
    window.addEventListener('touchend', handleWindowTouchEnd);
    window.addEventListener('touchcancel', handleWindowTouchEnd);
    window.addEventListener('blur', finishDragSession);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowTouchEnd);
      window.removeEventListener('touchcancel', handleWindowTouchEnd);
      window.removeEventListener('blur', finishDragSession);
    };
  }, [clampAndInspectBounds]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(
        'input[type="range"], [data-player-control="true"], [data-no-drag="true"]'
      )
    ) {
      return;
    }
    if (e.button !== 0) return;

    if (clearThresholdTimerRef.current !== null) {
      window.clearTimeout(clearThresholdTimerRef.current);
      clearThresholdTimerRef.current = null;
    }

    dragSessionRef.current = {
      active: true,
      mode: 'mouse',
      touchId: null,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startOffsetX: offsetRef.current.x,
      startOffsetY: offsetRef.current.y,
      movedBeyondThreshold: false,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(
        'input[type="range"], [data-player-control="true"], [data-no-drag="true"]'
      )
    ) {
      return;
    }
    if (e.touches.length === 0) return;

    if (clearThresholdTimerRef.current !== null) {
      window.clearTimeout(clearThresholdTimerRef.current);
      clearThresholdTimerRef.current = null;
    }

    const touch = e.touches[0];
    dragSessionRef.current = {
      active: true,
      mode: 'touch',
      touchId: touch.identifier,
      startClientX: touch.clientX,
      startClientY: touch.clientY,
      startOffsetX: offsetRef.current.x,
      startOffsetY: offsetRef.current.y,
      movedBeyondThreshold: false,
    };
  };

  // Block synthetic button clicks on the avatar/bubble immediately after releasing a drag gesture,
  // while never blocking explicit player control buttons inside the card
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-player-control="true"]')) return;
    if (dragSessionRef.current.movedBeyondThreshold) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // 1. Synchronize Greeting Action at Initial Position AFTER Loading Screen finishes (when isReady becomes true)
  useEffect(() => {
    if (!isReady) return;

    // Slight 350ms post-reveal delay so DJ Bot pops in & waves at its initial position once hero layout settles
    const bootGreetingSyncTimer = setTimeout(() => {
      if (!hasUserDraggedRef.current && !dragSessionRef.current.active) {
        const initialPos = computeHeroAnchorOffset(true);
        offsetRef.current = initialPos;
        if (widgetRef.current) {
          widgetRef.current.style.transform = `translate3d(${initialPos.x}px, ${initialPos.y}px, 0)`;
        }
        setOffset(initialPos);
      }
      setHasBootSynced(true);
      setMood('greeting');
      setDialogueIndex(0);
      setTypedText('');
      setNpcPhase('composing');
      setNpcTalkBounce(true);
      setTimeout(() => setNpcTalkBounce(false), 320);
    }, 350);

    // Final settle check after hero entrance transition (950ms) completes
    const postEntranceSettleTimer = setTimeout(() => {
      if (!hasUserDraggedRef.current && !dragSessionRef.current.active) {
        const settledPos = computeHeroAnchorOffset(true);
        offsetRef.current = settledPos;
        if (widgetRef.current) {
          widgetRef.current.style.transform = `translate3d(${settledPos.x}px, ${settledPos.y}px, 0)`;
        }
        setOffset(settledPos);
      }
    }, 980);

    return () => {
      clearTimeout(bootGreetingSyncTimer);
      clearTimeout(postEntranceSettleTimer);
    };
  }, [isReady, computeHeroAnchorOffset]);

  // 2. Trigger a brief Angry burst when staying on the website for a long time (every 65s in normal mode),
  // and enforce a hard safety cap (9.5s max) so DJ Bot never stays angry for too long
  useEffect(() => {
    if (!hasBootSynced) return;

    if (mood === 'normal') {
      const longStayAngryTimer = setTimeout(() => {
        setMood('angry');
        setTypedText('');
        setNpcPhase('composing');
        setNpcTalkBounce(true);
        setTimeout(() => setNpcTalkBounce(false), 320);
      }, 65000);

      return () => clearTimeout(longStayAngryTimer);
    }

    if (mood === 'angry') {
      const maxAngryDurationTimer = setTimeout(() => {
        setMood('normal');
        setAngryDialogueIndex((prev) => prev + 1);
        setDialogueIndex((prev) => prev + 1);
        setNpcPhase('paused');
      }, 9500);

      return () => clearTimeout(maxAngryDurationTimer);
    }
  }, [hasBootSynced, mood]);

  // 3. True Sliding-Window Fast Scroll Velocity Detector -> Triggers 'dizzy' mood ONLY when user genuinely speed-scrolls!
  useEffect(() => {
    if (!hasBootSynced) return;

    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let scrollSamples: Array<{ t: number; dy: number }> = [];

    const handleFastScrollCheck = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const dy = Math.abs(currentY - lastScrollY);
      const dt = Math.max(1, now - lastScrollTime);

      lastScrollY = currentY;
      lastScrollTime = now;

      // Ignore programmatic smooth scrolling triggered by Navbar / CTA buttons
      if (document.documentElement.dataset.navScrolling === 'true') {
        scrollSamples = [];
        return;
      }

      // Do NOT trigger dizzy animation when DJ Bot is greeting, angry, already dizzy, or within 3.5s recovery cooldown
      const currentMood = moodRef.current;
      if (
        currentMood === 'greeting' ||
        currentMood === 'angry' ||
        currentMood === 'dizzy' ||
        now - lastDizzyRecoveredAtRef.current < 3500
      ) {
        scrollSamples = [];
        return;
      }

      // Keep only scroll deltas within the last 160ms sliding window
      scrollSamples.push({ t: now, dy });
      scrollSamples = scrollSamples.filter((s) => now - s.t <= 160);

      const windowDistance = scrollSamples.reduce((sum, s) => sum + s.dy, 0);
      const oldestSampleTime = scrollSamples.length > 0 ? scrollSamples[0].t : now;
      const windowDuration = Math.max(16, now - oldestSampleTime);
      const windowVelocity = windowDistance / windowDuration;
      const instantVelocity = dy / dt;

      // Trigger dizzy/mabuk animation ONLY on genuine rapid scroll bursts (> 650px within 160ms at high speed)
      if (
        !dragSessionRef.current.active &&
        ((windowDistance > 650 && windowVelocity > 3.0) || (dy > 160 && instantVelocity > 3.2))
      ) {
        scrollSamples = [];
        moodRef.current = 'dizzy';
        setMood('dizzy');
        setTypedText('');
        setNpcPhase('typing');
        setNpcTalkBounce(true);
        window.setTimeout(() => setNpcTalkBounce(false), 300);
      }
    };

    window.addEventListener('scroll', handleFastScrollCheck, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleFastScrollCheck);
    };
  }, [hasBootSynced]);

  // Reset dialogue index to 0 and trigger "Sedang mengetik..." when switching Play/Idle, track, or language
  useEffect(() => {
    if (!hasBootSynced) return;
    // If user starts playing music while DJ Bot is angry, switch to normal play mode
    if (isPlaying) {
      setMood((prev) => (prev === 'angry' ? 'normal' : prev));
    }
    if (moodRef.current !== 'greeting') {
      setDialogueIndex(0);
      setNpcPhase('composing');
    }
  }, [isPlaying, currentTrack.title, lang, hasBootSynced]);

  const activeDialogues =
    mood === 'greeting'
      ? [lang === 'id' ? NPC_GREETING_DIALOGUE_ID : NPC_GREETING_DIALOGUE_EN]
      : mood === 'dizzy'
      ? lang === 'id'
        ? NPC_DIZZY_DIALOGUES_ID
        : NPC_DIZZY_DIALOGUES_EN
      : mood === 'angry'
      ? lang === 'id'
        ? NPC_ANGRY_DIALOGUES_ID
        : NPC_ANGRY_DIALOGUES_EN
      : isPlaying
      ? getNpcPlayDialogues(currentTrack.title, currentTrack.bpm, lang)
      : lang === 'id'
      ? NPC_IDLE_DIALOGUES_ID
      : NPC_IDLE_DIALOGUES_EN;

  const activeIndex =
    mood === 'angry'
      ? angryDialogueIndex
      : mood === 'dizzy'
      ? dizzyDialogueIndex
      : dialogueIndex;

  const fullDialogueText = isDragging
    ? lang === 'id'
      ? 'Wheee~ terbang keliling jaringan! Lepas di mana aja 🛸✨'
      : 'Wheee~ flying across the network! Drop me anywhere 🛸✨'
    : activeDialogues[activeIndex % activeDialogues.length];

  // State machine for every interactive text (only runs after loading screen has synced):
  // 'paused' (jeda istirahat dialog box) -> 'composing' (Mengetik... •••) -> 'typing' (Typewriter dengan jeda tanda baca) -> 'reading' -> 'paused'
  useEffect(() => {
    if (!hasBootSynced) return;

    if (isDragging) {
      setTypedText(fullDialogueText);
      return;
    }

    if (npcPhase === 'paused') {
      setTypedText('');
      const pauseTimer = setTimeout(() => {
        setNpcPhase('composing');
        setNpcTalkBounce(true);
        setTimeout(() => setNpcTalkBounce(false), 260);
      }, 3400);
      return () => clearTimeout(pauseTimer);
    }

    if (npcPhase === 'composing') {
      setTypedText('');
      const composeTimer = setTimeout(
        () => {
          setNpcPhase('typing');
        },
        mood === 'greeting' ? 850 : mood === 'angry' ? 850 : 1400
      );
      return () => clearTimeout(composeTimer);
    }

    if (npcPhase === 'typing') {
      let charIndex = 0;
      let isCancelled = false;
      let timeoutId: number | null = null;
      setTypedText('');

      const typeNextChar = () => {
        if (isCancelled) return;
        charIndex += 1;
        setTypedText(fullDialogueText.slice(0, charIndex));

        if (charIndex >= fullDialogueText.length) {
          setNpcPhase('reading');
          return;
        }

        const justTypedChar = fullDialogueText[charIndex - 1];
        const nextChar = fullDialogueText[charIndex] || '';

        // Natural speech/reading pause ("jeda") on punctuation marks inside interactive text
        let delay = mood === 'angry' || mood === 'dizzy' ? 20 : 28;
        if (
          (justTypedChar === '.' || justTypedChar === '!' || justTypedChar === '?') &&
          nextChar === ' '
        ) {
          delay = mood === 'angry' || mood === 'dizzy' ? 210 : 340;
        } else if (
          (justTypedChar === ',' ||
            justTypedChar === ':' ||
            justTypedChar === ';' ||
            justTypedChar === '—') &&
          (nextChar === ' ' || justTypedChar === '—')
        ) {
          delay = mood === 'angry' || mood === 'dizzy' ? 120 : 190;
        }

        timeoutId = window.setTimeout(typeNextChar, delay);
      };

      // Brief initial pause before first character appears after "Mengetik..."
      timeoutId = window.setTimeout(typeNextChar, 90);

      return () => {
        isCancelled = true;
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    if (npcPhase === 'reading') {
      const readTimer = setTimeout(
        () => {
          // Once the greeting message has been read, stay in place and switch to normal mode
          if (mood === 'greeting') {
            setMood('normal');
            setDialogueIndex(0);
            setNpcPhase('paused');
          } else if (mood === 'dizzy') {
            lastDizzyRecoveredAtRef.current = performance.now();
            setMood('normal');
            setDizzyDialogueIndex((prev) => prev + 1);
            setDialogueIndex((prev) => prev + 1);
            setNpcPhase('paused');
          } else if (mood === 'angry') {
            // Calm down automatically after 1 angry message so DJ Bot doesn't stay angry too long
            setMood('normal');
            setAngryDialogueIndex((prev) => prev + 1);
            setDialogueIndex((prev) => prev + 1);
            setNpcPhase('paused');
          } else {
            setDialogueIndex((prev) => prev + 1);
            setNpcPhase('paused');
          }
        },
        mood === 'greeting' ? 5200 : mood === 'dizzy' ? 3800 : mood === 'angry' ? 4600 : 6200
      );
      return () => clearTimeout(readTimer);
    }
  }, [npcPhase, fullDialogueText, isDragging, hasBootSynced, mood]);

  const handleNextNpcDialogue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dragSessionRef.current.movedBeyondThreshold) return;
    robotSound.play('djbot');
    setNpcTalkBounce(true);
    setTimeout(() => setNpcTalkBounce(false), 260);

    // If currently typing, first click completes the full sentence so user can read it immediately
    if (npcPhase === 'typing') {
      setTypedText(fullDialogueText);
      setNpcPhase('reading');
      return;
    }

    // If currently in greeting mode and user clicks while composing, skip straight to typing the greeting;
    // if greeting is already read, advance smoothly to normal dialogues in place
    if (mood === 'greeting') {
      if (npcPhase === 'composing') {
        setNpcPhase('typing');
      } else {
        setMood('normal');
        setDialogueIndex(0);
        setNpcPhase('composing');
      }
      return;
    }

    // If currently in dizzy mode, clicking calms DJ Bot back to normal mode
    if (mood === 'dizzy') {
      lastDizzyRecoveredAtRef.current = performance.now();
      setMood('normal');
      setDizzyDialogueIndex((prev) => prev + 1);
      setDialogueIndex((prev) => prev + 1);
      setNpcPhase('composing');
      return;
    }

    // If currently in angry mode, clicking after composing immediately calms DJ Bot down to normal mode
    if (mood === 'angry') {
      if (npcPhase === 'composing') {
        setNpcPhase('typing');
      } else {
        setMood('normal');
        setAngryDialogueIndex((prev) => prev + 1);
        setDialogueIndex((prev) => prev + 1);
        setNpcPhase('composing');
      }
      return;
    }

    // If currently showing "Sedang mengetik..." or paused, skip straight to typing/composing;
    // otherwise advance to the next dialogue with "Sedang mengetik..."
    if (npcPhase === 'composing') {
      setNpcPhase('typing');
    } else if (npcPhase === 'paused') {
      setNpcPhase('composing');
    } else {
      setDialogueIndex((prev) => prev + 1);
      setNpcPhase('composing');
    }
  };

  const handleToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    retroAudio.toggle();
  };

  const handleToggleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    retroAudio.toggleShuffle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    retroAudio.setVolume(val);
  };

  const handleMuteToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    retroAudio.toggleMute();
  };

  const handleHideWidget = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsExpanded(false);
    retroAudio.setWidgetVisible(false);
  };

  const handleShowWidget = () => {
    if (dragSessionRef.current.movedBeyondThreshold) return;
    retroAudio.setWidgetVisible(true);
  };

  const handleCharacterClick = () => {
    // Ignore click if user was just dragging the character around
    if (dragSessionRef.current.movedBeyondThreshold) return;

    robotSound.play('djbot');
    setNpcTalkBounce(true);
    setTimeout(() => setNpcTalkBounce(false), 260);

    if (mood === 'angry' || mood === 'dizzy') {
      if (mood === 'dizzy') {
        lastDizzyRecoveredAtRef.current = performance.now();
      }
      setMood('normal');
      if (mood === 'angry') {
        setAngryDialogueIndex((prev) => prev + 1);
      } else {
        setDizzyDialogueIndex((prev) => prev + 1);
      }
      setDialogueIndex((prev) => prev + 1);
      setNpcPhase('composing');
    } else if (npcPhase === 'paused') {
      setNpcPhase('composing');
    }

    if (!isPlaying && !isExpanded) {
      retroAudio.start();
    }
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      ref={widgetRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClickCapture={handleClickCapture}
      onDragStart={(e) => e.preventDefault()}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className={`fixed top-0 left-0 select-none will-change-transform ${
        isDragging
          ? 'transition-none cursor-grabbing z-[70]'
          : 'transition-opacity duration-500 cursor-grab z-[60]'
      } ${!hasBootSynced ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <AnimatePresence mode="wait">
        {isWidgetVisible ? (
          <motion.div
            key="visible-widget"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={
              hasBootSynced
                ? { opacity: 1, y: 0, scale: isDragging ? 1.04 : 1 }
                : { opacity: 0, y: 12, scale: 0.96 }
            }
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-end will-change-[transform,opacity]"
          >
            {/* 1. Expanded Retro Cassette Player Glass Card (Auto-flips below character if dragged near top of screen) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: viewportInfo.openDownward ? -14 : 14,
                    scale: 0.94,
                  }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: viewportInfo.openDownward ? -14 : 14,
                    scale: 0.94,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  style={{ left: `${viewportInfo.cardShiftX}px` }}
                  className={`glass-player-card absolute z-30 ${
                    viewportInfo.openDownward
                      ? 'top-full mt-3.5 sm:mt-4'
                      : 'bottom-full mb-[82px] sm:mb-[96px]'
                  } p-3.5 sm:p-4 w-[254px] sm:w-[280px] text-[#fbeee0] overflow-hidden`}
                >
                  {/* Top Specular Glass Reflection Highlight & Ambient Sheen */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]"
                  >
                    <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
                    <div className="absolute -top-8 left-1/4 w-1/2 h-16 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent blur-xl" />
                  </div>

                  {/* Header: Title bar, Minimize & Hide actions */}
                  <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        {isPlaying && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        )}
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${
                            isPlaying ? 'bg-emerald-400' : 'bg-[#e59b63]'
                          }`}
                        />
                      </span>
                      <span className="font-fredoka text-xs font-semibold tracking-wider text-[#fbeee0] uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                        DJ BEAT-BOT 8-BIT
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        data-player-control="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                        }}
                        className="text-[#e8dacb] hover:text-white px-1.5 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 transition-all cursor-pointer text-xs font-mono"
                        title="Minimize player"
                        aria-label="Minimize"
                      >
                        {viewportInfo.openDownward ? '▲' : '▼'}
                      </button>

                      <button
                        type="button"
                        data-player-control="true"
                        onClick={handleHideWidget}
                        className="text-[#e8dacb] hover:text-[#ef4444] px-1.5 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-red-400/40 transition-all cursor-pointer text-xs font-mono"
                        title="Hide DJ character"
                        aria-label="Hide widget"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Track Info Smoked-Glass Display */}
                  <div className="relative z-10 px-3 py-2.5 rounded-2xl glass-player-screen mb-3 flex items-center justify-between">
                    <div className="overflow-hidden min-w-0 flex-1">
                      <div className="font-fredoka text-sm text-[#fbeee0] font-medium truncate flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                        <span className="truncate">{currentTrack.title}</span>
                      </div>
                      <div className="font-mono text-[10px] text-[#e59b63] truncate flex items-center gap-1">
                        <span className="truncate">{currentTrack.genre}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums shrink-0">{currentTrack.bpm} BPM</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`shrink-0 ${
                            isShuffle ? 'text-emerald-400' : 'text-[#d6c4b2]'
                          }`}
                        >
                          {isShuffle
                            ? lang === 'id'
                              ? 'ACAK'
                              : 'SHUFFLE'
                            : lang === 'id'
                            ? 'URUT'
                            : 'ORDER'}
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Equalizer Bars */}
                    <div className="flex items-end gap-1 h-5 w-8 shrink-0 justify-end pl-2">
                      {[0, 1, 2, 3].map((barIdx) => {
                        const barHeights = isPlaying
                          ? [
                              ((step + barIdx * 2) % 4) * 25 + 25,
                              ((step + barIdx * 3) % 4) * 25 + 25,
                              ((step + barIdx) % 4) * 25 + 25,
                              ((step + barIdx * 4) % 4) * 25 + 25,
                            ]
                          : [20, 20, 20, 20];
                        return (
                          <span
                            key={barIdx}
                            style={{
                              height: `${barHeights[barIdx]}%`,
                              transition: 'height 0.12s ease-out',
                            }}
                            className="w-1 bg-gradient-to-t from-[#e59b63] to-[#22c55e] rounded-t-sm shadow-[0_0_6px_rgba(34,197,94,0.35)]"
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Playback Glass Controls */}
                  <div className="relative z-10 flex items-center justify-between gap-1.5 mb-3">
                    <button
                      type="button"
                      data-player-control="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        retroAudio.prevTrack();
                      }}
                      className="glass-pill p-2 rounded-xl text-[#fbeee0] hover:text-white hover:border-white/40 active:scale-95 transition-all cursor-pointer shrink-0"
                      title={lang === 'id' ? 'Lagu Sebelumnya' : 'Previous Track'}
                      aria-label="Previous track"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      data-player-control="true"
                      onClick={handleToggle}
                      className="glass-pill-active flex-1 py-2 px-2.5 rounded-xl active:scale-95 text-white font-fredoka text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:border-white/60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] whitespace-nowrap"
                      title={isPlaying ? 'Pause retro music' : 'Play retro music'}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <>
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                          <span>PAUSE BGM</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span>PLAY BGM</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      data-player-control="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        retroAudio.nextTrack();
                      }}
                      className="glass-pill p-2 rounded-xl text-[#fbeee0] hover:text-white hover:border-white/40 active:scale-95 transition-all cursor-pointer shrink-0"
                      title={
                        isShuffle
                          ? lang === 'id'
                            ? 'Lagu Acak Berikutnya'
                            : 'Next Random Track'
                          : lang === 'id'
                          ? 'Lagu Berikutnya'
                          : 'Next Track'
                      }
                      aria-label="Next track"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                      </svg>
                    </button>

                    {/* Shuffle / Random Playback Mode Toggle Button */}
                    <button
                      type="button"
                      data-player-control="true"
                      onClick={handleToggleShuffle}
                      aria-pressed={isShuffle}
                      className={`p-2 rounded-xl active:scale-95 transition-all cursor-pointer shrink-0 border ${
                        isShuffle
                          ? 'bg-emerald-500/25 border-emerald-400/60 text-emerald-300 hover:border-emerald-300'
                          : 'glass-pill text-[#d6c4b2] hover:text-white hover:border-white/40'
                      }`}
                      title={
                        isShuffle
                          ? lang === 'id'
                            ? 'Mode Acak Aktif (Klik untuk Urut)'
                            : 'Shuffle Mode ON (Click for Sequential)'
                          : lang === 'id'
                          ? 'Mode Urut (Klik untuk Acak)'
                          : 'Sequential Mode (Click for Shuffle)'
                      }
                      aria-label="Toggle shuffle mode"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="16 3 21 3 21 8" />
                        <line x1="4" y1="20" x2="21" y2="3" />
                        <polyline points="21 16 21 21 16 21" />
                        <line x1="15" y1="15" x2="21" y2="21" />
                        <line x1="4" y1="4" x2="9" y2="9" />
                      </svg>
                    </button>
                  </div>

                  {/* Volume Slider Bar */}
                  <div
                    data-player-control="true"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="relative z-10 flex items-center gap-2 pt-2 border-t border-white/15"
                  >
                    <button
                      type="button"
                      data-player-control="true"
                      onClick={handleMuteToggle}
                      className="text-[#e8dacb] hover:text-white cursor-pointer shrink-0 transition-colors"
                      title={volume === 0 ? 'Unmute' : 'Mute'}
                      aria-label="Toggle mute"
                    >
                      <RetroSpeakerDoodle className="w-3.5 h-3.5" isMuted={volume === 0} />
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={volume}
                      onChange={handleVolumeChange}
                      aria-label="Volume slider"
                      className="w-full h-1.5 bg-white/15 border border-white/20 rounded-full appearance-none cursor-pointer accent-[#e59b63]"
                    />
                    <span className="font-mono text-[10px] text-[#e8dacb] w-7 text-right">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Draggable Animated DJ Character + Interactive NPC Dialogue Box */}
            <div className="relative flex items-end group">
              <button
                ref={botButtonRef}
                type="button"
                onClick={handleCharacterClick}
                style={{ touchAction: 'none' }}
                className={`relative flex items-center focus:outline-none touch-none transition-transform duration-200 ${
                  npcTalkBounce ? '-translate-y-1.5 scale-105' : 'hover:-translate-y-0.5'
                } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                title="Click DJ Bot to open BGM deck or drag anywhere!"
                aria-label="Toggle or drag Retro Backsound Player"
              >
                <BGMCharacterAvatar
                  isPlaying={isPlaying && volume > 0}
                  isExpanded={isExpanded}
                  isDragging={isDragging}
                  mood={mood}
                  step={step}
                />
              </button>

              {/* Interactive RPG NPC Cloud Dialog Bubble (Positioned Directly Above DJ Bot's Head) */}
              <AnimatePresence>
                {(isDragging || npcPhase !== 'paused') && (
                  <motion.div
                    key="npc-cloud-dialog"
                    data-no-drag="true"
                    role="button"
                    tabIndex={0}
                    initial={{
                      opacity: 0,
                      scale: 0.92,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      scale: npcTalkBounce ? 1.04 : 1,
                      y: npcTalkBounce ? -4 : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.92,
                      y: 6,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                    onClick={handleNextNpcDialogue}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNextNpcDialogue(e as unknown as React.MouseEvent);
                      }
                    }}
                    style={{ touchAction: 'manipulation' }}
                    title={
                      lang === 'id'
                        ? 'Klik awan dialog untuk pesan NPC berikutnya! ☁️'
                        : 'Click cloud bubble for next NPC dialogue! ☁️'
                    }
                    className={`absolute bottom-full mb-1.5 sm:mb-2 z-20 flex flex-col-reverse ${
                      viewportInfo.bubbleOnLeft
                        ? 'right-0 items-end'
                        : 'left-0 items-start'
                    } ${
                      isDragging ? 'cursor-grabbing' : 'cursor-pointer'
                    } select-none group/cloud`}
                  >
                    {/* Vertical Little Cloud Puffs rising from top of DJ Bot's Head to the Main Cloud */}
                    <div
                      className={`flex flex-col-reverse items-center gap-0.5 mt-0.5 ${
                        viewportInfo.bubbleOnLeft
                          ? 'mr-6 sm:mr-8'
                          : 'ml-6 sm:ml-8'
                      } pointer-events-none z-20`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full border sm:border-[1.5px] backdrop-blur-sm shadow-sm transition-colors duration-200 ${
                          !isDragging && mood === 'angry'
                            ? 'bg-[#1a0f14]/55 border-red-400/75'
                            : !isDragging && mood === 'dizzy'
                            ? 'bg-[#141f18]/55 border-lime-400/75'
                            : isDragging || mood === 'greeting' || npcPhase === 'composing' || npcPhase === 'typing'
                            ? 'bg-[#101824]/50 border-[#e59b63]/75'
                            : isPlaying
                            ? 'bg-[#101824]/50 border-emerald-400/75'
                            : 'bg-[#101824]/45 border-[#fbeee0]/60 group-hover/cloud:border-[#e59b63]/80'
                        }`}
                      />
                      <span
                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border sm:border-[1.5px] backdrop-blur-sm shadow-sm transition-colors duration-200 ${
                          !isDragging && mood === 'angry'
                            ? 'bg-[#1a0f14]/55 border-red-400/75'
                            : !isDragging && mood === 'dizzy'
                            ? 'bg-[#141f18]/55 border-lime-400/75'
                            : isDragging || mood === 'greeting' || npcPhase === 'composing' || npcPhase === 'typing'
                            ? 'bg-[#101824]/50 border-[#e59b63]/75'
                            : isPlaying
                            ? 'bg-[#101824]/50 border-emerald-400/75'
                            : 'bg-[#101824]/45 border-[#fbeee0]/60 group-hover/cloud:border-[#e59b63]/80'
                        }`}
                      />
                    </div>

                    {/* Main Fluffy Cloud Container (Smaller & Translucent with Backdrop Blur) */}
                    <div
                      className={`relative px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[16px_20px_15px_18px] sm:rounded-[22px_26px_20px_24px] border sm:border-[1.5px] text-left backdrop-blur-md shadow-[2px_3px_12px_rgba(0,0,0,0.38)] transition-all duration-200 ${
                        !isDragging && npcPhase === 'composing'
                          ? 'w-fit min-w-[104px] sm:min-w-[132px] max-w-[134px] sm:max-w-[192px]'
                          : 'w-[136px] sm:w-[196px]'
                      } ${
                        !isDragging && mood === 'angry'
                          ? 'bg-[#1a0f14]/55 border-red-400/75 text-[#fbeee0]'
                          : !isDragging && mood === 'dizzy'
                          ? 'bg-[#141f18]/55 border-lime-400/75 text-[#fbeee0]'
                          : isDragging || mood === 'greeting'
                          ? 'bg-[#101824]/50 border-[#e59b63]/75 text-[#fbeee0]'
                          : !isDragging && (npcPhase === 'composing' || npcPhase === 'typing')
                          ? 'bg-[#101824]/50 border-[#e59b63]/75 text-[#fbeee0]'
                          : isPlaying
                          ? 'bg-[#101824]/50 border-emerald-400/75 text-[#fbeee0]'
                          : 'bg-[#101824]/45 border-[#fbeee0]/60 text-[#fbeee0] group-hover/cloud:border-[#e59b63]/80 group-hover/cloud:bg-[#101824]/60'
                      }`}
                    >
                      {/* Decorative Top Cloud Puffs (Smaller & Translucent) */}
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -top-1.5 left-3 sm:left-4 w-3.5 sm:w-5 h-1.5 sm:h-2.5 rounded-t-full border-t border-x sm:border-t-[1.5px] sm:border-x-[1.5px] backdrop-blur-md transition-colors duration-200 ${
                          !isDragging && mood === 'angry'
                            ? 'bg-[#1a0f14]/55 border-red-400/75'
                            : !isDragging && mood === 'dizzy'
                            ? 'bg-[#141f18]/55 border-lime-400/75'
                            : isDragging || mood === 'greeting' || npcPhase === 'composing' || npcPhase === 'typing'
                            ? 'bg-[#101824]/50 border-[#e59b63]/75'
                            : isPlaying
                            ? 'bg-[#101824]/50 border-emerald-400/75'
                            : 'bg-[#101824]/45 border-[#fbeee0]/60 group-hover/cloud:border-[#e59b63]/80'
                        }`}
                      />
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -top-2 left-6 sm:left-8 w-5 sm:w-7 h-2 sm:h-3 rounded-t-full border-t border-x sm:border-t-[1.5px] sm:border-x-[1.5px] backdrop-blur-md transition-colors duration-200 ${
                          !isDragging && mood === 'angry'
                            ? 'bg-[#1a0f14]/55 border-red-400/75'
                            : !isDragging && mood === 'dizzy'
                            ? 'bg-[#141f18]/55 border-lime-400/75'
                            : isDragging || mood === 'greeting' || npcPhase === 'composing' || npcPhase === 'typing'
                            ? 'bg-[#101824]/50 border-[#e59b63]/75'
                            : isPlaying
                            ? 'bg-[#101824]/50 border-emerald-400/75'
                            : 'bg-[#101824]/45 border-[#fbeee0]/60 group-hover/cloud:border-[#e59b63]/80'
                        }`}
                      />
                      {!(!isDragging && npcPhase === 'composing') && (
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute -top-1.5 right-3.5 sm:right-5 w-3.5 sm:w-5 h-1.5 sm:h-2.5 rounded-t-full border-t border-x sm:border-t-[1.5px] sm:border-x-[1.5px] backdrop-blur-md transition-colors duration-200 ${
                            !isDragging && mood === 'angry'
                              ? 'bg-[#1a0f14]/55 border-red-400/75'
                              : !isDragging && mood === 'dizzy'
                              ? 'bg-[#141f18]/55 border-lime-400/75'
                              : isDragging || mood === 'greeting' || npcPhase === 'typing'
                              ? 'bg-[#101824]/50 border-[#e59b63]/75'
                              : isPlaying
                              ? 'bg-[#101824]/50 border-emerald-400/75'
                              : 'bg-[#101824]/45 border-[#fbeee0]/60 group-hover/cloud:border-[#e59b63]/80'
                          }`}
                        />
                      )}

                      {/* Top NPC Header Tag inside Cloud */}
                      <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-1.5 mb-1 sm:mb-1.5 border-b border-dashed border-[#fbeee0]/15 pb-0.5 sm:pb-1">
                        <div className="flex items-center gap-1 min-w-0">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              !isDragging && mood === 'angry'
                                ? 'bg-red-400 animate-ping'
                                : !isDragging && mood === 'dizzy'
                                ? 'bg-lime-400 animate-ping'
                                : isDragging || npcPhase === 'composing' || npcPhase === 'typing'
                                ? 'bg-[#e59b63] animate-ping'
                                : isPlaying
                                ? 'bg-emerald-400 animate-ping'
                                : 'bg-[#e59b63]'
                            }`}
                          />
                          <span
                            className={`font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                              !isDragging && mood === 'angry'
                                ? 'text-red-400'
                                : !isDragging && mood === 'dizzy'
                                ? 'text-lime-300'
                                : 'text-[#e59b63]'
                            }`}
                          >
                            DJ BOT
                          </span>
                          <span
                            className={`font-mono text-[6.5px] sm:text-[7.5px] px-1 py-0.2 rounded-full truncate ${
                              !isDragging && mood === 'greeting'
                                ? 'bg-[#e59b63]/20 text-[#fbeee0] border border-[#e59b63]/40'
                                : !isDragging && mood === 'dizzy'
                                ? 'bg-lime-500/20 text-lime-200 border border-lime-400/40'
                                : !isDragging && mood === 'angry'
                                ? 'bg-red-500/20 text-red-300 border border-red-400/35'
                                : !isDragging && (npcPhase === 'composing' || npcPhase === 'typing')
                                ? 'bg-[#9d613c]/30 text-[#fbeee0] border border-[#e59b63]/35'
                                : isPlaying
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-white/10 text-[#d6c4b2]'
                            }`}
                          >
                            {!isDragging && mood === 'greeting'
                              ? npcPhase === 'composing' || npcPhase === 'typing'
                                ? lang === 'id'
                                  ? 'MENYAPA 👋'
                                  : 'GREETING 👋'
                                : lang === 'id'
                                ? 'HALO! 👋'
                                : 'HI! 👋'
                              : !isDragging && mood === 'dizzy'
                              ? lang === 'id'
                                ? 'PUSING!'
                                : 'DIZZY!'
                              : !isDragging && mood === 'angry'
                              ? npcPhase === 'composing' || npcPhase === 'typing'
                                ? lang === 'id'
                                  ? 'NGAMBEK 💢'
                                  : 'FUMING 💢'
                                : lang === 'id'
                                ? 'MARAH! 💢'
                                : 'ANGRY! 💢'
                              : !isDragging && (npcPhase === 'composing' || npcPhase === 'typing')
                              ? lang === 'id'
                                ? 'MENGETIK...'
                                : 'TYPING...'
                              : isPlaying
                              ? 'PLAY'
                              : 'IDLE'}
                          </span>
                        </div>

                        <span className="font-mono text-[7.5px] sm:text-[8.5px] text-[#a39483]/90 group-hover/cloud:text-[#fbeee0] flex items-center gap-0.5 shrink-0">
                          <span>☁️</span>
                          <span>▸</span>
                        </span>
                      </div>

                      {/* NPC Cloud Dialogue Body: Compact "Sedang mengetik..." Bubble vs Typewriter Text */}
                      <div className="relative z-10 pt-0.5">
                        {!isDragging && npcPhase === 'composing' ? (
                          <div className="flex items-center gap-1.5 sm:gap-2 py-0.5">
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#090d14]/55 border border-[#e59b63]/35 shadow-inner shrink-0">
                              <span
                                className="w-1 h-1 rounded-full bg-[#e59b63] animate-bounce"
                                style={{ animationDelay: '0ms' }}
                              />
                              <span
                                className="w-1 h-1 rounded-full bg-[#e59b63] animate-bounce"
                                style={{ animationDelay: '150ms' }}
                              />
                              <span
                                className="w-1 h-1 rounded-full bg-[#e59b63] animate-bounce"
                                style={{ animationDelay: '300ms' }}
                              />
                            </span>
                            <span className="font-hand text-[10px] sm:text-xs text-[#e59b63] tracking-wide whitespace-nowrap">
                              {lang === 'id' ? 'Mengetik...' : 'Typing...'}
                            </span>
                          </div>
                        ) : (
                          <p className="font-hand text-[10.5px] sm:text-xs leading-snug sm:leading-relaxed text-[#fbeee0] tracking-[0.01em] min-h-[1.55rem] sm:min-h-[2.05rem] flex items-center">
                            <span>
                              {typedText}
                              {npcPhase === 'typing' && typedText.length < fullDialogueText.length && (
                                <span className="inline-block w-1 h-2.5 ml-0.5 bg-[#e59b63] animate-pulse align-middle" />
                              )}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          /* 3. Round Frosted Glass Restore Button when widget is hidden (also draggable) */
          <motion.button
            key="hidden-restore-badge"
            type="button"
            onClick={handleShowWidget}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className={`glass-player-card relative w-11 h-11 !rounded-full flex items-center justify-center transition-all duration-300 ${
              isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-110 active:scale-95'
            } ${
              isPlaying
                ? '!border-emerald-400/60 text-[#fbeee0] hover:!border-emerald-400'
                : 'text-[#fbeee0]/85 hover:text-[#fbeee0] hover:!border-white/45'
            }`}
            title={isPlaying ? 'BGM Playing — Click to show DJ Bot' : 'Click to show DJ Bot BGM Player'}
            aria-label="Restore BGM Player Widget"
          >
            <RetroCassetteDoodle
              className={`w-5 h-5 transition-colors ${
                isPlaying ? 'text-emerald-400' : 'text-[#e59b63]/85'
              }`}
            />
            {isPlaying && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
