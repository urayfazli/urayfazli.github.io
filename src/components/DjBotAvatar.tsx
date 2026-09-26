import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type DjBotMood = 'greeting' | 'normal' | 'angry' | 'dizzy';

export const BGMCharacterAvatar: React.FC<{
  isPlaying: boolean;
  isExpanded: boolean;
  isDragging: boolean;
  isWalking: boolean;
  mood: DjBotMood;
  step: number;
}> = ({ isPlaying, isExpanded, isDragging, isWalking, mood, step }) => {
  const isAngry = mood === 'angry' && !isDragging && !isWalking;
  const isDizzy = mood === 'dizzy' && !isDragging && !isWalking;
  const isGreeting = mood === 'greeting' && !isDragging && !isWalking;

  return (
    <div className="relative w-16 h-18 sm:w-24 sm:h-25 flex items-center justify-center pointer-events-none select-none">
      <AnimatePresence>
        {isAngry && (
          <motion.span
            key="angry-steam"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: [0, 0.95, 0], y: [-2, -20], x: [-8, -16], scale: [0.7, 1.15] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }}
            className="absolute top-0 left-1 text-xs sm:text-sm z-20"
          >
            💨
          </motion.span>
        )}

        {isPlaying && !isAngry && !isDizzy && (
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
              exit={{ opacity: 0 }}
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
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, delay: 0.6, repeat: Infinity, ease: 'easeOut' }}
              className="absolute top-0 right-1 font-hand text-base sm:text-lg text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-20"
            >
              ♫
            </motion.span>
          </>
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 110 115"
        className="w-full h-full overflow-visible drop-shadow-[0_8px_14px_rgba(0,0,0,0.7)]"
        fill="none"
      >
        <motion.ellipse
          cx="55"
          cy="108"
          rx="34"
          ry="5"
          fill="#05080D"
          animate={
            isDragging
              ? { scaleX: 0.7, opacity: 0.4 }
              : isWalking
              ? { scaleX: [0.96, 0.82, 0.96], opacity: [0.75, 0.55, 0.75] }
              : { scaleX: 1, opacity: 0.75 }
          }
          transition={
            isWalking ? { duration: 0.34, repeat: Infinity, ease: 'easeInOut' } : undefined
          }
        />

        {isWalking && (
          <g>
            <motion.circle
              cx="76"
              cy="104"
              r="3.2"
              fill="#E59B63"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 0.7, 0],
                x: [0, 10, 16],
                y: [0, -4, -8],
                scale: [0.5, 1.2, 0.7],
              }}
              transition={{ duration: 0.48, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.circle
              cx="68"
              cy="106"
              r="2.4"
              fill="#FBEEE0"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 0.65, 0],
                x: [0, 8, 14],
                y: [0, -3, -6],
                scale: [0.4, 1.1, 0.6],
              }}
              transition={{ duration: 0.48, delay: 0.24, repeat: Infinity, ease: 'easeOut' }}
            />
          </g>
        )}

        {(isPlaying || isAngry || isDizzy) && !isWalking && (
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

        <motion.g
          animate={
            isDragging
              ? { y: -6, rotate: -4 }
              : isWalking
              ? { x: [-1.5, 1.5, -1.5], y: [0, -5, 0], rotate: [-4.5, -1.5, -4.5] }
              : isDizzy
              ? { x: [-3.5, 4, -3, 3.5, -3.5], y: [0, 2, -2, 1, 0], rotate: [-7, 8, -6, 7, -7] }
              : isAngry
              ? { x: [-1.5, 1.5, -1.5], y: [0, -3, 0] }
              : isGreeting
              ? { y: [0, -3, 0], rotate: [-1.5, 1.5, -1.5] }
              : isPlaying
              ? { y: [0, -2.5, 0], rotate: 0 }
              : { y: [0, -1, 0], rotate: 0 }
          }
          transition={{
            duration: isWalking
              ? 0.32
              : isDizzy
              ? 0.75
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
          style={{ transformOrigin: '55px 82px' }}
        >
          <motion.rect
            x="36"
            y="96"
            width="12"
            height="9"
            rx="4.5"
            fill={isAngry ? '#B91C1C' : '#9D613C'}
            stroke="#FBEEE0"
            strokeWidth="1.8"
            animate={
              isDragging
                ? { y: [-2, 3, -2], rotate: [-8, 8, -8] }
                : isWalking
                ? { x: [-5, 5, -5], y: [0, -6.5, 0], rotate: [-18, 14, -18] }
                : isDizzy
                ? { y: [-3, 2, -3], rotate: [-14, 10, -14] }
                : isAngry
                ? { y: [0, -4, 0] }
                : { x: 0, y: 0, rotate: 0 }
            }
            transition={{
              duration: isWalking ? 0.36 : isDizzy ? 0.5 : isAngry ? 0.28 : 0.35,
              repeat: isDragging || isWalking || isAngry || isDizzy ? Infinity : 0,
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
            animate={
              isDragging
                ? { y: [3, -2, 3], rotate: [8, -8, 8] }
                : isWalking
                ? { x: [5, -5, 5], y: [-6.5, 0, -6.5], rotate: [14, -18, 14] }
                : isDizzy
                ? { y: [2, -3, 2], rotate: [12, -14, 12] }
                : isAngry
                ? { y: [-4, 0, -4] }
                : { x: 0, y: 0, rotate: 0 }
            }
            transition={{
              duration: isWalking ? 0.36 : isDizzy ? 0.5 : isAngry ? 0.28 : 0.35,
              repeat: isDragging || isWalking || isAngry || isDizzy ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />

          <path
            d="M30 66C30 60 35 56 41 56H69C75 56 80 60 80 66L83 96H27L30 66Z"
            fill={isAngry ? '#2A1215' : '#162233'}
            stroke="#FBEEE0"
            strokeWidth="2"
          />
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

          <motion.circle
            cx="41"
            cy="83"
            r="6"
            fill="#141C28"
            stroke="#FBEEE0"
            strokeWidth="1.5"
            animate={isPlaying || isAngry ? { scale: [1, 1.16, 1] } : { scale: 1 }}
            transition={{ duration: isAngry ? 0.25 : 0.35, repeat: Infinity }}
          />
          <circle cx="41" cy="83" r="2" fill={isAngry ? '#EF4444' : '#E59B63'} />

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

          <motion.circle
            cx="69"
            cy="83"
            r="6"
            fill="#141C28"
            stroke="#FBEEE0"
            strokeWidth="1.5"
            animate={isPlaying || isAngry ? { scale: [1, 1.16, 1] } : { scale: 1 }}
            transition={{ duration: isAngry ? 0.25 : 0.35, repeat: Infinity }}
          />
          <circle cx="69" cy="83" r="2" fill={isAngry ? '#EF4444' : '#E59B63'} />
        </motion.g>

        <motion.g
          animate={
            isDragging
              ? { y: -7, rotate: [-5, 5, -5] }
              : isWalking
              ? { x: [-2, 1, -2], y: [0, -4, 0], rotate: [-5, -1, -5] }
              : isDizzy
              ? { x: [-4.5, 5, -3.5, 4.5, -4.5], y: [1, -3, 2, -2, 1], rotate: [-13, 14, -11, 13, -13] }
              : isAngry
              ? { y: [0, -3.5, 0], rotate: [-3.5, 3.5, -3.5] }
              : isGreeting
              ? { y: [0, -4, 0], rotate: [-5, 5, -5] }
              : isPlaying
              ? { y: [0, -5, 0], rotate: [-4, 4, -4] }
              : { y: [0, -2.5, 0], rotate: [-1, 1, -1] }
          }
          transition={{
            duration: isDragging
              ? 0.35
              : isWalking
              ? 0.32
              : isDizzy
              ? 0.72
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
          style={{ transformOrigin: '55px 42px' }}
        >
          {isDizzy && (
            <motion.g
              animate={{ x: [-3, 3, -3], rotate: [-6, 6, -6] }}
              transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '55px 2px' }}
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
                animate={{ cx: [29, 81, 29], scale: [0.85, 1.25, 0.85] }}
                transition={{ duration: 0.95, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="81"
                cy="2"
                r="2.8"
                fill="#A3E635"
                stroke="#090E16"
                strokeWidth="1"
                animate={{ cx: [81, 29, 81], scale: [1.25, 0.85, 1.25] }}
                transition={{ duration: 0.95, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.g>
          )}

          <path
            d="M19 39C19 17 34 7 55 7C76 7 91 17 91 39"
            stroke={isAngry ? '#EF4444' : isDizzy ? '#A3E635' : '#E59B63'}
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <line x1="55" y1="7" x2="55" y2="-1" stroke="#FBEEE0" strokeWidth="2.2" strokeLinecap="round" />
          <motion.circle
            cx="55"
            cy="-2"
            r="3.8"
            fill={isAngry ? '#EF4444' : isDizzy ? '#A3E635' : isPlaying ? '#22C55E' : '#E59B63'}
            animate={
              isAngry || isDizzy
                ? { scale: [1, 1.55, 1], opacity: [1, 0.6, 1] }
                : isPlaying
                ? { scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }
                : { scale: [1, 1.1, 1] }
            }
            transition={{ duration: isAngry || isDizzy ? 0.35 : 0.7, repeat: Infinity }}
          />

          <rect x="12" y="28" width="11" height="24" rx="5.5" fill={isAngry ? '#991B1B' : '#9D613C'} stroke="#FBEEE0" strokeWidth="2" />
          <rect x="87" y="28" width="11" height="24" rx="5.5" fill={isAngry ? '#991B1B' : '#9D613C'} stroke="#FBEEE0" strokeWidth="2" />
          <rect x="22" y="14" width="66" height="46" rx="14" fill="#FBEEE0" stroke="#141C28" strokeWidth="2.2" />
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
          <path d="M33 25H43L38 32H32V26C32 25.4 32.4 25 33 25Z" fill="#FFFFFF" fillOpacity="0.12" />

          {isDragging ? (
            <g>
              <path d="M37 31L45 35L37 39" stroke="#22C55E" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M73 31L65 35L73 39" stroke="#22C55E" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="55" cy="43" r="3.2" fill="#E59B63" />
            </g>
          ) : isWalking ? (
            <g>
              <rect x="36.5" y="30.5" width="6.5" height="9" rx="3.2" fill="#22C55E" />
              <rect x="61.5" y="30.5" width="6.5" height="9" rx="3.2" fill="#22C55E" />
              <rect x="32.5" y="40" width="5" height="2.4" rx="1.2" fill="#E59B63" />
              <rect x="70.5" y="40" width="5" height="2.4" rx="1.2" fill="#E59B63" />
              <path d="M48 43C50.5 46.5 57.5 46.5 60 43" stroke="#FBEEE0" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          ) : isDizzy ? (
            <g>
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '42px 34px' }}
              >
                <path
                  d="M42 34m-1 0a1.5 1.5 0 1 0 3 0a3 3 0 1 0 -6 0a4.5 4.5 0 1 0 9 0a5.8 5.8 0 1 0 -11.6 0"
                  stroke="#A3E635"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.g>
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '68px 34px' }}
              >
                <path
                  d="M68 34m-1 0a1.5 1.5 0 1 0 3 0a3 3 0 1 0 -6 0a4.5 4.5 0 1 0 9 0a5.8 5.8 0 1 0 -11.6 0"
                  stroke="#E59B63"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.g>
              <rect x="32.5" y="40.5" width="5.5" height="2.5" rx="1.2" fill="#84CC16" />
              <rect x="72" y="40.5" width="5.5" height="2.5" rx="1.2" fill="#84CC16" />
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
              <line x1="36" y1="28" x2="48" y2="33" stroke="#EF4444" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="74" y1="28" x2="62" y2="33" stroke="#EF4444" strokeWidth="2.8" strokeLinecap="round" />
              <rect x="39" y="33" width="7" height="6" rx="2" fill="#EF4444" />
              <rect x="64" y="33" width="7" height="6" rx="2" fill="#EF4444" />
              <rect x="33" y="40" width="5.5" height="2.5" rx="1.2" fill="#EF4444" />
              <rect x="71.5" y="40" width="5.5" height="2.5" rx="1.2" fill="#EF4444" />
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
              <path d="M37 35C39.5 29.5 45 29.5 47.5 35" stroke="#E59B63" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M62.5 35C65 29.5 70.5 29.5 73 35" stroke="#E59B63" strokeWidth="2.8" strokeLinecap="round" />
              <rect x="33" y="39" width="5.5" height="2.5" rx="1.2" fill="#E59B63" />
              <rect x="71.5" y="39" width="5.5" height="2.5" rx="1.2" fill="#E59B63" />
              <path d="M48 41C50.5 47 59.5 47 62 41Z" fill="#E59B63" stroke="#FBEEE0" strokeWidth="1.8" strokeLinejoin="round" />
            </g>
          ) : isPlaying ? (
            <g>
              <path d="M37 35C39.5 30 45 30 47.5 35" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
              <path d="M62.5 35C65 30 70.5 30 73 35" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
              <rect x="33" y="39" width="5.5" height="2.5" rx="1.2" fill="#E59B63" />
              <rect x="71.5" y="39" width="5.5" height="2.5" rx="1.2" fill="#E59B63" />
              <path d="M49 41C51.5 46 58.5 46 61 41" stroke="#FBEEE0" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <motion.rect
                x="39"
                y="30"
                width="6.5"
                height="9.5"
                rx="3.2"
                fill="#E59B63"
                animate={{ scaleY: [1, 1, 0.12, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.46, 0.5, 1] }}
              />
              <motion.rect
                x="64.5"
                y="30"
                width="6.5"
                height="9.5"
                rx="3.2"
                fill="#E59B63"
                animate={{ scaleY: [1, 1, 0.12, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.46, 0.5, 1] }}
              />
              <path d="M50 43C52 45.5 58 45.5 60 43" stroke="#FBEEE0" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </motion.g>

        <motion.circle
          cx={isWalking ? 23 : isDizzy ? 16 : isAngry ? 19 : isPlaying ? 18 : 26}
          cy={isWalking ? 74 : isDizzy ? 34 : isAngry ? 54 : isPlaying ? 44 : 78}
          r="5.5"
          fill="#FBEEE0"
          stroke={isWalking ? '#22C55E' : isDizzy ? '#A3E635' : isAngry ? '#EF4444' : '#9D613C'}
          strokeWidth="1.8"
          animate={
            isDragging
              ? { x: 0, y: [-8, -2, -8] }
              : isWalking
              ? { x: [-6, 6, -6], y: [-4, 4, -4] }
              : isDizzy
              ? { x: [-3, 3, -3], y: [-4, 4, -4] }
              : isAngry
              ? { y: [-6, 4, -6], x: [-2, 2, -2] }
              : isPlaying
              ? { y: [0, -5, 0], x: [0, 2, 0] }
              : { x: 0, y: [0, -2, 0] }
          }
          transition={{
            duration: isWalking ? 0.36 : isDizzy ? 0.55 : isAngry ? 0.24 : isPlaying ? 0.45 : 1.8,
            repeat: Infinity,
          }}
        />

        {isGreeting && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.95, 0.3] }}
            transition={{ duration: 0.45, repeat: Infinity }}
          >
            <path d="M99 20C103 23 104 28 102 33" stroke="#E59B63" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M103 17C108 21 109 28 106 35" stroke="#FBEEE0" strokeWidth="1.4" strokeLinecap="round" />
          </motion.g>
        )}

        <motion.circle
          cx={isWalking ? 87 : isDizzy ? 94 : isGreeting ? 95 : isAngry ? 91 : isPlaying ? 92 : 84}
          cy={isWalking ? 74 : isDizzy ? 34 : isGreeting ? 30 : isAngry ? 54 : isPlaying ? 44 : 78}
          r="5.5"
          fill="#FBEEE0"
          stroke={
            isWalking
              ? '#22C55E'
              : isDizzy
              ? '#A3E635'
              : isGreeting
              ? '#E59B63'
              : isAngry
              ? '#EF4444'
              : '#9D613C'
          }
          strokeWidth="1.8"
          animate={
            isDragging
              ? { x: 0, y: [-2, -8, -2] }
              : isWalking
              ? { x: [6, -6, 6], y: [4, -4, 4] }
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
            duration: isWalking ? 0.36 : isDizzy ? 0.55 : isGreeting ? 0.36 : isAngry ? 0.24 : isPlaying ? 0.45 : 1.8,
            repeat: Infinity,
          }}
        />

        {isExpanded && (
          <circle cx="88" cy="16" r="6" fill="#9D613C" stroke="#FBEEE0" strokeWidth="1.5" />
        )}
      </svg>
    </div>
  );
};
