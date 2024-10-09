import websockets
import requests
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import asyncio
from livechat.utils import get_jwt_user_id

def get_game_data(game_id, token):
  PONG_SERVICE_URL = "http://172.20.3.2:9000"
  headers = {'Authorization': f'Bearer {token}'}
  response = requests.get(f"{PONG_SERVICE_URL}/get-game-data/{game_id}/", headers=headers)
  return response.json()

class ApiPongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
          # print(self.scope['headers'])
          headers = dict(self.scope['headers'])
          token = headers[b'cookie'].decode().split('=')[1]
          self.user_id = get_jwt_user_id(token)
          game_id = self.scope['url_route']['kwargs']['game_id']
          
          res = get_game_data(game_id, token)

          creator_id = res.get('creator_id')
          joiner_id = res.get('joiner_id')

          if self.user_id != creator_id and self.user_id != joiner_id and res.get('mode') != 'TOURNAMENT':
              print("User has no access to this game")
              await self.close(3000, "Not authorized")
              return
          
          query_string = self.scope["query_string"].decode("utf-8")

          url = f"ws://172.20.3.2:9000/ws/pong/{game_id}?{query_string}"
          self.pong_ws = await websockets.connect(url)
          
          await self.accept()
          asyncio.create_task(self.pong_handler())
        except Exception:
            await self.close(4000, "Service unavailable or conversation does not exists")


    async def disconnect(self, close_code):
        try:
            await self.pong_ws.close()
        except:
            pass

    async def receive(self, text_data):
        try:
            await self.pong_ws.send(text_data)
        except Exception as e:
            await self.close(3000, "Service unavailable or you're unauthorized to proceed")

    async def pong_handler(self):
        try:
            while True:
                message = await self.pong_ws.recv()
                await self.send(text_data=message)
        except websockets.exceptions.ConnectionClosed:
            pass
        except Exception as e:
            await self.close(3000, "Service unavailable or you're unauthorized to proceed")
