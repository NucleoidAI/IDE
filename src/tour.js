const tourEvent = (selector, eventType, title, body) => {
  window.dispatchEvent(
    new CustomEvent("tourEvent", {
      detail: {
        selector,
        eventType,
        title,
        body,
      },
    })
  );
};

export default tourEvent;
