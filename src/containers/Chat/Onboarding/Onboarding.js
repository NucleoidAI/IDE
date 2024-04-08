import { storage } from "@nucleoidjs/webstorage";

import { publish, subscribe } from "@nucleoidai/react-event";

function init() {
  const level0 = subscribe("CHAT_MESSAGE_RESPONDED", (chat) => {
    const onboarding = storage.get("chat", "onboarding");

    let level;

    if (onboarding) {
      level = onboarding.level;
    } else {
      level = 0;
      storage.set("chat", "onboarding", { level });
    }

    if (!level && chat.messages.filter((message) => message.code).length >= 3) {
      storage.set("chat", "onboarding", { level: 1 });
      publish("ONBOARDING_LEVEL_ACHIEVED", { level: 1 });
      level0.unsubscribe();
    }
  });

  const level1 = subscribe("CHAT_CONVERTED", () => {
    storage.set("chat", "onboarding", { level: 2 });
    publish("ONBOARDING_LEVEL_ACHIEVED", { level: 2 });
    level1.unsubscribe();
  });
}

export default { init };
