import { useLocation } from 'wouter';
import { BookOpen, Home, Search, ArrowLeft } from 'lucide-react';
import { EnhancedSEOHead } from '@/components/ui/enhanced-seo-head';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBD6D3] via-[#EBD6D3] to-[#EBD6D3] flex items-center justify-center px-4">
      <EnhancedSEOHead title="Page not found · Reese Astor" description="This page does not exist." canonical="/404" noindex />
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#EBD6D3] to-[#EBD6D3] rounded-full mb-6">
            <BookOpen className="w-16 h-16 text-[#7A4F4C]" />
          </div>
          <h1 className="text-[#7A4F4C] text-8xl font-bold mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A3B3A] mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-[#6E5F5A] mb-8">
            Oops! This page seems to have wandered off into a steamy romance novel. Let's get you back to the story.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setLocation('/')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4A3B3A] text-[#FAF7F7] rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </button>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FAF7F7] text-[#7A4F4C] border-2 border-[#C9A3A0] rounded-lg font-semibold hover:bg-[#EBD6D3] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-[#FAF7F7] rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-[#4A3B3A] mb-6">
            Popular Pages
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => setLocation('/books')}
              className="p-4 bg-gradient-to-br from-[#EBD6D3] to-[#EBD6D3] rounded-xl hover:shadow-md transition-all text-left"
            >
              <BookOpen className="w-8 h-8 text-[#7A4F4C] mb-2" />
              <h4 className="font-semibold text-[#4A3B3A] mb-1">Books</h4>
              <p className="text-sm text-[#6E5F5A]">Browse all books</p>
            </button>
            <button
              onClick={() => setLocation('/newsletter')}
              className="p-4 bg-gradient-to-br from-[#EBD6D3] to-[#EBD6D3] rounded-xl hover:shadow-md transition-all text-left"
            >
              <Search className="w-8 h-8 text-[#7A4F4C] mb-2" />
              <h4 className="font-semibold text-[#4A3B3A] mb-1">Newsletter</h4>
              <p className="text-sm text-[#6E5F5A]">Free book &amp; release news</p>
            </button>
            <button
              onClick={() => setLocation('/blog')}
              className="p-4 bg-gradient-to-br from-[#EBD6D3] to-[#EBD6D3] rounded-xl hover:shadow-md transition-all text-left"
            >
              <BookOpen className="w-8 h-8 text-[#7A4F4C] mb-2" />
              <h4 className="font-semibold text-[#4A3B3A] mb-1">Blog</h4>
              <p className="text-sm text-[#6E5F5A]">Writing tips & news</p>
            </button>
          </div>
        </div>

        {/* Fun Quote */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#EBD6D3] to-[#EBD6D3] rounded-xl">
          <p className="text-[#4A3B3A] italic">
            "Not all who wander are lost... but this page definitely is."
          </p>
          <p className="text-sm text-[#6E5F5A] mt-2">— Reese Astor</p>
        </div>
      </div>
    </div>
  );
}
