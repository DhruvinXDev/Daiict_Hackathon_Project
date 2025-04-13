import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  value: number;
  icon: string;
  iconColor: string;
  bgColor: string;
  message: string;
}

export default function ProgressCard({ 
  title, 
  value, 
  icon, 
  iconColor, 
  bgColor,
  message 
}: ProgressCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-xl font-bold text-gray-900">{value}%</h3>
          </div>
          <div className={cn("p-2 rounded-lg", bgColor)}>
            <i className={cn(icon, "text-xl", iconColor)}></i>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={cn("h-2.5 rounded-full", iconColor.replace("text-", "bg-"))} 
            style={{ width: `${value}%` }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-gray-500">{message}</p>
      </div>
    </div>
  );
}
