import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilSpeedometer,
  cilStar,
  cilUser,
  cilClock,
  cilGamepad,
  cilBarChart,
  cilClipboard,
  cilLockUnlocked,
} from "@coreui/icons";
import { CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Users & Sessions",
  },
  {
    component: CNavItem,
    name: "Admin Users",
    to: "/admin-users",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Users",
    to: "/users",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Sessions",
    to: "/sessions",
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Recovery",
    to: "/recovery",
    icon: <CIcon icon={cilLockUnlocked} customClassName="nav-icon" />,
  },  
  {
    component: CNavTitle,
    name: "Game",
  },
  {
    component: CNavItem,
    name: "Game Progress",
    to: "/game-progress",
    icon: <CIcon icon={cilGamepad} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Highscores",
    to: "/highscores",
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Logs",
  },
  {
    component: CNavItem,
    name: "Request Log",
    to: "/request-log",
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
];

export default _nav;
