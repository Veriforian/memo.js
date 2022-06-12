import './text-editor.css';

import React, { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();

  useEffect(() => {
    //Logic to handle closing edit window on click outside
    const listener = (event: MouseEvent) => {
      //Check to make sure that we don't close editor if user clicks inside of it again
      if (
        containerRef.current &&
        event.target &&
        containerRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className='text-editor' ref={containerRef}>
        <MDEditor
          value={cell.content}
          onChange={(value) => updateCell(cell.id, value || '')}
        />
      </div>
    );
  }

  return (
    <div className='text-editor card' onClick={() => setEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={cell.content || '# Click to edit'} />
      </div>
    </div>
  );
};

export default TextEditor;
