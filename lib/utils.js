const util = require("util");
const exec = util.promisify(require("child_process").exec);
const chalk = require("chalk");
const { fail } = require("./spinner");

exports.selectPmCommand = function (packageManager, yarnCommand, npmCommand) {
  return packageManager === "yarn" ? yarnCommand : npmCommand;
};

exports.execWrapper = async function (command, msg) {
  try {
    await exec(command);
  } catch (err) {
    fail(chalk.bgRed.bold(msg));
    console.error(chalk.red(err));
    process.exit(-1);
  }
};

exports.getDeps = function (deps) {
  return Object.entries(deps)
    .map((dep) => `${dep[0]}@${dep[1]}`)
    .toString()
    .replace(/,/g, " ")
    .replace(/^/g, "");
};
