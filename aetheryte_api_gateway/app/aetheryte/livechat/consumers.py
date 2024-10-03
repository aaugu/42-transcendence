import json
import websockets
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

class ApiChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		# try:
		# 	csrf_token = self.scope['headers'].get('x-csrftoken', None)
			
		# except Exception:
		# 	await self.close(3000, "Unauthorized")
		# 	return

		try:
			conversation_id = self.scope['url_route']['kwargs']['conversation_id']
			url = f"ws://172.20.5.2:8000/ws/chat/{conversation_id}"
			self.livechat_ws = await websockets.connect(url)
			await self.accept()
		except Exception:
			await self.close(4000, "Service temporarily unavailable")

	async def receive(self, text_data):
		try:
			await self.livechat_ws.send(text_data)
			response = await self.livechat_ws.recv()
			await self.send(text_data=response)
		except Exception:
			await self.close(3000, "Service temporarily unavailable")


	async def disconnect(self, close_code):
		try:
			await self.livechat_ws.close()
		except:
			pass