/* ================= RealWin core ================= */
'use strict';
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const nf=new Intl.NumberFormat('en-US');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- safe storage ---------- */
const store=(()=>{try{const k='__t';localStorage.setItem(k,'1');localStorage.removeItem(k);return localStorage}catch(e){const m={};return{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k]}}})();
const sstore=(()=>{try{const k='__t';sessionStorage.setItem(k,'1');sessionStorage.removeItem(k);return sessionStorage}catch(e){const m={};return{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k]}}})();

/* ---------- icons ---------- */
const ICONS={
menu:'<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
x:'<path d="M18 6 6 18M6 6l12 12"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
wallet:'<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
sliders:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
gem:'<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
chevD:'<path d="m6 9 6 6 6-6"/>',chevR:'<path d="m9 18 6-6-6-6"/>',chevL:'<path d="m15 18-6-6 6-6"/>',
arrR:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
arrUp:'<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>',
arrDn:'<line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/>',
heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
star:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
history:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
shieldCheck:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
copy:'<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
check:'<path d="M20 6 9 17l-5-5"/>',
eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
eyeOff:'<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 11s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>',
logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
key:'<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
message:'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',minus:'<path d="M5 12h14"/>',
refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
play:'<polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/>',
max:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
spade:'<path d="M12 2C9 7 4 9 4 13a4 4 0 0 0 7 2.6c0 2-.5 3.4-2 5.4h6c-1.5-2-2-3.4-2-5.4A4 4 0 0 0 20 13c0-4-5-6-8-11Z" fill="currentColor" stroke="none"/>',
zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none"/>',
dice:'<rect width="18" height="18" x="3" y="3" rx="4"/><circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" stroke="none"/>',
flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
sparkles:'<path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/>',
percent:'<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
chart:'<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
coins:'<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
football:'<circle cx="12" cy="12" r="10"/><path d="M12 7l4.76 3.45L14.94 16h-5.88L7.24 10.45Z"/><path d="M12 7V2.5"/><path d="m16.76 10.45 4.3-1.4"/><path d="m14.94 16 2.66 3.66"/><path d="m9.06 16-2.66 3.66"/><path d="m7.24 10.45-4.3-1.4"/>',
basketball:'<circle cx="12" cy="12" r="10"/><path d="M4.9 4.9a14.14 14.14 0 0 1 0 14.2"/><path d="M19.1 4.9a14.14 14.14 0 0 0 0 14.2"/><path d="M2 12h20"/><path d="M12 2v20"/>',
tennis:'<circle cx="12" cy="12" r="10"/><path d="M5 5.5c3 2.2 3 10.8 0 13"/><path d="M19 5.5c-3 2.2-3 10.8 0 13"/>',
gamepad:'<line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect width="20" height="12" x="2" y="6" rx="6"/>',
headset:'<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="3" y="14" width="4" height="6" rx="2"/><rect x="17" y="14" width="4" height="6" rx="2"/>',
file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
timer:'<line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="14" x2="15" y2="11"/><circle cx="12" cy="14" r="8"/>',
rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
bomb:'<circle cx="11" cy="13" r="8"/><path d="m19.5 4.5-3 3"/><path d="M20 3l1 1"/><path d="M17.5 6.5 19 5"/>',
target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'
};
const ic=(n,s=18,cls='')=>`<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;

/* ---------- crypto coins ---------- */
const COINS=[
 {s:'USDT',n:'Tether',dp:2,c:'#26A17B'},
 {s:'BTC',n:'Bitcoin',dp:8,c:'#F7931A'},
 {s:'ETH',n:'Ethereum',dp:6,c:'#627EEA'},
 {s:'SOL',n:'Solana',dp:4,c:'#9945FF'},
 {s:'TON',n:'Toncoin',dp:4,c:'#0098EA'},
 {s:'TRX',n:'Tron',dp:2,c:'#EF0027'},
 {s:'LTC',n:'Litecoin',dp:6,c:'#88A0C8'},
 {s:'DOGE',n:'Dogecoin',dp:2,c:'#C2A633'},
 {s:'XRP',n:'XRP',dp:2,c:'#3E6BD6'},
 {s:'BNB',n:'BNB',dp:5,c:'#F3BA2F'},
 {s:'USDC',n:'USD Coin',dp:2,c:'#2775CA'},
 {s:'ADA',n:'Cardano',dp:2,c:'#2A5FD0'}
];
const RATES={USDT:1,BTC:118250,ETH:3840,SOL:212,TON:7.15,TRX:0.164,LTC:96.4,DOGE:0.142,XRP:0.63,BNB:645,USDC:1,ADA:0.56};
const NETWORKS={USDT:['TRC20','ERC20','BEP20','TON','Solana'],BTC:['Bitcoin','Lightning'],ETH:['ERC20','Arbitrum','Base'],SOL:['Solana'],TON:['TON'],TRX:['TRC20'],LTC:['Litecoin'],DOGE:['Dogecoin'],XRP:['XRP Ledger'],BNB:['BEP20'],USDC:['ERC20','Solana','Base'],ADA:['Cardano']};
const FEES={USDT:1,BTC:0.00002,ETH:0.0008,SOL:0.001,TON:0.05,TRX:1,LTC:0.001,DOGE:2,XRP:0.2,BNB:0.0003,USDC:1,ADA:0.4};
const coinBy=s=>COINS.find(c=>c.s===s)||COINS[0];
const coinIcon=(s,size=22)=>{const c=coinBy(s);const cls=size<=16?'s16':size>=28?'s28':'';return `<span class="cico ${cls}"><span class="fb" style="background:${c.c}">${c.s.slice(0,size<=16?1:2)}</span><img src="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${c.s.toLowerCase()}.svg" alt="${c.s}" style="position:relative" onerror="this.remove()"></span>`};

/* ---------- money format ---------- */
const toUsd=(a,s)=>a*(RATES[s]||1);
const fromUsd=(a,s)=>a/(RATES[s]||1);
const fmtN=(v,dp)=>{let x=Number(v).toFixed(dp);if(dp>2)x=x.replace(/0+$/,'').replace(/\.$/,'.00'),x=x.includes('.')?(x.split('.')[1].length<2?x+'0':x):x+'.00';const [i,d]=x.split('.');return nf.format(+i)+(d?'.'+d:'')};
const fc=(a,s)=>fmtN(a,coinBy(s).dp);
const fusd=a=>'$'+fmtN(a,2);

/* ================= i18n ================= */
const I18N={
en:{
 'nav.casino':'Casino','nav.sports':'Sports','nav.promos':'Bonuses','nav.vip':'VIP Club','nav.affiliate':'Affiliate','nav.support':'Support','nav.fairness':'Fairness','nav.lobby':'Lobby','nav.originals':'Originals','nav.slots':'Slots','nav.live':'Live Casino','nav.new':'New Releases','nav.popular':'Popular','nav.favorites':'Favorites','nav.menu':'Menu','nav.games':'Games','nav.other':'Other',
 'a.login':'Sign In','a.register':'Sign Up','a.logout':'Log Out','a.deposit':'Deposit','a.withdraw':'Withdraw','a.playnow':'Play Now','a.play':'Play','a.demo':'Demo','a.real':'Real','a.viewall':'View all','a.claim':'Claim','a.claimed':'Claimed','a.copy':'Copy','a.copied':'Copied!','a.save':'Save','a.cancel':'Cancel','a.confirm':'Confirm','a.back':'Back','a.more':'Learn more','a.search':'Search','a.bet':'Bet','a.cashout':'Cash Out','a.close':'Close','a.send':'Send','a.online':'online','a.allgames':'All games',
 'home.h1':'Play bigger.','home.h1b':'Win real.','home.sub':'Next-gen crypto casino — 3,000+ games, instant payouts and a welcome pack up to 1,000 USDT.','home.eyebrow':'Welcome pack 200% + 50 FS','home.cta1':'Create account','home.cta2':'Explore casino',
 'home.b2.eyebrow':'Slots of the week','home.b2.h1':'Top drops & fresh releases','home.b2.sub':'Gates of Olympus, Sweet Bonanza, Wanted Dead or a Wild and hundreds more.','home.b2.cta':'Open slots',
 'home.b3.eyebrow':'Sportsbook','home.b3.h1':'Bet on every match','home.b3.sub':'Football, basketball, tennis and esports with live odds and instant settlement.','home.b3.cta':'Go to sports',
 'home.b4.eyebrow':'RealWin VIP','home.b4.h1':'A club for high players','home.b4.sub':'Rakeback, weekly cashback, personal host and level-up rewards.','home.b4.cta':'About VIP',
 'home.qc1':'Casino','home.qc1s':'3,000+ games','home.qc2':'Sports','home.qc2s':'40+ disciplines','home.qc3':'Originals','home.qc3s':'Provably fair','home.qc4':'Bonuses','home.qc4s':'Daily offers',
 'home.stats.bets':'Bets in 24h','home.stats.paid':'Paid out in 24h','home.stats.online':'Players online','home.stats.games':'Games in catalog',
 'home.feed':'Live wins','home.race':'Weekly race','home.race.sub':'Prize pool 10,000 USDT','home.providers':'Providers',
 'row.originals':'RealWin Originals','row.popular':'Popular right now','row.live':'Live Casino','row.new':'New releases',
 'feed.game':'Game','feed.player':'Player','feed.bet':'Bet','feed.mult':'Multiplier','feed.payout':'Payout','feed.hidden':'Hidden',
 'casino.title':'Casino','casino.sub':'Slots, live tables and exclusive RealWin Originals.','casino.search':'Search 3,000+ games…','casino.allprov':'All providers','casino.found':'{n} games','casino.nores':'Nothing found','casino.nores.sub':'Try another search or reset filters','casino.favlogin':'Sign in to save favorites',
 'cat.all':'All','cat.slots':'Slots','cat.live':'Live','cat.originals':'Originals','cat.new':'New','cat.popular':'Popular','cat.favorites':'Favorites',
 'game.rtp':'RTP','game.vol':'Volatility','game.provider':'Provider','game.maxwin':'Max win','game.similar':'You may also like','game.about':'About this game','game.desc.slot':'{name} by {prov} — a premium video slot with {rtp}% RTP and {vol} volatility.','game.desc.live':'{name} — a live studio experience by {prov}. Real dealers, real-time action. Demo emulation on RealWin.','game.desc.orig':'{name} — an exclusive RealWin Original with a provably fair algorithm and {rtp}% RTP. Set your bet, tune the risk and cash out at the right moment.','game.vol.low':'Low','game.vol.med':'Medium','game.vol.high':'High','game.fair':'Provably Fair','game.demo.note':'Demo emulation. Balance: fun credits.','game.real.note':'Playing with real balance','game.login.note':'Sign in to play with real balance','game.notbal':'Not enough balance','game.minbet':'Min bet','game.win':'You won {a}','game.lose':'No luck — try again','game.amount':'Bet amount','game.profitOn':'Profit on win','game.chance':'Win chance','game.payout':'Payout','game.turbo':'Turbo','game.paytable':'Paytable','game.spin':'Spin','game.betplaced':'Bet placed','game.fs':'Fullscreen',
 'dice.over':'Roll Over','dice.under':'Roll Under','dice.target':'Target','dice.roll':'Roll',
 'mines.mines':'Mines','mines.gems':'Gems','mines.next':'Next tile','mines.total':'Total payout','mines.start':'Start game','mines.pick':'Pick a tile…','mines.boom':'Boom! Mine hit',
 'crash.next':'Next round in','crash.flying':'In flight…','crash.crashed':'Crashed','crash.placebet':'Bet (next round)','crash.betqueued':'Bet queued for next round','crash.players':'Players','crash.youwon':'Cashed out {m}×',
 'plinko.risk':'Risk','plinko.rows':'Rows','plinko.drop':'Drop ball','plinko.low':'Low','plinko.med':'Medium','plinko.high':'High',
 'limbo.target':'Target multiplier','limbo.betbtn':'Bet',
 'flip.heads':'Blue','flip.tails':'Dark','flip.pick':'Pick a side','flip.flip':'Flip',
 'slot.lines':'10 fixed paylines','slot.bet':'Total bet','slot.win':'WIN',
 'auth.welcome':'Welcome to RealWin','auth.login.sub':'Good to see you again. Enter your details.','auth.reg.sub':'60 seconds to sign up — instant crypto deposits.','auth.email':'Email','auth.password':'Password','auth.username':'Username','auth.promo':'Promo code (optional)','auth.terms':'I am 18+ and accept the <a href="#/terms">Terms of Service</a> and <a href="#/privacy">Privacy Policy</a>','auth.create':'Create account','auth.signin':'Sign in','auth.have':'Already have an account?','auth.nohave':'New to RealWin?','auth.forgot':'Forgot password?','auth.or':'or continue with','auth.err.email':'Enter a valid email','auth.err.user':'3–16 characters, letters and digits','auth.err.pass':'At least 6 characters','auth.err.terms':'Confirm your age and accept the terms','auth.err.exists':'An account with this email already exists','auth.err.creds':'Wrong email or password','auth.hello':'Welcome back, {n}!','auth.created':'Account created — welcome bonus is waiting in Promotions','auth.reset.sent':'Reset link sent to {e} (demo)','auth.side1':'Instant crypto deposits & withdrawals','auth.side2':'3,000+ slots, live casino and originals','auth.side3':'Welcome pack up to 1,000 USDT + 50 FS','auth.side4':'Provably fair — verify every bet',
 'w.title':'Wallet','w.deposit':'Deposit','w.withdraw':'Withdraw','w.buy':'Buy Crypto','w.network':'Network','w.address':'Your personal {c} deposit address','w.min':'Min deposit: {a}. Credited after 1 network confirmation.','w.simulate':'Simulate deposit +1,000 USDT (demo)','w.wd.address':'Withdrawal address','w.wd.amount':'Amount','w.wd.fee':'Network fee','w.wd.get':'You will receive','w.wd.btn':'Request withdrawal','w.wd.min':'Min withdrawal: {a}','w.wd.err.addr':'Enter a valid address (20+ characters)','w.wd.err.amt':'Amount exceeds available balance','w.wd.pending':'Withdrawal created — processing','w.wd.done':'Withdrawal sent','w.buy.sub':'Buy crypto with a card via our on-ramp partners. Available after launch integration (MoonPay / Transak).','w.buy.calc':'Quick calculator','w.dep.done':'Deposit credited','w.balance':'Balance','w.fiatview':'Show in USD','w.search':'Search coin…',
 'prof.overview':'Overview','prof.wallet':'Wallet','prof.tx':'Transactions','prof.bets':'My Bets','prof.settings':'Settings','prof.verify':'Verification','prof.refs':'Referrals','prof.title':'Profile','prof.joined':'Joined {d}','prof.totalbets':'Total bets','prof.wins':'Wins','prof.wagered':'Wagered','prof.pnl':'Profit / Loss','prof.recent':'Recent bets','prof.nobets':'No bets yet — pick a game in the casino','prof.level':'Level','prof.tolevel':'{a} wagered to {l}',
 'tx.type':'Type','tx.amount':'Amount','tx.status':'Status','tx.date':'Date','tx.empty':'No transactions yet','tx.dep':'Deposit','tx.wd':'Withdrawal','tx.bet':'Bet','tx.win':'Win','tx.bonus':'Bonus','tx.rake':'Rakeback','tx.done':'Completed','tx.pending':'Processing','tx.all':'All',
 'bets.game':'Game','bets.result':'Result','bets.casino':'Casino','bets.sport':'Sports','bets.open':'Open','bets.won':'Won','bets.lost':'Lost','bets.empty':'No bets in this section',
 'set.title':'Settings','set.lang':'Interface language','set.lang.sub':'Applies instantly across the site','set.priv':'Hide me from public feeds','set.priv.sub':'Your wins will show as “Hidden”','set.2fa':'Two-factor authentication (2FA)','set.2fa.sub':'TOTP one-time codes on sign-in','set.2fa.on':'2FA enabled','set.2fa.off':'2FA disabled','set.2fa.scan':'Scan the QR in Google Authenticator and enter a 6-digit code','set.2fa.code':'6-digit code','set.2fa.err':'Enter a 6-digit code','set.pass':'Change password','set.pass.cur':'Current password','set.pass.new':'New password','set.pass.done':'Password updated','set.pass.err':'Wrong current password','set.limits':'Responsible gaming','set.dep.lim':'Daily deposit limit (USDT)','set.loss.lim':'Daily loss limit (USDT)','set.cool':'Cool-off (block betting)','set.cool.24':'24 hours','set.cool.7':'7 days','set.cool.0':'Off','set.cool.on':'Betting is paused until {d}','set.saved':'Settings saved','set.session':'Active sessions','set.thisdev':'This device','set.del':'Delete account','set.del.sub':'Erases the demo account and all data','set.del.confirm':'Delete account and all data? This cannot be undone.','set.limit.hit':'Deposit limit reached',
 'kyc.title':'Identity verification','kyc.sub':'Verification unlocks higher limits and fiat on-ramps.','kyc.s1':'Email confirmed','kyc.s2':'Identity document','kyc.s2s':'Passport or ID card, both sides','kyc.s3':'Address & selfie','kyc.s3s':'Utility bill + selfie with document','kyc.upload':'Upload documents','kyc.pending':'Documents under review — usually up to 24h (demo: ~45 sec)','kyc.done':'Verification passed','kyc.status.none':'Not verified','kyc.status.pending':'In review','kyc.status.ok':'Verified',
 'ref.title':'Invite friends — earn crypto','ref.sub':'Get 25% of the house edge from every friend\'s wager. Paid instantly to your balance.','ref.link':'Your referral link','ref.stat1':'Invited','ref.stat2':'Active','ref.stat3':'Earned','ref.how':'How it works','ref.h1':'Share your link','ref.h1s':'In chats, socials or your channel','ref.h2':'Friends sign up & play','ref.h2s':'Any games: casino, originals, sports','ref.h3':'You earn forever','ref.h3s':'25% revshare, no caps, instant payout',
 'promo.title':'Bonuses & Promotions','promo.sub':'Promo codes, bonuses, races and cashback — updated weekly.','promo.terms':'Terms & conditions','promo.needauth':'Sign in to claim','promo.w.t':'Welcome Pack 200%','promo.w.d':'Up to 1,000 USDT + 50 free spins on your first deposits.','promo.w.b':'+500 USDT demo credited','promo.cb.t':'Weekly Cashback 10%','promo.cb.d':'Every Monday we return up to 10% of net losses. No wagering.','promo.cb.b':'Cashback credited','promo.rk.t':'Rakeback 5%','promo.rk.d':'Instant rakeback from every bet, claim any time.','promo.rk.b':'Rakeback claimed','promo.rk.avail':'Available to claim','promo.rl.t':'Friday Reload 50%','promo.rl.d':'Boost your Friday deposit by 50% up to 200 USDT.','promo.rl.b':'Reload bonus credited','promo.race.t':'Weekly Race','promo.race.d':'10,000 USDT prize pool. Top-100 by wager share the pool.','promo.race.lead':'Leaderboard','promo.race.you':'You','promo.race.prize':'Prize','promo.nothing':'Nothing to claim yet','promo.claimed.already':'Already claimed',
 'vip.title':'RealWin VIP Club','vip.sub':'Loyalty that pays: rakeback, cashback, gifts and a personal host.','vip.cur':'Your level','vip.next':'Next level','vip.wagered':'Wagered','vip.b':'Bronze','vip.s':'Silver','vip.g':'Gold','vip.p':'Platinum','vip.d':'Diamond','vip.none':'New player','vip.perk.rb':'Rakeback {p}%','vip.perk.cb':'Cashback {p}%','vip.perk.lvl':'Level-up bonus','vip.perk.gift':'Monthly gift','vip.perk.host':'Personal VIP host','vip.perk.wd':'Priority withdrawals','vip.faq1':'How do levels work?','vip.faq1a':'Levels grow with your total wager across all games. Each level increases rakeback and cashback and unlocks new perks.','vip.faq2':'When is cashback paid?','vip.faq2a':'Every Monday, automatically. Rakeback can be claimed any time on the Promotions page.',
 'aff.title':'Affiliate program','aff.sub':'Up to 45% RevShare, sub-affiliate 5%, instant crypto payouts.','aff.cta':'Become a partner','aff.t1':'RevShare up to 45%','aff.t1s':'Lifetime share of the house edge from your players','aff.t2':'CPA & Hybrid','aff.t2s':'Individual terms from 500 FTDs / month','aff.t3':'Instant payouts','aff.t3s':'USDT, BTC, ETH — no minimum holds',
 'sp.title':'Sports','sp.sub':'Live odds, instant settlement, esports included.','sp.live':'LIVE','sp.upcoming':'Upcoming','sp.betslip':'Bet Slip','sp.empty':'Click on odds to add a selection','sp.stake':'Stake','sp.single':'Singles','sp.multi':'Multi ({n} legs)','sp.totalodds':'Total odds','sp.payout':'Potential payout','sp.place':'Place bet','sp.placed':'Bet placed — good luck!','sp.mybets':'My open bets','sp.settled':'Bet settled: {r}','sp.won':'won','sp.lost':'lost','sp.market':'1X2','sp.football':'Football','sp.basketball':'Basketball','sp.tennis':'Tennis','sp.cs':'CS 2','sp.dota':'Dota 2','sp.min':'{n}′',
 'sup.title':'Support 24/7','sup.sub':'Average reply — under 2 minutes in live chat.','sup.chat':'Live chat','sup.chat.s':'Fastest way to get help','sup.email':'Email','sup.email.s':'support@realwin.example','sup.ticket':'Create a ticket','sup.subj':'Subject','sup.msg':'Describe your issue','sup.sent':'Ticket #{n} created — we will email you','sup.faq':'Frequent questions','sup.open':'Open chat',
 'faq.q1':'How fast are deposits?','faq.a1':'Crypto deposits are credited after 1 network confirmation — usually 1–3 minutes for TRC20 USDT.','faq.q2':'What is the minimum withdrawal?','faq.a2':'Equivalent of 10 USDT for most coins. Network fee is shown before you confirm.','faq.q3':'Do I need KYC?','faq.a3':'Basic play is KYC-free. Verification unlocks higher limits and card on-ramps.','faq.q4':'What is Provably Fair?','faq.a4':'Every Originals result is derived from a server seed (hashed in advance), your client seed and a nonce — verify any round on the Fairness page.','faq.q5':'Which currencies are supported?','faq.a5':'12 cryptocurrencies including USDT, BTC, ETH, TON, SOL. Default display currency is USDT.','faq.q6':'How do bonuses work?','faq.a6':'Each promo has its own terms — check the promo page. Rakeback is wager-free and instant.',
 'fair.title':'Provably Fair','fair.sub':'Every Originals bet can be independently verified.','fair.how':'How it works','fair.p1':'Before a round we generate a secret server seed and show you its SHA-256 hash — proof the result is fixed in advance.','fair.p2':'You set any client seed. The result is computed from HMAC(serverSeed, clientSeed:nonce).','fair.p3':'After rotating the seed pair we reveal the old server seed so you can recompute every result.','fair.client':'Client seed','fair.server':'Server seed (SHA-256 hash)','fair.nonce':'Nonce','fair.rotate':'Rotate seed pair','fair.revealed':'Previous server seed revealed:','fair.saved':'Client seed updated',
 'legal.terms':'Terms of Service','legal.privacy':'Privacy Policy','legal.resp':'Responsible Gaming','legal.aml':'AML / KYC Policy','legal.about':'About RealWin',
 'ftr.about':'RealWin is a next-generation crypto gaming platform: 3,000+ games, sportsbook, instant payouts and provably fair originals.','ftr.casino':'Casino','ftr.support':'Support','ftr.legal':'Legal','ftr.contact':'Contacts','ftr.rights':'© 2026 RealWin. All rights reserved.','ftr.resp':'Play responsibly. Gambling can be addictive.','ftr.age':'Players must be 18 or older.',
 'n.title':'Notifications','n.empty':'No notifications yet','n.readall':'Mark all as read','n.welcome.t':'Welcome to RealWin!','n.welcome.b':'1,000 USDT demo balance credited — try any game.','n.dep.t':'Deposit credited','n.wd.t':'Withdrawal completed','n.wd.p':'Withdrawal is processing','n.bonus.t':'Bonus credited','n.level.t':'Level up!','n.level.b':'You reached {l}. New perks unlocked.','n.kyc.t':'Verification passed','n.kyc.b':'Your account is now verified.','n.bet.t':'Bet settled',
 'chat.hello':'Hi! I\'m Anna from RealWin support 👋 How can I help?','chat.q1':'Deposit issues','chat.q2':'Bonus questions','chat.q3':'Verification','chat.q4':'Withdrawal time','chat.a1':'Deposits are credited after 1 confirmation. If it\'s been longer than 30 minutes, send me the TXID and I\'ll check it right away.','chat.a2':'Active offers live on the Promotions page. The welcome pack is credited automatically after your first deposit. Rakeback can be claimed any time.','chat.a3':'Go to Profile → Verification and upload your documents. Review usually takes minutes, up to 24h at peak load.','chat.a4':'Crypto withdrawals are processed instantly on our side; network delivery is usually 1–5 minutes depending on the coin.','chat.fallback':'Got it! I\'ve noted your question — a specialist will reply here shortly. Anything else I can help with?','chat.placeholder':'Type a message…','chat.agent':'Anna · Support','chat.online':'online',
 'search.title':'Game search','search.ph':'Game or provider…','search.popular':'Popular searches','search.nores':'Nothing found for “{q}”',
 'toast.copied':'Copied to clipboard','toast.fav.on':'Added to favorites','toast.fav.off':'Removed from favorites','toast.login.req':'Sign in to continue','toast.soon':'Available after launch — this is a demo build','toast.bye':'You are logged out','toast.langset':'Language switched to English',
 'misc.balance':'Balance','misc.currency':'Currency','misc.today':'today','misc.yesterday':'yesterday','misc.justnow':'just now','misc.min':'{n} min ago','misc.hr':'{n} h ago','misc.demo':'DEMO','misc.new':'NEW','misc.hot':'HOT','misc.exclusive':'EXCLUSIVE','misc.results':'Results','misc.of':'of',
 'promo.code.t':'Have a promo code?','promo.code.s':'Activate it and get an instant bonus to your balance','promo.code.ph':'Enter promo code','promo.code.btn':'Activate','promo.code.ok':'Promo code activated: +{a} USDT','promo.code.bad':'Code not found or already used',
 'pv.note.t':'Provider game','pv.note.b':'"{name}" by {prov} connects through the provider API at production launch. In this demo build, RealWin Originals are fully playable.','pv.open':'Open game','pv.playable':'Playable right now',
 'set.avatar':'Avatar','set.avatar.s':'JPG or PNG, stored in your browser','set.avatar.up':'Upload','set.avatar.rm':'Remove','set.avatar.ok':'Avatar updated'
},
ru:{
 'nav.casino':'Казино','nav.sports':'Спорт','nav.promos':'Бонусы','nav.vip':'VIP-клуб','nav.affiliate':'Партнёрам','nav.support':'Поддержка','nav.fairness':'Честность','nav.lobby':'Лобби','nav.originals':'Originals','nav.slots':'Слоты','nav.live':'Live-казино','nav.new':'Новинки','nav.popular':'Популярное','nav.favorites':'Избранное','nav.menu':'Меню','nav.games':'Игры','nav.other':'Прочее',
 'a.login':'Войти','a.register':'Регистрация','a.logout':'Выйти','a.deposit':'Пополнить','a.withdraw':'Вывести','a.playnow':'Играть','a.play':'Играть','a.demo':'Демо','a.real':'На деньги','a.viewall':'Все','a.claim':'Забрать','a.claimed':'Получено','a.copy':'Копировать','a.copied':'Скопировано!','a.save':'Сохранить','a.cancel':'Отмена','a.confirm':'Подтвердить','a.back':'Назад','a.more':'Подробнее','a.search':'Поиск','a.bet':'Ставка','a.cashout':'Забрать','a.close':'Закрыть','a.send':'Отправить','a.online':'онлайн','a.allgames':'Все игры',
 'home.h1':'Играй по-крупному.','home.h1b':'Выигрывай реально.','home.sub':'Криптоказино нового поколения — 3000+ игр, мгновенные выплаты и приветственный пакет до 1000 USDT.','home.eyebrow':'Приветственный пакет 200% + 50 FS','home.cta1':'Создать аккаунт','home.cta2':'В казино',
 'home.b2.eyebrow':'Слоты недели','home.b2.h1':'Топ-дропы и свежие релизы','home.b2.sub':'Gates of Olympus, Sweet Bonanza, Wanted Dead or a Wild и сотни других.','home.b2.cta':'Открыть слоты',
 'home.b3.eyebrow':'Спортбук','home.b3.h1':'Ставки на каждый матч','home.b3.sub':'Футбол, баскетбол, теннис и киберспорт: живые коэффициенты и мгновенный расчёт.','home.b3.cta':'К ставкам',
 'home.b4.eyebrow':'RealWin VIP','home.b4.h1':'Клуб для тех, кто играет всерьёз','home.b4.sub':'Рейкбек, еженедельный кэшбек, личный менеджер и награды за уровни.','home.b4.cta':'О VIP-клубе',
 'home.qc1':'Казино','home.qc1s':'3000+ игр','home.qc2':'Спорт','home.qc2s':'40+ дисциплин','home.qc3':'Originals','home.qc3s':'Provably Fair','home.qc4':'Бонусы','home.qc4s':'Каждый день',
 'home.stats.bets':'Ставок за 24 часа','home.stats.paid':'Выплачено за 24 часа','home.stats.online':'Игроков онлайн','home.stats.games':'Игр в каталоге',
 'home.feed':'Живые выигрыши','home.race':'Гонка недели','home.race.sub':'Призовой фонд 10 000 USDT','home.providers':'Провайдеры',
 'row.originals':'RealWin Originals','row.popular':'Сейчас популярно','row.live':'Live-казино','row.new':'Новинки',
 'feed.game':'Игра','feed.player':'Игрок','feed.bet':'Ставка','feed.mult':'Множитель','feed.payout':'Выплата','feed.hidden':'Скрытый',
 'casino.title':'Казино','casino.sub':'Слоты, live-столы и эксклюзивные RealWin Originals.','casino.search':'Поиск среди 3000+ игр…','casino.allprov':'Все провайдеры','casino.found':'{n} игр','casino.nores':'Ничего не найдено','casino.nores.sub':'Попробуйте другой запрос или сбросьте фильтры','casino.favlogin':'Войдите, чтобы сохранять избранное',
 'cat.all':'Все','cat.slots':'Слоты','cat.live':'Live','cat.originals':'Originals','cat.new':'Новинки','cat.popular':'Популярное','cat.favorites':'Избранное',
 'game.rtp':'RTP','game.vol':'Волатильность','game.provider':'Провайдер','game.maxwin':'Макс. выигрыш','game.similar':'Похожие игры','game.about':'Об игре','game.desc.slot':'{name} от {prov} — премиальный видеослот с RTP {rtp}% и {vol} волатильностью.','game.desc.live':'{name} — live-шоу от {prov}: реальные дилеры и действие в прямом эфире. Демо-эмуляция на RealWin.','game.desc.orig':'{name} — эксклюзив RealWin с алгоритмом Provably Fair и RTP {rtp}%. Задайте ставку, настройте риск и заберите выигрыш вовремя.','game.vol.low':'низкой','game.vol.med':'средней','game.vol.high':'высокой','game.fair':'Provably Fair','game.demo.note':'Демо-режим. Баланс: фан-кредиты.','game.real.note':'Игра на реальный баланс','game.login.note':'Войдите, чтобы играть на реальный баланс','game.notbal':'Недостаточно средств','game.minbet':'Мин. ставка','game.win':'Выигрыш {a}','game.lose':'Не повезло — попробуйте ещё','game.amount':'Сумма ставки','game.profitOn':'Прибыль при выигрыше','game.chance':'Шанс выигрыша','game.payout':'Выплата','game.turbo':'Турбо','game.paytable':'Таблица выплат','game.spin':'Крутить','game.betplaced':'Ставка принята','game.fs':'На весь экран',
 'dice.over':'Больше','dice.under':'Меньше','dice.target':'Цель','dice.roll':'Бросить',
 'mines.mines':'Мины','mines.gems':'Кристаллы','mines.next':'След. клетка','mines.total':'Общая выплата','mines.start':'Начать игру','mines.pick':'Выберите клетку…','mines.boom':'Бум! Мина',
 'crash.next':'Новый раунд через','crash.flying':'Полёт…','crash.crashed':'Краш','crash.placebet':'Ставка (след. раунд)','crash.betqueued':'Ставка принята на следующий раунд','crash.players':'Игроки','crash.youwon':'Забрали на {m}×',
 'plinko.risk':'Риск','plinko.rows':'Ряды','plinko.drop':'Бросить шар','plinko.low':'Низкий','plinko.med':'Средний','plinko.high':'Высокий',
 'limbo.target':'Целевой множитель','limbo.betbtn':'Ставка',
 'flip.heads':'Синяя','flip.tails':'Тёмная','flip.pick':'Выберите сторону','flip.flip':'Бросок',
 'slot.lines':'10 фиксированных линий','slot.bet':'Общая ставка','slot.win':'ВЫИГРЫШ',
 'auth.welcome':'Добро пожаловать в RealWin','auth.login.sub':'Рады видеть снова. Введите свои данные.','auth.reg.sub':'Регистрация за 60 секунд — мгновенные криптодепозиты.','auth.email':'Email','auth.password':'Пароль','auth.username':'Имя пользователя','auth.promo':'Промокод (необязательно)','auth.terms':'Мне есть 18 лет, я принимаю <a href="#/terms">Условия сервиса</a> и <a href="#/privacy">Политику конфиденциальности</a>','auth.create':'Создать аккаунт','auth.signin':'Войти','auth.have':'Уже есть аккаунт?','auth.nohave':'Впервые на RealWin?','auth.forgot':'Забыли пароль?','auth.or':'или продолжить через','auth.err.email':'Введите корректный email','auth.err.user':'3–16 символов, буквы и цифры','auth.err.pass':'Минимум 6 символов','auth.err.terms':'Подтвердите возраст и согласие с условиями','auth.err.exists':'Аккаунт с таким email уже существует','auth.err.creds':'Неверный email или пароль','auth.hello':'С возвращением, {n}!','auth.created':'Аккаунт создан — приветственный бонус ждёт в разделе «Акции»','auth.reset.sent':'Ссылка для сброса отправлена на {e} (демо)','auth.side1':'Мгновенные криптодепозиты и выводы','auth.side2':'3000+ слотов, live-казино и originals','auth.side3':'Приветственный пакет до 1000 USDT + 50 FS','auth.side4':'Provably Fair — проверяйте каждую ставку',
 'w.title':'Кошелёк','w.deposit':'Пополнение','w.withdraw':'Вывод','w.buy':'Купить крипту','w.network':'Сеть','w.address':'Ваш персональный адрес для депозита {c}','w.min':'Мин. депозит: {a}. Зачисление после 1 подтверждения сети.','w.simulate':'Симулировать депозит +1000 USDT (демо)','w.wd.address':'Адрес для вывода','w.wd.amount':'Сумма','w.wd.fee':'Комиссия сети','w.wd.get':'Вы получите','w.wd.btn':'Запросить вывод','w.wd.min':'Мин. вывод: {a}','w.wd.err.addr':'Введите корректный адрес (от 20 символов)','w.wd.err.amt':'Сумма превышает доступный баланс','w.wd.pending':'Вывод создан — обрабатывается','w.wd.done':'Вывод отправлен','w.buy.sub':'Покупка криптовалюты картой через партнёров-онрамп. Доступно после боевой интеграции (MoonPay / Transak).','w.buy.calc':'Быстрый калькулятор','w.dep.done':'Депозит зачислен','w.balance':'Баланс','w.fiatview':'Показывать в USD','w.search':'Поиск монеты…',
 'prof.overview':'Обзор','prof.wallet':'Кошелёк','prof.tx':'Транзакции','prof.bets':'Мои ставки','prof.settings':'Настройки','prof.verify':'Верификация','prof.refs':'Рефералы','prof.title':'Профиль','prof.joined':'С нами с {d}','prof.totalbets':'Всего ставок','prof.wins':'Выигрышей','prof.wagered':'Оборот','prof.pnl':'Прибыль / убыток','prof.recent':'Последние ставки','prof.nobets':'Ставок пока нет — выберите игру в казино','prof.level':'Уровень','prof.tolevel':'{a} оборота до {l}',
 'tx.type':'Тип','tx.amount':'Сумма','tx.status':'Статус','tx.date':'Дата','tx.empty':'Транзакций пока нет','tx.dep':'Депозит','tx.wd':'Вывод','tx.bet':'Ставка','tx.win':'Выигрыш','tx.bonus':'Бонус','tx.rake':'Рейкбек','tx.done':'Выполнено','tx.pending':'В обработке','tx.all':'Все',
 'bets.game':'Игра','bets.result':'Результат','bets.casino':'Казино','bets.sport':'Спорт','bets.open':'Открыта','bets.won':'Выигрыш','bets.lost':'Проигрыш','bets.empty':'В этом разделе ставок нет',
 'set.title':'Настройки','set.lang':'Язык интерфейса','set.lang.sub':'Применяется мгновенно по всему сайту','set.priv':'Скрывать меня в публичных лентах','set.priv.sub':'Ваши выигрыши будут подписаны «Скрытый»','set.2fa':'Двухфакторная аутентификация (2FA)','set.2fa.sub':'Одноразовые TOTP-коды при входе','set.2fa.on':'2FA включена','set.2fa.off':'2FA выключена','set.2fa.scan':'Отсканируйте QR в Google Authenticator и введите 6-значный код','set.2fa.code':'6-значный код','set.2fa.err':'Введите 6-значный код','set.pass':'Смена пароля','set.pass.cur':'Текущий пароль','set.pass.new':'Новый пароль','set.pass.done':'Пароль обновлён','set.pass.err':'Неверный текущий пароль','set.limits':'Ответственная игра','set.dep.lim':'Дневной лимит депозита (USDT)','set.loss.lim':'Дневной лимит проигрыша (USDT)','set.cool':'Пауза в игре (блокировка ставок)','set.cool.24':'24 часа','set.cool.7':'7 дней','set.cool.0':'Выкл','set.cool.on':'Ставки приостановлены до {d}','set.saved':'Настройки сохранены','set.session':'Активные сессии','set.thisdev':'Это устройство','set.del':'Удалить аккаунт','set.del.sub':'Стирает демо-аккаунт и все данные','set.del.confirm':'Удалить аккаунт и все данные? Действие необратимо.','set.limit.hit':'Достигнут лимит депозита',
 'kyc.title':'Верификация личности','kyc.sub':'Верификация открывает повышенные лимиты и покупку картой.','kyc.s1':'Email подтверждён','kyc.s2':'Документ личности','kyc.s2s':'Паспорт или ID-карта, обе стороны','kyc.s3':'Адрес и селфи','kyc.s3s':'Счёт за коммуналку + селфи с документом','kyc.upload':'Загрузить документы','kyc.pending':'Документы на проверке — обычно до 24 ч (демо: ~45 сек)','kyc.done':'Верификация пройдена','kyc.status.none':'Не верифицирован','kyc.status.pending':'На проверке','kyc.status.ok':'Верифицирован',
 'ref.title':'Приглашайте друзей — зарабатывайте крипту','ref.sub':'25% от маржи с оборота каждого друга. Начисляется мгновенно на баланс.','ref.link':'Ваша реферальная ссылка','ref.stat1':'Приглашено','ref.stat2':'Активных','ref.stat3':'Заработано','ref.how':'Как это работает','ref.h1':'Поделитесь ссылкой','ref.h1s':'В чатах, соцсетях или своём канале','ref.h2':'Друзья регистрируются и играют','ref.h2s':'Любые игры: казино, originals, спорт','ref.h3':'Вы зарабатываете всегда','ref.h3s':'RevShare 25%, без потолка, мгновенные выплаты',
 'promo.title':'Бонусы и акции','promo.sub':'Промокоды, бонусы, гонки и кэшбек — обновляем каждую неделю.','promo.terms':'Условия акции','promo.needauth':'Войдите, чтобы забрать','promo.w.t':'Приветственный пакет 200%','promo.w.d':'До 1000 USDT + 50 фриспинов на первые депозиты.','promo.w.b':'+500 USDT (демо) зачислено','promo.cb.t':'Еженедельный кэшбек 10%','promo.cb.d':'Каждый понедельник возвращаем до 10% чистых потерь. Без отыгрыша.','promo.cb.b':'Кэшбек зачислен','promo.rk.t':'Рейкбек 5%','promo.rk.d':'Мгновенный рейкбек с каждой ставки — забирайте когда угодно.','promo.rk.b':'Рейкбек получен','promo.rk.avail':'Доступно к получению','promo.rl.t':'Пятничный релоад 50%','promo.rl.d':'Усильте пятничный депозит на 50% до 200 USDT.','promo.rl.b':'Релоад-бонус зачислен','promo.race.t':'Гонка недели','promo.race.d':'Призовой фонд 10 000 USDT. Топ-100 по обороту делят банк.','promo.race.lead':'Таблица лидеров','promo.race.you':'Вы','promo.race.prize':'Приз','promo.nothing':'Пока нечего забирать','promo.claimed.already':'Уже получено',
 'vip.title':'VIP-клуб RealWin','vip.sub':'Лояльность, которая платит: рейкбек, кэшбек, подарки и личный менеджер.','vip.cur':'Ваш уровень','vip.next':'Следующий уровень','vip.wagered':'Оборот','vip.b':'Бронза','vip.s':'Серебро','vip.g':'Золото','vip.p':'Платина','vip.d':'Бриллиант','vip.none':'Новый игрок','vip.perk.rb':'Рейкбек {p}%','vip.perk.cb':'Кэшбек {p}%','vip.perk.lvl':'Бонус за уровень','vip.perk.gift':'Ежемесячный подарок','vip.perk.host':'Личный VIP-менеджер','vip.perk.wd':'Приоритетные выводы','vip.faq1':'Как работают уровни?','vip.faq1a':'Уровень растёт с общим оборотом по всем играм. Каждый уровень увеличивает рейкбек и кэшбек и открывает новые привилегии.','vip.faq2':'Когда выплачивается кэшбек?','vip.faq2a':'Каждый понедельник автоматически. Рейкбек можно забирать в любой момент на странице акций.',
 'aff.title':'Партнёрская программа','aff.sub':'До 45% RevShare, суб-партнёрка 5%, мгновенные выплаты в крипте.','aff.cta':'Стать партнёром','aff.t1':'RevShare до 45%','aff.t1s':'Пожизненная доля маржи с ваших игроков','aff.t2':'CPA и гибрид','aff.t2s':'Индивидуальные условия от 500 FTD в месяц','aff.t3':'Мгновенные выплаты','aff.t3s':'USDT, BTC, ETH — без минимальных удержаний',
 'sp.title':'Спорт','sp.sub':'Живые коэффициенты, мгновенный расчёт, киберспорт включён.','sp.live':'LIVE','sp.upcoming':'Скоро','sp.betslip':'Купон','sp.empty':'Нажмите на коэффициент, чтобы добавить ставку','sp.stake':'Ставка','sp.single':'Ординары','sp.multi':'Экспресс ({n} события)','sp.totalodds':'Общий коэффициент','sp.payout':'Возможный выигрыш','sp.place':'Сделать ставку','sp.placed':'Ставка принята — удачи!','sp.mybets':'Мои открытые ставки','sp.settled':'Ставка рассчитана: {r}','sp.won':'выигрыш','sp.lost':'проигрыш','sp.market':'1X2','sp.football':'Футбол','sp.basketball':'Баскетбол','sp.tennis':'Теннис','sp.cs':'CS 2','sp.dota':'Dota 2','sp.min':'{n}′',
 'sup.title':'Поддержка 24/7','sup.sub':'Средний ответ в чате — до 2 минут.','sup.chat':'Живой чат','sup.chat.s':'Самый быстрый способ получить помощь','sup.email':'Почта','sup.email.s':'support@realwin.example','sup.ticket':'Создать тикет','sup.subj':'Тема','sup.msg':'Опишите проблему','sup.sent':'Тикет #{n} создан — ответим на почту','sup.faq':'Частые вопросы','sup.open':'Открыть чат',
 'faq.q1':'Как быстро зачисляется депозит?','faq.a1':'Криптодепозиты зачисляются после 1 подтверждения сети — обычно 1–3 минуты для USDT TRC20.','faq.q2':'Какой минимальный вывод?','faq.a2':'Эквивалент 10 USDT для большинства монет. Комиссия сети показывается до подтверждения.','faq.q3':'Нужен ли KYC?','faq.a3':'Базовая игра — без KYC. Верификация открывает повышенные лимиты и покупку картой.','faq.q4':'Что такое Provably Fair?','faq.a4':'Каждый результат Originals вычисляется из серверного сида (хэш публикуется заранее), вашего клиентского сида и nonce — любой раунд можно проверить на странице «Честность».','faq.q5':'Какие валюты поддерживаются?','faq.a5':'12 криптовалют, включая USDT, BTC, ETH, TON, SOL. Валюта отображения по умолчанию — USDT.','faq.q6':'Как работают бонусы?','faq.a6':'У каждой акции свои условия — смотрите страницу акции. Рейкбек — без отыгрыша и мгновенный.',
 'fair.title':'Provably Fair','fair.sub':'Каждую ставку в Originals можно проверить независимо.','fair.how':'Как это работает','fair.p1':'Перед раундом мы генерируем секретный серверный сид и показываем его SHA-256 хэш — доказательство, что результат зафиксирован заранее.','fair.p2':'Вы задаёте любой клиентский сид. Результат считается из HMAC(serverSeed, clientSeed:nonce).','fair.p3':'После ротации пары сидов мы раскрываем старый серверный сид — можно пересчитать каждый результат.','fair.client':'Клиентский сид','fair.server':'Серверный сид (SHA-256 хэш)','fair.nonce':'Nonce','fair.rotate':'Ротировать пару сидов','fair.revealed':'Раскрыт предыдущий серверный сид:','fair.saved':'Клиентский сид обновлён',
 'legal.terms':'Условия сервиса','legal.privacy':'Политика конфиденциальности','legal.resp':'Ответственная игра','legal.aml':'Политика AML / KYC','legal.about':'О RealWin',
 'ftr.about':'RealWin — криптоигровая платформа нового поколения: 3000+ игр, спортбук, мгновенные выплаты и provably fair originals.','ftr.casino':'Казино','ftr.support':'Поддержка','ftr.legal':'Документы','ftr.contact':'Контакты','ftr.rights':'© 2026 RealWin. Все права защищены.','ftr.resp':'Играйте ответственно. Азартные игры могут вызывать зависимость.','ftr.age':'Игрокам должно быть 18 лет или больше.',
 'n.title':'Уведомления','n.empty':'Уведомлений пока нет','n.readall':'Прочитать все','n.welcome.t':'Добро пожаловать в RealWin!','n.welcome.b':'Начислен демо-баланс 1000 USDT — попробуйте любую игру.','n.dep.t':'Депозит зачислен','n.wd.t':'Вывод выполнен','n.wd.p':'Вывод в обработке','n.bonus.t':'Бонус зачислен','n.level.t':'Новый уровень!','n.level.b':'Вы достигли уровня {l}. Открыты новые привилегии.','n.kyc.t':'Верификация пройдена','n.kyc.b':'Ваш аккаунт подтверждён.','n.bet.t':'Ставка рассчитана',
 'chat.hello':'Привет! Я Анна из поддержки RealWin 👋 Чем помочь?','chat.q1':'Проблема с депозитом','chat.q2':'Вопрос по бонусам','chat.q3':'Верификация','chat.q4':'Сроки вывода','chat.a1':'Депозиты зачисляются после 1 подтверждения. Если прошло больше 30 минут — пришлите TXID, проверю сразу.','chat.a2':'Активные предложения — на странице «Акции». Приветственный пакет начисляется автоматически после первого депозита. Рейкбек можно забирать в любой момент.','chat.a3':'Откройте Профиль → Верификация и загрузите документы. Обычно проверка занимает минуты, в пиковые часы — до 24 ч.','chat.a4':'Крипто-выводы обрабатываются мгновенно с нашей стороны; доставка по сети — обычно 1–5 минут в зависимости от монеты.','chat.fallback':'Принято! Зафиксировала вопрос — специалист ответит здесь в ближайшее время. Могу ещё чем-то помочь?','chat.placeholder':'Напишите сообщение…','chat.agent':'Анна · Поддержка','chat.online':'онлайн',
 'search.title':'Поиск игр','search.ph':'Игра или провайдер…','search.popular':'Часто ищут','search.nores':'Ничего не найдено по запросу «{q}»',
 'toast.copied':'Скопировано в буфер','toast.fav.on':'Добавлено в избранное','toast.fav.off':'Убрано из избранного','toast.login.req':'Войдите, чтобы продолжить','toast.soon':'Будет доступно после запуска — это демо-сборка','toast.bye':'Вы вышли из аккаунта','toast.langset':'Язык переключён на русский',
 'misc.balance':'Баланс','misc.currency':'Валюта','misc.today':'сегодня','misc.yesterday':'вчера','misc.justnow':'только что','misc.min':'{n} мин назад','misc.hr':'{n} ч назад','misc.demo':'ДЕМО','misc.new':'NEW','misc.hot':'HOT','misc.exclusive':'ЭКСКЛЮЗИВ','misc.results':'Результаты','misc.of':'из',
 'promo.code.t':'Есть промокод?','promo.code.s':'Активируйте его и получите мгновенный бонус на баланс','promo.code.ph':'Введите промокод','promo.code.btn':'Активировать','promo.code.ok':'Промокод активирован: +{a} USDT','promo.code.bad':'Код не найден или уже использован',
 'pv.note.t':'Игра провайдера','pv.note.b':'«{name}» от {prov} подключается через API провайдера при боевом запуске платформы. В демо-сборке полностью играбельны эксклюзивы RealWin Originals.','pv.open':'Открыть игру','pv.playable':'Играбельно сейчас',
 'set.avatar':'Аватар','set.avatar.s':'JPG или PNG, хранится в вашем браузере','set.avatar.up':'Загрузить','set.avatar.rm':'Убрать','set.avatar.ok':'Аватар обновлён'
}
};
const t=(k,vars)=>{let s=(I18N[S.lang]&&I18N[S.lang][k])??I18N.en[k]??k;if(vars)for(const v in vars)s=s.replaceAll('{'+v+'}',vars[v]);return s};

/* ================= games data ================= */
const ORIGINALS=[
 {slug:'crash',name:'Crash',kind:'crash',rtp:99,oc:'#22345C'},
 {slug:'dice',name:'Dice',kind:'dice',rtp:99,oc:'#1E3355'},
 {slug:'mines',name:'Mines',kind:'mines',rtp:99,oc:'#25304F'},
 {slug:'plinko',name:'Plinko',kind:'plinko',rtp:99,oc:'#1C3050'},
 {slug:'limbo',name:'Limbo',kind:'limbo',rtp:99,oc:'#233A60'},
 {slug:'coinflip',name:'Coinflip',kind:'coinflip',rtp:99,oc:'#20345A'}
].map(o=>({...o,prov:'RealWin',cat:'originals',vol:'med',pop:96+Math.random()*4,tags:['exclusive']}));
const SLOTS=[
 ['gates-of-olympus','Gates of Olympus','Pragmatic Play',96.5,'high',98,['hot']],
 ['sweet-bonanza','Sweet Bonanza','Pragmatic Play',96.48,'high',97,['hot']],
 ['the-dog-house','The Dog House Megaways','Pragmatic Play',96.55,'high',91,[]],
 ['sugar-rush','Sugar Rush','Pragmatic Play',96.5,'high',90,[]],
 ['big-bass-bonanza','Big Bass Bonanza','Pragmatic Play',96.71,'high',89,[]],
 ['wanted-dead-or-a-wild','Wanted Dead or a Wild','Hacksaw Gaming',96.38,'high',95,['hot']],
 ['aviator','Aviator','Spribe',97,'med',94,['hot']],
 ['book-of-dead','Book of Dead',"Play'n GO",96.21,'high',88,[]],
 ['starlight-princess','Starlight Princess','Pragmatic Play',96.5,'high',84,[]],
 ['zeus-vs-hades','Zeus vs Hades','Pragmatic Play',96.07,'high',86,['new']],
 ['le-bandit','Le Bandit','Hacksaw Gaming',96.29,'high',85,['new']],
 ['fire-in-the-hole','Fire in the Hole xBomb','Nolimit City',96.06,'high',83,[]],
 ['mental','Mental','Nolimit City',96.08,'high',80,[]],
 ['razor-shark','Razor Shark','Push Gaming',96.7,'high',82,[]],
 ['big-bamboo','Big Bamboo','Push Gaming',96.13,'high',81,['new']],
 ['money-train-3','Money Train 3','Relax Gaming',96.1,'high',87,[]],
 ['chaos-crew','Chaos Crew','Hacksaw Gaming',96.3,'high',76,[]],
 ['fruit-party','Fruit Party','Pragmatic Play',96.47,'high',74,[]],
 ['starburst','Starburst','NetEnt',96.09,'low',72,[]],
 ['gonzos-quest',"Gonzo's Quest",'NetEnt',95.97,'med',70,[]],
 ['dead-or-alive-2','Dead or Alive 2','NetEnt',96.82,'high',75,[]],
 ['legacy-of-dead','Legacy of Dead',"Play'n GO",96.58,'high',71,[]],
 ['wolf-gold','Wolf Gold','Pragmatic Play',96.01,'med',69,[]]
].map(a=>({slug:a[0],name:a[1],prov:a[2],cat:'slots',rtp:a[3],vol:a[4],pop:a[5],tags:a[6]}));
const LIVE=[
 ['crazy-time','Crazy Time','Evolution',96.08,93,['hot']],
 ['monopoly-live','Monopoly Live','Evolution',96.23,84,[]],
 ['lightning-roulette','Lightning Roulette','Evolution',97.3,88,[]],
 ['funky-time','Funky Time','Evolution',95.99,82,['new']],
 ['sweet-bonanza-candyland','Sweet Bonanza CandyLand','Pragmatic Play',96.95,80,[]],
 ['blackjack-live','Blackjack Live','Evolution',99.28,79,[]],
 ['baccarat-live','Baccarat Live','Evolution',98.94,73,[]]
].map(a=>({slug:a[0],name:a[1],prov:a[2],cat:'live',rtp:a[3],vol:'med',pop:a[4],tags:a[5]}));
const GAMES=[...ORIGINALS,...SLOTS,...LIVE];
const gameBy=s=>GAMES.find(g=>g.slug===s);
const PROVIDERS=['Pragmatic Play','Hacksaw Gaming','Nolimit City','Push Gaming','Relax Gaming',"Play'n GO",'NetEnt','Evolution','Spribe','RealWin'];

/* originals tile glyphs (80x80) */
const OGLYPH={
crash:'<svg width="72" height="72" viewBox="0 0 80 80" fill="none"><path d="M10 64 C28 62 44 50 54 30 L60 16" stroke="#7FB2FF" stroke-width="5" stroke-linecap="round"/><path d="M60 16 L48 20 M60 16 L58 29" stroke="#7FB2FF" stroke-width="5" stroke-linecap="round"/><circle cx="14" cy="64" r="4" fill="#2E6BFF"/><path d="M10 70 H70" stroke="rgba(140,170,230,.25)" stroke-width="3" stroke-linecap="round"/></svg>',
dice:'<svg width="72" height="72" viewBox="0 0 80 80" fill="none"><rect x="12" y="20" width="40" height="40" rx="10" stroke="#7FB2FF" stroke-width="5"/><circle cx="24" cy="32" r="3.6" fill="#7FB2FF"/><circle cx="40" cy="48" r="3.6" fill="#7FB2FF"/><circle cx="24" cy="48" r="3.6" fill="#7FB2FF"/><circle cx="40" cy="32" r="3.6" fill="#7FB2FF"/><path d="M56 26 L66 32 V54 L48 64" stroke="#2E6BFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
mines:'<svg width="72" height="72" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="44" r="18" stroke="#7FB2FF" stroke-width="5"/><path d="M40 18 V26 M40 62 V70 M14 44 H22 M58 44 H66 M22 26 l6 6 M58 26 l-6 6 M22 62 l6-6 M58 62 l-6-6" stroke="#2E6BFF" stroke-width="5" stroke-linecap="round"/><circle cx="34" cy="38" r="4" fill="#7FB2FF"/></svg>',
plinko:'<svg width="72" height="72" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="18" r="6" fill="#7FB2FF"/><g fill="#2E6BFF"><circle cx="40" cy="36" r="3"/><circle cx="28" cy="48" r="3"/><circle cx="52" cy="48" r="3"/><circle cx="16" cy="60" r="3"/><circle cx="40" cy="60" r="3"/><circle cx="64" cy="60" r="3"/></g><path d="M12 70 H68" stroke="rgba(140,170,230,.3)" stroke-width="4" stroke-linecap="round"/></svg>',
limbo:'<svg width="72" height="72" viewBox="0 0 80 80" fill="none"><path d="M16 60 A28 28 0 0 1 64 60" stroke="rgba(140,170,230,.3)" stroke-width="5" stroke-linecap="round"/><path d="M40 60 L56 30" stroke="#7FB2FF" stroke-width="5" stroke-linecap="round"/><circle cx="40" cy="60" r="6" fill="#2E6BFF"/><path d="M56 30 l-10 1.5 M56 30 l-1 10" stroke="#7FB2FF" stroke-width="5" stroke-linecap="round"/></svg>',
coinflip:'<svg width="72" height="72" viewBox="0 0 80 80" fill="none"><circle cx="34" cy="44" r="20" stroke="#2E6BFF" stroke-width="5"/><circle cx="46" cy="36" r="20" fill="#111B30" stroke="#7FB2FF" stroke-width="5"/><path d="M40 28 L46 44 L52 28" stroke="#7FB2FF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* ================= state ================= */
const DEF_BAL=()=>({USDT:0,BTC:0,ETH:0,SOL:0,TON:0,TRX:0,LTC:0,DOGE:0,XRP:0,BNB:0,USDC:0,ADA:0});
let S;
function loadS(){
 try{S=JSON.parse(store.getItem('rw_state_v1'))||null}catch(e){S=null}
 if(!S)S={lang:'ru',activeCoin:'USDT',fiatView:false,sessionEmail:null,accounts:{},guestFavs:[]};
}
const save=()=>{try{store.setItem('rw_state_v1',JSON.stringify(S))}catch(e){}};
const me=()=>S.sessionEmail?S.accounts[S.sessionEmail]||null:null;
const DEMO={bal:10000};

function newUser(email,name,pass){
 return {email,name,pass:btoa(unescape(encodeURIComponent(pass))),created:Date.now(),hue:ri(0,360),
 balances:DEF_BAL(),txs:[],bets:[],sbets:[],notifs:[],favs:[],claimed:{},wagered:0,rakeAvail:0,pnl:0,
 verif:{status:'none',until:0},twoFA:false,privacy:false,limits:{dep:0,loss:0,coolUntil:0},lossToday:0,depToday:0,
 seeds:{client:uid()+uid(),serverHash:'',server:'',nonce:0}};
}
function favs(){const u=me();return u?u.favs:S.guestFavs}
function toggleFav(slug){const f=favs();const i=f.indexOf(slug);if(i>=0){f.splice(i,1);toast('info',t('toast.fav.off'))}else{f.push(slug);toast('ok',t('toast.fav.on'))}save();return i<0}

/* money */
function bal(sym){const u=me();return u?(u.balances[sym]||0):0}
function addBal(sym,d){const u=me();if(!u)return;u.balances[sym]=Math.max(0,(u.balances[sym]||0)+d);save();UI.balance()}
function pushTx(o){const u=me();if(!u)return;u.txs.unshift({id:'TX'+uid().toUpperCase(),ts:Date.now(),status:'done',...o});u.txs=u.txs.slice(0,300);save()}
function notify(icn,title,body,silent){const u=me();const n={ic:icn,title,body,ts:Date.now(),read:false};if(u){u.notifs.unshift(n);u.notifs=u.notifs.slice(0,50);save()}if(!silent)toast('info',title,body);UI.bell&&UI.bell()}
function wagerUsd(usd){const u=me();if(!u)return;const prev=vipLevel(u.wagered);u.wagered+=usd;u.rakeAvail+=usd*0.005;const now=vipLevel(u.wagered);if(now.i>prev.i){notify('trophy',t('n.level.t'),t('n.level.b',{l:now.name()}))}save()}

/* vip */
const VIPS=[{k:'none',req:0,rb:0,cb:0,c:'#64738F',name:()=>t('vip.none')},{k:'b',req:1000,rb:3,cb:3,c:'#B97A50',name:()=>t('vip.b')},{k:'s',req:5000,rb:5,cb:5,c:'#9FB0C8',name:()=>t('vip.s')},{k:'g',req:25000,rb:7,cb:7,c:'#D8B458',name:()=>t('vip.g')},{k:'p',req:100000,rb:10,cb:10,c:'#8FD0FF',name:()=>t('vip.p')},{k:'d',req:500000,rb:15,cb:12,c:'#7FB2FF',name:()=>t('vip.d')}];
function vipLevel(w){let l=VIPS[0],i=0;VIPS.forEach((v,ix)=>{if(w>=v.req){l=v;i=ix}});return{...l,i}}

/* bet recording; stake in active coin (or demo) */
function canBet(){const u=me();if(u&&u.limits.coolUntil>Date.now()){toast('warn',t('set.cool.on',{d:new Date(u.limits.coolUntil).toLocaleString()}));return false}return true}
function placeStake(amt,mode){ // returns true if deducted
 if(mode==='demo'){if(DEMO.bal<amt)return false;DEMO.bal-=amt;return true}
 const u=me();if(!u)return false;const sym=S.activeCoin;
 if((u.balances[sym]||0)<amt)return false;
 u.balances[sym]-=amt;const usd=toUsd(amt,sym);u.lossToday+=usd;wagerUsd(usd);UI.balance();save();return true}
function payOut(amt,mode){if(mode==='demo'){DEMO.bal+=amt;return}const u=me();if(!u)return;const sym=S.activeCoin;u.balances[sym]=(u.balances[sym]||0)+amt;u.pnl+=toUsd(amt,sym);u.lossToday-=toUsd(amt,sym);save();UI.balance()}
function recordBet(game,amt,mult,win,mode){const u=me();if(!u||mode==='demo')return;const sym=S.activeCoin;
 u.bets.unshift({id:'B'+uid().toUpperCase(),g:game,ts:Date.now(),amt,sym,mult,win,payout:win?amt*mult:0});
 u.bets=u.bets.slice(0,200);u.pnl-=toUsd(amt,sym);
 pushTx({type:'bet',coin:sym,amount:-amt,meta:game});
 if(win)pushTx({type:'win',coin:sym,amount:amt*mult,meta:game});
 save()}

/* fake deposit address */
function fakeAddr(sym,net){
 const u=me();const seedStr=(u?u.email:'guest')+sym+(net||'');let h=0;for(let i=0;i<seedStr.length;i++)h=(h*31+seedStr.charCodeAt(i))>>>0;
 const abc='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';let out='';let x=h;
 for(let i=0;i<34;i++){x=(x*1103515245+12345)>>>0;out+=abc[x%abc.length]}
 const pfx={'TRC20':'T','ERC20':'0x','BEP20':'0x','TON':'UQ','Solana':'','Bitcoin':'bc1q','Lightning':'lnbc1','Arbitrum':'0x','Base':'0x','Litecoin':'ltc1q','Dogecoin':'D','XRP Ledger':'r','Cardano':'addr1q'}[net]||'';
 return pfx+(pfx==='0x'?out.toLowerCase().replace(/[^0-9a-f]/g,'a').slice(0,40):out)}

async function sha256hex(str){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(str));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let h=0;for(const c of str)h=(h*31+c.charCodeAt(0))>>>0;return h.toString(16).padStart(8,'0').repeat(8)}}

/* ================= router ================= */
const RT={routes:[],add(re,fn){this.routes.push({re,fn})},cleanup:null};
function nav(path){location.hash='#'+path}
function currentPath(){let h=location.hash.slice(1);if(!h||h==='/')h='/';return h}
function renderRoute(){
 const path=currentPath();
 if(RT.cleanup){try{RT.cleanup()}catch(e){}RT.cleanup=null}
 closeAllDD();closeModalAll();$('#sb').classList.remove('open');$('#sbk').classList.remove('on');document.body.classList.remove('lock');
 let out=null;
 for(const r of RT.routes){const m=path.match(r.re);if(m){out=()=>r.fn(...m.slice(1));break}}
 const outlet=$('#outlet');
 outlet.classList.remove('enter');outlet.classList.add('leave');
 setTimeout(()=>{
  outlet.classList.remove('leave');
  outlet.innerHTML='';
  (out||Views.notFound)();
  outlet.classList.add('enter');
  window.scrollTo({top:0});
  UI.activeNav();
  observeRv();
 },110);
}
function requireAuth(){if(me())return true;openAuth('login');return false}

/* ================= modal / toast / dd ================= */
let MODALS=[];
function openModal(html,opt={}){
 const mb=document.createElement('div');mb.className='mb';
 mb.innerHTML=`<div class="modal ${opt.klass||''}" role="dialog"><button class="m-x" aria-label="close">${ic('x',18)}</button>${html}</div>`;
 $('#modals').appendChild(mb);document.body.classList.add('lock');
 requestAnimationFrame(()=>mb.classList.add('on'));
 const close=()=>{mb.classList.remove('on');setTimeout(()=>{mb.remove();if(!$('.mb'))document.body.classList.remove('lock')},220);MODALS=MODALS.filter(m=>m!==api);opt.onClose&&opt.onClose()};
 mb.addEventListener('click',e=>{if(e.target===mb)close()});
 $('.m-x',mb).onclick=close;
 const api={el:mb,close};MODALS.push(api);return api}
function closeModalAll(){MODALS.forEach(m=>m.close());MODALS=[]}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(MODALS.length)MODALS[MODALS.length-1].close();closeAllDD()}});

function toast(type,title,body){
 const el=document.createElement('div');el.className='toast '+(type||'info');
 const icn={ok:'check',err:'alert',warn:'alert',info:'info'}[type]||'info';
 el.innerHTML=`<span class="ti">${ic(icn,19)}</span><div><div class="tt">${esc(title)}</div>${body?`<div class="tb">${esc(body)}</div>`:''}</div>`;
 $('#toasts').appendChild(el);
 const kill=()=>{el.classList.add('out');setTimeout(()=>el.remove(),260)};
 el.onclick=kill;setTimeout(kill,4200)}

let DDOPEN=[];
function bindDD(btn,dd,onOpen){
 btn.addEventListener('click',e=>{e.stopPropagation();const was=dd.classList.contains('on');closeAllDD();if(!was){dd.classList.add('on');btn.classList.add('open');DDOPEN.push([dd,btn]);onOpen&&onOpen()}});
 dd.addEventListener('click',e=>e.stopPropagation())}
function closeAllDD(){DDOPEN.forEach(([d,b])=>{d.classList.remove('on');b&&b.classList.remove('open')});DDOPEN=[]}
document.addEventListener('click',()=>closeAllDD());

/* count-up */
function countUp(el,from,to,dur,fmt){const st=performance.now();const f=fmt||(v=>fmtN(v,2));function step(n){const p=clamp((n-st)/dur,0,1);const e=1-Math.pow(1-p,3);el.textContent=f(from+(to-from)*e);if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)}

/* reveal observer */
let rvObs=null;
function observeRv(){if(!rvObs)rvObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rvObs.unobserve(e.target)}}),{threshold:.08});$$('.rv:not(.in)').forEach(el=>rvObs.observe(el))}

/* copy */
function copyText(txt){(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('ok',t('toast.copied'))).catch(()=>{const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('ok',t('toast.copied'))}catch(e){}ta.remove()})}

/* time */
function ago(ts){const d=Date.now()-ts;if(d<60e3)return t('misc.justnow');if(d<3600e3)return t('misc.min',{n:Math.floor(d/60e3)});if(d<86400e3)return t('misc.hr',{n:Math.floor(d/3600e3)});return new Date(ts).toLocaleDateString(S.lang==='ru'?'ru-RU':'en-US',{day:'numeric',month:'short'})}
function dts(ts){return new Date(ts).toLocaleString(S.lang==='ru'?'ru-RU':'en-US',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}

/* ================= live simulations ================= */
const FEED_NAMES=['Nord','Vex','Aqua','Miron','Zenith','Lucky7','Ghost','Raven','Frost','Blaze','Orbit','Nyx','Dexter','Willow','Krab','Atlas','Sable','Pixel'];
function fakeWin(){
 const g=pick(GAMES.filter(g=>g.pop>70));
 const sym=pick(['USDT','USDT','USDT','BTC','ETH','TON','LTC','SOL']);
 const betU=pick([2,5,10,25,50,100,250,500])*rnd(.6,1.4);
 const mult=pick([1.5,2,2.4,3,5,8,12,25,50,120])*rnd(.85,1.15);
 return {g,sym,player:Math.random()<.3?null:pick(FEED_NAMES)+ri(10,99),bet:fromUsd(betU,sym),mult,ts:Date.now()}}
let onlineN=11840;
function onlineTick(){onlineN=clamp(onlineN+ri(-90,110),9500,16400);$$('.js-online').forEach(el=>el.textContent=nf.format(onlineN))}

const RACERS=FEED_NAMES.slice(0,10).map((n,i)=>({n:n+ri(10,99),w:rnd(90000,320000)-i*15000})).sort((a,b)=>b.w-a.w);
function raceTick(){RACERS.forEach(r=>r.w+=rnd(50,900));RACERS.sort((a,b)=>b.w-a.w)}

/* promos meta */
const PROMOS=[
 {id:'welcome',ban:'welcome',tk:'promo.w.t',dk:'promo.w.d',badge:'HOT'},
 {id:'cashback',ban:'promo',tk:'promo.cb.t',dk:'promo.cb.d'},
 {id:'rakeback',ban:'slots',tk:'promo.rk.t',dk:'promo.rk.d'},
 {id:'reload',ban:'vip',tk:'promo.rl.t',dk:'promo.rl.d'},
 {id:'race',ban:'sports',tk:'promo.race.t',dk:'promo.race.d'}
];

/* sports data */
function mkMatches(){
 const now=Date.now();const h=3600e3;
 const T=(name,c)=>({n:name,c});
 return [
 {id:'football',ic:'football',nk:'sp.football',leagues:[
  {name:'Premier League',ms:[
   {id:'f1',h:T('Man City','#6CABDD'),a:T('Arsenal','#EF0107'),live:{min:34,hs:1,as:0},odds:{1:1.95,X:3.6,2:4.1}},
   {id:'f2',h:T('Liverpool','#C8102E'),a:T('Chelsea','#034694'),ts:now+2*h,odds:{1:2.1,X:3.5,2:3.4}},
   {id:'f3',h:T('Tottenham','#132257'),a:T('Man United','#DA291C'),ts:now+5*h,odds:{1:2.45,X:3.4,2:2.85}}]},
  {name:'La Liga',ms:[
   {id:'f4',h:T('Real Madrid','#FEBE10'),a:T('Barcelona','#A50044'),ts:now+8*h,odds:{1:2.2,X:3.6,2:3.05}},
   {id:'f5',h:T('Atletico','#CB3524'),a:T('Sevilla','#F43333'),ts:now+26*h,odds:{1:1.72,X:3.8,2:5.0}}]}]},
 {id:'basketball',ic:'basketball',nk:'sp.basketball',leagues:[
  {name:'NBA',ms:[
   {id:'b1',h:T('Lakers','#552583'),a:T('Celtics','#007A33'),live:{min:31,hs:58,as:61},odds:{1:2.35,2:1.6}},
   {id:'b2',h:T('Warriors','#1D428A'),a:T('Bucks','#00471B'),ts:now+4*h,odds:{1:1.85,2:1.95}}]},
  {name:'EuroLeague',ms:[
   {id:'b3',h:T('Real Madrid','#FEBE10'),a:T('Fenerbahce','#FFED00'),ts:now+22*h,odds:{1:1.66,2:2.2}}]}]},
 {id:'tennis',ic:'tennis',nk:'sp.tennis',leagues:[
  {name:'ATP 500 · Hamburg',ms:[
   {id:'t1',h:T('Alcaraz','#0B6E4F'),a:T('Sinner','#D2691E'),ts:now+3*h,odds:{1:1.9,2:1.9}},
   {id:'t2',h:T('Djokovic','#1F6FB2'),a:T('Medvedev','#A22'),ts:now+7*h,odds:{1:1.65,2:2.25}}]}]},
 {id:'cs',ic:'gamepad',nk:'sp.cs',leagues:[
  {name:'BLAST Premier',ms:[
   {id:'c1',h:T('NAVI','#FFEE00'),a:T('G2','#EE2B47'),live:{min:2,hs:9,as:7,map:'Mirage'},odds:{1:1.78,2:2.02}},
   {id:'c2',h:T('Spirit','#CFEOFF'.replace('O','0')),a:T('FaZe','#E43D30'),ts:now+6*h,odds:{1:1.6,2:2.35}},
   {id:'c3',h:T('Vitality','#FFD100'),a:T('MOUZ','#E10600'),ts:now+27*h,odds:{1:1.55,2:2.45}}]}]},
 {id:'dota',ic:'gamepad',nk:'sp.dota',leagues:[
  {name:'Riyadh Masters',ms:[
   {id:'d1',h:T('Team Spirit','#CDE'),a:T('PSG.LGD','#DA020E'),ts:now+9*h,odds:{1:1.7,2:2.15}},
   {id:'d2',h:T('OG','#12492F'),a:T('Team Liquid','#0A2240'),ts:now+30*h,odds:{1:2.3,2:1.62}}]}]}]}
let SPORTS=mkMatches();
function findMatch(id){for(const s of SPORTS)for(const l of s.leagues){const m=l.ms.find(m=>m.id===id);if(m)return{m,s,l}}return null}
