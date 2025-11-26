import React from "react"

export const AppFooter = () =>
{
    return (
        <footer className="border-t border-purple-700/50 bg-black/85 px-4 py-4 text-center text-sm text-purple-200">
            © {new Date().getFullYear()} CareerLift AI. Powered by Gemini & BigQuery. Designed by our team 💜
        </footer>
    )
}