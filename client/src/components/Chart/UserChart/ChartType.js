import { CategoryScale } from "chart.js";
import { Bar, Line } from 'react-chartjs-2';
import Chart from "chart.js/auto";
Chart.register(CategoryScale);


const component = {
    ChartBar: Bar,
    ChartLine: Line,
};
const getDaysInMonth = (year, month, listDays) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let i = 0; i < daysInMonth; i++) {
        listDays.push(`Day ${i + 1}`);
    }
    return listDays;
}
const getMapData = (items, labels, year, month) => {
    const map = new Map();
    if (labels.length === 12) {
        items.forEach(item => {
            const date = new Date(item.createdAt);
            const getFullYear = date.getFullYear();
            const getMonth = date.getMonth() + 1;
            if (getFullYear === parseInt(year)) {
                if (map.has(getMonth)) {
                    map.set(getMonth, map.get(getMonth) + 1);
                }
                else {
                    map.set(getMonth, 1);
                }
            }
        });
        return map;
    }
    items.forEach(item => {
        const date = new Date(item.createdAt);
        const getFullYear = date.getFullYear();
        const getMonth = date.getMonth() + 1;
        const getDay = date.getDate();
        if (getFullYear === parseInt(year)) {
            if (getMonth === parseInt(month)) {
                console.log('a');
                if (map.has(getDay)) {
                    map.set(getDay, map.get(getDay) + 1);
                }
                else {
                    map.set(getDay, 1);
                }
            }
        }
    });
    return map;
}
const convertMaptoArr = (mapData, labels) => {
    const data = [];
    if (mapData.size !== labels.length) {
        labels.forEach((label, index) => {
            if (!mapData.has(index + 1)) {
                mapData.set(index + 1, 0);
            }
        })
        const arr = [...mapData.entries()].sort((a, b) => a[0] - b[0]);
        for (const [key, value] of arr) {
            data.push(value);
        }
        return data;
    }
    const arr = [...mapData.entries()].sort((a, b) => a[0] - b[0]);
    for (const [key, value] of arr) {
        data.push(value);
    }
    return data;
}
function ChartType({ chartType, items, year, month }) {
    const Comp = component[chartType];

    const labels = month === "All"
        ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        : getDaysInMonth(year, month, []);

    const mapData = getMapData(items, labels, year, month);
    const myData = convertMaptoArr(mapData, labels);
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Users',
                data: myData,
                fill: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;

                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.2)');
                    gradient.addColorStop(1, 'rgba(75, 192, 192, 0.8)');
                    return gradient;
                },
                borderColor: 'rgb(75, 192, 192)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverRadius: 10,
                pointHoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
                tension: 0.4, // Làm mềm đường nối
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top', // Đưa legend xuống dưới
                labels: {
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                    color: '#4A4A4A', // Màu tối hơn
                    padding: 20, // Khoảng cách giữa các mục
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 18, weight: 'bold' },
                bodyFont: { size: 14 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const percentage = ((value / myData.reduce((a, b) => a + b, 0)) * 100).toFixed(2);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                    drawBorder: true,
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                    color: '#333',
                },
            },
            y: {
                beginAtZero: true,
                suggestedMax: Math.max(...myData) + 5, // Tăng trục y để không quá sát
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                    drawBorder: true,
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                    color: '#333',
                },
            },
        },
        hover: {
            mode: 'index',
            intersect: false,
        },
        animations: {
            tension: {
                duration: 1000,
                easing: 'easeInOutQuart',
                from: 0.5,
                to: 0.4,
                loop: true,
            },
        },
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
