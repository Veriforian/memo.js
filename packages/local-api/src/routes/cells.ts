import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

const initialCellData = [
  {
    content:
      "# Welcome to Memos.js!\n\nMemos.js is an interactive in-browser coding environment. You can write Javascript, see it executed in real time, and write comprehensive documentation using markdown.\n\n## Features\n\n- Hover above or below any cell (code or text) to add a new cell block.\n- Click on any text block (including this one!) to edit it.\n- Code cells will automatically execute any code and display them on the right. To access the frame, you can directly access the DOM (`#root`), or call the `show()` function prebuilt into the environment.\n- The `show()` function accepts any base Javascript value (`string, number, array, object`), `JSX` elements, and even full `React Components` to display in the window on the right! Call show multiple times to show multiple values!\n- The code editor allows you to import any package off of the `NPM` library directly into your code block! It even works with `CSS` packages to add styling.\n- The code in each code editor is cumulative, meaning that you don't have to re-write code in each following cell. Simply refer to it!\n- To format your code, simply click the `Format` button on the top right of each developer environment!\n- Re-order or delete cells by using the buttons on the top right of each cell! \n\nAll of your changes will get automatically saved into the file you opened Memos.js with (default memos.js). To change the file, run `npx memos.js serve [yourfile.js]`\n\nCheck out how it works bellow with an example react component, then get started on your own! ",
    type: 'text',
    id: 'wwjww'
  },
  {
    content:
      "//Import packages from npm, they'll be accessible in all concurrent code cells!\r\nimport 'bulma/css/bulma.css';\r\nimport {useState} from 'react';\r\n\r\nconst Counter = () => {\r\n  const [count, setCount] = useState(0);\r\n\r\n  return (\r\n    <div style={{padding: '30px'}}>\r\n      <button onClick={() => setCount(count + 1)}>Click to add</button>\r\n      <button onClick={() => setCount(count - 1)}>Click to subtract</button>\r\n      <h3 style={{fontSize: '22px'}}>{count}</h3>\r\n    </div>\r\n  )\r\n}\r\n\r\n//Display the component by calling 'show'\r\nshow(<Counter />)",
    type: 'code',
    id: 'ypuyl'
  },
  {
    content:
      "const App = () => {\n  return (\n    <div>\n      <h2 style={{ fontSize: '26px' }}>Welcome to Memos.js!</h2>\n      <i>Our previous Counter component will be rendered below!</i>\n      <hr />\n      {/*\n        Counter was declared in an earlier cell - meaning we can access it here!\n      */}\n      <Counter />\n    </div>\n  );\n};\n\nshow(<App />)",
    type: 'code',
    id: 'htnvw'
  }
];

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    try {
      //Read the file
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      res.send(JSON.parse(result));
    } catch (err: any) {
      //If read throws err, inspect err to see if file doesnt esist
      if (err.code === 'ENOENT') {
        //Create a file and add default cells
        await fs.writeFile(fullPath, JSON.stringify(initialCellData), 'utf-8');
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    //Take list of cells from req and serialize them
    const { cells }: { cells: Cell[] } = req.body;
    //Write cells to file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};
