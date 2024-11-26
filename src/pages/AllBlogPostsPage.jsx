import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '@/services/blogService';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AllBlogPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await blogService.getAllPosts();
        setPosts(allPosts);
        
        // Extract unique categories from posts
        const uniqueCategories = [...new Set(allPosts.map(post => post.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 max-w-3xl">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full mb-6" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="mt-20">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">All Blog Posts</h1>
      
      {/* Sticky Category Filter with Horizontal Scroll */}
      <div className="sticky top-0 -mx-4 px-4 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-8 border-b border-gray-200 dark:border-gray-800 min-w-max pb-[1px]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`relative pb-2 text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              All
              {selectedCategory === 'all' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-riptide-500" />
              )}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative pb-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-riptide-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts list with top margin to account for sticky header */}
      <div className="space-y-6 mt-4">
        {filteredPosts.map((post) => (
          <Link 
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group block"
          >
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 transition-colors hover:border-riptide-500 dark:hover:border-riptide-500">
              <Badge variant="outline" className="w-fit mb-4">
                {post.category}
              </Badge>
              <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-400 mb-3">
                {post.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                {post.excerpt || post.content.substring(0, 150)}...
              </p>
              <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
                <span className="text-sm">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">{post.like_count || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {post.comment_count || 0} {(post.comment_count || 0) === 1 ? 'comment' : 'comments'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllBlogPostsPage; 