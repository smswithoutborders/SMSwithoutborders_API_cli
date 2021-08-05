#! /usr/bin/env node

const {
    Command
} = require('commander');
const program = new Command();

program.version('0.0.1', '-v, --vers', 'output the current version');

program
    .command('create', "Creates a new Provider/Platform with empty template")

program.addHelpText('after', `
Examples:
  $ swob -v
  $ swob -h
  $ swob create [options]
  $ swob help [command]`);

program.showHelpAfterError();
program.parse();