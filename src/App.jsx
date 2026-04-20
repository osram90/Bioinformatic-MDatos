import { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

function App() {
  const [form, setForm] = useState({
    user_email: '',
    project_name: '',
    tier: 'bronze',
    kind: 'docking'
  });
  const [experiments, setExperiments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [topupCredits, setTopupCredits] = useState(100);
  const [spaces, setSpaces] = useState([]);
  const [capacityOffers, setCapacityOffers] = useState([]);
  const [spaceForm, setSpaceForm] = useState({
    owner_email: '',
    label: '',
    location: 'US-East',
    total_gpu_units: 8,
    total_cpu_units: 64,
    total_ram_gb: 256
  });
  const [offerForm, setOfferForm] = useState({
    space_id: '',
    seller_email: '',
    kind: 'docking',
    gpu_units: 1,
    cpu_units: 8,
    ram_gb: 32,
    price_usd_hour: 0.7
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const year = useMemo(() => new Date().getFullYear(), []);

  const fetchExperiments = async () => {
    const res = await fetch(`${API_BASE_URL}/api/lab/experiments`);
    if (!res.ok) return;
    setExperiments(await res.json());
  };

  const fetchPlans = async () => {
    const res = await fetch(`${API_BASE_URL}/api/plans`);
    if (!res.ok) return;
    setPlans(await res.json());
  };

  const fetchWallet = async (email) => {
    if (!email) return;
    const res = await fetch(`${API_BASE_URL}/api/wallet/${email}`);
    if (!res.ok) return;
    setWallet(await res.json());
  };

  const fetchSpaces = async () => {
    const res = await fetch(`${API_BASE_URL}/api/infra/spaces`);
    if (!res.ok) return;
    const data = await res.json();
    setSpaces(data);
    if (!offerForm.space_id && data[0]?.id) {
      setOfferForm((prev) => ({ ...prev, space_id: data[0].id }));
    }
  };

  const fetchCapacityOffers = async () => {
    const res = await fetch(`${API_BASE_URL}/api/infra/capacity-offers`);
    if (!res.ok) return;
    setCapacityOffers(await res.json());
  };

  useEffect(() => {
    fetchPlans();
    fetchExperiments();
    fetchSpaces();
    fetchCapacityOffers();
  }, []);

  const onTopup = async () => {
    if (!form.user_email) {
      setMessage('Primero ingresa correo de usuario para recargar wallet.');
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/wallet/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: form.user_email, credits: Number(topupCredits) })
    });

    if (!res.ok) {
      setMessage('No se pudo recargar wallet.');
      return;
    }

    setWallet(await res.json());
    setMessage('Wallet recargada correctamente.');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/lab/experiments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'No se pudo lanzar el experimento.');
      }

      setMessage('Experimento creado y enviado al orquestador.');
      await fetchExperiments();
      await fetchWallet(form.user_email);
    } catch (error) {
      setMessage(error.message || 'Error creando experimento.');
    } finally {
      setLoading(false);
    }
  };

  const onCreateSpace = async (event) => {
    event.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/infra/spaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...spaceForm,
        total_gpu_units: Number(spaceForm.total_gpu_units),
        total_cpu_units: Number(spaceForm.total_cpu_units),
        total_ram_gb: Number(spaceForm.total_ram_gb)
      })
    });

    if (!res.ok) {
      setMessage('No se pudo registrar el espacio de cómputo.');
      return;
    }
    const created = await res.json();
    setMessage(`Espacio registrado: ${created.label}.`);
    await fetchSpaces();
  };

  const onCreateOffer = async (event) => {
    event.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/infra/capacity-offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...offerForm,
        gpu_units: Number(offerForm.gpu_units),
        cpu_units: Number(offerForm.cpu_units),
        ram_gb: Number(offerForm.ram_gb),
        price_usd_hour: Number(offerForm.price_usd_hour)
      })
    });
    if (!res.ok) {
      setMessage('No se pudo publicar la subrenta de capacidad.');
      return;
    }
    setMessage('Oferta de subrenta publicada.');
    await fetchCapacityOffers();
  };

  const onRequestDownload = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/lab/experiments/${id}/download-url`, {
      method: 'POST'
    });

    if (!res.ok) {
      alert('Aún no hay URL de descarga disponible.');
      return;
    }

    const data = await res.json();
    window.open(data.download_url, '_blank');
  };

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrapper">
          <a href="#inicio" className="brand">
            <span className="brand-mark">MD</span>
            <div>
              <p className="brand-title">MDatos.ai</p>
              <p className="brand-subtitle">Docking + Dinámica Molecular as a Service</p>
            </div>
          </a>
          <nav className="main-nav">
            <a href="#servicios">Servicios</a>
            <a href="#laboratorio">Mi Laboratorio</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="container hero-grid">
            <div>
              <p className="kicker">SaaS/PaaS Bioinformática Comercial</p>
              <h1>Automatiza Docking y MD con cobro previo y entrega segura de resultados.</h1>
              <p className="hero-text">
                Modelo por créditos Bronze/Plata/Oro, ejecución automática en cómputo arrendado y
                descarga con URLs firmadas temporales.
              </p>
            </div>
            <article className="hero-card">
              <h2>Planes activos</h2>
              <ul>
                {plans.map((plan) => (
                  <li key={plan.code}>
                    <strong>{plan.display_name}</strong> · {plan.credits_per_session} créditos/sesión · tope USD {plan.max_hourly_usd}/h
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="laboratorio" className="section">
          <div className="container two-col">
            <form className="contact-form" onSubmit={onSubmit}>
              <h2>Mi Laboratorio</h2>
              <label>
                Correo de usuario
                <input
                  type="email"
                  value={form.user_email}
                  onChange={(e) => {
                    const email = e.target.value;
                    setForm((prev) => ({ ...prev, user_email: email }));
                    fetchWallet(email);
                  }}
                  required
                />
              </label>

              <div className="card">
                <h3>Wallet</h3>
                <p>Créditos actuales: <strong>{wallet?.credits ?? 0}</strong></p>
                <label>
                  Recarga de créditos
                  <input type="number" value={topupCredits} onChange={(e) => setTopupCredits(e.target.value)} min="1" />
                </label>
                <button type="button" className="btn btn-sm" onClick={onTopup}>Recargar wallet</button>
              </div>

              <label>
                Nombre del proyecto
                <input
                  type="text"
                  value={form.project_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, project_name: e.target.value }))}
                  required
                />
              </label>
              <label>
                Tier de cómputo
                <select value={form.tier} onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value }))}>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Plata</option>
                  <option value="gold">Oro</option>
                </select>
              </label>
              <label>
                Tipo de experimento
                <select value={form.kind} onChange={(e) => setForm((prev) => ({ ...prev, kind: e.target.value }))}>
                  <option value="docking">Docking</option>
                  <option value="molecular_dynamics">Dinámica Molecular</option>
                  <option value="hybrid">Híbrido</option>
                </select>
              </label>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Lanzando...' : 'Lanzar experimento'}
              </button>
              {message ? <p className="status warning">{message}</p> : null}
            </form>

            <div className="card">
              <h2>Histórico de experimentos</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Proyecto</th>
                      <th>Tier</th>
                      <th>Kind</th>
                      <th>Estado</th>
                      <th>Créditos</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiments.map((exp) => (
                      <tr key={exp.id}>
                        <td>{exp.project_name}</td>
                        <td>{exp.tier}</td>
                        <td>{exp.kind}</td>
                        <td>{exp.status}</td>
                        <td>{exp.credits_reserved}</td>
                        <td>
                          <button className="btn btn-sm" onClick={() => onRequestDownload(exp.id)}>
                            Descargar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="servicios" className="section section-soft">
          <div className="container two-col">
            <form className="contact-form" onSubmit={onCreateSpace}>
              <h2>Renta de espacios de cómputo</h2>
              <label>
                Correo del dueño del espacio
                <input
                  type="email"
                  value={spaceForm.owner_email}
                  onChange={(e) => setSpaceForm((prev) => ({ ...prev, owner_email: e.target.value }))}
                  required
                />
              </label>
              <label>
                Nombre comercial del espacio
                <input
                  type="text"
                  value={spaceForm.label}
                  onChange={(e) => setSpaceForm((prev) => ({ ...prev, label: e.target.value }))}
                  required
                />
              </label>
              <label>
                Ubicación
                <input
                  type="text"
                  value={spaceForm.location}
                  onChange={(e) => setSpaceForm((prev) => ({ ...prev, location: e.target.value }))}
                  required
                />
              </label>
              <label>
                GPU totales
                <input type="number" min="1" value={spaceForm.total_gpu_units} onChange={(e) => setSpaceForm((prev) => ({ ...prev, total_gpu_units: e.target.value }))} />
              </label>
              <label>
                CPU totales
                <input type="number" min="1" value={spaceForm.total_cpu_units} onChange={(e) => setSpaceForm((prev) => ({ ...prev, total_cpu_units: e.target.value }))} />
              </label>
              <label>
                RAM total (GB)
                <input type="number" min="1" value={spaceForm.total_ram_gb} onChange={(e) => setSpaceForm((prev) => ({ ...prev, total_ram_gb: e.target.value }))} />
              </label>
              <button className="btn" type="submit">Registrar espacio</button>
            </form>

            <div className="card">
              <h2>Espacios registrados</h2>
              <ul>
                {spaces.map((space) => (
                  <li key={space.id}>
                    <strong>{space.label}</strong> ({space.location}) · {space.total_gpu_units} GPU · {space.total_cpu_units} CPU · {space.total_ram_gb} GB RAM
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="container two-col" style={{ marginTop: '1rem' }}>
            <form className="contact-form" onSubmit={onCreateOffer}>
              <h2>Subrenta de capacidad</h2>
              <label>
                Espacio fuente
                <select value={offerForm.space_id} onChange={(e) => setOfferForm((prev) => ({ ...prev, space_id: e.target.value }))} required>
                  <option value="">Selecciona espacio</option>
                  {spaces.map((space) => (
                    <option key={space.id} value={space.id}>
                      {space.label} ({space.location})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Correo vendedor
                <input
                  type="email"
                  value={offerForm.seller_email}
                  onChange={(e) => setOfferForm((prev) => ({ ...prev, seller_email: e.target.value }))}
                  required
                />
              </label>
              <label>
                Tipo de workload
                <select value={offerForm.kind} onChange={(e) => setOfferForm((prev) => ({ ...prev, kind: e.target.value }))}>
                  <option value="docking">Docking</option>
                  <option value="molecular_dynamics">Dinámica Molecular</option>
                  <option value="hybrid">Híbrido</option>
                </select>
              </label>
              <label>
                GPU subarrendadas
                <input type="number" min="1" value={offerForm.gpu_units} onChange={(e) => setOfferForm((prev) => ({ ...prev, gpu_units: e.target.value }))} />
              </label>
              <label>
                CPU subarrendadas
                <input type="number" min="1" value={offerForm.cpu_units} onChange={(e) => setOfferForm((prev) => ({ ...prev, cpu_units: e.target.value }))} />
              </label>
              <label>
                RAM subarrendada (GB)
                <input type="number" min="1" value={offerForm.ram_gb} onChange={(e) => setOfferForm((prev) => ({ ...prev, ram_gb: e.target.value }))} />
              </label>
              <label>
                Precio USD/h
                <input type="number" step="0.01" min="0.01" value={offerForm.price_usd_hour} onChange={(e) => setOfferForm((prev) => ({ ...prev, price_usd_hour: e.target.value }))} />
              </label>
              <button className="btn" type="submit">Publicar subrenta</button>
            </form>

            <div className="card">
              <h2>Marketplace de capacidad (open)</h2>
              <ul>
                {capacityOffers.map((offer) => (
                  <li key={offer.id}>
                    <strong>{offer.kind}</strong> · USD {offer.price_usd_hour}/h · {offer.gpu_units} GPU / {offer.cpu_units} CPU / {offer.ram_gb} GB
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <p>© {year} MDatos.ai</p>
          <p>Backend orquestador + UI de laboratorio alineados al flujo comercial.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
