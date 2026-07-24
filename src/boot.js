/* ================= RealWin boot ================= */
loadS();
document.documentElement.lang=S.lang;

/* finalize stale pending withdrawals & kyc after reload */
(function(){
 let ch=false;
 Object.values(S.accounts).forEach(u=>{
  (u.txs||[]).forEach(x=>{if(x.status==='pending'&&x.doneAt&&Date.now()>x.doneAt){x.status='done';ch=true}});
  if(u.verif&&u.verif.status==='pending'&&Date.now()>u.verif.until){u.verif.status='ok';ch=true}
  if(u.seeds&&!u.seeds.serverHash){sha256hex(uid()+uid()).then(h=>{u.seeds.server=h;return sha256hex(h)}).then(hh=>{u.seeds.serverHash=hh;save()})}
 });
 if(ch)save();
})();

UI.renderShell();
if(!location.hash)history.replaceState(null,'','#/');
renderRoute();
window.addEventListener('hashchange',renderRoute);

/* global ticks */
setInterval(onlineTick,5000);
setInterval(settleSbets,5000);
setTimeout(settleSbets,1500);
window.addEventListener('resize',()=>{const b=$('.js-burger');if(b)b.style.display=matchMedia('(max-width:1024px)').matches?'flex':'none'});

/* preloader */
(function(){
 const pre=$('#pre'),app=$('#app');
 const seen=sstore.getItem('rw_seen');
 const minT=seen?900:2050;
 const t0=performance.now();
 function done(){
  const wait=Math.max(0,minT-(performance.now()-t0));
  setTimeout(()=>{
   pre.classList.add('done');app.classList.add('on');
   sstore.setItem('rw_seen','1');
   setTimeout(()=>pre.remove(),700);
   observeRv();
  },wait);
 }
 if(document.readyState==='complete')done();
 else window.addEventListener('load',done,{once:true});
 setTimeout(done,4000);
})();

/* cloud session restore */
if(window.CLOUD){
 const acc=S.sessionEmail?S.accounts[S.sessionEmail]:null;
 if(acc&&acc.cloud){S.sessionEmail=null;UI.renderShell()}
 CLOUD.restore().then(ok=>{if(ok){UI.renderShell();renderRoute()}});
}
