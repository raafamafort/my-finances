'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@components/Input/Input';
import styles from "@styles/signUp.module.css";
import { isValidEmail } from "@lib/utils/validations"
import { FaUser, FaLock } from 'react-icons/fa';

export default function SignUpForm() {
    const router = useRouter();
    
    const [name, setName] = useState('');
    const [nameHelperText, setNameHelperText] = useState('');
    const [lastName, setLastName] = useState('');
    const [lastNameHelperText, setLastNameHelperText] = useState('');
    const [email, setEmail] = useState('');
    const [emailHelperText, setEmailHelperText] = useState('');
    const [password, setPassword] = useState('');
    const [passwordHelperText, setPasswordHelperText] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [repeatPasswordHelperText, setRepeatPasswordHelperText] = useState('');
    
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

    const validateForm = () => {
        let isValid = true;

        if (name === '') {
            setNameHelperText("Name is required");
            isValid = false;
        } else {
            setNameHelperText('');
        }

        if (lastName === '') {
            setLastNameHelperText("Last Name is required");
            isValid = false;
        } else {
            setLastNameHelperText('');
        }


        if (email === '') {
            setEmailHelperText("Email is required");
            isValid = false;
        } else if (!isValidEmail(email)) {
            setEmailHelperText("Invalid email format");
            isValid = false;
        } else {
            setEmailHelperText('');
        }

        if (password === '') {
            setPasswordHelperText("Password is required");
            isValid = false;
        } else if (password.length < 8) {
            setPasswordHelperText("Password must be at least 8 characters long");
            isValid = false;
        } else {
            setPasswordHelperText('');
        }

        if (repeatPassword === '') {
            setRepeatPasswordHelperText("Repeat Password is required");
            isValid = false;
        } else if (repeatPassword !== password) {
            setRepeatPasswordHelperText("Repeat password must match the password");
            isValid = false;
        } else {
            setRepeatPasswordHelperText('');
        }

        return isValid;
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

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
                helperText={nameHelperText}
                onChange={handleNameChange}
            />
            <Input
                Icon={FaUser}
                label="Last Name"
                type="text"
                value={lastName}
                helperText={lastNameHelperText}
                onChange={handleLastNameChange}
            />
            <Input
                Icon={FaUser}
                label="Email"
                type="text"
                value={email}
                helperText={emailHelperText}
                onChange={handleEmailChange}
            />
            <Input
                Icon={FaLock}
                label="Password"
                type="password"
                value={password}
                helperText={passwordHelperText}
                onChange={handlePasswordChange}
            />
            <Input
                Icon={FaLock}
                label="Repeat Password"
                type="password"
                value={repeatPassword}
                helperText={repeatPasswordHelperText}
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
