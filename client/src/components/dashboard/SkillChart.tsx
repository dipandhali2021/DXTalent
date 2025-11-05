import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface SkillData {
  skill: string;
  proficiency: number;
}

interface DailyXP {
  day: string;
  xp: number;
  date?: string;
}

interface SkillChartProps {
  skillData: SkillData[];
  weeklyXP: DailyXP[];
}

export const SkillChart = ({ skillData, weeklyXP }: SkillChartProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart for Skills */}
      <Card className="brutal-border brutal-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Skill Proficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillData}>
              <PolarGrid stroke="#666" />
              <PolarAngleAxis dataKey="skill" className="text-xs" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Proficiency"
                dataKey="proficiency"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
                strokeWidth={3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart for Weekly XP */}
      <Card className="brutal-border brutal-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly XP Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyXP}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '3px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
              />
              <Bar
                dataKey="xp"
                fill="hsl(var(--accent))"
                stroke="hsl(var(--border))"
                strokeWidth={2}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
