import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguageSwitcher } from '../../../../hooks/useLanguageSwitcher';

const LanguageSwitcher = memo(({ direction = 'down', parentOpen = true }) => {
  const {
    t,
    lang,
    current,
    isOpen,
    isRendered,
    isMoving,
    dropdownPos,
    btnRef,
    dropdownRef,
    pillRef,
    activeIndex,
    ITEM_H,
    PADDING,
    AVAILABLE,
    handleContainerMouseDown,
    handleToggle,
    handleSelect
  } = useLanguageSwitcher({ direction, parentOpen });

  if (AVAILABLE.length <= 1) return null;

  return (
    <>
      <div className="relative">
        <button
          ref={btnRef}
          onClick={handleToggle}
          className="lang-switcher-btn flex items-center gap-1.5 px-3 py-2 rounded-full text-sm"
          aria-label={t('ui.langToggle')}
          aria-expanded={isOpen}
        >
          <Globe size={14} />
          <span className="font-medium">{current?.code.toUpperCase()}</span>
          <ChevronDown
            size={12}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isRendered &&
        createPortal(
          <div
            className="fixed z-[100]"
            style={{ top: `${dropdownPos.top}px`, right: `${dropdownPos.right}px` }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleContainerMouseDown}
          >
            <div 
              ref={dropdownRef} 
              className={`lang-switcher-dropdown w-44 ${isOpen ? 'entering' : 'exiting'}`}
              data-direction={direction}
            >
              {/* Liquid draggable pill */}
              <div
                ref={pillRef}
                className={`lang-switcher-pill${isMoving ? ' moving' : ''}`}
                style={{
                  transform: `translateY(${PADDING + activeIndex * ITEM_H}px)`,
                  height: `${ITEM_H}px`,
                }}
              />

              <div style={{ padding: `${PADDING}px 0` }}>
                {AVAILABLE.map(({ code, native }) => (
                  <button
                    key={code}
                    onClick={() => handleSelect(code)}
                    className={`lang-switcher-item relative z-10 w-full flex items-center gap-2 px-4 text-sm text-left${
                      lang === code ? ' active' : ''
                    }`}
                    style={{ height: `${ITEM_H}px` }}
                  >
                    <span>{native}</span>
                    <span className="text-xs opacity-50 ml-auto">{code.toUpperCase()}</span>
                    {lang === code && <Check size={14} className="shrink-0 opacity-70" />}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher;
