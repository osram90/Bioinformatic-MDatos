import { useMemo, useState } from 'react';

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#entregables', label: 'Entregables' },
  { href: '#metodologia', label: 'Metodología' },
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
    q: '¿El trabajo es reproducible?',
    a: 'Sí. Se entregan parámetros, metodología y estructura de resultados para trazabilidad.'
  }
];

function App() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
              <h1>Simulaciones moleculares confiables para decisiones de I+D más rápidas.</h1>
              <p className="hero-text">
                Integramos rigurosidad científica con ejecución startup para entregar análisis
                accionables en <strong>molecular docking</strong> y <strong>dinámica molecular</strong>.
              </p>
              <div className="hero-cta">
                <a href="#contacto" className="btn">
                  Solicitar propuesta
                </a>
                <a href="#servicios" className="btn btn-ghost">
                  Ver servicios
                </a>
              </div>
            </div>

            <article className="hero-card">
              <h2>En qué ayudamos</h2>
              <ul>
                <li>Priorización de moléculas candidatas para validación experimental.</li>
                <li>Evaluación de estabilidad proteína-ligando con evidencia cuantitativa.</li>
                <li>Recomendaciones claras para la siguiente etapa de I+D.</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="servicios" className="section">
          <div className="container">
            <p className="kicker">Servicios iniciales</p>
            <h2>Inicio enfocado: Docking y Dinámica Molecular</h2>
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
                <h3>Asesoría Científica</h3>
                <p>Definición de estrategia computacional, criterios de éxito y plan de escalamiento.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="entregables" className="section section-dark">
          <div className="container two-col">
            <div>
              <p className="kicker">Qué recibes</p>
              <h2>Entregables listos para discusión científica</h2>
            </div>
            <ul className="check-list">
              <li>Reporte ejecutivo con hallazgos y riesgos.</li>
              <li>Anexo técnico reproducible con parámetros usados.</li>
              <li>Sesión de resultados para decisiones de siguiente fase.</li>
            </ul>
          </div>
        </section>

        <section id="metodologia" className="section">
          <div className="container">
            <p className="kicker">Cómo trabajamos</p>
            <h2>Proceso simple para comenzar rápido</h2>
            <div className="timeline">
              <article>
                <span>1</span>
                <h3>Kickoff</h3>
                <p>Objetivo biológico, datos disponibles y prioridad.</p>
              </article>
              <article>
                <span>2</span>
                <h3>Propuesta técnica</h3>
                <p>Alcance, tiempos y criterios de evaluación.</p>
              </article>
              <article>
                <span>3</span>
                <h3>Ejecución + reporte</h3>
                <p>Simulaciones, análisis e informe final accionable.</p>
              </article>
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
              <p className="kicker">Escalemos juntos</p>
              <h2>¿Listos para iniciar un piloto?</h2>
              <p>
                Escríbenos y te respondemos con una propuesta técnica inicial para docking y/o
                dinámica molecular.
              </p>
              <p>
                <a className="text-link" href="mailto:contacto@mdatos.bio">
                  contacto@mdatos.bio
                </a>
              </p>
            </div>

            <form className="contact-form" action="https://formspree.io/f/your-form-id" method="POST">
              <label>
                Nombre
                <input type="text" name="nombre" required />
              </label>
              <label>
                Correo
                <input type="email" name="email" required />
              </label>
              <label>
                Servicio
                <select name="servicio" required>
                  <option value="">Selecciona</option>
                  <option>Docking Molecular</option>
                  <option>Dinámica Molecular</option>
                  <option>Ambos</option>
                </select>
              </label>
              <label>
                Mensaje
                <textarea rows="4" name="mensaje" required />
              </label>
              <button className="btn" type="submit">
                Enviar solicitud
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <p>© {year} MDatos-Bioinformatica</p>
          <p>Portal React + Vite listo para desplegar.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
