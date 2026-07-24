import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AVAILABLE, LANGS } from '../../data/translations';

const LanguageSwitcher = memo(() => {
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
      setDropdownPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setIsOpen(!isOpen);
  }, [isOpen]);

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
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-sm"
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
            <div className="w-44 bg-white/10 dark:bg-[#0f111a]/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl overflow-hidden">
              {AVAILABLE.map(({ code, native }) => (
                <button
                  key={code}
                  onClick={() => handleSelect(code)}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-white/10 ${
                    lang === code ? 'text-cyan-500 font-medium' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{native}</span>
                  <span className="text-xs opacity-50 ml-auto">{code.toUpperCase()}</span>
                  {lang === code && <Check size={14} className="text-cyan-500 shrink-0" />}
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
