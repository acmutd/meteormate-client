import React from 'react';

interface MeteorCardProps {
  children: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
  className?: string;
}

const MeteorCard: React.FC<MeteorCardProps> = ({ 
  children, 
  logoSrc, 
  logoAlt = "Logo",
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      {/* Logo peeking out the top */}
      <div className="absolute -top-13 left-1/2 transform -translate-x-1/2 z-10">
        <img 
          src={logoSrc}
          alt={logoAlt}
          className="w-30 h-30"
          style={{ 
            filter: `
              drop-shadow(1px 1px 0 white) 
              drop-shadow(-1px 1px 0 white)
              drop-shadow(1px -1px 0 white)
            ` 
          }}
        />
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 pt-16 min-w-fit whitespace-nowrap">
        {children}
      </div>
    </div>
  );
};

export default MeteorCard;