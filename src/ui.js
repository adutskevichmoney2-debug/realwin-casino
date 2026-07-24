/* ================= RealWin UI shell ================= */
const UI={};
function logoSVG(s=34){return `<svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none"><defs><linearGradient id="lg${s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8AB4FF"/><stop offset="1" stop-color="#2E6BFF"/></linearGradient></defs><rect x="1.5" y="1.5" width="61" height="61" rx="15" fill="#0E1728" stroke="rgba(122,162,255,.25)"/><path d="M13 24 L22.5 45 L32 21 L41.5 45 L51 24" stroke="url(#lg${s})" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="29.6" y="9.4" width="4.8" height="4.8" rx="1" transform="rotate(45 32 11.8)" fill="#7FB2FF"/></svg>`}
function avatarHTML(u,extra=''){
 if(u.avatar)return `<span class="avatar ${extra}" style="background-image:url(${u.avatar});background-size:cover;background-position:center"></span>`;
 return `<span class="avatar ${extra}" style="background:linear-gradient(135deg,hsl(${u.hue} 70% 55%),hsl(${(u.hue+40)%360} 70% 38%))">${esc(u.name[0].toUpperCase())}</span>`}
function setAvatarFromFile(file,cb){
 if(!file||!file.type.startsWith('image/'))return;
 const u=me();if(!u)return;
 const r=new FileReader();
 r.onload=()=>{const img=new Image();
  img.onload=()=>{
   const c=document.createElement('canvas');c.width=c.height=160;
   const x=c.getContext('2d');const s=Math.min(img.width,img.height);
   x.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,160,160);
   u.avatar=c.toDataURL('image/jpeg',0.85);save();UI.header();
   toast('ok',t('set.avatar.ok'));cb&&cb()};
  img.src=r.result};
 r.readAsDataURL(file)}

/* ---------- header ---------- */
UI.header=function(){
 const u=me();
 const hdr=$('#hdr');
 hdr.innerHTML=`<div class="hdr-in">
  <button class="hicon js-burger" aria-label="menu" style="display:none">${ic('menu',20)}</button>
  <a class="logo" href="#/">${logoSVG(34)}<span class="logo-word">Real<b>Win</b></span></a>
  <nav class="hdr-nav">
   <a href="#/casino" data-nav="/casino">${t('nav.casino')}</a>
   <a href="#/sports" data-nav="/sports">${t('nav.sports')}</a>
   <a href="#/promotions" data-nav="/promotions">${t('nav.promos')}</a>
   <a href="#/vip" data-nav="/vip">${t('nav.vip')}</a>
  </nav>
  <div class="hdr-sp"></div>
  <button class="hicon js-search" aria-label="${t('a.search')}">${ic('search',19)}</button>
  ${u?`
  <div class="balwrap">
   <div class="balpill js-balpill"><button class="bp-amt js-balbtn">${coinIcon(S.activeCoin,22)}<span class="js-balval">${fmtBal()}</span><span class="chev">${ic('chevD',14)}</span></button>
    <div class="dd cdd js-cdd" style="right:auto;left:0">
     <div class="dd-h">${t('misc.currency')}</div>
     <div class="cdd-list js-coinlist"></div>
     <div class="cdd-ft"><span style="font-size:12px;font-weight:700;color:var(--tx2)">${t('w.fiatview')}</span><label class="switch"><input type="checkbox" class="js-fiat" ${S.fiatView?'checked':''}><i></i></label></div>
    </div>
   </div>
   <button class="btn-dep js-dep">${ic('wallet',17)}<span>${t('a.deposit')}</span></button>
  </div>
  <div style="position:relative"><button class="hicon js-bellbtn" aria-label="${t('n.title')}">${ic('bell',19)}<span class="dotn js-belldot" style="display:none">0</span></button>
   <div class="dd ndd js-ndd"><div class="dd-h" style="display:flex;justify-content:space-between;align-items:center">${t('n.title')}<button class="tailbtn js-readall">${t('n.readall')}</button></div><div class="ndd-list js-nlist"></div></div>
  </div>
  <div style="position:relative"><button class="avatarbtn js-avbtn">${avatarHTML(u)}</button>
   <div class="dd js-udd">
    <div style="display:flex;gap:11px;align-items:center;padding:10px 12px">${avatarHTML(u)}<div><div style="font-weight:800;font-size:13.5px">${esc(u.name)}</div><div style="font-size:11px;color:var(--tx3)">${esc(u.email)}</div></div></div>
    <div class="dd-sep"></div>
    <a class="dd-i" href="#/profile/overview">${ic('user',17)}${t('prof.title')}</a>
    <a class="dd-i" href="#/profile/wallet">${ic('wallet',17)}${t('prof.wallet')}</a>
    <a class="dd-i" href="#/profile/transactions">${ic('history',17)}${t('prof.tx')}</a>
    <a class="dd-i" href="#/profile/settings">${ic('sliders',17)}${t('prof.settings')}</a>
    <div class="dd-sep"></div>
    <button class="dd-i red js-logout">${ic('logout',17)}${t('a.logout')}</button>
   </div>
  </div>`:`
  <div style="position:relative"><button class="hicon js-langbtn" aria-label="language">${ic('globe',19)}</button>
   <div class="dd js-langdd" style="min-width:150px">
    <button class="dd-i js-lang" data-l="ru">🇷🇺 Русский</button>
    <button class="dd-i js-lang" data-l="en">🇬🇧 English</button>
   </div></div>
  <button class="btn ghost sm js-login" style="height:38px">${t('a.login')}</button>
  <button class="btn sm js-reg" style="height:38px">${t('a.register')}</button>`}
 </div>`;
 if(matchMedia('(max-width:1024px)').matches)$('.js-burger',hdr).style.display='flex';
 $('.js-burger',hdr).onclick=()=>{$('#sb').classList.add('open');$('#sbk').classList.add('on')};
 $('.js-search',hdr).onclick=openSearch;
 if(u){
  bindDD($('.js-balbtn',hdr),$('.js-cdd',hdr),renderCoinList);
  $('.js-fiat',hdr).onchange=e=>{S.fiatView=e.target.checked;save();UI.balance();renderCoinList()};
  $('.js-dep',hdr).onclick=()=>openWallet('deposit');
  bindDD($('.js-bellbtn',hdr),$('.js-ndd',hdr),()=>{renderNotifs();});
  $('.js-readall',hdr).onclick=()=>{u.notifs.forEach(n=>n.read=true);save();renderNotifs();UI.bell()};
  bindDD($('.js-avbtn',hdr),$('.js-udd',hdr));
  $('.js-logout',hdr).onclick=()=>{S.sessionEmail=null;save();UI.renderShell();renderRoute();toast('info',t('toast.bye'))};
  UI.bell();
 }else{
  bindDD($('.js-langbtn',hdr),$('.js-langdd',hdr));
  $$('.js-lang',hdr).forEach(b=>b.onclick=()=>langSet(b.dataset.l));
  $('.js-login',hdr).onclick=()=>openAuth('login');
  $('.js-reg',hdr).onclick=()=>openAuth('register');
 }
};
function fmtBal(){const sym=S.activeCoin;const v=bal(sym);return S.fiatView?fusd(toUsd(v,sym)):fc(v,sym)+' '+sym}
let lastBalShown=null;
UI.balance=function(){const el=$('.js-balval');if(!el)return;const sym=S.activeCoin;const v=S.fiatView?toUsd(bal(sym),sym):bal(sym);
 if(lastBalShown!==null&&Math.abs(v-lastBalShown)>1e-9){const from=lastBalShown;const dp=S.fiatView?2:coinBy(sym).dp;countUp(el,from,v,600,x=>S.fiatView?fusd(x):fmtN(x,dp)+' '+sym)}else el.textContent=fmtBal();
 lastBalShown=v};
