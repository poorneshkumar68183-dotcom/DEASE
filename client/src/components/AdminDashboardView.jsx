import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ToggleLeft, ToggleRight, CheckCircle, AlertCircle, RefreshCw, TrendingUp } from "lucide-react";

export const AdminDashboardView = () => {
  const { user } = useAuth();
  
  const [temples, setTemples] = useState([]);
  const [selectedTempleId, setSelectedTempleId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [slotLimits, setSlotLimits] = useState({});
  const [slotActives, setSlotActives] = useState({});
  useEffect(() => {
  fetchAdminData();
}, []);
useEffect(() => {
  if (selectedTempleId) {
    fetchSlots(selectedTempleId);
  }
}, [selectedTempleId]);
 
  const fetchAdminData = async () => {
    setLoading(true);
    try {
const response = await axios.get("/api/temples");

setTemples(response.data);

let templeId = null;

if (response.data.length > 0) {
  templeId = response.data[0]._id;
  setSelectedTempleId(templeId);
}

const slotsRes = await axios.get(`/api/temples/${templeId}/slots`);

const fetchedSlots = slotsRes.data;

setSlots(fetchedSlots);
      const limits = {};
      const actives = {};
      fetchedSlots.forEach((s) => {
        limits[s._id] = s.limit;
        actives[s._id] = s.status !== "Closed";
      });
      setSlotLimits(limits);
      setSlotActives(actives);

      const bookingsRes = await axios.get("/api/bookings");
      setBookings(bookingsRes.data);

      const donationsRes = await axios.get("/api/donations");
      setDonations(donationsRes.data);
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setLoading(false);
    }
  };
const fetchSlots = async (templeId) => {
  try {
    const slotsRes = await axios.get(`/api/temples/${templeId}/slots`);

    const fetchedSlots = slotsRes.data;

    setSlots(fetchedSlots);

    const limits = {};
    const actives = {};

    fetchedSlots.forEach((s) => {
      limits[s._id] = s.limit;
      actives[s._id] = s.isActive;
    });

    setSlotLimits(limits);
    setSlotActives(actives);
  } catch (err) {
    console.error(err);
  }
};
  const handleUpdateSlot = async (slotId) => {
    const limit = slotLimits[slotId];
    const active = slotActives[slotId];
    
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await axios.put(`/api/slots/${slotId}`, { limit, active });
      setSuccessMessage(`Slot parameters updated successfully to ${limit} pilgrims!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      
      setSlots(prev => prev.map(s => s._id === slotId ? response.data : s));
    } catch (err) {
      setErrorMessage("Failed to update slot settings.");
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status: "Approved" });
      setSuccessMessage("Special Puja request APPROVED successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchAdminData();
    } catch (err) {
      setErrorMessage("Failed to approve request.");
    }
  };

  const handleDeclineBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status: "Declined" });
      setSuccessMessage("Special Puja request DECLINED.");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchAdminData();
    } catch (err) {
      setErrorMessage("Failed to decline request.");
    }
  };

  const handleApproveDonation = async (donationId) => {
    try {
      await axios.put(`/api/donations/${donationId}/status`, { status: "SUCCESS" });
      setSuccessMessage("Seva donation transaction APPROVED!");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchAdminData();
    } catch (err) {
      setErrorMessage("Failed to approve donation.");
    }
  };

  const handleDeclineDonation = async (donationId) => {
    try {
      await axios.put(`/api/donations/${donationId}/status`, { status: "FAILED" });
      setSuccessMessage("Donation transaction marked declined.");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchAdminData();
    } catch (err) {
      setErrorMessage("Failed to decline donation.");
    }
  };

  const getTodayBookingsCount = () => {
    const baseCount = 1284;
    const addedBookingsCount = bookings.length;
    return baseCount + addedBookingsCount;
  };

  const getCapacityStatusPercentage = () => {
    return 82;
  };

  const getTotalRevenueToday = () => {
    let baseRevenue = 42500;
    
   const approvedBookingsAmount = bookings
  .filter(b => b.status === "BOOKED")
  .reduce((sum, b) => sum + b.totalAmount, 0);

    const approvedDonationsAmount = donations
      .filter(d => d.status === "SUCCESS")
      .reduce((sum, d) => sum + d.amount, 0);

    return baseRevenue + approvedBookingsAmount + approvedDonationsAmount;
  };

  const handleReportsClick = () => {
    alert("Generating PDF Darshan Report for July 24th... 🖨️");
  };

  const pendingBookings = bookings.filter(b => b.status === "PENDING");
  const pendingDonations = donations.filter(
  d => d.paymentStatus === "PENDING"
);
  const totalPendingRequests = pendingBookings.length + pendingDonations.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-12">
      {/* Top Welcome Section */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-2xl md:text-3xl text-on-surface">Admin Dashboard</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Managing holy services for {temples.find(t => t._id === selectedTempleId)?.name || "Kashi Vishwanath Temple"}
          </p>
        </div>
        
        {/* Temple selection for Admin */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-outline-variant/30 shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant">Active Temple:</span>
          <select 
            value={selectedTempleId}
            onChange={(e) => setSelectedTempleId(e.target.value)}
            className="text-xs bg-transparent border-none focus:ring-0 font-bold text-deep-saffron"
          >
            {temples.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Notifications banner */}
      {successMessage && (
        <div className="p-3 bg-green-50 text-green-800 text-xs rounded-xl border border-green-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Bento-style Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Bookings card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-ritual-gold hover:scale-[1.01] transition-transform flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-deep-saffron/10 rounded-lg text-deep-saffron text-lg">
              📅
            </div>
            <span className="text-[10px] font-bold text-sacred-vermilion bg-sacred-vermilion/10 px-2.5 py-1 rounded-full">
              +12% vs yesterday
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-widest">Today's Bookings</h3>
            <p className="font-headline-xl text-3xl font-bold text-on-surface mt-1">
              {getTodayBookingsCount().toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Capacity Status progress bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-deep-saffron hover:scale-[1.01] transition-transform flex flex-col justify-between">
          <div className="p-2.5 bg-amber-50 rounded-lg text-amber-800 text-lg self-start">
            👥
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-widest">Capacity Status</h3>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="font-bold text-on-surface">{getCapacityStatusPercentage()}% Occupied</span>
              <span className="text-on-surface-variant">Total Capacity: 5,000</span>
            </div>
            <div className="w-full bg-sandalwood-cream rounded-full h-2.5 border border-ritual-gold/10">
              <div 
                className="bg-deep-saffron h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${getCapacityStatusPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Revenue today */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-ritual-gold hover:scale-[1.01] transition-transform flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-green-50 rounded-lg text-green-700 text-lg">
              💸
            </div>
            <button 
              onClick={handleReportsClick}
              className="text-deep-saffron hover:underline text-[11px] font-bold flex items-center gap-1 bg-deep-saffron/10 px-2.5 py-1 rounded-full cursor-pointer"
            >
              📊 Reports
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-widest">Total Revenue Today</h3>
            <p className="font-headline-xl text-3xl font-bold text-on-surface mt-1">
              ₹{getTotalRevenueToday().toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Slot edit controls on left, Special Seva approval lists on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Slot Management (7 Cols) */}
        <section className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between bg-sandalwood-cream/20">
            <h3 className="font-headline-md text-lg text-on-surface font-semibold">Slot Parameters Management</h3>
            <span className="text-xs text-on-surface-variant/80 font-medium">July 22, 2026</span>
          </div>

          <div className="p-6 space-y-4">
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-6 h-6 text-deep-saffron animate-spin mx-auto mb-2" />
                <p className="text-xs text-on-surface-variant">Syncing with temple trust slots...</p>
              </div>
            ) : slots.length === 0 ? (
              <p className="text-xs text-on-surface-variant/80 text-center py-6">No slots registered for this shrine.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {slots.map((slot) => {
                  const isActive = slotActives[slot._id] !== false;
                  return (
                    <div 
                      key={slot._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-sandalwood-cream/30 border border-ritual-gold/15 rounded-xl gap-4 hover:border-deep-saffron/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-deep-saffron/10 flex flex-col items-center justify-center rounded-lg border border-deep-saffron/15 text-deep-saffron">
                          <span className="text-[10px] font-bold uppercase">{slot.period.substr(0, 2)}</span>
                          <span className="text-xs font-bold font-mono">{slot.slotTime.substr(0, 5)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-on-surface">{slot.name || "Darshan Slot"}</h4>
                          <p className="text-[11px] text-on-surface-variant/85">
                            Status: <strong className={isActive ? "text-green-700" : "text-red-600"}>{slot.status}</strong> 
                            &nbsp;• Booked: {slot.booked} pilgrims
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-on-surface-variant font-medium">Limit:</span>
                          <input 
                            type="number"
                            value={slotLimits[slot._id] || 0}
                            disabled={!isActive}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              setSlotLimits(prev => ({ ...prev, [slot._id]: val }));
                            }}
                            className="w-16 h-8 border border-outline-variant/30 rounded text-center text-xs focus:ring-0 focus:outline-none focus:border-deep-saffron disabled:opacity-50"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setSlotActives(prev => ({ ...prev, [slot._id]: !isActive }))}
                            className="text-deep-saffron cursor-pointer"
                          >
                            {isActive ? (
                              <ToggleRight className="w-9 h-9" />
                            ) : (
                              <ToggleLeft className="w-9 h-9 text-on-surface-variant/40" />
                            )}
                          </button>

                          <button 
                            onClick={() => handleUpdateSlot(slot._id)}
                            className="px-3 py-1.5 bg-deep-saffron hover:bg-primary text-white text-[11px] font-bold rounded shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Service Requests & Donations list */}
        <section className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between bg-sandalwood-cream/20">
            <div>
              <h3 className="font-headline-md text-lg text-on-surface font-semibold">Service Requests</h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Manual authorization required for Pujas &amp; Sevas</p>
            </div>
            {totalPendingRequests > 0 && (
              <span className="bg-sacred-vermilion text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full animate-bounce">
                {totalPendingRequests} NEW
              </span>
            )}
          </div>

          <div className="p-6 space-y-4 overflow-y-auto max-h-[500px]">
            {totalPendingRequests === 0 ? (
              <div className="p-8 text-center text-on-surface-variant/70 space-y-2">
                <p className="text-xl">🕉️</p>
                <p className="text-xs font-semibold">All service requests processed.</p>
                <p className="text-[11px] text-on-surface-variant/60">Temple queue is fully verified and aligned.</p>
              </div>
            ) : (
              <>
                {pendingBookings.map((b) => (
                  <div 
                    key={b._id}
                    className="p-4 border border-outline-variant/20 rounded-xl hover:bg-sandalwood-cream/10 transition-colors space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-on-surface text-sm leading-tight">{b.notes}</h5>
                        <p className="text-[11px] text-on-surface-variant mt-1">
                          By <strong className="text-on-surface font-semibold">{b.userName}</strong> • {b.numberOfPersons} Devotee(s)
                        </p>
                      </div>
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded uppercase tracking-wide">
                        {b.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-ritual-gold font-medium">
                      📅 {b.slotTime}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
                      <button 
                        onClick={() => handleDeclineBooking(b._id)}
                        className="py-2 text-sacred-vermilion bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleApproveBooking(b._id)}
                        className="py-2 bg-deep-saffron hover:bg-primary text-white rounded-lg transition-all cursor-pointer shadow-sm"
                      >
                        Approve Seva
                      </button>
                    </div>
                  </div>
                ))}

                {pendingDonations.map((d) => (
                  <div 
                    key={d._id}
                    className="p-4 border border-outline-variant/20 rounded-xl hover:bg-sandalwood-cream/10 transition-colors space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-on-surface text-sm leading-tight">{d.type}</h5>
                        <p className="text-[11px] text-on-surface-variant mt-1">
                        </p>
                        <p className="font-bold">
  {d.anonymous
    ? "🙏 Anonymous Devotee"
    : d.donorName}
</p>

<p className="text-sm text-gray-600">
  Temple: {d.temple?.name}
</p>

<p className="text-sm text-gray-600">
  Amount: ₹{d.amount}
</p>

<p className="text-sm text-gray-600">
  Message: {d.message || "No message"}
</p>
                      </div>
                      <span className="text-[9px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded uppercase tracking-wide">
                        Donation
                      </span>
                    </div>


                    <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant">
                      <span>Amount: <strong className="text-deep-saffron font-bold text-sm">₹{d.amount.toLocaleString("en-IN")}</strong></span>
                      <span className="text-ritual-gold">🕒 {d.date}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
                      <button 
                        onClick={() => handleDeclineDonation(d._id)}
                        className="py-2 text-sacred-vermilion bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleApproveDonation(d._id)}
                        className="py-2 bg-deep-saffron hover:bg-primary text-white rounded-lg transition-all cursor-pointer shadow-sm"
                      >
                        Approve Seva
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Visitor Trends */}
      <section className="pt-4">
        <h3 className="font-headline-md text-xl text-on-surface mb-5">Visitor &amp; Traffic Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-outline-variant/15 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-sandalwood-cream/40 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <span className="font-bold text-on-surface text-sm">Last 7 Days Traffic Insights</span>
              <div className="flex gap-4 text-[10px] font-bold text-on-surface-variant/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-deep-saffron"></div>
                  <span>Online Bookings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-ritual-gold"></div>
                  <span>On-site Devotees</span>
                </div>
              </div>
            </div>

            <div className="relative h-44 flex items-end justify-between px-4 pb-2 pt-6">
              <div className="flex flex-col items-center w-8">
                <div className="w-full bg-ritual-gold/30 rounded-t-lg h-14 transition-all duration-500 group-hover:h-16" />
                <div className="w-full bg-deep-saffron rounded-t-lg h-10 -mt-2" />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-full bg-ritual-gold/30 rounded-t-lg h-20 transition-all duration-500 group-hover:h-24" />
                <div className="w-full bg-deep-saffron rounded-t-lg h-16 -mt-2" />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-full bg-ritual-gold/30 rounded-t-lg h-16 transition-all duration-500 group-hover:h-12" />
                <div className="w-full bg-deep-saffron rounded-t-lg h-12 -mt-2" />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-full bg-ritual-gold/30 rounded-t-lg h-24 transition-all duration-500 group-hover:h-28" />
                <div className="w-full bg-deep-saffron rounded-t-lg h-20 -mt-2" />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-full bg-ritual-gold/30 rounded-t-lg h-20 transition-all duration-500 group-hover:h-22" />
                <div className="w-full bg-deep-saffron rounded-t-lg h-16 -mt-2" />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-full bg-ritual-gold/30 rounded-t-lg h-32 transition-all duration-500 group-hover:h-36" />
                <div className="w-full bg-deep-saffron rounded-t-lg h-28 -mt-2" />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-full bg-ritual-gold/30 rounded-t-lg h-36 transition-all duration-500 group-hover:h-40" />
                <div className="w-full bg-deep-saffron rounded-t-lg h-32 -mt-2" />
              </div>
            </div>

            <div className="flex justify-between px-4 mt-2 text-[10px] text-on-surface-variant font-bold">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-deep-saffron to-primary p-6 rounded-2xl flex flex-col justify-center items-center text-center text-white shadow-md relative">
            <div className="text-3xl mb-3">✨</div>
            <h4 className="font-headline-md text-base font-semibold">Peak Hour Insights</h4>
            <p className="text-xs opacity-90 mt-2 leading-relaxed">
              Standard darshan lines usually peak daily at <br/>
              <span className="text-2xl font-bold font-sans mt-1.5 block tracking-wide">06:00 AM</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
