import React from "react";

function Logo(props) {
  return (
    <div>
      <font face="Segoe UI" color="#28a745" style={{ fontSize: "22px" }}>
        Nucleoid
      </font>
      <font face="Segoe UI" color="#bfbfbf" style={{ fontSize: "18px" }}>
        &nbsp;
        {props.title}
      </font>
    </div>
  );
}

export default Logo;
