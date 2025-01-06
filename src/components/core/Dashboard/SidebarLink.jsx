import * as Icons from "react-icons/vsc";//See name of all icons are ending with vsc 
import { NavLink, matchPath, useLocation } from "react-router-dom";

const SidebarLink=({link})=>{
    const Icon=Icons[link.icon];
    const location=useLocation();
    function matchRoute(route){
        return matchPath({path:route},location.pathname);
    }
    return(
        <div>
            <NavLink to={link.path} className="relative">
                <span className={`absolute top-0 left-0 h-full w-[5px] bg-yellow-50 
                ${matchRoute(link.path)?"opacity-100":"opacity-0"}`}>
                </span>
                <div className={`items-center mb-1 flex gap-x-[10px] pl-[20px] ${matchRoute(link.path)?"bg-yellow-700 ":""}`}>
                    <Icon className="text-lg"/>
                    <p>{link.name}</p>
                </div>
            </NavLink>
        </div>
    );
}
export default SidebarLink;