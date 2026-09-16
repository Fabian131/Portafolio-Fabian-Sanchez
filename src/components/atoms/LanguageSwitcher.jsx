import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AVAILABLE, LANGS } from '../../data/translations';

const ITEM_H = 44;
const PADDING = 8;
const DROPDOWN_H = AVAILABLE.length * ITEM_H + PADDING * 2;

const LanguageSwitcher = memo(({ direction = 'down' }) => {
  const { lang, changeLang, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const movingTimer = useRef(null);
  const current = LANGS[lang];

  const activeIndex = AVAILABLE.findIndex(({ code }) => code === lang);

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [isOpen]);

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    if (!isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const right = window.innerWidth - rect.right;
      if (direction === 'up') {
        setDropdownPos({ top: rect.top - DROPDOWN_H - 4, right });
      } else {
        setDropdownPos({ top: rect.bottom + 4, right });
      }
    }
    setIsOpen(!isOpen);
  }, [isOpen, direction]);

  const handleSelect = useCallback(
    (code) => {
      // Trigger moving state for pill animation (like liquid nav)
      setIsMoving(true);
      clearTimeout(movingTimer.current);
      movingTimer.current = setTimeout(() => setIsMoving(false), 300);
      changeLang(code);
      setIsOpen(false);
    },
    [changeLang]
  );

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

      {isOpen &&
        createPortal(
          <div
            className="fixed z-[100]"
            style={{ top: `${dropdownPos.top}px`, right: `${dropdownPos.right}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lang-switcher-dropdown w-44 overflow-hidden">
              {/* Liquid pill indicator */}
              <div
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
