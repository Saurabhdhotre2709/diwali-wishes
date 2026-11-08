const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`;

export const diwaliConfig = {
  name: 'Beautiful', nickname: '',
  audio: { music: publicAsset('audio/background-music.mp3'), volume: 0.28, duckedVolume: 0.09, effectsVolume: 0.86, playbackRate: { anar: 1.05, chakri: 1.15, rocketLaunch: 1.08, ladi: 1.05 }, paths: { anar: publicAsset('audio/anar.mp3'), chakri: publicAsset('audio/chakri.mp3'), rocketLaunch: publicAsset('audio/rocket.mp3'), rocketExplosion: null, ladi: publicAsset('audio/ladi.mp3'), final: null } },
  palette: { ivory: '#F8F1E5', cream: '#FFF9EF', maroon: '#642C35', gold: '#B8955A', brown: '#735F50' },
  animationDuration: { anar: 2620, chakri: 3500, rocket: 2850, ladi: 1720, final: 2900 },
  screens: [
    { heading: 'Hey, {name}! ♡', message: 'This Diwali, I have a little surprise for you.\n\nBut before I wish you,\nI need you to light up something first...\n\nReady?', instruction: '✦  Tap the Anar below  ✦', cracker: 'anar', label: 'Light the Anar' },
    { heading: 'Okay, so...', message: "You know what makes my Diwali special?\n\nIt's not the lights.\nIt's not the sweets.\nIt's not even the fireworks.\n\nIt's YOU, silly! ♡\n\nNow, don't smile too much.", instruction: 'Tap the Chakri', cracker: 'chakri', label: 'Spin the Chakri' },
    { heading: 'If I could wish for just one thing...', message: "It wouldn't be a gift.\nIt wouldn't be a million lights.\n\nIt would be more moments with you.\n\nMore smiles.\nMore silly conversations.\nMore memories.\n\nAnd a little more of us. ♡", instruction: 'Tap the Rocket to see what’s next', cracker: 'rocket', label: 'Launch the Rocket' },
    { heading: 'A little secret...', message: "Even if I had a thousand crackers to burst,\na thousand diyas to light,\nand a thousand wishes to make...\n\nI'd still choose to spend this Diwali\nwith the same person.\n\nYou. ♡\n\nAnd yes, you're stuck with me.", instruction: 'Tap the Ladi', cracker: 'ladi', label: 'Light the Ladi' },
    { heading: 'Happy Diwali, My Love! ♡', message: "May your life always be filled with happiness,\nyour heart with peace,\nand your days with endless reasons to smile.\n\nMay every dream of yours come true.\n\nAnd through every Diwali,\nevery celebration,\nand every little moment in between...\n\nI hope I get to be right there with you.\n\nI love you. ♡", finalLine: '✦  Happy Diwali, {name}  ✦', instruction: 'Tap for one more little firework', cracker: 'final', label: 'Set off a little Diwali firework', final: true }
  ]
};
