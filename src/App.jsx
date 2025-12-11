import React, { useState, useEffect, useRef } from 'react';
import { 
  LucideFolderSearch, LucideX, LucideSiren, LucideClock, LucideActivity, LucideSend, 
  LucideZap, LucideHelpCircle, LucideFileText, LucideUser, LucideSettings, LucideFingerprint, 
  LucideLoader2, LucideEdit3, LucideAlertTriangle, LucideEye, LucideEyeOff, LucideLightbulb, 
  LucideArrowLeft, LucideImage, LucideBan, LucideStar, LucideTrophy, LucideArchive, 
  LucideBookOpen, LucideMedal, LucideVenetianMask, LucideGavel, LucideSearch, LucideUsers, 
  LucideBriefcase, LucideVolume2, LucideVolumeX, LucideMapPin 
} from "lucide-react";

// --- Noir Style CSS ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700&display=swap');

  body { font-family: 'Noto Serif KR', serif; background-color: #050505; color: #e5e5e5; overflow: hidden; }
  
  /* Animations */
  @keyframes heartbeat { 0% { transform: scale(1); opacity: 0.8; } 15% { transform: scale(1.15); opacity: 1; } 30% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1); opacity: 0.8; } }
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
  @keyframes redFlash { 0% { background-color: rgba(220, 38, 38, 0); } 50% { background-color: rgba(220, 38, 38, 0.4); } 100% { background-color: rgba(220, 38, 38, 0); } }
  @keyframes rain { 0% { background-position: 0% 0%; } 100% { background-position: 20% 100%; } }
  @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  
  /* Glitch Text */
  @keyframes glitch-anim-1 {
    0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
    20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
    40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
    60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
    80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
    100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
  }
  
  .glitch-effect { position: relative; }
  .glitch-effect::before, .glitch-effect::after {
    content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000;
  }
  .glitch-effect::before {
    left: 2px; text-shadow: -1px 0 #ff0000; clip-path: inset(0 0 0 0);
    animation: glitch-anim-1 2s infinite linear alternate-reverse;
  }
  .glitch-effect::after {
    left: -2px; text-shadow: -1px 0 #0000ff; clip-path: inset(0 0 0 0);
    animation: glitch-anim-1 3s infinite linear alternate-reverse;
  }

  .animate-red-flash { animation: redFlash 0.5s ease-out; }
  .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
  
  .scanline { position: absolute; top: 0; left: 0; right: 0; height: 10px; background: rgba(255, 255, 255, 0.03); animation: scanline 6s linear infinite; pointer-events: none; z-index: 40; }
  
  .rain-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;
    background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.2;
  }
  .rain-overlay::before {
    content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: repeating-linear-gradient(170deg, transparent, transparent 40px, rgba(180, 180, 180, 0.1) 40px, rgba(180, 180, 180, 0.1) 42px);
    opacity: 0.5; animation: rain 0.6s linear infinite;
  }

  .clue-highlight { color: #fca5a5; font-weight: bold; border-bottom: 1px dashed #ef4444; cursor: help; }
  .typing-dot { animation: typing 1.4s infinite ease-in-out both; }
  .typing-dot:nth-child(1) { animation-delay: -0.32s; } .typing-dot:nth-child(2) { animation-delay: -0.16s; }
  
  ::-webkit-scrollbar { width: 6px; } 
  ::-webkit-scrollbar-track { background: #0a0a0a; } 
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; } 
  ::-webkit-scrollbar-thumb:hover { background: #555; }
`;

// --- 헬퍼 함수 ---

const getDifficultySettings = (mode) => {
  switch(mode) {
    case 'easy': return { turns: 30, damageMultiplier: 1.5, label: '하 (Easy)', multi: false };
    case 'medium': return { turns: 25, damageMultiplier: 1.0, label: '중 (Normal)', multi: false };
    case 'hard': return { turns: 20, damageMultiplier: 0.8, label: '상 (Hard)', multi: true };
    default: return { turns: 25, damageMultiplier: 1.0, label: '중 (Normal)', multi: false };
  }
};

const getStanceInfo = (stance) => {
  switch(stance) {
    case 'aggressive': return { label: '강압', desc: '위협적', color: 'text-red-500 border-red-500' };
    case 'emotional': return { label: '회유', desc: '감정적', color: 'text-blue-400 border-blue-400' };
    case 'logic': return { label: '논증', desc: '이성적', color: 'text-emerald-400 border-emerald-400' };
    default: return { label: '질문', desc: '일반', color: 'text-gray-400 border-gray-400' };
  }
};

const calculateScore = (turnsLeft, startTurns, finalComposure, manualHintsUsed) => {
    const turnScore = (turnsLeft / startTurns) * 60;
    const mentalScore = (100 - finalComposure) * 0.4;
    let total = Math.min(100, Math.floor(turnScore + mentalScore));
    total = Math.max(0, total - (manualHintsUsed * 5)); 

    let stars = 1;
    let badge = "신입";
    if (total >= 95) { stars = 5; badge = "특급 수사관"; }
    else if (total >= 80) { stars = 4; badge = "베테랑 형사"; }
    else if (total >= 60) { stars = 3; badge = "유능한 경위"; }
    else if (total >= 40) { stars = 2; badge = "성실한 경장"; }
    
    return { total, stars, badge };
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
  } catch (e) { console.error("JSON Parse Error:", e); throw new Error("AI 응답 형식 오류"); }
};

export default function App() {
  const [screen, setScreen] = useState('api'); 
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // 게임 설정
  const [difficulty, setDifficulty] = useState('medium'); 
  const [userInputInfo, setUserInputInfo] = useState({
    name: '', gender: '남성', age: '', job: '', 
    appearanceAndFeatures: '', // 외모 및 특징 통합
    trait: '', // 성격 (독립)
    speechStyle: '', relationship: '', userTitle: '', caseHints: '', ngActions: '' 
  });

  // 시나리오
  const [scenario, setScenario] = useState({
    background: '', // 배경 도시
    publicBriefing: '', hiddenTruth: '', truthDetails: { weapon: '', motive: '', trick: '' },
    hints: [], hintExplanations: []
  });
  const [characters, setCharacters] = useState([]); 
  const [activeCharIndex, setActiveCharIndex] = useState(0);

  // 플레이 상태
  const [chatHistories, setChatHistories] = useState({}); 
  const [composure, setComposure] = useState({}); 
  const [timeLeft, setTimeLeft] = useState(20); 
  const [hintsLeft, setHintsLeft] = useState(3);
  const [gameResult, setGameResult] = useState(null); 
  const [currentStance, setCurrentStance] = useState('normal'); 
  const [userInput, setUserInput] = useState('');
  const [isCaseFileOpen, setIsCaseFileOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [redFlash, setRedFlash] = useState(false); 
  const [collectedEvidence, setCollectedEvidence] = useState([]); 
  const [unlockedHints, setUnlockedHints] = useState([]);
  
  // 오디오 상태
  const [isMuted, setIsMuted] = useState(false);
  const audioCtx = useRef(null);
  const bgmSource = useRef(null);

  // 추리 제출
  const [deduction, setDeduction] = useState({ culprit: '', weapon: '', motive: '', trick: '' });

  // 기록 보관소 (Archive)
  const [archive, setArchive] = useState([]);
  const [playerStats, setPlayerStats] = useState({ totalCases: 0, totalScore: 0, rank: '신입 형사' });
  const [selectedCase, setSelectedCase] = useState(null);

  // Refs
  const apiHistory = useRef({});
  const messagesEndRef = useRef(null);

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
      role: scenario.role,
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

  // --- 사운드 엔진 ---
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
    
    const bufferSize = ctx.sampleRate * 2; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    const now = ctx.currentTime;
    filter.type = 'lowpass'; filter.frequency.value = 600; 

    if (type === 'heartbeat') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(50, now); osc.frequency.exponentialRampToValueAtTime(30, now+0.15);
      gain.gain.setValueAtTime(0.6, now); gain.gain.exponentialRampToValueAtTime(0.01, now+0.2);
      osc.start(now); osc.stop(now+0.25);
    } else if (type === 'thud') {
      osc.type = 'square'; filter.frequency.value = 150; osc.frequency.setValueAtTime(60, now);
      gain.gain.setValueAtTime(0.8, now); gain.gain.exponentialRampToValueAtTime(0.01, now+0.3);
      osc.start(now); osc.stop(now+0.35);
    } else if (type === 'bonus') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(440, now); osc.frequency.linearRampToValueAtTime(880, now+0.1);
      gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now+0.5);
      osc.start(now); osc.stop(now+0.5);
    } else if (type === 'typing') {
      osc.type = 'sawtooth'; filter.frequency.value = 800; osc.frequency.setValueAtTime(200, now);
      gain.gain.setValueAtTime(0.02, now); gain.gain.exponentialRampToValueAtTime(0.001, now+0.03);
      osc.start(now); osc.stop(now+0.04);
    } else if (type === 'alert') {
      osc.type = 'sawtooth'; filter.frequency.value = 400; osc.frequency.setValueAtTime(100, now); osc.frequency.linearRampToValueAtTime(80, now + 0.5);
      gain.gain.setValueAtTime(0.2, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.8);
      osc.start(now); osc.stop(now + 0.85);
    } else if (type === 'success') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(220, now); gain.gain.setValueAtTime(0.2, now); gain.gain.linearRampToValueAtTime(0, now+2.5);
      osc.start(now); osc.stop(now+2.5);
    } else if (type === 'bgm' && !bgmSource.current) {
        const bgmNode = ctx.createBufferSource();
        bgmNode.buffer = buffer;
        bgmNode.loop = true;
        const bgmFilter = ctx.createBiquadFilter();
        bgmFilter.type = 'lowpass'; bgmFilter.frequency.value = 300; 
        const bgmGain = ctx.createGain();
        bgmGain.gain.value = 0.05; 
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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instances: [{ prompt: imagePrompt }], parameters: { sampleCount: 1 } })
      });
      if (!response.ok) throw new Error("Image Gen Failed");
      const result = await response.json();
      if (result.predictions?.[0]?.bytesBase64Encoded) return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
      return null;
    } catch (e) { return null; }
  };

  const handleGenerateCase = async () => {
    const cleanedKey = getCleanedApiKey();
    if (!cleanedKey) return setErrorMsg("API 키를 입력해주세요.");
    if (!userInputInfo.name || !userInputInfo.age || !userInputInfo.job) return setErrorMsg("필수 정보(이름, 나이, 직업)를 입력해주세요.");

    setScreen('generating'); setLoading(true); setLoadingText('사건 파일을 열람하는 중...'); setErrorMsg(''); playSound('typing');

    try {
      const isHard = difficulty === 'hard';
      const caseHintText = userInputInfo.caseHints.trim() ? userInputInfo.caseHints : "랜덤 생성: 논리적이고 현실적인 느와르 살인 사건.";
      
      const prompt = `
        당신은 미스터리 게임 작가입니다. 반드시 한국어로 답변하세요.
        
        [메인 캐릭터] ${userInputInfo.name}(${userInputInfo.gender}, ${userInputInfo.age}, ${userInputInfo.job})
        - 외모 및 특징: ${userInputInfo.appearanceAndFeatures}
        - 성격: ${userInputInfo.trait}
        - 말투: ${userInputInfo.speechStyle}
        - 관계: ${userInputInfo.relationship}
        [유저 호칭] ${userInputInfo.userTitle || '형사님'}
        [금지 행동] ${userInputInfo.ngActions || '없음'}
        [소재] ${caseHintText}
        [난이도] ${difficulty}
        
        [요청사항]
        1. **캐릭터 이름(${userInputInfo.name})의 언어적 특성을 분석하여 배경이 되는 국가와 도시를 설정하세요.** (예: James -> 미국 뉴욕, 김철수 -> 한국 서울)
        2. 배경 국가에 맞춰 주변 인물들의 이름도 현지식으로 설정하세요.
        3. **단, 게임의 모든 지문과 대사는 '한국어'로 출력해야 합니다.** (외화 더빙 느낌 가능)
        4. 사건 트릭: 현실적/물리적.
        5. Hints: 오직 '물건 이름'만 (설명X).

        [출력 JSON]
        {
          "background": "국가, 도시 (예: 미국, 시카고)",
          "characters": [
            { "name": "${userInputInfo.name}", "role": "...", "secret": "...", "weakness": "...", "tone": "..." },
            ${isHard ? '{ "name": "참고인(현지인)", "role": "...", "secret": "...", "weakness": "...", "tone": "..." }' : ''}
          ],
          "publicBriefing": "사건 개요 (한국어로)",
          "truthDetails": { "weapon": "...", "motive": "...", "trick": "..." },
          "hints": ["자동1", "자동2", "자동3", "수동1", "수동2", "수동3"],
          "hintExplanations": ["해설1", "해설2", "해설3", "해설4", "해설5", "해설6"]
        }
      `;

      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${cleanedKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const result = await response.json();
      const text = result.candidates[0].content.parts[0].text;
      const data = cleanAndParseJSON(text);

      if (!data.hints || data.hints.length < 6) {
          data.hints = ["의문의 열쇠", "찢어진 영수증", "피 묻은 셔츠", "깨진 시계", "수상한 약병", "조작된 장부"];
          data.hintExplanations = data.hints.map(h => `${h}에 대한 설명`);
      }

      setScenario({
        background: data.background || "대한민국, 서울",
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
      setHintsLeft(3);
      setScreen('tutorial'); 
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message.includes('400') ? "API 키 오류 (400)" : "생성 실패. 다시 시도해주세요.");
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
      1. **말투: "${speechStyle}"의 뉘앙스를 살려 한국어로 자연스럽게 연기하세요. 예시 대사를 반복하지 마세요.**
      2. 행동 지문(action): 범행 사실 서술 금지. 오직 신체 반응만.
      3. (중요) 유저가 (괄호) 안에 행동을 지시하면, '나레이터'가 되어 결과를 건조하게 서술.
      
      [출력 JSON] { "action": "...", "response": "...", "damage": 0 }
    `;

    apiHistory.current[charIndex] = [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[System]: 첫 마디를 시작하세요. JSON.` }] }];
    
    try {
      setLoading(true);
      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${getCleanedApiKey()}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: apiHistory.current[charIndex] })
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
    
    setChatHistories(prev => ({
      ...prev,
      [charIndex]: [...prev[charIndex], { role: 'user', text: currentInput, stance: isAction ? '수사' : getStanceInfo(currentStance).label, isAction }]
    }));
    setUserInput('');
    setLoading(true);

    const nextTurn = timeLeft - 1;

    try {
      let prompt = "";
      if (isAction) {
        prompt = `[SYSTEM]: 플레이어 행동: "${currentInput}". 
        나레이터가 되어 결과를 한국어로 건조하게 서술하세요. 진실(${scenario.truthDetails.weapon}, ${scenario.truthDetails.trick}) 기반.
        JSON 출력 시 "response"에 서술 내용, "action"은 비움, "damage"는 0.`;
      } else {
        prompt = `[형사]: "${currentInput}" (태세: ${getStanceInfo(currentStance).label})
        현재 평정심: ${composure[charIndex]}. 약점(${char.weakness}) 공략 여부?
        설정된 말투 유지. 중요 단어 *별표*. 줄바꿈(\\n) 사용.`;
      }

      apiHistory.current[charIndex].push({ role: "user", parts: [{ text: prompt }] });

      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${getCleanedApiKey()}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: apiHistory.current[charIndex] })
      });

      const result = await response.json();
      const rawText = result.candidates[0].content.parts[0].text;
      const data = cleanAndParseJSON(rawText);
      const damage = isAction ? 0 : Math.floor((data.damage || 0) * settings.damageMultiplier);

      apiHistory.current[charIndex].push({ role: "model", parts: [{ text: rawText }] });

      // Update State & Visual Effects
      if (damage > 0) {
          setRedFlash(true); setTimeout(() => setRedFlash(false), 500); // Hit Effect
          if (damage >= 15) { setShakeScreen(true); setTimeout(() => setShakeScreen(false), 500); }
      }
      
      setComposure(prev => ({ ...prev, [charIndex]: Math.max(0, prev[charIndex] - damage) }));
      setTimeLeft(nextTurn);

      if (data.action) playSoundFromAction(data.action);

      const lines = data.response.split('\n').filter(l => l.trim());
      setIsTyping(true); 
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

      // Trigger Evidence (Auto: 0,1,2)
      let hintIndex = -1;
      if (nextTurn === 15) hintIndex = 0;
      else if (nextTurn === 10) hintIndex = 1;
      else if (nextTurn === 5) hintIndex = 2;

      if (hintIndex !== -1 && !collectedEvidence.some(e => e.index === hintIndex)) {
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
      const hintText = scenario.hints[hintIndex];
      if (!hintText) return;

      setHintsLeft(prev => prev - 1);
      triggerEvidenceEvent(hintIndex, hintText, "추가 수사 요청");
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
      setLoading(true); playSound('typing');
      try {
          const prompt = `
            [사건 진상] 범인:${characters.find(c => c.role === '진범' || c.role === '공범')?.name || "알 수 없음"}, 흉기:${scenario.truthDetails.weapon}, 동기:${scenario.truthDetails.motive}, 트릭:${scenario.truthDetails.trick}
            [유저 답안] 범인:${deduction.culprit}, 흉기:${deduction.weapon}, 동기:${deduction.motive}, 트릭:${deduction.trick}
            [요청] 정확도 100점 만점 채점, 한국어로 피드백, 최종 등급(S/A/B/C/F).
            [출력 JSON] { "score": 85, "rank": "A", "feedback": "..." }
          `;
          
          const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${getCleanedApiKey()}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
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

  // --- 화면 렌더링 ---

  if (screen === 'api') return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center font-mono p-6">
      <div className="rain-overlay"></div>
      <div className="w-full max-w-md animate-fadeIn z-10 relative">
        <h1 className="text-5xl text-white font-bold tracking-tighter border-l-4 border-red-700 pl-4 mb-2 drop-shadow-lg">사건파일</h1>
        <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest pl-5">CASE FILE: Noir Investigation</p>
        
        {playerStats.totalCases > 0 && (
           <div className="bg-neutral-900/80 border border-gray-700 p-4 mb-6 rounded flex items-center justify-between">
              <div><div className="text-[10px] text-gray-500">현재 계급</div><div className="text-lg font-bold text-yellow-500">{playerStats.rank}</div></div>
              <div className="text-right"><div className="text-[10px] text-gray-500">해결한 사건</div><div className="text-white font-bold">{playerStats.totalCases}건</div></div>
           </div>
        )}

        <div className="bg-neutral-900 p-6 rounded border border-neutral-800 space-y-6 shadow-2xl">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">ACCESS KEY</label>
            <div className="relative"><input type={showApiKey ? "text" : "password"} className="w-full bg-black border border-gray-700 p-3 pr-10 text-white focus:border-red-500 outline-none transition" placeholder="API 키 입력" value={apiKey} onChange={e => { setApiKey(e.target.value); setErrorMsg(''); }} /><button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-3 text-gray-500 hover:text-white">{showApiKey ? <LucideEyeOff size={18}/> : <LucideEye size={18}/>}</button></div>
          </div>
          <button onClick={() => apiKey.trim() ? setScreen('setup') : setErrorMsg('API 키를 입력해주세요.')} className="w-full bg-white text-black font-bold py-3 hover:bg-gray-200 transition flex items-center justify-center gap-2">시스템 접속 <LucideSend size={16}/></button>
          {errorMsg && <div className="text-red-400 text-xs text-center">{errorMsg}</div>}
        </div>
      </div>
    </div>
  );

  if (screen === 'setup') return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center font-mono p-4">
      <div className="rain-overlay"></div>
      <div className="w-full max-w-2xl animate-fadeIn my-auto z-10 relative">
        <div className="flex justify-between mb-4 border-b border-gray-800 pb-2">
          <div className="flex items-center gap-2"><button onClick={() => setScreen('api')}><LucideArrowLeft/></button><h2 className="text-xl text-white font-bold">프로필 설정</h2></div>
          <button onClick={() => setScreen('archive')} className="text-xs bg-gray-800 px-3 py-1 rounded flex gap-1"><LucideArchive size={14}/> 사건 기록</button>
        </div>
        {errorMsg && <div className="bg-red-900/50 text-red-200 p-3 text-xs mb-4 rounded">{errorMsg}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽: 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-xs text-gray-500 font-bold border-b border-gray-800 pb-1">기본 정보 (필수)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[10px] text-gray-400 block">이름</label><input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white" placeholder="강동원 / James" value={userInputInfo.name} onChange={e => setUserInputInfo({...userInputInfo, name: e.target.value})} /></div>
              <div><label className="text-[10px] text-gray-400 block">나이</label><input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white" placeholder="32" value={userInputInfo.age} onChange={e => setUserInputInfo({...userInputInfo, age: e.target.value})} /></div>
            </div>
            <div><label className="text-[10px] text-gray-400 block">직업</label><input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white" placeholder="CEO, Doctor" value={userInputInfo.job} onChange={e => setUserInputInfo({...userInputInfo, job: e.target.value})} /></div>
            <div className="mt-2"><label className="text-[10px] text-gray-400 block">사건 소재 (선택)</label><textarea className="w-full bg-black border border-gray-800 p-2 text-sm text-white h-24 resize-none" placeholder="비워두면 캐릭터 국적에 맞는 사건이 자동 생성됩니다." value={userInputInfo.caseHints} onChange={e => setUserInputInfo({...userInputInfo, caseHints: e.target.value})} /></div>
          </div>
          
          {/* 오른쪽: 디테일 설정 */}
          <div className="space-y-4">
             <h3 className="text-xs text-gray-500 font-bold border-b border-gray-800 pb-1">디테일 설정 (선택)</h3>
             <div><label className="text-[10px] text-gray-500 block">성별</label><div className="flex gap-2">{['남성', '여성', '무관'].map(g => (<button key={g} onClick={() => setUserInputInfo({...userInputInfo, gender: g})} className={`flex-1 py-1.5 text-xs border ${userInputInfo.gender === g ? 'bg-gray-700 text-white border-white' : 'border-gray-700 text-gray-500'}`}>{g}</button>))}</div></div>
             
             <div>
               <label className="text-[10px] text-gray-500 block">외모 및 특징</label>
               <input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white" placeholder="차가운 눈매, 다리를 저는 습관" value={userInputInfo.appearanceAndFeatures} onChange={e => setUserInputInfo({...userInputInfo, appearanceAndFeatures: e.target.value})} />
             </div>
             <div>
               <label className="text-[10px] text-gray-500 block">성격</label>
               <input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white" placeholder="냉소적이고 이기적임" value={userInputInfo.trait} onChange={e => setUserInputInfo({...userInputInfo, trait: e.target.value})} />
             </div>

             <div>
               <label className="text-[10px] text-yellow-500 font-bold block mb-1">말투/대사 예시 (필수)</label>
               <textarea className="w-full bg-neutral-900 border border-yellow-900/50 p-2 text-sm text-white focus:border-yellow-500 outline-none h-16 resize-none" placeholder="예: '증거 있어? 웃기지 마.' (한국어로 입력)" value={userInputInfo.speechStyle} onChange={e => setUserInputInfo({...userInputInfo, speechStyle: e.target.value})} />
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] text-blue-400 font-bold block">유저 호칭</label><input className="w-full bg-neutral-900 border border-blue-900 p-2 text-sm text-white" placeholder="형사님" value={userInputInfo.userTitle} onChange={e => setUserInputInfo({...userInputInfo, userTitle: e.target.value})} /></div>
                <div><label className="text-[10px] text-gray-500 block">관계</label><input className="w-full bg-neutral-900 border border-gray-700 p-2 text-sm text-white" placeholder="초면" value={userInputInfo.relationship} onChange={e => setUserInputInfo({...userInputInfo, relationship: e.target.value})} /></div>
             </div>
             <div><label className="text-[10px] text-red-400 font-bold block">금지 행동 (NG)</label><input className="w-full bg-neutral-900 border border-red-900/50 p-2 text-sm text-white" placeholder="비속어 금지" value={userInputInfo.ngActions} onChange={e => setUserInputInfo({...userInputInfo, ngActions: e.target.value})} /></div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
           <div className="flex-1 flex gap-1 h-full">{['easy', 'medium', 'hard'].map(mode => { const set = getDifficultySettings(mode); return (<button key={mode} onClick={() => setDifficulty(mode)} className={`flex-1 text-[10px] uppercase border transition ${difficulty === mode ? 'border-white bg-gray-800 text-white' : 'border-gray-700 text-gray-500'}`}>{set.label}</button>); })}</div>
           <button onClick={handleGenerateCase} className="flex-[2] bg-red-800 hover:bg-red-700 text-white font-bold py-3 transition flex items-center justify-center gap-2">사건 생성 <LucideZap size={16}/></button>
        </div>
      </div>
    </div>
  );

  if (screen === 'archive') return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center font-mono p-6">
       {selectedCase ? (
        <div className="w-full max-w-2xl animate-fadeIn">
           <button onClick={() => setSelectedCase(null)} className="mb-4 text-gray-500 hover:text-white flex items-center gap-2"><LucideArrowLeft size={16}/> 목록으로</button>
           <div className="bg-neutral-900 border border-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">{selectedCase.suspect} 사건 <span className="text-sm font-normal text-gray-500">({selectedCase.date})</span></h2>
              <div className="space-y-4">
                 <div className="bg-black p-4 border border-red-900/30 rounded text-xs text-gray-300">
                    <p className="text-red-400 font-bold mb-2">진상 (TRUTH)</p>
                    <p>범행 도구: {selectedCase.truth?.weapon}</p>
                    <p>범행 동기: {selectedCase.truth?.motive}</p>
                    <p>결정적 트릭: {selectedCase.truth?.trick}</p>
                 </div>
                 {selectedCase.clues && selectedCase.clues.length > 0 && (
                    <div><h3 className="text-sm font-bold text-gray-500 mb-2">확보된 증거물</h3><div className="flex gap-2 overflow-x-auto pb-2">{selectedCase.clues.map((c, i) => (<div key={i} className="min-w-[100px] w-[100px] bg-black p-1 border border-gray-800"><img src={c.url} className="w-full h-16 object-cover mb-1 grayscale" alt={c.name}/><p className="text-[9px] text-center truncate">{c.name}</p></div>))}</div></div>
                 )}
                 <div><h3 className="text-sm font-bold text-gray-500 mb-2">심문 기록</h3><div className="h-64 overflow-y-auto bg-black p-4 rounded border border-gray-800 text-xs space-y-2">{selectedCase.chatHistory.map((m,i)=><div key={i} className={m.role==='user'?'text-right':'text-left'}><span className={`px-2 py-1 rounded ${m.role==='user'?'bg-blue-900/30 text-blue-200':'bg-gray-800 text-gray-300'}`}>{m.text}</span></div>)}</div></div>
              </div>
           </div>
        </div>
       ) : (
        <div className="w-full max-w-2xl animate-fadeIn">
          <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">사건 기록 보관소</h2><button onClick={() => setScreen('setup')} className="text-xs text-gray-500 border border-gray-700 px-3 py-1 rounded">나가기</button></div>
          {archive.length === 0 ? <div className="text-center text-gray-600 py-20">기록 없음</div> : <div className="grid gap-4">{archive.map((item) => (<button key={item.id} onClick={() => setSelectedCase(item)} className="bg-neutral-900 border border-gray-800 p-4 rounded-lg flex justify-between hover:border-red-500 transition text-left"><div><div className="font-bold text-white">{item.suspect}</div><div className="text-xs text-gray-500">{item.date}</div></div><div className="text-yellow-500 text-sm">{item.score?.badge}</div></button>))}</div>}
        </div>
       )}
    </div>
  );

  if (screen === 'generating') return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-6 text-center"><div className="rain-overlay"></div><LucideLoader2 size={48} className="animate-spin text-red-600 mb-6"/><h2 className="text-xl font-bold tracking-widest animate-pulse">사건 파일 구성 중...</h2><p className="text-xs text-gray-500 mt-2">{loadingText}</p></div>;

  if (screen === 'tutorial') return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono p-6">
      <div className="rain-overlay"></div>
      <div className="w-full max-w-lg animate-fadeIn z-10">
        <h2 className="text-2xl font-bold mb-6 text-red-500 tracking-widest flex items-center gap-2 border-b border-red-900 pb-4"><LucideHelpCircle size={24}/> 수사 가이드</h2>
        <div className="space-y-4 text-sm text-gray-300">
          <div className="bg-neutral-900 p-4 border border-neutral-800 flex gap-4 rounded"><LucideActivity className="text-red-500"/><div><h3 className="font-bold text-white">1. 평정심 파괴</h3><p className="text-xs text-gray-400">약점을 찔러 용의자의 방어기제를 무너뜨리세요.</p></div></div>
          {difficulty === 'hard' && <div className="bg-neutral-900 p-4 border border-neutral-800 flex gap-4 rounded"><LucideUsers className="text-green-500"/><div><h3 className="font-bold text-white">2. 다인 심문 (상 난이도)</h3><p className="text-xs text-gray-400">상단의 이름 탭을 눌러 용의자와 참고인을 교차 심문하세요.</p></div></div>}
          <div className="bg-neutral-900 p-4 border border-neutral-800 flex gap-4 rounded"><LucideLightbulb className="text-yellow-500"/><div><h3 className="font-bold text-white">3. 자동/수동 힌트</h3><p className="text-xs text-gray-400">시간 경과 시 자동 힌트가 지급됩니다(무료). 막힐 땐 [힌트 요청] 버튼을 사용하세요(감점).</p></div></div>
          <div className="bg-neutral-900 p-4 border border-neutral-800 flex gap-4 rounded"><LucideGavel className="text-blue-500"/><div><h3 className="font-bold text-white">4. 최종 추리</h3><p className="text-xs text-gray-400">충분한 자백을 들었다면 [수사 종결]을 눌러 답안을 제출하세요.</p></div></div>
          <button onClick={() => { initCharSession(0); setScreen('briefing'); }} className="w-full mt-6 bg-white text-black font-bold py-4 hover:bg-gray-200 tracking-widest text-lg shadow-lg">브리핑 확인</button>
        </div>
      </div>
    </div>
  );

  if (screen === 'briefing') return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center font-mono p-6">
       <div className="rain-overlay"></div>
       <div className="w-full max-w-lg animate-fadeIn z-10">
         <h1 className="text-4xl text-white font-black mb-2 tracking-tighter">CASE FILE</h1>
         {/* Location Badge */}
         <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 border border-gray-800 rounded-full px-3 py-1 w-fit bg-black">
            <LucideMapPin size={12}/> {scenario.background}
         </div>
         <div className="bg-neutral-900/80 border border-gray-800 p-8 space-y-6 shadow-2xl backdrop-blur-sm mt-4">
            <div><span className="block text-[10px] text-gray-600 mb-2">사건 개요</span><p className="text-sm text-gray-300 leading-relaxed font-serif italic border-l-2 border-white pl-4">"{scenario.publicBriefing}"</p></div>
            <div><span className="block text-[10px] text-gray-600 mb-2">관련 인물</span>
               {characters.map((c, i) => <div key={i} className="text-white font-bold">{c.name} <span className="text-xs text-gray-500">({c.role === '진범' ? '용의자' : '참고인'})</span></div>)}
            </div>
         </div>
         <button onClick={() => setScreen('game')} className="w-full mt-6 bg-red-700 hover:bg-red-600 text-white font-bold py-4 text-lg tracking-widest shadow-lg">취조실 입장</button>
       </div>
    </div>
  );

  if (screen === 'game') {
    const activeComposure = composure[activeCharIndex] || 100;
    const isPanic = activeComposure <= 0;
    
    // Low composure FX
    const glitchClass = isPanic || activeComposure < 30 ? "glitch-effect" : "";
    
    return (
      <div className={`fixed inset-0 bg-black text-gray-200 flex flex-col max-w-lg mx-auto border-x border-gray-800 font-sans shadow-2xl overflow-hidden ${shakeScreen ? 'animate-shake' : ''}`}>
        <div className={`absolute inset-0 pointer-events-none z-50 ${redFlash ? 'animate-red-flash' : ''}`}></div>
        <div className="absolute inset-0 pointer-events-none z-50 crt-effect"></div>
        <div className="scanline z-50"></div>
        <div className="rain-overlay"></div>
        
        {/* Header */}
        <div className="bg-black/90 backdrop-blur p-2 border-b border-gray-800 flex flex-col gap-2 sticky top-0 z-20">
          <div className="flex justify-between items-center px-2">
             <div className="flex items-center gap-2 text-xs text-gray-500 font-mono"><LucideClock size={12} /> 남은 턴: {timeLeft}</div>
             <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition">
                   {isMuted ? <LucideVolumeX size={14}/> : <LucideVolume2 size={14}/>}
                </button>
             </div>
             <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500 flex items-center gap-1"><LucideActivity size={10} className={isPanic ? "text-red-500" : "text-green-500"}/> 멘탈</div>
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative">
                   {/* Mental Bar Animation */}
                   <div 
                     className={`h-full transition-all duration-300 ease-out ${isPanic ? 'bg-red-600 animate-pulse' : 'bg-green-500'}`} 
                     style={{ width: `${Math.max(0, activeComposure)}%` }} 
                   />
                </div>
                <span className="text-[10px] text-gray-400 w-6 text-right">{activeComposure}</span>
             </div>
          </div>
          <div className="flex justify-between items-center px-2">
             {characters.length > 1 ? (
                <div className="flex gap-1 flex-1 mr-2">
                  {characters.map((char, i) => (
                    <button key={i} onClick={() => { setActiveCharIndex(i); initCharSession(i); }} className={`flex-1 py-1.5 text-[10px] font-bold transition rounded-sm ${activeCharIndex === i ? 'bg-white text-black' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>{char.name}</button>
                  ))}
                </div>
             ) : (
                <div className="text-center font-bold text-white py-1 text-sm flex-1">{characters[0]?.name}</div>
             )}
             <button onClick={() => setIsCaseFileOpen(true)} className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-300 flex items-center gap-1"><LucideFileText size={12}/> 사건 파일</button>
          </div>
        </div>

        {/* Modal: Case File */}
        {isCaseFileOpen && (
          <div className="absolute inset-0 bg-black/95 z-50 p-6 animate-fadeIn font-mono">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white">공개 정보</h2><button onClick={() => setIsCaseFileOpen(false)}><LucideX/></button></div>
            <div className="flex items-center gap-2 mb-4 text-xs text-gray-500"><LucideMapPin size={12}/> {scenario.background}</div>
            <p className="text-sm text-gray-400">{scenario.publicBriefing}</p>
          </div>
        )}

        {/* Modal: Inventory */}
        {isInventoryOpen && (
          <div className="absolute inset-0 bg-black/95 z-50 p-6 animate-fadeIn font-mono overflow-y-auto">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white flex gap-2"><LucideBriefcase/> 증거물 가방</h2><button onClick={() => setIsInventoryOpen(false)}><LucideX/></button></div>
            {collectedEvidence.length === 0 ? <p className="text-gray-600 text-center">수집된 증거가 없습니다.</p> : 
              <div className="grid grid-cols-2 gap-4">
                 {collectedEvidence.map((ev, i) => (
                    <div key={i} className="bg-neutral-900 border border-gray-800 p-2 rounded">
                       <img src={ev.url} className="w-full h-32 object-cover mb-2 grayscale hover:grayscale-0 transition" alt={ev.name} />
                       <div className="text-white font-bold text-xs">{ev.name}</div>
                       <div className="text-[10px] text-gray-500">{ev.desc}</div>
                    </div>
                 ))}
              </div>
            }
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide relative z-10">
          {(chatHistories[activeCharIndex] || []).map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : msg.role === 'system' ? 'items-center' : 'items-start'}`}>
              {msg.role === 'user' && (<div className="max-w-[85%] text-right animate-fadeIn"><span className={`inline-block text-[10px] px-1 mb-1 border ${msg.stance === '수사' ? 'text-purple-400 border-purple-500' : 'text-gray-500 border-gray-700'}`}>{msg.stance}</span><div className={`border px-4 py-2 text-sm whitespace-pre-wrap text-left ${msg.isAction ? 'bg-purple-900/20 border-purple-800 text-purple-200' : 'bg-gray-800/50 border-gray-700 text-gray-200'}`}>{msg.text}</div></div>)}
              {msg.role === 'system' && (<div className="w-full text-center my-2 animate-fadeIn flex flex-col items-center gap-2">{msg.isImageLoading ? <div className="text-xs text-yellow-500 animate-pulse flex items-center gap-2"><LucideLoader2 size={12} className="animate-spin"/> 현상 중...</div> : <>{msg.imageUrl && <img src={msg.imageUrl} className="max-w-[200px] border-4 border-white shadow-lg rotate-1 grayscale" alt="Evidence" />}<div className="inline-block bg-red-900/30 border border-red-800 text-red-300 text-xs px-3 py-1 rounded-full"><LucideLightbulb size={12} className="inline mr-1 mb-0.5"/> {msg.text}</div></>}</div>)}
              {msg.role === 'model' && (
                <div className="max-w-[90%] animate-fadeIn">
                  {msg.action && <div className="text-xs text-gray-500 italic mb-1 pl-2 border-l-2 border-gray-800">"{msg.action}"</div>}
                  <div 
                    className={`bg-black text-gray-300 border px-4 py-2 text-sm shadow-lg whitespace-pre-wrap leading-relaxed ${msg.isNarration ? 'border-purple-500 text-purple-300' : 'border-gray-800'} ${glitchClass}`}
                    data-text={msg.text}
                  >
                    {formatTextWithHighlights(msg.text)}
                  </div>
                  {msg.damage > 0 && <div className="mt-1 text-xs text-red-500 font-bold flex items-center gap-1"><LucideZap size={10}/> 멘탈 -{msg.damage} {msg.isCritical && "(CRITICAL!)"}</div>}
                </div>
              )}
            </div>
          ))}
          {isTyping && (<div className="flex flex-col items-start max-w-[90%]"><div className="bg-gray-900/50 border border-gray-800 px-3 py-2 rounded-full flex gap-1"><div className="w-1.5 h-1.5 bg-gray-500 rounded-full typing-dot"></div><div className="w-1.5 h-1.5 bg-gray-500 rounded-full typing-dot"></div><div className="w-1.5 h-1.5 bg-gray-500 rounded-full typing-dot"></div></div></div>)}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-black p-3 border-t border-gray-800 z-20">
          <div className="flex justify-between mb-2 items-center">
             <button onClick={handleRequestHint} disabled={loading || hintsLeft <= 0} className={`text-xs px-3 py-1 rounded flex items-center gap-1 border transition ${hintsLeft > 0 ? 'bg-yellow-900/30 text-yellow-500 border-yellow-800 hover:bg-yellow-900/50' : 'bg-gray-900 text-gray-600 border-gray-800'}`}><LucideLightbulb size={12}/> 힌트 요청 ({hintsLeft}/3)</button>
             <div className="flex gap-2">
               <button onClick={() => setScreen('endingForm')} className="text-xs bg-red-900/50 text-red-300 border border-red-800 px-3 py-1 hover:bg-red-800 transition">수사 종결</button>
               <button onClick={() => setIsInventoryOpen(true)} className="text-gray-500 hover:text-white"><LucideBriefcase size={20}/></button>
             </div>
          </div>
          <div className="grid grid-cols-4 gap-1 mb-2">{['normal', 'aggressive', 'emotional', 'logic'].map((st) => { const info = getStanceInfo(st); return <button key={st} onClick={() => setCurrentStance(st)} disabled={loading || isTyping} className={`py-2 text-[10px] font-bold border transition uppercase ${currentStance === st ? `${info.color} bg-gray-900` : 'border-gray-800 text-gray-600'} disabled:opacity-50`}>{info.label}</button> })}</div>
          <div className="flex gap-2"><input type="text" className="flex-1 bg-gray-900 text-gray-300 border border-gray-800 px-4 py-3 text-sm focus:border-gray-600 outline-none font-mono disabled:opacity-50" placeholder="(행동) 혹은 대화..." value={userInput} onChange={e=>setUserInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&!loading&&!isTyping&&handleSendMessage()} disabled={loading || isTyping}/><button onClick={handleSendMessage} disabled={loading || isTyping} className="bg-gray-800 hover:bg-white hover:text-black text-gray-400 px-4 border border-gray-700 transition disabled:opacity-50"><LucideSend size={18}/></button></div>
        </div>
      </div>
    );
  }

  if (screen === 'endingForm') return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center font-mono p-6">
       <div className="w-full max-w-lg animate-fadeIn bg-neutral-900 p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><LucideGavel className="text-red-500"/> 최종 수사 보고서</h2>
          <div className="space-y-4">
             <div><label className="text-xs text-gray-500">진범 지목</label><select className="w-full bg-black border border-gray-700 p-2 text-white" value={deduction.culprit} onChange={e=>setDeduction({...deduction, culprit: e.target.value})}><option value="">선택하세요</option>{characters.map((c,i)=><option key={i} value={c.name}>{c.name}</option>)}<option value="제3의 인물">제3의 인물</option></select></div>
             <div><label className="text-xs text-gray-500">범행 도구</label><input className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="예: 독약" value={deduction.weapon} onChange={e=>setDeduction({...deduction, weapon: e.target.value})}/></div>
             <div><label className="text-xs text-gray-500">범행 동기</label><input className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="예: 금전 문제" value={deduction.motive} onChange={e=>setDeduction({...deduction, motive: e.target.value})}/></div>
             <div><label className="text-xs text-gray-500">결정적 트릭</label><textarea className="w-full bg-black border border-gray-700 p-2 text-white h-20" placeholder="트릭이나 알리바이 조작 방법" value={deduction.trick} onChange={e=>setDeduction({...deduction, trick: e.target.value})}/></div>
          </div>
          <button onClick={submitDeduction} disabled={loading} className="w-full mt-6 bg-red-700 hover:bg-red-600 text-white font-bold py-3 transition">{loading ? "채점 중..." : "보고서 제출"}</button>
       </div>
    </div>
  );

  if (screen === 'endingResult') return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-6 text-center animate-fadeIn">
      <div className="scanline"></div>
      <h2 className="text-6xl font-black mb-4 tracking-tighter text-white">EVALUATION</h2>
      <div className="mb-8"><div className="text-6xl font-bold text-yellow-500 mb-2">{gameResult.score.badge}</div><p className="text-sm text-gray-400">SCORE: {gameResult.score.total}</p></div>
      <div className="border border-gray-800 bg-gray-900/50 p-6 mb-8 w-full max-w-md text-left text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{gameResult.feedback}</div>
      <div className="border border-red-900/30 p-4 mb-8 w-full max-w-md text-left"><h3 className="text-red-500 font-bold mb-2">진실 (TRUTH)</h3><p className="text-xs text-gray-400">{scenario.hiddenTruth}</p></div>
      <button onClick={() => { setScreen('setup'); setMessages([]); setChatHistories({}); }} className="px-8 py-4 bg-white text-black font-bold hover:bg-gray-300 tracking-widest transition">새로운 사건 시작</button>
    </div>
  );

  return null;
}