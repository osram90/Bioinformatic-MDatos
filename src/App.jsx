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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const year = useMemo(() => new Date().getFullYear(), []);

  const fetchExperiments = async () => {
    const res = await fetch(`${API_BASE_URL}/api/lab/experiments`);
    if (!res.ok) return;
    const data = await res.json();
    setExperiments(data);
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

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

      if (!res.ok) throw new Error('No se pudo lanzar el experimento.');

      setMessage('Experimento creado y enviado al orquestador.');
      setForm((prev) => ({ ...prev, project_name: '' }));
      await fetchExperiments();
    } catch {
      setMessage('Error creando experimento. Revisa backend/API.');
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
            <a href="#flujo">Flujo</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="container hero-grid">
            <div>
              <p className="kicker">SaaS/PaaS Bioinformática Comercial</p>
              <h1>Resultados de Docking y MD sin administrar HPC ni código.</h1>
              <p className="hero-text">
                MDatos.ai cobra por paquete de cómputo, orquesta nodos GPU/CPU en background y entrega
                resultados con descarga segura temporal.
              </p>
              <div className="hero-cta">
                <a href="#laboratorio" className="btn">Ir a Mi Laboratorio</a>
              </div>
            </div>
            <article className="hero-card">
              <h2>Objetivo de negocio</h2>
              <ul>
                <li>Cobro previo por créditos (Bronze/Plata/Oro).</li>
                <li>Ejecución automática sobre cómputo arrendado.</li>
                <li>Entrega final segura con Signed URLs.</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="servicios" className="section section-dark">
          <div className="container cards">
            <article className="card">
              <h3>Docking Molecular</h3>
              <p>Perfil optimizado por CPU/costo para screening rápido y rentable.</p>
            </article>
            <article className="card">
              <h3>Dinámica Molecular</h3>
              <p>Perfil optimizado por GPU/VRAM para estabilidad y análisis profundo.</p>
            </article>
            <article className="card">
              <h3>Automatización End-to-End</h3>
              <p>Launch, tracking, almacenamiento de resultados y destrucción de nodo sin intervención.</p>
            </article>
          </div>
        </section>

        <section id="laboratorio" className="section">
          <div className="container two-col">
            <form className="contact-form" onSubmit={onSubmit}>
              <h2>Mi Laboratorio · Lanzar experimento</h2>
              <label>
                Correo de usuario
                <input
                  type="email"
                  value={form.user_email}
                  onChange={(e) => setForm((prev) => ({ ...prev, user_email: e.target.value }))}
                  required
                />
              </label>
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
                <select
                  value={form.tier}
                  onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value }))}
                >
                  <option value="bronze">Bronze</option>
                  <option value="silver">Plata</option>
                  <option value="gold">Oro</option>
                </select>
              </label>
              <label>
                Tipo de experimento
                <select
                  value={form.kind}
                  onChange={(e) => setForm((prev) => ({ ...prev, kind: e.target.value }))}
                >
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
              <h2>Histórico</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Proyecto</th>
                      <th>Tier</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiments.map((exp) => (
                      <tr key={exp.id}>
                        <td>{exp.project_name}</td>
                        <td>{exp.tier}</td>
                        <td>{exp.status}</td>
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

        <section id="flujo" className="section section-dark">
          <div className="container">
            <h2>Flujo automatizado objetivo</h2>
            <ol className="check-list">
              <li>Pago y reserva de créditos.</li>
              <li>Selección de oferta y creación de instancia (Vast.ai).</li>
              <li>Ejecución de contenedor bioinformático.</li>
              <li>Subida de resultados a S3/B2 + Signed URL temporal.</li>
              <li>Destrucción automática de nodo y notificación al usuario.</li>
            </ol>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <p>© {year} MDatos.ai</p>
          <p>Plataforma operativa en evolución (frontend + backend orquestador).</p>
        </div>
      </footer>
    </>
  );
}

export default App;
