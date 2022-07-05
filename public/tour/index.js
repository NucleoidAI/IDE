const tourRoot = document.getElementById("tour");

const messageBox = (selector, title, message) => {
  return `
<div style="
position: absolute;
width: 100%;
padding: 10px;
color: #c3c5c8;
background-color: #353e48;
font-weight: normal;
font-size: 13px;
border-radius: 8px;
position: absolute;
box-sizing: border-box;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
">
<div style="
content: '';
position: absolute;
width: 12px;
height: 12px;
left: 237px;
top: 20px;
transform: translate(50%, -50%) rotate(-45deg);
background-color: #353e48;
"
>
</div>
<div>
<div style="
padding-bottom: 15px;
display: flex;
align-items: center;
justify-content: space-between;
"><strong>
${title}
</strong>
<span style="
transform: rotate(45deg);
font-size: 24px;
cursor: pointer;
"
onclick='closeMessageBox("${selector}")'>+</span>
</div>
${message}
</div>
</div>
`;
};

let changeSize;

const eventManager = (event) => {
  const { selector, eventType, title, body } = event.detail;

  switch (eventType) {
    case "message": {
      message(selector, "start", title, body);

      break;
    }
    case "message_close": {
      message(selector, "stop");

      break;
    }

    default:
      break;
  }
};

const closeMessageBox = (selector) => {
  window.dispatchEvent(
    new CustomEvent("tourEvent", {
      detail: { selector: selector, eventType: "message_close" },
    })
  );
};

const message = function (selector, status, title, body) {
  const element = document.querySelectorAll(`[nuc="${selector}"]`)[0];
  let div;

  if (document.getElementById("nuc-msgbox-" + selector)) {
    div = document.getElementById("nuc-msgbox-" + selector);
  } else {
    div = document.createElement("div");
    div.id = "nuc-msgbox-" + selector;
    div.style = `width: 250px;    position: absolute;    text-align: left;    z-index: 999999;;`;
    div.innerHTML = messageBox(selector, title, body);
    changeSize = () => {
      div.style.top = element.getBoundingClientRect().y + "px";
      div.style.left = element.getBoundingClientRect().x - 270 + "px";
    };
    changeSize();
    tourRoot.appendChild(div);
  }

  if (status === "start") {
    resizeListener("start", changeSize);
  } else {
    resizeListener("stop", changeSize);
    div.remove();
  }
};

const resizeListener = (status, event) => {
  if (status === "start") {
    window.addEventListener("resize", event, true);
  } else {
    window.removeEventListener("resize", event, true);
  }
};

const tour = function (status) {
  if (status === "start") {
    window.addEventListener("tourEvent", eventManager, true);
  } else {
    window.removeEventListener("tourEvent", eventManager, true);
  }
};

tour("start");
