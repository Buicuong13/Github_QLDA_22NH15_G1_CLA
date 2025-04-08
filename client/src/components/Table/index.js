import classNames from "classnames/bind";
import styles from './Table.module.scss';
const cx = classNames.bind(styles);

function Table({ currentItems, columns, actions, loading }) {
    const renderRows = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={columns.length + (actions?.length || 0)}>
                        <div className={cx('loading')} />
                    </td>
                </tr>
            );
        }

        if (!currentItems?.length) {
            return (
                <tr>
                    <td colSpan={columns.length + (actions?.length || 0)}>
                        <div className={cx('empty-state')}>
                            No data available
                        </div>
                    </td>
                </tr>
            );
        }

        return currentItems.map((item, index) => (
            <tr key={index}>
                {columns?.map((col, colIndex) => (
                    <td key={colIndex}>
                        {col.render ? col.render(item[col.key]) : item[col.key]}
                    </td>
                ))}
                {actions?.map((action, actionIndex) => (
                    <td key={actionIndex}>
                        <button
                            className={cx('btn')}
                            onClick={() => action.handler(item)}
                        >
                            {action.title}
                        </button>
                    </td>
                ))}
            </tr>
        ));
    };

    return (
        <div className={cx('wrapper')}>
            <table>
                <thead>
                    <tr>
                        {columns?.map((col, index) => (
                            <th key={index} style={{ width: col.width }}>
                                {col.title}
                            </th>
                        ))}
                        {actions?.map((action, index) => (
                            <th key={index} style={{ width: action.width }}>
                                {action.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {renderRows()}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
