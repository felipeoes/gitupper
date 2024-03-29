# Generated by Django 4.1.5 on 2023-01-07 19:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gitupper', '0005_auto_20220507_0510'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubmissionTracker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('platform_prefix', models.CharField(max_length=10)),
                ('last_submission_id', models.IntegerField(default=0)),
                ('last_submission_datetime', models.DateTimeField(auto_now=True)),
                ('gitupper_user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
