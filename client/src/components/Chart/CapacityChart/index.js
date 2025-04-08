import ChartType from "./ChartType";
function CapacityChart({ items }) {
    return (
        <div>
            <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Chart Capacity</h1>
            <ChartType chartType={'ChartBar'} items={items} />
        </div >
    );
}

export default CapacityChart;
