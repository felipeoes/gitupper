import { API_BASE_URL } from "../api";

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function refactorUser(user) {
  if (user["name"]) {
    const names = user["name"].split(" ");
    user["first_name"] = names[0];
    user["last_name"] = names[1];
  }

  if (!user["profile_image"]) {
    user["profile_image"] = user["avatar_url"];
  } else if (!user["profile_image"].includes("http")) {
    user["profile_image"] = API_BASE_URL + user["profile_image"];
  }

  return user;
}
