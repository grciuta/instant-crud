#! /usr/bin/env node
'use strict';

const generator = require('./lib/Generator');
const program = require('commander');

program.command('migrate')
    .description('Migrations cli for generating CRUD instances.')
    .option('-m, --migrate [migration]', 'Migration of defined instance. If not defined, migrates all instances defined in `config/app-migrations.json` file.')
    .option('-c, --config [config]', 'Config file path, where MongoDB connection is defined. For more info check https://npmjs.com')
    .action((options) => {
        if (options.migrate && options.config) {
            if (typeof options.migrate === 'boolean') {
                generator.default.generateAll().then(done => {
                    console.log('Migrations executed successfuly!');
                    process.exit(0);
                });
            } else {
                generator.default.generateOne(options.migrate).then(done => {
                    console.log('Migration executed successfuly!');
                    process.exit(0);
                });
            }
        } else {
            console.log('\nPlease provide -m [migrate] and -c [config] options.\n');
        }
    });

program.command('test-directory')
    .description('Shows project root directory')
    .action(() => {
        console.log(__dirname);
    });

program.parse(process.argv);