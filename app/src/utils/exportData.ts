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

/**
 * Ekspor Resume HTML Bersih & Elegan (Layout CV Standar A4 Manusiawi)
 */
export function exportToPdfPrint(
  profile: UserProfile,
  projects: Project[],
  logs: LogEntry[]
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Resume - ${profile.fullName}</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 18mm 16mm 18mm;
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
      line-height: 1.55;
      font-size: 10pt;
    }

    /* Header Profile */
    .resume-header {
      border-bottom: 2px solid #0F172A;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 12px;
    }
    .name {
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0F172A;
      line-height: 1.1;
    }
    .headline {
      font-size: 11pt;
      font-weight: 600;
      color: #4F46E5;
      margin-top: 4px;
    }
    .contact-links {
      font-size: 8.5pt;
      color: #475569;
      text-align: right;
      line-height: 1.5;
    }
    .contact-links a {
      color: #4F46E5;
      text-decoration: none;
    }
    .meta-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      font-size: 8.5pt;
      color: #64748B;
      margin-top: 8px;
    }
    .summary-text {
      margin-top: 10px;
      font-size: 9.5pt;
      color: #334155;
      line-height: 1.5;
    }

    /* Section Headers */
    .section-title {
      font-size: 10.5pt;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #0F172A;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 4px;
      margin-top: 16px;
      margin-bottom: 10px;
    }

    /* Skills Pill Grid */
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    .skill-chip {
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      padding: 3px 9px;
      border-radius: 4px;
      font-size: 8.5pt;
      font-weight: 500;
      color: #1E293B;
    }

    /* Project Cards */
    .project-card {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .project-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .project-name {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0F172A;
    }
    .badge-nda {
      font-size: 7.5pt;
      background: #FEF3C7;
      color: #92400E;
      border: 1px solid #FDE68A;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .badge-public {
      font-size: 7.5pt;
      background: #F1F5F9;
      color: #475569;
      border: 1px solid #CBD5E1;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 500;
    }
    .project-desc {
      font-size: 9pt;
      color: #334155;
      line-height: 1.45;
      margin-top: 2px;
    }
    .project-meta {
      font-size: 8.5pt;
      color: #475569;
      margin-top: 3px;
    }
    .project-links a {
      color: #4F46E5;
      text-decoration: none;
      margin-right: 12px;
      font-weight: 500;
    }

    /* Log Item (Workstream proof) */
    .log-card {
      margin-bottom: 11px;
      page-break-inside: avoid;
      padding-left: 10px;
      border-left: 2px solid #CBD5E1;
    }
    .log-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .log-headline {
      font-size: 9.8pt;
      font-weight: 700;
      color: #0F172A;
    }
    .log-date {
      font-size: 8pt;
      color: #64748B;
      white-space: nowrap;
    }
    .log-bullets {
      padding-left: 14px;
      font-size: 9pt;
      color: #334155;
      line-height: 1.45;
      margin-top: 2px;
    }
    .log-bullets li {
      margin-bottom: 2px;
    }
    .log-proof-tags {
      margin-top: 4px;
      font-size: 8pt;
      color: #4F46E5;
    }

    /* Footer */
    .resume-footer {
      margin-top: 22px;
      border-top: 1px solid #E2E8F0;
      padding-top: 8px;
      font-size: 7.5pt;
      color: #94A3B8;
      display: flex;
      justify-content: space-between;
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
      <span>Lokasi: ${profile.location}</span>
      <span>Zona Waktu: ${profile.timezone}</span>
      <span>Catatan Rekayasa Terverifikasi: ${profile.totalLogs} Entri</span>
    </div>
    ${profile.bio ? `<p class="summary-text">${profile.bio}</p>` : ''}
  </div>

  <!-- Keahlian Utama -->
  <div class="section-title">Keahlian & Teknologi</div>
  <div class="skills-container">
    ${profile.topSkills.map(s => `
      <span class="skill-chip">${s.skill}</span>
    `).join('')}
  </div>

  <!-- Wadah Arsitektur & Proyek -->
  <div class="section-title">Proyek Rekayasa</div>
  ${projects.map(p => `
    <div class="project-card">
      <div class="project-top">
        <span class="project-name">${p.title}</span>
        <span class="${p.isStealthNda ? 'badge-nda' : 'badge-public'}">
          ${p.isStealthNda ? 'NDA Protected' : 'Public'}
        </span>
      </div>
      <p class="project-desc">${p.description}</p>
      ${p.technologies && p.technologies.length > 0 ? `
        <div class="project-meta">Teknologi: ${p.technologies.join(', ')}</div>
      ` : ''}
      <div class="project-links project-meta">
        ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank">Demo</a>` : ''}
        ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank">Repositori</a>` : ''}
      </div>
    </div>
  `).join('')}

  <!-- Engineering Logbook (Bukti Nyata) -->
  <div class="section-title">Riwayat Rekayasa & Catatan Pengerjaan</div>
  ${logs.map(log => `
    <div class="log-card">
      <div class="log-top">
        <span class="log-headline">${log.title || log.content}</span>
        <span class="log-date">${log.logDate} · ${log.projectName} ${log.isStealthNda ? '(NDA Protected)' : ''}</span>
      </div>
      ${log.details && log.details.length > 0 ? `
        <ul class="log-bullets">
          ${log.details.map(d => `<li>${d}</li>`).join('')}
        </ul>
      ` : `
        <div style="font-size: 9pt; color: #334155; margin-top: 2px;">${log.content}</div>
      `}
      ${log.proofLinks && log.proofLinks.length > 0 ? `
        <div class="log-proof-tags">
          Tautan: ${log.proofLinks.map(pl => `<a href="${pl.url}" target="_blank" style="color: #4F46E5; text-decoration: none; margin-right: 8px;">${pl.label}</a>`).join(' ')}
        </div>
      ` : log.proofUrl ? `
        <div class="log-proof-tags">
          Tautan: <a href="${log.proofUrl}" target="_blank" style="color: #4F46E5; text-decoration: none;">Bukti Kerja</a>
        </div>
      ` : ''}
    </div>
  `).join('')}

  <div class="resume-footer">
    <span>Dokumen Riwayat Rekayasa — Dihasilkan secara otomatis</span>
    <span>Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

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
