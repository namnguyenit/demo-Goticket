import { createContext, useState, type JSX } from "react";
const LogOutContext = createContext<any>("");

function LogOutProvider({ children }: { children: JSX.Element }) {
  const [logout, setLogout] = useState<boolean>(true);
  const [auth, setAuth] = useState<any>();
  console.log(logout);
  return (
    <LogOutContext.Provider value={{ logout, setLogout, auth, setAuth }}>
      {children}
    </LogOutContext.Provider>
  );
}

export { LogOutContext, LogOutProvider };
