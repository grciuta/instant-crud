const program = require('commander');

program.command('migrate')
    .description('Migrations controller for IM project (Instant Message).')
    .option('-m, --migrate [migration]', 'Migration of defined instance. If not defined, migrates all instances defined in `config/app-migrations.json` file.')
    .action((options) => {
        if (options.migrate) {
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
        }
    });

program.parse(process.argv);