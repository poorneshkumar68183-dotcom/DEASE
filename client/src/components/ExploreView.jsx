import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Star, Heart, MapPin, Sparkles, HelpCircle, Flame, Calendar, ChevronRight } from "lucide-react";

export const ExploreView = ({ onSelectTemple, onSelectTab }) => {
  const [temples, setTemples] = useState([]);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("darshanease_favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    try {
      const response = await axios.get("/api/temples");
      setTemples(response.data);
    } catch (err) {
      console.error("Error fetching temples", err);
    }
  };

  const toggleFavorite = (templeId, e) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(templeId)) {
      updated = favorites.filter(id => id !== templeId);
    } else {
      updated = [...favorites, templeId];
    }
    setFavorites(updated);
    localStorage.setItem("darshanease_favorites", JSON.stringify(updated));
  };

  const filteredTemples = temples.filter(temple => {
    const matchesSearch = 
      temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeCategory === "Popular") return temple.category === "Popular";
    if (activeCategory === "Near Me") return temple.category === "Near Me";
    if (activeCategory === "Special Pujas") return temple.category === "Special Pujas";
    if (activeCategory === "Virtual Darshan") return true; 

    return true;
  });

  const handleHeroBooking = () => {
    const mahakal = temples.find(t => t.name.includes("Mahakaleshwar"));
    if (mahakal) {
      onSelectTemple(mahakal._id);
    } else {
      onSelectTemple("temple_kashi");
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Search Bar */}
      <div className="relative group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search temples, pujas, or services..."
          className="w-full h-14 pl-12 pr-4 bg-white border border-outline-variant/35 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-deep-saffron/40 focus:border-deep-saffron shadow-sm transition-all"
        />
        <Search className="w-5 h-5 text-on-surface-variant/70 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-deep-saffron transition-colors" />
      </div>

      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBcJ-n_S_3Hw5lrTDKdQcw54aDOk2Z3RUjdG-b3SI3Tnwc893s2GnMY_WKs5gaxyF6PQuY0yWPb6XhZwTJQU5mrr2lVH6oEMmsHbbasl_4CScPn89hTCBlOSjwYkxIkMmge5551Mng9aFxp7wEl-O399qcZF5jBHJs8MA1y_3O8JQmpO4fM1D7d5cuEZJzVQf7MwpFpm3GcIMDl2vKz_xMaqkHmDpo40oimQNJVk79VnVq3T7s8vX5s0M1DEwnVb8zwY8y-oDYe3eo')",
            referrerPolicy: "no-referrer"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-temple-slate/85 via-temple-slate/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col items-start">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sacred-vermilion text-white font-semibold text-[10px] md:text-xs rounded-full mb-3 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-current animate-pulse" /> Limited Shravan Booking
          </span>
          <h2 className="font-headline-lg text-2xl md:text-3xl text-white mb-2 leading-tight">
            Mahakaleshwar Special Shravan Puja
          </h2>
          <p className="font-sans text-white/90 text-xs md:text-sm max-w-xl mb-4">
            Experience the divine Bhasma Aarti with priority access, sacred Prasad delivery, and personal Pandit assist during this holy month.
          </p>
          <button 
            onClick={handleHeroBooking}
            className="bg-deep-saffron hover:bg-primary-container text-white font-bold text-xs md:text-sm py-2.5 px-6 rounded-lg transition-all active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" /> Book Your Slot
          </button>
        </div>
      </section>

      {/* Horizontal Categories */}
      <section>
        <div className="flex items-center overflow-x-auto gap-3 pb-2 scrollbar-hide">
          {["Popular", "Near Me", "Special Pujas", "Virtual Darshan"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold text-xs transition-all border ${
                activeCategory === category
                  ? "bg-deep-saffron text-white border-deep-saffron shadow-sm"
                  : "bg-sandalwood-cream text-on-surface-variant hover:text-deep-saffron border-ritual-gold/20 hover:bg-surface-container-high"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Live Streams */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sacred-vermilion opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sacred-vermilion"></span>
            </span>
            <h3 className="font-headline-md text-lg md:text-xl text-on-surface">Live Virtual Darshan</h3>
          </div>
          <button 
            onClick={() => setActiveCategory("Virtual Darshan")}
            className="text-deep-saffron font-bold text-xs flex items-center gap-1 hover:underline"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
          <div className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => setShowComingSoon(true)}>
            <div className="relative aspect-square rounded-xl overflow-hidden mb-2 shadow-sm border border-outline-variant/10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh44RX5nwRjq3l2N2Z569nkmjz3l6s317CR_wH31NvQL-GpxdGZFEjPXCvl7lZarlJvKuD2nEE9GUc8ICSYmJo9zR2Nb8ZkQAaDxjbMBw2ajy-6jtFeP3Zc0MZ-1xAKRJr3PIzs-u7ycZk6b7DiTf8P001DXOYU1N6ZyOsPUMBKdFcZYXfItpIxBH442oBEURK0_p5ZpYdzqntiR4Z7u751dE_3rUDG48dF-d3nwQLgVNZpYCIUNs9IhtaEOTVQFse2D4pHQydJG0"
                alt="Kashi Vishwanath live stream preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 bg-sacred-vermilion rounded text-[9px] text-white font-bold uppercase tracking-wider">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span> Live
              </div>
            </div>
            <p className="font-semibold text-xs text-on-surface text-center line-clamp-1 group-hover:text-deep-saffron transition-colors">
              Kashi Vishwanath
            </p>
          </div>

          <div className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => setShowComingSoon(true)}>
            <div className="relative aspect-square rounded-xl overflow-hidden mb-2 shadow-sm border border-outline-variant/10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUcWx8kRUeX273QZT8NdmJXCGCcHVmtvn9nHXujQXIrO3KU3j3-FIW7C27vqV_RFJ3vvxU7hXIkgOvCoLSF2znaX0WAY_1hSYc5CWhXoW6O8nFyGIuYjXBxXETTYpKJExaTnj6shuRtD1In3PazrEfXjpZwTl1q_Vtl0wMmDxl8r1ph-uWTcsGpYW8BKvXnwE_D4QIhGdQjv4p5YHhX2M_eFT7tabmkZmySwaRvYHLSmCHQ-LRwOUYYpIMX_iTTUVCLYl4XS2wqto"
                alt="Somnath Temple live stream preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 bg-sacred-vermilion rounded text-[9px] text-white font-bold uppercase tracking-wider">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span> Live
              </div>
            </div>
            <p className="font-semibold text-xs text-on-surface text-center line-clamp-1 group-hover:text-deep-saffron transition-colors">
              Somnath Temple
            </p>
          </div>

          <div className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => setShowComingSoon(true)}>
            <div className="relative aspect-square rounded-xl overflow-hidden mb-2 shadow-sm border border-outline-variant/10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChXT67TpqxSWuUzC8mJtHSMuu6mSd2c0iQZnoK9LFtDb0UYf3qADJ-Ayw6LGPbvSrK0X0NkGVQhADV5XZaiku2gYd0CW2-aShxlqua5Vj90I1r4I6bmijP1vSdV4AYMCEnsliOovARaUmgu8OW9kICxQoe1DE_4HmEJXxNCJOY1xNs5hYnYCa9AEiM_eymIAjQ-UXu03GClOaHyfTwORgBK8_e45ZhHmZBlRLdup6QzaHtU-fwMpjzvj9QrWNtK6lovQadl8ySGT4"
                alt="Meenakshi Temple live stream preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 bg-sacred-vermilion rounded text-[9px] text-white font-bold uppercase tracking-wider">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span> Live
              </div>
            </div>
            <p className="font-semibold text-xs text-on-surface text-center line-clamp-1 group-hover:text-deep-saffron transition-colors">
              Tirumala Tirupati
            </p>
          </div>
          {showComingSoon && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-xl">
      <h2 className="text-2xl font-bold text-deep-saffron mb-3">
        🚧 Coming Soon
      </h2>

      <p className="text-gray-600 mb-6">
        Live Virtual Darshan will be available in a future update.
      </p>

      <button
        onClick={() => setShowComingSoon(false)}
        className="bg-deep-saffron text-white px-5 py-2 rounded-lg hover:opacity-90"
      >
        OK
      </button>
    </div>
  </div>
)}
        </div>
      </section>

      {/* Recommended Temples Grid */}
      <section>
        <h3 className="font-headline-md text-xl text-on-surface mb-5">Recommended for You</h3>
        {filteredTemples.length === 0 ? (
          <div className="p-8 text-center bg-white border border-outline-variant/20 rounded-xl">
            <HelpCircle className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-2" />
            <p className="text-sm text-on-surface-variant font-medium">No temples found matching your preferences.</p>
             <p className="text-sm text-on-surface-variant font-medium">Many more will be adding soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemples.map((temple) => (
              <div 
                key={temple._id}
                onClick={() => onSelectTemple(temple._id)}
                className="bg-white rounded-xl overflow-hidden border border-outline-variant/20 shadow-[0_4px_12px_0_rgba(26,32,44,0.03)] hover:shadow-md transition-all group cursor-pointer flex flex-col h-full"
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-40" />
                  <button 
                    onClick={(e) => toggleFavorite(temple._id, e)}
                    className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur rounded-full text-deep-saffron hover:bg-white transition-all active:scale-90"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(temple._id) ? "fill-current" : ""}`} />
                  </button>
                  <span className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-0.5 rounded text-[10px] font-bold text-on-surface flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current text-deep-saffron" />
                    {temple.rating.toFixed(1)}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-headline-md text-lg text-on-surface leading-tight mb-1 group-hover:text-deep-saffron transition-colors">
                      {temple.name}
                    </h4>
                    <div className="flex items-center gap-1 text-on-surface-variant/80 text-xs mb-3">
                      <MapPin className="w-3.5 h-3.5 text-deep-saffron" />
                      <span>{temple.location}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant/85 line-clamp-2 leading-relaxed mb-4">
                      {temple.description}
                    </p>
                  </div>

                  <div>
                    <div className="p-3 bg-surface-container-low rounded-lg border border-ritual-gold/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant/70">Next Slot</span>
                        <span className="text-[10px] font-bold text-deep-saffron bg-deep-saffron/10 px-2 py-0.5 rounded">
                          {temple.nextAvailableSlot}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => onSelectTemple(temple._id)}
                      className="w-full mt-4 py-3 bg-white border-2 border-deep-saffron/80 text-deep-saffron font-bold text-xs rounded-lg hover:bg-sandalwood-cream/50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      Book Darshan & Pujas
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-sandalwood-cream/70 border border-ritual-gold/20 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="z-10 max-w-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-deep-saffron" />
                <h3 className="font-headline-lg text-2xl text-on-surface">Pilgrim Insights</h3>
              </div>
              <p className="font-sans text-on-surface-variant text-sm mb-6 leading-relaxed">
                Receive weekly holy updates on major temple festivals, suspicious tithi timings, direct seva listings, and priority slot announcements.
              </p>
              {newsletterSubscribed ? (
                <div className="p-3 bg-green-50 text-green-800 rounded-lg text-xs font-semibold border border-green-200">
                  🎉 Thank you! You've successfully subscribed to Pilgrim Insights newsletters.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 h-11 px-4 rounded-lg bg-white border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-deep-saffron focus:border-deep-saffron"
                  />
                  <button 
                    type="submit"
                    className="bg-temple-slate text-white px-6 h-11 rounded-lg text-xs font-bold hover:bg-black transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-5">
              <Sparkles className="w-48 h-48 text-deep-saffron" />
            </div>
          </div>

          <div className="bg-sandalwood-cream border border-ritual-gold/25 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <HelpCircle className="w-12 h-12 text-deep-saffron mb-3" />
            <h4 className="font-headline-md text-lg text-on-surface mb-1">Need Assistance?</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed max-w-[200px]">
              Our dedicated Seva support desk is available 24/7 to guide you with any bookings.
            </p>
            <button 
              onClick={() => onSelectTab("Profile")}
              className="mt-4 px-5 py-2 bg-white hover:bg-sandalwood-cream border border-ritual-gold/30 rounded-full text-[10px] font-bold uppercase text-on-surface transition-colors"
            >
              Get Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
