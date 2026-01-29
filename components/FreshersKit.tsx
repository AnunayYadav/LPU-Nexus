import React, { useState } from 'react';

const FreshersKit: React.FC = () => {
  const [checklist, setChecklist] = useState([
    { id: 1, item: "Original Marksheets (10th & 12th)", category: "Documents", checked: false },
    { id: 2, item: "Migration Certificate", category: "Documents", checked: false },
    { id: 3, item: "Passport Size Photos (20 copies)", category: "Documents", checked: false },
    { id: 4, item: "Bed Sheets & Pillow Covers", category: "Hostel", checked: false },
    { id: 5, item: "Extension Cord (Surge Protector)", category: "Electronics", checked: false, link: "https://amazon.in" },
    { id: 6, item: "Electric Kettle (if allowed)", category: "Electronics", checked: false, link: "https://amazon.in" },
    { id: 7, item: "Padlock & Keys for Cupboard", category: "Hostel", checked: false },
    { id: 8, item: "Basic Medicine Kit", category: "Essentials", checked: false },
  ]);

  const toggleItem = (id: number) => {
    setChecklist(checklist.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const categories = Array.from(new Set(checklist.map(i => i.category)));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Freshers' Survival Kit</h2>
        <p className="text-slate-600 dark:text-slate-400">The ultimate checklist for your first day at LPU.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => (
          <div key={cat} className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{cat}</h3>
            <ul className="space-y-3">
              {checklist.filter(i => i.category === cat).map(item => (
                <li key={item.id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${item.checked 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-slate-400 dark:border-slate-500 hover:border-green-500'
                        }`}
                    >
                      {item.checked && '✓'}
                    </button>
                    <span className={`text-sm ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                      {item.item}
                    </span>
                  </div>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                      Buy on Amazon ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-500/20 mt-8">
        <h3 className="font-bold text-orange-800 dark:text-orange-300 mb-2">💡 Pro Tip</h3>
        <p className="text-sm text-orange-700 dark:text-orange-200">
          Don't buy heavy textbooks yet. Use the <strong>Academic Oracle</strong> to check which books are actually needed for your course plan.
        </p>
      </div>
    </div>
  );
};

export default FreshersKit;