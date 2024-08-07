"use client";

import { useState, useEffect } from "react";
import styles from "@styles/income.module.css";
import InputModal from "@components/InputModal/InputModal";

const Page = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = useState("");
  const [nameHelperText, setNameHelperText] = useState("");

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const [value, setValue] = useState("");
  const [valueHelperText, setValueHelperText] = useState("");

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValid = /^(\d*\.?\d*)$/.test(value) && value.split(".").length <= 2;

    if (isValid) setValue(e.target.value);
  };

  const [color, setColor] = useState("#fff");

  const handleChangeColor = (newColor: string) => {
    setColor(newColor);
  };

  const validateForm = () => {
    let isValid = true;

    if (name === "") {
      setNameHelperText("Name is required");
      isValid = false;
    } else {
      setNameHelperText("");
    }

    if (value === "" || Number(value) === 0) {
      setValueHelperText("Value is required");
      isValid = false;
    } else {
      setValueHelperText("");
    }

    return isValid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("submit");
  };

  useEffect(() => {
    if (open) {
      setName("");
      setNameHelperText("");
      setValue("");
      setValueHelperText("");
      setColor("#fff");
    }
  }, [open]);

  return (
    <main className={styles.container}>
      <div>
        <h1>Income</h1>
      </div>
      <div className={styles.content}>
        <div>Add Income</div>
        <button onClick={handleOpen}>Add</button>
      </div>
      <InputModal
        title={"Add Income"}
        open={open}
        handleClose={handleClose}
        name={name}
        nameHelperText={nameHelperText}
        value={value}
        valueHelperText={valueHelperText}
        color={color}
        handleChangeName={handleChangeName}
        handleChangeValue={handleChangeValue}
        handleChangeColor={handleChangeColor}
        onSubmit={onSubmit}
      />
    </main>
  );
};

export default Page;
