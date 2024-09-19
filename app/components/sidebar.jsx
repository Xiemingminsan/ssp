"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // Import signOut
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
import { showSuccessToast } from "../utils/toastUtils";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);
  const { data: session } = useSession(); // Get the session data
  const router = useRouter();

  // Role-specific menu items
  const allMenuItems = [
    { name: "ዋና", path: "/homepage", icon: <HomeIcon />, roles: ["admin"] },
    {
      name: "ኮርሶች",
      path: "/courses",
      icon: <SchoolIcon />,
      roles: ["admin", "SchoolHead"],
    },
    {
      name: "አቴንዳንስ",
      path: "/attendance",
      icon: <AttendanceIcon />,
      roles: ["SchoolHead"],
    },
    {
      name: "አመራሮች",
      path: "/management",
      icon: <ManagementIcon />,
      roles: ["admin"],
    },
    {
      name: "ተማሪዎች",
      path: "/students",
      icon: <StudentsIcon />,
      roles: ["admin", "SchoolHead"],
    },
    {
      name: "የትምህርት ክፍላት",
      path: "/batches",
      icon: <BatchIcon />,
      roles: ["admin", "SchoolHead"],
    },
    {
      name: "ቁሳቁሶች",
      path: "/items",
      icon: <ItemsIcon />,
      roles: ["admin", "InventoryHead"],
    },
    {
      name: "ደብዳቤዎች",
      path: "/letter",
      icon: <LettersIcon />,
      roles: ["admin", "LetterHead"],
    },
    {
      name: "ቅጣት መዝገብ",
      path: "/conduct",
      icon: <UsersIcon />,
      roles: ["admin", "ConductHead"],
    },
    {
      name: "ግብ",
      path: "/userrequest",
      icon: <ExpenseIcon />,
      roles: ["admin"],
    },
    {
      name: "ውጣ",
      path: "/login",
      icon: <LogoutIcon />,
      action: () => {
        signOut({ callbackUrl: "/login" }); // Let NextAuth handle logout redirection
        showSuccessToast("Successfully logged out");
      },
      roles: [
        "admin",
        "SchoolHead",
        "LetterHead",
        "InventoryHead",
        "ConductHead",
      ],
    },
  ];

  // Filter the menu items based on the user's role from the session
  const filteredMenuItems = allMenuItems.filter((item) => {
    return item.roles.includes(session?.user?.role);
  });

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
        {filteredMenuItems.map((item, index) => (
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
