"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Coder_1 = require("./Coder");
class ModelInstanceGenerator extends Coder_1.Coder {
    constructor(type, name, directory, file_name) {
        super(type, directory, file_name);
        this.name = null;
        this.revertValues = {
            //todo: used type `any`, for making it a bit simplier
            'array': 'Array<any>',
            'date': 'Date',
            'buffer': 'Buffer'
        };
        this.name = this.camelCase(name);
    }
    // import part...
    modelImports(relations) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // import current instance interface...
                this.import(`${this.name}Interface`, `../interfaces/${this.name}`, false, '');
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
            }));
        });
    }
    // import declaration...
    modelDeclaration(columns, visibleColumns, relations) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield this.declaration('class', `${this.name}Model`);
                // add instance varaibles...
                yield this.writeComment(`${this.name} instance variables...`);
                yield this.expression('private', `_${this.name.toLowerCase()}Model`, `${this.name}Interface`);
                //add constructor...
                yield this.construct([`${this.name.toLowerCase()}Model: ${this.name}Interface`]);
                yield this.expression('', `this._${this.name.toLowerCase()}Model`, '', `${this.name.toLowerCase()}Model`);
                yield this.endConstruct();
                yield this.startMultiLineComment();
                yield this.writeComment(`'get' methods of instance...`);
                yield this.endMultiLineComment();
                yield this.startFunction('public', `_getId`, [], 'any');
                yield this.writeLine(`return this._${this.name.toLowerCase()}Model._id;`);
                yield this.endFunction();
                yield this.startFunction('public', `_getCreatedAt`, [], 'Date');
                yield this.writeLine(`return this._${this.name.toLowerCase()}Model.created_at;`);
                yield this.endFunction();
                yield this.startFunction('public', `_getUpdatedAt`, [], 'Date');
                yield this.writeLine(`return this._${this.name.toLowerCase()}Model.updated_at;`);
                yield this.endFunction();
                // getter type functions
                if (visibleColumns) {
                    for (let i = 0; i < columns.length; i++) {
                        let column = columns[i];
                        if (visibleColumns.indexOf(column.name) > -1) {
                            yield this.writeComment(`Instance '${column.name}' column getter...`);
                            const related = relations.filter((relation, index) => {
                                return relation.item_field === column.name;
                            });
                            if (related.length > 0) {
                                // additional, just item like get function...
                                yield this.startFunction('public', `_get${this.camelCase(column.name)}Plain`, [], 'any');
                                yield this.writeLine(`return this._${this.name.toLowerCase()}Model.${column.name};`);
                                yield this.endFunction();
                                if (related[0].is_array) {
                                    yield this.startFunction('public', `_get${this.camelCase(related[0].item_field)}`, [{ name: 'skip', type: 'Number' }, { name: 'limit', type: 'Number' }], 'Promise<any>');
                                    yield this.writeLine(`return this._select${this.camelCase(related[0].item_field)}(skip, limit);`);
                                }
                                else {
                                    yield this.startFunction('public', `_get${this.camelCase(related[0].item_field)}`, [], 'Promise<any>');
                                    yield this.writeLine(`return this._select${this.camelCase(related[0].item_field)}();`);
                                }
                            }
                            else {
                                yield this.startFunction('public', `_get${this.camelCase(column.name)}`, [], this.revertValues.hasOwnProperty(column.type) ? this.revertValues[column.type] : column.type);
                                yield this.writeLine(`return this._${this.name.toLowerCase()}Model.${column.name};`);
                            }
                            yield this.endFunction();
                        }
                    }
                }
                // relational functions
                if (relations && relations.length > 0) {
                    yield this.startMultiLineComment();
                    yield this.writeComment(`'relational' methods of instance...`);
                    yield this.endMultiLineComment();
                    for (let i = 0; i < relations.length; i++) {
                        let relation = relations[i];
                        let camelCaseName = this.camelCase(relation.item_field);
                        yield this.writeComment(`Selet '${camelCaseName}' object instance${relation.is_array ? 's' : ''} (mapped by ${relation.property} property)...`);
                        if (relation.is_array) {
                            yield this.startFunction('public', `_select${camelCaseName}`, [{ name: 'skip', type: 'any' }, { name: 'limit', type: 'any' }], `Promise<any>`);
                        }
                        else {
                            yield this.startFunction('public', `_select${camelCaseName}`, [], `Promise<any>`);
                        }
                        yield this.writeLine(`return new Promise((resolve, reject) => {`);
                        yield this.startStatement(`this._${this.name.toLowerCase()}Model.${relation.item_field} === undefined`, -1);
                        if (!relation.is_array) {
                            // await this.startStatement(`${relation.property} === undefined`, -1);
                            yield this.writeLine('resolve({});', 1);
                        }
                        else {
                            // await this.startStatement(`this._${this.name.toLowerCase()}Model.${relation.item_field} === undefined`, -1);
                            yield this.writeLine('resolve([]);', 1);
                        }
                        yield this.endStatement(1);
                        yield this.writeComment(`Instance repository...`, 1);
                        yield this.writeLine(`let rep = new ${this.camelCase(relation.table)}Repository();`, 1);
                        if (relation.is_array) {
                            yield this.writeLine(`rep.find({${relation.property}: {$in: this._${this.name.toLowerCase()}Model.${relation.item_field}}}, null, null, (err, res) => {`, 1);
                        }
                        else {
                            yield this.writeLine(`rep.findById(this._${this.name.toLowerCase()}Model.${relation.property}, (err, res) => {`, 1);
                            // await this.writeLine(`rep.findById(${relation.property}, (err, res) => {`, 1);
                        }
                        yield this.startStatement(`err`);
                        yield this.writeLine(`reject(err);`, 2);
                        yield this.endStatement(2);
                        yield this.writeLine(`resolve(res);`, 2);
                        if (relation.is_array) {
                            yield this.writeLine(`}).skip(skip).limit(limit);`, 1);
                        }
                        else {
                            yield this.writeLine(`})`, 1);
                        }
                        yield this.writeLine(`});`);
                        yield this.endFunction();
                    }
                }
                // setter type functions
                yield this.startMultiLineComment();
                yield this.writeComment(`'set' methods of instance...`);
                yield this.endMultiLineComment();
                for (let i = 0; i < columns.length; i++) {
                    let column = columns[i];
                    yield this.writeComment(`Instance '${column.name}' column setter...`);
                    yield this.startFunction('public', `_set${this.camelCase(column.name)}`, [{ name: 'value', type: this.revertValues.hasOwnProperty(column.type) ? this.revertValues[column.type] : column.type }], 'void');
                    yield this.writeLine(`this._${this.name.toLowerCase()}Model.${column.name} = value;`);
                    yield this.endFunction();
                }
                // default function ((no CR)UD) declarations...
                yield this.startMultiLineComment();
                yield this.writeComment(`'(no CR)UD' methods of instance...`);
                yield this.endMultiLineComment();
                yield this.writeComment(`Specific instance saving...`);
                yield this.startFunction('public', `save`, [], `Promise<boolean>`);
                yield this.writeLine(`return new Promise((resolve, reject) => {`);
                yield this.startStatement(`this._${this.name.toLowerCase()}Model.isDeleted()`, -1);
                yield this.writeLine(`reject(false);`, 1);
                yield this.endStatement(1);
                yield this.writeLine(`this._${this.name.toLowerCase()}Model.save((error: any) => {`, 1);
                yield this.startStatement(`error`);
                yield this.writeLine(`reject(error);`, 2);
                yield this.endStatement(2);
                yield this.writeLine(`resolve(true);`, 2);
                yield this.writeLine(`});`, 1);
                yield this.writeLine(`});`);
                yield this.endFunction();
                yield this.writeComment(`Specific instance deleting...`);
                yield this.startFunction('public', `delete`, [], `Promise<boolean>`);
                yield this.writeLine(`return new Promise((resolve, reject) => {`);
                yield this.writeLine(`this._${this.name.toLowerCase()}Model.remove((error: any) => {`, 1);
                yield this.startStatement(`error`);
                yield this.writeLine(`reject(error);`, 2);
                yield this.endStatement(2);
                yield this.writeLine(`resolve(true);`, 2);
                yield this.writeLine(`});`, 1);
                yield this.writeLine(`});`);
                yield this.endFunction();
                // close declaration...
                yield this.endDeclaration();
                resolve(true);
            }));
        });
    }
    sealModel() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield this.writeComment(`Sealing object instance...`);
                yield this.writeLine(`Object.seal(${this.name}Model);`);
                resolve(true);
            }));
        });
    }
}
exports.ModelInstanceGenerator = ModelInstanceGenerator;
