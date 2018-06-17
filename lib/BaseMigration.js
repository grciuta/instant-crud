"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaColumn_1 = require("./SchemaColumn");
class BaseMigration {
    constructor(columns, visibleColumns, relations) {
        // instance variables...
        this.columns = null;
        this.relations = null;
        this.visibleColumns = null;
        this.schemaColumns = null;
        this.schemaColumnsString = null;
        this.columns = columns;
        this.visibleColumns = (visibleColumns) ? visibleColumns : null;
        this.relations = (relations) ? relations : null;
        this.initColumns();
    }
    // instance methods for implemented usage...
    // get 
    getColumns() {
        return this.columns;
    }
    // get
    getRelations() {
        return this.relations;
    }
    // 
    getVisibleColumns() {
        return this.visibleColumns;
    }
    // initializing schema columns...
    initColumns() {
        // re-init of schema items
        this.schemaColumns = [];
        this.schemaColumnsString = '';
        // constructing each column of object
        this.columns.forEach((column, index) => {
            this.schemaColumns[column.name] = SchemaColumn_1.SchemaColumn.constructColumn(column);
            this.schemaColumnsString += `${column.name}: ${SchemaColumn_1.SchemaColumn.constructStringColumn(column)}`;
            if (index !== this.columns.length - 1) {
                this.schemaColumnsString += ',\n';
            }
        });
        return this.schemaColumns;
    }
}
exports.BaseMigration = BaseMigration;
