import Confetti from "../Confetti";
import LandingDialog from "../LandingDialog";
import MessageDialog from "../MessageDialog";
import MessagePopper from "../MessagePopper";
import React from "react";
import Settings from "../../settings";
import StarUsMessageDialog from "../StarUsMessageDialog/StarUsMessageDialog";
import gtag from "../../gtag";
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
      return <MessagePopper title={""} openTime={6000} />;

    case 2:
      return null;

    case 3: {
      Settings.landing({ level: 4 });
      gtag("event", "confetti");

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
            lifeTime={10000}
          />
          <Confetti />
        </>
      );
    }

    case 4: {
      return (
        <StarUsMessageDialog
          key={uuid()}
          message={{
            status: true,
            vertical: "bottom",
            horizontal: "right",
          }}
          openTime={6000}
        />
      );
    }

    default:
      return null;
  }
};

export default Onboard;
