import React from 'react';
import type { LogEntry, Project, RecruiterMessage } from '../types';
import { QuickLogComposer } from '../features/dashboard/QuickLogComposer';
import { ManageLogsTable } from '../features/dashboard/ManageLogsTable';
import { EngineeringRhythm } from '../features/portfolio/EngineeringRhythm';
import { RecruiterInboxCard } from '../features/dashboard/RecruiterInboxCard';
import type { GitHubCommitItem } from '../services/githubService';

interface DashboardPageProps {
  candidateUsername: string;
  projects: Project[];
  logs: LogEntry[];
  recruiterMessages?: RecruiterMessage[];
  onAddLog: (newLog: LogEntry) => void;
  onDeleteLog: (logId: string) => void;
  onOpenCreateProject: () => void;
  onOpenGitHubSync?: () => void;
  importedCommit?: GitHubCommitItem | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  candidateUsername,
  projects,
  logs,
  recruiterMessages = [],
  onAddLog,
  onDeleteLog,
  onOpenCreateProject,
  onOpenGitHubSync,
  importedCommit
}) => {
  return (
    <main>
      <RecruiterInboxCard
        messages={recruiterMessages}
        candidateUsername={candidateUsername}
      />
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
