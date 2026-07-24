/* ================= RealWin views ================= */
const Views={};
const outlet=()=>$('#outlet');

/* helpers */
function bindAcc(root){$$('.acc-h',root).forEach(h=>h.onclick=()=>{const it=h.parentElement;const b=$('.acc-b',it);const open=it.classList.toggle('open');b.style.maxHeight=open?b.scrollHeight+'px':0})}
function pageHead(title,sub){return `<div class="pgh rv in"><h1>${title}</h1>${sub?`<p class="sub">${sub}</p>`:''}</div>`}

/* ================= HOME ================= */
Views.home=function(){
 const slides=[
  {img:BAN.welcome,eyebrow:t('home.eyebrow'),h:`${t('home.h1')} <b>${t('home.h1b')}</b>`,p:t('home.sub'),cta1:{l:me()?t('a.deposit'):t('home.cta1'),fn:'cta-main'},cta2:{l:t('home.cta2'),href:'#/casino'}},
  {img:BAN.slots,rt:1,eyebrow:t('home.b2.eyebrow'),h:t('home.b2.h1'),p:t('home.b2.sub'),cta1:{l:t('home.b2.cta'),href:'#/casino/slots'}},
  {img:BAN.sports,eyebrow:t('home.b3.eyebrow'),h:t('home.b3.h1'),p:t('home.b3.sub'),cta1:{l:t('home.b3.cta'),href:'#/sports'}},
  {img:BAN.vip,rt:1,eyebrow:t('home.b4.eyebrow'),h:t('home.b4.h1'),p:t('home.b4.sub'),cta1:{l:t('home.b4.cta'),href:'#/vip'}}
 ];
 const orig=GAMES.filter(g=>g.cat==='originals');
 const popular=[...GAMES].filter(g=>g.cat!=='originals').sort((a,b)=>b.pop-a.pop).slice(0,14);
 const live=GAMES.filter(g=>g.cat==='live');
 const fresh=GAMES.filter(g=>g.tags.includes('new')).concat(SLOTS.slice(8,14)).slice(0,12);
 outlet().innerHTML=`
 <div class="hero rv in">
  ${slides.map((s,i)=>`<div class="hero-s ${i===0?'act':''} ${s.rt?'rt':''}"><div class="bgimg" style="background-image:url('${s.img||''}')"></div><div class="shade"></div>
   <div class="hero-c"><span class="hero-eyebrow">${ic('gift',13)} ${s.eyebrow}</span><h1>${s.h}</h1><p>${s.p}</p>
   <div class="hero-cta">${s.cta1.href?`<a class="btn lg" href="${s.cta1.href}">${s.cta1.l} ${ic('arrR',17)}</a>`:`<button class="btn lg js-ctamain">${s.cta1.l} ${ic('arrR',17)}</button>`}${s.cta2?`<a class="btn lg ghost" href="${s.cta2.href}">${s.cta2.l}</a>`:''}</div></div></div>`).join('')}
  <div class="hero-nav">${slides.map((_,i)=>`<span class="hero-dot ${i===0?'act':''}" data-i="${i}"></span>`).join('')}</div>
  <div class="hero-arrows"><button class="rarrow js-hprev">${ic('chevL',16)}</button><button class="rarrow js-hnext">${ic('chevR',16)}</button></div>
 </div>
 <div class="qcats rv">
  <a class="qcat" href="#/casino"><span class="qi">${ic('spade',21)}</span><span><span class="qt">${t('home.qc1')}</span><br><span class="qs">${t('home.qc1s')}</span></span></a>
  <a class="qcat" href="#/sports"><span class="qi">${ic('football',21)}</span><span><span class="qt">${t('home.qc2')}</span><br><span class="qs">${t('home.qc2s')}</span></span></a>
  <a class="qcat" href="#/casino/originals"><span class="qi">${ic('zap',21)}</span><span><span class="qt">${t('home.qc3')}</span><br><span class="qs">${t('home.qc3s')}</span></span></a>
  <a class="qcat" href="#/promotions"><span class="qi">${ic('gift',21)}</span><span><span class="qt">${t('home.qc4')}</span><br><span class="qs">${t('home.qc4s')}</span></span></a>
 </div>
 ${rowScroller('row-o',t('row.originals'),'zap',orig,'/casino/originals')}
 ${rowScroller('row-p',t('row.popular'),'flame',popular,'/casino/popular')}
 ${rowScroller('row-l',t('row.live'),'clock',live,'/casino/live')}
 ${rowScroller('row-n',t('row.new'),'sparkles',fresh,'/casino/new')}
 <section class="sect rv"><div class="stats">
  <div class="stat"><span class="si">${ic('chart',19)}</span><span><span class="sv js-st-bets">1,284,502</span><br><span class="sl">${t('home.stats.bets')}</span></span></div>
  <div class="stat"><span class="si">${ic('coins',19)}</span><span><span class="sv js-st-paid">$8,412,900</span><br><span class="sl">${t('home.stats.paid')}</span></span></div>
  <div class="stat"><span class="si">${ic('users',19)}</span><span><span class="sv js-online">${nf.format(onlineN)}</span><br><span class="sl">${t('home.stats.online')}</span></span></div>
  <div class="stat"><span class="si">${ic('spade',19)}</span><span><span class="sv">3,000+</span><br><span class="sl">${t('home.stats.games')}</span></span></div>
 </div></section>
 <section class="sect rv"><div class="sect-h"><span class="ico">${ic('gift',17)}</span><h2>${t('promo.title')}</h2><div class="more"><a class="morelink" href="#/promotions">${t('a.viewall')} ${ic('chevR',14)}</a></div></div>
  <div class="promo-grid">${PROMOS.slice(0,3).map(p=>`
   <a class="promo-c" href="#/promo/${p.id}"><div class="pbg" style="background-image:url('${BAN[p.ban]||''}')"></div><div class="psh"></div>
    ${p.badge?`<span class="badge red" style="align-self:flex-start">${p.badge}</span>`:''}
    <h3>${t(p.tk)}</h3><p>${t(p.dk)}</p>
    <span class="morelink" style="margin-top:10px">${t('a.more')} ${ic('arrR',14)}</span></a>`).join('')}
  </div></section>
 <section class="sect rv"><div class="sect-h"><span class="ico">${ic('gem',17)}</span><h2>${t('home.providers')}</h2></div>
  <div class="provrow">${PROVIDERS.filter(p=>p!=='RealWin').map(p=>`<a class="provchip" href="#/casino?prov=${encodeURIComponent(p)}">${esc(p)}</a>`).join('')}</div></section>`;
 bindRows(outlet());
 const mainBtns=$$('.js-ctamain');mainBtns.forEach(b=>b.onclick=()=>me()?openWallet('deposit'):openAuth('register'));
 /* carousel */
 let cur=0,timer;
 const slidesEl=$$('.hero-s'),dots=$$('.hero-dot');
 function go(i){cur=(i+slides.length)%slides.length;slidesEl.forEach((s,x)=>s.classList.toggle('act',x===cur));dots.forEach((d,x)=>d.classList.toggle('act',x===cur))}
 function auto(){timer=setInterval(()=>go(cur+1),6500)}
 auto();
 $('.hero').addEventListener('mouseenter',()=>clearInterval(timer));
 $('.hero').addEventListener('mouseleave',auto);
 dots.forEach(d=>d.onclick=()=>go(+d.dataset.i));
 $('.js-hprev').onclick=()=>go(cur-1);$('.js-hnext').onclick=()=>go(cur+1);
 /* stats tick */
 let betsN=1284502,paidN=8412900;
 const sInt=setInterval(()=>{betsN+=ri(3,25);paidN+=ri(80,2200);const b=$('.js-st-bets'),p=$('.js-st-paid');if(b)b.textContent=nf.format(betsN);if(p)p.textContent='$'+nf.format(paidN)},2500);
 RT.cleanup=()=>{clearInterval(timer);clearInterval(sInt)};
};

