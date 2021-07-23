#! /usr/bin/env node

const fs = require("fs");
const camelCase = require('camelcase');
const chalk = require('chalk');
const Axios = require('axios');
const ProgressBar = require('progress');

let input = process.argv.slice(2);

switch (true) {
    case input[0] == "c":
    case input[0] == "create":
        if (!input[1]) {
            console.log(`swob: <provider> argument cannot be empty\n`);
            console.log("Usage:\n");
            console.log("<> = required\n[] = optional\n")
            console.log("swob c, create <provider> [platform]\tCreate a new Provider\n");
            console.log("NB: Please run these commands in the root directory of your SWOB project only");
            break;
        };

        if (!input[2]) {
            if (!fs.existsSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}`)) {
                fs.mkdirSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}`, {
                    recursive: true
                })

                console.log(chalk.white.bgGreen(`swob <provider>: ${camelCase(input[1], {pascalCase: true})} created successfully!`))
            } else {
                return console.log(chalk.white.bgRed(`swob: Cannot create Provider '${camelCase(input[1], {pascalCase: true})}': Provider exist already!`))
            }
            break;
        };

        if (!fs.existsSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}/${camelCase(input[2], {pascalCase: true})}.js`)) {

            if (!fs.existsSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}`)) {
                fs.mkdirSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}`, {
                    recursive: true
                })
            };

            fs.appendFileSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}/${camelCase(input[2], {pascalCase: true})}.js`,
                `const Factory = //require("...");
                        
module.exports =
                
    class ${camelCase(input[2], {pascalCase: true})} extends Factory {
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

            console.log(chalk.white.bgGreen(`swob <platform>: ${camelCase(input[1], {pascalCase: true})} ${camelCase(input[2], {pascalCase: true})} created successfully!`))
        } else {
            return console.log(chalk.white.bgRed(`swob: Cannot create Platform '${camelCase(input[2], {pascalCase: true})}': Platform exist already!`))
        }
        break;
    case input[0] == "d":
    case input[0] == "delete":
        if (!input[1]) {
            console.log(`swob: <provider> argument cannot be empty\n`);
            console.log("Usage:\n");
            console.log("<> = required\n[] = optional\n")
            console.log("swob d, delete <provider> [platform]\tDelete a new Provider\n");
            console.log("NB: Please run these commands in the root directory of your SWOB project only");
            break;
        }
        if (!input[2]) {
            if (fs.existsSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}`)) {
                fs.rmdirSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}`, {
                    recursive: true
                })

                console.log(chalk.white.bgGreen(`swob <provider>: ${camelCase(input[1], {pascalCase: true})} deleted successfully!`))
            } else {
                return console.log(chalk.white.bgRed(`swob: Cannot delete Provider '${camelCase(input[1], {pascalCase: true})}': Provider not found. Please make sure you're in your SWOB project's root directory`))
            }
            break;
        }

        if (fs.existsSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}/${camelCase(input[2], {pascalCase: true})}.js`)) {
            fs.unlinkSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}/${camelCase(input[2], {pascalCase: true})}.js`)

            console.log(chalk.white.bgGreen(`swob <platform>: ${camelCase(input[2], {pascalCase: true})} deleted successfully!`))
        } else {
            return console.log(chalk.white.bgRed(`swob: Cannot delete Platform '${camelCase(input[2], {pascalCase: true})}': Provider not found. Please make sure you're in your SWOB project's root directory`))
        }
        break;
    case input[0] == "i":
    case input[0] == "install":
        if (!input[1]) {
            console.log(`swob: <provider> argument cannot be empty\n`);
            console.log("Usage:\n");
            console.log("<> = required\n[] = optional\n")
            console.log("swob i, install <provider> <platform>\Download a Provider\n");
            console.log("NB: Please run these commands in the root directory of your SWOB project only");
            break;
        };

        if (!input[2]) {
            console.log(`swob: <platform> argument cannot be empty\n`);
            console.log("Usage:\n");
            console.log("<> = required\n[] = optional\n")
            console.log("swob i, install <provider> <platform>\tDownload a Provider\n");
            console.log("NB: Please run these commands in the root directory of your SWOB project only");
            break;
        };

        if (fs.existsSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}/${camelCase(input[2], {pascalCase: true})}.js`)) {
            return console.log(chalk.white.bgRed(`swob: Cannot create Platform '${camelCase(input[2], {pascalCase: true})}': Platform exist already!`))
        }

        if (!fs.existsSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}`)) {
            fs.mkdirSync(`${process.cwd()}/Providers/${camelCase(input[1], {pascalCase: true})}`, {
                recursive: true
            })
        };

        const url = `https://raw.githubusercontent.com/smswithoutborders/SMSwithoutborders_Dev_Tools/master/SWOB_API_Tools/Downloads/${camelCase(input[1], {pascalCase: true})}/${camelCase(input[2], {pascalCase: true})}.js`;
        const to = 8000

        async function download(url, provider, platform) {
            console.log(chalk.white.bgBlue('Connecting ...'))
            await Axios({
                url,
                method: 'GET',
                responseType: 'stream',
                timeout: to
            }).then((res) => {
                const totalLength = res.headers['content-length']

                console.log(chalk.white.bgBlue('Starting download ...'))
                const progressBar = new ProgressBar('-> downloading [:bar] :rate/bps :percent :etas', {
                    width: 40,
                    complete: '=',
                    incomplete: ' ',
                    renderThrottle: 1,
                    total: parseInt(totalLength)
                })

                const file = fs.createWriteStream(`${process.cwd()}/Providers/${provider}/${platform}`);

                res.data.on('data', (chunk) => {
                    progressBar.tick(chunk.length);
                })
                res.data.pipe(file);
                res.data.on('timeout', () => {
                    fs.unlinkSync(`${process.cwd()}/Providers/${provider}/${platform}`)
                    return console.log(chalk.white.bgRed("BAD CONNECTION ... RETRY ..."))
                })

                file.on('finish', () => {
                    return console.log(chalk.white.bgGreen("Download complete"))
                });
                file.on('error', (err) => {
                    return console.log(chalk.white.bgred(Error, err))
                });
            }).catch(error => {
                if (error.response) {
                    return console.log(error.response.status, error.response.statusText);
                } else if (error.code == 'ECONNABORTED') {
                    return console.log(chalk.white.bgRed("BAD CONNECTION ... RETRY ..."))
                } else if (error.code == 'EAI_AGAIN') {
                    return console.log(chalk.white.bgRed("BAD CONNECTION ... RETRY ..."))
                } else {
                    return console.log('Error', error.message);
                }
            })
        }

        download(url, `${camelCase(input[1], {pascalCase: true})}`, `${camelCase(input[2], {pascalCase: true})}.js`)
        break;
    case input[0] == "-v":
    case input[0] == "--version":
        console.log("SWOB-CLI Version 0.0.1")
        break;
    default:
        input.length < 1 || input.length > 3 || input[0] == "help" ? console.log("swob <command> <provider> [platform]\n") : console.log(`swob: ${input[0]} command not found\n`);
        console.log("Usage:\n");
        console.log("<> = required\n[] = optional\n")
        console.log("swob c, create <provider> [platform]\tCreate a new Provider");
        console.log("swob d, delete <provider> [platform]\tDelete a Provider");
        console.log("swob i, install <provider> <platform>\tDownload a Provider");
        console.log("swob -v, --version\t\t\t\Show version");
        console.log("swob help\t\t\t\tHelp\n");
        console.log("NB: Please run these commands in the root directory of your SWOB project only");
        break;
}