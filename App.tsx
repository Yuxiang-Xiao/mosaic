import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Thing, CheckIn } from './types';
import ThingManager from './components/HabitManager';
import Heatmap from './components/Heatmap';
import CheckInModal from './components/CheckInModal';
import { formatDate, getTodayDateString } from './utils/date';
import { useI18n } from './hooks/useI18n';

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

const DocumentPlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const AppLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>Mosaic Minimal Logo (Grid + Check)</title>
    <desc>3x3 rounded-square grid with a checked cell, minimalist style.</desc>
    <g stroke="currentColor" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <rect x="142" y="142" width="180" height="180" rx="32"/>
      <rect x="392" y="142" width="180" height="180" rx="32"/>
      <rect x="642" y="142" width="180" height="180" rx="32"/>
      <rect x="142" y="392" width="180" height="180" rx="32"/>
      <rect x="392" y="392" width="180" height="180" rx="32"/>
      <rect x="142" y="642" width="180" height="180" rx="32"/>
      <rect x="392" y="642" width="180" height="180" rx="32"/>
      <rect x="642" y="642" width="180" height="180" rx="32"/>
      <circle cx="732" cy="482" r="78"/>
      <path d="M690 482 L720 512 L774 446"/>
    </g>
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ArrowUturnLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const WindowControls: React.FC = () => (
    <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button aria-label="Minimize" className="p-1 text-text-secondary/70 hover:text-text-primary dark:hover:text-text-primary-dark transition-colors cursor-default">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>
        <button aria-label="Maximize" className="p-1 text-text-secondary/70 hover:text-text-primary dark:hover:text-text-primary-dark transition-colors cursor-default">
             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="6" width="12" height="12" rx="1"></rect>
            </svg>
        </button>
        <button aria-label="Close" className="p-1 text-text-secondary/70 hover:text-red-500 transition-colors cursor-default">
             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>
);


const ArchivedThingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  archivedThings: Thing[];
  onUnarchiveThing: (id: string) => void;
  onDeleteThing: (id: string) => void;
}> = ({ isOpen, onClose, archivedThings, onUnarchiveThing, onDeleteThing }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { t } = useI18n();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-charcoal/60 dark:bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-modal-title"
        >
            <div
                ref={modalRef}
                className="bg-white dark:bg-charcoal-light rounded-2xl shadow-xl w-full max-w-lg p-6 border border-stone-light dark:border-charcoal transform transition-all animate-in zoom-in-95 duration-300 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 id="archive-modal-title" className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
                        {t('archivedModalTitle')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-text-secondary hover:bg-stone-light dark:hover:bg-charcoal-dark transition-colors"
                        aria-label={t('closeModal')}
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto -mr-3 pr-3 styled-scrollbar max-h-[60vh]">
                    {archivedThings.length > 0 ? (
                        <ul className="space-y-2">
                            {archivedThings.map(thing => (
                                <li key={thing.id} className="flex justify-between items-center p-3 rounded-lg bg-stone-light/50 dark:bg-charcoal-dark/50">
                                    <span className="font-medium truncate pr-2">{thing.name}</span>
                                    <div className='flex items-center gap-2'>
                                        <button onClick={() => onUnarchiveThing(thing.id)} className="p-2 rounded-lg text-text-secondary hover:bg-stone-light dark:hover:bg-charcoal-light transition-colors" aria-label={t('unarchiveAria', { thingName: thing.name })}>
                                            <ArrowUturnLeftIcon className='w-5 h-5'/>
                                        </button>
                                        <button onClick={() => onDeleteThing(thing.id)} className="p-2 rounded-lg text-text-secondary hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors" aria-label={t('deleteAria', { thingName: thing.name })}>
                                            <TrashIcon className='w-5 h-5'/>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-text-secondary text-center py-8">{t('noArchivedHabits')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};


export default function App() {
  const [things, setThings] = useLocalStorage<Thing[]>('habits', []);
  const [selectedThingId, setSelectedThingId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'year' | 'month'>('year');
  
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const migrationCompleted = useRef(false);
  const { t } = useI18n();

  useEffect(() => {
    // One-time migration for existing users from string[] to CheckIn[]
    if (migrationCompleted.current) return;
    if (things.length > 0 && things.some(h => h.checkIns.length > 0 && typeof (h.checkIns[0] as any) === 'string')) {
      const migratedThings = things.map(thing => {
        if (thing.checkIns.length > 0 && typeof (thing.checkIns[0] as any) === 'string') {
          return {
            ...thing,
            checkIns: (thing.checkIns as unknown as string[]).map(date => ({ date, note: '' }))
          };
        }
        return thing;
      });
      setThings(migratedThings);
      migrationCompleted.current = true;
    }
  }, [things, setThings]);
  
  const activeThings = useMemo(() => things.filter(h => !h.archived), [things]);
  const archivedThings = useMemo(() => things.filter(h => h.archived), [things]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!selectedThingId && activeThings.length > 0) {
      setSelectedThingId(activeThings[0].id);
    }
    if (activeThings.length === 0) {
        setSelectedThingId(null);
    }
  }, [activeThings, selectedThingId]);

  const selectedThing = useMemo(() => {
    return things.find(h => h.id === selectedThingId) || null;
  }, [things, selectedThingId]);

  const checkInStats = useMemo(() => {
    if (!selectedThing) {
      return { monthCount: 0, monthTotal: 0, yearCount: 0, yearTotal: 0 };
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInYear = isLeapYear(currentYear) ? 366 : 365;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let monthCount = 0;
    let yearCount = 0;

    for (const checkIn of selectedThing.checkIns) {
      const checkInDate = new Date(checkIn.date + 'T00:00:00');
      if (isNaN(checkInDate.getTime())) continue; 
      
      const checkInYear = checkInDate.getFullYear();
      const checkInMonth = checkInDate.getMonth();

      if (checkInYear === currentYear) {
        yearCount++;
        if (checkInMonth === currentMonth) {
          monthCount++;
        }
      }
    }

    return {
      monthCount,
      monthTotal: daysInMonth,
      yearCount,
      yearTotal: daysInYear,
    };
  }, [selectedThing]);


  const addThing = useCallback((name: string) => {
    const newThing: Thing = {
      id: crypto.randomUUID(),
      name,
      checkIns: [],
      createdAt: new Date().toISOString()
    };
    const updatedThings = [...things, newThing];
    setThings(updatedThings);
    setSelectedThingId(newThing.id);
    setIsSidebarCollapsed(false);
  }, [things, setThings]);

  const deleteThing = useCallback((id: string) => {
    const updatedThings = things.filter(h => h.id !== id);
    setThings(updatedThings);
    if (selectedThingId === id) {
      const newActiveThings = updatedThings.filter(h => !h.archived);
      setSelectedThingId(newActiveThings.length > 0 ? newActiveThings[0].id : null);
    }
  }, [things, setThings, selectedThingId]);
  
  const archiveThing = useCallback((id: string) => {
    const updatedThings = things.map(h => h.id === id ? { ...h, archived: true } : h);
    setThings(updatedThings);
    if (selectedThingId === id) {
      const newActiveThings = updatedThings.filter(h => !h.archived);
      setSelectedThingId(newActiveThings.length > 0 ? newActiveThings[0].id : null);
    }
  }, [things, setThings, selectedThingId]);

  const unarchiveThing = useCallback((id: string) => {
    setThings(things.map(h => h.id === id ? { ...h, archived: false } : h));
  }, [things, setThings]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(things, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `mosaic-data-${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [things]);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("File could not be read");
            const importedThings = JSON.parse(text);
            
            // Basic validation
            if (Array.isArray(importedThings) && importedThings.every(h => h.id && h.name && h.checkIns)) {
                if (window.confirm(t('importConfirmation'))) {
                    setThings(importedThings);
                }
            } else {
                throw new Error("Invalid thing data format.");
            }
        } catch (error) {
            console.error("Failed to import things:", error);
            alert(t('importError'));
        } finally {
            // Reset file input to allow importing the same file again
            if (importFileRef.current) {
                importFileRef.current.value = "";
            }
        }
    };
    reader.readAsText(file);
  }, [setThings, t]);

  const handleSaveCheckIn = useCallback((date: string, note: string) => {
      if (!selectedThing) return;

      const updatedThings = things.map(h => {
          if (h.id === selectedThing.id) {
              const existingCheckInIndex = h.checkIns.findIndex(c => c.date === date);
              const newCheckIns = [...h.checkIns];
              if (existingCheckInIndex > -1) {
                  newCheckIns[existingCheckInIndex] = { date, note };
              } else {
                  newCheckIns.push({ date, note });
              }
              return { ...h, checkIns: newCheckIns };
          }
          return h;
      });
      setThings(updatedThings);
  }, [things, selectedThing, setThings]);

  const handleDeleteCheckIn = useCallback((date: string) => {
      if (!selectedThing) return;

      const updatedThings = things.map(h => {
          if (h.id === selectedThing.id) {
              return { ...h, checkIns: h.checkIns.filter(c => c.date !== date) };
          }
          return h;
      });
      setThings(updatedThings);
  }, [things, selectedThing, setThings]);

  const handleOpenCheckInModal = (date: string) => {
      setSelectedDate(date);
      setIsCheckInModalOpen(true);
  };
  
  const handleCloseCheckInModal = () => {
      setIsCheckInModalOpen(false);
      setSelectedDate(null);
  };

  const hasCheckedInToday = useMemo(() => {
    if (!selectedThing) return false;
    const today = getTodayDateString();
    return selectedThing.checkIns.some(c => c.date === today);
  }, [selectedThing]);

  const noteForSelectedDate = useMemo(() => {
    if (!selectedThing || !selectedDate) return '';
    return selectedThing.checkIns.find(c => c.date === selectedDate)?.note || '';
  }, [selectedThing, selectedDate]);

  const isExistingCheckIn = useMemo(() => {
    if (!selectedThing || !selectedDate) return false;
    return selectedThing.checkIns.some(c => c.date === selectedDate);
  }, [selectedThing, selectedDate]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen text-text-primary dark:text-text-primary-dark bg-cream dark:bg-charcoal transition-colors duration-300">
      <header 
        className="p-4 bg-cream/80 dark:bg-charcoal/80 backdrop-blur-sm flex justify-between items-center sticky top-0 z-10 border-b border-stone-light dark:border-charcoal-light select-none"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div 
            className="flex items-center gap-2"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg text-text-primary dark:text-text-primary-dark hover:bg-stone-light dark:hover:bg-charcoal-light transition-colors"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <AppLogo className="w-8 h-8" />
            </button>
            <h1 className="text-xl font-bold">{t('appName')}</h1>
        </div>
        <WindowControls />
      </header>
      <main className="flex">
        <aside className={`
            h-[calc(100vh-65px)] sticky top-[65px]
            transition-all duration-300 ease-in-out shrink-0 overflow-y-auto styled-scrollbar
            ${isSidebarCollapsed
                ? 'w-0 border-r-0'
                : 'w-full md:w-72 p-4 border-r border-stone-light dark:border-charcoal-light'
            }
        `}>
          <ThingManager
            things={activeThings}
            selectedThingId={selectedThingId}
            onSelectThing={setSelectedThingId}
            onAddThing={addThing}
            onDeleteThing={deleteThing}
            onArchiveThing={archiveThing}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            onToggleTheme={toggleDarkMode}
            isDarkMode={isDarkMode}
            onImport={() => importFileRef.current?.click()}
            onExport={handleExport}
            onShowArchives={() => setIsArchivedModalOpen(true)}
          />
        </aside>
        <section className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {selectedThing ? (
            <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl border border-stone-light dark:border-charcoal-light">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl lg:text-5xl font-bold">{selectedThing.name}</h2>
                    <p className="text-text-secondary dark:text-text-secondary-dark mt-1">
                      {viewMode === 'month' 
                        ? t('monthlyCheckins', { count: checkInStats.monthCount, total: checkInStats.monthTotal })
                        : t('yearlyCheckins', { count: checkInStats.yearCount, total: checkInStats.yearTotal })
                      }
                    </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-center">
                    <div className="p-1 bg-stone-light dark:bg-charcoal rounded-lg flex text-sm font-semibold">
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-3 py-1 rounded-md transition-colors ${
                                viewMode === 'month' ? 'bg-white dark:bg-charcoal-dark shadow-sm' : 'text-text-secondary hover:text-text-primary dark:hover:text-text-primary-dark'
                            }`}
                        >
                            {t('month')}
                        </button>
                        <button
                            onClick={() => setViewMode('year')}
                            className={`px-3 py-1 rounded-md transition-colors ${
                                viewMode === 'year' ? 'bg-white dark:bg-charcoal-dark shadow-sm' : 'text-text-secondary hover:text-text-primary dark:hover:text-text-primary-dark'
                            }`}
                        >
                            {t('year')}
                        </button>
                    </div>
                    <button
                      onClick={() => handleOpenCheckInModal(getTodayDateString())}
                      className={`flex items-center gap-2 font-semibold py-2 px-5 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-charcoal
                        ${hasCheckedInToday
                          ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal hover:bg-charcoal-dark dark:hover:bg-cream-dark focus:ring-charcoal dark:focus:ring-cream-dark'
                          : 'bg-transparent text-text-primary dark:text-text-primary-dark border border-stone dark:border-stone-dark hover:bg-stone-light dark:hover:bg-charcoal-dark focus:ring-stone-dark'
                        }`}
                    >
                      <CheckIcon className={`w-4 h-4 ${hasCheckedInToday ? 'text-cream dark:text-charcoal' : 'text-text-primary dark:text-text-primary-dark'}`} />
                      <span className="hidden sm:inline">{hasCheckedInToday ? t('logged') : t('logToday')}</span>
                    </button>
                </div>
              </div>
              <Heatmap checkIns={selectedThing.checkIns} viewMode={viewMode} onDayClick={handleOpenCheckInModal} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
                <div className="mb-6 text-stone dark:text-charcoal-light">
                    <DocumentPlusIcon className="h-24 w-24" />
                </div>
                <h2 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">{t('startNewHabit')}</h2>
                <p className="mt-2 max-w-sm mx-auto text-text-secondary dark:text-text-secondary-dark">{t('startNewHabitMessage')}</p>
            </div>
          )}
        </section>
      </main>
      <CheckInModal 
        isOpen={isCheckInModalOpen}
        onClose={handleCloseCheckInModal}
        date={selectedDate}
        existingNote={noteForSelectedDate}
        isExistingCheckIn={isExistingCheckIn}
        onSave={(note) => selectedDate && handleSaveCheckIn(selectedDate, note)}
        onDelete={() => selectedDate && handleDeleteCheckIn(selectedDate)}
      />
      <ArchivedThingsModal
        isOpen={isArchivedModalOpen}
        onClose={() => setIsArchivedModalOpen(false)}
        archivedThings={archivedThings}
        onUnarchiveThing={unarchiveThing}
        onDeleteThing={deleteThing}
      />
       <input
        type="file"
        ref={importFileRef}
        onChange={handleImport}
        accept="application/json"
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}