'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@components/Input/Input';
import styles from "@styles/signUp.module.css";
import { FaUser, FaLock } from 'react-icons/fa';

export default function SignUpForm() {
    const router = useRouter();
    
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    
    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("onSubmit");
    };

    const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push('/sign-in');
    };

    return (
        <form className={styles.signInForm} onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <Input
                Icon={FaUser}
                label="Name"
                type="text"
                value={name}
                onChange={handleNameChange}
            />
            <Input
                Icon={FaUser}
                label="Last Name"
                type="text"
                value={lastName}
                onChange={handleLastNameChange}
            />
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
            <Input
                Icon={FaLock}
                label="Repeat Password"
                type="password"
                value={repeatPassword}
                onChange={handleRepeatPasswordChange}
            />
            <button 
                className={styles.signInButton}
                type="submit"
            >
                Sign up
            </button>
            <div className={styles.orContainer}>
                <div className={styles.line}></div>
                <span className={styles.orText}>Or</span>
                <div className={styles.line}></div>
            </div>
            <button 
                className={styles.signUpButton}
                type="button"
                onClick={handleSignIn}
            >
                Sign in
            </button>
        </form>
    );
};
