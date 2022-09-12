import Settings from "./settings";

const run = () => {
  if (!Settings.debug()) {
    console.debug = () => {};
  }
};

const boot = { run };

export default boot;
