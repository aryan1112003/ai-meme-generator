import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Github, Linkedin } from 'lucide-react';
import { useMemeStore } from './store/memeStore';
import { MemeGenerator } from './components/MemeGenerator';
import { TemplateGallery } from './components/TemplateGallery';
import { getTemplates } from './services/imgflip';
import { AUTHOR } from './config/constants';

function App() {
  const { setTemplates } = useMemeStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const templates = await getTemplates();
        setTemplates(templates);
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, [setTemplates]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            🎨 AI Meme Generator
          </h1>
          <div className="flex items-center gap-4">
            <a
              href={AUTHOR.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-700"
            >
              <Github className="text-white" />
            </a>
            <a
              href={AUTHOR.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-700"
            >
              <Linkedin className="text-white" />
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <MemeGenerator />
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400">
          <p>© 2024 Created by {AUTHOR.name}. All rights reserved.</p>
          <p className="mt-1">Powered by Google Gemini AI and Imgflip</p>
        </footer>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;