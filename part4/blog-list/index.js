const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

console.log('hi')
console.log('ignore')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})