UI.bell=function(){const u=me();const d=$('.js-belldot');if(!d||!u)return;const n=u.notifs.filter(x=>!x.read).length;d.style.display=n?'flex':'none';d.textContent=n};
function renderCoinList(){
 const box=$('.js-coinlist');if(!box)return;
 box.innerHTML=COINS.map(c=>{const b=bal(c.s);return `<button class="cdd-row ${c.s===S.activeCoin?'act':''}" data-c="${c.s}">${coinIcon(c.s,22)}<span class="cn">${c.s}</span><span class="dim" style="font-size:11px">${esc(c.n)}</span><span class="cb">${fc(b,c.s)}<span class="fiat">${fusd(toUsd(b,c.s))}</span></span></button>`}).join('');
 $$('.cdd-row',box).forEach(r=>r.onclick=()=>{S.activeCoin=r.dataset.c;save();lastBalShown=null;UI.balance();renderCoinList();$$('.js-balpill .cico')[0].outerHTML=coinIcon(S.activeCoin,22)});
}
function renderNotifs(){
 const u=me();const box=$('.js-nlist');if(!box||!u)return;
 box.innerHTML=u.notifs.length?u.notifs.map(n=>`<div class="nrow ${n.read?'':'unread'}"><span class="ni">${ic(n.ic||'info',17)}</span><div><div class="nt">${esc(n.title)}</div>${n.body?`<div class="nb">${esc(n.body)}</div>`:''}<div class="nts">${ago(n.ts)}</div></div></div>`).join(''):`<div class="empty" style="padding:26px">${ic('bell',30)}<div class="t">${t('n.empty')}</div></div>`;
 u.notifs.forEach(n=>n.read=true);save();setTimeout(()=>UI.bell(),400);
}
function langSet(l){if(S.lang===l)return;S.lang=l;save();document.documentElement.lang=l;UI.renderShell();renderRoute();setTimeout(()=>toast('ok',t('toast.langset')),350)}

