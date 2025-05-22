import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

function DashboardCard({ title, content }: { title: string; content: string }) {
  const isCompleted = content === "Completed";

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className={cn(
            "p-2 rounded-lg",
            isCompleted ? "bg-green-50" : "bg-yellow-50"
          )}>
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {title}
            </p>
            <p className={cn(
              "text-sm mt-1",
              isCompleted ? "text-green-600" : "text-yellow-600"
            )}>
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;