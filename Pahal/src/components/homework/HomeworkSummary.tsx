import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHomework } from "@/contexts/homeworkContext";

export function HomeworkSummary() {
  const { getRecentHomework } = useHomework();
  const recentHomework = getRecentHomework();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Today's Homework Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentHomework.map(hw => (
          <Card key={hw.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{hw.subject}</span>
                <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {hw.group}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">{hw.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Due: {new Date(hw.dueDate).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}

        {recentHomework.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center py-4">
            No homework assigned today
          </p>
        )}
      </div>
    </div>
  );
}