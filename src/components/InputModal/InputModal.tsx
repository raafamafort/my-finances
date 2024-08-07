"use client";

import Input from "@components/Input/Input";
import InputColor from "@components/InputColor/InputColor";
import { Box, Modal } from "@mui/material";
import { IoClose } from "react-icons/io5";
import styles from "@styles/modal.module.css";

interface InputModalProps {
  title: string;
  open: boolean;
  handleClose: () => void;
  name: string;
  nameHelperText: string;
  value: string;
  valueHelperText: string;
  color: string;
  handleChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeColor: (color: string) => void;
  onSubmit: () => void;
}

const InputModal: React.FC<InputModalProps> = ({
  title,
  open,
  handleClose,
  name,
  nameHelperText,
  value,
  valueHelperText,
  color,
  handleChangeName,
  handleChangeValue,
  handleChangeColor,
  onSubmit
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
        <div className={styles.modalBody}>
          <Input
            label="Name"
            type="text"
            value={name}
            helperText={nameHelperText}
            onChange={handleChangeName}
          />
          <Input
            label="Value"
            type="text"
            value={value}
            helperText={valueHelperText}
            onChange={handleChangeValue}
          />
          <InputColor color={color} onChange={handleChangeColor} />
        </div>
        <div className={styles.modalFooter}>
            <button
                onClick={onSubmit}
                className={styles.submitButton}
            >
                Submit
            </button>
        </div>
      </Box>
    </Modal>
  );
};

export default InputModal;
