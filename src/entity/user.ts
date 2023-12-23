enum Permission {
  User,
  Admin,
}

interface User {
  id: number;
  username: string;
  avatar: URL;
  password: string;
  permission: Permission;
}

export { User, Permission };
