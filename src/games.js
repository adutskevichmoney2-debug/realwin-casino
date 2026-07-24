/* ================= RealWin game engines ================= */
const GameCtx={mode:'demo'};
function gMinBet(){return GameCtx.mode==='demo'?1:Math.max(fromUsd(0.1,S.activeCoin),0.00000001)}
function gBal(){return GameCtx.mode==='demo'?DEMO.bal:bal(S.activeCoin)}
function gSym(){return GameCtx.mode==='demo'?'FUN':S.activeCoin}
function gFmt(v){return GameCtx.mode==='demo'?fmtN(v,2)+' FUN':fc(v,S.activeCoin)+' '+S.activeCoin}
function gStake(a){if(GameCtx.mode==='real'&&!me()){openAuth('login');return false}if(!canBet())return false;if(a<=0||a>gBal()){toast('err',t('game.notbal'));return false}if(GameCtx.mode==='demo'){DEMO.bal-=a;return true}return placeStake(a,'real')}
function gPay(a){payOut(a,GameCtx.mode)}
function gRecord(slug,amt,mult,win){recordBet(slug,amt,mult,win,GameCtx.mode);const u=me();if(u&&u.seeds){u.seeds.nonce++;save()}}
function gBalHTML(){return `<span class="badge ${GameCtx.mode==='demo'?'yellow':'green'}" style="font-size:11px">${GameCtx.mode==='demo'?t('misc.demo'):'REAL'}</span><span class="mono js-gbal" style="font-weight:800;font-size:13px">${gFmt(gBal())}</span>`}
function gUpdBal(){const el=$('.js-gbal');if(el)el.textContent=gFmt(gBal())}

function amountHTML(v){return `<div class="betrow"><label>${t('game.amount')}<span class="bv mono js-balhint">${gFmt(gBal())}</span></label>
 <div class="betamt">${coinIcon(GameCtx.mode==='demo'?'USDT':S.activeCoin,18)}<input class="js-amt" type="number" min="0" step="any" value="${v||10}"><button class="bab js-half">½</button><button class="bab js-dbl">2×</button><button class="bab js-maxb">MAX</button></div></div>`}
function bindAmount(root){
 const i=$('.js-amt',root);
 $('.js-half',root).onclick=()=>{i.value=Math.max(0,(parseFloat(i.value)||0)/2).toFixed(2)};
 $('.js-dbl',root).onclick=()=>{i.value=((parseFloat(i.value)||0)*2||gMinBet()).toFixed(2)};
 $('.js-maxb',root).onclick=()=>{i.value=(+gBal().toFixed(6))};
 return ()=>Math.max(0,parseFloat(i.value)||0)}
function modeToggleHTML(){return `<div class="gmodes js-modes" style="margin-bottom:14px"><button data-m="real" class="${GameCtx.mode==='real'?'act':''}">${t('a.real')}</button><button data-m="demo" class="${GameCtx.mode==='demo'?'act':''}">${t('a.demo')}</button></div>`}
function bindMode(root,rerender){
 $$('.js-modes button',root).forEach(b=>b.onclick=()=>{
  if(b.dataset.m==='real'&&!me()){openAuth('login');return}
  GameCtx.mode=b.dataset.m;rerender()})}
function histChip(v,win){return `<span class="hc ${win?'w':'l'}">${v}</span>`}
function pushHist(root,html){const h=$('.js-hist',root);if(!h)return;h.insertAdjacentHTML('afterbegin',html);while(h.children.length>10)h.lastChild.remove()}

