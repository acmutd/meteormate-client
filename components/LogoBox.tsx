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
    <div className={`relative w-auto max-w-md justify-center items-center ${className}`}>
      {/* Logo peeking out the top */}
      <div className="absolute  justify-center -top-10 left-1/2 transform -translate-x-1/2 z-10">
        <img 
          src={logoSrc}
          alt={logoAlt}
          className="w-40 h-40"
          style={{ 
            filter: `
              drop-shadow(1px 1px 0 white) 
              drop-shadow(-1px 1px 0 white)
              drop-shadow(1px -1px 0 white)
            ` 
          }}
        />
      </div>
      <div className="bg-white rounded-2xl shadow-xl px-16 py-30 min-w-fit whitespace-nowrap">
        {children}
      </div>
    </div>
  );
};

export default MeteorCard;