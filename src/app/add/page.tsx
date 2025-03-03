"use client";

import { useState, useEffect } from "react";
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
import { CalendarIcon } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Page() {
  const defaultDate = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [formData, setFormData] = useState({
    amount: "",
    date: format(defaultDate, "yyyy-MM-dd"),
    description: "",
  });
  const [errors, setErrors] = useState<{
    amount?: string;
    date?: string;
    description?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: format(selectedDate, "yyyy-MM-dd"),
    }));
  }, [selectedDate]);

  const validateForm = () => {
    let newErrors: typeof errors = {};

    if (
      !formData.amount ||
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = "Amount must be a positive number";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.description || formData.description.length < 3) {
      newErrors.description = "Description must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Transaction added successfully!");
        setFormData({
          amount: "",
          date: format(new Date(), "yyyy-MM-dd"),
          description: "",
        });
      } else {
        setMessage(data.message || "Failed to add transaction");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:min-h-screen">
      <Sidebar />
      <div className="px-5 py-5 flex-1">
        <div className="hidden md:flex items-center gap-4">
          <div className="flex-1 h-20 bg-blue-600"></div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 uppercase">
            Finance Visualizer
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-12 md:py-12 w-full">
          <div className="flex justify-center order-2 lg:order-1">
            <Image
              src="/img/credit.svg"
              width={400}
              height={400}
              alt="Finance"
            />
          </div>
          <Card className="w-full  shadow-lg rounded-xl bg-white h-fit m-auto order-1 lg:order-2">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Add a Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                    className="mt-1"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
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
                      className="w-auto p-0 bg-white rounded-lg shadow-lg"
                    >
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="p-4"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter details"
                    className="mt-1"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark transition flex items-center justify-center gap-2 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                      Adding...
                    </>
                  ) : (
                    "Add Transaction"
                  )}
                </Button>
              </form>
              {message && (
                <p className="mt-3 text-center text-green-600">{message}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
