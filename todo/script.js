// ---------- جابه‌جایی بین زبونه‌ها ----------
const tabs = document.querySelectorAll('.tab');
const pages = document.querySelectorAll('.page');

function showPage(id) {
  pages.forEach(function (p) {
    p.classList.toggle('hidden', p.id !== id);
  });
  tabs.forEach(function (t) {
    t.classList.toggle('active', t.dataset.page === id);
  });
  window.scrollTo(0, 0);
}

tabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    showPage(tab.dataset.page);
  });
});

document.querySelectorAll('[data-go]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    showPage(btn.dataset.go);
  });
});

// ---------- فرم تماس با ما (نمونه) ----------
const contactBtn = document.getElementById('contactBtn');
const contactResult = document.getElementById('contactResult');

contactBtn.addEventListener('click', function () {
  const name = document.getElementById('contactName').value.trim();
  const msg = document.getElementById('contactMsg').value.trim();

  if (name === '' || msg === '') {
    contactResult.style.color = '#e0507a';
    contactResult.textContent = 'اسم و پیام رو پر کن';
    return;
  }

  contactResult.style.color = '#3aa76d';
  contactResult.textContent = 'ممنون ' + name + '، پیامت ثبت شد ✓';
  document.getElementById('contactName').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactMsg').value = '';
});

// ---------- حساب کاربری ----------
const authBox = document.getElementById('authBox');
const profileBox = document.getElementById('profileBox');
const authTitle = document.getElementById('authTitle');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const authBtn = document.getElementById('authBtn');
const authMsg = document.getElementById('authMsg');
const switchText = document.getElementById('switchText');
const switchLink = document.getElementById('switchLink');
const welcome = document.getElementById('welcome');
const memberSince = document.getElementById('memberSince');
const avatar = document.getElementById('avatar');
const logoutBtn = document.getElementById('logoutBtn');
const bioInput = document.getElementById('bioInput');
const saveBioBtn = document.getElementById('saveBioBtn');
const bioMsg = document.getElementById('bioMsg');

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const statAll = document.getElementById('statAll');
const statDone = document.getElementById('statDone');
const statLeft = document.getElementById('statLeft');

// users شکلش اینه: { ali: { pass: '1234', joined: '1405/08/11' } }
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = localStorage.getItem('currentUser') || null;
let isLoginMode = true;
let tasks = [];

// اگه کاربرهای نسخه‌ی قبلی فقط رمز داشتن، به شکل جدید تبدیلشون می‌کنیم
Object.keys(users).forEach(function (name) {
  if (typeof users[name] === 'string') {
    users[name] = { pass: users[name], joined: todayText() };
  }
});
localStorage.setItem('users', JSON.stringify(users));

function todayText() {
  return new Date().toLocaleDateString('fa-IR');
}

function setMode(login) {
  isLoginMode = login;
  authTitle.textContent = login ? 'ورود' : 'ثبت‌نام';
  authBtn.textContent = login ? 'ورود' : 'ثبت‌نام';
  switchText.textContent = login ? 'حساب نداری؟' : 'حساب داری؟';
  switchLink.textContent = login ? 'ثبت‌نام کن' : 'وارد شو';
  authMsg.textContent = '';
}

switchLink.addEventListener('click', function (e) {
  e.preventDefault();
  setMode(!isLoginMode);
});

authBtn.addEventListener('click', function () {
  const name = usernameInput.value.trim();
  const pass = passwordInput.value;

  if (name === '' || pass === '') {
    authMsg.textContent = 'نام کاربری و رمز رو پر کن';
    return;
  }

  if (isLoginMode) {
    if (users[name] === undefined || users[name].pass !== pass) {
      authMsg.textContent = 'نام کاربری یا رمز اشتباهه';
      return;
    }

login(name);
  } else {
    if (users[name] !== undefined) {
      authMsg.textContent = 'این نام کاربری قبلاً گرفته شده';
      return;
    }
    users[name] = { pass: pass, joined: todayText() };
    localStorage.setItem('users', JSON.stringify(users));
    login(name);
  }
});

function login(name) {
  currentUser = name;
  localStorage.setItem('currentUser', name);
  usernameInput.value = '';
  passwordInput.value = '';
  renderAccount();
}