/* ---------- sidebar ---------- */
UI.sidebar=function(){
 const sb=$('#sb');
 const item=(href,icn,label,tag)=>`<a class="sb-i" href="#${href}" data-nav="${href}">${ic(icn,18)}<span>${label}</span>${tag||''}</a>`;
 sb.innerHTML=`
 <div class="sb-top"><a class="logo" href="#/">${logoSVG(32)}<span class="logo-word" style="font-size:18px">Real<b>Win</b></span></a><button class="hicon js-sbclose" style="margin-left:auto;display:none">${ic('x',18)}</button></div>
 <div class="sb-body">
  <div class="sb-g">
   ${item('/','home',t('nav.lobby'))}
   ${item('/casino/originals','zap',t('nav.originals'),`<span class="tag">${t('misc.exclusive')}</span>`)}
   ${item('/casino/slots','spade',t('nav.slots'))}
   ${item('/casino/live','clock',t('nav.live'))}
   ${item('/casino/new','sparkles',t('nav.new'))}
   ${item('/casino/popular','flame',t('nav.popular'),`<span class="tag hot">${t('misc.hot')}</span>`)}
   ${item('/casino/favorites','heart',t('nav.favorites'))}
  </div>
  <div class="sb-g"><div class="sb-h">${t('nav.other')}</div>
   ${item('/sports','football',t('nav.sports'))}
   ${item('/promotions','gift',t('nav.promos'))}
   ${item('/vip','gem',t('nav.vip'))}
   ${item('/affiliate','users',t('nav.affiliate'))}
   ${item('/fairness','shieldCheck',t('nav.fairness'))}
   ${item('/support','headset',t('nav.support'))}
  </div>
  <div class="sb-g"><div class="sb-h">${t('set.lang')}</div>
   <button class="sb-i js-sblang" data-l="${S.lang==='ru'?'en':'ru'}">${ic('globe',18)}<span>${S.lang==='ru'?'English':'Русский'}</span></button>
  </div>
 </div>
 <div class="sb-ft">
  <div class="online"><span class="pulse"></span><span class="js-online">${nf.format(onlineN)}</span>&nbsp;${t('a.online')}</div>
 </div>`;
 $('.js-sbclose',sb).style.display=matchMedia('(max-width:1024px)').matches?'flex':'none';
 $('.js-sbclose',sb).onclick=closeSb;
 $('.js-sblang',sb).onclick=e=>langSet(e.currentTarget.dataset.l);
 $$('a',sb).forEach(a=>a.addEventListener('click',closeSb));
 $('#sbk').onclick=closeSb;
};
function closeSb(){$('#sb').classList.remove('open');$('#sbk').classList.remove('on')}
UI.activeNav=function(){
 const p=currentPath();
 $$('[data-nav]').forEach(a=>{const n=a.dataset.nav;a.classList.toggle('act',n==='/'?p==='/':p.startsWith(n))});
};

/* ---------- footer ---------- */
UI.footer=function(){
 $('#ftr').innerHTML=`<div class="ftr-in">
 <div class="ftr-grid">
  <div class="ftr-brand"><a class="logo" href="#/">${logoSVG(36)}<span class="logo-word">Real<b>Win</b></span></a>
   <p>${t('ftr.about')}</p><span class="age">18+</span></div>
  <div><h4>${t('ftr.casino')}</h4><div class="ftr-l">
   <a href="#/casino/slots">${t('nav.slots')}</a><a href="#/casino/live">${t('nav.live')}</a><a href="#/casino/originals">${t('nav.originals')}</a><a href="#/sports">${t('nav.sports')}</a><a href="#/promotions">${t('nav.promos')}</a><a href="#/vip">${t('nav.vip')}</a></div></div>
  <div><h4>${t('ftr.support')}</h4><div class="ftr-l">
   <a href="#/support">${t('sup.title')}</a><a href="#/fairness">${t('fair.title')}</a><a href="#/responsible">${t('legal.resp')}</a><a href="#/affiliate">${t('nav.affiliate')}</a><a href="#/about">${t('legal.about')}</a></div></div>
  <div><h4>${t('ftr.legal')}</h4><div class="ftr-l">
   <a href="#/terms">${t('legal.terms')}</a><a href="#/privacy">${t('legal.privacy')}</a><a href="#/aml">${t('legal.aml')}</a></div></div>
 </div>
 <div class="ftr-coins">${COINS.map(c=>coinIcon(c.s,22)).join('')}</div>
 <div class="ftr-bot"><span>${t('ftr.rights')}</span><span>${t('ftr.resp')} ${t('ftr.age')}</span></div>
 </div>`;
};

