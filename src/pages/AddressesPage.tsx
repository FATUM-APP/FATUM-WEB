import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X } from 'lucide-react'
import AddressCard from '../components/AddressCard'
import FatumButton from '../components/FatumButton'
import FatumTextField from '../components/FatumTextField'
import { useAddresses } from '../context/AddressContext'
import { useResponsive } from '../hooks/useResponsive'

export default function AddressesPage() {
  const { addresses, principalAddress, createAddress, makePrincipal, deleteAddress } = useAddresses()
  const navigate = useNavigate()
  const { layout } = useResponsive()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [residence, setResidence] = useState('')
  const [alias, setAlias] = useState('')

  const filtered = addresses.filter(a =>
    a.alias.toLowerCase().includes(search.toLowerCase()) ||
    a.residence.toLowerCase().includes(search.toLowerCase())
  )

  const principal = filtered.find(a => principalAddress?.alias === a.alias)
  const others = filtered.filter(a => principalAddress?.alias !== a.alias)

  const handleCreate = async () => {
    if (!country || !state || !city || !residence || !alias) return
    await createAddress({ country, state, city, residence, alias })
    setShowForm(false)
    setCountry(''); setState(''); setCity(''); setResidence(''); setAlias('')
  }

  return (
    <div style={{ padding: layout.padding, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: layout.spacingMedium }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--brand-primary)' }}
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-header" style={{ color: 'var(--brand-primary)', flex: 1 }}>
          Direcciones
        </h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            backgroundColor: 'var(--brand-primary)', color: 'white',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Plus size={18} />
        </button>
      </div>

      <div style={{ marginBottom: layout.spacingMedium }}>
        <FatumTextField
          placeholder="Buscar dirección"
          value={search}
          onChange={setSearch}
          prefixIcon="search"
          fieldStyle="standard"
        />
      </div>

      {principal && (
        <div style={{ marginBottom: layout.spacingMedium }}>
          <h2 className="text-subheader" style={{ color: 'var(--text)', marginBottom: layout.internalSpacing }}>
            Dirección principal
          </h2>
          <AddressCard
            address={principal}
            isPrincipal
            onDelete={() => deleteAddress(principal.alias)}
          />
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h2 className="text-subheader" style={{ color: 'var(--text)', marginBottom: layout.internalSpacing }}>
            Otras direcciones
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {others.map(addr => (
              <AddressCard
                key={addr.alias}
                address={addr}
                onMakePrincipal={() => makePrincipal(addr.alias)}
                onDelete={() => deleteAddress(addr.alias)}
              />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--inactive)' }}>
          <p className="text-body">No tienes direcciones registradas</p>
        </div>
      )}

      {showForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            backgroundColor: 'var(--brand-secondary)', borderRadius: 16,
            padding: layout.padding, width: '100%', maxWidth: 440,
            maxHeight: '90vh', overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: layout.spacingMedium }}>
              <h2 className="text-subheader" style={{ color: 'var(--brand-primary)' }}>Nueva dirección</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--inactive)' }}>
                <X size={22} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: layout.internalSpacing }}>
              <FatumTextField placeholder="País" value={country} onChange={setCountry} fieldStyle="standard" />
              <FatumTextField placeholder="Departamento / Estado" value={state} onChange={setState} fieldStyle="standard" />
              <FatumTextField placeholder="Ciudad" value={city} onChange={setCity} fieldStyle="standard" />
              <FatumTextField placeholder="Dirección de residencia" value={residence} onChange={setResidence} fieldStyle="standard" />
              <FatumTextField placeholder="Alias (ej: Casa, Oficina)" value={alias} onChange={setAlias} fieldStyle="standard" />
              <FatumButton variant="third" onClick={handleCreate}>Guardar dirección</FatumButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
