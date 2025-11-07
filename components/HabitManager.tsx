import React, { useState, useRef, useEffect } from 'react';
import { Thing } from '../types';
import { useI18n } from '../hooks/useI18n';

interface ThingManagerProps {
  things: Thing[];
  selectedThingId: string | null;
  onSelectThing: (id: string) => void;
  onAddThing: (name: string) => void;
  onDeleteThing: (id: string) => void;
  onArchiveThing: (id: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onImport: () => void;
  onExport: () => void;
  onShowArchives: () => void;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const EllipsisHorizontalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
);

const ArchiveBoxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

const ArrowDownTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ArrowUpTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const Cog6ToothIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.39.44 1.02.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.166.397.506.71.93.78l.894.149c.542.09.94.56.94 1.11v1.093c0 .55-.398 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.93.78-.164.398-.142.854.108 1.204l.527.738c.32.43.27.96-.12 1.45l-.773.773a1.125 1.125 0 0 1-1.45.12l-.737-.527c-.35-.25-.806-.272-1.204-.108-.397.166-.71.506-.78.93l-.149.894c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.855-.142-1.205.108l-.737.527a1.125 1.125 0 0 1-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272.806.108-1.204-.166-.397-.506-.71-.93-.78l-.894-.149c-.542-.09-.94-.56-.94-1.11v-1.093c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.764-.383.93-.78.164-.398.142-.854-.108-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.806.272 1.204.108.397-.166.71-.506.78-.93l.149-.894Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const LanguageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
    </svg>
);


