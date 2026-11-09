import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AcademyProvider } from './context/AcademyContext';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { TracksPage } from './pages/TracksPage';
import { CertificationPage } from './pages/CertificationPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { JargonDictionaryPage } from './pages/JargonDictionaryPage';
import { ReferenceDocsPage } from './pages/ReferenceDocsPage';
import { PracticalLabsPage } from './pages/PracticalLabsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { LiveAiNewsPage } from './pages/LiveAiNewsPage';

export function App() {
  return (
    <BrowserRouter>
      <AcademyProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tracks" element={<TracksPage />} />
            <Route path="/ai-pulse" element={<LiveAiNewsPage />} />
            <Route path="/certification" element={<CertificationPage />} />
            <Route path="/interview-prep" element={<InterviewPrepPage />} />
            <Route path="/jargon-dictionary" element={<JargonDictionaryPage />} />
            <Route path="/reference-docs" element={<ReferenceDocsPage />} />
            <Route path="/practical-labs" element={<PracticalLabsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </AcademyProvider>
    </BrowserRouter>
  );
}

export default App;
