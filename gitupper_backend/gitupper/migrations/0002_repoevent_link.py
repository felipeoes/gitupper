# Generated by Django 3.2.9 on 2022-05-05 00:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gitupper', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='repoevent',
            name='link',
            field=models.URLField(blank=True, null=True),
        ),
    ]