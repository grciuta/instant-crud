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
const Writer_1 = require("./Writer");
const Config_1 = require("./Config");
class Coder {
    constructor(type, directory, file_name, config_path) {
        // instance variables...
        this.type = null;
        this.directory = null;
        this.file_name = null;
        this.config = null;
        this.tabs = 0;
        this.tabs_size = 2;
        this.multilineComments = false;
        // setting up a file entry...
        this.directory = directory;
        this.file_name = this.camelCase(file_name);
        this.type = type;
        if (Config_1.Config.__init(config_path)) {
            this.config = Config_1.Config.__get('file_writer');
            if (this.config) {
                this.tabs_size = this.config.tabs_size;
                this.config = this.config.output[this.type];
            }
        }
    }
    // instance methods...
    writeLine(line, forced_spaces) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let newLine = '';
                let spacing = (forced_spaces) ? this.tabs + forced_spaces : this.tabs;
                // adding spaces...
                for (let tab = 0; tab < spacing; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        newLine += ' ';
                    }
                }
                newLine += line;
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(newLine);
                resolve(true);
            }));
        });
    }
    writeComment(comment, forced_spaces) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let commentLine = '';
                let spacing = (forced_spaces) ? this.tabs + forced_spaces : this.tabs;
                // adding spaces...
                for (let tab = 0; tab < spacing; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        commentLine += ' ';
                    }
                }
                if (this.multilineComments) {
                    commentLine += ` * ${comment}`;
                }
                else {
                    commentLine += `// ${comment}`;
                }
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(commentLine);
                resolve(true);
            }));
        });
    }
    // imports...
    import(imports, from, full, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let importStr = 'import ';
                if (full) {
                    importStr += `* as ${alias} `;
                }
                else {
                    importStr += `{ ${imports} } `;
                }
                importStr += ` from '${from}';`;
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(importStr);
                resolve(true);
            }));
        });
    }
    // declarations...
    declaration(type, name, extend) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let declaration = `export ${type} ${name} ${(extend) ? `extends ${extend}` : ''} {`;
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(declaration);
                this.tabs++;
                resolve(true);
            }));
        });
    }
    endDeclaration() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.tabs--;
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write('}');
                resolve(true);
            }));
        });
    }
    // constructor...
    construct(variables) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let constructVariables = '';
                if (variables) {
                    variables.forEach((variable, index) => {
                        constructVariables += variable;
                        if (index !== variables.length - 1) {
                            constructVariables += `, `;
                        }
                    });
                }
                let constructor = '';
                // adding spaces...
                for (let tab = 0; tab < this.tabs; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        constructor += ' ';
                    }
                }
                constructor += `constructor(${constructVariables}) {`;
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(constructor);
                this.tabs++;
                resolve(true);
            }));
        });
    }
    endConstruct() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.tabs--;
                let endCons = '';
                // adding spaces...
                for (let tab = 0; tab < this.tabs; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        endCons += ' ';
                    }
                }
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(`${endCons}}`);
                resolve(true);
            }));
        });
    }
    // expressions...
    expression(level, name, type, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let expression = '';
                // adding spaces...
                for (let tab = 0; tab < this.tabs; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        expression += ' ';
                    }
                }
                if (value && level !== '' && type !== '') {
                    expression += `${type} ${name}: ${type} = ${value};`;
                }
                else if (!value && level !== '' && type !== '') {
                    expression += `${level} ${name}: ${type};`;
                }
                else if (level === '' && type === '' && name !== '' && value) {
                    expression += `${name}= ${value};`;
                }
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(expression);
                resolve(true);
            }));
        });
    }
    // statements...
    startStatement(statement, forced_spaces) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let combinedSatement = '';
                let spacing = (forced_spaces) ? this.tabs + forced_spaces : this.tabs;
                // adding spaces...
                for (let tab = 0; tab < spacing; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        combinedSatement += ' ';
                    }
                }
                // adding spaces...
                for (let tab = 0; tab < this.tabs; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        combinedSatement += ' ';
                    }
                }
                combinedSatement += 'if (';
                combinedSatement += statement;
                combinedSatement += ') {';
                this.tabs++;
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(combinedSatement);
                resolve(true);
            }));
        });
    }
    compare(variable, compare, value) {
        return `(${variable}${(compare) ? compare : ''}${(value) ? value : ''})`;
    }
    elseIfStatement(_if, forced_spaces) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let statement = '';
                this.tabs--;
                let spacing = (forced_spaces) ? this.tabs + forced_spaces : this.tabs;
                // adding spaces...
                for (let tab = 0; tab < spacing; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        statement += ' ';
                    }
                }
                if (_if) {
                    statement += `} else if(${_if}) {`;
                }
                else {
                    statement += `} else {`;
                }
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(statement);
                this.tabs++;
                resolve(true);
            }));
        });
    }
    endStatement(forced_spaces) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let statement = '';
                this.tabs--;
                let spacing = (forced_spaces) ? this.tabs + forced_spaces : this.tabs;
                // adding spaces...
                for (let tab = 0; tab < spacing; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        statement += ' ';
                    }
                }
                statement += '}';
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(statement);
                resolve(true);
            }));
        });
    }
    // function parts...
    startFunction(level, name, args, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let fn = '';
                // adding spaces...
                for (let tab = 0; tab < this.tabs; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        fn += ' ';
                    }
                }
                let fnArgs = '';
                if (args.length > 0) {
                    fnArgs = yield this.constructFunctionArgs(args);
                }
                if (type) {
                    fn += `${level} ${name}(${fnArgs}): ${type} {`;
                }
                else {
                    fn += `${level} ${name}(${fnArgs}) {`;
                }
                this.tabs++;
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(fn);
                resolve(true);
            }));
        });
    }
    constructFunctionArgs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let fnArgs = '';
                args.forEach((arg, index) => {
                    if (arg.name) {
                        fnArgs += `${arg.name}${(arg.type ? `:${arg.type}` : '')}`;
                    }
                    if (index !== args.length - 1) {
                        fnArgs += ', ';
                    }
                    else {
                        resolve(fnArgs);
                    }
                });
            });
        });
    }
    endFunction() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.tabs--;
                let fn = '';
                // adding spaces...
                for (let tab = 0; tab < this.tabs; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        fn += ' ';
                    }
                }
                fn += '}';
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(fn);
                resolve(true);
            }));
        });
    }
    // comment parts...
    startMultiLineComment() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.multilineComments = true;
                let comment = '';
                // adding spaces...
                for (let tab = 0; tab < this.tabs; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        comment += ' ';
                    }
                }
                comment += '/**';
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(comment);
                resolve(true);
            }));
        });
    }
    endMultiLineComment() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.multilineComments = false;
                let comment = '';
                // adding spaces...
                for (let tab = 0; tab < this.tabs; tab++) {
                    for (let space = 0; space < this.tabs_size; space++) {
                        comment += ' ';
                    }
                }
                comment += ' */';
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__write(comment);
                resolve(true);
            }));
        });
    }
    // common functions...
    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    camelCase(string) {
        return string.split('_').map(part => {
            return part[0].toUpperCase() + part.substring(1, part.length);
        }).join('');
    }
    // removing function...
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield Writer_1.Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
                yield Writer_1.Writer.__delete();
                resolve(true);
            }));
        });
    }
}
exports.Coder = Coder;
