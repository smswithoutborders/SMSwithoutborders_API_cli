## SWOB-CLI

### Set-Up
Clone project
```
git clone git@github.com:smswithoutborders/SWOB-CLI.git
```
Move into the SWOB-CLI direcotry
```
cd SWOB-CLI/
```
### Installation
install dependencies
```
npm install
```
install SWOB-CLI globally
```
sudo npm install -g
```
### Test installation
```
swob --version

> SWOB-CLI Version 0.0.1
```
### Uninstall SWOB-CLI
```
sudo rm swob -g
```
### Commands
NB: All commands should be executed in the root directory of a SWOB project only for desired results
```
Usage:

<> = required
[] = optional

swob c, create <provider> [platform]    Create a new Provider
swob d, delete <provider> [platform]    Delete a Provider
swob i, install <provider> <platform>   Download a Provider
swob -v, --version                      Show version
swob help                               Help

NB: Please run these commands in the root directory of your SWOB project only
```