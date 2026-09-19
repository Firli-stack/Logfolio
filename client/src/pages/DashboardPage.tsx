import React from 'react';
import type { LogEntry, Project } from '../types';
import { QuickLogComposer } from '../features/dashboard/QuickLogComposer';
import { ManageLogsTable } from '../features/dashboard/ManageLogsTable';
import { EngineeringRhythm } from '../features/portfolio/EngineeringRhythm';

interface DashboardPageProps {
  projects: Project[];
  logs: LogEntry[];
  onAddLog: (newLog: LogEntry) => void;
  onDeleteLog: (logId: string) => void;
  onOpenCreateProject: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  logs,
  onAddLog,
  onDeleteLog,
  onOpenCreateProject,
}) => {
  return (
    <main>
      <QuickLogComposer
        projects={projects}
        onAddLog={onAddLog}
        onOpenCreateProject={onOpenCreateProject}
      />
      <ManageLogsTable logs={logs} onDeleteLog={onDeleteLog} />
      <EngineeringRhythm logs={logs} />
    </main>
  );
};
