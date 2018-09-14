import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

const env = process.env;
const NODE_ENV = env.NODE_ENV;
const SSR = env.SSR;
const isPro = NODE_ENV === 'production';
const maybePro = fn => (isPro ? fn() : false);
const plugins = [
    typescript({
        typescript: require('typescript'),
    }),
    replace({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.SSR': JSON.stringify(SSR),
    }),
    resolve({
        jsnext: true,
        browser: true,
    }),
    commonjs(),
    maybePro(() =>
        uglify(
            {
                compress: {
                    pure_funcs: ['Object.defineProperty'],
                },
            },
            minify
        )
    ),
    maybePro(() => filesize()),
].filter(is => is);

export default {
    plugins,
    treeshake: true,
    output: {
        format: 'iife',
        sourcemap: true,
    },
};
