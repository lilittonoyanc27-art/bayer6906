/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  User, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Check, 
  X, 
  HelpCircle, 
  Target, 
  ShieldAlert, 
  Play, 
  ArrowRight,
  ChevronDown,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QUESTIONS, 
  Question, 
  TOURNAMENT_STAGES, 
  TournamentStage, 
  SER_ESTAR_CHEAT_SHEET 
} from './questions';

// --- Web Audio Synthesizer for Authentic Retro Soccer Sounds ---
class SoundSynth {
  ctx: AudioContext | null = null;
  muted: boolean = false;

  constructor() {
    // Lazy initialize to satisfy browser user gesture requirements
  }

  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("AudioContext not supported", e);
      }
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
  }

  playKick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
    
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playWhistle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    
    const playWhistleBlast = (timeOffset: number, duration: number, pitch: number = 1300) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now + timeOffset);
      
      // Add a vibrato (frequency modulation) to mimic a real referee whistle pea
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.value = 35; // speed of trill
      vibratoGain.gain.value = 45; // depth of trill
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      
      gain.gain.setValueAtTime(0, now + timeOffset);
      gain.gain.linearRampToValueAtTime(0.25, now + timeOffset + 0.02);
      gain.gain.setValueAtTime(0.25, now + timeOffset + duration - 0.04);
      gain.gain.linearRampToValueAtTime(0, now + timeOffset + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      vibrato.start(now + timeOffset);
      osc.start(now + timeOffset);
      
      vibrato.stop(now + timeOffset + duration);
      osc.stop(now + timeOffset + duration);
    };
    
    playWhistleBlast(0, 0.18, 1300);
    playWhistleBlast(0.22, 0.35, 1400);
  }

  playGoal() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    
    // 1. Crowd Stadium Cheering (White noise bandpass swept)
    const bufferSize = ctx.sampleRate * 1.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(750, now + 0.4);
    filter.Q.value = 1.2;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
    noiseGain.gain.exponentialRampToValueAtTime(0.005, now + 1.6);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    
    // 2. Rising triumphant arpeggio notes
    const melody = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4 -> E4 -> G4 -> C5 -> E5 -> G5
    melody.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);
      
      gain.gain.setValueAtTime(0, now + index * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.45);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.5);
    });
  }

  playSave() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    
    // Lower flat pitch 'thump' and short referee whistle
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(45, now + 0.25);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 250;
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.3);
    
    // Play a single disappointed short whistle blow
    const oscWhistle = ctx.createOscillator();
    const gainWhistle = ctx.createGain();
    oscWhistle.type = 'sine';
    oscWhistle.frequency.setValueAtTime(900, now + 0.1);
    oscWhistle.frequency.exponentialRampToValueAtTime(500, now + 0.35);
    
    gainWhistle.gain.setValueAtTime(0, now + 0.1);
    gainWhistle.gain.linearRampToValueAtTime(0.12, now + 0.12);
    gainWhistle.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    oscWhistle.connect(gainWhistle);
    gainWhistle.connect(ctx.destination);
    oscWhistle.start(now + 0.1);
    oscWhistle.stop(now + 0.35);
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    
    const chords = [
      { time: 0.0, notes: [261.63, 329.63, 392.00] }, // C4 E4 G4
      { time: 0.25, notes: [349.23, 440.00, 523.25] }, // F4 A4 C5
      { time: 0.5, notes: [392.00, 493.88, 587.33] }, // G4 B4 D5
      { time: 0.75, notes: [523.25, 659.25, 783.99, 1046.50] } // C5 E5 G5 C6
    ];
    
    chords.forEach(chord => {
      chord.notes.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + chord.time);
        
        gain.gain.setValueAtTime(0, now + chord.time);
        gain.gain.linearRampToValueAtTime(0.12, now + chord.time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + 0.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + chord.time);
        osc.stop(now + chord.time + 0.8);
      });
    });
  }
}

// Global instance
const audio = new SoundSynth();

// --- Character Customization Types ---
interface CharacterConfig {
  name: string;
  gender: 'boy' | 'girl';
  jerseyColor: string; // 'red' | 'blue' | 'yellow' | 'green' | 'purple'
  hairColor: string; // 'black' | 'blonde' | 'brown' | 'redhead'
  skinTone: string; // 'fair' | 'olive' | 'medium' | 'dark'
}

const JERSEY_COLORS = [
  { id: 'red', name: 'Rojo (Կարմիր)', bg: 'bg-red-600', fill: '#dc2626' },
  { id: 'blue', name: 'Azul (Կապույտ)', bg: 'bg-blue-600', fill: '#2563eb' },
  { id: 'yellow', name: 'Amarillo (Դեղին)', bg: 'bg-yellow-400', fill: '#facc15' },
  { id: 'green', name: 'Verde (Կանաչ)', bg: 'bg-emerald-600', fill: '#059669' },
  { id: 'purple', name: 'Morado (Մանուշակագույն)', bg: 'bg-purple-600', fill: '#9333ea' },
];

const HAIR_COLORS = [
  { id: 'black', name: 'Negro', bg: 'bg-stone-900', fill: '#1c1917' },
  { id: 'brown', name: 'Castaño', bg: 'bg-amber-800', fill: '#78350f' },
  { id: 'blonde', name: 'Rubio', bg: 'bg-yellow-200', fill: '#fef08a' },
  { id: 'redhead', name: 'Pelirrojo', bg: 'bg-orange-600', fill: '#ea580c' },
];

