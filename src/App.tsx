import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PhotoGallery } from './components/PhotoGallery';
import { Menu } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'all' | 'favorites' | string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar with mobile overlay */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative z-40 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          onViewChange={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
          }}
          currentView={currentView}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-auto w-full">
        <PhotoGallery currentView={currentView} />
      </main>
    </div>
  );
}

export default App;