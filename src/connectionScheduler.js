import service from "./service";
import { publish } from "./hooks/useEvent"; //eslint-disable-line

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
