import './code-editor.css';
import './syntax.css';

import { useRef } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import Highlighter from 'monaco-jsx-highlighter';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { Buffer } from 'buffer';

//Necessary setup for syntax highlight
//@ts-ignore
window.buffer = Buffer;

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string | undefined): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();

  //Monaco lifecycle function, for added setup
  const onMount: OnMount = (monacoEditor) => {
    //Get access to editor in rest of component
    editorRef.current = monacoEditor;

    //Change amount of spaces pressing tab adds
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    //Set up syntax highlighting for jsx in monaco
    const highlighter = new Highlighter(
      //@ts-ignore
      window.monaco,
      parse,
      traverse,
      monacoEditor
    );
    highlighter.highlightOnDidChangeModelContent();
  };

  //Format code function with prettier
  const onFormatClick = () => {
    //Get current value
    const unformatted = editorRef.current.getModel().getValue();

    //Format value
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true
      })
      .replace(/\n$/, '');

    //Set formatted value back into editor
    editorRef.current.setValue(formatted);
  };

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        onMount={onMount}
        onChange={onChange}
        defaultValue={initialValue}
        language='javascript'
        theme='vs-dark'
        height='100%'
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 18,
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </div>
  );
};

export default CodeEditor;
