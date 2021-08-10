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
        let provider = '';
        let platform = '';
        let provider_desc = '';
        let platform_desc = '';
        let platform_type = '';
        let quetions = [{
                type: "input",
                name: "provider",
                message: "Provider's name (*):",
                validate: function (input) {
                    let done = this.async();
                    if (!input) {
                        done("Provider's name cannot be empty");
                        return
                    };
                    done(null, true);
                }
            },
            {
                type: "input",
                name: "platform",
                message: "Platform's name (optional):",
                // validate: function (input) {
                //     let done = this.async();
                //     if (!input) {
                //         done("Platform's name cannot be empty");
                //         return
                //     };
                //     done(null, true);
                // }
            }, {
                type: "input",
                name: "pr_desc",
                message: "Provider's description (optional):"
            },
            {
                type: "input",
                name: "pl_desc",
                message: "Platform's description (optional):"
            },
            {
                type: "list",
                name: "pl_type",
                message: "Platform's type (*):",
                choices: ["text", "email", "other"]
            }
        ]

        await inquirer.prompt(quetions)
            .then(async (answers) => {
                provider = answers.provider;
                platform = answers.platform;
                provider_desc = answers.pr_desc;
                platform_desc = answers.pl_desc;
                platform_type = answers.pl_type;

                if (answers.pl_type == "other") {
                    await inquirer.prompt([{
                            type: "input",
                            name: "other_type",
                            message: "other type name (*):"
                        }])
                        .then((answer) => {
                            platform_type = answer.other_type;
                            return
                        })
                };
            })
            .catch((error) => {
                if (error.isTtyError) {
                    return console.log("couldn't be rendered in the current environment")
                } else {
                    console.log(error)
                }
            });

        if (!platform) {
            if (!fs.existsSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}`)) {
                fs.mkdirSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}`, {
                    recursive: true
                })

                fs.appendFileSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/info.json`,
                    `
{
    "name":"${provider}",
    "description":"${provider_desc}",
    "platforms":[]
}
                `
                )

                return console.log(chalk.white.bgGreen(`swob <provider>: ${camelCase(provider, {pascalCase: true})} created successfully!`))
            } else {
                return console.log(chalk.white.bgRed(`swob: Cannot create Provider '${camelCase(provider, {pascalCase: true})}': Provider exist already!`))
            }
        };

        if (!fs.existsSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/${camelCase(platform, {pascalCase: true})}.js`)) {

            if (!fs.existsSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}`)) {
                fs.mkdirSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}`, {
                    recursive: true
                })

                fs.appendFileSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/info.json`,
                    `
{
    "name":"${provider}",
    "description":"${provider_desc}",
    "platforms":[]
}
                `
                )
            };

            fs.appendFileSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/${camelCase(platform, {pascalCase: true})}.js`,
                `const Factory = //require("...");
                        
module.exports =
                
    class ${camelCase(platform, {pascalCase: true})} extends Factory {
        init() {
            return;
        };
        
        validate() {
            return;
        };
        
        revoke() {
            return;
        }
    }`
            )

            let data = fs.readFileSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/info.json`, 'utf8')

            info = JSON.parse(data);
            info.platforms.push({
                name: `${platform}`,
                description: `${platform_desc}`,
                type: `${platform_type}`
            });
            json = JSON.stringify(info);
            fs.writeFileSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/info.json`, json, 'utf8');

            return console.log(chalk.white.bgGreen(`swob <platform>: ${camelCase(provider, {pascalCase: true})} ${camelCase(platform, {pascalCase: true})} created successfully!`))
        } else {
            return console.log(chalk.white.bgRed(`swob: Cannot create Platform '${camelCase(platform, {pascalCase: true})}': Platform exist already!`))
        }
    });

program.addHelpText('after', `
Examples:
  $ swob create
`);

program.showHelpAfterError();
program.parse();