window.lessonsData = [
  {
    id: 'm1',
    title: 'Module 1: Variables & Values',
    lessons: [
      {
        id: 'm1l1',
        title: 'Console.log',
        xp: 20,
        fileName: 'log.js',
        docs: `
          <h3>console.log()</h3>
          <p>The fastest way to see output. Use it to debug, to test, to ship.</p>
          <p><strong>Task:</strong> Log the string "I ship" to the console.</p>
          <p>Syntax: <code class="mono">console.log(value)</code></p>
        `,
        starterCode: `// Log "I ship" to the console\n`,
        solution: `console.log("I ship");`,
        hints: [
          'Use console.log() function',
          'Pass a string with quotes',
          'console.log("I ship");'
        ],
        tests: [
          {
            name: 'Logs "I ship"',
            test: (code, logs) => logs.includes('I ship')
          }
        ]
      },
      {
        id: 'm1l2',
        title: 'Variables: let & const',
        xp: 30,
        fileName: 'variables.js',
        docs: `
          <h3>Variables</h3>
          <p><code class="mono">let</code> = reassignable. <code class="mono">const</code> = locked.</p>
          <p><strong>Task:</strong> Create a const called <code>shipper</code> with value "me". Log it.</p>
        `,
        starterCode: `// Create const shipper = "me" and log it\n`,
        solution: `const shipper = "me";\nconsole.log(shipper);`,
        hints: [
          'const shipper = "me";',
          'Then console.log(shipper);',
          'const means you cannot reassign it later'
        ],
        tests: [
          {
            name: 'Declares const shipper',
            test: (code) => /const\s+shipper\s*=\s*["']me["']/.test(code)
          },
          {
            name: 'Logs "me"',
            test: (code, logs) => logs.includes('me')
          }
        ]
      },
      {
        id: 'm1l3',
        title: 'Project: XP Counter',
        xp: 50,
        fileName: 'xp.js',
        docs: `
          <h3>Project 1: XP Counter</h3>
          <p>Track your wins. Start at 0 XP. Add 100 XP. Log the total.</p>
          <p><strong>Requirements:</strong></p>
          <ul>
            <li>Create <code>let xp = 0;</code></li>
            <li>Add 100 to xp</li>
            <li>Log xp</li>
          </ul>
        `,
        starterCode: `// Start at 0, add 100, log total\nlet xp = 0;\n`,
        solution: `let xp = 0;\nxp = xp + 100;\nconsole.log(xp);`,
        hints: [
          'xp = xp + 100; or xp += 100;',
          'Make sure you log xp at the end',
          'Should output 100'
        ],
        tests: [
          {
            name: 'Declares let xp = 0',
            test: (code) => /let\s+xp\s*=\s*0/.test(code)
          },
          {
            name: 'Adds 100 to xp',
            test: (code) => /xp\s*(\+=|=\s*xp\s*\+)\s*100/.test(code)
          },
          {
            name: 'Logs 100',
            test: (code, logs) => logs.includes('100')
          }
        ]
      }
    ]
  },
  {
    id: 'm2',
    title: 'Module 2: Functions',
    lessons: [
      {
        id: 'm2l1',
        title: 'Function Declaration',
        xp: 40,
        fileName: 'func.js',
        docs: `
          <h3>Functions</h3>
          <p>Reusable code blocks. Define once, call anywhere.</p>
          <p><strong>Task:</strong> Write function <code>ship()</code> that logs "shipped". Then call it.</p>
        `,
        starterCode: `// Create function ship() that logs "shipped"\n// Then call ship()\n`,
        solution: `function ship() {\n  console.log("shipped");\n}\nship();`,
        hints: [
          'function ship() { }',
          'Inside: console.log("shipped");',
          'Don't forget to call ship() after'
        ],
        tests: [
          {
            name: 'Defines function ship',
            test: (code) => /function\s+ship\s*\(\s*\)/.test(code)
          },
          {
            name: 'Calls ship()',
            test: (code) => /ship\s*\(\s*\)/.test(code)
          },
          {
            name: 'Logs "shipped"',
            test: (code, logs) => logs.includes('shipped')
          }
        ]
      }
    ]
  }
];

window.examData = [
  {
    id: 'q1',
    question: 'What logs to console? const x = "ship"; console.log(x);',
    type: 'mcq',
    options: ['undefined', 'ship', 'x', 'error'],
    answer: 1
  },
  {
    id: 'q2',
    question: 'Write a function double(n) that returns n * 2',
    type: 'code',
    starterCode: `function double(n) {\n  // your code\n}`,
    test: (code) => {
      try {
        const fn = new Function(code + '; return double;')();
        return fn(5) === 10 && fn(0) === 0 && fn(-3) === -6;
      } catch { return false; }
    }
  },
  {
    id: 'q3',
    question: 'Which keyword creates a reassignable variable?',
    type: 'mcq',
    options: ['const', 'let', 'function', 'var'],
    answer: 1
  }
];
