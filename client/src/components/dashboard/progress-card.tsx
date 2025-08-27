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
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-xl font-bold text-foreground">{value}%</h3>
          </div>
          <div className={cn("p-2 rounded-lg", bgColor)}>
            <i className={cn(icon, "text-xl", iconColor)}></i>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div 
            className={cn("h-2.5 rounded-full transition-all duration-300", iconColor.replace("text-", "bg-"))} 
            style={{ width: `${value}%` }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