/* ================= CASINO ================= */
Views.casino=function(cat){
 cat=cat||'all';
 let provFilter='';const qm=location.hash.match(/\?prov=([^&]+)/);if(qm)provFilter=decodeURIComponent(qm[1]);
 let q='';
 const cats=['all','originals','slots','live','new','popular','favorites'];
 outlet().innerHTML=`${pageHead(t('casino.title'),t('casino.sub'))}
 <div class="ctools rv in">
  <div class="tabs">${cats.map(c=>`<button class="tab ${c===cat?'act':''}" data-c="${c}">${t('cat.'+c)}</button>`).join('')}</div>
 </div>
 <div class="ctools rv in">
  <div class="fwrap fsearch">${ic('search',16)}<input class="inp js-q" placeholder="${t('casino.search')}" value="${esc(q)}"></div>
  <select class="provsel js-prov"><option value="">${t('casino.allprov')}</option>${PROVIDERS.map(p=>`<option ${p===provFilter?'selected':''}>${esc(p)}</option>`).join('')}</select>
 </div>
 <div class="ccount js-count"></div>
 <div class="cgrid js-grid"></div>`;
 const grid=$('.js-grid');
 function filtered(){
  let list=GAMES;
  if(cat==='slots')list=list.filter(g=>g.cat==='slots');
  else if(cat==='live')list=list.filter(g=>g.cat==='live');
  else if(cat==='originals')list=list.filter(g=>g.cat==='originals');
  else if(cat==='new')list=list.filter(g=>g.tags.includes('new')||g.cat==='originals');
  else if(cat==='popular')list=[...list].sort((a,b)=>b.pop-a.pop).slice(0,18);
  else if(cat==='favorites')list=list.filter(g=>favs().includes(g.slug));
  if(provFilter)list=list.filter(g=>g.prov===provFilter);
  if(q)list=list.filter(g=>(g.name+' '+g.prov).toLowerCase().includes(q.toLowerCase()));
  return list}
 function render(){
  const list=filtered();
  $('.js-count').textContent=t('casino.found',{n:list.length});
  if(!list.length){grid.innerHTML=`<div class="empty" style="grid-column:1/-1">${ic(cat==='favorites'?'heart':'search',34)}<div class="t">${t('casino.nores')}</div><div style="font-size:12.5px">${cat==='favorites'&&!me()?t('casino.favlogin'):t('casino.nores.sub')}</div></div>`;return}
  grid.innerHTML=list.map(g=>tileHTML(g)).join('');bindTiles(grid)}
 $$('.tabs .tab',outlet()).forEach(b=>b.onclick=()=>{nav('/casino/'+(b.dataset.c==='all'?'':b.dataset.c))});
 $('.js-q').oninput=e=>{q=e.target.value;render()};
 $('.js-prov').onchange=e=>{provFilter=e.target.value;render()};
 render();
};

/* ================= PROMOTIONS ================= */
Views.promos=function(){
 outlet().innerHTML=`${pageHead(t('promo.title'),t('promo.sub'))}
 <div class="card rv in" style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-bottom:20px;background:linear-gradient(135deg,rgba(76,141,255,.1),var(--card));border-color:rgba(76,141,255,.25)">
  <span class="qi" style="width:46px;height:46px;border-radius:13px;background:rgba(76,141,255,.15);color:#7FB2FF;display:flex;align-items:center;justify-content:center;flex:none">${ic('gift',21)}</span>
  <div style="flex:1;min-width:200px"><h3 style="font-size:15px">${t('promo.code.t')}</h3><p class="dim" style="font-size:12.5px;margin-top:3px">${t('promo.code.s')}</p></div>
  <div style="display:flex;gap:10px;flex:1;min-width:280px">
   <input class="inp js-pcode" style="text-transform:uppercase;flex:1" placeholder="${t('promo.code.ph')}" maxlength="20">
   <button class="btn js-pgo" style="flex:none">${t('promo.code.btn')}</button>
  </div></div>
 <div class="promo-grid rv in">${PROMOS.map(p=>`
  <a class="promo-c" href="#/promo/${p.id}"><div class="pbg" style="background-image:url('${BAN[p.ban]||''}')"></div><div class="psh"></div>
   ${p.badge?`<span class="badge red" style="align-self:flex-start">${p.badge}</span>`:''}
   <h3>${t(p.tk)}</h3><p>${t(p.dk)}</p>
   <span class="morelink" style="margin-top:10px">${t('a.more')} ${ic('arrR',14)}</span></a>`).join('')}
 </div>`;
 const doCode=()=>{
  const u=me();if(!u){openAuth('register');return}
  const code=$('.js-pcode').value.trim().toUpperCase();if(!code)return;
  const CODES={REALWIN:100,WIN50:50,RW2026:200};
  const amt=CODES[code];
  if(!amt||u.claimed['code:'+code]){toast('err',t('promo.code.bad'));return}
  u.claimed['code:'+code]=Date.now();u.balances.USDT+=amt;
  pushTx({type:'bonus',coin:'USDT',amount:amt,meta:code});save();UI.balance();
  notify('gift',t('n.bonus.t'),'+'+amt+' USDT · '+code,true);
  toast('ok',t('promo.code.ok',{a:amt}));$('.js-pcode').value=''};
 $('.js-pgo').onclick=doCode;
 $('.js-pcode').addEventListener('keydown',e=>{if(e.key==='Enter')doCode()});
};
function promoTerms(id){
 const ru=S.lang==='ru';
 const base=ru?[
  ['Кто может участвовать','Игроки 18+ с подтверждённым email. Один бонус на игрока, IP и устройство.'],
  ['Как начисляется','Бонус зачисляется на основной баланс сразу после выполнения условий акции.'],
  ['Отыгрыш','Если не указано иное — вейджер x0: выигрыш сразу доступен к выводу. Демо-версия сайта симулирует начисления.'],
  ['Ограничения','Максимальная ставка с активным бонусом — 5 USDT. Запрещены забеги на противоположные исходы.'],
  ['Общее','RealWin может изменить условия акции, уведомив игроков за 24 часа. Решения службы поддержки окончательны.']
 ]:[
  ['Eligibility','Players 18+ with a confirmed email. One bonus per player, IP and device.'],
  ['Crediting','The bonus is credited to the main balance right after meeting the promo conditions.'],
  ['Wagering','Unless stated otherwise — x0 wagering: winnings are instantly withdrawable. This demo build simulates crediting.'],
  ['Restrictions','Max bet with an active bonus is 5 USDT. Opposite-outcome betting is prohibited.'],
  ['General','RealWin may amend promo terms with a 24h notice. Support team decisions are final.']
 ];
 return base.map(([h,b])=>`<div class="acc-i"><button class="acc-h">${h}${ic('chevD',16)}</button><div class="acc-b"><div>${b}</div></div></div>`).join('')}
