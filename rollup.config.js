'use strict';
/* eslint-env node */
/* eslint-disable no-process-env */

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');

const env = process.env.NODE_ENV || 'development';

const plugins = [
    nodeResolve({ jsnext: true, main: true, browser: true, extensions: [ '.js', '.jsx', '.json' ] }),
    commonjs({ exclude: [ 'node_modules/moment/**' ] }),
    replace({
        'process.env.NODE_ENV': JSON.stringify(env)
    }),
    babel()
];

if (env === 'production') {
    plugins.push(uglify());
}

module.exports = {
    entry: 'client/main.js',
    format: 'iife',
    plugins,
    dest: 'dist/bundle.js'
};
