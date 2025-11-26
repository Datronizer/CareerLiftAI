import React, { useEffect, useState } from "react";
import { Award, Loader, PieChart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IconCard from "../components/IconCard";
import { fetchJobMatches } from "../services/api";


const JobMatchPage = ({ analysisData }) =>
{
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [location, setLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const skills = analysisData?.missingSkills || [];
    const jobTitle = analysisData?.careerGoal || "";

    const loadJobs = async (loc) =>
    {
        setIsLoading(true);
        setError(null);
        try
        {
            const result = await fetchJobMatches({
                skills,
                location: loc || location,
                jobTitle,
            });
            setJobs(result.jobs || []);
        } catch (e)
        {
            setError(e.message);
            setJobs([]);
        } finally
        {
            setIsLoading(false);
        }
    };

    useEffect(() =>
    {
        if (jobTitle)
        {
            loadJobs(location);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobTitle, JSON.stringify(skills)]);

    if (!analysisData)
    {
        return (
            <div className="space-y-3 px-4 py-8 text-center">
                <p className="section-subtitle text-rose-300">Analysis data is missing.</p>
                <button
                    onClick={() => navigate("/upload")}
                    className="btn btn-primary shadow-glow"
                >
                    Go to Upload Page
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-4 px-4 py-4 md:px-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="section-title">Job Matches</h2>
                    <p className="section-subtitle">
                        Tailored to: <span className="font-semibold text-cyan-300">{jobTitle}</span>
                    </p>
                </div>
                <button
                    onClick={() => navigate("/recommendations")}
                    className="btn btn-ghost"
                >
                    Back to Plan
                </button>
            </div>

            <IconCard icon={Search} title="Filters" className="h-full">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(260px,1fr)_minmax(180px,220px)] md:items-end">
                    <div className="space-y-2">
                        <label className="field-label">Preferred Location (optional)</label>
                        <input
                            className="input"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Toronto, Remote"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => loadJobs(location)}
                            className="btn btn-secondary shadow-glow w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Searching…" : "Find Jobs"}
                        </button>
                    </div>
                </div>
                <p className="muted small">Using your missing skills and target role to find relevant openings.</p>
            </IconCard>

            <div className="flex flex-col gap-3">
                {error && <div className="alert alert-error">{error}</div>}
                {isLoading ? (
                    <IconCard icon={Loader} title="Loading jobs..." className="h-full">
                        <div className="h-2.5 overflow-hidden rounded-full border border-cyan-300/35 bg-slate-900/60">
                            <div className="h-full w-full bg-gradient-to-r from-cyan-300 to-blue-500 progress-bar-shimmer" />
                        </div>
                    </IconCard>
                ) : jobs.length ? (
                    jobs.map((job, idx) => (
                        <IconCard
                            key={idx}
                            icon={PieChart}
                            title={`${job.job_title || "Role"} @ ${job.company || "Company"}`}
                            className="h-full"
                        >
                            <div className="grid gap-1 text-sm text-slate-200/85 md:text-base">
                                <p><span className="font-bold text-cyan-300">Location:</span> {job.location || "N/A"}</p>
                                <p><span className="font-bold text-cyan-300">Skills:</span> {job.skills || "N/A"}</p>
                                <p><span className="font-bold text-cyan-300">Qualifications:</span> {job.qualifications || "N/A"}</p>
                                <p><span className="font-bold text-cyan-300">Salary:</span> {job.salary_range || "N/A"}</p>
                                <p><span className="font-bold text-cyan-300">Work Type:</span> {job.work_type || "N/A"}</p>
                            </div>
                        </IconCard>
                    ))
                ) : (
                    <IconCard icon={Award} title="No jobs found" className="h-full">
                        <p className="muted small">
                            We couldn't find matches right now. Try adjusting the location or check back later.
                        </p>
                    </IconCard>
                )}
            </div>
        </div>
    );
};

export default JobMatchPage;
