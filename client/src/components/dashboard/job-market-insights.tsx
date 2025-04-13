import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface SkillDemand {
  name: string;
  percentage: number;
}

const topSkills: SkillDemand[] = [
  { name: "React", percentage: 85 },
  { name: "Node.js", percentage: 78 },
  { name: "TypeScript", percentage: 72 },
  { name: "AWS", percentage: 65 }
];

export default function JobMarketInsights() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Job Market Insights</h2>
        <Link href="/job-market">
          <Button variant="link" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-800">Top Skills in Demand</h3>
          <p className="text-xs text-gray-500 mt-1">For Full Stack Developer roles</p>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {topSkills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <span className="text-xs text-gray-500">{skill.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Link href="/job-market">
            <Button 
              variant="ghost" 
              className="w-full text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Analyze Your Skill Gap
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
