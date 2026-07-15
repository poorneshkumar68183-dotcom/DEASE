import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ExploreView } from "./components/ExploreView";
import { BookingFlowView } from "./components/BookingFlowView";
import { ProfileView } from "./components/ProfileView";
import { AdminDashboardView } from "./components/AdminDashboardView";
import { LoginModal } from "./components/LoginModal";
import { Compass, CalendarDays, User, ShieldAlert, Bell, MapPin, Sparkles, LogIn } from "lucide-react";

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("Explore");
  const [selectedTempleId, setSelectedTempleId] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSelectTemple = (templeId) => {
    setSelectedTempleId(templeId);
    setActiveTab("Bookings");
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "Explore":
        return <ExploreView onSelectTemple={handleSelectTemple} onSelectTab={setActiveTab} />;
      case "Bookings":
        return (
          <BookingFlowView 
            selectedTempleId={selectedTempleId} 
            onBackToExplore={() => setActiveTab("Explore")}
            onLoginRequest={() => setIsLoginModalOpen(true)}
          />
        );
      case "Profile":
        return (
          <ProfileView 
            onLoginRequest={() => setIsLoginModalOpen(true)} 
            onSelectTemple={handleSelectTemple}
          />
        );
      case "Admin":
        if (user && (user.role === "ADMIN" || user.role === "ORGANIZER")) {
          return <AdminDashboardView />;
        } else {
          return (
            <div className="max-w-md mx-auto text-center p-8 bg-white border border-outline-variant/20 rounded-2xl shadow-lg space-y-6 my-12 animate-in fade-in duration-200">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600 border border-red-200">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-headline-md text-xl text-on-surface">Administrator Dashboard</h3>
                <p className="text-xs text-on-surface-variant/80 mt-2 leading-relaxed">
                  Only authorized Temple Administrators and Seva Organizers are permitted to modify slot capacities or approve manual rituals.
                </p>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full py-3 bg-deep-saffron hover:bg-primary text-white font-bold rounded-lg text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Sign In as Shastri Ji (Admin)
              </button>
            </div>
          );
        }
      default:
        return <ExploreView onSelectTemple={handleSelectTemple} onSelectTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans pb-24 md:pb-8">
      {/* TopAppBar Header */}
      <header className="sticky top-0 left-0 w-full z-40 bg-white border-b border-ritual-gold/10 shadow-[0_2px_10px_0_rgba(26,32,44,0.03)] h-16 px-5 flex justify-between items-center">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setActiveTab("Explore"); setSelectedTempleId(null); }}>
          <span className="text-deep-saffron text-2xl font-bold">🔱</span>
          <h1 className="font-headline-md text-lg md:text-xl text-deep-saffron font-bold tracking-tight">
            Darshan Ease
          </h1>
        </div>

        {/* Action icons / indicators */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-sandalwood-cream/50 rounded-full text-on-surface-variant transition-colors">
            <Bell className="w-5 h-5 text-on-surface-variant/85" />
          </button>
          
          {user ? (
            <div 
              onClick={() => setActiveTab("Profile")}
              className="flex items-center gap-2.5 pl-3 border-l border-outline-variant/20 cursor-pointer hover:opacity-90"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmmAz1vxpQoV9uay0m78hHi1S0qm7r6-CuqbA08OeDiCujvUB4KKzbf82EjPtsMBY5uIdXiHXkZ8LerSqEhdtdyv-k4FzcoKFhmHeCRqAqxeMoOTQSqD6uFqrZDZ9ZWVt8encTMqUCV2T50Gclzr1ay2JzddhxVAACuhPGciVKI4DfPKtuYX7RzeHqXz4W7vBh4RjMjZabomYsRY8AT2EVOZ9BYAP9ram7EEaJ1FKCSmGFgJS0DqNQ8wD83QkW7DlOPyKp3JWZePs" 
                alt="Profile Avatar" 
                className="w-8 h-8 rounded-full border border-ritual-gold object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-on-surface leading-none">{user.name}</p>
                <p className="text-[9px] text-on-surface-variant leading-none mt-1">{user.role}</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 bg-deep-saffron/10 hover:bg-deep-saffron text-deep-saffron hover:text-white border border-deep-saffron/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 pt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <span className="text-3xl animate-bounce">✨</span>
            <p className="text-xs text-on-surface-variant font-semibold mt-2">Connecting with Seva trust lines...</p>
          </div>
        ) : (
          renderActiveView()
        )}
      </main>

      {/* Bottom Sticky Navigation Bar (Mobile-first, hidden on md+) */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-sandalwood-cream border-t border-ritual-gold/20 shadow-[0_-4px_12px_0_rgba(26,32,44,0.04)] rounded-t-xl h-16 flex items-center justify-around md:hidden px-2">
        <button 
          onClick={() => { setActiveTab("Explore"); setSelectedTempleId(null); }}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-colors ${
            activeTab === "Explore" ? "text-deep-saffron font-bold" : "text-on-surface-variant"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Explore</span>
        </button>

        <button 
          onClick={() => { setActiveTab("Bookings"); }}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-colors ${
            activeTab === "Bookings" ? "text-deep-saffron font-bold" : "text-on-surface-variant"
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Bookings</span>
        </button>

        <button 
          onClick={() => { setActiveTab("Profile"); }}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-colors ${
            activeTab === "Profile" ? "text-deep-saffron font-bold" : "text-on-surface-variant"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>

        <button 
          onClick={() => { setActiveTab("Admin"); }}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-colors ${
            activeTab === "Admin" ? "text-deep-saffron font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="text-lg">👑</span>
          <span className="text-[10px] font-semibold">Admin</span>
        </button>
      </nav>

      {/* Desktop Quick Sidebar / Top Navigation Supplement */}
      <div className="hidden md:flex fixed top-0 left-1/2 -translate-x-1/2 h-16 items-center gap-8 z-50">
        <button 
          onClick={() => { setActiveTab("Explore"); setSelectedTempleId(null); }}
          className={`text-xs font-bold transition-all uppercase tracking-wider ${
            activeTab === "Explore" ? "text-deep-saffron" : "text-on-surface-variant hover:text-deep-saffron"
          }`}
        >
          Explore
        </button>
        <button 
          onClick={() => setActiveTab("Bookings")}
          className={`text-xs font-bold transition-all uppercase tracking-wider ${
            activeTab === "Bookings" ? "text-deep-saffron" : "text-on-surface-variant hover:text-deep-saffron"
          }`}
        >
          Bookings
        </button>
        <button 
          onClick={() => setActiveTab("Profile")}
          className={`text-xs font-bold transition-all uppercase tracking-wider ${
            activeTab === "Profile" ? "text-deep-saffron" : "text-on-surface-variant hover:text-deep-saffron"
          }`}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab("Admin")}
          className={`text-xs font-bold transition-all uppercase tracking-wider ${
            activeTab === "Admin" ? "text-deep-saffron" : "text-on-surface-variant hover:text-deep-saffron"
          }`}
        >
          Admin Portal
        </button>
      </div>

      {/* Login / Register Overlay Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
