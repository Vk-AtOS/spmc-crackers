// All 157 products from Sri Palani Murugan Crackers 2026 catalog
// price = selling price (MRP × 25%); mrp shown crossed-out
// Gift boxes: noDiscount:true — price === mrp

const CATEGORIES = [
  { id: 'all', label: 'All Products', labelTa: 'அனைத்தும்', emoji: '🎆' },
  { id: 'one-sound', label: 'One Sound Crackers', labelTa: 'ஒரு சவுண்ட்', emoji: '🔊' },
  { id: 'deluxe', label: 'Deluxe Crackers', labelTa: 'டீலக்ஸ்', emoji: '⭐' },
  { id: 'garland-full', label: 'Garland (Full)', labelTa: 'மாலை வாலா (Full)', emoji: '🎊' },
  { id: 'garland-half', label: 'Garland (Half)', labelTa: 'மாலை வாலா (Half)', emoji: '🎉' },
  { id: 'chorsa-giant', label: 'Chorsa & Giant', labelTa: 'சோர்சா & ஜெயிண்ட்', emoji: '💫' },
  { id: 'bijili', label: 'Bijili Crackers', labelTa: 'பிஜிலி', emoji: '⚡' },
  { id: 'bombs', label: 'Bombs', labelTa: 'பாம்', emoji: '💥' },
  { id: 'chakkars', label: 'Ground Chakkars', labelTa: 'சக்கரம்', emoji: '🌀' },
  { id: 'flower-pots', label: 'Flower Pots', labelTa: 'பூச்சட்டி', emoji: '🌺' },
  { id: 'twinkling-stars', label: 'Twinkling Stars', labelTa: 'சாட்டை', emoji: '✨' },
  { id: 'pencil-fountain', label: 'Pencil & Fountains', labelTa: 'பென்சில்', emoji: '🕯️' },
  { id: 'rockets', label: 'Rockets', labelTa: 'ராக்கெட்', emoji: '🚀' },
  { id: 'siren', label: 'Siren', labelTa: 'சைரன்', emoji: '🔴' },
  { id: 'matches', label: 'Matches', labelTa: 'மேட்சஸ்', emoji: '🎆' },
  { id: 'showers', label: 'Showers & Fountains', labelTa: 'ஷவர்ஸ்', emoji: '🦚' },
  { id: 'fancy-showers', label: 'Fancy Showers', labelTa: 'ஃபேன்சி ஷவர்', emoji: '🌈' },
  { id: 'variety-showers', label: 'Variety Showers', labelTa: 'வெரைட்டி ஷவர்', emoji: '🎨' },
  { id: 'magic-fountain', label: 'Magic Fountain', labelTa: 'மேஜிக் ஃபவுண்டன்', emoji: '🌟' },
  { id: 'amazing-fountain', label: 'Amazing Fountain', labelTa: 'அமேசிங் ஃபவுண்டன்', emoji: '🌊' },
  { id: 'kids-special', label: 'Kids Special', labelTa: 'குழந்தைகள் ஸ்பெஷல்', emoji: '🎈' },
  { id: 'new-2026', label: 'New Verties 2026', labelTa: 'புதிய வெரைட்டி 2026', emoji: '🆕' },
  { id: 'fancy-shots', label: 'Fancy Shots', labelTa: 'ஃபேன்சி ஷாட்', emoji: '🎇' },
  { id: 'fancy-pipe', label: 'Fancy Pipe Items', labelTa: 'ஃபேன்சி பைப்', emoji: '🎑' },
  { id: 'sparklers', label: 'Sparklers', labelTa: 'கம்பி', emoji: '✨' },
  { id: 'gift-boxes', label: 'Gift Boxes', labelTa: 'கிஃப்ட் பாக்ஸ்', emoji: '🎁', noDiscount: true },
];

const CATEGORY_COLORS = {
  'one-sound': '#7c2d12',
  'deluxe': '#78350f',
  'garland-full': '#581c87',
  'garland-half': '#4a1572',
  'chorsa-giant': '#164e63',
  'bijili': '#713f12',
  'bombs': '#7f1d1d',
  'chakkars': '#064e3b',
  'flower-pots': '#831843',
  'twinkling-stars': '#713f12',
  'pencil-fountain': '#1e3a5f',
  'rockets': '#1e3a5f',
  'siren': '#7f1d1d',
  'matches': '#3b0764',
  'showers': '#064e3b',
  'fancy-showers': '#312e81',
  'variety-showers': '#78350f',
  'magic-fountain': '#713f12',
  'amazing-fountain': '#0c4a6e',
  'kids-special': '#701a75',
  'new-2026': '#065f46',
  'fancy-shots': '#312e81',
  'fancy-pipe': '#1e3a5f',
  'sparklers': '#713f12',
  'gift-boxes': '#92400e',
};