const ThingManager: React.FC<ThingManagerProps> = ({ things, selectedThingId, onSelectThing, onAddThing, onDeleteThing, onArchiveThing, isCollapsed, isDarkMode, onToggleTheme, onImport, onExport, onShowArchives }) => {
  const [newThingName, setNewThingName] = useState('');
  const [contextMenu, setContextMenu] = useState<{ id: string | null; openUp: boolean }>({ id: null, openUp: false });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, lang, setLang } = useI18n();

  const toggleLang = () => {
    setLang(lang === 'en' ? 'zh' : 'en');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenu({ id: null, openUp: false });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleAddThing = (e: React.FormEvent) => {
    e.preventDefault();
    if (newThingName.trim()) {
      onAddThing(newThingName.trim());
      setNewThingName('');
    }
  };

  return (
    <>
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setIsSettingsOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="h-full flex flex-col transition-all duration-300 overflow-hidden">
          <div className="flex-1 flex flex-col space-y-4 min-h-0">
              { !isCollapsed && (
                  <form onSubmit={handleAddThing}>
                      <input
                          type="text"
                          value={newThingName}
                          onChange={(e) => setNewThingName(e.target.value)}
                          placeholder={t('addHabitPlaceholder')}
                          className="w-full p-3 border border-stone-light rounded-xl bg-cream-dark dark:bg-charcoal-dark dark:border-charcoal focus:border-stone dark:focus:border-charcoal-light outline-none transition-all"
                      />
                  </form>
              )}
          
              <div className="flex-1 space-y-2">
                  {things.length > 0 ? (
                  things.map(thing => (
                      <div
                        key={thing.id}
                        className="group relative"
                      >
                        <button
                          onClick={() => onSelectThing(thing.id)}
                          className={`w-full flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors text-left ${
                              selectedThingId === thing.id ? 'bg-stone-light dark:bg-charcoal-dark' : 'hover:bg-stone-light dark:hover:bg-charcoal-dark'
                          }`}
                        >
                          {!isCollapsed && (
                              <>
                                <span className="font-medium truncate pr-8">{thing.name}</span>
                                <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (contextMenu.id === thing.id) {
                                        setContextMenu({ id: null, openUp: false });
                                        return;
                                      }
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      // Estimate menu height (~100px) and check if it fits in viewport
                                      const openUp = window.innerHeight - rect.bottom < 100;
                                      setContextMenu({ id: thing.id, openUp });
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 shrink-0 text-text-secondary hover:text-text-primary p-1 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    aria-label={t('optionsFor', { thingName: thing.name })}
                                >
                                    <EllipsisHorizontalIcon className="w-5 h-5" />
                                </div>
                              </>
                          )}
                        </button>
                        {contextMenu.id === thing.id && !isCollapsed && (
                          <div 
                            ref={menuRef} 
                            className={`absolute z-20 right-4 w-40 bg-white dark:bg-charcoal-dark rounded-xl shadow-lg border border-stone-light dark:border-charcoal p-1 space-y-1 animate-in fade-in zoom-in-95 ${contextMenu.openUp ? 'bottom-full mb-1' : 'mt-1'}`}
                           >
                            <button
                              onClick={() => { onArchiveThing(thing.id); setContextMenu({ id: null, openUp: false }); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left rounded-lg text-text-primary dark:text-text-primary-dark hover:bg-stone-light dark:hover:bg-charcoal transition-colors"
                            >
                              <ArchiveBoxIcon className="w-4 h-4" />
                              {t('archive')}
                            </button>
                            <button
                              onClick={() => { onDeleteThing(thing.id); setContextMenu({ id: null, openUp: false }); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                              {t('delete')}
                            </button>
                          </div>
                        )}
                      </div>
                  ))
                  ) : (
                  !isCollapsed && <p className="text-text-secondary text-sm text-center py-4">{t('noHabits')}</p>
                  )}
              </div>
          </div>
          {!isCollapsed && (
              <div className="relative pt-4 mt-auto border-t border-stone-light dark:border-charcoal-light">
                   {isSettingsOpen && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 w-full bg-white dark:bg-charcoal-dark rounded-2xl shadow-lg border border-stone-light dark:border-charcoal p-2 animate-in fade-in zoom-in-95 z-30">
                          <div className="space-y-1">
                              <button onClick={onToggleTheme} className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-stone-light dark:hover:bg-charcoal transition-colors">
                                  {isDarkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5" />}
                                  <span className="font-medium text-sm">{isDarkMode ? t('dayTheme') : t('nightTheme')}</span>
                              </button>
                              <button onClick={toggleLang} className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left rounded-lg hover:bg-stone-light dark:hover:bg-charcoal transition-colors">
                                  <div className='flex items-center gap-3'>
                                      <LanguageIcon className="w-5 h-5" />
                                      <span className="font-medium text-sm">{t('language')}</span>
                                  </div>
                                  <span className="text-sm font-semibold text-text-secondary">{lang === 'en' ? 'EN' : '中'}</span>
                              </button>
                              <button onClick={onShowArchives} className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-stone-light dark:hover:bg-charcoal transition-colors">
                                  <ArchiveBoxIcon className="w-5 h-5" />
                                  <span className="font-medium text-sm">{t('archivedHabits')}</span>
                              </button>
                              
                              <div className="!my-2 h-px bg-stone-light dark:bg-charcoal"></div>

                              <button onClick={onImport} className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-stone-light dark:hover:bg-charcoal transition-colors">
                                  <ArrowDownTrayIcon className="w-5 h-5" />
                                  <span className="font-medium text-sm">{t('importData')}</span>
                              </button>
                              <button onClick={onExport} className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-stone-light dark:hover:bg-charcoal transition-colors">
                                  <ArrowUpTrayIcon className="w-5 h-5" />
                                  <span className="font-medium text-sm">{t('exportData')}</span>
                              </button>
                          </div>
                      </div>
                  )}
                  <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex justify-between items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-stone-light dark:hover:bg-charcoal-dark transition-colors">
                      <div className="flex items-center gap-3">
                          <Cog6ToothIcon className="w-5 h-5" />
                          <span className="font-medium text-sm">{t('settings')}</span>
                      </div>
                      <ChevronDownIcon className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                  </button>
              </div>
          )}
      </div>
    </>
  );
};

export default ThingManager;