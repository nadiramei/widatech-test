import React, { useEffect, useState } from "react";
import Sidebar from './components/Sidebar.js';
import DummyChart from "./components/Chart.js";

const Dashboard = () => {
    const [totalSalesToday, setTotalSalesToday] = useState(0);
    const [totalSalesThisWeek, setTotalSalesThisWeek] = useState(0);
    const [totalSalesThisMonth, setTotalSalesThisMonth] = useState(0);

    useEffect(() => {
        fetchInvoicesData();
    }, []);

    const fetchInvoicesData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/get-invoices');
            const invoicesData = await response.json();
            console.log(invoicesData);
            calculateTotalSales(invoicesData);
        } catch (error) {
            console.error('Error fetching invoices data:', error);
        }
    };

    const calculateTotalSales = (invoicesData) => {
        // Get current date
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed
        const currentYear = currentDate.getFullYear();

        // Calculate total sales for today
        const totalSalesToday = invoicesData.reduce((total, invoice) => {
            const invoiceDate = new Date(invoice.invoice_date);
            if (invoiceDate.getDate() === currentDay && invoiceDate.getMonth() + 1 === currentMonth && invoiceDate.getFullYear() === currentYear) {
                return total + parseFloat(invoice.amount);
            }
            return total;
        }, 0);
        setTotalSalesToday(totalSalesToday);

        // Calculate total sales for this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const totalSalesThisWeek = invoicesData.reduce((total, invoice) => {
            const invoiceDate = new Date(invoice.invoice_date);
            if (invoiceDate >= oneWeekAgo && invoiceDate <= currentDate) {
                return total + parseFloat(invoice.amount);
            }
            return total;
        }, 0);
        setTotalSalesThisWeek(totalSalesThisWeek);

        // Calculate total sales for this month
        const totalSalesThisMonth = invoicesData.reduce((total, invoice) => {
            const invoiceDate = new Date(invoice.invoice_date);
            if (invoiceDate.getMonth() + 1 === currentMonth && invoiceDate.getFullYear() === currentYear) {
                return total + parseFloat(invoice.amount);
            }
            return total;
        }, 0);
        setTotalSalesThisMonth(totalSalesThisMonth);
    };

    return (
        <>
            <Sidebar />
            <div className="body">
                <h1 className="text-2xl text-gray-400 mb-5">Dashboard</h1>
                <div className="min-h-full border border-gray-300 rounded-xl p-5 bg-white">
                    <div className="flex flex-col justify-center items-center mb-16">
                        <h2 className="font-bold tracking-widest mb-4">TOTAL SALES</h2>
                        <div className="flex flex-row gap-20">
                            <div className="flex flex-col">
                                <span className="text-4xl tracking-widest">$ {totalSalesToday.toFixed(2)}</span>
                                <span className="text-gray-400 font-semibold">TODAY</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl tracking-widest">$ {totalSalesThisWeek.toFixed(2)}</span>
                                <span className="text-gray-400 font-semibold">THIS WEEK</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl tracking-widest">$ {totalSalesThisMonth.toFixed(2)}</span>
                                <span className="text-gray-400 font-semibold">THIS MONTH</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                        <h2 className="font-bold tracking-widest mb-4">SALES GRAPH</h2>
                        <DummyChart/>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Dashboard;