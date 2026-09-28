import React, { memo } from 'react';
import { useBackground3D } from '../../../../hooks/useBackground3D';

const Background3D = memo(({ theme, performanceTier = 'high' }) => {
  const mountRef = useBackground3D({ theme, performanceTier });

  return <div ref={mountRef} className="fixed inset-0 z-0 w-full h-screen overflow-hidden pointer-events-none" />;
});

Background3D.displayName = 'Background3D';

export default Background3D;