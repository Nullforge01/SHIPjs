const state = {
  xp: 120, streak: 4, lessonsDone: 3, projectsDone: 1,
  currentView: 'landing', currentLesson: null, hints: 0,
  examStart: null, examTimer: null, examPassed: false
};

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// Nav + Views
function showView(view) {
  $$('.view').forEach(v => v.classList.remove('active'));
  $(view)?.classList.add('active');
  $$('.nav-item').forEach(n => n.classList.remove('active'));
  $(`[data-view="${view}"]`)?.classList.add('active');
  state.currentView = view;
  if (view === 'dashboard') renderModules();
  closeSidebar();
}

function openModal(id) { $(id).classList.add('active') }
function closeModal(id) { $(id).classList.remove('active') }
function closeSidebar() {
  $('sidebar').classList.remove('open');
  $('backdrop').classList.remove('open');
}

// Toast
function toast(msg, isErr = false) {
  const t = $('toast');
  t.textContent = msg;
  t.className = `toast show ${isErr ? 'error' : ''}`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Update UI
function updateStats() {
  $('xpCount').textContent = state.xp;
  $('totalXp').textContent = state.xp;
  $('streakCount').textContent = state.streak;
  $('lessonsDone').textContent = state.lessonsDone;
  $('projectsDone').textContent = state.projectsDone;
  $('xpFill').style.width = `${(state.xp % 500) / 5}%`;
  if (state.examPassed) $('navCert').classList.remove('disabled');
}

// Playground
$('runPlayground').onclick = () => {
  const code = $('playgroundCode').value;
  const con = $('playgroundConsole');
  con.innerHTML = '';
  const log = (...args) => con.innerHTML += `<div>> ${args.join(' ')}</div>`;
  try { new Function('console', code)({ log }); }
  catch (e) { log('Error:', e.message) }
};

// Modules - stub data for Module 1
const modules = [
  { id: 1, title: 'Module 1: JS Fundamentals', progress: 3, total: 5, locked: false },
  { id: 2, title: 'Module 2: DOM & Events', progress: 0, total: 6, locked: true },
  { id: 3, title: 'Module 3: Async JS', progress: 0, total: 5, locked: true },
  { id: 4, title: 'Module 4: APIs', progress: 0, total: 5, locked: true },
  { id: 5, title: 'Module 5: Capstone', progress: 0, total: 5, locked: true }
];

function renderModules() {
  $('modulesContainer').innerHTML = modules.map(m => `
    <div class="module ${m.locked ? 'locked' : ''}" data-id="${m.id}">
      <h3>${m.title}</h3>
      <div class="progress"><div class="progress-bar" style="width:${m.progress/m.total*100}%"></div></div>
      <div style="font-size:14px;color:var(--text-muted)">${m.progress}/${m.total} lessons</div>
      <div class="module-actions">
        <button class="btn-primary" ${m.locked ? 'disabled' : ''}>${m.progress ? 'Continue' : 'Start'}</button>
      </div>
    </div>
  `).join('');
}

// Lesson runner - minimal
$('runLesson').onclick = () => {
  const code = $('lessonCode').value;
  const tests = $$('.test');
  let pass = 0;
  try {
    const fn = new Function('return ' + code)();
    tests.forEach(t => {
      const ok = Math.random() > 0.3; // stub test
      t.className = `test ${ok ? 'pass' : 'fail'}`;
      t.innerHTML = `${ok ? '✓' : '✗'} ${t.dataset.test}`;
      if (ok) pass++;
    });
    if (pass === tests.length) {
      state.xp += 25; state.lessonsDone++; updateStats(); toast('+25 XP');
    }
  } catch (e) { toast('Code error: ' + e.message, true) }
};

$('hintBtn').onclick = () => {
  state.hints++;
  $('hintBtn').textContent = `Hint ${Math.min(state.hints + 1, 3)}/3`;
  toast(`Hint ${state.hints}: Check the docs`);
};

// Exam
function startExam() {
  if (state.lessonsDone < 20) return toast('Complete 20 lessons first', true);
  showView('exam');
  state.examStart = Date.now();
  let sec = 45 * 60;
  state.examTimer = setInterval(() => {
    sec--;
    $('timer').textContent = `${Math.floor(sec/60)}:${(sec%60).toString().padStart(2,'0')}`;
    if (sec <= 0) endExam(false);
  }, 1000);
  $('examContainer').innerHTML = `
    <div class="exam-card">
      <h3>Task: Build a todo list</h3>
      <textarea id="examCode" class="mono" style="width:100%;height:300px;background:var(--code-bg);border:none;color:var(--text);padding:16px;"></textarea>
      <div style="margin-top:16px"><button class="btn-primary" onclick="submitExam()">Submit Exam</button></div>
    </div>
  `;
}

function submitExam() {
  const code = $('examCode').value;
  const passed = code.length > 50; // stub check
  endExam(passed);
}

function endExam(passed) {
  clearInterval(state.examTimer);
  const time = Math.floor((Date.now() - state.examStart) / 1000);
  if (passed) {
    state.examPassed = true; state.xp += 500; updateStats();
    toast('Exam passed! +500 XP');
    setTimeout(() => openModal('certModal'), 500);
    generateCert(time);
  } else {
    toast('Exam failed. Try again.', true);
  }
}

// Certificate
function generateCert(timeSec) {
  const canvas = $('certCanvas'), ctx = canvas.getContext('2d');
  const name = prompt('Enter your name for the certificate:') || 'ShipJS Developer';
  const date = new Date().toLocaleDateString();
  const id = Math.random().toString(36).substring(2, 10).toUpperCase();
  const time = `${Math.floor(timeSec/60)}:${(timeSec%60).toString().padStart(2,'0')}`;
  
  ctx.fillStyle = '#0A0A0B'; ctx.fillRect(0,0,1200,630);
  ctx.strokeStyle = '#00FF88'; ctx.lineWidth = 4; ctx.strokeRect(20,20,1160,590);
  
  ctx.fillStyle = '#00FF88'; ctx.font = 'bold 48px Inter'; ctx.textAlign = 'center';
  ctx.fillText('Certified ShipJS Developer', 600, 120);
  
  ctx.fillStyle = '#E4E4E7'; ctx.font = '32px Inter';
  ctx.fillText('This certifies that', 600, 200);
  ctx.fillStyle = '#7C3AED'; ctx.font = 'bold 56px Inter';
  ctx.fillText(name, 600, 280);
  ctx.fillStyle = '#E4E4E7'; ctx.font = '24px Inter';
  ctx.fillText('has shipped all 26 lessons and 5 projects', 600, 340);
  ctx.fillText(`Exam Time: ${time} | Date: ${date}`, 600, 380);
  ctx.font = '18px JetBrains Mono'; ctx.fillText(`Certificate ID: ${id}`, 600, 420);
  
  // QR Code
  const qrDiv = $('qr-temp');
  qrDiv.innerHTML = '';
  new QRCode(qrDiv, { text: `https://shipjs.dev/verify/${id}`, width: 100, height: 100 });
  setTimeout(() => {
    const qrImg = qrDiv.querySelector('img');
    if (qrImg) ctx.drawImage(qrImg, 1050, 480, 100, 100);
  }, 100);
  
  // Wild Lirt Studii footer
  ctx.fillStyle = '#7C3AED'; ctx.font = '16px Inter'; ctx.textAlign = 'right';
  ctx.fillText('Built with #00FF88 by Wild Lirt Studii', 1140, 590);
  
  $('downloadCert').onclick = () => {
    const a = document.createElement('a');
    a.download = `shipjs-cert-${id}.png`;
    a.href = canvas.toDataURL();
    a.click();
  };
  $('shareCert').onclick = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://shipjs.dev`, '_blank');
  };
}

// Event delegation
document.addEventListener('click', e => {
  const v = e.target.closest('[data-view]');
  const m = e.target.closest('[data-modal]');
  const a = e.target.closest('[data-action]');
  const c = e.target.closest('[data-close]');
  
  if (v) showView(v.dataset.view);
  if (m) openModal(m.dataset.modal);
  if (a && a.dataset.action === 'openCertificate') {
    state.examPassed ? openModal('certModal') : toast('Pass the exam first', true);
  }
  if (c) closeModal(c.dataset.close);
  if (e.target.id === 'hamburger' || e.target.id === 'backdrop') {
    $('sidebar').classList.toggle('open');
    $('backdrop').classList.toggle('open');
  }
  if (e.target.closest('[data-view="exam"]')) startExam();
});

// Init
updateStats();
