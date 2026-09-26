import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { retroAudio } from '../utils/retroAudioEngine';
import { robotSound } from '../utils/robotSoundEngine';
import { RetroCassetteDoodle, RetroSpeakerDoodle } from './Doodles';
import { useLanguage } from '../context/LanguageContext';
import {
  NPC_GREETING_DIALOGUE_ID,
  NPC_GREETING_DIALOGUE_EN,
  NPC_ANGRY_DIALOGUES_ID,
  NPC_ANGRY_DIALOGUES_EN,
  NPC_DIZZY_DIALOGUES_ID,
  NPC_DIZZY_DIALOGUES_EN,
  NPC_IDLE_DIALOGUES_ID,
  NPC_IDLE_DIALOGUES_EN,
  getNpcPlayDialogues,
} from '../data/backsoundData';
import { BGMCharacterAvatar, DjBotMood } from './DjBotAvatar';

export type { DjBotMood };

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
  const [isWalking, setIsWalking] = useState(false);

  const [hasBootSynced, setHasBootSynced] = useState(false);
  const [mood, setMood] = useState<DjBotMood>('greeting');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [angryDialogueIndex, setAngryDialogueIndex] = useState(0);
  const [dizzyDialogueIndex, setDizzyDialogueIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [npcPhase, setNpcPhase] = useState<'paused' | 'composing' | 'typing' | 'reading'>('composing');
  const [npcTalkBounce, setNpcTalkBounce] = useState(false);

  const dizzyRecoveryTimerRef = useRef<number | null>(null);
  const walkRafRef = useRef<number | null>(null);
  const isWalkingRef = useRef<boolean>(false);
  const botStageRef = useRef<'hero_greeting' | 'walking_to_home' | 'home_or_free'>('hero_greeting');
  const moodRef = useRef<DjBotMood>(mood);
  const npcPhaseRef = useRef<'paused' | 'composing' | 'typing' | 'reading'>(npcPhase);
  moodRef.current = mood;
  npcPhaseRef.current = npcPhase;
  isWalkingRef.current = isWalking;

  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [viewportInfo, setViewportInfo] = useState<{
    openDownward: boolean;
    bubbleOnLeft: boolean;
    cardShiftX: number;
  }>({
    openDownward: false,
    bubbleOnLeft: false,
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

      const baseLeft = vw >= 640 ? 20 : 16;
      const baseBottom = vw >= 640 ? 20 : 16;

      const minX = -(baseLeft - margin);
      const maxX = Math.max(minX, vw - botWidth - baseLeft - margin);
      const maxY = baseBottom - margin;
      const minY = Math.min(maxY, -(vh - botHeight - baseBottom - margin));

      const clampedX = Math.min(Math.max(rawX, minX), maxX);
      const clampedY = Math.min(Math.max(rawY, minY), maxY);

      const currentLeft = baseLeft + clampedX;
      const currentTop = vh - baseBottom - botHeight + clampedY;
      const botCenterX = currentLeft + botWidth / 2;

      const cardWidth = vw >= 640 ? 276 : 250;
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

  const computeHeroAnchorOffset = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const baseLeft = vw >= 640 ? 20 : 16;
    const baseBottom = vw >= 640 ? 20 : 16;
    const botEl = botButtonRef.current || widgetRef.current;
    const defaultBotW = isWidgetVisible ? (vw >= 640 ? 96 : 64) : 44;
    const defaultBotH = isWidgetVisible ? (vw >= 640 ? 100 : 72) : 44;
    const botWidth = botEl ? botEl.offsetWidth || defaultBotW : defaultBotW;
    const botHeight = botEl ? botEl.offsetHeight || defaultBotH : defaultBotH;
    const baseTop = vh - baseBottom - botHeight;

    const rightMargin = vw >= 1024 ? 32 : vw >= 640 ? 24 : 16;
    let topTarget = vw >= 640 ? 255 : 225;

    const badgeEl = document.getElementById('hero-operator-node-badge');
    if (badgeEl) {
      const badgeRect = badgeEl.getBoundingClientRect();
      const badgeCenterY = badgeRect.top + badgeRect.height / 2;
      topTarget = badgeCenterY - botHeight * 0.52;
    }

    const rawX = vw - botWidth - rightMargin - baseLeft;
    const rawY = topTarget - baseTop;
    return clampAndInspectBounds(rawX, rawY);
  }, [clampAndInspectBounds, isWidgetVisible]);

  const setGlobalWalkState = useCallback((walking: boolean) => {
    isWalkingRef.current = walking;
    setIsWalking(walking);
    if (typeof document !== 'undefined') {
      if (walking) {
        document.body.setAttribute('data-djbot-walking', 'true');
      } else {
        document.body.removeAttribute('data-djbot-walking');
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('djbot-walk-change', { detail: { isWalking: walking } })
      );
    }
  }, []);

  const startWalkToBottomLeft = useCallback(() => {
    if (botStageRef.current !== 'hero_greeting') {
      setMood('normal');
      setDialogueIndex(0);
      setNpcPhase('paused');
      return;
    }

    botStageRef.current = 'walking_to_home';
    setMood('normal');
    setNpcPhase('paused');
    setTypedText('');
    setGlobalWalkState(true);

    const startX = offsetRef.current.x;
    const startY = offsetRef.current.y;
    const targetPos = clampAndInspectBounds(0, 0);
    const walkDurationMs = 2400;
    const walkStartTime = performance.now();

    const stepWalkFrame = (now: number) => {
      if (dragSessionRef.current.active) {
        botStageRef.current = 'home_or_free';
        setGlobalWalkState(false);
        walkRafRef.current = null;
        return;
      }

      const elapsed = now - walkStartTime;
      const t = Math.min(1, Math.max(0, elapsed / walkDurationMs));
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * t);

      const curX = startX + (targetPos.x - startX) * eased;
      const curY = startY + (targetPos.y - startY) * eased;
      const clamped = clampAndInspectBounds(curX, curY);

      offsetRef.current = clamped;
      if (widgetRef.current) {
        widgetRef.current.style.transform = `translate3d(${clamped.x}px, ${clamped.y}px, 0)`;
      }

      if (t < 1) {
        walkRafRef.current = requestAnimationFrame(stepWalkFrame);
      } else {
        const finalHome = clampAndInspectBounds(0, 0);
        offsetRef.current = finalHome;
        if (widgetRef.current) {
          widgetRef.current.style.transform = `translate3d(${finalHome.x}px, ${finalHome.y}px, 0)`;
        }
        setOffset(finalHome);
        botStageRef.current = 'home_or_free';
        setGlobalWalkState(false);
        setDialogueIndex(0);
        setNpcPhase('paused');
        walkRafRef.current = null;
      }
    };

    if (walkRafRef.current !== null) {
      cancelAnimationFrame(walkRafRef.current);
    }
    walkRafRef.current = requestAnimationFrame(stepWalkFrame);
  }, [clampAndInspectBounds, setGlobalWalkState]);

  useEffect(() => {
    return () => {
      if (walkRafRef.current !== null) {
        cancelAnimationFrame(walkRafRef.current);
      }
      if (typeof document !== 'undefined') {
        document.body.removeAttribute('data-djbot-walking');
      }
    };
  }, []);

  useEffect(() => {
    const syncBounds = () => {
      if (botStageRef.current === 'hero_greeting' && !dragSessionRef.current.active) {
        const anchorOffset = computeHeroAnchorOffset();
        offsetRef.current = anchorOffset;
        if (widgetRef.current) {
          widgetRef.current.style.transform = `translate3d(${anchorOffset.x}px, ${anchorOffset.y}px, 0)`;
        }
        setOffset(anchorOffset);
        return;
      }
      if (botStageRef.current === 'walking_to_home') return;

      setOffset((prev) => {
        const next = clampAndInspectBounds(prev.x, prev.y);
        offsetRef.current = next;
        return next;
      });
    };
    syncBounds();
    window.addEventListener('resize', syncBounds);
    window.addEventListener('scroll', syncBounds, { passive: true });
    return () => {
      window.removeEventListener('resize', syncBounds);
      window.removeEventListener('scroll', syncBounds);
    };
  }, [clampAndInspectBounds, computeHeroAnchorOffset, isExpanded, isWidgetVisible]);

  useEffect(() => {
    const updateDragPosition = (clientX: number, clientY: number, originalEvent?: Event) => {
      const session = dragSessionRef.current;
      if (!session.active) return;

      const dx = clientX - session.startClientX;
      const dy = clientY - session.startClientY;
      const distance = Math.hypot(dx, dy);

      if (!session.movedBeyondThreshold && distance > 5) {
        session.movedBeyondThreshold = true;
        if (botStageRef.current !== 'home_or_free') {
          botStageRef.current = 'home_or_free';
          if (walkRafRef.current !== null) {
            cancelAnimationFrame(walkRafRef.current);
            walkRafRef.current = null;
          }
          setGlobalWalkState(false);
        }
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
            return;
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
  }, [clampAndInspectBounds, setGlobalWalkState]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('input[type="range"], [data-player-control="true"]')) return;
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
    if (target.closest('input[type="range"], [data-player-control="true"]')) return;
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

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-player-control="true"]')) return;
    if (dragSessionRef.current.movedBeyondThreshold) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (!isReady) return;

    let trackRaf = 0;
    const trackStart = performance.now();
    const syncHeroAnchorDuringEntrance = (now: number) => {
      if (botStageRef.current === 'hero_greeting' && !dragSessionRef.current.active) {
        const nextPos = computeHeroAnchorOffset();
        offsetRef.current = nextPos;
        if (widgetRef.current) {
          widgetRef.current.style.transform = `translate3d(${nextPos.x}px, ${nextPos.y}px, 0)`;
        }
        setOffset(nextPos);
      }
      if (now - trackStart < 1100 && botStageRef.current === 'hero_greeting') {
        trackRaf = requestAnimationFrame(syncHeroAnchorDuringEntrance);
      }
    };
    trackRaf = requestAnimationFrame(syncHeroAnchorDuringEntrance);

    const bootGreetingSyncTimer = setTimeout(() => {
      if (botStageRef.current === 'hero_greeting' && !dragSessionRef.current.active) {
        const initialPos = computeHeroAnchorOffset();
        offsetRef.current = initialPos;
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

    return () => {
      cancelAnimationFrame(trackRaf);
      clearTimeout(bootGreetingSyncTimer);
    };
  }, [isReady, computeHeroAnchorOffset]);

  useEffect(() => {
    if (!hasBootSynced || isWalking) return;

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
  }, [hasBootSynced, mood, isWalking]);

  useEffect(() => {
    if (!hasBootSynced) return;

    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let rollingDistance = 0;
    let rollingResetTimer: number | null = null;

    const handleFastScrollCheck = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const dy = Math.abs(currentY - lastScrollY);
      const dt = Math.max(1, now - lastScrollTime);

      lastScrollY = currentY;
      lastScrollTime = now;

      if (dy < 12) return;

      rollingDistance += dy;
      if (rollingResetTimer !== null) {
        window.clearTimeout(rollingResetTimer);
      }
      rollingResetTimer = window.setTimeout(() => {
        rollingDistance = 0;
      }, 170);

      const velocityPxPerMs = dy / dt;

      const currentMood = moodRef.current;
      const currentPhase = npcPhaseRef.current;
      const isGreetingOrAngry =
        isWalkingRef.current || currentMood === 'greeting' || currentMood === 'angry';
      const isCurrentlyTyping =
        currentMood !== 'dizzy' && (currentPhase === 'composing' || currentPhase === 'typing');

      if (isGreetingOrAngry || isCurrentlyTyping) {
        rollingDistance = 0;
        return;
      }

      if (
        !dragSessionRef.current.active &&
        ((dy > 85 && velocityPxPerMs > 1.75) || rollingDistance > 420)
      ) {
        rollingDistance = 0;

        if (currentMood !== 'dizzy') {
          setMood('dizzy');
          setTypedText('');
          setNpcPhase('typing');
          setNpcTalkBounce(true);
          window.setTimeout(() => setNpcTalkBounce(false), 300);
        }

        if (dizzyRecoveryTimerRef.current !== null) {
          window.clearTimeout(dizzyRecoveryTimerRef.current);
        }
        dizzyRecoveryTimerRef.current = window.setTimeout(() => {
          setMood((m) => {
            if (m === 'dizzy') {
              setDizzyDialogueIndex((prev) => prev + 1);
              setDialogueIndex((prev) => prev + 1);
              setNpcPhase('paused');
              return 'normal';
            }
            return m;
          });
          dizzyRecoveryTimerRef.current = null;
        }, 4600);
      }
    };

    window.addEventListener('scroll', handleFastScrollCheck, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleFastScrollCheck);
      if (rollingResetTimer !== null) {
        window.clearTimeout(rollingResetTimer);
      }
      if (dizzyRecoveryTimerRef.current !== null) {
        window.clearTimeout(dizzyRecoveryTimerRef.current);
        dizzyRecoveryTimerRef.current = null;
      }
    };
  }, [hasBootSynced]);

  useEffect(() => {
    if (!hasBootSynced || isWalkingRef.current) return;
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

  useEffect(() => {
    if (!hasBootSynced) return;

    if (isWalking) {
      setTypedText('');
      return;
    }

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
      }, 2200);
      return () => clearTimeout(pauseTimer);
    }

    if (npcPhase === 'composing') {
      setTypedText('');
      const composeTimer = setTimeout(
        () => {
          setNpcPhase('typing');
        },
        mood === 'greeting' || mood === 'angry' ? 850 : 1400
      );
      return () => clearTimeout(composeTimer);
    }

    if (npcPhase === 'typing') {
      let charIndex = 0;
      let isCancelled = false;
      let timeoutId: number | null = null;
      setTypedText('');

      const typeNextChar = () => {
        if (isCancelled || isWalkingRef.current) return;
        charIndex += 1;
        setTypedText(fullDialogueText.slice(0, charIndex));

        if (charIndex >= fullDialogueText.length) {
          setNpcPhase('reading');
          return;
        }

        const justTypedChar = fullDialogueText[charIndex - 1];
        const nextChar = fullDialogueText[charIndex] || '';

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
          if (mood === 'greeting') {
            startWalkToBottomLeft();
          } else if (mood === 'dizzy') {
            setMood('normal');
            setDizzyDialogueIndex((prev) => prev + 1);
            setDialogueIndex((prev) => prev + 1);
            setNpcPhase('paused');
          } else if (mood === 'angry') {
            setMood('normal');
            setAngryDialogueIndex((prev) => prev + 1);
            setDialogueIndex((prev) => prev + 1);
            setNpcPhase('paused');
          } else {
            setDialogueIndex((prev) => prev + 1);
            setNpcPhase('paused');
          }
        },
        mood === 'greeting' ? 3200 : mood === 'dizzy' ? 4200 : mood === 'angry' ? 4600 : 6200
      );
      return () => clearTimeout(readTimer);
    }
  }, [npcPhase, fullDialogueText, isDragging, isWalking, hasBootSynced, mood, startWalkToBottomLeft]);

  const handleNextNpcDialogue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dragSessionRef.current.movedBeyondThreshold || isWalking) return;
    robotSound.play('djbot');
    setNpcTalkBounce(true);
    setTimeout(() => setNpcTalkBounce(false), 260);

    if (npcPhase === 'typing') {
      setTypedText(fullDialogueText);
      setNpcPhase('reading');
      return;
    }

    if (mood === 'greeting') {
      if (npcPhase === 'composing') {
        setNpcPhase('typing');
      } else {
        startWalkToBottomLeft();
      }
      return;
    }

    if (mood === 'dizzy') {
      if (dizzyRecoveryTimerRef.current !== null) {
        window.clearTimeout(dizzyRecoveryTimerRef.current);
        dizzyRecoveryTimerRef.current = null;
      }
      setMood('normal');
      setDizzyDialogueIndex((prev) => prev + 1);
      setDialogueIndex((prev) => prev + 1);
      setNpcPhase('composing');
      return;
    }

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
    if (volume > 0) {
      retroAudio.setVolume(0);
    } else {
      retroAudio.setVolume(0.28);
    }
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
    if (dragSessionRef.current.movedBeyondThreshold) return;

    robotSound.play('djbot');
    setNpcTalkBounce(true);
    setTimeout(() => setNpcTalkBounce(false), 260);

    if (mood === 'angry' || mood === 'dizzy') {
      if (dizzyRecoveryTimerRef.current !== null) {
        window.clearTimeout(dizzyRecoveryTimerRef.current);
        dizzyRecoveryTimerRef.current = null;
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

  const cloudAccentStyle =
    !isDragging && mood === 'angry'
      ? 'bg-[#1a0f14]/55 border-red-400/75'
      : !isDragging && mood === 'dizzy'
      ? 'bg-[#141f18]/55 border-lime-400/75'
      : isDragging || mood === 'greeting' || npcPhase === 'composing' || npcPhase === 'typing'
      ? 'bg-[#101824]/50 border-[#e59b63]/75'
      : isPlaying
      ? 'bg-[#101824]/50 border-emerald-400/75'
      : 'bg-[#101824]/45 border-[#fbeee0]/60 group-hover/cloud:border-[#e59b63]/80';

  return (
    <div
      ref={widgetRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClickCapture={handleClickCapture}
      onDragStart={(e) => e.preventDefault()}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        touchAction: 'none',
      }}
      className={`fixed bottom-4 left-4 sm:bottom-5 sm:left-5 select-none touch-none will-change-transform ${
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
            {/* Expanded Retro Cassette Player Glass Card */}
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
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]"
                  >
                    <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
                    <div className="absolute -top-8 left-1/4 w-1/2 h-16 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent blur-xl" />
                  </div>

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

            {/* Draggable Animated DJ Character + Interactive NPC Dialogue Box */}
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
                  isPlaying={isPlaying}
                  isExpanded={isExpanded}
                  isDragging={isDragging}
                  isWalking={isWalking}
                  mood={mood}
                  step={step}
                />
              </button>

              <AnimatePresence>
                {!isWalking && (isDragging || npcPhase !== 'paused') && (
                  <motion.div
                    key="npc-cloud-dialog"
                    role="button"
                    tabIndex={0}
                    initial={{ opacity: 0, scale: 0.92, y: 6 }}
                    animate={{
                      opacity: 1,
                      scale: npcTalkBounce ? 1.04 : 1,
                      y: npcTalkBounce ? -4 : 0,
                    }}
                    exit={{ opacity: 0, scale: 0.92, y: 6 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                    onClick={handleNextNpcDialogue}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNextNpcDialogue(e as unknown as React.MouseEvent);
                      }
                    }}
                    style={{ touchAction: 'none' }}
                    title={
                      lang === 'id'
                        ? 'Klik awan dialog untuk pesan NPC berikutnya! ☁️'
                        : 'Click cloud bubble for next NPC dialogue! ☁️'
                    }
                    className={`absolute bottom-full mb-1.5 sm:mb-2 z-20 flex flex-col-reverse touch-none ${
                      viewportInfo.bubbleOnLeft ? 'right-0 items-end' : 'left-0 items-start'
                    } ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'} select-none group/cloud`}
                  >
                    <div
                      className={`flex flex-col-reverse items-center gap-0.5 mt-0.5 ${
                        viewportInfo.bubbleOnLeft ? 'mr-6 sm:mr-8' : 'ml-6 sm:ml-8'
                      } pointer-events-none z-20`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full border sm:border-[1.5px] backdrop-blur-sm shadow-sm transition-colors duration-200 ${cloudAccentStyle}`}
                      />
                      <span
                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border sm:border-[1.5px] backdrop-blur-sm shadow-sm transition-colors duration-200 ${cloudAccentStyle}`}
                      />
                    </div>

                    <div
                      className={`relative px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[16px_20px_15px_18px] sm:rounded-[22px_26px_20px_24px] border sm:border-[1.5px] text-left backdrop-blur-md shadow-[2px_3px_12px_rgba(0,0,0,0.38)] transition-all duration-200 ${
                        !isDragging && npcPhase === 'composing'
                          ? 'w-fit min-w-[104px] sm:min-w-[132px] max-w-[134px] sm:max-w-[192px]'
                          : 'w-[136px] sm:w-[196px]'
                      } ${cloudAccentStyle} text-[#fbeee0]`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -top-1.5 left-3 sm:left-4 w-3.5 sm:w-5 h-1.5 sm:h-2.5 rounded-t-full border-t border-x sm:border-t-[1.5px] sm:border-x-[1.5px] backdrop-blur-md transition-colors duration-200 ${cloudAccentStyle}`}
                      />
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -top-2 left-6 sm:left-8 w-5 sm:w-7 h-2 sm:h-3 rounded-t-full border-t border-x sm:border-t-[1.5px] sm:border-x-[1.5px] backdrop-blur-md transition-colors duration-200 ${cloudAccentStyle}`}
                      />
                      {!(!isDragging && npcPhase === 'composing') && (
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute -top-1.5 right-3.5 sm:right-5 w-3.5 sm:w-5 h-1.5 sm:h-2.5 rounded-t-full border-t border-x sm:border-t-[1.5px] sm:border-x-[1.5px] backdrop-blur-md transition-colors duration-200 ${cloudAccentStyle}`}
                        />
                      )}

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
                                  ? 'MENYAPA...'
                                  : 'GREETING...'
                                : lang === 'id'
                                ? 'HALO!'
                                : 'HI!'
                              : !isDragging && mood === 'dizzy'
                              ? lang === 'id'
                                ? 'PUSING!'
                                : 'DIZZY!'
                              : !isDragging && mood === 'angry'
                              ? npcPhase === 'composing' || npcPhase === 'typing'
                                ? lang === 'id'
                                  ? 'NGAMBEK...'
                                  : 'FUMING...'
                                : lang === 'id'
                                ? 'MARAH!'
                                : 'ANGRY!'
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