/* ---------- bottom nav ---------- */
UI.bnav=function(){
 $('#bnav').innerHTML=`<div class="bnav-in">
  <button class="js-bmenu">${ic('menu',20)}<span>${t('nav.menu')}</span></button>
  <a href="#/casino" data-nav="/casino">${ic('spade',20)}<span>${t('nav.casino')}</span></a>
  <a href="#/sports" data-nav="/sports">${ic('football',20)}<span>${t('nav.sports')}</span></a>
  <button class="js-bwallet">${ic('wallet',20)}<span>${t('prof.wallet')}</span></button>
  <button class="js-bchat">${ic('message',20)}<span>${t('sup.chat')}</span></button>
 </div>`;
 $('.js-bmenu').onclick=()=>{$('#sb').classList.add('open');$('#sbk').classList.add('on')};
 $('.js-bwallet').onclick=()=>me()?openWallet('deposit'):openAuth('login');
 $('.js-bchat').onclick=()=>toggleChat(true);
};

UI.renderShell=function(){UI.header();UI.sidebar();UI.footer();UI.bnav();UI.chat();UI.activeNav()};

/* ---------- game tiles ---------- */
function tileHTML(g,w){
 const f=favs().includes(g.slug);
 const tag=g.tags.includes('hot')?`<span class="badge red tbadge">${t('misc.hot')}</span>`:g.tags.includes('new')?`<span class="badge blue tbadge">${t('misc.new')}</span>`:'';
 let inner;
 if(g.cat==='originals'){
  inner=`<span class="ol">RealWin Originals</span><div class="og">${OGLYPH[g.slug]||''}<div class="on">${esc(g.name)}</div><div class="om">${g.rtp}% RTP</div></div>`;
  return `<a class="tile tile-o" style="--oc1:${g.oc}" href="#/game/${g.slug}" ${w?`style="flex-basis:${w}px"`:''}>${inner}<button class="fav ${f?'on':''}" data-fav="${g.slug}">${ic('heart',15)}</button></a>`;
 }
 const img=IMG[g.slug];
 inner=img?`<img src="${img}" alt="${esc(g.name)}" loading="lazy">`:`<div class="tile-fb"><span class="fbl">${esc(g.name[0])}</span><span class="fbn">${esc(g.name)}</span></div>`;
 return `<a class="tile" href="#/game/${g.slug}">${inner}${tag}
  <div class="tov"><div class="tn">${esc(g.name)}</div><div class="tp">${esc(g.prov)}</div></div>
  <span class="playb">${ic('play',20)}</span>
  <button class="fav ${f?'on':''}" data-fav="${g.slug}">${ic('heart',15)}</button></a>`;
}
function bindTiles(root){
 $$('[data-fav]',root).forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();const on=toggleFav(b.dataset.fav);b.classList.toggle('on',on)});
}
function rowScroller(id,title,icn,games,link){
 return `<section class="sect rv" id="${id}">
  <div class="sect-h"><span class="ico">${ic(icn,17)}</span><h2>${title}</h2>
   <div class="more"><a class="morelink" href="#${link}">${t('a.viewall')} ${ic('chevR',14)}</a>
   <button class="rarrow js-rl" data-t="${id}">${ic('chevL',16)}</button><button class="rarrow js-rr" data-t="${id}">${ic('chevR',16)}</button></div></div>
  <div class="grow js-grow">${games.map(g=>tileHTML(g)).join('')}</div></section>`;
}
function bindRows(root){
 $$('.js-rl,.js-rr',root).forEach(b=>b.onclick=()=>{const row=$('#'+b.dataset.t+' .js-grow');row.scrollBy({left:(b.classList.contains('js-rl')?-1:1)*row.clientWidth*.8,behavior:'smooth'})});
 bindTiles(root);
}

