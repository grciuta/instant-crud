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
 * Instance responsible for generating Mongo Repository Class...
 */
class RepositoryGenerator extends Coder_1.Coder {
    constructor(type, name, directory, file_name, config) {
        super(type, directory, file_name, config);
        this.name = null;
        this.name = this.camelCase(name);
    }
    // import part...
    repositoryImports() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // import `mongoose` instance objects...
                this.import(`${this.name}Interface, ${this.name}Schema`, `../interfaces/${this.name}`, false, '');
                this.import('RepositoryBase', '../repositories/BaseRepository', false, '');
                this.startMultiLineComment();
                this.writeComment(`Repository of ${this.name} migration...`);
                this.endMultiLineComment();
                resolve(true);
            }));
        });
    }
    repositoryDeclaration() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield this.declaration('class', `${this.name}Repository`, `RepositoryBase<${this.name}Interface>`);
                yield this.construct();
                yield this.writeLine(`super(${this.name}Schema);`);
                yield this.endConstruct();
                yield this.endDeclaration();
                resolve(true);
            }));
        });
    }
    sealRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.writeComment(`Sealing object instance...`);
                this.writeLine(`Object.seal(${this.name}Repository);`);
                resolve(true);
            }));
        });
    }
}
exports.RepositoryGenerator = RepositoryGenerator;
