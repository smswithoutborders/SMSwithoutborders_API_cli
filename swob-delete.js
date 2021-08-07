#! /usr/bin/env node

const {
    Command
} = require('commander');
const program = new Command();
var inquirer = require('inquirer');
const fs = require("fs");
const camelCase = require('camelcase');
const chalk = require('chalk');

program
    .action(async () => {
        let provider = [];
        let platform = [];
        let avail = []

        if (fs.existsSync(process.cwd() + '/Providers')) {
            let providers = fs.readdirSync(process.cwd() + '/Providers')

            if (providers.length < 1) {
                let warning = chalk.keyword('orange')
                console.log(warning("WARNING: No providers found, use SWOB-CLI to create a provider"));
                console.log(warning("Follow the link below to setup SWOB-CLI:"));
                console.log(chalk.blue("https://github.com/smswithoutborders/SMSwithoutborders_Dev_Tools/tree/master/SWOB_API_Tools/SWOB-CLI"));
            }

            //listing all files using forEach
            providers.forEach(function (provider) {
                let data = fs.readFileSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/info.json`, 'utf8');
                let info = JSON.parse(data);

                avail.push(`${info.name}`)
                for (let i = 0; i < info.platforms.length; i++) {
                    avail.push(`  ${info.name} - ${info.platforms[i].name}`)
                };

            });

        } else {
            let warning = chalk.keyword('orange')
            console.log(warning("WARNING: No providers found, use SWOB-CLI to create a provider"));
            console.log(warning("Follow the link below to setup SWOB-CLI:"));
            console.log(chalk.blue("https://github.com/smswithoutborders/SMSwithoutborders_Dev_Tools/tree/master/SWOB_API_Tools/SWOB-CLI"));
        }

        let quetions = [{
            type: "list",
            name: "available",
            message: "Platform's type (*):",
            choices: avail
        }]

        await inquirer.prompt(quetions)
            .then(async (answers) => {
                if (answers.available.includes(" - ")) {
                    let sl = answers.available.split(" - ");
                    provider = sl[0].trim();
                    platform = sl[1];
                } else {
                    provider = answers.available;
                    platform = "";
                }

                console.log(provider);
                console.log(platform);
            })
            .catch((error) => {
                if (error.isTtyError) {
                    console.log("couldn't be rendered in the current environment")
                } else {
                    console.log(error)
                }
            });
    });

program.addHelpText('after', `
Examples:
  $ swob create
`);

program.showHelpAfterError();
program.parse();