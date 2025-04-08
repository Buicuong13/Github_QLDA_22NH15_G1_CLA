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
            const date = new Date(item.uploadDate);
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
        const date = new Date(item.uploadDate);
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
                label: `Images`,
                data: myData,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
                tension: 0.3
            }
        ]
    };

    const options = {
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
            },
            y: {
                beginAtZero: true,
                suggestedMax: 10,
                grid: {
                    color: 'rgba(200,200,200,0.2)',
                    drawBorder: false,
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
