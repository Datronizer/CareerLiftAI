import React, { useEffect, useState } from "react";
import { Award, Loader, Search, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IconCard from "../components/IconCard";
import { fetchLearningResources } from "../services/api";

const RecommendationsPage = ({ analysisData }) =>
{
    const navigate = useNavigate();
    const [learning, setLearning] = useState(null);
    const [isFetchingCourses, setIsFetchingCourses] = useState(false);
    const [courseError, setCourseError] = useState(null);

    if (!analysisData)
    {
        return (
            <div className="space-y-3 px-4 py-8 text-center">
                <p className="section-subtitle text-rose-300">Analysis data is missing.</p>
                <button onClick={() => navigate("/upload")} className="btn btn-primary shadow-glow">
                    Go to Upload Page
                </button>
            </div>
        );
    }

    const { recommendations, sources = [], careerGoal, missingSkills = [] } =
        analysisData;

    useEffect(() =>
    {
        if (!careerGoal) return;
        setIsFetchingCourses(true);
        fetchLearningResources(careerGoal, missingSkills)
            .then((data) =>
            {
                setLearning(data);
                setCourseError(null);
            })
            .catch((err) => setCourseError(err.message))
            .finally(() => setIsFetchingCourses(false));
    }, [careerGoal, JSON.stringify(missingSkills)]);

    return (
        <div className="mx-auto max-w-5xl space-y-5 px-4 py-4 md:px-6">
            <h2 className="section-title">Personalized Action Plan</h2>
            <p className="section-subtitle">Based on your skill gaps and target career.</p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <IconCard icon={Award} title="Top Certifications & Courses">
                    <p className="muted">Gain formal knowledge and credentials:</p>
                    <ul className="mt-3 flex flex-col gap-3">
                        {recommendations.certifications.map((cert, index) => (
                            <li
                                key={index}
                                className="rounded-xl border-l-4 border-amber-300/80 bg-amber-900/30 px-4 py-3 font-semibold text-amber-50"
                            >
                                {cert}
                            </li>
                        ))}
                    </ul>
                </IconCard>

                <IconCard icon={Zap} title="Real-World Opportunities">
                    <p className="muted">Build a strong portfolio through hands-on experience:</p>
                    <ul className="mt-3 flex flex-col gap-3">
                        {recommendations.opportunities.map((opp, index) => (
                            <li
                                key={index}
                                className="rounded-xl border-l-4 border-blue-400/80 bg-blue-900/30 px-4 py-3 font-semibold text-blue-100"
                            >
                                {opp}
                            </li>
                        ))}
                    </ul>
                </IconCard>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <IconCard icon={Award} title="Live Course Picks (Gemini + Google Search)">
                    {isFetchingCourses ? (
                        <div className="inline-flex items-center gap-2 text-slate-200/90">
                            <Loader className="h-4 w-4 animate-spin" /> Fetching real courses...
                        </div>
                    ) : courseError ? (
                        <div className="alert alert-error">{courseError}</div>
                    ) : learning?.courses?.length ? (
                        <ul className="grid gap-3">
                            {learning.courses.map((course, idx) => (
                                <li
                                    key={idx}
                                    className="rounded-xl border border-purple-400/40 bg-slate-900/70 p-3 shadow-lg"
                                >
                                    <div className="text-lg font-bold text-slate-50">{course.title}</div>
                                    <div className="text-sm text-slate-200/80">
                                        {course.provider} • {course.duration || "Duration TBC"}
                                    </div>
                                    <div className="text-sm text-slate-200/80">{course.cost || ""}</div>
                                    <a
                                        className="text-sm font-semibold text-cyan-300 underline"
                                        href={course.link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Open
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="muted small">No live courses returned yet.</p>
                    )}
                </IconCard>

                <IconCard icon={Zap} title="Live Opportunities">
                    {isFetchingCourses ? (
                        <div className="inline-flex items-center gap-2 text-slate-200/90">
                            <Loader className="h-4 w-4 animate-spin" /> Fetching opportunities...
                        </div>
                    ) : courseError ? (
                        <div className="alert alert-error">{courseError}</div>
                    ) : learning?.opportunities?.length ? (
                        <ul className="grid gap-3">
                            {learning.opportunities.map((opp, idx) => (
                                <li
                                    key={idx}
                                    className="rounded-xl border border-purple-400/40 bg-slate-900/70 p-3 shadow-lg"
                                >
                                    <div className="text-lg font-bold text-slate-50">{opp.name}</div>
                                    <div className="text-sm text-slate-200/80">{opp.description || ""}</div>
                                    <div className="text-sm text-slate-200/80">{opp.difficulty || ""}</div>
                                    <a
                                        className="text-sm font-semibold text-cyan-300 underline"
                                        href={opp.link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Open
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="muted small">No live opportunities returned yet.</p>
                    )}
                </IconCard>
            </div>

            <IconCard icon={Search} title="AI Grounding Sources (Google Search)">
                <p className="muted">
                    The AI used the following current web sources to generate accurate advice:
                </p>
                <ul className="mt-2 grid gap-2">
                    {sources.length > 0 ? (
                        sources.map((source, index) => (
                            <li key={index} className="truncate text-cyan-300 underline">
                                <a
                                    href={source.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={source.title}
                                >
                                    {source.title || source.uri}
                                </a>
                            </li>
                        ))
                    ) : (
                        <li className="muted small">
                            No direct web sources cited (information based on the model's general knowledge and
                            structured response logic).
                        </li>
                    )}
                </ul>
            </IconCard>
        </div>
    );
};

export default RecommendationsPage;
