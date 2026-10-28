export const getInitialUserName = (userName: string) => {
  const names = userName.split(' ').filter(Boolean);
  const avatarInitials =
    names.length >= 2
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : `${names[0][0]}${names[0][1]}`;

  return avatarInitials.toUpperCase();
};
