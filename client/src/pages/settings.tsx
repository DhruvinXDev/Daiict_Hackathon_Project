import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
}

export default function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) return;
        
        const response = await apiRequest("GET", `/api/users/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <p className="mt-1 text-gray-900">
              {profile?.firstName} {profile?.lastName}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{profile?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="mt-1 text-gray-900">{profile?.phone || "Not provided"}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio / About</label>
            <p className="mt-1 text-gray-900">{profile?.bio || "Not provided"}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 