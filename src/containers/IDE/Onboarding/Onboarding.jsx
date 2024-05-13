import Confetti from "../../../components/Confetti/index.js";
import LandingDialog from "../../../components/LandingDialog/index.js";
import MessageDialog from "../../../components/MessageDialog/index.js";
import MessagePopper from "../../../components/MessagePopper/index.js";
import React from "react";
import Settings from "../../../settings.js";
import StarUsMessageDialog from "../../../components/StarUsMessageDialog/StarUsMessageDialog.jsx";
import gtag from "../../../gtag.js";
import { v4 as uuid } from "uuid";

const Onboarding = () => {
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
          openTime={10000}
        />
      );
    }

    default:
      return null;
  }
};

export default Onboarding;
