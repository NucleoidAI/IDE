import { storage } from "@nucleoidjs/webstorage";

import { publish, subscribe } from "@nucleoidai/react-event";

function init() {
  const subscription = subscribe("CHAT_MESSAGE_RESPONDED", (chat) => {
    const onboarding = storage.get("chat", "onboarding");

    let level;

    if (onboarding) {
      level = onboarding.level;
    } else {
      level = 0;
      storage.set("chat", "onboarding", { level });
    }

    if (!level && chat.messages.filter((message) => message.code).length >= 3) {
      storage.set("ide", "onboarding", { level: 1 });
      publish("LANDING_LEVEL_ACHIEVED", { level: 1 });
      subscription.unsubscribe();
    }
  });
}

export default { init };
