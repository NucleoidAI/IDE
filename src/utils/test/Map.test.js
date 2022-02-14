import { compile } from "../Map";

test("Compile object to map", () => {
  const object = {
    "bd574ff0-a4e1-4d9b-be26-2d09a722ec0c": {
      id: "bd574ff0-a4e1-4d9b-be26-2d09a722ec0c",
      type: "object",
      properties: {
        "f7a9ec6b-552b-4f03-970c-c5671f51f865": {
          id: "f7a9ec6b-552b-4f03-970c-c5671f51f865",
          name: "id",
          type: "string",
        },
        "eebcf2a8-c9e5-4fe8-ab31-dbb251646526": {
          id: "eebcf2a8-c9e5-4fe8-ab31-dbb251646526",
          name: "name",
          type: "string",
        },
        "e4b56ff9-f7e1-45b3-bca4-e82afe46b6c0": {
          name: "user",
          id: "e4b56ff9-f7e1-45b3-bca4-e82afe46b6c0",
          type: "object",
          properties: {
            "4bb65fe7-b686-499d-9079-780c3a39f278": {
              id: "4bb65fe7-b686-499d-9079-780c3a39f278",
              name: "name",
              type: "string",
            },
            "b6486c7b-631e-4bb7-aa34-d19b4a579c28": {
              id: "b6486c7b-631e-4bb7-aa34-d19b4a579c28",
              name: "age",
              type: "string",
            },
          },
        },
      },
    },
  };

  const result = compile(object);
  expect(result).toEqual({
    "bd574ff0-a4e1-4d9b-be26-2d09a722ec0c": {
      id: "bd574ff0-a4e1-4d9b-be26-2d09a722ec0c",
      type: "object",
      properties: {
        "f7a9ec6b-552b-4f03-970c-c5671f51f865": {
          id: "f7a9ec6b-552b-4f03-970c-c5671f51f865",
          name: "id",
          type: "string",
        },
        "eebcf2a8-c9e5-4fe8-ab31-dbb251646526": {
          id: "eebcf2a8-c9e5-4fe8-ab31-dbb251646526",
          name: "name",
          type: "string",
        },
        "e4b56ff9-f7e1-45b3-bca4-e82afe46b6c0": {
          name: "user",
          id: "e4b56ff9-f7e1-45b3-bca4-e82afe46b6c0",
          type: "object",
          properties: {
            "4bb65fe7-b686-499d-9079-780c3a39f278": {
              id: "4bb65fe7-b686-499d-9079-780c3a39f278",
              name: "name",
              type: "string",
            },
            "b6486c7b-631e-4bb7-aa34-d19b4a579c28": {
              id: "b6486c7b-631e-4bb7-aa34-d19b4a579c28",
              name: "age",
              type: "string",
            },
          },
        },
      },
    },
    "f7a9ec6b-552b-4f03-970c-c5671f51f865": {
      id: "f7a9ec6b-552b-4f03-970c-c5671f51f865",
      name: "id",
      type: "string",
    },
    "eebcf2a8-c9e5-4fe8-ab31-dbb251646526": {
      id: "eebcf2a8-c9e5-4fe8-ab31-dbb251646526",
      name: "name",
      type: "string",
    },
    "e4b56ff9-f7e1-45b3-bca4-e82afe46b6c0": {
      name: "user",
      id: "e4b56ff9-f7e1-45b3-bca4-e82afe46b6c0",
      type: "object",
      properties: {
        "4bb65fe7-b686-499d-9079-780c3a39f278": {
          id: "4bb65fe7-b686-499d-9079-780c3a39f278",
          name: "name",
          type: "string",
        },
        "b6486c7b-631e-4bb7-aa34-d19b4a579c28": {
          id: "b6486c7b-631e-4bb7-aa34-d19b4a579c28",
          name: "age",
          type: "string",
        },
      },
    },
    "4bb65fe7-b686-499d-9079-780c3a39f278": {
      id: "4bb65fe7-b686-499d-9079-780c3a39f278",
      name: "name",
      type: "string",
    },
    "b6486c7b-631e-4bb7-aa34-d19b4a579c28": {
      id: "b6486c7b-631e-4bb7-aa34-d19b4a579c28",
      name: "age",
      type: "string",
    },
  });
});
