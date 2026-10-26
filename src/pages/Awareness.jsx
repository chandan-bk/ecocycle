import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  AlertTriangle, 
  Flame, 
  Cpu, 
  Droplet, 
  Award, 
  Sparkles,
  ShieldCheck 
} from 'lucide-react';

/**
 * Awareness Page (Elevated via Impeccable Design System)
 * Educational taxonomy, toxic hazard dossier, and interactive 5-question challenge.
 */
export default function Awareness() {
  // Quiz Questions Data
  const quizQuestions = [
    {
      id: 1,
      question: 'What is the most severe environmental hazard when e-waste is dumped into municipal landfills?',
      options: [
        'It takes up excessive visual space',
        'Toxic heavy metals (Lead, Mercury, Cadmium) leach into groundwater and soil',
        'It increases the weight of local garbage trucks',
        'It generates static electricity shocks',
      ],
      correctAnswer: 1,
      explanation: 'Hazardous chemicals and heavy metals like Lead, Mercury, and Cadmium easily leach through soil into aquifers, contaminating drinking water reserves.',
    },
    {
      id: 2,
      question: 'Which precious metal is recovered in significant purity from computer circuit boards and CPUs?',
      options: ['Iron', 'Gold', 'Zinc', 'Titanium'],
      correctAnswer: 1,
      explanation: 'One metric ton of circuit boards contains up to 40 to 800 times more gold than a metric ton of natural gold ore mined from the earth!',
    },
    {
      id: 3,
      question: 'What crucial step should you always complete before handing over a smartphone or laptop for recycling?',
      options: [
        'Wash the screen with water',
        'Backup data, log out of accounts, and perform a factory reset',
        'Crack open the casing with a screwdriver',
        'Wrap it tightly in plastic wrap',
      ],
      correctAnswer: 1,
      explanation: 'Always backup your personal files, remove SIM and SD cards, and perform a factory data wipe to protect your privacy and identity.',
    },
    {
      id: 4,
      question: 'Under environmental regulations (like India’s E-Waste Rules), what does "EPR" stand for?',
      options: [
        'Electronic Power Reduction',
        'Extended Producer Responsibility',
        'Eco Plastic Recycling',
        'Environmental Plant Restoration',
      ],
      correctAnswer: 1,
      explanation: 'Extended Producer Responsibility (EPR) mandates that electronic manufacturers take financial and operational responsibility for collecting and recycling end-of-life products.',
    },
    {
      id: 5,
      question: 'Why must lithium-ion rechargeable batteries NEVER be thrown into standard municipal garbage bins?',
      options: [
        'They emit unpleasant odors',
        'They can be crushed or punctured in waste compactors, sparking violent chemical fires',
        'They stop garbage trucks from moving',
        'They attract stray animals',
      ],
      correctAnswer: 1,
      explanation: 'Punctured or damaged lithium-ion batteries undergo thermal runaway and can cause violent, toxic fires inside waste collection vehicles and sorting depots.',
    },
  ];

  // Quiz State
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (submitted) return;
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(userAnswers).length < quizQuestions.length) {
      alert('Please answer all 5 questions before submitting the quiz.');
      return;
    }
    setSubmitted(true);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  // Calculate score
  const score = Object.keys(userAnswers).reduce((acc, qIndex) => {
    if (userAnswers[qIndex] === quizQuestions[qIndex].correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F3D2E] tracking-tight">
          E-Waste Taxonomy & Ecological Hazards
        </h1>
        <p className="text-[#3F584C] text-sm sm:text-base leading-relaxed">
          Electronics represent merely 2% of global solid waste by volume, yet account for over 70% of toxic heavy metals in municipal landfills.
        </p>
      </div>

      {/* Section 1: Taxonomy & Hazards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* What Counts */}
        <div className="bg-white border border-[#D6E5DC] rounded-2xl p-7 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#D6E5DC] pb-4">
            <div className="p-2 bg-[#E8F5EE] text-[#0F3D2E] rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-[#2FA36B]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F3D2E]">Eligible E-Waste Streams</h2>
              <span className="text-xs text-[#6B8477]">Accepted for free EcoCycle collection</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-[#12261D] pt-1">
            <li className="flex items-start gap-2.5">
              <span className="text-[#2FA36B] font-bold">✓</span>
              <span><strong>IT & Computing:</strong> Laptops, desktop motherboards, monitors, tablets, networking routers, cables, server racks.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#2FA36B] font-bold">✓</span>
              <span><strong>Personal Gadgets:</strong> Smartphones, feature phones, smartwatches, earbuds, digital cameras, gaming consoles.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#2FA36B] font-bold">✓</span>
              <span><strong>Small Appliances:</strong> Microwaves, electric kettles, vacuum cleaners, power adapters, electric shavers.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#2FA36B] font-bold">✓</span>
              <span><strong>Power Cells:</strong> Swollen lithium-ion batteries, laptop power bricks, power banks, inverter UPS units.</span>
            </li>
          </ul>
        </div>

        {/* The Toxic Hazard Dossier */}
        <div className="bg-white border border-[#D6E5DC] rounded-2xl p-7 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#D6E5DC] pb-4">
            <div className="p-2 bg-[#FEE2E2] text-[#DC2626] rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F3D2E]">Toxic Chemical Hazards</h2>
              <span className="text-xs text-[#6B8477]">Why landfill dumping and open burning are lethal</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-[#12261D] pt-1">
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#EDF3EF] text-[#0F3D2E] mt-0.5">Pb</span>
              <span><strong>Lead:</strong> Found in circuit solder and CRT funnel glass. Known neurotoxin causing severe kidney failure and childhood developmental impairments.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#EDF3EF] text-[#0F3D2E] mt-0.5">Hg</span>
              <span><strong>Mercury:</strong> Used in fluorescent backlights and tilt switches. Bioaccumulates up freshwater food chains, causing central nervous system decay.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#EDF3EF] text-[#0F3D2E] mt-0.5">Cd</span>
              <span><strong>Cadmium:</strong> Present in chip resistors and older rechargeable cells. Inhalation and groundwater absorption trigger irreversible bone demineralization.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Section 2: 5 Golden Rules */}
      <div className="bg-white rounded-2xl border border-[#D6E5DC] p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F3D2E]">
            Five Golden Rules for Citizen E-Waste Handling
          </h2>
          <p className="text-xs sm:text-sm text-[#3F584C] mt-1">
            Crucial precautions before surrendering obsolete hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#D6E5DC] space-y-1.5">
            <span className="text-xs font-bold text-[#2FA36B]">Rule 01</span>
            <h3 className="font-bold text-[#0F3D2E] text-sm">Wipe & Factory Reset</h3>
            <p className="text-xs text-[#3F584C] leading-relaxed">
              Back up files and factory-erase flash storage to safeguard personal data and credentials.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#D6E5DC] space-y-1.5">
            <span className="text-xs font-bold text-[#2FA36B]">Rule 02</span>
            <h3 className="font-bold text-[#0F3D2E] text-sm">Never Puncture Batteries</h3>
            <p className="text-xs text-[#3F584C] leading-relaxed">
              Do not pierce swollen lithium cells. Contact with oxygen triggers spontaneous thermal runaway fires.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#D6E5DC] space-y-1.5">
            <span className="text-xs font-bold text-[#2FA36B]">Rule 03</span>
            <h3 className="font-bold text-[#0F3D2E] text-sm">Only Use CPCB Facilities</h3>
            <p className="text-xs text-[#3F584C] leading-relaxed">
              Ensure handlers operate closed-loop wet-scrubber demanufacturing under pollution board compliance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#D6E5DC] space-y-1.5">
            <span className="text-xs font-bold text-[#2FA36B]">Rule 04</span>
            <h3 className="font-bold text-[#0F3D2E] text-sm">Bundle Small Wiring</h3>
            <p className="text-xs text-[#3F584C] leading-relaxed">
              Tie cables and charging blocks together. High-grade copper in wiring is 100% recyclable.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#D6E5DC] space-y-1.5">
            <span className="text-xs font-bold text-[#2FA36B]">Rule 05</span>
            <h3 className="font-bold text-[#0F3D2E] text-sm">Coordinate Neighborhood Drives</h3>
            <p className="text-xs text-[#3F584C] leading-relaxed">
              Share EcoCycle across your apartment association or college hostel for consolidated collection routes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0F3D2E] text-white flex flex-col justify-center space-y-1">
            <span className="text-xs font-bold text-[#F2B134]">Ready for the challenge?</span>
            <h3 className="font-bold text-white text-sm">Take the 5-Question Quiz</h3>
            <p className="text-xs text-[#D1EBE0]">
              Test your knowledge below to verify your environmental literacy.
            </p>
          </div>
        </div>
      </div>

      {/* Non-Profit Civic Clarification (Subtle Architectural Card - Zero Side-Tab Tell) */}
      <div className="bg-white border border-[#D6E5DC] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="p-2.5 bg-[#E8F5EE] text-[#0F3D2E] rounded-xl shrink-0">
            <HelpCircle className="w-5 h-5 text-[#2FA36B]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#0F3D2E]">
              Why is EcoCycle a Non-Profit Service? Do I Get Paid For My E-Waste?
            </h3>
            <p className="text-xs sm:text-sm text-[#3F584C] leading-relaxed">
              <strong>No, EcoCycle does not purchase devices for cash.</strong> Commercial re-commerce websites (like Cashify or OLX) only buy working smartphones that they can resell for profit, leaving behind 80% of hazardous e-waste (burnt cables, smashed displays, swollen batteries, dead appliances).
            </p>
            <p className="text-xs sm:text-sm text-[#3F584C] leading-relaxed">
              <strong>EcoCycle operates on a civic utility / NGO aggregation model:</strong> Citizens surrender obsolete or broken devices for <strong>100% free</strong>, and we aggregate these small collections to deliver them in bulk to authorized formal dismantling plants (CPCB/KSPCB certified). This ensures dangerous heavy metals are chemically neutralized rather than poisoned into municipal water or burned in informal open-air scrap yards.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Interactive 5-Question Challenge */}
      <div className="bg-white rounded-2xl border border-[#D6E5DC] p-6 sm:p-10 shadow-xs space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6E5DC] pb-6">
          <div>
            <span className="text-xs font-bold text-[#2FA36B] uppercase tracking-wider">
              Interactive Assessment
            </span>
            <h2 className="text-2xl font-extrabold text-[#0F3D2E] mt-0.5">
              The 5-Question E-Waste Challenge
            </h2>
          </div>

          {submitted && (
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#B4CFC1] rounded-lg text-xs font-bold text-[#0F3D2E] hover:bg-[#EDF3EF] transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Challenge
            </button>
          )}
        </div>

        {/* Score Banner when submitted */}
        {submitted && (
          <div className={`p-6 rounded-xl text-center space-y-2 border ${
            score >= 4 
              ? 'bg-[#E8F5EE] border-[#B4CFC1] text-[#0F3D2E]' 
              : score >= 3
              ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
              : 'bg-[#FEE2E2] border-[#FECACA] text-[#991B1B]'
          }`}>
            <Award className="w-8 h-8 mx-auto text-[#2FA36B]" />
            <h3 className="text-xl font-bold">
              You scored {score} out of {quizQuestions.length}
            </h3>
            <p className="text-xs sm:text-sm">
              {score === 5 && '🌟 Perfect Score! You are a certified EcoCycle Green Champion.'}
              {score >= 3 && score < 5 && '👏 Solid score! You demonstrate reliable awareness of safe electronic retirement.'}
              {score < 3 && '🌱 Good effort! Review the explanations below to master safe e-waste handling.'}
            </p>
          </div>
        )}

        {/* Quiz Form */}
        <form onSubmit={handleQuizSubmit} className="space-y-6">
          {quizQuestions.map((q, qIndex) => {
            const isAnswered = userAnswers[qIndex] !== undefined;
            const isCorrect = userAnswers[qIndex] === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-[#D6E5DC] bg-[#F8FAF8] space-y-3"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-[#0F3D2E] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <h3 className="font-bold text-[#0F3D2E] text-sm sm:text-base leading-snug">
                    {q.question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-9">
                  {q.options.map((option, optIndex) => {
                    const isSelected = userAnswers[qIndex] === optIndex;
                    let optionStyle = 'bg-white border-[#D6E5DC] text-[#12261D] hover:bg-[#EDF3EF]';

                    if (isSelected) {
                      optionStyle = 'bg-[#E8F5EE] border-[#2FA36B] text-[#0F3D2E] font-semibold ring-1 ring-[#2FA36B]';
                    }

                    if (submitted) {
                      if (optIndex === q.correctAnswer) {
                        optionStyle = 'bg-[#2FA36B] text-white font-bold border-[#1C7C54]';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-[#DC2626] text-white font-bold border-[#B91C1C]';
                      } else {
                        optionStyle = 'bg-white border-[#D6E5DC] text-[#6B8477] opacity-60';
                      }
                    }

                    return (
                      <button
                        type="button"
                        key={optIndex}
                        onClick={() => handleSelectOption(qIndex, optIndex)}
                        disabled={submitted}
                        className={`text-left p-3 rounded-lg border text-xs sm:text-sm transition duration-150 flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {submitted && optIndex === q.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-white ml-2" />
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 shrink-0 text-white ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback explanation when submitted */}
                {submitted && (
                  <div className="ml-9 p-3 bg-white rounded-lg border border-[#D6E5DC] text-xs text-[#3F584C] space-y-1">
                    <span className="font-bold text-[#0F3D2E] block">Scientific Rationale:</span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Quiz Button */}
          {!submitted && (
            <div className="text-center pt-2">
              <button
                type="submit"
                className="bg-[#0F3D2E] hover:bg-[#1C7C54] active:scale-[0.98] text-white font-bold px-8 py-3 rounded-xl text-sm transition shadow-xs"
              >
                Submit Answers & View Score
              </button>
            </div>
          )}
        </form>

      </div>

    </div>
  );
}
