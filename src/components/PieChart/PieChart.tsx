import ReactECharts from 'echarts-for-react';

interface DoughnutChartProps {
  income: number;
  expense: number;
  currency: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  income,
  expense,
  currency,
}) => {
  const getOption = () => {
    const difference = income - expense;

    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1E293B',
        textStyle: {
          color: '#fff',
        },
        borderColor: '#333',
        borderWidth: 1,
      },
      title: {
        text: `${currency} ${difference.toFixed(2)}`,
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#FFF',
        },
        subtextStyle: {
          fontSize: 14,
          color: '#666',
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            fontSize: 12,
            fontWeight: 'bold',
            padding: 5,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: income.toFixed(2),
              name: 'Income',
              itemStyle: {
                color: '#8AE08A',
              },
            },
            {
              value: expense.toFixed(2),
              name: 'Expense',
              itemStyle: {
                color: '#FF8B76',
              },
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    return option;
  };

  return (
    <ReactECharts
      style={{ width: '100vw', height: '60vh' }}
      opts={{ renderer: 'svg' }}
      option={getOption()}
      notMerge
    />
  );
};

export default DoughnutChart;
