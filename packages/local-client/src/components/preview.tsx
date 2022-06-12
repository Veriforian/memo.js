import './preview.css';

import React, { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
  bundlingFailed: string;
}

//Creating an HTML doc to execute code we transpile in Browser, passing it as text into iframe
const html = `
<html>
  <head>
    <style>html {background-color: white;}</style>
  </head>
  <body>
  <div id="root"></div>
  <script>
    const handleError = (err) => {
      const root = document.getElementById('root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
        console.error(err)
    }

    window.addEventListener('error', (event) => {
      event.preventDefault();
      handleError(event.error);
    })

    window.addEventListener('message', (event) => {
      try {
        eval(event.data);
      } catch(err) {
        handleError(err);
      }
    }, false)
  </script>
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, bundlingFailed }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;

    //Posting the code we transpile as a message to be caught by the Iframe HtmlDOC (for safety)
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        title='Preview'
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
      />
      {bundlingFailed && (
        <div className='preview-error'>
          <h4>Runtime Error</h4>
          {bundlingFailed}
        </div>
      )}
    </div>
  );
};

export default Preview;
