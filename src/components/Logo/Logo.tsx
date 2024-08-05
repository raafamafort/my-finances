'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@styles/logo.module.css';

interface LogoProps {
  redirectToHome?: boolean;
}

export default function Logo({ redirectToHome = false }: LogoProps) {
  const router = useRouter();

  const handleClick = () => {
    if (redirectToHome) {
      router.push('/');
    }
  };

  return (
    <div className={styles.logo}>
      <span className={styles.text} onClick={handleClick}>
        <span className={styles.boldText}>My</span>Finances
      </span>
    </div>
  );
};

