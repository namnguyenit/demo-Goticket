import { Outlet } from "react-router-dom";

import style from "./Main.module.css";
import Navigator from "../../components/Navigator";
import Footer from "./Footer";

function Main() {
  return (
    <>
      <div className={style.box}>
        <div className={style.nav}>
          <Navigator />
        </div>
      </div>
      <Outlet />
      <Footer />
    </>
  );
}

export default Main;
