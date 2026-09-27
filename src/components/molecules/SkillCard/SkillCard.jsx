import React, { memo } from 'react';
import './SkillCard.css';

const SkillCard = memo(({ skill, color = 'cyan', performanceTier = 'high' }) => {
  const colors = {
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  };

  const colorClasses = colors[color] || colors.cyan;
  const isLowPerf = performanceTier === 'low';

  const cardBg = isLowPerf
    ? 'bg-white/85 dark:bg-[#111827]/90 border border-gray-200/50 dark:border-white/10'
    : '';

  return (
    <div
      className="shrink-0 relative group"
      style={{ contain: 'layout style paint' }}
    >
      <div className={`sketch-card px-3 py-2 flex items-center gap-2 rounded-xl ${cardBg} h-full relative overflow-hidden group-hover:scale-105 group-hover:bg-white/10 dark:group-hover:bg-white/5 transition-all duration-300`}>
        <div className={`sketch-lines absolute inset-0 pointer-events-none z-10 opacity-0 ${!isLowPerf ? 'group-hover:animate group-hover:opacity-100' : ''}`}>
          <svg className="absolute inset-0 w-full h-full dark:hidden" preserveAspectRatio="none">
            <rect x="0" y="0" width="100%" height="100%" rx="12" ry="12" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 8" pathLength="10" className="sketch-line"/>
          </svg>
          <svg className="absolute inset-0 w-full h-full dark:hidden" preserveAspectRatio="none" style={{ filter: 'blur(6px)' }}>
            <rect x="0" y="0" width="100%" height="100%" rx="12" ry="12" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="4 8" pathLength="10" className="sketch-line-blur"/>
          </svg>
          <svg className="absolute inset-0 w-full h-full hidden dark:block" preserveAspectRatio="none">
            <rect x="0" y="0" width="100%" height="100%" rx="12" ry="12" fill="none" stroke="#c9e9ff" strokeWidth="2" strokeDasharray="4 8" pathLength="10" className="sketch-line"/>
          </svg>
          <svg className="absolute inset-0 w-full h-full hidden dark:block" preserveAspectRatio="none" style={{ filter: 'blur(8px)' }}>
            <rect x="0" y="0" width="100%" height="100%" rx="12" ry="12" fill="none" stroke="#f8fcff" strokeWidth="4" strokeDasharray="4 8" pathLength="10" className="sketch-line-blur"/>
          </svg>
        </div>

        <div className={`p-2 rounded-full ${colorClasses} relative z-20 transition-transform duration-300 group-hover:scale-110`}>
          <div className="scale-[1.15]">{skill.icon}</div>
        </div>
        <span className={`font-medium text-xs whitespace-nowrap relative z-20 transition-colors duration-300 text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400`}>{skill.name}</span>
      </div>
    </div>
  );
});

SkillCard.displayName = 'SkillCard';

export default SkillCard;