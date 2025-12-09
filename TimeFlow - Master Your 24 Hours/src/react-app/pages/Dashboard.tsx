import { useState } from "react";
import { format } from "date-fns";
import Header from "@/react-app/components/Header";
import DatePicker from "@/react-app/components/DatePicker";
import ActivityLogger from "@/react-app/components/ActivityLogger";
import AnalyticsDashboard from "@/react-app/components/AnalyticsDashboard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Date Picker */}
          <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

          {/* Activity Logger and Analytics Grid */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            <ActivityLogger
              selectedDate={selectedDate}
              onActivityAdded={handleActivityAdded}
              refreshKey={refreshKey}
            />
            <AnalyticsDashboard selectedDate={selectedDate} refreshKey={refreshKey} />
          </div>
        </div>
      </motion.main>

      {/* Floating elements for visual interest */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
