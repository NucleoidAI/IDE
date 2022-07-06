import tour from "./tour";

const tourStep = () => {
  if (tour.cache.disable) return;
  const page = window.location.pathname.split("/").pop();

  if (tour.cache.global.level === 1) {
    setTimeout(() => {
      tour.tourEvent(
        "",
        "global_message",
        `Star us in <a href="https://github.com/NucleoidJS/Nucleoid" target="blank">Github</a>`,
        "test"
      );
      setTimeout(() => {
        tour.tourEvent("", "global_message_close");
      }, 5000);
    }, 20 * 1000);

    setTimeout(() => {
      tour.tourEvent(
        "",
        "global_message",
        `Join <a href="https://github.com/NucleoidJS/Nucleoid/discussions" target="blank">thinkers club</a>`,
        "test"
      );
      setTimeout(() => {
        tour.tourEvent("", "global_message_close");
      }, 5000);
    }, 2 * 60 * 1000);

    tour.tour({
      disable: false,
      global: { level: 2 },
      api: { level: 1 },
      functions: { level: 1 },
      query: { level: 1 },
    });
  }

  switch (page) {
    case "api": {
      if (!tour.cache.api.timer) {
        tour.cache.api.timer = setTimeout(() => {
          api();
        }, 5000);
      }

      break;
    }

    case "functions": {
      if (!tour.cache.api.timer) {
        tour.cache.api.timer = setTimeout(() => {
          api();
        }, 5000);
      }
      break;
    }

    case "query": {
      clearTimeout(tour.cache.api.timer);
      tour.tourEvent("run", "message_close");

      break;
    }

    default:
      break;
  }
};

const api = () => {
  switch (tour.cache.api.level) {
    case 1: {
      tour.tourEvent("run", "message", "başlık", "mesaj level 1");
      setTimeout(() => {
        tour.tourEvent("run", "message_close");
      }, 5000);
      tour.tour({
        disable: false,
        global: { label: 1 },
        api: { level: 2 },
        functions: { level: 1 },
        query: { level: 1 },
      });

      break;
    }
    case 2: {
      console.log("level 2 case");
      break;
    }

    default:
      break;
  }
};

export default tourStep;
