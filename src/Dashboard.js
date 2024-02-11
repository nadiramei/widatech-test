import React from "react";
import Sidebar from './components/Sidebar.js';

const Dashboard = () => {
    return (
        <>
            <Sidebar />
            <div className="body">
                <h1 className="text-2xl text-gray-400 mb-5">Dashboard</h1>
                <div className="min-h-full border border-gray-300 rounded-xl p-5 bg-white">
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="font-bold tracking-widest mb-4">SALES GRAPH</h2>
                        <img src="http://placekitten.com/g/200/300"/>
                    </div>
                    <div className="flex flex-col justify-center items-center mt-16">
                        <h2 className="font-bold tracking-widest mb-4">TOTAL SALES</h2>
                        <div className="flex flex-row gap-20">
                            <div className="flex flex-col">
                                <span className="text-4xl tracking-widest">$ 5000</span>
                                <span className="text-gray-400 font-semibold">TODAY</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl tracking-widest">$ 15000</span>
                                <span className="text-gray-400 font-semibold">THIS WEEK</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl tracking-widest">$ 50000</span>
                                <span className="text-gray-400 font-semibold">THIS MONTH</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Dashboard;