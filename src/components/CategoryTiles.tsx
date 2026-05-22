import type { NewsCategory } from '../types';

interface Props {
  categories: NewsCategory[];
  activeCategories: NewsCategory[];
  onToggle: (category: NewsCategory) => void;
}

export default function CategoryTiles({ categories, activeCategories, onToggle }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map(category => {
        const active = activeCategories.includes(category);
        return (
          <button
            key={category}
            type="button"
            onClick={() => onToggle(category)}
            className={`rounded-3xl border p-5 text-left transition ${
              active
                ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:border-brand-300 dark:bg-brand-300/10 dark:text-brand-200'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900'
            }`}
          >
            <div className="text-sm uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">Category</div>
            <h3 className="mt-3 text-xl font-semibold">{category}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Tailored news and insights for your preferred industry focus.</p>
          </button>
        );
      })}
    </div>
  );
}
