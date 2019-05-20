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

var path = require('path');

module.exports = {
    'devtool': 'inline-source-map',
    'entry': { 'app': './skel/src/index.js' },
    'resolve': { 'alias': { 'openmew-renderer': path.resolve(__dirname, 'src') } },
    'module': {
        'rules': [
            {
                'test': /\.js$/,
                'use': [
                    {
                        'loader': 'babel-loader',
                        'options': {
                            'presets': [ 'env' ],
                            'plugins': [
                                [ 'transform-object-rest-spread' ],
                                [ 'transform-react-jsx', { 'pragma': 'm' } ]
                            ]
                        }
                    }
                ]
            },
            {
                'test': /.json$/,
                'loader': 'json-loader'
            }
        ]
    },
    'output': {
        'path': path.resolve(__dirname, 'skel', 'dist'),
        'filename': '[name].js'
    },
    'watchOptions': { 'poll': true }
};

