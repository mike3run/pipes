'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lazypipe = _interopDefault(require('lazypipe'));
var moduleImporter = _interopDefault(require('sass-module-importer'));
var sass = _interopDefault(require('gulp-sass'));
var postCss = _interopDefault(require('gulp-postcss'));
var concat = _interopDefault(require('gulp-concat'));
var sourcemaps = _interopDefault(require('gulp-sourcemaps'));

const styles = ({
  name = 'main.css',
  modules = false,
  sourcemap = true,
  postCssPlugins = []
}) => {
  const baseStyles = lazypipe()
    .pipe(sass, { importer: moduleImporter() })
    .pipe(postCss)
    .pipe(concat, name);

  const sourcemapStyles = lazypipe()
    .pipe(sourcemaps.init)
    .pipe(baseStyles)
    .pipe(sourcemaps.write, '.');

  return sourcemap ? sourcemapStyles : baseStyles
};

exports.styles = styles;
