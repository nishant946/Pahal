import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHomework } from "@/contexts/homeworkContext";

export function HomeworkSummary() {
  const { getRecentHomework } = useHomework();
  const recentHomework = getRecentHomework();
  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold">
        Today's Homework Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {recentHomework.map((hw) => (
          <Card key={hw.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                <span className="text-base font-semibold truncate">
                  {hw.subject}
                </span>
                <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-800 rounded whitespace-nowrap w-fit">
                  {hw.group}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {hw.description}
              </p>
              <div className="text-sm text-muted-foreground">
                Due: {new Date(hw.dueDate).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}

        {recentHomework.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground text-sm">
              No homework assigned today
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
