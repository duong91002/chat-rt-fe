const hasId = (u) => u != null && u._id != null;

/**
 * Display name for a room built from its members, excluding the current user.
 * Never throws: returns "" when member data is incomplete.
 */
export const showNameUser = (users, user) => {
  if (!Array.isArray(users) || !hasId(user)) return "";
  if (!users.every(hasId)) return "";

  const currentId = user._id.toString();
  const others = users.filter((u) => u._id.toString() !== currentId);

  if (users.length === 2) {
    return others[0]?.name ?? "";
  }
  return others.map((u) => u.name).join(", ");
};
