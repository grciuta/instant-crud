import { Connection, Collection, Document, Schema, Model } from 'mongoose';
import { BaseMigration } from "./BaseMigration";
import { DB } from './DB';
import { ModelGenerator } from './ModelGenerator';
import { RepositoryGenerator } from './RepositoryGenerator';
import { ModelInstanceGenerator } from './ModelInstanceGenerator';

export default class StaticMigration extends BaseMigration {
    private name: string = null;
    private conn: Connection = null;
    private config: string = null;

    constructor(connection: Connection, name: string, columns: any, config_path?: string) {
        super(columns.columns, columns.visible_columns, columns.relations);

        this.name = name;
        this.conn = connection;
        this.config = config_path;
    }

    public async up(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            // create new collection...
            this.conn.createCollection(this.name, {}, async (err: any, collection: Collection) => {
                if (err) {
                    // console.log(`Migration for ${this.name} unsucessfull!\nError: ${err}`);
                    reject(false);
                } else {
                    // generate model...
                    let modelGen = new ModelGenerator('interface', this.name, 'interfaces', `${this.name}.ts`, this.config);
                    await modelGen.remove();
                    await modelGen.modelImports();
                    await modelGen.modelDeclaration(this.getColumns());
                    await modelGen.modelSchema(this.schemaColumnsString);
                    await modelGen.exportModel();

                    // generate repository...
                    let repositoryGen = new RepositoryGenerator('repository', this.name, 'repositories', `${this.name}.ts`, this.config);
                    await repositoryGen.remove();
                    await repositoryGen.repositoryImports();
                    await repositoryGen.repositoryDeclaration();
                    await repositoryGen.sealRepository();

                    // generate interface...
                    let modelInstanceGen = new ModelInstanceGenerator('model', this.name, 'models', `${this.name}.ts`, this.config);
                    await modelInstanceGen.remove();
                    await modelInstanceGen.modelImports(this.getRelations());
                    await modelInstanceGen.modelDeclaration(this.getColumns(), this.getVisibleColumns(), this.getRelations());
                    await modelInstanceGen.sealModel();
                    
                    resolve(true);
                }
            });
        });
    }

    public down(): void {
        // drop schema...
    }
}