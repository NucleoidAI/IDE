import { publish } from "./hooks/useEvent";
import service from "./service";
// TODO refactor this file
const scheduler = {
  timer: null,
  start() {
    if (!this.timer) {
      service
        .metrics()
        .then((data) => {
          publish("RUNTIME_CONNECTION", {
            status: true,
            metrics: data,
          });
        })
        .catch((err) => {
          this.stop();
          publish("RUNTIME_CONNECTION", {
            status: false,
            metrics: { total: 100, free: 50 },
          });
          publish("SWAGGER_DIALOG", { state: false });
        });

      this.timer = setInterval(() => {
        service
          .metrics()
          .then((data) => {
            console.log(data);
            publish("RUNTIME_CONNECTION", {
              status: true,
              metrics: data,
            });
          })
          .catch((err) => {
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
