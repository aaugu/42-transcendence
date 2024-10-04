import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from livechat.models import Message, Conversation, Blacklist, User
from datetime import datetime
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
		self.room_group_name = f'chat_{self.conversation_id}'

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)
		try:
			conversation = await self.get_conversation(self.conversation_id)
		except Conversation.DoesNotExist:
			await self.close(4000, "Conversation does not exists")
			return

		try:
			query_string = self.scope["query_string"].decode("utf-8")
			query_params = parse_qs(query_string)
			self.user_id = int(query_params.get("user_id", [None])[0])
			user = await sync_to_async(User.objects.get)(user_id=self.user_id)
		except User.DoesNotExist:
			await self.close(3000, "Unauthorized")
			return
		print(f"User {self.user_id} joined room group {self.room_group_name}")
		if conversation.user_1 == self.user_id or conversation.user_2 == self.user_id:
			await self.accept()
		else:
			await self.close(3000, "Unauthorized")


	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		try:
			text_data_json = json.loads(text_data)
			message_content = text_data_json['message']
			author_id = text_data_json['author']
		except:
			await self.close(4000, "Empty")
			return

		current_date = datetime.now().strftime("%Y-%m-%d")
		current_time = datetime.now().strftime("%H:%M")

		try:
			conversation = await self.get_conversation(self.conversation_id)
		except Conversation.DoesNotExist:
			await self.close(4000, "Conversation does not exists")
			return
		
		if self.user_id != author_id:
			await self.close(3000, "Unauthorized")
			return

		if (conversation.user_1 == author_id):
			target_id = conversation.user_2
		else:
			target_id = conversation.user_1
		
		try:
			target = await self.get_user(target_id)
			author = await self.get_user(author_id)
		except User.DoesNotExist:
			return

		try:
			blacklist = await self.get_blacklist(target, author)
		except Blacklist.DoesNotExist:

			await sync_to_async(Message.objects.create)(
				conversation=conversation,
				author=author_id,
				message=message_content,
				date=current_date,
				time=current_time
			)

			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'chat_message',
					'message': message_content,
					'author': author_id,
					'date': current_date,
					'time': current_time
				}
			)
			print(f"Message sent to group {self.room_group_name}: {message_content}")
			return
	
		await self.send(text_data=json.dumps({
			'blacklist': True,
		}))

	async def chat_message(self, event):
		message = event['message']
		author = event['author']
		date = event['date']
		time = event['time']


		await self.send(text_data=json.dumps({
			'author': author,
			'message': message,
			'date': date,
			'time': time
		}))
		print(f"Sending message to user {self.user_id} in room {self.room_group_name}")

	@database_sync_to_async
	def get_blacklist(self, initiator, target):
		return Blacklist.objects.get(initiator=initiator, target=target)
	
	@database_sync_to_async
	def get_user(self, id):
		return User.objects.get(user_id=id)

	@database_sync_to_async
	def get_conversation(self, conversation_id):
		return Conversation.objects.get(id=conversation_id)