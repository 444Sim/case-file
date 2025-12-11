import React, { useState, useEffect, useRef } from 'react';
import { 
  LucideFolderSearch, LucideX, LucideSiren, LucideClock, LucideActivity, LucideSend, 
  LucideZap, LucideHelpCircle, LucideFileText, LucideUser, LucideSettings, LucideFingerprint, 
  LucideLoader2, LucideEdit3, LucideAlertTriangle, LucideEye, LucideEyeOff, LucideLightbulb, 
  LucideArrowLeft, LucideImage, LucideBan, LucideStar, LucideTrophy, LucideArchive, 
  LucideBookOpen, LucideMedal, LucideVenetianMask, LucideGavel, LucideSearch, LucideUsers, 
  LucideBriefcase, LucideVolume2, LucideVolumeX, LucideMapPin, LucideDices, LucideTrash2, LucideRotateCcw,
  LucideCheckCircle2, LucideHistory
} from "lucide-react";

// --- 스타일 및 애니메이션 ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

  body { font-family: 'Noto Serif KR', serif; background-color: #050505; color: #e5e5e5; overflow: hidden; }
  
  /* Glitch Effect for Title */
  .glitch {
    position: relative;
    color: white;
    font-size: 3rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-shadow: 2px 2px 0px #00ffff, -2px -2px 0px #ff0000;
  }
  
  .briefing-box {
    background: #111;
    border: 1px solid #333;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  }

  /* Animations */
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
  @keyframes redFlash { 0% { background-color: rgba(153, 27, 27, 0); } 50% { background-color: rgba(153, 27, 27, 0.3); } 100% { background-color: rgba(153, 27, 27, 0); } }
  
  @keyframes rain-drop {
    0% { transform: translateY(-100vh); opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }

  .animate-shake { animation: shake 0.5s; }
  .animate-red-flash { animation: redFlash 0.5s ease-out; }
  .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
  
  .scanline { 
    position: absolute; top: 0; left: 0; right: 0; height: 10px; 
    background: rgba(255, 255, 255, 0.02); 
    animation: scanline 8s linear infinite; pointer-events: none; z-index: 40; 
  }
  
  .rain-container {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;
    overflow: hidden;
  }
  
  .rain-drop {
    position: absolute;
    width: 1px;
    height: 80px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(150, 150, 150, 0.3));
    animation: rain-drop 0.6s linear infinite;
  }

  .crt-effect {
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
    background-size: 100% 3px, 3px 100%;
    pointer-events: none;
  }

  .clue-highlight { color: #fca5a5; font-weight: bold; border-bottom: 1px dashed #ef4444; cursor: help; }
  
  .typing-dot { animation: typing 1.4s infinite ease-in-out both; }
  .typing-dot:nth-child(1) { animation-delay: -0.32s; } 
  .typing-dot:nth-child(2) { animation-delay: -0.16s; }
  
  .font-typewriter { font-family: 'Special Elite', monospace; }

  ::-webkit-scrollbar { width: 6px; } 
  ::-webkit-scrollbar-track { background: #0a0a0a; } 
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; } 
  ::-webkit-scrollbar-thumb:hover { background: #555; }
  
  /* Setup Section Headers */
  .setup-header { font-size: 0.75rem; font-weight: bold; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; border-bottom: 1px solid #333; padding-bottom: 0.25rem; }
`;

// --- Helper Functions ---

const getDifficultySettings = (mode) => {
  switch(mode) {
    case 'easy': return { turns: 30, damageMultiplier: 1.5, label: 'EASY', multi: false };
    case 'medium': return { turns: 25, damageMultiplier: 1.0, label: 'NORMAL', multi: false };
    case 'hard': return { turns: 20, damageMultiplier: 0.8, label: 'HARD', multi: true };
    default: return { turns: 25, damageMultiplier: 1.0, label: 'NORMAL', multi: false };
  }
};

const getRankBuffs = (rank) => {
    const buffs = { turnBonus: 0, hintBonus: 0, dmgMult: 1.0, label: '효과 없음' };
    if (!rank) return buffs;

    if (rank.includes('전설') || rank.includes('마인드')) {
        return { turnBonus: 5, hintBonus: 1, dmgMult: 1.1, label: '모든 능력치 상승' };
    } else if (rank.includes('베테랑') || rank.includes('경감')) {
        return { turnBonus: 2, hintBonus: 0, dmgMult: 1.1, label: '데미지 10% 증가' };
    } else if (rank.includes('유능') || rank.includes('경사') || rank.includes('경위')) {
        return { turnBonus: 0, hintBonus: 1, dmgMult: 1.0, label: '시작 힌트 +1' };
    } else if (rank.includes('성실') || rank.includes('순경') || rank.includes('경장')) {
        return { turnBonus: 5, hintBonus: 0, dmgMult: 1.0, label: '제한 시간 +5턴' };
    }
    return buffs;
};

const getStanceInfo = (stance) => {
  switch(stance) {
    case 'aggressive': return { label: '강압', desc: '위협적', color: 'text-red-500 border-red-500' };
    case 'emotional': return { label: '회유', desc: '감정적', color: 'text-blue-400 border-blue-400' };
    case 'logic': return { label: '논증', desc: '이성적', color: 'text-emerald-400 border-emerald-400' };
    default: return { label: '질문', desc: '일반', color: 'text-gray-400 border-gray-400' };
  }
};

const formatTextWithHighlights = (text) => {
    if (!text) return null;
    return text.split(/(\*[^*]+\*)/g).map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*')) return <span key={index} className="clue-highlight">{part.slice(1, -1)}</span>;
        return part;
    });
};

const cleanAndParseJSON = (text) => {
  try {
    let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    return JSON.parse(cleaned);
  } catch (e) { console.error("JSON Parse Error:", e, text); throw new Error("데이터 파싱 실패: AI 응답이 올바르지 않습니다."); }
};

export default function App() {
  const [screen, setScreen] = useState('api'); 
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Config
  const [difficulty, setDifficulty] = useState('medium'); 
  const [userInputInfo, setUserInputInfo] = useState({
    name: '', gender: '남성', age: '', job: '', 
    appearance: '', features: '', speechStyle: '', relationship: '', userTitle: '', trait: '', caseHints: '', ngActions: '' 
  });

  // Scenario
  const [scenario, setScenario] = useState({
    background: '',
    publicBriefing: '', hiddenTruth: '', truthDetails: { weapon: '', motive: '', trick: '' },
    hints: [], hintExplanations: []
  });
  const [characters, setCharacters] = useState([]); 
  const [activeCharIndex, setActiveCharIndex] = useState(0);

  // Play State
  const [chatHistories, setChatHistories] = useState({}); 
  const [composure, setComposure] = useState({}); 
  const [timeLeft, setTimeLeft] = useState(20); 
  const [hintsLeft, setHintsLeft] = useState(3);
  const [gameResult, setGameResult] = useState(null); 
  const [currentStance, setCurrentStance] = useState('normal'); 
  const [userInput, setUserInput] = useState('');
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null); 
  const [shakeScreen, setShakeScreen] = useState(false);
  const [redFlash, setRedFlash] = useState(false); 
  const [collectedEvidence, setCollectedEvidence] = useState([]); 
  
  // Audio State
  const [isMuted, setIsMuted] = useState(false);
  const audioCtx = useRef(null);
  const bgmSource = useRef(null);

  // Deduction
  const [deduction, setDeduction] = useState({ culprit: '', weapon: '', motive: '', trick: '' });

  // Persistence (Archive & Stats)
  const [archive, setArchive] = useState([]);
  const [playerStats, setPlayerStats] = useState({ totalCases: 0, totalScore: 0, rank: '신입 형사' });
  const [selectedCase, setSelectedCase] = useState(null);

  // References
  const apiHistory = useRef({});
  const messagesEndRef = useRef(null);
  const rainDrops = useRef([...Array(40)].map(() => ({ left: Math.random() * 100, delay: Math.random() * 2, duration: 0.4 + Math.random() * 0.4 })));

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistories, isTyping, activeCharIndex]);
  
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    
    try {
      const savedArchive = localStorage.getItem('noir_detective_archive');
      if (savedArchive) {
        const parsed = JSON.parse(savedArchive);
        if (Array.isArray(parsed)) {
          setArchive(parsed);
          calculatePlayerStats(parsed);
        }
      }
    } catch(e) { console.warn("Archive load failed", e); }
    return () => document.head.removeChild(styleSheet);
  }, []);

  const calculatePlayerStats = (data) => {
    const totalCases = data.length;
    const totalScore = data.reduce((acc, cur) => {
        const scoreVal = typeof cur.score === 'number' ? cur.score : (cur.score?.total || 0);
        return acc + scoreVal;
    }, 0);

    let rank = '신입 형사';
    if (totalScore > 1000) rank = '전설의 수사관'; 
    else if (totalScore > 500) rank = '베테랑 경감'; 
    else if (totalScore > 200) rank = '유능한 경사'; 
    else if (totalScore > 50) rank = '성실한 순경'; 
    
    setPlayerStats({ totalCases, totalScore, rank });
  };

  const getCleanedApiKey = () => apiKey ? apiKey.replace(/\s/g, '') : '';

  const fetchWithRetry = async (url, options, retries = 2, backoff = 1000) => {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) throw new Error("API 요청 한도 초과 (Quota Exceeded)");
      if (response.status >= 500) throw new Error(`Server Error (${response.status})`);
      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      throw error;
    }
  };

  const saveToArchive = (resultData, usedHintCount) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      suspect: userInputInfo.name,
      job: userInputInfo.job,
      characterSettings: userInputInfo,
      role: resultData.role || scenario.role || "미확인", 
      score: resultData.score, 
      summary: resultData.summary,
      truth: scenario.truthDetails,
      chatHistory: chatHistories[0] || [], 
      clues: collectedEvidence, 
      usedHintCount 
    };
    const updatedArchive = [newEntry, ...archive];
    setArchive(updatedArchive);
    localStorage.setItem('noir_detective_archive', JSON.stringify(updatedArchive));
    calculatePlayerStats(updatedArchive);
  };
  
  const deleteArchiveCase = (id) => {
      if (!confirm("이 사건 기록을 영구적으로 삭제하시겠습니까?")) return;
      const updatedArchive = archive.filter(item => item.id !== id);
      setArchive(updatedArchive);
      localStorage.setItem('noir_detective_archive', JSON.stringify(updatedArchive));
      calculatePlayerStats(updatedArchive);
      if (selectedCase && selectedCase.id === id) setSelectedCase(null);
      playSound('trash'); 
  };

  const loadCharacterFromArchive = (archivedItem) => {
      if (!archivedItem.characterSettings) {
          alert("이 기록에는 캐릭터 설정 데이터가 없습니다.");
          return;
      }
      if (confirm(`'${archivedItem.suspect}' 캐릭터 설정을 불러와 새로운 수사를 시작하시겠습니까?`)) {
          setUserInputInfo(archivedItem.characterSettings);
          setUserInputInfo(prev => ({...prev, caseHints: ''})); 
          setScreen('setup');
          setSelectedCase(null);
          playSound('click');
      }
  };

  const fillRandomProfile = () => {
    const profiles = [
      { name: '김철수', age: '45', job: '전당포 주인', gender: '남성', trait: '탐욕스러움', features: '금니를 드러내며 웃음', speechStyle: '돈만 주면 뭐든 기억나지.', relationship: '정보원', userTitle: '형사 양반', ngActions: '외상 사절' },
      { name: '이영희', age: '28', job: '재즈 가수', gender: '여성', trait: '매혹적', features: '담배를 피움', speechStyle: '후우... 그 남자는 위험했어요.', relationship: '내연녀', userTitle: '자기', ngActions: '재촉 금지' },
      { name: '박태민', age: '39', job: '외과 의사', gender: '남성', trait: '오만함', features: '안경을 치켜올림', speechStyle: '제 시간은 비쌉니다. 용건만 하시죠.', relationship: '피해자의 주치의', userTitle: '경위님', ngActions: '전문성 의심 금지' },
      { name: '최유리', age: '24', job: '대학생', gender: '여성', trait: '불안함', features: '손톱을 물어뜯음', speechStyle: '저... 저는 정말 아무것도 몰라요...', relationship: '용의자의 딸', userTitle: '아저씨', ngActions: '고함 지르기 금지' },
      { name: '한진우', age: '35', job: '전직 형사', gender: '남성', trait: '냉소적', features: '한쪽 다리를 전다', speechStyle: '그래서, 내 알 바입니까?', relationship: '구면', userTitle: '경감님', ngActions: '폭력 사용 금지' }
    ];
    const pick = profiles[Math.floor(Math.random() * profiles.length)];
    setUserInputInfo(prev => ({ ...prev, ...pick }));
    setErrorMsg('');
    playSound('click');
  };

  // --- Sound Engine (Noir Style) ---
  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
  };

  const playSound = (type) => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtx.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    const now = ctx.currentTime;
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);

    if (type === 'click') {
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i * 0.005);
      const clickSrc = ctx.createBufferSource();
      clickSrc.buffer = buffer;
      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = 'lowpass'; clickFilter.frequency.value = 1200;
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.5, now);
      clickSrc.connect(clickFilter); clickFilter.connect(clickGain); clickGain.connect(ctx.destination);
      clickSrc.start(now);
    } 
    else if (type === 'trash') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(50, now);
        gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        filter.type = 'bandpass'; filter.frequency.value = 800;
        osc.start(now); osc.stop(now + 0.15);
    }
    else if (type === 'heartbeat') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(40, now); osc.frequency.exponentialRampToValueAtTime(10, now+0.1);
      gain.gain.setValueAtTime(0.8, now); gain.gain.exponentialRampToValueAtTime(0.01, now+0.3);
      osc.start(now); osc.stop(now+0.35);
    } 
    else if (type === 'thud') {
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      filter.type = 'lowpass'; filter.frequency.value = 200;
      gain.gain.setValueAtTime(1, now); gain.gain.exponentialRampToValueAtTime(0.01, now+0.2);
      noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      noise.start(now);
    } 
    else if (type === 'typing') {
      const tBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
      const tData = tBuffer.getChannelData(0);
      for (let i = 0; i < tData.length; i++) tData[i] = (Math.random() * 2 - 1);
      const tSrc = ctx.createBufferSource();
      tSrc.buffer = tBuffer;
      filter.type = 'bandpass'; filter.frequency.value = 2000;
      gain.gain.setValueAtTime(0.2, now);
      tSrc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      tSrc.start(now);
    } 
    else if (type === 'alert') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(110, now); 
      gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      osc.start(now); osc.stop(now + 1.5);
    } 
    else if (type === 'success') {
       [220, 277, 330].forEach((freq, i) => {
          const sOsc = ctx.createOscillator();
          const sGain = ctx.createGain();
          sOsc.type = 'sawtooth'; sOsc.frequency.value = freq;
          sGain.gain.setValueAtTime(0.1, now); sGain.gain.exponentialRampToValueAtTime(0.001, now + 3);
          sOsc.connect(ctx.destination); sOsc.connect(sGain); sGain.connect(ctx.destination);
          sOsc.start(now + i*0.05); sOsc.stop(now + 3);
       });
    } 
    else if (type === 'bgm' && !bgmSource.current) {
        const bufferSize = ctx.sampleRate * 4; 
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
        
        const bgmNode = ctx.createBufferSource();
        bgmNode.buffer = buffer;
        bgmNode.loop = true;
        const bgmFilter = ctx.createBiquadFilter();
        bgmFilter.type = 'lowpass'; bgmFilter.frequency.value = 120; 
        const bgmGain = ctx.createGain();
        bgmGain.gain.value = 0.2; 
        bgmNode.connect(bgmFilter); bgmFilter.connect(bgmGain); bgmGain.connect(ctx.destination);
        bgmNode.start();
        bgmSource.current = bgmNode;
    }
  };

  const stopBgm = () => {
      if (bgmSource.current) {
          bgmSource.current.stop();
          bgmSource.current = null;
      }
  };

  const ClickButton = ({ onClick, children, className, disabled }) => (
      <button 
        onClick={(e) => { if(!disabled) playSound('click'); if(onClick) onClick(e); }} 
        className={className} 
        disabled={disabled}
      >
          {children}
      </button>
  );

  useEffect(() => {
      if (screen === 'game' && !isMuted) {
          playSound('bgm');
      } else {
          stopBgm();
      }
      return () => stopBgm();
  }, [screen, isMuted]);

  const playSoundFromAction = (actionText) => {
      if (!actionText) return;
      if (/(치다|때리|던지|쾅|부수)/.test(actionText)) playSound('thud');
      else if (/(떨|불안|동공|식은땀|피하|침묵)/.test(actionText)) playSound('heartbeat');
  };

  // --- API Functions ---

  const generateEvidenceImage = async (promptText) => {
    const key = getCleanedApiKey();
    if (!key) return null;
    try {
      const imagePrompt = `Film noir style, gritty black and white photography, crime scene evidence, ${promptText}. Cinematic lighting, high contrast, mysterious atmosphere. No people.`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instances: [{ prompt: imagePrompt }], parameters: { sampleCount: 1 } })
      });
      if (!response.ok) return null;
      const result = await response.json();
      if (result.predictions?.[0]?.bytesBase64Encoded) return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
      return null;
    } catch (e) { return null; }
  };

  const handleGenerateCase = async () => {
    const cleanedKey = getCleanedApiKey();
    if (!cleanedKey) return setErrorMsg("API 키를 입력해주세요.");
    if (!userInputInfo.name || !userInputInfo.age || !userInputInfo.job) return setErrorMsg("필수 정보(이름, 나이, 직업)를 입력해주세요.");

    setScreen('generating'); setLoading(true); setLoadingText('세계관 및 사건 파일 구성 중...'); setErrorMsg(''); playSound('click');

    try {
      const isHard = getDifficultySettings(difficulty).multi;
      const caseHintText = userInputInfo.caseHints.trim() ? userInputInfo.caseHints : "랜덤 생성: 논리적이고 현실적인 느와르 살인 사건.";
      
      const prompt = `
        당신은 미스터리 게임 작가입니다.
        [메인 캐릭터] ${userInputInfo.name}(${userInputInfo.gender}, ${userInputInfo.age}, ${userInputInfo.job}), 성격:${userInputInfo.trait}, 특징:${userInputInfo.features}, 말투:${userInputInfo.speechStyle}, 관계:${userInputInfo.relationship}
        [유저 호칭] ${userInputInfo.userTitle || '형사님'}
        [금지 행동] ${userInputInfo.ngActions || '없음'}
        [소재] ${caseHintText}
        [난이도] ${difficulty}

        [필수 요청사항 - 관계 및 역할]
        1. **매우 중요:** 나이 차이가 10살 이상이면 '학교 선후배' 설정 금지. 사회적 관계(사장님, 지인 등) 사용.
        2. 메인 캐릭터의 역할을 진범/공범/목격자/방관자 중 하나로 무작위 설정. 인과관계 필수.
        3. ${isHard ? "추가 캐릭터(참고인) 1명 생성." : "추가 캐릭터 없음."}
        4. 사건의 트릭은 현실적/물리적이어야 함.
        5. Hints 배열에 총 6개의 사물 단서를 생성하세요.

        [출력 JSON]
        {
          "background": "국가, 도시",
          "characters": [
            { "name": "${userInputInfo.name}", "role": "...", "secret": "...", "weakness": "...", "tone": "..." },
            ${isHard ? '{ "name": "참고인", "role": "...", "secret": "...", "weakness": "...", "tone": "..." }' : ''}
          ],
          "publicBriefing": "사건 개요 (피해자 나이/직업 포함, 메인 캐릭터와의 관계 명시, 매우 상세하게 3줄 이상)",
          "truthDetails": { "weapon": "...", "motive": "...", "trick": "..." },
          "hints": ["자동1", "자동2", "자동3", "수동1", "수동2", "수동3"],
          "hintExplanations": ["해설1", "해설2", "해설3", "해설4", "해설5", "해설6"]
        }
      `;

      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanedKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        })
      });

      const result = await response.json();
      if (!result.candidates || !result.candidates[0]) throw new Error("API 응답 없음 (Quota Exceeded)");
      const text = result.candidates[0].content.parts[0].text;
      const data = cleanAndParseJSON(text);

      if (!data.hints || data.hints.length < 6) {
          data.hints = ["의문의 열쇠", "찢어진 영수증", "피 묻은 셔츠", "깨진 시계", "수상한 약병", "조작된 장부"];
          data.hintExplanations = data.hints.map(h => `${h}에 대한 설명`);
      }

      setScenario({
        background: data.background || "Unknown City",
        role: data.characters[0].role,
        publicBriefing: data.publicBriefing,
        truthDetails: data.truthDetails,
        hints: data.hints,
        hintExplanations: data.hintExplanations || []
      });
      setCharacters(data.characters);
      
      const initHist = {};
      const initComp = {};
      data.characters.forEach((c, i) => { initHist[i] = []; initComp[i] = 100; });
      setChatHistories(initHist);
      setComposure(initComp);
      apiHistory.current = {}; 

      setCollectedEvidence([]); 
      
      const buffs = getRankBuffs(playerStats.rank);
      setHintsLeft(3 + buffs.hintBonus);
      const settings = getDifficultySettings(difficulty);
      setTimeLeft(settings.turns + buffs.turnBonus);

      setScreen('tutorial'); 
    } catch (e) {
      console.error(e);
      setErrorMsg(`생성 실패: ${e.message}`);
      setScreen('setup');
    } finally { setLoading(false); }
  };

  const initCharSession = async (charIndex) => {
    if (apiHistory.current[charIndex]) return;

    const char = characters[charIndex];
    const userTitle = userInputInfo.userTitle || '형사님';
    const isMain = charIndex === 0;
    const speechStyle = isMain ? userInputInfo.speechStyle : char.tone;

    const systemPrompt = `
      당신은 '${char.name}'(${char.role})입니다. 
      [배경] ${scenario.background}. 형사(${userTitle})에게 심문받습니다.
      [비밀] ${char.secret} [약점] ${char.weakness}
      
      [지침]
      1. **말투: "${speechStyle}"의 뉘앙스를 참고하여 새로운 문장을 만드세요. 예시 대사를 반복하지 마세요.**
      2. 행동 지문(action): 범행 사실 서술 금지. 오직 신체 반응만 묘사.
      3. (중요) 유저가 (괄호) 안에 행동을 지시하면, '나레이터'가 되어 결과를 건조하게 서술하세요.
      
      [출력 JSON] { "action": "...", "response": "...", "damage": 0 }
    `;

    apiHistory.current[charIndex] = [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[System]: 첫 마디를 시작하세요. JSON.` }] }];
    
    try {
      setLoading(true);
      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${getCleanedApiKey()}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            contents: apiHistory.current[charIndex],
            generationConfig: { responseMimeType: "application/json" }
        })
      });
      const result = await response.json();
      const data = cleanAndParseJSON(result.candidates[0].content.parts[0].text);
      
      apiHistory.current[charIndex].push({ role: "model", parts: [{ text: result.candidates[0].content.parts[0].text }] });
      
      setChatHistories(prev => ({
        ...prev,
        [charIndex]: [{ role: 'model', text: data.response, action: data.action }]
      }));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSendMessage = async () => {
    if (loading || isTyping || !userInput.trim() || timeLeft <= 0) return;

    const currentInput = userInput;
    const isAction = /^\(.*\)$/.test(currentInput); 
    const charIndex = activeCharIndex;
    const char = characters[charIndex];
    const settings = getDifficultySettings(difficulty);
    const buffs = getRankBuffs(playerStats.rank); 
    
    const evidencePresented = selectedEvidence;
    setSelectedEvidence(null); 

    setChatHistories(prev => ({
      ...prev,
      [charIndex]: [...prev[charIndex], { 
          role: 'user', 
          text: currentInput, 
          stance: isAction ? '수사' : getStanceInfo(currentStance).label, 
          isAction,
          presentedEvidence: evidencePresented
      }]
    }));
    setUserInput('');
    setLoading(true);

    const nextTurn = timeLeft - 1;

    try {
      let prompt = "";
      if (isAction) {
        prompt = `[SYSTEM]: 플레이어 행동: "${currentInput}". 
        나레이터가 되어 결과를 객관적으로 서술하세요. 진실(${scenario.truthDetails.weapon}, ${scenario.truthDetails.trick}) 기반.
        JSON 출력 시 "response"에 서술 내용, "action"은 비움, "damage"는 0.`;
      } else {
        let evidencePrompt = "";
        if (evidencePresented) {
            evidencePrompt = `\n[SYSTEM]: 플레이어가 증거물 <${evidencePresented.name}>를 제시했습니다. 설명: ${evidencePresented.desc}. 이 증거가 당신의 진술과 모순되거나 비밀을 파헤친다면, 당황하며 평정심에 큰 피해(20~30)를 입으세요.`;
        }

        prompt = `[형사]: "${currentInput}" (태세: ${getStanceInfo(currentStance).label}) ${evidencePrompt}
        현재 평정심: ${composure[charIndex]}. 약점(${char.weakness}) 공략 여부?
        설정된 말투 유지. 중요 단어 *별표*. 줄바꿈(\\n) 사용.`;
      }

      apiHistory.current[charIndex].push({ role: "user", parts: [{ text: prompt }] });

      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${getCleanedApiKey()}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            contents: apiHistory.current[charIndex],
            generationConfig: { responseMimeType: "application/json" }
        })
      });

      const result = await response.json();
      const rawText = result.candidates[0].content.parts[0].text;
      const data = cleanAndParseJSON(rawText);
      
      const rawDamage = data.damage || 0;
      const buffedDamage = Math.floor(rawDamage * settings.damageMultiplier * buffs.dmgMult);
      const damage = isAction ? 0 : buffedDamage;

      apiHistory.current[charIndex].push({ role: "model", parts: [{ text: rawText }] });

      if (damage > 0) {
          setRedFlash(true); setTimeout(() => setRedFlash(false), 500);
          if (damage >= 15) { setShakeScreen(true); setTimeout(() => setShakeScreen(false), 500); }
      }
      
      setComposure(prev => ({ ...prev, [charIndex]: Math.max(0, prev[charIndex] - damage) }));
      setTimeLeft(nextTurn);

      if (data.action) playSoundFromAction(data.action);

      const lines = data.response.split('\n').filter(l => l.trim());
      setIsTyping(true); 
      playSound('click'); 

      for (let i = 0; i < lines.length; i++) {
          await new Promise(r => setTimeout(r, 800 + lines[i].length * 20)); 
          setChatHistories(prev => ({
             ...prev,
             [charIndex]: [...prev[charIndex], { 
                role: 'model', text: lines[i], 
                action: i === 0 ? data.action : null, 
                damage: i === lines.length - 1 ? damage : 0,
                isNarration: isAction 
             }]
          }));
          if (!isAction) playSound('typing');
      }
      setIsTyping(false);

      let hintIndex = -1;
      if (nextTurn === 15 && !collectedEvidence.some(e => e.index === 0)) hintIndex = 0;
      else if (nextTurn === 10 && !collectedEvidence.some(e => e.index === 1)) hintIndex = 1;
      else if (nextTurn === 5 && !collectedEvidence.some(e => e.index === 2)) hintIndex = 2;

      if (hintIndex !== -1) {
        const hintText = scenario.hints[hintIndex];
        triggerEvidenceEvent(hintIndex, hintText, "현장 자동 전송");
      }

      if (nextTurn <= 0) setTimeout(() => setScreen('endingForm'), 2000); 

    } catch (e) {
        console.error(e);
        setIsTyping(false);
    } finally { setLoading(false); }
  };

  const handleRequestHint = async () => {
      if (hintsLeft <= 0) return;
      const hintIndex = 3 + (3 - hintsLeft);
      if (hintIndex >= scenario.hints.length) return; 

      const hintText = scenario.hints[hintIndex];
      if (!hintText || collectedEvidence.some(e => e.index === hintIndex)) return; 

      setHintsLeft(prev => prev - 1);
      triggerEvidenceEvent(hintIndex, hintText, "추가 수사 요청");
      playSound('click');
  };

  const triggerEvidenceEvent = (index, text, source) => {
      playSound('alert');
      const sysMsg = { role: 'system', text: `[${source}] 증거물 도착: "${text}"`, isHint: true };
      setChatHistories(prev => ({ ...prev, [activeCharIndex]: [...prev[activeCharIndex], sysMsg] }));

      const loadingMsgId = Date.now();
      setChatHistories(prev => ({ ...prev, [activeCharIndex]: [...prev[activeCharIndex], { role: 'system', text: '사진 현상 중...', isImageLoading: true, id: loadingMsgId }] }));
      
      generateEvidenceImage(text).then(url => {
          setChatHistories(prev => {
              const currentHistory = prev[activeCharIndex].filter(m => m.id !== loadingMsgId);
              return {
                  ...prev,
                  [activeCharIndex]: [...currentHistory, { role: 'system', imageUrl: url, text: text, isHint: true }]
              };
          });
          if (url) setCollectedEvidence(prev => [...prev, { index, name: text, url, desc: scenario.hintExplanations[index] }]);
      });
  };

  const submitDeduction = async () => {
      if (!deduction.culprit || !deduction.weapon || !deduction.motive || !deduction.trick) {
          alert("모든 항목(진범, 살해 도구, 동기, 트릭)을 입력해야 보고서를 제출할 수 있습니다.");
          return;
      }

      setLoading(true); playSound('typing');
      try {
          const prompt = `
            [사건 진상] 범인:${characters.find(c => c.role === '진범' || c.role === '공범')?.name || "알 수 없음"}, 흉기:${scenario.truthDetails.weapon}, 동기:${scenario.truthDetails.motive}, 트릭:${scenario.truthDetails.trick}
            [유저 답안] 범인:${deduction.culprit}, 흉기:${deduction.weapon}, 동기:${deduction.motive}, 트릭:${deduction.trick}
            [요청] 정확도 100점 만점 채점, 피드백 작성, 최종 등급(S/A/B/C/F).
            [출력 JSON] { "score": 85, "rank": "A", "feedback": "..." }
          `;
          
          const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${getCleanedApiKey()}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
          });
          
          const result = await response.json();
          const data = cleanAndParseJSON(result.candidates[0].content.parts[0].text);
          
          const manualHintsUsed = 3 - hintsLeft;
          const finalScoreVal = Math.max(0, data.score - (manualHintsUsed * 5)); 
          
          const finalResult = {
              score: { total: finalScoreVal, badge: data.rank },
              summary: "수사 종결.",
              feedback: data.feedback,
              lastWord: "...",
          };
          
          setGameResult(finalResult);
          saveToArchive(finalResult, manualHintsUsed);
          setScreen('endingResult');
          playSound('success');

      } catch (e) { alert("오류 발생"); } finally { setLoading(false); }
  };

  // --- Screens ---

  // Simple Rain Component using Array
  const RainOverlay = () => (
    <div className="rain-container">
      {rainDrops.current.map((drop, i) => (
        <div key={i} className="rain-drop" style={{ left: `${drop.left}%`, animationDuration: `${drop.duration}s`, animationDelay: `${drop.delay}s` }} />
      ))}
    </div>
  );

  if (screen === 'api') return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center font-mono p-6">
      <RainOverlay />
      <div className="w-full max-w-md animate-fadeIn z-10 relative">
        <h1 className="glitch mb-4" data-text="NOIR DETECTIVE">CASE FILE</h1>
        <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest pl-1">Director's Cut v16.0 (UI Remastered)</p>
        {playerStats.totalCases > 0 && (
           <div className="bg-neutral-900/80 border border-gray-700 p-4 mb-6 rounded flex items-center justify-between">
              <div><div className="text-[10px] text-gray-500">YOUR RANK</div><div className="text-lg font-bold text-yellow-500">{playerStats.rank}</div></div>
              <div className="text-right"><div className="text-[10px] text-gray-500">SOLVED CASES</div><div className="text-white font-bold">{playerStats.totalCases}</div></div>
           </div>
        )}
        <div className="bg-neutral-900 p-6 rounded border border-neutral-800 space-y-6 shadow-2xl">
          <div><label className="block text-xs font-bold text-gray-500 mb-2">ACCESS KEY</label><div className="relative"><input type={showApiKey ? "text" : "password"} className="w-full bg-black border border-gray-700 p-3 pr-10 text-white focus:border-red-500 outline-none transition" placeholder="Paste API Key" value={apiKey} onChange={e => { setApiKey(e.target.value); setErrorMsg(''); }} /><ClickButton onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-3 text-gray-500 hover:text-white">{showApiKey ? <LucideEyeOff size={18}/> : <LucideEye size={18}/>}</ClickButton></div></div>
          <ClickButton onClick={() => apiKey.trim() ? setScreen('setup') : setErrorMsg('API 키 필요')} className="w-full bg-white text-black font-bold py-3 hover:bg-gray-200 transition flex items-center justify-center gap-2">SYSTEM LOGIN <LucideSend size={16}/></ClickButton>
          <div className="text-center pt-2">
             <ClickButton onClick={() => setScreen('archive')} className="text-xs text-gray-500 hover:text-white flex items-center justify-center gap-1 mx-auto"><LucideHistory size={12}/> 지난 사건 기록 보기</ClickButton>
          </div>
          {errorMsg && <div className="text-red-400 text-xs text-center">{errorMsg}</div>}
        </div>
      </div>
    </div>
  );

  if (screen === 'setup') {
    const activeBuffs = getRankBuffs(playerStats.rank);
    return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center font-mono p-4">
      <RainOverlay />
      <div className="w-full max-w-2xl animate-fadeIn my-auto z-10 relative">
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
          <div className="flex items-center gap-2"><ClickButton onClick={() => setScreen('api')}><LucideArrowLeft/></ClickButton><h2 className="text-xl text-white font-bold tracking-widest">PROFILE SETUP</h2></div>
          <div className="flex gap-2">
            <ClickButton onClick={fillRandomProfile} className="text-xs flex items-center gap-1 bg-neutral-800 text-gray-300 border border-gray-600 px-3 py-1 rounded hover:bg-neutral-700"><LucideDices size={14}/> 랜덤 입력</ClickButton>
            <ClickButton onClick={() => setScreen('archive')} className="text-xs bg-neutral-800 px-3 py-1 rounded flex gap-1 hover:bg-neutral-700 text-gray-300 border border-gray-600"><LucideArchive size={14}/> 기록실</ClickButton>
          </div>
        </div>
        
        {/* Buff Display */}
        <div className="bg-blue-900/10 border border-blue-900/50 p-2 mb-6 rounded flex items-center gap-3 text-xs">
           <div className="text-blue-400 font-bold px-2 py-1 border border-blue-800 bg-blue-900/20">{playerStats.rank}</div>
           <div className="text-gray-400">적용 효과: <span className="text-white">{activeBuffs.label}</span></div>
        </div>

        {errorMsg && <div className="bg-red-900/50 text-red-200 p-3 text-xs mb-4 rounded border border-red-800">{errorMsg}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
                <div className="setup-header">1. 기본 정보</div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-[10px] text-gray-500 block mb-1">이름</label><input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white focus:border-white transition" placeholder="James / 강동원" value={userInputInfo.name} onChange={e => setUserInputInfo({...userInputInfo, name: e.target.value})} /></div>
                    <div><label className="text-[10px] text-gray-500 block mb-1">나이</label><input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white focus:border-white transition" placeholder="32" value={userInputInfo.age} onChange={e => setUserInputInfo({...userInputInfo, age: e.target.value})} /></div>
                </div>
                <div className="mb-3"><label className="text-[10px] text-gray-500 block mb-1">직업</label><input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white focus:border-white transition" placeholder="CEO, Doctor" value={userInputInfo.job} onChange={e => setUserInputInfo({...userInputInfo, job: e.target.value})} /></div>
                <div><label className="text-[10px] text-gray-500 block mb-1">성별</label><div className="flex gap-2">{['남성', '여성', '무관'].map(g => (<ClickButton key={g} onClick={() => setUserInputInfo({...userInputInfo, gender: g})} className={`flex-1 py-1.5 text-xs border ${userInputInfo.gender === g ? 'bg-gray-700 text-white border-white' : 'border-gray-700 text-gray-500'}`}>{g}</ClickButton>))}</div></div>
            </div>

            <div>
                 <div className="setup-header">2. 사건 설정</div>
                 <div className="mb-2"><label className="text-[10px] text-gray-500 block mb-1">사건 소재 (선택)</label><textarea className="w-full bg-black border border-gray-800 p-2 text-sm text-white h-20 resize-none focus:border-gray-500 transition" placeholder="비워두면 AI가 랜덤 생성합니다." value={userInputInfo.caseHints} onChange={e => setUserInputInfo({...userInputInfo, caseHints: e.target.value})} /></div>
                 <div><label className="text-[10px] text-red-400 font-bold block mb-1">금지 행동 (NG)</label><input className="w-full bg-neutral-900 border border-red-900/30 p-2 text-sm text-white focus:border-red-900 transition" placeholder="예: 비속어 사용 금지" value={userInputInfo.ngActions} onChange={e => setUserInputInfo({...userInputInfo, ngActions: e.target.value})} /></div>
            </div>
          </div>

          <div className="space-y-6">
             <div>
               <div className="setup-header">3. 캐릭터 디테일</div>
               <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-[10px] text-gray-500 block mb-1">성격/외모</label><input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white focus:border-white transition" placeholder="차가운 눈매" value={userInputInfo.trait} onChange={e => setUserInputInfo({...userInputInfo, trait: e.target.value})} /></div>
                    <div><label className="text-[10px] text-gray-500 block mb-1">특징</label><input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white focus:border-white transition" placeholder="다리를 떰" value={userInputInfo.features} onChange={e => setUserInputInfo({...userInputInfo, features: e.target.value})} /></div>
               </div>
               <div className="mb-3"><label className="text-[10px] text-yellow-500 font-bold block mb-1">말투 예시 (필수)</label><textarea className="w-full bg-neutral-900 border border-yellow-900/30 p-2 text-sm text-white focus:border-yellow-600 outline-none h-16 resize-none transition" placeholder="예: '증거 있어? 웃기지 마.' (한국어로 입력)" value={userInputInfo.speechStyle} onChange={e => setUserInputInfo({...userInputInfo, speechStyle: e.target.value})} /></div>
               <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-[10px] text-blue-400 font-bold block mb-1">유저 호칭</label><input className="w-full bg-neutral-900 border border-blue-900/30 p-2 text-sm text-white focus:border-blue-700 transition" placeholder="형사님" value={userInputInfo.userTitle} onChange={e => setUserInputInfo({...userInputInfo, userTitle: e.target.value})} /></div>
                    <div><label className="text-[10px] text-gray-500 block mb-1">관계</label><input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white focus:border-white transition" placeholder="초면" value={userInputInfo.relationship} onChange={e => setUserInputInfo({...userInputInfo, relationship: e.target.value})} /></div>
               </div>
             </div>
             
             <div>
                <div className="setup-header">4. 난이도</div>
                <div className="flex gap-1 h-10">{['easy', 'medium', 'hard'].map(mode => (<ClickButton key={mode} onClick={() => setDifficulty(mode)} className={`flex-1 text-[10px] uppercase border transition ${difficulty === mode ? 'border-white bg-gray-800 text-white font-bold' : 'border-gray-700 text-gray-500'}`}>{mode}</ClickButton>))}</div>
             </div>
          </div>
        </div>
        <div className="mt-8">
           <ClickButton onClick={handleGenerateCase} className="w-full bg-red-900 hover:bg-red-800 border border-red-700 text-white font-bold py-4 transition flex items-center justify-center gap-2 text-lg shadow-lg tracking-widest">CASE GENERATION <LucideZap size={20}/></ClickButton>
        </div>
      </div>
    </div>
  );
  }

  if (screen === 'archive') return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center font-mono p-6">
       {selectedCase ? (
        <div className="w-full max-w-2xl animate-fadeIn">
           <div className="flex justify-between items-center mb-4">
                <ClickButton onClick={() => setSelectedCase(null)} className="text-gray-500 hover:text-white flex items-center gap-2"><LucideArrowLeft size={16}/> 목록으로</ClickButton>
                <ClickButton onClick={() => deleteArchiveCase(selectedCase.id)} className="text-red-500 hover:text-red-400 flex items-center gap-1 text-xs border border-red-900/50 px-2 py-1"><LucideTrash2 size={12}/> 기록 삭제</ClickButton>
           </div>
           <div className="bg-neutral-900 border border-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedCase.suspect} 사건</h2>
                    <span className="text-sm text-gray-500">{selectedCase.date}</span>
                  </div>
                  <ClickButton onClick={() => loadCharacterFromArchive(selectedCase)} className="bg-blue-900/30 border border-blue-800 text-blue-300 text-xs px-3 py-2 hover:bg-blue-900/50 flex gap-2 items-center">
                      <LucideRotateCcw size={14}/> 이 설정으로 재수사
                  </ClickButton>
              </div>
              <div className="space-y-4">
                 <div className="bg-black p-4 border border-red-900/30 rounded text-xs text-gray-300">
                    <p className="text-red-400 font-bold mb-2">진상 (TRUTH)</p>
                    <p>흉기: {selectedCase.truth?.weapon}</p>
                    <p>동기: {selectedCase.truth?.motive}</p>
                    <p>트릭: {selectedCase.truth?.trick}</p>
                 </div>
                 {selectedCase.clues && selectedCase.clues.length > 0 && (
                    <div><h3 className="text-sm font-bold text-gray-500 mb-2">확보된 증거물</h3><div className="flex gap-2 overflow-x-auto pb-2">{selectedCase.clues.map((c, i) => (<div key={i} className="min-w-[100px] w-[100px] bg-black p-1 border border-gray-800"><img src={c.url} className="w-full h-16 object-cover mb-1 grayscale" alt={c.name}/><p className="text-[9px] text-center truncate">{c.name}</p></div>))}</div></div>
                 )}
              </div>
           </div>
        </div>
       ) : (
        <div className="w-full max-w-2xl animate-fadeIn">
          <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">CASE ARCHIVE</h2><ClickButton onClick={() => setScreen('setup')} className="text-xs text-gray-500 border border-gray-700 px-3 py-1 rounded hover:text-white">EXIT</ClickButton></div>
          {archive.length === 0 ? <div className="text-center text-gray-600 py-20">기록 없음</div> : <div className="grid gap-4">{archive.map((item) => (<ClickButton key={item.id} onClick={() => setSelectedCase(item)} className="bg-neutral-900 border border-gray-800 p-4 rounded-lg flex justify-between hover:border-red-500 transition text-left w-full"><div><div className="font-bold text-white">{item.suspect}</div><div className="text-xs text-gray-500">{item.date}</div></div><div className="text-yellow-500 text-sm">{item.score?.badge}</div></ClickButton>))}</div>}
        </div>
       )}
    </div>
  );

  if (screen === 'generating') return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-6 text-center relative z-10"><RainOverlay/><LucideLoader2 size={48} className="animate-spin text-red-600 mb-6"/><h2 className="text-xl font-bold tracking-widest animate-pulse">GENERATING...</h2><p className="text-xs text-gray-500 mt-2">{loadingText}</p></div>;

  if (screen === 'tutorial') {
    const isMulti = getDifficultySettings(difficulty).multi;
    
    // Dynamic Guide Steps
    const guideSteps = [
        { icon: <LucideActivity className="text-red-500"/>, title: "평정심 파괴", desc: "약점을 찔러 방어기제를 무너뜨리세요." },
        ...(isMulti ? [{ icon: <LucideUsers className="text-green-500"/>, title: "다인 심문 (HARD)", desc: "상단의 이름 탭을 눌러 용의자와 참고인을 교차 심문하세요."}] : []),
        { icon: <LucideBriefcase className="text-purple-500"/>, title: "증거 제시", desc: "인벤토리에서 증거를 [선택] 후 대화하면 모순을 지적할 수 있습니다." },
        { icon: <LucideLightbulb className="text-yellow-500"/>, title: "자동/수동 힌트", desc: "시간 경과 시 자동 힌트 지급(무료). 막힐 땐 [힌트 요청] 버튼(감점)." },
        { icon: <LucideGavel className="text-blue-500"/>, title: "최종 추리", desc: "자백을 듣고 [수사 종결]을 눌러 답안을 제출하세요." }
    ];

    return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono p-6">
      <RainOverlay />
      <div className="w-full max-w-lg animate-fadeIn z-10">
        <h2 className="text-2xl font-bold mb-6 text-red-500 tracking-widest flex items-center gap-2 border-b border-red-900 pb-4"><LucideHelpCircle size={24}/> MISSION GUIDE</h2>
        <div className="space-y-4 text-sm text-gray-300">
          {guideSteps.map((guide, idx) => (
            <div key={idx} className="bg-neutral-900 p-4 border border-neutral-800 flex gap-4 rounded">
              {guide.icon}
              <div>
                <h3 className="font-bold text-white">{idx + 1}. {guide.title}</h3>
                <p className="text-xs text-gray-400">{guide.desc}</p>
              </div>
            </div>
          ))}
          <ClickButton onClick={() => { initCharSession(0); setScreen('briefing'); }} className="w-full mt-6 bg-white text-black font-bold py-4 hover:bg-gray-200 tracking-widest text-lg shadow-lg">브리핑 확인</ClickButton>
        </div>
      </div>
    </div>
  );
  }

  if (screen === 'briefing') return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center font-mono p-6">
       <RainOverlay />
       <div className="w-full max-w-2xl animate-fadeIn z-10">
         <h1 className="glitch mb-6" data-text="CASE FILE">CASE FILE</h1>
         <div className="flex items-center gap-2 mb-6 text-xs text-gray-400 border border-gray-700 rounded-full px-4 py-1.5 w-fit bg-black">
            <LucideMapPin size={14}/> {scenario.background}
         </div>
         <div className="briefing-box p-8 space-y-8">
            <div>
                <span className="block text-xs font-bold text-gray-500 mb-3 tracking-widest">INCIDENT</span>
                <p className="text-sm text-gray-200 leading-relaxed font-serif italic border-l-4 border-gray-600 pl-6 py-1">
                    "{scenario.publicBriefing}"
                </p>
            </div>
            <div>
                <span className="block text-xs font-bold text-gray-500 mb-3 tracking-widest">PERSONS OF INTEREST</span>
                <div className="space-y-2">
                    {characters.map((c, i) => (
                        <div key={i} className="text-white text-lg font-bold border-b border-gray-800 pb-2">
                            {c.name} <span className="text-sm font-normal text-gray-500 ml-2">({c.role === '진범' ? '용의자' : '참고인'})</span>
                        </div>
                    ))}
                </div>
            </div>
         </div>
         <ClickButton onClick={() => setScreen('game')} className="w-full mt-8 bg-red-800 hover:bg-red-700 text-white font-bold py-4 text-xl tracking-widest shadow-lg border border-red-900">ENTER INTERROGATION ROOM</ClickButton>
       </div>
    </div>
  );

  if (screen === 'game') {
    const activeComposure = composure[activeCharIndex] || 100;
    const isPanic = activeComposure <= 0;
    return (
      <div className={`fixed inset-0 bg-black text-gray-200 flex flex-col max-w-lg mx-auto border-x border-gray-800 font-sans shadow-2xl overflow-hidden ${shakeScreen ? 'animate-shake' : ''}`}>
        <div className={`absolute inset-0 pointer-events-none z-50 ${redFlash ? 'animate-red-flash' : ''}`}></div>
        <div className="absolute inset-0 pointer-events-none z-50 crt-effect"></div>
        <div className="scanline z-50"></div>
        <RainOverlay />
        
        <div className="bg-black/90 backdrop-blur p-2 border-b border-gray-800 flex flex-col gap-2 sticky top-0 z-20">
          <div className="flex justify-between items-center px-2">
             <div className="flex items-center gap-2 text-xs text-gray-500 font-mono"><LucideClock size={12} /> 남은 턴: {timeLeft}</div>
             <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <ClickButton onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition">
                   {isMuted ? <LucideVolumeX size={14}/> : <LucideVolume2 size={14}/>}
                </ClickButton>
             </div>
             <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500 flex items-center gap-1"><LucideActivity size={10} className={isPanic ? "text-red-500" : "text-green-500"}/> 심박수</div>
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                   <div className={`h-full transition-all duration-500 ease-out ${isPanic ? 'bg-red-600 animate-pulse' : 'bg-green-500'}`} style={{ width: `${Math.max(0, activeComposure)}%` }} />
                </div>
                <span className="text-[10px] text-gray-400 w-6 text-right">{activeComposure}</span>
             </div>
          </div>
          <div className="flex justify-center items-center px-2 mt-2">
             {characters.length > 1 ? (
                <div className="flex gap-1 w-full max-w-xs">
                  {characters.map((char, i) => (
                    <ClickButton key={i} onClick={() => { setActiveCharIndex(i); initCharSession(i); }} className={`flex-1 py-1.5 text-[10px] font-bold transition rounded-sm ${activeCharIndex === i ? 'bg-white text-black' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>{char.name}</ClickButton>
                  ))}
                </div>
             ) : (
                <div className="text-center font-bold text-white py-1 text-sm">{characters[0]?.name}</div>
             )}
          </div>
        </div>

        {/* Inventory Modal with Evidence Selection (Feature #1) */}
        {isInventoryOpen && (
          <div className="absolute inset-0 bg-black/95 z-50 p-6 animate-fadeIn font-mono">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white flex gap-2"><LucideBriefcase/> 증거물 보관함</h2><ClickButton onClick={() => setIsInventoryOpen(false)}><LucideX/></ClickButton></div>
            {collectedEvidence.length === 0 ? <p className="text-gray-600 text-center">수집된 증거가 없습니다.</p> : 
              <div className="grid grid-cols-2 gap-4">
                 {collectedEvidence.map((ev, i) => (
                    <div key={i} className={`bg-neutral-900 border p-2 rounded relative ${selectedEvidence?.name === ev.name ? 'border-yellow-500' : 'border-gray-800'}`}>
                       <img src={ev.url} className="w-full h-24 object-cover mb-2 grayscale hover:grayscale-0 transition" alt={ev.name} />
                       <div className="text-white font-bold text-xs">{ev.name}</div>
                       <div className="text-[10px] text-gray-500 mb-2">{ev.desc}</div>
                       <ClickButton 
                            onClick={() => { setSelectedEvidence(ev); setIsInventoryOpen(false); }} 
                            className={`w-full py-1 text-[10px] font-bold ${selectedEvidence?.name === ev.name ? 'bg-yellow-600 text-black' : 'bg-gray-800 text-gray-300'}`}
                       >
                           {selectedEvidence?.name === ev.name ? <span className="flex items-center justify-center gap-1"><LucideCheckCircle2 size={10}/> 선택됨</span> : '선택'}
                       </ClickButton>
                    </div>
                 ))}
              </div>
            }
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide relative z-10">
          {(chatHistories[activeCharIndex] || []).map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : msg.role === 'system' ? 'items-center' : 'items-start'}`}>
              {msg.role === 'user' && (
                  <div className="max-w-[85%] text-right animate-fadeIn">
                      <div className="flex flex-col items-end gap-1">
                          {msg.presentedEvidence && (
                              <div className="text-[10px] bg-purple-900/50 text-purple-200 px-2 py-0.5 border border-purple-700 rounded flex items-center gap-1">
                                  <LucideBriefcase size={10}/> 증거 제시: {msg.presentedEvidence.name}
                              </div>
                          )}
                          <span className={`inline-block text-[10px] px-1 border ${msg.stance === '수사' ? 'text-purple-400 border-purple-500' : 'text-gray-500 border-gray-700'}`}>{msg.stance}</span>
                      </div>
                      <div className={`border px-4 py-2 text-sm whitespace-pre-wrap text-left ${msg.isAction ? 'bg-purple-900/20 border-purple-800 text-purple-200' : 'bg-gray-800/50 border-gray-700 text-gray-200'}`}>{msg.text}</div>
                  </div>
              )}
              {msg.role === 'system' && (<div className="w-full text-center my-2 animate-fadeIn flex flex-col items-center gap-2">{msg.isImageLoading ? <div className="text-xs text-yellow-500 animate-pulse flex items-center gap-2"><LucideLoader2 size={12} className="animate-spin"/> 현상 중...</div> : <>{msg.imageUrl && <img src={msg.imageUrl} className="max-w-[200px] border-4 border-white shadow-lg rotate-1 grayscale" alt="Evidence" />}<div className="inline-block bg-red-900/30 border border-red-800 text-red-300 text-xs px-3 py-1 rounded-full"><LucideLightbulb size={12} className="inline mr-1 mb-0.5"/> {msg.text}</div></>}</div>)}
              {msg.role === 'model' && (
                <div className="max-w-[90%] animate-fadeIn">
                  {msg.action && <div className="text-xs text-gray-500 italic mb-1 pl-2 border-l-2 border-gray-800">"{msg.action}"</div>}
                  <div className={`bg-black text-gray-300 border px-4 py-2 text-sm shadow-lg whitespace-pre-wrap leading-relaxed ${msg.isNarration ? 'border-purple-500 text-purple-300' : 'border-gray-800'}`}>{formatTextWithHighlights(msg.text)}</div>
                  {msg.damage > 0 && <div className="mt-1 text-xs text-red-500 font-bold flex items-center gap-1"><LucideZap size={10}/> 평정심 -{msg.damage} {msg.isCritical && "(CRITICAL!)"}</div>}
                </div>
              )}
            </div>
          ))}
          {isTyping && (<div className="flex flex-col items-start max-w-[90%]"><div className="bg-gray-900/50 border border-gray-800 px-3 py-2 rounded-full flex gap-1"><div className="w-1.5 h-1.5 bg-gray-500 rounded-full typing-dot"></div><div className="w-1.5 h-1.5 bg-gray-500 rounded-full typing-dot"></div><div className="w-1.5 h-1.5 bg-gray-500 rounded-full typing-dot"></div></div></div>)}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-black p-3 border-t border-gray-800 z-20">
          <div className="flex justify-between mb-2 items-center">
             <ClickButton onClick={handleRequestHint} disabled={loading || hintsLeft <= 0} className={`text-xs px-3 py-1 rounded flex items-center gap-1 border transition ${hintsLeft > 0 ? 'bg-yellow-900/30 text-yellow-500 border-yellow-800 hover:bg-yellow-900/50' : 'bg-gray-900 text-gray-600 border-gray-800'}`}><LucideLightbulb size={12}/> 힌트 ({hintsLeft})</ClickButton>
             <div className="flex gap-2">
               <ClickButton onClick={() => setScreen('endingForm')} className="text-xs bg-red-900/50 text-red-300 border border-red-800 px-3 py-1 hover:bg-red-800 transition">수사 종결</ClickButton>
               <ClickButton onClick={() => setIsInventoryOpen(true)} className="text-gray-500 hover:text-white"><LucideBriefcase size={20}/></ClickButton>
             </div>
          </div>
          
          {/* Selected Evidence Indicator */}
          {selectedEvidence && (
              <div className="flex justify-between items-center bg-yellow-900/20 border border-yellow-700/50 px-3 py-1 mb-2 rounded text-xs">
                  <span className="text-yellow-500 font-bold flex items-center gap-2"><LucideBriefcase size={12}/> 제시할 증거: {selectedEvidence.name}</span>
                  <ClickButton onClick={() => setSelectedEvidence(null)} className="text-gray-500 hover:text-white"><LucideX size={12}/></ClickButton>
              </div>
          )}

          <div className="grid grid-cols-4 gap-1 mb-2">{['normal', 'aggressive', 'emotional', 'logic'].map((st) => { const info = getStanceInfo(st); return <ClickButton key={st} onClick={() => setCurrentStance(st)} disabled={loading || isTyping} className={`py-2 text-[10px] font-bold border transition uppercase ${currentStance === st ? `${info.color} bg-gray-900` : 'border-gray-800 text-gray-600'} disabled:opacity-50`}>{info.label}</ClickButton> })}</div>
          <div className="flex gap-2"><input type="text" className="flex-1 bg-gray-900 text-gray-300 border border-gray-800 px-4 py-3 text-sm focus:border-gray-600 outline-none font-mono disabled:opacity-50" placeholder="(행동) 혹은 대화..." value={userInput} onChange={e=>setUserInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&!loading&&!isTyping&&handleSendMessage()} disabled={loading || isTyping}/><ClickButton onClick={handleSendMessage} disabled={loading || isTyping} className="bg-gray-800 hover:bg-white hover:text-black text-gray-400 px-4 border border-gray-700 transition disabled:opacity-50"><LucideSend size={18}/></ClickButton></div>
        </div>
      </div>
    );
  }

  if (screen === 'endingForm') return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center font-mono p-6">
       <div className="w-full max-w-lg animate-fadeIn bg-neutral-900 p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><LucideGavel className="text-red-500"/> FINAL REPORT</h2>
          <div className="space-y-4">
             <div><label className="text-xs text-gray-500">진범 지목</label><select className="w-full bg-black border border-gray-700 p-2 text-white" value={deduction.culprit} onChange={e=>setDeduction({...deduction, culprit: e.target.value})}><option value="">선택하세요</option>{characters.map((c,i)=><option key={i} value={c.name}>{c.name}</option>)}<option value="제3의 인물">제3의 인물</option></select></div>
             <div><label className="text-xs text-gray-500">살해 도구</label><input className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="예: 독약" value={deduction.weapon} onChange={e=>setDeduction({...deduction, weapon: e.target.value})}/></div>
             <div><label className="text-xs text-gray-500">범행 동기</label><input className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="예: 빚 때문에" value={deduction.motive} onChange={e=>setDeduction({...deduction, motive: e.target.value})}/></div>
             <div><label className="text-xs text-gray-500">결정적 트릭</label><textarea className="w-full bg-black border border-gray-700 p-2 text-white h-20" placeholder="트릭이나 알리바이 조작 방법" value={deduction.trick} onChange={e=>setDeduction({...deduction, trick: e.target.value})}/></div>
          </div>
          <ClickButton onClick={submitDeduction} disabled={loading} className="w-full mt-6 bg-red-700 hover:bg-red-600 text-white font-bold py-3 transition">{loading ? "채점 중..." : "보고서 제출"}</ClickButton>
       </div>
    </div>
  );

  if (screen === 'endingResult') return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-6 text-center animate-fadeIn">
      <div className="scanline"></div>
      <h2 className="text-6xl font-black mb-4 tracking-tighter text-white">EVALUATION</h2>
      <div className="mb-8"><div className="text-6xl font-bold text-yellow-500 mb-2">{gameResult.score.badge}</div><p className="text-sm text-gray-400">SCORE: {gameResult.score.total}</p></div>
      <div className="border border-gray-800 bg-gray-900/50 p-6 mb-8 w-full max-w-md text-left text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-typewriter">{gameResult.feedback}</div>
      <div className="border border-red-900/30 p-4 mb-8 w-full max-w-md text-left"><h3 className="text-red-500 font-bold mb-2">REAL TRUTH</h3><p className="text-xs text-gray-400">{scenario.hiddenTruth}</p></div>
      <ClickButton onClick={() => { setScreen('setup'); setChatHistories({}); }} className="px-8 py-4 bg-white text-black font-bold hover:bg-gray-300 tracking-widest transition">NEW INVESTIGATION</ClickButton>
    </div>
  );

  return null;
}