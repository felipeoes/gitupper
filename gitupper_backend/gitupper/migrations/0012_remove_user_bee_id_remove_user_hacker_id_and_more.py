# Generated by Django 4.1.5 on 2023-01-27 21:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gitupper', '0011_alter_user_github_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='bee_id',
        ),
        migrations.RemoveField(
            model_name='user',
            name='hacker_id',
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_admin',
        ),
        migrations.RemoveField(
            model_name='user',
            name='leet_id',
        ),
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active'),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_staff',
            field=models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status'),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_superuser',
            field=models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status'),
        ),
    ]
