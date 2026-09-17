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

/**
 * Ekspor Resume HTML Bersih & Elegan (Layout CV Standar A4 Manusiawi)
 */
export function exportToPdfPrint(
  profile: UserProfile,
  projects: Project[],
  logs: LogEntry[],
  template: CvTemplateStyle = 'classic_ats'
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const contactItems: string[] = [];
  if (profile.location) contactItems.push(profile.location);
  if (profile.socialLinks.website) contactItems.push(profile.socialLinks.website);
  if (profile.socialLinks.github) contactItems.push(profile.socialLinks.github);
  if (profile.socialLinks.linkedin) contactItems.push(profile.socialLinks.linkedin);

  // Template 1: Classic Harvard / ATS Standard 1-Kolom
  const classicAtsHtml = `
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
      font-family: "Times New Roman", Times, Georgia, serif;
      color: #111827;
      background: #FFFFFF;
      line-height: 1.4;
      font-size: 10pt;
    }
    .text-center { text-align: center; }
    
    /* Header Klasik Harvard: Centered, clean & authoritative */
    .header-name {
      font-size: 20pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
      color: #000000;
    }
    .header-headline {
      font-size: 10.5pt;
      font-style: italic;
      color: #374151;
      margin-bottom: 4px;
    }
    .header-contact {
      font-size: 9pt;
      color: #374151;
      margin-bottom: 12px;
    }
    .header-contact a {
      color: #111827;
      text-decoration: none;
    }
    
    /* Divider Section Klasik */
    .section-heading {
      font-size: 10.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #111827;
      padding-bottom: 2px;
      margin-top: 14px;
      margin-bottom: 8px;
    }
    
    .summary-p {
      font-size: 9.5pt;
      color: #1F2937;
      line-height: 1.45;
      text-align: justify;
    }

    /* Skills Line */
    .skills-line {
      font-size: 9.5pt;
      color: #1F2937;
      line-height: 1.5;
    }

    /* Project Item */
    .item-block {
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .item-title {
      font-size: 10pt;
      font-weight: bold;
      color: #000000;
    }
    .item-tag {
      font-size: 8.5pt;
      font-style: italic;
      color: #4B5563;
    }
    .item-subtitle {
      font-size: 9pt;
      font-style: italic;
      color: #374151;
      margin-top: 1px;
    }
    .item-desc {
      font-size: 9.5pt;
      color: #1F2937;
      margin-top: 2px;
    }
    
    /* Bullets */
    .bullet-list {
      padding-left: 16px;
      margin-top: 2px;
      font-size: 9.5pt;
      color: #1F2937;
    }
    .bullet-list li {
      margin-bottom: 2px;
      line-height: 1.4;
    }
    .links-line {
      font-size: 8.5pt;
      margin-top: 2px;
    }
    .links-line a {
      color: #1F2937;
      text-decoration: underline;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <!-- Header Harvard ATS -->
  <div class="text-center">
    <div class="header-name">${profile.fullName}</div>
    <div class="header-headline">${profile.headline}</div>
    <div class="header-contact">
      ${contactItems.map(item => `<span>${item}</span>`).join(' &nbsp;|&nbsp; ')}
    </div>
  </div>

  ${profile.bio ? `
  <div class="section-heading">Ringkasan Profesional</div>
  <p class="summary-p">${profile.bio}</p>
  ` : ''}

  <!-- Keahlian Teknis -->
  <div class="section-heading">Keahlian Teknis</div>
  <div class="skills-line">
    <b>Teknologi & Infrastruktur:</b> ${profile.topSkills.map(s => s.skill).join(', ')}
  </div>

  <!-- Pengalaman & Proyek Rekayasa -->
  <div class="section-heading">Proyek Rekayasa & Portofolio Sistem</div>
  ${projects.map(p => `
    <div class="item-block">
      <div class="item-row">
        <span class="item-title">${p.title}</span>
        <span class="item-tag">${p.isStealthNda ? '[NDA Protected]' : '[Public]'}</span>
      </div>
      <p class="item-desc">${p.description}</p>
      ${p.technologies && p.technologies.length > 0 ? `
        <div class="item-subtitle">Teknologi: ${p.technologies.join(', ')}</div>
      ` : ''}
      <div class="links-line">
        ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank">Demo: ${p.liveUrl}</a>` : ''}
        ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank">Repositori: ${p.repoUrl}</a>` : ''}
      </div>
    </div>
  `).join('')}

  <!-- Catatan Pengerjaan Terverifikasi (Proof-of-Work) -->
  <div class="section-heading">Riwayat Rekayasa & Bukti Pengerjaan Nyata</div>
  ${logs.map(log => `
    <div class="item-block">
      <div class="item-row">
        <span class="item-title">${log.title || log.content}</span>
        <span class="item-tag">${log.logDate} · ${log.projectName} ${log.isStealthNda ? '(NDA)' : ''}</span>
      </div>
      ${log.details && log.details.length > 0 ? `
        <ul class="bullet-list">
          ${log.details.map(d => `<li>${d}</li>`).join('')}
        </ul>
      ` : `
        <p class="item-desc">${log.content}</p>
      `}
      ${log.proofLinks && log.proofLinks.length > 0 ? `
        <div class="links-line">
          <b>Tautan Bukti:</b> ${log.proofLinks.map(pl => `<a href="${pl.url}" target="_blank">${pl.label} (${pl.url})</a>`).join(' ')}
        </div>
      ` : log.proofUrl ? `
        <div class="links-line">
          <b>Tautan Bukti:</b> <a href="${log.proofUrl}" target="_blank">${log.proofUrl}</a>
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
      <span>Lokasi: ${profile.location}</span> · <span>Catatan Rekayasa: ${profile.totalLogs} Entri</span>
    </div>
    ${profile.bio ? `<p class="summary-text">${profile.bio}</p>` : ''}
  </div>

  <div class="section-title">Keahlian & Teknologi</div>
  <div style="margin-bottom: 10px;">
    ${profile.topSkills.map(s => `<span class="skill-chip">${s.skill}</span>`).join('')}
  </div>

  <div class="section-title">Proyek Rekayasa</div>
  ${projects.map(p => `
    <div class="project-card">
      <div class="project-top">
        <span class="project-name">${p.title}</span>
        ${p.isStealthNda ? '<span class="badge-nda">NDA Protected</span>' : ''}
      </div>
      <p style="font-size: 8.5pt; color: #334155; margin-top: 2px;">${p.description}</p>
      ${p.technologies && p.technologies.length > 0 ? `
        <div style="font-size: 8pt; color: #475569; margin-top: 2px;">Teknologi: ${p.technologies.join(', ')}</div>
      ` : ''}
    </div>
  `).join('')}

  <div class="section-title">Riwayat Rekayasa & Catatan Pengerjaan</div>
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
          Tautan: ${log.proofLinks.map(pl => `<a href="${pl.url}" target="_blank">${pl.label}</a>`).join(' ')}
        </div>
      ` : log.proofUrl ? `
        <div class="log-proof-tags">
          Tautan: <a href="${log.proofUrl}" target="_blank">Bukti Kerja</a>
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
