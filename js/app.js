const state = {
  xp: 120, streak: 4, lessonsDone: 3, projectsDone: 1,
  currentView: 'landing', currentLesson: null, hints: 0,
  examStart: null, examTimer: null, examPassed: false,
  passedLessons: new Set()
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

function openModal(id) { $(id).classList.add('show') }
function closeModal(id) { $(id).classList.remove('show') }
function closeSidebar() {
  $('sidebar').classList.remove('open');
  $('backdrop').classList.remove('show');
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

// Modules from lessons.js
function renderModules() {
  const container = $('modulesContainer');
  container.innerHTML = window.lessonsData.map(mod => {
    const passed = mod.lessons.filter(l => state.passedLessons.has(l.id)).length;
    const locked = mod.id !== 'm1' && passed === 0 && !state.passedLessons.has('m1l3');
    return `
      <div class="module ${locked ? 'locked' : ''}" data-module="${mod.id}">
        <h3>${mod.title}</h3>
        <div class="progress"><div class="progress-bar" style="width:${passed/mod.lessons.length*100}%"></div></div>
        <div style="font-size:14px;color:var(--text-muted)">${passed}/${mod.lessons.length} lessons</div>
        <div class="module-actions">
          <button class="btn-primary" onclick="openLesson('${mod.lessons[0].id}')" ${locked ? 'disabled' : ''}>
            ${passed ? 'Continue' : 'Start'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Lesson runner
function openLesson(lessonId) {
  const lesson = window.lessonsData.flatMap(m => m.lessons).find(l => l.id === lessonId);
  if (!lesson) return;
  
  state.currentLesson = lesson;
  state.hints = 0;
  $('hintBtn').textContent = 'Hint 1/3';
  $('lessonDocs').innerHTML = lesson.docs;
  $('lessonFileName').textContent = lesson.fileName;
  $('lessonCode').value = lesson.starterCode;
  $('testsContainer').innerHTML = lesson.tests.map((t,i) => 
    `<div class="test" data-test="${i}">○ ${t.name}</div>`
  ).join('');
  showView('lesson');
}

$('runLesson').onclick = () => {
  if (!state.currentLesson) return;
  const code = $('lessonCode').value;
  const logs = [];
  const mockConsole = { log: (...args) => logs.push(args.join(' ')) };
  
  let allPass = true;
  try {
    new Function('console', code)(mockConsole);
    state.currentLesson.tests.forEach((t, i) => {
      const testEl = $(`[data-test="${i}"]`);
      const pass = t.test(code, logs);
      testEl.className = `test ${pass ? 'pass' : 'fail'}`;
      testEl.innerHTML = `${pass ? '✓' : '✗'} ${t.name}`;
      if (!pass) allPass = false;
    });
    
    if (allPass && !state.passedLessons.has(state.currentLesson.id)) {
      state.passedLessons.add(state.currentLesson.id);
      state.xp += state.currentLesson.xp;
      state.lessonsDone++;
      if (state.currentLesson.id.includes('l3')) state.projectsDone++;
      updateStats();
      toast(`+${state.currentLesson.xp} XP`);
    }
  } catch (e) {
    toast('Error: ' + e.message, true);
    allPass = false;
  }
};

$('hintBtn').onclick = () => {
  if (!state.currentLesson) return;
  const hint = state.currentLesson.hints[state.hints];
  if (hint) {
    toast(`Hint ${state.hints + 1}: ${hint}`);
    state.hints++;
    $('hintBtn').textContent = `Hint ${Math.min(state.hints + 1, 3)}/3`;
  }
};

// Exam
function startExam() {
  if (state.lessonsDone < 3) return toast('Complete at least 3 lessons first', true);
  showView('exam');
  state.examStart = Date.now();
  let sec = 45 * 60;
  clearInterval(state.examTimer);
  state.examTimer = setInterval(() => {
    sec--;
    $('timer').textContent = `${Math.floor(sec/60)}:${(sec%60).toString().padStart(2,'0')}`;
    if (sec <= 0) endExam(false);
  }, 1000);
  
  $('examContainer').innerHTML = window.examData.map((q,i) => `
    <div class="exam-card" style="margin-bottom:24px;background:var(--bg-elevated);padding:20px;border-radius:12px;border:1px solid var(--border);">
      <h4>Q${i+1}: ${q.question}</h4>
      ${q.type === 'mcq' 
        ? q.options.map((opt, j) => `
            <label style="display:block;margin:12px 0;">
              <input type="radio" name="q${i}" value="${j}"> ${opt}
            </label>
          `).join('')
        : `<textarea id="examCode${i}" class="mono" style="width:100%;height:120px;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:12px;margin-top:12px;">${q.starterCode}</textarea>`
      }
    </div>
  `).join('') + `<button class="btn-primary" onclick="submitExam()">Submit Exam</button>`;
}

function submitExam() {
  let correct = 0;
  window.examData.forEach((q, i) => {
    if (q.type === 'mcq') {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected && parseInt(selected.value) === q.answer) correct++;
    } else {
      const code = $(`examCode${i}`).value;
      if (q.test(code)) correct++;
    }
  });
  const passed = correct >= window.examData.length * 0.7;
  endExam(passed);
}

function endExam(passed) {
  clearInterval(state.examTimer);
  const time = Math.floor((Date.now() - state.examStart) / 1000);
  if (passed) {
    state.examPassed = true; 
    state.xp += 500; 
    updateStats();
    toast('Exam passed! +500 XP');
    setTimeout(() => openModal('certModal'), 500);
    generateCert(time);
  } else {
    toast('Exam failed. Score 70% to pass.', true);
  }
}

// Certificate - Fixed to Wild Lirt Studio
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
  
  ctx.fillStyle = '#FAFAFA'; ctx.font = '32px Inter';
  ctx.fillText('This certifies that', 600, 200);
  ctx.fillStyle = '#00FF88'; ctx.font = 'bold 56px Inter';
  ctx.fillText(name, 600, 280);
  ctx.fillStyle = '#FAFAFA'; ctx.font = '24px Inter';
  ctx.fillText('has shipped all lessons and projects', 600, 340);
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
  
  // Wild Lirt Studio footer - FIXED
  ctx.fillStyle = '#00FF88'; ctx.font = '16px Inter'; ctx.textAlign = 'right';
  ctx.fillText('Built with #00FF88 by Wild Lirt Studio', 1140, 590);
  
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
    $('backdrop').classList.toggle('show');
  }
  if (e.target.closest('[data-view="exam"]')) startExam();
});

// Init
updateStats();
