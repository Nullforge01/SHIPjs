export class ShipJS {
  constructor() {
    this.state = this.loadState();
    this.timerInterval = null;
    this.listeners = {};
  }

  async init() {
    this.startTimer();
    this.updateStreak();
    this.bindUI();
  }

  // --- State Management ---
  loadState() {
    const defaultState = {
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      completed: [], // lesson IDs: ['m1l1', 'm1l2']
      timeSec: 0,
      viewedSolutions: [],
      examPassed: false,
      certId: null,
      name: ''
    };

    try {
      const saved = localStorage.getItem('shipjs_state');
      return saved? {...defaultState,...JSON.parse(saved) } : defaultState;
    } catch (e) {
      console.error('Failed to load state:', e);
      return defaultState;
    }
  }

  saveState() {
    localStorage.setItem('shipjs_state', JSON.stringify(this.state));
  }

  getProgress() {
    return {...this.state };
  }

  // --- Lesson Logic ---
  completeLesson(lessonId, xp) {
    if (this.state.completed.includes(lessonId)) return false;

    this.state.completed.push(lessonId);
    this.state.xp += xp;
    this.saveState();
    this.emit('lesson:complete', { lessonId, xp, totalXp: this.state.xp });
    return true;
  }

  markViewedSolution(lessonId) {
    if (!this.state.viewedSolutions.includes(lessonId)) {
      this.state.viewedSolutions.push(lessonId);
      this.saveState();
    }
  }

  isLessonComplete(lessonId) {
    return this.state.completed.includes(lessonId);
  }

  getCompletedCount() {
    return this.state.completed.length;
  }

  // --- XP & Streak ---
  addXP(amount) {
    this.state.xp += amount;
    this.saveState();
    this.emit('xp:update', { xp: this.state.xp });
  }

  updateStreak() {
    const today = new Date().toDateString();
    const lastActive = this.state.lastActiveDate;

    if (!lastActive) {
      this.state.streak = 1;
    } else if (lastActive === today) {
      return;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActive === yesterday.toDateString()) {
        this.state.streak++;
      } else {
        this.state.streak = 1;
      }
    }

    this.state.lastActiveDate = today;
    this.saveState();
    this.emit('streak:update', { streak: this.state.streak });
  }

  // --- Timer ---
  startTimer() {
    if (this.timerInterval) return;

    this.timerInterval = setInterval(() => {
      this.state.timeSec++;
      if (this.state.timeSec % 5 === 0) this.saveState(); // Save every 5s
      this.emit('timer:tick', { timeSec: this.state.timeSec });
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.saveState();
    }
  }

  getTimeFormatted() {
    const m = Math.floor(this.state.timeSec / 60);
    const s = this.state.timeSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // --- Exam & Cert ---
  async passExam(name) {
    this.state.examPassed = true;
    this.state.name = name;
    this.saveState();

    try {
      const res = await fetch('/api/cert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          timeSec: this.state.timeSec,
          xp: this.state.xp,
          lessonsCompleted: this.state.completed.length
        })
      });

      const data = await res.json();
      if (data.success) {
        this.state.certId = data.id;
        this.saveState();
        this.emit('cert:generated', { certId: data.id });
        return data;
      }
    } catch (err) {
      console.error('Cert generation failed:', err);
      this.emit('cert:error', { error: err.message });
    }

    return null;
  }

  // --- Event System ---
  emit(event, data) {
    window.dispatchEvent(new CustomEvent(`shipjs:${event}`, { detail: data }));
  }

  on(event, handler) {
    const wrapped = (e) => handler(e.detail);
    window.addEventListener(`shipjs:${event}`, wrapped);

    // Store for cleanup
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push({ wrapped, handler });
  }

  off(event, handler) {
    const list = this.listeners[event];
    if (!list) return;

    const idx = list.findIndex(l => l.handler === handler);
    if (idx > -1) {
      window.removeEventListener(`shipjs:${event}`, list[idx].wrapped);
      list.splice(idx, 1);
    }
  }

  // --- UI Binding ---
  bindUI() {
    // Auto-update common elements if they exist
    this.on('xp:update', ({ xp }) => {
      document.querySelectorAll('[data-xp]').forEach(el => el.textContent = xp);
    });

    this.on('timer:tick', ({ timeSec }) => {
      const m = Math.floor(timeSec / 60);
      const s = timeSec % 60;
      const formatted = `${m}:${s.toString().padStart(2, '0')}`;
      document.querySelectorAll('[data-timer]').forEach(el => el.textContent = formatted);
    });

    this.on('streak:update', ({ streak }) => {
      document.querySelectorAll('[data-streak]').forEach(el => el.textContent = streak);
    });
  }

  // --- Dev Tools ---
  reset() {
    this.stopTimer();
    localStorage.removeItem('shipjs_state');
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('shipjs_file_')) localStorage.removeItem(key);
    });
    window.location.href = '/';
  }
      }
