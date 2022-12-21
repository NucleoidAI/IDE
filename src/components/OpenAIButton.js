import React from "react";

const OpenAIButton = ({ clickEvent }) => {
  return (
    <div
      onClick={clickEvent}
      style={{
        position: "relative",
        width: 65,
        height: 25,
        bottom: 40,
        left: 15,
      }}
    >
      OPEN AI
    </div>
  );
};

export default OpenAIButton;
