const apiActionTemplates = {
  GET: `function action(req) {
    const { id } = req.params;
    return { id: id, name: 'John Doe' };
  }`,

  POST: `function action(req) {
    const { name } = req.body;
    return { id: '123', name: name };
  }`,

  PUT: `function action(req) {
    const { id } = req.params;
    const { name } = req.body;
    return { id: id, name: name };
  }`,

  DEL: `function action(req) {
    const { id } = req.params;
    return { message: \`Resource with ID \${id} deleted successfully\` };
  }`,

  PATCH: `function action(req) {
    const { id } = req.params;
    const { name } = req.body;
    return { id: id, name: name };
  }`,
};

export default apiActionTemplates;
