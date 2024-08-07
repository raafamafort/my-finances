'use client';

import Input from '@components/Input/Input';
import InputColor from '@components/InputColor/InputColor';
import { Box, Modal } from '@mui/material';
import { IoClose } from 'react-icons/io5';
import styles from '@styles/modal.module.css';

interface InputModalProps {
  title: string;
  open: boolean;
  handleClose: () => void;
  description: string;
  descriptionHelperText: string;
  value: string;
  valueHelperText: string;
  color: string;
  handleChangeDescription: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeColor: (color: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const InputModal: React.FC<InputModalProps> = ({
  title,
  open,
  handleClose,
  description,
  descriptionHelperText,
  value,
  valueHelperText,
  color,
  handleChangeDescription,
  handleChangeValue,
  handleChangeColor,
  onSubmit,
  onDelete,
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
          <InputColor color={color} onChange={handleChangeColor} />
          <div className={styles.modalFooter}>
            {title.includes('Edit') && (
              <button onClick={onDelete} className={styles.editButton}>
                Delete
              </button>
            )}
            <button type="submit" className={styles.submitButton}>
              {title.includes('Add') ? 'Submit' : 'Save'}
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default InputModal;
