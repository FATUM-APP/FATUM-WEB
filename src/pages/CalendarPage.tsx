import { useState } from 'react';
import MonthCalendar from '../components/MonthCalendar';
import BookedSlotCard from '../components/BookedSlotCard';
import type { BookedSlot } from '../types';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots] = useState<BookedSlot[]>([]);

  void selectedDate;

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>Calendario</h1>

      <MonthCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div style={styles.scheduleSection}>
        <h2 style={styles.dayTitle}>
          {selectedDate.toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </h2>

        {slots.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No hay citas programadas para este día</p>
          </div>
        ) : (
          <div style={styles.slotList}>
            {slots.map((slot) => (
              <BookedSlotCard key={slot.orderId} slot={slot} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: 'var(--brand-secondary)',
    minHeight: '100vh',
    padding: 16,
    paddingBottom: 80,
    maxWidth: 800,
    margin: '0 auto',
  },
  header: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--text)',
    margin: '0 0 16px',
  },
  scheduleSection: {
    marginTop: 20,
  },
  dayTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 18,
    fontWeight: 500,
    color: 'var(--text)',
    textTransform: 'capitalize' as const,
    margin: '0 0 12px',
  },
  slotList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  empty: {
    textAlign: 'center' as const,
    padding: 32,
  },
  emptyText: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: 'var(--inactive)',
  },
};