logoutBtn.addEventListener('click', function () {
  currentUser = null;
  localStorage.removeItem('currentUser');
  renderAccount();
});

function renderAccount() {
  if (currentUser !== null && users[currentUser] !== undefined) {
    authBox.classList.add('hidden');
    profileBox.classList.remove('hidden');

    welcome.textContent = 'سلام ' + currentUser;
    memberSince.textContent = 'عضو از ' + users[currentUser].joined;
    avatar.textContent = currentUser.charAt(0).toUpperCase();
    bioInput.value = localStorage.getItem('bio_' + currentUser) || '';

    tasks = JSON.parse(localStorage.getItem('tasks_' + currentUser)) || [];
    renderTasks();
  } else {
    authBox.classList.remove('hidden');
    profileBox.classList.add('hidden');
    setMode(true);
  }
}

saveBioBtn.addEventListener('click', function () {
  localStorage.setItem('bio_' + currentUser, bioInput.value);
  bioMsg.style.color = '#3aa76d';
  bioMsg.textContent = 'ذخیره شد ✓';
  setTimeout(function () { bioMsg.textContent = ''; }, 1500);
});

// ---------- کارهای شخصی ----------
function saveTasks() {
  localStorage.setItem('tasks_' + currentUser, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach(function (task, index) {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    const span = document.createElement('span');
    span.textContent = task.text;

    const del = document.createElement('button');
    del.textContent = 'حذف';

    li.addEventListener('click', function () {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
    });

    del.addEventListener('click', function (e) {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(del);
    taskList.appendChild(li);
  });

  const done = tasks.filter(function (t) { return t.done; }).length;
  statAll.textContent = tasks.length;
  statDone.textContent = done;
  statLeft.textContent = tasks.length - done;
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;
  tasks.push({ text: text, done: false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTask();
});

// ---------- حالت شب ----------
const themeBtn = document.getElementById('themeBtn');

function applyTheme() {
  const isDark = localStorage.getItem('dark') === 'yes';
  document.body.classList.toggle('dark', isDark);
  themeBtn.textContent = isDark ? '☀️' : '🌙';
}

themeBtn.addEventListener('click', function () {
  const isDark = !document.body.classList.contains('dark');
  localStorage.setItem('dark', isDark ? 'yes' : 'no');
  applyTheme();
});

applyTheme();

// ---------- جستجو ----------
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const pageNames = {
  home: 'خانه',
  about: 'درباره‌ی ما',
  services: 'خدمات',
  contact: 'تماس با ما'
};

function doSearch() {
  const q = searchInput.value.trim();
  searchResults.innerHTML = '';

  if (q === '') {
    searchResults.classList.add('hidden');
    return;
  }

  let found = 0;

  Object.keys(pageNames).forEach(function (id) {
    const page = document.getElementById(id);
    page.querySelectorAll('h1, h2, h3, p').forEach(function (el) {
      const text = el.textContent.trim();
      const pos = text.indexOf(q);
      if (pos === -1) return;

      found++;
      const item = docu

ment.createElement('div');
      item.className = 'result-item';

      const title = document.createElement('b');
      title.textContent = pageNames[id];

      const snippet = document.createElement('span');
      snippet.appendChild(document.createTextNode(text.slice(0, pos)));
      const mark = document.createElement('mark');
      mark.textContent = q;
      snippet.appendChild(mark);
      snippet.appendChild(document.createTextNode(text.slice(pos + q.length)));

      item.appendChild(title);
      item.appendChild(snippet);

      item.addEventListener('click', function () {
        showPage(id);
        searchInput.value = '';
        searchResults.classList.add('hidden');
      });

      searchResults.appendChild(item);
    });
  });

  if (found === 0) {
    const none = document.createElement('div');
    none.className = 'no-result';
    none.textContent = 'چیزی پیدا نشد';
    searchResults.appendChild(none);
  }

  searchResults.classList.remove('hidden');
}

searchInput.addEventListener('input', doSearch);

document.addEventListener('click', function (e) {
  if (!e.target.closest('.search-wrap')) {
    searchResults.classList.add('hidden');
  }
});

// ---------- شروع ----------
renderAccount();