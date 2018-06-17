import { Document, Schema, Model, model } from 'mongoose';

export class SchemaColumn {
    private static types: any = {
        id: Schema.Types.ObjectId,
        string: Schema.Types.String,
        decimal: Schema.Types.Decimal128,
        number: Schema.Types.Number,
        boolean: Schema.Types.Boolean,
        buffer: Schema.Types.Buffer,
        date: Schema.Types.Date,
        array: Schema.Types.Array,
        mixed: Schema.Types.Mixed
    };

    private static string_types: any = {
        // id: 'Schema.Types.ObjectId',
        // string: 'Schema.Types.String',
        // decimal: 'Schema.Types.Decimal128',
        // number: 'Schema.Types.Number',
        // boolean: 'Schema.Types.Boolean',
        // buffer: 'Schema.Types.Buffer',
        // date: 'Schema.Types.Date',
        // array: 'Schema.Types.Array',
        // mixed: 'Schema.Types.Mixed'
        id: 'String', //'Schema.Types.ObjectId',
        string: 'String', //'Schema.Types.String',
        decimal: 'Double',
        number: 'Number', //'Schema.Types.Number',
        boolean: 'Boolean', //'Schema.Types.Boolean',
        buffer: 'Buffer', //'Schema.Types.Buffer',
        date: 'Date', //'Schema.Types.Date', 
        array: '[String]', //'Schema.Types.Array'
    };

    // updatable part of configration setup..
    private static setDefaultValue(slug: any, string?: boolean): any {
        switch (slug) {
            case 'now()':
                if (string) {
                    return 'Date.now';
                } else {
                    return Date.now;
                }
            default:
                return slug;
        }
    }

    static constructColumn(data): any {
        let columnObject = {
            type: this.types[data.type],
            required: typeof data.required !== 'undefined' ? data.required : false,
            lowercase: typeof data.lowercase !== 'undefined' ? data.lowercase : false,
            uppercase: typeof data.uppercase !== 'undefined' ? data.uppercase : false,
            unique: typeof data.unique !== 'undefined' ? data.unique : false,
            trim: typeof data.trim !== 'undefined' ? data.trim : false
        };
        // enum: typeof data.enum !== 'undefined' ? data.enum : null,
        if (typeof data.enum !== 'undefined') {
            columnObject['enum'] = data.enum;
        }
        if (typeof data.match !== 'undefined') {
            columnObject['match'] = data.match;
        }
        if (typeof data.regExp !== 'undefined') {
            columnObject['regExp'] = data.regExp;
        }
        if (typeof data.default !== 'undefined') {
            columnObject['default'] = data.default;
        }

        return columnObject;
    }

    static constructStringColumn(data): string {
        let columnString: string = `{\n`;

        columnString += `type: ${this.string_types[data.type]},\n`;
        columnString += `required: ${typeof data.required !== 'undefined' ? data.required : 'false'},\n`;
        columnString += `lowercase: ${typeof data.lowercase !== 'undefined' ? data.lowercase : 'false'},\n`;
        columnString += `uppercase: ${typeof data.uppercase !== 'undefined' ? data.uppercase : 'false'},\n`;
        columnString += `unique: ${typeof data.unique !== 'undefined' ? data.unique : 'false'},\n`;
        columnString += `trim: ${typeof data.trim !== 'undefined' ? data.trim : 'false'},\n`;
        if (typeof data.enum !== 'undefined') {
            columnString += `enum: ${data.enum},\n`;
        }
        if (typeof data.match !== 'undefined') {
            columnString += `enum: ${data.match},\n`;
        }
        if (typeof data.regExp !== 'undefined') {
            columnString += `enum: ${data.regExp},\n`;
        }
        if (typeof data.default !== 'undefined') {
            columnString += `enum: ${data.default},\n`;
        }

        columnString += '}';

        return columnString;
    }
}