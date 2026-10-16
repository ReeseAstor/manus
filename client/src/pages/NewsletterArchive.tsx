import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Mail, Calendar, Search, Filter, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'wouter';

/**
 * Newsletter Archive Page
 * 
 * Displays all past newsletters for subscribers to browse and read.
 * Features search, filtering by date, and newsletter preview cards.
 * URL: /newsletter-archive
 */
export default function NewsletterArchive() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const { data: newsletters, isLoading } = trpc.newsletters.getAll.useQuery();

  // Filter newsletters based on search and year
  const filteredNewsletters = newsletters?.filter((newsletter) => {
    const matchesSearch = 
      newsletter.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (newsletter.preheader?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const newsletterYear = new Date(newsletter.sentAt || newsletter.createdAt).getFullYear().toString();
    const matchesYear = selectedYear === 'all' || newsletterYear === selectedYear;

    return matchesSearch && matchesYear;
  }) || [];

  // Get unique years for filter
  const years = Array.from(
    new Set(
      newsletters?.map((n) => 
        new Date(n.sentAt || n.createdAt).getFullYear().toString()
      ) || []
    )
  ).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-bold">Newsletter Archive</h1>
          </div>
          <p className="text-xl text-pink-100 max-w-2xl">
            Browse past newsletters and catch up on writing updates, and romance book recommendations
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                aria-label="Search newsletters"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search newsletters..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition bg-white text-gray-900 placeholder:text-gray-500"
              />
            </div>

            {/* Year Filter */}
            <div className="relative md:w-48">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                aria-label="Filter by year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition appearance-none bg-white text-gray-900 cursor-pointer"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {isLoading ? (
              'Loading newsletters...'
            ) : (
              `Showing ${filteredNewsletters.length} of ${newsletters?.length || 0} newsletters`
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading newsletters...</p>
          </div>
        ) : filteredNewsletters.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No newsletters found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedYear !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Check back soon for new newsletters!'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNewsletters.map((newsletter) => (
              <NewsletterCard key={newsletter.id} newsletter={newsletter} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't Miss Future Newsletters!
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Subscribe now to get writing updates, and romance recommendations delivered to your inbox
          </p>
          <Link href="/newsletter">
            <a className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-pink-50 transition shadow-lg">
              Subscribe to Newsletter
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Newsletter Card Component
 * Displays individual newsletter preview with link to full content
 */
interface Newsletter {
  id: number;
  subject: string;
  preheader?: string | null;
  content: string;
  status: string;
  sentAt?: Date | null;
  createdAt: Date;
}

function NewsletterCard({ newsletter }: { newsletter: Newsletter }) {
  const sentDate = new Date(newsletter.sentAt || newsletter.createdAt);
  const formattedDate = sentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link href={`/newsletter-archive/${newsletter.id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
          <div className="flex items-center gap-2 text-sm text-pink-100 mb-2">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
          <h3 className="text-xl font-bold line-clamp-2">{newsletter.subject}</h3>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {newsletter.preheader && (
            <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
              {newsletter.preheader}
            </p>
          )}

          {/* Read More Link */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              {newsletter.status === 'sent' ? 'Sent' : 'Draft'}
            </span>
            <span className="text-pink-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Read Full Newsletter
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
