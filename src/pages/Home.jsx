import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Recycle, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Leaf, 
  Cpu, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  HeartHandshake,
  Gift,
  Wrench,
  Building2
} from 'lucide-react';

/**
 * Home Page
 * Landing page showcasing EcoCycle's mission, key features, and entry points.
 */
export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-16 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              Smart E-Waste Recycling Initiative
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Give Your Old Electronics A <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">Second Life</span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Schedule free doorstep e-waste pickups or discover authorized recycling centers across your city. Zero landfill waste, 100% compliant and certified.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/schedule"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-200 transition duration-200 transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" />
                Schedule Free Pickup
              </Link>
              <Link
                to="/locator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-7 py-3.5 rounded-2xl border border-slate-300 shadow-sm transition duration-200"
              >
                <MapPin className="w-5 h-5 text-emerald-600" />
                Find Collection Centers
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Doorstep Pickups
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-600" /> Non-Profit Civic Mission
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> CPCB Certified Recyclers
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Landfill Promise
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How EcoCycle Works</h2>
          <p className="text-slate-600 text-sm mt-2">
            Responsible recycling made simple in three transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 font-black rounded-2xl flex items-center justify-center text-lg mb-5">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Book A Pickup</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Select your obsolete gadgets—laptops, phones, cables, or appliances—and set a convenient pickup date.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 font-black rounded-2xl flex items-center justify-center text-lg mb-5">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Verified Collection</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our certified partner collects the items right from your doorstep or drop them at our verified drop points.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 font-black rounded-2xl flex items-center justify-center text-lg mb-5">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Safe Material Recovery</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Electronics are dismantled safely, extracting precious metals like gold & copper while preventing carbon emissions.
            </p>
          </div>

        </div>
      </section>

      {/* Non-Profit Civic Model Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Civic E-Waste Aggregation Model
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Non-Profit Community Promise</h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              EcoCycle operates as a free civic environmental utility, bridging individual households with authorized industrial recyclers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-11 h-11 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">100% Free Doorstep Pickup</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Zero service fees, zero pickup charges. Citizens surrender obsolete electronics for safe environmental retirement at ₹0 cost.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-11 h-11 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">We Take What Buyers Reject</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Commercial buyback platforms only buy working phones for profit. We accept dead batteries, burnt cables, and broken gadgets to stop toxic dumping.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-11 h-11 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">State-Authorized Facilities</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                We aggregate small collections and route them in bulk directly to CPCB/KSPCB certified recycling plants for formal demanufacturing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
                Why Responsible Disposal Matters
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Over 62 Million Metric Tonnes of E-Waste Are Generated Every Year.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Less than 22% is properly documented and recycled. Toxic heavy metals like Lead, Mercury, and Cadmium leach into our soil and groundwater when dumped casually into municipal bins.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-200">
                    Recover up to 95% of rare earth materials and precious metals.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-200">
                    100% data sanitization and secure electronics demanufacturing.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-200">
                    Track your personal and collective carbon offset on our Impact dashboard.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/awareness"
                  className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm hover:text-emerald-300 transition"
                >
                  Take the E-Waste Awareness Quiz <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Impact Banner Card */}
            <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl space-y-6 text-center">
              <div className="inline-block p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 mb-2">
                <Recycle className="w-12 h-12 mx-auto animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold">Every Device Recycled Saves ~15 kg CO₂</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Recycling raw materials requires up to 80% less energy than mining virgin ores. See live metrics of all pickups logged through EcoCycle.
              </p>
              <Link
                to="/impact"
                className="inline-block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition duration-150"
              >
                View Live Impact Dashboard
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-10 sm:p-14 rounded-3xl shadow-xl shadow-emerald-600/10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">Ready to Clear Out Old Gadgets?</h2>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm sm:text-base">
            Don't let dead phones, laptops, and cables sit in your drawers. Schedule your pickup in under 60 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/schedule"
              className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-8 py-3.5 rounded-xl shadow-md transition"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
