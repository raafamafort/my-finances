"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "@styles/income.module.css";
import InputModal from "@components/InputModal/InputModal";
import { showErrorToast, showSuccessToast } from "@lib/utils/toast";

const Page = () => {

  const { data } = useSession();

  const [open, setOpen] = useState(false);

  const [modalTitle, setModalTitle] = useState("");

  const handleOpen = (edit: boolean) => {
    if (edit) {
      setModalTitle("Edit income");
    } else {
      setModalTitle("Add income");
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [description, setDescription] = useState("");
  const [descriptionHelperText, setDescriptionHelperText] = useState("");

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
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

    if (description === "") {
      setDescriptionHelperText("Name is required");
      isValid = false;
    } else {
      setDescriptionHelperText("");
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
    
    try {
      const response = await fetch("/api/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(data?.user?.id),
          description,
          amount: Number(value),
          color,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        handleClose()
        showSuccessToast("Registration successful");
      } else {
        showErrorToast(result.message || "Registration failed");
      }
    } catch (err) {
      showErrorToast("An unexpected error occurred");
    }
  };

  useEffect(() => {
    if (open) {
      setDescription("");
      setDescriptionHelperText("");
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
        <button onClick={() => handleOpen(false)}>Add</button>
        <button onClick={() => handleOpen(true)}>Edit</button>
      </div>
      <InputModal
        title={modalTitle}
        open={open}
        handleClose={handleClose}
        description={description}
        descriptionHelperText={descriptionHelperText}
        value={value}
        valueHelperText={valueHelperText}
        color={color}
        handleChangeDescription={handleChangeDescription}
        handleChangeValue={handleChangeValue}
        handleChangeColor={handleChangeColor}
        onSubmit={onSubmit}
      />
    </main>
  );
};

export default Page;
