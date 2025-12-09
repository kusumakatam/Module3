import { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, Edit2, X, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id: number;
  activity_name: string;
  minutes: number;
  activity_date: string;
  category: string | null;
}

interface ActivityLoggerProps {
  selectedDate: string;
  onActivityAdded: () => void;
  refreshKey: number;
}

const CATEGORIES = [
  "Work",
  "Study",
  "Sleep",
  "Exercise",
  "Entertainment",
  "Meals",
  "Commute",
  "Household",
  "Social",
  "Other",
];

export default function ActivityLogger({ selectedDate, onActivityAdded, refreshKey }: ActivityLoggerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityName, setActivityName] = useState("");
  const [minutes, setMinutes] = useState("");
  const [category, setCategory] = useState("");
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ activity_name: "", minutes: "", category: "" });

  useEffect(() => {
    fetchActivities();
  }, [selectedDate, refreshKey]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activities?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
        const total = data.reduce((sum: number, activity: Activity) => sum + activity.minutes, 0);
        setTotalMinutes(total);
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_name: activityName,
          minutes: parseInt(minutes),
          activity_date: selectedDate,
          category: category || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to add activity");
        setLoading(false);
        return;
      }

      setActivityName("");
      setMinutes("");
      setCategory("");
      fetchActivities();
      onActivityAdded();
    } catch (err) {
      setError("Failed to add activity");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setEditForm({
      activity_name: activity.activity_name,
      minutes: activity.minutes.toString(),
      category: activity.category || "",
    });
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_name: editForm.activity_name,
          minutes: parseInt(editForm.minutes),
          category: editForm.category || null,
        }),
      });

      if (response.ok) {
        setEditingId(null);
        fetchActivities();
        onActivityAdded();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update activity");
      }
    } catch (err) {
      console.error("Failed to update activity:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchActivities();
        onActivityAdded();
      }
    } catch (err) {
      console.error("Failed to delete activity:", err);
    }
  };

  const remainingMinutes = 1440 - totalMinutes;
  const progressPercentage = (totalMinutes / 1440) * 100;
  const isComplete = totalMinutes === 1440;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Log Activities</h2>
        <p className="text-xs sm:text-sm text-gray-600">Add activities and their duration in minutes</p>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Daily Progress</span>
          <motion.span
            className={`font-semibold ${isComplete ? "text-green-600" : "text-indigo-600"}`}
            animate={isComplete ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {totalMinutes} / 1440 min
          </motion.span>
        </div>
        <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              isComplete
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-indigo-500 to-purple-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {isComplete && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">
            {remainingMinutes > 0 ? `${remainingMinutes} minutes remaining` : "Day complete!"}
          </p>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-green-600" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Add Activity Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <motion.div whileFocus={{ scale: 1.01 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Name</label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="e.g., Morning workout"
              required
              className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.01 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        <motion.div whileFocus={{ scale: 1.01 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="e.g., 60"
            min="1"
            max={remainingMinutes}
            required
            className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={loading || totalMinutes >= 1440}
          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md relative overflow-hidden group"
          whileHover={!loading && totalMinutes < 1440 ? { scale: 1.02, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" } : {}}
          whileTap={!loading && totalMinutes < 1440 ? { scale: 0.98 } : {}}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10 flex items-center gap-2">
            <motion.div
              animate={loading ? { rotate: 360 } : {}}
              transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
            {loading ? "Adding..." : "Add Activity"}
          </span>
        </motion.button>
      </motion.form>

      {/* Activities List */}
      <AnimatePresence>
        {activities.length > 0 && (
          <motion.div
            className="space-y-3 pt-4 border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Today's Activities</h3>
            <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    layout
                  >
                    {editingId === activity.id ? (
                      <motion.div
                        className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <input
                          type="text"
                          value={editForm.activity_name}
                          onChange={(e) => setEditForm({ ...editForm, activity_name: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">No category</option>
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={editForm.minutes}
                            onChange={(e) => setEditForm({ ...editForm, minutes: e.target.value })}
                            min="1"
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleUpdate(activity.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Check className="w-4 h-4" />
                            Save
                          </motion.button>
                          <motion.button
                            onClick={() => setEditingId(null)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group cursor-pointer"
                        whileHover={{ backgroundColor: "rgb(243 244 246)", x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{activity.activity_name}</p>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                            <span>{activity.minutes} minutes</span>
                            {activity.category && (
                              <>
                                <span>•</span>
                                <motion.span
                                  className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {activity.category}
                                </motion.span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 ml-2">
                          <motion.button
                            onClick={() => handleEdit(activity)}
                            className="p-1.5 sm:p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(activity.id)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            whileHover={{ scale: 1.1, rotate: -15 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
