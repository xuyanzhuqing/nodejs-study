const log4js = require("log4js");
log4js.configure({
  appenders: {
    // 输出到控制台
    out: { type: 'stdout' },
    // 写入到浏览器控制台
    console: { type: 'console' },
    // 输出到文件
    cheese: { type: "file", filename: "cheese.log" }
  },
  categories: { default: { appenders: ["cheese", "out", "console"], level: "error" } }
});
 
const logger = log4js.getLogger("cheese");
logger.trace("Entering cheese testing");
logger.debug("Got cheese.");
logger.info("Cheese is Comté.");
logger.warn("Cheese is quite smelly.");
logger.error("Cheese is too ripe!");
logger.fatal("Cheese was breeding ground for listeria.");

