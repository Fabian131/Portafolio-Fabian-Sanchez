import React, { memo } from 'react';
import { useMagneticButton } from '../../../../hooks/useMagneticButton';

const MagneticButton = memo(({ children, className = '' }) => {
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticButton();

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`transition-transform duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
});

MagneticButton.displayName = 'MagneticButton';

export default MagneticButton;
