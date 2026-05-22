import { useState } from 'react';
import type { Article } from '../types';
import { useAppContext } from '../context/AppContext';
import { summarizeArticle } from '../lib/summarizer';

interface Props {
  article: Article;
  onSelect: (article: Article) => void;
}

export default function ArticleCard({ article, onSelect }: Props) {
  const { bookmarks, toggleBookmark, theme } = useAppContext();
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const isBookmarked = bookmarks.some(item => item.url === article.url);
  const hasGroq = Boolean(import.meta.env.VITE_GROQ_API_KEY);

  const handleSummarize = async () => {
    if (!hasGroq) {
      setSummaryError('Summarization requires VITE_GROQ_API_KEY in your .env file.');
      return;
    }
    setSummaryError('');
    setSummarizing(true);
    try {
      const result = await summarizeArticle(article);
      setSummary(result);
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : 'Summarization failed.');
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <article className={`group overflow-hidden rounded-3xl border ${theme === 'dark' ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'} shadow-soft transition hover:-translate-y-0.5 hover:shadow-xl`}>
      <button type="button" onClick={() => onSelect(article)} className="text-left">
        <div className="relative h-52 overflow-hidden bg-slate-200 dark:bg-slate-800">
          {article.urlToImage ? (
            <img src={article.urlToImage} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">No preview image</div>
          )}
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">
            <span>{article.source.name}</span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
          <h3 className="text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">{article.title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{article.description || article.content || 'Read more about this story.'}</p>
        </div>
      </button>
      <div className="border-t px-5 py-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSummarize}
            disabled={summarizing}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {summarizing ? 'Summarizing...' : 'Summarize'}
          </button>
          <button
            type="button"
            onClick={() => toggleBookmark(article)}
            className="rounded-full bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {isBookmarked ? 'Remove' : 'Bookmark'}
          </button>
        </div>
        {summary ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <p className="font-semibold text-slate-900 dark:text-white">AI Summary</p>
            <p className="mt-2 text-sm leading-6">{summary}</p>
          </div>
        ) : summaryError ? (
          <p className="text-sm text-red-600 dark:text-red-300">{summaryError}</p>
        ) : null}
      </div>
      <div className="border-t px-5 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 hover:text-brand-700 dark:text-brand-300"
        >
          Read full article →
        </a>
      </div>
    </article>
  );
}
