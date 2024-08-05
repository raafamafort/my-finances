'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@components/Input/Input';
import styles from "@styles/signIn.module.css";
import { FaUser, FaLock } from 'react-icons/fa';

export default function SignInForm() {
    const router = useRouter();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("onSubmit");
    };

    const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push('/sign-up');
    };

    return (
        <form className={styles.signInForm} onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <Input
                Icon={FaUser}
                label="Email"
                type="text"
                value={email}
                onChange={handleEmailChange}
            />
            <Input
                Icon={FaLock}
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
            />
            <button 
                className={styles.signInButton}
                type="submit"
            >
                Sign in
            </button>
            <div className={styles.orContainer}>
                <div className={styles.line}></div>
                <span className={styles.orText}>Or</span>
                <div className={styles.line}></div>
            </div>
            <button 
                className={styles.signUpButton}
                type="button"
                onClick={handleSignUp}
            >
                Sign up
            </button>
        </form>
    );
};
