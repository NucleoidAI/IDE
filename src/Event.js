import { v4 as uuid } from "uuid";

const subscriptions = {};

const subscribe = (eventType, callback) => {
  const id = uuid();

  if (!subscriptions[eventType]) subscriptions[eventType] = {};

  subscriptions[eventType][id] = callback;

  return {
    unsubscribe: () => {
      delete subscriptions[eventType][id];
      if (Object.keys(subscriptions[eventType]).length === 0)
        delete subscriptions[eventType];
    },
  };
};

const publish = (eventType, arg) => {
  if (!subscriptions[eventType]) return;
  Promise.resolve().then(() => {
    Object.keys(subscriptions[eventType]).forEach((key) =>
      subscriptions[eventType][key](arg)
    );
  });
};

const Event = {
  subscribe,
  publish,
};

export default Event;
