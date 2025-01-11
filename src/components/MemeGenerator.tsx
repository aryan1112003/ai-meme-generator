import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Share2, Download, Heart, Wand2, RefreshCw } from 'lucide-react';
import { generateCaptions } from '../services/gemini';
import { generateMeme } from '../services/imgflip';
import { useMemeStore } from '../store/memeStore';
import { TemplateGallery } from './TemplateGallery';
import type { MemeTemplate } from '../types';

const CAPTION_STYLES = [
  'funny',
  'sarcastic',
  'wholesome',
  'dramatic',
  'nerdy',
  'philosophical',
  'motivational',
  'movie-quotes',
  'pop-culture',
  'internet-slang'
];

export function MemeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [prompt, setPrompt] = useState('');
  const [captions, setCaptions] = useState<string[]>([]);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [style, setStyle] = useState('funny');
  const [loading, setLoading] = useState(false);

  const { addToHistory, addToFavorites } = useMemeStore();

  const handleGenerateCaptions = async () => {
    if (!prompt) {
      toast.error('Please enter a prompt first!');
      return;
    }

    setLoading(true);
    try {
      const newCaptions = await generateCaptions(prompt, style);
      setCaptions(newCaptions);
      toast.success('Captions generated successfully!');
    } catch (error) {
      toast.error('Failed to generate captions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateCaptions = async () => {
    if (!prompt) {
      toast.error('Please enter a prompt first!');
      return;
    }
    setLoading(true);
    try {
      const newCaptions = await generateCaptions(prompt, style);
      setCaptions(newCaptions);
      toast.success('Captions regenerated!');
    } catch (error) {
      toast.error('Failed to regenerate captions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMeme = async () => {
    if (!selectedTemplate || captions.length === 0) {
      toast.error('Please select a template and generate captions first!');
      return;
    }

    setLoading(true);
    try {
      const url = await generateMeme(selectedTemplate.id, captions);
      setGeneratedUrl(url);
      
      const meme = {
        id: Date.now().toString(),
        url,
        template: selectedTemplate,
        captions,
        timestamp: Date.now(),
      };
      
      addToHistory(meme);
      toast.success('Meme generated successfully!');
    } catch (error) {
      toast.error('Failed to generate meme');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Controls Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              Meme Idea
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Describe your meme idea..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              Caption Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              {CAPTION_STYLES.map((s) => (
                <option key={s} value={s} className="dark:bg-gray-800 dark:text-white">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateCaptions}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Wand2 size={20} />
            Generate Captions
          </button>

          {captions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Generated Captions
                </label>
                <button
                  onClick={handleRegenerateCaptions}
                  disabled={loading}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700"
                >
                  <RefreshCw size={16} />
                  <span className="text-sm">Regenerate</span>
                </button>
              </div>
              <div className="space-y-2">
                {captions.map((caption, index) => (
                  <input
                    key={index}
                    value={caption}
                    onChange={(e) => {
                      const newCaptions = [...captions];
                      newCaptions[index] = e.target.value;
                      setCaptions(newCaptions);
                    }}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateMeme}
            disabled={loading || !selectedTemplate || captions.length === 0}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Generate Meme
          </button>
        </div>

        {/* Preview Section */}
        <div>
          {generatedUrl ? (
            <div className="space-y-4">
              <img
                src={generatedUrl}
                alt="Generated Meme"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addToFavorites({
                      id: Date.now().toString(),
                      url: generatedUrl,
                      template: selectedTemplate!,
                      captions,
                      timestamp: Date.now(),
                    });
                    toast.success('Added to favorites!');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  <Heart size={20} />
                  Save
                </button>
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = generatedUrl;
                    a.download = 'meme.jpg';
                    a.click();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Download size={20} />
                  Download
                </button>
                <button
                  onClick={() => {
                    navigator.share({
                      title: 'Check out this meme!',
                      url: generatedUrl,
                    }).catch(console.error);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg p-8 dark:border-gray-700">
              <p className="text-gray-500 dark:text-white text-center">
                {selectedTemplate 
                  ? 'Generate captions to create your meme!'
                  : 'Select a template below to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Template Gallery */}
      <TemplateGallery onSelectTemplate={setSelectedTemplate} />
    </div>
  );
}