Views.promoDetail=function(id){
 const p=PROMOS.find(x=>x.id===id);if(!p){Views.notFound();return}
 const u=me();
 let claimHTML='';
 const claimed=u&&u.claimed[id];
 if(id==='race'){claimHTML=''}
 else if(!u)claimHTML=`<button class="btn lg js-need">${t('promo.needauth')}</button>`;
 else if(id==='rakeback'){claimHTML=`<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><div class="gs" style="background:rgba(76,141,255,.1);border:1px solid rgba(76,141,255,.3);border-radius:12px;padding:10px 16px"><div class="l" style="font-size:10px;font-weight:800;color:var(--tx3);text-transform:uppercase">${t('promo.rk.avail')}</div><div class="v mono" style="font-weight:800;font-size:17px">${fmtN(u.rakeAvail,2)} USDT</div></div><button class="btn lg js-claim">${t('a.claim')}</button></div>`}
 else claimHTML=`<button class="btn lg js-claim" ${claimed?'disabled':''}>${claimed?t('a.claimed'):t('a.claim')}</button>`;
 outlet().innerHTML=`
 <div class="crumb"><a href="#/promotions">${t('promo.title')}</a>${ic('chevR',13)}<span>${t(p.tk)}</span></div>
 <div class="promo-hero rv in"><div class="pbg" style="background-image:url('${BAN[p.ban]||''}')"></div><div class="psh"></div>
  <span class="hero-eyebrow" style="margin-bottom:14px">${ic('gift',13)} RealWin Promo</span>
  <h1 style="font-size:32px;max-width:520px">${t(p.tk)}</h1>
  <p style="color:#B9C4D9;max-width:460px;margin:10px 0 22px">${t(p.dk)}</p>
  <div>${claimHTML}</div></div>
 ${id==='race'?`<section class="sect rv in"><div class="sect-h"><span class="ico">${ic('trophy',17)}</span><h2>${t('promo.race.lead')}</h2></div>
  <div class="card" style="padding:8px 4px"><table class="tbl"><thead><tr><th>#</th><th>${t('feed.player')}</th><th>${t('vip.wagered')}</th><th style="text-align:right">${t('promo.race.prize')}</th></tr></thead><tbody class="js-racetab"></tbody></table></div></section>`:''}
 <section class="sect rv in"><div class="sect-h"><span class="ico">${ic('file',17)}</span><h2>${t('promo.terms')}</h2></div>
  <div class="terms-acc">${promoTerms(id)}</div></section>`;
 bindAcc(outlet());
 const need=$('.js-need');if(need)need.onclick=()=>openAuth('register');
 const cb=$('.js-claim');
 if(cb)cb.onclick=()=>{
  if(!canBet())return;
  if(id==='rakeback'){
   if(u.rakeAvail<0.01){toast('info',t('promo.nothing'));return}
   const amt=u.rakeAvail;u.rakeAvail=0;u.balances.USDT+=amt;
   pushTx({type:'rake',coin:'USDT',amount:amt});save();UI.balance();
   notify('percent',t('n.bonus.t'),`+${fmtN(amt,2)} USDT`,true);toast('ok',t('promo.rk.b'),`+${fmtN(amt,2)} USDT`);
   Views.promoDetail(id);return}
  if(u.claimed[id]){toast('info',t('promo.claimed.already'));return}
  let amt=0,msg='';
  if(id==='welcome'){amt=500;msg=t('promo.w.b')}
  else if(id==='cashback'){if(u.wagered<10){toast('info',t('promo.nothing'));return}amt=Math.min(100,Math.max(5,u.lossToday*0.1));msg=t('promo.cb.b')}
  else if(id==='reload'){amt=50;msg=t('promo.rl.b')}
  u.claimed[id]=Date.now();u.balances.USDT+=amt;
  pushTx({type:'bonus',coin:'USDT',amount:amt,meta:id});save();UI.balance();
  notify('gift',t('n.bonus.t'),`+${fmtN(amt,2)} USDT`,true);toast('ok',msg);
  Views.promoDetail(id)};
 const rt=$('.js-racetab');
 if(rt){const rr=()=>{raceTick();const prizes=[3000,1800,1200,800,500,300,200,100,60,40];
  let rows=RACERS.slice(0,10).map((r,i)=>({n:r.n,w:r.w,p:prizes[i]||20,me:false}));
  if(u&&u.wagered>0)rows.push({n:u.name+' ('+t('promo.race.you')+')',w:u.wagered,p:0,me:true});
  rt.innerHTML=rows.map((r,i)=>`<tr ${r.me?'style="background:rgba(76,141,255,.08)"':''}><td class="mono dim">${r.me?'—':i+1}</td><td style="font-weight:800">${esc(r.n)}</td><td class="mono muted">${fusd(r.w)}</td><td class="mono up" style="text-align:right">${r.p?fusd(r.p):'—'}</td></tr>`).join('')};
  rr();const ri2=setInterval(rr,5000);RT.cleanup=()=>clearInterval(ri2)}
};

/* ================= VIP ================= */
Views.vip=function(){
 const u=me();const w=u?u.wagered:0;const lvl=vipLevel(w);
 const next=VIPS[Math.min(lvl.i+1,VIPS.length-1)];
 const prog=lvl.i>=VIPS.length-1?100:clamp((w-lvl.req)/(next.req-lvl.req)*100,0,100);
 outlet().innerHTML=`
 <div class="promo-hero rv in"><div class="pbg" style="background-image:url('${BAN.vip||''}')"></div><div class="psh"></div>
  <span class="hero-eyebrow" style="margin-bottom:14px">${ic('gem',13)} RealWin VIP</span>
  <h1 style="font-size:32px;max-width:520px">${t('vip.title')}</h1>
  <p style="color:#B9C4D9;max-width:470px;margin:10px 0 0">${t('vip.sub')}</p></div>
 <section class="sect rv in"><div class="card">
  <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:14px">
   <span class="viplvl-ico" style="width:52px;height:52px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:rgba(76,141,255,.12);color:${lvl.c}">${ic('gem',24)}</span>
   <div style="flex:1;min-width:200px"><div class="dim" style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em">${t('vip.cur')}</div>
    <div style="font-family:var(--fd);font-weight:800;font-size:20px">${lvl.name()}</div></div>
   <div style="text-align:right"><div class="dim" style="font-size:11px;font-weight:800;text-transform:uppercase">${t('vip.wagered')}</div><div class="mono" style="font-weight:800;font-size:17px">${fusd(w)}</div></div></div>
  <div class="prg"><i style="width:${prog}%"></i></div>
  ${lvl.i<VIPS.length-1?`<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:12px;font-weight:700;color:var(--tx3)"><span>${lvl.name()}</span><span>${t('prof.tolevel',{a:fusd(Math.max(0,next.req-w)),l:next.name()})}</span><span>${next.name()}</span></div>`:''}
  ${!u?`<button class="btn" style="margin-top:16px" onclick="openAuth('register')">${t('home.cta1')}</button>`:''}
 </div></section>
 <section class="sect rv"><div class="viplvls">${VIPS.slice(1).map((v,i)=>`
  <div class="viplvl ${lvl.k===v.k?'cur':''}"><span class="vic" style="background:rgba(76,141,255,.1);color:${v.c}">${ic('gem',24)}</span>
   <h3>${v.name()}</h3><div class="req">${fusd(v.req)}+ ${t('vip.wagered').toLowerCase()}</div>
   <ul><li>${ic('check',13)}${t('vip.perk.rb',{p:v.rb})}</li><li>${ic('check',13)}${t('vip.perk.cb',{p:v.cb})}</li><li>${ic('check',13)}${t('vip.perk.lvl')}</li>
   ${i>=2?`<li>${ic('check',13)}${t('vip.perk.gift')}</li>`:''}${i>=3?`<li>${ic('check',13)}${t('vip.perk.host')}</li><li>${ic('check',13)}${t('vip.perk.wd')}</li>`:''}</ul></div>`).join('')}
 </div></section>
 <section class="sect rv"><div class="terms-acc">
  <div class="acc-i"><button class="acc-h">${t('vip.faq1')}${ic('chevD',16)}</button><div class="acc-b"><div>${t('vip.faq1a')}</div></div></div>
  <div class="acc-i"><button class="acc-h">${t('vip.faq2')}${ic('chevD',16)}</button><div class="acc-b"><div>${t('vip.faq2a')}</div></div></div>
 </div></section>`;
 bindAcc(outlet());
};

/* ================= AFFILIATE ================= */
Views.affiliate=function(){
 outlet().innerHTML=`
 <div class="promo-hero rv in"><div class="pbg" style="background-image:url('${BAN.promo||''}')"></div><div class="psh"></div>
  <span class="hero-eyebrow" style="margin-bottom:14px">${ic('users',13)} RealWin Partners</span>
  <h1 style="font-size:32px;max-width:560px">${t('aff.title')}</h1>
  <p style="color:#B9C4D9;max-width:470px;margin:10px 0 22px">${t('aff.sub')}</p>
  <div><button class="btn lg js-join">${t('aff.cta')} ${ic('arrR',17)}</button></div></div>
 <section class="sect rv in"><div class="qcats" style="grid-template-columns:repeat(3,1fr)">
  <div class="qcat"><span class="qi">${ic('percent',21)}</span><span><span class="qt">${t('aff.t1')}</span><br><span class="qs">${t('aff.t1s')}</span></span></div>
  <div class="qcat"><span class="qi">${ic('chart',21)}</span><span><span class="qt">${t('aff.t2')}</span><br><span class="qs">${t('aff.t2s')}</span></span></div>
  <div class="qcat"><span class="qi">${ic('zap',21)}</span><span><span class="qt">${t('aff.t3')}</span><br><span class="qs">${t('aff.t3s')}</span></span></div>
 </div></section>`;
 $('.js-join').onclick=()=>me()?nav('/profile/referrals'):openAuth('register');
 if(matchMedia('(max-width:820px)').matches)$('.qcats',outlet()).style.gridTemplateColumns='1fr';
};

/* ================= SPORTS ================= */
let BETSLIP=[];
Views.sports=function(){
 let sport=SPORTS[0].id;
 outlet().innerHTML=`${pageHead(t('sp.title'),t('sp.sub'))}
 <div class="swrap">
  <div>
   <div class="sptabs rv in">${SPORTS.map(s=>{const liveN=s.leagues.flatMap(l=>l.ms).filter(m=>m.live).length;
     return `<button class="sptab ${s.id===sport?'act':''}" data-s="${s.id}">${ic(s.ic,22)}<span>${t(s.nk)}</span>${liveN?`<span class="badge red live">${liveN}</span>`:''}</button>`}).join('')}</div>
   <div class="js-matches"></div>
  </div>
  <div><div class="card betslip js-slip"></div></div>
 </div>
 <button class="bs-fab js-bsfab">${ic('file',18)} ${t('sp.betslip')} <span class="n js-fabn" style="background:#fff;color:var(--acc);border-radius:6px;min-width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800">0</span></button>`;
 const mbox=$('.js-matches');
 function oddBtn(m,k){
  const sel=BETSLIP.some(s=>s.mid===m.id&&s.pick===k);
  const label={1:'1',X:'X',2:'2'}[k];
  return `<button class="oddb ${sel?'sel':''}" data-m="${m.id}" data-k="${k}"><span class="ol">${label}</span><span class="ov">${m.odds[k].toFixed(2)}</span></button>`}
 function matchHTML(m){
  const dot=tm=>`<span class="tdot" style="background:${tm.c}">${esc(tm.n.slice(0,2).toUpperCase())}</span>`;
  const time=m.live?`<span class="badge red live">${t('sp.live')}</span><div class="t" style="margin-top:4px">${t('sp.min',{n:m.live.min})}</div>`
   :`<div class="d">${new Date(m.ts).toLocaleDateString(S.lang==='ru'?'ru-RU':'en-US',{day:'numeric',month:'short'})}</div><div class="t">${new Date(m.ts).toLocaleTimeString(S.lang==='ru'?'ru-RU':'en-US',{hour:'2-digit',minute:'2-digit'})}</div>`;
  return `<div class="match" data-mid="${m.id}"><div class="mtime">${time}</div>
   <div class="teams"><div class="team">${dot(m.h)}<span>${esc(m.h.n)}</span>${m.live?`<span class="score">${m.live.hs}</span>`:''}</div>
   <div class="team">${dot(m.a)}<span>${esc(m.a.n)}</span>${m.live?`<span class="score">${m.live.as}</span>`:''}</div></div>
   <div class="modds">${Object.keys(m.odds).map(k=>oddBtn(m,k)).join('')}</div></div>`}
 function renderMatches(){
  const s=SPORTS.find(x=>x.id===sport);
  mbox.innerHTML=s.leagues.map(l=>`<div class="league rv in"><div class="league-h">${ic('trophy',14)} ${esc(l.name)}</div>${l.ms.map(matchHTML).join('')}</div>`).join('');
  $$('.oddb',mbox).forEach(b=>b.onclick=()=>{
   const {m}=findMatch(b.dataset.m);const k=b.dataset.k;
   const i=BETSLIP.findIndex(s=>s.mid===m.id&&s.pick===k);
   if(i>=0)BETSLIP.splice(i,1);
   else{BETSLIP=BETSLIP.filter(s=>s.mid!==m.id);
    BETSLIP.push({mid:m.id,pick:k,odds:m.odds[k],label:`${m.h.n} — ${m.a.n}`,pickName:k==='1'?m.h.n:k==='2'?m.a.n:'X',live:!!m.live})}
   renderMatches();renderSlip()})}
 function renderSlip(){
  const slip=$('.js-slip');
  $('.js-fabn').textContent=BETSLIP.length;
  if(!BETSLIP.length){slip.innerHTML=`<div class="bs-h">${ic('file',17)} ${t('sp.betslip')}<span class="n">0</span></div><div class="empty" style="padding:30px 10px">${ic('target',30)}<div class="t">${t('sp.empty')}</div></div>${openBetsHTML()}`;bindOpenBets();return}
  const multi=BETSLIP.length>1;
  const multiOdds=BETSLIP.reduce((a,s)=>a*s.odds,1);
  slip.innerHTML=`<div class="bs-h">${ic('file',17)} ${t('sp.betslip')}<span class="n">${BETSLIP.length}</span></div>
   ${BETSLIP.map((s,i)=>`<div class="bs-sel"><div class="bst"><span>${esc(s.pickName)} · <span class="mono" style="color:#8AB4FF">${s.odds.toFixed(2)}</span></span><button class="rm" data-i="${i}">${ic('x',15)}</button></div><div class="bsm">${esc(s.label)}</div>
    ${!multi?`<div class="bs-stake"><input type="number" min="0" step="any" class="js-st" data-i="${i}" placeholder="${t('sp.stake')} (${S.activeCoin})"><span class="dim mono" style="font-size:11px">${S.activeCoin}</span></div>`:''}</div>`).join('')}
   ${multi?`<div class="bs-sel" style="border-color:rgba(76,141,255,.35)"><div class="bst"><span>${t('sp.multi',{n:BETSLIP.length})}</span><span class="mono" style="color:#8AB4FF">${multiOdds.toFixed(2)}</span></div>
    <div class="bs-stake"><input type="number" min="0" step="any" class="js-mst" placeholder="${t('sp.stake')} (${S.activeCoin})"><span class="dim mono" style="font-size:11px">${S.activeCoin}</span></div></div>`:''}
   <div class="bs-tot"><span>${t('sp.payout')}</span><b class="mono js-pay">0.00 ${S.activeCoin}</b></div>
   <button class="btn green wide lg js-place" style="margin-top:8px">${t('sp.place')}</button>
   ${openBetsHTML()}`;
  const upd=()=>{let pay=0;
   if(multi){const v=parseFloat($('.js-mst',slip).value)||0;pay=v*multiOdds}
   else{$$('.js-st',slip).forEach(i=>{const v=parseFloat(i.value)||0;pay+=v*BETSLIP[+i.dataset.i].odds})}
   $('.js-pay',slip).textContent=fc(pay,S.activeCoin)+' '+S.activeCoin};
  $$('input',slip).forEach(i=>i.oninput=upd);
  $$('.rm',slip).forEach(b=>b.onclick=()=>{BETSLIP.splice(+b.dataset.i,1);renderMatches();renderSlip()});
  $('.js-place',slip).onclick=()=>{
   if(!requireAuth()||!canBet())return;
   const u=me();const sym=S.activeCoin;
   let total=0;const orders=[];
   if(multi){const v=parseFloat($('.js-mst',slip).value)||0;if(v<=0)return;total=v;
    orders.push({legs:BETSLIP.map(s=>({...s})),odds:multiOdds,stake:v,label:t('sp.multi',{n:BETSLIP.length})})}
   else{$$('.js-st',slip).forEach(i=>{const v=parseFloat(i.value)||0;if(v>0){total+=v;const s=BETSLIP[+i.dataset.i];orders.push({legs:[{...s}],odds:s.odds,stake:v,label:s.pickName+' @ '+s.odds.toFixed(2)})}})}
   if(!orders.length)return;
   if(bal(sym)<total){toast('err',t('game.notbal'));return}
   orders.forEach(o=>{u.balances[sym]-=o.stake;wagerUsd(toUsd(o.stake,sym));
    pushTx({type:'bet',coin:sym,amount:-o.stake,meta:'Sports'});
    u.sbets.unshift({id:'S'+uid().toUpperCase(),ts:Date.now(),sym,stake:o.stake,odds:o.odds,legs:o.legs,label:o.label,status:'open',settleAt:Date.now()+ri(40,110)*1000})});
   save();UI.balance();BETSLIP=[];renderMatches();renderSlip();
   toast('ok',t('sp.placed'));$('.js-slip').classList.remove('open')};
  bindOpenBets();
 }
 function openBetsHTML(){
  const u=me();if(!u||!u.sbets.filter(b=>b.status==='open').length)return'';
  return `<div class="mybets-mini"><div class="dd-h" style="padding-left:2px">${t('sp.mybets')}</div>
   ${u.sbets.filter(b=>b.status==='open').slice(0,4).map(b=>`<div class="bs-sel"><div class="bst"><span>${esc(b.label)}</span><span class="badge yellow">${t('bets.open')}</span></div><div class="bsm mono">${fc(b.stake,b.sym)} ${b.sym} → ${fc(b.stake*b.odds,b.sym)} ${b.sym}</div></div>`).join('')}</div>`}
 function bindOpenBets(){}
 $$('.sptab',outlet()).forEach(b=>b.onclick=()=>{sport=b.dataset.s;$$('.sptab').forEach(x=>x.classList.toggle('act',x===b));renderMatches()});
 $('.js-bsfab').onclick=()=>$('.js-slip').classList.toggle('open');
 renderMatches();renderSlip();
 const live=setInterval(()=>{ /* live drift */
  SPORTS.forEach(s=>s.leagues.forEach(l=>l.ms.forEach(m=>{
   if(m.live){m.live.min=Math.min(90,m.live.min+1);
    if(Math.random()<.1){if(Math.random()<.5)m.live.hs+=s.id==='basketball'?ri(2,3):1;else m.live.as+=s.id==='basketball'?ri(2,3):1}
    Object.keys(m.odds).forEach(k=>{m.odds[k]=Math.max(1.05,+(m.odds[k]+rnd(-.06,.06)).toFixed(2))})}})));
  renderMatches()},8000);
 RT.cleanup=()=>clearInterval(live);
};
/* sports settlement — global */
function settleSbets(){
 const u=me();if(!u)return;let changed=false;
 u.sbets.forEach(b=>{
  if(b.status==='open'&&Date.now()>=b.settleAt){
   const wins=b.legs.every(l=>Math.random()<(1/l.odds)*0.95);
   b.status=wins?'won':'lost';changed=true;
   if(wins){const pay=b.stake*b.odds;u.balances[b.sym]=(u.balances[b.sym]||0)+pay;u.pnl+=toUsd(pay,b.sym);
    pushTx({type:'win',coin:b.sym,amount:pay,meta:'Sports'});
    notify('trophy',t('n.bet.t'),t('sp.settled',{r:t('sp.won')+' +'+fc(pay,b.sym)+' '+b.sym}))}
   else{u.pnl-=toUsd(b.stake,b.sym);notify('info',t('n.bet.t'),t('sp.settled',{r:t('sp.lost')}))}}});
 if(changed){save();UI.balance()}}

/* ================= PROFILE ================= */
Views.profile=function(tab){
 if(!me()){openAuth('login');nav('/');return}
 tab=tab||'overview';
 const u=me();
 const tabs=[['overview','user'],['wallet','wallet'],['transactions','history'],['bets','dice'],['settings','sliders'],['verification','shieldCheck'],['referrals','users']];
 outlet().innerHTML=`${pageHead(t('prof.title'))}
 <div class="pwrap"><nav class="pnav">${tabs.map(([k,i])=>`<a href="#/profile/${k}" class="${k===tab?'act':''}">${ic(i,17)}${t('prof.'+(k==='verification'?'verify':k==='referrals'?'refs':k==='transactions'?'tx':k))}</a>`).join('')}</nav>
 <div class="js-pbody" style="min-width:0"></div></div>`;
 const box=$('.js-pbody');
 const P={};
 P.overview=()=>{
  const lvl=vipLevel(u.wagered);const next=VIPS[Math.min(lvl.i+1,VIPS.length-1)];
  const prog=lvl.i>=VIPS.length-1?100:clamp((u.wagered-lvl.req)/(next.req-lvl.req)*100,0,100);
  const wins=u.bets.filter(b=>b.win).length;
  box.innerHTML=`<div class="card rv in" style="margin-bottom:16px"><div class="phead">
   <label class="avup" title="${t('set.avatar.up')}">${avatarHTML(u)}<span class="cam">${ic('upload',20)}</span><input type="file" class="js-avf" accept="image/*" hidden></label>
   <div style="flex:1;min-width:0"><h2 style="font-size:21px">${esc(u.name)}</h2><div class="dim" style="font-size:12.5px">${t('prof.joined',{d:new Date(u.created).toLocaleDateString(S.lang==='ru'?'ru-RU':'en-US',{month:'long',year:'numeric'})})}</div>
   <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><span class="badge blue">${ic('gem',11)} ${vipLevel(u.wagered).name()}</span>
   <span class="badge ${u.verif.status==='ok'?'green':u.verif.status==='pending'?'yellow':'gray'}">${ic('shield',11)} ${t('kyc.status.'+(u.verif.status==='ok'?'ok':u.verif.status==='pending'?'pending':'none'))}</span></div></div></div>
   <div class="prg"><i style="width:${prog}%"></i></div>
   <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:12px;font-weight:700;color:var(--tx3)"><span>${t('prof.level')}: ${lvl.name()}</span>${lvl.i<VIPS.length-1?`<span>${t('prof.tolevel',{a:fusd(Math.max(0,next.req-u.wagered)),l:next.name()})}</span>`:''}</div></div>
  <div class="pstats rv in" style="margin-bottom:16px">
   <div class="stat"><span class="si">${ic('dice',19)}</span><span><span class="sv">${nf.format(u.bets.length+u.sbets.length)}</span><br><span class="sl">${t('prof.totalbets')}</span></span></div>
   <div class="stat"><span class="si">${ic('trophy',19)}</span><span><span class="sv">${nf.format(wins)}</span><br><span class="sl">${t('prof.wins')}</span></span></div>
   <div class="stat"><span class="si">${ic('chart',19)}</span><span><span class="sv">${fusd(u.wagered)}</span><br><span class="sl">${t('prof.wagered')}</span></span></div>
   <div class="stat"><span class="si">${ic('coins',19)}</span><span><span class="sv ${u.pnl>=0?'up':'down'}">${(u.pnl>=0?'+':'')+fusd(u.pnl).replace('$-','-$')}</span><br><span class="sl">${t('prof.pnl')}</span></span></div></div>
  <div class="card rv in"><div class="sect-h" style="margin-bottom:8px"><h2 style="font-size:16px">${t('prof.recent')}</h2></div>${betsTable(u.bets.slice(0,8))}</div>`;
  const avf=$('.js-avf',box);
  if(avf)avf.onchange=()=>setAvatarFromFile(avf.files[0],()=>P.overview());
 };
 function betsTable(list){
  if(!list.length)return `<div class="empty">${ic('dice',30)}<div class="t">${t('prof.nobets')}</div></div>`;
  return `<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>${t('bets.game')}</th><th>${t('feed.bet')}</th><th>${t('feed.mult')}</th><th>${t('bets.result')}</th><th style="text-align:right">${t('tx.date')}</th></tr></thead><tbody>
  ${list.map(b=>`<tr><td style="font-weight:800">${esc(gameBy(b.g)?gameBy(b.g).name:b.g)}</td><td class="mono muted">${fc(b.amt,b.sym)} ${b.sym}</td><td class="mono">${b.mult?b.mult.toFixed(2)+'×':'—'}</td>
   <td>${b.win?`<span class="badge green">+${fc(b.payout,b.sym)} ${b.sym}</span>`:`<span class="badge red">${t('bets.lost')}</span>`}</td><td class="dim" style="text-align:right;font-size:12px">${dts(b.ts)}</td></tr>`).join('')}</tbody></table></div>`}
 P.wallet=()=>{
  box.innerHTML=`<div class="card rv in"><div class="sect-h"><h2 style="font-size:16px">${t('w.balance')}</h2><div class="more"><button class="btn sm js-dep2">${ic('plus',15)} ${t('a.deposit')}</button><button class="btn sm soft js-wd2">${t('a.withdraw')}</button></div></div>
  ${COINS.map(c=>{const b=bal(c.s);return `<div class="wrow">${coinIcon(c.s,28)}<span><span class="wn">${c.s}</span><br><span class="ws">${esc(c.n)}</span></span><span class="wb">${fc(b,c.s)}<span class="fiat">${fusd(toUsd(b,c.s))}</span></span><button class="tailbtn js-wdep" data-c="${c.s}" style="margin-left:12px">${t('a.deposit')}</button></div>`}).join('')}</div>`;
  $('.js-dep2').onclick=()=>openWallet('deposit');$('.js-wd2').onclick=()=>openWallet('withdraw');
  $$('.js-wdep').forEach(b=>b.onclick=()=>openWallet('deposit',b.dataset.c));
 };
 P.transactions=()=>{
  let f='all';
  const render=()=>{
   const list=u.txs.filter(x=>f==='all'||x.type===f);
   $('.js-txtab',box).innerHTML=list.length?`<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>${t('tx.type')}</th><th>ID</th><th>${t('tx.amount')}</th><th>${t('tx.status')}</th><th style="text-align:right">${t('tx.date')}</th></tr></thead><tbody>
    ${list.slice(0,40).map(x=>{const pos=x.amount>0;return `<tr><td style="font-weight:800">${t('tx.'+x.type)}${x.meta?` <span class="dim" style="font-size:11px">· ${esc(String(x.meta))}</span>`:''}</td><td class="mono dim" style="font-size:11px">${x.id}</td>
     <td class="mono ${pos?'up':''}" style="font-weight:700">${pos?'+':''}${fc(x.amount,x.coin)} ${x.coin}</td>
     <td><span class="badge ${x.status==='done'?'green':'yellow'}">${t(x.status==='done'?'tx.done':'tx.pending')}</span></td>
     <td class="dim" style="text-align:right;font-size:12px">${dts(x.ts)}</td></tr>`}).join('')}</tbody></table></div>`:`<div class="empty">${ic('history',30)}<div class="t">${t('tx.empty')}</div></div>`};
  box.innerHTML=`<div class="card rv in"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">${[['all','tx.all'],['dep','tx.dep'],['wd','tx.wd'],['bet','tx.bet'],['win','tx.win'],['bonus','tx.bonus']].map(([k,tk])=>`<button class="chip ${f===k?'act':''}" data-f="${k}">${t(tk)}</button>`).join('')}</div><div class="js-txtab"></div></div>`;
  $$('.chip',box).forEach(c=>c.onclick=()=>{f=c.dataset.f;$$('.chip',box).forEach(x=>x.classList.toggle('act',x===c));render()});
  render()};
 P.bets=()=>{
  let mode='casino';
  const render=()=>{
   const b=$('.js-btab',box);
   if(mode==='casino'){b.innerHTML=betsTable(u.bets.slice(0,30))}
   else{const list=u.sbets;b.innerHTML=list.length?`<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>${t('bets.game')}</th><th>${t('sp.stake')}</th><th>${t('sp.totalodds')}</th><th>${t('bets.result')}</th><th style="text-align:right">${t('tx.date')}</th></tr></thead><tbody>
    ${list.slice(0,30).map(x=>`<tr><td style="font-weight:800">${esc(x.label)}<div class="dim" style="font-size:11px">${x.legs.map(l=>esc(l.pickName)).join(' · ')}</div></td>
     <td class="mono muted">${fc(x.stake,x.sym)} ${x.sym}</td><td class="mono">${x.odds.toFixed(2)}</td>
     <td>${x.status==='open'?`<span class="badge yellow">${t('bets.open')}</span>`:x.status==='won'?`<span class="badge green">+${fc(x.stake*x.odds,x.sym)} ${x.sym}</span>`:`<span class="badge red">${t('bets.lost')}</span>`}</td>
     <td class="dim" style="text-align:right;font-size:12px">${dts(x.ts)}</td></tr>`).join('')}</tbody></table></div>`:`<div class="empty">${ic('football',30)}<div class="t">${t('bets.empty')}</div></div>`}};
  box.innerHTML=`<div class="card rv in"><div class="tabs" style="margin-bottom:14px"><button class="tab act" data-m="casino">${t('bets.casino')}</button><button class="tab" data-m="sport">${t('bets.sport')}</button></div><div class="js-btab"></div></div>`;
  $$('.tab',box).forEach(b=>b.onclick=()=>{mode=b.dataset.m;$$('.tab',box).forEach(x=>x.classList.toggle('act',x===b));render()});
  render()};
 P.settings=()=>{
  box.innerHTML=`<div class="card rv in" style="margin-bottom:16px"><h3 style="font-size:15px;margin-bottom:6px">${t('set.title')}</h3>
   <div class="setrow"><div><div class="st">${t('set.avatar')}</div><div class="ss">${t('set.avatar.s')}</div></div>
    <div class="end" style="display:flex;gap:8px;align-items:center"><label class="btn sm soft" style="cursor:pointer">${t('set.avatar.up')}<input type="file" class="js-avf2" accept="image/*" hidden></label>${u.avatar?`<button class="btn sm ghost js-avrm">${t('set.avatar.rm')}</button>`:''}</div></div>
   <div class="setrow"><div><div class="st">${t('set.lang')}</div><div class="ss">${t('set.lang.sub')}</div></div><div class="end tabs" style="padding:3px"><button class="tab ${S.lang==='ru'?'act':''}" data-l="ru">RU</button><button class="tab ${S.lang==='en'?'act':''}" data-l="en">EN</button></div></div>
   <div class="setrow"><div><div class="st">${t('set.priv')}</div><div class="ss">${t('set.priv.sub')}</div></div><label class="switch end"><input type="checkbox" class="js-priv" ${u.privacy?'checked':''}><i></i></label></div>
   <div class="setrow"><div><div class="st">${t('set.2fa')}</div><div class="ss">${u.twoFA?t('set.2fa.on'):t('set.2fa.off')}</div></div><label class="switch end"><input type="checkbox" class="js-2fa" ${u.twoFA?'checked':''}><i></i></label></div>
  </div>
  <div class="card rv in" style="margin-bottom:16px"><h3 style="font-size:15px;margin-bottom:10px">${t('set.pass')}</h3>
   <div class="field"><label>${t('set.pass.cur')}</label><div class="fwrap">${ic('lock',16)}<input class="inp js-pc" type="password"></div></div>
   <div class="field"><label>${t('set.pass.new')}</label><div class="fwrap">${ic('key',16)}<input class="inp js-pn" type="password"></div></div>
   <button class="btn sm js-psave">${t('a.save')}</button></div>
  <div class="card rv in" style="margin-bottom:16px"><h3 style="font-size:15px;margin-bottom:10px">${ic('shield',15)} ${t('set.limits')}</h3>
   <div class="gdesc"><div class="field"><label>${t('set.dep.lim')}</label><input class="inp js-dlim" type="number" min="0" value="${u.limits.dep||''}" placeholder="∞"></div>
   <div class="field"><label>${t('set.loss.lim')}</label><input class="inp js-llim" type="number" min="0" value="${u.limits.loss||''}" placeholder="∞"></div></div>
   <div class="field"><label>${t('set.cool')}</label><select class="inp js-cool"><option value="0">${t('set.cool.0')}</option><option value="24">${t('set.cool.24')}</option><option value="168">${t('set.cool.7')}</option></select></div>
   ${u.limits.coolUntil>Date.now()?`<div class="note warn" style="margin-bottom:12px">${ic('alert',15)}<span>${t('set.cool.on',{d:new Date(u.limits.coolUntil).toLocaleString()})}</span></div>`:''}
   <button class="btn sm js-lsave">${t('a.save')}</button></div>
  <div class="card rv in" style="margin-bottom:16px"><h3 style="font-size:15px;margin-bottom:10px">${t('set.session')}</h3>
   <div class="wrow"><span class="ni" style="width:34px;height:34px;border-radius:10px;background:rgba(49,196,108,.13);color:#5BD98F;display:flex;align-items:center;justify-content:center">${ic('check',16)}</span><span><span class="wn">${t('set.thisdev')}</span><br><span class="ws">${navigator.platform||'Web'} · ${new Date().toLocaleDateString()}</span></span><span class="badge green" style="margin-left:auto">online</span></div></div>
  <div class="card rv in" style="border-color:rgba(229,72,77,.3)"><div class="setrow" style="border:0;padding:2px"><div><div class="st" style="color:#F0898D">${t('set.del')}</div><div class="ss">${t('set.del.sub')}</div></div><button class="btn danger sm end js-del">${t('set.del')}</button></div></div>`;
  $$('[data-l]',box).forEach(b=>b.onclick=()=>langSet(b.dataset.l));
  const avf2=$('.js-avf2',box);
  if(avf2)avf2.onchange=()=>setAvatarFromFile(avf2.files[0],()=>P.settings());
  const avrm=$('.js-avrm',box);
  if(avrm)avrm.onclick=()=>{delete u.avatar;save();UI.header();toast('ok',t('set.avatar.ok'));P.settings()};
  $('.js-priv',box).onchange=e=>{u.privacy=e.target.checked;save();toast('ok',t('set.saved'))};
  $('.js-2fa',box).onchange=e=>{
   if(e.target.checked){e.target.checked=false;open2FA(u,()=>P.settings())}
   else{u.twoFA=false;save();toast('info',t('set.2fa.off'))}};
  $('.js-psave',box).onclick=()=>{
   const c=$('.js-pc',box).value,n=$('.js-pn',box).value;
   if(u.pass!==btoa(unescape(encodeURIComponent(c)))){toast('err',t('set.pass.err'));return}
   if(n.length<6){toast('err',t('auth.err.pass'));return}
   u.pass=btoa(unescape(encodeURIComponent(n)));save();toast('ok',t('set.pass.done'));$('.js-pc',box).value='';$('.js-pn',box).value=''};
  $('.js-lsave',box).onclick=()=>{
   u.limits.dep=parseFloat($('.js-dlim',box).value)||0;
   u.limits.loss=parseFloat($('.js-llim',box).value)||0;
   const c=parseFloat($('.js-cool',box).value)||0;
   if(c>0)u.limits.coolUntil=Date.now()+c*3600e3;
   save();toast('ok',t('set.saved'));P.settings()};
  $('.js-del',box).onclick=()=>confirmDialog(t('set.del.confirm'),()=>{delete S.accounts[u.email];S.sessionEmail=null;save();UI.renderShell();nav('/')});
 };
 P.verification=()=>{
  const st=u.verif.status;
  box.innerHTML=`<div class="card rv in"><h3 style="font-size:15px">${t('kyc.title')}</h3><p class="dim" style="font-size:13px;margin:6px 0 16px">${t('kyc.sub')}</p>
   <div class="kyc-step done"><span class="ki">${ic('mail',18)}</span><div style="flex:1"><div class="st" style="font-weight:800;font-size:13.5px">${t('kyc.s1')}</div><div class="ss" style="font-size:12px;color:var(--tx3)">${esc(u.email)}</div></div><span class="badge green">${ic('check',11)} OK</span></div>
   <div class="kyc-step ${st==='ok'?'done':''}"><span class="ki">${ic('file',18)}</span><div style="flex:1"><div class="st" style="font-weight:800;font-size:13.5px">${t('kyc.s2')}</div><div class="ss" style="font-size:12px;color:var(--tx3)">${t('kyc.s2s')}</div></div>
    ${st==='ok'?`<span class="badge green">${ic('check',11)} OK</span>`:st==='pending'?`<span class="badge yellow">${t('kyc.status.pending')}</span>`:''}</div>
   <div class="kyc-step ${st==='ok'?'done':''}"><span class="ki">${ic('user',18)}</span><div style="flex:1"><div class="st" style="font-weight:800;font-size:13.5px">${t('kyc.s3')}</div><div class="ss" style="font-size:12px;color:var(--tx3)">${t('kyc.s3s')}</div></div>
    ${st==='ok'?`<span class="badge green">${ic('check',11)} OK</span>`:st==='pending'?`<span class="badge yellow">${t('kyc.status.pending')}</span>`:''}</div>
   ${st==='none'?`<label class="btn wide" style="margin-top:10px;cursor:pointer">${ic('upload',17)} ${t('kyc.upload')}<input type="file" class="js-kycf" accept="image/*,.pdf" multiple style="display:none"></label>`:''}
   ${st==='pending'?`<div class="note" style="margin-top:10px">${ic('clock',15)}<span>${t('kyc.pending')}</span></div>`:''}
   ${st==='ok'?`<div class="note" style="margin-top:10px;background:rgba(49,196,108,.08);border-color:rgba(49,196,108,.25);color:#8FE0B0">${ic('shieldCheck',15)}<span>${t('kyc.done')}</span></div>`:''}</div>`;
  const f=$('.js-kycf',box);
  if(f)f.onchange=()=>{if(!f.files.length)return;u.verif.status='pending';u.verif.until=Date.now()+45000;save();
   setTimeout(()=>{if(me()===u&&u.verif.status==='pending'){u.verif.status='ok';save();notify('shieldCheck',t('n.kyc.t'),t('n.kyc.b'));if(currentPath()==='/profile/verification')P.verification()}},45000);
   P.verification()};
 };
 P.referrals=()=>{
  const link='https://realwin.example/r/'+encodeURIComponent(u.name.toLowerCase());
  box.innerHTML=`<div class="card rv in" style="margin-bottom:16px"><h3 style="font-size:15px">${t('ref.title')}</h3><p class="dim" style="font-size:13px;margin:6px 0 14px">${t('ref.sub')}</p>
   <div class="betrow"><label>${t('ref.link')}</label><div class="addrbox" style="margin:0"><span class="a">${link}</span><button class="tailbtn js-copy" style="flex:none">${ic('copy',14)} ${t('a.copy')}</button></div></div></div>
  <div class="pstats rv in" style="margin-bottom:16px">
   <div class="stat"><span class="si">${ic('users',19)}</span><span><span class="sv">0</span><br><span class="sl">${t('ref.stat1')}</span></span></div>
   <div class="stat"><span class="si">${ic('zap',19)}</span><span><span class="sv">0</span><br><span class="sl">${t('ref.stat2')}</span></span></div>
   <div class="stat"><span class="si">${ic('coins',19)}</span><span><span class="sv">$0.00</span><br><span class="sl">${t('ref.stat3')}</span></span></div></div>
  <div class="card rv in"><h3 style="font-size:15px;margin-bottom:12px">${t('ref.how')}</h3>
   ${[['send','ref.h1','ref.h1s'],['users','ref.h2','ref.h2s'],['percent','ref.h3','ref.h3s']].map(([i,a,b],x)=>`<div class="kyc-step"><span class="ki">${ic(i,18)}</span><div><div style="font-weight:800;font-size:13.5px">${x+1}. ${t(a)}</div><div style="font-size:12px;color:var(--tx3)">${t(b)}</div></div></div>`).join('')}</div>`;
  $('.js-copy',box).onclick=()=>copyText(link);
 };
 (P[tab]||P.overview)();
};
function open2FA(u,after){
 const secret='RW'+uid().toUpperCase()+uid().toUpperCase().slice(0,6);
 const uri=`otpauth://totp/RealWin:${encodeURIComponent(u.email)}?secret=${secret}&issuer=RealWin`;
 let qrImg='';try{const q=qrcode(0,'M');q.addData(uri);q.make();qrImg=`<img src="${q.createDataURL(3,2)}" alt="QR">`}catch(e){}
 const m=openModal(`<div class="m-body"><div class="m-title">${t('set.2fa')}</div><div class="m-sub">${t('set.2fa.scan')}</div>
  <div class="qrbox"><div class="qr">${qrImg}</div><div style="flex:1;min-width:0"><div class="addrbox"><span class="a">${secret}</span><button class="tailbtn js-c" style="flex:none">${ic('copy',13)}</button></div></div></div>
  <div class="field"><label>${t('set.2fa.code')}</label><input class="inp js-code" maxlength="6" inputmode="numeric" placeholder="000000"></div>
  <button class="btn wide js-ok">${t('a.confirm')}</button></div>`);
 $('.js-c',m.el).onclick=()=>copyText(secret);
 $('.js-ok',m.el).onclick=()=>{const v=$('.js-code',m.el).value.trim();
  if(!/^\d{6}$/.test(v)){toast('err',t('set.2fa.err'));return}
  u.twoFA=true;save();m.close();toast('ok',t('set.2fa.on'));after&&after()};
}