/* ================= AUTH modal ================= */
function openAuth(tab='login'){
 const vis=`<div class="auth-vis"><div class="bg" style="background-image:url('${BAN.welcome||''}')"></div><div class="sh"></div>
  <div class="c"><h3>${t('auth.welcome')}</h3><ul>
   <li>${ic('check',15)}${t('auth.side1')}</li><li>${ic('check',15)}${t('auth.side2')}</li>
   <li>${ic('check',15)}${t('auth.side3')}</li><li>${ic('check',15)}${t('auth.side4')}</li></ul></div></div>`;
 const m=openModal(`<div class="auth">${vis}<div class="auth-form">
  <div class="tabs" style="width:calc(100% - 48px);margin-bottom:20px"><button class="tab ${tab==='login'?'act':''}" data-t="login" style="flex:1">${t('a.login')}</button><button class="tab ${tab==='register'?'act':''}" data-t="register" style="flex:1">${t('a.register')}</button></div>
  <div class="js-authbody"></div>
 </div></div>`,{klass:'xl authm'});
 const body=$('.js-authbody',m.el);
 const socials=`<div class="ordiv">${t('auth.or')}</div><div class="socials">
  <button class="socialb js-soc"><svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/></svg>Google</button>
  <button class="socialb js-soc"><svg width="17" height="17" viewBox="0 0 24 24" fill="#2AABEE"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.57 8.16-1.9 8.96c-.14.64-.52.8-1.05.5l-2.9-2.14-1.4 1.35c-.15.15-.28.28-.58.28l.2-2.95 5.38-4.86c.23-.2-.05-.32-.36-.11l-6.64 4.18-2.86-.9c-.62-.19-.63-.62.13-.92l11.18-4.31c.52-.19.97.12.8.92z"/></svg>Telegram</button></div>`;
 function renderLogin(){
  body.innerHTML=`<div class="m-title">${t('a.login')}</div><div class="m-sub">${t('auth.login.sub')}</div>
   <div class="field js-f-email"><label>${t('auth.email')}</label><div class="fwrap">${ic('mail',17)}<input class="inp" type="email" placeholder="you@mail.com"></div><span class="ferr">${t('auth.err.email')}</span></div>
   <div class="field js-f-pass"><label>${t('auth.password')}</label><div class="fwrap">${ic('lock',17)}<input class="inp" type="password" placeholder="••••••••"><span class="tail"><button class="tailbtn js-eye">${ic('eye',15)}</button></span></div><span class="ferr">${t('auth.err.creds')}</span></div>
   <div style="text-align:right;margin:-6px 0 14px"><button class="js-forgot" style="font-size:12.5px;font-weight:700;color:var(--acc-h)">${t('auth.forgot')}</button></div>
   <button class="btn lg wide js-do">${t('auth.signin')}</button>
   ${socials}
   <div style="text-align:center;margin-top:16px;font-size:13px;color:var(--tx2)">${t('auth.nohave')} <button class="js-sw" style="color:var(--acc-h);font-weight:800">${t('a.register')}</button></div>`;
  wire('login')}
 function renderReg(){
  body.innerHTML=`<div class="m-title">${t('a.register')}</div><div class="m-sub">${t('auth.reg.sub')}</div>
   <div class="field js-f-email"><label>${t('auth.email')}</label><div class="fwrap">${ic('mail',17)}<input class="inp" type="email" placeholder="you@mail.com"></div><span class="ferr">${t('auth.err.email')}</span></div>
   <div class="field js-f-user"><label>${t('auth.username')}</label><div class="fwrap">${ic('user',17)}<input class="inp" maxlength="16" placeholder="nickname"></div><span class="ferr">${t('auth.err.user')}</span></div>
   <div class="field js-f-pass"><label>${t('auth.password')}</label><div class="fwrap">${ic('lock',17)}<input class="inp" type="password" placeholder="••••••••"><span class="tail"><button class="tailbtn js-eye">${ic('eye',15)}</button></span></div><div class="pwmeter js-pw"><i></i><i></i><i></i><i></i></div><span class="ferr">${t('auth.err.pass')}</span></div>
   <div class="field"><label>${t('auth.promo')}</label><div class="fwrap">${ic('gift',17)}<input class="inp js-promo" placeholder="REALWIN"></div></div>
   <label class="check js-terms" style="margin-bottom:16px"><input type="checkbox"><span class="box">${ic('check',13)}</span><span>${t('auth.terms')}</span></label>
   <button class="btn lg wide js-do">${t('auth.create')}</button>
   ${socials}
   <div style="text-align:center;margin-top:16px;font-size:13px;color:var(--tx2)">${t('auth.have')} <button class="js-sw" style="color:var(--acc-h);font-weight:800">${t('a.login')}</button></div>`;
  wire('register')}
 function wire(mode){
  $$('.js-soc',body).forEach(b=>b.onclick=()=>toast('info',t('toast.soon')));
  const eye=$('.js-eye',body);if(eye)eye.onclick=()=>{const i=$('.js-f-pass input',body);i.type=i.type==='password'?'text':'password';eye.innerHTML=ic(i.type==='password'?'eye':'eyeOff',15)};
  $('.js-sw',body).onclick=()=>{mode==='login'?swap('register'):swap('login')};
  const pw=$('.js-pw',body);
  if(pw)$('.js-f-pass input',body).oninput=e=>{const v=e.target.value;let s=0;if(v.length>=6)s++;if(v.length>=10)s++;if(/[0-9]/.test(v)&&/[a-zA-Z]/.test(v))s++;if(/[^a-zA-Z0-9]/.test(v))s++;pw.className='pwmeter js-pw'+(s?' s'+s:'')};
  const forgot=$('.js-forgot',body);
  if(forgot)forgot.onclick=()=>{const em=$('.js-f-email input',body).value.trim()||'email';toast('ok',t('auth.reset.sent',{e:em}))};
  $('.js-do',body).onclick=()=>{
   const email=$('.js-f-email input',body).value.trim().toLowerCase();
   const pass=$('.js-f-pass input',body).value;
   const okEmail=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
   const setErr=(sel,on)=>{const f=$(sel,body);if(f){f.classList.toggle('err',on)}};
   setErr('.js-f-email',!okEmail);if(!okEmail)return;
   if(mode==='login'){
    const acc=S.accounts[email];
    const bad=!acc||acc.pass!==btoa(unescape(encodeURIComponent(pass)));
    setErr('.js-f-pass',bad);if(bad)return;
    S.sessionEmail=email;save();m.close();UI.renderShell();renderRoute();
    toast('ok',t('auth.hello',{n:acc.name}));
   }else{
    const name=$('.js-f-user input',body).value.trim();
    const okUser=/^[a-zA-Z0-9_]{3,16}$/.test(name);
    const okPass=pass.length>=6;
    const terms=$('.js-terms input',body).checked;
    setErr('.js-f-user',!okUser);setErr('.js-f-pass',!okPass);
    if(!okUser||!okPass)return;
    if(!terms){toast('err',t('auth.err.terms'));return}
    if(S.accounts[email]){setErr('.js-f-email',true);$('.js-f-email .ferr',body).textContent=t('auth.err.exists');return}
    const u=newUser(email,name,pass);
    u.balances.USDT=1000;
    S.accounts[email]=u;S.sessionEmail=email;
    u.txs.unshift({id:'TX'+uid().toUpperCase(),ts:Date.now(),status:'done',type:'bonus',coin:'USDT',amount:1000,meta:'Welcome demo'});
    const promo=$('.js-promo',body).value.trim().toUpperCase();
    if(promo==='REALWIN'){u.balances.USDT+=100;u.txs.unshift({id:'TX'+uid().toUpperCase(),ts:Date.now(),status:'done',type:'bonus',coin:'USDT',amount:100,meta:'Promo REALWIN'})}
    save();m.close();UI.renderShell();renderRoute();
    notify('gift',t('n.welcome.t'),t('n.welcome.b'),true);
    toast('ok',t('auth.created'));
    sha256hex(uid()+uid()).then(h=>{u.seeds.server=h;return sha256hex(h)}).then(hh=>{u.seeds.serverHash=hh;save()});
   }};
 }
 function swap(mode){$$('.tab',m.el).forEach(b=>b.classList.toggle('act',b.dataset.t===mode));mode==='login'?renderLogin():renderReg()}
 $$('.tab',m.el).forEach(b=>b.onclick=()=>swap(b.dataset.t));
 tab==='login'?renderLogin():renderReg();
}

