"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";

export default function DatePickerClient() {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Select a Date:</h3>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MM/dd/yyyy HH:mm"
                placeholderText="Click to select a date"
                className="border p-2 rounded-md w-full max-w-xs"
            />
            {selectedDate && (
                <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedDate.toLocaleDateString()}
                </p>
            )}
        </div>
    );
}