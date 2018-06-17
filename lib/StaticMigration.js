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
const BaseMigration_1 = require("./BaseMigration");
const ModelGenerator_1 = require("./ModelGenerator");
const RepositoryGenerator_1 = require("./RepositoryGenerator");
const ModelInstanceGenerator_1 = require("./ModelInstanceGenerator");
class StaticMigration extends BaseMigration_1.BaseMigration {
    constructor(connection, name, columns, config_path) {
        super(columns.columns, columns.visible_columns, columns.relations);
        this.name = null;
        this.conn = null;
        this.config = null;
        this.name = name;
        this.conn = connection;
        this.config = config_path;
    }
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // create new collection...
                this.conn.createCollection(this.name, {}, (err, collection) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        // console.log(`Migration for ${this.name} unsucessfull!\nError: ${err}`);
                        reject(false);
                    }
                    else {
                        // generate model...
                        let modelGen = new ModelGenerator_1.ModelGenerator('interface', this.name, 'interfaces', `${this.name}.ts`, this.config);
                        yield modelGen.remove();
                        yield modelGen.modelImports();
                        yield modelGen.modelDeclaration(this.getColumns());
                        yield modelGen.modelSchema(this.schemaColumnsString);
                        yield modelGen.exportModel();
                        // generate repository...
                        let repositoryGen = new RepositoryGenerator_1.RepositoryGenerator('repository', this.name, 'repositories', `${this.name}.ts`, this.config);
                        yield repositoryGen.remove();
                        yield repositoryGen.repositoryImports();
                        yield repositoryGen.repositoryDeclaration();
                        yield repositoryGen.sealRepository();
                        // generate interface...
                        let modelInstanceGen = new ModelInstanceGenerator_1.ModelInstanceGenerator('model', this.name, 'models', `${this.name}.ts`, this.config);
                        yield modelInstanceGen.remove();
                        yield modelInstanceGen.modelImports(this.getRelations());
                        yield modelInstanceGen.modelDeclaration(this.getColumns(), this.getVisibleColumns(), this.getRelations());
                        yield modelInstanceGen.sealModel();
                        resolve(true);
                    }
                }));
            }));
        });
    }
    down() {
        // drop schema...
    }
}
exports.default = StaticMigration;
