import { Coder } from './Coder';

/**
 * Instance responsible for generating Mongo Repository Class...
 */
export class RepositoryGenerator extends Coder {
    private name: string = null;

    constructor(type: string, name: string, directory: string, file_name: string) {
        super(type, directory, file_name);
        this.name = this.camelCase(name);
    }
    // import part...
    public async repositoryImports(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            // import `mongoose` instance objects...
            this.import(`${this.name}Interface, ${this.name}Schema`, `../interfaces/${this.name}`, false, '');
            this.import('RepositoryBase', '../repositories/BaseRepository', false, '');
            this.startMultiLineComment();
            this.writeComment(`Repository of ${this.name} migration...`);
            this.endMultiLineComment();

            resolve(true);
        });
    }

    public async repositoryDeclaration(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            await this.declaration('class', `${this.name}Repository`, `RepositoryBase<${this.name}Interface>`);
            await this.construct();
            await this.writeLine(`super(${this.name}Schema);`);
            await this.endConstruct();
            await this.endDeclaration();

            resolve(true);
        });
    }

    public async sealRepository(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            this.writeComment(`Sealing object instance...`);
            this.writeLine(`Object.seal(${this.name}Repository);`);
            resolve(true);
        });
    }
}