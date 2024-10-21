# Generated by Django 5.1.2 on 2024-10-20 18:10

import django.db.models.deletion
import django.utils.timezone
import gitupper.user.models
import environ

from pathlib import Path
from django.conf import settings
from django.db import migrations, models


BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(BASE_DIR / '.env')

    
class Migration(migrations.Migration):

    initial = True

    def generate_superuser(apps, schema_editor):
        from gitupper.user.models import UserAdmin, User

        DJANGO_SU_NAME = env('DJANGO_SU_NAME')
        DJANGO_SU_EMAIL = env('DJANGO_SU_EMAIL')
        DJANGO_SU_PASSWORD = env('DJANGO_SU_PASSWORD')
        
        super_user = User.objects.create_superuser(
            gitupper_id=0,
            email=DJANGO_SU_EMAIL,
            password=DJANGO_SU_PASSWORD,
            first_name=DJANGO_SU_NAME,
            last_name=DJANGO_SU_NAME,
        )
        
        super_user.profile_image="images/user_default.png"
        super_user.save()
        
    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='GithubUser',
            fields=[
                ('github_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('github_email', models.EmailField(max_length=100, unique=True)),
                ('github_access_token', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='TemporaryProgress',
            fields=[
                ('gitupper_id', models.BigIntegerField(primary_key=True, serialize=False)),
                ('value', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('gitupper_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=60, unique=True, verbose_name='email')),
                ('profile_image', models.ImageField(default='images/user_default.png', null=True, upload_to=gitupper.user.models.get_images_directory, verbose_name='Image')),
                ('first_name', models.CharField(max_length=30, verbose_name='first_name')),
                ('last_name', models.CharField(max_length=30, verbose_name='last_name')),
                ('verify_token', models.CharField(max_length=64, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
                ('github_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='gitupper.githubuser')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='BeeUser',
            fields=[
                ('bee_id', models.CharField(max_length=9, primary_key=True, serialize=False, unique=True)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(blank=True, max_length=30, null=True)),
                ('email', models.EmailField(max_length=60, unique=True, verbose_name='email')),
                ('access_token', models.CharField(max_length=256, null=True)),
                ('token_expires', models.DateTimeField(null=True)),
                ('gitupper_user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='BeeSubmission',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('problem_number', models.IntegerField()),
                ('problem_name', models.CharField(max_length=100)),
                ('category', models.CharField(max_length=100)),
                ('status', models.CharField(max_length=50)),
                ('prog_language', models.CharField(max_length=20)),
                ('time', models.CharField(max_length=5)),
                ('date_submitted', models.DateTimeField()),
                ('source_code', models.TextField()),
                ('filename', models.CharField(max_length=100)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.beeuser')),
            ],
        ),
        migrations.CreateModel(
            name='HackerUser',
            fields=[
                ('hacker_id', models.IntegerField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(blank=True, max_length=30, null=True)),
                ('email', models.EmailField(max_length=60, unique=True, verbose_name='email')),
                ('access_token', models.CharField(max_length=256, null=True)),
                ('token_expires', models.DateTimeField(null=True)),
                ('gitupper_user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='HackerSubmission',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('problem_name', models.CharField(max_length=100)),
                ('challenge_id', models.IntegerField()),
                ('contest_id', models.IntegerField()),
                ('status', models.CharField(max_length=50)),
                ('prog_language', models.CharField(max_length=20)),
                ('category', models.CharField(max_length=20)),
                ('date_submitted', models.DateTimeField()),
                ('source_code', models.TextField()),
                ('display_score', models.FloatField()),
                ('filename', models.CharField(max_length=100)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.hackeruser')),
            ],
        ),
        migrations.CreateModel(
            name='LeetUser',
            fields=[
                ('leet_id', models.CharField(max_length=9, primary_key=True, serialize=False, unique=True)),
                ('first_name', models.CharField(blank=True, max_length=30)),
                ('last_name', models.CharField(blank=True, max_length=30, null=True)),
                ('email', models.EmailField(max_length=60, unique=True, verbose_name='email')),
                ('access_token', models.CharField(max_length=1024, null=True)),
                ('token_expires', models.DateTimeField(null=True)),
                ('gitupper_user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='LeetSubmission',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('problem_number', models.IntegerField()),
                ('problem_name', models.CharField(max_length=100)),
                ('status', models.CharField(max_length=50)),
                ('prog_language', models.CharField(max_length=20)),
                ('category', models.CharField(max_length=20)),
                ('date_submitted', models.DateTimeField()),
                ('source_code', models.TextField()),
                ('filename', models.CharField(max_length=100)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.leetuser')),
            ],
        ),
        migrations.CreateModel(
            name='RepoComment',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('message', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.githubuser')),
            ],
        ),
        migrations.CreateModel(
            name='RepoCommentReply',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('message', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('comment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.repocomment')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.githubuser')),
            ],
        ),
        migrations.CreateModel(
            name='RepoEvent',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('message', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('is_public', models.BooleanField(default=False)),
                ('is_deleted', models.BooleanField(default=False)),
                ('link', models.URLField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.githubuser')),
            ],
            options={
                'ordering': ['-date_created'],
            },
        ),
        migrations.AddField(
            model_name='repocomment',
            name='repo_event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.repoevent'),
        ),
        migrations.CreateModel(
            name='RepoEventReaction',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('reaction', models.CharField(max_length=20)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('repo_event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.repoevent')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.githubuser')),
            ],
        ),
        migrations.CreateModel(
            name='RepoSubmission',
            fields=[
                ('object_id', models.PositiveIntegerField(primary_key=True, serialize=False)),
                ('repo_event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gitupper.repoevent')),
                ('submission', models.ForeignKey(limit_choices_to={'model__in': ['beesubmission', 'hackersubmission', 'leetsubmission']}, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
        ),
        migrations.CreateModel(
            name='SubmissionTracker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('platform_prefix', models.CharField(max_length=10)),
                ('object_id', models.PositiveIntegerField()),
                ('gitupper_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('last_submission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
            options={
                'constraints': [models.UniqueConstraint(fields=('gitupper_user', 'platform_prefix'), name='unique_user_platform')],
            },
        ),
        migrations.RunPython(generate_superuser),
    ]
