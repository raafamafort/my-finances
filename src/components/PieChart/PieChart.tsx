import ReactECharts from 'echarts-for-react';

interface PieChartProps {
  income: number;
  expense: number;
}

const PieChart: React.FC<PieChartProps> = ({ income, expense }) => {
  const getOption = () => {
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
      series: [
        {
          type: 'pie',
          radius: '70%',
          labelLine: {
            show: false,
          },
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            // color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
            padding: 5,
          },
          data: [
            {
              value: income,
              name: 'Income',
              itemStyle: {
                color: '#8AE08A',
              },
            },
            {
              value: expense,
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

export default PieChart;
