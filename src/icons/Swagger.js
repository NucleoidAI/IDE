import { ReactComponent as SwaggerSVG } from "./Swagger.svg";

function Swagger({ fill, disabled }) {
  return (
    <SwaggerSVG
      style={{ width: 25, height: 25 }}
      fill={disabled ? "#6a7178" : fill}
    />
  );
}

export default Swagger;
