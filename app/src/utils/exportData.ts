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
  let md = `# 👋 Halo, Saya ${profile.fullName}\n\n`;
  md += `### ${profile.headline}\n\n`;
  md += `📍 **Lokasi**: ${profile.location} &nbsp;|&nbsp; 🕒 **Zona Waktu**: ${profile.timezone} &nbsp;|&nbsp; 🔥 **Konsistensi**: ${profile.streakDays} Hari Aktif\n\n`;

  // Tentang Saya
  md += `## 💡 Tentang Saya\n\n`;
  md += `${profile.bio}\n\n`;

  // Socials
  const contactLinks: string[] = [];
  if (profile.socialLinks.website) contactLinks.push(`[Website Pribadi](${profile.socialLinks.website})`);
  if (profile.socialLinks.github) contactLinks.push(`[GitHub Profile](${profile.socialLinks.github})`);
  if (profile.socialLinks.linkedin) contactLinks.push(`[LinkedIn](${profile.socialLinks.linkedin})`);
  if (contactLinks.length > 0) {
    md += `**Mari Terhubung**: ${contactLinks.join(' &nbsp;•&nbsp; ')}\n\n`;
  }

  // Top Skills
  if (profile.topSkills && profile.topSkills.length > 0) {
    md += `### 🛠️ Keahlian Utama (Berdasarkan Jam Terbang Bukti Nyata)\n\n`;
    md += profile.topSkills.map(s => `\`${s.skill} (${s.count} logs)\``).join(' &nbsp; ') + `\n\n`;
  }

  md += `---\n\n`;

  // Projects
  md += `## 🏗️ Proyek Utama & Arsitektur Sistem\n\n`;
  projects.forEach((p, idx) => {
    const ndaLabel = p.isStealthNda ? '🛡️ *Enterprise NDA / Stealth*' : '🌐 *Open Public Workstream*';
    md += `### ${idx + 1}. ${p.title} (${ndaLabel})\n\n`;
    md += `${p.description}\n\n`;

    if (p.technologies && p.technologies.length > 0) {
      md += `* **Tech Stack**: ${p.technologies.map(t => `\`${t}\``).join(', ')}\n`;
    }
    if (p.liveUrl) {
      md += `* **Demo Live**: [${p.liveUrl}](${p.liveUrl})\n`;
    }
    if (p.repoUrl) {
      md += `* **Repositori**: [${p.repoUrl}](${p.repoUrl})\n`;
    }
    md += `\n`;
  });

  md += `---\n\n`;

  // Engineering Logs
  md += `## 📜 Catatan Rekayasa & Riwayat Pengerjaan (Engineering Logbook)\n\n`;
  logs.forEach(log => {
    const title = log.title || log.content;
    const ndaText = log.isStealthNda ? '*(Kerahasiaan Klien / NDA)*' : '';
    md += `### ▸ ${title}\n\n`;
    md += `📅 **Tanggal**: \`${log.logDate}\` &nbsp;•&nbsp; 📁 **Wadah Proyek**: ${log.projectName} ${ndaText}\n\n`;

    if (log.details && log.details.length > 0) {
      md += `**Rincian Solusi & Langkah Teknis**:\n`;
      log.details.forEach(d => {
        md += `* ${d}\n`;
      });
      md += `\n`;
    } else if (log.title && log.content) {
      md += `${log.content}\n\n`;
    }

    if (log.skills && log.skills.length > 0) {
      md += `**Keahlian Terpakai**: ${log.skills.map(s => `\`#${s}\``).join(' ')}\n\n`;
    }

    if (log.proofLinks && log.proofLinks.length > 0) {
      md += `**Tautan Bukti Terverifikasi**:\n`;
      log.proofLinks.forEach(pl => {
        md += `* [${pl.label}](${pl.url})\n`;
      });
      md += `\n`;
    } else if (log.proofUrl) {
      md += `* [Bukti Kerja Nyata](${log.proofUrl})\n\n`;
    }

    md += `---\n\n`;
  });

  md += `\n*Portofolio ini disusun secara otomatis melalui [Logfolio.dev](https://logfolio.dev) — Platform Portofolio Berbasis Bukti Kerja Nyata.*`;

  downloadFile(md, `${profile.username}-logfolio.md`, 'text/markdown;charset=utf-8;');
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
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 8px;
    }
    .name {
      font-size: 22pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0F172A;
    }
    .contact-links {
      font-size: 8.5pt;
      color: #475569;
      text-align: right;
    }
    .headline {
      font-size: 11.5pt;
      font-weight: 600;
      color: #4F46E5;
      margin-top: 2px;
    }
    .meta-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 8.5pt;
      color: #64748B;
      margin-top: 6px;
    }
    .summary-text {
      margin-top: 10px;
      font-size: 9.5pt;
      color: #334155;
      line-height: 1.5;
    }

    /* Section Headers */
    .section-title {
      font-size: 11pt;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #0F172A;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 4px;
      margin-top: 18px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-subtitle {
      font-size: 8pt;
      font-weight: normal;
      color: #64748B;
      text-transform: none;
    }

    /* Skills Pill Grid */
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 14px;
    }
    .skill-chip {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 8.5pt;
      font-weight: 600;
      color: #1E293B;
    }

    /* Project Cards */
    .project-card {
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    .project-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .project-name {
      font-size: 11pt;
      font-weight: 700;
      color: #0F172A;
    }
    .badge-nda {
      font-size: 7.5pt;
      background: #F8FAFC;
      color: #475569;
      border: 1px solid #CBD5E1;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 600;
    }
    .badge-public {
      font-size: 7.5pt;
      background: #EEF2FF;
      color: #4338CA;
      border: 1px solid #C7D2FE;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 600;
    }
    .project-desc {
      font-size: 9.5pt;
      color: #334155;
      line-height: 1.45;
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
      font-weight: 600;
    }

    /* Log Item (Workstream proof) */
    .log-card {
      margin-bottom: 12px;
      page-break-inside: avoid;
      padding-left: 10px;
      border-left: 2px solid #E2E8F0;
    }
    .log-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }
    .log-headline {
      font-size: 10pt;
      font-weight: 700;
      color: #0F172A;
    }
    .log-date {
      font-size: 8pt;
      color: #64748B;
      font-family: monospace;
      white-space: nowrap;
    }
    .log-bullets {
      padding-left: 14px;
      font-size: 9pt;
      color: #334155;
      line-height: 1.45;
    }
    .log-bullets li {
      margin-bottom: 2px;
    }
    .log-proof-tags {
      margin-top: 4px;
      font-size: 8pt;
      color: #0284C7;
    }

    /* Footer */
    .resume-footer {
      margin-top: 24px;
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
      <h1 class="name">${profile.fullName}</h1>
      <div class="contact-links">
        ${profile.socialLinks.website ? `<div>🌐 ${profile.socialLinks.website}</div>` : ''}
        ${profile.socialLinks.github ? `<div>🐙 ${profile.socialLinks.github}</div>` : ''}
        ${profile.socialLinks.linkedin ? `<div>💼 ${profile.socialLinks.linkedin}</div>` : ''}
      </div>
    </div>
    <div class="headline">${profile.headline}</div>
    <div class="meta-tags">
      <span>📍 ${profile.location}</span>
      <span>🕒 ${profile.timezone}</span>
      <span>🔥 ${profile.streakDays} Hari Pengerjaan Aktif (${profile.totalLogs} Log Bukti)</span>
    </div>
    <p class="summary-text">${profile.bio}</p>
  </div>

  <!-- Keahlian Utama -->
  <div class="section-title">
    <span>Keahlian Rekayasa & Stack Teknologi</span>
    <span class="section-subtitle">Divalidasi dari riwayat log</span>
  </div>
  <div class="skills-container">
    ${profile.topSkills.map(s => `
      <span class="skill-chip">${s.skill} · ${s.count} bukti</span>
    `).join('')}
  </div>

  <!-- Wadah Arsitektur & Proyek -->
  <div class="section-title">
    <span>Studi Kasus & Wadah Proyek Pilihan</span>
    <span class="section-subtitle">${projects.length} Proyek Aktif</span>
  </div>
  ${projects.map(p => `
    <div class="project-card">
      <div class="project-top">
        <span class="project-name">${p.title}</span>
        <span class="${p.isStealthNda ? 'badge-nda' : 'badge-public'}">
          ${p.isStealthNda ? 'Enterprise NDA / Stealth' : 'Public Workstream'}
        </span>
      </div>
      <p class="project-desc">${p.description}</p>
      ${p.technologies && p.technologies.length > 0 ? `
        <div class="project-meta"><b>Teknologi</b>: ${p.technologies.join(', ')}</div>
      ` : ''}
      <div class="project-links project-meta">
        ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank">↗ Live Preview</a>` : ''}
        ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank">↗ GitHub Repository</a>` : ''}
      </div>
    </div>
  `).join('')}

  <!-- Engineering Logbook (Bukti Nyata) -->
  <div class="section-title">
    <span>Sorotan Bukti Kerja Rekayasa (Verified Logs)</span>
    <span class="section-subtitle">Penyelesaian Masalah Nyata</span>
  </div>
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
          <b>Tautan Bukti:</b> ${log.proofLinks.map(pl => `<a href="${pl.url}" target="_blank" style="color: #4F46E5; text-decoration: none; margin-right: 8px;">${pl.label}</a>`).join(' ')}
        </div>
      ` : log.proofUrl ? `
        <div class="log-proof-tags">
          <b>Tautan Bukti:</b> <a href="${log.proofUrl}" target="_blank" style="color: #4F46E5; text-decoration: none;">Tautan Pengerjaan</a>
        </div>
      ` : ''}
    </div>
  `).join('')}

  <div class="resume-footer">
    <span>Portofolio & Resume Rekayasa ini digenerasi oleh <b>Logfolio</b> (Proof-of-Work Platform).</span>
    <span>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}</span>
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
