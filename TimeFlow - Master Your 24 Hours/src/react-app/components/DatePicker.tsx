import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const date = new Date(selectedDate);
  const isToday = selectedDate === format(new Date(), "yyyy-MM-dd");

  const handlePrevious = () => {
    const newDate = format(subDays(date, 1), "yyyy-MM-dd");
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = format(addDays(date, 1), "yyyy-MM-dd");
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Previous day button */}
        <motion.button
          onClick={handlePrevious}
          className="group p-2 sm:p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          whileHover={{ scale: 1.05, backgroundColor: "rgb(249 250 251)" }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ x: -3 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
          </motion.div>
        </motion.button>

        {/* Date display */}
        <div className="flex-1 text-center space-y-1">
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            </motion.div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              {format(date, "MMMM d, yyyy")}
            </h3>
          </motion.div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {format(date, "EEEE")}
          </p>
        </div>

        {/* Next day button */}
        <motion.button
          onClick={handleNext}
          className="group p-2 sm:p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          whileHover={{ scale: 1.05, backgroundColor: "rgb(249 250 251)" }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
          </motion.div>
        </motion.button>
      </div>

      {/* Today button */}
      {!isToday && (
        <motion.div
          className="mt-4 pt-4 border-t border-gray-100"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <motion.button
            onClick={handleToday}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-medium rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all text-sm sm:text-base group relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Jump to Today</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
