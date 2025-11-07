import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  onDelete: () => void;
  date: string | null;
  existingNote: string;
  isExistingCheckIn: boolean;
}

const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose, onSave, onDelete, date, existingNote, isExistingCheckIn }) => {
  const [note, setNote] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useI18n();

  useEffect(() => {
    if (isOpen) {
      setNote(existingNote);
    }
  }, [isOpen, existingNote]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !date) return null;

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  }

  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div 
      className="fixed inset-0 bg-charcoal/60 dark:bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-charcoal-light rounded-2xl shadow-xl w-full max-w-md p-6 border border-stone-light dark:border-charcoal transform transition-all animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
            {t('logFor', { date: formattedDate })}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-text-secondary hover:bg-stone-light dark:hover:bg-charcoal-dark transition-colors"
            aria-label={t('closeModal')}
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder={t('addNotePlaceholder')}
          rows={5}
          className="w-full p-3 border border-stone-light rounded-xl bg-cream-dark dark:bg-charcoal-dark dark:border-charcoal focus:border-stone dark:focus:border-charcoal-light outline-none transition-all text-text-primary dark:text-text-primary-dark"
          aria-label="Check-in note"
        ></textarea>
        
        <div className="flex justify-end items-center mt-6 gap-3">
          {isExistingCheckIn && (
            <button
              onClick={handleDelete}
              className="font-semibold py-2 px-4 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              {t('deleteLog')}
            </button>
          )}
          <button
            onClick={handleSave}
            className="font-semibold py-2 px-5 rounded-xl text-cream bg-charcoal dark:text-charcoal dark:bg-cream transition-colors hover:bg-charcoal-dark dark:hover:bg-cream-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-charcoal dark:focus:ring-cream dark:focus:ring-offset-charcoal-light"
          >
            {t('saveLog')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
