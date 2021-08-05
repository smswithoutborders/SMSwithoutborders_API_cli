#! /usr/bin/env node

const {
    Command
} = require('commander');
const program = new Command();
var inquirer = require('inquirer');

program
    .action(() => {
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
                message: "Platform's name (*):",
                validate: function (input) {
                    let done = this.async();
                    if (!input) {
                        done("Platform's name cannot be empty");
                        return
                    };
                    done(null, true);
                }
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

        inquirer.prompt(quetions)
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
                }
                console.log(provider, platform, provider_desc, platform_desc, platform_type)
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