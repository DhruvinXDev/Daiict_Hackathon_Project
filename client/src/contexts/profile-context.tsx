import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Experience {
  position: string;
  company: string;
  duration: string;
  description: string;
}

export interface Profile {
  id: number;
  userId: number;
  education: Education[];
  skills: string[];
  careerGoals: string[];
  achievements: string[];
  experience: Experience[];
  completionPercentage: number;
}

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
}

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  isLoading: false,
  error: null,
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<Profile>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });
  
  return (
    <ProfileContext.Provider
      value={{
        profile: profile || null,
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
