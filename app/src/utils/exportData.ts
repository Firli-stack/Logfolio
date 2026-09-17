import type { UserProfile, Project, LogEntry } from '../mockData';

/**
 * Format Markdown Super Rapi & Elegan
 * Siap langsung di-copy paste ke GitHub Profile README atau Notion
 */
export function exportToMarkdown(
  profile: UserProfile,
  projects: Project[],
  logs: LogEntry[]
): void {
  let md = `# 👋 Halo, Saya ${profile.fullName} (@${profile.username})\n\n`;
  md += `> **${profile.headline}**\n\n`;

  // Badges & Meta
  md += `📍 **Lokasi**: ${profile.location} &nbsp;|&nbsp; 🕒 **Zona Waktu**: ${profile.timezone} &nbsp;|&nbsp; 🔥 **Konsistensi Kerja**: ${profile.streakDays} Hari Beruntun\n\n`;

  // Bio
  md += `### 📌 Ringkasan Profesional\n`;
  md += `${profile.bio}\n\n`;

  // Links
  md += `### 🔗 Tautan & Kontak\n`;
  const links: string[] = [];
  if (profile.socialLinks.github) links.push(`[GitHub](${profile.socialLinks.github})`);
  if (profile.socialLinks.linkedin) links.push(`[LinkedIn](${profile.socialLinks.linkedin})`);
  if (profile.socialLinks.website) links.push(`[Website Pribadi](${profile.socialLinks.website})`);
  md += links.join(' &nbsp;•&nbsp; ') + `\n\n`;

  // Top Skills
  if (profile.topSkills && profile.topSkills.length > 0) {
    md += `### 🛠️ Keahlian Utama (Berdasarkan Bukti Nyata)\n`;
    md += profile.topSkills.map(s => `\`${s.skill} (${s.count} logs)\``).join(' &nbsp; ') + `\n\n`;
  }

  md += `---\n\n`;

  // Projects / Workstreams
  md += `## 🏗️ Arsitektur Sistem & Wadah Proyek\n\n`;
  projects.forEach((p, idx) => {
    const ndaBadge = p.isStealthNda ? '🛡️ *Enterprise Stealth / NDA*' : '🌐 *Public Workstream*';
    md += `### ${idx + 1}. ${p.title} (${ndaBadge})\n`;
    md += `${p.description}\n\n`;

    if (p.technologies && p.technologies.length > 0) {
      md += `* **Teknologi**: ${p.technologies.map(t => `\`${t}\``).join(', ')}\n`;
    }
    if (p.liveUrl) {
      md += `* **Live Demo**: [${p.liveUrl}](${p.liveUrl})\n`;
    }
    if (p.repoUrl) {
      md += `* **Repository**: [${p.repoUrl}](${p.repoUrl})\n`;
    }
    md += `\n`;
  });

  md += `---\n\n`;

  // Engineering Logs (Proof of Work)
  md += `## 📜 Engineering Logbook (Catatan Bukti Kerja)\n\n`;
  logs.forEach(log => {
    const title = log.title || log.content;
    const ndaText = log.isStealthNda ? '*(NDA Shielded)*' : '';
    md += `#### ▸ ${title}\n`;
    md += `📅 **${log.logDate}** &nbsp;•&nbsp; 📁 **${log.projectName}** ${ndaText}\n\n`;

    if (log.details && log.details.length > 0) {
      log.details.forEach(d => {
        md += `* ${d}\n`;
      });
      md += `\n`;
    } else if (log.title && log.content) {
      md += `${log.content}\n\n`;
    }

    if (log.skills && log.skills.length > 0) {
      md += `**Skills Terpakai**: ${log.skills.map(s => `\`#${s}\``).join(' ')}\n\n`;
    }

    // Proof Links
    if (log.proofLinks && log.proofLinks.length > 0) {
      md += `**Tautan Bukti Terverifikasi**:\n`;
      log.proofLinks.forEach(pl => {
        md += `* [${pl.label}](${pl.url})\n`;
      });
      md += `\n`;
    } else if (log.proofUrl) {
      md += `**Tautan Bukti**: [Inspect Proof](${log.proofUrl})\n\n`;
    }

    md += `---\n\n`;
  });

  md += `\n<sub>Dibuat dan diekspor secara otomatis melalui **Logfolio** (Micro-Journaling & Proof-of-Work Platform).</sub>\n`;

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
 * Ekspor Resume HTML Bersih Khusus Cetak / Simpan PDF
 * Membuka jendela khusus yang otomatis memicu dialog "Save as PDF" bawaan browser
 * dengan layout dokumen A4 bersih, profesional, tanpa elemen aplikasi web.
 */
export function exportToPdfPrint(
  profile: UserProfile,
  projects: Project[],
  logs: LogEntry[]
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    // Fallback jika popup terblokir
    window.print();
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${profile.fullName} - Engineering Resume & Proof-of-Work</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      line-height: 1.5;
      font-size: 10.5pt;
    }
    .header {
      border-bottom: 2px solid #0F172A;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .name {
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0F172A;
    }
    .headline {
      font-size: 12pt;
      font-weight: 600;
      color: #334155;
      margin-top: 2px;
    }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      font-size: 9pt;
      color: #64748B;
      margin-top: 6px;
    }
    .bio {
      margin-top: 8px;
      font-size: 9.5pt;
      color: #334155;
      line-height: 1.45;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0F172A;
      border-bottom: 1px solid #CBD5E1;
      padding-bottom: 4px;
      margin-top: 18px;
      margin-bottom: 10px;
    }
    .project-card {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 700;
      font-size: 10.5pt;
    }
    .badge-nda {
      font-size: 8pt;
      background: #F1F5F9;
      color: #475569;
      border: 1px solid #CBD5E1;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .badge-public {
      font-size: 8pt;
      background: #EFF6FF;
      color: #1D4ED8;
      border: 1px solid #BFDBFE;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .project-desc {
      font-size: 9.5pt;
      color: #334155;
      margin-top: 2px;
    }
    .tech-stack {
      font-size: 8.5pt;
      color: #475569;
      margin-top: 3px;
    }
    .log-item {
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 10pt;
      font-weight: 700;
      color: #0F172A;
    }
    .log-date {
      font-size: 8.5pt;
      color: #64748B;
      font-family: monospace;
      font-weight: normal;
    }
    .log-details {
      margin-top: 3px;
      padding-left: 14px;
      font-size: 9pt;
      color: #334155;
    }
    .log-details li {
      margin-bottom: 2px;
    }
    .footer-note {
      margin-top: 24px;
      border-top: 1px dashed #CBD5E1;
      padding-top: 8px;
      font-size: 8pt;
      color: #94A3B8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${profile.fullName}</div>
    <div class="headline">${profile.headline}</div>
    <div class="meta-bar">
      <span>📍 ${profile.location}</span>
      <span>🕒 ${profile.timezone}</span>
      ${profile.socialLinks.website ? `<span>🌐 ${profile.socialLinks.website}</span>` : ''}
      ${profile.socialLinks.github ? `<span>🐙 ${profile.socialLinks.github}</span>` : ''}
      ${profile.socialLinks.linkedin ? `<span>💼 ${profile.socialLinks.linkedin}</span>` : ''}
    </div>
    <div class="bio">${profile.bio}</div>
  </div>

  <div class="section-title">Wadah Arsitektur & Proyek Utama</div>
  ${projects.map(p => `
    <div class="project-card">
      <div class="project-header">
        <span>${p.title}</span>
        <span class="${p.isStealthNda ? 'badge-nda' : 'badge-public'}">
          ${p.isStealthNda ? 'Enterprise Stealth / NDA' : 'Public Workstream'}
        </span>
      </div>
      <div class="project-desc">${p.description}</div>
      ${p.technologies && p.technologies.length > 0 ? `<div class="tech-stack"><b>Tech Stack</b>: ${p.technologies.join(', ')}</div>` : ''}
    </div>
  `).join('')}

  <div class="section-title">Bukti Rekayasa & Engineering Logbook (Verified)</div>
  ${logs.map(log => `
    <div class="log-item">
      <div class="log-header">
        <span>▸ ${log.title || log.content}</span>
        <span class="log-date">${log.logDate} · ${log.projectName}</span>
      </div>
      ${log.details && log.details.length > 0 ? `
        <ul class="log-details">
          ${log.details.map(d => `<li>${d}</li>`).join('')}
        </ul>
      ` : `
        <div style="font-size: 9pt; color: #334155; margin-top: 2px;">${log.content}</div>
      `}
    </div>
  `).join('')}

  <div class="footer-note">
    Dokumen ini digenerasi secara otomatis dari <b>Logfolio</b> · Portofolio Berbasis Bukti Kerja Nyata (Proof-of-Work).
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
