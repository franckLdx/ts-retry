import typescript from 'rollup-plugin-typescript';
import { dts } from "rollup-plugin-dts";
import terser from '@rollup/plugin-terser';

import pkg from './package.json' assert { type: "json" };

const input = 'src/index.ts'

export default [
  {
    input,
    external: [],
    plugins: [
      typescript()
    ],
    output: [
      { file: pkg.exports.require, format: 'cjs', plugins: [terser()] },
      { file: pkg.exports.import, format: 'es', plugins: [terser()] }
    ],
  },
  {
    input,
    output: [{ file: pkg.types, format: "es" }],
    plugins: [dts()],
  }
];