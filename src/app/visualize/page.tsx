"use client";
import { useEffect, useState } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { useWindowSize } from "react-use";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export interface Transaction {
  amount: number;
  date: string;
  description: string;
  category: string;
  _id: string;
}

export default function Page() {
  const { width } = useWindowSize();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<
    { month: string; total: number }[]
  >([]);
  const [categoryData, setCategoryData] = useState<
    { name: string; value: number }[]
  >([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const getTransactions = async () => {
    try {
      const res = await fetch("/api/transactions", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
      processChartData(data);
      processCategoryData(data);
      setTotalExpenses(
        data.reduce((sum: any, item: any) => sum + item.amount, 0)
      );
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
    setChartData(
      Object.entries(monthlyExpenses).map(([month, total]) => ({
        month,
        total,
      }))
    );
  };

  const processCategoryData = (data: Transaction[]) => {
    const categoryExpenses: Record<string, number> = {};
    data.forEach(({ amount, category }) => {
      categoryExpenses[category] = (categoryExpenses[category] || 0) + amount;
    });
    setCategoryData(
      Object.entries(categoryExpenses).map(([name, value]) => ({ name, value }))
    );
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

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6361"];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex-1 px-5 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-600 text-white p-4 rounded-lg text-center w-full">
            Total Expenses: ${totalExpenses.toFixed(2)}
          </div>
        </div>
        <h1 className="text-xl md:text-3xl font-bold py-4">Monthly Expenses</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <svg width={chartWidth} height={height} className="w-full">
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
            <div className="mt-6 overflow-x-auto">
              <h2 className="text-lg font-semibold">Expense Table</h2>
              <table className="w-full mt-2 border border-gray-300 text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Month</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Total Expense
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((d) => (
                    <tr key={d.month} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {d.month}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${d.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <h1 className="text-xl md:text-3xl font-bold py-4">
          Category Breakdown
        </h1>
        <div className="flex ">
          <PieChart width={300} height={300} className="w-full max-w-xs">
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {categoryData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
