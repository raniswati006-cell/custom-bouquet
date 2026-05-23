import React from 'react';
import { motion } from 'motion/react';
import { BouquetState } from '../types';

interface CalligraphyNoteEditorProps {
  state: BouquetState;
  onChange: (updater: (prev: BouquetState) => BouquetState) => void;
}

export default function CalligraphyNoteEditor({ state, onChange }: CalligraphyNoteEditorProps) {
  
  const FONT_FAMILIES = {
    romantic: 'font-[Brush_Script_MT,_cursive,_Playfair_Display]',
    cute: 'font-["Comic_Sans_MS",_cursive,_Outfit]',
    elegant: 'font-[Georgia,_serif,_Inter]',
    vintage: 'font-["Courier_New",_Courier,_monospace]',
  };

  const fonts = [
    { id: 'romantic', name: 'Luxury Cursive', category: 'Romantic', sample: 'Forever Yours' },
    { id: 'cute', name: 'Bubbly Sans', category: 'Cute', sample: 'Love you bunches!' },
    { id: 'elegant', name: 'Minimalist Serif', category: 'Elegant', sample: 'With deepest regard' },
    { id: 'vintage', name: 'Ink Calligraphy', category: 'Vintage', sample: 'Paris, June 1924' },
  ] as const;

  const papers = [
    { id: 'parchment', name: 'Aged Parchment', bg: 'bg-[#FDF6E2] border-[#EADBB7]' },
    { id: 'linen', name: 'Natural Linen Textures', bg: 'bg-white border-stone-200' },
    { id: 'pink', name: 'Blush Powder', bg: 'bg-rose-50 border-rose-200' },
    { id: 'lavender', name: 'Muted Lilac Sage', bg: 'bg-purple-50 border-purple-200' },
  ] as const;

  const waxSeals = [
    { id: 'none', name: 'No Seal', icon: '✕' },
    { id: 'rose', name: 'Rose Petal Seal', icon: '🌹' },
    { id: 'heart', name: 'Double Hearts', icon: '💖' },
    { id: 'double_rings', name: 'Golden Rings', icon: '💍' },
    { id: 'initial', name: 'Initial C Seal', icon: '📜' },
  ] as const;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(prev => ({ ...prev, noteMessage: val }));
  };

  const handleSelectFont = (fontId: typeof fonts[number]['id']) => {
    onChange(prev => ({ ...prev, noteFont: fontId }));
  };

  const handleSelectPaper = (paperId: string) => {
    onChange(prev => ({ ...prev, notePaperTexture: paperId }));
  };

  const handleSelectSeal = (sealId: string) => {
    onChange(prev => ({ ...prev, noteWaxSeal: sealId }));
  };

  const suggestionPhrases = [
    "Thank you for being my constant light in a dark world.",
    "Happy Birthday to the keeper of my keys and heart.",
    "My deepest thoughts remain with you across the distance.",
    "I'm sorry for the silence. Let this build a bridge of flowers.",
    "You make every single ordinary day feel like magic.",
  ];

  return (
    <div id="calligraphy-note-editor" className="bg-white/80 backdrop-blur-md border border-stone-100 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold font-mono block mb-2">Step 8 — Letterpress customisation</span>
        <h3 className="text-2xl font-serif text-stone-900 font-medium">Calligraphy Note Designer</h3>
        <p className="text-sm text-stone-500 mt-1">Compose a stunning printed note. Type below and preview the layout in real time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Controls */}
        <div className="space-y-6">
          
          {/* Note Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">Write message block</label>
              <span className="text-xxs text-stone-400">{state.noteMessage.length}/180 chars</span>
            </div>
            <textarea
              value={state.noteMessage}
              onChange={handleTextChange}
              maxLength={180}
              placeholder="Write your emotional messages here..."
              className="w-full h-32 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white resize-none transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Quick Suggestions helper */}
          <div>
            <span className="text-xxs font-semibold text-stone-500 uppercase tracking-wider block mb-2">Stuck? Dynamic Note suggestions</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {suggestionPhrases.map((phrase, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange(prev => ({ ...prev, noteMessage: phrase }))}
                  className="text-xxs bg-stone-100/80 hover:bg-pink-50 hover:text-pink-700 text-stone-600 px-3 py-1.5 rounded-full text-left transition-colors truncate max-w-full"
                >
                  “{phrase}”
                </button>
              ))}
            </div>
          </div>

          {/* Calligraphy Font Options */}
          <div>
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-2">Select calligraphy font</label>
            <div className="grid grid-cols-2 gap-2">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleSelectFont(f.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    state.noteFont === f.id
                      ? 'border-pink-300 bg-pink-50/50 text-pink-900 shadow-sm'
                      : 'border-stone-200/60 bg-white hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="text-xs font-medium text-stone-800">{f.name}</div>
                  <div className={`text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis ${FONT_FAMILIES[f.id]}`}>
                    {f.sample}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Paper Textures */}
          <div>
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-2">Paper texture backdrop</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {papers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPaper(p.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${p.bg} ${
                    state.notePaperTexture === p.id
                      ? 'ring-2 ring-emerald-600 ring-offset-2 scale-[1.02]'
                      : 'hover:opacity-90'
                  }`}
                >
                  <span className="text-xxs font-medium text-stone-800">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Wax Seals */}
          <div>
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-2">Add custom ribbon Wax Seal</label>
            <div className="grid grid-cols-5 gap-1.5">
              {waxSeals.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => handleSelectSeal(ws.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    state.noteWaxSeal === ws.id
                      ? 'border-red-400 bg-red-50 text-red-900 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <span className="text-sm">{ws.icon}</span>
                  <span className="text-[9px] mt-1 truncate max-w-full text-stone-500">{ws.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Visual Paper Preview */}
        <div className="flex flex-col items-center justify-center bg-stone-50/50 p-6 rounded-3xl border border-stone-200/50">
          <span className="text-xxs text-stone-400 uppercase tracking-widest mb-4">Letterpress note preview</span>
          
          <motion.div
            layout
            className={`w-full max-w-[340px] aspect-[1.5/1] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden transition-colors duration-500 ${
              state.notePaperTexture === 'parchment' ? 'bg-[#FCF5DC] border-[#E5D7AB]' :
              state.notePaperTexture === 'pink' ? 'bg-rose-50 border-rose-200' :
              state.notePaperTexture === 'lavender' ? 'bg-purple-50 border-purple-200' :
              'bg-white border-stone-200'
            } border`}
          >
            {/* Fine linen stripes watermark context */}
            {state.notePaperTexture === 'linen' && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
            )}

            {/* Vintage style faded corner motifs */}
            {state.notePaperTexture === 'parchment' && (
              <div className="absolute top-2 left-2 right-2 bottom-2 border border-dashed border-[#C5B585]/40 rounded pointer-events-none" />
            )}

            {/* Content writing section */}
            <div className="h-full flex flex-col justify-center">
              <motion.p 
                key={`${state.noteFont}-${state.noteMessage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`text-base sm:text-lg text-stone-800 leading-relaxed text-center italic tracking-wide overflow-hidden max-h-[140px] break-words ${FONT_FAMILIES[state.noteFont]}`}
              >
                {state.noteMessage || 'Your premium handwritten note content will be displayed beautifully here...'}
              </motion.p>
            </div>

            {/* Interactive wax seal visualization on note wrapper */}
            {state.noteWaxSeal !== 'none' && (
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 15 }}
                className="absolute bottom-4 right-4 flex items-center justify-center shadow-lg rounded-full"
              >
                {/* Visual Seal structure matching canvas */}
                <div className="w-10 h-10 rounded-full bg-red-800 border border-red-950 flex items-center justify-center relative shadow-md">
                  <div className="absolute inset-0.5 rounded-full border border-dashed border-red-500/25" />
                  <span className="text-base filter drop-shadow-md relative z-10">
                    {state.noteWaxSeal === 'rose' && '🌹'}
                    {state.noteWaxSeal === 'heart' && '💖'}
                    {state.noteWaxSeal === 'double_rings' && '💍'}
                    {state.noteWaxSeal === 'initial' && '📜'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Dynamic string or watermark */}
            <div className="absolute top-3 right-3 text-[9px] font-mono opacity-25">PREMIUM GIFTING</div>
          </motion.div>
          
          <div className="mt-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-xxs text-stone-500">Calligraphy note ties gracefully with {state.ribbonColor || 'selected'} ribbon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
