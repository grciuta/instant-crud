import { Schema, Document, DocumentQuery } from 'mongoose';

export interface IRead<T> {
    retrieve: (callback: (error: any, result: any) => void) => void;
    findById: (id: string, callback: (error: any, result: T) => void) => void;
    findOne(cond?: Object, callback?: (err: any, res: T) => void): DocumentQuery<Document, Document>;
    find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): DocumentQuery<Document[], Document>;
}
  
export interface IWrite<T> {
    create: (item: T, callback: (error: any, result: any) => void) => void;
    update: (_id: Schema.Types.ObjectId, item: T, callback: (error: any, result: any) => void) => void;
    delete: (_id: string, callback: (error: any, result: any) => void) => void;
}