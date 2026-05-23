import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BouquetState, FLOWER_CATALOG, WRAPPERS, PALETTES, OCCASIONS, PERSONALITIES } from '../types';
import { Sparkles, ClipboardList, Check, Lock, ArrowRight, Eye, RefreshCw } from 'lucide-react';

interface AestheticBouquetCanvasProps {
  state: BouquetState;
  onUpdateState?: (updater: (prev: BouquetState) => BouquetState) => void;
  currentStep?: number;
  setStep?: (step: number) => void;
}

export default function AestheticBouquetCanvas({ state, currentStep = 1, setStep }: AestheticBouquetCanvasProps) {
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(true);

  const activePalette = useMemo(() => {
    return PALETTES.find(p => p.id === state.paletteId) || PALETTES[0];
  }, [state.paletteId]);

  const activeWrap = useMemo(() => {
    return WRAPPERS.find(w => w.id === state.wrappingStyle) || WRAPPERS[0];
  }, [state.wrappingStyle]);

  const activeOccasion = useMemo(() => {
    return OCCASIONS.find(o => o.id === state.occasion);
  }, [state.occasion]);

  const activePersonality = useMemo(() => {
    return PERSONALITIES.find(p => p.id === state.personality);
  }, [state.personality]);

  const totalFlowers = useMemo(() => {
    return state.flowers.reduce((sum, f) => sum + f.quantity, 0);
  }, [state.flowers]);

  const resolvedCraftStyle = useMemo(() => {
    switch (state.bouquetStyle) {
      case 'fresh': return `🌸 Fresh Buds (${state.size})`;
      case 'crochet': return `🧶 Wool Crochet (${state.size})`;
      case 'chocolate': return `🍫 Truffle Stick (${state.size})`;
      case 'pipecleaner': return `✨ Fuzzy Wire (${state.size})`;
      case 'mixed': return `⭐️ Mixed Craft (${state.size})`;
      default: return `🌸 Fresh Buds (${state.size})`;
    }
  }, [state.bouquetStyle, state.size]);

  // Expand individual flowers into a list for rendering coordinates
  const flowerList = useMemo(() => {
    const list: { typeId: string; color: string; rgb: string; name: string }[] = [];
    state.flowers.forEach(f => {
      const match = FLOWER_CATALOG.find(cat => cat.id === f.typeId);
      if (match) {
        for (let i = 0; i < f.quantity; i++) {
          list.push({
            typeId: f.typeId,
            color: match.color,
            rgb: match.rgb,
            name: match.name,
          });
        }
      }
    });
    return list;
  }, [state.flowers]);

  // Generate organic spiral-like coordinates for flowers
  const flowerCoordinates = useMemo(() => {
    const count = flowerList.length;
    const coords: { x: number; y: number; scale: number; angle: number; zIndex: number }[] = [];
    
    // Golden ratio spiral positioning to make bouquet crown look full and organic
    const phi = 137.5 * (Math.PI / 180);
    const startRadius = 25;
    const maxRadius = count > 15 ? 120 : count > 8 ? 95 : 70;
    
    for (let i = 0; i < count; i++) {
      // Avoid index 0 being completely empty, distribute radius
      const factor = count <= 1 ? 0 : i / (count - 1);
      const r = startRadius + Math.pow(factor, 0.6) * maxRadius;
      const theta = i * phi + (i * 0.1); // Add slight shift
      
      const x = 200 + r * Math.sin(theta);
      const y = 175 - (r * 0.45) * Math.cos(theta); // Squashed layout for vertical perspective
      
      // Random subtle rotation & sizing variation
      const scale = 0.85 + (Math.sin(i * 1.7) * 0.12);
      const angle = (Math.sin(i * 2.3) * 20);
      
      // Lower y coordinates represent flowers closer to the viewer, so they should render on top
      coords.push({ x, y, scale, angle, zIndex: Math.round(y) });
    }

    // Sort coordinates by y value ascending so layered back-to-front rendering works
    return coords.map((co, index) => ({ ...co, info: flowerList[index] })).sort((a, b) => a.y - b.y);
  }, [flowerList]);

  // Flower SVG Render Helpers
  const renderFlowerNode = (typeId: string, color: string, style: string) => {
    const isCrochet = style === 'crochet';
    const isChocolate = style === 'chocolate';
    const isPipeCleaner = style === 'pipecleaner';

    // Style overrides
    const strokeWidth = isCrochet ? '3' : isPipeCleaner ? '2.5' : '1';
    const strokeColor = isCrochet ? '#475569' : isPipeCleaner ? '#4a5d4e' : 'rgba(0,0,0,0.15)';
    const strokeDashArray = isCrochet ? '3 3' : 'none';

    if (isChocolate) {
      // Golden hazelnut chocolate truffle on sticks
      return (
        <g>
          {/* Stem/Stick */}
          <line x1="0" y1="0" x2="0" y2="40" stroke="#78350F" strokeWidth="2.5" />
          {/* Gold wrapper details */}
          <circle cx="0" cy="0" r="18" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
          {/* Ruffled paper container brown */}
          <path d="M -15,5 Q -8,12 0,10 Q 8,12 15,5 L 18,15 Q 0,22 -18,15 Z" fill="#451A03" />
          {/* Foil sparkle logo dots */}
          <circle cx="-5" cy="-5" r="2.5" fill="#FEF3C7" opacity="0.8" />
          <circle cx="4" cy="2" r="2" fill="#FEF3C7" opacity="0.6" />
        </g>
      );
    }

    switch (typeId) {
      case 'red-rose':
      case 'pink-rose':
      case 'yellow-rose':
        return (
          <g>
            {/* outer leafy support */}
            <path d="M -22,5 C -15,18 15,18 22,5 C 26,-8 0,-5 -22,5 Z" fill="#2F5233" opacity="0.4" />
            {/* outermost rose petals */}
            <circle cx="0" cy="0" r="20" fill={color} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={strokeDashArray} />
            {/* middle petal structures */}
            <path d="M -16,-5 C -20,12 18,13 15,-6 C 18,-18 -15,-18 -16,-5 Z" fill={color} filter="brightness(0.92)" stroke={strokeColor} strokeWidth={strokeWidth} />
            <path d="M -11,8 C 15,15 15,-12 -8,-10" fill="none" stroke={strokeColor} strokeWidth={Number(strokeWidth) + 1} />
            {/* inner swirl */}
            <path d="M -6,-6 C -12,5 8,10 6,-4 C 4,-12 -6,2 -2,-4" fill="none" stroke={isCrochet ? '#475569' : "rgba(255,255,255,0.45)"} strokeWidth="2" />
            {/* rose spiral core */}
            <circle cx="0" cy="0" r="6" fill={color} filter="brightness(0.8)" stroke={strokeColor} strokeWidth="1" />
            <circle cx="-1" cy="1" r="3.5" fill={color} filter="brightness(0.7)" />
          </g>
        );
      case 'pink-tulip':
        return (
          <g>
            {/* Tulip cup shape layered left and right petals */}
            <path d="M -18,12 C -22,-12 -2,-24 0,-10 C 2,-24 22,-12 18,12 C 12,24 -12,24 -18,12 Z" fill={color} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={strokeDashArray} />
            {/* Left overlay petal */}
            <path d="M -16,10 C -18,-5 -4,-18 0,-6 C -5,12 -12,18 -16,10 Z" fill={color} filter="brightness(0.93)" />
            {/* Right overlay petal */}
            <path d="M 16,10 C 18,-5 4,-18 0,-6 C 5,12 12,18 16,10 Z" fill={color} filter="brightness(0.86)" />
            {/* Center pistil peeking */}
            <ellipse cx="0" cy="-6" rx="3.5" ry="5.5" fill="#FEF08A" opacity="0.9" />
          </g>
        );
      case 'white-lily':
        return (
          <g>
            {/* Star array of 6 elegant elongated lily petals */}
            <g transform="rotate(0)">
              <path d="M 0,0 C -8,-15 -4,-30 0,-40 C 4,-30 8,-15 0,0" fill="#FCFCFC" stroke={strokeColor} strokeWidth="0.8" />
            </g>
            <g transform="rotate(60)">
              <path d="M 0,0 C -8,-15 -4,-30 0,-40 C 4,-30 8,-15 0,0" fill="#FAFAFA" stroke={strokeColor} strokeWidth="0.8" />
            </g>
            <g transform="rotate(120)">
              <path d="M 0,0 C -8,-15 -4,-30 0,-40 C 4,-30 8,-15 0,0" fill="#FFF5F5" stroke={strokeColor} strokeWidth="0.8" />
            </g>
            <g transform="rotate(180)">
              <path d="M 0,0 C -8,-15 -4,-30 0,-40 C 4,-30 8,-15 0,0" fill="#FCFCFC" stroke={strokeColor} strokeWidth="0.8" />
            </g>
            <g transform="rotate(240)">
              <path d="M 0,0 C -8,-15 -4,-30 0,-40 C 4,-30 8,-15 0,0" fill="#FAFAFA" stroke={strokeColor} strokeWidth="0.8" />
            </g>
            <g transform="rotate(300)">
              <path d="M 0,0 C -8,-15 -4,-30 0,-40 C 4,-30 8,-15 0,0" fill="#FCFCFC" stroke={strokeColor} strokeWidth="0.8" />
            </g>
            {/* Star stamens */}
            <line x1="0" y1="0" x2="-6" y2="-12" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="6" y2="-12" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="-10" y2="2" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="10" y2="2" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="5" fill="#E2E8F0" />
            <circle cx="0" cy="0" r="3.5" fill="#A1A1AA" />
          </g>
        );
      case 'sunflower':
        return (
          <g>
            {/* Pointy outer yellow petals (24 nodes) */}
            {Array.from({ length: 16 }).map((_, i) => (
              <path
                key={i}
                d="M 0,0 C -5,-12 -2,-25 0,-30 C 2,-25 5,-12 0,0"
                fill={color}
                stroke="#D97706"
                strokeWidth="0.5"
                transform={`rotate(${i * (360 / 16)})`}
              />
            ))}
            {/* Smaller inner layer petals */}
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={`inner-${i}`}
                d="M 0,0 C -4,-8 -1,-18 0,-21 C 1,-18 4,-8 0,0"
                fill="#FBBF24"
                transform={`rotate(${i * (360 / 12) + 15})`}
              />
            ))}
            {/* Rich brown seeds center disk with texture */}
            <circle cx="0" cy="0" r="14" fill="#451A03" stroke="#1E1B4B" strokeWidth="1" />
            <circle cx="0" cy="0" r="10" fill="#271105" strokeDasharray="2 2" stroke="#FEF08A" strokeWidth="1" />
            {/* tiny yellow pollen ring */}
            <circle cx="0" cy="0" r="8" fill="none" stroke="#CA8A04" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
          </g>
        );
      case 'lavender':
        return (
          <g>
            {/* Stem */}
            <line x1="0" y1="-30" x2="0" y2="30" stroke="#4D7C0F" strokeWidth="2.5" />
            {/* Puffs of lavender beads stacked vertically */}
            <g transform="translate(0, -20)">
              <ellipse cx="-4" cy="0" rx="5" ry="4" fill={color} stroke={strokeColor} strokeWidth="0.5" />
              <ellipse cx="4" cy="0" rx="5" ry="4" fill={color} stroke={strokeColor} strokeWidth="0.5" />
              <circle cx="0" cy="-2" r="4.5" fill="#C084FC" />
            </g>
            <g transform="translate(0, -9)">
              <ellipse cx="-5" cy="0" rx="5.5" ry="4" fill={color} stroke={strokeColor} strokeWidth="0.5" />
              <ellipse cx="5" cy="0" rx="5.5" ry="4" fill={color} stroke={strokeColor} strokeWidth="0.5" />
              <circle cx="0" cy="-1" r="5" fill="#8B5CF6" />
            </g>
            <g transform="translate(0, 2)">
              <ellipse cx="-5" cy="0" rx="5.5" ry="4" fill={color} stroke={strokeColor} strokeWidth="0.5" />
              <ellipse cx="5" cy="0" rx="5.5" ry="4" fill={color} stroke={strokeColor} strokeWidth="0.5" />
              <circle cx="0" cy="-1" r="5" fill="#7C3AED" />
            </g>
            <g transform="translate(0, 13)">
              <circle cx="-4" cy="0" r="4.5" fill={color} />
              <circle cx="4" cy="0" r="4.5" fill={color} />
            </g>
          </g>
        );
      case 'blue-hydrangea':
        return (
          <g>
            {/* Hydrangea compound head made of sweet 4-petal groups */}
            <circle cx="0" cy="0" r="23" fill={color} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={strokeDashArray} />
            {/* Layout miniature petal crosses randomly or in structured positions */}
            <g transform="translate(-10, -10) scale(0.7)">
              <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#93C5FD" opacity="0.9" />
              <circle cx="0" cy="0" r="2" fill="#FFF" />
            </g>
            <g transform="translate(10, -7) scale(0.65) rotate(15)">
              <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#A5B4FC" opacity="0.9" />
              <circle cx="0" cy="0" r="2" fill="#FFF" />
            </g>
            <g transform="translate(-6, 11) scale(0.7) rotate(45)">
              <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#3B82F6" opacity="0.85" />
              <circle cx="0" cy="0" r="2" fill="#FFEDD5" />
            </g>
            <g transform="translate(8, 9) scale(0.6) rotate(30)">
              <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#60A5FA" opacity="0.9" />
              <circle cx="0" cy="0" r="2" fill="#FFF" />
            </g>
            <g transform="translate(0, -1) scale(0.75)">
              <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#818CF8" />
              <circle cx="0" cy="0" r="2.5" fill="#FCD34D" />
            </g>
          </g>
        );
      case 'white-daisy':
        return (
          <g>
            {/* 12 radial petals */}
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-16"
                rx="4.5"
                ry="11"
                fill="#FFFFFF"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                transform={`rotate(${i * 30})`}
              />
            ))}
            {/* bright sunflower like center button */}
            <circle cx="0" cy="0" r="8" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
            <circle cx="1.5" cy="-1.5" r="4.5" fill="#FDE047" opacity="0.6" />
          </g>
        );
      case 'carnation':
        return (
          <g>
            {/* Layered ruffly carnation petals using complex path intersections or grouped scales */}
            <g scale="1">
              <circle cx="0" cy="0" r="21" fill={color} opacity="0.65" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={strokeDashArray} />
              {/* Petal cluster ripples */}
              <path d="M-12,-12 C-15,-5 -18,8 -10,14 C-2,18 12,12 16,3 C18,-8 5,-15 -12,-12 Z" fill={color} filter="brightness(0.96)" />
              <path d="M-5,-15 C12,-18 18,-5 12,8 C6,15 -12,12 -12,-2 C-8,-10 -6,-12 -5,-15 Z" fill={color} filter="brightness(1.08)" />
              <path d="M-10,5 C0,15 15,5 8,-7 C2,-12 -12,-6 -10,5 Z" fill={color} filter="brightness(0.85)" />
            </g>
            <circle cx="0" cy="0" r="5" fill="#FDA4AF" opacity="0.8" />
          </g>
        );
      case 'orchid':
        return (
          <g>
            {/* Asymmetric sophisticated structure */}
            <path d="M -22,-6 C -30,-22 -10,-28 0,-14 C 10,-28 30,-22 22,-6 C 14,10 -14,10 -22,-6 Z" fill={color} stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Two large sideways flutter wing petals */}
            <ellipse cx="-15" cy="-2" rx="13" ry="10" fill={color} filter="brightness(1.15)" transform="rotate(-15 -15 -2)" />
            <ellipse cx="15" cy="-2" rx="13" ry="10" fill={color} filter="brightness(1.15)" transform="rotate(15 15 -2)" />
            {/* Middle complex lip/tongue */}
            <path d="M -8,5 C -10,18 10,18 8,5 C 4,-2 -4,-2 -8,5 Z" fill="#F43F5E" />
            <circle cx="0" cy="8" r="3.5" fill="#FDE047" />
          </g>
        );
      default:
        // Basic fallback bloom
        return (
          <ellipse cx="0" cy="0" rx="18" ry="18" fill={color || '#F472B6'} stroke={strokeColor} strokeWidth="1" />
        );
    }
  };

  // Ribbon ribbonStyle class properties
  const ribbonColorHex = useMemo(() => {
    const defaultColor = activePalette.hexes[3] || '#FBCFE8';
    if (state.ribbonColor.toLowerCase().includes('cream') || state.ribbonColor.toLowerCase().includes('ivory')) {
      return '#FFFBEB';
    }
    if (state.ribbonColor.toLowerCase().includes('gold') || state.ribbonColor.toLowerCase().includes('sunset')) {
      return '#F59E0B';
    }
    if (state.ribbonColor.toLowerCase().includes('charcoal')) {
      return '#1E293B';
    }
    if (state.ribbonColor.toLowerCase().includes('red') || state.ribbonColor.toLowerCase().includes('burgundy')) {
      return '#BE123C';
    }
    if (state.ribbonColor.toLowerCase().includes('sage') || state.ribbonColor.toLowerCase().includes('green')) {
      return '#6B7280'; // earth tone
    }
    return defaultColor;
  }, [state.ribbonColor, activePalette]);

  const isDarkTheme = activePalette.id === 'luxury-black';

  const specItems = [
    {
      stepId: 1,
      label: '1. Occasion',
      value: activeOccasion ? `${activeOccasion.emoji} ${activeOccasion.name}` : 'Awaiting choice...',
      isCompleted: currentStep > 1 || (currentStep === 1 && state.occasion),
      isActive: currentStep === 1,
    },
    {
      stepId: 2,
      label: '2. Recipient Style',
      value: activePersonality ? `✨ ${activePersonality.name}` : 'Awaiting style...',
      isCompleted: currentStep > 2 || (currentStep === 2 && state.personality),
      isActive: currentStep === 2,
    },
    {
      stepId: 3,
      label: '3. Emotion Intent',
      value: state.emotion ? `💖 "${state.emotion === 'Custom Message' ? (state.customMessage || 'Personal Accent') : state.emotion}"` : 'Awaiting devotion...',
      isCompleted: currentStep > 3 || (currentStep === 3 && state.emotion),
      isActive: currentStep === 3,
    },
    {
      stepId: 4,
      label: '4. Flower Recipe',
      value: totalFlowers > 0 ? `💐 ${totalFlowers} stems (${state.flowers.length} families)` : 'Awaiting selection...',
      isCompleted: currentStep > 4 || (currentStep === 4 && totalFlowers > 0),
      isActive: currentStep === 4,
    },
    {
      stepId: 5,
      label: '5. Bouquet Craft',
      value: resolvedCraftStyle,
      isCompleted: currentStep > 5,
      isActive: currentStep === 5,
    },
    {
      stepId: 6,
      label: '6. Outer Wrap',
      value: state.wrappingStyle ? `🎀 ${activeWrap ? activeWrap.name : 'Selected'}` : 'Awaiting wrapper...',
      isCompleted: currentStep > 6 || (currentStep === 6 && state.wrappingStyle),
      isActive: currentStep === 6,
    },
    {
      stepId: 7,
      label: '7. Palette & Bow',
      value: state.paletteId ? `🎨 ${activePalette.name} (${state.ribbonColor || 'No Bow'})` : 'Awaiting ties...',
      isCompleted: currentStep > 7 || (currentStep === 7 && state.paletteId),
      isActive: currentStep === 7,
    },
    {
      stepId: 8,
      label: '8. Written Letter',
      value: state.noteMessage ? `✍️ Wax Sealed Parchment` : 'Awaiting penmanship...',
      isCompleted: currentStep > 8 || (currentStep === 8 && state.noteMessage),
      isActive: currentStep === 8,
    }
  ];

  return (
    <div className={`relative w-full h-[370px] sm:h-[450px] rounded-3xl overflow-hidden shadow-inner flex items-center justify-center p-4 bg-gradient-to-b ${activePalette.id === 'luxury-black' ? 'from-slate-900 to-slate-950 text-white' : 'from-stone-50/50 to-neutral-100/90'}`}>
      
      {/* 2D Bouquet Canvas live blueprint checklist drawer */}
      <div className="absolute left-3 top-3 bottom-3 z-20 flex pointer-events-none">
        <motion.div 
          animate={{ width: isSpecsExpanded ? 240 : 0, opacity: isSpecsExpanded ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 25 }}
          className={`h-full bg-white/90 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/60 dark:border-stone-800/80 shadow-lg rounded-2xl flex flex-col pointer-events-auto overflow-hidden ${
            isDarkTheme ? 'text-stone-200' : 'text-stone-850'
          }`}
        >
          <div className="p-3 border-b border-stone-200/50 dark:border-stone-800/60 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ClipboardList className={`w-3.5 h-3.5 shrink-0 ${isDarkTheme ? 'text-amber-400' : 'text-pink-600'}`} />
              <span className="text-[10px] font-mono tracking-widest font-bold uppercase">ATELIER SPECS № CRM-0{state.occasion ? state.occasion.length : 8}</span>
            </div>
            <span className="text-[8px] font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-stone-500 uppercase shrink-0">
              ST {currentStep}/8
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin">
            {specItems.map((item) => {
              const showOriginalValue = item.isCompleted || item.isActive;
              return (
                <div
                  key={item.stepId}
                  onClick={() => setStep && setStep(item.stepId)}
                  className={`group p-2 rounded-xl transition-all text-left flex items-start gap-2 ${
                    item.isActive 
                      ? 'bg-pink-100/50 dark:bg-pink-950/20 border border-pink-200/50 dark:border-pink-900/50 shadow-xs' 
                      : item.isCompleted
                        ? 'hover:bg-stone-100/70 dark:hover:bg-stone-800/50 border border-transparent cursor-pointer'
                        : 'opacity-40'
                  }`}
                >
                  {/* Circle Step icon with checklist status */}
                  <div className="mt-0.5 shrink-0">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      item.isActive
                        ? 'bg-pink-500 text-white animate-pulse'
                        : item.isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                    }`}>
                      {item.isCompleted ? (
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      ) : (
                        <span className="text-[8px] font-bold font-mono">{item.stepId}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500 uppercase tracking-wider block leading-none">
                        {item.label}
                      </span>
                      {setStep && item.isCompleted && (
                        <span className="text-[8px] font-semibold text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                          Edit <ArrowRight className="w-2 h-2 animate-bounce-right" />
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] leading-tight font-sans truncate font-medium mt-0.5 ${
                      item.isActive
                        ? 'text-pink-600 dark:text-pink-400 font-semibold'
                        : item.isCompleted
                          ? 'text-stone-800 dark:text-stone-200'
                          : 'text-stone-400 dark:text-stone-500 italic'
                    }`}>
                      {showOriginalValue ? item.value : 'Awaiting creation...'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {setStep && (
            <div className="p-2 bg-stone-50/50 dark:bg-stone-900 border-t border-stone-200/40 dark:border-stone-800/40 shrink-0 text-center">
              <p className="text-[8.5px] text-stone-400 font-medium">
                💡 Click any row to jump back & refine
              </p>
            </div>
          )}
        </motion.div>

        {/* Floating toggle bar button trigger */}
        <div className="flex flex-col justify-start pt-1.5 ml-2">
          <button
            type="button"
            onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
            className="pointer-events-auto rounded-full w-8 h-8 flex items-center justify-center shadow-md border bg-white border-stone-200/80 hover:bg-stone-50 text-stone-600 dark:bg-stone-900 dark:border-stone-800 dark:hover:bg-stone-800 dark:text-stone-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={isSpecsExpanded ? "Collapse Atelier Spec Sheet" : "Expand Atelier Spec Sheet"}
          >
            {isSpecsExpanded ? (
              <Eye className="w-4 h-4 text-stone-500 dark:text-stone-400" />
            ) : (
              <ClipboardList className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            )}
          </button>
        </div>
      </div>

      {/* Background radial highlight glow based on palette */}
      <div 
        className="absolute w-72 h-72 rounded-full filter blur-[100px] opacity-40 mix-blend-multiply transition-all duration-700"
        style={{
          backgroundColor: activePalette.hexes[1] || '#FCE7F3',
          left: 'calc(50% - 9rem)',
          top: 'calc(50% - 9rem)'
        }}
      />

      <svg 
        id="bouquet-vector-svg animate"
        viewBox="0 0 400 450" 
        className="w-full h-full max-w-[380px] drop-shadow-xl relative z-10"
      >
        <defs>
          <radialGradient id="goldGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </radialGradient>
          
          <linearGradient id="wrapperShade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={activePalette.hexes[0] || "#FFF"} />
            <stop offset="60%" stopColor={activePalette.hexes[1] || "#FCE7F3"} />
            <stop offset="100%" stopColor={activePalette.hexes[2] || "#FDA4AF"} />
          </linearGradient>

          <linearGradient id="wrapperFront" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={activePalette.hexes[1] || "#FCE7F3"} stopOpacity="0.95" />
            <stop offset="100%" stopColor={activePalette.hexes[2] || "#FDA4AF"} stopOpacity="0.85" />
          </linearGradient>

          {/* Paper texture patterns */}
          <pattern id="vintageNewsprint" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="#FDFBF7" />
            <text x="5" y="15" fontSize="6" fontFamily="Courier" fill="#78350F" opacity="0.35">CustomBouquet Special Edition</text>
            <text x="5" y="30" fontSize="5" fontFamily="Times New Roman" fill="#5F3E1E" opacity="0.4">LE GRAND SOUVENIR D'AMOUR</text>
            <line x1="5" y1="35" x2="95" y2="35" stroke="#78350F" strokeWidth="0.5" opacity="0.3" />
            <text x="5" y="45" fontSize="4.5" fontFamily="Georgia" fill="#1E293B" opacity="0.3">Pour toujours, nous célébrons le parfum des fleurs fines.</text>
            <text x="5" y="60" fontSize="5" fontFamily="Courier" fill="#78350F" opacity="0.35">Seoul • Paris • New York</text>
            <line x1="5" y1="65" x2="95" y2="65" stroke="#78350F" strokeWidth="0.5" opacity="0.3" />
            <text x="5" y="78" fontSize="4.5" fontFamily="Georgia" fill="#1E293B" opacity="0.3">A romantic journey crafted beautifully based on emotions.</text>
          </pattern>
          
          <pattern id="crochetGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.5" fill="none" stroke={activePalette.hexes[2]} strokeWidth="0.5" opacity="0.5" />
            <line x1="0" y1="5" x2="10" y2="5" stroke={activePalette.hexes[1]} strokeWidth="0.5" opacity="0.3" />
            <line x1="5" y1="0" x2="5" y2="10" stroke={activePalette.hexes[1]} strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>

        {/* 1. BACK WRAPPING PAPER LAYERS (Slightly larger, acts as backdrop) */}
        <g id="back-wraps" className="transition-opacity duration-300">
          {state.wrappingStyle === 'transparent-wrap' ? (
            // Glass Wrap back flaps
            <>
              <path d="M 120,240 Q 60,60 190,70 Q 200,10 210,70 Q 340,60 280,240 Z" fill="rgba(255, 255, 255, 0.4)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              <path d="M 100,180 Q 140,50 200,90 Q 260,50 300,180 Z" fill="rgba(255, 255, 255, 0.25)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            </>
          ) : (
            // Layered structural wrap
            <>
              {/* Back flap left */}
              <motion.path 
                initial={{ rotate: -5, scale: 0.95 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                d="M 60,140 Q 100,40 220,110 L 200,320 Z" 
                fill={state.wrappingStyle === 'vintage-news' ? "url(#vintageNewsprint)" : "url(#wrapperShade)"} 
                stroke="rgba(0,0,0,0.05)" 
              />
              {/* Back flap right */}
              <motion.path 
                initial={{ rotate: 5, scale: 0.95 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                d="M 340,140 Q 300,40 180,110 L 200,320 Z" 
                fill={state.wrappingStyle === 'vintage-news' ? "url(#vintageNewsprint)" : "url(#wrapperShade)"} 
                stroke="rgba(0,0,0,0.05)" 
                filter="brightness(0.95)"
              />
              {/* Cozy crochet grid decoration */}
              {state.bouquetStyle === 'crochet' && (
                <path d="M 100,100 C 150,60 250,60 300,100 L 200,310 Z" fill="url(#crochetGrid)" />
              )}
            </>
          )}
        </g>

        {/* 2. ORGANIC GREEN STEMS AND LEAVES BUNDLE (Hidden below but peeks through) */}
        <g id="stems-and-leaves">
          <path d="M 180,220 L 160,370 M 195,220 L 190,380 M 210,220 L 240,370" stroke="#3F6212" strokeWidth="6" strokeLinecap="round" />
          <path d="M 190,220 L 210,380 M 205,220 L 175,375" stroke="#4D7C0F" strokeWidth="4.5" strokeLinecap="round" />
          
          {/* Decorative Eucalyptus leaves peeking */}
          <path d="M 120,170 Q 90,140 130,120 C 140,140 135,160 120,170 Z" fill="#6B8E8E" opacity="0.8" />
          <path d="M 280,170 Q 310,140 270,120 C 260,140 265,160 280,170 Z" fill="#6B8E8E" opacity="0.8" />
          <path d="M 160,130 C 130,100 140,80 170,110 Z" fill="#4B6F44" opacity="0.6" />
          <path d="M 230,120 C 260,95 245,75 220,105 Z" fill="#4B6F44" opacity="0.6" />
        </g>

        {/* 3. FLOWER BLOOMS ENGINE (Positioned via dynamic spiral coordinates) */}
        <g id="flower-blooms">
          {flowerCoordinates.map((flower, idx) => (
            <motion.g
              key={`${flower.info.typeId}-${idx}`}
              initial={{ opacity: 0, scale: 0, y: flower.y + 40 }}
              animate={{ opacity: 1, scale: flower.scale, y: flower.y }}
              transition={{ 
                type: 'spring',
                stiffness: 110,
                damping: 14,
                delay: Math.min(idx * 0.04, 0.8)
              }}
              transform={`translate(${flower.x}, 0) rotate(${flower.angle})`}
            >
              {renderFlowerNode(flower.info.typeId, flower.info.color, state.bouquetStyle)}
            </motion.g>
          ))}
        </g>

        {/* 4. FRONT COLLAR / LOWER WRAPPING WRAP LAYER (Korean elegant folds) */}
        <g id="front-wraps">
          {state.wrappingStyle === 'transparent-wrap' ? (
            <path d="M 90,200 Q 200,230 310,200 L 230,340 Q 200,360 170,340 Z" fill="rgba(255, 255, 255, 0.4)" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          ) : (
            // Korean stylish overlay wraps
            <>
              {/* Lower wrapper left diagonal fold */}
              <motion.path 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                d="M 80,190 Q 150,220 230,190 L 160,340 Q 110,280 80,190 Z" 
                fill={state.wrappingStyle === 'vintage-news' ? "url(#vintageNewsprint)" : "url(#wrapperFront)"} 
                filter="brightness(0.97)"
                stroke="rgba(0,0,0,0.06)"
              />
              {/* Lower wrapper right diagonal overlay */}
              <motion.path 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                d="M 320,190 Q 250,220 170,190 L 240,340 Q 290,280 320,190 Z" 
                fill={state.wrappingStyle === 'vintage-news' ? "url(#vintageNewsprint)" : "url(#wrapperFront)"} 
                filter="brightness(0.93)"
                stroke="rgba(0,0,0,0.06)"
              />
              {/* Center cute cover piece */}
              <path d="M 130,210 Q 200,240 270,210 L 220,340 L 180,340 Z" fill={state.wrappingStyle === 'vintage-news' ? "url(#vintageNewsprint)" : "url(#wrapperFront)"} filter="brightness(1.02)" />
              
              {/* If glitter, render subtle sparkles */}
              {state.wrappingStyle === 'glitter-wrap' && (
                <>
                  <circle cx="120" cy="245" r="1.5" fill="#FFF" className="animate-pulse" />
                  <circle cx="280" cy="235" r="1" fill="#FEF08A" className="animate-pulse" />
                  <circle cx="190" cy="280" r="1.5" fill="#FFF" className="animate-pulse" />
                  <polygon points="210,240 212,243 215,244 212,245 211,248 210,245 207,244 210,243" fill="#FFF" />
                  <polygon points="150,280 151.5,283 154,284 151.5,285 150,288 148.5,285 146,284 148.5,283" fill="#FFE4E6" />
                </>
              )}
            </>
          )}
        </g>

        {/* 5. THE WRAPPED RIBBON BOW / STRING TIE */}
        <g id="ribbons" className="transition-all duration-300">
          {/* Ribbon strings passing behind */}
          <rect x="155" y="325" width="90" height="15" rx="3" fill={ribbonColorHex} opacity="0.95" stroke="rgba(0,0,0,0.05)" />
          
          {/* Satin premium bow circles */}
          <motion.g 
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            transform="translate(200, 332)"
          >
            {state.ribbonStyle === 'sheer' ? (
              // Transparent double loop sheer organza
              <>
                <ellipse cx="-20" cy="-4" rx="24" ry="14" fill={ribbonColorHex} opacity="0.6" stroke={ribbonColorHex} strokeWidth="1" transform="rotate(-15)" />
                <ellipse cx="20" cy="-4" rx="24" ry="14" fill={ribbonColorHex} opacity="0.6" stroke={ribbonColorHex} strokeWidth="1" transform="rotate(15)" />
                <ellipse cx="-14" cy="-2" rx="16" ry="8" fill="#FFF" opacity="0.4" transform="rotate(-15)" />
                <ellipse cx="14" cy="-2" rx="16" ry="8" fill="#FFF" opacity="0.4" transform="rotate(15)" />
              </>
            ) : (
              // Classic thick rich satin/grosgrain loops
              <>
                <path d="M 0,0 C -15,-15 -45,-15 -40,5 C -35,20 -10,12 0,0" fill={ribbonColorHex} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                <path d="M 0,0 C 15,-15 45,-15 40,5 C 35,20 10,12 0,0" fill={ribbonColorHex} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                {/* Ribbon tails drape curves gracefully */}
                <path d="M -8,2 L -35,55 Q -40,65 -30,60 L -5,12 Z" fill={ribbonColorHex} filter="brightness(0.9)" />
                <path d="M 8,2 L 35,55 Q 40,65 30,60 L 5,12 Z" fill={ribbonColorHex} filter="brightness(0.9)" />
              </>
            )}
            
            {/* Center ribbon knot */}
            <circle cx="0" cy="0" r="9" fill={ribbonColorHex} filter="brightness(1.05)" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
            {state.ribbonStyle === 'grosgrain' && (
              // Fine rib lines for grosgrain
              <line x1="-6" y1="0" x2="6" y2="0" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" strokeDasharray="1.5 1" />
            )}
          </motion.g>
        </g>

        {/* 6. AESTHETIC NOTES/LETTER TAG ATTACHED */}
        {state.noteMessage && (
          <motion.g
            initial={{ opacity: 0, x: 20, y: 350, scale: 0.6 }}
            animate={{ opacity: 1, x: 235, y: 300, scale: 0.85, rotate: 12 }}
            transition={{ type: 'spring', delay: 0.45 }}
          >
            {/* Note Paper Background */}
            <rect 
              x="0" 
              y="0" 
              width="85" 
              height="55" 
              rx="4" 
              fill={
                state.notePaperTexture === 'parchment' ? '#FDF6E2' :
                state.notePaperTexture === 'pink' ? '#FFF1F2' :
                state.notePaperTexture === 'lavender' ? '#FAF5FF' :
                '#FFF'
              } 
              className="shadow-xl" 
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            {/* Soft grid/linen overlay lines if linen is chosen */}
            {state.notePaperTexture === 'linen' && (
              <>
                <line x1="0" y1="12" x2="85" y2="12" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="0" y1="24" x2="85" y2="24" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="0" y1="36" x2="85" y2="36" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="0" y1="48" x2="85" y2="48" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="1 1" />
              </>
            )}

            {/* Simulated mini text strings */}
            <g transform="translate(8, 12)">
              <rect x="0" y="0" width="60" height="2.5" rx="1" fill="#64748B" opacity="0.6" />
              <rect x="0" y="7" width="50" height="2.5" rx="1" fill="#64748B" opacity="0.6" />
              <rect x="0" y="14" width="55" height="2.5" rx="1" fill="#64748B" opacity="0.6" />
            </g>

            {/* Luxury Custom Wax Seal icon */}
            {state.noteWaxSeal !== 'none' && (
              <g transform="translate(68, 40) scale(0.9)" className="cursor-pointer">
                {/* Ruffled outer wax seal pool circle */}
                <circle cx="0" cy="0" r="8" fill="#991B1B" />
                <path d="M-6,-4 C-8,1 -7,6 -3,7 C2,8 7,5 6,-2 C5,-7 -3,-7 -6,-4 Z" fill="#991B1B" opacity="0.9" filter="brightness(0.8)" />
                {/* Inner smooth circle holding seal emblem */}
                <circle cx="0" cy="0" r="5" fill="#7F1D1D" />
                
                {state.noteWaxSeal === 'rose' && (
                  <path d="M-2.5,-1 Q-2,-2.5 0,-2.5 Q2,-2.5 2.5,-1 Q1,2 0,2 Z" fill="#F87171" transform="scale(0.8)" />
                )}
                {state.noteWaxSeal === 'heart' && (
                  <path d="M-3,-2 C-3,-4 0,-4 0,-2 C0,-4 3,-4 3,-2 C3,0 0,3 0,3 C0,3 -3,0 -3,-2 Z" fill="#F87171" transform="scale(0.8)" />
                )}
                {state.noteWaxSeal === 'double_rings' && (
                  <>
                    <circle cx="-1" cy="0" r="2" fill="none" stroke="#FBBF24" strokeWidth="0.8" />
                    <circle cx="1.5" cy="0" r="2" fill="none" stroke="#FBBF24" strokeWidth="0.8" />
                  </>
                )}
                {state.noteWaxSeal === 'initial' && (
                  <text x="-2" y="2.5" fontSize="6.5" fill="#FFF" fontWeight="bold" fontFamily="serif">C</text>
                )}
              </g>
            )}

            {/* Fine string tie tying note card to ribbon */}
            <path d="M -2,8 C -15,5 -30,12 -38,20" fill="none" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="2 2" />
          </motion.g>
        )}
      </svg>
      
      {/* Dynamic Ribbon Bow overlay visual indicator */}
      <span className="absolute bottom-5 right-5 text-xxs font-mono flex items-center gap-1.5 opacity-60">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Interactive 2D preview
      </span>
    </div>
  );
}
