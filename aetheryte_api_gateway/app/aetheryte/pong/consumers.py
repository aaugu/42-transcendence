import json
import websockets
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import logging
import asyncio

logger = logging.getLogger(__name__)

class ApiPongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
          # print(self.scope['headers'])
          print(f"In connect method from API Pong Consumer")
          

          game_id = self.scope['url_route']['kwargs']['game_id']
          
          query_string = self.scope["query_string"].decode("utf-8")
          print(f"Query string: {query_string}")

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
            logger.error(f'Send Error: {e}')
            await self.close(3000, "Service unavailable or you're unauthorized to proceed")

    async def pong_handler(self):
        try:
            while True:
                message = await self.pong_ws.recv()
                await self.send(text_data=message)
        except websockets.exceptions.ConnectionClosed:
            pass
        except Exception as e:
            logger.error(f'Error in pong_handler method: {e}')
            await self.close(3000, "Service unavailable or you're unauthorized to proceed")