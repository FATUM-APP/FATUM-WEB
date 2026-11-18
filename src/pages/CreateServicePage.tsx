import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import FatumButton from '../components/FatumButton'
import FatumTextField from '../components/FatumTextField'
import FatumPicker from '../components/FatumPicker'
import { useCatalog } from '../context/CatalogContext'
import { useResponsive } from '../hooks/useResponsive'

type Step = 'info' | 'pricing' | 'details' | 'questions' | 'photos'
const STEPS: Step[] = ['info', 'pricing', 'details', 'questions', 'photos']

const STEP_TITLES: Record<Step, string> = {
  info: 'Información del servicio',
  pricing: 'Precios',
  details: 'Detalles',
  questions: 'Preguntas frecuentes',
  photos: 'Fotos',
}

const STEP_SUBTITLES: Record<Step, string> = {
  info: 'Título y descripción de tu servicio',
  pricing: 'Define el precio y tipo de cobro',
  details: 'Tiempo estimado y categoría',
  questions: 'Preguntas que los clientes deben responder',
  photos: 'Sube fotos de tu servicio',
}

export default function CreateServicePage() {
  const navigate = useNavigate()
  const { categories } = useCatalog()
  const { layout } = useResponsive()
  const [currentStep, setCurrentStep] = useState<Step>('info')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [priceType, setPriceType] = useState('FIXED')
  const [isNegotiable, setIsNegotiable] = useState(false)
  const [estimatedTime, setEstimatedTime] = useState('')
  const [category, setCategory] = useState('')

  const stepIndex = STEPS.indexOf(currentStep)

  const goNext = () => {
    const idx = STEPS.indexOf(currentStep)
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1])
  }

  const goBack = () => {
    const idx = STEPS.indexOf(currentStep)
    if (idx > 0) setCurrentStep(STEPS[idx - 1])
    else navigate(-1)
  }

  return (
    <div style={{ padding: layout.padding, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: layout.spacingMedium }}>
        <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--brand-primary)' }}>
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-header" style={{ color: 'var(--brand-primary)' }}>
          Crear servicio
        </h1>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 5, marginBottom: layout.externalSpacing }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: i <= stepIndex ? 'var(--brand-primary)' : 'var(--border-login)',
            transition: 'background-color 0.3s',
          }} />
        ))}
      </div>

      <div style={{ marginBottom: layout.spacingMedium }}>
        <h2 className="text-subheader" style={{ color: 'var(--text)' }}>{STEP_TITLES[currentStep]}</h2>
        <p className="text-body" style={{ color: 'var(--inactive)', marginTop: 4 }}>{STEP_SUBTITLES[currentStep]}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: layout.spacingMedium }}>
        {currentStep === 'info' && (
          <>
            <FatumTextField placeholder="Título del servicio" value={title} onChange={setTitle} fieldStyle="standard" maxLength={100} />
            <div>
              <label className="text-footer" style={{ color: 'var(--text)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Descripción
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe tu servicio..."
                maxLength={500}
                rows={5}
                style={{
                  width: '100%',
                  padding: 15,
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 16,
                  resize: 'vertical',
                  outline: 'none',
                  color: 'var(--text)',
                }}
              />
              <span className="text-footer" style={{ color: 'var(--inactive)', textAlign: 'right', display: 'block' }}>
                {description.length}/500
              </span>
            </div>
          </>
        )}

        {currentStep === 'pricing' && (
          <>
            <FatumTextField
              placeholder="Precio base"
              value={basePrice}
              onChange={v => setBasePrice(v.replace(/[^0-9]/g, ''))}
              fieldStyle="standard"
              type="text"
            />
            <FatumPicker
              title="Tipo de precio"
              options={[
                { value: 'FIXED', label: 'Fijo' },
                { value: 'HOURLY', label: 'Por hora' },
              ]}
              value={priceType}
              onChange={setPriceType}
              fieldStyle="standard"
            />
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              border: '1px solid var(--border)',
              borderRadius: 12,
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={isNegotiable}
                onChange={e => setIsNegotiable(e.target.checked)}
                style={{ width: 20, height: 20, accentColor: 'var(--brand-primary)' }}
              />
              <div>
                <span className="text-body" style={{ fontWeight: 700, color: 'var(--text)' }}>Precio negociable</span>
                <span className="text-caption" style={{ color: 'var(--inactive)', display: 'block' }}>
                  El cliente puede proponer un precio diferente
                </span>
              </div>
            </label>
          </>
        )}

        {currentStep === 'details' && (
          <>
            <FatumTextField
              placeholder="Tiempo estimado (minutos)"
              value={estimatedTime}
              onChange={v => setEstimatedTime(v.replace(/[^0-9]/g, ''))}
              fieldStyle="standard"
              type="text"
            />
            <FatumPicker
              title="Categoría"
              options={categories.map(c => ({ value: c.slug, label: c.name }))}
              value={category}
              onChange={setCategory}
              fieldStyle="standard"
            />
          </>
        )}

        {currentStep === 'questions' && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--inactive)' }}>
            <p className="text-body">Funcionalidad de preguntas personalizadas</p>
            <p className="text-caption" style={{ marginTop: 8 }}>Próximamente podrás agregar preguntas que tus clientes deberán responder al contratar</p>
          </div>
        )}

        {currentStep === 'photos' && (
          <div style={{
            border: '2px dashed var(--border)',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            color: 'var(--inactive)',
          }}>
            <p className="text-body">Sube fotos de tu servicio</p>
            <p className="text-caption" style={{ marginTop: 8 }}>Arrastra o selecciona imágenes</p>
            <input type="file" accept="image/*" multiple style={{ marginTop: 16 }} />
          </div>
        )}

        <FatumButton variant="third" onClick={currentStep === 'photos' ? () => navigate('/my-services') : goNext}>
          {currentStep === 'photos' ? 'Crear servicio' : 'Siguiente'}
        </FatumButton>
      </div>
    </div>
  )
}
