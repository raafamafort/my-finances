'use client';

import Input from '@components/Input/Input';
import { Box, Modal } from '@mui/material';
import { IoClose } from 'react-icons/io5';
import styles from '@styles/modal.module.css';
import LoadingButton from '@mui/lab/LoadingButton';

interface CategoryModalProps {
  title: string;
  open: boolean;
  handleClose: () => void;
  name: string;
  nameHelperText: string;
  handleChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loadingOnSubmit: boolean;
  loadingOnDelete: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  title,
  open,
  handleClose,
  name,
  nameHelperText,
  handleChangeName,
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
            value={name}
            helperText={nameHelperText}
            onChange={handleChangeName}
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

export default CategoryModal;
