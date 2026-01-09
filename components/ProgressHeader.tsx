interface ProgressHeaderProps {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps?: number;
}

export default function ProgressHeader({ 
  title, 
  subtitle, 
  currentStep, 
  totalSteps = 5
}: ProgressHeaderProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-4 mt-4">
      <h1 className="text-2xl font-bold text-center">
        {title}
      </h1>
      <p className="text-center text-md text-gray-600 mb-2">
        {subtitle}
      </p>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: 'linear-gradient(to right, #FF9100, #FFC94C)'
          }}
        />
      </div>
    </div>
  );
}
