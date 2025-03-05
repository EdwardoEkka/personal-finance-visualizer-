import Calendar from "@/components/calender";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" flex-1">
        <div className="grid px-5 md:py-5 grid-cols-1 lg:grid-cols-2  gap-12 py-6">
          <div className="w-full flex">
            <Image
              src="/img/finance-1.svg"
              width={500}
              height={500}
              alt="Finance"
            />
          </div>

          <div>
            <p className="mt-4 text-gray-600">
              Take control of your finances with our interactive visualizer.
              Track your expenses, set budgets, and gain insights to make
              informed financial decisions.
            </p>
            <ul className="mt-6 space-y-3 text-gray-700">
              <li>✅ Track your monthly spending</li>
              <li>✅ Set financial goals and budgets</li>
              <li>✅ Get personalized financial insights</li>
            </ul>
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 py-6 px-5">
          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-blue-500">
            <h2 className="text-lg font-semibold text-gray-900">
              Track Transactions
            </h2>
            <p className="text-gray-600 mt-2">
              Monitor your expenses and income in real-time with detailed
              insights.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-gray-900">
              Budget Planning
            </h2>
            <p className="text-gray-600 mt-2">
              Set monthly budgets, track spending habits, and stay financially
              healthy.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-purple-500">
            <h2 className="text-lg font-semibold text-gray-900">
              Expense Categories
            </h2>
            <p className="text-gray-600 mt-2">
              Automatically categorize expenses to understand where your money
              goes.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-red-500">
            <h2 className="text-lg font-semibold text-gray-900">
              Visual Charts
            </h2>
            <p className="text-gray-600 mt-2">
              Get interactive graphs and charts for a better financial overview.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-yellow-500">
            <h2 className="text-lg font-semibold text-gray-900">
              Recurring Expenses
            </h2>
            <p className="text-gray-600 mt-2">
              Set up recurring bills and subscriptions to never miss a payment.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
            <h2 className="text-lg font-semibold text-gray-900">
              Goal Setting
            </h2>
            <p className="text-gray-600 mt-2">
              Define savings goals and track progress towards financial freedom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