/* ================= WALLET modal ================= */
function openWallet(tab='deposit',coinSel){
 if(!me()){openAuth('login');return}
 let coin=coinSel||S.activeCoin,net=NETWORKS[coin][0];
 const m=openModal(`<div class="m-body" style="padding:22px 24px 0"><div class="m-title">${t('w.title')}</div>
  <div class="tabs" style="margin-top:10px"><button class="tab ${tab==='deposit'?'act':''}" data-t="deposit">${t('w.deposit')}</button><button class="tab ${tab==='withdraw'?'act':''}" data-t="withdraw">${t('w.withdraw')}</button><button class="tab ${tab==='buy'?'act':''}" data-t="buy">${t('w.buy')}</button></div></div>
  <div class="wm"><div class="wm-side"><div class="fwrap" style="margin-bottom:8px">${ic('search',15)}<input class="inp js-csearch" style="height:38px;font-size:12.5px" placeholder="${t('w.search')}"></div><div class="js-coins"></div></div><div class="wm-main js-wmain"></div></div>`,{klass:'xl'});
 const coinsBox=$('.js-coins',m.el),main=$('.js-wmain',m.el);
 function renderCoins(f=''){
  coinsBox.innerHTML=COINS.filter(c=>(c.s+c.n).toLowerCase().includes(f.toLowerCase())).map(c=>`<button class="wm-coin ${c.s===coin?'act':''}" data-c="${c.s}">${coinIcon(c.s,24)}<span><span class="n">${c.s}</span><br><span class="dim" style="font-size:10.5px">${esc(c.n)}</span></span><span class="b">${fc(bal(c.s),c.s)}</span></button>`).join('');
  $$('.wm-coin',coinsBox).forEach(b=>b.onclick=()=>{coin=b.dataset.c;net=NETWORKS[coin][0];renderCoins($('.js-csearch',m.el).value);renderMain()});
 }
 function qrHTML(data){try{const q=qrcode(0,'M');q.addData(data);q.make();return `<img src="${q.createDataURL(4,2)}" alt="QR">`}catch(e){return ''}}
 function renderMain(){
  const u=me();
  if(tab==='deposit'){
   const addr=fakeAddr(coin,net);
   main.innerHTML=`<div class="m-sub" style="margin-bottom:12px">${t('w.address',{c:coin})}</div>
    <div class="betrow"><label>${t('w.network')}</label><div class="nets">${NETWORKS[coin].map(n=>`<button class="chip ${n===net?'act':''}" data-n="${n}">${n}</button>`).join('')}</div></div>
    <div class="qrbox"><div class="qr">${qrHTML(addr)}</div>
     <div style="flex:1;min-width:0"><div class="addrbox"><span class="a">${addr}</span><button class="tailbtn js-copy" style="flex:none">${ic('copy',14)} ${t('a.copy')}</button></div>
     <div class="note">${ic('info',16)}<span>${t('w.min',{a:fc(fromUsd(5,coin),coin)+' '+coin})}</span></div></div></div>
    <button class="btn green wide js-sim">${ic('plus',17)} ${t('w.simulate')}</button>`;
   $$('.nets .chip',main).forEach(b=>b.onclick=()=>{net=b.dataset.n;renderMain()});
   $('.js-copy',main).onclick=()=>copyText(addr);
   $('.js-sim',main).onclick=()=>{
    const lim=u.limits.dep;
    if(lim&&u.depToday+1000>lim){toast('warn',t('set.limit.hit'));return}
    u.depToday+=1000;u.balances.USDT+=1000;
    pushTx({type:'dep',coin:'USDT',amount:1000,meta:net});save();UI.balance();
    notify('wallet',t('n.dep.t'),'+1,000.00 USDT',true);toast('ok',t('w.dep.done'),'+1,000.00 USDT');
    renderCoins($('.js-csearch',m.el).value)};
  }else if(tab==='withdraw'){
   const b=bal(coin),fee=FEES[coin]||0,minW=fromUsd(10,coin);
   main.innerHTML=`<div class="m-sub" style="margin-bottom:12px">${t('w.wd.min',{a:fc(minW,coin)+' '+coin})} · ${t('w.balance')}: <b class="mono">${fc(b,coin)} ${coin}</b></div>
    <div class="field js-f-addr"><label>${t('w.wd.address')}</label><div class="fwrap">${ic('wallet',16)}<input class="inp js-addr" placeholder="${fakeAddr(coin,net).slice(0,18)}…"></div><span class="ferr">${t('w.wd.err.addr')}</span></div>
    <div class="field js-f-amt"><label>${t('w.wd.amount')}</label><div class="betamt"><input class="js-amt" type="number" min="0" step="any" placeholder="0.00"><button class="bab js-max">MAX</button><span style="font-weight:800;font-size:12px;color:var(--tx2)">${coin}</span></div><span class="ferr">${t('w.wd.err.amt')}</span></div>
    <div class="gstat3" style="grid-template-columns:1fr 1fr"><div class="gs"><div class="l">${t('w.wd.fee')}</div><div class="v">${fc(fee,coin)} ${coin}</div></div><div class="gs"><div class="l">${t('w.wd.get')}</div><div class="v js-get">0.00 ${coin}</div></div></div>
    <button class="btn wide lg js-wd">${t('w.wd.btn')}</button>`;
   const amtI=$('.js-amt',main);
   const upd=()=>{const v=parseFloat(amtI.value)||0;$('.js-get',main).textContent=fc(Math.max(0,v-fee),coin)+' '+coin};
   amtI.oninput=upd;$('.js-max',main).onclick=()=>{amtI.value=b;upd()};
   $('.js-wd',main).onclick=()=>{
    const addr=$('.js-addr',main).value.trim();const v=parseFloat(amtI.value)||0;
    const badA=addr.length<20,badV=v<minW||v>b;
    $('.js-f-addr',main).classList.toggle('err',badA);$('.js-f-amt',main).classList.toggle('err',badV);
    if(badA||badV)return;
    u.balances[coin]-=v;
    const tx={id:'TX'+uid().toUpperCase(),ts:Date.now(),status:'pending',type:'wd',coin,amount:-v,meta:addr.slice(0,10)+'…',doneAt:Date.now()+30000};
    u.txs.unshift(tx);save();UI.balance();
    notify('clock',t('n.wd.p'),fc(v,coin)+' '+coin,true);toast('ok',t('w.wd.pending'));
    setTimeout(()=>{tx.status='done';save();notify('check',t('n.wd.t'),fc(v,coin)+' '+coin)},30000);
    m.close()};
  }else{
   main.innerHTML=`<div class="note" style="margin-bottom:16px">${ic('info',16)}<span>${t('w.buy.sub')}</span></div>
    <div class="betrow"><label>${t('w.buy.calc')}</label><div class="betamt"><input class="js-usd" type="number" placeholder="100" value="100"><span style="font-weight:800;font-size:12px;color:var(--tx2)">USD</span></div></div>
    <div class="gstat3" style="grid-template-columns:1fr"><div class="gs"><div class="l">≈ ${coin}</div><div class="v js-calc">—</div></div></div>`;
   const upd=()=>{const v=parseFloat($('.js-usd',main).value)||0;$('.js-calc',main).textContent=fc(fromUsd(v,coin),coin)+' '+coin};
   $('.js-usd',main).oninput=upd;upd();
  }
 }
 $$('.tabs .tab',m.el).forEach(b=>b.onclick=()=>{tab=b.dataset.t;$$('.tabs .tab',m.el).forEach(x=>x.classList.toggle('act',x===b));renderMain()});
 $('.js-csearch',m.el).oninput=e=>renderCoins(e.target.value);
 renderCoins();renderMain();
}

