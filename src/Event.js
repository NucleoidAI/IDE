import { v4 as uuid } from "uuid";

const subscriptions = {};

const subscribe = (type, callback) => {
  const id = uuid();
  if (!subscriptions[type]) subscriptions[type] = {};
  subscriptions[type][id] = callback;
};

const publish = (type, payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!subscriptions[type]) resolve();
      Object.keys(subscriptions[type]).forEach((key) => {
        subscriptions[type][key](payload);
      });
      resolve();
    }, 0);
  });
};

const Event = {
  subscribe,
  publish,
};

export default Event;
