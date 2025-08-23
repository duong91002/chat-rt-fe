import useAuthStore from "../store/authStore";

export const showNameUser = (users, user) => {
  if (!Array.isArray(users)) return "";
  if (users.length === 2) {
    const findUser = users.find(
      (u) => u._id.toString() !== user._id.toString()
    );
    return findUser.name;
  }
  return users
    .filter((u) => u._id.toString() !== user._id.toString())
    .map((u) => u.name)
    .join(", ");
};
