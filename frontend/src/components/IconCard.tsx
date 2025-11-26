import React, { FC } from "react";

type IconCardProps = {
    icon: FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    children: React.ReactNode;
    className?: string;
}
const IconCard: FC<IconCardProps> = ({ icon: Icon, title, children, className = "" }) => (
    <div
        className={`rounded-2xl border border-purple-400/40 bg-gradient-to-br from-purple-900/80 to-indigo-900/85 p-5 shadow-2xl backdrop-blur-xl ${className}`}
    >
        <div className="mb-3 flex items-center text-cyan-300">
            <Icon className="mr-3 h-6 w-6 drop-shadow-glow" />
            <h3 className="m-0 text-xl font-bold text-slate-50">{title}</h3>
        </div>
        {children}
    </div>
);

export default IconCard;
