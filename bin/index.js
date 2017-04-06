#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const figlet = require('figlet');
const package = require('../package');

program
  .command('init')
  .description('init a new project')
  .action(function() {
    shell.cp(`~/.npm/cherry-pit/${package.version}/package.tgz`, './');
    shell.exec('tar -zxvf package.tgz', function(code, stdout, stderr) {
      shell.mv('package', 'cherry');
      shell.rm('package.tgz');
      console.log(figlet.textSync('cherry', {
        font: 'Slant',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      }));
      console.log('project initialization is finished.');
    });
  });

program.parse(process.argv);