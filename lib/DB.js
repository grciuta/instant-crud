"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Config_1 = require("./Config");
class DB {
    // initializes connection string...
    static __init() {
        if (Config_1.Config.__init()) {
            let db_options = Config_1.Config.__get('mongo');
            if (db_options) {
                if (db_options['username'] && db_options['password']) {
                    this.connection_string = `mongodb://${db_options['username']}:${db_options['password']}@${db_options['server']}:${db_options['port'] || 27017}/${db_options['database']}`;
                }
                else {
                    this.connection_string = `mongodb://${db_options['server']}:${db_options['port'] || 27017}/${db_options['database']}`;
                }
                return true;
            }
        }
        return false;
    }
    // created mongoose conenction...
    static __connect() {
        if (this.connection_string && !this.connection) {
            try {
                this.connection = mongoose.createConnection(this.connection_string);
                return this.connection;
            }
            catch (ex) {
                console.log(`Connectiong to database unsuccessful...\nException:\n${ex}`);
                return null;
            }
        }
        else if (this.connection) {
            return this.connection;
        }
        console.log(`No connection options provided...`);
        return null;
    }
    // destroys mongoose connection... 
    static __disconnect() {
        if (this.connection) {
            this.connection.close((err) => {
                if (err) {
                    console.log(`Disconnection error occurred: ${err}`);
                }
            });
            console.log('Disconnected...');
        }
        return true;
    }
}
DB.connection = null;
DB.connection_string = null;
exports.DB = DB;
