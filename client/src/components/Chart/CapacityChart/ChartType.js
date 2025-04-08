import { CategoryScale } from "chart.js";
import { Bar, Line } from 'react-chartjs-2';
import Chart from "chart.js/auto";
Chart.register(CategoryScale);

const component = {
    ChartBar: Bar,
    ChartLine: Line,
};

const sum = (items) => {
    let sum = 0;
    if (items.length > 0) {
        items.forEach(item => {
            sum += item.capacity / 1024; // Chuyển đổi MB sang GB
        });
    }
    return sum;
};

function ChartType({ chartType, items }) {
    const Comp = component[chartType];
    const totalUsedCapacity = sum(items);
    const maxCapacity = 20480 / 1024;

    const data = {
        labels: ['Capacity'],
        datasets: [
            {
                label: `Current Capacity (GB)`,
                data: [totalUsedCapacity],
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
                tension: 0.3
            },
            {
                label: `Max Capacity (GB)`,
                data: [maxCapacity],
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
                tension: 0.3
            }
        ]
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    color: '#333'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleFont: { size: 16 },
                bodyFont: { size: 14 },
                padding: 10,
                cornerRadius: 4
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                suggestedMax: Math.max(totalUsedCapacity, maxCapacity) + 1,
                grid: {
                    color: 'rgba(200,200,200,0.2)',
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#555',
                    callback: function (value) { return `${value.toFixed(2)} GB`; }
                }
            },
            y: {
                grid: {
                    color: 'rgba(200,200,200,0.2)',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#555'
                }
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        }
    };

    return (
        <div>
            {Comp ? (
                <Comp data={data} options={options} style={{ maxWidth: '100%', height: '300px' }} />
            ) : (
                <div>Invalid type</div>
            )}
        </div>
    );
}

export default ChartType;
