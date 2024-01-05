from platforms.utils.commons import platforms
from .models import User


def check_id_has_owner(requesting_user_id: int, binded_user: User):
    if requesting_user_id == binded_user.gitupper_id:  # Mesmo usuáario
        return True
    return False  # Essa conta já foi vinculada a outro usuário


def check_user_binded(requesting_user_id: int, platform_prefix: str, platform_id, check_all: bool = False):
    if check_all:
        user = User.objects.get(gitupper_id=requesting_user_id)

        for platform in platforms:
            try:
                id = getattr(user, f"{platform}_id")

                if id:
                    return True
            except Exception as e:
                print(e)
                pass
        return False

    try:  # verificando se já existe user bindado com o id em questão e se bate com o user solicitante
        platform_param = f"{platform_prefix}_id"
        fields = {platform_param: platform_id}

        user = User.objects.get(**fields)
        same_user = check_id_has_owner(requesting_user_id, user)

        if same_user:
            return user
        return None  # Conta já vinculada a outro usuário
    except Exception as e:
        print(e)
        return False  # usuário não está bindado


def make_user_obj(user: any, gitupper_user: any = None, platform: bool = False):
    if not gitupper_user:
        name = [user.first_name, user.last_name]
    elif getattr(gitupper_user, "name", None):
        name = gitupper_user["name"].split(" ")
    else:
        name = [getattr(gitupper_user, "first_name", ""),
                getattr(gitupper_user, "last_name", "")]

    platforms_dict = {f"{key}_id": getattr(
        user, f"{key}_id", "") for key in platforms.keys()}

    if platform:
        submissions_dict = {f"{key}_submissions": getattr(
            user, f"{key}_submissions", None) for key in platforms.keys()}

        user_obj = {
            "gitupper_id": gitupper_user.gitupper_id,
            "github_id": gitupper_user.github_id,
            "email": user.email,
            "profile_image": getattr(gitupper_user, "profile_image", getattr(gitupper_user, "avatar_url", "")).url,
            "first_name": name[0],
            "last_name": name[-1],
            **platforms_dict,
            **submissions_dict,
        }

    else:
        user_obj = {
            "gitupper_id": user.gitupper_id,
            "github_id": user.github_id,
            "email": user.email,
            "profile_image": user.profile_image.url,
            "first_name": name[0],
            "last_name": name[-1],
            **platforms_dict,
        }

    return user_obj
