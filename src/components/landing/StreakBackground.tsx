// components/StreakBackground.tsx
export default function StreakBackground() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
            <div className="streak1 absolute left-[-55%] top-[27%] h-32 w-[110%] -rotate-[4deg] bg-[radial-gradient(50%_50%_at_50%_50%,#FF9100_20%,#E85D04_60%,transparent_100%)] mix-blend-hard-light blur-2xl sm:top-[26%] sm:h-36" />
            <div className="streak2 absolute right-[-40%] top-[48%] h-20 w-[136%] -rotate-[7deg] bg-[radial-gradient(50%_50%_at_50%_50%,#FF9100_20%,#E85D04_60%,transparent_100%)] mix-blend-hard-light blur-xl sm:top-[47%] sm:h-24" />
            <div className="streak3 absolute right-[-24%] top-[60%] h-24 w-[142%] rotate-[16.63deg] bg-[radial-gradient(50%_50%_at_50%_50%,#FF9100_20%,#E85D04_60%,transparent_100%)] mix-blend-hard-light blur-2xl sm:top-[68%] sm:h-28" />
            <div className="streak4 absolute right-[-9rem] top-[84%] h-[clamp(18rem,42vw,36rem)] w-[clamp(18rem,42vw,36rem)] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#FF9100_54.81%,#E85D04_100%)] mix-blend-hard-light blur-3xl" />
            <div className="streak5 absolute left-[-6rem] top-[86%] h-[clamp(15rem,34vw,28rem)] w-[clamp(15rem,34vw,28rem)] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#FF9100_54.81%,#E85D04_100%)] mix-blend-hard-light blur-2xl" />
        </div>
    );
}