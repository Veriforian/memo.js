import * as esbuild from 'esbuild-wasm';

//Custom plugin for ESBuild to handle dynamic fetching of npmpackages for in-browser executed code
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      //RESOLVE FUNCTIONS TO HANDLE PATHING FOR IMPORTS
      //Start case for resolving entry file
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      //Parse a path for relative imports, such as ../images
      build.onResolve({ filter: /^\.+\// }, async (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href
        };
      });

      //Parse package imports
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return { namespace: 'a', path: `https://unpkg.com/${args.path}` };
      });
    }
  };
};
