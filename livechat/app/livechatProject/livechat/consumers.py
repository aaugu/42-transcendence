import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from livechat.models import Message, Conversation, Blacklist
from datetime import datetime
from asgiref.sync import sync_to_async
from livechat.views.utils import blacklist_exists

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		# Récupérer l'ID de la conversation depuis l'URL
		self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
		
		# Créer un groupe WebSocket unique pour cette conversation
		self.room_group_name = f'chat_{self.conversation_id}'

		# Rejoindre le groupe correspondant à cette conversation
		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)
		# Accepter la connexion WebSocket
		await self.accept()

	async def disconnect(self, close_code):
		# Quitter le groupe de chat lors de la déconnexion
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

    # Recevoir un message depuis WebSocket
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message_content = text_data_json['message']
		author_id = text_data_json['author']
		current_date = datetime.now().strftime("%Y-%m-%d")
		current_time = datetime.now().strftime("%H:%M")

		# Check if conversation exists
		try:
			conversation = await sync_to_async(Conversation.objects.get)(id=self.conversation_id)
		except Conversation.DoesNotExist:
			return
		
		# # Get target of that conversation
		# if (conversation.user_1 == author_id):
		# 	target_id = conversation.user_2
		# else:
		# 	target_id = conversation.user_1
		
		# Check if target did blacklist author
		# blacklist = await self.get_backlist(target_id, author_id)
		# if blacklist:
		# 	await self.send(text_data=json.dumps({
		# 		'blacklist': True,
		# 	}))
		# 	return

		# Save message in database
		await sync_to_async(Message.objects.create)(
			conversation=conversation,
			author=author_id,
			message=message_content,
			date=current_date,
			time=current_time
		)

		# Send message to all users of group via WebSocket
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

	# # Receive message from chat group
	async def chat_message(self, event):
		message = event['message']
		author = event['author']
		date = event['date']
		time = event['time']

		# # Send message to connected clients via WebSocket
		await self.send(text_data=json.dumps({
			'author': author,
			'message': message,
			'date': date,
			'time': time
		}))

	# async def get_backlist(self, initiator, target):
	# 	return Blacklist.objects.filter(initiator=initiator, target=target)