import lazypipe from 'lazypipe';
import { stream } from 'critical';
import modules from 'posthtml-css-modules';
import img from 'posthtml-img-autosize';
import postHtml from 'gulp-posthtml';
import prettify from 'gulp-html-prettify';
import replace from 'gulp-html-replace';
import name from 'gulp-rename';
import csscomb from 'gulp-csscomb';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import cssnano from 'gulp-cssnano';
import compiler from 'gulp-pug';
import purifyCss from 'gulp-purifycss';
import moduleImporter from 'sass-module-importer';
import sass from 'gulp-sass';
import postCss from 'gulp-postcss';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import postCssModules from 'postcss-modules';
import browsers from '@pixel2html/browserlist';
import path from 'path';
import set from 'lodash.set';

const critical$1 = (criticalConfig = {}) => {
  const defaultConfig = { inline: true };
  const config = Object.assign({}, defaultConfig, criticalConfig);
  return lazypipe()
    .pipe(stream, config)
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

  const baseStyles = lazypipe()
    .pipe(sass, { importer: moduleImporter() })
    .pipe(postCss, postCssPlugs)
    .pipe(concat, name$$1);

  const sourcemapStyles = lazypipe()
    .pipe(sourcemaps.init)
    .pipe(baseStyles)
    .pipe(sourcemaps.write, '.');

  return production ? baseStyles : sourcemapStyles
};

const getJSON = () => JSON.stringify(cssModules, null, 2);

export { critical$1 as critical, html, minifyStyles, pug, purify, styles, getJSON };
