# Generated by Django 3.2.9 on 2022-05-07 05:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gitupper', '0004_auto_20220507_0438'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='repoevent',
            name='associated_submissions',
        ),
        migrations.AddField(
            model_name='reposubmission',
            name='repo_event',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='gitupper.repoevent'),
            preserve_default=False,
        ),
    ]