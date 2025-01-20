'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@components/Input/Input';
import styles from '@styles/signIn.module.css';
import { isValidEmail } from '@lib/utils/validations';
import { FaUser } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { showErrorToast } from '@lib/utils/toast';
import { Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const SignInForm = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [emailHelperText, setEmailHelperText] = useState('');
    const [password, setPassword] = useState('');
    const [passwordHelperText, setPasswordHelperText] = useState('');

    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const validateForm = () => {
        let isValid = true;
        if (email === '') {
            setEmailHelperText('Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            setEmailHelperText('Invalid email format');
            isValid = false;
        } else {
            setEmailHelperText('');
        }

        if (password === '') {
            setPasswordHelperText('Password is required');
            isValid = false;
        } else if (password.length < 8) {
            setPasswordHelperText(
                'Password must be at least 8 characters long'
            );
            isValid = false;
        } else {
            setPasswordHelperText('');
        }

        return isValid;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        const signInData = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false,
        });

        if (signInData?.error) {
            showErrorToast('Incorrect email or password');
        } else {
            router.push('/net-income');
            router.refresh();
        }
        setLoading(false);
    };

    const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        localStorage.setItem('currency', 'R$');
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
                label="Password"
                type="password"
                value={password}
                helperText={passwordHelperText}
                onChange={handlePasswordChange}
            />
            <LoadingButton
                className={styles.signInButton}
                type="submit"
                loading={loading}
            >
                Sign in
            </LoadingButton>
            <div className={styles.orContainer}>
                <div className={styles.line}></div>
                <span className={styles.orText}>Or</span>
                <div className={styles.line}></div>
            </div>
            <Button
                className={styles.signUpButton}
                type="button"
                onClick={handleSignUp}
            >
                Sign up
            </Button>
        </form>
    );
};

export default SignInForm;
