const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { start, succeed, fail } = require("./spinner");
const { execWrapper, getDeps, selectPmCommand } = require("./utils");
const { installAddons, moveFiles } = require("./install-addons");

async function create(projectName, options) {
  start(
    chalk.yellow(
      `Creating directory and initializing with ${options.packageManger}...`
    )
  );
  // create folder and initialize yarn
  await execWrapper(
    `mkdir ${projectName} && cd ${projectName} && ${selectPmCommand(
      options.packageManager,
      "yarn",
      "npm"
    )} init -y`,
    "Creating directory and initializing yarn..."
  );

  succeed(
    chalk.bgGreen.bold(
      `Creating directory and initializing with ${options.packageManager}...`
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
    console.log(
      path.join(__dirname, `templates/${options.template}/package.json`)
    );
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
  console.log("deps: ", packageJson.deps);
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
