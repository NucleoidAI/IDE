import Settings from "./settings";
import vfs from "./vfs";

const run = () => {
  if (!Settings.debug()) {
    console.debug = () => {};
  }

  vfs.init();
};

const boot = { run };

export default boot;
