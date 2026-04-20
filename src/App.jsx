import { useMemo, useState } from 'react';

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#caso-demo', label: 'Caso demo' },
  { href: '#planes', label: 'Planes' },
  { href: '#faq', label: 'FAQ' }
];

const faqs = [
  {
    q: '¿Cuánto tarda un piloto?',
    a: 'Generalmente de 1 a 3 semanas según volumen, objetivo biológico y complejidad.'
  },
  {
    q: '¿Pueden firmar NDA?',
    a: 'Sí. Podemos operar con acuerdos de confidencialidad desde el inicio del proyecto.'
  },
  {
    q: '¿Qué recibo al finalizar?',
    a: 'Reporte ejecutivo, anexo técnico reproducible y sesión de resultados para decisiones de I+D.'
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

function App() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
    } catch (error) {
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
              <h1>Conviértete en una startup bioinformática que entrega resultados reales.</h1>
              <p className="hero-text">
                Te apoyamos con <strong>molecular docking</strong> y <strong>dinámica molecular</strong>
                en formato servicio-producto: rápido para vender, sólido para escalar.
              </p>
              <div className="hero-cta">
                <a href="#contacto" className="btn">
                  Iniciar piloto
                </a>
                <a href="#planes" className="btn btn-ghost">
                  Ver planes
                </a>
              </div>
              <ul className="hero-metrics">
                <li>
                  <strong>48-72h</strong>
                  <span>para plan inicial</span>
                </li>
                <li>
                  <strong>1-3 semanas</strong>
                  <span>para piloto entregable</span>
                </li>
                <li>
                  <strong>Escalable</strong>
                  <span>de servicio a SaaS</span>
                </li>
              </ul>
            </div>

            <article className="hero-card">
              <h2>Qué logramos contigo</h2>
              <ul>
                <li>Priorización de moléculas candidatas para validación experimental.</li>
                <li>Evaluación de estabilidad proteína-ligando con evidencia cuantitativa.</li>
                <li>Informe accionable para comité científico y toma de decisiones.</li>
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

        <section id="caso-demo" className="section section-dark">
          <div className="container two-col">
            <div>
              <p className="kicker">Caso demo</p>
              <h2>Ejemplo de resultado que puedes mostrar a clientes</h2>
              <p>
                Pilotamos un target enzimático con 40 ligandos. Se priorizaron 6 candidatos top por
                docking y se validaron 3 complejos estables en dinámica molecular de producción.
              </p>
            </div>
            <ul className="check-list">
              <li>40 ligandos evaluados en screening inicial.</li>
              <li>6 candidatos top por score e interacciones clave.</li>
              <li>3 complejos con estabilidad consistente en MD.</li>
              <li>1 reporte ejecutivo + anexo técnico reproducible.</li>
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

        <section id="faq" className="section section-dark">
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
              <h2>Iniciamos tu primera propuesta esta semana</h2>
              <p>
                Completa el formulario y te devolvemos un plan técnico-comercial para comenzar el piloto.
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
                Servicio
                <select name="servicio" required>
                  <option value="">Selecciona</option>
                  <option>Docking Molecular</option>
                  <option>Dinámica Molecular</option>
                  <option>Combo Discovery</option>
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
