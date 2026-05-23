import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Gift, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Music, 
  MessageSquare, 
  Share2, 
  Camera, 
  QrCode, 
  Mic, 
  Volume2, 
  Printer, 
  BadgeCheck, 
  Shuffle, 
  Save, 
  BookOpen, 
  ShoppingBag,
  RotateCcw,
  Smile,
  Trash2,
  Bookmark,
  VolumeX,
  Play
} from 'lucide-react';

import { 
  BouquetState, 
  OCCASIONS, 
  PERSONALITIES, 
  EMOTIONAL_INTENTS, 
  FLOWER_CATALOG, 
  WRAPPERS, 
  PALETTES 
} from './types';
import AestheticBouquetCanvas from './components/AestheticBouquetCanvas';
import CalligraphyNoteEditor from './components/CalligraphyNoteEditor';

const STEPS = [
  { id: 1, label: 'Occasion' },
  { id: 2, label: 'Recipient' },
  { id: 3, label: 'Emotion' },
  { id: 4, label: 'Aesthetic Recommendations' },
  { id: 5, label: 'Style & Size' },
  { id: 6, label: 'Wrapping' },
  { id: 7, label: 'Palette' },
  { id: 8, label: 'Calligraphy' },
  { id: 9, label: 'Order Reveal' },
];

