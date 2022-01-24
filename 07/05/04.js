const log4js = require("log4js");

log4js.configure({
  appenders: {
    output: { type: 'dateFile', filename: 'out.log' }
  },
  categories: { default: { appenders: ['output'], level: 'debug'}}
});

let paused = false;
process.on("log4js:pause", (value) => paused = value);


const logger = log4js.getLogger();
while (!paused) {
  logger.debug("I'm logging, but I will stop once we start buffering");
}