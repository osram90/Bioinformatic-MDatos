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

  useEffect(() => {
    fetchPlans();
    fetchExperiments();
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
