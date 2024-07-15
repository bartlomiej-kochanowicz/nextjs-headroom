import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

import packageJson from './package.json' assert { type: "json" };

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      banner:`"use client";`
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      banner:`"use client";`
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    typescript({ tsconfig: './tsconfig.json' }),
    terser({
      compress: { directives: false },
    }),
  ],
  external: ['react', 'next'],
};
