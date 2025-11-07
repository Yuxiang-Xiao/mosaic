import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

const translations = {
  en: {
    appName: "Mosaic",
    addHabitPlaceholder: "Add a new thing...",
    noHabits: "Add your first thing to get started.",
    settings: "Settings",
    dayTheme: "Day Theme",
    nightTheme: "Night Theme",
    archivedHabits: "Archived",
    archivedModalTitle: "Archived Things",
    importData: "Import Data",
    exportData: "Export Data",
    optionsFor: "Options for {thingName}",
    archive: "Archive",
    delete: "Delete",
    monthlyCheckins: "Monthly Check-ins: {count}/{total}",
    yearlyCheckins: "Yearly Check-ins: {count}/{total}",
    month: "Month",
    year: "Year",
    logged: "Logged!",
    logToday: "Log Today",
    startNewHabit: "Track a New Thing",
    startNewHabitMessage: "Consistency is key. Add your first thing from the sidebar to begin your journey.",
    logFor: "Log for {date}",
    addNotePlaceholder: "Add a note about your progress...",
    deleteLog: "Delete Log",
    saveLog: "Save Log",
    closeModal: "Close modal",
    unarchiveAria: "Unarchive {thingName}",
    deleteAria: "Delete {thingName}",
    noArchivedHabits: "No archived things.",
    importConfirmation: "This will overwrite your current things. Are you sure you want to continue?",
    importError: "Failed to import things. Please check the file format.",
    language: "Language",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  },
  zh: {
    appName: "Mosaic",
    addHabitPlaceholder: "添加新事项...",
    noHabits: "添加第一个要追踪的事项，开始记录吧。",
    settings: "设置",
    dayTheme: "浅色模式",
    nightTheme: "深色模式",
    archivedHabits: "已归档",
    archivedModalTitle: "已归档的事项",
    importData: "导入数据",
    exportData: "导出数据",
    optionsFor: "{thingName} 的选项",
    archive: "归档",
    delete: "删除",
    monthlyCheckins: "本月打卡: {count}/{total}",
    yearlyCheckins: "今年打卡: {count}/{total}",
    month: "月",
    year: "年",
    logged: "已记录！",
    logToday: "记录今天",
    startNewHabit: "开始追踪新事项",
    startNewHabitMessage: "万事开头难，贵在坚持。从侧边栏添加第一个事项，开始你的记录之旅吧。",
    logFor: "{date} 的记录",
    addNotePlaceholder: "记录一下今天的进展吧...",
    deleteLog: "删除记录",
    saveLog: "保存记录",
    closeModal: "关闭",
    unarchiveAria: "取消归档 {thingName}",
    deleteAria: "删除 {thingName}",
    noArchivedHabits: "没有已归档的事项。",
    importConfirmation: "导入操作将覆盖当前所有数据，确定要继续吗？",
    importError: "导入失败。请检查文件格式是否正确。",
    language: "语言",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
  }
};

type Language = 'en' | 'zh';
type TranslationKeys = keyof (typeof translations)['en'];

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKeys, replacements?: Record<string, string | number>) => string;
  t_array: (key: Extract<TranslationKeys, 'weekdays' | 'months'>) => string[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useLocalStorage<Language>('language', 'en');

  const t = useMemo(() => (key: TranslationKeys, replacements: Record<string, string | number> = {}): string => {
    let translation = (translations[lang] as any)[key] || (translations['en'] as any)[key] || key;
    if (typeof translation !== 'string') return key;

    Object.keys(replacements).forEach(placeholder => {
      const regex = new RegExp(`{${placeholder}}`, 'g');
      translation = translation.replace(regex, String(replacements[placeholder]));
    });
    return translation;
  }, [lang]);

  const t_array = useMemo(() => (key: Extract<TranslationKeys, 'weekdays' | 'months'>): string[] => {
    const translation = (translations[lang] as any)[key] || (translations['en'] as any)[key] || [];
    return Array.isArray(translation) ? translation : [];
  }, [lang]);
  
  const value = { lang, setLang, t, t_array };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
