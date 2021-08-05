#! /usr/bin/env node

const {
    Command
} = require('commander');
const program = new Command();

program
    .requiredOption("-pr, --provider <name>", "Provider's name")
    .requiredOption("-pl, --platform <name>", "Platform's name")
    .action((options) => {
        let provider = options.provider;
        let platform = options.platform;

        console.log(`${provider}, ${platform}`)
    });

program.addHelpText('after', `
Examples:
  $ swob create -pr <name> -pl <name>
`);

program.showHelpAfterError();
program.parse();