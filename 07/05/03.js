const log4js = require("log4js");
log4js.configure({
  appenders: {
    "output": {
      type: 'dateFile',
      filename: 'all-log.log',
      // 按照每年/月/日/时/分 生成文件
      // pattern: '.yyyy-MM-dd-hh-mm',
      // gzip
      // compress: true 
    }
  },
  categories: { default: { appenders: ["output"], level: "error" } }
});

const logger = log4js.getLogger("output");

logger.trace("Entering cheese testing");
logger.debug("Got cheese.");
logger.info("Cheese is Comté.");
logger.warn("Cheese is quite smelly.");
logger.error("Cheese is too ripe!");
logger.fatal("Cheese was breeding ground for listeria.");