/* ================= SUPPORT ================= */
Views.support=function(){
 outlet().innerHTML=`${pageHead(t('sup.title'),t('sup.sub'))}
 <div class="qcats rv in" style="grid-template-columns:1fr 1fr;margin-bottom:26px">
  <button class="qcat js-openchat"><span class="qi">${ic('message',21)}</span><span style="text-align:left"><span class="qt">${t('sup.chat')}</span><br><span class="qs">${t('sup.chat.s')}</span></span><span style="margin-left:auto" class="badge green">24/7</span></button>
  <button class="qcat js-mail"><span class="qi">${ic('mail',21)}</span><span style="text-align:left"><span class="qt">${t('sup.email')}</span><br><span class="qs">${t('sup.email.s')}</span></span><span style="margin-left:auto" class="tailbtn">${ic('copy',13)}</span></button>
 </div>
 <div class="gdesc">
 <div class="card rv in"><h3 style="font-size:15px;margin-bottom:12px">${t('sup.ticket')}</h3>
  <div class="field"><label>${t('sup.subj')}</label><select class="inp js-subj">${[1,2,3,4].map(i=>`<option>${t('chat.q'+i)}</option>`).join('')}</select></div>
  <div class="field"><label>${t('sup.msg')}</label><textarea class="inp js-msg"></textarea></div>
  <button class="btn js-send">${ic('send',15)} ${t('a.send')}</button></div>
 <div class="card rv in"><h3 style="font-size:15px;margin-bottom:12px">${t('sup.faq')}</h3>
  <div class="terms-acc">${[1,2,3,4,5,6].map(i=>`<div class="acc-i"><button class="acc-h">${t('faq.q'+i)}${ic('chevD',16)}</button><div class="acc-b"><div>${t('faq.a'+i)}</div></div></div>`).join('')}</div></div>
 </div>`;
 bindAcc(outlet());
 $('.js-openchat').onclick=()=>toggleChat(true);
 $('.js-mail').onclick=()=>copyText('support@realwin.example');
 $('.js-send').onclick=()=>{const msg=$('.js-msg').value.trim();if(!msg)return;
  $('.js-msg').value='';const n='RW-'+ri(10000,99999);toast('ok',t('sup.sent',{n}));
  if(me())notify('headset',t('sup.title'),t('sup.sent',{n}),true)};
};

