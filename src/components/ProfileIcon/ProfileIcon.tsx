'use client';

import * as React from 'react';
import {
    Avatar,
    IconButton,
    MenuItem,
    Menu,
    Box,
    Typography,
} from '@mui/material';
import { FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'next-auth/react';

interface ProfileIconProps {
    name: string;
    lastName: string;
    email: string;
}

export default function ProfileIcon({
    name,
    lastName,
    email,
}: ProfileIconProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const avatarText =
        name.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: '#1E293B',
                        color: '#FFF',
                        padding: '24px',
                        fontWeight: 'bold',
                    }}
                >
                    {avatarText}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        bgcolor: '#1D283A',
                        '& .MuiMenuItem-root': {
                            color: '#FFF',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        },
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: '#1D283A',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem
                    disabled
                    sx={{
                        color: '#FFF',
                        '&.Mui-disabled': {
                            color: '#FFF',
                            opacity: 1,
                        },
                    }}
                >
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {`${name.toUpperCase()} ${lastName.toUpperCase()}`}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                            {email.toLowerCase()}
                        </Typography>
                    </Box>
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        signOut({
                            redirect: true,
                            callbackUrl: `${window.location.origin}/sign-in`,
                        })
                    }
                    sx={{ color: '#FFF' }}
                >
                    <FaSignOutAlt
                        style={{ color: '#94A3B8', marginRight: '8px' }}
                    />{' '}
                    Sign out
                </MenuItem>
            </Menu>
        </>
    );
}
