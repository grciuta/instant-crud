import { Coder } from './Coder';

export class ModelInstanceGenerator extends Coder {
    private name: string = null;
    private revertValues = {
        //todo: used type `any`, for making it a bit simplier
        'array': 'Array<any>',
        'date': 'Date',
        'buffer': 'Buffer'
    };
    
    constructor(type: string, name: string, directory: string, file_name: string, config?: string) {
        super(type, directory, file_name, config);
        this.name = this.camelCase(name);
    }
    // import part...
    public async modelImports(relations: Array<any>): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            // import current instance interface...
            this.import(`${this.name}Interface, ${this.name}Schema`, `../interfaces/${this.name}`, false, '');
            // import current instance repository...
            this.import(`${this.name}Repository`, `../repositories/${this.name}`, false, '');
            // array of already used table names of 'realtions'
            let usedModelImports = [];
            // if relations, add additional Interfaces & Repositories...
            relations.forEach((relation, index) => {
                if (usedModelImports.indexOf(relation.table) < 0) {
                    let camelCaseName = this.camelCase(relation.table);

                    if (this.name !== camelCaseName) {
                        this.import(`${camelCaseName}Interface`, `../interfaces/${camelCaseName}`, false, '');
                        this.import(`${camelCaseName}Repository`, `../repositories/${camelCaseName}`, false, '');
                        usedModelImports.push(relation.table);
                    }
                }
            });
            this.startMultiLineComment();
            this.writeComment(`Model of ${this.name} migration...`);
            this.writeComment(`All get functions modelled by app-migrations.json > visible_columns...`);
            this.writeComment(`Other function described by default...`);
            this.endMultiLineComment();
            resolve(true);
        });
    }
    // import declaration...
    public async modelDeclaration(columns: Array<any>, visibleColumns: Array<any>, relations: Array<any>): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            await this.declaration('class', `${this.name}Model`);
            // add instance varaibles...
            await this.writeComment(`${this.name} instance variables...`);
            await this.expression('private', `_${this.name.toLowerCase()}Model`, `${this.name}Interface`);
            //add constructor...
            await this.construct([`${this.name.toLowerCase()}Model: ${this.name}Interface`]);
            await this.expression('', `this._${this.name.toLowerCase()}Model`, '', `${this.name.toLowerCase()}Model`); 
            await this.endConstruct();
            await this.startMultiLineComment();
            await this.writeComment(`'get' methods of instance...`);
            await this.endMultiLineComment();
            await this.startFunction('public', `_getId`, [], 'any');
            await this.writeLine(`return this._${this.name.toLowerCase()}Model._id;`);
            await this.endFunction();
            await this.startFunction('public', `_getCreatedAt`, [], 'Date');
            await this.writeLine(`return this._${this.name.toLowerCase()}Model.created_at;`);
            await this.endFunction();
            await this.startFunction('public', `_getUpdatedAt`, [], 'Date');
            await this.writeLine(`return this._${this.name.toLowerCase()}Model.updated_at;`);
            await this.endFunction();
            // getter type functions
            if (visibleColumns) {
                for (let i = 0; i < columns.length; i++) {
                    let column: any = columns[i];
                    if (visibleColumns.indexOf(column.name) > -1) {
                        await this.writeComment(`Instance '${column.name}' column getter...`);
                        const related = relations.filter((relation, index) => {
                            return relation.item_field === column.name;
                        });

                        if (related.length > 0) {
                            // additional, just item like get function...
                            await this.startFunction('public', `_get${this.camelCase(column.name)}Plain`, [], 'any');
                            await this.writeLine(`return this._${this.name.toLowerCase()}Model.${column.name};`);
                            await this.endFunction();

                            if (related[0].is_array) {
                                await this.startFunction('public', `_get${this.camelCase(related[0].item_field)}`, [{name: 'skip', type: 'Number'}, {name: 'limit', type: 'Number'}], 'Promise<any>');
                                await this.writeLine(`return this._select${this.camelCase(related[0].item_field)}(skip, limit);`);
                            } else {
                                await this.startFunction('public', `_get${this.camelCase(related[0].item_field)}`, [], 'Promise<any>');
                                await this.writeLine(`return this._select${this.camelCase(related[0].item_field)}();`);
                            }
                        } else {
                            await this.startFunction('public', `_get${this.camelCase(column.name)}`, [], this.revertValues.hasOwnProperty(column.type) ? this.revertValues[column.type] : column.type);
                            await this.writeLine(`return this._${this.name.toLowerCase()}Model.${column.name};`);
                        }
                        await this.endFunction();
                    }
                }
            }
            // relational functions
            if (relations && relations.length > 0) {
                await this.startMultiLineComment();
                await this.writeComment(`'relational' methods of instance...`);
                await this.endMultiLineComment();

                for (let i = 0; i < relations.length; i++) {
                    let relation: any = relations[i];
                    let camelCaseName = this.camelCase(relation.item_field);

                    await this.writeComment(`Selet '${camelCaseName}' object instance${relation.is_array? 's' : ''} (mapped by ${relation.property} property)...`);
                    if (relation.is_array) {
                        await this.startFunction('public', `_select${camelCaseName}`, [{name: 'skip', type: 'any'}, {name: 'limit', type: 'any'}], `Promise<any>`);
                    } else {
                        await this.startFunction('public', `_select${camelCaseName}`, [], `Promise<any>`);
                    }
                    await this.writeLine(`return new Promise((resolve, reject) => {`);
                    await this.startStatement(`this._${this.name.toLowerCase()}Model.${relation.item_field} === undefined`, -1);
                    if (!relation.is_array) {
                        // await this.startStatement(`${relation.property} === undefined`, -1);
                        await this.writeLine('resolve({});', 1);
                    } else {
                        // await this.startStatement(`this._${this.name.toLowerCase()}Model.${relation.item_field} === undefined`, -1);
                        await this.writeLine('resolve([]);', 1);
                    }
                    await this.endStatement(1);

                    await this.writeComment(`Instance repository...`, 1);
                    await this.writeLine(`let rep = new ${this.camelCase(relation.table)}Repository();`, 1);
                    
                    if (relation.is_array) {
                        await this.writeLine(`rep.find({${relation.property}: {$in: this._${this.name.toLowerCase()}Model.${relation.item_field}}}, null, null, (err, res) => {`, 1);
                    } else {
                        await this.writeLine(`rep.findById(this._${this.name.toLowerCase()}Model.${relation.property}, (err, res) => {`, 1);
                        // await this.writeLine(`rep.findById(${relation.property}, (err, res) => {`, 1);
                    }
                    await this.startStatement(`err`);
                    await this.writeLine(`reject(err);`, 2);
                    await this.endStatement(2);
                    await this.writeLine(`resolve(res);`, 2);
                    
                    if (relation.is_array) {
                        await this.writeLine(`}).skip(skip).limit(limit);`, 1);
                    } else {
                        await this.writeLine(`})`, 1);
                    }
                    await this.writeLine(`});`);
                    await this.endFunction();
                }
            }
            // setter type functions
            await this.startMultiLineComment();
            await this.writeComment(`'set' methods of instance...`);
            await this.endMultiLineComment();
            for (let i = 0; i < columns.length; i++) {
                let column: any = columns[i];

                await this.writeComment(`Instance '${column.name}' column setter...`);
                await this.startFunction('public', `_set${this.camelCase(column.name)}`, [{name: 'value', type: this.revertValues.hasOwnProperty(column.type) ? this.revertValues[column.type] : column.type}], 'void');
                await this.writeLine(`this._${this.name.toLowerCase()}Model.${column.name} = value;`);
                await this.endFunction();
            }

            // default function ((no CR)UD) declarations...
            
            await this.startMultiLineComment();
            await this.writeComment(`'(no CR)UD' methods of instance...`);
            await this.endMultiLineComment();
            await this.writeComment(`Specific instance saving...`);
            await this.startFunction('public', `save`, [], `Promise<boolean>`);
            await this.writeLine(`return new Promise((resolve, reject) => {`);
            await this.writeLine(`${this.name}Schema.collection.save(this._${this.name.toLowerCase()}Model, (error: any) => {`, 1);
            await this.startStatement(`error`);
            await this.writeLine(`reject(error);`, 2);
            await this.endStatement(2);
            await this.writeLine(`resolve(true);`, 2);
            await this.writeLine(`});`, 1);
            await this.writeLine(`});`);
            await this.endFunction();
            
            await this.writeComment(`Specific instance deleting...`);
            await this.startFunction('public', `delete`, [], `Promise<boolean>`);
            await this.writeLine(`return new Promise((resolve, reject) => {`);
            await this.writeLine(`${this.name}Schema.collection.remove(this._${this.name.toLowerCase()}Model, (error: any) => {`, 1);
            await this.startStatement(`error`);
            await this.writeLine(`reject(error);`, 2);
            await this.endStatement(2);
            await this.writeLine(`resolve(true);`, 2);
            await this.writeLine(`});`, 1);
            await this.writeLine(`});`);
            await this.endFunction();

            // close declaration...
            await this.endDeclaration();
            resolve(true);
        });
    }

    public async sealModel(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            await this.writeComment(`Sealing object instance...`);
            await this.writeLine(`Object.seal(${this.name}Model);`);
            resolve(true);
        });
    }
}