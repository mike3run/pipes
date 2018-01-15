import lazypipe from 'lazypipe';
import moduleImporter from 'sass-module-importer';
import sass from 'gulp-sass';
import postCss from 'gulp-postcss';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';

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

export { styles };
