const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const ora = require('ora');
const chalk = require('chalk');

async function create (projectName, options) {
  const spinner = ora(chalk.yellow('Creating directory and initializing yarn...')).start();
  // create folder and initialize yarn
  await execWrapper(`mkdir ${projectName} && cd ${projectName} && yarn init -y`,
    spinner,
    'Creating directory and initializing yarn...');

  spinner.succeed(chalk.bgGreen.bold('Creating directory and initializing yarn...'));

  // copy template files and add scripts to new package.json
  spinner.start(chalk.yellow('Copying template files...'));
  const packageJson = require(path.join(__dirname, `templates/${options.template}/package.json`));
  const newPackageJson = `${projectName}/package.json`;
  fs.readFile(newPackageJson, (err, file) => {
    if (err) throw err;
    const data = file.toString();
    const withScripts = `${data.slice(0, data.lastIndexOf('}'))}, "scripts": ${JSON.stringify(packageJson.scripts)} }`;
    fs.writeFile(newPackageJson, withScripts, err2 => err2 || true);
  });
  
  const filesToCopy = ['README.md', 'webpack.config.js', 'tsconfig.json', '.babelrc', 'index.html', 'favicon.ico'];

  for (let i = 0; i < filesToCopy.length; i += 1) {
    fs
      .createReadStream(path.join(__dirname, `templates/${options.template}/${filesToCopy[i]}`))
      .pipe(fs.createWriteStream(`${projectName}/${filesToCopy[i]}`));
  }

  try {
    await fs.copy(path.join(__dirname, `templates/${options.template}/src`), 
    `${projectName}/src`);
  } catch (err) {
    succeed.fail(chalk.bgRed.bold('Copying template files...'));
    console.error(err);
  }

  spinner.succeed(chalk.bgGreen.bold('Copying template files...'));
  
  // Install yarn dependencies
  spinner.start(chalk.yellow('Installing dependencies...'));
  const devDeps = getDeps(packageJson.devDependencies);
  const deps = getDeps(packageJson.dependencies);
  await execWrapper(`cd ${projectName} && yarn add ${devDeps} -D && yarn add ${deps}`,
    spinner,
    'Installing dependencies...')

  spinner.succeed(chalk.bgGreen.bold('Installing dependencies...'));

  console.log(chalk.blueBright(`
    🥊 Your knockout project has been created! 🥊
    ${chalk.whiteBright(`cd ${projectName}`)} and run ${chalk.whiteBright('yarn start')} to spin up the development server.
    Happy coding.
  `))
}

function getDeps(deps) {
  return Object.entries(deps)
  .map(dep => `${dep[0]}@${dep[1]}`)
  .toString()
  .replace(/,/g, ' ')
  .replace(/^/g, '');
}

async function execWrapper(command, spinner, msg) {
  try {
    await exec(command);
  } catch(err) {
    spinner.fail(chalk.bgRed.bold(msg));
    console.error('Error: ', chalk.red(err));
    process.exit(-1)
  }
}

module.exports = (...args) => {
  return create(...args)
    .catch(err => {
      console.error(err);
    });
}