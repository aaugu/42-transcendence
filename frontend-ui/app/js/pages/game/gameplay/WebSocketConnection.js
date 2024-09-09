import {userID} from "../../user/updateProfile.js";

export default function createWebSocketConnection() {
  // const socket = new WebSocket("ws://" + window.location.host + "/ws/pong/");

  // Generate a unique ID

  const currentUrl = window.location.href;

  const mode = currentUrl.split("/")[3];

  console.log(`Game and URLS: ${currentUrl} ${mode} ${userID}`);

}