import time
import asyncio
from websockets.sync.client import connect
import json
import requests
from uuid import uuid4
from pprint import pprint

game_id = str(uuid4())

game = requests.get("http://localhost:9000/create-game/1/LOCAL_TWO_PLAYERS").json()

pprint(game, None, 4)

def start(ws):
  ws.send(json.dumps({"action": "start"}))
  message = ws.recv()
  return json.loads(message)

actions_map = {
 "start": start
}






def hello():
    with connect(f"ws://localhost:9000/ws/pong/{game['game_id']}") as websocket:
        
      res = actions_map["start"](websocket)
      pprint(res, None, 4)
      print(res.keys())
      time.sleep(1)  

      while True:
        message = json.loads(websocket.recv())
        print(message["game_state"]["ball"]["position"])
        time.sleep(1)







hello()