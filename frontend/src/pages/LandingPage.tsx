import React from "react";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () =>
{
    const navigate = useNavigate();

    return (
        <div className="mx-4 my-6 max-w-4xl rounded-3xl border border-purple-400/50 bg-gradient-to-br from-purple-900/70 via-slate-900/90 to-slate-950/80 px-6 py-8 text-center shadow-2xl backdrop-blur-xl md:mx-auto md:px-10 md:py-12">
            <Zap className="mx-auto mb-5 h-16 w-16 text-yellow-300 drop-shadow-glow" />
            <h1 className="section-title">CareerLift AI</h1>
            <p className="mt-4 mx-auto max-w-3xl text-lg text-slate-100/90 md:text-xl">
                Unlock your potential with personalized career growth plans. Analyze your
                resume against industry standards, powered by Gemini AI and real-time
                Google grounding.
            </p>
            <p className="mt-3 text-sm text-purple-200/80">
                Supporting UN SDG 4 (Quality Education), 8 (Decent Work), and 10 (Reduced
                Inequalities).
            </p>
            <button
                onClick={() => navigate("/upload")}
                className="btn btn-primary shadow-glow mt-6 px-6"
            >
                Start Your Analysis
            </button>
        </div>
    );
};

export default LandingPage;
