import lazypipe from 'lazypipe'
import rename from 'gulp-rename'
import csscomb from 'gulp-csscomb'
import groupCssMediaQueries from 'gulp-group-css-media-queries'
import cssnano from 'gulp-cssnano'

const minifyStyles = lazypipe()
  .pipe(rename({suffix: '.min'}))
  .pipe(csscomb())
  .pipe(groupCssMediaQueries())
  .pipe(cssnano())

export default minifyStyles
