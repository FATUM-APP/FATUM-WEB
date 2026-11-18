import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FatumButton from '../components/FatumButton';

const slides = [
  {
    image: '/images/login.png',
    title: 'Te damos la bienvenida a FATUM',
    body: 'Donde la confianza vive en cada servicio',
  },
  {
    image: '/images/login2.png',
    title: 'Encuentra profesionales de confianza',
    body: 'Servicios personalizados para tus necesidades',
  },
  {
    image: '/images/login3.png',
    title: 'Haz crecer tu negocio',
    body: 'Crece profesionalmente desde la comodidad de tu hogar',
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => {
      let d = direction;
      if (prev === 2) d = -1;
      else if (prev === 0) d = 1;
      setDirection(d);
      return prev + d;
    });
  }, [direction]);

  useEffect(() => {
    const timer = setInterval(advance, 5000);
    return () => clearInterval(timer);
  }, [advance]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <img
          src="/images/fatum-login.png"
          alt="Fatum"
          style={styles.logo}
        />

        <div style={styles.carousel}>
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {slides.map((slide, i) => (
              <div key={i} style={styles.slide}>
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={styles.slideImage}
                />
                <h2 style={styles.slideTitle}>{slide.title}</h2>
                <p style={styles.slideBody}>{slide.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                ...styles.dot,
                backgroundColor:
                  i === currentIndex
                    ? 'var(--brand-primary)'
                    : 'var(--inactive)',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div style={styles.buttons}>
          <FatumButton variant="third" onClick={() => navigate('/register')}>
            Regístrarse
          </FatumButton>
          <FatumButton
            variant="borderedExpanded"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </FatumButton>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--brand-secondary)',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    padding: '40px 24px',
  },
  logo: {
    height: 40,
    objectFit: 'contain',
  },
  carousel: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 12,
  },
  slide: {
    minWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: '0 16px',
    boxSizing: 'border-box' as const,
  },
  slideImage: {
    maxHeight: 350,
    width: '100%',
    objectFit: 'contain',
  },
  slideTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 24,
    fontWeight: 500,
    color: 'var(--text)',
    textAlign: 'center' as const,
    margin: 0,
  },
  slideBody: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: 'var(--login-text)',
    textAlign: 'center' as const,
    margin: 0,
  },
  dots: {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'background-color 0.3s',
  },
  buttons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 16,
  },
};
