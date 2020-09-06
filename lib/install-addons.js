const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { start, succeed, fail } = require("./spinner");
const { execWrapper, selectPmCommand } = require("./utils");

const ROUTER = "router";
const ADD_ONS = [ROUTER];

function replaceFileContent(file, replacement) {
  var contents = fs.readFileSync(replacement);
  fs.writeFileSync(file, contents);
}

exports.moveFiles = async (name, { addOn }) => {
  const addOns = addOn.map((a) => a.toLowerCase());

  if (addOns.includes(ROUTER)) {
    try {
      start(chalk.yellow("Moving addon files..."));
      // index.html
      replaceFileContent(
        `${name}/index.html`,
        path.join(__dirname, `templates/addons/router/index.html`)
      );

      // src/router.ts
      await fs.copy(
        path.join(__dirname, `templates/addons/router/src/router.ts`),
        `${name}/src/router.ts`
      );

      // src/index.ts
      replaceFileContent(
        `${name}/src/index.ts`,
        path.join(__dirname, `templates/addons/router/src/index.ts`)
      );

      // src/components/about
      await fs.copy(
        path.join(
          __dirname,
          `templates/addons/router/src/components/about/about.html`
        ),
        `${name}/src/components/about/about.html`
      );
      await fs.copy(
        path.join(
          __dirname,
          `templates/addons/router/src/components/about/about.css`
        ),
        `${name}/src/components/about/about.css`
      );
      await fs.copy(
        path.join(
          __dirname,
          `templates/addons/router/src/components/about/about.ts`
        ),
        `${name}/src/components/about/about.ts`
      );
      await fs.copy(
        path.join(
          __dirname,
          `templates/addons/router/src/components/about/index.ts`
        ),
        `${name}/src/components/about/index.ts`
      );
    } catch (err) {
      fail(chalk.bgRed.bold("Moving addon files..."));
      throw err;
    }
  }
};

exports.installAddons = async (name, { addOn, packageManager }) => {
  async function installRouter() {
    await execWrapper(
      `cd ${name} && ${selectPmCommand(
        packageManager,
        `yarn add`,
        `npm install`
      )} @profiscience/knockout-contrib-router`
    );
  }

  start(chalk.yellow("Installing addon..."));
  const addOns = addOn.map((a) => a.toLowerCase());
  if (addOns.includes(ROUTER)) {
    try {
      await installRouter();
    } catch (err) {
      fail(chalk.bgRed.bold("Installing addons..."));
      throw err;
    }
  }

  succeed(chalk.bgGreen.bold("Installing addons..."));

  // log requested add-ons that are not supported
  const notSupported = addOns.filter((a) => !ADD_ONS.includes(a));

  if (notSupported.length > 0) {
    console.log(
      chalk.yellow(
        `The following add-ons are not supported and were not installed: ${notSupported.join(
          ", "
        )}.`
      )
    );
  }

  return;
};
