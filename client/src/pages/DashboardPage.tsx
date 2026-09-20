import React from 'react';
import type { LogEntry, Project } from '../types';
import { QuickLogComposer } from '../features/dashboard/QuickLogComposer';
import { ManageLogsTable } from '../features/dashboard/ManageLogsTable';
import { EngineeringRhythm } from '../features/portfolio/EngineeringRhythm';
import { DailyStreakNudge } from '../features/dashboard/DailyStreakNudge';
import type { GitHubCommitItem } from '../services/githubService';

interface DashboardPageProps {
  candidateUsername: string;
  projects: Project[];
  logs: LogEntry[];
  streakDays?: number;
  onAddLog: (newLog: LogEntry) => void;
  onDeleteLog: (logId: string) => void;
  onOpenCreateProject: () => void;
  onOpenGitHubSync?: () => void;
  importedCommit?: GitHubCommitItem | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  logs,
  streakDays = 0,
  onAddLog,
  onDeleteLog,
  onOpenCreateProject,
  onOpenGitHubSync,
  importedCommit
}) => {
  return (
    <main>
      <DailyStreakNudge logs={logs} streakDays={streakDays} />
      <QuickLogComposer
        projects={projects}
        onAddLog={onAddLog}
        onOpenCreateProject={onOpenCreateProject}
        onOpenGitHubSync={onOpenGitHubSync}
        importedCommit={importedCommit}
      />
      <ManageLogsTable logs={logs} onDeleteLog={onDeleteLog} />
      <EngineeringRhythm logs={logs} />
    </main>
  );
};
