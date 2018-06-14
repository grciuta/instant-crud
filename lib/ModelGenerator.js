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
/**
 * Instance responsible for generating Mongo Interface Class...
 */
class ModelGenerator extends Coder_1.Coder {
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
    modelImports() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // import `mongoose` instance objects...
                this.import('Connection, Document, Schema', 'mongoose');
                this.import('DB', '../core/db/DB', false, '');
                this.startMultiLineComment();
                this.writeComment(`Model of ${this.name} migration...`);
                this.writeComment(`All columns described in 'app-migration' config...`);
                this.endMultiLineComment();
                resolve(true);
            }));
        });
    }
    // import declaration...
    modelDeclaration(columns) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.declaration('interface', `${this.name}Interface`, 'Document');
                // add instance variables...
                // ** default item varible declaration...
                this.writeLine(`_id: string;`, 1);
                columns.forEach((column, index) => {
                    if (column.name !== '_id') {
                        if (this.revertValues.hasOwnProperty(column.type)) {
                            this.writeLine(`${column.name}: ${this.revertValues[column.type]};`, 1);
                        }
                        else {
                            this.writeLine(`${column.name}: ${column.type};`, 1);
                        }
                    }
                });
                // timestamps includes...
                this.writeLine(`created_at: ${this.revertValues['date']};`, 1);
                this.writeLine(`updated_at: ${this.revertValues['date']};`, 1);
                // close declaration...
                this.endDeclaration();
                resolve(true);
            }));
        });
    }
    // schema generator...
    modelSchema(columns, preSaveAction) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.writeComment('Model schema item...');
                let columnsArray = columns.split('\n');
                columnsArray.forEach((column, index) => {
                    if (index === 0) {
                        this.writeLine(`let schema = new Schema({`);
                        this.writeLine(column, 2);
                    }
                    else if (index === columnsArray.length - 1) {
                        // default fields (of schema) declaration (timestamps)
                        this.writeLine(`},`, 3);
                        this.writeLine(`created_at: {`, 2);
                        this.writeLine(`type: Date,`, 3);
                        this.writeLine(`required: false,`, 3);
                        this.writeLine(`lowercase: false,`, 3);
                        this.writeLine(`uppercase: false,`, 3);
                        this.writeLine(`trim: false`, 3);
                        this.writeLine(`},`, 2);
                        this.writeLine(`updated_at: {`, 2);
                        this.writeLine(`type: Date,`, 3);
                        this.writeLine(`required: false,`, 3);
                        this.writeLine(`lowercase: false,`, 3);
                        this.writeLine(`uppercase: false,`, 3);
                        this.writeLine(`trim: false`, 3);
                        this.writeLine(`}`, 2);
                        // constructing default model pre-saving function for timestamps...
                        this.writeLine(`}).pre('validate', function(next) {`);
                        this.writeLine(`if (this) {`, 2);
                        this.writeLine(`let doc = <${this.capitalizeFirst(this.name)}Interface>this;`, 3);
                        this.writeLine(`let now = new Date();`, 3);
                        this.writeLine(`let created = false;`, 3);
                        this.writeLine(`for (let key in this) {`, 3);
                        this.writeLine(`if (key === 'created_at') {`, 4);
                        this.writeLine(`created = true;`, 5);
                        this.writeLine(`}`, 4);
                        this.writeLine(`}`, 3);
                        this.writeLine(`if (created) {`, 3);
                        this.writeLine(`doc.created_at = now;`, 4);
                        this.writeLine(`doc.updated_at = now;`, 4);
                        this.writeLine(`} else {`, 3);
                        this.writeLine(`doc.updated_at = now;`, 4);
                        this.writeLine(`}`, 3);
                        if (preSaveAction) {
                            this.writeLine(`${preSaveAction}`, 2);
                        }
                        this.writeLine(`}`, 2);
                        this.writeLine(`next();`, 2);
                        // this.writeLine(`return this;`, 1);
                        this.writeLine(`});`);
                    }
                    else if (column[column.length - 1] === '{' && column[column.length - 3] === ':') {
                        this.writeLine(column, 2);
                    }
                    else if (column[column.length - 1] === ',' && column[column.length - 2] === '}') {
                        this.writeLine(column, 2);
                    }
                    else if (column[column.length - 1] === ',' || (column[column.length - 1] !== ',' && column[column.length - 1] !== '{')) {
                        this.writeLine(column, 3);
                    }
                    else if (column[column.length - 1] !== '{' || column[column.length - 2] === '}') {
                        this.writeLine(column, 2);
                    }
                });
                resolve(true);
            }));
        });
    }
    // model export...
    exportModel() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.writeComment(`Exporting model...`);
                this.expression('let', 'conn', 'Connection');
                this.startStatement('DB.__init()');
                this.expression('', 'conn', '', 'DB.__connect()');
                this.endStatement();
                this.writeLine(`export let ${this.capitalizeFirst(this.name)}Schema = conn.model('${this.name.toLowerCase()}', schema, '${this.name.toLowerCase()}');`);
                resolve(true);
            }));
        });
    }
}
exports.ModelGenerator = ModelGenerator;
