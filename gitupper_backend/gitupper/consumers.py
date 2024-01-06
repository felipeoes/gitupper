import json
import time
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from gitupper.platforms.models import TemporaryProgress

from channels.db import database_sync_to_async
from django.db.models.signals import post_save
from django.dispatch import receiver

from asgiref.sync import async_to_sync


from threading import Thread

MSG_TYPES = ['receive_progress', 'send_finished',
             'send_error', 'send_progress']


def check_msg_type(msg_type):
    if msg_type not in MSG_TYPES:
        raise ValueError(f'Invalid message type: {msg_type}')


def error_msg(msg):
    return {
        'type': 'error',
        'message': msg
    }

# Starts a thread that creates and updates the progress every 2 second. The thread will stop when the progress is 100%.
# The thread is used to simulate a long running process.


finished_flag = False


def start_progress_thread(gitupper_id):
    def progress_thread():
        global finished_flag

        if finished_flag:
            return

        try:
            progress = TemporaryProgress.objects.get(gitupper_id=gitupper_id)
        except TemporaryProgress.DoesNotExist:
            return

        while progress.value < 100:
            progress.value += 11
            progress.save()
            time.sleep(5)

    thread = Thread(target=progress_thread)
    thread.start()

# TemporaryProgressConsumer is used to send progress updates to the client.
# When the client connects, it will be added to a group with the name of the gitupper_id.
# When the client disconnects, it will be removed from the group.
# When the client sends a message, the consumer will retrieve the progress from the database
# and send it to the group until the progress is 100%.
# When the progress is 100%, the consumer will send a message to the group to notify
# the client that the progress is finished.
# Uses django signals to send a message to the client when the progress changes.


@receiver(post_save, sender=TemporaryProgress)
def progress_changed(sender, instance, **kwargs):
    if instance.value >= 100:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'progress_{instance.gitupper_id}', {
                'type': 'send_finished'
            }
        )
    else:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'progress_{instance.gitupper_id}', {
                'type': 'send_progress'
            }
        )


class TemporaryProgressConsumer(AsyncWebsocketConsumer):
    async def check_should_not_accept(self, gitupper_id):
        # check if user is authenticated and is the owner of the gitupper
        try:
            if not self.scope['user'].is_authenticated or not self.scope['user'].gitupper_id == gitupper_id:
                raise Exception('Usuário não autenticado')
        except Exception as e:
            print(e)
            await self.send(error_msg('Não autorizado'))
            await self.close()

    async def connect(self):
        self.gitupper_id = self.scope['url_route']['kwargs']['gitupper_id']
        self.group_name = f'progress_{self.gitupper_id}'

        # Join group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave group
        try:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
        except Exception as e:
            print(e)

    async def send(self, text_data):
        await super().send(text_data=json.dumps(text_data, ensure_ascii=False))

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        msg_type = text_data_json['type']

        check_msg_type(msg_type)

        if msg_type == 'receive_progress':
            await self.send_progress()

    async def send_progress(self, event=None):
        await self.check_should_not_accept(self.gitupper_id)

        try:
            progress = await database_sync_to_async(
                TemporaryProgress.objects.get)(gitupper_id=self.gitupper_id)

            if progress.value >= 100:
                return await self.send_finished(event)

            await self.send(text_data=({
                'type': 'send_progress',
                'value': progress.value
            }))

        except TemporaryProgress.DoesNotExist:
            await self.send(text_data=error_msg('Progress does not exist.'))

    # Receive message from group

    async def send_finished(self, event):
        global finished_flag

        finished_flag = True

        await self.send({
            'type': 'send_finished',
            'value': 'FINISHED'
        })

        # Disconnect
        await self.disconnect(1000)

    # Receive message from group
    async def error(self, event):
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': event['message']
        }))
