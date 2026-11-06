import { getSocket } from "../utils/socket";

let notifyFn = null;

export function setNotifyFunction(fn) {
  notifyFn = fn;
}

export function notify(title, options = {}) {
  if (notifyFn) {
    notifyFn(title, options);
  }
}

// Not a React hook: registers the socket listener that shows notifications.
export function initNotifications() {
  const socket = getSocket();

  const showNotification = (title, options = {}) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, options);
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
  };

  socket.on("notification", ({ title, options }) => {
    notify(title, options);
  });

  setNotifyFunction(showNotification);

  return () => {
    socket.off("notification");
  };
}

export default initNotifications;
