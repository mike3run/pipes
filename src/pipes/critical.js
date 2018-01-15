import lazypipe from 'lazypipe'
import {stream} from 'critical'

const critical = (criticalConfig = {}) => {
  const defaultConfig = { inline: true }
  const config = Object.assign({}, defaultConfig, criticalConfig)
  return lazypipe()
    .pipe(stream, config)
}

export default critical
