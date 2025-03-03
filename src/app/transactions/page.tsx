"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/calender";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "../type";
import { Trash2, Edit, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTransactionId, setEditTransactionId] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Fetch Transactions
  const getTransactions = async () => {
    try {
      const res = await fetch("/api/transactions", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };


  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete transaction");

      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 px-5 md:py-5">
        <div className="hidden md:flex items-center gap-4">
          <div className="flex-1 h-20 bg-blue-600"></div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 uppercase">
            Finance Visualizer
          </h1>
        </div>
        <div className="py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-5">Your Transactions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={index} className="h-32 w-full rounded-lg bg-gray-300" />
                  ))
              : transactions.map((transaction) => (
                  <Card key={transaction._id} className="shadow-md border relative">
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setEditTransactionId(transaction._id);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit size={20} />
                          </button>
                        </DialogTrigger>
                        {editTransactionId === transaction._id && (
                          <DialogContent className="p-5 rounded-lg shadow-lg bg-white">
                            {selectedTransaction && <EditDialog transaction={selectedTransaction} />}
                          </DialogContent>
                        )}
                      </Dialog>
                      <button
                        onClick={() => deleteTransaction(transaction._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {transaction.description}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <p className="text-gray-700">
                        Amount: <span className="font-medium">${transaction.amount}</span>
                      </p>
                      <p className="text-gray-500 text-sm">
                        Date: {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditDialog({ transaction }: { transaction: Transaction }) {
  const [selectedDate, setSelectedDate] = useState(new Date(transaction.date));
  const [formData, setFormData] = useState({
    amount: transaction.amount,
    date: format(new Date(transaction.date), "yyyy-MM-dd"),
    description: transaction.description,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: format(selectedDate, "yyyy-MM-dd"),
    }));
  }, [selectedDate]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/transactions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: transaction._id, ...formData }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Transaction updated successfully!");
      } else {
        setMessage(data.message || "Failed to update transaction");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} placeholder="Enter amount" />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center">
                {format(selectedDate, "PPP")}
                <CalendarIcon className="w-5 h-5 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0 w-full bg-white rounded-lg shadow-lg">
              <DayPicker mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} className="p-4" />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter details" />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary-dark transition" disabled={loading}>
          {loading ? "Updating..." : "Update Transaction"}
        </Button>
      </form>
      {message && <p className="mt-3 text-center text-green-600">{message}</p>}
    </div>
  );
}
