import { Writer } from './Writer';
import { Config } from './Config';

export class Coder {
    // instance variables...
    private type: string = null;
    private directory: string = null;
    private file_name: string = null;
    private config: any = null;
    private tabs: number = 0;
    private tabs_size: number = 2;
    private multilineComments: boolean = false;

    public constructor(type: string, directory: string, file_name: string) {
        // setting up a file entry...
        this.directory = directory;
        this.file_name = this.camelCase(file_name);
        this.type = type;

        if (Config.__init()) {
            this.config = Config.__get('file_writer');
            if (this.config) {
                this.tabs_size = this.config.tabs_size;
                this.config = this.config.output[this.type];
            }
        }
    }

    // instance methods...
    public async writeLine(line: string, forced_spaces?: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let newLine = '';

            let spacing = (forced_spaces) ? this.tabs + forced_spaces : this.tabs;
            // adding spaces...
            for (let tab = 0; tab < spacing; tab++) {
                for (let space = 0; space < this.tabs_size; space++) {
                    newLine += ' ';
                }
            }

            newLine += line;

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(newLine);
            resolve(true);
        });
    }
    public async writeComment(comment: string, forced_spaces?: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
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
            } else {
                commentLine += `// ${comment}`;
            }

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(commentLine);
            resolve(true);
        });
    }
    // imports...
    public async import(imports: string, from: string, full?: boolean, alias?: any): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let importStr = 'import ';

            if (full) {
                importStr += `* as ${ alias } `;
            } else {
                importStr += `{ ${imports} } `;
            }

            importStr += ` from '${from}';`;

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(importStr);
            resolve(true);
        });
    }
    // declarations...
    public async declaration(type: string, name: string, extend?: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let declaration = `export ${type} ${name} ${(extend) ? `extends ${extend}` : ''} {`;

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(declaration);

            this.tabs++;

            resolve(true);
        });
    }
    public async endDeclaration(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            this.tabs--;
            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write('}');
            resolve(true);
        });
    }
    // constructor...
    public async construct(variables?: Array<string>): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
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

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(constructor);
            this.tabs++;
            resolve(true);
        });
    }
    public async endConstruct(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            this.tabs--;
            let endCons = '';
            // adding spaces...
            for (let tab = 0; tab < this.tabs; tab++) {
                for (let space = 0; space < this.tabs_size; space++) {
                    endCons += ' ';
                }
            }

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(`${endCons}}`);
            resolve(true);
        });
    }
    // expressions...
    public async expression(level: string, name: string, type: string, value?: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let expression = '';

            // adding spaces...
            for (let tab = 0; tab < this.tabs; tab++) {
                for (let space = 0; space < this.tabs_size; space++) {
                    expression += ' ';
                }
            }

            if (value && level !== '' && type !== '') {
                expression += `${type} ${name}: ${type} = ${value};`;
            } else if (!value && level !== '' && type !== '') {
                expression += `${level} ${name}: ${type};`;
            } else if (level === '' && type === '' && name !== '' && value) {
                expression += `${name}= ${value};`;
            }

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(expression);
            resolve(true);
        });
    }
    // statements...
    public async startStatement(statement: string, forced_spaces?: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
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
            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(combinedSatement);
            resolve(true);
        });
    }
    public compare(variable: string, compare?: string, value?: string): string {
        return `(${variable}${(compare) ? compare: ''}${(value) ? value: ''})`;
    }
    public async elseIfStatement(_if? :string, forced_spaces?: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
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
            } else {
                statement += `} else {`;
            }

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(statement);
            this.tabs++;
            resolve(true);
        });
    }
    public async endStatement(forced_spaces?: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
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

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(statement);
            resolve(true);
        });
    }
    // function parts...
    public async startFunction(level: string, name: string, args: Array<any>, type: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let fn = '';

            // adding spaces...
            for (let tab = 0; tab < this.tabs; tab++) {
                for (let space = 0; space < this.tabs_size; space++) {
                    fn += ' ';
                }
            }
            
            let fnArgs: string = '';
            
            if (args.length > 0) {
                fnArgs = await this.constructFunctionArgs(args);
            }

            if (type) {
                fn += `${level} ${name}(${fnArgs}): ${type} {`;
            } else {
                fn += `${level} ${name}(${fnArgs}) {`;
            }

            this.tabs++;

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(fn);
            resolve(true);
        });
    }
    private async constructFunctionArgs(args: Array<any>): Promise<string> {
        return new Promise<string>(resolve => {
            let fnArgs: string = '';

            args.forEach((arg, index) => {
                if (arg.name) {
                    fnArgs += `${arg.name}${(arg.type ? `:${arg.type}` : '')}`;
                }

                if (index !== args.length - 1) {
                    fnArgs += ', ';
                } else {
                    resolve(fnArgs);
                }
            });
        });
    }
    public async endFunction(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            this.tabs--;
            let fn = '';

            // adding spaces...
            for (let tab = 0; tab < this.tabs; tab++) {
                for (let space = 0; space < this.tabs_size; space++) {
                    fn += ' ';
                }
            }

            fn += '}';

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(fn);
            resolve(true);
        }); 
    }
    // comment parts...
    public async startMultiLineComment(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            this.multilineComments = true;

            let comment = '';

            // adding spaces...
            for (let tab = 0; tab < this.tabs; tab++) {
                for (let space = 0; space < this.tabs_size; space++) {
                    comment += ' ';
                }
            }

            comment += '/**';

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(comment);
            resolve(true);
        }); 
    }
    public async endMultiLineComment(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            this.multilineComments = false;

            let comment = '';

            // adding spaces...
            for (let tab = 0; tab < this.tabs; tab++) {
                for (let space = 0; space < this.tabs_size; space++) {
                    comment += ' ';
                }
            }

            comment += ' */';

            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__write(comment);
            resolve(true);
        });
    }
    // common functions...
    public capitalizeFirst(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    public camelCase(string: string): string {
        return string.split('_').map(part => {
            return part[0].toUpperCase() + part.substring(1, part.length);
        }).join('');
    }
    // removing function...
    public async remove(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            await Writer.__init(`./${this.config.dir}${this.directory ? `/${this.directory}` : ''}`, this.file_name);
            await Writer.__delete();
            resolve(true);
        });
    }
}