import Link from 'next/link';
import axiosInstance from '../lib/axios';

export const metadata = {
  title: 'Tin tức & Sự kiện — AQTech',
  description: 'Tin tức và sự kiện mới nhất từ AQTech.',
};

interface Article {
  id: number;
  title: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  category: string | null;
  tags: string[] | null;
  created_at: string;
  author_username: string;
}

type SearchParamValue = string | string[] | undefined;

async function getPublishedArticles(): Promise<Article[]> {
  try {
    const res = await axiosInstance.get('/articles', { params: { limit: 50 } });
    return res.data.articles ?? [];
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function DotGrid({ id = 'newsDots' }: { id?: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
      <defs>
        <pattern id={id} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  return (
    <Link
      href={`/articles/${article.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
    >
      {article.thumbnail_url ? (
        <img
          src={
            article.thumbnail_url.startsWith('/uploads')
              ? `${backendUrl}${article.thumbnail_url}`
              : article.thumbnail_url
          }
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <span className="text-blue-400 text-4xl">📰</span>
        </div>
      )}
      <div className="p-6">
        {article.category && (
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            {article.category}
          </span>
        )}
        <h3 className="mt-1 text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 text-gray-500 text-sm line-clamp-3">{article.excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <span>By {article.author_username}</span>
          <span>·</span>
          <span>{formatDate(article.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-lg">Chưa có bài viết {label} nào. Hãy quay lại sau!</p>
    </div>
  );
}

function getPageNumber(value: SearchParamValue, totalPages: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? '1', 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, totalPages);
}

function paginateArticles(articles: Article[], page: number, perPage: number) {
  const start = (page - 1) * perPage;
  return articles.slice(start, start + perPage);
}

function PaginationTabs({
  totalPages,
  currentPage,
  buildHref,
  accentFrom = 'from-blue-500',
  accentTo = 'to-cyan-400',
}: {
  totalPages: number;
  currentPage: number;
  buildHref: (page: number) => string;
  accentFrom?: string;
  accentTo?: string;
}) {
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const chevronLeft = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
  const chevronRight = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );

  return (
    <div className="mt-12 flex items-center justify-center">
      <nav className="inline-flex items-center gap-1.5 rounded-full bg-gray-100/80 backdrop-blur-sm border border-gray-200/60 p-1.5 shadow-sm">
        {/* Prev arrow */}
        {hasPrev ? (
          <Link
            href={buildHref(currentPage - 1)}
            aria-label="Previous page"
            className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white transition-all duration-200"
          >
            {chevronLeft}
          </Link>
        ) : (
          <span className="flex items-center justify-center w-9 h-9 rounded-full text-gray-300 cursor-not-allowed">
            {chevronLeft}
          </span>
        )}

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
          const active = page === currentPage;
          return (
            <Link
              key={page}
              href={buildHref(page)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex items-center justify-center min-w-9 h-9 px-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                active
                  ? `bg-gradient-to-r ${accentFrom} ${accentTo} text-white shadow-md shadow-blue-500/25`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              {page}
            </Link>
          );
        })}

        {/* Next arrow */}
        {hasNext ? (
          <Link
            href={buildHref(currentPage + 1)}
            aria-label="Next page"
            className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white transition-all duration-200"
          >
            {chevronRight}
          </Link>
        ) : (
          <span className="flex items-center justify-center w-9 h-9 rounded-full text-gray-300 cursor-not-allowed">
            {chevronRight}
          </span>
        )}
      </nav>
    </div>
  );
}

export default async function NewsEventsPage({
  searchParams,
}: {
  searchParams?: Promise<{ eventPage?: SearchParamValue; educationPage?: SearchParamValue }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const articles = await getPublishedArticles();
  const perCategoryPageSize = 6;

  const normalizeCategory = (category: string | null) => category?.trim().toLowerCase();

  const allEventArticles = articles.filter(
    (a) => normalizeCategory(a.category) === 'event',
  );
  const allEducationArticles = articles.filter(
    (a) => normalizeCategory(a.category) === 'education',
  );

  const eventTotalPages = Math.max(1, Math.ceil(allEventArticles.length / perCategoryPageSize));
  const educationTotalPages = Math.max(1, Math.ceil(allEducationArticles.length / perCategoryPageSize));

  const eventCurrentPage = getPageNumber(resolvedSearchParams.eventPage, eventTotalPages);
  const educationCurrentPage = getPageNumber(resolvedSearchParams.educationPage, educationTotalPages);

  const eventArticles = paginateArticles(allEventArticles, eventCurrentPage, perCategoryPageSize);
  const educationArticles = paginateArticles(allEducationArticles, educationCurrentPage, perCategoryPageSize);

  const buildEventPageHref = (page: number) =>
    `/news-events?eventPage=${page}&educationPage=${educationCurrentPage}#sukientuaqtech`;

  const buildEducationPageHref = (page: number) =>
    `/news-events?eventPage=${eventCurrentPage}&educationPage=${page}#thongtinchuyennganh`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2a5e] py-24 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400 rounded-full blur-[140px]" />
        </div>
        <DotGrid id="heroDots" />

        <div className="page-hero-inner relative z-10">
          <div className="page-hero-badge">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="page-hero-badge-text">Tin tức & Sự kiện</span>
          </div>
          <h1 className="page-hero-title">
            Tin tức &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Sự kiện
            </span>
          </h1>
          <p className="page-hero-desc">
            Cập nhật những tin tức mới nhất về sự kiện và giáo dục từ AQTech — đồng hành cùng bạn trên hành trình chuyển đổi số.
          </p>
        </div>
      </section>

      {/* ── Events Section ──────────────────────────────── */}
      <section id="sukientuaqtech" className="max-w-[1720px] mx-auto px-6 py-20">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Sự kiện
            </h2>
          </div>
          <div className="mt-3 w-20 h-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-400" />
          <p className="mt-4 text-gray-500 max-w-xl">
            Các sự kiện nổi bật và hoạt động mới nhất từ AQTech
          </p>
        </div>

        {eventArticles.length === 0 ? (
          <EmptyState label="Event" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <PaginationTabs
              totalPages={eventTotalPages}
              currentPage={eventCurrentPage}
              buildHref={buildEventPageHref}
              accentFrom="from-violet-500"
              accentTo="to-purple-400"
            />
          </>
        )}
      </section>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="max-w-[1720px] mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* ── Education Section ───────────────────────────── */}
      <section id="thongtinchuyennganh" className="max-w-[1720px] mx-auto px-6 py-20">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Giáo dục
            </h2>
          </div>
          <div className="mt-3 w-20 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
          <p className="mt-4 text-gray-500 max-w-xl">
            Kiến thức, hướng dẫn và tài liệu giáo dục từ AQTech
          </p>
        </div>

        {educationArticles.length === 0 ? (
          <EmptyState label="Education" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {educationArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <PaginationTabs
              totalPages={educationTotalPages}
              currentPage={educationCurrentPage}
              buildHref={buildEducationPageHref}
              accentFrom="from-emerald-500"
              accentTo="to-teal-400"
            />
          </>
        )}
      </section>
    </main>
  );
}
