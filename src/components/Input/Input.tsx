import React from "react";
import { IconType } from "react-icons";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

const CustomTextField = styled(TextField)(({ theme }) => ({
  width: '312px',
  margin: '12px 0',
  "& .MuiInputLabel-root": {
    color: '#94A3B8',
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: '#94A3B8',
  },
  "& .MuiInputBase-input": {
    color: '#FFFFFF',
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: '#94A3B8',
  },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: '#94A3B8',
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: '#94A3B8',
  },
  "& .MuiInput-underline.Mui-focused:after": {
    borderBottomColor: '#94A3B8',
  },
  "& .MuiInputBase-input.Mui-focused": {
    color: '#FFFFFF',
  },
  "& .MuiFormHelperText-root": {
    color: '#FF0000',
    height: 0,
    margin: 0,
    padding: 0,
  },
}));

interface CustomInputProps {
  Icon?: IconType;
  type: string;
  value: string | number;
  label: string;
  helperText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput = ({
  Icon,
  type,
  value,
  label,
  helperText,
  onChange
}: CustomInputProps) => {
  return (
    <CustomTextField
      variant="standard"
      type={type}
      label={label}
      value={value}
      helperText={helperText}
      onChange={onChange}
      InputProps={{
        endAdornment: Icon ? (
          <InputAdornment position="end">
            <Icon size={20} color="#94A3B8" />
          </InputAdornment>
        ) : null,
      }}
    />
  );
}

export default CustomInput;
