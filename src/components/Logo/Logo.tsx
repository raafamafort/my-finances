'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@styles/logo.module.css';

interface LogoProps {
    redirectToHome?: boolean;
}

const Logo = ({ redirectToHome = false }: LogoProps) => {
    const router = useRouter();

    const handleClick = () => {
        if (redirectToHome) {
            router.push('/');
        }
    };

    return (
        <div className={styles.logo}>
            <span className={styles.text} onClick={handleClick}>
                <Image src="/Logo.svg" alt="Logo" width={200} height={30} />
            </span>
        </div>
    );
};

export default Logo;
