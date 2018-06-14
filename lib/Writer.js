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
const fs = require("fs");
class Writer {
    static __init(dir, file_name) {
        return new Promise((resolve, reject) => {
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
    static __write(line) {
        return new Promise((resolve, reject) => {
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
    static __delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let fullFileDir = `${this.directory}/${this.file_name}`;
                if (fs.existsSync(fullFileDir)) {
                    fs.unlink(fullFileDir, (error) => {
                        if (error) {
                            // console.log(`${fullFileDir} remove unsuccessfull...`);
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    }
}
exports.Writer = Writer;
