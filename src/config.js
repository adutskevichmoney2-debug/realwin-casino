/* ================= RealWin cloud config =================
   После создания проекта Supabase вставьте сюда:
   SUPABASE_URL  — Project URL (Settings → API)
   SUPABASE_ANON — anon public key (Settings → API)
   Пока поля пустые — сайт работает в демо-режиме (localStorage). */
window.RW_CONFIG = {
  SUPABASE_URL: '',
  SUPABASE_ANON: '',
  EMAIL_MODE: 'link' // 'link' — подтверждение кнопкой в письме (без SMTP); 'code' — 6-значный код (нужен свой SMTP)
};
