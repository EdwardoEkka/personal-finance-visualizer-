"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionCategoryList from "../data";

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className=" min-h-screen bg-gray-100">
        <div className="py-6 px-5 md:py-5">
          <h1 className="text-2xl md:text-3xl font-bold mb-5">
            Your Transactions
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-32 w-full rounded-lg bg-gray-300"
                    />
                  ))
              : transactions.map((transaction, index) => (
                  <ListCard
                    transaction={transaction}
                    key={index}
                    fetchTransactions={getTransactions}
                  />
                ))}
          </div>
        </div>
      </div>
  );
}

function EditDialog({ transaction, fetchTransactions }: { transaction: Transaction  ,fetchTransactions: () => void;}) {
  const [selectedDate, setSelectedDate] = useState(new Date(transaction.date));
  const [formData, setFormData] = useState({
    amount: transaction.amount,
    date: format(new Date(transaction.date), "yyyy-MM-dd"),
    description: transaction.description,
    category: transaction.category,
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
        fetchTransactions()
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
          <Input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-between items-center"
              >
                {format(selectedDate, "PPP")}
                <CalendarIcon className="w-5 h-5 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-0 w-full bg-white rounded-lg shadow-lg"
            >
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="p-4"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter details"
          />
        </div>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {TransactionCategoryList.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Transaction"}
        </Button>
      </form>
      {message && <p className="mt-3 text-center text-green-600">{message}</p>}
    </div>
  );
}

function ListCard({
  transaction,
  fetchTransactions,
}: {
  transaction: Transaction;
  fetchTransactions: () => void;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete transaction");
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <Card className="relative shadow-lg border bg-white border-gray-200 rounded-xl p-5 hover:shadow-xl transition-shadow">
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
            >
              <Edit size={18} />
            </button>
          </DialogTrigger>
          {isEditDialogOpen && (
            <DialogContent className="p-5 rounded-lg shadow-lg bg-white">
              <EditDialog transaction={transaction} fetchTransactions={fetchTransactions}/>
            </DialogContent>
          )}
        </Dialog>
        <button
          onClick={() => deleteTransaction(transaction._id)}
          className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Card Content */}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {transaction.description}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-gray-700">
          Amount:{" "}
          <span className="font-semibold text-gray-900">
            ${transaction.amount}
          </span>
        </p>
        <p className="text-gray-500 text-sm">
          Date: {new Date(transaction.date).toLocaleDateString()}
        </p>
        <Badge
          variant="outline"
          className="px-3 py-1 text-sm bg-gray-100 border-gray-300 text-gray-700"
        >
          {transaction.category}
        </Badge>
      </CardContent>
    </Card>
  );
}
