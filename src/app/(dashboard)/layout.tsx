import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import React from 'react';
import ChatbotButton from './(chatbot)/components/ChatbotButton';
export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col overflow-auto">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-800">
          {children}
          <div className="fixed right-4 bottom-4 z-50 flex items-center justify-center space-x-2">
            <ChatbotButton />
          </div>
        </main>
      </div>
    </div>
  );
}
