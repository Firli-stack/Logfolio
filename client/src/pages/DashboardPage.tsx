import React from 'react';
import type { LogEntry, Project } from '../types';
import { QuickLogComposer } from '../features/dashboard/QuickLogComposer';
import { ManageLogsTable } from '../features/dashboard/ManageLogsTable';
import { EngineeringRhythm } from '../features/portfolio/EngineeringRhythm';
import type { GitHubCommitItem } from '../services/githubService';

interface DashboardPageProps {
  projects: Project[];
  logs: LogEntry[];
  onAddLog: (newLog: LogEntry) => void;
  onDeleteLog: (logId: string) => void;
  onOpenCreateProject: () => void;
  onOpenGitHubSync?: () => void;
  importedCommit?: GitHubCommitItem | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  logs,
  onAddLog,
  onDeleteLog,
  onOpenCreateProject,
  onOpenGitHubSync,
  importedCommit
}) => {
  return (
    <main>
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