/* ---------- shared game page ---------- */
Views.game=function(slug){
 const g=gameBy(slug);if(!g){Views.notFound();return}
 GameCtx.mode=me()?'real':'demo';
 const render=()=>{
  if(RT.cleanup){try{RT.cleanup()}catch(e){}RT.cleanup=null}
  outlet().innerHTML=`
  <div class="crumb"><a href="#/casino">${t('nav.casino')}</a>${ic('chevR',13)}<a href="#/casino/${g.cat}">${t('cat.'+g.cat)}</a>${ic('chevR',13)}<span>${esc(g.name)}</span></div>
  <div class="gwrap">
   <div class="gmain js-gmain">
    <div class="ghead">${g.cat==='originals'?`<span class="ico" style="width:34px;height:34px;border-radius:10px;background:rgba(76,141,255,.13);color:#7FB2FF;display:flex;align-items:center;justify-content:center">${ic('zap',16)}</span>`:''}
     <div><div class="gt">${esc(g.name)}</div><div class="gp">${esc(g.prov)} · ${t('game.rtp')} ${g.rtp}%</div></div>
     <div class="gact">${g.cat==='originals'?gBalHTML():''}
      <button class="hicon js-favg" title="${t('nav.favorites')}" style="color:${favs().includes(slug)?'#F0898D':''}">${ic('heart',17)}</button>
      <button class="hicon js-fs" title="${t('game.fs')}">${ic('max',17)}</button></div></div>
    <div class="gstage js-stage"></div>
   </div>
   <div class="gside js-side"></div>
  </div>
  <section class="sect" style="margin-top:24px"><div class="gdesc">
   <div class="card"><h3 style="font-size:15px;margin-bottom:8px">${t('game.about')}</h3>
    <p style="color:var(--tx2);font-size:13.5px;line-height:1.65">${t(g.cat==='originals'?'game.desc.orig':g.cat==='live'?'game.desc.live':'game.desc.slot',{name:g.name,prov:g.prov,rtp:g.rtp,vol:t('game.vol.'+(g.vol==='low'?'low':g.vol==='high'?'high':'med'))})}</p>
    <div class="ginfo"><span class="chip">${t('game.rtp')}: <b>${g.rtp}%</b></span><span class="chip">${t('game.vol')}: <b>${t('game.vol.'+(g.vol==='low'?'low':g.vol==='high'?'high':'med'))}</b></span><span class="chip">${t('game.provider')}: <b>${esc(g.prov)}</b></span>${g.cat==='originals'?`<a class="chip act" href="#/fairness">${ic('shieldCheck',13)} ${t('game.fair')}</a>`:''}</div></div>
   <div class="card"><h3 style="font-size:15px;margin-bottom:12px">${t('game.similar')}</h3>
    <div class="grow">${GAMES.filter(x=>x.cat===g.cat&&x.slug!==slug).slice(0,6).map(x=>tileHTML(x)).join('')}</div></div>
  </div></section>`;
  bindTiles(outlet());
  $('.js-favg').onclick=e=>{const on=toggleFav(slug);e.currentTarget.style.color=on?'#F0898D':''};
  $('.js-fs').onclick=()=>$('.js-gmain').classList.toggle('fs');
  const stage=$('.js-stage'),side=$('.js-side');
  const eng={dice:engDice,mines:engMines,crash:engCrash,plinko:engPlinko,limbo:engLimbo,coinflip:engFlip}[g.kind]||engProvider;
  eng(stage,side,g,render);
 };
 render();
};
RT.add(/^\/game\/([a-z0-9-]+)$/,s=>Views.game(s));

function sideCard(inner){return `<div class="card">${modeToggleHTML()}${inner}${me()?'':`<div class="note" style="margin-top:12px">${ic('info',15)}<span>${t('game.login.note')}</span></div>`}</div>`}

