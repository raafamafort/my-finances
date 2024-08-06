import { authOptions } from "@lib/auth/auth";
import { getServerSession } from "next-auth";
import styles from "@styles/navbar.module.css";
import ProfileIcon from "@components/ProfileIcon/ProfileIcon";


const Navbar = async () => {
  const session = await getServerSession(authOptions);

  const name = session?.user?.name || "";
  const lastName = session?.user?.lastName || "";
  const email = session?.user?.email || "";

  return session?.user ? (
    <nav className={styles.navbar}>
      <ProfileIcon name={name} lastName={lastName} email={email}/>
    </nav>
  ) : null;
};

export default Navbar;