/* ================= SEARCH ================= */
function openSearch(){
 const m=openModal(`<div class="m-body"><div class="m-title">${t('search.title')}</div>
  <div class="fwrap" style="margin-top:12px">${ic('search',17)}<input class="inp js-q" placeholder="${t('search.ph')}" autofocus></div>
  <div style="margin-top:14px"><span class="dim" style="font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:.07em">${t('search.popular')}</span>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:9px">${['Gates of Olympus','Crash','Sweet Bonanza','Aviator','Mines','Crazy Time'].map(q=>`<button class="chip js-qc">${q}</button>`).join('')}</div></div>
  <div class="srch-res js-res"></div></div>`,{klass:'lg'});
 const q=$('.js-q',m.el),res=$('.js-res',m.el);
 function run(){
  const v=q.value.trim().toLowerCase();
  const found=v?GAMES.filter(g=>(g.name+' '+g.prov).toLowerCase().includes(v)).slice(0,18):GAMES.filter(g=>g.pop>88);
  res.innerHTML=found.length?found.map(g=>tileHTML(g)).join(''):`<div class="empty" style="grid-column:1/-1">${ic('search',30)}<div class="t">${t('search.nores',{q:q.value})}</div></div>`;
  bindTiles(res);
  $$('a.tile',res).forEach(a=>a.addEventListener('click',()=>m.close()));
 }
 q.oninput=run;
 $$('.js-qc',m.el).forEach(c=>c.onclick=()=>{q.value=c.textContent;run()});
 run();setTimeout(()=>q.focus(),80);
}

