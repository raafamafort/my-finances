import { useSession } from 'next-auth/react';
import styles from '@styles/navbar.module.css';
import ProfileIcon from '@components/ProfileIcon/ProfileIcon';
import { IconButton } from '@mui/material';
import { HiMenu } from 'react-icons/hi';
import ChangeCurrency from '@components/ChangeCurrency/ChangeCurrency';

interface NavbarProps {
    toggleDrawer: () => void;
}

export default function Navbar({ toggleDrawer }: NavbarProps) {
    const { data: session } = useSession();

    return session?.user ? (
        <nav className={styles.navbar}>
            <div>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer}
                >
                    <HiMenu />
                </IconButton>
            </div>
            <div className={styles.rightNav}>
                <ChangeCurrency />
                <ProfileIcon
                    name={session?.user?.name}
                    lastName={session?.user?.lastName}
                    email={session?.user?.email}
                />
            </div>
        </nav>
    ) : null;
}
