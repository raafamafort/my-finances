import { authOptions } from "@lib/auth/auth";
import { getServerSession } from "next-auth";
import styles from "@styles/navbar.module.css";
import ProfileIcon from "@components/ProfileIcon/ProfileIcon";


const Navbar = async () => {
  const session = await getServerSession(authOptions);

  const nameInitial = session?.user?.name?.charAt(0).toUpperCase() || "";
  const lastNameInitial = session?.user?.lastName?.charAt(0).toUpperCase() || "";

  return session?.user ? (
    <nav className={styles.navbar}>
      <ProfileIcon avatarText={`${nameInitial}${lastNameInitial}`} />
    </nav>
  ) : null;
};

export default Navbar;
