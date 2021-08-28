#! /usr/bin/env node

const {
    Command
} = require('commander');
const program = new Command();

program.version('0.0.1', '-v, --vers', 'output the current version');

program
    .command('create', "Create a new Provider/Platform with empty template")
    .command('delete', "Delete Provider/Platform")
    .command('install', "Download Provider/Platform from github")

program.showHelpAfterError();
program.parse();