import throttle from "./Throttle.js";
import { controllerRightUp, controllerRightDown, controllerLeftUp, controllerLeftDown } from "./GameConstants.js";



export default function handleKeyPress(keysPressed, socket) {
  if (!socket) return;
  const throttleSend = throttle((direction) => {
    socket.send(JSON.stringify(direction));
  }, 50);

  if (keysPressed[controllerRightUp]) {
    throttleSend({ direction_right_paddle: "up" });
    return;
  } else if (keysPressed[controllerRightDown]) {
    throttleSend({ direction_right_paddle: "down" });
    return;
  } else if (keysPressed[controllerLeftUp]) {
    throttleSend({ direction_left_paddle: "up" });
    return;
  } else if (keysPressed[controllerLeftDown]) {
    throttleSend({ direction_left_paddle: "down" });
    return;
  }
}
