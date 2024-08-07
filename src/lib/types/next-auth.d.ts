declare module 'next-auth' {
  interface User {
    name: string;
    lastName: string;
    email: string;
  }
  interface Session {
    user: User & {
      name: string;
      lastName: string;
      email: string;
    };
    token: {
      name: string;
      lastName: string;
      email: string;
    };
  }
}
