const TOAST_QUEUE_KEY =
  "flowdesk.toast";


const DEFAULT_DURATION =
  3500;


const VALID_TYPES =
  new Set([
    "success",
    "info",
    "warning",
    "error"
  ]);


function getToastContainer() {
  let container =
    document.querySelector(
      "#toast-container"
    );


  if (container) {
    return container;
  }


  container =
    document.createElement(
      "div"
    );


  container.id =
    "toast-container";


  container.className =
    "toast-container";


  container.setAttribute(
    "aria-live",
    "polite"
  );


  container.setAttribute(
    "aria-atomic",
    "false"
  );


  document.body.appendChild(
    container
  );


  return container;
}


function normalizeOptions(options) {
  if (
    typeof options ===
    "string"
  ) {
    return {
      message: options
    };
  }


  return options ?? {};
}


function getToastType(type) {
  return VALID_TYPES.has(type)
    ? type
    : "info";
}


export function showToast(options) {
  const {
    title = "",
    message = "",
    type = "info",
    duration = DEFAULT_DURATION
  } = normalizeOptions(options);


  if (!message && !title) {
    return null;
  }


  const toastType =
    getToastType(type);


  const container =
    getToastContainer();


  const toast =
    document.createElement(
      "div"
    );


  toast.className =
    `toast toast-${toastType}`;


  toast.setAttribute(
    "role",
    toastType === "error"
      ? "alert"
      : "status"
  );


  const indicator =
    document.createElement(
      "span"
    );


  indicator.className =
    "toast-indicator";


  indicator.setAttribute(
    "aria-hidden",
    "true"
  );


  const content =
    document.createElement(
      "div"
    );


  content.className =
    "toast-content";


  if (title) {
    const titleElement =
      document.createElement(
        "p"
      );


    titleElement.className =
      "toast-title";


    titleElement.textContent =
      title;


    content.appendChild(
      titleElement
    );
  }


  if (message) {
    const messageElement =
      document.createElement(
        "p"
      );


    messageElement.className =
      "toast-message";


    messageElement.textContent =
      message;


    content.appendChild(
      messageElement
    );
  }


  const closeButton =
    document.createElement(
      "button"
    );


  closeButton.type =
    "button";


  closeButton.className =
    "toast-close";


  closeButton.setAttribute(
    "aria-label",
    "Dismiss notification"
  );


  closeButton.textContent =
    "×";


  toast.append(
    indicator,
    content,
    closeButton
  );


  container.appendChild(
    toast
  );


  let timeoutId =
    null;


  function dismiss() {
    if (
      toast.classList.contains(
        "toast-leaving"
      )
    ) {
      return;
    }


    if (timeoutId) {
      window.clearTimeout(
        timeoutId
      );
    }


    toast.classList.remove(
      "toast-visible"
    );


    toast.classList.add(
      "toast-leaving"
    );


    window.setTimeout(
      () => {
        toast.remove();


        if (
          container.childElementCount ===
          0
        ) {
          container.remove();
        }
      },
      180
    );
  }


  closeButton.addEventListener(
    "click",
    dismiss
  );


  toast.addEventListener(
    "mouseenter",
    () => {
      if (timeoutId) {
        window.clearTimeout(
          timeoutId
        );
      }
    }
  );


  toast.addEventListener(
    "mouseleave",
    () => {
      if (duration > 0) {
        timeoutId =
          window.setTimeout(
            dismiss,
            duration
          );
      }
    }
  );


  window.requestAnimationFrame(
    () => {
      toast.classList.add(
        "toast-visible"
      );
    }
  );


  if (duration > 0) {
    timeoutId =
      window.setTimeout(
        dismiss,
        duration
      );
  }


  return toast;
}


export function queueToast(options) {
  try {
    sessionStorage.setItem(
      TOAST_QUEUE_KEY,
      JSON.stringify(
        normalizeOptions(
          options
        )
      )
    );

  } catch (error) {
    console.error(
      "FlowDesk: unable to queue toast.",
      error
    );
  }
}


export function consumeQueuedToast() {
  let storedToast;


  try {
    storedToast =
      sessionStorage.getItem(
        TOAST_QUEUE_KEY
      );

  } catch {
    return;
  }


  if (!storedToast) {
    return;
  }


  sessionStorage.removeItem(
    TOAST_QUEUE_KEY
  );


  try {
    const toast =
      JSON.parse(
        storedToast
      );


    showToast(
      toast
    );

  } catch (error) {
    console.error(
      "FlowDesk: unable to display queued toast.",
      error
    );
  }
}