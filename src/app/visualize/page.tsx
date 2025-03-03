"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { useWindowSize } from "react-use";

export interface Transaction {
  amount: number;
  date: string;
  description: string;
  _id: string;
}

export default function Page() {
  const { width } = useWindowSize();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<
    { month: string; total: number }[]
  >([]);

  const getTransactions = async () => {
    try {
      const res = await fetch("/api/transactions", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
      processChartData(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data: Transaction[]) => {
    const monthlyExpenses: Record<string, number> = {};

    data.forEach(({ amount, date }) => {
      const month = new Date(date).toLocaleString("default", {
        month: "short",
      });
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + amount;
    });

    const formattedData = Object.entries(monthlyExpenses).map(
      ([month, total]) => ({
        month,
        total,
      })
    );

    setChartData(formattedData);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const chartWidth = Math.min(width - 40, 600);
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  const xScale = scaleBand({
    domain: chartData.map((d) => d.month),
    range: [margin.left, chartWidth - margin.right],
    padding: 0.3,
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...chartData.map((d) => d.total)) || 1000],
    range: [height - margin.bottom, margin.top],
  });

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <div className="px-5 md:py-5 w-full">
        <div className="hidden md:flex items-center gap-4">
          <div className="flex-1 h-20 bg-blue-600"></div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 uppercase">
            Finance Visualizer
          </h1>
        </div>
        <div className="py-6">
          <h1 className="text-xl md:text-3xl font-bold py-4">Monthly Expenses</h1>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <svg width={chartWidth} height={height}>
                  <AxisBottom top={height - margin.bottom} scale={xScale} />
                  <AxisLeft left={margin.left} scale={yScale} />
                  <Group>
                    {chartData.map((d) => (
                      <Bar
                        key={d.month}
                        x={xScale(d.month)}
                        y={yScale(d.total)}
                        height={height - margin.bottom - yScale(d.total)}
                        width={xScale.bandwidth()}
                        fill="#4F46E5"
                      />
                    ))}
                  </Group>
                </svg>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Expense Table</h2>
                <table className="w-full mt-2 border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Month</th>
                      <th className="border border-gray-300 px-4 py-2">Total Expense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((d) => (
                      <tr key={d.month} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">{d.month}</td>
                        <td className="border border-gray-300 px-4 py-2">${d.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}