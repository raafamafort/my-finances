'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@components/Input/Input';
import styles from "@styles/signIn.module.css";
import { isValidEmail } from "@lib/utils/validations"
import { FaUser, FaLock } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { showErrorToast } from '@lib/utils/toast';

const SignInForm = () => {
    const router = useRouter();
    
    const [email, setEmail] = useState('');
    const [emailHelperText, setEmailHelperText] = useState('');
    const [password, setPassword] = useState('');
    const [passwordHelperText, setPasswordHelperText] = useState('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const validateForm = () => {
        let isValid = true;
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

        return isValid;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const signInData = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false,
        })

        console.log("signInData", signInData)
        if(signInData?.error) {
            showErrorToast('Incorrect email or password')
        } else {
            router.push('/resume');
        }
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

export default SignInForm;