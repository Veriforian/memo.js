import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

//Initialize IndexDB storage
const fileCache = localforage.createInstance({
  name: 'filecache'
});

export const fetchPlugin = (inputCode: string | undefined) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      //LOAD FUNCTIONS TO HANDLE ACTUAL FETCHING AND PARSING OF CODE

      //Handle entry file loading
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode
        };
      });

      //Handle already cached files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //Check to see if we have fetched file before, and if it is in the IndexDB cache
        const cachedRes = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        //If it is, return it immediately
        if (cachedRes) {
          return cachedRes;
        }

        return null;
      });

      //Handle CSS file loading
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        //Fetch Code from repository and then cache and return the contents
        //Or if another import, continuously fetch and get the packages/files
        const { data, request } = await axios.get(args.path);
        //Prevent css from breaking code by escaping the data
        const escapedData = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        //Set css from file to a new style element in head of page
        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escapedData}';
            document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname
        };
        //store res in cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      //Handle loading js & jsx files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //Fetch Code from repository and then cache and return the contents
        //Or if another import, continuously fetch and get the packages/files
        const { data, request } = await axios.get(args.path);

        //Create esBuild load object dynamically
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname
        };

        //Store res in cache
        await fileCache.setItem(args.path, result);

        return result;
      });
    }
  };
};
