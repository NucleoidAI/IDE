import Settings from "./settings";
import vfs from "./vfs";

const run = () => {
  if (!Settings.debug()) {
    console.debug = () => {};
  }
};

const boot = { run };

export default boot;
