import { useState } from "react";
import ChartType from "./ChartType";
import './Chart.scss';

function UserChart({ items }) {
    const currentYear = new Date(Date.now()).getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState('All');
    const [selectChartType, setSelectChartType] = useState('ChartBar');

    const generateYearOptions = () => {
        let years = [];
        if (items.length > 0) {
            const oldYear = new Date(items[0].createdAt).getFullYear();
            for (let i = oldYear; i < currentYear; i++) {
                years.push(i);
            }
        }
        years.push(currentYear);
        return years;
    };

    const yearOptions = generateYearOptions();
    const monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const chartTypes = ['ChartBar', 'ChartLine'];

    return (
        <div>
            <h1>Chart User</h1>
            <div className="select-container">
                <select className="select" onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
                    {yearOptions.map((yearOption) => (
                        <option key={yearOption} value={yearOption}>
                            {yearOption}
                        </option>
                    ))}
                </select>

                <select className="select" onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
                    <option value="All">All</option>
                    {monthOptions.map((monthName, index) => (
                        <option key={index} value={index + 1}>
                            {monthName}
                        </option>
                    ))}
                </select>

                <select className="select" onChange={(e) => setSelectChartType(e.target.value)} value={selectChartType}>
                    {chartTypes.map((chartType) => (
                        <option key={chartType} value={chartType}>
                            {chartType}
                        </option>
                    ))}
                </select>
            </div>

            <ChartType chartType={selectChartType} items={items} year={selectedYear} month={selectedMonth} />
        </div>
    );
}

export default UserChart;
