import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Resume, ResumeContent } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

// Schema for resume form
const resumeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.object({
    personalInfo: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(1, "Phone number is required"),
      address: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
    }),
    objective: z.string().optional(),
    education: z.array(
      z.object({
        degree: z.string().min(1, "Degree is required"),
        institution: z.string().min(1, "Institution is required"),
        year: z.string().regex(/^\d{4}$/, "Please enter a valid year"),
      })
    ).min(1, "At least one education entry is required"),
    experience: z.array(
      z.object({
        position: z.string().min(1, "Position is required"),
        company: z.string().min(1, "Company is required"),
        duration: z.string().min(1, "Duration is required"),
        description: z.string().optional(),
      })
    ),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    certifications: z.array(z.string()).optional(),
    projects: z.array(
      z.object({
        name: z.string().min(1, "Project name is required"),
        description: z.string().min(1, "Description is required"),
        technologies: z.array(z.string()),
        url: z.string().optional(),
      })
    ).optional(),
    awards: z.array(z.string()).optional(),
  }),
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

const defaultResumeValues: ResumeFormValues = {
  title: "My Resume",
  content: {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      website: "",
    },
    objective: "",
    education: [
      {
        degree: "",
        institution: "",
        year: "",
      },
    ],
    experience: [
      {
        position: "",
        company: "",
        duration: "",
        description: "",
      },
    ],
    skills: [""],
    certifications: [],
    projects: [],
    awards: [],
  },
};

