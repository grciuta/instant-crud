"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Config {
    // load configuration file data
    static __init(config_path) {
        if (fs.existsSync(config_path) && !this.config_obj) {
            this.config_obj = JSON.parse(fs.readFileSync(config_path, 'utf8'));
            if (this.config_obj) {
                return true;
            }
        }
        else if (this.config_obj) {
            return true;
        }
        else {
            return false;
        }
    }
    // get full object from config data
    static __get(slug = null) {
        if (this.config_obj && this.config_obj.hasOwnProperty(slug)) {
            return this.config_obj[slug];
        }
        else if (this.config_obj && !slug) {
            return this.config_obj;
        }
        return null;
    }
}
Config.config_obj = null;
exports.Config = Config;
