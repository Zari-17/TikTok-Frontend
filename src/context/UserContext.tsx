"use client";
import { createContext, useContext, useState } from "react";

export interface UserContextType {
  user: User | null;
  setUser: (user: any) => any;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUserContext = () => {
  return useContext(UserContext) as UserContextType;
};

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
