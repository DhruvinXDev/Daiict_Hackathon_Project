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
      <div className="bg-card rounded-lg shadow-sm border border-border mb-6 p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/4 mb-6"></div>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <div className="w-20 h-20 bg-muted rounded-full mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
          </div>
          <div className="md:w-2/3 md:pl-6 md:border-l md:border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
              <div>
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isEditing) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-foreground">Edit Profile</h2>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="text-sm border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-2 text-foreground">Education</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="education.0.degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Degree</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-border bg-background text-foreground" />
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
                          <FormLabel className="text-foreground">Institution</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-border bg-background text-foreground" />
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
                          <FormLabel className="text-foreground">Year</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-border bg-background text-foreground" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2 text-foreground">Career Goals</h3>
                <FormField
                  control={form.control}
                  name="careerGoals.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Full Stack Developer" className="border-border bg-background text-foreground" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2 text-foreground">Skills</h3>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="skills.0"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="e.g., JavaScript" className="border-border bg-background text-foreground" />
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
                          <Input {...field} placeholder="e.g., React" className="border-border bg-background text-foreground" />
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
                          <Input {...field} placeholder="e.g., UI/UX Design" className="border-border bg-background text-foreground" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2 text-foreground">Experience</h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="experience.0.position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Position</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Frontend Intern" className="border-border bg-background text-foreground" />
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
                        <FormLabel className="text-foreground">Company</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., TechCorp" className="border-border bg-background text-foreground" />
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
                        <FormLabel className="text-foreground">Duration</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 3 months" className="border-border bg-background text-foreground" />
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
                        <FormLabel className="text-foreground">Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe your responsibilities and achievements" className="border-border bg-background text-foreground" />
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
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
    <div className="bg-card rounded-lg shadow-sm border border-border mb-6 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-foreground">Profile Summary</h2>
          <Button 
            variant="ghost" 
            onClick={() => setIsEditing(true)}
            className="text-primary hover:text-primary/80 text-sm font-medium hover:bg-primary/10"
          >
            <i className="ri-edit-line mr-1"></i> Edit Profile
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="flex md:w-1/3 mb-4 md:mb-0">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <span className="text-xl font-semibold text-primary dark:text-blue-400">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-secondary rounded-full border-2 border-card dark:border-slate-800"></div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-muted-foreground dark:text-slate-300 text-sm">
                {profile?.education?.[0]?.degree || "Computer Science Student"}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-full bg-muted dark:bg-slate-700 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${profile?.completionPercentage || 45}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground dark:text-slate-400 ml-2">
                  {profile?.completionPercentage || 45}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 md:pl-6 md:border-l md:border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground dark:text-slate-300">Education</h4>
                <p className="mt-1 text-sm text-foreground">
                  {profile?.education?.[0]?.degree}, {profile?.education?.[0]?.institution}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground dark:text-slate-300">Career Goal</h4>
                <p className="mt-1 text-sm text-foreground">
                  {profile?.careerGoals?.[0] || "Full Stack Developer"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground dark:text-slate-300">Top Skills</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {profile?.skills?.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!profile?.skills || profile.skills.length === 0) && (
                    <>
                      <span className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 text-xs rounded-full">JavaScript</span>
                      <span className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 text-xs rounded-full">React</span>
                      <span className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 text-xs rounded-full">UI/UX Design</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground dark:text-slate-300">Experience</h4>
                <p className="mt-1 text-sm text-foreground">
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
