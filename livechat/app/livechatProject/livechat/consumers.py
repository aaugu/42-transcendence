import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from livechat.models import Message, Conversation
from datetime import datetime
from asgiref.sync import sync_to_async

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
		author_id = self.scope['user'].id  # ID de l'utilisateur connecté
		current_date = datetime.now().strftime("%Y-%m-%d")
		current_time = datetime.now().strftime("%H:%M:%S")

		# Récupérer la conversation
		try:
			conversation = await sync_to_async(Conversation.objects.get)(id=self.conversation_id)
		except Conversation.DoesNotExist:
			return  # Si la conversation n'existe pas, ne rien faire
		
		# Sauvegarder le message dans la base de données
		await sync_to_async(Message.objects.create)(
			conversation=conversation,
			author=author_id,
			message=message_content,
			date=current_date,
			time=current_time
		)

		# Envoyer le message via WebSocket à tous les utilisateurs du groupe
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

	# Recevoir un message du groupe de chat
	async def chat_message(self, event):
		message = event['message']
		author = event['user']
		date = datetime.now().strftime("%Y-%m-%d")
		time = datetime.now().strftime("%H:%M:%S")

		# Envoyer le message via WebSocket aux clients connectés
		await self.send(text_data=json.dumps({
			'message': message,
			'author': author,
			'date': date,
			'time': time
		}))