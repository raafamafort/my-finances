'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '@styles/balance.module.css';
import { showErrorToast } from '@lib/utils/toast';
import PieChart from '@components/PieChart/PieChart';
import { useCurrency } from '@context/CurrencyContext';

interface Balance {
  id: number;
  userId: number;
  amount: number;
  description: string;
  color: string;
}

const Page = () => {
  const { data } = useSession();

  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      if (data?.user?.id) {
        try {
          const [incomeResponse, expenseResponse] = await Promise.all([
            fetch(`/api/income?userId=${data?.user?.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }),
            fetch(`/api/expense?userId=${data?.user?.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }),
          ]);

          const incomeResult = await incomeResponse.json();
          const totalIncome = incomeResult.incomes.reduce(
            (sum: number, income: Balance) => sum + income.amount,
            0,
          );
          setTotalIncome(totalIncome);

          const expenseResult = await expenseResponse.json();
          const totalExpense = expenseResult.expenses.reduce(
            (sum: number, expense: Balance) => sum + expense.amount,
            0,
          );
          setTotalExpense(totalExpense);
        } catch (err) {
          console.error(err);
          showErrorToast('An unexpected error occurred');
        }
      }
    };

    fetchData();
  }, [data?.user?.id]);

  return (
    <main className={styles.container}>
      <div className={styles.pageTitle}>
        <h1>Net Income</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.chart}>
          <PieChart
            income={totalIncome}
            expense={totalExpense}
            currency={currency}
          />
        </div>
        <div className={styles.balances}>
          <div className={styles.balanceItem}>
            <span style={{ color: '#8AE08A' }}>Income</span>
            <span>{`${currency} ${totalIncome.toFixed(2)}`}</span>
          </div>
          <div className={styles.balanceItem}>
            <span style={{ color: '#FF8B76' }}>Expense</span>
            <span>{`${currency} ${totalExpense.toFixed(2)}`}</span>
          </div>
          <div className={styles.balanceItem}>
            <span style={{ color: '#FFF' }}>Net Income</span>
            <span>{`${currency} ${(totalIncome - totalExpense).toFixed(2)}`}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
