'use client';

import Input from '@components/Input/Input';
import { Box, Modal } from '@mui/material';
import { IoClose } from 'react-icons/io5';
import styles from '@styles/modal.module.css';
import LoadingButton from '@mui/lab/LoadingButton';

interface InputModalProps {
    title: string;
    open: boolean;
    handleClose: () => void;
    description: string;
    descriptionHelperText: string;
    value: string;
    valueHelperText: string;
    handleChangeDescription: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangeValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    loadingOnSubmit: boolean;
    loadingOnDelete: boolean;
}

const InputModal: React.FC<InputModalProps> = ({
    title,
    open,
    handleClose,
    description,
    descriptionHelperText,
    value,
    valueHelperText,
    handleChangeDescription,
    handleChangeValue,
    onSubmit,
    onDelete,
    loadingOnSubmit,
    loadingOnDelete,
}) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box className={styles.modalBox}>
                <div className={styles.modalHeader}>
                    <p>{title}</p>
                    <IoClose
                        size={28}
                        onClick={handleClose}
                        className={styles.closeButton}
                    />
                </div>
                <form className={styles.modalBody} onSubmit={onSubmit}>
                    <Input
                        label="Description"
                        type="text"
                        value={description}
                        helperText={descriptionHelperText}
                        onChange={handleChangeDescription}
                    />
                    <Input
                        label="Value"
                        type="text"
                        value={value}
                        helperText={valueHelperText}
                        onChange={handleChangeValue}
                    />
                    <div className={styles.modalFooter}>
                        {title.includes('Edit') && (
                            <LoadingButton
                                onClick={onDelete}
                                className={styles.editButton}
                                loading={loadingOnDelete}
                            >
                                Delete
                            </LoadingButton>
                        )}
                        <LoadingButton
                            type="submit"
                            className={styles.submitButton}
                            loading={loadingOnSubmit}
                        >
                            {title.includes('Add') ? 'Submit' : 'Save'}
                        </LoadingButton>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};

export default InputModal;
