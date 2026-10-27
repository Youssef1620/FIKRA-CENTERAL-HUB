// ============================================
// Fikra Hub v2 - Full Application
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyBCqfxuilglqJeZtqroK_VBGR8MHmRogCE",
  authDomain: "center-management-eef29.firebaseapp.com",
  projectId: "center-management-eef29",
  storageBucket: "center-management-eef29.firebasestorage.app",
  messagingSenderId: "888174413602",
  appId: "1:888174413602:web:cda66895a70e1a2b29477b",
  measurementId: "G-NJVZZJW3MC"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Cloudinary (unsigned preset)
const CLOUDINARY_CLOUD = 'trtvqlc';
const CLOUDINARY_PRESET = 'fikra_uploads';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`;

async function uploadToCloudinary(file) {
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', CLOUDINARY_PRESET);
  form.append('folder', 'fikra-hub');
  const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Cloudinary upload failed');
  }
  const data = await res.json();
  return { url: data.secure_url, name: file.name, publicId: data.public_id };
}


// ---------- i18n ----------
const T = {
  ar: {
    appName: "Fikra Hub", appNameShort: "Fikra",
    loginSubtitle: "منصة إدارة الفريق والمشاريع",
    usernamePlaceholder: "اسم المستخدم أو الإيميل",
    passwordPlaceholder: "كلمة المرور",
    loginBtn: "تسجيل الدخول", loginHint: "استخدم اسم المستخدم أو الإيميل الكامل",
    navTeamChat: "دردشة الفريق", navApprovals: "الموافقات",
    navClientProjects: "مشاريع العملاء", navTaskCenter: "مركز التاسكات",
    langToggle: "EN", logout: "تسجيل الخروج", member: "عضو",
    pageTeamChat: "دردشة الفريق", pageApprovals: "الموافقات",
    pageClientProjects: "مشاريع العملاء", pageTaskCenter: "مركز التاسكات",
    online: "متصل", searchPlaceholder: "ابحث في السجل...", searchBtn: "بحث",
    messagePlaceholder: "اكتب رسالتك...", sendBtn: "إرسال",
    emptyChat: "لا توجد رسائل بعد", emptyApprovals: "لا توجد طلبات موافقة",
    emptyClients: "لا يوجد عملاء بعد", emptyTasks: "لا توجد تاسكات",
    addApproval: "رفع للموافقة", addClient: "عميل جديد", addTask: "إضافة تاسك",
    descPlaceholder: "الوصف...", clientNamePlaceholder: "اسم العميل",
    taskTitlePlaceholder: "عنوان التاسك", deadline: "تاريخ التسليم",
    cancel: "إلغاء", submit: "إرسال", save: "حفظ", upload: "رفع ملف",
    back: "رجوع", tabNotes: "ملاحظات", tabFiles: "الملفات", tabChat: "شات العميل",
    notesPlaceholder: "ملاحظات العميل ومتطلباته...",
    myTasks: "تاسكاتي", allTasks: "كل التاسكات", taskChat: "شات التاسكات",
    completedTasks: "التاسكات المكتملة", messageLog: "سجل الرسائل",
    loginEmpty: "الرجاء إدخال اسم المستخدم وكلمة المرور.",
    loginWrong: "بيانات الدخول غير صحيحة.", loginNetwork: "مشكلة في الاتصال.",
    loginLoading: "جاري الدخول...", logoutConfirm: "هل تريد تسجيل الخروج؟",
    msgSent: "تم الإرسال", newMessage: "رسالة جديدة", you: "أنت",
    daysLeft: "يوم متبقي", daysLate: "يوم تأخير", today: "اليوم",
    like: "إعجاب", dislike: "رفض", comment: "تعليق", addComment: "أضف تعليق...",
    takeTask: "أخذ", markDone: "تم", noFile: "بدون ملف",
    allMembers: "الكل"
  },
  en: {
    appName: "Fikra Hub", appNameShort: "Fikra",
    loginSubtitle: "Team & Project Management Platform",
    usernamePlaceholder: "Username or email",
    passwordPlaceholder: "Password",
    loginBtn: "Sign In", loginHint: "Use username or full email",
    navTeamChat: "Team Chat", navApprovals: "Approvals",
    navClientProjects: "Client Projects", navTaskCenter: "Task Center",
    langToggle: "ع", logout: "Logout", member: "Member",
    pageTeamChat: "Team Chat", pageApprovals: "Approvals",
    pageClientProjects: "Client Projects", pageTaskCenter: "Task Center",
    online: "Online", searchPlaceholder: "Search...", searchBtn: "Search",
    messagePlaceholder: "Type your message...", sendBtn: "Send",
    emptyChat: "No messages yet", emptyApprovals: "No approval requests",
    emptyClients: "No clients yet", emptyTasks: "No tasks",
    addApproval: "Submit for Approval", addClient: "New Client", addTask: "Add Task",
    descPlaceholder: "Description...", clientNamePlaceholder: "Client name",
    taskTitlePlaceholder: "Task title", deadline: "Deadline",
    cancel: "Cancel", submit: "Submit", save: "Save", upload: "Upload",
    back: "Back", tabNotes: "Notes", tabFiles: "Files", tabChat: "Client Chat",
    notesPlaceholder: "Client notes and requirements...",
    myTasks: "My Tasks", allTasks: "All Tasks", taskChat: "Task Chat",
    completedTasks: "Completed Tasks", messageLog: "Message Log",
    loginEmpty: "Please enter username and password.",
    loginWrong: "Invalid credentials.", loginNetwork: "Network problem.",
    loginLoading: "Signing in...", logoutConfirm: "Do you want to log out?",
    msgSent: "Sent", newMessage: "New message", you: "You",
    daysLeft: "days left", daysLate: "days late", today: "Today",
    like: "Like", dislike: "Dislike", comment: "Comment", addComment: "Add comment...",
    takeTask: "Take", markDone: "Done", noFile: "No file",
    allMembers: "All"
  }
};

// ---------- State ----------
let lang = localStorage.getItem('fikra_lang') || 'ar';
let theme = localStorage.getItem('fikra_theme') || 'light';
let user = null;
let displayName = '';
let unsubs = [];
let currentClientId = null;
let clientMemberFilter = null;
let allChatMsgs = [];
let allApprovals = [];
let allClients = [];
let allTasks = [];
let notifOk = false;

// ---------- Helpers ----------
const $ = id => document.getElementById(id);
const t = () => T[lang];

function showToast(msg, type = '') {
  const el = $('toast');
  el.textContent = msg;
  el.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => el.classList.remove('show'), 2800);
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function formatTime(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const end = new Date(dateStr);
  end.setHours(23,59,59,999);
  const now = new Date();
  return Math.ceil((end - now) / 86400000);
}

function deadlineBadge(dateStr) {
  const days = daysUntil(dateStr);
  if (days === null) return '';
  const tr = t();
  let cls = 'ok', text;
  if (days < 0) { cls = 'late'; text = `${Math.abs(days)} ${tr.daysLate}`; }
  else if (days === 0) { cls = 'warn'; text = tr.today; }
  else if (days <= 3) { cls = 'warn'; text = `${days} ${tr.daysLeft}`; }
  else { text = `${days} ${tr.daysLeft}`; }
  return `<span class="deadline-badge ${cls}">📅 ${text}</span>`;
}

function firstName(emailOrName) {
  const raw = (emailOrName || '').split('@')[0];
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

function avatarLetter(name) {
  return (name || '?').charAt(0).toUpperCase();
}

// ---------- Language & Theme ----------
function applyLang(l) {
  lang = l;
  localStorage.setItem('fikra_lang', l);
  const dir = l === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = l;
  document.documentElement.dir = dir;
  document.body.dir = dir;
  const tr = T[l];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (tr[k] !== undefined) el.textContent = tr[k];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const k = el.getAttribute('data-i18n-placeholder');
    if (tr[k] !== undefined) el.placeholder = tr[k];
  });
  updateThemeIcon();
}

function applyTheme(th) {
  theme = th;
  localStorage.setItem('fikra_theme', th);
  document.body.setAttribute('data-theme', th);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.querySelector('.theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ---------- Auth ----------
auth.onAuthStateChanged(u => {
  if (u) {
    user = u;
    displayName = firstName(u.email);
    $('loginScreen').style.display = 'none';
    $('dashboard').classList.remove('hidden');
    $('userDisplayName').textContent = displayName;
    $('userAvatar').textContent = avatarLetter(displayName);
    startListeners();
    requestNotif();
  } else {
    user = null;
    $('loginScreen').style.display = 'flex';
    $('dashboard').classList.add('hidden');
    unsubs.forEach(fn => fn && fn());
    unsubs = [];
  }
});

function doLogin() {
  const raw = $('usernameInput').value.trim().toLowerCase();
  const pass = $('passwordInput').value.trim();
  const tr = t();
  if (!raw || !pass) { showLoginError(tr.loginEmpty); return; }
  $('loginBtn').textContent = tr.loginLoading;
  $('loginBtn').disabled = true;
  const email = raw.includes('@') ? raw : `${raw}@fikra.com`;
  auth.signInWithEmailAndPassword(email, pass)
    .then(() => $('loginError').classList.add('hidden'))
    .catch(err => {
      if (['auth/user-not-found','auth/wrong-password','auth/invalid-email','auth/invalid-credential'].includes(err.code))
        showLoginError(tr.loginWrong);
      else if (err.code === 'auth/network-request-failed') showLoginError(tr.loginNetwork);
      else showLoginError(err.message);
    })
    .finally(() => {
      $('loginBtn').textContent = tr.loginBtn;
      $('loginBtn').disabled = false;
    });
}

function showLoginError(msg) {
  $('loginError').textContent = msg;
  $('loginError').classList.remove('hidden');
}

$('loginBtn').addEventListener('click', doLogin);
$('passwordInput').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
$('usernameInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('passwordInput').focus(); });

$('logoutBtn').addEventListener('click', () => {
  if (confirm(t().logoutConfirm)) auth.signOut();
});

// ---------- UI Controls ----------
$('themeToggle').addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));
$('langToggle').addEventListener('click', () => applyLang(lang === 'ar' ? 'en' : 'ar'));
$('toggleSidebar').addEventListener('click', () => $('sidebar').classList.toggle('collapsed'));
$('mobileMenuBtn').addEventListener('click', () => {
  $('sidebar').classList.add('open');
  $('sidebarOverlay').classList.add('active');
});
$('sidebarOverlay').addEventListener('click', closeMobileSidebar);
function closeMobileSidebar() {
  $('sidebar').classList.remove('open');
  $('sidebarOverlay').classList.remove('active');
}

// Navigation
const pageKeys = {
  teamChat: 'pageTeamChat', approvals: 'pageApprovals',
  clientProjects: 'pageClientProjects', taskCenter: 'pageTaskCenter'
};

document.querySelectorAll('#navList li').forEach(li => {
  li.addEventListener('click', () => {
    document.querySelectorAll('#navList li').forEach(i => i.classList.remove('active'));
    li.classList.add('active');
    const page = li.getAttribute('data-page');
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = $('page-' + page);
    if (target) target.classList.add('active');
    const key = pageKeys[page];
    if (key) {
      $('pageTitle').textContent = t()[key];
      $('pageTitle').setAttribute('data-i18n', key);
    }
    // reset client detail
    if (page === 'clientProjects') {
      $('clientDetail').classList.add('hidden');
      $('clientsList').classList.remove('hidden');
      $('clientsToolbar').classList.remove('hidden');
    }
    closeMobileSidebar();
  });
});

// ---------- Profile Panel ----------
$('userProfileBtn').addEventListener('click', openProfile);
$('closeProfile').addEventListener('click', () => $('profilePanel').classList.add('hidden'));

function openProfile() {
  $('profileName').textContent = displayName;
  $('profileAvatar').textContent = avatarLetter(displayName);
  $('profilePanel').classList.remove('hidden');
  renderProfileTasks();
  renderProfileDone();
  renderProfileMsgs();
}

document.querySelectorAll('.profile-tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.profile-tabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.profile-body .tab-content').forEach(c => c.classList.remove('active'));
    $('ptab-' + tab.getAttribute('data-ptab')).classList.add('active');
  });
});

function renderProfileTasks() {
  const list = allTasks.filter(tk => tk.assigneeUid === user.uid && tk.status !== 'done');
  const el = $('ptab-tasks');
  if (!list.length) { el.innerHTML = `<div class="empty-state"><p>${t().emptyTasks}</p></div>`; return; }
  el.innerHTML = list.map(tk => `
    <div class="task-item">
      <div class="task-item-title">${escapeHtml(tk.title)}</div>
      <div class="task-item-desc">${escapeHtml(tk.desc || '')}</div>
    </div>
  `).join('');
}

function renderProfileDone() {
  const list = allTasks.filter(tk => tk.assigneeUid === user.uid && tk.status === 'done');
  const el = $('ptab-done');
  if (!list.length) { el.innerHTML = `<div class="empty-state"><p>${t().emptyTasks}</p></div>`; return; }
  el.innerHTML = list.map(tk => `
    <div class="task-item done">
      <div class="task-item-title">${escapeHtml(tk.title)}</div>
      <div class="task-item-desc">${escapeHtml(tk.desc || '')}</div>
    </div>
  `).join('');
}

function renderProfileMsgs() {
  const list = allChatMsgs.filter(m => m.uid === user.uid).slice(-30).reverse();
  const el = $('ptab-msgs');
  if (!list.length) { el.innerHTML = `<div class="empty-state"><p>${t().emptyChat}</p></div>`; return; }
  el.innerHTML = list.map(m => `
    <div class="comment">
      <strong>${formatTime(m.createdAt)}</strong><br>${escapeHtml(m.text)}
    </div>
  `).join('');
}

// ---------- Listeners ----------
function startListeners() {
  unsubs.forEach(fn => fn && fn());
  unsubs = [];

  // Team Chat
  unsubs.push(db.collection('teamChat').orderBy('createdAt','asc').limitToLast(150)
    .onSnapshot(snap => {
      allChatMsgs = [];
      snap.forEach(d => allChatMsgs.push({ id: d.id, ...d.data() }));
      renderTeamChat(allChatMsgs);
      // notif
      snap.docChanges().forEach(ch => {
        if (ch.type === 'added') {
          const d = ch.doc.data();
          if (d.uid !== user.uid && document.hidden) showBrowserNotif(d.author, d.text);
        }
      });
    }));

  // Approvals
  unsubs.push(db.collection('approvals').orderBy('createdAt','desc')
    .onSnapshot(snap => {
      allApprovals = [];
      snap.forEach(d => allApprovals.push({ id: d.id, ...d.data() }));
      renderApprovals(allApprovals);
    }));

  // Clients
  unsubs.push(db.collection('clients').orderBy('createdAt','desc')
    .onSnapshot(snap => {
      allClients = [];
      snap.forEach(d => allClients.push({ id: d.id, ...d.data() }));
      if (!$('clientDetail').classList.contains('hidden') && currentClientId) {
        const c = allClients.find(x => x.id === currentClientId);
        if (c) updateClientDetailHeader(c);
      } else {
        renderClients(allClients);
      }
    }));

  // Tasks
  unsubs.push(db.collection('tasks').orderBy('createdAt','desc')
    .onSnapshot(snap => {
      allTasks = [];
      snap.forEach(d => allTasks.push({ id: d.id, ...d.data() }));
      renderTasks();
    }));

  // Task Chat
  unsubs.push(db.collection('taskChat').orderBy('createdAt','asc').limitToLast(80)
    .onSnapshot(snap => {
      const msgs = [];
      snap.forEach(d => msgs.push({ id: d.id, ...d.data() }));
      renderGenericChat($('taskChatBox'), msgs);
    }));
}

// ---------- Team Chat ----------
function renderTeamChat(msgs, q = '') {
  const box = $('chatBox');
  box.innerHTML = '';
  let list = msgs;
  if (q) {
    const ql = q.toLowerCase();
    list = msgs.filter(m =>
      (m.text||'').toLowerCase().includes(ql) ||
      (m.author||'').toLowerCase().includes(ql) ||
      formatTime(m.createdAt).includes(ql)
    );
  }
  if (!list.length) {
    box.innerHTML = `<div class="empty-state"><div class="icon">💬</div><p>${t().emptyChat}</p></div>`;
    return;
  }
  const frag = document.createDocumentFragment();
  list.forEach(m => {
    const own = m.uid === user.uid;
    const div = document.createElement('div');
    div.className = 'message ' + (own ? 'own' : 'other');
    div.innerHTML = `
      <div class="message-meta">
        <span class="message-author">${own ? t().you : escapeHtml(m.author||'User')}</span>
        <span class="message-time">${formatTime(m.createdAt)}</span>
      </div>
      <div class="message-text">${escapeHtml(m.text)}</div>`;
    frag.appendChild(div);
  });
  box.appendChild(frag);
  box.scrollTop = box.scrollHeight;
}

async function sendTeamMsg() {
  const text = $('messageInput').value.trim();
  if (!text || !user) return;
  $('sendBtn').disabled = true;
  try {
    await db.collection('teamChat').add({
      text, uid: user.uid, author: displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    $('messageInput').value = '';
    $('messageInput').style.height = 'auto';
  } catch (e) { showToast(e.message, 'error'); }
  finally { $('sendBtn').disabled = false; $('messageInput').focus(); }
}

$('sendBtn').addEventListener('click', sendTeamMsg);
$('messageInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTeamMsg(); }
});
$('messageInput').addEventListener('input', () => {
  $('messageInput').style.height = 'auto';
  $('messageInput').style.height = Math.min($('messageInput').scrollHeight, 110) + 'px';
});
$('chatSearchBtn').addEventListener('click', () => renderTeamChat(allChatMsgs, $('chatSearchInput').value.trim()));
$('chatSearchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') renderTeamChat(allChatMsgs, $('chatSearchInput').value.trim());
});

// ---------- Approvals ----------
function renderApprovals(list, q = '') {
  const el = $('approvalsList');
  let items = list;
  if (q) {
    const ql = q.toLowerCase();
    items = list.filter(a =>
      (a.desc||'').toLowerCase().includes(ql) ||
      (a.author||'').toLowerCase().includes(ql) ||
      (a.fileName||'').toLowerCase().includes(ql)
    );
  }
  if (!items.length) {
    el.innerHTML = `<div class="empty-state"><div class="icon">✅</div><p>${t().emptyApprovals}</p></div>`;
    return;
  }
  el.innerHTML = items.map(a => {
    const likes = a.likes || [];
    const dislikes = a.dislikes || [];
    const comments = a.comments || [];
    const myLike = likes.includes(user.uid);
    const myDislike = dislikes.includes(user.uid);
    return `
    <div class="card" data-id="${a.id}">
      <div class="card-title">${escapeHtml(a.author || '')}</div>
      <div class="card-desc">${escapeHtml(a.desc || '')}</div>
      <div class="card-meta">
        <span>${formatTime(a.createdAt)}</span>
        ${a.fileUrl ? `<a class="card-file" href="${a.fileUrl}" target="_blank" rel="noopener">📎 ${escapeHtml(a.fileName||'file')}</a>` : `<span>${t().noFile}</span>`}
      </div>
      <div class="reaction-bar">
        <button class="reaction-btn ${myLike?'active-like':''}" onclick="toggleReaction('${a.id}','like')">👍 ${t().like} ${likes.length}</button>
        <button class="reaction-btn ${myDislike?'active-dislike':''}" onclick="toggleReaction('${a.id}','dislike')">👎 ${t().dislike} ${dislikes.length}</button>
      </div>
      <div class="comments-section">
        ${comments.map(c => `<div class="comment"><strong>${escapeHtml(c.author)}</strong>: ${escapeHtml(c.text)}</div>`).join('')}
        <div class="comment-input-row">
          <input type="text" id="cmt-${a.id}" placeholder="${t().addComment}">
          <button onclick="addComment('${a.id}')">${t().comment}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

