import React, { useEffect, useState } from "react";
import AppRouter from "./AppRouter";
import { useAnalysisData } from "./hooks/useAnalysisData";
import { useFirebase } from "./hooks/useFirebase";
import { AppNavBar } from "./AppNavBar";
import { AppFooter } from "./AppFooter";

export default function App()
{
    // Analysis data stored in memory and persisted to localStorage
    const [analysisData, setAnalysisData] = useState(() =>
    {
        try
        {
            const raw = localStorage.getItem("analysisData");
            return raw ? JSON.parse(raw) : null;
        }
        catch
        {
            return null;
        }
    });

    // Firebase Hook
    const { db, userId, isAuthReady } = useFirebase();
    const { analysis: latestAnalysis, isLoading: isLoadingAnalysis } =
        useAnalysisData(db, userId, isAuthReady);

    // When Firestore yields the latestAnalysis, update local and persist it
    useEffect(() =>
    {
        if (isAuthReady && latestAnalysis)
        {
            setAnalysisData(latestAnalysis);
            try
            {
                localStorage.setItem("analysisData", JSON.stringify(latestAnalysis));
            } catch
            {
                // ignore localStorage failures
            }
        }
    }, [isAuthReady, latestAnalysis]);

    // Set the latest loaded analysis data once Firebase is ready if not already set
    useEffect(() =>
    {
        if (!analysisData && isAuthReady && latestAnalysis)
        {
            setAnalysisData(latestAnalysis);
        }
    }, [isAuthReady, latestAnalysis, analysisData]);

    // Whenever analysisData is updated in memory persist it
    useEffect(() =>
    {
        try
        {
            if (analysisData)
            {
                localStorage.setItem("analysisData", JSON.stringify(analysisData));
            }
        } catch
        {
            // ignore
        }
    }, [analysisData]);

    
    return (
        <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,#4c1d95_0,#020617_55%)] text-slate-50">
            <AppNavBar
                analysisData={analysisData}
                setAnalysisData={setAnalysisData}
                db={db}
                userId={userId}
                isAuthReady={isAuthReady}
                isLoadingAnalysis={isLoadingAnalysis}
            />

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

            <AppFooter />
        </div>
    );
}
