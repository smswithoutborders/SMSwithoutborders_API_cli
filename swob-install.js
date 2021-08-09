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
        let provider = "";
        let platform = "";
        let avail = []

        const url = "https://github.com/smswithoutborders/Downloads";
        const to = 8000

        async function search(url) {
            console.log(chalk.white.bgBlue('Searching for Providers ...'))
            await Axios({
                url,
                method: 'GET',
                responseType: 'stream',
                timeout: to
            }).then((res) => {
                const file = fs.createWriteStream(`${__dirname}/temp/`);

                res.data.pipe(file);
                res.data.on('timeout', () => {
                    fs.unlinkSync(`${__dirname}/temp/`)
                    return console.log(chalk.white.bgRed("BAD CONNECTION ... RETRY ..."))
                })

                file.on('finish', () => {
                    return console.log(chalk.white.bgGreen("Download complete"))
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
            })
        }

        search(url)
    });

program.addHelpText('after', `
Examples:
  $ swob install
`);

program.showHelpAfterError();
program.parse();