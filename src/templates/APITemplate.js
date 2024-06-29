const APITemplate = {
  rootObject: `
    {
      "path": "/",
      "method": "GET",
      "params": [],
      "response": {
        "schema": {
          "name": "User",
          "type": "object",
          "properties": [
            {
              "name": "name",
              "type": "string"
            }
          ]
        }
      },
      "summary": "Hello World",
      "description": "Hello World",
      "action": "function action(req) { return { message: 'Hello World' }; }"
    }
  `,
  listObjects: `
    {
      "path": "/{{pluralize className}}",
      "method": "GET",
      "params": [],
      "response": {
        "schema": {
          "type": "array",
          "properties": [
            {
              "type": "{{className}}"
            }
          ]
        }
      },
      "summary": "List {{camelCase (pluralize className)}}",
      "description": "List {{camelCase (pluralize className)}}",
      "action": "function action() { return {{className}}; }"
    }
    `,
  createObject: `
    {
      "path": "/{{pluralize className}}",
      "method": "POST",
      "params": [],
      "request": {
        "schema": {
          "type": "{{className}}"
        }
      },
      "response": {
        "schema": {
          "type": "{{className}}"
        }
      },
      "summary": "Create {{camelCase className}}",
      "description": "Create {{camelCase className}}",
      "action": "function action(req) { const {{camelCase className}} = req.body; return new {{className}}({{#each properties}}{{camelCase ../className}}.{{name}}{{#unless @last}}, {{/unless}}{{/each}}); }"
    }
    `,
  readObject: `
    {
      "path": "/{{pluralize className}}/{{encloseBraces (camelCase className)}}",
      "method": "GET",
      "params": [
        {
          "name": "{{camelCase className}}Id",
          "in": "path",
          "type": "string",
          "required": true,
          "description": "{{className}} id"
        }
      ],
      "response": {
        "schema": {
          "type": "{{className}}"
        }
      },
      "summary": "Read {{camelCase className}}",
      "description": "Read {{camelCase className}}",
      "action": "function action(req) { const {{camelCase className}}Id = req.params.{{camelCase className}}Id; return {{className}}[{{camelCase className}}Id]; }"
    }
    `,
  updateObject: `
    {
      "path": "/{{pluralize className}}/{{encloseBraces (camelCase className)}}",
      "method": "PATCH",
      "params": [
        {
          "name": "{{camelCase className}}Id",
          "in": "path",
          "type": "string",
          "required": true,
          "description": "{{className}} id"
        }
      ],
      "request": {
        "schema": {
          "name": "{{className}}",
          "type": "object",
          "properties": [
            {{#each properties}}
            {
              "name": "{{name}}",
              "type": "{{type}}"
            }{{#unless @last}},{{/unless}}
            {{/each}}
          ]
        }
      },
      "response": {
        "schema": {
          "type": "{{className}}"
        }
      },
      "summary": "Update {{camelCase className}}",
      "description": "Update {{camelCase className}}",
      "action": "function action(req) { const {{camelCase className}} = {{className}}[req.params.{{camelCase className}}Id]; {{#each properties}} const {{name}} = req.body.{{name}};{{/each}} {{#each properties}}if ({{name}}) { {{camelCase ../className}}.{{name}} = {{name}}; } {{/each}} return {{camelCase className}};}"
    }
    `,
  deleteObject: `
    {
      "path": "/{{pluralize className}}/{{encloseBraces (camelCase className)}}",
      "method": "DEL",
      "params": [
        {
          "name": "{{camelCase className}}Id",
          "in": "path",
          "type": "string",
          "required": true,
          "description": "{{className}} id"
        }
      ],
      "response": {
        "schema": {
          "type": "object",
          "properties": [
            {
              "name": "message",
              "type": "string"
            }
          ]
        }
      },
      "summary": "Delete {{camelCase className}}",
      "description": "Delete {{camelCase className}}",
      "action": "function action(req) { const {{camelCase className}} = req.params.{{camelCase className}}; delete {{className}}[{{camelCase className}}];}"
    }  
    `,
};

export default APITemplate;
