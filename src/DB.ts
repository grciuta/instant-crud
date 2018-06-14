import * as mongoose from 'mongoose';
import * as fs from 'fs';

import { Config } from './Config';

export class DB {
    static connection: mongoose.Connection = null;
    static connection_string: string = null;
    // initializes connection string...
    static __init(): boolean {
        if (Config.__init()) {
            let db_options = Config.__get('mongo');
            if (db_options) {
                if (db_options['username'] && db_options['password']) {
                    this.connection_string = `mongodb://${db_options['username']}:${db_options['password']}@${db_options['server']}:${db_options['port'] || 27017}/${db_options['database']}`;
                } else {
                    this.connection_string = `mongodb://${db_options['server']}:${db_options['port'] || 27017}/${db_options['database']}`;
                }
                return true;
            }
        }
        return false;
    }
    // created mongoose conenction...
    static __connect(): mongoose.Connection {
        if (this.connection_string && !this.connection) {
            try {
                this.connection = mongoose.createConnection(this.connection_string);
                return this.connection;
            } catch(ex) {
                console.log(`Connectiong to database unsuccessful...\nException:\n${ex}`);
                return null;
            }
        } else if (this.connection) {
            return this.connection;
        }
        console.log(`No connection options provided...`);
        return null;
    }
    // destroys mongoose connection... 
    static __disconnect(): boolean {
        if (this.connection) {
            this.connection.close((err: any) => {
                if (err) {
                    console.log(`Disconnection error occurred: ${err}`);
                }
            });
            console.log('Disconnected...');
        }
        return true;
    }
}