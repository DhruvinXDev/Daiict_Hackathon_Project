import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Resume {
  id: number;
  userId: number;
  title: string;
  content: any;
  createdAt: string;
  updatedAt: string;
  score: number;
  improvementSuggestions: string[];
}

export default function ResumeSection() {
  const { data: resume, isLoading, error } = useQuery<Resume>({
    queryKey: ["/api/resume"],
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return `${diffDays} days ago`;
    }
  };
  
  // Default improvement suggestions
  const defaultSuggestions = [
    "Add more quantifiable achievements to your experience",
    "Include relevant certifications to stand out"
  ];
  
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center">
            <Skeleton className="w-32 h-40 mb-4" />
            <Skeleton className="h-4 w-40 mb-4" />
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Resume Builder</h2>
        <Link href="/resume-builder">
          <Button variant="link" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Edit Resume
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Current Resume</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
              {resume?.score || 72}% Optimized
            </span>
          </div>
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="w-32 h-40 border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center mb-4">
            <div className="text-center">
              <i className="ri-file-text-line text-4xl text-gray-400"></i>
              <p className="text-xs text-gray-500 mt-2">
                {resume?.title || "My-Resume.pdf"}
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-700">
              Last updated: {resume ? formatDate(resume.updatedAt) : "3 days ago"}
            </p>
            <div className="mt-4 flex space-x-3">
              <Button variant="outline" size="sm" className="flex items-center">
                <i className="ri-download-line mr-1"></i> Download
              </Button>
              <Link href="/resume-builder">
                <Button size="sm" className="flex items-center">
                  <i className="ri-edit-line mr-1"></i> Update
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700">Improvement Suggestions:</h4>
          <ul className="mt-2 space-y-2">
            {(resume?.improvementSuggestions?.length ? resume.improvementSuggestions : defaultSuggestions)
              .map((suggestion, index) => (
                <li key={index} className="flex items-center text-xs text-gray-600">
                  <i className="ri-error-warning-line text-yellow-500 mr-2"></i>
                  {suggestion}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
