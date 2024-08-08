'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from '@styles/balance.module.css';
import DoughnutChart from '@components/DoughnutChart/DoughnutChart';
import { useCurrency } from '@context/CurrencyContext';
import { IoMdAddCircle } from 'react-icons/io';
import InputModal from '@components/InputModal/InputModal';
import { showErrorToast, showSuccessToast } from '@lib/utils/toast';
import { AiFillEdit } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Expense {
  id: number;
  userId: number;
  amount: number;
  description: string;
  color: string;
  categoryId: number;
}

interface CategoryPageProps {
  params: { id: string };
}

const CategoryPage = ({ params }: CategoryPageProps) => {
  const { data } = useSession();
  const router = useRouter();
  const { currency } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');

  const categoryId = Number(params.id);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (data?.user?.id && categoryId) {
        try {
          const [expenseResponse, categoryResponse] = await Promise.all([
            fetch(
              `/api/expense/?userId=${data?.user?.id}&categoryId=${categoryId}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            ),
            fetch(`/api/category?id=${categoryId}&userId=${data?.user?.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }),
          ]);

          const expenseResult = await expenseResponse.json();
          setExpenses(expenseResult.expenses);

          const categoryResult = await categoryResponse.json();
          setCategoryName(categoryResult.categories[0].name);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [data?.user?.id, categoryId, open]);

  const [modalTitle, setModalTitle] = useState<string>('');

  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
  const [loadingOnDelete, setLoadingOnDelete] = useState(false);

  const [expenseId, setExpenseId] = useState<number>(0);
  const handleClose = () => setOpen(false);
  const handleOpen = (expense?: Expense) => {
    if (expense) {
      setDescription(expense.description);
      setValue(expense.amount.toString());
      setExpenseId(expense.id);
      setModalTitle('Edit expense');
    } else {
      setModalTitle('Add expense');
    }
    setOpen(true);
  };
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
    const isValid = /^(\d*\.?\d{0,2})?$/.test(value);

    if (isValid) setValue(e.target.value);
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
    setLoadingOnSubmit(true);
    try {
      const method = expenseId === 0 ? 'POST' : 'PUT';
      const body = JSON.stringify({
        ...(expenseId !== 0 && { id: expenseId }),
        userId: Number(data?.user?.id),
        description,
        amount: Number(value),
        color: '#ffffff',
        categoryId,
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
    setLoadingOnSubmit(false);
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setLoadingOnDelete(true);
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
    setLoadingOnDelete(false);
  };

  useEffect(() => {
    if (!open) {
      setDescription('');
      setDescriptionHelperText('');
      setValue('');
      setValueHelperText('');
      setExpenseId(0);
    }
  }, [open]);

  return (
    <main className={styles.container}>
      <div
        className={styles.categoryTitle}
        onClick={() => {
          router.push('/expense');
        }}
      >
        <FaArrowLeft />
        <h1>{categoryName}</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.chart}>
          <DoughnutChart data={expenses} currency={currency} />
        </div>
        <div className={styles.balances}>
          {expenses.map((expense, index) => (
            <div key={index}>
              <div className={styles.balanceItem}>
                <span>{expense.description}</span>
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
          <InputModal
            title={modalTitle}
            open={open}
            handleClose={handleClose}
            description={description}
            descriptionHelperText={descriptionHelperText}
            value={value}
            valueHelperText={valueHelperText}
            handleChangeDescription={handleChangeDescription}
            handleChangeValue={handleChangeValue}
            onSubmit={onSubmit}
            onDelete={handleDelete}
            loadingOnSubmit={loadingOnSubmit}
            loadingOnDelete={loadingOnDelete}
          />
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
