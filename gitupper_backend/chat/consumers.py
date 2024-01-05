import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

SYSTEM_MESSAGE = 'system_message'


def send_group_message(self, group, message, type):
    # Send message to room group
    async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {
            'type': type,
            'message': message,
            'name': group
        }
    )


clients = set()
users = set()


class RepoConsumer(WebsocketConsumer):

    def connect(self):
        global clients, users

        self.room_name = self.scope['url_route']['kwargs']['page_name']
        self.room_group_name = 'page_%s' % self.room_name
        self.user_id = self.scope['url_route']['kwargs']['gitupper_id']

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        clients.add(self.scope["client"][0])
        users.add(self.user_id)

        # send_group_message(self, self.room_group_name,
        #                    f"{self.user_id} has joined the room", SYSTEM_MESSAGE)

    def disconnect(self, close_code):
        # Leave room group
        global clients

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

        clients.remove(self.scope["client"][0])
        users.remove(self.user_id)

        # send_group_message(self, self.room_group_name,
        #                    f"{self.user_id} has left the room", SYSTEM_MESSAGE)

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        name = text_data_json['name']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'name': name
            }
        )

    # Receive system message from room group

    def system_message(self, event):
        message = event['message']
        name = event['name']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'name': name
        }))

    # Receive message from room group

    def chat_message(self, event):
        message = event['message']
        name = event['name']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'name': name
        }))


# class ChatConsumer(WebsocketConsumer):
#     def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = 'chat_%s' % self.room_name

#         # Join room group
#         async_to_sync(self.channel_layer.group_add)(
#             self.room_group_name,
#             self.channel_name
#         )

#         self.accept()

#     def disconnect(self, close_code):
#         # Leave room group
#         async_to_sync(self.channel_layer.group_discard)(
#             self.room_group_name,
#             self.channel_name
#         )

#     # Receive message from WebSocket
#     def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']
#         name = text_data_json['name']

#         # Send message to room group
#         async_to_sync(self.channel_layer.group_send)(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message,
#                 'name': name
#             }
#         )

#     # Receive message from room group
#     def chat_message(self, event):
#         message = event['message']
#         name = event['name']

#         # Send message to WebSocket
#         self.send(text_data=json.dumps({
#             'message': message,
#             'name': name
#         }))
