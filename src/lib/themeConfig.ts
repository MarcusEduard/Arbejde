export type Theme = 'christmas' | 'easter';

export interface ThemeConfig {
  name: string;
  title: string;
  titleEmojis: [string, string];
  subtitle: string;
  characterName: string;
  characterEmoji: string;
  characterImage: string | null;
  characterGif: string | null;
  tableDecoration: string;
  cornerDecorations: [string, string, string, string];
  chairDecoration: string;
  assignedChairStar: string;
  unassignedChairIcon: string;
  // Gradients & colors
  bodyBg: string;
  headerGradient: string;
  cardGradient: string;
  shuffleCardGradient: string;
  cardBorder: string;
  buttonGradient: string;
  buttonBorder: string;
  headerTextColor: string;
  garlandGradient: string;
  seatedGuestGradient: string;
  // Shuffle
  shuffleTitle: string;
  shuffleText: string;
  shuffleSubText: string;
  shuffleEmojis: string[];
  shuffleButton: string;
  shuffleResultsTitle: string;
  // End screen
  allSeatedTitle: string;
  allSeatedSubtitle: string;
  allSeatedIcons: string;
  // Misc
  celebrationEmojis: string[];
  assignedText: string;
  startButton: string;
  continueGameButton: string;
  continuePartyButton: string;
  guestListTitle: string;
  challengeTitle: string;
  challengeComplete: string;
  challenges: string[];
  // Sounds
  animationSounds: string[];
  celebrationSounds: string[];
  shuffleToast: string;
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
  christmas: {
    name: 'Julefrokost',
    title: 'HT Julefrokost pladsfordeling',
    titleEmojis: ['🎅', '🎄'],
    subtitle: 'Lad julemanden bestemme hvor vi skal sidde i dag!',
    characterName: 'Julemanden',
    characterEmoji: '🎅',
    characterImage: '/Julemanden.png',
    characterGif: '/santa-santa-claus.gif',
    tableDecoration: '🎄',
    cornerDecorations: ['🎁', '🔔', '🦌', '⭐'],
    chairDecoration: '🎄',
    assignedChairStar: '⭐',
    unassignedChairIcon: '❄️',
    bodyBg: 'from-red-950 via-green-950 to-red-950',
    headerGradient: 'from-red-900/20 via-green-900/20 to-red-900/20',
    cardGradient: 'from-red-700 via-green-700 to-red-700',
    shuffleCardGradient: 'from-red-600 via-green-600 to-red-600',
    cardBorder: 'border-red-600/30',
    buttonGradient: 'from-red-600 to-green-600 hover:from-red-700 hover:to-green-700',
    buttonBorder: 'border-yellow-400',
    headerTextColor: 'text-red-700 dark:text-red-300',
    garlandGradient: 'from-red-600 via-green-600 to-red-600',
    seatedGuestGradient: 'from-red-600 to-green-600',
    shuffleTitle: '🎅 SURPRISE! 🎄',
    shuffleText: 'Julemanden siger vi skal skifte pladser!',
    shuffleSubText: '🔄 Alle skifter pladser! 🔄',
    shuffleEmojis: ['🎁', '🔔', '⭐', '❄️', '🎁'],
    shuffleButton: '🎅 SKIFT PLADSER NU! 🔄',
    shuffleResultsTitle: 'Julemandens pladsskift Resultater! 🎅',
    allSeatedTitle: '🎅🎉 ALLE GÆSTER ER PLACERET! 🎄✨',
    allSeatedSubtitle: '🎊 GLÆDELIG JUL OG NYD FESTEN! 🥳',
    allSeatedIcons: '🎁🦌🔔⭐🎁',
    celebrationEmojis: ['🎉', '🎊', '🎁', '⭐', '🔔', '❄️'],
    assignedText: 'Tildelte pladser',
    startButton: 'Start festen!',
    continueGameButton: 'Fortsæt spillet!',
    continuePartyButton: 'Fortsæt festen! 🎉',
    guestListTitle: '🎄 Julefrokost Gæster 🎅',
    challengeTitle: '🎄 UDFORDRING! 🎅',
    challengeComplete: '✅ Udfordring Gennemført!',
    challenges: [
      '🥃 Tag et shot snaps!',
      '🎤 Tag et shot snaps',
      '🍺 Bund en øl!',
      '💃 Tag et nosseshot!',
      '🎅 Tag et shot snaps!',
      '🤪 Fortæl en sjov joke!',
      '🎁 Giv et kompliment til én fra HT!',
      '🎄 Tag et shot snaps!',
      '⭐ Fortæl en sjov joke!',
      '🔔 Bund din øl!',
      '❄️ Drik fra pungen!',
    ],
    animationSounds: [
      'jingle-bells-bells-only-181672.mp3',
      'sound-effect-we-wish-you-a-merry-christmas-music-box-260037.mp3',
      '555-sonic-drum-rollm4a-09-34-49-431-62513.mp3',
    ],
    celebrationSounds: ['HOHOHO1.mp3', 'HOHOHO2.mp3', 'HOHOHO3.mp3'],
    shuffleToast: '🎅 Julemanden siger: DET ER TID TIL AT BLANDE! Alle skifter pladser!',
  },
  easter: {
    name: 'Påskefrokost',
    title: 'HT Påskefrokost pladsfordeling',
    titleEmojis: ['🐰', '🥚'],
    subtitle: 'Lad påskeharen bestemme hvor vi skal sidde i dag!',
    characterName: 'Påskeharen',
    characterEmoji: '🐰',
    characterImage: '/påskehare.png',
    characterGif: null,
    tableDecoration: '🐣',
    cornerDecorations: ['🌸', '🥚', '🐥', '🌷'],
    chairDecoration: '🌸',
    assignedChairStar: '🌷',
    unassignedChairIcon: '🥚',
    bodyBg: 'from-pink-950 via-yellow-950 to-purple-950',
    headerGradient: 'from-pink-900/20 via-yellow-900/20 to-purple-900/20',
    cardGradient: 'from-pink-700 via-yellow-600 to-purple-700',
    shuffleCardGradient: 'from-pink-600 via-yellow-500 to-purple-600',
    cardBorder: 'border-pink-600/30',
    buttonGradient: 'from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600',
    buttonBorder: 'border-pink-300',
    headerTextColor: 'text-pink-700 dark:text-pink-300',
    garlandGradient: 'from-pink-500 via-yellow-400 to-purple-500',
    seatedGuestGradient: 'from-pink-500 to-yellow-400',
    shuffleTitle: '🐰 SURPRISE! 🥚',
    shuffleText: 'Påskeharen siger vi skal skifte pladser!',
    shuffleSubText: '🔄 Alle skifter pladser! 🔄',
    shuffleEmojis: ['🥚', '🌸', '🐰', '🌷', '🐣'],
    shuffleButton: '🐰 SKIFT PLADSER NU! 🔄',
    shuffleResultsTitle: 'Påskeharens pladsskift Resultater! 🐰',
    allSeatedTitle: '🐰🎉 ALLE GÆSTER ER PLACERET! 🥚✨',
    allSeatedSubtitle: '🎊 GOD PÅSKE OG NYD FESTEN! 🥳',
    allSeatedIcons: '🥚🐰🌸🌷🐣',
    celebrationEmojis: ['🎉', '🎊', '🥚', '🐰', '🌸', '🌷'],
    assignedText: 'Tildelte pladser',
    startButton: 'Start festen!',
    continueGameButton: 'Fortsæt spillet!',
    continuePartyButton: 'Fortsæt festen! 🎉',
    guestListTitle: '🐰 Påskefrokost Gæster 🥚',
    challengeTitle: '🥚 UDFORDRING! 🐰',
    challengeComplete: '✅ Udfordring Gennemført!',
    challenges: [
      '🥚 Tag et påskeskud!',
      '🐰 Tag et shot og hop som en hare!',
      '🍺 Bund en øl!',
      '💃 Tag et nosseshot!',
      '🐣 Tag et shot snaps!',
      '🌸 Fortæl en sjov joke!',
      '🎁 Giv et kompliment til én fra HT!',
      '🥚 Tag et shot snaps!',
      '🌷 Fortæl en sjov joke!',
      '🐰 Bund din øl!',
      '🌼 Drik fra pungen!',
    ],
    animationSounds: [
      '555-sonic-drum-rollm4a-09-34-49-431-62513.mp3',
    ],
    celebrationSounds: [],
    shuffleToast: '🐰 Påskeharen siger: DET ER TID TIL AT BLANDE! Alle skifter pladser!',
  },
};
