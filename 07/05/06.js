const log4js = require('log4js')

log4js.configure({
  appenders: {
    redis: { type: '@log4js-node/redis', channel: 'logs' }
  },
  categories: { default: { appenders: ['redis'], level: 'info' } }
});

const logger = log4js.getLogger('redis')

logger.trace("Entering cheese testing");
logger.debug("Got cheese.");
logger.info("Cheese is Comté.");
logger.warn("Cheese is quite smelly.");
logger.error("Cheese is too ripe!");
logger.fatal("Cheese was breeding ground for listeria.");