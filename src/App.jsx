import { useMemo, useState } from 'react';

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#infraestructura', label: 'Infraestructura' },
  { href: '#planes', label: 'Planes' },
  { href: '#portal-lab', label: 'Portal Lab' },
  { href: '#faq', label: 'FAQ' }
];

const outcomes = [
  {
    title: 'Decisiones más rápidas',
    desc: 'Reduce ciclos de prueba-error con resultados estructurados para priorizar experimentos.'
  },
  {
    title: 'Menor costo experimental',
    desc: 'Filtra candidatos antes de laboratorio húmedo y optimiza uso de recursos.'
  },
  {
    title: 'Escalabilidad operativa',
    desc: 'Pasa de un piloto puntual a un flujo de descubrimiento continuo.'
  }
];

const faqs = [
  {
    q: '¿Ya puedo ejecutar experimentos directamente?',
    a: 'Hoy el portal está listo para captación comercial y solicitud de laboratorio. La ejecución 100% automática se activa en la siguiente fase backend.'
  },
  {
    q: '¿Pueden firmar NDA?',
    a: 'Sí. Operamos con acuerdos de confidencialidad desde el inicio del proyecto.'
  },
  {
    q: '¿Cómo entra Vast.ai en el flujo?',
    a: 'Vast.ai funciona como cómputo arrendado detrás del portal. Tu cliente recibe servicio y resultados, no la complejidad de infraestructura.'
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

      if (!response.ok) throw new Error('No fue posible enviar el formulario.');
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

          <button className="menu-toggle" aria-label="Abrir menú" onClick={() => setMenuOpen((v) => !v)}>
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
              <p className="kicker">Servicio especializado para I+D biofarmacéutica</p>
              <h1>Convierte tus hipótesis moleculares en decisiones accionables de negocio.</h1>
              <p className="hero-text">
                Te entregamos análisis de <strong>docking</strong> y <strong>dinámica molecular</strong>
                con enfoque de resultado: qué probar primero, qué descartar y cómo avanzar más rápido.
              </p>
              <div className="hero-cta">
                <a href="#contacto" className="btn">
                  Solicitar diagnóstico
                </a>
                <a href="#beneficios" className="btn btn-ghost">
                  Ver beneficios
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
                  <strong>Trazabilidad</strong>
                  <span>técnica y ejecutiva</span>
                </li>
              </ul>
            </div>

            <article className="hero-card">
              <h2>¿Qué obtienes al contratar?</h2>
              <ul>
                <li>Priorización de moléculas con mayor probabilidad de éxito.</li>
                <li>Informe técnico reproducible para tu equipo científico.</li>
                <li>Resumen ejecutivo para acelerar decisiones de liderazgo.</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="beneficios" className="section section-dark">
          <div className="container">
            <p className="kicker">Impacto para tu organización</p>
            <h2>Beneficios concretos desde la primera fase</h2>
            <div className="cards">
              {outcomes.map((item) => (
                <article className="card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="servicios" className="section">
          <div className="container">
            <p className="kicker">Servicios iniciales</p>
            <h2>Oferta comercial clara para salir a producción científica</h2>
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
                <p>Diseño de estrategia computacional con foco en hitos medibles y escalabilidad.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="infraestructura" className="section section-dark">
          <div className="container two-col">
            <div>
              <p className="kicker">Infraestructura (backend privado)</p>
              <h2>Contenedores listos con UI + Jupyter sobre cómputo arrendado</h2>
              <p>
                El cliente usa tu portal. Detrás, tu backend puede crear un contenedor preconfigurado y
                conectarlo a GPU/CPU arrendadas (como Vast.ai), sin exponer esa complejidad.
              </p>
            </div>
            <ul className="check-list">
              <li>1) Solicitud de experimento desde portal.</li>
              <li>2) Provisionamiento automático de contenedor.</li>
              <li>3) Asignación de recursos y entorno reproducible.</li>
              <li>4) Acceso controlado a notebook + reporte final.</li>
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
              <p className="kicker">Interfaz gráfica de laboratorio (demo)</p>
              <h2>Simula tu entorno de cómputo para experimentos in silico</h2>
              <p>
                Puedes usar esta interfaz para pre-venta y onboarding. Próximo paso: conectar con backend
                para creación real de instancias y acceso seguro por cliente.
              </p>
            </div>
            <article className="card estimator-card">
              <h3>Estimador rápido de infraestructura</h3>
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
              <small>*Valor orientativo. Puede variar por región, oferta y demanda.</small>
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
              <h2>Recibe tu propuesta técnico-comercial esta semana</h2>
              <p>
                Completa el formulario y te devolvemos alcance, tiempos y ruta para comenzar el piloto.
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
          <p>Diseñado para convertir interés científico en decisiones de I+D.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
