const log4js = require("log4js");
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    cheese: { type: "file", filename: "cheese.log" },
    // 过滤写入到文件的log
    'no file': { type: 'categoryFilter', exclude: 'no file', appender: 'cheese' }
  },
  categories: { default: { appenders: ["out", 'no file'], level: "error" } }
});
 
const logger = log4js.getLogger("cheese");
logger.trace("Entering cheese testing");
logger.debug("Got cheese.");
logger.info("Cheese is Comté.");
logger.warn("Cheese is quite smelly.");
logger.error("Cheese is too ripe!");
logger.fatal("Cheese was breeding ground for listeria.");

const logger1 = log4js.getLogger('no file')
logger1.error('no file can\'t be record')

