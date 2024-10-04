import json
import websockets
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

class ApiChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		try:
			token = headers[b'cookie'].decode().split('=')[1]
			# user_id = get_user_id(token)
			# if not user_id:
			# 	await self.close(3000, "Unauthorized")
			# 	return

			conversation_id = self.scope['url_route']['kwargs']['conversation_id']
			url = f"ws://172.20.5.2:8000/ws/chat/{conversation_id}"
			# url = f"ws://172.20.5.2:8000/ws/chat/{conversation_id}?user_id=${user_id}"
			
			self.livechat_ws = await websockets.connect(url)
			await self.accept()
		except Exception:
			await self.close(4000, "Service unavailable or conversation does not exists")

	async def receive(self, text_data):
		try:
			await self.livechat_ws.send(text_data)
			response = await self.livechat_ws.recv()
			await self.send(text_data=response)
		except Exception:
			await self.close(3000, "Service unavailable or you're unauthorized to proceed")


	async def disconnect(self, close_code):
		try:
			await self.livechat_ws.close()
		except:
			pass