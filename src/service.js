import { globalState } from "./context";

const query = (value) => {
  console.log(globalState);
  /*
  fetch("http://localhost:8448", {
    method: "POST",
    body: value,
  })
    .then((response) => response.text())
    .then((data) => {
      try {
        console.log("data");
      } catch (error) {
        console.log("error");
      } 
    })
    .catch((error) => console.log("error"));
    */
};

const Service = { query };

export default Service;
