import React, { memo } from 'react';
import Background3D from '../atoms/Background3D';

const BackgroundOrganism = memo(({ theme }) => <Background3D theme={theme} />);

BackgroundOrganism.displayName = 'BackgroundOrganism';

export default BackgroundOrganism;
