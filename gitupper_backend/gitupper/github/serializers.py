from rest_framework.serializers import ModelSerializer, ListSerializer, CharField, SerializerMethodField
from rest_framework.authentication import BasicAuthentication, TokenAuthentication

from .models import GithubUser, RepoComment, RepoCommentReply, RepoSubmission, RepoEvent, RepoEventReaction


class GithubUsersSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]
    
    class Meta:
        model = GithubUser
        fields = '__all__'


class RepoCommentsSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]

    class Meta:
        model = RepoComment
        fields = '__all__'


class RepoCommentRepliesSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]

    class Meta:
        model = RepoCommentReply
        fields = '__all__'


class RepoSubmissionsSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]

    class Meta:
        model = RepoSubmission
        fields = '__all__'
        extra_kwargs = {"pk": {"read_only": False}}


class RepoSubmissionsListSerializer(ListSerializer):
    child = RepoSubmissionsSerializer()

    def update(self, instance, validated_data):
        for index, obj in enumerate(instance):
            obj.update(**validated_data[index])
        return instance


class RepoEventsSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]

    first_name = CharField(
        source='user.first_name', read_only=True)
    last_name = CharField(source='user.last_name', read_only=True)

    associated_submissions = SerializerMethodField(
        'get_submissions_infos')
    comments = SerializerMethodField('get_comments')

    # def get_submissions_infos(self, obj):
    #     submissions_infos = []
    #     for submission in obj.associated_submissions.all():
    #         platform_submission = submission.content_object
    #         submissions_infos.append({'submission_id': platform_submission.id,
    #                                  'problem_name': platform_submission.problem_name, 'problem_number': platform_submission.problem_number})

    #     return submissions_infos

    def get_submissions_infos(self, obj):
        all_submissions = []
        submissions = RepoSubmission.objects.filter(repo_event=obj)
        for submission in submissions:
            submission_obj = submission.content_object
            all_submissions.append({'submission_id': submission_obj.id,
                                   'problem_name': submission_obj.problem_name, 'problem_number': submission_obj.problem_number})
        return all_submissions

    def get_comments(self, obj):
        all_comments = []
        comments = RepoComment.objects.filter(repo_event=obj)
        for comment in comments:
            all_comments.append({'comment_id': comment.id,
                                 'message': comment.message, 'date_created': comment.date_created, 'date_modified': comment.date_modified, 'user': {'first_name': comment.user.first_name, 'last_name': comment.user.last_name, 'profile_image': comment.user.profile_image if comment.user.profile_image else None}})
        return all_comments

    class Meta:
        model = RepoEvent
        fields = ['id', 'user', 'first_name', 'last_name', 'comments', 'associated_submissions',
                  'message', 'link', 'date_created', 'date_modified', 'is_public', 'is_deleted', ]


class RepoEventReactions(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]

    class Meta:
        model = RepoEventReaction
        fields = '__all__'
