const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Parking Sign Background */}
      <rect x="20" y="15" width="60" height="70" rx="8" fill="#3B82F6" />
      <rect x="20" y="15" width="60" height="70" rx="8" stroke="#1E40AF" strokeWidth="2" />
      
      {/* Parking Lines Pattern */}
      <line x1="30" y1="25" x2="30" y2="75" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="50" y1="25" x2="50" y2="75" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="70" y1="25" x2="70" y2="75" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      
      {/* Car Icon */}
      <g transform="translate(35, 40)">
        {/* Car Body */}
        <rect x="0" y="8" width="30" height="18" rx="3" fill="#FFFFFF" />
        {/* Car Windows */}
        <rect x="4" y="12" width="8" height="6" rx="1" fill="#3B82F6" />
        <rect x="18" y="12" width="8" height="6" rx="1" fill="#3B82F6" />
        {/* Car Wheels */}
        <circle cx="6" cy="26" r="3.5" fill="#1E40AF" />
        <circle cx="24" cy="26" r="3.5" fill="#1E40AF" />
        {/* Car Base */}
        <rect x="0" y="26" width="30" height="4" fill="#1E40AF" />
      </g>
      
      {/* "P" Letter for Parking - Bold and Clear */}
      <text
        x="50"
        y="60"
        fontSize="32"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        stroke="#1E40AF"
        strokeWidth="0.5"
      >
        P
      </text>
    </svg>
  );
};

export default Logo;

