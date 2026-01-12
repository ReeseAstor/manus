import { trpc } from '@/lib/trpc';
import { Mail, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { Link, useRoute } from 'wouter';

/**
 * Newsletter Detail Page
 * 
 * Displays full content of a single newsletter from the archive.
 * URL: /newsletter-archive/:id
 */
export default function NewsletterDetail() {
  const [, params] = useRoute('/newsletter-archive/:id');
  const newsletterId = params?.id ? parseInt(params.id) : 0;

  const { data: newsletter, isLoading } = trpc.newsletters.getById.useQuery({ id: newsletterId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
          <p className="text-gray-600">Loading newsletter...</p>
        </div>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Newsletter Not Found</h2>
          <p className="text-gray-600 mb-6">
            This newsletter may have been removed or the link is incorrect.
          </p>
          <Link href="/newsletter-archive">
            <a className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition">
              <ArrowLeft className="w-5 h-5" />
              Back to Archive
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const sentDate = new Date(newsletter.sentAt || newsletter.createdAt);
  const formattedDate = sentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsletter.subject,
          text: newsletter.preheader || '',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <Link href="/newsletter-archive">
            <a className="inline-flex items-center gap-2 text-pink-100 hover:text-white transition mb-6">
              <ArrowLeft className="w-5 h-5" />
              Back to Archive
            </a>
          </Link>

          {/* Date */}
          <div className="flex items-center gap-2 text-pink-100 mb-4">
            <Calendar className="w-5 h-5" />
            {formattedDate}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{newsletter.subject}</h1>

          {/* Preview Text */}
          {newsletter.preheader && (
            <p className="text-xl text-pink-100">{newsletter.preheader}</p>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="mt-6 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Newsletter Content */}
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:text-gray-700 prose-ol:text-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-pink-500 prose-blockquote:pl-4 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: newsletter.content || '' }}
          />

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <p>© {new Date().getFullYear()} Reese Astor. All rights reserved.</p>
              </div>
              <Link href="/newsletter">
                <a className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition">
                  <Mail className="w-5 h-5" />
                  Subscribe to Newsletter
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Newsletters */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">More from the Archive</h2>
        <div className="text-center">
          <Link href="/newsletter-archive">
            <a className="inline-flex items-center gap-2 text-pink-600 font-semibold hover:text-pink-700 transition">
              Browse All Newsletters
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