/* ================= confirm ================= */
function confirmDialog(msg,onYes){
 const m=openModal(`<div class="m-body"><div class="m-title" style="font-size:17px">${esc(msg)}</div>
  <div style="display:flex;gap:10px;margin-top:20px"><button class="btn danger js-y" style="flex:1">${t('a.confirm')}</button><button class="btn soft js-n" style="flex:1">${t('a.cancel')}</button></div></div>`);
 $('.js-y',m.el).onclick=()=>{m.close();onYes()};$('.js-n',m.el).onclick=m.close;
}

/* ================= CHAT widget ================= */
let chatInit=false,chatOpen=false;
UI.chat=function(){
 const w=$('#chatw');
 w.innerHTML=`<button class="chat-fab js-cfab" aria-label="chat">${ic('message',23)}<span class="dotn js-cdot" ${chatInit?'style="display:none"':''}></span></button>
 <div class="chat-p js-cpanel">
  <div class="chat-h"><span class="avatar" style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#4C8DFF,#2760E6)">A</span>
   <div><div style="font-weight:800;font-size:13.5px">${t('chat.agent')}</div><div class="st">${t('chat.online')}</div></div>
   <button class="hicon js-cclose" style="margin-left:auto">${ic('x',17)}</button></div>
  <div class="chat-msgs js-cmsgs"></div>
  <div class="cquick js-cquick"></div>
  <div class="chat-in"><input class="js-cin" placeholder="${t('chat.placeholder')}"><button class="js-csend">${ic('send',17)}</button></div>
 </div>`;
 $('.js-cfab',w).onclick=()=>toggleChat();
 $('.js-cclose',w).onclick=()=>toggleChat(false);
 $('.js-csend',w).onclick=sendChat;
 $('.js-cin',w).addEventListener('keydown',e=>{if(e.key==='Enter')sendChat()});
 if(chatOpen){$('.js-cpanel',w).classList.add('on')}
 renderQuick();
};
function toggleChat(force){
 chatOpen=force!==undefined?force:!chatOpen;
 $('.js-cpanel').classList.toggle('on',chatOpen);
 $('.js-cdot').style.display='none';
 if(chatOpen&&!chatInit){chatInit=true;botSay(t('chat.hello'))}
}
function chatMsg(txt,who){
 const box=$('.js-cmsgs');const d=document.createElement('div');d.className='cmsg '+who;
 d.innerHTML=`${esc(txt)}<span class="cm-t">${new Date().toLocaleTimeString(S.lang==='ru'?'ru-RU':'en-US',{hour:'2-digit',minute:'2-digit'})}</span>`;
 box.appendChild(d);box.scrollTop=box.scrollHeight}
function botSay(txt){
 const box=$('.js-cmsgs');const tp=document.createElement('div');tp.className='cmsg bot typing';tp.innerHTML='<i></i><i></i><i></i>';box.appendChild(tp);box.scrollTop=box.scrollHeight;
 setTimeout(()=>{tp.remove();chatMsg(txt,'bot')},rnd(700,1400))}
function renderQuick(){
 $('.js-cquick').innerHTML=[1,2,3,4].map(i=>`<button data-i="${i}">${t('chat.q'+i)}</button>`).join('');
 $$('.js-cquick button').forEach(b=>b.onclick=()=>{chatMsg(t('chat.q'+b.dataset.i),'me');botSay(t('chat.a'+b.dataset.i))});
}
function sendChat(){
 const i=$('.js-cin');const v=i.value.trim();if(!v)return;i.value='';
 chatMsg(v,'me');botSay(t('chat.fallback'));
}
