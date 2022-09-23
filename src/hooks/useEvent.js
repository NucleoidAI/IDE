import React from "react";

import { eventMap, publish, subscribe } from "../Event";

const useEvent = (subject = "", initialState = {}) => {
  function updateMap() {
    if (eventMap.has(subject)) {
      return eventMap.get(subject);
    } else {
      eventMap.set(subject, initialState);
      return eventMap.get(subject);
    }
  }

  const [event, setEvent] = React.useState(updateMap());

  React.useEffect(() => {
    const subs = subscribe(subject, (event) => {
      eventMap.set(subject, event);
      setEvent({ ...event });
    });

    return () => {
      subs.unsubscribe();
    };
  }, [subject]);

  return [event, publish];
};

export { useEvent, publish };
