import type { UserProfile, Project, LogEntry } from '../mockData';

/**
 * Format Markdown Super Rapi & Hangat (Human-Friendly)
 * Cocok langsung untuk GitHub Profile README, Notion, maupun portfolio docs.
 */
export function exportToMarkdown(
  profile: UserProfile,
  projects: Project[],
  logs: LogEntry[]
): void {
  let md = `# ${profile.fullName}\n\n`;
  md += `**${profile.headline}**\n\n`;
  md += `Lokasi: ${profile.location} | Zona Waktu: ${profile.timezone} | Keaktifan: ${profile.streakDays} Hari\n\n`;

  // Tentang Saya
  if (profile.bio) {
    md += `## Tentang\n\n${profile.bio}\n\n`;
  }

  // Socials / Kontak
  const contactLinks: string[] = [];
  if (profile.socialLinks.website) contactLinks.push(`[Website](${profile.socialLinks.website})`);
  if (profile.socialLinks.github) contactLinks.push(`[GitHub](${profile.socialLinks.github})`);
  if (profile.socialLinks.linkedin) contactLinks.push(`[LinkedIn](${profile.socialLinks.linkedin})`);
  if (contactLinks.length > 0) {
    md += `Kontak: ${contactLinks.join(' · ')}\n\n`;
  }

  // Top Skills
  if (profile.topSkills && profile.topSkills.length > 0) {
    md += `## Keahlian Utama\n\n`;
    md += profile.topSkills.map(s => `\`${s.skill}\``).join(' · ') + `\n\n`;
  }

  md += `---\n\n`;

  // Projects
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

  // Engineering Logs
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

/**
 * Ekspor ke JSON Murni
 */
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

/**
 * Ekspor Resume HTML Bersih & Elegan (Layout CV Standar A4 Manusiawi)
 */
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

  // Kamus label multi-bahasa
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

  const contactItems: string[] = [];
  if (profile.location) contactItems.push(profile.location);
  if (profile.socialLinks.website) contactItems.push(profile.socialLinks.website);
  if (profile.socialLinks.github) contactItems.push(profile.socialLinks.github);
  if (profile.socialLinks.linkedin) contactItems.push(profile.socialLinks.linkedin);

  // Clean contact items for CV header
  const cleanContactItems: string[] = [];
  if (profile.location) cleanContactItems.push(profile.location);
  if (profile.socialLinks.website) {
    const displayWeb = profile.socialLinks.website.replace(/^https?:\/\//, '');
    cleanContactItems.push(`<a href="${profile.socialLinks.website}" target="_blank">${displayWeb}</a>`);
  }
  if (profile.socialLinks.linkedin) {
    const displayLi = profile.socialLinks.linkedin.replace(/^https?:\/\//, '');
    cleanContactItems.push(`<a href="${profile.socialLinks.linkedin}" target="_blank">${displayLi}</a>`);
  }
  if (profile.socialLinks.github) {
    const displayGh = profile.socialLinks.github.replace(/^https?:\/\//, '');
    cleanContactItems.push(`<a href="${profile.socialLinks.github}" target="_blank">${displayGh}</a>`);
  }

  // Section titles matching user reference standard
  const secEdu = isEn ? 'EDUCATION BACKGROUND' : 'RIWAYAT PENDIDIKAN';
  const secProj = isEn ? 'PROJECT' : 'PROYEK & PENGEMBANGAN SISTEM';
  const secWork = isEn ? 'LEADERSHIP & ENGINEERING EXPERIENCE' : 'PENGALAMAN REKAYASA & KEPEMIMPINAN';
  const secSkills = isEn ? 'SKILLS & LANGUAGES' : 'KEAHLIAN & BAHASA';

  // Group skills logically for the bottom skills section
  const skillsList = profile.topSkills.map(s => s.skill);
  const backendSkills = skillsList.filter(s => ['Go', 'PostgreSQL', 'Python', 'FastAPI', 'Laravel', 'Node.js', 'Redis'].includes(s));
  const frontendSkills = skillsList.filter(s => ['TypeScript', 'React', 'Vite', 'JavaScript', 'HTML', 'CSS'].includes(s));
  const infraSkills = skillsList.filter(s => ['Docker', 'Kubernetes', 'Kafka', 'AWS', 'Linux', 'Git', 'CI/CD'].includes(s));

  // Template 1: Classic ATS Standard (Mirrors reference CV layout)
  const classicAtsHtml = `
<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'id'}">
<head>
  <meta charset="UTF-8">
  <title>Resume - ${profile.fullName}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 14mm 12mm 14mm;
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
    }
    a {
      color: #000000;
      text-decoration: underline;
    }
    .text-center {
      text-align: center;
    }
    
    /* Centered Header */
    .header-name {
      font-size: 19pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
      color: #0f172a;
    }
    .header-summary {
      font-size: 9.2pt;
      color: #1f2937;
      line-height: 1.4;
      margin-bottom: 8px;
      text-align: justify;
    }
    .header-contact {
      font-size: 8.8pt;
      color: #374151;
      margin-bottom: 10px;
    }

    /* Section Headings with Blue-Slate Bar */
    .section-heading {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #1e3a8a;
      border-bottom: 1.5px solid #1e3a8a;
      padding-bottom: 1px;
      margin-top: 10px;
      margin-bottom: 6px;
    }

    /* Project / Experience Items */
    .item-block {
      margin-bottom: 8px;
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
      font-weight: normal;
      color: #111827;
      text-align: right;
    }
    .item-line2 {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 1px;
    }
    .item-subtitle {
      font-size: 9pt;
      font-style: italic;
      color: #374151;
    }
    .item-year {
      font-size: 9pt;
      font-weight: normal;
      color: #374151;
      text-align: right;
    }
    
    /* Bullet Points */
    .bullet-list {
      list-style-type: disc;
      padding-left: 18px;
      margin-top: 3px;
      margin-bottom: 3px;
      font-size: 9.2pt;
      color: #1f2937;
    }
    .bullet-list li {
      margin-bottom: 2px;
      line-height: 1.35;
      text-align: justify;
    }
    
    .tech-stack-line {
      font-size: 9pt;
      margin-top: 2px;
      color: #111827;
    }
    .tech-stack-line b {
      font-weight: bold;
    }

    /* Skills Table / Rows */
    .skills-section {
      font-size: 9.2pt;
      line-height: 1.5;
      margin-top: 4px;
    }
    .skills-row {
      margin-bottom: 2px;
    }
    .skills-row b {
      font-weight: bold;
      color: #000000;
      min-width: 110px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <!-- Header: Centered Full Name, Summary & Contact -->
  <div class="text-center">
    <div class="header-name">${profile.fullName}</div>
  </div>

  ${profile.bio ? `
  <div class="header-summary">
    ${profile.bio}
  </div>
  ` : ''}

  <div class="text-center header-contact">
    ${cleanContactItems.join(' &nbsp;|&nbsp; ')}
  </div>

  <!-- Section: Education Background -->
  <div class="section-heading">${secEdu}</div>
  <div class="item-block">
    <div class="item-line1">
      <span class="item-title">Politeknik / Universitas Terkemuka</span>
      <span class="item-role">${profile.location}</span>
    </div>
    <div class="item-line2">
      <span class="item-subtitle">${profile.headline}</span>
      <span class="item-year">2022 - ${isEn ? 'Present' : 'Sekarang'}</span>
    </div>
  </div>

  <!-- Section: Projects -->
  <div class="section-heading">${secProj}</div>
  ${projects.map(p => `
    <div class="item-block">
      <div class="item-line1">
        <span class="item-title">${p.title} ${p.isStealthNda ? '*(Stealth / NDA)*' : ''}</span>
        <span class="item-role">${profile.headline}</span>
      </div>
      <div class="item-line2">
        <span class="item-subtitle">${p.description}</span>
        <span class="item-year">2026</span>
      </div>
      <ul class="bullet-list">
        <li>${p.description}</li>
        ${p.technologies && p.technologies.length > 0 ? `
          <li>${isEn ? 'Architected and deployed system using' : 'Merancang arsitektur dan mengimplementasikan sistem menggunakan'} ${p.technologies.join(', ')}.</li>
        ` : ''}
        ${p.repoUrl ? `
          <li>${isEn ? 'Public Repository' : 'Repositori Kode'}: <a href="${p.repoUrl}" target="_blank">${p.repoUrl}</a></li>
        ` : ''}
        ${p.liveUrl ? `
          <li>${isEn ? 'Live Production Demo' : 'Demonstrasi Langsung'}: <a href="${p.liveUrl}" target="_blank">${p.liveUrl}</a></li>
        ` : ''}
      </ul>
      ${p.technologies && p.technologies.length > 0 ? `
        <div class="tech-stack-line"><b>Tech Stack:</b> ${p.technologies.join(', ')}</div>
      ` : ''}
    </div>
  `).join('')}

  <!-- Section: Leadership & Engineering Logs -->
  ${logs.length > 0 ? `
  <div class="section-heading">${secWork}</div>
  ${logs.slice(0, 4).map(log => `
    <div class="item-block">
      <div class="item-line1">
        <span class="item-title">${log.title || log.projectName}</span>
        <span class="item-role">${log.projectName}</span>
      </div>
      <div class="item-line2">
        <span class="item-subtitle">${log.content}</span>
        <span class="item-year">${log.logDate}</span>
      </div>
      ${log.details && log.details.length > 0 ? `
        <ul class="bullet-list">
          ${log.details.map(d => `<li>${d}</li>`).join('')}
        </ul>
      ` : ''}
      ${log.skills && log.skills.length > 0 ? `
        <div class="tech-stack-line"><b>Tech Stack:</b> ${log.skills.join(', ')}</div>
      ` : ''}
    </div>
  `).join('')}
  ` : ''}

  <!-- Section: Skills & Languages -->
  <div class="section-heading">${secSkills}</div>
  <div class="skills-section">
    ${backendSkills.length > 0 ? `
      <div class="skills-row"><b>Backend & Systems:</b> ${backendSkills.join(', ')}</div>
    ` : ''}
    ${frontendSkills.length > 0 ? `
      <div class="skills-row"><b>Frontend:</b> ${frontendSkills.join(', ')}</div>
    ` : ''}
    ${infraSkills.length > 0 ? `
      <div class="skills-row"><b>Infrastructure & DevOps:</b> ${infraSkills.join(', ')}</div>
    ` : ''}
    <div class="skills-row"><b>Core Technologies:</b> ${profile.topSkills.map(s => s.skill).join(', ')}</div>
    <div class="skills-row"><b>Languages:</b> Indonesian (Native), English (Professional Working)</div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  // Template 2: Modern Clean 1-Kolom (Sans-Serif Elegan)
  const modernCleanHtml = `
<!DOCTYPE html>
<html lang="id">
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
        <div class="headline">${profile.headline}</div>
      </div>
      <div class="contact-links">
        ${profile.socialLinks.website ? `<div>${profile.socialLinks.website}</div>` : ''}
        ${profile.socialLinks.github ? `<div>${profile.socialLinks.github}</div>` : ''}
        ${profile.socialLinks.linkedin ? `<div>${profile.socialLinks.linkedin}</div>` : ''}
      </div>
    </div>
    <div class="meta-tags">
      <span>${t.location}: ${profile.location}</span> · <span>${t.verifiedLogs}: ${profile.totalLogs} ${t.entries}</span>
    </div>
    ${profile.bio ? `<p class="summary-text">${profile.bio}</p>` : ''}
  </div>

  <div class="section-title">${t.skills}</div>
  <div style="margin-bottom: 10px;">
    ${profile.topSkills.map(s => `<span class="skill-chip">${s.skill}</span>`).join('')}
  </div>

  <div class="section-title">${t.projects}</div>
  ${projects.map(p => `
    <div class="project-card">
      <div class="project-top">
        <span class="project-name">${p.title}</span>
        ${p.isStealthNda ? '<span class="badge-nda">NDA Protected</span>' : ''}
      </div>
      <p style="font-size: 8.5pt; color: #334155; margin-top: 2px;">${p.description}</p>
      ${p.technologies && p.technologies.length > 0 ? `
        <div style="font-size: 8pt; color: #475569; margin-top: 2px;">${t.techLabel}: ${p.technologies.join(', ')}</div>
      ` : ''}
    </div>
  `).join('')}

  <div class="section-title">${t.workHistory}</div>
  ${logs.map(log => `
    <div class="log-card">
      <div class="log-top">
        <span class="log-headline">${log.title || log.content}</span>
        <span style="font-size: 8pt; color: #64748B;">${log.logDate} · ${log.projectName}</span>
      </div>
      ${log.details && log.details.length > 0 ? `
        <ul class="log-bullets">
          ${log.details.map(d => `<li>${d}</li>`).join('')}
        </ul>
      ` : `
        <div style="font-size: 8.5pt; color: #334155; margin-top: 2px;">${log.content}</div>
      `}
      ${log.proofLinks && log.proofLinks.length > 0 ? `
        <div class="log-proof-tags">
          ${t.proofLinks}: ${log.proofLinks.map(pl => `<a href="${pl.url}" target="_blank">${pl.label}</a>`).join(' ')}
        </div>
      ` : log.proofUrl ? `
        <div class="log-proof-tags">
          ${t.proofLinks}: <a href="${log.proofUrl}" target="_blank">${t.proofLinkSingle}</a>
        </div>
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

/**
 * Helper download file
 */
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
