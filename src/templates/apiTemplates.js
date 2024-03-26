const apiTemplates = {
  listObjects: `
      {
        "path": "/{{pluralName}}",
        "method": "GET",
        "params": [],
        "response": {
          "type": "OPENAPI",
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
        "summary": "List {{pluralName}}",
        "description": "List {{pluralName}}",
        "x-nuc-action": "function action() { return {{className}}; }"
      }
    `,
  createObject: `
      {
        "path": "/{{pluralName}}",
        "method": "POST",
        "params": [],
        "request": {
          "type": "OPENAPI",
          "schema": {
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
          "type": "OPENAPI",
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
        "summary": "Create a {{singularName}}",
        "description": "Create a {{singularName}}",
        "x-nuc-action": "function action(req) { const {{camelCase singularName}}Data = req.body; return new {{className}}({{#each properties}}{{camelCase ../singularName}}Data.{{name}}{{#unless @last}}, {{/unless}}{{/each}}); }"
      }
    `,
  readObject: `
    {
      "path": "/{{pluralName}}/{{encloseBraces singularName}}",
      "method": "GET",
      "params": [
        {
          "name": "{{camelCase singularName}}Id",
          "in": "path",
          "type": "string",
          "required": true,
          "description": "{{singularName}} ID"
        }
      ],
      "response": {
        "type": "OPENAPI",
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
      "summary": "Read a {{singularName}}",
      "description": "Read a {{singularName}}",
      "x-nuc-action": "function action(req) { const {{camelCase singularName}}Id = req.params.{{camelCase singularName}}Id; return {{className}}[{{camelCase singularName}}Id]; }"
    }
  `,
};

export default apiTemplates;
