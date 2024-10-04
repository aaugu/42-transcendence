import json
import websockets
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from livechat.utils import get_jwt_user_id

class ApiChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		try:
			headers = dict(self.scope['headers'])
			token = headers[b'cookie'].decode().split('=')[1]
			self.user_id = get_jwt_user_id(token)
			if not self.user_id:
				await self.close(3000, "Unauthorized")
				return
		except:
			await self.close(4000, "Not authorized")
			return

		try:
			conversation_id = self.scope['url_route']['kwargs']['conversation_id']
			url = f"ws://172.20.5.2:8000/ws/chat/{conversation_id}?user_id={self.user_id}"
			self.livechat_ws = await websockets.connect(url)
			await self.accept()
		except:
			await self.close(4000, "Service unavailable or conversation does not exists")

	async def receive(self, text_data):
		try:
			await self.livechat_ws.send(text_data)
			response_text_data = await self.livechat_ws.recv()
			print(response_text_data)
			await self.send(response_text_data)
			print(f"Aetheryte return to user {self.user_id} in room")
		except:
			await self.close(3000, "Service unavailable or you are not authorized to proceed")


	async def disconnect(self, close_code):
		try:
			await self.livechat_ws.close()
		except:
			pass