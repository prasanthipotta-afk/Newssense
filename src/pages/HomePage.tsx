import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { fetchTopHeadlines, searchNews } from '../lib/newsApi';
import { useAppContext } from '../context/AppContext';
import ArticleCard from '../components/ArticleCard';
import CategoryTiles from '../components/CategoryTiles';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { Article, NewsCategory } from '../types';

const categoryOptions: NewsCategory[] = ['Business', 'Technology', 'Health', 'Sports', 'Entertainment'];

function getRecommendedArticles(articles: Article[], selectedCategories: NewsCategory[], history: Article[], query: string) {
  const historyKeywords = history.map(item => item.title).join(' ').toLowerCase();
  return articles
    .filter(article => article.title && article.url)
    .sort((a, b) => {
      const score = (article: Article) => {
        let match = 0;
        const content = `${article.title} ${article.description ?? ''}`.toLowerCase();
        selectedCategories.forEach(category => {
          if (content.includes(category.toLowerCase())) match += 2;
        });
        if (query && content.includes(query.toLowerCase())) match += 3;
        if (historyKeywords && historyKeywords.split(' ').some(word => word.length > 4 && content.includes(word))) match += 1;
        return match;
      };
      return score(b) - score(a);
    })
    .slice(0, 4);
}

export default function HomePage() {
  const { searchQuery, setSearchQuery, selectedCategories, addHistoryArticle, history, user, updatePreferences } = useAppContext();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const queryText = searchQuery.trim();

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      setError(null);
      try {
        const data = queryText ? await searchNews(queryText, page) : await fetchTopHeadlines(page);
        setArticles(prev => (page === 1 ? data : [...prev, ...data]));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load news');
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [queryText, page]);

  const recommended = useMemo(
    () => getRecommendedArticles(articles, selectedCategories, history, queryText),
    [articles, selectedCategories, history, queryText]
  );

  const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-10">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-700 dark:bg-brand-900/70 dark:text-brand-200">
              Welcome back
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {user?.username}, discover the latest industry insights.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Explore curated news, search across sources, and get personalized recommendations based on your interests.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:w-96">
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Top categories</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCategories.map(cat => (
                  <span key={cat} className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-300/15 dark:text-brand-200">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Trending</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
                {categoryOptions.slice(0, 4).map(category => (
                  <span key={category} className="rounded-2xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={onSearchSubmit} className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search news</span>
            <input
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Search business, AI, healthcare trends..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-900/20"
            />
          </label>
          <button
            type="submit"
            className="rounded-3xl bg-brand-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-brand-700"
          >
            Search
          </button>
        </form>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Personalized recommendations</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Suggested stories based on your interests, search history, and trending categories.</p>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-4">
          {recommended.length > 0 ? (
            recommended.map(article => (
              <ArticleCard key={article.url} article={article} onSelect={addHistoryArticle} />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No recommendations available yet. Start searching or exploring to build your personalized feed.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Latest headlines</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Browse breaking news from trusted sources in real-time.</p>
          </div>
          <button
            type="button"
            onClick={() => setPage(prev => prev + 1)}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Load more
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">{error}</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            {articles.map(article => (
              <ArticleCard key={article.url} article={article} onSelect={addHistoryArticle} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Explore categories</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose favorites to tailor the dashboard to your industry interests.</p>
          </div>
        </div>
        <CategoryTiles
          categories={categoryOptions}
          activeCategories={selectedCategories}
          onToggle={category => {
            const nextSelection = selectedCategories.includes(category)
              ? selectedCategories.filter(item => item !== category)
              : [...selectedCategories, category];
            updatePreferences(nextSelection.length ? nextSelection : [category]);
          }}
        />
      </section>
    </div>
  );
}