/* ================= DICE ================= */
function engDice(stage,side,g,rerender){
 let target=50,over=true,rolling=false;
 stage.innerHTML=`<div class="hist js-hist"></div>
  <div class="dice-res"><div class="dice-num js-num">50.00</div></div>
  <div class="dice-slider"><div class="dice-pin js-pin">50</div><input type="range" class="range js-rng" min="2" max="98" value="50">
   <div class="dice-marks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div></div>`;
 side.innerHTML=sideCard(`${amountHTML(10)}
  <div class="betrow"><label>${t('dice.target')}</label><div class="gmodes"><button class="js-under">${t('dice.under')}</button><button class="js-over act">${t('dice.over')}</button></div></div>
  <div class="gstat3"><div class="gs"><div class="l">${t('game.chance')}</div><div class="v js-ch">—</div></div><div class="gs"><div class="l">${t('feed.mult')}</div><div class="v js-mu">—</div></div><div class="gs"><div class="l">${t('game.profitOn')}</div><div class="v js-pr">—</div></div></div>
  <button class="btn green wide lg js-roll">${ic('dice',18)} ${t('dice.roll')}</button>`);
 const getAmt=bindAmount(side);bindMode(side,rerender);
 const rng=$('.js-rng',stage),pin=$('.js-pin',stage);
 function stats(){const ch=over?100-target:target;const mu=99/ch;
  $('.js-ch',side).textContent=ch.toFixed(0)+'%';$('.js-mu',side).textContent=mu.toFixed(4)+'×';
  $('.js-pr',side).textContent=fmtN(getAmt()*(mu-1),2);
  rng.style.setProperty('--fill',((target-2)/96*100)+'%');
  pin.style.left=((target-2)/96*100)+'%';pin.textContent=target}
 rng.oninput=()=>{target=+rng.value;stats()};
 $('.js-amt',side).addEventListener('input',stats);
 $('.js-over',side).onclick=()=>{over=true;$('.js-over',side).classList.add('act');$('.js-under',side).classList.remove('act');stats()};
 $('.js-under',side).onclick=()=>{over=false;$('.js-under',side).classList.add('act');$('.js-over',side).classList.remove('act');stats()};
 stats();
 $('.js-roll',side).onclick=async()=>{
  if(rolling)return;const amt=getAmt();
  if(!gStake(amt))return;rolling=true;gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());
  const numEl=$('.js-num',stage);numEl.className='dice-num js-num';
  const res=+(Math.random()*100).toFixed(2);
  const st=performance.now();
  await new Promise(done=>{(function scr(n){if(n-st>620){done();return}numEl.textContent=(Math.random()*100).toFixed(2);requestAnimationFrame(scr)})(st)});
  const win=over?res>target:res<target;
  const mu=99/(over?100-target:target);
  numEl.textContent=res.toFixed(2);numEl.classList.add(win?'w':'l');
  pushHist(stage,histChip(res.toFixed(2),win));
  if(win){gPay(amt*mu);toast('ok',t('game.win',{a:gFmt(amt*mu)}))}
  gRecord(g.slug,amt,win?mu:0,win);gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());stats();
  rolling=false};
}

/* ================= MINES ================= */
function engMines(stage,side,g,rerender){
 let mines=3,active=false,amt=0,picked=0,mineSet=null,ended=false;
 const gemSVG='<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M6 3h12l4 6-10 13L2 9Z" fill="rgba(49,196,108,.25)" stroke="#5BD98F" stroke-width="1.6"/></svg>';
 const bombSVG='<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="13" r="7" fill="rgba(229,72,77,.3)" stroke="#F0898D" stroke-width="1.6"/><path d="m19.5 4.5-3 3" stroke="#F0898D" stroke-width="1.6" stroke-linecap="round"/></svg>';
 stage.innerHTML=`<div class="mines-next"><span>${t('mines.next')}: <b class="mono js-next">—</b></span><span>${t('mines.total')}: <b class="mono js-tot">—</b></span></div>
  <div class="mines-grid js-grid">${Array.from({length:25},(_,i)=>`<button class="mcell" data-i="${i}" disabled></button>`).join('')}</div>`;
 side.innerHTML=sideCard(`${amountHTML(10)}
  <div class="betrow"><label>${t('mines.mines')}<span class="bv">${t('mines.gems')}: <b class="js-gemn">22</b></span></label>
   <div class="nets" style="margin:0">${[1,3,5,10,15,24].map(n=>`<button class="chip ${n===3?'act':''}" data-n="${n}">${n}</button>`).join('')}</div></div>
  <button class="btn green wide lg js-start">${t('mines.start')}</button>
  <button class="btn wide lg js-cash hide" style="margin-top:10px">${t('a.cashout')} <span class="mono js-cashv"></span></button>`);
 const getAmt=bindAmount(side);bindMode(side,rerender);
 $$('.nets .chip',side).forEach(c=>c.onclick=()=>{if(active)return;mines=+c.dataset.n;$$('.nets .chip',side).forEach(x=>x.classList.toggle('act',x===c));$('.js-gemn',side).textContent=25-mines});
 const cells=$$('.mcell',stage);
 function multAt(k){let m=1;for(let i=0;i<k;i++)m*=(25-i)/(25-mines-i);return m*0.97}
 function updInfo(){$('.js-next',stage).textContent=multAt(picked+1).toFixed(2)+'×';
  const tot=picked>0?amt*multAt(picked):0;
  $('.js-tot',stage).textContent=picked>0?gFmt(tot):'—';
  const cb=$('.js-cash',side);cb.classList.toggle('hide',!(active&&picked>0));
  $('.js-cashv',side).textContent=picked>0?gFmt(tot):''}
 function reset(){active=false;ended=false;picked=0;mineSet=null;
  cells.forEach(c=>{c.className='mcell';c.innerHTML='';c.disabled=true});
  $('.js-start',side).classList.remove('hide');$('.js-cash',side).classList.add('hide');
  $('.js-next',stage).textContent='—';$('.js-tot',stage).textContent='—'}
 $('.js-start',side).onclick=()=>{
  amt=getAmt();if(!gStake(amt))return;gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());
  active=true;picked=0;const idx=[...Array(25).keys()];mineSet=new Set();
  while(mineSet.size<mines){mineSet.add(idx.splice(ri(0,idx.length-1),1)[0])}
  cells.forEach(c=>{c.className='mcell';c.innerHTML='';c.disabled=false});
  $('.js-start',side).classList.add('hide');updInfo()};
 function endRound(win){
  active=false;ended=true;
  cells.forEach((c,i)=>{c.disabled=true;
   if(mineSet.has(i)&&!c.classList.contains('rev')){c.classList.add('rev','boom','dimmed');c.innerHTML=bombSVG}
   else if(!c.classList.contains('rev'))c.classList.add('dimmed')});
  setTimeout(reset,2000)}
 cells.forEach(c=>c.onclick=()=>{
  if(!active||c.classList.contains('rev'))return;
  const i=+c.dataset.i;c.classList.add('rev');c.disabled=true;
  if(mineSet.has(i)){c.classList.add('boom');c.innerHTML=bombSVG;
   toast('err',t('mines.boom'));gRecord(g.slug,amt,0,false);gUpdBal();endRound(false)}
  else{c.classList.add('gem');c.innerHTML=gemSVG;picked++;updInfo();
   if(picked===25-mines){doCash()}}});
 function doCash(){const mu=multAt(picked);const pay=amt*mu;gPay(pay);gRecord(g.slug,amt,mu,true);
  toast('ok',t('game.win',{a:gFmt(pay)}));gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());endRound(true)}
 $('.js-cash',side).onclick=()=>{if(active&&picked>0)doCash()};
 RT.cleanup=()=>{};
}

