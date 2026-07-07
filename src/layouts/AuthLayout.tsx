import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from '../components/TopNavbar';
import { Sidebar } from '../components/Sidebar';
import { AnalysisProvider } from '../contexts/AnalysisContext';

export function AuthLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AnalysisProvider>
      <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navbar */}
          <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />

          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4 md:p-6 w-full flex flex-col min-h-full">
              <div className="flex-1">
                <Outlet />
              </div>
              
              <footer className="mt-12 py-6 border-t border-slate-200 text-center text-slate-500 text-sm w-full">
                &copy; {new Date().getFullYear()} Exam Insight Portal. All rights reserved.
              </footer>
            </div>
          </main>
        </div>
      </div>
    </AnalysisProvider>
  );
}
