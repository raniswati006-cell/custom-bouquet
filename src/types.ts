export interface Occasion {
  id: string;
  name: string;
  emoji: string;
  colorTheme: string; // e.g. 'purple', 'rose', 'sage'
  description: string;
}

export interface Personality {
  id: string;
  name: string;
  description: string;
  tagline: string;
}

export interface FlowerType {
  id: string;
  name: string;
  symbolism: string;
  color: string;
  rgb: string;
}

export interface WrapperStyle {
  id: string;
  name: string;
  description: string;
  styleClass: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  hexes: string[];
}

export interface BouquetState {
  occasion: string;
  personality: string;
  emotion: string;
  customMessage: string;
  bouquetStyle: string; // 'fresh' | 'crochet' | 'chocolate' | 'pipecleaner' | 'mixed'
  size: 'small' | 'medium' | 'large';
  wrappingStyle: string;
  paletteId: string;
  ribbonColor: string;
  ribbonStyle: string; // 'satin' | 'grosgrain' | 'sheer'
  noteFont: 'romantic' | 'cute' | 'elegant' | 'vintage';
  noteMessage: string;
  notePaperTexture: string; // 'parchment' | 'linen' | 'pink' | 'lavender'
  noteWaxSeal: string; // 'none' | 'rose' | 'heart' | 'double_rings' | 'initial'
  flowers: { typeId: string; quantity: number }[];
}

export const OCCASIONS: Occasion[] = [
  { id: 'birthday', name: 'Birthday', emoji: '🎂', colorTheme: 'from-amber-100 to-rose-100', description: 'Celebrate another beautiful year of growth and happiness.' },
  { id: 'anniversary', name: 'Anniversary', emoji: '💖', colorTheme: 'from-purple-100 to-pink-100', description: 'Honor a beautiful journey shared with love and devotion.' },
  { id: 'proposal', name: 'Proposal', emoji: '💍', colorTheme: 'from-pink-200 to-rose-200', description: 'Will you? Express sweet, lifelong vows and passion.' },
  { id: 'valentines', name: 'Valentine’s Day', emoji: '🌹', colorTheme: 'from-red-100 to-rose-200', description: 'An elegant statement of pure, raw romantic passion.' },
  { id: 'friendship', name: 'Friendship', emoji: '🌻', colorTheme: 'from-yellow-100 to-amber-50', description: 'Brighten their day and celebrate support that never ends.' },
  { id: 'graduation', name: 'Graduation', emoji: '🎓', colorTheme: 'from-blue-100 to-indigo-100', description: 'Celebrate hard work, achievement, and bright horizons.' },
  { id: 'apology', name: 'Apology', emoji: '🕊️', colorTheme: 'from-emerald-50 to-teal-100', description: 'A gentle, sincere bridge built with regret and hope.' },
  { id: 'thankyou', name: 'Thank You', emoji: '🙏', colorTheme: 'from-teal-100 to-sage-100', description: 'Express heartfelt, deep gratitude for their support.' },
  { id: 'getwell', name: 'Get Well Soon', emoji: '❤️', colorTheme: 'from-orange-100 to-rose-50', description: 'A warm bouquet carrying healing wishes and bright energy.' },
  { id: 'mothersday', name: 'Mother’s Day', emoji: '👩‍👧', colorTheme: 'from-pink-100 to-pastel-red', description: 'Show admiration, comfort, and love for her guidance.' },
  { id: 'justbecause', name: 'Just Because', emoji: '✨', colorTheme: 'from-indigo-50 to-pink-50', description: 'No reason needed to sweep them off their feet today.' },
  { id: 'longdistance', name: 'Long Distance', emoji: '✈️', colorTheme: 'from-sky-100 to-violet-100', description: 'Sending sweet thoughts across the miles, directly to them.' }
];

