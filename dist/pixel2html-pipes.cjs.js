'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lazypipe = _interopDefault(require('lazypipe'));
var critical = require('critical');
var modules = _interopDefault(require('posthtml-css-modules'));
var img = _interopDefault(require('posthtml-img-autosize'));
var postHtml = _interopDefault(require('gulp-posthtml'));
var prettify = _interopDefault(require('gulp-html-prettify'));
var replace = _interopDefault(require('gulp-html-replace'));
var name = _interopDefault(require('gulp-rename'));
var csscomb = _interopDefault(require('gulp-csscomb'));
var groupCssMediaQueries = _interopDefault(require('gulp-group-css-media-queries'));
var cssnano = _interopDefault(require('gulp-cssnano'));
var compiler = _interopDefault(require('gulp-pug'));
var purifyCss = _interopDefault(require('gulp-purifycss'));
var moduleImporter = _interopDefault(require('sass-module-importer'));
var sass = _interopDefault(require('gulp-sass'));
var postCss = _interopDefault(require('gulp-postcss'));
var concat = _interopDefault(require('gulp-concat'));
var sourcemaps = _interopDefault(require('gulp-sourcemaps'));
var autoprefixer = _interopDefault(require('autoprefixer'));
var postCssModules = _interopDefault(require('postcss-modules'));
var browsers = _interopDefault(require('@pixel2html/browserlist'));
var path = _interopDefault(require('path'));
var set = _interopDefault(require('lodash.set'));

const critical$1 = (criticalConfig = {}) => {
  const defaultConfig = { inline: true };
  const config = Object.assign({}, defaultConfig, criticalConfig);
  return lazypipe()
    .pipe(critical.stream, config)
};

const html = ({
  cssModules,
  imgAutoSize,
  htmlReplace,
  plugins = []
}) => {
  const defaultPlugins = [
    modules(cssModules),
    img(imgAutoSize)
  ];
  const postHtmlPlugins = [...defaultPlugins, ...plugins];
  return lazypipe()
    .pipe(replace, htmlReplace)
    .pipe(postHtml, postHtmlPlugins)
    .pipe(prettify)
};

const minifyStyles = ({rename}) => {
  const renameDefaults = {suffix: '.min'};
  const renameConfig = Object.assign({}, renameDefaults, rename);
  return lazypipe()
    .pipe(name, renameConfig)
    .pipe(csscomb)
    .pipe(groupCssMediaQueries)
    .pipe(cssnano)
};

const pug = ({
  cssModules,
  imgAutoSize,
  pug,
  plugins = []
}) => {
  const defaultPlugins = [
    modules(cssModules),
    img(imgAutoSize)
  ];

  const postHtmlPlugins = [...defaultPlugins, ...plugins];
  return lazypipe()
    .pipe(compiler, pug)
    .pipe(postHtml, postHtmlPlugins)
    .pipe(prettify)
};

const purify = ({paths, userConfig}) => {
  const defaultConfig = { info: true };
  const config = Object.assign({}, defaultConfig, userConfig);
  return lazypipe()
    .pipe(purifyCss, paths, config)
};

const cssModules = {};

const styles = ({
  name: name$$1 = 'main.css',
  modules: modules$$1 = false,
  production = false,
  postCssPlugins = []
}) => {
  const basePlugins = [autoprefixer({ browsers })];

  if (modules$$1) {
    basePlugins.push(
      postCssModules({
        generateScopedName: production ? '[hash:base64:5]' : '[name]__[local]___[hash:base64:5]',
        getJSON: (cssPath, json) => {
          const pathWithoutExtension = cssPath.split('.css')[0];
          const exploded = pathWithoutExtension.split(path.sep);
          const mainIndex = exploded.indexOf('main');
          const dirs = exploded.slice(mainIndex + 1);
          set(cssModules, dirs, json);
        }
      })
    );
  }

  const postCssPlugs = [...basePlugins, ...postCssPlugins];

  return lazypipe()
    .pipe(sourcemaps.init)
    .pipe(sass, { importer: moduleImporter() })
    .pipe(postCss, postCssPlugs)
    .pipe(concat, name$$1)
    .pipe(sourcemaps.write, '.')
};

const getJSON = () => JSON.stringify(cssModules, null, 2);

exports.critical = critical$1;
exports.html = html;
exports.minifyStyles = minifyStyles;
exports.pug = pug;
exports.purify = purify;
exports.styles = styles;
exports.getJSON = getJSON;
