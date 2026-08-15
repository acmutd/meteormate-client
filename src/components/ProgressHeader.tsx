interface ProgressHeaderProps {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps?: number;
  progressImage?: string;
}

export default function ProgressHeader({ 
    title, 
    subtitle, 
    currentStep, 
    totalSteps = 7,
    progressImage
}: ProgressHeaderProps) {
    const progressPercent = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full max-w-xl mx-auto mb-4 mt-4">
            <h1 className="text-2xl font-bold text-center">
                {title}
            </h1>
            <p className="text-center text-md text-gray-600 mb-6">
                {subtitle}
            </p>
      
            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-2">
                <div 
                    className="h-full rounded-full transition-all duration-300 ease-out relative"
                    style={{
                        width: `${progressPercent}%`,
                        background: 'linear-gradient(to right, #FF9100, #FFC94C)'
                    }}
                >
                    <div 
                        className="absolute right-0 top-1/2 -translate-y-2/3 translate-x-1/2 z-10"
                    >
                        <img 
                            src={progressImage}
                            alt="Progress Indicator"
                            className="w-12 h-12 object-contain max-w-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
