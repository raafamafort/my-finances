'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '@styles/balance.module.css';
import InputModal from '@components/InputModal/InputModal';
import { showErrorToast, showSuccessToast } from '@lib/utils/toast';
import DoughnutChart from '@components/DoughnutChart/DoughnutChart';
import { AiFillEdit } from 'react-icons/ai';
import { IoMdAddCircle } from 'react-icons/io';

interface Expense {
  id: number;
  userId: number;
  amount: number;
  description: string;
  color: string;
}

const Page = () => {
  const { data } = useSession();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currency, setCurrency] = useState<string>('R$');

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedCurrency = localStorage.getItem('currency');
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (data?.user?.id) {
        try {
          const response = await fetch(
            `/api/expense?userId=${data?.user?.id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          const result = await response.json();
          setExpenses(result.expenses);
        } catch (err) {
          console.error(err);
          showErrorToast('An unexpected error occurred');
        }
      }
    };

    if (!open) {
      fetchData();
    }
  }, [data?.user?.id, open]);

  const [modalTitle, setModalTitle] = useState<string>('');

  const [expenseId, setExpenseId] = useState<number>(0);

  const handleOpen = (expense?: Expense) => {
    if (expense) {
      setDescription(expense.description);
      setValue(expense.amount.toString());
      setColor(expense.color);
      setExpenseId(expense.id);
      setModalTitle('Edit expense');
    } else {
      setModalTitle('Add expense');
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [description, setDescription] = useState<string>('');
  const [descriptionHelperText, setDescriptionHelperText] =
    useState<string>('');

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const [value, setValue] = useState<string>('');
  const [valueHelperText, setValueHelperText] = useState<string>('');

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValid = /^(\d*\.?\d*)$/.test(value) && value.split('.').length <= 2;

    if (isValid) setValue(e.target.value);
  };

  const [color, setColor] = useState('#ffe');

  const handleChangeColor = (newColor: string) => {
    setColor(newColor);
  };

  const validateForm = () => {
    let isValid = true;

    if (description === '') {
      setDescriptionHelperText('Name is required');
      isValid = false;
    } else {
      setDescriptionHelperText('');
    }

    if (value === '' || Number(value) === 0) {
      setValueHelperText('Value is required');
      isValid = false;
    } else {
      setValueHelperText('');
    }

    return isValid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const method = expenseId === 0 ? 'POST' : 'PUT';
      const body = JSON.stringify({
        ...(expenseId !== 0 && { id: expenseId }),
        userId: Number(data?.user?.id),
        description,
        amount: Number(value),
        color,
      });

      const response = await fetch('/api/expense', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const result = await response.json();
      if (response.ok) {
        handleClose();
        showSuccessToast(
          expenseId === 0
            ? 'Expense created successfully'
            : 'Expense updated successfully',
        );
      } else {
        showErrorToast(result.message || 'Failed');
      }
    } catch (err) {
      console.error(err);
      showErrorToast('An unexpected error occurred');
    }
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/expense?id=${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        showSuccessToast('Expense deleted successfully');
        handleClose();
      } else {
        showErrorToast(result.message || 'Failed to delete expense');
      }
    } catch (err) {
      console.error(err);
      showErrorToast('An unexpected error occurred');
    }
  };

  useEffect(() => {
    if (!open) {
      setDescription('');
      setDescriptionHelperText('');
      setValue('');
      setValueHelperText('');
      setColor('#fff');
      setExpenseId(0);
    }
  }, [open]);

  return (
    <main className={styles.container}>
      <div className={styles.pageTitle}>
        <h1>Expenses</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.chart}>
          <DoughnutChart data={expenses} />
        </div>
        <div className={styles.balances}>
          {expenses.map((expense, index) => (
            <div key={index}>
              <div className={styles.balanceItem}>
                <span style={{ color: expense.color }}>
                  {expense.description}
                </span>
                <div className={styles.balanceAmount}>
                  <span>{`${currency} ${expense.amount}`}</span>
                  <AiFillEdit
                    size={20}
                    color="#94A3B8"
                    onClick={() => handleOpen(expense)}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className={styles.balanceItem}>
            <span style={{ color: '#94A3B8' }}>Add Expense</span>
            <IoMdAddCircle
              size={24}
              color="#94A3B8"
              onClick={() => handleOpen()}
            />
          </div>
        </div>
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
        onDelete={handleDelete}
      />
    </main>
  );
};

export default Page;
