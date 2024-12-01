import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from "lucide-react";

const ProjectNav = ({ 
  type = 'project', // or 'blog'
  nextItem,
  previousItem 
}) => {
  const baseUrl = type === 'project' ? '/portfolio' : '/blog';

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="bg-black dark:bg-white rounded-2xl shadow-lg flex">
        {previousItem && (
          <Link
            to={`${baseUrl}/${previousItem.slug}`}
            className="flex items-center gap-3 p-4 text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 rounded-l-2xl transition-colors group border-r border-gray-800 dark:border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <div className="flex-1">
              <p className="text-sm font-medium opacity-60 mb-1">Previous {type}</p>
              <p className="font-medium line-clamp-1">{previousItem.title}</p>
            </div>
          </Link>
        )}
        {nextItem && (
          <Link
            to={`${baseUrl}/${nextItem.slug}`}
            className="flex items-center gap-3 p-4 text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 rounded-r-2xl transition-colors group"
          >
            <div className="flex-1">
              <p className="text-sm font-medium opacity-60 mb-1">Next {type}</p>
              <p className="font-medium line-clamp-1">{nextItem.title}</p>
            </div>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProjectNav; 