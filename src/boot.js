import Settings from "./settings";
import vfs from "./vfs";

const run = () => {
  if (!Settings.debug()) {
    console.debug = () => {};
  }

  vfs.init();
};

export default { run };