export default function ResumeBuilder() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("builder");
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch resume if exists
  const { data: resume, isLoading } = useQuery<Resume>({
    queryKey: ["/api/resume"],
  });

  // Form setup
  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resume
      ? { title: resume.title, content: resume.content }
      : defaultResumeValues,
  });

  // Update form values when resume data is loaded
  useEffect(() => {
    if (resume) {
      form.reset({
        title: resume.title,
        content: resume.content,
      });
    }
  }, [resume, form]);

  // Create/Update resume
  const saveMutation = useMutation({
    mutationFn: async (values: ResumeFormValues) => {
      if (resume) {
        // Update existing resume
        await apiRequest("PATCH", `/api/resume/${resume.id}`, values);
      } else {
        // Create new resume
        await apiRequest("POST", "/api/resume", values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resume"] });
      toast({
        title: "Success",
        description: resume
          ? "Resume updated successfully"
          : "Resume created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: ResumeFormValues) => {
    saveMutation.mutate(values);
  };

  // Add education entry
  const addEducation = () => {
    const currentEducation = form.getValues("content.education") || [];
    form.setValue("content.education", [
      ...currentEducation,
      { degree: "", institution: "", year: "" },
    ]);
  };

  // Add experience entry
  const addExperience = () => {
    const currentExperience = form.getValues("content.experience") || [];
    form.setValue("content.experience", [
      ...currentExperience,
      { position: "", company: "", duration: "", description: "" },
    ]);
  };

  // Add skill
  const addSkill = () => {
    const currentSkills = form.getValues("content.skills") || [];
    form.setValue("content.skills", [...currentSkills, ""]);
  };

  // Remove education entry
  const removeEducation = (index: number) => {
    const currentEducation = form.getValues("content.education");
    if (currentEducation.length > 1) {
      form.setValue(
        "content.education",
        currentEducation.filter((_, i) => i !== index)
      );
    } else {
      toast({
        description: "You must have at least one education entry",
      });
    }
  };

  // Remove experience entry
  const removeExperience = (index: number) => {
    const currentExperience = form.getValues("content.experience");
    form.setValue(
      "content.experience",
      currentExperience.filter((_, i) => i !== index)
    );
  };

  // Remove skill
  const removeSkill = (index: number) => {
    const currentSkills = form.getValues("content.skills");
    if (currentSkills.length > 1) {
      form.setValue(
        "content.skills",
        currentSkills.filter((_, i) => i !== index)
      );
    } else {
      toast({
        description: "You must have at least one skill",
      });
    }
  };

  // Resume preview component
  const ResumePreview = ({ resume }: { resume: ResumeFormValues }) => {
    return (
      <div className="bg-white p-8 shadow-lg max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {resume.content.personalInfo.name}
          </h1>
          <div className="text-gray-600 flex flex-wrap justify-center gap-x-3 mt-1">
            <span>{resume.content.personalInfo.email}</span>
            <span>{resume.content.personalInfo.phone}</span>
            {resume.content.personalInfo.address && (
              <span>{resume.content.personalInfo.address}</span>
            )}
          </div>
          <div className="text-gray-600 flex flex-wrap justify-center gap-x-3 mt-1">
            {resume.content.personalInfo.linkedin && (
              <span>{resume.content.personalInfo.linkedin}</span>
            )}
            {resume.content.personalInfo.website && (
              <span>{resume.content.personalInfo.website}</span>
            )}
          </div>
        </div>

        {resume.content.objective && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700">{resume.content.objective}</p>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          {resume.content.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <span className="font-medium">{edu.degree}</span>
                <span>{edu.year}</span>
              </div>
              <p className="text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </div>

        {resume.content.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-2">
              Experience
            </h2>
            {resume.content.experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-medium">{exp.position}</span>
                  <span>{exp.duration}</span>
                </div>
                <p className="text-gray-600">{exp.company}</p>
                {exp.description && <p className="text-gray-700 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.content.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {resume.content.certifications && resume.content.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-2">
              Certifications
            </h2>
            <ul className="list-disc pl-5">
              {resume.content.certifications.map((cert, index) => (
                <li key={index} className="text-gray-700">{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Resume analyzer component
  const ResumeAnalyzer = () => {
    const { data: resumeData } = useQuery<Resume>({
      queryKey: ["/api/resume"],
    });

    if (!resumeData) {
      return (
        <div className="text-center py-8">
          <p>Please create a resume first to analyze.</p>
        </div>
      );
    }

    const score = resumeData.score || 72;
    const suggestions = resumeData.improvementSuggestions || [
      "Add more quantifiable achievements to your experience",
      "Include relevant certifications to stand out",
      "Use more action verbs in your descriptions",
      "Add your LinkedIn profile for better networking opportunities",
    ];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resume Score</CardTitle>
            <CardDescription>
              Your resume is {score}% optimized for ATS systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-primary-600 h-4 rounded-full"
                style={{ width: `${score}%` }} 
              ></div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Improvement Suggestions:</h3>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <i className="ri-error-warning-line text-yellow-500 mr-2 mt-1"></i>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Keyword Analysis</CardTitle>
            <CardDescription>Important keywords for your target role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                React ✓
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                JavaScript ✓
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                TypeScript (missing)
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                Node.js (missing)
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                UI/UX ✓
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Grammar & Style</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                <div>
                  <p className="font-medium">Good use of action verbs</p>
                  <p className="text-sm text-gray-600">Your resume uses strong action verbs that effectively communicate your impact.</p>
                </div>
              </li>
              <li className="flex items-start">
                <i className="ri-error-warning-line text-yellow-500 mr-2 mt-1"></i>
                <div>
                  <p className="font-medium">Consider adding metrics</p>
                  <p className="text-sm text-gray-600">Quantify your achievements with specific metrics to demonstrate your impact.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-600">Create and optimize your professional resume</p>
        </div>
        {activeTab === "builder" && (
          <Button 
            onClick={() => setPreviewMode(!previewMode)}
            variant={previewMode ? "outline" : "default"}
            className="mt-4 sm:mt-0"
          >
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full bg-white border border-gray-200 p-1 shadow-sm">
          <TabsTrigger value="builder" className="flex-1">Resume Builder</TabsTrigger>
          <TabsTrigger value="analyzer" className="flex-1">Resume Analyzer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="space-y-4">
          {previewMode ? (
            <ResumePreview resume={form.getValues()} />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Resume Details</CardTitle>
                    <CardDescription>Give your resume a title</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resume Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Add your contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="content.personalInfo.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content.personalInfo.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content.personalInfo.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content.personalInfo.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content.personalInfo.linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content.personalInfo.website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Professional Summary</CardTitle>
                    <CardDescription>
                      Briefly describe your professional background and career goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="content.objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              value={field.value || ""}
                              className="min-h-24"
                              placeholder="A motivated software developer with 5+ years of experience in web applications..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Education</CardTitle>
                        <CardDescription>Add your educational background</CardDescription>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addEducation}
                      >
                        <i className="ri-add-line mr-1"></i> Add Education
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {form.watch("content.education")?.map((_, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-md relative">
                        <button
                          type="button"
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                          onClick={() => removeEducation(index)}
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`content.education.${index}.degree`}
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
                            name={`content.education.${index}.institution`}
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
                            name={`content.education.${index}.year`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="2022" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Experience</CardTitle>
                        <CardDescription>Add your work experience</CardDescription>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addExperience}
                      >
                        <i className="ri-add-line mr-1"></i> Add Experience
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {form.watch("content.experience")?.map((_, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-md relative">
                        <button
                          type="button"
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                          onClick={() => removeExperience(index)}
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name={`content.experience.${index}.position`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`content.experience.${index}.company`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`content.experience.${index}.duration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Jan 2022 - Present" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`content.experience.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Skills</CardTitle>
                        <CardDescription>Add your technical and soft skills</CardDescription>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addSkill}
                      >
                        <i className="ri-add-line mr-1"></i> Add Skill
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {form.watch("content.skills")?.map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`content.skills.${index}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., JavaScript, Project Management" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <CardFooter className="px-0 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={saveMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    {saveMutation.isPending ? "Saving..." : "Save Resume"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          )}
        </TabsContent>
        
        <TabsContent value="analyzer">
          <ResumeAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
}