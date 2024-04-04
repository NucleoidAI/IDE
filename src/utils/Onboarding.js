import { storage } from "@nucleoidjs/webstorage";

import { publish, subscribe } from "@nucleoidai/react-event";

const onboardingModule = () => {
  let subscription;

  const checkOnboardingStatus = (chat) => {
    const landingData = storage.get("ide", "landing");
    const landingLevel = landingData?.level || 0;

    if (
      landingLevel === 0 &&
      chat &&
      chat.messages.filter((message) => message.code).length >= 3
    ) {
      storage.set("ide", "landing", { level: 1 });
      publish("LANDING_LEVEL_ACHIEVED", { level: 1 });
      subscription.unsubscribe();
    }
  };
  const handleNewMessage = (chat) => {
    checkOnboardingStatus(chat);
  };

  const init = () => {
    subscription = subscribe("NEW_MESSAGE_RECEIVED", handleNewMessage);
  };

  return {
    init,
  };
};

export default onboardingModule;
