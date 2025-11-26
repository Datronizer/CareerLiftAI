import { Award, Loader, PieChart, Search, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IconCard from "../components/IconCard";
import React, { FC } from "react";

const DashboardPage: FC<{ analysisData: any; isAuthReady: boolean; isLoading: boolean }> = ({ analysisData, isAuthReady, isLoading }) =>
{
    const navigate = useNavigate();

    if (!isAuthReady || isLoading)
    {
        return (
            <div className="flex flex-col items-center gap-3 px-4 py-10 text-center text-slate-50">
                <Loader className="h-10 w-10 animate-spin text-cyan-300 drop-shadow-glow" />
                <p className="muted">Loading analysis data...</p>
            </div>
        );
    }

    if (!analysisData)
    {
        return (
            <div className="space-y-3 px-4 py-8 text-center">
                <h2 className="section-title">No Analysis Found</h2>
                <p className="section-subtitle">It looks like you haven't completed an analysis yet.</p>
                <button onClick={() => navigate("/upload")} className="btn btn-primary shadow-glow">
                    Start a New Analysis
                </button>
            </div>
        );
    }

    const { resumeScore, missingSkills, summary, careerGoal } = analysisData;
    const scoreColor =
        resumeScore >= 80
            ? "text-emerald-300"
            : resumeScore >= 60
                ? "text-amber-300"
                : "text-rose-300";

    return (
        <div className="mx-auto max-w-5xl space-y-5 px-4 py-4 md:px-6">
            <h2 className="section-title">Your Career Report</h2>
            <p className="section-subtitle">
                Analysis for target role: <span className="font-semibold text-cyan-300">{careerGoal}</span>
            </p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <IconCard icon={PieChart} title="Resume Score" className="h-full">
                    <div className={`my-2 text-center text-5xl font-extrabold md:text-6xl ${scoreColor}`}>
                        {resumeScore}%
                    </div>
                    <p className="muted text-center text-sm">Benchmark against current market needs.</p>
                </IconCard>

                <IconCard icon={Award} title="AI Summary" className="h-full md:col-span-2">
                    <p className="border-l-4 border-cyan-300/65 pl-3 text-slate-100/90 italic">{summary}</p>
                </IconCard>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <IconCard icon={Search} title="Crucial Missing Skills" className="h-full">
                    <p className="muted">Focus on mastering these high-demand areas to bridge your gap:</p>
                    <ul className="mt-2 flex flex-col gap-3">
                        {missingSkills.map((skill, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-3 rounded-xl border border-rose-400/50 bg-rose-900/30 px-3 py-2 font-semibold text-rose-100"
                            >
                                <span className="text-rose-300">•</span>
                                {skill}
                            </li>
                        ))}
                    </ul>
                </IconCard>

                <IconCard icon={Zap} title="Next Steps" className="h-full">
                    <p className="muted">
                        You have a clear path forward. Dive into the detailed plan to start leveling up your
                        profile today.
                    </p>
                    <button
                        onClick={() => navigate("/recommendations")}
                        className="btn btn-primary shadow-glow mt-3 w-full"
                    >
                        View Personalized Recommendations →
                    </button>
                </IconCard>
            </div>
        </div>
    );
};

export default DashboardPage;