/* ================= CRASH ================= */
function engCrash(stage,side,g,rerender){
 stage.innerHTML=`<div class="crash-top"><div class="crash-mult idle js-cm">1.00×</div><div class="badge blue js-phase"></div></div>
  <canvas class="crash-cv js-cv"></canvas><div class="hist js-hist"></div>`;
 side.innerHTML=sideCard(`${amountHTML(10)}
  <button class="btn green wide lg js-bet">${t('a.bet')}</button>
  <button class="btn wide lg js-cash hide" style="margin-top:10px">${t('a.cashout')} <span class="mono js-cv2"></span></button>
  <div class="dd-h" style="padding:14px 2px 8px">${t('crash.players')}</div><div class="crash-players js-pl"></div>`);
 const getAmt=bindAmount(side);bindMode(side,rerender);
 const cv=$('.js-cv',stage),ctx=cv.getContext('2d');
 function sizeCV(){const r=cv.getBoundingClientRect();cv.width=r.width*devicePixelRatio;cv.height=r.height*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
 sizeCV();
 let phase='bet',phaseEnd=Date.now()+5000,bust=0,mult=1,myBet=0,myOut=false,queued=0,players=[],raf,alive=true;
 const cmEl=$('.js-cm',stage),phEl=$('.js-phase',stage),betBtn=$('.js-bet',side),cashBtn=$('.js-cash',side);
 function newPlayers(){players=Array.from({length:ri(6,9)},()=>({n:pick(FEED_NAMES)+ri(10,99),bet:pick([5,10,25,50,100,200])*rnd(.8,1.3),at:Math.random()<.25?99999:1.05+Math.pow(Math.random(),2.2)*8,out:false}))}
 function renderPl(){$('.js-pl',side).innerHTML=[...(myBet>0?[{n:t('promo.race.you'),bet:myBet,at:0,out:myOut,me:true}]:[]),...players].map(p=>`<div class="cpl ${p.out?'out':''} ${p.me?'me':''}"><span>${esc(p.n)}</span><span class="cm">${p.out?(p.me?'':'')+(p.outAt||mult).toFixed(2)+'× ':''}${fmtN(p.bet,0)}</span></div>`).join('')}
 function nextBust(){const u=Math.random();return Math.max(1,Math.min(500,0.99/(1-u)))}
 function startFly(){phase='fly';bust=nextBust();phaseEnd=Date.now();mult=1;
  if(queued>0){myBet=queued;queued=0;myOut=false}
  betBtn.disabled=myBet>0;renderPl()}
 function endFly(){phase='boom';phaseEnd=Date.now()+2300;
  pushHist(stage,`<span class="hc ${bust>=2?'w':'l'}">${bust.toFixed(2)}×</span>`);
  if(myBet>0&&!myOut){gRecord(g.slug,myBet,0,false)}
  myBet=0;myOut=false;cashBtn.classList.add('hide');betBtn.disabled=false;
  setTimeout(()=>{if(!alive)return;phase='bet';phaseEnd=Date.now()+6000;newPlayers();renderPl()},2300)}
 newPlayers();renderPl();
 betBtn.onclick=()=>{
  const a=getAmt();if(!gStake(a))return;gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());
  if(phase==='bet'){myBet=a;myOut=false;betBtn.disabled=true;toast('ok',t('game.betplaced'))}
  else{queued=a;toast('info',t('crash.betqueued'))}
  renderPl()};
 cashBtn.onclick=()=>{
  if(phase!=='fly'||myBet<=0||myOut)return;
  myOut=true;const pay=myBet*mult;gPay(pay);gRecord(g.slug,myBet,mult,true);
  toast('ok',t('crash.youwon',{m:mult.toFixed(2)}));gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());
  cashBtn.classList.add('hide');renderPl()};
 function draw(){
  const w=cv.getBoundingClientRect().width,h=cv.getBoundingClientRect().height;
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle='rgba(140,170,230,.08)';ctx.lineWidth=1;
  for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(0,h*i/5);ctx.lineTo(w,h*i/5);ctx.stroke()}
  if(phase!=='bet'){
   const tNow=(Date.now()-phaseEnd)/1000;
   const tMax=Math.max(5,tNow),mMax=Math.max(2,mult*1.12);
   ctx.beginPath();ctx.lineWidth=3;
   const grad=ctx.createLinearGradient(0,h,w,0);grad.addColorStop(0,'#2E6BFF');grad.addColorStop(1,phase==='boom'?'#E5484D':'#8AB4FF');
   ctx.strokeStyle=grad;
   const steps=70;
   for(let i=0;i<=steps;i++){const tt=tNow*i/steps;const mm=Math.exp(0.1386*tt);
    const x=(tt/tMax)*(w-30)+10;const y=h-14-((mm-1)/(mMax-1))*(h-40);
    i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
   ctx.stroke();
   const xe=(tNow/tMax)*(w-30)+10,ye=h-14-((mult-1)/(mMax-1))*(h-40);
   ctx.beginPath();ctx.fillStyle=phase==='boom'?'#E5484D':'#8AB4FF';ctx.arc(xe,ye,5,0,7);ctx.fill();
  }}
 function loop(){
  if(!alive)return;
  if(phase==='bet'){
   const left=Math.max(0,(phaseEnd-Date.now())/1000);
   cmEl.className='crash-mult idle js-cm';cmEl.textContent=left.toFixed(1)+'s';
   phEl.textContent=t('crash.next');
   if(left<=0)startFly()}
  else if(phase==='fly'){
   const tt=(Date.now()-phaseEnd)/1000;mult=Math.exp(0.1386*tt);
   players.forEach(p=>{if(!p.out&&mult>=p.at){p.out=true;p.outAt=p.at;renderPl()}});
   if(myBet>0&&!myOut){cashBtn.classList.remove('hide');$('.js-cv2',side).textContent=gFmt(myBet*mult)}
   cmEl.className='crash-mult fly js-cm';cmEl.textContent=mult.toFixed(2)+'×';
   phEl.textContent=t('crash.flying');
   if(mult>=bust){mult=bust;endFly()}}
  else{cmEl.className='crash-mult boom js-cm';cmEl.textContent=bust.toFixed(2)+'×';phEl.textContent=t('crash.crashed')}
  draw();raf=requestAnimationFrame(loop)}
 loop();
 const onRes=()=>sizeCV();window.addEventListener('resize',onRes);
 RT.cleanup=()=>{alive=false;cancelAnimationFrame(raf);window.removeEventListener('resize',onRes)};
}