/* ================= FAIRNESS ================= */
Views.fairness=function(){
 const u=me();
 outlet().innerHTML=`${pageHead(t('fair.title'),t('fair.sub'))}
 <div class="gdesc">
  <div class="card rv in"><h3 style="font-size:15px;margin-bottom:12px">${ic('shieldCheck',16)} ${t('fair.how')}</h3>
   ${[t('fair.p1'),t('fair.p2'),t('fair.p3')].map((p,i)=>`<div class="kyc-step"><span class="ki" style="font-family:var(--fd);font-weight:800">${i+1}</span><div style="font-size:13px;color:var(--tx2);line-height:1.6">${p}</div></div>`).join('')}</div>
  <div class="card rv in"><h3 style="font-size:15px;margin-bottom:12px">${ic('key',16)} Seeds</h3>
   ${u?`<div class="seedbox">
    <div class="field" style="margin:0"><label>${t('fair.client')}</label><div class="fwrap"><input class="inp js-cs mono" value="${esc(u.seeds.client)}"><span class="tail"><button class="tailbtn js-cssave">${t('a.save')}</button></span></div></div>
    <div class="field" style="margin:0"><label>${t('fair.server')}</label><div class="addrbox" style="margin:0"><span class="a">${u.seeds.serverHash||'—'}</span><button class="tailbtn js-copysh" style="flex:none">${ic('copy',13)}</button></div></div>
    <div class="gstat3" style="grid-template-columns:1fr 1fr;margin:0"><div class="gs"><div class="l">${t('fair.nonce')}</div><div class="v">${u.seeds.nonce}</div></div><div class="gs"><div class="l">RTP</div><div class="v">99%</div></div></div>
    <button class="btn soft js-rotate">${ic('refresh',16)} ${t('fair.rotate')}</button>
    <div class="js-revealed"></div></div>`
   :`<div class="empty">${ic('lock',30)}<div class="t">${t('toast.login.req')}</div><button class="btn sm" onclick="openAuth('login')">${t('a.login')}</button></div>`}</div>
 </div>`;
 if(u){
  $('.js-cssave').onclick=()=>{const v=$('.js-cs').value.trim();if(v){u.seeds.client=v;u.seeds.nonce=0;save();toast('ok',t('fair.saved'))}};
  $('.js-copysh').onclick=()=>copyText(u.seeds.serverHash);
  $('.js-rotate').onclick=async()=>{
   const old=u.seeds.server;
   const ns=await sha256hex(uid()+Date.now());
   u.seeds.server=ns;u.seeds.serverHash=await sha256hex(ns);u.seeds.nonce=0;save();
   $('.js-revealed').innerHTML=`<div class="note" style="margin-top:4px">${ic('eye',15)}<span>${t('fair.revealed')}<br><span class="mono" style="word-break:break-all">${old||'—'}</span></span></div>`;
   Views.fairness&&toast('ok',t('fair.rotate'));};
 }
};

