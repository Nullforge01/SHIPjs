const lessons = [
  {
    id: 1,
    module: 1,
    title: 'Hello, ShipJS',
    file: 'index.js',
    docs: `
      <h1>Lesson 1: Hello, ShipJS</h1>
      <p>Time to ship your first line. Use <code>console.log()</code> to print to the console.</p>
      <h2>Task</h2>
      <p>Log the exact string <code>"I ship"</code></p>
      <h2>Why</h2>
      <p>Every shipper starts here. If you can log, you can debug.</p>
    `,
    starter: `// Log "I ship" to the console\n`,
    tests: [
      { desc: 'Logs "I ship"', check: `console.log("I ship")` },
      { desc: 'Uses console.log', check: `console.log` }
    ],
    hints: [
      'console.log() takes a string',
      'Strings need quotes: "I ship"',
      'Solution: console.log("I ship")'
    ]
  },
  {
    id: 2,
    module: 1,
    title: 'Variables',
    file: 'vars.js',
    docs: `
      <h1>Lesson 2: Variables</h1>
      <p>Store data with <code>let</code> and <code>const</code>.</p>
      <h2>Task</h2>
      <p>Create a <code>const</code> called <code>language</code> set to <code>"JavaScript"</code></p>
    `,
    starter: `// Create const language = "JavaScript"\n`,
    tests: [
      { desc: 'language is "JavaScript"', check: `const language = "JavaScript"` },
      { desc: 'Uses const', check: `const language` }
    ],
    hints: [
      'const means it cannot be reassigned',
      'Syntax: const name = value',
      'Solution: const language = "JavaScript"'
    ]
  },
  {
    id: 3,
    module: 1,
    title: 'Functions',
    file: 'fn.js',
    docs: `
      <h1>Lesson 3: Functions</h1>
      <p>Wrap code in reusable blocks. Return a value.</p>
      <h2>Task</h2>
      <p>Create function <code>ship()</code> that returns <code>"deployed"</code></p>
    `,
    starter: `// function ship() { return "deployed" }\n`,
    tests: [
      { desc: 'ship() returns "deployed"', check: `return "deployed"` },
      { desc: 'Function named ship exists', check: `function ship` }
    ],
    hints: [
      'function name() { return value }',
      'You need to return the string "deployed"',
      'Solution: function ship() { return "deployed" }'
    ]
  }
];

const projects = [
  {
    id: 1,
    module: 1,
    title: 'Project 1: Counter App',
    desc: 'Build a click counter with + and - buttons',
    lessonsRequired: [1,2,3]
  }
];

// Export for app.js
if (typeof window !== 'undefined') window.lessonsData = { lessons, projects };
