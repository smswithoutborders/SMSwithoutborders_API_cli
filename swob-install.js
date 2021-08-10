#! /usr/bin/env node

const {
    Command
} = require('commander');
const program = new Command();
var inquirer = require('inquirer');
const fs = require("fs");
const camelCase = require('camelcase');
const chalk = require('chalk');
const Axios = require('axios');
const ProgressBar = require('progress');

program
    .action(async () => {
        let provider = '';
        let platform = '';
        let provider_desc = '';
        let platform_desc = '';
        let platform_type = '';
        let avail = []

        const search_url = "https://raw.githubusercontent.com/smswithoutborders/SMSWithoutborders-Customized_Third-party_OAuths/master/info.json";
        const to = 8000

        async function search(url) {
            console.log(chalk.white.bgBlue('Searching for Providers ...'))
            await Axios({
                url,
                method: 'GET',
                responseType: 'stream',
                timeout: to
            }).then((res) => {
                fs.mkdirSync(`${__dirname}/temp/`, {
                    recursive: true
                })

                const file = fs.createWriteStream(`${__dirname}/temp/info.json`);

                res.data.pipe(file);
                res.data.on('timeout', () => {
                    fs.unlinkSync(`${__dirname}/temp/info.json`)
                    return console.log(chalk.white.bgRed("BAD CONNECTION ... RETRY ..."))
                })

                file.on('finish', async () => {
                    let data = fs.readFileSync(`${__dirname}/temp/info.json`, 'utf8')
                    let info = JSON.parse(data);

                    info.forEach(function (provider) {
                        avail.push(new inquirer.Separator())
                        for (let i = 0; i < provider.platforms.length; i++) {
                            avail.push(`  ${provider.name} - ${provider.platforms[i].name}`)
                        };
                    });

                    fs.rmdirSync(`${__dirname}/temp/`, {
                        recursive: true
                    })

                    let quetions = [{
                        type: "list",
                        name: "available",
                        message: "Select Provider/Platform to be installed (*):",
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

                    // if (fs.existsSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}/${camelCase(platform, {pascalCase: true})}.js`)) {
                    //     return console.log(chalk.white.bgRed(`swob: Cannot create Platform '${camelCase(platform, {pascalCase: true})}': Platform exist already!`))
                    // }

                    if (!fs.existsSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}`)) {
                        fs.mkdirSync(`${process.cwd()}/Providers/${camelCase(provider, {pascalCase: true})}`, {
                            recursive: true
                        })
                    };

                    const download_url = `https://raw.githubusercontent.com/smswithoutborders/SMSWithoutborders-Customized_Third-party_OAuths/master/${camelCase(provider, {pascalCase: true})}/${camelCase(platform, {pascalCase: true})}.js`;

                    download(download_url, `${camelCase(provider, {pascalCase: true})}`, `${camelCase(platform, {pascalCase: true})}.js`)
                    return;
                });
                file.on('error', (err) => {
                    return console.log(chalk.white.bgRed(Error, err))
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
            });
        }


        async function download(url, provider, platform) {
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
                    const setup_url = `https://raw.githubusercontent.com/smswithoutborders/SMSWithoutborders-Customized_Third-party_OAuths/master/${camelCase(provider, {pascalCase: true})}/info.json`;

                    setup(setup_url, `${camelCase(provider, {pascalCase: true})}`, `${camelCase(platform, {pascalCase: true})}.js`);
                    return;
                });
                file.on('error', (err) => {
                    fs.unlinkSync(`${process.cwd()}/Providers/${provider}/${platform}`)
                    return console.log(chalk.white.bgRed(Error, err))
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
        };

        async function setup(url, provider, platform) {
            console.log(chalk.white.bgBlue('Starting setup ...'))
            await Axios({
                url,
                method: 'GET',
                responseType: 'stream',
                timeout: to
            }).then((res) => {
                const file = fs.createWriteStream(`${process.cwd()}/Providers/${provider}/info.json`);

                res.data.pipe(file);
                res.data.on('timeout', () => {
                    fs.unlinkSync(`${process.cwd()}/Providers/${provider}/info.json`);
                    fs.unlinkSync(`${process.cwd()}/Providers/${provider}/${platform}`)
                    return console.log(chalk.white.bgRed("BAD CONNECTION ... RETRY ..."))
                })

                file.on('finish', () => {
                    return console.log(chalk.white.bgGreen("Done"))
                });
                file.on('error', (err) => {
                    fs.unlinkSync(`${process.cwd()}/Providers/${provider}/info.json`);
                    fs.unlinkSync(`${process.cwd()}/Providers/${provider}/${platform}`)
                    return console.log(chalk.white.bgRed(Error, err))
                });
            }).catch(error => {
                if (error.response) {
                    return console.log(error.response.status, error.response.statusText);
                } else if (error.code == 'ECONNABORTED') {
                    `${camelCase(platform, {pascalCase: true})}.js`
                    return console.log(chalk.white.bgRed("BAD CONNECTION ... RETRY ..."))
                } else if (error.code == 'EAI_AGAIN') {
                    return console.log(chalk.white.bgRed("BAD CONNECTION ... RETRY ..."))
                } else {
                    return console.log('Error', error.message);
                }
            })
        }

        search(search_url);
    });

program.addHelpText('after', `
Examples:
  $ swob install
`);

program.showHelpAfterError();
program.parse();