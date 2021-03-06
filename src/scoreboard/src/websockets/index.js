import { VALID_BOT_INDEXES, BOT_MODES } from "../selectors/enums";

const GAME_CONTROLLER_URL = "ws://192.168.1.2:6789";

let onMessage = null;
let ws = null;

export function startClient(onMessageCb) {
  onMessage = onMessageCb;
  if (!ws) {
    ws = new WebSocket(GAME_CONTROLLER_URL);
    ws.onerror = handleError;
    ws.onclose = handleClose;
    ws.onmessage = handleMessage;
  }
  return ws;
}

function handleError(event) {
  console.log("got websocket error", event);
}

function handleClose() {
  console.log("ws connection closed.  reestablishing in 5 seconds");
  ws = null;
  setTimeout(() => {
    startClient(onMessage);
  }, 5000);
}

function handleMessage(event) {
  // console.log("got ws message: ", event);
  const data = JSON.parse(event.data);
  onMessage(data);
}

export function sendMessage(obj) {
  return ws.send(JSON.stringify(obj));
}

export function sendGameStart() {
  return sendMessage({ type: "gameStart" });
}

export function sendGameStop() {
  return sendMessage({ type: "gameStop" });
}

export function sendGamePause() {
  return sendMessage({ type: "gamePause" });
}

export function sendGameResume() {
  return sendMessage({ type: "gameResume" });
}

export function sendReturnToHome() {
  return sendMessage({ type: "gameReturnToHome" });
}

export function sendAllBotsToAuto() {
  const data = VALID_BOT_INDEXES.map((index) => ({
    botIndex: index,
    mode: BOT_MODES.auto,
  }));
  return sendMessage({
    type: "botModes",
    data,
  });
}

export function sendBotMode(botIndex, botMode) {
  return sendMessage({
    type: "botMode",
    data: {
      botIndex,
      mode: botMode,
    },
  });
}

export function sendManualPosition(botIndex, x, y) {
  return sendMessage({
    type: "manualPosition",
    data: {
      botIndex,
      x,
      y,
      heading: 0,
    },
  });
}

export function sendManualThrottle(botIndex, left, right) {
  return sendMessage({
    type: "manualThrottle",
    data: {
      botIndex,
      left,
      right,
    },
  });
}

export function increaseScore(botIndex) {
  return sendMessage({
    type: "increaseScore",
    data: {
      botIndex,
    },
  });
}

export function decreaseScore(botIndex) {
  return sendMessage({
    type: "decreaseScore",
    data: {
      botIndex,
    },
  });
}

export function playVideo(video) {
  return sendMessage({
    type: "playVideo",
    data: { video },
  });
}
