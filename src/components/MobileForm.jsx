import { useState } from 'react'

const empty = {
  name: '', brand: '', price: '', ram: '8 GB', storage: '128 GB', image: '', description: '',
  display: '', processor: '', camera: '', frontCamera: '', battery: '', charging: '',
  os: '', network: '', sim: '', weight: '', colors: '', launchYear: '', warranty: '',
}

// Shrinks the photo so it fits in browser storage
function fileToDataUrl(file, maxSize = 500) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

const optionalFields = [
  ['display', 'Display'], ['processor', 'Processor'], ['os', 'Operating system'],
  ['camera', 'Rear camera'], ['frontCamera', 'Front camera'],
  ['battery', 'Battery'], ['charging', 'Charging'],
  ['network', 'Network'], ['sim', 'SIM'], ['weight', 'Weight'],
  ['colors', 'Colours'], ['launchYear', 'Launch year'], ['warranty', 'Warranty'],
]

export default function MobileForm({ initial, onSubmit, onCancel }) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(initial ? { ...empty, ...initial } : empty)
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const pickImage = async (e) => {
    const file = e.target.files[0]
    if (file) setForm({ ...form, image: await fileToDataUrl(file) })
  }

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, price: Number(form.price) })
  }

  return (
    <form className="panel form" onSubmit={submit}>
      <h2>{isEdit ? `Edit ${initial.name}` : 'Add a mobile'}</h2>
      <label>Name<input name="name" value={form.name} onChange={set} required /></label>
      <label>Brand<input name="brand" value={form.brand} onChange={set} required /></label>
      <label>Price (₹)<input name="price" type="number" min="1" value={form.price} onChange={set} required /></label>
      <label>RAM
        <select name="ram" value={form.ram} onChange={set}>
          {['4 GB', '6 GB', '8 GB', '12 GB', '16 GB'].map((r) => <option key={r}>{r}</option>)}
        </select>
      </label>
      <label>Storage
        <select name="storage" value={form.storage} onChange={set}>
          {['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label>Description
        <textarea name="description" rows="3" value={form.description} onChange={set} />
      </label>
      <label>{isEdit ? 'Change photo (optional)' : 'Photo'}
        <input type="file" accept="image/*" onChange={pickImage} />
      </label>
      {form.image && <img src={form.image} alt="Preview" style={{ maxHeight: 120, objectFit: 'contain' }} />}

      <details open={isEdit}>
        <summary>More details (optional)</summary>
        <div className="form" style={{ marginTop: '.8rem' }}>
          {optionalFields.map(([key, label]) => (
            <label key={key}>{label}
              <input name={key} value={form[key]} onChange={set} />
            </label>
          ))}
        </div>
      </details>

      <div className="row">
        <button className="btn primary" type="submit">{isEdit ? 'Save changes' : 'Add mobile'}</button>
        <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}