import React, { memo } from 'react';
import SkillCard from '../SkillCard/SkillCard';
import { useDraggableMarquee } from '../../../hooks/useDraggableMarquee';

const DraggableMarquee = memo(({ items, direction = 'left', color = 'cyan', performanceTier = 'high' }) => {
  const {
    trackRef,
    containerRef,
    duplicatedItems,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useDraggableMarquee({ items, direction });

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none h-24"
      style={{ contain: 'layout', touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        ref={trackRef}
        className="absolute top-0 left-0 flex gap-3"
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        {duplicatedItems.map((skill, i) => (
          <SkillCard key={`${skill.name}-${i}`} skill={skill} color={color} performanceTier={performanceTier} />
        ))}
      </div>
    </div>
  );
});

DraggableMarquee.displayName = 'DraggableMarquee';

export default DraggableMarquee;