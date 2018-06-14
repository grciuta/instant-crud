import * as fs from 'fs';

export class Writer {
    private static directory: string;
    private static file_name: string;

    public static __init(dir: string, file_name: string): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            this.directory = dir;
            this.file_name = file_name;
            
            let fullFileDir = `${this.directory}/${this.file_name}`;

            if (!fs.existsSync(fullFileDir)) {
                if (!fs.existsSync(this.directory)) {
                    fs.mkdirSync(this.directory);
                }
                fs.appendFileSync(fullFileDir, '', 'utf8');
            }
            resolve(true);
        });
    }

    public static __write(line: string): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            if (this.directory && this.file_name) {
                if (!fs.existsSync(`${this.directory}/${this.file_name}`)) {
                    this.__init(this.directory, this.file_name);
                }
                
                line += '\n';

                fs.appendFileSync(`${this.directory}/${this.file_name}`, line, 'utf8');
            }
            resolve(true);
        });
    }

    public static async __delete(): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            let fullFileDir = `${this.directory}/${this.file_name}`;

            if (fs.existsSync(fullFileDir)) {
                fs.unlink(fullFileDir, (error) => {
                    if (error) {
                        // console.log(`${fullFileDir} remove unsuccessfull...`);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            }
        });
    }
}