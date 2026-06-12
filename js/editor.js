let monacoLoaded = false;

export async function createEditor(containerId, initialValue = '') {
  // Load Monaco once
  if (!monacoLoaded) {
    await new Promise((resolve) => {
      require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
      require(['vs/editor/editor.main'], () => {
        monacoLoaded = true;
        resolve();
      });
    });
    
    // Define ShipJS dark theme
    monaco.editor.defineTheme('shipjs-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '00FF88' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
      ],
      colors: {
        'editor.background': '#0a0a0a',
        'editor.foreground': '#e5e5e5',
        'editorLineNumber.foreground': '#555555',
        'editorLineNumber.activeForeground': '#00FF88',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorCursor.foreground': '#00FF88',
        'editor.lineHighlightBackground': '#1a1a1a',
      }
    });
  }
  
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container ${containerId} not found`);
  
  const editor = monaco.editor.create(container, {
    value: initialValue,
    language: 'javascript',
    theme: 'shipjs-dark',
    fontSize: 14,
    fontFamily: 'JetBrains Mono, monospace',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on',
    lineNumbers: 'on',
    renderLineHighlight: 'all',
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      useShadows: false,
    },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
  });
  
  return editor;
        }
