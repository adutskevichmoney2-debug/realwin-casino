/* ================= RealWin cloud config =================
   После создания проекта Supabase вставьте сюда:
   SUPABASE_URL  — Project URL (Settings → API)
   SUPABASE_ANON — anon public key (Settings → API)
   Пока поля пустые — сайт работает в демо-режиме (localStorage). */
window.RW_CONFIG = {
  SUPABASE_URL: 'https://nkbotzssyakcodlysreb.supabase.co',
  SUPABASE_ANON: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYm90enNzeWFrY29kbHlzcmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTk0NTQsImV4cCI6MjEwMDQ5NTQ1NH0.ldxvNI1iHGg8o87t2ymo2MuK9fhuKOiXViFpcSO2YbM',
  EMAIL_MODE: 'link' // 'link' — подтверждение кнопкой в письме (без SMTP); 'code' — 6-значный код (нужен свой SMTP)
};
