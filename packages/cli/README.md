# Memos.js

### Global Install: npm install -g memos.js

Memos is an interactive browser-based coding environment for JavaScript. You can use this packages CLI to serve a React SPA hosted locally at port:4005(or your own port). The app itself allows the user to write JavaScript, see it executed in real time, and write comprehensive documentation using markdown via creating code and text cells.

Code transpiling and bundling is performed directly in the browser using Web Assembly and ESBuild. All changes are saved directly to the users machine in a local file. You can create multiple files, and open them on the fly from the CLI.

## CLI Commands

### memos.js serve

The serve command will start up the app, and host the SPA at http://localhost:4005 (by default). A new file will be created if its the first time its been run in the current directory called memo.js, where you can find your saved code and text snippets.

### memos.js serve \<file-name>

Optional file name: Chose a specific file to create/serve (must be a .js or .json file) [default is memos.js]

### memos.js serve --port \<port-number>

or

### memos.js serve -p \<port-number>

Optional port: Chose a port to host the server on [default is 4005]

The above commands can also be run using **npx memos.js** **\<options>**

## Client App Features

- Hover above or below any cell (code or text) to add a new cell block.
- Click on any text block (including this one!) to edit it.
- Code cells will automatically execute any code and display them on the right. To access the frame, you can directly access the DOM (`#root`), or call the `show()` function prebuilt into the environment.
- The `show()` function accepts any base Javascript value (`string, number, array, object`), `JSX` elements, and even full `React Components` to display in the window on the right! Call show multiple times to show multiple values!
- The code editor allows you to import any package off of the `NPM` library directly into your code block! It even works with `CSS` packages to add styling.
- The code in each code editor is cumulative, meaning that you don't have to re-write code in each following cell. Simply refer to it!
- To format your code, simply click the `Format` button on the top right of each developer environment!
- Re-order or delete cells by using the buttons on the top right of each cell!

All of your changes will get automatically saved into the file you opened Memos.js with (default memos.js). To change the file, run `npx memos.js serve [yourfile.js]`