const SKIN_TONES = [
  { id: 'fair', name: 'Բաց', bg: 'bg-[#fef3c7]', fill: '#fde68a' },
  { id: 'olive', name: 'Օլիվային', bg: 'bg-[#fed7aa]', fill: '#fdba74' },
  { id: 'medium', name: 'Միջին', bg: 'bg-[#f59e0b]', fill: '#d97706' },
  { id: 'dark', name: 'Թուխ', bg: 'bg-[#78350f]', fill: '#451a03' },
];

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<'welcome' | 'customization' | 'match' | 'stage-result' | 'champion'>('welcome');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  
  // Character settings
  const [character, setCharacter] = useState<CharacterConfig>({
    name: 'Goleador',
    gender: 'boy',
    jerseyColor: 'red',
    hairColor: 'brown',
    skinTone: 'olive'
  });

  // Tournament progress
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [currentQuestionIdxInStage, setCurrentQuestionIdxInStage] = useState<number>(0);
  const [goalsScoredThisStage, setGoalsScoredThisStage] = useState<number>(0);
  const [attemptsThisStage, setAttemptsThisStage] = useState<number>(0);
  const [stageHistory, setStageHistory] = useState<('goal' | 'save' | null)[]>([null, null, null, null]);
  const [isAnimatingShootout, setIsAnimatingShootout] = useState<boolean>(false);
  const [shotResult, setShotResult] = useState<{ isGoal: boolean; question: Question; userAnswer: string } | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Animation values for SVG objects
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number; scale: number; rotate: number }>({ x: 0, y: 150, scale: 1, rotate: 0 });
  const [keeperState, setKeeperState] = useState<'idle' | 'dive-left-top' | 'dive-right-top' | 'dive-left-bottom' | 'dive-right-bottom' | 'celebrate' | 'sad'>('idle');
  const [strikerState, setStrikerState] = useState<'idle' | 'run' | 'kick'>('idle');

  // Load from localStorage if present
  useEffect(() => {
    const savedConfig = localStorage.getItem('ser_estar_football_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.character) setCharacter(parsed.character);
        if (typeof parsed.soundMuted === 'boolean') {
          setSoundMuted(parsed.soundMuted);
          audio.setMuted(parsed.soundMuted);
        }
      } catch (e) {
        console.error("Failed to load saved config", e);
      }
    }
  }, []);

  // Sync mute state with sound synth helper
  useEffect(() => {
    audio.setMuted(soundMuted);
    localStorage.setItem('ser_estar_football_config', JSON.stringify({ character, soundMuted }));
  }, [soundMuted, character]);

  const currentStage = TOURNAMENT_STAGES[currentStageIdx];
  const currentQuestionId = currentStage?.questionIds[currentQuestionIdxInStage];
  const currentQuestion = QUESTIONS.find(q => q.id === currentQuestionId) as Question;

  const currentStageQuestionsCount = currentStage?.questionIds.length || 4;

  const handleMuteToggle = () => {
    setSoundMuted(!soundMuted);
    audio.init();
  };

  const handleStartGame = () => {
    audio.init();
    audio.playWhistle();
    setGameState('customization');
  };

  const handleSaveCharacterAndStartMatch = () => {
    if (!character.name.trim()) {
      setCharacter(prev => ({ ...prev, name: 'Goleador' }));
    }
    audio.playWhistle();
    // Initialize stage status
    setGoalsScoredThisStage(0);
    setAttemptsThisStage(0);
    setCurrentQuestionIdxInStage(0);
    setStageHistory(new Array(currentStageQuestionsCount).fill(null));
    setGameState('match');
  };

  const startNextStage = () => {
    const nextIdx = currentStageIdx + 1;
    if (nextIdx < TOURNAMENT_STAGES.length) {
      setCurrentStageIdx(nextIdx);
      setCurrentQuestionIdxInStage(0);
      setGoalsScoredThisStage(0);
      setAttemptsThisStage(0);
      const nextStageQuestionCount = TOURNAMENT_STAGES[nextIdx].questionIds.length;
      setStageHistory(new Array(nextStageQuestionCount).fill(null));
      setGameState('match');
      audio.playWhistle();
    } else {
      // Won the tournament!
      setGameState('champion');
      audio.playFanfare();
    }
  };

  const replayStage = () => {
    setCurrentQuestionIdxInStage(0);
    setGoalsScoredThisStage(0);
    setAttemptsThisStage(0);
    setStageHistory(new Array(currentStageQuestionsCount).fill(null));
    setGameState('match');
    audio.playWhistle();
  };

  const restartTournament = () => {
    setCurrentStageIdx(0);
    setCurrentQuestionIdxInStage(0);
    setGoalsScoredThisStage(0);
    setAttemptsThisStage(0);
    setStageHistory(new Array(4).fill(null));
    setGameState('customization');
  };

  // --- Core Gameplay Penalty Logic ---
  const handleAnswerSubmit = (selectedOption: string) => {
    if (isAnimatingShootout || showExplanation) return;

    audio.init();
    setIsAnimatingShootout(true);
    setStrikerState('run');

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const optionIdx = currentQuestion.options.indexOf(selectedOption);

    // Ball target coordinates inside the goal SVG
    // Top-Left (0), Top-Right (1), Bottom-Left (2), Bottom-Right (3)
    const targets = [
      { x: -130, y: -90, keeperSafe: 'dive-left-top' as const, keeperFail: 'dive-right-bottom' as const },
      { x: 130, y: -90, keeperSafe: 'dive-right-top' as const, keeperFail: 'dive-left-bottom' as const },
      { x: -130, y: 15, keeperSafe: 'dive-left-bottom' as const, keeperFail: 'dive-right-top' as const },
      { x: 130, y: 15, keeperSafe: 'dive-right-bottom' as const, keeperFail: 'dive-left-top' as const },
    ];

    const target = targets[optionIdx !== -1 ? optionIdx : 0];

    // Timeline of shootout animations
    // 1. Striker runs and kicks ball
    setTimeout(() => {
      setStrikerState('kick');
      audio.playKick();
      
      // 2. Ball flies to target & Goalkeeper dives
      setBallPosition({
        x: target.x,
        y: target.y,
        scale: 0.45,
        rotate: 720
      });

      if (isCorrect) {
        // Goalkeeper dives the wrong way!
        setKeeperState(target.keeperFail);
      } else {
        // Goalkeeper dives the right way and blocks the shot!
        setKeeperState(target.keeperSafe);
      }
    }, 450);

    // 3. Goal / Save result announcement
    setTimeout(() => {
      if (isCorrect) {
        audio.playGoal();
        setKeeperState('sad');
        
        // Update scoreboard
        setGoalsScoredThisStage(prev => prev + 1);
        const newHistory = [...stageHistory];
        newHistory[currentQuestionIdxInStage] = 'goal';
        setStageHistory(newHistory);
      } else {
        audio.playSave();
        setKeeperState('celebrate');
        
        const newHistory = [...stageHistory];
        newHistory[currentQuestionIdxInStage] = 'save';
        setStageHistory(newHistory);
      }

      setAttemptsThisStage(prev => prev + 1);
      setShotResult({
        isGoal: isCorrect,
        question: currentQuestion,
        userAnswer: selectedOption
      });
      
      setIsAnimatingShootout(false);
      setShowExplanation(true);
    }, 1200);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setShotResult(null);
    
    // Reset players and ball positions
    setBallPosition({ x: 0, y: 150, scale: 1, rotate: 0 });
    setKeeperState('idle');
    setStrikerState('idle');

    const nextQuestionIdx = currentQuestionIdxInStage + 1;
    if (nextQuestionIdx < currentStageQuestionsCount) {
      setCurrentQuestionIdxInStage(nextQuestionIdx);
    } else {
      // Finished all questions for this stage! Evaluate match outcome.
      const stagePassed = goalsScoredThisStage >= currentStage.requiredWins;
      setGameState('stage-result');
      if (stagePassed) {
        audio.playWhistle();
      } else {
        audio.playSave();
      }
    }
  };

  // --- SVG Color helper for character hair & jersey ---
  const getJerseyHex = () => JERSEY_COLORS.find(c => c.id === character.jerseyColor)?.fill || '#dc2626';
  const getHairHex = () => HAIR_COLORS.find(c => c.id === character.hairColor)?.fill || '#78350f';
  const getSkinHex = () => SKIN_TONES.find(c => c.id === character.skinTone)?.fill || '#fdba74';

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col justify-between overflow-x-hidden antialiased selection:bg-emerald-500 selection:text-white relative">
      
      {/* Stadium Ambient Lights Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#14532d_0%,_#020617_80%)] opacity-95 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* --- HEADER --- */}
      <header className="relative z-10 px-6 py-4 bg-slate-950/90 backdrop-blur-xl border-b-4 border-[#fbbf24] flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-yellow-400 flex items-center justify-center shadow-lg text-white font-black text-xl transform hover:rotate-12 transition-transform">
            ⚽
          </div>
          <div>
            <h1 id="app-title" className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase font-display bg-gradient-to-r from-[#fbbf24] via-emerald-400 to-[#fbbf24] bg-clip-text text-transparent">
              COPA DE SER Y ESTAR
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-widest uppercase">Իսպաներենի բայերի ֆուտբոլային գավաթ A1</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Rules button */}
          <button
            id="btn-rules"
            onClick={() => setShowCheatSheet(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-slate-200 text-xs font-mono font-bold tracking-wider uppercase rounded-xl transition-all border border-white/10 hover:border-emerald-500/50 shadow-md cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Հուշաթերթիկ</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-mute"
            onClick={handleMuteToggle}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-all border border-white/10 hover:border-emerald-500/50 shadow-md cursor-pointer"
            title={soundMuted ? "Միացնել ձայնը" : "Անջատել ձայնը"}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400 animate-pulse" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* --- MAIN INTERFACE STAGES --- */}
      <main className="flex-1 relative z-10 w-full max-w-4xl mx-auto px-4 py-6 flex flex-col justify-center">
        
        <AnimatePresence mode="wait">

          {/* 1. WELCOME SCREEN */}
          {gameState === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center py-10 px-8 max-w-lg mx-auto bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),_0_0_30px_rgba(16,185,129,0.1)] overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-500" />
              
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-b from-[#0f172a] to-[#166534] text-emerald-400 rounded-full mb-6 border-2 border-[#fbbf24] shadow-2xl relative animate-pulse">
                <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_4px_8px_rgba(251,191,36,0.3)]" />
                <span className="absolute -bottom-1 -right-1 text-3xl">🇪🇸</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter font-display text-white mb-3 uppercase">
                Հաղթի՛ր <br />
                <span className="bg-gradient-to-r from-yellow-300 via-emerald-400 to-yellow-300 bg-clip-text text-transparent">SER y ESTAR!</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-sm mx-auto leading-relaxed">
                Իսպաներենի ինտերակտիվ ֆուտբոլային մարզիչ <span className="bg-emerald-950/60 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-mono font-bold text-xs uppercase tracking-wider">A1 ESPAÑOL</span> մակարդակի համար: Խփի՛ր տասնմեկմետրանոցներ, պատասխանի՛ր հարցերին և հաղթի՛ր գավաթը:
              </p>

              <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 text-left text-xs text-slate-300 space-y-3 mb-8 shadow-inner">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#fbbf24] font-mono text-xs">01 //</span>
                  <div>
                    <span className="text-emerald-400 font-bold block">15 հարց մրցաշարում.</span>
                    <span className="text-slate-400">փլեյ-օֆֆի 4 փուլ (1/8, 1/4, Կիսաեզրափակիչ, Եզրափակիչ)՝ բարդության աստիճանական բարձրացմամբ:</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#fbbf24] font-mono text-xs">02 //</span>
                  <div>
                    <span className="text-emerald-400 font-bold block">Ֆուտբոլիստի ստեղծում.</span>
                    <span className="text-slate-400">Կարգավորի՛ր հարձակվողիդ անունը, սանրվածքը և մարզաշապիկի գույնը՝ դաշտ դուրս գալու համար:</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#fbbf24] font-mono text-xs">03 //</span>
                  <div>
                    <span className="text-emerald-400 font-bold block">Քերականության վերլուծություն.</span>
                    <span className="text-slate-400">Յուրաքանչյուր հարված ուղեկցվում է հայերենով ակնառու կանոնով և օրինակներով:</span>
                  </div>
                </div>
              </div>

              <button
                id="btn-start"
                onClick={handleStartGame}
                className="w-full sm:w-auto px-8 py-4 bg-[#fbbf24] hover:bg-[#fcd34d] text-slate-950 font-black text-base uppercase tracking-wider rounded-2xl transition-all shadow-xl hover:shadow-[#fbbf24]/20 hover:scale-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-600"
              >
                Դուրս գալ դաշտ <Play className="w-5 h-5 fill-slate-950 stroke-[3px]" />
              </button>
            </motion.div>
          )}

          {/* 2. CUSTOMIZATION SCREEN */}
          {gameState === 'customization' && (
            <motion.div
              key="customization"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-2xl mx-auto w-full"
            >
              <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-yellow-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black italic tracking-tight font-display uppercase text-white">Ստեղծի՛ր քո չեմպիոնին</h2>
                  <p className="text-xs text-slate-400 font-mono tracking-wide">Կարգավորի՛ր հարձակվողի անունը, սեռը և համազգեստի գույները</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Visual Player Preview Container */}
                <div className="bg-slate-950/80 rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-center aspect-square relative overflow-hidden shadow-inner group">
                  {/* Decorative glowing stadium spotlight */}
                  <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-500/10 via-emerald-500/2 to-transparent blur-xl pointer-events-none" />
                  
                  {/* Styled Preview Label */}
                  <span className="absolute top-4 left-4 bg-slate-900/90 text-[10px] text-emerald-400 font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-full border border-white/5 shadow-md">
                    ՀԱՐՁԱԿՎՈՂ // PREVIEW
                  </span>

                  {/* CUSTOM SVG STRIKER AVATAR PREVIEW */}
                  <svg viewBox="0 0 200 200" className="w-52 h-52 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-300">
                    {/* Shadow */}
                    <ellipse cx="100" cy="180" rx="45" ry="8" fill="rgba(0,0,0,0.5)" />
                    
                    {/* Hair back (if girl with ponytail) */}
                    {character.gender === 'girl' && (
                      <g>
                        <circle cx="130" cy="60" r="18" fill={getHairHex()} />
                        <path d="M125,55 C135,55 145,65 145,75 C145,80 135,85 130,80 Z" fill={getHairHex()} />
                        <rect x="110" y="55" width="12" height="6" fill="#3b82f6" rx="2" transform="rotate(25 110 55)" /> {/* hair tie */}
                      </g>
                    )}

                    {/* Legs */}
                    <rect x="82" y="130" width="10" height="40" fill={getSkinHex()} rx="4" />
                    <rect x="108" y="130" width="10" height="40" fill={getSkinHex()} rx="4" />
                    {/* Socks */}
                    <rect x="82" y="150" width="10" height="18" fill="#ffffff" />
                    <rect x="82" y="154" width="10" height="4" fill={getJerseyHex()} />
                    <rect x="108" y="150" width="10" height="18" fill="#ffffff" />
                    <rect x="108" y="154" width="10" height="4" fill={getJerseyHex()} />
                    {/* Boots */}
                    <path d="M78,168 h14 a4,4 0 0 1 4,4 v4 h-20 v-4 a4,4 0 0 1 2,-4 Z" fill="#1e293b" />
                    <path d="M104,168 h14 a4,4 0 0 1 4,4 v4 h-20 v-4 a4,4 0 0 1 2,-4 Z" fill="#1e293b" />

                    {/* Torso/Jersey */}
                    <path d="M75,95 h50 L120,135 H80 Z" fill={getJerseyHex()} rx="3" />
                    {/* V-neck */}
                    <polygon points="90,95 110,95 100,105" fill={getSkinHex()} />
                    {/* Stripes on jersey */}
                    <rect x="87" y="106" width="6" height="29" fill="#ffffff" opacity="0.15" />
                    <rect x="107" y="106" width="6" height="29" fill="#ffffff" opacity="0.15" />

                    {/* Left & Right arms */}
                    <path d="M63,95 C65,110 75,120 75,120" stroke={getSkinHex()} strokeWidth="10" strokeLinecap="round" />
                    <path d="M137,95 C135,110 125,120 125,120" stroke={getSkinHex()} strokeWidth="10" strokeLinecap="round" />
                    {/* Sleeves */}
                    <path d="M75,95 L68,110 L78,112 L82,95 Z" fill={getJerseyHex()} />
                    <path d="M125,95 L132,110 L122,112 L118,95 Z" fill={getJerseyHex()} />

                    {/* Head */}
                    <circle cx="100" cy="65" r="24" fill={getSkinHex()} />
                    
                    {/* Face Details */}
                    {/* Cheeks blush */}
                    <circle cx="86" cy="72" r="3" fill="#f87171" opacity="0.5" />
                    <circle cx="114" cy="72" r="3" fill="#f87171" opacity="0.5" />
                    {/* Eyes */}
                    <circle cx="91" cy="66" r="3" fill="#1e293b" />
                    <circle cx="109" cy="66" r="3" fill="#1e293b" />
                    <circle cx="92" cy="65" r="1" fill="#ffffff" />
                    <circle cx="110" cy="65" r="1" fill="#ffffff" />
                    {/* Smile */}
                    <path d="M94,74 Q100,81 106,74" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Hair front */}
                    {character.gender === 'boy' ? (
                      <g>
                        {/* Boy hair */}
                        <path d="M74,62 C74,40 126,40 126,62 C126,52 120,44 110,48 C100,42 90,46 86,52 Z" fill={getHairHex()} />
                        <path d="M75,55 L82,62 L80,50 Z" fill={getHairHex()} />
                        <path d="M125,55 L118,62 L120,50 Z" fill={getHairHex()} />
                      </g>
                    ) : (
                      <g>
                        {/* Girl bangs */}
                        <path d="M74,62 C74,40 126,40 126,62 C124,50 115,48 108,52 C102,48 94,48 90,52 C84,50 78,54 74,62 Z" fill={getHairHex()} />
                        {/* Hair strands on sides */}
                        <path d="M74,60 C72,68 73,78 75,82" stroke={getHairHex()} strokeWidth="6" strokeLinecap="round" />
                        <path d="M126,60 C128,68 127,78 125,82" stroke={getHairHex()} strokeWidth="6" strokeLinecap="round" />
                      </g>
                    )}
                  </svg>

                  {/* Character Name Label */}
                  <p className="mt-4 text-sm font-black text-slate-100 bg-[#020617] px-5 py-2 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] uppercase tracking-wider font-mono">
                    🏆 {character.name || 'Goleador'}
                  </p>
                </div>

                {/* Form Controls */}
                <div className="space-y-5">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Խաղացողի անունը (հարձակվող)
                    </label>
                    <input
                      id="input-player-name"
                      type="text"
                      maxLength={14}
                      value={character.name}
                      onChange={e => setCharacter({ ...character, name: e.target.value })}
                      placeholder="Օրինակ՝ Goleador"
                      className="w-full px-4 py-3 bg-slate-950 border border-white/10 focus:border-[#fbbf24] focus:ring-1 focus:ring-[#fbbf24] rounded-2xl text-sm text-white font-bold focus:outline-none transition-all placeholder:text-slate-600 shadow-inner"
                    />
                  </div>

                  {/* Gender Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Սեռ / Սանրվածք
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        id="btn-gender-boy"
                        type="button"
                        onClick={() => setCharacter({ ...character, gender: 'boy' })}
                        className={`py-3 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          character.gender === 'boy'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.02]'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:bg-slate-950 hover:text-white'
                        }`}
                      >
                        Boy // Տղա
                      </button>
                      <button
                        id="btn-gender-girl"
                        type="button"
                        onClick={() => setCharacter({ ...character, gender: 'girl' })}
                        className={`py-3 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          character.gender === 'girl'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.02]'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:bg-slate-950 hover:text-white'
                        }`}
                      >
                        Girl // Աղջիկ
                      </button>
                    </div>
                  </div>

                  {/* Jersey Color Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Մարզաշապիկի գույնը (Camiseta)
                    </label>
                    <div className="flex flex-wrap gap-3 p-1">
                      {JERSEY_COLORS.map(color => (
                        <button
                          key={color.id}
                          id={`btn-jersey-${color.id}`}
                          type="button"
                          onClick={() => setCharacter({ ...character, jerseyColor: color.id })}
                          className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${color.bg} ${
                            character.jerseyColor === color.id ? 'border-white scale-120 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                          title={color.name}
                        >
                          {character.jerseyColor === color.id && <Check className="w-5 h-5 text-white drop-shadow stroke-[3px]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skin Tone Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Մաշկի գույնը (Piel)
                    </label>
                    <div className="flex flex-wrap gap-3 p-1">
                      {SKIN_TONES.map(tone => (
                        <button
                          key={tone.id}
                          id={`btn-skin-${tone.id}`}
                          type="button"
                          onClick={() => setCharacter({ ...character, skinTone: tone.id })}
                          className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${tone.bg} ${
                            character.skinTone === tone.id ? 'border-white scale-120 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                          title={tone.name}
                        >
                          {character.skinTone === tone.id && <Check className="w-5 h-5 text-slate-900 drop-shadow stroke-[3px]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hair Color Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Մազերի գույնը (Pelo)
                    </label>
                    <div className="flex flex-wrap gap-3 p-1">
                      {HAIR_COLORS.map(hair => (
                        <button
                          key={hair.id}
                          id={`btn-hair-${hair.id}`}
                          type="button"
                          onClick={() => setCharacter({ ...character, hairColor: hair.id })}
                          className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${hair.bg} ${
                            character.hairColor === hair.id ? 'border-white scale-120 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                          title={hair.name}
                        >
                          {character.hairColor === hair.id && <Check className="w-5 h-5 text-white drop-shadow stroke-[3px]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit and Enter Stadium */}
              <div className="border-t border-white/10 mt-8 pt-5 flex justify-end">
                <button
                  id="btn-enter-stadium"
                  onClick={handleSaveCharacterAndStartMatch}
                  className="w-full sm:w-auto px-8 py-4 bg-[#fbbf24] hover:bg-[#fcd34d] text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl hover:shadow-[#fbbf24]/20 hover:scale-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-600"
                >
                  Դուրս գալ դաշտ <ChevronRight className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. ACTIVE MATCH TOURNAMENT FIELD */}
          {gameState === 'match' && (
            <motion.div
              key="match"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 w-full"
            >
              
              {/* Scoreboard and Match Metadata */}
              <div className="bg-slate-950/90 backdrop-blur-xl rounded-3xl border-2 border-white/10 p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                {/* Scoreboard Glow effect */}
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#fbbf24] via-emerald-400 to-[#fbbf24] transition-all duration-500" style={{ width: `${(attemptsThisStage / currentStageQuestionsCount) * 100}%` }} />
                
                {/* Match stage name */}
                <div className="flex items-center gap-3">
                  <div className="bg-[#fbbf24]/10 text-[#fbbf24] border-2 border-[#fbbf24]/30 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{currentStage.armenianName}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Խաղ {currentStageIdx + 1}/4</span>
                </div>

                {/* Score panel */}
                <div className="flex items-center gap-6 bg-slate-900/90 px-6 py-2.5 rounded-2xl border border-white/5 shadow-2xl relative">
                  <div className="text-center min-w-[70px]">
                    <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest font-bold mb-0.5">{character.name}</p>
                    <p className="text-3xl font-black text-emerald-400 font-display italic">{goalsScoredThisStage}</p>
                  </div>
                  <div className="text-[#fbbf24] font-black text-xl animate-pulse">:</div>
                  <div className="text-center min-w-[70px]">
                    <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest font-bold mb-0.5">Դարպասապահ</p>
                    <p className="text-3xl font-black text-rose-400 font-display italic">{attemptsThisStage - goalsScoredThisStage}</p>
                  </div>
                </div>

                {/* Target required wins status */}
                <div className="text-center sm:text-right text-xs">
                  <span className="text-slate-400 font-mono tracking-wide uppercase text-[10px]">Հաղթելու համար՝ </span>
                  <span className="font-black text-[#fbbf24] uppercase tracking-wider font-mono">
                    խփել {currentStage.requiredWins} գոլ {currentStageQuestionsCount}-ից
                  </span>
                  <div className="flex items-center justify-center sm:justify-end gap-1.5 mt-2">
                    {stageHistory.map((status, idx) => (
                      <div
                        key={idx}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
                          status === 'goal'
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-110 shadow-[0_0_12px_#10b981]'
                            : status === 'save'
                            ? 'bg-rose-500 text-white border-rose-400'
                            : 'bg-slate-900 border-white/5 text-slate-500'
                        }`}
                      >
                        {status === 'goal' ? '⚽' : status === 'save' ? '❌' : idx + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stadium Visual Stage & Penalty SVG Canvas */}
              <div className="bg-gradient-to-b from-sky-950 via-emerald-950 to-emerald-900 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden aspect-[4/3] flex flex-col justify-end">
                
                {/* Stadium flood lights */}
                <div className="absolute top-4 left-6 flex gap-2 opacity-50">
                  <div className="w-8 h-3 bg-white/80 rounded-full blur-[2px]" />
                  <div className="w-8 h-3 bg-white/80 rounded-full blur-[2px]" />
                </div>
                <div className="absolute top-4 right-6 flex gap-2 opacity-50">
                  <div className="w-8 h-3 bg-white/80 rounded-full blur-[2px]" />
                  <div className="w-8 h-3 bg-white/80 rounded-full blur-[2px]" />
                </div>

                {/* Stadium Stands background */}
                <div className="absolute top-0 left-0 w-full h-[30%] bg-slate-950/40 border-b border-emerald-800/30 overflow-hidden">
                  {/* Crowd outlines silhouette */}
                  <svg viewBox="0 0 800 200" className="w-full h-full opacity-10 fill-slate-300">
                    <path d="M 0,200 L 0,160 Q 10,150 20,160 T 40,160 T 60,160 T 80,160 T 100,160 T 120,160 T 140,160 T 160,160 T 180,160 T 200,160 T 220,160 T 240,160 T 260,160 T 280,160 T 300,160 T 320,160 T 340,160 T 360,160 T 380,160 T 400,160 T 420,160 T 440,160 T 460,160 T 480,160 T 500,160 T 520,160 T 540,160 T 560,160 T 580,160 T 600,160 T 620,160 T 640,160 T 660,160 T 680,160 T 700,160 T 720,160 T 740,160 T 760,160 T 780,160 T 800,160 L 800,200 Z" />
                    <path d="M 0,200 L 0,140 Q 15,130 30,140 T 60,140 T 90,140 T 120,140 T 150,140 T 180,140 T 210,140 T 240,140 T 270,140 T 300,140 T 330,140 T 360,140 T 390,140 T 420,140 T 450,140 T 480,140 T 510,140 T 540,140 T 570,140 T 600,140 T 630,140 T 660,140 T 690,140 T 720,140 T 750,140 T 780,140 T 800,140 L 800,200 Z" opacity="0.5" />
                  </svg>
                  {/* Score screen replica in background */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/90 text-[10px] text-emerald-400 font-mono border border-emerald-800/40 px-3 py-1 rounded-full text-center tracking-widest uppercase">
                    🇪🇸 SER vs ESTAR ARENA ⚽
                  </div>
                </div>

                {/* INTERACTIVE STADIUM GOAL AND PLAYERS SVG CANVAS */}
                <div className="w-full h-full relative flex items-center justify-center z-10 p-4">
                  <svg viewBox="-250 -180 500 360" className="w-full h-full select-none">
                    
                    {/* Definitions for gradients/grid */}
                    <defs>
                      {/* Grass Stripe pattern */}
                      <linearGradient id="grassStripes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#047857" />
                        <stop offset="100%" stopColor="#065f46" />
                      </linearGradient>
                      
                      {/* Goal Net pattern */}
                      <pattern id="netPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10,0 L 0,10 M 0,0 L 10,10" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
                      </pattern>

                      {/* Ball texture gradient */}
                      <radialGradient id="ballShadow" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="70%" stopColor="#cbd5e1" />
                        <stop offset="100%" stopColor="#475569" />
                      </radialGradient>
                    </defs>

                    {/* Ground Soccer Pitch */}
                    {/* Background Field Grass */}
                    <rect x="-260" y="-40" width="520" height="250" fill="url(#grassStripes)" />
                    {/* Penatly box markings */}
                    <path d="M -200,210 L -120,-40 H 120 L 200,210" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <circle cx="0" cy="150" r="4" fill="#ffffff" opacity="0.8" /> {/* Penalty Spot */}
                    {/* Outer circle segment */}
                    <path d="M -50,210 A 100,100 0 0,1 50,210" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="6,4" />

                    {/* GOAL POST (El Arco) */}
                    {/* Net backing shadows */}
                    <rect x="-180" y="-120" width="360" height="150" fill="rgba(15,23,42,0.6)" rx="4" />
                    {/* Net mesh */}
                    <rect x="-180" y="-120" width="360" height="150" fill="url(#netPattern)" rx="4" />
                    
                    {/* Goal frame White posts */}
                    {/* Left Post */}
                    <rect x="-184" y="-123" width="8" height="155" fill="#f8fafc" rx="2" />
                    <rect x="-182" y="-123" width="2" height="155" fill="#cbd5e1" />
                    {/* Right Post */}
                    <rect x="176" y="-123" width="8" height="155" fill="#f8fafc" rx="2" />
                    <rect x="176" y="-123" width="2" height="155" fill="#cbd5e1" />
                    {/* Crossbar */}
                    <rect x="-184" y="-125" width="368" height="8" fill="#f8fafc" rx="2" />
                    <rect x="-184" y="-121" width="368" height="2" fill="#cbd5e1" />

                    {/* Target guides if not animating to help the user visualize corners */}
                    {!isAnimatingShootout && !showExplanation && (
                      <g opacity="0.25">
                        {/* Target Zones rings */}
                        <circle cx="-130" cy="-90" r="16" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2" />
                        <circle cx="130" cy="-90" r="16" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2" />
                        <circle cx="-130" cy="15" r="16" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2" />
                        <circle cx="130" cy="15" r="16" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2" />
                      </g>
                    )}

                    {/* --- THE GOALKEEPER (El Portero) --- */}
                    <g 
                      id="goalkeeper" 
                      style={{ 
                        transformBox: 'fill-box', 
                        transformOrigin: 'center bottom',
                        transition: 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                      className={`
                        ${keeperState === 'idle' ? 'translate-y-[10px]' : ''}
                        ${keeperState === 'dive-left-top' ? 'translate-x-[-115px] translate-y-[-70px] rotate-[-40deg]' : ''}
                        ${keeperState === 'dive-right-top' ? 'translate-x-[115px] translate-y-[-70px] rotate-[40deg]' : ''}
                        ${keeperState === 'dive-left-bottom' ? 'translate-x-[-110px] translate-y-[10px] rotate-[-55deg]' : ''}
                        ${keeperState === 'dive-right-bottom' ? 'translate-x-[110px] translate-y-[10px] rotate-[55deg]' : ''}
                        ${keeperState === 'celebrate' ? 'translate-y-[-15px] scale-y-110' : ''}
                        ${keeperState === 'sad' ? 'translate-y-[20px] rotate-[5deg]' : ''}
                      `}
                    >
                      {/* Goalkeeper Shadow */}
                      <ellipse cx="0" cy="25" rx="20" ry="5" fill="rgba(0,0,0,0.3)" />

                      {/* Goalkeeper body */}
                      {/* Legs */}
                      <rect x="-10" y="2" width="6" height="24" fill="#fb923c" rx="2" /> {/* left leg */}
                      <rect x="4" y="2" width="6" height="24" fill="#fb923c" rx="2" /> {/* right leg */}
                      <rect x="-10" y="16" width="6" height="8" fill="#1e293b" /> {/* socks */}
                      <rect x="4" y="16" width="6" height="8" fill="#1e293b" />
                      <rect x="-12" y="22" width="9" height="5" fill="#f43f5e" rx="1" /> {/* boots */}
                      <rect x="3" y="22" width="9" height="5" fill="#f43f5e" rx="1" />

                      {/* Goalie Jersey (Orange/Dark) */}
                      <path d="M-15,-22 h30 L12,4 H-12 Z" fill="#f97316" rx="2" />
                      <rect x="-3" y="-14" width="6" height="18" fill="#1e293b" opacity="0.3" />

                      {/* Arms & Big Gloves */}
                      {/* Left arm */}
                      {keeperState === 'idle' ? (
                        // Arms raised idle
                        <path d="M-14,-15 C-24,-25 -22,-35 -22,-35" stroke="#fb923c" strokeWidth="7" strokeLinecap="round" />
                      ) : (
                        // Diving arms outstretched
                        <path d="M-14,-15 C-28,-18 -32,-25 -32,-25" stroke="#fb923c" strokeWidth="7" strokeLinecap="round" />
                      )}
                      {/* Left glove */}
                      <circle cx={keeperState === 'idle' ? -22 : -32} cy={keeperState === 'idle' ? -36 : -26} r="8" fill="#facc15" stroke="#1e293b" strokeWidth="1" />
                      <circle cx={keeperState === 'idle' ? -22 : -32} cy={keeperState === 'idle' ? -36 : -26} r="4" fill="#ffffff" opacity="0.3" />

                      {/* Right arm */}
                      {keeperState === 'idle' ? (
                        <path d="M14,-15 C24,-25 22,-35 22,-35" stroke="#fb923c" strokeWidth="7" strokeLinecap="round" />
                      ) : (
                        <path d="M14,-15 C28,-18 32,-25 32,-25" stroke="#fb923c" strokeWidth="7" strokeLinecap="round" />
                      )}
                      {/* Right glove */}
                      <circle cx={keeperState === 'idle' ? 22 : 32} cy={keeperState === 'idle' ? -36 : -26} r="8" fill="#facc15" stroke="#1e293b" strokeWidth="1" />
                      <circle cx={keeperState === 'idle' ? 22 : 32} cy={keeperState === 'idle' ? -36 : -26} r="4" fill="#ffffff" opacity="0.3" />

                      {/* Head */}
                      <circle cx="0" cy="-34" r="12" fill="#fb923c" />
                      
                      {/* Goalie hair */}
                      <path d="M-13,-40 Q0,-48 13,-40 Q11,-45 0,-44 Q-11,-45 -13,-40" fill="#1e293b" />

                      {/* Goalie Face details */}
                      {keeperState === 'celebrate' ? (
                        // Laughing
                        <g>
                          <path d="M-5,-36 L-2,-34 L-5,-32" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M5,-36 L2,-34 L5,-32" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="0" cy="-29" r="3" fill="#f43f5e" />
                        </g>
                      ) : keeperState === 'sad' ? (
                        // Groggy dizzy eyes after conceding
                        <g>
                          {/* Dizzy spiral eyes */}
                          <path d="M-6,-35 L-2,-31 M-2,-35 L-6,-31" stroke="#0f172a" strokeWidth="1.5" />
                          <path d="M6,-35 L2,-31 M2,-35 L6,-31" stroke="#0f172a" strokeWidth="1.5" />
                          <ellipse cx="0" cy="-28" rx="4" ry="2" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                        </g>
                      ) : (
                        // Concentrating
                        <g>
                          <circle cx="-4" cy="-34" r="2" fill="#0f172a" />
                          <circle cx="4" cy="-34" r="2" fill="#0f172a" />
                          <path d="M-3,-31 Q0,-27 3,-31" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                        </g>
                      )}
                    </g>


                    {/* --- THE STRIKER (El Delantero - Custom Character) --- */}
                    <g
                      id="striker"
                      style={{
                        transformBox: 'fill-box',
                        transformOrigin: 'center bottom',
                        transition: 'transform 0.3s ease-out'
                      }}
                      className={`
                        ${strikerState === 'idle' ? 'translate-x-[-120px] translate-y-[100px]' : ''}
                        ${strikerState === 'run' ? 'translate-x-[-60px] translate-y-[120px] scale-x-105' : ''}
                        ${strikerState === 'kick' ? 'translate-x-[-25px] translate-y-[135px] scale-110' : ''}
                      `}
                    >
                      {/* Shadow */}
                      <ellipse cx="0" cy="20" rx="15" ry="4" fill="rgba(0,0,0,0.3)" />

                      {/* Legs */}
                      {strikerState === 'kick' ? (
                        // Animated kicking leg
                        <g>
                          <path d="M-5,0 L-10,12 L-15,16" stroke={getSkinHex()} strokeWidth="6" strokeLinecap="round" /> {/* left standing leg */}
                          <path d="M5,0 L18,8 L24,2" stroke={getSkinHex()} strokeWidth="7" strokeLinecap="round" className="animate-bounce" /> {/* right kick leg */}
                        </g>
                      ) : strikerState === 'run' ? (
                        // Running legs
                        <g>
                          <path d="M-5,0 L-12,12 L-4,18" stroke={getSkinHex()} strokeWidth="6" strokeLinecap="round" />
                          <path d="M5,0 L10,8 L16,14" stroke={getSkinHex()} strokeWidth="6" strokeLinecap="round" />
                        </g>
                      ) : (
                        // Idle legs
                        <g>
                          <rect x="-7" y="0" width="5" height="18" fill={getSkinHex()} rx="1" />
                          <rect x="2" y="0" width="5" height="18" fill={getSkinHex()} rx="1" />
                        </g>
                      )}

                      {/* Torso/Jersey */}
                      <path d="M-12,-20 h24 L10,1 H-10 Z" fill={getJerseyHex()} rx="1.5" />
                      {/* White collar details */}
                      <polygon points="-4,-20 4,-20 0,-15" fill={getSkinHex()} />

                      {/* Arms */}
                      {strikerState === 'kick' ? (
                        <g>
                          <path d="M-11,-18 C-18,-10 -16,0 -16,0" stroke={getSkinHex()} strokeWidth="5.5" strokeLinecap="round" />
                          <path d="M11,-18 C20,-22 25,-12 25,-12" stroke={getSkinHex()} strokeWidth="5.5" strokeLinecap="round" />
                        </g>
                      ) : (
                        <g>
                          <path d="M-11,-18 C-15,-6 -10,4 -10,4" stroke={getSkinHex()} strokeWidth="5" strokeLinecap="round" />
                          <path d="M11,-18 C15,-6 10,4 10,4" stroke={getSkinHex()} strokeWidth="5" strokeLinecap="round" />
                        </g>
                      )}

                      {/* Head */}
                      <circle cx="0" cy="-30" r="10" fill={getSkinHex()} />

                      {/* Hair & Face */}
                      {character.gender === 'girl' && (
                        <g>
                          {/* Ponytail back */}
                          <circle cx="9" cy="-33" r="7" fill={getHairHex()} />
                        </g>
                      )}
                      
                      {/* Hair cap */}
                      <path d="M-11,-32 C-11,-42 11,-42 11,-32 C10,-37 0,-37 -10,-32" fill={getHairHex()} />

                      {/* Eyes & Smile */}
                      <circle cx="-3" cy="-31" r="1.5" fill="#1e293b" />
                      <circle cx="3" cy="-31" r="1.5" fill="#1e293b" />
                      <path d="M-2.5,-27 Q0,-24 2.5,-27" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                    </g>


                    {/* --- THE SOCCER BALL (El Balón) --- */}
                    <g
                      id="ball"
                      style={{
                        transform: `translate(${ballPosition.x}px, ${ballPosition.y}px) scale(${ballPosition.scale}) rotate(${ballPosition.rotate}deg)`,
                        transition: isAnimatingShootout ? 'transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'transform 0.2s ease-out',
                        transformBox: 'fill-box',
                        transformOrigin: 'center'
                      }}
                    >
                      {/* Ball Shadow when flying */}
                      {isAnimatingShootout && (
                        <ellipse cx="0" cy="20" rx={10 * ballPosition.scale} ry={3 * ballPosition.scale} fill="rgba(0,0,0,0.25)" transform="translate(0, 10)" />
                      )}

                      {/* Classic soccer ball */}
                      <circle cx="0" cy="0" r="14" fill="url(#ballShadow)" stroke="#334155" strokeWidth="1.2" />
                      
                      {/* Hexagon panel designs on ball */}
                      <polygon points="0,-4 4,-1 2,4 -2,4 -4,-1" fill="#1e293b" transform="scale(0.8)" />
                      
                      {/* Surrounding segments lines */}
                      <line x1="0" y1="-4" x2="0" y2="-14" stroke="#1e293b" strokeWidth="1.2" />
                      <line x1="-4" y1="-1" x2="-12" y2="-6" stroke="#1e293b" strokeWidth="1.2" />
                      <line x1="4" y1="-1" x2="12" y2="-6" stroke="#1e293b" strokeWidth="1.2" />
                      <line x1="2" y1="4" x2="8" y2="11" stroke="#1e293b" strokeWidth="1.2" />
                      <line x1="-2" y1="4" x2="-8" y2="11" stroke="#1e293b" strokeWidth="1.2" />
                      
                      {/* Tiny side details */}
                      <polygon points="-12,-11 -8,-14 -12,-14" fill="#1e293b" transform="scale(0.9)" />
                      <polygon points="12,-11 8,-14 12,-14" fill="#1e293b" transform="scale(0.9)" />
                      <polygon points="0,14 -4,11 4,11" fill="#1e293b" transform="scale(0.9)" />
                    </g>

                  </svg>

                  {/* Goal and Save Dynamic text overlay */}
                  <AnimatePresence>
                    {showExplanation && shotResult && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none"
                      >
                        {shotResult.isGoal ? (
                          <div className="bg-emerald-500 text-slate-950 text-3xl sm:text-5xl font-black px-8 py-3 rounded-2xl shadow-2xl border-4 border-white tracking-wider rotate-[-5deg] uppercase animate-bounce">
                            ԳՈ՜Լ! ⚽🎉
                          </div>
                        ) : (
                          <div className="bg-rose-500 text-white text-3xl sm:text-5xl font-black px-8 py-3 rounded-2xl shadow-2xl border-4 border-white tracking-wider rotate-[5deg] uppercase">
                            ՍԵՅՎ! 🧤❌
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Tactical Question Clipboard Board */}
              <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-2xl relative mt-6">
                
                {/* Question Info Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <span className="text-[10px] sm:text-xs text-emerald-400 font-black uppercase tracking-widest font-mono flex items-center gap-2">
                    <Target className="w-4 h-4 animate-pulse" />
                    <span>Հարված {attemptsThisStage + 1} {currentStageQuestionsCount}-ից</span>
                  </span>
                  
                  {/* Category Pill Tag */}
                  <span className="text-[10px] bg-slate-950 text-slate-300 font-bold px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-wider font-mono">
                    {currentQuestion.ruleType === 'origin' && '🇪🇸 Origen // Ծագում'}
                    {currentQuestion.ruleType === 'location' && '📍 Ubicación // Գտնվելու վայր'}
                    {currentQuestion.ruleType === 'occupation' && '💼 Profesión // Մասնագիտություն'}
                    {currentQuestion.ruleType === 'condition' && '🌡️ Estado // Վիճակ'}
                    {currentQuestion.ruleType === 'characteristic' && '🧬 Carácter // Բնութագիր'}
                    {currentQuestion.ruleType === 'date-time' && '⏰ Fecha // Ժամանակ և Ամսաթիվ'}
                    {currentQuestion.ruleType === 'material' && '🪵 Material // Նյութ'}
                    {currentQuestion.ruleType === 'possession' && '🔑 Posesión // Պատկանելություն'}
                    {currentQuestion.ruleType === 'event' && '🎫 Evento // Միջոցառում'}
                  </span>
                </div>

                {/* Spanish Sentence to fill */}
                <div className="text-center py-4 bg-[#020617]/50 rounded-2xl border border-white/5 px-4 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 font-mono text-[9px] text-slate-600 uppercase tracking-widest pointer-events-none">TACTICS BOARD</div>
                  
                  <p className="text-xl sm:text-2xl font-black text-white tracking-wide font-sans leading-relaxed">
                    {/* Split sentence to style the blank space differently */}
                    {currentQuestion.sentence.split('___').map((part, index, arr) => (
                      <React.Fragment key={index}>
                        {part}
                        {index < arr.length - 1 && (
                          <span className="mx-2 px-4 py-1.5 bg-[#020617] text-[#fbbf24] border-2 border-dashed border-[#fbbf24]/50 rounded-xl inline-block min-w-[85px] text-center text-lg sm:text-xl font-mono shadow-[0_0_15px_rgba(251,191,36,0.15)] animate-pulse">
                            {shotResult ? shotResult.userAnswer : '___'}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                  
                  {/* Russian Translation */}
                  <p className="text-xs sm:text-sm text-slate-400 font-medium italic mt-4">
                    &ldquo;{currentQuestion.translation}&rdquo;
                  </p>
                </div>

                {/* Grammar Choice Soccer Buttons */}
                {!showExplanation ? (
                  <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        id={`btn-option-${option}`}
                        disabled={isAnimatingShootout}
                        onClick={() => handleAnswerSubmit(option)}
                        className="p-4 bg-slate-950/80 hover:bg-[#fbbf24] disabled:opacity-50 text-sm sm:text-base font-black rounded-2xl border border-white/10 hover:border-transparent text-white hover:text-slate-950 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-[#fbbf24]/10 flex items-center justify-between group cursor-pointer border-b-4 border-slate-900 hover:border-amber-500"
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-slate-900 text-slate-400 text-xs font-black flex items-center justify-center group-hover:bg-slate-950 group-hover:text-[#fbbf24] transition-colors border border-white/5">
                            {idx === 0 && '↖️'}
                            {idx === 1 && '↗️'}
                            {idx === 2 && '↙️'}
                            {idx === 3 && '↘️'}
                          </span>
                          <span className="font-mono text-base tracking-wide uppercase transition-colors">{option}</span>
                        </span>
                        
                        {/* Football verb hint category indicator */}
                        <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest group-hover:text-amber-800 transition-colors">
                          {['soy', 'es', 'somos', 'son', 'eres', 'sois'].includes(option) ? 'SER' : 'ESTAR'}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  // Explanation & Feedback Mode
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border transition-all bg-slate-950/90 border-white/10 shadow-2xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl mt-0.5 border ${shotResult?.isGoal ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {shotResult?.isGoal ? <Check className="w-5 h-5 stroke-[3px]" /> : <X className="w-5 h-5 stroke-[3px]" />}
                      </div>
                      <div className="space-y-2 flex-1">
                        <h4 className="text-sm sm:text-base font-black text-slate-100 uppercase tracking-tight">
                          {shotResult?.isGoal ? (
                            <span>Գերազանց հարված: Դու ճիշտ պատասխանեցիր. <span className="text-emerald-400 font-mono font-black">{currentQuestion.correctAnswer}</span></span>
                          ) : (
                            <span>Դարպասապահի սեյվ: Ճիշտ պատասխանն է՝ <span className="text-emerald-400 font-mono font-black">{currentQuestion.correctAnswer}</span> (և ոչ թե {shotResult?.userAnswer})</span>
                          )}
                        </h4>
                        
                        {/* Interactive formatted explanation */}
                        <p 
                          className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans"
                          dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
                      <button
                        id="btn-next-kick"
                        onClick={handleNextQuestion}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105"
                      >
                        <span>{currentQuestionIdxInStage + 1 < currentStageQuestionsCount ? 'Հաջորդ հարվածը ⚽' : 'Ավարտել խաղը 🏁'}</span>
                        <ArrowRight className="w-4 h-4 stroke-[3px]" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* 4. STAGE MATCH COMPLETED OUTCOME */}
          {gameState === 'stage-result' && (
            <motion.div
              key="stage-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8 px-6 max-w-xl mx-auto bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_25px_50px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
              {goalsScoredThisStage >= currentStage.requiredWins ? (
                // MATCH WON STAGE
                <div>
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
                  
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-950/80 text-emerald-400 rounded-full mb-6 border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.25)] relative animate-bounce">
                    <Trophy className="w-12 h-12 text-[#fbbf24] drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight text-white mb-2 font-display uppercase">
                    ԽԱՂԸ ՀԱՂԹՎԱԾ Է՛: 🎉🏆
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-emerald-400 font-black mb-6 uppercase tracking-widest font-mono">
                    Դուք անցնում եք {currentStageIdx + 1 === TOURNAMENT_STAGES.length ? 'գավաթի եզրափակիչ!' : 'մրցաշարի հաջորդ փուլ!'}
                  </p>

                  <div className="bg-slate-950 border border-white/10 p-6 rounded-2xl max-w-md mx-auto space-y-4 mb-8 shadow-inner">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-mono">Խաղի պաշտոնական արձանագրությունը</p>
                    <div className="flex justify-around items-center py-3 border-y border-white/5">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Գոլեր {character.name}</p>
                        <p className="text-3xl font-black text-emerald-400 font-display italic">{goalsScoredThisStage}</p>
                      </div>
                      <div className="text-slate-600 font-mono text-sm uppercase font-bold">vs</div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">CPU-ի սեյվերը</p>
                        <p className="text-3xl font-black text-rose-400 font-display italic">{currentStageQuestionsCount - goalsScoredThisStage}</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-300 font-mono flex items-center justify-between px-2">
                      <span>Հարվածների ճշգրտությունը.</span>
                      <span className="font-black text-emerald-400 text-sm">{Math.round((goalsScoredThisStage / currentStageQuestionsCount) * 100)}%</span>
                    </div>
                  </div>

                  <button
                    id="btn-next-stage"
                    onClick={startNextStage}
                    className="w-full sm:w-auto px-10 py-4 bg-[#fbbf24] hover:bg-[#fcd34d] text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl hover:shadow-[#fbbf24]/20 hover:scale-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-600"
                  >
                    <span>{currentStageIdx + 1 === TOURNAMENT_STAGES.length ? 'Բարձրացնել գավաթը՛' : 'Հաջորդ խաղը ➡️'}</span>
                    <ChevronRight className="w-5 h-5 stroke-[3px]" />
                  </button>
                </div>
              ) : (
                // MATCH LOST STAGE
                <div>
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-600" />
                  
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-rose-950/80 text-rose-400 rounded-full mb-6 border-2 border-rose-500/30 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
                    <ShieldAlert className="w-12 h-12" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 uppercase tracking-tight">
                    Խաղը պարտված է... 😢
                  </h2>
                  
                  <p className="text-sm text-slate-300 mb-6 max-w-md mx-auto leading-relaxed">
                    Դուք խփեցիք <span className="text-rose-400 font-black font-mono">{goalsScoredThisStage}</span> գոլ {currentStageQuestionsCount}-ից, իսկ հաջորդ փուլ անցնելու համար անհրաժեշտ էր խփել առնվազն <span className="text-yellow-300 font-black font-mono">{currentStage.requiredWins}</span>:
                  </p>

                  <div className="bg-slate-950 border border-white/10 p-5 rounded-2xl text-left text-xs sm:text-sm text-slate-300 space-y-3 mb-8 max-w-md mx-auto shadow-inner">
                    <p className="font-black text-center text-[#fbbf24] uppercase tracking-widest font-mono text-xs">Մարզչի խորհուրդը 💡</p>
                    <p className="leading-relaxed text-slate-300 text-center font-sans">
                      Մի՛ տխրեք: Կարդացե՛ք կանոնները էկրանի վերևում գտնվող մեր <span className="text-emerald-400 font-bold underline">Հուշաթերթիկում</span>, կրկնե՛ք մշտական <span className="text-emerald-400 font-bold font-mono">Ser</span>-ի և ժամանակավոր <span className="text-[#fbbf24] font-bold font-mono">Estar</span>-ի տարբերությունը և նորից փորձե՛ք:
                    </p>
                  </div>

                  <button
                    id="btn-replay-stage"
                    onClick={replayStage}
                    className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-white/10 hover:scale-105 active:scale-98"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[3px]" />
                    <span>Խաղալ մրցախաղը նորից</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* 5. CHAMPION GOLDEN TROPHY SCREEN */}
          {gameState === 'champion' && (
            <motion.div
              key="champion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-10 px-8 max-w-2xl mx-auto bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.7)] relative overflow-hidden"
            >
              {/* Confetti simulation overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
                <div className="absolute top-10 left-10 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                <div className="absolute top-20 right-20 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <div className="absolute top-1/3 right-10 w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
              </div>

              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-500" />
              
              {/* Big Golden Cup Trophy Vector */}
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/20 shadow-2xl animate-pulse relative">
                  <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-[0_4px_15px_rgba(250,204,21,0.5)]" />
                </div>
                <div className="absolute -bottom-2 -right-3 bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full border-2 border-slate-900 uppercase font-mono tracking-widest shadow-lg">
                  🏆 ՉԵՄՊԻՈՆ // SPAIN
                </div>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black italic tracking-tight text-white mb-3 font-display uppercase">
                ԳԱՎԱԹԸ ՆՎԱՃՎԱԾ Է՛! 🇪🇸⚽
              </h2>

              <p className="text-sm sm:text-base text-[#fbbf24] font-black mb-6 uppercase tracking-widest font-mono">
                ¡Enhorabuena, campeón {character.name}!
              </p>

              <p className="text-xs sm:text-sm text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed font-sans">
                Դուք փայլուն կերպով անցաք ֆուտբոլային գավաթի բոլոր 4 փուլերը, խփեցիք որոշիչ տասնմեկմետրանոցները և ապացուցեցիք իսպաներենի քերականության գերազանց իմացությունը: <span className="text-emerald-400 font-black font-mono">SER</span>-ի և <span className="text-emerald-400 font-black font-mono">ESTAR</span>-ի տարբերությունն այժմ նվաճված է ձեր վարպետությամբ:
              </p>

              {/* Tournament Summary Stats Card */}
              <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 max-w-md mx-auto space-y-4 shadow-inner mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center justify-center gap-1.5">
                  <Award className="w-4 h-4 text-[#fbbf24]" />
                  <span>Մրցաշարի գավաթային տեղեկագիր</span>
                </p>
                <div className="grid grid-cols-2 gap-4 text-center border-t border-white/5 pt-4">
                  <div className="border-r border-white/5">
                    <p className="text-[10px] text-slate-500 font-mono font-bold uppercase mb-1">Խաղացված խաղեր</p>
                    <p className="text-xl font-black text-white font-mono">4 / 4</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono font-bold uppercase mb-1">Ընդհանուր վճիռ</p>
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-widest font-mono">A1 Գավաթը մերն է՛! 🏅</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  id="btn-new-tournament"
                  onClick={restartTournament}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/20 hover:scale-105 active:scale-98 cursor-pointer flex items-center justify-center gap-2 border-b-4 border-emerald-700"
                >
                  <RotateCcw className="w-4 h-4 stroke-[3px]" />
                  <span>Սկսել նոր գավաթ</span>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* --- FLOATING / BOTTOM CHEAT SHEET SIDEBAR MODAL --- */}
      <AnimatePresence>
        {showCheatSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col relative"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="font-black text-white text-base font-display uppercase">Մարզչի հուշաթերթիկ. Ser vs Estar</h3>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Իսպաներենի քերականություն A1 մակարդակի համար</p>
                  </div>
                </div>
                <button
                  id="btn-close-cheatsheet"
                  onClick={() => setShowCheatSheet(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-white/5 cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                
                {/* Introduction */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#020617] p-4 rounded-2xl border border-white/5 font-sans shadow-inner">
                  Իսպաներենում կա «լինել» բայի երկու հիմնական տարբերակ՝ <span className="text-emerald-400 font-black">SER</span> (մշտական հատկանիշներ, առարկայի էություն) և <span className="text-emerald-400 font-black">ESTAR</span> (ժամանակավոր վիճակներ, զգացմունքներ և գտնվելու վայր): Յուրացրե՛ք դրանք հիմնական կանոններով:
                </p>

                {/* Grid comparing Ser vs Estar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* SER SECTION */}
                  <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-black font-mono">SER</span>
                      <h4 className="font-black text-xs uppercase tracking-wider text-white font-mono">Էություն / Մշտականություն</h4>
                    </div>

                    <div className="space-y-4 text-xs text-slate-300">
                      {SER_ESTAR_CHEAT_SHEET.ser.usage.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center gap-2 font-bold text-slate-200 font-sans">
                            <span className="w-5 h-5 bg-emerald-950 text-emerald-400 rounded-lg text-[9px] flex items-center justify-center font-mono font-bold border border-emerald-500/10">{item.tag}</span>
                            <span>{item.rule}</span>
                          </div>
                          <p className="text-slate-400 pl-7 italic font-mono text-[11px]">{item.example}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ESTAR SECTION */}
                  <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                      <span className="text-[10px] bg-yellow-400/10 text-[#fbbf24] px-2.5 py-1 rounded-full font-black font-mono">ESTAR</span>
                      <h4 className="font-black text-xs uppercase tracking-wider text-white font-mono">Վիճակ / Գտնվելու վայր</h4>
                    </div>

                    <div className="space-y-4 text-xs text-slate-300">
                      {SER_ESTAR_CHEAT_SHEET.estar.usage.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center gap-2 font-bold text-slate-200 font-sans">
                            <span className="w-5 h-5 bg-yellow-950 text-yellow-400 rounded-lg text-[9px] flex items-center justify-center font-mono font-bold border border-yellow-500/10">{item.tag}</span>
                            <span>{item.rule}</span>
                          </div>
                          <p className="text-slate-400 pl-7 italic font-mono text-[11px]">{item.example}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Golden Rule Exception Box */}
                <div className="p-5 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 text-xs sm:text-sm text-slate-300 shadow-inner">
                  <h4 className="font-black text-[#fbbf24] flex items-center gap-1.5 mb-2 font-mono uppercase text-xs">
                    ⚠️ Ուշադրություն: Բացառություն A1-ի համար.
                  </h4>
                  <p className="leading-relaxed font-sans text-slate-300">
                    Վայրը նշելու համար միշտ օգտագործվում է <strong>Estar</strong> բայը (օրինակ՝ <em>«El gato está en el jardín»</em>), <strong>ԲԱՅՑ</strong> եթե խոսում ենք որևէ <strong>միջոցառման</strong> կամ իրադարձության անցկացման վայրի մասին (համերգ, հարսանիք, խաղ, երեկույթ), ապա ՄԻՇՏ օգտագործվում է <strong>Ser</strong> բայը (օրինակ՝ <em>«El concierto es en el estadio»</em> — Համերգը կայանում է մարզադաշտում):
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-white/10 flex justify-end bg-slate-950/60">
                <button
                  id="btn-close-cheatsheet-bottom"
                  onClick={() => setShowCheatSheet(false)}
                  className="px-6 py-3 bg-[#fbbf24] hover:bg-[#fcd34d] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Հասկանալի է, դեպի դաշտ՛
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER COPYRIGHT & REFS --- */}
      <footer className="relative z-10 px-4 py-4 border-t border-white/5 text-center text-[10px] text-slate-500 bg-slate-950/40">
        <p className="font-mono tracking-wide uppercase">© {new Date().getFullYear()} COPA DE SER Y ESTAR. Ստեղծված է հատուկ իսպաներենի A1 քերականությունն ուսումնասիրելու համար:</p>
      </footer>

    </div>
  );
}
