const classPrompt = {
  role: "ASSISTANT",
  mode: "IMPERATIVE",
  type: "IMPERATIVE",
  code: "class Human {\n  name: string;\n  constructor(name: string) {\n    this.name = name;\n  }\n}",
  content: "Define a Human class with a name property and constructor",
};

const declarationPrompt = {
  role: "ASSISTANT",
  mode: "DECLARATIVE",
  type: "DECLARATIVE",
  code: "'use declarative;\n$Human.mortal = true;'",
  content: "Define all humans as mortal in declarative mode.",
};

const functionPrompt = {
  role: "ASSISTANT",
  mode: "IMPERATIVE",
  type: "IMPERATIVE",
  code: "function greet(name: string) {\n  return `Hello, ${name}!`;\n}",
  content: "Define a function that takes a name and returns a greeting.",
};
