import { publish } from "@nucleoidjs/react-event";
import sandboxService from "./sandboxService";

// TODO refactor this file
const scheduler = {
  timer: null,
  async start() {
    try {
      const data = await sandboxService.get("metrics");
      publish("RUNTIME_CONNECTION", {
        status: true,
        metrics: data,
      });
    } catch (error) {
      this.stop();
      publish("RUNTIME_CONNECTION", {
        status: false,
        metrics: { total: 100, free: 50 },
      });
      publish("SWAGGER_DIALOG", { state: false });
    }

    if (!this.timer) {
      this.timer = setInterval(async () => {
        try {
          const data = await sandboxService.get("metrics");
          console.debug(data);
          publish("RUNTIME_CONNECTION", {
            status: true,
            metrics: data,
          });
        } catch (error) {
          this.stop();
          publish("RUNTIME_CONNECTION", {
            status: false,
            metrics: { total: 100, free: 50 },
          });
          publish("SWAGGER_DIALOG", { state: false });
        }
      }, 60 * 1000);
    }
  },
  stop() {
    clearInterval(this.timer);
    this.timer = null;
  },
};

export default scheduler;
