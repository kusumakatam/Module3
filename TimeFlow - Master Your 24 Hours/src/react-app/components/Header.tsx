import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { LogOut, Clock, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.header
      className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
            <div>
              <motion.h1
                className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                style={{ backgroundSize: "200% 100%" }}
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                TimeFlow
              </motion.h1>
              <p className="text-xs text-gray-500 hidden sm:block">Master your 24 hours</p>
            </div>
          </motion.div>

          {/* User menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors group"
              whileHover={{ backgroundColor: "rgb(249 250 251)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </motion.div>
              <span className="text-sm sm:text-base font-medium text-gray-700 hidden sm:block max-w-[150px] truncate">
                {user?.email}
              </span>
              <motion.div
                animate={{ rotate: showMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <p className="text-xs text-gray-500 mb-1">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors group"
                    whileHover={{ backgroundColor: "rgb(249 250 251)", x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                    </motion.div>
                    <span className="text-sm font-medium text-gray-700">Sign out</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.header>
  );
}
