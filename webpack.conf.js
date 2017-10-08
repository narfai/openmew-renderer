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

/**
 REMOVE GULP ! SPLIT DEVOPS !
 Many things to compile separately:
 Cli pack (target node-async)
 => include configuration parsing
 => include compiler (/!\)

 Client pack (target web)
 => include iso (.js) deps from Sources ( Core -> App -> whatever )
 => include client (.client.js) deps from Sources ( Core -> App )
 => does not allow server (.server.js) files

 UI packs (target web)

 Server pack (target node-async)
 => include builtin server
 => include iso (.js) deps from Sources ( Core -> App )
 => include server (.server.js) deps from Sources ( Core -> App )
 => does not allow client (.client.js) files

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
    'watchOptions': {
        'poll': true
    }
};

