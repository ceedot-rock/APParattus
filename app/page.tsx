const features = [
  {
    title: 'Launch planning',
    description: 'Convert raw ideas into sequenced releases with owners, milestones, and crisp success criteria.',
  },
  {
    title: 'Operational visibility',
    description: 'Keep product, design, and engineering aligned around the same priorities, status, and risks.',
  },
  {
    title: 'Vercel-ready delivery',
    description: 'Ship with a clean Next.js foundation, responsive UI, metadata, and production-focused defaults.',
  },
];

const metrics = [
  { value: 'Next.js', label: 'App Router foundation' },
  { value: 'TypeScript', label: 'strict project setup' },
  { value: 'SEO', label: 'metadata, robots, and sitemap' },
];

const steps = [
  'Capture product intent and the audience it serves.',
  'Shape the launch plan into milestones and measurable outcomes.',
  'Deploy a fast public surface that can evolve with the product.',
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="APParattus home">
            <span className="brandMark">A</span>
            <span>APParattus</span>
          </a>
          <div className="navLinks">
            <a href="#features">Features</a>
            <a href="#process">Process</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div id="top" className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">Product launch systems</p>
            <h1 id="hero-title">Bring structure, speed, and polish to every app launch.</h1>
            <p className="lede">
              APParattus is a Vercel-ready product site and operating layer for turning early ideas into a credible launch presence.
            </p>
            <div className="actions" aria-label="Primary actions">
              <a className="button primary" href="#contact">
                Start a launch
              </a>
              <a className="button secondary" href="#features">
                Explore the build
              </a>
            </div>
          </div>

          <div className="panel" aria-label="Launch dashboard preview">
            <div className="panelHeader">
              <span />
              <span />
              <span />
            </div>
            <div className="statusCard">
              <p>Launch readiness</p>
              <strong>Production-ready</strong>
              <div className="progress" aria-hidden="true">
                <span />
              </div>
            </div>
            <div className="panelList">
              <div>
                <span className="dot active" />
                Strategy locked
              </div>
              <div>
                <span className="dot active" />
                Experience polished
              </div>
              <div>
                <span className="dot" />
                Growth loops queued
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="APParattus metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section id="features" className="section">
        <div className="sectionIntro">
          <p className="eyebrow">What is included</p>
          <h2>A complete foundation instead of an empty deployment.</h2>
        </div>
        <div className="cards">
          {features.map((feature) => (
            <article className="card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="section split">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>From blank repo to credible product surface.</h2>
          <p>
            The app is built with Next.js App Router, TypeScript, responsive CSS, SEO metadata, and static generation-friendly content for reliable Vercel deploys.
          </p>
        </div>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section id="contact" className="cta">
        <p className="eyebrow">Ready when you are</p>
        <h2>Use this as the public starting point for APParattus.</h2>
        <p>
          Replace the copy, connect forms or analytics, and expand the product sections as your launch details firm up.
        </p>
        <a className="button primary" href="#top">
          Review the launch surface
        </a>
      </section>
    </main>
  );
}
