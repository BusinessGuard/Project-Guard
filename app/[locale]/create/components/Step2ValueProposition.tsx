"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { TbChecks } from "react-icons/tb";
import { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";

const problemGuidelines = [
  "Describe the specific customer pain",
  "How often does this problem occur?",
  "How much time/money does the customer lose?",
  "How do customers solve this problem now?",
];

const solutionGuidelines = [
  "What exactly does your product do?",
  "How does it solve the problem?",
  "What is the core functionality?",
];

const solutionUniquenessGuidelines = [
  "What makes your product fundamentally different?",
  "Why can't customers achieve the same result another way?",
  "Do you have technological advantage, data, network, or other protection from copying?",
];

const measurableValueGuidelines = [
  "Time savings (in hours)",
  "Cost savings (in €)",
  "Revenue/profit growth (in %)",
  "Other measurable metrics",
];

export function Step2ValueProposition() {
  const { projectData, updateValueProposition } = useProjectStore();
  const { problem, solution, solutionUniqueness, advantages, measurableValue } = projectData.valueProposition;
  const [currentAdvantage, setCurrentAdvantage] = useState("");

  const handleAddAdvantage = () => {
    if (currentAdvantage.trim()) {
      updateValueProposition({ advantages: [currentAdvantage.trim(), ...advantages] });
      setCurrentAdvantage("");
    }
  };

  const handleRemoveAdvantage = (index: number) => {
    updateValueProposition({ advantages: advantages.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Value Proposition</h2>
        <p className="text-sm text-slate-600">Define your unique value</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="problem" className="text-sm font-semibold">
              1.1. Main customer problem <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="problem"
              placeholder="Describe the specific pain point your customers face..."
              className="min-h-[120px]"
              value={problem}
              onChange={(e) => updateValueProposition({ problem: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${problem ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {problem && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {problemGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Startup founders spend 100+ hours creating business plans and pitch decks, not knowing if they're ready for investor meetings. 80% get rejected due to obvious gaps that could have been fixed in advance."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="solution" className="text-sm font-semibold">
              1.2. Your solution <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="solution"
              placeholder="Describe what your product does and how it solves the problem..."
              className="min-h-[120px]"
              value={solution}
              onChange={(e) => updateValueProposition({ solution: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${solution ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {solution && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {solutionGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "AI-powered platform that analyzes your business model, identifies weak points, and generates investor-ready pitch deck in 15 minutes. Includes 6 specialized AI experts for different aspects: market analysis, financials, competition, risks, etc."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="solutionUniqueness" className="text-sm font-semibold">
              1.3. Uniqueness of your solution <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="solutionUniqueness"
              placeholder="What makes your product fundamentally different..."
              className="min-h-[120px]"
              value={solutionUniqueness}
              onChange={(e) => updateValueProposition({ solutionUniqueness: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${solutionUniqueness ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {solutionUniqueness && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {solutionUniquenessGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "We use a system of 6 AI experts (not just one GPT prompt), each with specialization. Our database includes 1000+ analyzed startups, allowing us to provide industry benchmarks."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              1.4. Key advantages over competitors <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-slate-500">Add 3-5 specific advantages (minimum 3 required)</p>
            
            <div className="border border-slate-200 overflow-hidden rounded-md">
              
              
              <div className="p-2 bg-white border-b border-slate-200">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter advantage and click Add"
                    className="h-10 flex-1"
                    value={currentAdvantage}
                    onChange={(e) => setCurrentAdvantage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAdvantage();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    className="h-10 px-4"
                    onClick={handleAddAdvantage}
                    disabled={!currentAdvantage.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {advantages.length > 0 && (
                <div className="divide-y divide-slate-200">
                  {advantages.map((advantage, index) => (
                    <div key={index} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                      <span className="text-xs font-semibold text-slate-500 min-w-[24px]">{index + 1}.</span>
                      <span className="text-sm text-slate-900 flex-1">{advantage}</span>
                      <button
                        type="button"
                        className="group/btn ml-4 hover:bg-red-50 rounded-full p-1.5 transition-colors"
                        onClick={() => handleRemoveAdvantage(index)}
                      >
                        <IoMdClose className="h-4 w-4 text-blue-600 group-hover/btn:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${advantages.length > 0 ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {advantages.length > 0 && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-slate-600 italic">
              Example: "Analysis in 30 seconds instead of 2 weeks with consultants" • "Price €99 instead of €5,000 for consulting" • "Specific growth plan with steps, not general advice"
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="measurableValue" className="text-sm font-semibold">
              1.5. Measurable value for customer <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="measurableValue"
              placeholder="Quantify the value you create..."
              className="min-h-[100px]"
              value={measurableValue}
              onChange={(e) => updateValueProposition({ measurableValue: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${measurableValue ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {measurableValue && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {measurableValueGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Save 100 hours of founder's time (€5,000 equivalent). Increase funding probability from 5% to 25%. Reduce time to funding by 3 months."
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            Tip: Be specific with numbers and metrics. Investors value quantifiable results.
          </p>
        </div>
      </div>
    </div>
  );
}
