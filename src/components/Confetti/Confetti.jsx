import React from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

const Confetti = () => {
  const refAnimationInstance = React.useRef(null);
  const getInstance = React.useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = React.useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.9 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = React.useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 9999999999,
  };

  React.useEffect(() => {
    fire();
  }, [fire]);

  return <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />;
};

export default Confetti;
