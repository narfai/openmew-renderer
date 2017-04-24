var BuildUnit = require('./src/Compiler/BuildUnit'),
    path = require('path');

let testBuild = new BuildUnit(path.resolve(__dirname), 'async-node');
testBuild.compile([ path.resolve(__dirname, 'skel/Application/client.js') ], path.resolve(__dirname, 'skel', 'dist'));