/* ================= LEGAL / ABOUT ================= */
function legalBlocks(key){
 const ru=S.lang==='ru';
 const D={
 about:ru?[['Кто мы','RealWin — криптоигровая платформа нового поколения. Мы объединили казино, спортбук и собственные provably fair игры в одном быстром интерфейсе.'],['Цифры','3000+ игр от 20+ провайдеров, 12 криптовалют, выплаты в среднем за 4 минуты, поддержка 24/7.'],['Технологии','Мгновенные депозиты после 1 подтверждения, прозрачный алгоритм честности, собственная антифрод-система.'],['Ценности','Честная математика, ответственная игра и уважение к времени игрока: минимум кликов до любимой игры.']]
 :[['Who we are','RealWin is a next-generation crypto gaming platform. Casino, sportsbook and provably fair originals in one fast interface.'],['Numbers','3,000+ games from 20+ providers, 12 cryptocurrencies, average payout in 4 minutes, 24/7 support.'],['Technology','Instant deposits after 1 confirmation, transparent fairness algorithm, in-house anti-fraud.'],['Values','Honest math, responsible play and respect for the player\'s time: minimum clicks to your favorite game.']],
 terms:ru?[['1. Общие положения','Используя RealWin, вы подтверждаете, что вам исполнилось 18 лет и азартные игры законны в вашей юрисдикции. Данная сборка — демонстрационная.'],['2. Аккаунт','Разрешён один аккаунт на игрока. Передача аккаунта третьим лицам запрещена. Вы отвечаете за сохранность пароля и 2FA.'],['3. Депозиты и выводы','Принимаются только криптовалюты. Средства зачисляются после подтверждения сети. Выводы обрабатываются автоматически.'],['4. Игровой процесс','Результаты определяются ГСЧ и алгоритмом Provably Fair. Использование багов, мультиаккаунтов и стороннего ПО ведёт к блокировке.'],['5. Ограничение ответственности','Сервис предоставляется «как есть». Максимальная ответственность ограничена балансом аккаунта.'],['6. Изменения','Мы можем обновлять условия, уведомляя игроков на сайте за 24 часа до вступления в силу.']]
 :[['1. General','By using RealWin you confirm you are 18+ and gambling is legal in your jurisdiction. This build is a demonstration.'],['2. Account','One account per player. Account transfer is prohibited. You are responsible for your password and 2FA.'],['3. Deposits & withdrawals','Crypto only. Funds are credited after network confirmation. Withdrawals are processed automatically.'],['4. Gameplay','Results are driven by RNG and the Provably Fair algorithm. Exploits, multi-accounts and third-party software lead to a ban.'],['5. Liability','The service is provided "as is". Maximum liability is limited to the account balance.'],['6. Changes','We may update the terms with a 24h on-site notice before they take effect.']],
 privacy:ru?[['Какие данные мы собираем','Email, имя пользователя, технические данные сессии и историю операций — минимум, необходимый для работы платформы.'],['Как используем','Для входа в аккаунт, обработки платежей, защиты от мошенничества и поддержки. Мы не продаём данные третьим лицам.'],['Хранение','Данные шифруются при передаче и хранении. Данная демо-сборка хранит данные локально в вашем браузере.'],['Cookies','Используются только функциональные cookies: сессия, язык, валюта отображения.'],['Ваши права','Вы можете запросить экспорт или удаление данных в любой момент через поддержку или настройки аккаунта.']]
 :[['Data we collect','Email, username, session metadata and operation history — the minimum needed to run the platform.'],['How we use it','Sign-in, payment processing, anti-fraud and support. We never sell data to third parties.'],['Storage','Data is encrypted in transit and at rest. This demo build stores data locally in your browser.'],['Cookies','Functional cookies only: session, language, display currency.'],['Your rights','You can request export or deletion of your data at any time via support or account settings.']],
 responsible:ru?[['Играйте осознанно','Азартные игры — развлечение, а не способ заработка. Ставьте только то, что готовы потратить.'],['Инструменты контроля','В настройках доступны лимиты депозита и проигрыша, а также пауза в игре на 24 часа или 7 дней.'],['Признаки проблемы','Игра на последние деньги, догон проигрышей, скрытность от близких — повод остановиться.'],['Самоисключение','Напишите в поддержку — мы закроем доступ к аккаунту на срок от 6 месяцев без возможности отмены.'],['Помощь','Международные организации: GamblingTherapy.org, Gamblers Anonymous. Помощь бесплатна и анонимна.']]
 :[['Play consciously','Gambling is entertainment, not income. Only stake what you can afford to spend.'],['Control tools','Settings include deposit and loss limits, plus a 24-hour or 7-day cool-off.'],['Warning signs','Betting last money, chasing losses, hiding play from family — reasons to stop.'],['Self-exclusion','Contact support — we will lock the account for 6+ months with no reversal.'],['Get help','International organizations: GamblingTherapy.org, Gamblers Anonymous. Help is free and anonymous.']],
 aml:ru?[['Политика AML','RealWin придерживается принципов противодействия отмыванию средств: мониторинг транзакций и риск-скоринг кошельков.'],['KYC','Верификация запрашивается при повышенных лимитах, подозрительной активности или по требованию регулятора.'],['Источники средств','Мы вправе запросить подтверждение источника средств для крупных оборотов.'],['Санкционные списки','Пользователи из санкционных списков и запрещённых юрисдикций не обслуживаются.'],['Сообщения','Подозрительные операции фиксируются и передаются уполномоченным органам в соответствии с законом.']]
 :[['AML policy','RealWin follows anti-money-laundering principles: transaction monitoring and wallet risk scoring.'],['KYC','Verification is requested for higher limits, suspicious activity or regulator demand.'],['Source of funds','We may request proof of source of funds for large volumes.'],['Sanctions','Users from sanctions lists and restricted jurisdictions are not served.'],['Reporting','Suspicious operations are recorded and reported to authorities as required by law.']]
 };
 return D[key]||[];
}
function legalView(key,titleKey){
 return function(){
  outlet().innerHTML=`${pageHead(t(titleKey))}<div class="legal">${legalBlocks(key).map(([h,b])=>`<div class="card rv"><h3>${h}</h3><p>${b}</p></div>`).join('')}</div>`;
 }
}
Views.about=legalView('about','legal.about');
Views.terms=legalView('terms','legal.terms');
Views.privacy=legalView('privacy','legal.privacy');
Views.responsible=legalView('responsible','legal.resp');
Views.aml=legalView('aml','legal.aml');

