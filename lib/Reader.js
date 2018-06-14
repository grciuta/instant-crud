"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Reader {
    static __bindFile(path) {
        if (fs.existsSync(path)) {
            this.fileData = JSON.parse(fs.readFileSync(path, 'utf8'));
            if (this.fileData) {
                return true;
            }
        }
        return false;
    }
    static __get(slug) {
        if (this.fileData && this.fileData.hasOwnProperty(slug)) {
            return this.fileData[slug];
        }
        else if (this.fileData && !slug) {
            return this.fileData;
        }
        return null;
    }
    static __get_full() {
        return this.fileData;
    }
}
Reader.fileData = null;
exports.Reader = Reader;
