#!/usr/bin/env node

const { program } = require('commander');
const create = require('../lib/create');

program
  .version(`knockout-cli ${require('../package').version}}`)
  .usage('<command> [options]');

program
  .command('create <app-name>')
  .description('create a new project powered by knockout-cli')
  .option('-t', '--template <template-name>', 'select a template for the new project')
  .action((name, opts) => {    
    const options = cleanArgs(opts);
    if (!options.template) {
      options.template = 'default';
    }

    create(name, options);
  });

program.parse(process.argv)

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''));
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }

  });

  return args;
}