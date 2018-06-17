import { Reader } from './Reader';
import { Config } from './Config';
import { DB } from './DB';
import * as path from 'path';
import { Spinner } from 'cli-spinner';

export default class Generator {
    public static async generateAll(migrations_path: string, config_path?: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            migrations_path = path.join(process.cwd(), migrations_path);
            config_path = path.join(process.cwd(), config_path);
            
            if (Reader.__bindFile(migrations_path) && Config.__init(config_path) && DB.__init() && typeof DB.__connect() !== 'undefined') {
                const allMIgrationObjects: any = Reader.__get_full();

                if (allMIgrationObjects !== undefined) {
                    const loader = new Spinner('Generating...');
                    loader.setSpinnerString('|/-\\');
                    const migrations: Array<any> = Object.keys(allMIgrationObjects);
                    loader.start();
                    migrations.forEach(async (key, index) => {
                        if (allMIgrationObjects.hasOwnProperty(key)) {
                            await this.generateOne(migrations_path, key, config_path);

                            if (index === migrations.length - 1) {
                                loader.stop(true);
                                resolve(true);
                            }
                        }
                    });
                }
            } else {
                resolve(false);
            }
        });
    }

    public static async generateOne(migrations_path: string, name: string = null, config_path?: string): Promise<boolean> {
        return new Promise<boolean>( async (resolve) => {
            if (Reader.__bindFile(migrations_path) && Config.__init(config_path) && DB.__init() && typeof DB.__connect() !== 'undefined') {
                let item: any = Reader.__get(name);
                
                if (item) {
                    let migrator = require('./StaticMigration').default;
                    let migratorInstance = new migrator(DB.__connect(), name, item, config_path);
                    resolve(await migratorInstance.up());
                }
            } else {
                resolve(false);
            }
        });
    }
}