export const PERSONALITIES: Personality[] = [
  { id: 'soft-romantic', name: 'Soft & Romantic', tagline: 'Cottagecore dreams & delicate petaled whispers.', description: 'Soft layering, gentle textures, lace or sheer bows, elegant handwritten calligraphy.' },
  { id: 'minimalist', name: 'Minimalist', tagline: 'Understated elegance, simple shapes, deep meaning.', description: 'Clean monochrome structure, single-flower focus, neutral linen texture, neat serif fonts.' },
  { id: 'luxury-lover', name: 'Luxury Lover', tagline: 'Grand, opulent, lavish attention to details.', description: 'Rich velvet wrap, massive layers, deep bold colors, gold wax seal accents, signature scripts.' },
  { id: 'cute-playful', name: 'Cute & Playful', tagline: 'Joyful, pastel, quirky and crochet-warm.', description: 'Crochet flowers, layered fluffy ribbons, bubbly handwritten notes, and cheerful tones.' },
  { id: 'elegant', name: 'Elegant', tagline: 'Classic poise, traditional harmony, perfect proportions.', description: 'Korean layered wrap in soft sage or peach, curated premium combinations, wax seal.' },
  { id: 'artistic', name: 'Artistic', tagline: 'Bold pairings, expressive silhouettes, creative whimsy.', description: 'Asymmetrical structures, unique wrapper choices, contrast color paths, and ink drips.' },
  { id: 'nature-lover', name: 'Nature Lover', tagline: 'Fresh gathered wildflower meadows, organic scents.', description: 'Sage green papers, raw hemp strings, natural twigs, earthy field daisies and sunflowers.' },
  { id: 'introvert', name: 'Introvert', tagline: 'Quiet thoughts, hidden secrets, cozy safe harbors.', description: 'Closed flower buds, muted lavender shades, soft matte wrapping, secret note storage.' },
  { id: 'extrovert', name: 'Extrovert', tagline: 'Radiant sunshine, loud celebrations, sparkling smiles.', description: 'Bright vibrant colors, glitter wrappers, large density, dynamic ribbon-ties.' },
  { id: 'dark-academia', name: 'Dark Academia', tagline: 'Ink-stained parchment, mystery, and deep rich plum.', description: 'Vintage newspaper wraps, dried flowers, dark plum roses, black velvet wax-sealed ribbons.' },
  { id: 'vintage-soul', name: 'Vintage Soul', tagline: 'Nostalgic film, classic letters, forgotten polaroids.', description: 'Cream and sepia palettes, aged linen notes, classic tea-stained strings, and baby’s breath.' },
  { id: 'feminine-pastel', name: 'Feminine Pastel', tagline: 'Powder blush cream, elegant silk, and peony soft.', description: 'Layered pink and ivory, sheer organza bow, custom sweet letterpress note cards.' },
  { id: 'bold-vibrant', name: 'Bold & Vibrant', tagline: 'Fierce pigments, intense emotions, unforgettable impressions.', description: 'Electric colors, structured shapes, neon wrapping, and intense contrasting ribbon styles.' }
];

export const EMOTIONAL_INTENTS = [
  'I Love You',
  'I Miss You',
  'I’m Proud of You',
  'Thank You',
  'I’m Sorry',
  'Congratulations',
  'You Make Me Happy',
  'You Deserve the World',
  'Thinking of You'
];

