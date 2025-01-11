import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import { Search } from 'lucide-react';
import { useMemeStore } from '../store/memeStore';
import { MEME_CATEGORIES } from '../config/constants';

export function TemplateGallery({ onSelectTemplate }) {
  const { templates } = useMemeStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleTemplateClick = (template) => {
    setSelectedTemplateId(template.id);
    onSelectTemplate(template);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Meme Templates</h2>
      
      {/* Search and Categories */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MEME_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <Masonry
        breakpointCols={{
          default: 4,
          1100: 3,
          700: 2,
          500: 1,
        }}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateClick(template)}
            className={`mb-4 break-inside-avoid cursor-pointer transition-all duration-200 ${
              selectedTemplateId === template.id 
                ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
                : 'hover:opacity-80'
            }`}
          >
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={template.url}
                alt={template.name}
                className="w-full"
                loading="lazy"
              />
              {selectedTemplateId === template.id && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Selected
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-white">
              {template.name}
            </p>
          </div>
        ))}
      </Masonry>
    </div>
  );
}