'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '@styles/balance.module.css';
import InputModal from '@components/InputModal/InputModal';
import { showErrorToast, showSuccessToast } from '@lib/utils/toast';
import DoughnutChart from '@components/DoughnutChart/DoughnutChart';
import { AiFillEdit } from 'react-icons/ai';
import { IoMdAddCircle } from 'react-icons/io';
import { useCurrency } from '@context/CurrencyContext';
import CategoryModal from '@components/CategoryModal/CategoryModal';
import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Expense {
    id: number;
    userId: number;
    amount: number;
    description: string;
    color: string;
    categoryId: number;
}

interface Category {
    id: number;
    name: string;
    userId: number;
    totalAmount: number;
}

interface CategoryResponse {
    categories: Category[];
}

interface DataChart {
    description: string;
    amount: number;
}

const Page = () => {
    const { data } = useSession();
    const router = useRouter();

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [dataChart, setDataChart] = useState<DataChart[]>([]);

    const { currency } = useCurrency();

    const [open, setOpen] = useState<boolean>(false);
    const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);

    const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
    const [loadingOnDelete, setLoadingOnDelete] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (data?.user?.id) {
                try {
                    const [expenseResponse, categoryResponse] =
                        await Promise.all([
                            fetch(`/api/expense?userId=${data?.user?.id}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }),
                            fetch(`/api/category?userId=${data?.user?.id}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }),
                        ]);

                    const expenseResult = await expenseResponse.json();
                    const filteredExpenses: Expense[] =
                        expenseResult.expenses.filter(
                            (expense: Expense) => !expense.categoryId
                        );
                    setExpenses(filteredExpenses);

                    const categoryResult: CategoryResponse =
                        await categoryResponse.json();
                    setCategories(categoryResult.categories);

                    const expenseEntries = filteredExpenses.map(expense => ({
                        description: expense.description,
                        amount: expense.amount,
                    }));

                    const categoryEntries = categoryResult.categories.map(
                        category => ({
                            description: category.name,
                            amount: category.totalAmount,
                        })
                    );

                    setDataChart([...expenseEntries, ...categoryEntries]);
                } catch (err) {
                    console.error(err);
                    showErrorToast('An unexpected error occurred');
                }
            }
        };

        if (!open && !openCategoryModal) {
            fetchData();
        }
    }, [data?.user?.id, open, openCategoryModal]);

    const [modalTitle, setModalTitle] = useState<string>('');

    const [expenseId, setExpenseId] = useState<number>(0);

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
    const handleClose = () => setOpen(false);

    const [description, setDescription] = useState<string>('');
    const [descriptionHelperText, setDescriptionHelperText] =
        useState<string>('');

    const handleChangeDescription = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
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
                        : 'Expense updated successfully'
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
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
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

    // Category
    const [categoryId, setCategoryId] = useState<number>(0);
    const [categoryModalTitle, setCategoryModalTitle] = useState<string>('');
    const [loadingOnSubmitCategory, setLoadingOnSubmitCategory] =
        useState(false);
    const [loadingOnDeleteCategory, setLoadingOnDeleteCategory] =
        useState(false);
    const [categoryName, setCategoryName] = useState<string>('');
    const [categoryNameHelperText, setCategoryNameHelperText] =
        useState<string>('');

    const handleOpenCategoryModal = (category?: Category) => {
        if (category) {
            setCategoryName(category.name);
            setCategoryId(category.id);
            setCategoryModalTitle('Edit Category');
        } else {
            setCategoryModalTitle('Add Category');
        }
        setOpenCategoryModal(true);
    };

    const handleCloseCategoryModal = () => setOpenCategoryModal(false);

    const handleChangeCategoryName = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCategoryName(e.target.value);
    };

    const onSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (categoryName === '') {
            setCategoryNameHelperText('Name is required');
            return;
        } else {
            setCategoryNameHelperText('');
        }

        setLoadingOnSubmitCategory(true);

        try {
            const method = categoryId === 0 ? 'POST' : 'PUT';
            const body = JSON.stringify({
                ...(categoryId !== 0 && { id: categoryId }),
                userId: Number(data?.user?.id),
                name: categoryName,
            });

            const response = await fetch('/api/category', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });

            const result = await response.json();
            if (response.ok) {
                handleCloseCategoryModal();
                showSuccessToast('Category created successfully');
            } else {
                showErrorToast(result.message || 'Failed');
            }
        } catch (err) {
            console.error(err);
            showErrorToast('An unexpected error occurred');
        }
        setLoadingOnSubmitCategory(false);
    };

    const handleDeleteCategory = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setLoadingOnDeleteCategory(true);
        try {
            const response = await fetch(`/api/category?id=${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (response.ok) {
                showSuccessToast('Category deleted successfully');
                handleCloseCategoryModal();
            } else {
                showErrorToast(result.message || 'Failed to delete category');
            }
        } catch (err) {
            console.error(err);
            showErrorToast('An unexpected error occurred');
        }
        setLoadingOnDeleteCategory(false);
    };

    const handleOpenCategoryPage = (category: Category) => {
        router.push(`/category/${category.id}`);
    };

    useEffect(() => {
        if (!openCategoryModal) {
            setCategoryName('');
            setCategoryNameHelperText('');
            setCategoryId(0);
        }
    }, [openCategoryModal]);

    return (
        <main className={styles.container}>
            <div className={styles.pageTitle}>
                <h1>Expenses</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.chart}>
                    <DoughnutChart data={dataChart} currency={currency} />
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
                    {categories.map((category, index) => (
                        <div key={index}>
                            <div className={styles.balanceItem}>
                                <div className={styles.balanceAmount}>
                                    <span>{category.name}</span>
                                </div>
                                <div className={styles.balanceAmount}>
                                    <span>{`${currency} ${category.totalAmount.toFixed(2)}`}</span>
                                    <AiFillEdit
                                        size={20}
                                        color="#94A3B8"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleOpenCategoryModal(category);
                                        }}
                                    />
                                    <FaArrowRight
                                        size={20}
                                        color="#94A3B8"
                                        onClick={() => {
                                            handleOpenCategoryPage(category);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div
                        className={styles.balanceItem}
                        onClick={() => handleOpen()}
                    >
                        <span style={{ color: '#94A3B8' }}>Add Expense</span>
                        <IoMdAddCircle size={24} color="#94A3B8" />
                    </div>
                    <div
                        className={styles.balanceItem}
                        onClick={() => handleOpenCategoryModal()}
                    >
                        <span style={{ color: '#94A3B8' }}>Add Category</span>
                        <IoMdAddCircle size={24} color="#94A3B8" />
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
                handleChangeDescription={handleChangeDescription}
                handleChangeValue={handleChangeValue}
                onSubmit={onSubmit}
                onDelete={handleDelete}
                loadingOnSubmit={loadingOnSubmit}
                loadingOnDelete={loadingOnDelete}
            />
            <CategoryModal
                title={categoryModalTitle}
                open={openCategoryModal}
                handleClose={handleCloseCategoryModal}
                name={categoryName}
                nameHelperText={categoryNameHelperText}
                handleChangeName={handleChangeCategoryName}
                onSubmit={onSubmitCategory}
                onDelete={handleDeleteCategory}
                loadingOnSubmit={loadingOnSubmitCategory}
                loadingOnDelete={loadingOnDeleteCategory}
            />
        </main>
    );
};

export default Page;
