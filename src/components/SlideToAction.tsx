import { useRef, useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SlideToActionProps {
  positiveLabel: string;
  negativeLabel: string;
  onPositive: () => void;
  onNegative: () => void;
}

export default function SlideToAction({
  positiveLabel,
  negativeLabel,
  onPositive,
  onNegative,
}: SlideToActionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const trackWidth = useRef(0);

  const KNOB_SIZE = 52;
  const THRESHOLD = 0.4;

  const handleStart = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    trackWidth.current = trackRef.current.offsetWidth;
    startX.current = clientX;
    setDragging(true);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!dragging) return;
    const maxSlide = (trackWidth.current - KNOB_SIZE) / 2;
    const delta = clientX - startX.current;
    setOffset(Math.max(-maxSlide, Math.min(maxSlide, delta)));
  }, [dragging]);

  const handleEnd = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const maxSlide = (trackWidth.current - KNOB_SIZE) / 2;
    if (offset > maxSlide * THRESHOLD) {
      onPositive();
    } else if (offset < -maxSlide * THRESHOLD) {
      onNegative();
    }
    setOffset(0);
  }, [dragging, offset, onPositive, onNegative]);

  const positiveOpacity = Math.max(0, offset / ((trackWidth.current - KNOB_SIZE) / 2 || 1));
  const negativeOpacity = Math.max(0, -offset / ((trackWidth.current - KNOB_SIZE) / 2 || 1));

  return (
    <div
      ref={trackRef}
      style={{
        position: 'relative',
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        backgroundColor: '#E5E9EA',
        overflow: 'hidden',
        userSelect: 'none',
        touchAction: 'none',
        width: '100%',
      }}
    >
      <div style={{
        position: 'absolute',
        left: 16,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Lato', sans-serif",
        fontSize: 14,
        color: '#34344A',
        opacity: negativeOpacity * 0.8,
        pointerEvents: 'none',
      }}>
        <ChevronLeft size={16} style={{ marginRight: 4 }} />
        {negativeLabel}
      </div>

      <div style={{
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Lato', sans-serif",
        fontSize: 14,
        color: '#123F35',
        opacity: positiveOpacity * 0.8,
        pointerEvents: 'none',
      }}>
        {positiveLabel}
        <ChevronRight size={16} style={{ marginLeft: 4 }} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: `calc(50% - ${KNOB_SIZE / 2}px + ${offset}px)`,
          top: 0,
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          borderRadius: '50%',
          backgroundColor: '#123F35',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          transition: dragging ? 'none' : 'left 0.3s ease-out',
        }}
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchEnd={handleEnd}
      >
        <ChevronRight size={24} color="#FFFFFF" />
      </div>
    </div>
  );
}
