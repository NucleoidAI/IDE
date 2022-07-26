const gtag = (command, method, payload, ...args) => {
  if (command === "event") {
    payload = payload || {};
    payload["page_location"] = window.location.href;
    payload["page_path"] = window.location.pathname;
  }

  console.debug(`gtag - command: ${command}, method: ${method}`);
  setTimeout(() => window.gtag(command, method, payload, ...args), 0);
};

export default gtag;
