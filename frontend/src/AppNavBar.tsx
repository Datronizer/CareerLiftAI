import { Home, UploadCloud, PieChart, Search, Award, Zap } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";
import AppRouter from "./AppRouter";

export const AppNavBar = ({
    analysisData,
    setAnalysisData,
    db,
    userId,
    isAuthReady,
    isLoadingAnalysis,
}) =>
{

    const navItems = [
        { name: "Home", path: "/", icon: Home },
        { name: "Analyze", path: "/upload", icon: UploadCloud },
        { name: "Report", path: "/dashboard", icon: PieChart },
        { name: "Jobs", path: "/jobs", icon: Search },
        { name: "All Courses", path: "/courses", icon: Award },
    ];

    const navLinkBase =
        "flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm font-semibold text-slate-200/80 transition hover:border-purple-400/50 hover:bg-purple-950/40 hover:text-white";
    const navLinkActive =
        "bg-gradient-to-r from-cyan-300 to-purple-500 text-slate-900 shadow-[0_12px_30px_rgba(132,204,255,0.35)]";

    return (
        <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,#4c1d95_0,#020617_55%)] text-slate-50">
            <header className="sticky top-0 z-10 border-b border-purple-500/45 bg-[linear-gradient(90deg,rgba(88,28,135,0.9),rgba(49,46,129,0.9),rgba(0,0,0,0.9))] shadow-2xl backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="flex items-center text-xl font-extrabold tracking-tight text-slate-50 md:text-2xl">
                        <Zap className="mr-2 h-6 w-6 text-yellow-300 drop-shadow-glow" />
                        <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                            CareerLift AI
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `${navLinkBase} ${isActive ? navLinkActive : ""}`
                                }
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </header>

            <div className="border-b border-purple-700/60 bg-black/60 px-4 py-2 text-center text-xs text-purple-200">
                User ID (for persistence):{" "}
                <span className="break-all font-mono text-cyan-300">{userId || "Authenticating..."}</span>
            </div>

            <main className="flex-1 px-4 pb-6 pt-4 md:px-6">
                <AppRouter
                    analysisData={analysisData}
                    setAnalysisData={setAnalysisData}
                    db={db}
                    userId={userId}
                    isAuthReady={isAuthReady}
                    isLoadingAnalysis={isLoadingAnalysis}
                />
            </main>

            <footer className="border-t border-purple-700/50 bg-black/85 px-4 py-4 text-center text-sm text-purple-200">
                © {new Date().getFullYear()} CareerLift AI. Powered by Gemini & BigQuery. Designed by our team 💜
            </footer>
        </div>
    );
}