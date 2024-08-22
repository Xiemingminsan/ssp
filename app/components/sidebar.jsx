"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import AttendanceIcon from "@mui/icons-material/Today";
import ManagementIcon from "@mui/icons-material/BusinessCenter";
import StudentsIcon from "@mui/icons-material/Group";
import BatchIcon from "@mui/icons-material/Class";
import ItemsIcon from "@mui/icons-material/Inventory";
import ExpenseIcon from "@mui/icons-material/AttachMoney";
import LettersIcon from "@mui/icons-material/Email";
import UsersIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import "../../public/css/Sidebar.css";
import Image from "next/image";
import { signOut } from "next-auth/react";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: "ዋና", path: "/homepage", icon: <HomeIcon /> },
    { name: "ኮርሶች", path: "/courses", icon: <SchoolIcon /> },
    { name: "አቴንዳንስ", path: "/attendance", icon: <AttendanceIcon /> },
    { name: "አመራሮች", path: "/hierarachy", icon: <ManagementIcon /> },
    { name: "ተማሪዎች", path: "/students", icon: <StudentsIcon /> },
    { name: "የትምህርት ክፍላት", path: "/batches", icon: <BatchIcon /> },
    { name: "ቁሳቁሶች", path: "/items", icon: <ItemsIcon /> },
    { name: "ደብዳቤዎች", path: "/letter", icon: <LettersIcon /> },
    { name: "ቅጣት መዝገብ", path: "/conduct", icon: <UsersIcon /> },
    { name: "ግብ", path: "/userrequest", icon: <ExpenseIcon /> },
    {
      name: "ውጣ",
      path: "/",
      icon: <LogoutIcon />,
      action: () => signOut(), // Trigger signOut on click
    },
  ];

  return (
    <div
      className={`sidebar ${isSidebarOpen ? "sidebar-active" : ""} ${
        isCompressed ? "sidebar-compressed" : ""
      }`}
    >
      <ul>
        <li
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/images/selase-logo.png"
            alt="Logo"
            width={80}
            height={80}
          />
        </li>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={router.pathname === item.path ? "selected" : ""}
          >
            {item.action ? (
              <a
                href={item.path}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor behavior
                  item.action(); // Call the action, e.g., signOut
                }}
              >
                {item.icon}
                {!isCompressed && item.name}
              </a>
            ) : (
              <Link href={item.path}>
                {item.icon}
                {!isCompressed && item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
