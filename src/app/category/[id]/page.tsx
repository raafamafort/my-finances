'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from '@styles/balance.module.css';
import DoughnutChart from '@components/DoughnutChart/DoughnutChart';
import { useCurrency } from '@context/CurrencyContext';

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
  const { currency } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');

  const categoryId = Number(params.id);

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
          setCategoryName(categoryResult.name);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [data?.user?.id, categoryId]);

  if (!categoryId) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.container}>
      <div className={styles.pageTitle}>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
