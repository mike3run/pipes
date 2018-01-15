'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lazypipe = _interopDefault(require('lazypipe'));
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
var critical = require('critical');

const cssModules = {};

const styles = ({
  name = 'main.css',
  modules = false,
  production = false,
  postCssPlugins = []
}) => {
  const basePlugins = [autoprefixer({ browsers })];

  if (modules) {
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

  const baseStyles = lazypipe()
    .pipe(sass, { importer: moduleImporter() })
    .pipe(postCss, postCssPlugs)
    .pipe(concat, name);

  const sourcemapStyles = lazypipe()
    .pipe(sourcemaps.init)
    .pipe(baseStyles)
    .pipe(sourcemaps.write, '.');

  return production ? baseStyles : sourcemapStyles
};

const getJSON = () => JSON.stringify(cssModules, null, 2);

const critical$1 = (criticalConfig = {}) => {
  const defaultConfig = { inline: true };
  const config = Object.assign({}, defaultConfig, criticalConfig);
  return lazypipe()
    .pipe(critical.stream, config)
};

exports.styles = styles;
exports.getJSON = getJSON;
exports.critical = critical$1;
