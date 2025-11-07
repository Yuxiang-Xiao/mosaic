import React, { useMemo, useRef, useEffect } from 'react';
import { formatDate, getDatesForLastYear, getDatesForMonthView } from '../utils/date';
import { CheckIn } from '../types';
import { useI18n } from '../hooks/useI18n';

interface HeatmapProps {
  checkIns: CheckIn[];
  viewMode: 'year' | 'month';
  onDayClick: (date: string) => void;
}

const Heatmap: React.FC<HeatmapProps> = ({ checkIns, viewMode, onDayClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t, lang, t_array } = useI18n();
  const checkInSet = useMemo(() => new Set(checkIns.map(c => c.date)), [checkIns]);
  
  const WEEKDAYS = t_array('weekdays');
  const MONTHS = t_array('months');

  const dates = useMemo(() => {
    return viewMode === 'year' ? getDatesForLastYear() : getDatesForMonthView();
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === 'year' && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollLeft = container.scrollWidth;
    }
  }, [checkIns, viewMode]);

  if (dates.length === 0) {
    return null;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';

  // Year View Logic & Components
  const yearViewData = useMemo(() => {
    if (viewMode !== 'year') return null;

    const firstDay = dates[0];
    const dayOfWeekOffset = firstDay.getDay();
    const weekCount = Math.ceil((dates.length + dayOfWeekOffset) / 7);

    const monthLabels: { month: string; colStart: number }[] = [];
    let lastMonth = -1;
    dates.forEach((date, index) => {
      const month = date.getMonth();
      if (month !== lastMonth) {
        const weekIndex = Math.floor((index + dayOfWeekOffset) / 7);
        monthLabels.push({ month: MONTHS[month], colStart: weekIndex });
        lastMonth = month;
      }
    });
    return { dayOfWeekOffset, weekCount, monthLabels };
  }, [dates, viewMode, MONTHS]);

  const YearDayCell: React.FC<{ date: Date; isCheckedIn: boolean; }> = ({ date, isCheckedIn }) => {
    const colorClass = isCheckedIn
      ? 'bg-brand-dark dark:bg-brand'
      : 'bg-stone-light dark:bg-charcoal';
    const formattedDate = date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    const isFuture = date > today;
    
    return (
        <button 
            className="relative group disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => onDayClick(formatDate(date))}
            disabled={isFuture}
            aria-label={t('logFor', { date: formattedDate })}
        >
            <div className={`w-3 h-3 rounded-sm ${colorClass}`} role="gridcell" />
            <div className="absolute z-10 -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-semibold text-text-primary-dark bg-charcoal-light rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none" role="tooltip">
                {formattedDate}
            </div>
        </button>
    );
  };

  if (viewMode === 'year') {
    return (
      <div ref={scrollContainerRef} className="max-w-3xl mx-auto overflow-x-auto pb-4 styled-scrollbar" role="grid" aria-label="Check-in heatmap for the last year">
        <div 
          className="inline-grid gap-1"
          style={{
            gridTemplateColumns: `auto repeat(${yearViewData!.weekCount}, max-content)`,
            gridTemplateRows: 'auto repeat(7, max-content)',
          }}
        >
          {yearViewData!.monthLabels.map(({ month, colStart }) => (
            <div key={month} className="text-xs text-text-secondary dark:text-text-secondary-dark pb-1" style={{ gridRow: 1, gridColumn: colStart + 2, textAlign: 'left' }}>
              {month}
            </div>
          ))}
          {WEEKDAYS.map((day, i) => (
              <div key={day} className="text-xs text-text-secondary dark:text-text-secondary-dark pr-2 flex items-center justify-end" style={{ gridRow: i + 2, gridColumn: 1 }}>
                {i % 2 !== 0 ? day : ''}
              </div>
          ))}
          {dates.map((date, index) => {
            const dateString = formatDate(date);
            const isCheckedIn = checkInSet.has(dateString);
            const dayOfWeek = date.getDay();
            const weekIndex = Math.floor((index + yearViewData!.dayOfWeekOffset) / 7);
            return (
              <div key={dateString} style={{ gridRow: dayOfWeek + 2, gridColumn: weekIndex + 2 }}>
                <YearDayCell date={date} isCheckedIn={isCheckedIn} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Month View Logic & Components
  const currentMonth = new Date().getMonth();

  return (
    <div className="max-w-md mx-auto">
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-secondary pb-2">
            {WEEKDAYS.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
            {dates.map(date => {
                const dateString = formatDate(date);
                const isCheckedIn = checkInSet.has(dateString);
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isFuture = date > today;
                
                const colorClass = isCurrentMonth
                    ? (isCheckedIn ? 'bg-brand-dark dark:bg-brand' : 'bg-stone-light dark:bg-charcoal')
                    : 'bg-transparent';
                
                const textClass = isCurrentMonth
                    ? (isCheckedIn ? 'text-cream' : 'text-text-primary dark:text-text-primary-dark')
                    : 'text-stone-dark dark:text-charcoal-light';

                const formattedDate = date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });

                return (
                    <div key={dateString} className="relative group aspect-square">
                        <button
                            onClick={() => onDayClick(dateString)}
                            disabled={isFuture || !isCurrentMonth}
                            className={`w-full h-full rounded-lg flex items-center justify-center ${colorClass} transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${!isCurrentMonth ? 'pointer-events-none' : ''}`}
                            aria-label={t('logFor', { date: formattedDate })}
                        >
                            <span className={`font-semibold ${textClass}`}>
                                {date.getDate()}
                            </span>
                        </button>
                        <div className="absolute z-10 bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-semibold text-text-primary-dark bg-charcoal-light rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none" role="tooltip">
                            {formattedDate}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default Heatmap;