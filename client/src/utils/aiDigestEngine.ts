import type { LogEntry, Project, UserProfile } from '../types';

export interface DigestResult {
  scopeTitle: string;
  totalLogsAnalyzed: number;
  dateRange: string;
  executivePitch: string;
  keyAchievements: string[];
  skillsFrequency: { skill: string; count: number }[];
  technicalHighlights: {
    title: string;
    description: string;
    skills: string[];
    proofUrl?: string;
  }[];
  socialPostDraft: string;
}

export function generateAiDigest(
  profile: UserProfile,
  logs: LogEntry[],
  projects: Project[],
  options: {
    timeframe: '7days' | '30days' | 'all';
    projectId?: string;
    lang?: 'id' | 'en';
  }
): DigestResult {
  const isEn = options.lang === 'en';
  const now = new Date();
  let filtered = [...logs];

  if (options.projectId && options.projectId !== 'all') {
    filtered = filtered.filter(l => l.projectId === options.projectId);
  }

  if (options.timeframe === '7days') {
    const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter(l => new Date(l.createdAt) >= cutoff);
  } else if (options.timeframe === '30days') {
    const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter(l => new Date(l.createdAt) >= cutoff);
  }
  if (filtered.length === 0 && logs.length > 0) {
    filtered = logs.slice(0, 10);
  }
  const skillMap: Record<string, number> = {};
  filtered.forEach(log => {
    log.skills.forEach(s => {
      const normalized = s.trim();
      if (normalized) {
        skillMap[normalized] = (skillMap[normalized] || 0) + 1;
      }
    });
  });

  const skillsFrequency = Object.entries(skillMap)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const impactKeywords = [
    'optimasi', 'optimize', 'latency', 'refactor', 'benchmark', 'scale', 
    'pangkas', 'reduce', 'fix', 'bug', 'deploy', 'pipeline', 'architecture',
    'idempotent', 'cache', 'redis', 'security', 'database', 'query', 'auth'
  ];

  const highlights = filtered
    .filter(l => l.isFeatured || impactKeywords.some(kw => l.content.toLowerCase().includes(kw)))
    .slice(0, 4);

  const finalHighlights = highlights.length > 0 ? highlights : filtered.slice(0, 3);

  const technicalHighlights = finalHighlights.map(h => {
    const firstLine = h.content.split('\n')[0].replace(/^[#*-]\s*/, '');
    const title = firstLine.length > 65 ? `${firstLine.substring(0, 62)}...` : firstLine;
    return {
      title,
      description: h.content,
      skills: h.skills,
      proofUrl: h.proofUrl || undefined
    };
  });

  const topSkillsList = skillsFrequency.map(s => s.skill).slice(0, 3).join(', ') || (isEn ? 'Modern Web & Backend' : 'Software Engineering');
  const projectObj = options.projectId && options.projectId !== 'all'
    ? projects.find(p => p.id === options.projectId)
    : null;
  const projectName = projectObj?.title || null;

  let timeframeLabel = isEn ? 'All Time' : 'Seluruh Waktu';
  if (options.timeframe === '7days') timeframeLabel = isEn ? 'Last 7 Days (Weekly Sprint)' : 'Sprint 7 Hari Terakhir';
  if (options.timeframe === '30days') timeframeLabel = isEn ? 'Last 30 Days (Monthly Momentum)' : '30 Hari Terakhir';
  let executivePitch = '';
  if (isEn) {
    executivePitch = projectName
      ? `Intensive focus on ${projectName}: Shipped ${filtered.length} verified micro-milestones with primary expertise in ${topSkillsList}. Consistently optimized system resilience, reduced bottlenecks, and demonstrated production-ready engineering standards.`
      : `Across the ${timeframeLabel}, ${profile.fullName} recorded ${filtered.length} verified proof-of-work logbooks actively applying ${topSkillsList}. Strong focus on pragmatic problem-solving, architectural stability, and measurable impact.`;
  } else {
    executivePitch = projectName
      ? `Fokus intensif pada proyek ${projectName}: Menyelesaikan ${filtered.length} micro-milestones dengan konsentrasi utama pada ${topSkillsList}. Terbukti meningkatkan stabilitas, efisiensi arsitektur, dan delivery fitur.`
      : `Selama periode ${timeframeLabel}, ${profile.fullName} menyelesaikan ${filtered.length} log pembuktian kompetensi teknis dengan keahlian aktif pada ${topSkillsList}. Fokus kuat pada pemecahan masalah nyata, optimasi latensi, serta penulisan kode teruji.`;
  }
  const keyAchievements = technicalHighlights.map((th, idx) => {
    return `${idx + 1}. ${th.title} (${th.skills.length > 0 ? th.skills.join(', ') : 'Tech Stack'})`;
  });

  if (keyAchievements.length === 0) {
    keyAchievements.push(isEn 
      ? 'Consistently maintained resilient system architecture and code health.' 
      : 'Membangun dan memelihara fondasi arsitektur sistem secara konsisten.');
  }
  const hashtags = skillsFrequency.map(s => `#${s.skill.replace(/[^a-zA-Z0-9]/g, '')}`).join(' ');
  const socialPostDraft = isEn
    ? `🚀 Engineering Update: Here's what I shipped recently!

${projectName ? `Current Focus: ${projectName}` : `Sprint summary & my engineering rhythm:`}

📌 Key Highlights & Problem Solved:
${technicalHighlights.map(t => `• ${t.title}`).join('\n')}

💡 Core Stack in Action:
${skillsFrequency.map(s => `• ${s.skill} (${s.count} logs)`).join('\n')}

Proof of work & verified commits on my live portfolio:
🔗 ${window.location.origin}/p/${profile.username}

${hashtags} #BuildInPublic #SoftwareEngineering #ProofOfSkill #DeveloperPortfolio #TechHiring`
    : `🚀 Engineering Update: Rangkuman apa yang saya selesaikan minggu ini!

${projectName ? `Fokus Proyek: ${projectName}` : `Rangkuman sprint & rhythm pengerjaan harian:`}

📌 Highlight Teknis & Masalah yang Diselesaikan:
${technicalHighlights.map(t => `• ${t.title}`).join('\n')}

💡 Core Stack yang Aktif Dipakai:
${skillsFrequency.map(s => `• ${s.skill} (${s.count} logs)`).join('\n')}

Cek bukti pengerjaan & verified commits lengkap di portofolio saya:
🔗 ${window.location.origin}/p/${profile.username}

${hashtags} #BuildInPublic #SoftwareEngineering #ProofOfSkill #DeveloperPortfolio`;

  return {
    scopeTitle: projectName ? `${isEn ? 'Project' : 'Proyek'}: ${projectName}` : timeframeLabel,
    totalLogsAnalyzed: filtered.length,
    dateRange: `${new Date(Date.now() - (options.timeframe === '7days' ? 7 : 30) * 86400000).toLocaleDateString(isEn ? 'en-US' : 'id-ID')} — ${now.toLocaleDateString(isEn ? 'en-US' : 'id-ID')}`,
    executivePitch,
    keyAchievements,
    skillsFrequency,
    technicalHighlights,
    socialPostDraft
  };
}
