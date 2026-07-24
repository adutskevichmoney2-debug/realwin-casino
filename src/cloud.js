/* ================= RealWin cloud layer (Supabase) ================= */
window.CLOUD = null;
(function(){
 const cfg = window.RW_CONFIG || {};
 if(!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON || !window.supabase) return;
 const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON, {auth:{persistSession:true,autoRefreshToken:true}});
 const COIN_LIST = COINS.map(c=>c.s);
 let dirtyT = null;

 function mapTx(r){return {id:'TX'+r.id, ts:Date.parse(r.created_at), status:r.status, type:r.type, coin:r.coin, amount:+r.amount, meta:r.meta||''}}
 function errMsg(e){
  const m = (e && (e.message||e.error_description||e.msg)) || String(e);
  const M = {
   'Invalid login credentials': t('auth.err.creds'),
   'Email not confirmed': t('cl.notconfirmed'),
   'User already registered': t('auth.err.exists'),
   'invalid_code': t('promo.code.bad'), 'already_used': t('promo.code.bad'),
   'banned': t('cl.banned'),
   'pid_taken': t('adm.pid.taken'), 'bad_pid': t('adm.pid.bad'),
   'over_email_send_rate_limit': t('cl.ratelimit'),
   'email rate limit exceeded': t('cl.ratelimit')
  };
  for(const k in M) if(m.toLowerCase().includes(k.toLowerCase())) return M[k];
  if(m.includes('Token has expired') || m.includes('invalid')) return t('otp.bad');
  return m.length>140 ? t('cl.err') : m;
 }

 async function loadUser(authUser){
  const uid = authUser.id;
  const [pr, wl, tx, bt, fv] = await Promise.all([
   sb.from('profiles').select('*').eq('id', uid).single(),
   sb.from('wallets').select('coin,balance').eq('user_id', uid),
   sb.from('transactions').select('*').eq('user_id', uid).order('created_at',{ascending:false}).limit(120),
   sb.from('bets').select('*').eq('user_id', uid).order('created_at',{ascending:false}).limit(120),
   sb.from('favorites').select('slug').eq('user_id', uid)
  ]);
  if(pr.error || !pr.data){ console.warn('profile load', pr.error); return false }
  const p = pr.data;
  if(p.banned){ await sb.auth.signOut(); toast('err', t('cl.banned')); return false }
  const prev = S.accounts[p.email]; /* сохранённый локально аккаунт: не теряем аватарку при пересоздании */
  const balances = DEF_BAL();
  (wl.data||[]).forEach(w=>{ if(w.coin in balances) balances[w.coin] = +w.balance });
  const u = {
   email: p.email, name: p.username, pass: '', created: Date.parse(p.created_at),
   hue: p.avatar_hue||210, cloud: true, id: uid, role: p.role, pid: p.pid||null,
   balances, txs: (tx.data||[]).map(mapTx),
   bets: (bt.data||[]).filter(b=>b.kind==='casino').map(b=>({id:'B'+b.id, g:b.game, ts:Date.parse(b.created_at), amt:+b.stake, sym:b.coin, mult:+b.mult, win:+b.payout>0, payout:+b.payout})),
   sbets: (bt.data||[]).filter(b=>b.kind==='sport').map(b=>({id:'S'+b.id, cloudId:b.id, ts:Date.parse(b.created_at), sym:b.coin, stake:+b.stake, odds:+b.mult, legs:(b.meta&&b.meta.legs)||[], label:(b.meta&&b.meta.label)||'Sports', status:b.status==='open'?'open':(b.status==='won'?'won':'lost'), settleAt:(b.meta&&b.meta.settleAt)||0})),
   notifs: [], favs: (fv.data||[]).map(f=>f.slug), claimed: (p.settings&&p.settings.claimed)||{},
   wagered: +p.wagered, rakeAvail: (p.settings&&+p.settings.rakeAvail)||0, pnl: +p.pnl,
   verif: (p.settings&&p.settings.verif)||{status:'none',until:0},
   twoFA: false, privacy: !!(p.settings&&p.settings.privacy),
   limits: (p.settings&&p.settings.limits)||{dep:0,loss:0,coolUntil:0},
   lossToday:0, depToday:0, avatar: (prev && prev.avatar) || undefined,
   seeds: (p.settings&&p.settings.seeds)||{client:uid.slice(0,16), serverHash:'', server:'', nonce:0}
  };
  S.accounts[u.email] = u; S.sessionEmail = u.email; save();
  logDevice();
  return true;
 }

 function profilePayload(u){
  return { wagered: +(u.wagered||0).toFixed(2), pnl: +(u.pnl||0).toFixed(2),
   settings: { claimed:u.claimed||{}, rakeAvail:+(u.rakeAvail||0).toFixed(4), verif:u.verif, privacy:!!u.privacy, limits:u.limits, seeds:u.seeds } };
 }

 async function deviceFingerprint(){
  const parts=[navigator.userAgent,navigator.platform||'',screen.width+'x'+screen.height+'x'+screen.colorDepth,
   Intl.DateTimeFormat().resolvedOptions().timeZone||'',navigator.language||'',navigator.hardwareConcurrency||'',navigator.deviceMemory||''].join('|');
  const h=await sha256hex(parts); return h.slice(0,32);
 }
 async function logDevice(){
  try{
   const fp=await deviceFingerprint();
   let ip=null;
   try{const c=new AbortController();setTimeout(()=>c.abort(),4000);
    const r=await fetch('https://api.ipify.org?format=json',{signal:c.signal});ip=(await r.json()).ip}catch(e){}
   await sb.rpc('log_device',{p_fp:fp,p_ua:navigator.userAgent,p_platform:navigator.platform||'',p_screen:screen.width+'x'+screen.height,p_tz:Intl.DateTimeFormat().resolvedOptions().timeZone||'',p_lang:navigator.language||'',p_ip:ip});
  }catch(e){console.warn('device log',e)}
 }
 window.CLOUD = {
  sb, on: true, emailMode: (cfg.EMAIL_MODE==='code'?'code':'link'),
  pollSession(cb){
   let stopped=false;
   const iv=setInterval(async()=>{
    if(stopped)return;
    const {data:{session}}=await sb.auth.getSession();
    if(session){const u=me();if(!u||!u.cloud){const ok=await loadUser(session.user);if(ok){stopped=true;clearInterval(iv);cb(true)}}else{stopped=true;clearInterval(iv);cb(true)}}
   },3000);
   setTimeout(()=>{stopped=true;clearInterval(iv)},900000);
   return ()=>{stopped=true;clearInterval(iv)};
  },
  async restore(){
   try{
    const {data:{session}} = await sb.auth.getSession();
    if(!session) return false;
    return await loadUser(session.user);
   }catch(e){ console.warn('restore', e); return false }
  },
  async register(email, username, pass){
   const {data, error} = await sb.auth.signUp({email, password: pass, options:{data:{username}}});
   if(error) return {error: errMsg(error)};
   if(data.session){ await loadUser(data.session.user); return {ok:true} }
   return {verify:'signup'};
  },
  async login(email, pass){
   const {data, error} = await sb.auth.signInWithPassword({email, password: pass});
   if(error){
    if((error.message||'').toLowerCase().includes('not confirmed')){
     await sb.auth.resend({type:'signup', email}).catch(()=>{});
     return {verify:'signup'};
    }
    return {error: errMsg(error)};
   }
   const ok = await loadUser(data.user);
   return ok ? {ok:true} : {error: t('cl.err')};
  },
  async otpLogin(email){
   const {error} = await sb.auth.signInWithOtp({email, options:{shouldCreateUser:false}});
   if(error) return {error: errMsg(error)};
   return {verify:'email'};
  },
  async verify(email, token, type){
   const {data, error} = await sb.auth.verifyOtp({email, token, type: type==='email'?'email':'signup'});
   if(error || !data.session) return {error: errMsg(error||'invalid')};
   const ok = await loadUser(data.session.user);
   return ok ? {ok:true} : {error: t('cl.err')};
  },
  async resend(email, type){
   const {error} = type==='email'
    ? await sb.auth.signInWithOtp({email, options:{shouldCreateUser:false}})
    : await sb.auth.resend({type:'signup', email});
   return error ? {error: errMsg(error)} : {ok:true};
  },
  async logout(){ try{ await sb.auth.signOut() }catch(e){} },
  async changePass(pass){
   const {error} = await sb.auth.updateUser({password: pass});
   return error ? {error: errMsg(error)} : {ok:true};
  },
  /* --- sync --- */
  tx(o){
   const u = me(); if(!u || !u.cloud) return;
   sb.rpc('apply_tx', {p_coin:o.coin, p_amount:o.amount, p_type:o.type, p_meta:(o.meta==null?null:String(o.meta))})
    .then(({error})=>{ if(error){ console.warn('tx sync', error.message); CLOUD.resync() } });
  },
  bet(g, amt, sym, mult, win){
   const u = me(); if(!u || !u.cloud) return;
   sb.from('bets').insert({user_id:u.id, kind:'casino', game:g, coin:sym, stake:amt, mult:win?mult:0, payout:win?amt*mult:0}).then(()=>{});
  },
  sbetPlace(sbet){
   const u = me(); if(!u || !u.cloud) return;
   sb.from('bets').insert({user_id:u.id, kind:'sport', game:'sports', coin:sbet.sym, stake:sbet.stake, mult:sbet.odds, payout:0, status:'open', meta:{legs:sbet.legs, label:sbet.label, settleAt:sbet.settleAt}})
    .select('id').single().then(({data})=>{ if(data) sbet.cloudId = data.id; save() });
  },
  sbetSettle(sbet){
   const u = me(); if(!u || !u.cloud || !sbet.cloudId) return;
   sb.from('bets').update({status: sbet.status, payout: sbet.status==='won'? sbet.stake*sbet.odds : 0}).eq('id', sbet.cloudId).then(()=>{});
  },
  fav(slug, on){
   const u = me(); if(!u || !u.cloud) return;
   (on ? sb.from('favorites').insert({user_id:u.id, slug}) : sb.from('favorites').delete().eq('user_id',u.id).eq('slug',slug)).then(()=>{});
  },
  profileDirty(){
   const u = me(); if(!u || !u.cloud) return;
   clearTimeout(dirtyT);
   dirtyT = setTimeout(()=>{ sb.from('profiles').update(profilePayload(u)).eq('id', u.id).then(()=>{}) }, 2500);
  },
  async redeem(code){
   const {data, error} = await sb.rpc('redeem_promo', {p_code: code});
   if(error) return {error: errMsg(error)};
   return {ok:true, amount:+data};
  },
  async resync(){
   const u = me(); if(!u || !u.cloud) return;
   const {data} = await sb.from('wallets').select('coin,balance').eq('user_id', u.id);
   if(data){ data.forEach(w=>{ if(w.coin in u.balances) u.balances[w.coin]=+w.balance }); save(); UI.balance() }
  },
  /* --- support tickets --- */
  async myTickets(){
   const {data, error} = await sb.from('support_tickets').select('*').order('updated_at',{ascending:false}).limit(50);
   return error ? [] : data;
  },
  async ticketMsgs(id){
   const {data} = await sb.from('ticket_messages').select('*').eq('ticket_id', id).order('created_at');
   return data || [];
  },
  async createTicket(subject, body){
   const u = me(); if(!u) return {error:'auth'};
   const {data, error} = await sb.from('support_tickets').insert({user_id:u.id, subject}).select('id').single();
   if(error) return {error: errMsg(error)};
   await sb.from('ticket_messages').insert({ticket_id:data.id, author_id:u.id, staff:false, body});
   return {ok:true, id:data.id};
  },
  async replyTicket(id, body, staff){
   const u = me(); if(!u) return {error:'auth'};
   const {error} = await sb.from('ticket_messages').insert({ticket_id:id, author_id:u.id, staff:!!staff, body});
   if(error) return {error: errMsg(error)};
   await sb.from('support_tickets').update({status: staff?'answered':'open', updated_at: new Date().toISOString()}).eq('id', id);
   return {ok:true};
  },
  /* --- admin --- */
  isStaff(){ const u = me(); return !!(u && u.cloud && (u.role==='admin' || u.role==='moderator')) },
  async adminUsers(){
   const [pr, wl] = await Promise.all([
    sb.from('profiles').select('*').order('created_at',{ascending:false}).limit(300),
    sb.from('wallets').select('user_id,coin,balance')
   ]);
   const usd = {};
   (wl.data||[]).forEach(w=>{ usd[w.user_id]=(usd[w.user_id]||0) + (+w.balance)*(RATES[w.coin]||0) });
   return (pr.data||[]).map(p=>({...p, usd: usd[p.id]||0}));
  },
  async adminAdjust(user_id, coin, amount, note){
   const {error} = await sb.rpc('admin_adjust', {p_user:user_id, p_coin:coin, p_amount:amount, p_note:note||null});
   return error ? {error: errMsg(error)} : {ok:true};
  },
  async adminBan(user_id, banned){
   const {error} = await sb.rpc('admin_set_ban', {p_user:user_id, p_banned:banned});
   return error ? {error: errMsg(error)} : {ok:true};
  },
  async adminTickets(){
   const {data} = await sb.from('support_tickets').select('*, profiles(username,email)').order('updated_at',{ascending:false}).limit(100);
   return data || [];
  },
  async adminDevices(){
   const {data}=await sb.from('devices').select('*, profiles(username,email)').order('last_seen',{ascending:false}).limit(500);
   return data||[];
  },
  async adminSetPid(user_id, pid){
   const {error} = await sb.rpc('admin_set_pid', {p_user:user_id, p_pid:pid});
   return error ? {error: errMsg(error)} : {ok:true};
  },
  async adminUserCard(uid){
   const [pr,wl,tx,bt,dv,tk]=await Promise.all([
    sb.from('profiles').select('*').eq('id',uid).single(),
    sb.from('wallets').select('coin,balance').eq('user_id',uid),
    sb.from('transactions').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(250),
    sb.from('bets').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(120),
    sb.from('devices').select('*').eq('user_id',uid).order('last_seen',{ascending:false}).limit(20),
    sb.from('support_tickets').select('*').eq('user_id',uid).order('updated_at',{ascending:false}).limit(20)
   ]);
   return {p:pr.data||null, wl:wl.data||[], tx:tx.data||[], bets:bt.data||[], devices:dv.data||[], tickets:tk.data||[]};
  },
  async adminTx(){
   const {data} = await sb.from('transactions').select('*, profiles(username)').order('created_at',{ascending:false}).limit(200);
   return data || [];
  }
 };
 let loadingUser=false;
 sb.auth.onAuthStateChange((ev, session)=>{
  if(ev!=='SIGNED_IN' || !session) return;
  const u = me();
  if(u && u.cloud && u.id===session.user.id) return;
  if(loadingUser) return;
  loadingUser=true;
  loadUser(session.user).then(ok=>{ loadingUser=false; if(ok){ UI.renderShell(); renderRoute() } });
 });
})();
