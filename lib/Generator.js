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
const Reader_1 = require("./Reader");
const Config_1 = require("./Config");
const DB_1 = require("./DB");
const path = require("path");
const cli_spinner_1 = require("cli-spinner");
class Generator {
    static generateAll(migrations_path, config_path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                migrations_path = path.join(process.cwd(), migrations_path);
                config_path = path.join(process.cwd(), config_path);
                if (Reader_1.Reader.__bindFile(migrations_path) && Config_1.Config.__init(config_path) && DB_1.DB.__init() && typeof DB_1.DB.__connect() !== 'undefined') {
                    const allMIgrationObjects = Reader_1.Reader.__get_full();
                    if (allMIgrationObjects !== undefined) {
                        const loader = new cli_spinner_1.Spinner('Generating...');
                        loader.setSpinnerString('|/-\\');
                        const migrations = Object.keys(allMIgrationObjects);
                        loader.start();
                        migrations.forEach((key, index) => __awaiter(this, void 0, void 0, function* () {
                            if (allMIgrationObjects.hasOwnProperty(key)) {
                                yield this.generateOne(migrations_path, key, config_path);
                                if (index === migrations.length - 1) {
                                    loader.stop(true);
                                    resolve(true);
                                }
                            }
                        }));
                    }
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    static generateOne(migrations_path, name = null, config_path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                if (Reader_1.Reader.__bindFile(migrations_path) && Config_1.Config.__init(config_path) && DB_1.DB.__init() && typeof DB_1.DB.__connect() !== 'undefined') {
                    let item = Reader_1.Reader.__get(name);
                    if (item) {
                        let migrator = require('./StaticMigration').default;
                        let migratorInstance = new migrator(DB_1.DB.__connect(), name, item, config_path);
                        resolve(yield migratorInstance.up());
                    }
                }
                else {
                    resolve(false);
                }
            }));
        });
    }
}
exports.default = Generator;
