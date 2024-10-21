import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { FaCog } from 'react-icons/fa'; // Assuming you're using react-icons

type DataType = 'leads' | 'contacts';

interface CampaignChartProps {
    data: any[];
    dataType: DataType;
}

type ChartType = "pie" | "bar" | "line" | "donut";

const CampaignChart: React.FC<CampaignChartProps> = ({ data, dataType }) => {
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
    const [chartType, setChartType] = useState<ChartType>('donut');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        changeChartType(chartType);
    }, [data, chartType]);

    // Group the data by member status
    const groupedData = data.reduce<Record<string, any[]>>((groups, item) => {
        const statusName = dataType === 'leads'
            ? item.leadMember.memberStatus.campaignMemberStatusName
            : item.contactMember.memberStatus.campaignMemberStatusName;

        const group = groups[statusName] || [];
        group.push(item);
        groups[statusName] = group;
        return groups;
    }, {});

    const changeChartType = (type: ChartType) => {
        const seriesData = Object.keys(groupedData).map((key) => groupedData[key].length);
        const labelsData = Object.keys(groupedData); // Extract labels from groupedData

        if (type === 'pie' || type === 'donut') {
            setChartOptions({
                series: seriesData,
                options: {
                    chart: {
                        width: 400,
                        height: 300,
                        type: type,
                    },
                    legend: {
                        position: 'bottom',
                    },
                    labels: labelsData, // Set the correct labels
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
                        name: dataType.charAt(0).toUpperCase() + dataType.slice(1), // Use leads or contacts
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
                        categories: labelsData, // Use the correct labels
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
                        name: dataType.charAt(0).toUpperCase() + dataType.slice(1), // Use leads or contacts
                        data: seriesData,
                    },
                ],
                options: {
                    chart: {
                        type: 'line',
                        height: 350,
                    },
                    xaxis: {
                        categories: labelsData, // Use the correct labels
                    },
                },
            });
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div style={{ position: 'relative' }}>
            <div className="col-xl-12">
                <h5>{dataType.charAt(0).toUpperCase() + dataType.slice(1)} Data</h5>
                <div className="d-flex justify-content-center">
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
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
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
    );
};

export default CampaignChart;
