const dispatch = (payload) => {
  window.dispatchEvent(
    new CustomEvent("onboarding", {
      detail: payload,
    })
  );
};

export default dispatch;
