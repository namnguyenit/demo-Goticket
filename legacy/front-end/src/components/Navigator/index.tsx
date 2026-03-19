import { Link, useNavigate } from "react-router-dom";

import style from "./Navigator.module.css";
import clsx from "clsx";

import { LogOut, UserPen } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { URL } from "@/config";
import { useContext, useEffect } from "react";

import { LogOutContext } from "@/context/LogoutProvider";

function Navigator() {
  const { auth, setAuth } = useContext(LogOutContext);
  const { logout, setLogout } = useContext(LogOutContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAPI = async () => {
      const res = await fetch(`${URL}/api/auth/myinfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorisation") || "",
        },
      });

      if (!logout) {
        const json = await res.json();
        setAuth(json || null);
      } else {
        localStorage.removeItem("Authorisation");
        setAuth(null);
      }
    };
    if (!logout && !auth) {
      fetchAPI();
    }
  }, [auth, logout]);

  return (
    <>
      <div className={style.box}>
        <img className={style.logo} src="logo.png"></img>
        <div className={style.wrap}>
          <div className={style.navBar}>
            <Link to="/">
              <div className={style.link}>Home</div>
            </Link>
            <Link to="/book">
              <div className={style.link}>Book</div>
            </Link>
            <Link to="/about">
              <div className={style.link}>About</div>
            </Link>
            <div className={style.link}>Blog</div>
            <div className={style.link}>Contact</div>
          </div>

          <div className={style.auth}>
            {!logout && auth?.data && auth?.success == true ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-0">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    {auth?.data && auth?.success == true
                      ? auth?.data.name
                      : "My Name"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    <UserPen />
                    <div>Profile</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/sign-in", { replace: true });
                      setLogout(true);
                      setAuth(null);
                    }}
                  >
                    <LogOut className="text-red-500" />
                    <div className="text-red-500">Log Out</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/sign-up">
                  <div className={clsx(style.register, style.button)}>
                    Register
                  </div>
                </Link>
                <Link to="/sign-in">
                  <div className={clsx(style.logIn, style.button)}>Sign in</div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigator;
