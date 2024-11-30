import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useParams, Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Contact from "./Contact";
import { portfolioService } from '@/services/portfolioService';
import { ChevronRight } from "lucide-react";

const PortfolioView = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, allProjectsData] = await Promise.all([
          portfolioService.getProjectBySlug(slug),
          portfolioService.getAllProjects()
        ]);
        
        setProject(projectData);
        setAllProjects(allProjectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Filter out the current project from all projects
  const otherProjects = allProjects.filter(p => p.slug !== slug);

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!project) return <div className="flex justify-center items-center min-h-screen">Project not found</div>;

  return (
    <div className="flex flex-col items-start justify-start pt-16 sm:pt-20 pb-8 px-4 max-w-6xl mx-auto">
      <div className="w-full mb-8 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
          <div>
            <Badge variant="outline" className="mb-2">
              {project.tags[0].toUpperCase()}
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl text-gray-900 dark:text-gray-100 font-medium leading-tight mb-3">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              {project.description}
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Task</h3>
              <p className="text-gray-600 dark:text-gray-300">{project.task}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Strategy</h3>
                <p className="text-gray-600 dark:text-gray-300">{project.strategy}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Design</h3>
                <p className="text-gray-600 dark:text-gray-300">{project.design}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Client</h3>
                <p className="text-gray-600 dark:text-gray-300">{project.client}</p>
              </div>
            </div>

            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
            >
              View Project
              <ChevronRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 sm:mt-16">
          <div className="mb-4">
            <img
              src={project.image}
              alt="Project showcase"
              className="w-full h-[300px] sm:h-[500px] object-cover rounded-xl"
              onError={(e) => {
                console.error('Error loading main image:', e);
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery_images && project.gallery_images.map((img, index) => (
              <div 
                key={index}
                className="relative aspect-[4/3] overflow-hidden rounded-xl"
              >
                <img
                  src={img}
                  alt={`Project detail ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.error(`Error loading gallery image ${index + 1}:`, e);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Other Projects Section */}
      <div className="w-full mt-8 sm:mt-12 border-t pt-8 sm:pt-16">
        <div className="mb-8">
          <p className="text-sm font-medium mb-2">EXPLORE MORE</p>
          <h2 className="text-3xl sm:text-5xl font-medium">Other Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((otherProject) => (
            <Link
              key={otherProject.slug}
              to={`/portfolio/${otherProject.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4">
                <img
                  src={otherProject.image}
                  alt={otherProject.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <Badge variant="outline" className="mb-2">
                {otherProject.tags[0].toUpperCase()}
              </Badge>
              <h3 className="text-xl font-medium mb-2">{otherProject.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                {otherProject.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Collaboration Section */}
      <div className="w-full mt-8 sm:mt-12 border-t pt-8 sm:pt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8">
          <div>
            <p className="text-sm font-medium mb-2">LET'S COLLABORATE</p>
            <h2 className="text-3xl sm:text-5xl font-medium">Got a project?</h2>
          </div>
          
          <button
            onClick={() => setIsContactOpen(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
          >
            Contact Me
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </button>
        </div>

        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          I'm a passionate creative and developer who is excited about unique ideas and help companies to{' '}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            create amazing identities and experiences
          </span>{' '}
          by crafting top-notch UI/UX and website design.
        </p>
      </div>

      {/* Contact Form Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <Contact />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioView; 