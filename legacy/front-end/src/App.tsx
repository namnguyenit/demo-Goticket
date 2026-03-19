import { Outlet } from "react-router-dom";
import "./App.css";
import { LogOutProvider } from "./context/LogoutProvider";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div>
      <Toaster />
      <LogOutProvider>
        <Outlet />
      </LogOutProvider>
    </div>
  );
}

export default App;
