export const chatData = {
  id: "cfd71642-dc6f-43cd-94ef-4fca00cef59b",
  title: "New Chat",
  messages: [
    {
      role: "USER",
      content: "define a human",
    },
    {
      role: "ASSISTANT",
      mode: "IMPERATIVE",
      type: "IMPERATIVE",
      code: "class Human {\\n name: string;\\n constructor(name: string) {\\n this.name = name;\\n }\\n}",
      content: "Define a Human class with a name property and constructor",
    },
    {
      role: "USER",
      content: "all humans are mortals",
    },
    {
      role: "ASSISTANT",
      mode: "DECLARATIVE",
      type: "DECLARATIVE",
      code: "'use declarative;\\n$Human.mortal = true;'",
      content: "Set the mortality property of all Human instances to true.",
    },
  ],
  created: 1713242648631,
};

export const emptyChatData = {
  id: "cfd71642-dc6f-43cd-94ef-4fca00cef59b",
  title: "New Chat",
  messages: [],
  created: 1713242648631,
};

export const chatDataKey = `ide.chat.sessions.${chatData.id}`;
