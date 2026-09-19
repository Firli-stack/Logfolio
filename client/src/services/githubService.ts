export interface GitHubCommitItem {
  id: string;
  sha: string;
  shortSha: string;
  repoName: string;
  message: string;
  date: string;
  url: string;
  detectedSkills: string[];
}

const COMMON_TECH_KEYWORDS: Record<string, string[]> = {
  Docker: ['docker', 'dockerfile', 'container', 'compose'],
  PostgreSQL: ['postgres', 'postgresql', 'psql', 'sql', 'migration', 'schema', 'db'],
  React: ['react', 'jsx', 'tsx', 'hook', 'frontend', 'component'],
  TypeScript: ['ts', 'typescript', 'interface', 'type'],
  'Node.js': ['node', 'express', 'server', 'backend', 'api', 'middleware'],
  Redis: ['redis', 'cache', 'caching'],
  Kubernetes: ['k8s', 'kubernetes', 'helm', 'cluster'],
  TailwindCSS: ['tailwind', 'css', 'style', 'ui'],
  Git: ['git', 'ci', 'cd', 'workflow', 'action', 'pipeline'],
  Python: ['python', 'py', 'django', 'fastapi', 'flask'],
  Security: ['auth', 'jwt', 'security', 'oauth', 'token', 'permission'],
  Performance: ['perf', 'optimize', 'tune', 'speed', 'memory', 'leak']
};

function extractSkills(text: string, repo: string): string[] {
  const combined = `${text} ${repo}`.toLowerCase();
  const matched: string[] = [];

  for (const [skill, keywords] of Object.entries(COMMON_TECH_KEYWORDS)) {
    if (keywords.some(kw => combined.includes(kw))) {
      matched.push(skill);
    }
  }

  return matched.slice(0, 4);
}

export function extractGitHubUsername(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }
  return trimmed.replace(/^@/, '').replace(/\/.*$/, '');
}

export async function fetchGitHubCommits(input: string): Promise<GitHubCommitItem[]> {
  const username = extractGitHubUsername(input) || 'Firli-stack';

  try {
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
      headers: { Accept: 'application/vnd.github.v3+json' }
    });

    if (!reposRes.ok) {
      return [];
    }

    const repos = await reposRes.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      return [];
    }

    const allCommits: GitHubCommitItem[] = [];

    const commitFetches = repos.map(async (repo: any) => {
      try {
        const cRes = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=6`, {
          headers: { Accept: 'application/vnd.github.v3+json' }
        });
        if (!cRes.ok) return [];
        const commitList = await cRes.json();
        if (!Array.isArray(commitList)) return [];

        return commitList.map((c: any) => {
          const sha = c.sha || Math.random().toString(36).substring(2, 9);
          const shortSha = sha.substring(0, 7);
          const msg = c.commit?.message || 'Updated repository';
          const detected = extractSkills(msg, repo.name);

          return {
            id: sha,
            sha,
            shortSha,
            repoName: repo.full_name,
            message: msg,
            date: c.commit?.author?.date || c.commit?.committer?.date || new Date().toISOString(),
            url: c.html_url || `https://github.com/${repo.full_name}/commit/${sha}`,
            detectedSkills: detected.length > 0 ? detected : ['Git', 'Codebase']
          };
        });
      } catch {
        return [];
      }
    });

    const results = await Promise.all(commitFetches);
    for (const resList of results) {
      allCommits.push(...resList);
    }

    allCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return allCommits.slice(0, 15);
  } catch {
    return [];
  }
}
