import React, { memo } from 'react';

const SkillCard = memo(({ skill, color = 'cyan' }) => {
  const colors = {
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  };

  const colorClasses = colors[color] || colors.cyan;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="flex-shrink-0 relative"
      style={{ contain: 'layout style paint' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sketch-card px-4 py-3 flex items-center gap-2.5 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 h-full relative overflow-hidden">
        <div className={`sketch-lines absolute inset-0 pointer-events-none z-10 ${isHovered ? 'animate' : 'opacity-0'}`}>
          <svg className="absolute inset-0 w-full h-full dark:hidden" preserveAspectRatio="none">
            <rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 8" pathLength="10" className="sketch-line"/>
          </svg>
          <svg className="absolute inset-0 w-full h-full dark:hidden" preserveAspectRatio="none" style={{ filter: 'blur(6px)' }}>
            <rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="4 8" pathLength="10" className="sketch-line-blur"/>
          </svg>
          <svg className="absolute inset-0 w-full h-full hidden dark:block" preserveAspectRatio="none">
            <rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" fill="none" stroke="#c9e9ff" strokeWidth="2" strokeDasharray="4 8" pathLength="10" className="sketch-line"/>
          </svg>
          <svg className="absolute inset-0 w-full h-full hidden dark:block" preserveAspectRatio="none" style={{ filter: 'blur(8px)' }}>
            <rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" fill="none" stroke="#f8fcff" strokeWidth="4" strokeDasharray="4 8" pathLength="10" className="sketch-line-blur"/>
          </svg>
        </div>

        <div className={`p-2 rounded-full ${colorClasses} relative z-20 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
          {skill.icon}
        </div>
        <span className={`font-medium text-sm whitespace-nowrap relative z-20 transition-colors duration-300 ${isHovered ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-300'}`}>{skill.name}</span>
      </div>
    </div>
  );
});

SkillCard.displayName = 'SkillCard';

export default SkillCard;