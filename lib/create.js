const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { start, succeed, fail } = require("./spinner");
const { execWrapper, getDeps, selectPmCommand } = require("./utils");
const { installAddons, moveFiles } = require("./install-addons");
const glob = require("glob");

async function create(projectName, options) {
  const pm = selectPmCommand(
    options.packageManager,
    "yarn",
    "npm"
  );

  start(
    chalk.yellow(
      `Creating directory and initializing with ${pm}...`
    )
  );
  // create folder and initialize yarn
  await execWrapper(
    `mkdir ${projectName} && cd ${projectName} && ${pm} init -y`,
    `Creating directory and initializing with ${pm}...`
  );

  succeed(
    chalk.bgGreen.bold(
      `Creating directory and initializing with ${pm}...`
    )
  );

  // copy template files and add scripts to new package.json
  start(chalk.yellow("Copying template files..."));

  const packageJson = require(path.join(
    __dirname,
    `/templates/${options.template}/package.json`
  ));
  const newPackageJson = `${projectName}/package.json`;

  try {
    const file = fs.readFileSync(newPackageJson);
    const data = file.toString();
    const withScripts = `${data.slice(
      0,
      data.lastIndexOf("}")
    )}, "scripts": ${JSON.stringify(packageJson.scripts)} }`;
    fs.writeFileSync(newPackageJson, withScripts, (err2) => err2 || true);
  } catch (err) {
    fail(chalk.bgRed.bold("Copying template files..."));
    throw err;
  }

  const filesToCopy = [
    "README.md",
    "webpack.config.js",
    "tsconfig.json",
    ".babelrc",
    "index.html",
    "favicon.ico",
  ];

  for (let i = 0; i < filesToCopy.length; i += 1) {
    fs.createReadStream(
      path.join(__dirname, `templates/${options.template}/${filesToCopy[i]}`)
    ).pipe(fs.createWriteStream(`${projectName}/${filesToCopy[i]}`));
  }

  try {
    await fs.copy(
      path.join(__dirname, `templates/${options.template}/src`),
      `${projectName}/src`
    );
  } catch (err) {
    fail(chalk.bgRed.bold("Copying template files..."));
    throw err;
  }

  succeed(chalk.bgGreen.bold("Copying template files..."));

  // install dependencies
  start(chalk.yellow("Installing dependencies..."));
  const devDeps = getDeps(packageJson.devDependencies);
  const deps = getDeps(packageJson.dependencies);
  await execWrapper(
    `cd ${projectName} && ${selectPmCommand(
      options.packageManager,
      `yarn add ${devDeps} -D`,
      `npm install ${devDeps} -D`
    )} && ${selectPmCommand(
      options.packageManager,
      `yarn add ${deps}`,
      `npm install ${deps}`
    )}`,
    "Installing dependencies..."
  );

  succeed(chalk.bgGreen.bold("Installing dependencies..."));

  // include add-ons
  if (options.addOn) {
    try {
      await moveFiles(projectName, options);
      await installAddons(projectName, options);
    } catch (err) {
      throw err;
    }
  }

  if (options.vanilla) {
    start(chalk.yellow("Adding vanilla..."));
    await execWrapper(`cd ${projectName} && npx tsc --module esnext`);
    await fs.unlink(`${projectName}/tsconfig.json`);
    glob(`${projectName}/**/*.ts`, async (err, matches) => {
      if (matches) {
        for (const match of matches) {
          await fs.unlink(match);
        }
      }
    });
    const webpackFile = await fs.readFile(`${projectName}/webpack.config.js`, "utf-8");
    await fs.writeFile(`${projectName}/webpack.config.js`, webpackFile.replace(/\.ts/g, '.js'))
    succeed(chalk.bgGreen.bold("Adding vanilla..."));
  }

  console.log(
    chalk.blueBright(`
    🥊 Your knockout project has been created! 🥊
    ${chalk.whiteBright(`cd ${projectName}`)} and run ${chalk.whiteBright(
      "yarn start"
    )} to spin up the development server.
    Happy coding.
  `)
  );
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.error(err);
    process.exit(-1);
  });
};
