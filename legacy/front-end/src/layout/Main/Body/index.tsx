

import { Outlet } from "react-router-dom";

function Body() {
  return (
    <>
      <div className="grid grid-cols-1 items-center justify-items-center">
        <Outlet />
      </div>
    </>
  );
}

export default Body;
