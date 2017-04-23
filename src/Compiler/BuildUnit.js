var webpack = require('webpack'),
    gulp = require('gulp'),
    gulpWebpack = require('webpack-stream'),
    debug = require('gulp-debug'),
    named = require('vinyl-named'),
    plumber = require('gulp-plumber');

function BuildUnit(basePath, target){
    this.context = basePath;
    this.target = target;
    this.devtool = 'nosources-source-map';
    this.debug = false;
    this.extensions = ['.js', '.jsx'];
    this.env = 'production';
}

/**
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

BuildUnit.prototype.generatePluginsConfiguration = function() {
    var pluginConfiguration = [];
    if(this.debug)
        pluginConfiguration.push(new webpack.LoaderOptionsPlugin({ 'debug': true }));

    pluginConfiguration.push(new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify(this.env) } }));

    return pluginConfiguration;
};

BuildUnit.prototype.generateFileRegexp = function() {
    return /\.js$/;
};

BuildUnit.prototype.generateConfiguration = function(){
    return {
        'context': this.basePath,
        'target': this.target,
        // 'devtool': this.devtool,
        'plugins': this.generatePluginsConfiguration(),
        'module': {
            'rules': [
                {
                    'test': this.generateFileRegexp(),
                    'use': [
                        {
                            'loader': 'babel-loader',
                            'options': {
                                'presets': [
                                    'es2015',
                                    'stage-0'
                                ],
                                'plugins': [
                                    'transform-decorators-legacy',
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
        }
    };
};

BuildUnit.prototype.compile = function(from, to){
    var self = this;
    return new Promise(function (resolve, reject){
        return gulp.src(from)
            .pipe(named())
            .pipe(plumber())
            .pipe(gulpWebpack(self.generateConfiguration(), webpack))
            .pipe(debug({'title': 'Build server webpack compile :'}))
            .pipe(gulp.dest(to))
            .on('end', resolve)
            .on('error', reject);
    });
};

module.exports = BuildUnit;
