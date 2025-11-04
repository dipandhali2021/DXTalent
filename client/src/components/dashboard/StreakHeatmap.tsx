import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface StreakHeatmapProps {
  activityData: { date: string; count: number }[];
}

export const StreakHeatmap = ({ activityData }: StreakHeatmapProps) => {
  // Generate last 12 weeks of data
  const weeks = 12;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getActivityLevel = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count < 3) return 'bg-green-200 border-green-400';
    if (count < 6) return 'bg-green-300 border-green-500';
    if (count < 9) return 'bg-green-400 border-green-600';
    return 'bg-green-500 border-green-700';
  };

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - weeks * 7);

  const generateGrid = () => {
    const grid = [];
    for (let week = 0; week < weeks; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + week * 7 + day);

        const dateStr = currentDate.toISOString().split('T')[0];
        const activity = activityData.find((a) => a.date === dateStr);
        const count = activity ? activity.count : 0;

        weekData.push({ date: currentDate, count });
      }
      grid.push(weekData);
    }
    return grid;
  };

  const grid = generateGrid();

  return (
    <Card className="brutal-border brutal-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Activity Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Day labels */}
          <div className="flex gap-1">
            <div className="w-12"></div>
            {grid[0]?.map((_, i) => (
              <div
                key={i}
                className="text-xs text-muted-foreground text-center"
                style={{ width: '24px' }}
              >
                {days[i].charAt(0)}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1 overflow-x-auto">
            <div className="flex flex-col gap-1">
              {days.map((day, i) => (
                <div
                  key={i}
                  className="text-xs text-muted-foreground text-right pr-2"
                  style={{ height: '24px', lineHeight: '24px', width: '48px' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {grid.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`w-6 h-6 brutal-border ${getActivityLevel(
                      day.count
                    )} hover:scale-110 transition-transform cursor-pointer`}
                    title={`${day.date.toLocaleDateString()}: ${
                      day.count
                    } activities`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <span>Less</span>
            <div className="w-4 h-4 bg-muted brutal-border"></div>
            <div className="w-4 h-4 bg-green-200 border-green-400 brutal-border"></div>
            <div className="w-4 h-4 bg-green-300 border-green-500 brutal-border"></div>
            <div className="w-4 h-4 bg-green-400 border-green-600 brutal-border"></div>
            <div className="w-4 h-4 bg-green-500 border-green-700 brutal-border"></div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
