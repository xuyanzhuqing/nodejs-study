const log4js = require("log4js");

log4js.configure({
  appenders: {
    output: {
      type: 'file', filename: 'test-05-log.log',
      maxLogSize: 1* 1024**2, backups: 3, compress: true
    }
  },
  categories: { default: { appenders: ['output'], level: 'debug'}}
});

let paused = false;
process.on("log4js:pause", (value) => paused = value);


const logger = log4js.getLogger();
while (!paused) {
  logger.debug("I'm logging, but I will stop once we start buffering");
}