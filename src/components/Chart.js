import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

const DummyChart = () => {
    const [chart, setChart] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/get-invoices');
                const invoicesData = await response.json();
                console.log(invoicesData);
                const data = processDataForChart(invoicesData);
                renderChart(data);
            } catch (error) {
                console.error('Error fetching invoices data:', error);
            }
        };

        fetchData();

        return () => {
            if (chart !== null) { // Add conditional check for chart not being null
                chart.destroy();
            }
        };
    }, [chart]); // Add chart as a dependency for the useEffect hook

    const processDataForChart = (invoicesData) => {
        invoicesData.sort((a, b) => new Date(a.invoice_date) - new Date(b.invoice_date));

        const labels = invoicesData.map((invoice) => new Date(invoice.invoice_date).toLocaleDateString());
        const amounts = invoicesData.map((invoice) => parseFloat(invoice.amount));

        return {
            labels: labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Sales Amount',
                    data: amounts,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                },
            ],
        };
    };

    const renderChart = (data) => {
        const ctx = document.getElementById("myChart");
        const config = {
            type: "line",
            data: data,
            options: {
                plugins: {
                    zoom: {
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: 'xy',
                        },
                        pan: {
                            enabled: true,
                            mode: 'xy',
                        },
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: (context) => {
                                return `Sales Amount: ${context.raw}`;
                            },
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },

            },
        };

        const newChart = new Chart(ctx, config);
        setChart(newChart);
    };

    return <canvas id="myChart" width="400" height="400"></canvas>;
};

export default DummyChart;
