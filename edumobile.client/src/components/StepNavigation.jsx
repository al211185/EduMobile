import React from "react";

const StepNavigation = ({ steps, currentStep, onStepChange }) => {
    return (
        <nav className="flex justify-center mb-4 space-x-2">
            {steps.map((label, idx) => {
                const step = idx + 1;
                const active = step === currentStep;
                return (
                    <button
                        key={step}
                        onClick={() => onStepChange(step)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${active ? "bg-[#4F46E5] text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                        aria-label={`Ir a ${label}`}
                    >
                        {step}
                    </button>
                );
            })}
        </nav>
    );
};

export default StepNavigation;