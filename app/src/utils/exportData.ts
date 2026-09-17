import type { UserProfile, Project, LogEntry } from '../mockData';

/**
 * Mengonversi seluruh data profil, proyek, dan riwayat log menjadi format Markdown yang siap dipajang di GitHub README atau Notion.
 */
export function exportToMarkdown(
  profile: UserProfile,
  projects: Project[],
  logs: LogEntry[]
): void {
  let md = `# ${profile.fullName} (@${profile.username})\n\n`;
  md += `**${profile.headline}**\n\n`;
  md += `📍 *${profile.location}* | 🕒 *${profile.timezone}*\n\n`;
  md += `> ${profile.bio}\n\n`;

  // Socials
  md += `### 🌐 Tautan & Media Sosial\n`;
  if (profile.socialLinks.github) md += `- **GitHub**: [${profile.socialLinks.github}](${profile.socialLinks.github})\n`;
  if (profile.socialLinks.linkedin) md += `- **LinkedIn**: [${profile.socialLinks.linkedin}](${profile.socialLinks.linkedin})\n`;
  if (profile.socialLinks.website) md += `- **Website**: [${profile.socialLinks.website}](${profile.socialLinks.website})\n`;
  md += `\n---\n\n`;

  // Workstreams & Projects
  md += `## 🏗️ Arsitektur Sistem & Wadah Proyek\n\n`;
  projects.forEach((p, idx) => {
    md += `### ${idx + 1}. ${p.title} ${p.isStealthNda ? '*(Enterprise Stealth / NDA)*' : '*(Public Workstream)*'}\n`;
    md += `${p.description}\n\n`;
    if (p.technologies && p.technologies.length > 0) {
      md += `**Tech Stack**: ${p.technologies.map(t => `\`#${t}\``).join(' ')}\n\n`;
    }
    if (p.liveUrl) md += `- **Live Demo**: [${p.liveUrl}](${p.liveUrl})\n`;
    if (p.repoUrl) md += `- **Repository**: [${p.repoUrl}](${p.repoUrl})\n`;
    md += `\n`;
  });
  md += `---\n\n`;

  // Engineering Logs
  md += `## 📜 Engineering Logbook (Proof-of-Work Stream)\n\n`;
  logs.forEach(log => {
    const headline = log.title || log.content;
    md += `### ▸ ${headline}\n`;
    md += `**Tanggal**: \`${log.logDate}\` | **Proyek**: ${log.projectName} ${log.isStealthNda ? '*(NDA)*' : ''}\n\n`;

    if (log.details && log.details.length > 0) {
      log.details.forEach(d => {
        md += `- ${d}\n`;
      });
      md += `\n`;
    } else if (log.title && log.content) {
      md += `${log.content}\n\n`;
    }

    if (log.skills && log.skills.length > 0) {
      md += `**Skills**: ${log.skills.map(s => `\`#${s}\``).join(' ')}\n\n`;
    }

    // Proof links
    if (log.proofLinks && log.proofLinks.length > 0) {
      md += `**Bukti Kerja Terverifikasi**:\n`;
      log.proofLinks.forEach(pl => {
        md += `- [${pl.label}](${pl.url})\n`;
      });
      md += `\n`;
    } else if (log.proofUrl) {
      md += `**Bukti Kerja**: [${log.proofUrl}](${log.proofUrl})\n\n`;
    }

    md += `---\n\n`;
  });

  md += `\n*Dokumen diekspor secara otomatis melalui Logfolio (Micro-Journaling & Proof-of-Work Platform).*`;

  downloadFile(md, `${profile.username}-logfolio.md`, 'text/markdown;charset=utf-8;');
}

/**
 * Mengonversi seluruh data profil, proyek, dan riwayat log menjadi JSON portabel murni.
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
 * Helper download file langsung di browser
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
