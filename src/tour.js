const tour = {
  cache: {},
  tourEvent: (selector, eventType, title, body) => {
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
  },
  initTour: () => {
    localStorage.setItem(
      "tour",
      JSON.stringify({
        disable: false,
        api: { level: 1 },
        functions: { level: 1 },
        query: { level: 1 },
      })
    );
  },
  tour: (content) => {
    if (content) {
      localStorage.setItem(
        "tour",
        JSON.stringify({
          disable: content.disable,
          api: content.api,
          functions: content.functions,
          query: content.query,
        })
      );
      tour.cache = {
        disable: content.disable,
        api: content.api,
        functions: content.functions,
        query: content.query,
      };
    } else {
      return JSON.parse(localStorage.getItem("tour"));
    }
  },
};

export default tour;