export default function App() {
  const [step, setStep] = useState<number>(0); // 0 = Hero, 1-9 = main flow
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  
  // Custom bouquet states
  const [state, setState] = useState<BouquetState>({
    occasion: 'birthday',
    personality: 'soft-romantic',
    emotion: 'I Love You',
    customMessage: '',
    bouquetStyle: 'fresh',
    size: 'medium',
    wrappingStyle: 'korean-wrap',
    paletteId: 'pastel-pink',
    ribbonColor: 'Cream Ivory',
    ribbonStyle: 'satin',
    noteFont: 'romantic',
    noteMessage: 'Warmest birthday wishes, always.',
    notePaperTexture: 'parchment',
    noteWaxSeal: 'rose',
    flowers: [
      { typeId: 'pink-rose', quantity: 9 },
      { typeId: 'white-daisy', quantity: 6 }
    ]
  });

  // AI states
  const [aiRec, setAiRec] = useState<any>(null);
  const [aiRecLoading, setAiRecLoading] = useState<boolean>(false);
  const [aiMeaning, setAiMeaning] = useState<any>(null);
  const [aiMeaningLoading, setAiMeaningLoading] = useState<boolean>(false);

  // Bonus interactive states
  const [audioAttached, setAudioAttached] = useState<boolean>(false);
  const [audioRecording, setAudioRecording] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  
  const [spotifyTrack, setSpotifyTrack] = useState<string>('pastel-acoustic');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=300'
  ]);
  const [qrGenerated, setQrGenerated] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Load saved designs
  useEffect(() => {
    try {
      const stored = localStorage.getItem('custom_bouquets');
      if (stored) {
        setSavedDesigns(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading designs from localStorage:", e);
    }
  }, []);

  // Update default states when occasion or personality changes in early steps
  const handleSelectOccasion = (id: string) => {
    setState(prev => {
      const updated = { ...prev, occasion: id };
      // Gentle preset triggers for smooth progression experience
      if (id === 'valentines' || id === 'proposal') {
        updated.emotion = 'I Love You';
        updated.paletteId = 'sunset-romance';
        updated.ribbonColor = 'Burgundy Red';
        updated.noteMessage = 'For the lock of my heart, forever yours.';
      } else if (id === 'friendship') {
        updated.emotion = 'You Make Me Happy';
        updated.paletteId = 'peach-pastel';
        updated.ribbonColor = 'Golden Peach';
        updated.noteMessage = 'Laughter is sweeter when it is shared with you.';
      } else if (id === 'thankyou') {
        updated.emotion = 'Thank You';
        updated.paletteId = 'sage-minimal';
        updated.ribbonColor = 'Sage Linen';
        updated.noteMessage = 'Truly grateful for your beautiful, warm presence.';
      } else if (id === 'apology') {
        updated.emotion = 'I’m Sorry';
        updated.paletteId = 'blue-serenity';
        updated.ribbonColor = 'Cream Ivory';
        updated.noteMessage = 'Sincerest thoughts. May these flowers speak for my heart.';
      }
      return updated;
    });
  };

  const handleSelectPersonality = (id: string) => {
    setState(prev => {
      const updated = { ...prev, personality: id };
      if (id === 'minimalist') {
        updated.wrappingStyle = 'minimal-mono';
        updated.ribbonStyle = 'satin';
        updated.noteFont = 'elegant';
      } else if (id === 'cute-playful') {
        updated.wrappingStyle = 'soft-mesh';
        updated.bouquetStyle = 'crochet';
        updated.noteFont = 'cute';
      } else if (id === 'dark-academia') {
        updated.wrappingStyle = 'vintage-news';
        updated.paletteId = 'luxury-black';
        updated.noteFont = 'vintage';
      } else if (id === 'luxury-lover') {
        updated.wrappingStyle = 'luxury-satin';
        updated.noteFont = 'romantic';
      }
      return updated;
    });
  };

  // Call API for AI flower symbolic recommendation
  const fetchAiRecommendations = async () => {
    setAiRecLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: state.occasion,
          personality: state.personality,
          emotion: state.emotion,
          customMessage: state.customMessage
        })
      });
      const data = await res.json();
      setAiRec(data);
      
      // Auto-apply AI suggestions to the live state! This feels like magic!
      if (data.recommendedFlowers && data.recommendedFlowers.length > 0) {
        setState(prev => ({
          ...prev,
          flowers: data.recommendedFlowers.map((f: any) => ({
            typeId: f.typeId,
            quantity: f.quantity
          })),
          wrappingStyle: data.wrapperStyleId || prev.wrappingStyle,
          paletteId: data.paletteId || prev.paletteId,
          ribbonColor: data.ribbonColor || prev.ribbonColor,
          ribbonStyle: data.ribbonStyle || prev.ribbonStyle,
        }));
      }
    } catch (err) {
      console.error("AI recommendation request failed:", err);
    } finally {
      setAiRecLoading(false);
    }
  };

  // Trigger recommendation if on Step 4 and hasn't loaded yet
  useEffect(() => {
    if (step === 4 && !aiRec) {
      fetchAiRecommendations();
    }
  }, [step, state.occasion, state.personality, state.emotion, state.customMessage]);

  // Call API for custom aesthetic analysis & poet summary
  const fetchAiMeaning = async () => {
    setAiMeaningLoading(true);
    try {
      const res = await fetch('/api/bouquet-meaning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flowers: state.flowers,
          size: state.size,
          occasion: state.occasion,
          personality: state.personality,
          emotion: state.emotion,
          customMessage: state.customMessage,
          wrappingStyle: state.wrappingStyle,
          paletteId: state.paletteId,
          ribbonStyle: state.ribbonStyle,
          ribbonColor: state.ribbonColor,
          noteMessage: state.noteMessage
        })
      });
      const data = await res.json();
      setAiMeaning(data);
    } catch (err) {
      console.error("AI meaning request failed:", err);
    } finally {
      setAiMeaningLoading(false);
    }
  };

  // Trigger meaning generation on Final Step
  useEffect(() => {
    if (step === 9) {
      fetchAiMeaning();
    }
  }, [step, state]);

  // Helper dynamic color classes
  const getOccasionColorTone = (id: string) => {
    const found = OCCASIONS.find(o => o.id === id);
    return found ? found.colorTheme : 'from-pink-50 to-rose-100';
  };

  // Direct state updaters
  const handleQuantityChange = (typeId: string, delta: number) => {
    setState(prev => {
      const matched = prev.flowers.find(f => f.typeId === typeId);
      let updatedFl = [...prev.flowers];
      if (matched) {
        const val = Math.max(0, matched.quantity + delta);
        if (val === 0) {
          updatedFl = updatedFl.filter(f => f.typeId !== typeId);
        } else {
          updatedFl = updatedFl.map(f => f.typeId === typeId ? { ...f, quantity: val } : f);
        }
      } else if (delta > 0) {
        updatedFl.push({ typeId, quantity: delta });
      }
      return { ...prev, flowers: updatedFl };
    });
  };

  // Clean Reset bouquet configuration
  const handleResetDesign = () => {
    setState({
      occasion: 'birthday',
      personality: 'soft-romantic',
      emotion: 'I Love You',
      customMessage: '',
      bouquetStyle: 'fresh',
      size: 'medium',
      wrappingStyle: 'korean-wrap',
      paletteId: 'pastel-pink',
      ribbonColor: 'Cream Ivory',
      ribbonStyle: 'satin',
      noteFont: 'romantic',
      noteMessage: 'Warmest birthday wishes, always.',
      notePaperTexture: 'parchment',
      noteWaxSeal: 'rose',
      flowers: [
        { typeId: 'pink-rose', quantity: 9 },
        { typeId: 'white-daisy', quantity: 6 }
      ]
    });
    setAiRec(null);
    setAiMeaning(null);
    setQrGenerated(false);
    setAudioAttached(false);
  };

  // Save customized design locally
  const handleSaveDesign = () => {
    const completeDesign = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toLocaleDateString(),
      name: aiMeaning?.bouquetName || "Sweet Custom Creation",
      tagline: aiMeaning?.emotionalTitle || "A Beautiful Intent",
      summary: aiMeaning?.poeticSummary || "Crafted beautifully based on your personal feelings.",
      state: { ...state }
    };
    
    const updated = [completeDesign, ...savedDesigns];
    setSavedDesigns(updated);
    localStorage.setItem('custom_bouquets', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Delete saved design
  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedDesigns.filter(d => d.id !== id);
    setSavedDesigns(updated);
    localStorage.setItem('custom_bouquets', JSON.stringify(updated));
  };

  // Restore saved configuration
  const handleLoadSaved = (saved: any) => {
    setState({ ...saved.state });
    setAiMeaning({
      bouquetName: saved.name,
      emotionalTitle: saved.tagline,
      poeticSummary: saved.summary,
      aestheticDescription: "Successfully re-loaded saved configuration from memory."
    });
    setStep(9); // Skip directly to review reveal
  };

  // Share bouquet link simulator
  const handleShareBouquet = () => {
    const textLink = `${window.location.origin}?design=${btoa(JSON.stringify(state))}`;
    navigator.clipboard.writeText(textLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Parse direct share links if present
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sharedDesign = params.get('design');
      if (sharedDesign) {
        const decoded = JSON.parse(atob(sharedDesign));
        setState(decoded);
        setStep(9); // Directly leap to meaning display
      }
    } catch (e) {
      console.warn("Failed to parse shared design parameters:", e);
    }
  }, []);

  const totalFlowerCount = state.flowers.reduce((sum, f) => sum + f.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-stone-800 font-sans flex flex-col selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      
      {/* 2. HEADER BRAND NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-stone-200/50 px-4 sm:px-8 py-4 flex items-center justify-between">
        <button 
          onClick={() => setStep(0)} 
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-300 to-rose-400 flex items-center justify-center text-white scale-100 group-hover:scale-105 transition-all shadow-sm">
            <span className="text-sm font-serif font-bold">C</span>
          </div>
          <div>
            <span className="text-lg font-serif font-semibold tracking-tight text-stone-900">CustomBouquet</span>
            <span className="text-[10px] font-mono block text-emerald-700 tracking-widest mt-[-2px] uppercase">Korean Gifting Studio</span>
          </div>
        </button>

        {/* Global Control Button tools */}
        <div className="flex items-center gap-2">
          {savedDesigns.length > 0 && (
            <button 
              onClick={() => { setStep(9); fetchAiMeaning(); }} 
              className="text-xs bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-medium px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              <span>Designs ({savedDesigns.length})</span>
            </button>
          )}

          {step > 0 && (
            <button 
              onClick={handleResetDesign}
              className="p-2 sm:px-3 text-xs border border-stone-200 hover:bg-stone-50 text-stone-500 hover:text-stone-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset Bouquet Configuration"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* 3. DYNAMIC PAGES CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 mb-12">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: LANDING INTRO PAGE */}
          {step === 0 && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center text-center py-8 sm:py-16 md:py-24 max-w-4xl mx-auto"
            >
              {/* Premium Top visual emblem */}
              <div className="mb-6 flex justify-center">
                <span className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 rounded-full px-4.5 py-1.5 text-xs text-pink-700 font-medium tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                  Premium Korean Floral Culture Gifting
                </span>
              </div>

              {/* Main Title typography */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-stone-900 font-medium tracking-tight mb-6 leading-[1.1]">
                Design a Bouquet That <br />
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-purple-400 font-light filter drop-shadow-sm">
                  Speaks Your Feelings
                </span>
              </h1>

              {/* Tagline text */}
              <p className="text-base sm:text-xl text-stone-500 max-w-2xl leading-relaxed mb-10 font-normal">
                Create personalized, premium bouquet designs based on emotions, personalities, luxury aesthetics, and custom calligraphy letters. Powered by AI symbolism.
              </p>

              {/* CTA Start Design BUTTON */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <button
                  id="cta-start-design"
                  onClick={() => setStep(1)}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-medium text-base px-8 py-4.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3.5 group cursor-pointer"
                >
                  <span>Start Designing Experience</span>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {savedDesigns.length > 0 ? (
                  <button
                    onClick={() => setStep(9)}
                    className="text-stone-600 hover:text-stone-900 border border-stone-200 bg-white hover:bg-stone-50 font-medium px-7 py-4 rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <BookOpen className="w-4.5 h-4.5" />
                    <span>View Saved Wishlists ({savedDesigns.length})</span>
                  </button>
                ) : (
                  <div className="text-xs text-stone-400 font-mono italic">
                    “Not just flowers — emotions designed beautifully.”
                  </div>
                )}
              </div>

              {/* Pinterest Korean Aesthetic Banner previews */}
              <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="bg-gradient-to-b from-stone-50 to-pink-50 p-4 rounded-3xl border border-stone-200/40 relative overflow-hidden flex flex-col justify-between group h-44">
                  <span className="text-xs font-serif italic text-pink-600">Soft & Fresh</span>
                  <div className="text-xxs-bold font-mono uppercase tracking-widest text-stone-400 mt-2">Korean wrap tiers</div>
                  <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 rounded-full bg-pink-100 opacity-60 filter blur-xl group-hover:scale-125 transition-transform" />
                </div>
                <div className="bg-gradient-to-b from-stone-50 to-purple-50 p-4 rounded-3xl border border-stone-200/40 relative overflow-hidden flex flex-col justify-between group h-44">
                  <span className="text-xs font-serif italic text-purple-600">Crochet Cozy</span>
                  <div className="text-xxs-bold font-mono uppercase tracking-widest text-stone-400 mt-2 font-mono">Warm wool threads</div>
                  <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 rounded-full bg-purple-100 opacity-60 filter blur-xl group-hover:scale-125 transition-transform" />
                </div>
                <div className="bg-gradient-to-b from-stone-50 to-amber-50/60 p-4 rounded-3xl border border-stone-200/40 relative overflow-hidden flex flex-col justify-between group h-44">
                  <span className="text-xs font-serif italic text-amber-700">Vintage soul</span>
                  <div className="text-xxs-bold font-mono uppercase tracking-widest text-stone-400 mt-2">Aged newspaper wrap</div>
                  <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 rounded-full bg-amber-100 opacity-60 filter blur-xl group-hover:scale-125 transition-transform" />
                </div>
                <div className="bg-gradient-to-b from-stone-50 to-emerald-50 p-4 rounded-3xl border border-stone-200/40 relative overflow-hidden flex flex-col justify-between group h-44">
                  <span className="text-xs font-serif italic text-emerald-800">Sage Minimalist</span>
                  <div className="text-xxs-bold font-mono uppercase tracking-widest text-stone-400 mt-2">Clean geometry grids</div>
                  <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 rounded-full bg-emerald-100 opacity-60 filter blur-xl group-hover:scale-125 transition-transform" />
                </div>
              </div>
            </motion.div>
          )}

          {/* BUILDER PIPELINE: STEPS 1-9 */}
          {step > 0 && (
            <motion.div
              key="builder-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* LEFT SIDE: DYNAMIC GUIDED STEPS AND FORMS (8 Columns on desktop) */}
              <div className="lg:col-span-7 flex flex-col gap-6">

                {/* Progress Indicators Track */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none w-full border-b border-stone-200/50">
                  {STEPS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        // Let user click across completed steps freely
                        if (s.id < step || s.id === 9) {
                          setStep(s.id);
                        }
                      }}
                      disabled={s.id > step && s.id !== 9}
                      className={`px-3 py-1.5 rounded-full text-xxs font-mono uppercase tracking-wider flex items-center gap-1 shrink-0 transition-all ${
                        step === s.id
                          ? 'bg-stone-900 text-white'
                          : s.id < step
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-pointer'
                          : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {s.id < step ? (
                        <Check className="w-2.5 h-2.5 text-emerald-500 stroke-[3]" />
                      ) : (
                        <span className="font-semibold">{s.id}</span>
                      )}
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>

                {/* ACTIVE STEP CONTENT */}
                <div className="min-h-[380px] sm:min-h-[440px]">
                  
                  {/* STEP 1: SELECT OCCASION */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6 animate-step"
                    >
                      <div>
                        <span className="text-xs uppercase tracking-widest text-pink-600 font-semibold font-mono block mb-2">Step 1 — Choose setting</span>
                        <h2 className="text-3xl font-serif text-stone-900 font-medium">What Gifting Occasion?</h2>
                        <p className="text-sm text-stone-500 mt-1">This will help our AI tailor colors, symbolic flower selections, wrappers, and cards.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {OCCASIONS.map((occ) => {
                          const isSelected = state.occasion === occ.id;
                          return (
                            <button
                              id={`occasion-card-${occ.id}`}
                              key={occ.id}
                              type="button"
                              onClick={() => handleSelectOccasion(occ.id)}
                              className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-34 transition-all relative group cursor-pointer ${
                                isSelected
                                  ? 'border-pink-400 bg-white shadow-md ring-2 ring-pink-100'
                                  : 'border-stone-200/60 bg-white/70 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              <div className="flex justify-between items-start w-full">
                                <span className="text-2xl">{occ.emoji}</span>
                                {isSelected && (
                                  <span className="bg-pink-100 text-pink-700 text-[10px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full">
                                    Selected
                                  </span>
                                )}
                              </div>
                              
                              <div className="mt-3">
                                <h3 className="font-serif font-medium text-stone-900 text-sm">{occ.name}</h3>
                                <p className="text-xxs text-stone-400 mt-1 group-hover:text-stone-500 line-clamp-2 leading-relaxed">
                                  {occ.description}
                                </p>
                              </div>

                              {/* Soft subtle color glow indicating emotion matching on card back */}
                              <div className={`absolute inset-0 bg-gradient-to-br ${occ.colorTheme} opacity-0 group-hover:opacity-[0.06] transition-opacity rounded-2xl pointer-events-none`} />
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: RECIPIENT PERSONALITY STYLE */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold font-mono block mb-2">Step 2 — Aesthetic profile</span>
                        <h2 className="text-3xl font-serif text-stone-900 font-medium">Gifting Recipient Personality?</h2>
                        <p className="text-sm text-stone-500 mt-1">Their personal flair dictates ribbon materials, flower geometry, wrapping styles, and calligraphy.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
                        {PERSONALITIES.map((p) => {
                          const isSelected = state.personality === p.id;
                          return (
                            <button
                              id={`personality-card-${p.id}`}
                              key={p.id}
                              type="button"
                              onClick={() => handleSelectPersonality(p.id)}
                              className={`p-4 rounded-2xl border text-left h-36 flex flex-col justify-between transition-all group cursor-pointer ${
                                isSelected
                                  ? 'border-emerald-400 bg-white shadow-md ring-2 ring-emerald-50'
                                  : 'border-stone-200/60 bg-white/70 hover:bg-white hover:shadow-xs'
                              }`}
                            >
                              <div>
                                <h3 className="font-serif font-semibold text-stone-900 text-sm flex items-center justify-between">
                                  <span>{p.name}</span>
                                  {isSelected && (
                                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                                  )}
                                </h3>
                                <p className="text-xxs text-emerald-800 font-mono mt-1 italic tracking-wide">
                                  {p.tagline}
                                </p>
                              </div>

                              <p className="text-xxs text-stone-400 leading-normal line-clamp-2 mt-2">
                                {p.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: MESSAGE OR EMOTIONAL INTENT */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6 whitespace-normal"
                    >
                      <div>
                        <span className="text-xs uppercase tracking-widest text-purple-600 font-semibold font-mono block mb-2">Step 3 — Meaning intent</span>
                        <h2 className="text-3xl font-serif text-stone-900 font-medium">Select Intended Message & Emotion?</h2>
                        <p className="text-sm text-stone-500 mt-1">What exact feeling do you want this beautiful bouquet to express to them?</p>
                      </div>

                      {/* Emotional Intents visual buttons */}
                      <div className="flex flex-wrap gap-2">
                        {EMOTIONAL_INTENTS.map((intent) => {
                          const isSelected = state.emotion === intent;
                          return (
                            <button
                              key={intent}
                              type="button"
                              onClick={() => setState(prev => ({ ...prev, emotion: intent, customMessage: '' }))}
                              className={`px-4.5 py-3 rounded-full border text-xs font-medium tracking-wide transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                              }`}
                            >
                              {intent}
                            </button>
                          );
                        })}
                      </div>

                      {/* Write Custom Option block */}
                      <div className="border-t border-stone-100 pt-5">
                        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-2.5">
                          Or, write your custom emotional keyword/intent
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={state.customMessage}
                            onChange={(e) => {
                              const val = e.target.value;
                              setState(prev => ({ ...prev, customMessage: val, emotion: 'Custom Message' }));
                            }}
                            placeholder="e.g. Sincere apologies with hopes for dynamic healing..."
                            className="bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-200"
                          />
                          {(state.customMessage || state.emotion === 'Custom Message') && (
                            <button
                              type="button"
                              onClick={() => setState(prev => ({ ...prev, customMessage: '', emotion: 'I Love You' }))}
                              className="text-xxs text-red-500 hover:text-red-700 px-2 font-mono"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: AI SYMBOLIC FLOWER RECOMMENDATIONS & COUNTERS */}
                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-xs uppercase tracking-widest text-[#B45309] font-semibold font-mono block mb-2">Step 4 — AI recommendation engine</span>
                          <h2 className="text-3xl font-serif text-stone-900 font-medium">Symbolic AI Suggestions</h2>
                          <p className="text-sm text-stone-500 mt-1">Based on emotional intent, we suggest symbolic blooms. Tailor floral densities below.</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={fetchAiRecommendations}
                          disabled={aiRecLoading}
                          className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5 shrink-0 hover:shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                        >
                          <Shuffle className={`w-3.5 h-3.5 text-amber-700 ${aiRecLoading ? 'animate-spin' : ''}`} />
                          <span>Re-Generate Recommendations</span>
                        </button>
                      </div>

                      {/* Display AI output explanation if available */}
                      {aiRecLoading ? (
                        <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/30 flex flex-col items-center justify-center text-center py-10">
                          <div className="relative mb-3 flex items-center justify-center">
                            <span className="absolute animate-ping w-8 h-8 rounded-full bg-amber-200 opacity-75"></span>
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center z-10">
                              <Sparkles className="w-5 h-5 text-amber-700 animate-pulse" />
                            </div>
                          </div>
                          <p className="text-sm font-serif italic text-amber-900">“Consulting the emotional florist library...”</p>
                          <p className="text-xxs text-stone-400 mt-1">Analyzing color psychology structures based on {state.occasion} & {state.personality}...</p>
                        </div>
                      ) : aiRec ? (
                        <div className="p-5 rounded-2xl bg-amber-50/30 border border-amber-200/50">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 uppercase">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>AI Florist Psychology Summary ({aiRec.aiSource || 'Calculated'})</span>
                          </div>
                          <p className="text-xs text-stone-600 mt-2 italic leading-relaxed">
                            “{aiRec.emotionalPsychology || 'An elegant match focusing on high-gifting values and deep emotional messaging.'}”
                          </p>
                        </div>
                      ) : null}

                      {/* FLOWER DENSITY SELECTOR TABLE */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-xs font-semibold text-stone-700 uppercase tracking-widest">Select flower composition & quantity</label>
                          <span className="text-xxs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                            Total Flowers: {totalFlowerCount} stems
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[290px] overflow-y-auto pr-1">
                          {FLOWER_CATALOG.map((f) => {
                            const matched = state.flowers.find(sf => sf.typeId === f.id);
                            const quantity = matched ? matched.quantity : 0;
                            
                            // Check if this flower is proposed by recommendations
                            const isProposedByAI = aiRec?.recommendedFlowers?.some((rf: any) => rf.typeId === f.id);

                            return (
                              <div 
                                key={f.id}
                                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                                  quantity > 0 
                                    ? 'bg-rose-50/30 border-rose-200' 
                                    : 'bg-white border-stone-200/60 hover:bg-stone-50/50'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded-full inline-block border shadow-xs" style={{ backgroundColor: f.color }} />
                                    <span className="text-xs font-medium text-stone-800">{f.name}</span>
                                    {isProposedByAI && (
                                      <span className="bg-amber-100 text-amber-800 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase scale-90">
                                        AI Recommended
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xxs text-stone-400 mt-0.5 block italic">{f.symbolism}</span>
                                </div>

                                <div className="flex items-center gap-2.5">
                                  <button
                                    type="button"
                                    onClick={() => handleQuantityChange(f.id, -1)}
                                    className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-semibold text-stone-800 w-4 text-center">{quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleQuantityChange(f.id, 1)}
                                    className="w-7 h-7 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-sm flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: BOUQUET STYLE CATEGORIES */}
                  {step === 5 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                      <div>
                        <span className="text-xs uppercase tracking-widest text-[#0D9488] font-semibold font-mono block mb-2">Step 5 — Texture and size</span>
                        <h2 className="text-3xl font-serif text-stone-900 font-medium">Bouquet Gifting style</h2>
                        <p className="text-sm text-stone-500 mt-1">Select your structural bouquet style and sizes. Features real-time visual variations.</p>
                      </div>

                      {/* Styles Grids */}
                      <div>
                        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-3">Structural style choice</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                          {[
                            { id: 'fresh', name: 'Fresh Blooms', icon: '🌸', desc: 'Fresh-cut real luxury flowers.' },
                            { id: 'crochet', name: 'Crochet Wool', icon: '🧶', desc: 'Hand-knitted, evergreen yarn.' },
                            { id: 'chocolate', name: 'Choco Foil', icon: '🍫', desc: 'Ferrero-style golden sweets.' },
                            { id: 'pipecleaner', name: 'Cute Wire', icon: '✨', desc: 'Cute velvety pipe cleaners' },
                            { id: 'mixed', name: 'Artisan Mixed', icon: '⭐️', desc: 'A custom mixed design.' }
                          ].map((bStyle) => {
                            const isSelected = state.bouquetStyle === bStyle.id;
                            return (
                              <button
                                key={bStyle.id}
                                type="button"
                                onClick={() => setState(prev => ({ ...prev, bouquetStyle: bStyle.id }))}
                                className={`p-3.5 rounded-2xl border text-center flex flex-col justify-between items-center transition-all h-32 group cursor-pointer ${
                                  isSelected
                                    ? 'border-[#0D9488] bg-[#0D9488]/5 shadow-sm ring-1 ring-[#0D9488]'
                                    : 'border-stone-200/60 bg-white hover:bg-stone-50'
                                }`}
                              >
                                <span className="text-2xl group-hover:scale-110 transition-transform block mb-1">{bStyle.icon}</span>
                                <div>
                                  <h4 className="text-xs font-medium text-stone-800 leading-tight">{bStyle.name}</h4>
                                  <p className="text-[9px] text-stone-400 mt-0.5 leading-tight">{bStyle.desc}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tamaño */}
                      <div>
                        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-3">Density & Size density</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'small', name: 'Petit / Small', stems: '5–8 stems', desc: 'Sweet, delicate, and intimate.' },
                            { id: 'medium', name: 'Premium / Medium', stems: '9–15 stems', desc: 'The perfect, lush sweet balance.' },
                            { id: 'large', name: 'Grand / Luxury', stems: '16+ stems', desc: 'Opulent, show-stopping devotion.' }
                          ].map((sz) => {
                            const isSelected = state.size === sz.id;
                            return (
                              <button
                                key={sz.id}
                                type="button"
                                onClick={() => setState(prev => ({ ...prev, size: sz.id as any }))}
                                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <span className="text-xs font-semibold">{sz.name}</span>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                                    {sz.stems}
                                  </span>
                                </div>
                                <p className={`text-xxs mt-2 transition-colors ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                                  {sz.desc}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 6: WRAPPING PAPER CUSTOMIZATION */}
                  {step === 6 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <span className="text-xs uppercase tracking-widest text-[#4f46e5] font-semibold font-mono block mb-2">Step 6 — Outer paper selection</span>
                        <h2 className="text-3xl font-serif text-stone-900 font-medium">Premium Korean wrapping paper</h2>
                        <p className="text-sm text-stone-500 mt-1">Select the wrapper style casing to lock in your custom flower layouts.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                        {WRAPPERS.map((wrap) => {
                          const isSelected = state.wrappingStyle === wrap.id;
                          return (
                            <button
                              key={wrap.id}
                              type="button"
                              onClick={() => setState(prev => ({ ...prev, wrappingStyle: wrap.id }))}
                              className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#4f46e5] bg-white shadow-md ring-2 ring-indigo-50/50'
                                  : 'border-stone-200 bg-white/70 hover:bg-white hover:shadow-xs'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-stone-200 opacity-90 ${wrap.styleClass}`} />
                              <div>
                                <h3 className="font-serif font-medium text-stone-900 text-sm flex items-center gap-2">
                                  <span>{wrap.name}</span>
                                  {isSelected && (
                                    <span className="bg-indigo-100 text-indigo-700 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase">
                                      Active
                                    </span>
                                  )}
                                </h3>
                                <p className="text-xxs text-stone-400 mt-1">{wrap.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 7: COLOR PALETTE SELECTION */}
                  {step === 7 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <span className="text-xs uppercase tracking-widest text-[#0891B2] font-semibold font-mono block mb-2">Step 7 — Palette harmony</span>
                        <h2 className="text-3xl font-serif text-stone-900 font-medium">Aesthetic palette gradient swatches</h2>
                        <p className="text-sm text-stone-500 mt-1">Updating palette modifies wrapping textures, ribbon glow accents, and background atmospheric lights.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PALETTES.map((pal) => {
                          const isSelected = state.paletteId === pal.id;
                          return (
                            <button
                              key={pal.id}
                              type="button"
                              onClick={() => setState(prev => ({ ...prev, paletteId: pal.id }))}
                              className={`p-4.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#0891B2] bg-white shadow-md ring-2 ring-cyan-50'
                                  : 'border-stone-200 bg-white hover:bg-stone-50'
                              }`}
                            >
                              <div>
                                <h3 className="text-xs font-semibold text-stone-850 flex items-center gap-1.5">
                                  <span>{pal.name}</span>
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                  )}
                                </h3>
                                
                                {/* Swatch row */}
                                <div className="flex gap-1 mt-2.5">
                                  {pal.hexes.map((hex, index) => (
                                    <span 
                                      key={index} 
                                      className="w-5 h-5 rounded-md inline-block border border-stone-200/50" 
                                      style={{ backgroundColor: hex }} 
                                    />
                                  ))}
                                </div>
                              </div>

                              <ChevronRight className={`w-4 h-4 text-stone-300 transition-transform ${isSelected ? 'translate-x-0.5 text-cyan-600' : ''}`} />
                            </button>
                          );
                        })}
                      </div>

                      {/* Customize Ribbon Material below palette */}
                      <div className="border-t border-stone-100 pt-5 space-y-4">
                        <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">Customize ribbon attachment details</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-xxs text-stone-500 block mb-1">Ribbon Vibe Text:</span>
                            <input 
                              type="text" 
                              value={state.ribbonColor} 
                              onChange={(e) => setState(prev => ({ ...prev, ribbonColor: e.target.value }))}
                              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-880 w-full focus:outline-none"
                              placeholder="e.g. Cream Ivory"
                            />
                          </div>

                          <div>
                            <span className="text-xxs text-stone-500 block mb-1">Weaving Bow structure:</span>
                            <div className="grid grid-cols-3 gap-1">
                              {['satin', 'grosgrain', 'sheer'].map((style_str) => (
                                <button
                                  key={style_str}
                                  type="button"
                                  onClick={() => setState(prev => ({ ...prev, ribbonStyle: style_str }))}
                                  className={`px-2 py-2 rounded-lg border text-xxs-bold capitalize font-mono ${
                                    state.ribbonStyle === style_str
                                      ? 'bg-stone-900 border-stone-900 text-white'
                                      : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-500'
                                  }`}
                                >
                                  {style_str}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 8: CALLIGRAPHY NOTE COMPOSER */}
                  {step === 8 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <CalligraphyNoteEditor 
                        state={state} 
                        onChange={setState} 
                      />
                    </motion.div>
                  )}

                  {/* STEP 9: ORDER REVEAL & AI EMOTIONAL MEANING SUMMARY */}
                  {step === 9 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-xs uppercase tracking-widest text-[#BE123C] font-semibold font-mono block mb-2">Step 9 — Final collection reveal</span>
                          <h2 className="text-4xl font-serif text-stone-900 font-medium">Your customized Bouquet Story</h2>
                          <p className="text-sm text-stone-500 mt-1">Below, explore your poetically parsed bouquet narrative powered by AI flower symbolism.</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={fetchAiMeaning}
                          disabled={aiMeaningLoading}
                          className="text-xxs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className={`w-3 h-3 ${aiMeaningLoading ? 'animate-spin' : ''}`} />
                          <span>Refresh Poetry</span>
                        </button>
                      </div>

                      {/* Display final bouquet summary layout */}
                      {aiMeaningLoading ? (
                        <div className="p-8 rounded-3xl bg-rose-50/20 border border-rose-200/40 flex flex-col items-center justify-center text-center py-16 shadow-xs">
                          <span className="animate-spin w-8 h-8 rounded-full border-2 border-pink-600 border-t-transparent mb-4"></span>
                          <p className="text-base font-serif italic text-rose-950 font-medium animate-pulse">“Writing personalized romantic floral summary...”</p>
                          <p className="text-xxs text-stone-400 mt-1">Compiling emotional symbolism equations based on your ribbons and notes...</p>
                        </div>
                      ) : aiMeaning ? (
                        <div className="bg-white/80 border border-stone-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                          
                          {/* Aesthetic Title Header */}
                          <div className="text-center border-b border-stone-100 pb-5">
                            <span className="text-[10px] font-mono text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full uppercase font-bold tracking-widest inline-block animate-bounce mb-3">
                              💐 AI Personalized Bouquet Blend 💐
                            </span>
                            <h3 className="text-3xl sm:text-4xl font-serif text-stone-900 tracking-tight font-medium">
                              “{aiMeaning.bouquetName || 'Soft Whispers'}”
                            </h3>
                            <p className="text-xs sm:text-sm text-purple-800 font-mono italic tracking-wide mt-1.5">
                              {aiMeaning.emotionalTitle || 'A sanctuary of quiet dawn commitment.'}
                            </p>
                          </div>

                          {/* Full Poetic analysis */}
                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono block mb-1">The Meaning Behind Your Bouquet</span>
                              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-serif italic bg-stone-50/50 p-4.5 rounded-2xl border border-stone-100">
                                {aiMeaning.poeticSummary || 'This bouquet combines red roses for passionate love, lavender accents for calm companionship, and soft blush wrapping to symbolize warmth.'}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                              <div className="p-4 rounded-2xl bg-neutral-50 border border-stone-150">
                                <span className="text-[9px] text-stone-400 uppercase tracking-widest font-mono block mb-1">Aesthetic wrapper composition</span>
                                <p className="text-xxs text-stone-500 leading-relaxed">
                                  {aiMeaning.aestheticDescription || 'Crafted elegantly with dynamic layers creating a Pinterest-worthy aesthetic contrast.'}
                                </p>
                              </div>

                              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-150 flex flex-col justify-between">
                                <div>
                                  <span className="text-[9px] text-[#0891b2] uppercase tracking-widest font-mono flex items-center gap-1 mb-1">
                                    <Music className="w-3 h-3 text-cyan-600 animate-pulse" />
                                    <span>Recommended Ambient Sound</span>
                                  </span>
                                  <p className="text-xxs text-stone-500 leading-tight">
                                    A custom track selected dynamically to accompany the bouquet ribbon-tied note card.
                                  </p>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                  <button
                                    onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                                    className="bg-stone-900 text-white rounded-full p-1.5 hover:bg-stone-800 cursor-pointer text-xxs flex items-center gap-1.5 px-3 py-1.5"
                                  >
                                    {isAudioPlaying ? (
                                      <>
                                        <VolumeX className="w-3 h-3 text-white" />
                                        <span>Mute Music</span>
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-3 h-3 text-white fill-white" />
                                        <span>Play Acoustic Ambient</span>
                                      </>
                                    )}
                                  </button>
                                  {isAudioPlaying && (
                                    <span className="text-xxs font-mono text-emerald-600 animate-pulse">Running track...</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-[9px] text-stone-400 font-mono flex items-center justify-end gap-1.5 mt-2">
                              <span>Source: {aiMeaning.aiSource || 'AI Local System API'}</span>
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="bg-white border rounded-3xl p-6 text-center text-stone-500 py-10">
                          <p className="text-xs">No analysis has been written yet. Generate summary by verifying checkout items.</p>
                        </div>
                      )}

                      {/* BONUS PREMIUM FEATURES CARDS */}
                      <div className="border-t border-stone-200/50 pt-6">
                        <span className="text-xs font-semibold text-stone-600 uppercase tracking-widest block mb-4">Bonus Gifting Add-ons</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          
                          {/* Photo album memory uploads */}
                          <div className="bg-white/70 border border-stone-200 p-4.5 rounded-2xl flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 mb-1">
                                <Camera className="w-4 h-4 text-pink-500" />
                                <span>Memory Polaroid Attachments</span>
                              </div>
                              <p className="text-xxs text-stone-500 leading-normal">
                                Attach personal digital memories that your recipient can scan and download.
                              </p>
                              {photos.length > 0 && (
                                <div className="mt-3 flex gap-2">
                                  {photos.map((url, i) => (
                                    <div key={i} className="relative w-12 h-14 bg-white p-0.5 border border-stone-300 shadow-xs rounded transform -rotate-6">
                                      <img src={url} alt="Polaroid Upload" className="w-full h-10 object-cover" referrerPolicy="no-referrer" />
                                      <div className="w-full h-1 bg-stone-100 mt-1" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => setPhotos(['https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=300', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=300'])}
                              className="text-xxs text-pink-600 hover:text-pink-800 font-semibold mt-4 text-left cursor-pointer"
                            >
                              + Sim Upload Photos
                            </button>
                          </div>

                          {/* Audio voice recording trigger */}
                          <div className="bg-white/70 border border-stone-200 p-4.5 rounded-2xl flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 mb-1">
                                <Mic className="w-4 h-4 text-rose-500" />
                                <span>Voice Message Dedication</span>
                              </div>
                              <p className="text-xxs text-stone-500 leading-normal">
                                Record a genuine voice message tied automatically to the QR code wrapper tag.
                              </p>
                              {audioAttached && (
                                <div className="mt-3 flex items-center gap-1.5 bg-rose-50 border border-rose-100 rounded-xl px-2.5 py-1 text-xxs text-rose-800">
                                  <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>AudioAttached.wav</span>
                                  <button onClick={() => setAudioAttached(false)} className="text-[9px] hover:text-red-500 ml-auto uppercase font-bold">✕</button>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (audioRecording) {
                                  setAudioRecording(false);
                                  setAudioAttached(true);
                                } else {
                                  setAudioRecording(true);
                                }
                              }}
                              className={`text-xxs font-semibold mt-4 text-left cursor-pointer ${audioRecording ? 'text-red-650 animate-pulse' : 'text-rose-600 hover:text-rose-800'}`}
                            >
                              {audioRecording ? '● Press to stop recording' : '+ Sim Voice Record'}
                            </button>
                          </div>

                          {/* QR Card digital memory attachment */}
                          <div className="bg-white/70 border border-stone-200 p-4.5 rounded-2xl flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 mb-1">
                                <QrCode className="w-4 h-4 text-emerald-600" />
                                <span>QR Memory Wrapping Tag</span>
                              </div>
                              <p className="text-xxs text-stone-500 leading-normal">
                                Creates an interactive gift-tag wrapped along ribbons with digital letters.
                              </p>
                              {qrGenerated && (
                                <div className="mt-2 text-center bg-stone-100 border p-2 rounded-xl flex items-center gap-1 text-stone-600 text-xxs">
                                  <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Tied with ribbon bow tag</span>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => setQrGenerated(true)}
                              className="text-xxs text-emerald-600 hover:text-emerald-800 font-semibold mt-4 text-left cursor-pointer"
                            >
                              Generate Ribbon QR Card
                            </button>
                          </div>

                        </div>
                      </div>

                      {/* SIMULATED CHECKOUT ORDER CONTROL PANEL */}
                      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-pink-200 p-6 rounded-3xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="font-serif text-lg text-stone-900 font-semibold">Reserve & Send Gifting Bouquet</h4>
                            <p className="text-xxs text-stone-550 leading-relaxed">
                              Includes premium Korean styled heavy wrapping paper, calligraphy note card, wax seal, ribbon knot, and the emotional AI catalog.
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs text-stone-400 font-mono tracking-widest uppercase block mt-1">Est Price</span>
                            <span className="text-2xl font-serif text-stone-850 font-black">$68.00 USD</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleSaveDesign}
                            className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-stone-400" />
                            <span>{savedSuccess ? 'Saved successfully!' : 'Save Wishlist'}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleShareBouquet}
                            className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Share2 className="w-3.5 h-3.5 text-stone-400" />
                            <span>{copiedLink ? 'Copied shared Link!' : 'Share Design'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Printer className="w-3.5 h-3.5 text-stone-400" />
                            <span>Print Letterpress</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => alert(`Gift order placed successfully!\n\nDetails:\nOccasion: ${state.occasion}\nPersonality: ${state.personality}\nBouquet: ${aiMeaning?.bouquetName || "Sweet Custom Bouquet"}\nTotal: $68.00 USD\n\nThank you for choosing CustomBouquet!`)}
                            className="bg-stone-900 hover:bg-stone-800 text-white rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-stone-400" />
                            <span>Order Bouquet</span>
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  )}

                </div>

                {/* STEPS TOGGLE CONTROLS (Back / Next footer) */}
                <div className="flex items-center justify-between border-t border-stone-200/50 pt-5 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 1) {
                        setStep(0);
                      } else {
                        setStep(prev => prev - 1);
                      }
                    }}
                    className={`px-5 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-1.5`}
                  >
                    <ChevronLeft className="w-4 h-4 text-stone-400" />
                    <span>Back</span>
                  </button>

                  <div className="text-xxs-bold font-mono text-stone-400 uppercase tracking-widest font-semibold hidden sm:block">
                    CustomBouquet Interactive Guided Builder
                  </div>

                  {step < 9 ? (
                    <button
                      type="button"
                      onClick={() => setStep(prev => prev + 1)}
                      className="bg-stone-900 hover:bg-stone-800 text-white rounded-xl px-6 py-3.5 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setStep(1); handleResetDesign(); }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 py-3.5 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-white" />
                      <span>Create New Bouquet</span>
                    </button>
                  )}
                </div>

              </div>
              
              {/* RIGHT SIDE: CONTINUOUS STICKY LIVE VISUAL PREVIEW AREA (5 Columns on desktop) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                
                {/* 2D Bouquet Canvas dynamic preview box */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xxs-bold font-mono uppercase tracking-widest text-[#B45309] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                      <span>Live custom design preview</span>
                    </span>
                    <span className="text-xxs-bold font-mono text-stone-400 uppercase">
                      Width: 380px
                    </span>
                  </div>

                  <AestheticBouquetCanvas 
                    state={state} 
                    onUpdateState={setState} 
                    currentStep={step}
                    setStep={setStep}
                  />
                </div>

                {/* Mini State Summary Panel card */}
                <div className="bg-white border text-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Aesthetic Selections</h4>
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono font-semibold uppercase">
                      {state.size}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xxs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-405">Occasion:</span>
                      <span className="font-semibold text-stone-800 capitalize">{state.occasion}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-405">Style Profile:</span>
                      <span className="font-semibold text-stone-800 capitalize truncate max-w-[100px]">{state.personality.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-405">Wrapper Style:</span>
                      <span className="font-semibold text-stone-800 capitalize truncate max-w-[100px]">{state.wrappingStyle.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-405">Ribbon:</span>
                      <span className="font-semibold text-stone-800 capitalize truncate max-w-[100px]">{state.ribbonColor} ({state.ribbonStyle})</span>
                    </div>
                  </div>

                  {/* Selected Flowers stem layout summary lists */}
                  <div className="pt-2">
                    <span className="text-[9px] text-stone-405 uppercase tracking-widest font-semibold block mb-1">Flower Recipe:</span>
                    <div className="flex flex-wrap gap-1">
                      {state.flowers.map(f => {
                        const match = FLOWER_CATALOG.find(cat => cat.id === f.typeId);
                        if (!match) return null;
                        return (
                          <span key={f.typeId} className="bg-stone-50 border px-2 py-1 rounded-lg text-xxs flex items-center gap-1.5 font-sans">
                            <span className="w-2 h-2 rounded-full border shadow-xs" style={{ backgroundColor: match.color }} />
                            <span className="font-medium text-stone-700">{match.name}</span>
                            <span className="font-bold text-stone-900 bg-stone-100/80 px-1 rounded">x{f.quantity}</span>
                          </span>
                        );
                      })}
                      {state.flowers.length === 0 && (
                        <span className="text-xxs text-stone-400 italic">No flowers selected yet. Click step 4 to generate or add stems.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SAVED RECENT CREATIONS GALLERIES */}
                {savedDesigns.length > 0 && (
                  <div className="bg-stone-100 rounded-3xl p-5 border border-stone-200">
                    <span className="text-xxs text-stone-500 uppercase tracking-widest font-semibold font-mono block mb-3">Saved Bouquet Registry ({savedDesigns.length})</span>
                    
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {savedDesigns.map((design) => (
                        <div
                          key={design.id}
                          onClick={() => handleLoadSaved(design)}
                          className="bg-white hover:bg-stone-50 border border-stone-200/80 px-3.5 py-2.5 rounded-xl flex items-center justify-between cursor-pointer group transition-all"
                        >
                          <div>
                            <span className="text-xs font-semibold text-stone-800 font-serif leading-none block">“{design.name}”</span>
                            <span className="text-[9px] text-stone-400 italic font-mono block mt-0.5">{design.date} • {design.tagline}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100">
                            <span className="text-[10px] font-mono text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full font-bold">Load</span>
                            <button
                              id={`delete-design-${design.id}`}
                              onClick={(e) => handleDeleteSaved(design.id, e)}
                              className="text-stone-400 hover:text-red-500 p-1 rounded-md"
                              title="Delete saved configuration"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 4. FOOTER CREDITS */}
      <footer className="mt-auto border-t border-stone-200/50 py-8 bg-[#FCFAF7] text-center text-xs text-stone-400">
        <p className="font-serif">CustomBouquet Floral Atelier & Emotional personalized Gifting.</p>
        <p className="font-mono text-xxs mt-2 text-stone-300">© 2026 CustomBouquet Inc. All rights reserved.</p>
      </footer>

      {/* Global Background music controller (invisible iframe or audios tag element matching user's intent) */}
      {isAudioPlaying && (
        <iframe
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1&playlist=jfKfPfyJRdk&controls=0&mute=0"
          className="w-0 h-0 absolute pointer-events-none"
          title="LoFi Instrumental Background Music"
          allow="autoplay"
        />
      )}

    </div>
  );
}
