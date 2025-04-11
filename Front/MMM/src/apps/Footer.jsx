import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "@flaticon/flaticon-uicons/css/all/all.css";

const Footer = () => {
  
  // return (
  //   <div className="w-full">
  //     <div className="fixed bottom-0 left-0 w-full text-3xl bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 flex justify-around items-center z-50">
  //       <Link to="/">🏠</Link>
  //       <Link to="/consumption">📆</Link>
  //       <Link to="/chat/chatRoomList">💬</Link>
  //       <Link to="/user/userInfo">👤</Link>
  //     </div>
  //   </div>
  // );
  // return (
  //   <footer className="w-full h-17 text-3xl bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 flex justify-around items-center">
  //     <Link to="/" className="pt-2"><i className="fi fi-rr-home"></i></Link>
  //     <Link to="/consumption" className="pt-2"><i className="fi fi-rr-calendar"></i></Link>
  //     <Link to="/chat/chatRoomList" className="pt-2"><i className="fi fi-rs-comment"></i></Link>
  //     <Link to="/user/userInfo" className="pt-2"><i className="fi fi-rs-user"></i></Link>
  //   </footer>
  // );
  const base = "pt-2 text-white";                // 기본 클래스
  const active = "text-yellow-300";               // 활성화 시 추가할 클래스
  const isChatActive = location.pathname === "/chat" || location.pathname.startsWith("/chat/");
  const isUserActive = location.pathname === "/user" || location.pathname.startsWith("/user/");

  return (
    <footer className="h-17 text-3xl overflow-hidden bg-gradient-to-r rounded-4xl mb-2 
    mr-1 ml-2 from-blue-400/85 to-blue-500/85 p-4 flex justify-around items-center
    select-none cursor-default shadow-[0_4px_6px_-2px_rgba(3,6,2,0.7)]
    ">
      <NavLink
        to="/"
        end 
        className={({ isActive }) => `${base} ${isActive ? active : ""}`}
      >
        <i className="fi fi-rr-home"></i>
      </NavLink>

      <NavLink
        to="/consumption"
        className={({ isActive }) => `${base} ${isActive ? active : ""}`}
      >
        <i className="fi fi-rr-calendar"></i>
      </NavLink>

      <NavLink
        to="/chat/chatRoomList"
        className={({ isActive }) => `${base} ${isChatActive ? active : ""}`}
      >
        <i className="fi fi-rr-comment"></i>
      </NavLink>

      <NavLink
        to="/user/userInfo"
        className={({ isActive }) => `${base} ${isUserActive ? active : ""}`}
      >
        <i className="fi fi-rr-user"></i>
      </NavLink>
    </footer>
  );
};

export default Footer;