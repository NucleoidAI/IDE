const ActionTemplate = {
  GET: `function action(req) {
    const params = req.params;
    return {};
  }`,

  POST: `function action(req) {
    const body = req.body;
    return {};
  }`,

  PUT: `function action(req) {
    const params = req.params;
    const body = req.body;
    return {};
  }`,

  PATCH: `function action(req) {
    const params = req.params;
    const body = req.body;
    return {};
  }`,

  DEL: `function action(req) {
    const params = req.params;
    return {};
  }`,
};

export default ActionTemplate;
