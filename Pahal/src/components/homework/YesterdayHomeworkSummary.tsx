import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHomework } from "@/contexts/homeworkContext";

export function YesterdayHomeworkSummary() {
  const { getYesterdayHomework } = useHomework();
  const yesterdayHomework = getYesterdayHomework();
  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold">Yesterday's Homework Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {yesterdayHomework.map(hw => (
          <Card key={hw.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                <span className="text-base font-semibold truncate">{hw.subject}</span>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                    {hw.group}
                  </span>
                  <span className={`text-sm font-normal px-2 py-1 rounded whitespace-nowrap ${
                    hw.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {hw.status}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">{hw.description}</p>
              <div className="text-sm text-gray-500">
                Due: {new Date(hw.dueDate).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}

        {yesterdayHomework.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center py-4">
            No homework was assigned yesterday
          </p>
        )}
      </div>
    </div>
  );
}