Views.notFound=function(){
 outlet().innerHTML=`<div class="empty" style="padding:90px 20px">${logoSVG(64)}<h2 style="font-size:40px;font-family:var(--fd)">404</h2><div class="t">${S.lang==='ru'?'Такой страницы нет':'Page not found'}</div><a class="btn" href="#/">${t('nav.lobby')}</a></div>`;
};

/* ================= routes ================= */
RT.add(/^\/$/,()=>Views.home());
RT.add(/^\/casino\/?$/,()=>Views.casino('all'));
RT.add(/^\/casino\?.*$/,()=>Views.casino('all'));
RT.add(/^\/casino\/(originals|slots|live|new|popular|favorites)$/,c=>Views.casino(c));
RT.add(/^\/sports$/,()=>Views.sports());
RT.add(/^\/promotions$/,()=>Views.promos());
RT.add(/^\/promo\/([a-z]+)$/,id=>Views.promoDetail(id));
RT.add(/^\/vip$/,()=>Views.vip());
RT.add(/^\/affiliate$/,()=>Views.affiliate());
RT.add(/^\/profile$/,()=>Views.profile('overview'));
RT.add(/^\/profile\/([a-z]+)$/,tb=>Views.profile(tb));
RT.add(/^\/support$/,()=>Views.support());
RT.add(/^\/fairness$/,()=>Views.fairness());
RT.add(/^\/about$/,()=>Views.about());
RT.add(/^\/terms$/,()=>Views.terms());
RT.add(/^\/privacy$/,()=>Views.privacy());
RT.add(/^\/responsible$/,()=>Views.responsible());
RT.add(/^\/aml$/,()=>Views.aml());
