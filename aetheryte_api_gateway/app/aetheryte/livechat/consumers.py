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

		self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
		self.room_group_name = f'chat_{self.conversation_id}'
		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)
		print(f"User {self.user_id} joined room group {self.room_group_name}")

		try:
			url = f"ws://172.20.5.2:8000/ws/chat/{self.conversation_id}?user_id={self.user_id}"
			self.livechat_ws = await websockets.connect(url)
			await self.accept()
		except:
			await self.close(4000, "Service unavailable or conversation does not exists")

	async def receive(self, text_data):
		try:
			await self.livechat_ws.send(text_data)
			response_text_data = await self.livechat_ws.recv()
		except:
			await self.close(3001, "Service unavailable or you are not authorized to proceed")
		try:	
			print(response_text_data)
			text_data_json = json.loads(response_text_data)

			if (text_data_json['blacklist'] == True):
				print("ici2")
				await self.send(response_text_data)
			else:
				print("ici3")
				await self.channel_layer.group_send(self.room_group_name, text_data_json)
				print(f"Message sent to group {self.room_group_name}: {message_content}")
		except:
			await self.close(3002, "Service unavailable")

	async def chat_message(self, event):
		message = event['message']
		author = event['author']
		date = event['date']
		time = event['time']
		blacklist = event['blacklist']


		await self.send(text_data=json.dumps({
			'author': author,
			'message': message,
			'date': date,
			'time': time,
			'blacklist': blacklist
		}))
		print(f"Sending message to user {self.user_id} in room {self.room_group_name}")

	async def disconnect(self, close_code):
		try:
			await self.channel_layer.group_discard(
				self.room_group_name,
				self.channel_name
			)
			await self.livechat_ws.close()
		except:
			pass