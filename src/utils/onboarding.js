import { storage } from "@nucleoidjs/webstorage";

import { publish, subscribe } from "@nucleoidai/react-event";

const checkOnboardingStatus = (chat) => {
  const landingData = storage.get("ide", "landing");
  const landingLevel = landingData?.level || 0;

  if (
    landingLevel === 0 &&
    chat &&
    chat.messages.filter((message) => message.code).length >= 3
  ) {
    storage.set("ide", "landing", { level: 1 });
    publish("LANDING_LEVEL_ACHIEVED", 1);
  }
};

const onboardingModule = () => {
  const handleChatChange = (chat) => {
    checkOnboardingStatus(chat);
  };

  subscribe("CHAT_SELECTED", handleChatChange);
};

export default onboardingModule;
