import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  markedDates?: Record<string, { color: string }[]>;
}

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function MonthCalendar({ selectedDate, onSelectDate, markedDates }: MonthCalendarProps) {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  const today = new Date();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const monthName = viewDate.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  return (
    <div style={{
      backgroundColor: '#E5E9EA',
      borderRadius: 24,
      padding: 16,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
          aria-label="Mes anterior"
        >
          <ChevronLeft size={20} color="#123F35" />
        </button>
        <span style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 16,
          fontWeight: 500,
          color: '#123F35',
          textTransform: 'capitalize',
        }}>
          {monthName}
        </span>
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
          aria-label="Mes siguiente"
        >
          <ChevronRight size={20} color="#123F35" />
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2,
        textAlign: 'center',
      }}>
        {DAY_NAMES.map((d) => (
          <div key={d} style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: '#123F35',
            padding: '4px 0',
          }}>
            {d}
          </div>
        ))}

        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />;

          const isToday = sameDay(date, today);
          const isSelected = selectedDate ? sameDay(date, selectedDate) : false;
          const key = toKey(date);
          const dots = markedDates?.[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(date)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                aspectRatio: '1',
                border: 'none',
                background: isSelected ? '#123F35' : 'transparent',
                borderRadius: '50%',
                cursor: 'pointer',
                fontFamily: "'Lato', sans-serif",
                fontSize: 14,
                fontWeight: isToday ? 700 : 400,
                color: isSelected ? '#FFFFFF' : isToday ? '#7FCD6C' : '#192422',
                padding: 0,
              }}
            >
              {date.getDate()}
              {dots && dots.length > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: 2,
                  display: 'flex',
                  gap: 2,
                }}>
                  {dots.slice(0, 3).map((dot, di) => (
                    <div key={di} style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: dot.color,
                    }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