window.toggleReaction = async function(id, type) {
  const ref = db.collection('approvals').doc(id);
  const doc = await ref.get();
  if (!doc.exists) return;
  const data = doc.data();
  let likes = data.likes || [];
  let dislikes = data.dislikes || [];
  if (type === 'like') {
    if (likes.includes(user.uid)) likes = likes.filter(u => u !== user.uid);
    else { likes.push(user.uid); dislikes = dislikes.filter(u => u !== user.uid); }
  } else {
    if (dislikes.includes(user.uid)) dislikes = dislikes.filter(u => u !== user.uid);
    else { dislikes.push(user.uid); likes = likes.filter(u => u !== user.uid); }
  }
  await ref.update({ likes, dislikes });
};

window.addComment = async function(id) {
  const input = document.getElementById('cmt-' + id);
  const text = (input?.value || '').trim();
  if (!text) return;
  const ref = db.collection('approvals').doc(id);
  await ref.update({
    comments: firebase.firestore.FieldValue.arrayUnion({
      author: displayName, text, uid: user.uid, at: Date.now()
    })
  });
  if (input) input.value = '';
};

$('addApprovalBtn').addEventListener('click', () => $('approvalModal').classList.remove('hidden'));
$('cancelApproval').addEventListener('click', () => $('approvalModal').classList.add('hidden'));
$('submitApproval').addEventListener('click', async () => {
  const desc = $('approvalDesc').value.trim();
  const file = $('approvalFileInput').files[0];
  if (!desc && !file) return;
  $('submitApproval').disabled = true;
  try {
    let fileUrl = null, fileName = null;
    if (file) {
      const uploaded = await uploadToCloudinary(file);
      fileUrl = uploaded.url;
      fileName = uploaded.name;
    }
    await db.collection('approvals').add({
      desc, fileUrl, fileName,
      author: displayName, uid: user.uid,
      likes: [], dislikes: [], comments: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    $('approvalModal').classList.add('hidden');
    $('approvalDesc').value = '';
    $('approvalFileInput').value = '';
    showToast(t().msgSent, 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { $('submitApproval').disabled = false; }
});
$('approvalSearchBtn').addEventListener('click', () => renderApprovals(allApprovals, $('approvalSearchInput').value.trim()));

// ---------- Clients ----------
function renderClients(list, q = '') {
  const el = $('clientsList');
  let items = list;
  if (q) {
    const ql = q.toLowerCase();
    items = list.filter(c => (c.name||'').toLowerCase().includes(ql));
  }
  if (!items.length) {
    el.innerHTML = `<div class="empty-state"><div class="icon">📁</div><p>${t().emptyClients}</p></div>`;
    return;
  }
  el.innerHTML = items.map(c => `
    <div class="card" onclick="openClient('${c.id}')">
      <div class="card-title">${escapeHtml(c.name)}</div>
      <div class="card-meta">
        ${deadlineBadge(c.deadline)}
        <span>${formatTime(c.createdAt)}</span>
      </div>
    </div>
  `).join('');
}

window.openClient = function(id) {
  currentClientId = id;
  clientMemberFilter = null;
  const c = allClients.find(x => x.id === id);
  if (!c) return;
  $('clientsList').classList.add('hidden');
  $('clientsToolbar').classList.add('hidden');
  $('clientDetail').classList.remove('hidden');
  updateClientDetailHeader(c);
  $('clientNotes').value = c.notes || '';
  renderClientFiles(c);
  loadClientChat(id);
  // tabs reset
  document.querySelectorAll('#clientDetail .detail-tabs .tab').forEach((tb,i) => {
    tb.classList.toggle('active', i === 0);
  });
  document.querySelectorAll('#clientDetail .tab-content').forEach((tc,i) => {
    tc.classList.toggle('active', i === 0);
  });
};

function updateClientDetailHeader(c) {
  $('clientDetailName').textContent = c.name;
  $('clientDetailDeadline').outerHTML = deadlineBadge(c.deadline).replace('deadline-badge', 'deadline-badge') || '<span id="clientDetailDeadline"></span>';
  // re-bind id
  const badge = $('clientDetailName').parentElement.querySelector('.deadline-badge');
  if (badge) badge.id = 'clientDetailDeadline';
}

$('backToClients').addEventListener('click', () => {
  currentClientId = null;
  $('clientDetail').classList.add('hidden');
  $('clientsList').classList.remove('hidden');
  $('clientsToolbar').classList.remove('hidden');
  renderClients(allClients);
});

// Client tabs
document.querySelectorAll('#clientDetail .detail-tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#clientDetail .detail-tabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('#clientDetail .tab-content').forEach(c => c.classList.remove('active'));
    $('tab-' + tab.getAttribute('data-tab')).classList.add('active');
  });
});

$('saveNotesBtn').addEventListener('click', async () => {
  if (!currentClientId) return;
  await db.collection('clients').doc(currentClientId).update({ notes: $('clientNotes').value });
  showToast(t().msgSent, 'success');
});

$('uploadClientFileBtn').addEventListener('click', async () => {
  const file = $('clientFileInput').files[0];
  if (!file || !currentClientId) return;
  $('uploadClientFileBtn').disabled = true;
  try {
    const uploaded = await uploadToCloudinary(file);
    await db.collection('clients').doc(currentClientId).update({
      files: firebase.firestore.FieldValue.arrayUnion({
        name: uploaded.name, url: uploaded.url, by: displayName, at: Date.now()
      })
    });
    $('clientFileInput').value = '';
    showToast(t().msgSent, 'success');
  } catch (e) { showToast(e.message, 'error'); }
  finally { $('uploadClientFileBtn').disabled = false; }
});

function renderClientFiles(c) {
  const files = c.files || [];
  const el = $('clientFilesList');
  if (!files.length) { el.innerHTML = `<div class="empty-state"><p>${t().noFile}</p></div>`; return; }
  el.innerHTML = files.map(f => `
    <div class="file-item">
      <a href="${f.url}" target="_blank" rel="noopener">📎 ${escapeHtml(f.name)}</a>
      <span style="color:var(--text-muted);font-size:0.8rem">${escapeHtml(f.by||'')}</span>
    </div>
  `).join('');
}

let clientChatUnsub = null;
function loadClientChat(clientId) {
  if (clientChatUnsub) clientChatUnsub();
  clientChatUnsub = db.collection('clientChats').doc(clientId).collection('messages')
    .orderBy('createdAt','asc').limitToLast(100)
    .onSnapshot(snap => {
      let msgs = [];
      snap.forEach(d => msgs.push({ id: d.id, ...d.data() }));
      // member filter chips
      const members = [...new Set(msgs.map(m => m.author).filter(Boolean))];
      const filterEl = $('clientMemberFilter');
      filterEl.innerHTML = `<button class="member-chip ${!clientMemberFilter?'active':''}" onclick="setClientMemberFilter(null)">${t().allMembers}</button>` +
        members.map(m => `<button class="member-chip ${clientMemberFilter===m?'active':''}" onclick="setClientMemberFilter('${escapeHtml(m)}')">${escapeHtml(m)}</button>`).join('');
      if (clientMemberFilter) msgs = msgs.filter(m => m.author === clientMemberFilter);
      renderGenericChat($('clientChatBox'), msgs);
    });
}

window.setClientMemberFilter = function(name) {
  clientMemberFilter = name;
  if (currentClientId) loadClientChat(currentClientId);
};

async function sendClientMsg() {
  const text = $('clientMsgInput').value.trim();
  if (!text || !currentClientId) return;
  await db.collection('clientChats').doc(currentClientId).collection('messages').add({
    text, uid: user.uid, author: displayName,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  $('clientMsgInput').value = '';
}
$('clientSendBtn').addEventListener('click', sendClientMsg);
$('clientMsgInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendClientMsg(); }
});

$('addClientBtn').addEventListener('click', () => $('clientModal').classList.remove('hidden'));
$('cancelClient').addEventListener('click', () => $('clientModal').classList.add('hidden'));
$('submitClient').addEventListener('click', async () => {
  const name = $('clientNameInput').value.trim();
  const deadline = $('clientDeadlineInput').value;
  if (!name) return;
  await db.collection('clients').add({
    name, deadline: deadline || null, notes: '', files: [],
    createdBy: displayName, uid: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  $('clientModal').classList.add('hidden');
  $('clientNameInput').value = '';
  $('clientDeadlineInput').value = '';
  showToast(t().msgSent, 'success');
});
$('clientSearchBtn').addEventListener('click', () => renderClients(allClients, $('clientSearchInput').value.trim()));

// ---------- Tasks ----------
function renderTasks(q = '') {
  let items = allTasks;
  if (q) {
    const ql = q.toLowerCase();
    items = items.filter(tk =>
      (tk.title||'').toLowerCase().includes(ql) ||
      (tk.desc||'').toLowerCase().includes(ql) ||
      (tk.assignee||'').toLowerCase().includes(ql)
    );
  }
  const my = items.filter(tk => tk.assigneeUid === user.uid && tk.status !== 'done');
  const all = items.filter(tk => tk.status !== 'done');

  $('myTasksList').innerHTML = my.length ? my.map(taskCard).join('') :
    `<div class="empty-state"><p>${t().emptyTasks}</p></div>`;
  $('allTasksList').innerHTML = all.length ? all.map(taskCard).join('') :
    `<div class="empty-state"><p>${t().emptyTasks}</p></div>`;
}

function taskCard(tk) {
  const isMine = tk.assigneeUid === user.uid;
  const isOpen = !tk.assigneeUid;
  return `
    <div class="task-item ${tk.status==='done'?'done':''}">
      <div class="task-item-title">${escapeHtml(tk.title)}</div>
      <div class="task-item-desc">${escapeHtml(tk.desc||'')}</div>
      <div class="card-meta">
        ${tk.assignee ? `<span>👤 ${escapeHtml(tk.assignee)}</span>` : ''}
        <span>${formatTime(tk.createdAt)}</span>
      </div>
      <div class="task-item-actions">
        ${isOpen ? `<button class="take-btn" onclick="takeTask('${tk.id}')">${t().takeTask}</button>` : ''}
        ${isMine && tk.status !== 'done' ? `<button class="done-btn" onclick="doneTask('${tk.id}')">${t().markDone}</button>` : ''}
      </div>
    </div>`;
}

window.takeTask = async function(id) {
  await db.collection('tasks').doc(id).update({
    assignee: displayName, assigneeUid: user.uid
  });
  showToast(t().msgSent, 'success');
};

window.doneTask = async function(id) {
  await db.collection('tasks').doc(id).update({ status: 'done' });
  showToast(t().msgSent, 'success');
};

$('addTaskBtn').addEventListener('click', () => $('taskModal').classList.remove('hidden'));
$('cancelTask').addEventListener('click', () => $('taskModal').classList.add('hidden'));
$('submitTask').addEventListener('click', async () => {
  const title = $('taskTitleInput').value.trim();
  const desc = $('taskDescInput').value.trim();
  if (!title) return;
  await db.collection('tasks').add({
    title, desc, status: 'open',
    assignee: null, assigneeUid: null,
    createdBy: displayName, uid: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  $('taskModal').classList.add('hidden');
  $('taskTitleInput').value = '';
  $('taskDescInput').value = '';
  showToast(t().msgSent, 'success');
});
$('taskSearchBtn').addEventListener('click', () => renderTasks($('taskSearchInput').value.trim()));

async function sendTaskMsg() {
  const text = $('taskMsgInput').value.trim();
  if (!text) return;
  await db.collection('taskChat').add({
    text, uid: user.uid, author: displayName,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  $('taskMsgInput').value = '';
}
$('taskSendBtn').addEventListener('click', sendTaskMsg);
$('taskMsgInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTaskMsg(); }
});

// ---------- Generic chat render ----------
function renderGenericChat(box, msgs) {
  if (!box) return;
  box.innerHTML = '';
  if (!msgs.length) {
    box.innerHTML = `<div class="empty-state"><p>${t().emptyChat}</p></div>`;
    return;
  }
  const frag = document.createDocumentFragment();
  msgs.forEach(m => {
    const own = m.uid === user.uid;
    const div = document.createElement('div');
    div.className = 'message ' + (own ? 'own' : 'other');
    div.innerHTML = `
      <div class="message-meta">
        <span class="message-author">${own ? t().you : escapeHtml(m.author||'')}</span>
        <span class="message-time">${formatTime(m.createdAt)}</span>
      </div>
      <div class="message-text">${escapeHtml(m.text)}</div>`;
    frag.appendChild(div);
  });
  box.appendChild(frag);
  box.scrollTop = box.scrollHeight;
}

// ---------- Notifications ----------
function requestNotif() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') notifOk = true;
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(p => { notifOk = p === 'granted'; });
  }
}
function showBrowserNotif(author, text) {
  if (!notifOk || !document.hidden) return;
  try {
    const n = new Notification(`${t().newMessage} — ${author}`, {
      body: (text||'').substring(0,120), tag: 'fikra'
    });
    n.onclick = () => { window.focus(); n.close(); };
  } catch(e) {}
}

// ---------- Init ----------
applyLang(lang);
applyTheme(theme);
