const openWsButton = document.getElementById("open_ws");
const closeWsButton = document.getElementById("close_ws");
const form = document.getElementById("form");
const socketStatus = document.getElementById("status");
const list = document.getElementById("list");
const message = document.getElementById("message");

let socket = null;

function setConnectedUI(connected) {
  openWsButton.disabled = connected;
  closeWsButton.disabled = !connected;
  message.disabled = !connected;
  form.querySelector('button[type="submit"]').disabled = !connected;
}

setConnectedUI(false);

openWsButton.addEventListener("click", () => {
  setConnectedUI(true);
  socketStatus.innerHTML = "Connecting ...";

  let url = "ws://127.0.0.1:8080";
  socket = new WebSocket(url);

  socket.onopen = (event) => {
    list.innerHTML = "";
    console.log("Socket connection status: " + socket.readyState);
    socketStatus.innerHTML = `Connected to: ${event.currentTarget.url}`;
    setConnectedUI(true);
  };

  socket.onmessage = function (msg) {
    console.log("Message received: ", msg.data);
    list.innerHTML += `<li><span>RECEIVED:</span> ${msg.data}</li>`;
  };

  socket.onclose = (event) => {
    console.log("Close event fired", event.code);
    list.innerHTML = "";
    switch (event.code) {
      case 1006:
        socketStatus.innerHTML =
          "Status: Not connected (Network connection error)";
        break;
      case 1001:
        socketStatus.innerHTML = `Status: Not connected (${event.reason})`;
        break;
      default:
        socketStatus.innerHTML = `Status: Not connected`;
    }
    message.setAttribute("required", "true");
    setConnectedUI(false);
  };

  socket.onerror = (error) => {
    console.log("Error event was thrown: ", error);
    socketStatus.innerHTML = "Error.";
    setConnectedUI(false);
  };
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (socket && socket.readyState === 1) {
    socket.send(message.value);
    list.innerHTML += "<li><span>SENT:</span> " + message.value + "</li>";
    message.value = "";
  }
});

closeWsButton.addEventListener("click", () => {
  if (socket && socket.readyState === 1) {
    socketStatus.innerHTML = "closing ... please wait ...";
    socket.close(1000, "Closed by user");
  }
});
