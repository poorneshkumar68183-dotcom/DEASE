import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, MapPin, Calendar, Clock, Ticket, Sparkles, LogOut, ChevronDown, RefreshCw, XCircle } from "lucide-react";
import { Badge, Spinner } from "react-bootstrap";

export const ProfileView = ({ onLoginRequest, onSelectTemple }) => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserHistory = async () => {
    setLoading(true);
    try {
      const bRes = await axios.get("/api/bookings");
      setBookings(bRes.data);

      const dRes = await axios.get("/api/donations");
      setDonations(dRes.data);
    } catch (err) {
      console.error("Error fetching user history", err);
    } finally {
      setLoading(false);
    }
  };

 const handleCancelBooking = async (bookingId) => {
  if (window.confirm("Are you sure you want to cancel this booking?")) {
    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);

      alert("Booking cancelled successfully.");
      fetchUserHistory();
    } catch (err) {
      console.error("Error cancelling booking", err);
    }
  }
};

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl border border-outline-variant/20 shadow-lg space-y-6 my-12 animate-in fade-in duration-200">
        <div className="w-16 h-16 bg-sandalwood-cream rounded-full flex items-center justify-center mx-auto text-deep-saffron border border-ritual-gold/25">
          <Ticket className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-headline-md text-xl text-on-surface">Access Pilgrim Cabinet</h3>
          <p className="text-xs text-on-surface-variant/80 mt-2 leading-relaxed">
            Please log in to view your verified pilgrim pass, secure active time-slot tickets, and check donation histories.
          </p>
        </div>
        <button
          onClick={onLoginRequest}
          className="w-full py-3 bg-deep-saffron hover:bg-primary text-white font-bold rounded-lg text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* User Profile Header banner */}
      <section className="relative bg-white rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(26,32,44,0.03)] border-l-4 border-deep-saffron flex flex-col md:flex-row md:items-center justify-between overflow-hidden gap-6">
        <div className="flex items-center gap-4 z-10">
          <div className="relative">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmmAz1vxpQoV9uay0m78hHi1S0qm7r6-CuqbA08OeDiCujvUB4KKzbf82EjPtsMBY5uIdXiHXkZ8LerSqEhdtdyv-k4FzcoKFhmHeCRqAqxeMoOTQSqD6uFqrZDZ9ZWVt8encTMqUCV2T50Gclzr1ay2JzddhxVAACuhPGciVKI4DfPKtuYX7RzeHqXz4W7vBh4RjMjZabomYsRY8AT2EVOZ9BYAP9ram7EEaJ1FKCSmGFgJS0DqNQ8wD83QkW7DlOPyKp3JWZePs" 
              alt="Pilgrim Headshot" 
              className="w-16 h-16 rounded-full object-cover border-2 border-ritual-gold"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 bg-deep-saffron text-white rounded-full p-0.5 flex items-center justify-center border-2 border-white">
              <ShieldCheck className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
          <div>
            <h2 className="font-headline-md text-xl md:text-2xl text-on-surface leading-tight">{user.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="font-bold text-[10px] text-deep-saffron bg-deep-saffron/10 px-2 py-0.5 rounded uppercase tracking-wider">
                Verified Pilgrim
              </span>
              <span className="text-on-surface-variant/80 text-xs flex items-center gap-0.5">
                <MapPin className="w-3.5 h-3.5 text-deep-saffron" />
                {user.location}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col items-start md:items-end justify-between border-t md:border-t-0 border-outline-variant/10 pt-4 md:pt-0 z-10">
          <div>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Devotion Level</span>
            <span className="font-bold text-sm text-ritual-gold flex items-center gap-1 mt-0.5">
              👑 {user.devotionLevel} Member
            </span>
          </div>
          <button 
            onClick={logout}
            className="md:mt-3 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Decorative floral watermark background */}
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
          <Sparkles className="w-48 h-48 text-deep-saffron" />
        </div>
      </section>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Active Bookings list (Col Span 2) */}
        <div className="lg:col-span-2 space-y-5">
          <h3 className="font-headline-md text-lg md:text-xl text-on-surface">Upcoming Reserved Passages</h3>

          {loading ? (
            <div className="p-8 text-center bg-white border border-outline-variant/15 rounded-xl">
              <Spinner animation="border" variant="warning" className="mb-2" />
              <p className="text-xs text-on-surface-variant">Syncing with temple trust registers...</p>
            </div>
          ) :bookings.filter(
  b =>
    b.status === "BOOKED" ||
    b.status === "PENDING" ||
    b.status === "REJECTED"
).length === 0? (
            <div className="p-8 text-center bg-white border border-outline-variant/15 rounded-xl space-y-4">
              <Ticket className="w-12 h-12 text-on-surface-variant/30 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-on-surface">No active bookings found</p>
                <p className="text-xs text-on-surface-variant/80 max-w-sm mx-auto">
                  Reserve standard darshan, VIP special pujas or Dharamshala accommodations.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.filter(
  b => b.status === "BOOKED" || b.status === "PENDING"||
    b.status === "REJECTED"
).map((booking) => (
                <div 
                  key={booking._id}
                  className="bg-white rounded-xl p-5 border border-ritual-gold/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-headline-md text-base text-on-surface leading-tight">{booking.temple?.name}</h4>
                        <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold mt-0.5">
                         {booking.notes}
                        </p>
                      </div>
                      <Badge bg={booking.status === "BOOKED"
  ? "success"
  : booking.status === "PENDING"
  ? "warning"
  : booking.status === "REJECTED"
  ? "error"
  : "error"} className="text-[10px] font-bold px-2.5 py-1 text-white uppercase tracking-wider">
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs border-t border-outline-variant/10 pt-3">
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <Calendar className="w-3.5 h-3.5 text-deep-saffron" />
                        <span>Date: <strong className="text-on-surface font-semibold">{new Date(booking.bookingDate).toLocaleDateString()}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <Clock className="w-3.5 h-3.5 text-deep-saffron" />
                        <span>Time: <strong className="text-on-surface font-semibold">{booking.slot?.slotTime}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <Ticket className="w-3.5 h-3.5 text-deep-saffron" />
                        <span>Pilgrims: <strong className="text-on-surface font-semibold">{booking.numberOfPersons}</strong></span>
                      </div>
                    </div>
                  </div>

                 <div className="mt-5 pt-3 border-t border-outline-variant/10 flex items-center gap-2">
{booking.status === "BOOKED" ? (
  <button
    onClick={() => setShowQRModal(booking)}
    className="flex-1 py-2 bg-sandalwood-cream hover:bg-ritual-gold/10 text-deep-saffron border border-ritual-gold/20 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
  >
    🎫 View Entry Ticket QR
  </button>
) : booking.status === "PENDING" ? (
  <button
    onClick={() => handleCancelBooking(booking._id)}
    className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
  >
    Request Cancel
  </button>
) : booking.status === "REJECTED" ? (
  <button
    disabled
    className="flex-1 py-2 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg cursor-not-allowed"
  >
    ❌ Request Rejected
  </button>
) : (
  <button
    disabled
    className="flex-1 py-2 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg cursor-not-allowed"
  >
    Booking Cancelled
  </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Devotional History Collapsible Past Bookings Panel */}
          <div className="space-y-3 pt-4">
            <h4 className="font-headline-md text-base text-on-surface">Devotional Passage History</h4>
            <div className="bg-white rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <details className="group" defaultOpen={true}>
                <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-sandalwood-cream/20 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                    <span>📚</span> Completed Past Year Journeys
                  </div>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant group-open:rotate-180 transition-transform" />
                </summary>
                
                <div className="px-4 pb-4 divide-y divide-outline-variant/10 text-xs">
                  <div className="py-3.5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-sandalwood-cream rounded-full flex items-center justify-center text-ritual-gold font-bold">
                        📿
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">Jagannath Puri - Mahaprasad</p>
                        <p className="text-[10px] text-on-surface-variant/80">Sept 12, 2023 • Status: Completed</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onSelectTemple("temple._id")}
                      className="text-xs text-deep-saffron hover:underline font-bold"
                    >
                      Rebook
                    </button>
                  </div>

                  <div className="py-3.5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-sandalwood-cream rounded-full flex items-center justify-center text-ritual-gold font-bold">
                        📿
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">Tirupati Balaji - Special Entry</p>
                        <p className="text-[10px] text-on-surface-variant/80">Aug 05, 2023 • Status: Completed</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onSelectTemple("temple_meenakshi")}
                      className="text-xs text-deep-saffron hover:underline font-bold"
                    >
                      Rebook
                    </button>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Donations Logs & Seva Helpline */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-outline-variant/20 shadow-sm p-5 space-y-4">
            <h3 className="font-headline-md text-base text-on-surface flex items-center gap-1.5">
              <span>💖</span> Your Seva Donations
            </h3>
            
            {donations.length === 0 ? (
              <p className="text-xs text-on-surface-variant/85 py-2 leading-relaxed">
                You haven't made any donations yet. Contributions are fully exempt under Section 80G of Income Tax.
              </p>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {donations.map((d) => (
                  <div key={d._id} className="p-3 bg-sandalwood-cream/40 rounded-lg border border-ritual-gold/10 space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-on-surface">{d.type}</span>
                      <span className="text-deep-saffron">₹{d.amount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-on-surface-variant">
                      <span>{d.temple?.name}</span>
                      <span className="capitalize">{d.paymentStatus}</span>
                    </div>
                    <Badge
  bg={
    d.paymentStatus === "SUCCESS"
      ? "success"
      : d.paymentStatus === "FAILED"
      ? "error"
      : "warning"
  }
>
  {d.paymentStatus}
</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-sandalwood-cream rounded-xl p-5 border border-ritual-gold/25 space-y-4 text-center">
            <div className="w-10 h-10 bg-white p-2 rounded-full shadow-sm text-deep-saffron flex items-center justify-center mx-auto">
              💡
            </div>
            <div className="space-y-1">
              <h4 className="font-headline-md text-base text-on-surface font-semibold">Pilgrim Helpline</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Our support sevaks are available 24/7 to solve your booking issues or priority access queries.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a 
                href="mailto:support@darshanease.org"
                className="py-2 bg-white border border-ritual-gold/25 text-on-surface rounded-lg font-bold hover:bg-surface-container-low transition-colors"
              >
                Email Seva
              </a>
              <a 
                href="tel:+911800100200"
                className="py-2 bg-deep-saffron text-white rounded-lg font-bold hover:bg-primary transition-colors flex items-center justify-center gap-1"
              >
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Pass overlay/modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl border border-ritual-gold/20 animate-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-deep-saffron to-primary px-5 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Ticket className="w-5 h-5" />
                <span className="font-bold text-xs tracking-wider uppercase">Active Temple Pass</span>
              </div>
              <button 
                onClick={() => setShowQRModal(null)}
                className="text-white hover:text-white/80 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="space-y-0.5">
                <h4 className="font-headline-md text-lg text-on-surface leading-tight">{showQRModal.temple?.name}</h4>
                <p className="text-[10px] text-deep-saffron uppercase font-bold tracking-wider">{showQRModal.notes}</p>
              </div>

              <div className="p-3 bg-white border border-ritual-gold/20 rounded-xl shadow-md inline-block">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4_KWHebuaFAUtA0NWNUYGwm7VTsyVual0JbJLY2oM7PV0xMijzwWzxxWbfIKQc1tfVnm3z0bP0dtaeGCvgDP26X2e6QjnvD-zVWfllx8richMOjmlSfEiPkkvej6bWcBfkhNAZJTKW-QSNh_d8Uxca7rGHWEHaGPCD9V8QidinHvFf2_gbHISfExor8kedR4e__366KhTIkRXvFpO8YBgSqQSnu-soYMSYeTD7kiNNe6CngqcjyMjBRXaWmMlaJCUdriXZMBM0vw" 
                  alt="QR Ticket Code" 
                  className="w-40 h-40 opacity-95 mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="bg-sandalwood-cream/50 p-3.5 rounded-lg border border-ritual-gold/10 space-y-1.5 text-[11px] text-left">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Scheduled Date</span>
                  <strong className="text-on-surface">{new Date(showQRModal.bookingDate).toLocaleDateString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Entry Slot</span>
                  <strong className="text-on-surface">{showQRModal.slot?.slotTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Registered Devotees</span>
                  <strong className="text-on-surface">{showQRModal.numberOfPersons} Person(s)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Pass Reference</span>
                  <strong className="text-on-surface font-mono">{showQRModal._id.toUpperCase()}</strong>
                </div>
              </div>

              <p className="text-[9px] text-on-surface-variant/70 leading-relaxed max-w-xs mx-auto">
                ⚠️ Secure trust token: Please report to the gate entry turnstiles at least 15 minutes before the time slot.
              </p>
            </div>
            
            <div className="bg-sandalwood-cream/40 px-5 py-3.5 border-t border-outline-variant/10 text-center">
              <button 
                onClick={() => setShowQRModal(null)}
                className="px-6 py-2 bg-deep-saffron text-white font-bold text-xs rounded-lg hover:bg-primary shadow-sm cursor-pointer"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
