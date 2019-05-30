/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

/* eslint-disable */
var path = require('path');

var node_test = {
    'mode': 'development',
    'target': 'node',
    'devtool': 'inline-source-map',
    'entry': { 'app': './src/test.js' },
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
        'path': path.resolve(__dirname, 'dist/'),
        'filename': 'openmew-renderer-node.test.js'

    },
    'performance': { 'hints': false }
};


module.exports = [ node_test ];
