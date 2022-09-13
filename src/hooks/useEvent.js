import React from "react";
import { publish, subscribe } from "../Event";

const useEvent = (subject = "") => {
  const [event, setEvent] = React.useState({});

  React.useEffect(() => {
    const subs = subscribe(subject, (event) => {
      setEvent({ ...event });
    });

    return () => {
      subs.unsubscribe();
    };
  }, [subject]);

  return [event, publish];
};

export { useEvent, publish };
