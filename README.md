# instant-crud

Package used to generate model, interface and repository code files of MongoDB (mongoose).
Everything generated for coding with **TypeScript**.

## Install

`npm i instant-crud -g`, for global `ic` usage.

## Requirements

**!IMPORTANT!**

Before star using this tool - please copy files from `../node_modules/src/base/repositories` into predefined directory, where your generated repositories will exist. Or do this after first migration.

To successfull use this package you should create 2 config-like JSON files:

* **Definitions config** file, to define all data instances: 
```
{
    ...
    "instance-name": {
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
```

* **Config** file, to define MongoDB connections, file formatting settings: 

```
    ...
    "mongo": {
        "server": "localhost",
        "port": null,
        "database": "database_of_project",
        "username": root,
        "password": null
    },
    "file_writer": {
        "tabs_size": 4,
        "output": {
            "interface": {
                "dir": "/core"
            },
            "repository": {
                "dir": "/core"
            },
            "model": {
                "dir": "/core"
            }
        }
    }
    ...
```

## Usage

**Commands:**

Run `ic migrate` - migration command.

Run `ic test-directory` - command, to check if CLI correctly gets your project root directory.

**`migrate` command options:**

* **-m [migration]** : define **migration** instance to be generated. If not defined, it will roll and generated all defined instance from **definition config**. Ex.: `ic migrate -m instance-name ...` or `ic migrate -m ...`

* **-d [definitions-config]** : define path to JSON file, where is defined items, which has to be generated. Ex.: `ic migrate -m -d config/definitions.json` (**!important: root directory of project will be automatically picked!**)

* **-c [config]** : define path to JSON file, where is defined items: *mongo* - with all connection properties & *file_writer* - for defining output directories and *tabs* size for formatting generating code.  Ex.: `ic migrate -m -d config/app.json` (**!important: root directory of project will be automatically picked!**)

