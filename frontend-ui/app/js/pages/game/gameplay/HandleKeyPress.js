import throttle from "./Throttle.js";
import {
  controllerRightUp,
  controllerRightDown,
  controllerLeftUp,
  controllerLeftDown,
} from "./GameConstants.js";
import { userID } from "../../user/updateProfile.js";

export default function handleKeyPress(keysPressed, socket, gameState) {
    if (socket && socket.readyState !== WebSocket.OPEN) return;

    const throttleSend = throttle((direction) => {
      socket.send(JSON.stringify(direction));
    }, 1);

    const gameMode = window.location.pathname.split("/")[1];
    const isRemoteGame =
      gameMode === "remote-twoplayer" || gameMode === "join-game" || gameMode === "tournament-remote";

    const keyActionMap = {
      [controllerLeftUp]: { direction_left_paddle: "up" },
      [controllerLeftDown]: { direction_left_paddle: "down" },
      [controllerRightUp]: { direction_right_paddle: "up" },
      [controllerRightDown]: { direction_right_paddle: "down" },
    };

    if (isRemoteGame) {
    //   console.log(`UserID ${userID}, Left paddle: ${gameState.current.paddles[0].player_id} Right paddle: ${gameState.current.paddles[1].player_id}`);

      let playerIndex = null;
      // console.log(`${gameState.current.}`);
    //   console.log(` INFOS : paddle 0: ${gameState.current.paddles[0].player_id}, padde 1: ${gameState.current.paddles[1].player_id}`);
      if (userID == gameState.current.paddles[0].player_id) {
        playerIndex = 0;
        // console.log("CREATOR DETECTED", playerIndex);
      } else if (userID == gameState.current.paddles[1].player_id) {
        playerIndex = 1;
        // console.log("JOINER DETECTED", playerIndex);
      }

      if (playerIndex != null) {
        // console.log("PLAYER INDEX", playerIndex)

        const controller =
          playerIndex == 0
            ? [controllerLeftUp, controllerLeftDown]
            : [controllerRightUp, controllerRightDown];

        for (const key of controller) {
          if (keysPressed[key]) {
            throttleSend(keyActionMap[key]);
            return;
          }
        }
      }
    } else {
      for (const key in keyActionMap) {
        if (keysPressed[key]) {
          throttleSend(keyActionMap[key]);
          return;
        }
      }
    }
}
