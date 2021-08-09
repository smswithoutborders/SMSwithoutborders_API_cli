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
        let provider = "";
        let platform = "";
        let avail = []

        if (fs.existsSync(process.cwd() + '/Providers')) {
            let providers = fs.readdirSync(process.cwd() + '/Providers')

            if (providers.length < 1) {
                let warning = chalk.keyword('orange')
                console.log(warning("WARNING: No providers found, use SWOB-CLI to create a provider"));
                console.log(warning("Follow the link below to setup SWOB-CLI:"));
                console.log(chalk.blue("https://github.com/smswithoutborders/SWOB-CLI"));
                return
            }

            //listing all files using forEach
            providers.forEach(function (provider) {
                let data = fs.readFileSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/info.json`, 'utf8');
                let info = JSON.parse(data);

                avail.push(new inquirer.Separator(), `${info.name}`)
                for (let i = 0; i < info.platforms.length; i++) {
                    avail.push(`  ${info.name} - ${info.platforms[i].name}`)
                };
            });


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
                        platform = false;
                    }
                })
                .catch((error) => {
                    if (error.isTtyError) {
                        return console.log("couldn't be rendered in the current environment")
                    } else {
                        console.log(error)
                    }
                });

            if (!platform) {
                if (fs.existsSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}`)) {
                    fs.rmdirSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}`, {
                        recursive: true
                    })

                    return console.log(chalk.white.bgGreen(`swob <provider>: ${camelCase(provider, {pascalCase: true})} deleted successfully!`))
                } else {
                    return console.log(chalk.white.bgRed(`swob: Cannot delete Provider '${camelCase(provider, {pascalCase: true})}': Provider not found. Please make sure you're in your SWOB project's root directory`))
                }
            }

            if (fs.existsSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/${camelCase(platform, {pascalCase: true})}.js`)) {
                fs.unlinkSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/${camelCase(platform, {pascalCase: true})}.js`);

                let data = fs.readFileSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/info.json`, 'utf8')
                let info = JSON.parse(data);

                for (let i = 0; i < info.platforms.length; i++) {
                    if (info.platforms[i].name == platform) {
                        info.platforms.splice(i, 1);
                    }
                }

                let json = JSON.stringify(info);
                fs.writeFileSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/info.json`, json, 'utf8');

                return console.log(chalk.white.bgGreen(`swob <platform>: ${camelCase(platform, {pascalCase: true})} deleted successfully!`))
            } else {
                return console.log(chalk.white.bgRed(`swob: Cannot delete Platform '${camelCase(platform, {pascalCase: true})}': Provider not found. Please make sure you're in your SWOB project's root directory`))
            }
        } else {
            let warning = chalk.keyword('orange')
            console.log(warning("WARNING: No providers found, use SWOB-CLI to create a provider"));
            console.log(warning("Follow the link below to setup SWOB-CLI:"));
            console.log(chalk.blue("https://github.com/smswithoutborders/SWOB-CLI"));
            return;
        }
    });

program.addHelpText('after', `
Examples:
  $ swob create
`);

program.showHelpAfterError();
program.parse();