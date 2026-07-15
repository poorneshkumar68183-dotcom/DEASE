import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, LogIn, UserPlus } from "lucide-react";

export const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("USER");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password, role, location || "Varanasi, UP");
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (type) => {
    setError(null);
    setLoading(true);
    try {
      if (type === "user") {
        await login("aravind@gmail.com", "aravind");
      } else if (type === "admin") {
        await login("admin@gmail.com", "admin");
      } else if (type === "organizer") {
        await login("organizer@gmail.com", "organizer");
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Quick login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
     <div className="relative w-full max-w-md max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-ritual-gold/20 animate-in fade-in zoom-in duration-200 flex flex-col">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-deep-saffron to-primary px-6 py-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white hover:bg-orange-50 text-deep-saffron shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-white/15 rounded-lg text-white">✨</span>
            <h3 className="font-headline-md text-xl font-bold">Darshan Ease</h3>
          </div>
          <p className="text-white/80 text-sm font-light">
            {isRegister ? "Join as a verified pilgrim on your spiritual path." : "Sign in to access secure bookings and temple darshans."}
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3 bg-sandalwood-cream/40 border border-outline-variant/30 rounded-lg text-sm focus:outline-none focus:border-deep-saffron"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full h-11 px-3 bg-sandalwood-cream/40 border border-outline-variant/30 rounded-lg text-sm focus:outline-none focus:border-deep-saffron"
                    >
                      <option value="USER">Pilgrim (USER)</option>
                      <option value="ORGANIZER">Organizer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">City/State</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-11 px-3 bg-sandalwood-cream/40 border border-outline-variant/30 rounded-lg text-sm focus:outline-none focus:border-deep-saffron"
                      placeholder="e.g. Varanasi, UP"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 bg-sandalwood-cream/40 border border-outline-variant/30 rounded-lg text-sm focus:outline-none focus:border-deep-saffron"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 bg-sandalwood-cream/40 border border-outline-variant/30 rounded-lg text-sm focus:outline-none focus:border-deep-saffron"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-deep-saffron hover:bg-primary text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 duration-100 mt-2"
            >
              {loading ? "Authenticating..." : isRegister ? "Create Pilgrim Account" : "Secure Sign In"}
            </button>
          </form>

          {/* Toggle register / login */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-deep-saffron hover:underline font-medium"
            >
              {isRegister ? "Already have an account? Sign In" : "New to Darshan Ease? Create Account"}
            </button>
          </div>

          {/* Quick tester login buttons */}
          <div className="mt-6 pt-6 border-t border-outline-variant/20">
            <p className="text-center text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold mb-3">
              Developer Quick Login Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin("user")}
                className="py-2 text-[11px] bg-sandalwood-cream/60 hover:bg-sandalwood-cream text-on-surface border border-ritual-gold/15 rounded-lg transition-all font-semibold"
              >
                👤 Pilgrim
              </button>
              <button
                onClick={() => handleQuickLogin("admin")}
                className="py-2 text-[11px] bg-red-50 hover:bg-red-100 text-secondary border border-secondary/15 rounded-lg transition-all font-semibold"
              >
                👑 Admin
              </button>
              <button
                onClick={() => handleQuickLogin("organizer")}
                className="py-2 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-800/15 rounded-lg transition-all font-semibold"
              >
                💼 Organizer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
