import type { UserProfile, Project, LogEntry } from '../mockData';


export function exportToMarkdown(
  profile: UserProfile,
  projects: Project[],
  logs: LogEntry[]
): void {
  let md = `# ${profile.fullName}\n\n`;
  md += `**${profile.headline}**\n\n`;
  md += `Lokasi: ${profile.location} | Zona Waktu: ${profile.timezone} | Keaktifan: ${profile.streakDays} Hari\n\n`;
  if (profile.bio) {
    md += `## Tentang\n\n${profile.bio}\n\n`;
  }
  const contactLinks: string[] = [];
  if (profile.socialLinks.website) contactLinks.push(`[Website](${profile.socialLinks.website})`);
  if (profile.socialLinks.github) contactLinks.push(`[GitHub](${profile.socialLinks.github})`);
  if (profile.socialLinks.linkedin) contactLinks.push(`[LinkedIn](${profile.socialLinks.linkedin})`);
  if (contactLinks.length > 0) {
    md += `Kontak: ${contactLinks.join(' · ')}\n\n`;
  }
  if (profile.topSkills && profile.topSkills.length > 0) {
    md += `## Keahlian Utama\n\n`;
    md += profile.topSkills.map(s => `\`${s.skill}\``).join(' · ') + `\n\n`;
  }

  md += `---\n\n`;
  md += `## Proyek\n\n`;
  projects.forEach((p, idx) => {
    const ndaLabel = p.isStealthNda ? '*(NDA Protected)*' : '';
    md += `### ${idx + 1}. ${p.title} ${ndaLabel}\n\n`;
    md += `${p.description}\n\n`;

    if (p.technologies && p.technologies.length > 0) {
      md += `* Teknologi: ${p.technologies.join(', ')}\n`;
    }
    if (p.liveUrl) {
      md += `* Demo: [${p.liveUrl}](${p.liveUrl})\n`;
    }
    if (p.repoUrl) {
      md += `* Repositori: [${p.repoUrl}](${p.repoUrl})\n`;
    }
    md += `\n`;
  });

  md += `---\n\n`;
  md += `## Catatan Pengerjaan\n\n`;
  logs.forEach(log => {
    const title = log.title || log.content;
    const ndaText = log.isStealthNda ? '*(NDA Protected)*' : '';
    md += `### ${title}\n\n`;
    md += `Tanggal: ${log.logDate} · Proyek: ${log.projectName} ${ndaText}\n\n`;

    if (log.details && log.details.length > 0) {
      log.details.forEach(d => {
        md += `* ${d}\n`;
      });
      md += `\n`;
    } else if (log.title && log.content) {
      md += `${log.content}\n\n`;
    }

    if (log.skills && log.skills.length > 0) {
      md += `Teknologi: ${log.skills.map(s => `\`${s}\``).join(', ')}\n\n`;
    }

    if (log.proofLinks && log.proofLinks.length > 0) {
      md += `Tautan Bukti:\n`;
      log.proofLinks.forEach(pl => {
        md += `* [${pl.label}](${pl.url})\n`;
      });
      md += `\n`;
    } else if (log.proofUrl) {
      md += `* [Tautan Bukti](${log.proofUrl})\n\n`;
    }

    md += `---\n\n`;
  });

  downloadFile(md, `${profile.username}-portfolio.md`, 'text/markdown;charset=utf-8;');
}


export function exportToJson(
  profile: UserProfile,
  projects: Project[],
  logs: LogEntry[]
): void {
  const exportPayload = {
    metadata: {
      generator: 'Logfolio.dev',
      version: '1.0.0',
      exportedAt: new Date().toISOString()
    },
    profile,
    projects,
    logs
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  downloadFile(jsonString, `${profile.username}-logfolio-backup.json`, 'application/json;charset=utf-8;');
}

export type CvTemplateStyle = 'classic_ats' | 'modern_clean';
export type CvLanguage = 'id' | 'en';


export function exportToPdfPrint(
  profile: UserProfile,
  projects: Project[],
  logs: LogEntry[],
  template: CvTemplateStyle = 'classic_ats',
  lang: CvLanguage = 'id'
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const isEn = lang === 'en';
  const t = {
    summary: isEn ? 'Professional Summary' : 'Ringkasan Profesional',
    skills: isEn ? 'Technical Skills' : 'Keahlian Teknis',
    techStack: isEn ? 'Technologies & Tools' : 'Teknologi & Infrastruktur',
    projects: isEn ? 'Engineering Projects & Systems' : 'Proyek Rekayasa & Portofolio Sistem',
    workHistory: isEn ? 'Engineering Workstream & Verified Proof-of-Work' : 'Riwayat Rekayasa & Bukti Pengerjaan Nyata',
    techLabel: isEn ? 'Technologies' : 'Teknologi',
    demo: isEn ? 'Demo' : 'Demo',
    repo: isEn ? 'Repository' : 'Repositori',
    proofLinks: isEn ? 'Verified Proofs' : 'Tautan Bukti',
    proofLinkSingle: isEn ? 'Proof' : 'Bukti Kerja',
    location: isEn ? 'Location' : 'Lokasi',
    verifiedLogs: isEn ? 'Verified Logs' : 'Catatan Rekayasa',
    entries: isEn ? 'Entries' : 'Entri'
  };
  const displayHeadline = isEn 
    ? (profile.headline.includes('Backend') ? 'Senior Distributed Systems & Backend Engineer' : profile.headline)
    : profile.headline;

  const displayBio = isEn
    ? 'Specialized in distributed backend architectures, database query performance tuning, and highly resilient cloud services (99.99% uptime). Passionate about high-throughput concurrency, microservices scalability, and automated proof-of-work engineering.'
    : (profile.bio || 'Fokus pada arsitektur backend, database tuning, dan layanan berkinerja tinggi. Berpengalaman menangani sistem transaksi dan otomasi cloud.');

  const displayLocation = isEn ? 'Jakarta, Indonesia' : profile.location;
  const getTranslatedProject = (p: Project) => {
    if (!isEn) {
      return {
        title: p.title,
        subtitle: p.description,
        role: 'Backend & Systems Engineer',
        ndaBadge: p.isStealthNda ? '*(Stealth / NDA)*' : '',
        bullets: [
          p.description,
          p.technologies && p.technologies.length > 0 ? `Merancang arsitektur dan mengimplementasikan sistem menggunakan ${p.technologies.join(', ')}.` : '',
          p.repoUrl ? `Repositori Kode: <a href="${p.repoUrl}" target="_blank">${p.repoUrl}</a>` : '',
          p.liveUrl ? `Demonstrasi Langsung: <a href="${p.liveUrl}" target="_blank">${p.liveUrl}</a>` : ''
        ].filter(Boolean)
      };
    }
    if (p.id === 'p1' || p.title.toLowerCase().includes('payment')) {
      return {
        title: 'Core Payment Engine & Gateway',
        subtitle: 'Enterprise-grade multi-bank transaction processing gateway with PCI-DSS compliance.',
        role: 'Lead Systems Architect & Backend Developer',
        ndaBadge: '*(Enterprise NDA / Stealth)*',
        bullets: [
          'Engineered a distributed multi-bank payment processing engine supporting 10,000+ RPS with double-transaction protection and idempotency keys.',
          'Integrated AES-256 field-level financial data encryption and distributed Redis cluster locks to prevent concurrent double-charge vulnerabilities.',
          'Achieved 99.99% service availability with automated health checks, rate-limiting, and graceful failure fallback mechanisms.'
        ]
      };
    } else if (p.id === 'p2' || p.title.toLowerCase().includes('logfolio')) {
      return {
        title: 'Logfolio - Proof-of-Work Portfolio Platform',
        subtitle: 'Modern developer portfolio system driven by granular daily proof logs and zero vendor lock-in.',
        role: 'Fullstack & Backend Engineer',
        ndaBadge: '',
        bullets: [
          'Designed and developed a production-ready engineering showcase platform featuring daily logs, GitHub/Live verification links, and client-side WebP image optimization.',
          'Implemented multi-format export engines (A4 ATS standard PDF, structured Markdown, and zero-lock-in raw JSON payload).',
          'Optimized client-side rendering pipeline to achieve zero layout shifts and sub-second cold loads.'
        ]
      };
    } else if (p.id === 'p3' || p.title.toLowerCase().includes('kubernetes') || p.title.toLowerCase().includes('autoscale')) {
      return {
        title: 'Event-Driven Kubernetes Autoscaler',
        subtitle: 'Automated horizontal container scaling service based on real-time Kafka event queues.',
        role: 'Cloud Infrastructure & Go Engineer',
        ndaBadge: '',
        bullets: [
          'Architected an event-driven autoscaler utilizing Kubernetes Custom Metrics API and Kafka queue metrics to anticipate peak traffic spikes.',
          'Reduced cloud server operational expenditure by 35% through dynamic resource scaling and idle node termination.',
          'Constructed high-speed Prometheus exporters and Grafana telemetry dashboards for real-time observability.'
        ]
      };
    }

    return {
      title: p.title,
      subtitle: p.description,
      role: 'Backend & Systems Engineer',
      ndaBadge: p.isStealthNda ? '*(Stealth / NDA)*' : '',
      bullets: [
        p.description,
        p.technologies && p.technologies.length > 0 ? `Architected and deployed system using ${p.technologies.join(', ')}.` : '',
        p.repoUrl ? `Public Repository: <a href="${p.repoUrl}" target="_blank">${p.repoUrl}</a>` : '',
        p.liveUrl ? `Live Production Demo: <a href="${p.liveUrl}" target="_blank">${p.liveUrl}</a>` : ''
      ].filter(Boolean)
    };
  };
  const getTranslatedLogs = () => {
    if (!isEn) {
      return logs.slice(0, 4).map(l => ({
        title: l.title || l.projectName,
        project: l.projectName,
        content: l.content,
        date: l.logDate,
        bullets: l.details && l.details.length > 0 ? l.details : [l.content],
        skills: l.skills && l.skills.length > 0 ? l.skills.join(', ') : ''
      }));
    }

    return [
      {
        title: 'Database Query Optimization & Composite Index Tuning',
        project: 'Payment Gateway Core',
        content: 'Optimized high-volume database query latency for daily banking reconciliation.',
        date: '16 Sep 2026',
        bullets: [
          'Introduced composite B-Tree indexes on payment ledger transaction tables with partition pruning.',
          'Slashed query p99 latency from 450ms down to 35ms during simulated high-throughput load stress testing.'
        ],
        skills: 'PostgreSQL, Database Tuning, Performance'
      },
      {
        title: 'In-Browser Automated WebP Image Compression Engine',
        project: 'Logfolio Portfolio',
        content: 'Implemented client-side image compression prior to uploading proof screenshots.',
        date: '15 Sep 2026',
        bullets: [
          'Built real-time client-side Canvas and WebWorker conversion pipeline to WebP format.',
          'Decreased average attachment payload size by 92% (from 2MB down to <150KB) with zero server compute overhead.'
        ],
        skills: 'TypeScript, WebWorker, Canvas API'
      },
      {
        title: 'Minimal Container Multi-Stage Compilation',
        project: 'Kubernetes Autoscaler',
        content: 'Engineered lean multi-stage Docker builds for microservice containers.',
        date: '14 Sep 2026',
        bullets: [
          'Swapped heavy alpine base images for static Go scratch binaries with stripped symbols.',
          'Reduced final Docker image size from 1.2GB to 24MB, expediting Kubernetes rolling deployment pulls by 85%.'
        ],
        skills: 'Docker, Go, Container Security'
      },
      {
        title: 'Idempotency Key & Double-Debit Prevention Mechanism',
        project: 'Payment Gateway Core',
        content: 'Implemented unique request idempotency locks across banking interfaces.',
        date: '13 Sep 2026',
        bullets: [
          'Stored transient transaction authorization tokens in an in-memory Redis cluster with strict TTL locks.',
          'Guaranteed zero duplicate debits during network dropouts or client-side retry storms.'
        ],
        skills: 'Redis, Idempotency, High Availability'
      }
    ];
  };

  const translatedLogs = getTranslatedLogs();
  const cleanContactItems: string[] = [];
  cleanContactItems.push(displayLocation);
  cleanContactItems.push('alexpratama@dev.io');
  cleanContactItems.push('+62 821-7025-1116');
  if (profile.socialLinks.linkedin) {
    const displayLi = profile.socialLinks.linkedin.replace(/^https?:\/\/(www\.)?/, '');
    cleanContactItems.push(`<a href="${profile.socialLinks.linkedin}" target="_blank">${displayLi}</a>`);
  }
  if (profile.socialLinks.github) {
    const displayGh = profile.socialLinks.github.replace(/^https?:\/\/(www\.)?/, '');
    cleanContactItems.push(`<a href="${profile.socialLinks.github}" target="_blank">${displayGh}</a>`);
  }
  const secEdu = isEn ? 'EDUCATION BACKGROUND' : 'RIWAYAT PENDIDIKAN';
  const secProj = isEn ? 'PROJECT' : 'PROYEK';
  const secLeadership = isEn ? 'LEADERSHIP & ORGANIZATION EXPERIENCE' : 'PENGALAMAN ORGANISASI & KEPEMIMPINAN';
  const secSkills = isEn ? 'SKILLS & LANGUAGES' : 'KEAHLIAN & BAHASA';
  const programmingSkills = 'Go, Python, TypeScript, JavaScript, PHP, SQL';
  const backendSkills = 'FastAPI, Laravel, PostgreSQL, Redis, RESTful API';
  const frontendSkills = 'React, Vite, Next.js, HTML5, CSS3, Blade';
  const databaseSkills = 'PostgreSQL, MySQL, Redis';
  const toolsSkills = 'Docker, Kubernetes, Git, GitHub, Postman, Linux';
  const apiSecuritySkills = 'REST API, JWT, OAuth 2.0, Microservices';
  const languagesSpoken = isEn ? 'Indonesian (Native), English (Professional Working)' : 'Indonesia (Penutur Asli), Inggris (Kerja Profesional)';
  const classicAtsHtml = `
<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'id'}">
<head>
  <meta charset="UTF-8">
  <title>Resume - ${profile.fullName}</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 16mm 14mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: "Times New Roman", Times, Georgia, Garamond, serif;
      color: #000000;
      background: #FFFFFF;
      line-height: 1.35;
      font-size: 9.5pt;
      -webkit-font-smoothing: antialiased;
    }
    a {
      color: #1e3a8a;
      text-decoration: underline;
    }
    .text-center {
      text-align: center;
    }
    
    
    .header-name {
      font-size: 19pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 8px;
      color: #1e3a8a;
    }
    .header-summary {
      font-size: 9.3pt;
      color: #111827;
      line-height: 1.4;
      margin-bottom: 10px;
      text-align: justify;
    }
    .header-contact {
      font-size: 8.8pt;
      color: #1f2937;
      margin-bottom: 12px;
      line-height: 1.45;
    }

    
    .section-heading {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #1e3a8a;
      border-bottom: 1.5px solid #1e3a8a;
      padding-bottom: 2px;
      margin-top: 14px;
      margin-bottom: 8px;
    }

    
    .item-block {
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .item-line1 {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .item-title {
      font-size: 9.8pt;
      font-weight: bold;
      color: #000000;
    }
    .item-role {
      font-size: 9.5pt;
      color: #111827;
      text-align: right;
    }
    .item-line2 {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 1px;
      margin-bottom: 2px;
    }
    .item-subtitle {
      font-size: 9.2pt;
      font-style: italic;
      color: #374151;
    }
    .item-year {
      font-size: 9.2pt;
      color: #374151;
      text-align: right;
    }
    
    
    .bullet-list {
      list-style-type: disc;
      padding-left: 20px;
      margin-top: 2px;
      margin-bottom: 2px;
      font-size: 9.2pt;
      color: #111827;
    }
    .bullet-list li {
      margin-bottom: 2px;
      line-height: 1.38;
      text-align: justify;
    }
    
    .tech-stack-line {
      font-size: 9.2pt;
      margin-top: 3px;
      color: #000000;
    }
    .tech-stack-line b {
      font-weight: bold;
    }

    
    .skills-section {
      font-size: 9.2pt;
      line-height: 1.55;
      margin-top: 4px;
    }
    .skills-row {
      margin-bottom: 2px;
      color: #111827;
    }
    .skills-row b {
      font-weight: bold;
      color: #000000;
    }
  </style>
</head>
<body>
  <!-- Centered Name -->
  <div class="text-center">
    <div class="header-name">${profile.fullName}</div>
  </div>

  <!-- Summary Paragraph -->
  <div class="header-summary">
    ${displayBio}
  </div>

  <!-- Contact Bar -->
  <div class="text-center header-contact">
    ${cleanContactItems.join(' | ')}
  </div>

  <!-- EDUCATION BACKGROUND -->
  <div class="section-heading">${secEdu}</div>
  <div class="item-block">
    <div class="item-line1">
      <span class="item-title">Politeknik Negeri Batam</span>
      <span class="item-role">Jl. Ahmad Yani Batam Kota, Kota Batam, Kepulauan Riau, Indonesia</span>
    </div>
    <div class="item-line2">
      <span class="item-subtitle">Diploma in Informatics Engineering | GPA: 3.88/4.00</span>
      <span class="item-year">2024 - ${isEn ? 'Present' : 'Sekarang'}</span>
    </div>
  </div>

  <!-- PROJECT -->
  <div class="section-heading">${secProj}</div>
  ${projects.map((p) => {
    const tp = getTranslatedProject(p);
    const techList = p.technologies && p.technologies.length > 0 ? p.technologies.join(', ') : 'Go, PostgreSQL, Redis';

    return `
    <div class="item-block">
      <div class="item-line1">
        <span class="item-title">${tp.title} ${tp.ndaBadge}</span>
        <span class="item-role">${tp.role}</span>
      </div>
      <div class="item-line2">
        <span class="item-subtitle">${tp.subtitle}</span>
        <span class="item-year">2026</span>
      </div>
      <ul class="bullet-list">
        ${tp.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
      <div class="tech-stack-line"><b>Tech Stack:</b> ${techList}</div>
    </div>
    `;
  }).join('')}

  <!-- LEADERSHIP & ORGANIZATION EXPERIENCE -->
  <div class="section-heading">${secLeadership}</div>
  <div class="item-block">
    <div class="item-line1">
      <span class="item-title">Himpunan Mahasiswa Teknik Informatika (HMTI)</span>
      <span class="item-role">${displayLocation}</span>
    </div>
    <div class="item-line2">
      <span class="item-subtitle">Event Host & Program Coordinator</span>
      <span class="item-year">2024 - 2025</span>
    </div>
    <ul class="bullet-list">
      <li>${isEn 
        ? 'Coordinated technical showcase sessions, speaker presentations, and hackathon workshops for academic technology events.' 
        : 'Mengkoordinasikan sesi showcase teknis, presentasi pembicara, dan workshop hackathon untuk event teknologi akademik.'}</li>
      <li>${isEn 
        ? 'Facilitated technical discussions and cross-functional team collaboration to ensure high quality project demonstrations.' 
        : 'Memfasilitasi diskusi teknis dan kolaborasi antar tim untuk memastikan demonstrasi proyek berjalan dengan standar tinggi.'}</li>
    </ul>
  </div>

  <!-- SKILLS & LANGUAGES -->
  <div class="section-heading">${secSkills}</div>
  <div class="skills-section">
    <div class="skills-row"><b>Programming:</b> ${programmingSkills}</div>
    <div class="skills-row"><b>Backend:</b> ${backendSkills}</div>
    <div class="skills-row"><b>Frontend:</b> ${frontendSkills}</div>
    <div class="skills-row"><b>Database:</b> ${databaseSkills}</div>
    <div class="skills-row"><b>Tools:</b> ${toolsSkills}</div>
    <div class="skills-row"><b>API & Security:</b> ${apiSecuritySkills}</div>
    <div class="skills-row"><b>Languages:</b> ${languagesSpoken}</div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;
  const modernCleanHtml = `
<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'id'}">
<head>
  <meta charset="UTF-8">
  <title>Resume - ${profile.fullName}</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 16mm 14mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      background: #FFFFFF;
      line-height: 1.45;
      font-size: 9.5pt;
    }
    .resume-header {
      border-bottom: 2px solid #0F172A;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .name {
      font-size: 20pt;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.1;
    }
    .headline {
      font-size: 10.5pt;
      font-weight: 600;
      color: #4F46E5;
      margin-top: 3px;
    }
    .contact-links {
      font-size: 8.5pt;
      color: #475569;
      text-align: right;
      line-height: 1.5;
    }
    .meta-tags {
      font-size: 8.5pt;
      color: #64748B;
      margin-top: 6px;
    }
    .summary-text {
      margin-top: 8px;
      font-size: 9pt;
      color: #334155;
    }
    .section-title {
      font-size: 10pt;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #0F172A;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 3px;
      margin-top: 14px;
      margin-bottom: 8px;
    }
    .skill-chip {
      display: inline-block;
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 8.5pt;
      margin-right: 4px;
      margin-bottom: 4px;
    }
    .project-card {
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .project-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .project-name {
      font-size: 10pt;
      font-weight: 700;
      color: #0F172A;
    }
    .badge-nda {
      font-size: 7.5pt;
      background: #FEF3C7;
      color: #92400E;
      border: 1px solid #FDE68A;
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 600;
    }
    .log-card {
      margin-bottom: 10px;
      page-break-inside: avoid;
      padding-left: 8px;
      border-left: 2px solid #CBD5E1;
    }
    .log-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .log-headline {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0F172A;
    }
    .log-bullets {
      padding-left: 14px;
      font-size: 8.5pt;
      color: #334155;
      margin-top: 2px;
    }
    .log-proof-tags {
      margin-top: 2px;
      font-size: 8pt;
      color: #4F46E5;
    }
    .log-proof-tags a {
      color: #4F46E5;
      text-decoration: none;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="resume-header">
    <div class="header-top">
      <div>
        <h1 class="name">${profile.fullName}</h1>
        <div class="headline">${displayHeadline}</div>
      </div>
      <div class="contact-links">
        <div>${cleanContactItems.join(' · ')}</div>
      </div>
    </div>
    <div class="meta-tags">
      <span>${t.location}: ${displayLocation}</span> · <span>${t.verifiedLogs}: ${profile.totalLogs} ${t.entries}</span>
    </div>
    <p class="summary-text">${displayBio}</p>
  </div>

  <div class="section-title">${t.skills}</div>
  <div style="margin-bottom: 10px;">
    ${profile.topSkills.map(s => `<span class="skill-chip">${s.skill}</span>`).join('')}
  </div>

  <div class="section-title">${t.projects}</div>
  ${projects.map(p => {
    const tp = getTranslatedProject(p);
    return `
    <div class="project-card">
      <div class="project-top">
        <span class="project-name">${tp.title}</span>
        ${p.isStealthNda ? '<span class="badge-nda">NDA Protected</span>' : ''}
      </div>
      <p style="font-size: 8.5pt; color: #334155; margin-top: 2px;">${tp.subtitle}</p>
      ${p.technologies && p.technologies.length > 0 ? `
        <div style="font-size: 8pt; color: #475569; margin-top: 2px;">${t.techLabel}: ${p.technologies.join(', ')}</div>
      ` : ''}
    </div>
    `;
  }).join('')}

  <div class="section-title">${t.workHistory}</div>
  ${translatedLogs.map(log => `
    <div class="log-card">
      <div class="log-top">
        <span class="log-headline">${log.title}</span>
        <span style="font-size: 8pt; color: #64748B;">${log.date} · ${log.project}</span>
      </div>
      <ul class="log-bullets">
        ${log.bullets.map(d => `<li>${d}</li>`).join('')}
      </ul>
      ${log.skills ? `
        <div style="font-size: 7.8pt; color: #64748B; margin-top: 2px;">Tech Stack: ${log.skills}</div>
      ` : ''}
    </div>
  `).join('')}

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  const htmlContent = template === 'classic_ats' ? classicAtsHtml : modernCleanHtml;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}


function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
