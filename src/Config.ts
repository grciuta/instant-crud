import * as fs from 'fs';

export class Config {
    static config_obj: any = null;

    // load configuration file data
    static __init(config_path?: string): boolean {
        if (fs.existsSync(config_path) && !this.config_obj) {
            this.config_obj = JSON.parse(fs.readFileSync(config_path, 'utf8'));

            if (this.config_obj) { return true; }
        } else if (this.config_obj) {
            return true;
        } else {
            return false;
        }
    }

    // get full object from config data
    static __get(slug: string = null): Object {
        if (this.config_obj && this.config_obj.hasOwnProperty(slug)) {
            return this.config_obj[slug];
        } else if (this.config_obj && !slug) {
            return this.config_obj;
        }

        return null;
    }
}