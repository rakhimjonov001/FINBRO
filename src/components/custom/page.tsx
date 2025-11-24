
import { useState } from "react";
import Dashboard_main from "./dashboard";
import { PerformanceChart } from "./performance-chart";
import { Sidebar } from "./sidebar";




export default function Dashboard() {
    const [selectedCurrency, setSelectedCurrency] = useState('UZS')
    return (
        <div className="relative h-screen w-full bg-black text-white overflow-hidden">


            {/* Main Scrollable Area */}
            <div className="h-full overflow-y-auto no-scrollbar">
                <main className="flex gap-6 p-6 pt-24 min-h-full">
                    <Sidebar />

                    {/* Main Content Container */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0">
                        <Dashboard_main onCurrencyChange={setSelectedCurrency} />
                        <PerformanceChart currency={selectedCurrency} />

                    </div>
                </main>
            </div>
        </div>
    )
}