/* ================= PLINKO ================= */
const PLINKO_T={
 8:{low:[5.6,2.1,1.1,1,0.5,1,1.1,2.1,5.6],med:[13,3,1.3,0.7,0.4,0.7,1.3,3,13],high:[29,4,1.5,0.3,0.2,0.3,1.5,4,29]},
 12:{low:[10,3,1.6,1.4,1.1,1,0.5,1,1.1,1.4,1.6,3,10],med:[24,6,2.2,1.3,0.7,0.4,0.2,0.4,0.7,1.3,2.2,6,24],high:[58,8,3,1.4,0.5,0.3,0.2,0.3,0.5,1.4,3,8,58]},
 16:{low:[16,9,2,1.4,1.3,1.2,1.1,1,0.5,1,1.1,1.2,1.3,1.4,2,9,16],med:[110,41,10,5,3,1.5,1,0.5,0.3,0.5,1,1.5,3,5,10,41,110],high:[1000,130,26,9,4,2,0.2,0.2,0.2,0.2,0.2,2,4,9,26,130,1000]}};
function engPlinko(stage,side,g,rerender){
 let rows=12,risk='med',balls=[],alive=true,raf;
 stage.innerHTML=`<canvas class="plinko-cv js-cv"></canvas><div class="pl-buckets js-bk"></div>`;
 side.innerHTML=sideCard(`${amountHTML(10)}
  <div class="betrow"><label>${t('plinko.risk')}</label><div class="nets" style="margin:0">${['low','med','high'].map(r=>`<button class="chip ${r==='med'?'act':''}" data-r="${r}">${t('plinko.'+(r==='med'?'med':r))}</button>`).join('')}</div></div>
  <div class="betrow"><label>${t('plinko.rows')}</label><div class="nets" style="margin:0">${[8,12,16].map(n=>`<button class="chip ${n===12?'act':''}" data-n="${n}">${n}</button>`).join('')}</div></div>
  <button class="btn green wide lg js-drop">${t('plinko.drop')}</button>`);
 const getAmt=bindAmount(side);bindMode(side,rerender);
 const cv=$('.js-cv',stage),ctx=cv.getContext('2d');
 let W=0,H=0;
 function sizeCV(){const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*devicePixelRatio;cv.height=H*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
 sizeCV();
 function pegXY(r,i){const sx=Math.min(W/(rows+2),(H-50)/(rows));const yTop=26;const x=W/2+(i-r/2)*sx;const y=yTop+r*((H-56)/rows);return[x,y,sx]}
 function renderBuckets(hit){
  const tbl=PLINKO_T[rows][risk];
  $('.js-bk',stage).innerHTML=tbl.map((m,i)=>`<span class="pl-b ${i===hit?'hit':''}">${m}×</span>`).join('')}
 renderBuckets();
 function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(160,190,255,.5)';
  for(let r=2;r<rows+2;r++){for(let i=0;i<=r;i++){const[x,y]=pegXY(r,i);ctx.beginPath();ctx.arc(x,y,2.4,0,7);ctx.fill()}}
  balls.forEach(b=>{ctx.beginPath();const gr=ctx.createRadialGradient(b.x-2,b.y-2,1,b.x,b.y,7);gr.addColorStop(0,'#9CC1FF');gr.addColorStop(1,'#2E6BFF');ctx.fillStyle=gr;ctx.arc(b.x,b.y,7,0,7);ctx.fill()})}
 function loop(ts){
  if(!alive)return;
  balls.forEach(b=>{
   if(b.done)return;
   const el=(ts-b.t0)/b.stepMs;const step=Math.floor(el);const frac=el-step;
   if(step>=b.path.length){b.done=true;
    const idx=b.path.reduce((a,v)=>a+v,0);
    const tbl=PLINKO_T[rows][risk];const mu=tbl[idx];
    const pay=b.amt*mu;if(pay>0)gPay(pay);
    gRecord(g.slug,b.amt,mu,mu>=1);gUpdBal();const bh=$('.js-balhint',side);if(bh)bh.textContent=gFmt(gBal());
    renderBuckets(idx);if(mu>=2)toast('ok',t('game.win',{a:gFmt(pay)}));
    setTimeout(()=>{const el2=$$('.pl-b',stage)[idx];if(el2)el2.classList.remove('hit')},700);
    return}
   const r=step+2;const sum=b.path.slice(0,step).reduce((a,v)=>a+v,0);
   const[x1,y1]=pegXY(r,sum+1);
   const nsum=sum+b.path[step];
   const[x2,y2]=pegXY(r+1,nsum+1);
   const e=frac<.5?2*frac*frac:1-Math.pow(-2*frac+2,2)/2;
   b.x=x1+(x2-x1)*e;b.y=y1+(y2-y1)*frac-Math.sin(frac*Math.PI)*7});
  balls=balls.filter(b=>!b.done);
  draw();raf=requestAnimationFrame(loop)}
 raf=requestAnimationFrame(loop);
 $$('.nets [data-r]',side).forEach(c=>c.onclick=()=>{risk=c.dataset.r;$$('.nets [data-r]',side).forEach(x=>x.classList.toggle('act',x===c));renderBuckets()});
 $$('.nets [data-n]',side).forEach(c=>c.onclick=()=>{rows=+c.dataset.n;$$('.nets [data-n]',side).forEach(x=>x.classList.toggle('act',x===c));balls=[];renderBuckets()});
 $('.js-drop',side).onclick=()=>{
  if(balls.length>=5)return;
  const amt=getAmt();if(!gStake(amt))return;gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());
  const path=Array.from({length:rows},()=>Math.random()<.5?0:1);
  const[x0,y0]=pegXY(2,1);
  balls.push({amt,path,t0:performance.now(),stepMs:matchMedia('(max-width:820px)').matches?150:135,x:x0,y:y0-18,done:false})};
 const onRes=()=>{sizeCV()};window.addEventListener('resize',onRes);
 RT.cleanup=()=>{alive=false;cancelAnimationFrame(raf);window.removeEventListener('resize',onRes)};
}

