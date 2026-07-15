import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Calendar, Clock, Users, ArrowRight, CheckCircle2, Ticket, ShieldCheck, Accessibility, HelpCircle, ChevronRight, AlertCircle, RefreshCw, MapPin } from "lucide-react";
import { Spinner, Alert, Badge } from "react-bootstrap";

export const BookingFlowView = ({ 
  selectedTempleId, 
  onBackToExplore,
  onLoginRequest
}) => {
  const { user } = useAuth();
  
  const [temples, setTemples] = useState([]);
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [activeTab, setActiveTab] = useState("darshan");
  
  // Selection States
  const [selectedDate, setSelectedDate] = useState("JUL 22, 2026");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPuja, setSelectedPuja] = useState(null);
  const [visitorsCount, setVisitorsCount] = useState(2);
  
  // Flow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

const [showDonationModal, setShowDonationModal] = useState(false);
const [donationAmount, setDonationAmount] = useState(500);
const [paymentMethod, setPaymentMethod] = useState("UPI");
const [donationMessage, setDonationMessage] = useState("");
const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    fetchTemples();
  }, []);

  useEffect(() => {
    if (selectedTempleId) {
      fetchTempleDetails(selectedTempleId);
    } else if (temples.length > 0) {
      fetchTempleDetails(temples[0]._id);
    }
  }, [selectedTempleId, temples]);

  useEffect(() => {
  if (showDonationModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showDonationModal]);

  const fetchTemples = async () => {
  try {
    const response = await axios.get("/api/temples");
    setTemples(response.data);
  } catch (err) {
    console.error("Error fetching temples", err);
  }
};

  const fetchTempleDetails = async (id) => {
    try {
      const response = await axios.get(`/api/temples/${id}`);
      setSelectedTemple(response.data);
      setSelectedPuja(null);
      setSelectedSlot(null);
      setBookingSuccess(false);
      setConfirmedBooking(null);
      setErrorMessage(null);

      const slotResponse = await axios.get(`/api/temples/${id}/slots`);
      const fetchedSlots = slotResponse.data;
      setSlots(fetchedSlots);
      
      const firstAvail = fetchedSlots.find((s) => s.status !== "Full" && s.status !== "Closed");
      if (firstAvail) {
        setSelectedSlot(firstAvail);
      }
    } catch (err) {
      console.error("Error fetching temple details", err);
    }
  };
const handleDonate = async () => {
  if (!user) {
    onLoginRequest();
    return;
  }

  try {
    await axios.post("/api/donations", {
      templeId: selectedTemple._id,
      amount: Number(donationAmount),
      paymentMethod,
      message: donationMessage,
      anonymous,
      donorName: user.name,
    });

    alert("🙏 Thank you for your donation!");

    setShowDonationModal(false);

    // Reset form
    setDonationAmount(500);
    setPaymentMethod("UPI");
    setDonationMessage("");
    setAnonymous(false);

  } catch (err) {
    alert(err.response?.data?.error || "Donation failed");
  }
};

  const handleBookNow = async () => {
    if (!user) {
      onLoginRequest();
      return;
    }

    if (!selectedTemple) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        templeId: selectedTemple._id,
        slotId: activeTab === "darshan" ? selectedSlot?._id : undefined,
        slotTime: activeTab === "darshan" 
          ? (selectedSlot?.slotTime || "General") 
          : (activeTab === "puja" ? (selectedPuja?.name || "Puja Service") : "Accommodation Room"),
        date: selectedDate,
        visitorsCount,
        type: activeTab === "darshan" ? "Darshan" : (activeTab === "puja" ? "Special Puja" : "Accommodation"),
        serviceName: activeTab === "darshan" 
          ? (selectedSlot?.name || "General Darshan") 
          : (activeTab === "puja" ? selectedPuja?.name : "Dharamshala Room Deluxe"),
        totalAmount: calculateTotal()
      };

      const response = await axios.post("/api/bookings", payload);
      setConfirmedBooking(response.data);
      setBookingSuccess(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to confirm your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (activeTab === "darshan") {
      return (visitorsCount * 300) + 50;
    } else if (activeTab === "puja") {
      const pujaPrice = selectedPuja ? selectedPuja.price : 1500;
      return (visitorsCount * pujaPrice) + 100;
    } else {
      return (visitorsCount * 600) + 100;
    }
  };

  const handleTempleChange = (e) => {
    fetchTempleDetails(e.target.value);
  };

  if (!selectedTemple) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-outline-variant/20 shadow-sm">
        <Spinner animation="border" variant="warning" className="mb-4" />
        <p className="text-on-surface-variant font-medium text-sm">Gathering divine listings...</p>
      </div>
    );
  }
 
  return (
    <div className="animate-in fade-in duration-200">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-bold mb-1">
            Active Shrine Selection
          </label>
          <select 
            value={selectedTemple._id}
            onChange={handleTempleChange}
            className="h-10 px-4 bg-white border border-outline-variant/35 rounded-lg text-sm font-semibold focus:ring-1 focus:ring-deep-saffron focus:border-deep-saffron text-on-surface"
          >
            {temples.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={onBackToExplore}
          className="text-xs text-deep-saffron font-bold hover:underline"
        >
          ← Explore Other Temples
        </button>
      </div>

      {bookingSuccess && confirmedBooking ? (
        <div className="bg-white border border-ritual-gold/25 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-6 max-w-2xl mx-auto animate-in zoom-in duration-300">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 border border-green-200 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-headline-md text-2xl text-on-surface">Darshan Booking Confirmed!</h3>
            <p className="text-xs text-on-surface-variant">Your spiritual passage has been successfully reserved.</p>
          </div>

          <div className="bg-sandalwood-cream/50 border border-ritual-gold/20 rounded-xl p-5 md:p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-ritual-gold/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant/75">Mandir Destination</span>
                <h4 className="font-headline-md text-lg text-on-surface leading-tight mt-0.5">{selectedTemple.name}</h4>
                <p className="text-xs text-on-surface-variant/80">{selectedTemple.location}</p>
              </div>
              <div className="p-2 bg-white border border-ritual-gold/25 rounded-lg shadow-sm">
                <Ticket className="w-5 h-5 text-deep-saffron" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-on-surface-variant font-medium">Service Type</p>
                <p className="font-bold text-on-surface mt-0.5">{confirmedBooking.type}</p>
              </div>
              <div>
                <p className="text-on-surface-variant font-medium">Scheduled Rite</p>
                <p className="font-bold text-on-surface mt-0.5">{confirmedBooking.notes}</p>
              </div>
              <div>
                <p className="text-on-surface-variant font-medium">Date & Time</p>
                <p className="font-bold text-on-surface mt-0.5">{new Date(confirmedBooking.bookingDate).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
{" • "}
{confirmedBooking.slot?.slotTime}</p>
              </div>
              <div>
                <p className="text-on-surface-variant font-medium">Pilgrims Registered</p>
                <p className="font-bold text-on-surface mt-0.5">{confirmedBooking.numberOfPersons} Person(s)</p>
              </div>
              <div>
                <p className="text-on-surface-variant font-medium">Booking Reference ID</p>
                <p className="font-mono font-bold text-deep-saffron mt-0.5 uppercase">{confirmedBooking._id}</p>
              </div>
              <div>
                <p className="text-on-surface-variant font-medium">Passage Status</p>
                <div className="mt-0.5">
                  <Badge bg="success" className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {confirmedBooking.status}
                  </Badge>
                </div>
              </div>
            </div>

            {confirmedBooking.qrCode && (
              <div className="pt-4 border-t border-ritual-gold/10 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3 bg-white border-2 border-ritual-gold/25 rounded-xl shadow-md">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4_KWHebuaFAUtA0NWNUYGwm7VTsyVual0JbJLY2oM7PV0xMijzwWzxxWbfIKQc1tfVnm3z0bP0dtaeGCvgDP26X2e6QjnvD-zVWfllx8richMOjmlSfEiPkkvej6bWcBfkhNAZJTKW-QSNh_d8Uxca7rGHWEHaGPCD9V8QidinHvFf2_gbHISfExor8kedR4e__366KhTIkRXvFpO8YBgSqQSnu-soYMSYeTD7kiNNe6CngqcjyMjBRXaWmMlaJCUdriXZMBM0vw" 
                    alt="Booking ticket entry QR code" 
                    className="w-32 h-32 opacity-95"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-on-surface">Secure QR Passage Token</p>
                  <p className="text-[10px] text-on-surface-variant/80 max-w-xs leading-relaxed">
                    Please present this barcode at the temple gate entry counter. Ensure you carry a valid photo ID.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button 
              onClick={onBackToExplore}
              className="px-6 py-2.5 border border-ritual-gold/30 text-on-surface text-xs font-bold rounded-lg hover:bg-sandalwood-cream/50 transition-all"
            >
              Explore Other Mandirs
            </button>
            <button 
              onClick={() => {
                setBookingSuccess(false);
                setConfirmedBooking(null);
              }}
              className="px-6 py-2.5 bg-deep-saffron text-white text-xs font-bold rounded-lg hover:bg-primary shadow-md transition-all"
            >
              Book Another Service
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Temple Hero Banner */}
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md mb-8">
            <img 
              src={selectedTemple.image}
              alt={selectedTemple.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-8" />
            <div className="absolute bottom-6 left-6 md:left-8 text-white z-10">
              <h2 className="font-headline-xl text-2xl md:text-3xl font-bold mb-1 leading-tight">{selectedTemple.name}</h2>
              <p className="text-white/90 text-xs md:text-sm font-medium flex items-center gap-1">
                <MapPin className="w-4 h-4 text-deep-saffron" />
                {selectedTemple.location}
              </p>
            </div>
          </div>

          {/* Tab Selection */}
          {!showDonationModal && (
          <div className="sticky top-14 bg-surface z-20 pb-4 border-b border-ritual-gold/10 flex gap-3 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => { setActiveTab("darshan"); setSelectedPuja(null); }}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-xs transition-all ${
                activeTab === "darshan"
                  ? "bg-deep-saffron text-white shadow-sm"
                  : "bg-sandalwood-cream text-on-surface-variant hover:text-deep-saffron"
              }`}
            >
              Darshan Booking
            </button>
            <button 
              onClick={() => { 
                setActiveTab("puja"); 
                if (selectedTemple.pujas?.length > 0) {
                  setSelectedPuja(selectedTemple.pujas[0]);
                }
              }}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-xs transition-all ${
                activeTab === "puja"
                  ? "bg-deep-saffron text-white shadow-sm"
                  : "bg-sandalwood-cream text-on-surface-variant hover:text-deep-saffron"
              }`}
            >
              Special Puja
            </button>
            <button 
              onClick={() => { setActiveTab("accommodation"); setSelectedPuja(null); }}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-xs transition-all ${
                activeTab === "accommodation"
                  ? "bg-deep-saffron text-white shadow-sm"
                  : "bg-sandalwood-cream text-on-surface-variant hover:text-deep-saffron"
              }`}
            >
              Dharamshala Accommodation
            </button>
          </div>
          )}

          {/* Grid Layout */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-sandalwood-cream/70 border-l-4 border-ritual-gold p-4 rounded-r-xl flex items-start gap-3 shadow-sm">
                <Accessibility className="w-5 h-5 text-deep-saffron flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-on-surface">Priority Assistance Access Available</p>
                  <p className="text-on-surface-variant/80 text-[11px] leading-relaxed">
                    Special assisted darshan slots are strictly reserved for elderly pilgrims (65+) and differently-abled devotees. Please request 'Assistance Desk' at the counter.
                  </p>
                </div>
              </div>

              {activeTab === "darshan" && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-lg text-on-surface">Select Date &amp; Time</h3>
                    <div className="text-ritual-gold flex items-center gap-1.5 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Slots update hourly</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                    <button 
                      onClick={() => setSelectedDate("JUL 22, 2026")}
                      className={`flex-shrink-0 w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        selectedDate === "JUL 22, 2026"
                          ? "border-deep-saffron bg-sandalwood-cream ring-2 ring-deep-saffron/20"
                          : "border-outline-variant/30 bg-white hover:border-deep-saffron"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold text-deep-saffron">JUL</span>
                      <span className="text-2xl font-bold text-on-surface mt-0.5">22</span>
                      <span className="text-[9px] font-semibold text-on-surface-variant mt-0.5">WED</span>
                    </button>

                    <button 
                      onClick={() => setSelectedDate("JUL 23, 2026")}
                      className={`flex-shrink-0 w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        selectedDate === "JUL 23, 2026"
                          ? "border-deep-saffron bg-sandalwood-cream ring-2 ring-deep-saffron/20"
                          : "border-outline-variant/30 bg-white hover:border-deep-saffron"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">JUL</span>
                      <span className="text-2xl font-bold text-on-surface mt-0.5">23</span>
                      <span className="text-[9px] font-semibold text-on-surface-variant mt-0.5">THU</span>
                    </button>

                    <button 
                      onClick={() => setSelectedDate("JUL 24, 2026")}
                      className={`flex-shrink-0 w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        selectedDate === "JUL 24, 2026"
                          ? "border-deep-saffron bg-sandalwood-cream ring-2 ring-deep-saffron/20"
                          : "border-outline-variant/30 bg-white hover:border-deep-saffron"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">JUL</span>
                      <span className="text-2xl font-bold text-on-surface mt-0.5">24</span>
                      <span className="text-[9px] font-semibold text-on-surface-variant mt-0.5">FRI</span>
                    </button>

                    <button 
                      disabled
                      className="flex-shrink-0 w-16 h-20 rounded-xl border border-red-200/50 bg-red-50/20 flex flex-col items-center justify-center cursor-not-allowed opacity-60"
                    >
                      <span className="text-[10px] uppercase font-bold text-red-500">JUL</span>
                      <span className="text-2xl font-bold text-red-900/40 mt-0.5">25</span>
                      <span className="text-[9px] font-bold text-red-500 mt-0.5 uppercase tracking-wide">FULL</span>
                    </button>

                    <button 
                      onClick={() => setSelectedDate("JUL 26, 2026")}
                      className={`flex-shrink-0 w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        selectedDate === "JUL 26, 2026"
                          ? "border-deep-saffron bg-sandalwood-cream ring-2 ring-deep-saffron/20"
                          : "border-outline-variant/30 bg-white hover:border-deep-saffron"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">JUL</span>
                      <span className="text-2xl font-bold text-on-surface mt-0.5">26</span>
                      <span className="text-[9px] font-semibold text-on-surface-variant mt-0.5">SUN</span>
                    </button>
                  </div>

                  <div className="space-y-6 pt-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        <span className="text-deep-saffron">🌅</span> Morning Slots
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {slots.filter(s => s.period === "Morning").map(s => {
                          const isSel = selectedSlot?._id === s._id;
                          return (
                            <button
                              key={s._id}
                              disabled={s.status === "Full" || s.status === "Closed"}
                              onClick={() => setSelectedSlot(s)}
                              className={`p-3.5 border rounded-xl flex flex-col items-center text-center relative transition-all ${
                                s.status === "Full" || s.status === "Closed"
                                  ? "bg-red-50/20 border-red-100 opacity-60 cursor-not-allowed"
                                  : isSel
                                  ? "border-deep-saffron bg-deep-saffron/5 ring-2 ring-deep-saffron ring-offset-1 shadow-sm"
                                  : "border-outline-variant/30 bg-white hover:border-deep-saffron"
                              }`}
                            >
                              <span className="font-bold text-sm text-on-surface">{s.time}</span>
                              <span className={`text-[10px] font-bold mt-1 ${
                                s.status === "Full" ? "text-red-600" : s.status === "Fast Filling" ? "text-red-500 animate-pulse" : "text-green-600"
                              }`}>
                                {s.status === "Full" ? "House Full" : s.status === "Fast Filling" ? "Fast Filling" : `${s.limit - s.booked} Left`}
                              </span>
                              {s.name && <span className="text-[8px] font-semibold uppercase tracking-wider text-on-surface-variant/70 mt-1">{s.name}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        <span className="text-deep-saffron">☀️</span> Afternoon Slots
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {slots.filter(s => s.period === "Afternoon").map(s => {
                          const isSel = selectedSlot?._id === s._id;
                          return (
                            <button
                              key={s._id}
                              disabled={s.status === "Full" || s.status === "Closed"}
                              onClick={() => setSelectedSlot(s)}
                              className={`p-3.5 border rounded-xl flex flex-col items-center text-center relative transition-all ${
                                s.status === "Full" || s.status === "Closed"
                                  ? "bg-red-50/20 border-red-100 opacity-60 cursor-not-allowed"
                                  : isSel
                                  ? "border-deep-saffron bg-deep-saffron/5 ring-2 ring-deep-saffron ring-offset-1 shadow-sm"
                                  : "border-outline-variant/30 bg-white hover:border-deep-saffron"
                              }`}
                            >
                              <span className="font-bold text-sm text-on-surface">{s.time}</span>
                              <span className={`text-[10px] font-bold mt-1 ${
                                s.status === "Full" ? "text-red-600" : s.status === "Fast Filling" ? "text-red-500 animate-pulse" : "text-green-600"
                              }`}>
                                {s.status === "Full" ? "House Full" : s.status === "Fast Filling" ? "Fast Filling" : "Available"}
                              </span>
                              {s.name && <span className="text-[8px] font-semibold uppercase tracking-wider text-on-surface-variant/70 mt-1">{s.name}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        <span className="text-deep-saffron">🌙</span> Evening Slots
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {slots.filter(s => s.period === "Evening").map(s => {
                          const isSel = selectedSlot?._id === s._id;
                          return (
                            <button
                              key={s._id}
                              disabled={s.status === "Full" || s.status === "Closed"}
                              onClick={() => setSelectedSlot(s)}
                              className={`p-3.5 border rounded-xl flex flex-col items-center text-center relative transition-all ${
                                s.status === "Full" || s.status === "Closed"
                                  ? "bg-red-50/20 border-red-100 opacity-60 cursor-not-allowed"
                                  : isSel
                                  ? "border-deep-saffron bg-deep-saffron/5 ring-2 ring-deep-saffron ring-offset-1 shadow-sm"
                                  : "border-outline-variant/30 bg-white hover:border-deep-saffron"
                              }`}
                            >
                              <span className="font-bold text-sm text-on-surface">{s.time}</span>
                              <span className={`text-[10px] font-bold mt-1 ${
                                s.status === "Full" ? "text-red-600" : s.status === "Fast Filling" ? "text-red-500 animate-pulse" : "text-green-600"
                              }`}>
                                {s.status === "Full" ? "House Full" : s.status === "Fast Filling" ? "Fast Filling" : `${s.limit - s.booked} Available`}
                              </span>
                              {s.name && <span className="text-[8px] font-semibold uppercase tracking-wider text-on-surface-variant/70 mt-1">{s.name}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "puja" && (
                <section className="space-y-4">
                  <h3 className="font-headline-md text-lg text-on-surface">Select Special Puja Service</h3>
                  <div className="space-y-4">
                    {selectedTemple.pujas?.length === 0 ? (
                      <p className="text-xs text-on-surface-variant/80">No special pujas configured for this temple currently.</p>
                    ) : (
                      selectedTemple.pujas?.map((puja) => {
                        const isSelected = selectedPuja?.id === puja.id;
                        return (
                          <div 
                            key={puja.id}
                            onClick={() => setSelectedPuja(puja)}
                            className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center group ${
                              isSelected
                                ? "border-deep-saffron bg-deep-saffron/5 ring-1 ring-deep-saffron"
                                : "border-outline-variant/20 bg-white hover:border-deep-saffron/50"
                            }`}
                          >
                            <div className="flex-1 pr-4">
                              <h5 className="font-headline-md text-base text-on-surface group-hover:text-deep-saffron transition-colors">
                                {puja.name}
                              </h5>
                              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                                {puja.description}
                              </p>
                              <div className="flex items-center gap-3 mt-3">
                                <span className="text-deep-saffron font-bold text-sm">₹{puja.price.toLocaleString("en-IN")}</span>
                                <span className="text-[10px] bg-sandalwood-cream text-on-surface-variant px-2 py-0.5 rounded font-semibold">
                                  Duration: {puja.duration}
                                </span>
                              </div>
                            </div>
                            <div className={`p-2 rounded-full transition-colors ${
                              isSelected ? "bg-deep-saffron text-white" : "bg-sandalwood-cream text-deep-saffron"
                            }`}>
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              )}

              {activeTab === "accommodation" && (
                <section className="space-y-4">
                  <h3 className="font-headline-md text-lg text-on-surface">Dharamshala &amp; Bhakt Niwas</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Choose premium low-cost accommodation managed by the Temple Trust. Standard check-in: 12:00 PM.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-outline-variant/30 rounded-xl space-y-3 shadow-sm hover:border-deep-saffron transition-all">
                      <div className="h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_aLK2I0O24IRpyr1-IXEHcqxg18m9LODKM5ElVU4bkr0syWDZgLwscwsoCzkWdJBt-7Zw1c2ekGdC87D9jZQLeorEREnLZ7QztceDv2RUEelvKjozp-XS6DAQr54V2-RpnBFmqo_WvMSORFk00Vzc9itxzxXH1ST75hnGbbEBItOAojVYTej4Ti2x9JQfh4JK4PJUHhaJaSB_eecxzPrnG6XJTVt_PhxU2h7sSHe0mk8qcGksVNSv8EkA9qB4-agaBQtbqQEWWvI" 
                          alt="Deluxe Room Dharamshala" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-on-surface uppercase tracking-wide">Deluxe Dharamshala Room</h5>
                        <p className="text-[11px] text-on-surface-variant/85 mt-1">AC, double beds, private washroom, water heater.</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-deep-saffron font-bold text-sm">₹600 / Night</span>
                          <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Available</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-outline-variant/30 rounded-xl space-y-3 shadow-sm hover:border-deep-saffron transition-all opacity-60">
                      <div className="h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQz5DyZ-L0USfWM9CDplcBnfCg1A9IboNojQQrcFea2E1Cm2CSKPtzAgxXUBw7i0pgwN9N7fMVoIS15vZ1tyKjYJekQiMliGm-mwaF5j3SVTX3bNJ8kwOxrVcgLMG_VykHyswDrY23XgrYiXAd0xqqmH9S27PpFFqKe_aS6uDVqIzXYrektuWLcV0GvAtKaW7nykrEPAQnT3AJJmvmzIdCqMvjIxOlyIM4KzZOMbp1rH5qng_EmPxVV083IjUSxf7nvLGtmGDW1mE" 
                          alt="Standard Bhakt Niwas" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-on-surface uppercase tracking-wide">Standard Family Suite</h5>
                        <p className="text-[11px] text-on-surface-variant/85 mt-1">Non-AC, 4 single beds, shared washroom, high cleanliness.</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-on-surface-variant font-bold text-xs">₹300 / Night</span>
                          <span className="text-[9px] bg-red-50 text-red-500 px-2 py-0.5 rounded font-bold uppercase">Fully Booked</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Invoice Sidebar */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 bg-white border border-ritual-gold/20 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
                <h4 className="font-headline-md text-xl text-on-surface border-b border-ritual-gold/10 pb-4">
                  Booking Summary
                </h4>

                {errorMessage && (
                  <Alert variant="danger" className="d-flex align-items-start gap-2 p-3 text-xs mb-0">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </Alert>
                )}

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Destination</p>
                      <p className="font-bold text-on-surface mt-0.5">{selectedTemple.name}</p>
                    </div>
                    <span className="text-deep-saffron text-lg">🕉️</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Date &amp; Scheduled Rite</p>
                      <p className="font-bold text-on-surface mt-0.5">
                        {selectedDate} • {
                          activeTab === "darshan" 
                            ? (selectedSlot ? selectedSlot.slotTime : "Choose a Slot") 
                            : (activeTab === "puja" ? (selectedPuja ? selectedPuja.name : "Select Puja") : "AC Deluxe Dharamshala")
                        }
                      </p>
                    </div>
                    <span className="text-deep-saffron text-lg">🕒</span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-2">
                      Total Devotees / Visitors
                    </label>
                    <div className="flex items-center gap-4">
                      <button 
                        disabled={visitorsCount <= 1}
                        onClick={() => setVisitorsCount(prev => prev - 1)}
                        className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-sandalwood-cream text-sm font-semibold active:scale-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="font-bold text-base text-on-surface w-4 text-center">{visitorsCount}</span>
                      <button 
                        disabled={visitorsCount >= 10}
                        onClick={() => setVisitorsCount(prev => prev + 1)}
                        className="w-10 h-10 rounded-full border border-deep-saffron/50 flex items-center justify-center bg-deep-saffron text-white text-sm font-semibold active:scale-90 transition-all cursor-pointer hover:bg-primary"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Receipt Calculations */}
                <div className="bg-sandalwood-cream/40 rounded-xl p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>
                      {activeTab === "darshan" ? "Standard Darshan" : activeTab === "puja" ? "Special Puja Package" : "Dharamshala Suite"} 
                      ({visitorsCount} Pilgrim{visitorsCount > 1 ? "s" : ""})
                    </span>
                    <span className="font-semibold text-on-surface">
                      ₹{activeTab === "darshan" 
                        ? (visitorsCount * 300).toLocaleString("en-IN") 
                        : (activeTab === "puja" ? (visitorsCount * (selectedPuja?.price || 1500)).toLocaleString("en-IN") : (visitorsCount * 600).toLocaleString("en-IN"))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Trust Seva Service Charge</span>
                    <span className="font-semibold text-on-surface">₹{activeTab === "darshan" ? "50" : "100"}</span>
                  </div>

                  <div className="pt-2.5 border-t border-outline-variant/20 flex justify-between font-bold text-sm text-on-surface">
                    <span>Total Divine Amount</span>
                    <span className="text-deep-saffron text-base">₹{calculateTotal().toLocaleString("en-IN")}</span>
                  </div>
                </div>

                 <button
  onClick={() => setShowDonationModal(true)}
  className="w-full mt-3 py-3 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold rounded-xl transition mb-4"
>
  ❤️ Donate to Temple
</button>
                <button 
                  onClick={handleBookNow}
                  disabled={isSubmitting || (activeTab === "darshan" && !selectedSlot) || (activeTab === "puja" && !selectedPuja)}
                  className="w-full bg-deep-saffron hover:bg-primary disabled:bg-on-surface-variant/20 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-xs md:text-sm shadow-md hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mb-4"
                >
                  <ShieldCheck className="w-5 h-5" />
                  {isSubmitting 
                    ? "Securing Temple Slot..." 
                    : !user 
                    ? "Sign In to Proceed & Book" 
                    : "Confirm Booking & Proceed"}
                </button>
               

                <p className="text-center text-[9px] text-on-surface-variant/60 uppercase tracking-widest font-semibold">
                  Secure Spiritual Booking powered by Darshan Ease
                </p>
                {showDonationModal && (
  <div
  className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center overflow-y-auto p-4"
>
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <div
  className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center overflow-y-auto p-4"
  onClick={() => setShowDonationModal(false)}
>
  <div
    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
    onClick={(e) => e.stopPropagation()}
  >

      <h2 className="text-xl font-bold mb-4">
        🙏 Donate to {selectedTemple?.name}
      </h2>

      <label className="block mb-2 font-semibold">
        Amount
      </label>

      <input
        type="number"
        value={donationAmount}
        onChange={(e)=>setDonationAmount(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      />

      <label className="block mb-2 font-semibold">
        Payment Method
      </label>

      <select
        value={paymentMethod}
        onChange={(e)=>setPaymentMethod(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      >
        <option>UPI</option>
        <option>CARD</option>
        <option>NETBANKING</option>
      </select>

      <textarea
        placeholder="Message (Optional)"
        value={donationMessage}
        onChange={(e)=>setDonationMessage(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      />

      <label className="flex gap-2 items-center mb-4">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e)=>setAnonymous(e.target.checked)}
        />

        Donate Anonymously
      </label>

      <div className="flex gap-3">

        <button
          onClick={()=>setShowDonationModal(false)}
          className="flex-1 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleDonate}
          className="flex-1 py-2 bg-orange-500 text-white rounded"
        >
          Donate Now
        </button>

      </div>
</div>
  </div>
    </div>
  </div>
)}
              </div>
            </div>
          </div>
        </div>
        
      )}
    </div>
    
  );
};
