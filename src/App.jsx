import { useMemo, useState } from 'react';

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#infraestructura', label: 'Infraestructura' },
  { href: '#planes', label: 'Planes' },
  { href: '#portal-lab', label: 'Portal Lab' },
  { href: '#faq', label: 'FAQ' }
];

const faqs = [
  {
    q: '¿Ya puedo ejecutar experimentos directamente?',
    a: 'En esta etapa, el portal es comercial + operación inicial. La ejecución automática del laboratorio se activa al integrar backend y orquestador.'
  },
  {
    q: '¿Pueden firmar NDA?',
    a: 'Sí. Podemos operar con acuerdos de confidencialidad desde el inicio del proyecto.'
  },
  {
    q: '¿Cómo entra Vast.ai en el flujo?',
    a: 'Vast.ai se usa como cómputo arrendado detrás del portal. El cliente no lo ve; recibe acceso a su entorno y resultados.'
  }
];

const plans = [
  {
    title: 'Piloto Docking',
    scope: 'Priorización inicial de compuestos',
    items: ['Preparación de estructura y ligandos', 'Ranking de afinidad', 'Resumen ejecutivo'],
    cta: 'Solicitar piloto'
  },
  {
    title: 'Piloto MD',
    scope: 'Estabilidad temporal de complejo',
    items: ['Configuración de sistema', 'Métricas RMSD/RMSF/energía', 'Recomendaciones de siguiente fase'],
    cta: 'Solicitar piloto'
  },
  {
    title: 'Combo Discovery',
    scope: 'Docking + dinámica molecular',
    items: ['Selección de candidatos', 'Validación por dinámica', 'Roadmap técnico de escalamiento'],
    cta: 'Agendar sesión'
  }
];

const gpuRates = {
  'RTX 4090': 0.65,
  'RTX A6000': 0.85,
  'A100 40GB': 1.8
};