export const FLOWER_CATALOG: FlowerType[] = [
  { id: 'red-rose', name: 'Red Roses', symbolism: 'Passionate and undying love', color: '#E11D48', rgb: '225, 29, 72' },
  { id: 'pink-rose', name: 'Pink Roses', symbolism: 'Grace, gentleness, and emerging affection', color: '#F472B6', rgb: '244, 114, 182' },
  { id: 'pink-tulip', name: 'Pink Tulips', symbolism: 'Happiness, confidence, and caring love', color: '#EC4899', rgb: '236, 72, 153' },
  { id: 'white-lily', name: 'White Lilies', symbolism: 'Purity, quiet comfort, and devotion', color: '#F8FAFC', rgb: '248, 250, 252' },
  { id: 'sunflower', name: 'Sunflowers', symbolism: 'Loyalty, adoration, and cheerful gratitude', color: '#F59E0B', rgb: '245, 158, 11' },
  { id: 'lavender', name: 'Lavender', symbolism: 'Peace, calming longing, and deep trust', color: '#A78BFA', rgb: '167, 139, 250' },
  { id: 'blue-hydrangea', name: 'Blue Hydrangeas', symbolism: 'Sincerity, deep understanding, and gratitude', color: '#60A5FA', rgb: '96, 165, 250' },
  { id: 'yellow-rose', name: 'Yellow Roses', symbolism: 'Joy, warmth, and enduring friendship', color: '#FBBF24', rgb: '251, 191, 36' },
  { id: 'white-daisy', name: 'White Daisies', symbolism: 'Innocence, fresh beginnings, and loyal love', color: '#E2E8F0', rgb: '226, 232, 240' },
  { id: 'carnation', name: 'Carnations', symbolism: 'Maternal love, admiration, and pure sweet gratitude', color: '#FB7185', rgb: '251, 113, 133' },
  { id: 'orchid', name: 'Orchids', symbolism: 'Refinement, strength, and proud luxury admiration', color: '#D946EF', rgb: '217, 70, 239' }
];

export const WRAPPERS: WrapperStyle[] = [
  { id: 'korean-wrap', name: 'Korean Layered Wrap', description: 'Sculptured tiers of matte translucent paper', styleClass: 'bg-rose-50 border-rose-100' },
  { id: 'transparent-wrap', name: 'Transparent Clear Wrap', description: 'Chic modern glass-like layering', styleClass: 'bg-slate-50/50 border-slate-200' },
  { id: 'matte-pastel', name: 'Matte Pastel Wrap', description: 'Flawlessly smooth, chalky soft tones', styleClass: 'bg-emerald-50 border-emerald-100' },
  { id: 'luxury-satin', name: 'Luxury Satin Wrap', description: 'Thick luxurious silk-shimmer sheets', styleClass: 'bg-indigo-50 border-indigo-100' },
  { id: 'vintage-news', name: 'Vintage French Newspaper', description: 'Romantic ink script print print', styleClass: 'bg-amber-50/80 border-amber-200' },
  { id: 'minimal-mono', name: 'Minimal Monochrome Wrap', description: 'Futuristic clean heavy cardstock sheets', styleClass: 'bg-gray-100 border-gray-300' },
  { id: 'glitter-wrap', name: 'Glitter Shimmer Wrap', description: 'Sparkling reflective powder particles', styleClass: 'bg-yellow-50 border-yellow-150' },
  { id: 'soft-mesh', name: 'Soft Mesh Fabric', description: 'Flowing romantic tutu gauze', styleClass: 'bg-purple-50/80 border-purple-100' }
];

export const PALETTES: ColorPalette[] = [
  { id: 'pastel-pink', name: 'Soft Blush & Cream', hexes: ['#FDF2F8', '#FCE7F3', '#FFEDD5', '#FFFFFF'] },
  { id: 'lavender-dream', name: 'Lavender Nightfall', hexes: ['#F5F3FF', '#EDE9FE', '#DDD6FE', '#C084FC'] },
  { id: 'sage-minimal', name: 'Sage Green Meadow', hexes: ['#F0FDF4', '#DCFCE7', '#FFE4E6', '#A7F3D0'] },
  { id: 'luxury-black', name: 'Velvet Black & Gold', hexes: ['#1E293B', '#0F172A', '#F59E0B', '#D97706'] },
  { id: 'peach-pastel', name: 'Sunkissed Peach Duo', hexes: ['#FFF7ED', '#FFEDD5', '#FED7AA', '#FDBA74'] },
  { id: 'sunset-romance', name: 'Sunset Rose Red', hexes: ['#FFF1F2', '#FECDD3', '#FDA4AF', '#E11D48'] },
  { id: 'blue-serenity', name: 'Lapis Sky Serenity', hexes: ['#F0FDFA', '#CCFBF1', '#93C5FD', '#2563EB'] }
];
