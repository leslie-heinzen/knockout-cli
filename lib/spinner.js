const ora = require("ora");

const spinner = ora();

exports.start = function (msg) {
  spinner.start(msg);
};

exports.succeed = function (msg) {
  spinner.succeed(msg);
};

exports.fail = function (msg) {
  spinner.fail(msg);
};
