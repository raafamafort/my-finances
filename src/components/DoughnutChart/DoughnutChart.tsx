import ReactECharts from 'echarts-for-react';

interface DoughnutChartProps {
  data: {
    amount: number;
    description: string;
  }[];
  currency: string | null;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, currency }) => {
  const getOption = () => {
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

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
        text: `${currency} ${totalAmount.toLocaleString()}`,
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
          // padAngle: 5,
          // itemStyle: {
          //   borderRadius: 10,
          // },
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            // color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
            padding: 5,
          },
          emphasis: {
            label: {
              show: true,
              formatter: '{d}%',
              fontSize: 14,
              fontWeight: 'bold',
              // color: '#fff'
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map(item => ({
            value: item.amount,
            name: item.description,
            // itemStyle: {
            //   color: item.color,
            // },
          })),
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
