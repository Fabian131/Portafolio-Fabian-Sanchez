import React, { memo } from 'react';
import Background3D from '../atoms/Background3D';

const BackgroundOrganism = memo(({ theme, performanceTier = 'high' }) => (
  <Background3D theme={theme} performanceTier={performanceTier} />
));

BackgroundOrganism.displayName = 'BackgroundOrganism';

export default BackgroundOrganism;
