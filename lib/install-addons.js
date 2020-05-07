const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { start, succeed, fail } = require('./spinner');

const KO_COMPONENT_ROUTER ='ko-component-router';
const ADD_ONS = [ KO_COMPONENT_ROUTER ];

module.exports = async (name, { addOn }) => {
  async function installKoComponentRouter() {
    try {
      await fs.copy(path.join(__dirname, `templates/addons/router/router.ts`), 
      `${name}/src/router.ts`);
    } catch (err) {
      fail(chalk.bgRed.bold('Installing extra features...'));
      console.error(err);
    }
  }

  start(chalk.yellow('Installing extra features...'));

  const addOns = addOn.map(a => a.toLowerCase());

  if (addOns.includes(KO_COMPONENT_ROUTER)) {
    await installKoComponentRouter();
  }

  succeed(chalk.bgGreen.bold('Installing extra features...'));

  // log requested add-ons that are not supported
  const notSupported = addOns.filter(a => !ADD_ONS.includes(a));

  if (notSupported.length > 0) {
    console.log(chalk.yellow(`The following add-ons are not supported and were not installed: ${notSupported.join(', ')}.`))
  }
  
  return;
}