/* ================= LIMBO ================= */
function engLimbo(stage,side,g,rerender){
 let busy=false;
 stage.innerHTML=`<div class="hist js-hist"></div><div class="limbo-res"><div class="limbo-num js-num">1.00×</div><div class="dim" style="font-weight:700;font-size:12.5px">${t('limbo.target')}</div></div>`;
 side.innerHTML=sideCard(`${amountHTML(10)}
  <div class="betrow"><label>${t('limbo.target')}</label><div class="betamt"><input class="js-tgt" type="number" min="1.01" max="1000000" step="0.01" value="2.00"><span style="font-weight:800;color:var(--tx2)">×</span></div></div>
  <div class="gstat3" style="grid-template-columns:1fr 1fr"><div class="gs"><div class="l">${t('game.chance')}</div><div class="v js-ch">49.50%</div></div><div class="gs"><div class="l">${t('game.profitOn')}</div><div class="v js-pr">—</div></div></div>
  <button class="btn green wide lg js-go">${t('limbo.betbtn')}</button>`);
 const getAmt=bindAmount(side);bindMode(side,rerender);
 const tgtI=$('.js-tgt',side);
 function stats(){const tg=Math.max(1.01,parseFloat(tgtI.value)||2);
  $('.js-ch',side).textContent=(99/tg).toFixed(2)+'%';$('.js-pr',side).textContent=fmtN(getAmt()*(tg-1),2)}
 tgtI.oninput=stats;$('.js-amt',side).addEventListener('input',stats);stats();
 $('.js-go',side).onclick=async()=>{
  if(busy)return;const amt=getAmt();const tg=Math.max(1.01,parseFloat(tgtI.value)||2);
  if(!gStake(amt))return;busy=true;gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());
  const u=Math.random();const res=Math.min(1e6,Math.max(1,0.99/(1-u)));
  const el=$('.js-num',stage);el.className='limbo-num js-num';
  const st=performance.now(),dur=700;
  await new Promise(done=>{(function an(n){const p=clamp((n-st)/dur,0,1);const e=1-Math.pow(1-p,3);
   el.textContent=(1+(res-1)*e).toFixed(2)+'×';p<1?requestAnimationFrame(an):done()})(st)});
  const win=res>=tg;el.classList.add(win?'w':'l');
  pushHist(stage,histChip(res.toFixed(2)+'×',win));
  if(win){gPay(amt*tg);toast('ok',t('game.win',{a:gFmt(amt*tg)}))}
  gRecord(g.slug,amt,win?tg:0,win);gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());stats();busy=false};
}

