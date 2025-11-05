import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StreakHeatmapProps {
  activityData: { date: string; count: number }[];
  onMonthChange?: (month: number, year: number) => void;
  initialMonth?: number;
  initialYear?: number;
}

export const StreakHeatmap = ({
  activityData,
  onMonthChange,
  initialMonth,
  initialYear,
}: StreakHeatmapProps) => {
  const [currentDate, setCurrentDate] = useState(() => {
    if (initialMonth !== undefined && initialYear !== undefined) {
      return new Date(initialYear, initialMonth, 1);
    }
    return new Date();
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getActivityLevel = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count < 3) return 'bg-green-200 border-green-400';
    if (count < 6) return 'bg-green-300 border-green-500';
    if (count < 9) return 'bg-green-400 border-green-600';
    return 'bg-green-500 border-green-700';
  };

  const generateMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Generate calendar grid
    const calendar = [];
    let week = [];

    // Fill in empty slots before the first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      week.push(null);
    }

    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      // Use local date string to avoid timezone issues
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;
      const activity = activityData.find((a) => a.date === dateStr);
      const count = activity ? activity.count : 0;

      week.push({ date, count, day });

      // If week is complete, add to calendar and start new week
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Fill remaining slots in the last week
    while (week.length > 0 && week.length < 7) {
      week.push(null);
    }

    if (week.length > 0) {
      calendar.push(week);
    }

    return calendar;
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getMonth(), newDate.getFullYear());
  };

  const goToNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getMonth(), newDate.getFullYear());
  };

  const goToToday = () => {
    const newDate = new Date();
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getMonth(), newDate.getFullYear());
  };

  const handleMonthChange = (value: string) => {
    const monthIndex = parseInt(value);
    const newDate = new Date(currentDate.getFullYear(), monthIndex, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getMonth(), newDate.getFullYear());
  };

  const handleYearChange = (value: string) => {
    const year = parseInt(value);
    const newDate = new Date(year, currentDate.getMonth(), 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getMonth(), newDate.getFullYear());
  };

  // Generate year options (last 5 years to next 2 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

  const calendar = generateMonthCalendar();
  const today = new Date();
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  // Calculate monthly stats
  const monthlyStats = calendar.flat().reduce(
    (acc, day) => {
      if (day) {
        acc.totalActivities += day.count;
        if (day.count > 0) acc.activeDays += 1;
      }
      return acc;
    },
    { totalActivities: 0, activeDays: 0 }
  );

  const daysInMonth = calendar.flat().filter((day) => day !== null).length;

  return (
    <Card className="brutal-border brutal-shadow">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Activity Calendar
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Select
                value={currentDate.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-[130px] h-9 brutal-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentDate.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-[100px] h-9 brutal-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {!isCurrentMonth && (
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="h-9"
              >
                Today
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Monthly Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg brutal-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {monthlyStats.activeDays}
            </p>
            <p className="text-xs text-muted-foreground">Active Days</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {monthlyStats.totalActivities}
            </p>
            <p className="text-xs text-muted-foreground">Total Activities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {daysInMonth > 0
                ? Math.round((monthlyStats.activeDays / daysInMonth) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
          </div>
        </div>

        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {days.map((day) => (
              <div
                key={day}
                className="text-xs font-semibold text-center text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-2">
            {calendar.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-cols-7 gap-2">
                {week.map((day, dayIdx) => {
                  if (!day) {
                    return <div key={`empty-${dayIdx}`} className="h-12" />;
                  }

                  const isToday =
                    day.date.getDate() === today.getDate() &&
                    day.date.getMonth() === today.getMonth() &&
                    day.date.getFullYear() === today.getFullYear();

                  return (
                    <div
                      key={dayIdx}
                      className={`
                        h-12 brutal-border ${getActivityLevel(day.count)}
                        hover:scale-105 transition-transform cursor-pointer
                        flex flex-col items-center justify-center
                        relative
                        ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                      `}
                      title={`${day.date.toLocaleDateString()}: ${day.count} ${
                        day.count === 1 ? 'activity' : 'activities'
                      }`}
                    >
                      <span className="text-xs font-semibold">{day.day}</span>
                      {day.count > 0 && (
                        <span className="text-[10px] font-bold text-green-800">
                          {day.count}
                        </span>
                      )}
                      {isToday && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
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
