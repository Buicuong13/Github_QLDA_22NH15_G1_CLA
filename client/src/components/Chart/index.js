import ImageChart from './ImageChart';
import UserChart from './UserChart';
import CapacityChart from './CapacityChart';


const components = {
    ImageChart: ImageChart,
    UserChart: UserChart,
    CapacityChart: CapacityChart,
};

function Chart({ type, items }) {
    const Comp = components[type];

    return (
        <div className={'wrapper'}>
            {Comp ? <Comp items={items} /> : <div>Invalid type</div>}
        </div>
    );
}

export default Chart;
