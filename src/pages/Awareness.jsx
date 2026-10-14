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
 * Awareness Page
 * Educational guide on e-waste taxonomy, hazards, and an interactive 5-question quiz.
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
    if (submitted) return; // Prevent changing after submission
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(userAnswers).length < quizQuestions.length) {
      alert('Please answer all 5 questions before submitting the quiz!');
      return;
    }
    setSubmitted(true);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  // Calculate score
  const score = quizQuestions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          E-Waste Literacy Guide
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          What Counts As E-Waste & Why It Matters
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Electronics make up only 2% of the municipal waste stream by volume, but account for over 70% of toxic heavy metals in our landfills.
        </p>
      </div>

      {/* Section 1: Taxonomy - What counts vs What does not */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* What Counts */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-7 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-950">What Counts As E-Waste?</h2>
              <span className="text-xs text-emerald-700 font-medium">Eligible for EcoCycle pickup</span>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-emerald-900/90 pt-2">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>IT & Telecommunications:</strong> Laptops, desktops, monitors, tablets, smartphones, routers, cables, server racks.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Consumer Electronics:</strong> TVs, soundbars, amplifiers, gaming consoles, camcorders, headphones.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Small Appliances:</strong> Microwaves, vacuum cleaners, electric kettles, toasters, power tools.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Batteries & Power Supplies:</strong> Lithium-ion battery packs, laptop adapters, power banks, UPS units.</span>
            </li>
          </ul>
        </div>

        {/* The Toxic Hazard */}
        <div className="bg-rose-50/60 border border-rose-200 rounded-3xl p-7 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-rose-950">Hazardous Substances Hidden Inside</h2>
              <span className="text-xs text-rose-700 font-medium">Why informal burning & dumping is catastrophic</span>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-rose-900/90 pt-2">
            <li className="flex items-start gap-2.5">
              <Flame className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Lead (Pb):</strong> Found in solder and CRT glass. Known neurotoxin causing severe kidney damage and developmental impairment in children.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Droplet className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Mercury (Hg):</strong> Present in CCFL backlight tubes and older switches. Bioaccumulates up aquatic food chains, poisoning freshwater reserves.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Cadmium (Cd):</strong> Used in chip resistors and older rechargeable batteries. Long-term exposure triggers bone fragility and pulmonary disease.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Section 2: 5 Golden Rules of E-Waste */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">
          The 5 Golden Rules for Responsible Electronic Ownership
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              1
            </span>
            <h3 className="font-bold text-slate-800 text-base">Wipe & Factory Reset</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Always backup important files, remove memory cards, and factory wipe devices to protect your personal identity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              2
            </span>
            <h3 className="font-bold text-slate-800 text-base">Never Dismantle at Home</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Do not smash CRT tubes or slice battery casings. Punctured lithium cells can catch fire in seconds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              3
            </span>
            <h3 className="font-bold text-slate-800 text-base">Use Certified Recyclers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hand devices only to state pollution control board (CPCB) authorized collectors with closed-loop extraction.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              4
            </span>
            <h3 className="font-bold text-slate-800 text-base">Bundle Small Cables</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Collect chargers, adapters, and earphone wires in a bag before pickup. Copper in wiring is 100% recyclable.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              5
            </span>
            <h3 className="font-bold text-slate-800 text-base">Spread Community Awareness</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share EcoCycle with your university department, hostel, or neighborhood to coordinate bulk pickup drives.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-600 text-white space-y-2 flex flex-col justify-center">
            <Sparkles className="w-8 h-8 text-emerald-200" />
            <h3 className="font-bold text-white text-base">Ready for the Quiz?</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Test your knowledge below to earn your Green Champion score!
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Interactive 5-Question Quiz */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" />
              Interactive Assessment
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              The 5-Question E-Waste Challenge
            </h2>
          </div>

          {submitted && (
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
          )}
        </div>

        {/* Score Banner when submitted */}
        {submitted && (
          <div className={`p-6 rounded-2xl text-center space-y-2 border ${
            score >= 4 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : score >= 3
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <Award className="w-10 h-10 mx-auto text-emerald-600" />
            <h3 className="text-2xl font-black">
              You scored {score} out of {quizQuestions.length}!
            </h3>
            <p className="text-sm">
              {score === 5 && '🌟 Perfect Score! You are a certified EcoCycle E-Waste Champion!'}
              {score >= 3 && score < 5 && '👏 Good job! You have solid awareness of responsible electronic disposal.'}
              {score < 3 && '🌱 Great effort! Review the explanations below to brush up on safe disposal practices.'}
            </p>
          </div>
        )}

        {/* Quiz Form */}
        <form onSubmit={handleQuizSubmit} className="space-y-8">
          {quizQuestions.map((q, qIndex) => {
            const isAnswered = userAnswers[qIndex] !== undefined;
            const isCorrect = userAnswers[qIndex] === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <h3 className="font-bold text-slate-800 text-base leading-snug">
                    {q.question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10">
                  {q.options.map((option, optIndex) => {
                    const isSelected = userAnswers[qIndex] === optIndex;
                    let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                    if (isSelected) {
                      optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-semibold ring-2 ring-emerald-300';
                    }

                    if (submitted) {
                      if (optIndex === q.correctAnswer) {
                        optionStyle = 'bg-emerald-500 text-white font-bold border-emerald-600';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-500 text-white font-bold border-rose-600';
                      } else {
                        optionStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        type="button"
                        key={optIndex}
                        onClick={() => handleSelectOption(qIndex, optIndex)}
                        disabled={submitted}
                        className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition duration-150 flex items-center justify-between ${optionStyle}`}
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
                  <div className="ml-10 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 block">Explanation:</span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Quiz Button */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-200 text-sm transition"
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
