import React, { memo, Suspense } from 'react';

const Background3D = React.lazy(() => import('../atoms/Background3D'));

const BackgroundOrganism = memo(({ theme, performanceTier = 'high' }) => (
  <Suspense fallback={<div className="fixed inset-0 z-[0] w-full h-screen overflow-hidden pointer-events-none" />}>
    <Background3D theme={theme} performanceTier={performanceTier} />
  </Suspense>
));

BackgroundOrganism.displayName = 'BackgroundOrganism';

export default BackgroundOrganism;