/* ================= COINFLIP ================= */
function engFlip(stage,side,g,rerender){
 let sidePick='heads',busy=false;
 stage.innerHTML=`<div class="hist js-hist"></div><div class="coin-scene"><div class="coin3 js-coin"><div class="cf heads">R</div><div class="cf tails">W</div></div></div>`;
 side.innerHTML=sideCard(`${amountHTML(10)}
  <div class="betrow"><label>${t('flip.pick')}</label><div class="gmodes"><button class="js-h act" style="color:#8AB4FF">● ${t('flip.heads')}</button><button class="js-t">● ${t('flip.tails')}</button></div></div>
  <div class="gstat3" style="grid-template-columns:1fr 1fr"><div class="gs"><div class="l">${t('feed.mult')}</div><div class="v">1.98×</div></div><div class="gs"><div class="l">${t('game.chance')}</div><div class="v">50%</div></div></div>
  <button class="btn green wide lg js-flip">${t('flip.flip')}</button>`);
 const getAmt=bindAmount(side);bindMode(side,rerender);
 let rot=0;
 $('.js-h',side).onclick=()=>{sidePick='heads';$('.js-h',side).classList.add('act');$('.js-t',side).classList.remove('act')};
 $('.js-t',side).onclick=()=>{sidePick='tails';$('.js-t',side).classList.add('act');$('.js-h',side).classList.remove('act')};
 $('.js-flip',side).onclick=()=>{
  if(busy)return;const amt=getAmt();if(!gStake(amt))return;busy=true;gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());
  const res=Math.random()<.5?'heads':'tails';
  const coin=$('.js-coin',stage);
  rot+=1800+(res==='tails'?180:0)-(rot%360);
  coin.style.transform=`rotateY(${rot}deg)`;
  setTimeout(()=>{
   const win=res===sidePick;
   pushHist(stage,histChip(res==='heads'?'R':'W',win));
   if(win){gPay(amt*1.98);toast('ok',t('game.win',{a:gFmt(amt*1.98)}))}
   gRecord(g.slug,amt,win?1.98:0,win);gUpdBal();$('.js-balhint',side).textContent=gFmt(gBal());busy=false},1200)};
}

