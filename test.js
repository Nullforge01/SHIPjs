export async function runTests(code, tests, onLog) {
  const results = [];
  const logs = [];
  
  // Capture console.log
  const originalLog = console.log;
  console.log = (...args) => {
    const msg = args.map(a => 
      typeof a === 'object' ? JSON.stringify(a) : String(a)
    ).join(' ');
    logs.push(msg);
    onLog(msg);
  };
  
  try {
    // Wrap code in async function to handle await
    const wrappedCode = `
      (async () => {
        ${code}
      })();
    `;
    
    // Execute user code
    await eval(wrappedCode);
    
    // Run each test
    for (const test of tests) {
      let pass = false;
      
      try {
        if (test.type === 'log') {
          // Check if expected string was logged
          pass = logs.some(log => log.includes(test.check));
        } 
        else if (test.type === 'regex') {
          // Check if code matches regex
          const regex = new RegExp(test.check);
          pass = regex.test(code);
        }
        else if (test.type === 'function') {
          // Run function test
          const fn = new Function('return ' + code)();
          const result = fn(test.input);
          pass = JSON.stringify(result) === JSON.stringify(test.output);
        }
      } catch (e) {
        pass = false;
      }
      
      results.push({
        name: test.name,
        pass,
      });
    }
  } catch (e) {
    // Runtime error in user code
    throw new Error(e.message);
  } finally {
    // Restore console.log
    console.log = originalLog;
  }
  
  return results;
}
