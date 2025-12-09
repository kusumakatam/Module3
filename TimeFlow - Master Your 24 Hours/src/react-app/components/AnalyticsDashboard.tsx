import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { BarChart3, TrendingUp, Clock, Eye, PieChart as PieChartIcon, ListOrdered } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id: number;
  activity_name: string;
  minutes: number;
  category: string | null;
}

interface Summary {
  activities: Activity[];
  total_minutes: number;
  is_complete: boolean;
}

interface AnalyticsDashboardProps {
  selectedDate: string;
  refreshKey: number;
}

const COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f97316", // orange
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#84cc16", // lime
];

const CATEGORY_COLORS: { [key: string]: string } = {
  Work: "#6366f1",
  Study: "#8b5cf6",
  Sleep: "#3b82f6",
  Exercise: "#10b981",
  Entertainment: "#ec4899",
  Meals: "#f97316",
  Commute: "#ef4444",
  Household: "#f59e0b",
  Social: "#06b6d4",
  Other: "#94a3b8",
};

export default function AnalyticsDashboard({ selectedDate, refreshKey }: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState<"pie" | "bar" | "timeline">("pie");

  useEffect(() => {
    fetchSummary();
  }, [selectedDate, refreshKey]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/activities/summary?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
        setShowAnalytics(false);
      }
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 flex items-center justify-center min-h-[300px] sm:min-h-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="text-center space-y-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 mx-auto" />
          </motion.div>
          <motion.p
            className="text-sm sm:text-base text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading analytics...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (!summary || summary.activities.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center space-y-6">
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
          </motion.div>
          <motion.div
            className="space-y-2 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">No Data Available</h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-sm">
              Start logging your activities to see beautiful analytics and insights about your day.
            </p>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Clock className="w-4 h-4" />
            <span>Log activities to fill your 24 hours</span>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Group activities by category
  const categoryData = summary.activities.reduce((acc: any, activity) => {
    const cat = activity.category || "Other";
    if (!acc[cat]) {
      acc[cat] = { name: cat, value: 0, count: 0 };
    }
    acc[cat].value += activity.minutes;
    acc[cat].count += 1;
    return acc;
  }, {});

  const categoryChartData = Object.values(categoryData).map((item: any) => ({
    name: item.name,
    value: item.value,
    percentage: ((item.value / 1440) * 100).toFixed(1),
  }));

  const barChartData = summary.activities.map((activity) => ({
    name: activity.activity_name.length > 15 ? activity.activity_name.substring(0, 15) + "..." : activity.activity_name,
    minutes: activity.minutes,
  }));

  const topActivity = summary.activities[0];
  const categoriesCount = Object.keys(categoryData).length;

  // Timeline data - distribute activities across 24 hours
  const timelineBlocks = summary.activities.map((activity, index) => {
    const previousMinutes = summary.activities
      .slice(0, index)
      .reduce((sum, a) => sum + a.minutes, 0);
    const startHour = previousMinutes / 60;
    const duration = activity.minutes / 60;
    return {
      ...activity,
      startHour,
      duration,
      startPercent: (previousMinutes / 1440) * 100,
      widthPercent: (activity.minutes / 1440) * 100,
    };
  });

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
          <p className="text-xs sm:text-sm text-gray-600">Visualize your time allocation</p>
        </motion.div>
        {summary.is_complete && !showAnalytics && (
          <motion.button
            onClick={() => setShowAnalytics(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md text-sm sm:text-base relative overflow-hidden group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Analyze
            </span>
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {!summary.is_complete && (
          <motion.div
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-amber-800 font-medium text-sm sm:text-base">
              Log {1440 - summary.total_minutes} more minutes to unlock full analytics
            </p>
            <p className="text-amber-600 text-xs sm:text-sm mt-1">Complete your 24 hours to see detailed insights</p>
          </motion.div>
        )}
      </AnimatePresence>

      {(showAnalytics || !summary.is_complete) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
              label="Total Logged"
              value={`${summary.total_minutes} min`}
              color="indigo"
              delay={0.1}
            />
            <StatCard
              icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
              label="Top Activity"
              value={topActivity.activity_name}
              color="purple"
              delay={0.2}
            />
            <StatCard
              icon={<BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />}
              label="Activities"
              value={summary.activities.length.toString()}
              color="pink"
              delay={0.3}
            />
            <StatCard
              icon={<PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              label="Categories"
              value={categoriesCount.toString()}
              color="orange"
              delay={0.4}
            />
          </div>

          {/* Chart Type Toggle */}
          {summary.is_complete && showAnalytics && (
            <motion.div
              className="flex flex-wrap gap-2 justify-center border-t border-b border-gray-200 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { mode: "pie" as const, icon: PieChartIcon, label: "Pie Chart" },
                { mode: "bar" as const, icon: BarChart3, label: "Bar Chart" },
                { mode: "timeline" as const, icon: ListOrdered, label: "Timeline" },
              ].map((item, index) => (
                <motion.button
                  key={item.mode}
                  onClick={() => setViewMode(item.mode)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    viewMode === item.mode
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Visualizations */}
          <AnimatePresence mode="wait">
            {summary.is_complete && showAnalytics && (
              <motion.div
                key={viewMode}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {viewMode === "pie" && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-center mb-4 text-sm sm:text-base">
                      Time Distribution by Category
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: any) => {
                            const data = categoryChartData[props.index];
                            return `${data.name} (${data.percentage}%)`;
                          }}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {categoryChartData.map((item: any, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CATEGORY_COLORS[item.name] || COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`${value} minutes (${(value / 60).toFixed(1)}h)`, "Duration"]}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {viewMode === "bar" && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-center mb-4 text-sm sm:text-base">
                      Activity Duration Comparison
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={barChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fontSize: 11 }} label={{ value: "Minutes", angle: -90, position: "insideLeft", fontSize: 11 }} />
                        <Tooltip
                          formatter={(value: number) => [`${value} min (${(value / 60).toFixed(1)}h)`, "Duration"]}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Bar dataKey="minutes" radius={[8, 8, 0, 0]} animationBegin={0} animationDuration={800}>
                          {barChartData.map((_entry, index) => {
                            const activity = summary.activities[index];
                            const color = activity.category
                              ? CATEGORY_COLORS[activity.category] || COLORS[index % COLORS.length]
                              : COLORS[index % COLORS.length];
                            return <Cell key={`cell-${index}`} fill={color} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {viewMode === "timeline" && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-center mb-4 text-sm sm:text-base">
                      24-Hour Timeline View
                    </h3>
                    <div className="space-y-4">
                      <div className="flex text-xs text-gray-500 justify-between px-1">
                        <span>12 AM</span>
                        <span>6 AM</span>
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>12 AM</span>
                      </div>
                      <div className="relative w-full h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <AnimatePresence>
                          {timelineBlocks.map((block, index) => {
                            const color = block.category
                              ? CATEGORY_COLORS[block.category]
                              : COLORS[index % COLORS.length];
                            return (
                              <motion.div
                                key={block.id}
                                className="absolute h-full group cursor-pointer transition-all hover:opacity-80"
                                style={{
                                  left: `${block.startPercent}%`,
                                  width: `${block.widthPercent}%`,
                                  backgroundColor: color,
                                }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                title={`${block.activity_name}: ${block.minutes} min (${block.duration.toFixed(1)}h)`}
                                whileHover={{ y: -4, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                              >
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-white text-xs font-medium truncate px-2">
                                    {block.activity_name}
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                      <div className="flex text-xs text-gray-500 justify-between px-1">
                        <span>0h</span>
                        <span>6h</span>
                        <span>12h</span>
                        <span>18h</span>
                        <span>24h</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category/Activity Breakdown */}
          <motion.div
            className="space-y-3 pt-4 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              {summary.is_complete && showAnalytics ? "Category Breakdown" : "Activity Breakdown"}
            </h3>
            <div className="space-y-2">
              {summary.is_complete && showAnalytics
                ? Object.entries(categoryData).map(([category, data]: [string, any], index) => {
                    const percentage = (data.value / 1440) * 100;
                    const hours = (data.value / 60).toFixed(1);
                    const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
                    return (
                      <motion.div
                        key={category}
                        className="space-y-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                      >
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-gray-700">{category}</span>
                          <span className="text-gray-500">
                            {data.value} min ({hours}h) • {data.count} {data.count === 1 ? "activity" : "activities"}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full"
                            style={{ backgroundColor: color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.7 + index * 0.05 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })
                : summary.activities.map((activity, index) => {
                    const percentage = (activity.minutes / 1440) * 100;
                    const hours = (activity.minutes / 60).toFixed(1);
                    const color = activity.category
                      ? CATEGORY_COLORS[activity.category]
                      : COLORS[index % COLORS.length];
                    return (
                      <motion.div
                        key={activity.id}
                        className="space-y-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                      >
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-gray-700">{activity.activity_name}</span>
                          <span className="text-gray-500">
                            {activity.minutes} min ({hours}h)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full"
                            style={{ backgroundColor: color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.7 + index * 0.05 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
    pink: "bg-pink-100 text-pink-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <motion.div
      className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2 cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring" }}
      whileHover={{ scale: 1.05, backgroundColor: "rgb(249 250 251)" }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm sm:text-lg font-bold text-gray-900 truncate" title={value}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}
