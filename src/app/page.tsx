'use client';

import { useRouter } from 'next/navigation';
import Logo from '@components/Logo/Logo';
import styles from '@styles/home.module.css';

export default function Home() {
  const router = useRouter();

  const handleSignInClick = () => {
    router.push('/sign-in');
  };

  return (
    <main className={styles.main}>
      <div className={styles.logoContainer}>
        <Logo redirectToHome={false} />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.signInButton} onClick={handleSignInClick}>
          Sign In
        </button>
      </div>
    </main>
  );
}
