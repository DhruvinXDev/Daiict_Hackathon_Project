import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.string().regex(/^\d{4}$/, "Please enter a valid year")
});

const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional()
});

const profileFormSchema = z.object({
  education: z.array(educationSchema).optional(),
  skills: z.array(z.string()).optional(),
  careerGoals: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  experience: z.array(experienceSchema).optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileSummary() {
  const { user } = useAuth();
  const { profile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      education: profile?.education || [],
      skills: profile?.skills || [],
      careerGoals: profile?.careerGoals || [],
      achievements: profile?.achievements || [],
      experience: profile?.experience || []
    }
  });
  
  const updateProfile = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const response = await apiRequest("PATCH", "/api/profile", values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (values: ProfileFormValues) => {
    updateProfile.mutate(values);
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          </div>
          <div className="md:w-2/3 md:pl-6 md:border-l md:border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="text-sm"
            >
              Cancel
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-2">Education</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="education.0.degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="education.0.institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="education.0.year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Career Goals</h3>
                <FormField
                  control={form.control}
                  name="careerGoals.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Full Stack Developer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Skills</h3>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="skills.0"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="e.g., JavaScript" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skills.1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="e.g., React" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skills.2"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="e.g., UI/UX Design" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Experience</h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="experience.0.position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Frontend Intern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience.0.company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., TechCorp" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience.0.duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 3 months" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience.0.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe your responsibilities and achievements" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Profile Summary</h2>
          <Button 
            variant="ghost" 
            onClick={() => setIsEditing(true)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            <i className="ri-edit-line mr-1"></i> Edit Profile
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="flex md:w-1/3 mb-4 md:mb-0">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-primary-700">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-secondary-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-500 text-sm">
                {profile?.education?.[0]?.degree || "Computer Science Student"}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${profile?.completionPercentage || 45}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {profile?.completionPercentage || 45}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 md:pl-6 md:border-l md:border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Education</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {profile?.education?.[0]?.degree}, {profile?.education?.[0]?.institution}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Career Goal</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {profile?.careerGoals?.[0] || "Full Stack Developer"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Top Skills</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {profile?.skills?.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!profile?.skills || profile.skills.length === 0) && (
                    <>
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">JavaScript</span>
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">React</span>
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">UI/UX Design</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {profile?.experience?.[0] 
                    ? `${profile.experience[0].position} at ${profile.experience[0].company} (${profile.experience[0].duration})`
                    : "Frontend Intern at TechCorp (3 months)"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
