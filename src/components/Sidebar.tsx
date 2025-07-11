import React, { useState, useEffect, useContext } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  FileQuestion,
  Calendar,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { DataContext } from "../store/DataContext";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  text,
  active = false,
  collapsed,
  onClick,
}) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`nav-item ${active ? "active" : ""} ${
          collapsed ? "collapsed" : ""
        }`}
      >
        <span className="icon">{icon}</span>
        {!collapsed && <span className="label">{text}</span>}
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { selectComponent, setSelectComponent } = context;

  const handleClick = (path: string) => {
    console.log(path)
    navigate(path);
    setSelectComponent(path);
  };
  useEffect(()=>{
    // console.log(selectComponent,"this is form sidebar")
  },[selectComponent])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/" },
    // {
    //   icon: <ClipboardCheck size={20} />,
    //   text: "Assessment",
    //   path: "/assignment",
    // },
    {
      icon: <FileQuestion size={20} />,
      text: "Question Bank",
      path: "/question-bank",
    },
    { icon: <Calendar size={20} />, text: "Sessions", path: "/sessions" },
    { icon: <FileText size={20} />, text: "Plans", path: "/plans" },
    { icon: <Calendar size={20} />, text: "Booking Calendar", path: "/bookingCalendar" },
    { icon: <Calendar size={20} />, text: "Pricing Calendar", path: "/pricingCalendar" },
    { icon: <Bell size={20} />, text: "Notifications", path: "/notifications" },
    { icon: <Settings size={20} />, text: "Settings", path: "/settings" },
    { icon: <HelpCircle size={20} />, text: "Help", path: "/help" },

  ];

  return (
    <>
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          className="mobile-sidebar-toggle"
          onClick={() => setMobileSidebarOpen((prev) => !prev)}
        >
          <Menu size={24} />
        </button>
      )}

      <aside
        className={`sidebar ${
          isMobile
            ? mobileSidebarOpen
              ? "open"
              : ""
            : collapsed
            ? "collapsed"
            : ""
        }`}
      >
        <div className={`sidebar-header ${collapsed ? "centered" : ""}`}>
          <div className="brand">
            {collapsed ? (
              // <img className="h-50px w-102.5px" src="/play-black.png"></img>
              ""
            ) : (
              <img className="h-13 w-30" src="/play-black.png"></img>
            
            )}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="menu">
          {/* Group 1: Dashboard to Plans */}
          <ul>
            {menuItems.slice(0, 5).map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                text={item.text}
                collapsed={collapsed}
                onClick={() => handleClick(item.path)}
                active={location.pathname === item.path}
              />
            ))}
          </ul>

          {/* Separator */}
          <div className="menu-separator" />

          {/* Group 2: Notifications to Help */}
          <ul>
            {menuItems.slice(5).map((item, index) => (
              <NavItem
                key={index + 5}
                icon={item.icon}
                text={item.text}
                collapsed={collapsed}
                onClick={() => handleClick(item.path)}
                active={location.pathname === item.path}
              />
            ))}
          </ul>
        </div>

        <div className={`user-info ${collapsed ? "centered" : ""}`}>
          <div className="avatar">U</div>
          {!collapsed && (
            <div className="user-details">
              <div>
                <p className="username">Welcome Back </p>
                <p className="role">Naveen</p>
              </div>
              <div>
                <ChevronRight size={20} />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
