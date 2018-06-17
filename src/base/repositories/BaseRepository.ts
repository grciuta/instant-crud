import { Document, Model, Schema, Query, DocumentQuery, Mongoose } from 'mongoose';
import * as mongoose from 'mongoose';
import { IWrite, IRead } from './BaseRepositoryComponents';
import { ObjectId } from 'bson';

export class RepositoryBase<T extends Document> implements IRead<T>, IWrite<T> {

    private _model: any;
  
    constructor(schemaModel: any) {
      this._model = schemaModel;
    }
  
    public create(item: T, callback: (error: any, result: T) => any) {
      this._model.create(item).then((res: any) => {
        callback(null, res);
      }, (error) => {
        callback(error, null);
      });
    }
  
    public retrieve(callback: (error: any, result: T) => void) {
      this._model.find({}, callback);
    }
  
    public update(_id: any, item: T, callback?: (error: any, result: any) => void) {
      this._model.update({ _id: _id }, item, callback);
    }
  
    public delete(_id: string, callback: (error: any, result: any) => void) {
      this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
    }
  
    public findById(_id: string, callback?: (error: any, result: T) => void) {
      this._model.findById(_id, callback);
    }
  
    public findOne(cond?: Object, callback?: (err: any, res: T) => void): DocumentQuery<Document, Document> {
      return this._model.findOne(cond, callback);
    }
  
    public find(cond?: Object, fields?: Object, options?: Object, callback?: (err: any, res: T[]) => void): DocumentQuery<Document[], Document> {
      return this._model.find(cond, options, callback);
    }
  
    public toObjectId(_id: string): string {
      return ObjectId.createFromHexString(_id).toHexString();
    }
  }
  