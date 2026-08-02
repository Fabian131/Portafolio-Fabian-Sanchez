import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AVAILABLE, LANGS } from '../../data/translations';

const DROPDOWN_H = AVAILABLE.length * 44 + 16;

const LanguageSwitcher = memo(({ direction = 'down' }) => {
  const { lang, changeLang, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const current = LANGS[lang];

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
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          aria-label={t('ui.langToggle')}
        >
          <Globe size={14} />
          <span className="font-medium">{current?.code.toUpperCase()}</span>
          <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div
            className="fixed z-[100]"
            style={{ top: `${dropdownPos.top}px`, right: `${dropdownPos.right}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-44 bg-white/90 dark:bg-[#0f111a]/80 backdrop-blur-xl rounded-xl border border-black/10 dark:border-white/10 shadow-xl overflow-hidden">
              {AVAILABLE.map(({ code, native }) => (
                <button
                  key={code}
                  onClick={() => handleSelect(code)}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/10 ${
                    lang === code ? 'text-cyan-700 dark:text-cyan-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{native}</span>
                  <span className="text-xs opacity-50 ml-auto">{code.toUpperCase()}</span>
                  {lang === code && <Check size={14} className="text-cyan-700 dark:text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher;
