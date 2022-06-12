import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const bundle = async (rawCode: string | undefined) => {
  //EsBuild webAss file is hosted on unpkg, instead of hosting it in browser, better to work with
  try {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.14.38/esbuild.wasm'
    });
  } catch (err: any) {}

  //Function that bundles users code, complete with bundle error catching
  try {
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      },
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment'
    });

    return {
      code: result.outputFiles[0].text,
      err: ''
    };
  } catch (err: any) {
    if (err.message.includes('initialize')) return { code: '', err: '' };
    return {
      code: '',
      err: err.message
    };
  }
};

export default bundle;
