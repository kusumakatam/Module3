import { useAuth } from "@getmocha/users-service/react";
import { Navigate } from "react-router";
import { Clock, BarChart3, TrendingUp, Zap, Shield, Sparkles } from "lucide-react";

export default function Login() {
  const { user, redirectToLogin } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-medium hover:bg-indigo-200 transition-colors">
                <Clock className="w-4 h-4" />
                <span>Time Tracking Made Simple</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Master Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  24 Hours
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">
                Track how you spend every minute of your day and unlock powerful insights about your time.
              </p>
            </div>

            <div className="space-y-4">
              <Feature icon={<Zap className="w-5 h-5" />} title="Quick & Easy" description="Log activities in seconds with our intuitive interface" />
              <Feature icon={<BarChart3 className="w-5 h-5" />} title="Visual Analytics" description="Beautiful charts and insights about your time usage" />
              <Feature icon={<TrendingUp className="w-5 h-5" />} title="Track Progress" description="Monitor your daily activities and build better habits" />
            </div>

            <button
              onClick={redirectToLogin}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg text-sm sm:text-base hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span className="flex items-center justify-center gap-2">
                Sign in with Google
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Right side - Visual */}
          <div className="relative mt-8 md:mt-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">TimeFlow</h3>
                    <p className="text-xs text-gray-500">Your time, visualized</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <DemoStat label="Activities Today" value="12" color="indigo" delay="0.3s" />
                  <DemoStat label="Time Logged" value="1,440 min" color="purple" delay="0.4s" />
                  <DemoStat label="Top Category" value="Work" color="pink" delay="0.5s" />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span>Secure authentication with Google</span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-2 -right-2 animate-spin-slow">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3 sm:gap-4 hover:translate-x-1 transition-transform duration-200">
      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function DemoStat({ label, value, color, delay }: { label: string; value: string; color: string; delay: string }) {
  const colors = {
    indigo: "from-indigo-500 to-indigo-600",
    purple: "from-purple-500 to-purple-600",
    pink: "from-pink-500 to-pink-600",
  };

  return (
    <div 
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <span className="text-xs sm:text-sm text-gray-600 font-medium">{label}</span>
      <span className={`text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r ${colors[color as keyof typeof colors]}`}>
        {value}
      </span>
    </div>
  );
}