/* ================= PROVIDER GAME PAGE ================= */
function engProvider(stage,side,g){
 const img=IMG[g.slug];
 stage.classList.add('pv-stage');
 stage.innerHTML=`<div class="pv-bg" style="background-image:url('${img||''}')"></div>
  <div class="pv-c">
   ${img?`<img class="pv-art" src="${img}" alt="${esc(g.name)}">`:`<div class="pv-art pv-fb"><span>${esc(g.name[0])}</span></div>`}
   <h2>${esc(g.name)}</h2>
   <div class="dim" style="font-weight:700;font-size:12.5px">${esc(g.prov)} · ${t('game.rtp')} ${g.rtp}%</div>
   <button class="btn lg js-pvopen" style="margin-top:8px">${ic('play',18)} ${t('pv.open')}</button>
  </div>`;
 side.innerHTML=`<div class="card"><div class="dd-h" style="padding:0 0 10px;display:flex;align-items:center;gap:7px">${ic('zap',14)} ${t('pv.playable')}</div>
  <div class="grow">${GAMES.filter(x=>x.cat==='originals').slice(0,4).map(x=>tileHTML(x)).join('')}</div>
  <div class="note" style="margin-top:14px">${ic('info',15)}<span>${t('pv.note.b',{name:esc(g.name),prov:esc(g.prov)})}</span></div></div>`;
 bindTiles(side);
 $('.js-pvopen',stage).onclick=()=>{
  const m=openModal(`<div class="m-body" style="text-align:center;padding:32px">
   <div style="display:flex;justify-content:center;margin-bottom:16px"><span style="width:58px;height:58px;border-radius:17px;background:rgba(76,141,255,.13);color:#7FB2FF;display:flex;align-items:center;justify-content:center">${ic('spade',26)}</span></div>
   <div class="m-title">${t('pv.note.t')}</div>
   <p style="color:var(--tx2);font-size:13.5px;line-height:1.65;margin:8px 0 22px">${t('pv.note.b',{name:esc(g.name),prov:esc(g.prov)})}</p>
   <div style="display:flex;gap:10px"><a class="btn wide js-go" href="#/casino/originals">${t('nav.originals')}</a><button class="btn soft wide js-cl">${t('a.close')}</button></div></div>`);
  $('.js-cl',m.el).onclick=m.close;
  $('.js-go',m.el).addEventListener('click',()=>m.close());
 };
}
