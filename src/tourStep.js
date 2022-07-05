import tour from "./tour";

const tourStep = () => {
  if (tour.cache.disable) return;
  const page = window.location.pathname.split("/").pop();
  //console.log(tour.cache);

  tour.cache.api.timer && clearTimeout(tour.cache.api.timer);
  tour.cache.functions.timer && clearTimeout(tour.cache.functions.timer);

  switch (page) {
    case "api": {
      tour.cache.api.timer = setTimeout(() => {
        api();
      }, 8000);
      break;
    }

    case "functions": {
      console.log("functions");
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
      tour.tour({
        disable: false,
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
