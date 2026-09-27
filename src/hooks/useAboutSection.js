import { useMemo } from 'react';
import { useTranslation } from './useTranslation';

import img1 from '../assets/img/1a47c9ba-828d-4ce8-918f-0a1006de19fb.jpeg';
import img2 from '../assets/img/21af02dc-ff65-422f-ac65-98d939e25e3a.jpeg';
import img3 from '../assets/img/IMG_0158.JPG.jpeg';
import img4 from '../assets/img/IMG_0780.jpeg';
import img5 from '../assets/img/IMG_0869.jpeg';
import img6 from '../assets/img/IMG_0880.jpeg';
import img7 from '../assets/img/WhatsApp Image 2025-10-29 at 18.55.54_1f1ca100.jpg';

export const useAboutSection = () => {
  const { t } = useTranslation();

  const carouselItems = useMemo(() => [
    { image: img1, alt: 'Foto personal 1' },
    { image: img2, alt: 'Foto personal 2' },
    { image: img3, alt: 'Foto personal 3' },
    { image: img4, alt: 'Foto personal 4' },
    { image: img5, alt: 'Foto personal 5' },
    { image: img6, alt: 'Foto personal 6' },
    { image: img7, alt: 'Foto personal 7' },
  ], []);

  return {
    t,
    carouselItems
  };
};
