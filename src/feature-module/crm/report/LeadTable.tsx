import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { leadsData, Lead } from './data';
import Chart from 'react-apexcharts';
import { useParams } from 'react-router';
import { FaCog } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GroupedLeadsTableProps {
    groupBy: string;
    toggleChart: boolean;
    initColumns: Column[];
    data: any;
    typeReport: string;
}

interface Column {
    label: string;
    key: string;
}

type ChartType = "pie" | "bar" | "line" | "scatter" | "bubble" | "polarArea" | "radar" | "area"
    | "donut" | "radialBar" | "heatmap" | "candlestick" | "boxPlot" | "rangeBar" | "rangeArea" | "treemap";

const GroupedLeadsTable: React.FC<GroupedLeadsTableProps> = ({ groupBy, toggleChart, initColumns, data, typeReport }) => {
    const [columns, setColumns] = useState<Column[]>(initColumns);
    const [chartOptions, setChartOptions] = useState<any>({
        series: [44, 55, 13, 43],
        options: {
            chart: {
                width: 400,
                height: 300,
                type: 'pie',
            },
            legend: {
                position: 'bottom',
            },
            labels: ['Inpipeline', 'Follow Up', 'Schedule Service', 'Conversation'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 275,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        },
    });
    const [chartType, setChartType] = useState<ChartType>('pie');
    const [groupedData, setGroupedData] = useState<Record<string, any>>({});
    const [showDropdown, setShowDropdown] = useState(false);
    const { id } = useParams();

    // Helper function to access nested properties
    const getNestedValue = (obj: any, path: string) => {
        return path?.split('.')?.reduce((acc, part) => acc && acc[part], obj);
    };

    // Group the leads by the specified field
    const generateRandomKey = () => {
        return Math.random().toString(36).substring(7);
    }

    useEffect(() => {
        if (data && data.length > 0) {
            updateNewData();
        }
    }, [data])

    useEffect(() => {
        if (data && data.length > 0)
            updateNewData();
    }, [groupBy]);

    const updateNewData = () => {
        const newData = data?.reduce((groups: any, lead: any) => {
            const groupKey = String(getNestedValue(lead, groupBy)) !== "null" && String(getNestedValue(lead, groupBy)) !== "undefined" ? String(getNestedValue(lead, groupBy)) : "N/A";
            const group = groups[groupKey] || [];
            group.push(lead);
            groups[groupKey] = group;
            return groups;
        }, {});
        setGroupedData(newData);
    }

    useEffect(() => {
        setChartType(chartType);
        changeChartType(chartType);
    }, [groupedData])

    // Change chart type based on the selected option in react-apexcharts
    const changeChartType = (type: ChartType) => {
        const seriesData = Object.keys(groupedData).map((key) => groupedData[key].length);
        if (type === 'pie') {
            setChartOptions({
                series: seriesData,
                options: {
                    chart: {
                        width: 400,
                        height: 300,
                        type: 'pie',
                    },
                    legend: {
                        position: 'bottom',
                    },
                    labels: Object.keys(groupedData),
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 275,
                                },
                                legend: {
                                    position: 'bottom',
                                },
                            },
                        },
                    ],
                },
            });
        } else if (type === 'bar') {
            setChartOptions({
                series: [
                    {
                        name: 'Leads',
                        data: seriesData,
                    },
                ],
                options: {
                    chart: {
                        type: 'bar',
                        height: 350,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                        },
                    },
                    xaxis: {
                        categories: Object.keys(groupedData),
                    },
                    fill: {
                        colors: ['#f44336'],
                    },
                },
            });
        } else if (type === 'line') {
            setChartOptions({
                series: [
                    {
                        name: 'Leads',
                        data: seriesData,
                    },
                ],
                options: {
                    chart: {
                        type: 'line',
                        height: 350,
                    },
                    xaxis: {
                        categories: Object.keys(groupedData),
                    },
                },
            });
        } else if (type === 'donut') {
            setChartOptions({
                series: seriesData,
                options: {
                    chart: {
                        width: 400,
                        height: 300,
                        type: 'donut',
                    },
                    legend: {
                        position: 'bottom',
                    },
                    labels: Object.keys(groupedData),
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 275,
                                },
                                legend: {
                                    position: 'bottom',
                                },
                            },
                        },
                    ],
                },
            });
        }
    };

    useEffect(() => {
        setColumns(initColumns);
    }, [initColumns])

    const removeColumn = (key: string) => {
        setColumns((prevColumns) => prevColumns.filter((column) => column.key !== key));
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div>
            {toggleChart && (
                <div className="col-xl-12">
                    <h2>{`${typeReport} Chart`}</h2>
                    <div className='d-flex justify-content-center' style={{ position: 'relative' }}>
                        {
                            (chartType === 'donut' || chartType === 'pie') && (
                                <Chart
                                    options={chartOptions.options}
                                    series={chartOptions.series}
                                    type={chartType}
                                    width={chartOptions.options.chart.width}
                                    height={chartOptions.options.chart.height}
                                />
                            )
                        }
                        {
                            (chartType === 'bar' || chartType === 'line') && (
                                <Chart
                                    options={chartOptions.options}
                                    series={chartOptions.series}
                                    type={chartType}
                                    width={chartOptions.options.chart.width}
                                    height={chartOptions.options.chart.height}
                                />
                            )
                        }
                        <div style={{ position: 'absolute', bottom: 10, right: 100 }}>
                            <FaCog
                                size={24}
                                style={{ cursor: 'pointer' }}
                                onClick={toggleDropdown}
                            />
                            {showDropdown && (
                                <div style={{ position: 'absolute', backgroundColor: 'white', borderRadius: 5, boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }}>
                                    <div style={{ padding: 10, cursor: 'pointer' }} onClick={() => { setChartType('bar'); changeChartType('bar'); setShowDropdown(false); }}>
                                        Bar
                                    </div>
                                    <div style={{ padding: 10, cursor: 'pointer' }} onClick={() => { setChartType('pie'); changeChartType('pie'); setShowDropdown(false); }}>
                                        Pie
                                    </div>
                                    <div style={{ padding: 10, cursor: 'pointer' }} onClick={() => { setChartType('line'); changeChartType('line'); setShowDropdown(false); }}>
                                        Line
                                    </div>
                                    <div style={{ padding: 10, cursor: 'pointer' }} onClick={() => { setChartType('donut'); changeChartType('donut'); setShowDropdown(false); }}>
                                        Donut
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}
            <div className="col-xl-12">
                <h2>{`${typeReport} Table`}</h2>
                <div>
                    <label htmlFor="columns">Columns: </label>
                    <div>
                        {columns.map((column) => (
                            <label key={`remove-${column.key} ${generateRandomKey()}`}>
                                <button className="btn btn-light mr-2">
                                    {column.label}
                                    <span onClick={() => removeColumn(column.key)}>❌</span>
                                </button>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th colSpan={columns.length} className="table-header">
                                    Grouped by {groupBy}
                                </th>
                            </tr>
                            <tr>
                                {columns.map((column) => (
                                    <th key={`Header-${column.key} ${generateRandomKey()}`}>{column.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(groupedData).map((groupKey) => (
                                <React.Fragment key={groupKey + "table" + generateRandomKey()}>
                                    <tr key={groupKey + "table-header"}>
                                        <td colSpan={columns.length} className="group-header">
                                            {groupKey}
                                        </td>
                                    </tr>
                                    {groupedData[groupKey].map((lead: any, index: number) => (
                                        <tr key={`${groupKey}-${index}`}>
                                            {columns.map((column) => (
                                                <td key={`${column.key}-row-table ${generateRandomKey()}`}>{getNestedValue(lead, column.key)}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GroupedLeadsTable;