const PRODUCTS = [
  // ONE SOUND CRACKERS
  { id: 1, name: '3 1/2" Lakshmi', nameTa: '3 1/2" லட்சுமி', cat: 'one-sound', mrp: 56, price: 14, unit: 'pkt', emoji: '🔊', desc: 'Traditional 3.5" cracker packet with crisp, sharp sound — classic Diwali essential.' },
  { id: 2, name: '4" Lakshmi', nameTa: '4" லட்சுமி', cat: 'one-sound', mrp: 80, price: 20, unit: 'pkt', emoji: '🔊', desc: 'Traditional 4" cracker packet with crisp, sharp sound — classic Diwali essential.' },
  { id: 3, name: '4" Deluxe Lakshmi', nameTa: '4" டீலக்ஸ் லட்சுமி', cat: 'one-sound', mrp: 140, price: 35, unit: 'pkt', emoji: '🔊', desc: 'Traditional 4" deluxe cracker packet with a louder, crispier bang — upgraded Diwali favourite.' },
  { id: 4, name: 'Gold Lakshmi', nameTa: 'கோல்டு லட்சுமி', cat: 'one-sound', mrp: 140, price: 35, unit: 'pkt', emoji: '🔊', desc: 'Premium Gold Lakshmi cracker packet with a sharp, resonant sound — top-quality one-sound.' },
  { id: 5, name: '5" Mega Deluxe', nameTa: '5" மெகா டீலக்ஸ்', cat: 'one-sound', mrp: 220, price: 55, unit: 'pkt', emoji: '🔊', desc: 'Traditional 5" mega cracker packet with a booming, deep sound — impressive Diwali statement.' },
  { id: 6, name: '6" Mega Deluxe', nameTa: '6" மெகா டீலக்ஸ்', cat: 'one-sound', mrp: 240, price: 60, unit: 'pkt', emoji: '🔊', desc: 'Traditional 6" mega cracker packet with an earth-shaking thunderclap — the loudest one-sound.' },
  { id: 7, name: '2 3/4" Kuruvi', nameTa: '2 3/4" குருவி', cat: 'one-sound', mrp: 32, price: 8, unit: 'pkt', emoji: '🔊', desc: 'Compact 2.75" Kuruvi cracker packet with a quick, sharp snap — great value classic.' },

  // DELUXE CRACKERS
  { id: 8, name: '24 Deluxe', nameTa: '24 டீலக்ஸ்', cat: 'deluxe', mrp: 200, price: 50, unit: 'pkt', emoji: '⭐', desc: 'Pack of 24 deluxe crackers with crisp sequential pops — reliable Diwali classic.' },
  { id: 9, name: '28 Deluxe', nameTa: '28 டீலக்ஸ்', cat: 'deluxe', mrp: 240, price: 60, unit: 'pkt', emoji: '⭐', desc: 'Pack of 28 deluxe crackers with crisp, satisfying pops — classic Diwali essential.' },
  { id: 10, name: '50 Deluxe', nameTa: '50 டீலக்ஸ்', cat: 'deluxe', mrp: 440, price: 110, unit: 'pkt', emoji: '⭐', desc: 'Pack of 50 deluxe crackers with rapid-fire sharp sounds — great for extended celebrations.' },
  { id: 11, name: '100 Deluxe', nameTa: '100 டீலக்ஸ்', cat: 'deluxe', mrp: 880, price: 220, unit: 'pkt', emoji: '⭐', desc: 'Bumper pack of 100 deluxe crackers for a long, loud celebration — best-value deluxe.' },

  // GARLAND FULL
  { id: 12, name: '100 Wala (Full)', nameTa: '100 வாலா', cat: 'garland-full', mrp: 200, price: 50, unit: 'box', emoji: '🎊', desc: 'Continuous 100-wala garland cracker — non-stop burst of rapid snapping sounds.' },
  { id: 13, name: '200 Wala (Full)', nameTa: '200 வாலா', cat: 'garland-full', mrp: 400, price: 100, unit: 'box', emoji: '🎊', desc: 'Continuous 200-wala garland cracker — non-stop burst of rapid snapping sounds.' },
  { id: 14, name: '1000 Wala (Full)', nameTa: '1000 வாலா', cat: 'garland-full', mrp: 1080, price: 270, unit: 'box', emoji: '🎊', desc: 'Continuous 1000-wala garland cracker — non-stop burst of rapid snapping sounds.' },
  { id: 15, name: '2000 Wala (Full)', nameTa: '2000 வாலா', cat: 'garland-full', mrp: 2160, price: 540, unit: 'box', emoji: '🎊', desc: 'Continuous 2000-wala garland cracker — non-stop burst of rapid snapping sounds.' },
  { id: 16, name: '5000 Wala (Full)', nameTa: '5000 வாலா', cat: 'garland-full', mrp: 5200, price: 1300, unit: 'box', emoji: '🎊', desc: 'Continuous 5000-wala garland cracker — spectacular non-stop snapping display for big events.' },
  { id: 17, name: '10000 Wala (Full)', nameTa: '10000 வாலா', cat: 'garland-full', mrp: 10400, price: 2600, unit: 'box', emoji: '🎊', desc: 'Continuous 10000-wala garland cracker — the ultimate non-stop crackling extravaganza.' },

  // GARLAND HALF
  { id: 18, name: '1000 Wala (Half)', nameTa: '1000 வாலா (Half)', cat: 'garland-half', mrp: 720, price: 180, unit: 'box', emoji: '🎉', desc: 'Continuous 1000-wala half garland cracker — non-stop burst of rapid snapping sounds.' },
  { id: 19, name: '2000 Wala (Half)', nameTa: '2000 வாலா (Half)', cat: 'garland-half', mrp: 1440, price: 360, unit: 'box', emoji: '🎉', desc: 'Continuous 2000-wala half garland cracker — non-stop burst of rapid snapping sounds.' },
  { id: 20, name: '5000 Wala (Half)', nameTa: '5000 வாலா (Half)', cat: 'garland-half', mrp: 3600, price: 900, unit: 'box', emoji: '🎉', desc: 'Continuous 5000-wala half garland cracker — spectacular non-stop snapping display.' },
  { id: 21, name: '10000 Wala (Half)', nameTa: '10000 வாலா (Half)', cat: 'garland-half', mrp: 7200, price: 1800, unit: 'box', emoji: '🎉', desc: 'Continuous 10000-wala half garland cracker — the ultimate half-strand crackling extravaganza.' },

  // CHORSA & GIANT
  { id: 22, name: '28 Chorsa', nameTa: '28 சோர்சா', cat: 'chorsa-giant', mrp: 80, price: 20, unit: 'pkt', emoji: '💫', desc: 'Pack of 28 Chorsa crackers with a compact, crisp snap — traditional Diwali staple.' },
  { id: 23, name: '28 Giant', nameTa: '28 ஜெயிண்ட்', cat: 'chorsa-giant', mrp: 120, price: 30, unit: 'pkt', emoji: '💫', desc: 'Pack of 28 Giant crackers with a louder, fuller bang — big sound in a compact pack.' },
  { id: 24, name: '56 Giant', nameTa: '56 ஜெயிண்ட்', cat: 'chorsa-giant', mrp: 240, price: 60, unit: 'pkt', emoji: '💫', desc: 'Pack of 56 Giant crackers with powerful sequential bangs — double the fun and noise.' },

  // BIJILI CRACKERS
  { id: 25, name: 'Red Bijili', nameTa: 'ரெட் பிஜிலி', cat: 'bijili', mrp: 140, price: 35, unit: 'pkt', emoji: '⚡', desc: 'Fast-burst Bijili red cracker with rapid-fire snapping — striking red finish classic.' },
  { id: 26, name: 'Stripped Bijili', nameTa: 'கோடு பிஜிலி', cat: 'bijili', mrp: 160, price: 40, unit: 'pkt', emoji: '⚡', desc: 'Fast-burst Bijili stripped cracker with rapid-fire snapping — distinctive striped finish.' },

  // BOMBS
  { id: 27, name: 'Hydro Bomb', nameTa: 'கைட்ரோ பாம்', cat: 'bombs', mrp: 320, price: 80, unit: 'box', emoji: '💥', desc: 'Ground-shaking Hydro bomb with thunderous explosion — guaranteed crowd stopper.' },
  { id: 28, name: 'Bullet Bomb', nameTa: 'புல்ட் பாம்', cat: 'bombs', mrp: 200, price: 50, unit: 'box', emoji: '💥', desc: 'Ground-shaking Bullet bomb with thunderous explosion — guaranteed crowd stopper.' },
  { id: 29, name: 'King of King', nameTa: 'கிங் ஆப் கிங்', cat: 'bombs', mrp: 480, price: 120, unit: 'box', emoji: '💥', desc: 'Ground-shaking King of King bomb with thunderous explosion — guaranteed crowd stopper.' },
  { id: 30, name: 'Classic Bomb', nameTa: 'கிளாசிக் பாம்', cat: 'bombs', mrp: 540, price: 135, unit: 'box', emoji: '💥', desc: 'Ground-shaking Classic bomb with thunderous explosion — the timeless crowd stopper.' },
  { id: 31, name: 'Mega Super Bomb', nameTa: 'மெகா சூப்பர் பாம்', cat: 'bombs', mrp: 740, price: 185, unit: 'box', emoji: '💥', desc: 'Ground-shaking Mega Super bomb with an earth-shattering explosion — maximum impact.' },
  { id: 32, name: 'DTS Bomb', nameTa: 'DTS பாம்', cat: 'bombs', mrp: 880, price: 220, unit: 'box', emoji: '💥', desc: 'Ground-shaking DTS bomb with thunderous explosion — premium surround-sound boom.' },
  { id: 33, name: '1/4 KG Paper Bomb', nameTa: '1/4 கி பேப்பர் பாம்', cat: 'bombs', mrp: 240, price: 60, unit: 'box', emoji: '💥', desc: 'Traditional 1/4 KG paper bomb with a deep, resonant boom — Diwali classic.' },
  { id: 34, name: '1/2 KG Paper Bomb', nameTa: '1/2 கி பேப்பர் பாம்', cat: 'bombs', mrp: 520, price: 130, unit: 'box', emoji: '💥', desc: 'Traditional 1/2 KG paper bomb with a powerful, deep boom — serious Diwali firepower.' },
  { id: 35, name: '1 KG Paper Bomb', nameTa: '1 கி பேப்பர் பாம்', cat: 'bombs', mrp: 960, price: 240, unit: 'box', emoji: '💥', desc: 'Traditional 1 KG paper bomb with a massive, ground-shaking boom — the biggest bang.' },
  { id: 160, name: '555 Bomb', nameTa: '555 பாம்', cat: 'bombs', mrp: 480, price: 120, unit: 'box', emoji: '💥', desc: 'Classic 555 bomb with a powerful thunderous explosion — the iconic Sivakasi crowd stopper.' },

  // CHAKKARS
  { id: 36, name: 'Money in the Bank (3 pcs)', nameTa: 'மணி இன் தி பேங்க்', cat: 'bombs', mrp: 800, price: 200, unit: 'box', emoji: '💥', desc: 'Explosive Money in the Bank bomb — big bang in a 3-piece box. Guaranteed crowd stopper.' },
  { id: 37, name: 'Chakkar Big (10 pcs)', nameTa: 'சக்கரம் பெரியது 10 pcs', cat: 'chakkars', mrp: 180, price: 45, unit: 'box', emoji: '🌀', desc: 'Spinning ground chakkar releasing colorful sparks in a dazzling whirling display. 10-piece box.' },
  { id: 38, name: 'Chakkar Big (25 pcs)', nameTa: 'சக்கரம் பெரியது 25 pcs', cat: 'chakkars', mrp: 400, price: 100, unit: 'box', emoji: '🌀', desc: 'Spinning ground chakkar releasing colorful sparks in a dazzling whirling display. 25-piece box.' },
  { id: 39, name: 'Chakkar Special', nameTa: 'சக்கரம் ஸ்பெஷல்', cat: 'chakkars', mrp: 480, price: 120, unit: 'box', emoji: '🌀', desc: 'Special spinning ground chakkar releasing colorful sparks in a dazzling whirling display.' },
  { id: 40, name: 'Chakkar Deluxe', nameTa: 'சக்கரம் டீலக்ஸ்', cat: 'chakkars', mrp: 660, price: 165, unit: 'box', emoji: '🌀', desc: 'Deluxe spinning ground chakkar releasing brilliant colorful sparks in a mesmerizing whirl.' },
  { id: 41, name: 'Chakkar Orbit Spinner', nameTa: 'ஆர்பிட் சக்கரம்', cat: 'chakkars', mrp: 700, price: 175, unit: 'box', emoji: '🌀', desc: 'Orbit Spinner chakkar with wide spinning arc releasing colorful sparks — spectacular display.' },
  { id: 42, name: 'Whizzle Chakkar', nameTa: 'விசில் சக்கரம்', cat: 'chakkars', mrp: 740, price: 185, unit: 'box', emoji: '🌀', desc: 'Spinning Whizzle chakkar with a distinctive whistle sound and dazzling spark display.' },
  { id: 43, name: '4×4 Wheel Chakkar', nameTa: '4×4 சக்கரம்', cat: 'chakkars', mrp: 880, price: 220, unit: 'box', emoji: '🌀', desc: 'Large 4×4 wheel chakkar releasing colorful sparks in a spectacular four-wheel whirling display.' },
  { id: 44, name: 'Wire Chakkar', nameTa: 'வயர் சக்கரம்', cat: 'chakkars', mrp: 700, price: 175, unit: 'box', emoji: '🌀', desc: 'Wire-mounted spinning chakkar releasing colorful sparks in a dazzling elevated display.' },

  // FLOWER POTS
  { id: 45, name: 'Flower Pot Small', nameTa: 'பூச்சட்டி சிறியது', cat: 'flower-pots', mrp: 260, price: 65, unit: 'box', emoji: '🌺', desc: 'Fountain-style small flower pot shooting golden sparks high into the air.' },
  { id: 46, name: 'Flower Pot Big', nameTa: 'பூச்சட்டி பெரியது', cat: 'flower-pots', mrp: 320, price: 80, unit: 'box', emoji: '🌺', desc: 'Fountain-style big flower pot shooting golden sparks high into the air.' },
  { id: 47, name: 'Flower Pot Special', nameTa: 'பூச்சட்டி ஸ்பெஷல்', cat: 'flower-pots', mrp: 400, price: 100, unit: 'box', emoji: '🌺', desc: 'Fountain-style special flower pot shooting brilliant multi-colored sparks high into the air.' },
  { id: 48, name: 'Flower Pot Asoka', nameTa: 'பூச்சட்டி அசோகா', cat: 'flower-pots', mrp: 580, price: 145, unit: 'box', emoji: '🌺', desc: 'Fountain-style Asoka flower pot shooting golden and colored sparks high into the air.' },
  { id: 49, name: 'Colour Koti', nameTa: 'கலர் கோட்டி', cat: 'flower-pots', mrp: 840, price: 210, unit: 'box', emoji: '🌺', desc: 'Colour Koti flower pot with vibrant multi-color sparks cascading in a stunning display.' },
  { id: 50, name: 'Colour Koti Deluxe', nameTa: 'கலர் கோட்டி டீலக்ஸ்', cat: 'flower-pots', mrp: 1000, price: 250, unit: 'box', emoji: '🌺', desc: 'Deluxe Colour Koti flower pot with brilliant multi-color cascading sparks — crowd favourite.' },
  { id: 51, name: 'Tri Colour (5 in 1)', nameTa: 'ட்ரை கலர் 5 in 1', cat: 'flower-pots', mrp: 1120, price: 280, unit: 'box', emoji: '🌺', desc: 'Tri-colour 5-in-1 flower pot set with three distinct color phases — spectacular visual show.' },

  // TWINKLING STARS
  { id: 52, name: '1 1/2" Twinkling Star', nameTa: '1 1/2" சாட்டை', cat: 'twinkling-stars', mrp: 160, price: 40, unit: 'box', emoji: '✨', desc: 'Spinning 1.5" twinkling star emitting rapid colorful sparks with dazzling effects.' },
  { id: 53, name: '4" Twinkling Star', nameTa: '4" சாட்டை', cat: 'twinkling-stars', mrp: 300, price: 75, unit: 'box', emoji: '✨', desc: 'Spinning 4" twinkling star emitting rapid colorful sparks with a larger dazzling display.' },

  // PENCIL / FOUNTAIN
  { id: 54, name: 'Lazer Show / Ultra Pencil', nameTa: 'லேசர் பென்சில்', cat: 'pencil-fountain', mrp: 640, price: 160, unit: 'box', emoji: '🕯️', desc: 'Pencil candle with laser show effects producing sustained multi-colored fountains of sparks.' },
  { id: 55, name: 'Lollipop Pencil', nameTa: 'லாலிபாப் பென்சில்', cat: 'pencil-fountain', mrp: 1000, price: 250, unit: 'box', emoji: '🕯️', desc: 'Pencil candle with lollipop-shaped burst effects producing sustained multi-colored fountains.' },
  { id: 56, name: 'Water Falls Pencil', nameTa: 'வாட்டர்ஃபால்ஸ் பென்சில்', cat: 'pencil-fountain', mrp: 960, price: 240, unit: 'box', emoji: '🕯️', desc: 'Pencil candle with waterfall effects producing sustained cascading multi-colored fountains.' },
  { id: 57, name: 'Popcorn Pencil', nameTa: 'பாப்கான் பென்சில்', cat: 'pencil-fountain', mrp: 960, price: 240, unit: 'box', emoji: '🕯️', desc: 'Pencil candle with popcorn burst effects producing sustained crackling fountains of sparks.' },

  // ROCKETS
  { id: 58, name: 'Rocket Bomb', nameTa: 'ராக்கெட் பாம்', cat: 'rockets', mrp: 360, price: 90, unit: 'box', emoji: '🚀', desc: 'Aerial rocket that shoots skyward with a blazing trail and thunderous bomb burst.' },
  { id: 59, name: 'Mega Rocket', nameTa: 'மெகா ராக்கெட்', cat: 'rockets', mrp: 600, price: 150, unit: 'box', emoji: '🚀', desc: 'Aerial mega rocket that shoots high skyward with a blazing trail and brilliant color burst.' },
  { id: 60, name: 'Whistle Rocket', nameTa: 'விசில் ராக்கெட்', cat: 'rockets', mrp: 900, price: 225, unit: 'box', emoji: '🚀', desc: 'Aerial rocket that shoots skyward with a distinctive whistle and dazzling color burst.' },

  // SIREN
  { id: 61, name: 'Siren (3 pcs)', nameTa: 'சைரன் 3 pcs', cat: 'siren', mrp: 800, price: 200, unit: 'box', emoji: '🔴', desc: 'Siren firework that rises and emits a sustained wailing siren sound with red light effects. 3-piece box.' },

  // MATCHES
  { id: 62, name: 'Mini Match Box', nameTa: 'மினி மேட்ச் பாக்ஸ்', cat: 'matches', mrp: 180, price: 45, unit: 'box', emoji: '🎆', desc: 'Color-flame safety match — mini box perfect for lighting fireworks safely.' },
  { id: 63, name: 'Deluxe Match Box', nameTa: 'DLX மேட்ச் பாக்ஸ்', cat: 'matches', mrp: 240, price: 60, unit: 'box', emoji: '🎆', desc: 'Color-flame safety match — deluxe box with extra-long flame for lighting fireworks.' },
  { id: 64, name: 'Super Deluxe Match', nameTa: 'சூப்பர் DLX மேட்ச்', cat: 'matches', mrp: 400, price: 100, unit: 'box', emoji: '🎆', desc: 'Color-flame safety match — super deluxe box with premium extended flame.' },
  { id: 65, name: 'Pokeman', nameTa: 'போக்கெமான்', cat: 'matches', mrp: 900, price: 225, unit: 'box', emoji: '🎆', desc: 'Color-flame safety match — Pokeman novelty box with vibrant colored flames for festive lighting.' },

  // SHOWERS & FOUNTAINS
  { id: 66, name: 'Peacock (5 in 1)', nameTa: 'பீக்காக் 5 in 1', cat: 'showers', mrp: 900, price: 225, unit: 'box', emoji: '🦚', desc: 'Peacock shower fountain cascading golden and colored sparks in a wide arc. 5-in-1 pack.' },
  { id: 67, name: 'Mega Peacock', nameTa: 'மெகா பீக்காக்', cat: 'showers', mrp: 720, price: 180, unit: 'box', emoji: '🦚', desc: 'Mega Peacock shower fountain cascading brilliant golden and colored sparks in a wide arc.' },
  { id: 68, name: 'Bada Super Peacock', nameTa: 'படா சூப்பர் பீக்காக்', cat: 'showers', mrp: 1600, price: 400, unit: 'box', emoji: '🦚', desc: 'Bada Super Peacock — the largest peacock fountain with a magnificent cascading spark display.' },

  // FANCY SHOWERS
  { id: 69, name: 'Pogo', nameTa: 'போகோ', cat: 'fancy-showers', mrp: 180, price: 45, unit: 'box', emoji: '🌈', desc: 'Novelty Pogo fancy shower with colorful sparkling display and unique bouncing shape.' },
  { id: 70, name: 'Angry Bird', nameTa: 'ஆங்ரி பேர்டு', cat: 'fancy-showers', mrp: 280, price: 70, unit: 'box', emoji: '🌈', desc: 'Novelty Angry Bird fancy shower with colorful sparkling display and iconic bird shape.' },
  { id: 71, name: 'Golden Globe (5 in 1)', nameTa: 'கோல்டன் குளோப் 5 in 1', cat: 'fancy-showers', mrp: 520, price: 130, unit: 'box', emoji: '🌈', desc: 'Novelty Golden Globe fancy shower with colorful sparkling display. 5-in-1 globe pack.' },
  { id: 72, name: 'Peacock Feather (5 in 1)', nameTa: 'பீக்காக் பெதர் 5 in 1', cat: 'fancy-showers', mrp: 520, price: 130, unit: 'box', emoji: '🌈', desc: 'Novelty Peacock Feather fancy shower with colorful sparkling display. 5-in-1 pack.' },
  { id: 73, name: 'Colour Rain (5 in 1)', nameTa: 'கலர் ரெயின் 5 in 1', cat: 'fancy-showers', mrp: 520, price: 130, unit: 'box', emoji: '🌈', desc: 'Novelty Colour Rain fancy shower with multi-color sparkling rainfall display. 5-in-1 pack.' },

  // VARIETY SHOWERS
  { id: 74, name: 'Tin Beer', nameTa: 'டின் பீர்', cat: 'variety-showers', mrp: 440, price: 110, unit: 'box', emoji: '🎨', desc: 'Themed Tin Beer shower fountain with beer-can novelty casing and multi-color sparks.' },
  { id: 75, name: 'Popcorn Tin', nameTa: 'பாப்கான் டின்', cat: 'variety-showers', mrp: 600, price: 150, unit: 'box', emoji: '🎨', desc: 'Themed Popcorn Tin shower fountain with popcorn-bucket novelty casing and multi-color sparks.' },
  { id: 76, name: 'Minions', nameTa: 'மினியன்ஸ்', cat: 'variety-showers', mrp: 800, price: 200, unit: 'box', emoji: '🎨', desc: 'Themed Minions shower fountain with adorable Minions novelty casing and multi-color sparks.' },
  { id: 77, name: 'Aqua Queen', nameTa: 'அக்வா குயின்', cat: 'variety-showers', mrp: 800, price: 200, unit: 'box', emoji: '🎨', desc: 'Themed Aqua Queen shower fountain with royal novelty casing and cascading multi-color sparks.' },
  { id: 78, name: 'Monster TN67', nameTa: 'மான்ஸ்டர் TN67', cat: 'variety-showers', mrp: 800, price: 200, unit: 'box', emoji: '🎨', desc: 'Themed Monster TN67 shower fountain with monster novelty casing and fierce multi-color sparks.' },

  // MAGIC FOUNTAIN
  { id: 79, name: 'Fire & Feather', nameTa: 'பயர் & பெதர்', cat: 'magic-fountain', mrp: 700, price: 175, unit: 'box', emoji: '🌟', desc: 'Ground fountain with sustained magical sparkling effects combining fire and feather color changes.' },
  { id: 80, name: 'Golden Sparrow', nameTa: 'கோல்டன் ஸ்பாரோ', cat: 'magic-fountain', mrp: 700, price: 175, unit: 'box', emoji: '🌟', desc: 'Ground fountain with sustained magical golden sparkling effects and multiple color transitions.' },
  { id: 81, name: 'Dragon Slay', nameTa: 'டிராகன் ஸ்லே', cat: 'magic-fountain', mrp: 920, price: 230, unit: 'box', emoji: '🌟', desc: 'Ground fountain with sustained magical dragon-fire sparkling effects and brilliant color changes.' },

  // AMAZING FOUNTAIN
  { id: 82, name: 'Thunder Coconut', nameTa: 'தண்டர் கோகோனட்', cat: 'amazing-fountain', mrp: 1280, price: 320, unit: 'box', emoji: '🌊', desc: 'Large-scale Thunder Coconut amazing fountain with extraordinary visual effects and long burn time.' },
  { id: 83, name: 'Mangatha', nameTa: 'மங்கத்தா', cat: 'amazing-fountain', mrp: 1000, price: 250, unit: 'box', emoji: '🌊', desc: 'Large-scale Mangatha amazing fountain with extraordinary visual effects and long burn time.' },
  { id: 84, name: 'Jigarthanda', nameTa: 'ஜிகர்தண்டா', cat: 'amazing-fountain', mrp: 800, price: 200, unit: 'box', emoji: '🌊', desc: 'Large-scale Jigarthanda amazing fountain with extraordinary visual effects and long burn time.' },

  // KIDS SPECIAL
  { id: 85, name: 'Kit Kat', nameTa: 'கிட் கேட்', cat: 'kids-special', mrp: 180, price: 45, unit: 'box', emoji: '🎈', desc: 'Safe fun Kit Kat firework designed for children — colorful crackling display with minimal noise.' },
  { id: 86, name: 'Helicopter (5 in 1)', nameTa: 'ஹெலிகாப்டர் 5 in 1', cat: 'kids-special', mrp: 440, price: 110, unit: 'box', emoji: '🎈', desc: 'Safe fun helicopter firework designed for children — spinning aerial display with colorful sparks.' },
  { id: 87, name: 'Pampara/Spinner (5 in 1)', nameTa: 'பம்பரம் 5 in 1', cat: 'kids-special', mrp: 520, price: 130, unit: 'box', emoji: '🎈', desc: 'Safe fun Pampara spinner firework designed for children — colorful spinning display with minimal noise.' },
  { id: 88, name: 'Butterfly', nameTa: 'பட்டாம்பூச்சி', cat: 'kids-special', mrp: 480, price: 120, unit: 'box', emoji: '🎈', desc: 'Safe fun Butterfly firework designed for children — colorful fluttering sparks with gentle sound.' },
  { id: 89, name: 'Photo Flash', nameTa: 'போட்டோ பிளாஸ்', cat: 'kids-special', mrp: 260, price: 65, unit: 'box', emoji: '🎈', desc: 'Safe fun Photo Flash firework designed for children — bright flash effects perfect for photos.' },
  { id: 90, name: 'Selfie Stick', nameTa: 'செல்பி ஸ்டிக்', cat: 'kids-special', mrp: 600, price: 150, unit: 'box', emoji: '🎈', desc: 'Safe fun Selfie Stick sparkler designed for children — long-handled colorful spark display.' },
  { id: 91, name: 'Smoke', nameTa: 'ஸ்மோக்', cat: 'kids-special', mrp: 720, price: 180, unit: 'box', emoji: '🎈', desc: 'Safe fun colorful smoke bomb designed for children — vivid colored smoke cloud for fun photos.' },
  { id: 92, name: 'Sky Short', nameTa: 'ஸ்கை சாட்', cat: 'kids-special', mrp: 240, price: 60, unit: 'box', emoji: '🎈', desc: 'Safe fun Sky Shot firework designed for children — gentle aerial burst with colorful sparks.' },
  { id: 93, name: 'Electric Stone', nameTa: 'எலட்ரிக் ஸ்டோன்', cat: 'kids-special', mrp: 40, price: 10, unit: 'box', emoji: '🎈', desc: 'Safe fun Electric Stone firework designed for children — colorful sparkling effect with minimal noise.' },
  { id: 94, name: 'Jee Boomba', nameTa: 'ஜீ பும்பா', cat: 'kids-special', mrp: 40, price: 10, unit: 'box', emoji: '🎈', desc: 'Safe fun Jee Boomba firework designed for children — colorful pop effect perfect for little ones.' },
  { id: 95, name: 'Snake Tablet', nameTa: 'பாம்பு மாத்திரை', cat: 'kids-special', mrp: 20, price: 5, unit: 'box', emoji: '🎈', desc: 'Safe fun Snake Tablet firework designed for children — classic growing snake ash effect.' },
  { id: 96, name: 'Poondu Vedi', nameTa: 'பூண்டு வெடி', cat: 'kids-special', mrp: 80, price: 20, unit: 'box', emoji: '🎈', desc: 'Safe fun Poondu Vedi firework designed for children — colorful garlic-shaped burst with gentle pop.' },
  { id: 97, name: 'Cartoon', nameTa: 'கார்ட்டூன்', cat: 'kids-special', mrp: 60, price: 15, unit: 'box', emoji: '🎈', desc: 'Safe fun Cartoon firework designed for children — colorful cartoon-themed spark display.' },
  { id: 98, name: 'Roll Cap', nameTa: 'ரோல் கேப்', cat: 'kids-special', mrp: 400, price: 100, unit: 'box', emoji: '🎈', desc: 'Safe fun Roll Cap firework designed for children — classic roll of snap-cap fun.' },
  { id: 99, name: 'Mini Selfie Stick (3 Pcs)', nameTa: 'மினி செல்பி ஸ்டிக்', cat: 'kids-special', mrp: 240, price: 60, unit: 'box', emoji: '🎈', desc: 'Safe fun Mini Selfie Stick sparkler set designed for children — compact colorful sparks. 3-piece.' },

  // NEW VERTIES 2026
  { id: 100, name: 'Vel (2 pcs)', nameTa: 'வேல் 2 pcs', cat: 'new-2026', mrp: 900, price: 225, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Vel variety — exciting new firework effects you\'ve never seen before.' },
  { id: 101, name: 'Kalash Nikavo', nameTa: 'காலாஸ் நிக்கவோ', cat: 'new-2026', mrp: 1000, price: 250, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Kalash Nikavo variety — exciting new firework effects you\'ve never seen before.' },
  { id: 102, name: 'Bheema Kadham', nameTa: 'பீமா கதம்', cat: 'new-2026', mrp: 1000, price: 250, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Bheema Kadham variety — exciting new firework effects you\'ve never seen before.' },
  { id: 103, name: 'Guitar', nameTa: 'கிட்டார்', cat: 'new-2026', mrp: 1000, price: 250, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Guitar variety — exciting new firework effects you\'ve never seen before.' },
  { id: 104, name: 'Hunter 007 (Fire Gun)', nameTa: 'கண்டர் 007', cat: 'new-2026', mrp: 900, price: 225, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Hunter 007 Fire Gun variety — exciting new firework effects you\'ve never seen before.' },
  { id: 105, name: 'Emu Egg', nameTa: 'ஈமு எக்', cat: 'new-2026', mrp: 880, price: 220, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Emu Egg variety — exciting new firework effects you\'ve never seen before.' },
  { id: 106, name: 'Watermelon', nameTa: 'வாட்டர்மிலன்', cat: 'new-2026', mrp: 1400, price: 350, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Watermelon variety — exciting new firework effects you\'ve never seen before.' },
  { id: 107, name: 'Mini Cylinder', nameTa: 'மினி சிலிண்டர்', cat: 'new-2026', mrp: 640, price: 160, unit: 'pcs', emoji: '🆕', desc: 'Brand new 2026 Mini Cylinder variety — exciting new firework effects you\'ve never seen before.' },
  { id: 108, name: 'Cylinder', nameTa: 'சிலிண்டர்', cat: 'new-2026', mrp: 800, price: 200, unit: 'pcs', emoji: '🆕', desc: 'Brand new 2026 Cylinder variety — exciting new firework effects you\'ve never seen before.' },
  { id: 161, name: 'Raceing Car', nameTa: 'ரேஸிங் கார்', cat: 'new-2026', mrp: 1000, price: 250, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Racing Car variety — speeds across the ground with a blazing trail of sparks.' },
  { id: 162, name: 'Hand Short', nameTa: 'ஹேண்ட் ஷாட்', cat: 'new-2026', mrp: 2200, price: 550, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Hand Short variety — handheld aerial shot with spectacular color burst effects.' },
  { id: 163, name: 'Bat Ball', nameTa: 'பேட் பால்', cat: 'new-2026', mrp: 1000, price: 250, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Bat Ball variety — exciting bat-and-ball shaped firework with dazzling effects.' },
  { id: 164, name: 'I-CON', nameTa: 'ஐ-கான்', cat: 'new-2026', mrp: 800, price: 200, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 I-CON variety — iconic new firework with unforgettable visual effects.' },
  { id: 165, name: 'Love Dose', nameTa: 'லவ் டோஸ்', cat: 'new-2026', mrp: 700, price: 175, unit: 'box', emoji: '🆕', desc: 'Brand new 2026 Love Dose variety — romantic heart-shaped sparks perfect for celebrations.' },

  // FANCY SHOTS
  { id: 109, name: '7 Shot (5 in 1)', nameTa: '7 சாட் 5 in 1', cat: 'fancy-shots', mrp: 480, price: 120, unit: 'box', emoji: '🎇', desc: '7-shot multicolour aerial barrage — vibrant colors burst in rapid sequence. 5-in-1 pack.' },
  { id: 110, name: '12 Shot Multicolour', nameTa: '12 சாட் மல்டி கலர்', cat: 'fancy-shots', mrp: 660, price: 165, unit: 'box', emoji: '🎇', desc: '12-shot multicolour aerial barrage — vibrant colors burst in rapid sequence.' },
  { id: 111, name: '15 Shot Multicolour', nameTa: '15 சாட் மல்டி கலர்', cat: 'fancy-shots', mrp: 1280, price: 320, unit: 'box', emoji: '🎇', desc: '15-shot multicolour aerial barrage — vibrant colors burst in rapid sequence.' },
  { id: 112, name: '25 Shot Rider', nameTa: '25 சாட் ரைடர்', cat: 'fancy-shots', mrp: 1360, price: 340, unit: 'box', emoji: '🎇', desc: '25-shot rider aerial barrage — vibrant colors burst in rapid sequence across the sky.' },
  { id: 113, name: '30 Shot Multicolour', nameTa: '30 சாட் மல்டி கலர்', cat: 'fancy-shots', mrp: 2000, price: 500, unit: 'box', emoji: '🎇', desc: '30-shot multicolour aerial barrage — vibrant colors burst in rapid sequence.' },
  { id: 114, name: '60 Shot Multicolour', nameTa: '60 சாட் மல்டி கலர்', cat: 'fancy-shots', mrp: 4000, price: 1000, unit: 'box', emoji: '🎇', desc: '60-shot multicolour aerial barrage — vibrant colors burst in rapid sequence for a grand show.' },
  { id: 115, name: '100 Shot Multicolour', nameTa: '100 சாட் மல்டி கலர்', cat: 'fancy-shots', mrp: 7200, price: 1800, unit: 'box', emoji: '🎇', desc: '100-shot multicolour aerial barrage — vibrant colors burst in rapid sequence for a massive show.' },
  { id: 116, name: '120 Shot Multicolour', nameTa: '120 சாட் மல்டி கலர்', cat: 'fancy-shots', mrp: 8000, price: 2000, unit: 'box', emoji: '🎇', desc: '120-shot multicolour aerial barrage — vibrant colors burst in rapid sequence for an epic display.' },
  { id: 117, name: '200 Shot Multicolour', nameTa: '200 சாட் மல்டி கலர்', cat: 'fancy-shots', mrp: 14400, price: 3600, unit: 'box', emoji: '🎇', desc: '200-shot multicolour aerial barrage — the ultimate vibrant color burst show for big events.' },
  { id: 118, name: '240 Shot Multicolour', nameTa: '240 சாட் மல்டி கலர்', cat: 'fancy-shots', mrp: 16000, price: 4000, unit: 'box', emoji: '🎇', desc: '240-shot multicolour aerial barrage — the grandest vibrant color burst show imaginable.' },
  { id: 119, name: '10×10 Shot Multicolour', nameTa: '10×10 சாட்', cat: 'fancy-shots', mrp: 12000, price: 3000, unit: 'box', emoji: '🎇', desc: '10×10 shot multicolour aerial barrage — simultaneous grid burst of vibrant colors.' },

  // FANCY PIPE ITEMS
  { id: 120, name: '1" Pipe', nameTa: '1" பைப்', cat: 'fancy-pipe', mrp: 200, price: 50, unit: 'box', emoji: '🎑', desc: '1" fancy pipe comet producing sustained aerial bursts with brilliant trails.' },
  { id: 121, name: '2" Pipe', nameTa: '2" பைப்', cat: 'fancy-pipe', mrp: 400, price: 100, unit: 'box', emoji: '🎑', desc: '2" fancy pipe comet producing sustained aerial bursts with brilliant trails.' },
  { id: 122, name: '2" Pipe (3 pcs)', nameTa: '2" பைப் 3 pcs', cat: 'fancy-pipe', mrp: 1200, price: 300, unit: 'box', emoji: '🎑', desc: '2" fancy pipe comet producing sustained aerial bursts with brilliant trails. 3-piece set.' },
  { id: 123, name: '3" Pipe', nameTa: '3" பைப்', cat: 'fancy-pipe', mrp: 1320, price: 330, unit: 'box', emoji: '🎑', desc: '3" fancy pipe comet producing sustained aerial bursts with brilliant trails.' },
  { id: 124, name: '3 1/2" Pipe', nameTa: '3 1/2" பைப்', cat: 'fancy-pipe', mrp: 1600, price: 400, unit: 'box', emoji: '🎑', desc: '3.5" fancy pipe comet producing sustained aerial bursts with brilliant trails.' },
  { id: 125, name: '4" Pipe Naiyagara Falls', nameTa: '4" பைப் Naiyagara', cat: 'fancy-pipe', mrp: 1800, price: 450, unit: 'box', emoji: '🎑', desc: '4" Naiyagara Falls fancy pipe comet producing sustained cascading aerial bursts.' },
  { id: 126, name: '4 1/2" Pipe (7 Steps)', nameTa: '4 1/2" பைப் 7 Steps', cat: 'fancy-pipe', mrp: 2000, price: 500, unit: 'box', emoji: '🎑', desc: '4.5" fancy pipe comet with 7-step effects producing sustained spectacular aerial bursts.' },
  { id: 127, name: '4 1/2" Pipe Double Ball', nameTa: '4 1/2" டபுல் பால்', cat: 'fancy-pipe', mrp: 2000, price: 500, unit: 'box', emoji: '🎑', desc: '4.5" double ball fancy pipe comet producing two simultaneous brilliant aerial bursts.' },
  { id: 128, name: '5" Pipe Naiyagara Falls', nameTa: '5" பைப் Naiyagara', cat: 'fancy-pipe', mrp: 2000, price: 500, unit: 'box', emoji: '🎑', desc: '5" Naiyagara Falls fancy pipe comet producing the largest sustained cascading aerial bursts.' },
  { id: 129, name: '5" Pipe (2 pcs)', nameTa: '5" பைப் 2 pcs', cat: 'fancy-pipe', mrp: 4000, price: 1000, unit: 'box', emoji: '🎑', desc: '5" fancy pipe comet producing sustained aerial bursts with brilliant trails. 2-piece set.' },

  // SPARKLERS
  { id: 130, name: '7cm Electric Sparkler', nameTa: '7cm கம்பி', cat: 'sparklers', mrp: 36, price: 9, unit: 'box', emoji: '✨', desc: '7cm sparkler with bright electric white sparks — perfect for handheld Diwali fun.' },
  { id: 131, name: '7cm Colour Sparkler', nameTa: '7cm கலர் கம்பி', cat: 'sparklers', mrp: 52, price: 13, unit: 'box', emoji: '✨', desc: '7cm sparkler with multi-color sparks — perfect for handheld Diwali fun.' },
  { id: 132, name: '7cm Green Sparkler', nameTa: '7cm பச்சை கம்பி', cat: 'sparklers', mrp: 56, price: 14, unit: 'box', emoji: '✨', desc: '7cm sparkler with vivid green sparks — perfect for handheld Diwali fun.' },
  { id: 133, name: '7cm Red Sparkler', nameTa: '7cm சிவப்பு கம்பி', cat: 'sparklers', mrp: 68, price: 17, unit: 'box', emoji: '✨', desc: '7cm sparkler with brilliant red sparks — perfect for handheld Diwali fun.' },
  { id: 134, name: '10cm Electric Sparkler', nameTa: '10cm கம்பி', cat: 'sparklers', mrp: 72, price: 18, unit: 'box', emoji: '✨', desc: '10cm sparkler with bright electric white sparks — perfect for handheld Diwali fun.' },
  { id: 135, name: '10cm Colour Sparkler', nameTa: '10cm கலர் கம்பி', cat: 'sparklers', mrp: 84, price: 21, unit: 'box', emoji: '✨', desc: '10cm sparkler with multi-color sparks — perfect for handheld Diwali fun.' },
  { id: 136, name: '10cm Green Sparkler', nameTa: '10cm பச்சை கம்பி', cat: 'sparklers', mrp: 92, price: 23, unit: 'box', emoji: '✨', desc: '10cm sparkler with vivid green sparks — perfect for handheld Diwali fun.' },
  { id: 137, name: '10cm Red Sparkler', nameTa: '10cm சிவப்பு கம்பி', cat: 'sparklers', mrp: 116, price: 26, unit: 'box', emoji: '✨', desc: '10cm sparkler with brilliant red sparks — perfect for handheld Diwali fun.' },
  { id: 138, name: '15cm Electric Sparkler', nameTa: '15cm கம்பி', cat: 'sparklers', mrp: 180, price: 45, unit: 'box', emoji: '✨', desc: '15cm sparkler with bright electric white sparks — longer burn for extra Diwali fun.' },
  { id: 139, name: '15cm Colour Sparkler', nameTa: '15cm கலர் கம்பி', cat: 'sparklers', mrp: 184, price: 46, unit: 'box', emoji: '✨', desc: '15cm sparkler with multi-color sparks — longer burn for extra Diwali fun.' },
  { id: 140, name: '15cm Green Sparkler', nameTa: '15cm பச்சை கம்பி', cat: 'sparklers', mrp: 192, price: 48, unit: 'box', emoji: '✨', desc: '15cm sparkler with vivid green sparks — longer burn for extra Diwali fun.' },
  { id: 141, name: '15cm Red Sparkler', nameTa: '15cm சிவப்பு கம்பி', cat: 'sparklers', mrp: 208, price: 52, unit: 'box', emoji: '✨', desc: '15cm sparkler with brilliant red sparks — longer burn for extra Diwali fun.' },
  { id: 142, name: '15cm All in One', nameTa: '15cm 3 in 1 (10pcs)', cat: 'sparklers', mrp: 800, price: 200, unit: 'box', emoji: '✨', desc: '15cm 3-in-1 assorted sparkler set with electric, colour and green sparks. 10-piece box.' },
  { id: 143, name: '30cm Electric Sparkler', nameTa: '30cm கம்பி', cat: 'sparklers', mrp: 184, price: 46, unit: 'box', emoji: '✨', desc: '30cm sparkler with bright electric white sparks — extra-long burn for spectacular Diwali fun.' },
  { id: 144, name: '30cm Colour Sparkler', nameTa: '30cm கலர் கம்பி', cat: 'sparklers', mrp: 192, price: 48, unit: 'box', emoji: '✨', desc: '30cm sparkler with multi-color sparks — extra-long burn for spectacular Diwali fun.' },
  { id: 145, name: '30cm Green Sparkler', nameTa: '30cm பச்சை கம்பி', cat: 'sparklers', mrp: 208, price: 52, unit: 'box', emoji: '✨', desc: '30cm sparkler with vivid green sparks — extra-long burn for spectacular Diwali fun.' },
  { id: 146, name: '30cm Red Sparkler', nameTa: '30cm சிவப்பு கம்பி', cat: 'sparklers', mrp: 220, price: 55, unit: 'box', emoji: '✨', desc: '30cm sparkler with brilliant red sparks — extra-long burn for spectacular Diwali fun.' },
  { id: 147, name: '30cm All in One', nameTa: '30cm 3 in 1 (6 pcs)', cat: 'sparklers', mrp: 800, price: 200, unit: 'box', emoji: '✨', desc: '30cm 3-in-1 assorted sparkler set with electric, colour and green sparks. 6-piece box.' },
  { id: 148, name: '50cm Electric Sparkler', nameTa: '50cm கம்பி', cat: 'sparklers', mrp: 800, price: 200, unit: 'box', emoji: '✨', desc: '50cm sparkler with bright electric white sparks — the longest burn for premium Diwali fun.' },
  { id: 149, name: '50cm Colour Sparkler', nameTa: '50cm கலர் கம்பி', cat: 'sparklers', mrp: 880, price: 220, unit: 'box', emoji: '✨', desc: '50cm sparkler with multi-color sparks — the longest burn for premium Diwali fun.' },
  { id: 150, name: 'Rotating Sparkler (Umbrella)', nameTa: 'ரோட்டேடிங் கம்பி குடை', cat: 'sparklers', mrp: 960, price: 240, unit: 'box', emoji: '✨', desc: 'Rotating umbrella sparkler with spinning multi-color sparks — a unique handheld Diwali showpiece.' },

  // GIFT BOXES (no discount)
  { id: 201, name: 'Gift Box 21 Items', nameTa: 'கிஃப்ட் பாக்ஸ் 21', cat: 'gift-boxes', mrp: 250, price: 250, unit: 'box', emoji: '🎁', noDiscount: true, desc: 'Curated Diwali gift box with 21 assorted fireworks — perfect for family gifting.' },
  { id: 202, name: 'Gift Box 25 Items', nameTa: 'கிஃப்ட் பாக்ஸ் 25', cat: 'gift-boxes', mrp: 310, price: 310, unit: 'box', emoji: '🎁', noDiscount: true, desc: 'Curated Diwali gift box with 25 assorted fireworks — perfect for family gifting.' },
  { id: 203, name: 'Gift Box 30 Items', nameTa: 'கிஃப்ட் பாக்ஸ் 30', cat: 'gift-boxes', mrp: 370, price: 370, unit: 'box', emoji: '🎁', noDiscount: true, desc: 'Curated Diwali gift box with 30 assorted fireworks — perfect for family gifting.' },
  { id: 204, name: 'Gift Box 35 Items', nameTa: 'கிஃப்ட் பாக்ஸ் 35', cat: 'gift-boxes', mrp: 440, price: 440, unit: 'box', emoji: '🎁', noDiscount: true, desc: 'Curated Diwali gift box with 35 assorted fireworks — perfect for family gifting.' },
  { id: 205, name: 'Gift Box 40 Items', nameTa: 'கிஃப்ட் பாக்ஸ் 40', cat: 'gift-boxes', mrp: 520, price: 520, unit: 'box', emoji: '🎁', noDiscount: true, desc: 'Curated Diwali gift box with 40 assorted fireworks — perfect for family gifting.' },
  { id: 206, name: 'Gift Box 51 Items', nameTa: 'கிஃப்ட் பாக்ஸ் 51', cat: 'gift-boxes', mrp: 760, price: 760, unit: 'box', emoji: '🎁', noDiscount: true, desc: 'Curated Diwali gift box with 51 assorted fireworks — perfect for family gifting.' },
  { id: 207, name: 'Gift Box 60 Items', nameTa: 'கிஃப்ட் பாக்ஸ் 60', cat: 'gift-boxes', mrp: 980, price: 980, unit: 'box', emoji: '🎁', noDiscount: true, desc: 'Curated Diwali gift box with 60 assorted fireworks — perfect for family gifting.' },
  { id: 208, name: 'Gift Box 70 Items', nameTa: 'கிஃப்ட் பாக்ஸ் 70', cat: 'gift-boxes', mrp: 1150, price: 1150, unit: 'box', emoji: '🎁', noDiscount: true, desc: 'Curated Diwali gift box with 70 assorted fireworks — the grandest gift for big celebrations.' },
];

const FEATURED_IDS = [51, 68, 119, 44, 82, 142, 65, 35, 203, 66, 60, 81];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getByCategory(cat) {
  if (cat === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.cat === cat);
}

function getCategoryMeta(id) {
  return CATEGORIES.find(c => c.id === id);
}
