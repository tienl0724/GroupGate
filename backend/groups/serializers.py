from rest_framework import serializers
from groups import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()


class MembershipSerializer(serializers.ModelSerializer):
    group_id = serializers.ReadOnlyField(source='group.id')
    group_name = serializers.ReadOnlyField(source='group.name')
    user_id = serializers.ReadOnlyField(source='customuser.id')
    user_name = serializers.ReadOnlyField(source='customuser.first_name')
    class Meta:
        model = models.Membership
        fields = ('group_id', 'group_name', 'user_id', 'user_name', 'user', 'role',)

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    groups = MembershipSerializer(source='membership_set', many=True)

    def create(self, validated_data):

        user = UserModel.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

    class Meta:
        model = UserModel
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'groups')

# class GroupSerializer(serializers.ModelSerializer):
#     members = UserSerializer(many=True)
#     def create(self, validated_data):
#         members_data = validated_data['members']
#     class Meta:
#         fields = (
#             'id',
#             'name',
#             'description',
#             'members',
#         )
#         model = models.Group

class GroupCreateSerializer(serializers.ModelSerializer):
    members = MembershipSerializer(source='membership_set', many=True, required=False)
    print("\n\n\n")
    print(members)
    print("\n\n\n")
    def create(self, validated_data):
        print("\n\n\n")
        print(validated_data)
        print("\n\n\n")
        user_data = validated_data.pop('membership_set')
        group = models.Group.objects.create(**validated_data)
        for user in user_data:
            d=dict(user)
            print("\n\n\n")
            print(d)
            print("\n\n\n")
            models.Membership.objects.create(group=group, user=d['user'], role=d['role'])
        return group

    def update(self, instance, validated_data):
        user_data = validated_data.pop('membership_set')
        for item in validated_data:
            if models.Group._meta.get_field(item):
                setattr(instance, item, validated_data[item])
        models.Membership.objects.filter(group=instance).delete()
        for user in user_data:
            d=dict(user)
            models.Membership.objects.create(group=instance, user=d['user'], role=d['role'])
        instance.save()
        return instance

    class Meta:
        fields = ('id', 'name', 'description', 'members')
        model = models.Group