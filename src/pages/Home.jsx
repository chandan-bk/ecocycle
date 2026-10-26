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
  Building2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

/**
 * Home Page (Elevated via Impeccable Design System)
 * High-craft architectural layout, distinctive botanical palette, zero AI slop.
 */
export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#D6E5DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F3D2E] tracking-tight leading-[1.12]">
              Safe E-Waste Surrender, Directly From Your Doorstep.
            </h1>

            <p className="text-lg sm:text-xl text-[#3F584C] leading-relaxed max-w-2xl mx-auto">
              Connecting households across Mandya and Bangalore with state-certified recycling facilities. We collect obsolete, broken, and dead electronics for <strong className="text-[#0F3D2E]">₹0 cost</strong> so toxic heavy metals never enter our landfills or water.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/schedule"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0F3D2E] hover:bg-[#1C7C54] active:scale-[0.98] text-white font-bold px-8 py-3.5 rounded-xl transition duration-150 shadow-sm"
              >
                <Calendar className="w-5 h-5 text-[#2FA36B]" />
                Schedule Free Pickup
              </Link>
              <Link
                to="/locator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#EDF3EF] active:scale-[0.98] text-[#0F3D2E] font-bold px-8 py-3.5 rounded-xl border border-[#B4CFC1] transition duration-150"
              >
                <MapPin className="w-5 h-5 text-[#2FA36B]" />
                Find Drop Centers
              </Link>
            </div>

            {/* Architectural Trust Bar */}
            <div className="pt-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-[#3F584C] bg-white border border-[#D6E5DC] rounded-xl p-3.5 shadow-xs">
                <div className="flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2FA36B] shrink-0" />
                  <span>100% Free Service</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-[#2FA36B] shrink-0" />
                  <span>Civic Non-Profit</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2FA36B] shrink-0" />
                  <span>CPCB Certified</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <Leaf className="w-4 h-4 text-[#2FA36B] shrink-0" />
                  <span>Zero Landfill</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Step Connected Workflow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#D6E5DC] pb-6 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D2E]">How EcoCycle Works</h2>
          <p className="text-[#3F584C] text-sm mt-1">
            Three disciplined phases bridging your household to authorized industrial recyclers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-[#D6E5DC] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#2FA36B] uppercase tracking-wider">Phase 01</span>
                <span className="w-8 h-8 rounded-lg bg-[#E8F5EE] text-[#0F3D2E] font-extrabold flex items-center justify-center text-sm">
                  1
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0F3D2E] mb-2">Book Collection</h3>
              <p className="text-[#3F584C] text-sm leading-relaxed">
                Categorize your obsolete gadgets—laptops, batteries, cables, or appliances—and set a convenient collection date.
              </p>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[#D6E5DC] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#2FA36B] uppercase tracking-wider">Phase 02</span>
                <span className="w-8 h-8 rounded-lg bg-[#E8F5EE] text-[#0F3D2E] font-extrabold flex items-center justify-center text-sm">
                  2
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0F3D2E] mb-2">Verified Doorstep Pickup</h3>
              <p className="text-[#3F584C] text-sm leading-relaxed">
                Logistics coordinators safely retrieve items from your home and dispatch real-time email status receipts.
              </p>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[#D6E5DC] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#2FA36B] uppercase tracking-wider">Phase 03</span>
                <span className="w-8 h-8 rounded-lg bg-[#E8F5EE] text-[#0F3D2E] font-extrabold flex items-center justify-center text-sm">
                  3
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0F3D2E] mb-2">Certified Smelting & Recovery</h3>
              <p className="text-[#3F584C] text-sm leading-relaxed">
                Aggregated batches are demanufactured in CPCB-authorized facilities, recovering gold and copper while neutralizing toxins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Non-Profit Civic Model: Distinctive Comparison Ledger */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#D6E5DC] rounded-3xl p-8 sm:p-12 shadow-xs">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D2E]">
              Our Non-Profit Model: Civic Aggregation vs. Commercial Buyback
            </h2>
            <p className="text-[#3F584C] text-sm mt-2 leading-relaxed">
              Why EcoCycle operates as an open civic utility rather than a scrap marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            
            {/* Commercial Scrap Column */}
            <div className="bg-[#FFF5F5] border border-[#FED7D7] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#9B2C2C] font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-[#E53E3E]" />
                <span>Commercial Re-Commerce (Cashify / Scrap Dealers)</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#742A2A] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#E53E3E] font-bold">✕</span>
                  <span><strong>Cherry-Picks Working Phones:</strong> Only buys devices with resale equity; rejects 80% of e-waste.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E53E3E] font-bold">✕</span>
                  <span><strong>Informal Dumps:</strong> Non-lucrative components (lead glass, burnt cables, dead batteries) end up in informal scrap yards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E53E3E] font-bold">✕</span>
                  <span><strong>Corporate Profit First:</strong> Driven by device arbitrage, not groundwater protection or clean air.</span>
                </li>
              </ul>
            </div>

            {/* EcoCycle Civic Column */}
            <div className="bg-[#E8F5EE] border border-[#B4CFC1] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#0F3D2E] font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#2FA36B]" />
                <span>EcoCycle Civic Aggregation (Non-Profit Utility)</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#12261D] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#2FA36B] font-bold">✓</span>
                  <span><strong>Accepts Broken & Dead Gadgets:</strong> Surrender burnt chargers, shattered displays, and swollen lithium cells for ₹0.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2FA36B] font-bold">✓</span>
                  <span><strong>100% Certified Dismantling:</strong> Collections are aggregated in bulk for formal state-authorized metallurgical plants.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2FA36B] font-bold">✓</span>
                  <span><strong>Zero Landfill & Carbon Offsets:</strong> Every device diverted is tracked for genuine empirical CO₂ reductions (UN SDG 12).</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Deep Dive (Deep Botanical Surface with Tinted Contrast) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F3D2E] text-white rounded-3xl p-8 sm:p-12 border border-[#1C7C54] shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                Over 62 Million Metric Tonnes of E-Waste Are Generated Annually.
              </h2>
              <p className="text-[#D1EBE0] text-sm leading-relaxed">
                Less than 22% is formally documented and recycled. Toxic heavy metals like Lead, Mercury, and Cadmium leach into drinking water tables when discarded in municipal bins or burnt openly.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-[#1C7C54] text-[#2FA36B] rounded-lg">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-[#E8F5EE]">
                    Recover precious metals (gold, copper, silver) at 80% lower energy cost than virgin mining.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-[#1C7C54] text-[#2FA36B] rounded-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-[#E8F5EE]">
                    Rigorous data destruction and certified component demanufacturing.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-[#1C7C54] text-[#2FA36B] rounded-lg">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-[#E8F5EE]">
                    Quantify collective carbon offsets on our live empirical analytics dashboard.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/awareness"
                  className="inline-flex items-center gap-2 text-[#F2B134] font-bold text-sm hover:underline"
                >
                  Take the E-Waste Literacy Challenge <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Impact Statistic Card */}
            <div className="bg-[#09251C] border border-[#1C7C54] p-8 rounded-2xl text-center space-y-5">
              <div className="w-12 h-12 bg-[#1C7C54]/40 rounded-xl flex items-center justify-center mx-auto text-[#2FA36B]">
                <Recycle className="w-7 h-7" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#F2B134]">~15 kg CO₂</div>
              <p className="text-xs text-[#D1EBE0] font-semibold uppercase tracking-wider">
                Average Carbon Emissions Prevented Per Recycled Gadget
              </p>
              <p className="text-[#D1EBE0] text-xs leading-relaxed max-w-sm mx-auto">
                Benchmark based on United Nations Environment Programme (UNEP) life cycle assessment methodologies.
              </p>
              <Link
                to="/impact"
                className="inline-block w-full bg-[#2FA36B] hover:bg-[#1C7C54] text-white font-bold py-3 rounded-xl transition duration-150"
              >
                View Live Impact Dashboard
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white border border-[#D6E5DC] p-10 sm:p-12 rounded-3xl shadow-xs space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D2E]">
            Have Obsolete Electronics In Your Drawers?
          </h2>
          <p className="text-[#3F584C] max-w-lg mx-auto text-sm leading-relaxed">
            Schedule your free doorstep collection in under 60 seconds. Keep toxic heavy metals out of municipal waste.
          </p>
          <div className="pt-2">
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 bg-[#0F3D2E] hover:bg-[#1C7C54] active:scale-[0.98] text-white font-bold px-8 py-3.5 rounded-xl shadow-xs transition"
            >
              <Calendar className="w-5 h-5 text-[#2FA36B]" />
              Schedule Free Pickup Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
