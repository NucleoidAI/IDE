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
        global: { level: 1, timer: null },
        api: { level: 1, timer: null },
        functions: { level: 1, timer: null },
        query: { level: 1, timer: null },
      })
    );
  },
  tour: (content) => {
    if (content) {
      localStorage.setItem(
        "tour",
        JSON.stringify({
          global: content.global,
          disable: content.disable,
          api: content.api,
          functions: content.functions,
          query: content.query,
        })
      );
      tour.cache = {
        global: content.global,
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
