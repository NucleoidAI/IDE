import { publish } from "@nucleoidai/react-event";
import service from "./service";
// TODO refactor this file
const scheduler = {
  timer: null,
  start() {
    service
      .metrics()
      .then((data) => {
        publish("RUNTIME_CONNECTION", {
          status: true,
          metrics: data,
        });
      })
      .catch(() => {
        this.stop();
        publish("RUNTIME_CONNECTION", {
          status: false,
          metrics: { total: 100, free: 50 },
        });
        publish("SWAGGER_DIALOG", { state: false });
      });

    if (!this.timer) {
      this.timer = setInterval(() => {
        service
          .metrics()
          .then((data) => {
            console.debug(data);
            publish("RUNTIME_CONNECTION", {
              status: true,
              metrics: data,
            });
          })
          .catch(() => {
            this.stop();
            publish("RUNTIME_CONNECTION", {
              status: false,
              metrics: { total: 100, free: 50 },
            });
            publish("SWAGGER_DIALOG", { state: false });
          });
      }, 60 * 1000);
    }
  },
  stop() {
    clearInterval(this.timer);
    this.timer = null;
  },
};

export default scheduler;
