import Confetti from "../Confetti";
import LandingDialog from "../LandingDialog";
import MessageDialog from "../MessageDialog";
import MessagePopper from "../MessagePopper";
import React from "react";
import Settings from "../../settings";
import { v4 as uuid } from "uuid";

const Onboard = () => {
  const [state, setState] = React.useState(Settings.landing());

  const event = ({ detail }) => {
    Settings.landing(detail);
    setState(detail);
  };

  React.useEffect(() => {
    window.addEventListener("onboarding", event, true);
    return () => window.removeEventListener("onboarding", event, true);
  }, []);

  switch (state.level) {
    case 0:
      return <LandingDialog />;

    case 1:
      return <MessagePopper title={""} />;

    case 2: {
      setTimeout(() => {
        event({ detail: { level: 3 } });
      }, 10000);
      return (
        <>
          <MessageDialog
            key={uuid()}
            message={{
              status: true,
              vertical: "bottom",
              horizontal: "center",
              msg: "success",
            }}
            time={5000}
          />
          <Confetti />
        </>
      );
    }

    case 3: {
      return (
        <MessageDialog
          key={uuid()}
          message={{
            status: true,
            vertical: "bottom",
            horizontal: "right",
            msg: "info",
          }}
          time={5000}
        />
      );
    }

    default:
      return null;
  }
};

export default Onboard;
