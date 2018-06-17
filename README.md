#instant-crud

Package used to generate model, interface and repository code files of MongoDB (mongoose).
Everything generated for coding with **TypeScript**.

######Install

`npm i instant-crud -g`, for global `ic` usage.

######Usage

Options:

* **-m [migration]** : define **migration** instance to be generated. If not defined, it will roll and generated all defined instance from **config**.
* **-c [config]** : define path to JSON file, where is defined items, which has to be generated. Ex.:

`
{
    ...
    "instance": {
        // *columns* - defines object model items and their types.
        "columns": [
            {
                "name": "col1",
                "type": "boolean"
                "required": true,
                "default": false
            },
            {
                "name": "col2",
                "type": "number"
            },
            {
                "name": "col3",
                "type": "array"
            },
            {
                "name": "col4",
                "type": "string"
            },
            ...
        ],
        // *visible_columns* - for defining public model instance methods (get/set). 
        "visible_columns": [
            "cover_picture",
            "user",
            "files",
            "comment",
            "likes"
        ],
        // *relations* - definitions of relations with other instances. Generates methods for auto-selecting related instance objects (records).
        // - table: related instance
        // - property: related instance item to relate
        // - item_field: current instance item to relate
        // - is_array: definition, if relation is array
        "relations": [
            {
                "table": "instance2",
                "property": "_id",
                "item_field": "col2",
                "is_array": false
            },
            ...
        ]
    }
`

* **-c [config]** : define path to JSON file, where is defined items: *mongo* - with all connection properties & *file_writer* - for defining output directories and *tabs* size. Ex.:

`
    ...
    "mongo": {
        "server": "localhost",
        "port": null,
        "database": "instant_message",
        "username": null,
        "password": null
    },
    "file_writer": {
        "tabs_size": 4,
        "output": {
            "interface": {
                "dir": "/instant-server"
            },
            "repository": {
                "dir": "/instant-server"
            },
            "model": {
                "dir": "/instant-server"
            }
        }
    }
    ...
`