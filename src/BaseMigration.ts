import { SchemaColumn } from './SchemaColumn';
import { Config } from './Config';
import { ModelGenerator } from './ModelGenerator';
import { SchemaDefinition } from 'mongoose';

export abstract class BaseMigration {
    // instance variables...
    private columns: Array<any> = null;
    private relations: Array<any> = null;
    private visibleColumns: Array<any> = null; 
    public schemaColumns: any = null;
    public schemaColumnsString: string = null;

    constructor(columns: Array<any>, visibleColumns?: Array<any>, relations?: Array<any>) {
        this.columns = columns;
        this.visibleColumns = (visibleColumns) ? visibleColumns : null;
        this.relations = (relations) ? relations : null;

        this.initColumns();
    }
    // instance methods for implemented usage...
    // get 
    public getColumns(): Array<any> {
        return this.columns;
    }
    // get
    public getRelations(): Array<any> {
        return this.relations;
    }
    // 
    public getVisibleColumns(): Array<any> {
        return this.visibleColumns;
    }
    // initializing schema columns...
    private initColumns(): any {
        // re-init of schema items
        this.schemaColumns = [];
        this.schemaColumnsString = '';
        // constructing each column of object
        this.columns.forEach((column, index) => {
            this.schemaColumns[column.name] = SchemaColumn.constructColumn(column);
            this.schemaColumnsString += `${column.name}: ${SchemaColumn.constructStringColumn(column)}`;
            if (index !== this.columns.length - 1) {
                this.schemaColumnsString += ',\n';
            }
        });
        return this.schemaColumns;
    }
    // instance methods for override...
    abstract up(): void;
    abstract down(): void;
}