function App() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);
  const [gpuType, setGpuType] = useState('RTX 4090');
  const [hours, setHours] = useState(24);

  const closeMenu = () => setMenuOpen(false);
  const estimate = useMemo(() => (gpuRates[gpuType] ?? 0) * hours, [gpuType, hours]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;

    if (!endpoint) {
      setStatus({
        type: 'warning',
        message:
          'Falta configurar VITE_FORM_ENDPOINT. Por ahora escríbenos a contacto@mdatos.bio.'
      });
      window.location.href = 'mailto:contacto@mdatos.bio?subject=Consulta%20MDatos-Bioinformatica';
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: 'idle', message: '' });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });

      if (!response.ok) {
        throw new Error('No fue posible enviar el formulario.');
      }

      form.reset();
      setStatus({ type: 'success', message: 'Solicitud enviada. Te contactamos pronto.' });
    } catch {
      setStatus({ type: 'error', message: 'Error enviando formulario. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrapper">
          <a href="#inicio" className="brand" onClick={closeMenu}>
            <span className="brand-mark">MD</span>
            <div>
              <p className="brand-title">MDatos-Bioinformatica</p>
              <p className="brand-subtitle">Bioinformática aplicada</p>
            </div>
          </a>

          <button
            className="menu-toggle"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((v) => !v)}
          >
            ☰
          </button>

          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <a href="#contacto" className="btn btn-sm" onClick={closeMenu}>
              Agendar reunión
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="container hero-grid">
            <div>
              <p className="kicker">Ciencia + Tecnología + Velocidad</p>
              <h1>Portal comercial + laboratorio in silico escalable sobre cómputo arrendado.</h1>
              <p className="hero-text">
                Estamos dejando listo el flujo completo: captación comercial en portal, provisión de
                contenedores con paquetes preinstalados y ejecución en infraestructura tipo Vast.ai.
              </p>
              <div className="hero-cta">
                <a href="#portal-lab" className="btn">
                  Ver interfaz de laboratorio
                </a>
                <a href="#contacto" className="btn btn-ghost">
                  Iniciar piloto
                </a>
              </div>
              <ul className="hero-metrics">
                <li>
                  <strong>48-72h</strong>
                  <span>para plan inicial</span>
                </li>
                <li>
                  <strong>1-3 semanas</strong>
                  <span>piloto entregable</span>
                </li>
                <li>
                  <strong>Privado</strong>
                  <span>orquestación no visible al cliente final</span>
                </li>
              </ul>
            </div>

            <article className="hero-card">
              <h2>Estado actual</h2>
              <ul>
                <li>✅ Portal operativo para ventas y captación.</li>
                <li>✅ Flujo de propuesta y solicitud de laboratorio.</li>
                <li>🟡 Pendiente: conexión backend real con proveedor de cómputo.</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="servicios" className="section">
          <div className="container">
            <p className="kicker">Servicios iniciales</p>
            <h2>Oferta comercial clara para salir a vender desde hoy</h2>
            <div className="cards">
              <article className="card">
                <h3>Molecular Docking</h3>
                <p>Simulación de afinidad y poses de unión para seleccionar compuestos con potencial.</p>
              </article>
              <article className="card">
                <h3>Dinámica Molecular</h3>
                <p>Evaluación temporal de estabilidad conformacional y comportamiento del complejo.</p>
              </article>
              <article className="card">
                <h3>Asesoría I+D</h3>
                <p>Definición de estrategia computacional, criterios de éxito y plan de escalamiento.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="infraestructura" className="section section-dark">
          <div className="container two-col">
            <div>
              <p className="kicker">Infraestructura (backend privado)</p>
              <h2>Arquitectura propuesta para contenedores + GPU/CPU rentadas</h2>
              <p>
                El cliente usa tu portal. Por detrás, tu backend crea y gestiona un contenedor de
                laboratorio con UI y Jupyter Notebook, conectado a recursos arrendados (p. ej. Vast.ai).
              </p>
            </div>
            <ul className="check-list">
              <li>1) Portal recibe solicitud de experimento.</li>
              <li>2) Backend crea/enciende contenedor preconfigurado.</li>
              <li>3) Se asigna GPU/CPU y almacenamiento temporal.</li>
              <li>4) Se entrega acceso controlado + reporte al finalizar.</li>
            </ul>
          </div>
        </section>

        <section id="planes" className="section">
          <div className="container">
            <p className="kicker">Planes iniciales</p>
            <h2>Paquetes pensados para vender y escalar</h2>
            <div className="cards">
              {plans.map((plan) => (
                <article className="card" key={plan.title}>
                  <h3>{plan.title}</h3>
                  <p>{plan.scope}</p>
                  <ul>
                    {plan.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <a href="#contacto" className="btn btn-plan">
                    {plan.cta}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="portal-lab" className="section section-dark">
          <div className="container two-col">
            <div>
              <p className="kicker">Interfaz gráfica del laboratorio (demo)</p>
              <h2>Solicitar entorno de cómputo para experimentos in silico</h2>
              <p>
                Esta interfaz ya puede incluirse en el portal. Próximo paso: conectar estos campos a tu
                backend para crear instancias reales y exponer notebook/UI bajo autenticación.
              </p>
            </div>
            <article className="card estimator-card">
              <h3>Estimador rápido de cómputo</h3>
              <label>
                Tipo de GPU
                <select value={gpuType} onChange={(e) => setGpuType(e.target.value)}>
                  {Object.keys(gpuRates).map((gpu) => (
                    <option key={gpu}>{gpu}</option>
                  ))}
                </select>
              </label>
              <label>
                Horas estimadas
                <input
                  type="number"
                  min="1"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value) || 1)}
                />
              </label>
              <p className="estimate-result">
                Estimado infraestructura: <strong>USD {estimate.toFixed(2)}</strong>
              </p>
              <small>
                *Cálculo orientativo para preventa. El precio final depende de disponibilidad y región.
              </small>
            </article>
          </div>
        </section>

        <section id="faq" className="section">
          <div className="container">
            <p className="kicker">Preguntas frecuentes</p>
            <h2>Respuestas rápidas</h2>
            <div className="faq-grid">
              {faqs.map((item) => (
                <article className="card" key={item.q}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="section cta-section">
          <div className="container cta-grid">
            <div>
              <p className="kicker">Siguiente paso</p>
              <h2>Iniciamos tu propuesta técnica-comercial esta semana</h2>
              <p>
                Completa el formulario y te devolvemos un plan de trabajo, estimación y ruta de
                implementación de laboratorio privado.
              </p>
              <p>
                <a className="text-link" href="mailto:contacto@mdatos.bio">
                  contacto@mdatos.bio
                </a>
              </p>
              {status.message ? <p className={`status ${status.type}`}>{status.message}</p> : null}
            </div>

            <form className="contact-form" onSubmit={onSubmit}>
              <input type="hidden" name="_subject" value="Nueva consulta MDatos-Bioinformatica" />
              <label>
                Nombre
                <input type="text" name="nombre" required />
              </label>
              <label>
                Correo
                <input type="email" name="email" required />
              </label>
              <label>
                Organización
                <input type="text" name="organizacion" required />
              </label>
              <label>
                Objetivo principal
                <select name="objetivo" required>
                  <option value="">Selecciona</option>
                  <option>Lanzar servicio Docking</option>
                  <option>Lanzar servicio Dinámica Molecular</option>
                  <option>Montar laboratorio con contenedor + Jupyter</option>
                </select>
              </label>
              <label>
                Mensaje
                <textarea rows="4" name="mensaje" required />
              </label>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <p>© {year} MDatos-Bioinformatica</p>
          <p>Startup mode: vender, ejecutar, escalar.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
