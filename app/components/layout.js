import { useSession } from "next-auth/react";
import Sidebar from "../components/sidebar";

export const Layout = ({ children }) => {
  const { data: session } = useSession();

  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;
