/*DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
Version 2, December 2004

Copyright (C) 2017 Francois Cadeillan <francois@azsystem.fr>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

0. You just DO WHAT THE FUCK YOU WANT TO.
*/

/* eslint-disable */
var path = require('path');

var web_dev = {
    'mode': 'development',
    'target': 'web',
    'devtool': 'inline-source-map',
    'entry': { 'app': './src/index.js' },
    'resolve': { 'alias': { 'openmew-renderer': path.resolve(__dirname, 'src') } },
    'module': {
        'rules': [
            {
                'test': /\.js$/,
                'use': [ { 'loader': 'babel-loader' } ]
            }
        ]
    },
    'output': {
        'path': path.resolve(__dirname, 'dist'),
        'filename': 'openmew-renderer.js',
        'libraryTarget': 'umd',
        'library': 'OpenMewRenderer'

    },
    'performance': { 'hints': false }
};

var web_prod = {
    'mode': 'development',
    'target': 'web',
    'devtool': 'none',
    'entry': { 'app': './src/index.js' },
    'module': {
        'rules': [
            {
                'test': /\.js$/,
                'use': [ { 'loader': 'babel-loader' } ]
            }
        ]
    },
    'output': {
        'path': path.resolve(__dirname, 'dist'),
        'filename': 'openmew-renderer.min.js'

    },
    'performance': { 'hints': 'error' }
};

var nw_dev = {
    'mode': 'development',
    'target': 'node-webkit',
    'devtool': 'inline-source-map',
    'entry': { 'app': './src/index.js' },
    'module': {
        'rules': [
            {
                'test': /\.js$/,
                'use': [ { 'loader': 'babel-loader' } ]
            }
        ]
    },
    'output': {
        'path': path.resolve(__dirname, 'dist'),
        'filename': 'openmew-renderer.nw.js'
    },
    'performance': { 'hints': false }
};

var nw_prod = {
    'mode': 'production',
    'target': 'node-webkit',
    'devtool': 'none',
    'entry': { 'app': './src/index.js' },
    'module': {
        'rules': [
            {
                'test': /\.js$/,
                'use': [ { 'loader': 'babel-loader' } ]
            }
        ]
    },
    'output': {
        'path': path.resolve(__dirname, 'dist'),
        'filename': 'openmew-renderer.nw.js',
        'libraryTarget': 'umd',
        'library': 'OpenMewRenderer'

    },
    'performance': { 'hints': 'warning' }
};


module.exports = [ web_dev, web_prod, nw_dev, nw_prod ];
