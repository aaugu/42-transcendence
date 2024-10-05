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

		try:
			query_string = self.scope["query_string"].decode("utf-8")
			query_params = parse_qs(query_string)
			self.user_id = int(query_params.get("user_id", [None])[0])
			user = await sync_to_async(User.objects.get)(user_id=self.user_id)
		except User.DoesNotExist:
			await self.close(3000, "Unauthorized")
			return
		
		try:
			conversation = await self.get_conversation(self.conversation_id)
		except Conversation.DoesNotExist:
			await self.close(4000, "Conversation does not exists")
			return
		if conversation.user_1 == self.user_id or conversation.user_2 == self.user_id:
			await self.accept()
		else:
			await self.close(3000, "Unauthorized")


	async def disconnect(self, close_code):
		pass

	async def receive(self, text_data):
		try:
			text_data_json = json.loads(text_data)
			message_content = text_data_json['message']
			author_id = text_data_json['author']
			print(f"Received message from user {self.user_id}: {text_data_json['message']}")
		except:
			await self.send(text_data=json.dumps({ 'error': 'Empty'}))
			return

		current_date = datetime.now().strftime("%Y-%m-%d")
		current_time = datetime.now().strftime("%H:%M")

		try:
			conversation = await self.get_conversation(self.conversation_id)
		except Conversation.DoesNotExist:
			await self.send(text_data=json.dumps({ 'error': "Conversation does not exists", 'code': 4004}))
			return
		
		if self.user_id != author_id:
			await self.send(text_data=json.dumps({ 'error': "Unauthorized", 'code': 3000}))
			return

		if (conversation.user_1 == author_id):
			target_id = conversation.user_2
		else:
			target_id = conversation.user_1
		
		try:
			target = await self.get_user(target_id)
			author = await self.get_user(author_id)
		except User.DoesNotExist:
			await self.send(text_data=json.dumps({ 'error': "User does not exists", 'code': 4004}))
			return

		blacklist = await self.get_blacklist(target, author)

		if not blacklist:
			await sync_to_async(Message.objects.create)(
				conversation=conversation,
				author=author_id,
				message=message_content,
				date=current_date,
				time=current_time
			)

			await self.send(text_data=json.dumps(
				{
					'type': 'chat_message',
					'message': message_content,
					'author': author_id,
					'date': current_date,
					'time': current_time,
					'blacklist': False
				})
			)
			print(f"Sent message from user {self.user_id}: {message_content}")
		else:
			await self.send(text_data=json.dumps({
				'blacklist': True,
			}))


	@database_sync_to_async
	def get_blacklist(self, initiator, target):
		try:
			data = Blacklist.objects.get(initiator=initiator, target=target)
		except:
			data = None
		return data
	
	@database_sync_to_async
	def get_user(self, id):
		return User.objects.get(user_id=id)

	@database_sync_to_async
	def get_conversation(self, conversation_id):
		return Conversation.objects.get(id=conversation_id)