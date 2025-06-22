import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from "recharts";
import { Card } from "@/components/ui/card";

interface ChartDataItem {
  name: string;
  value: number;
}

interface StatisticsChartProps {
  title: string;
  type: "pie" | "bar" | "line" | "radar" | "area";
  data: ChartDataItem[];
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "#60a5fa", // blue
  "#34d399", // green
  "#fbbf24", // yellow
  "#f87171", // red
  "#a78bfa", // purple
  "#f472b6", // pink
  "#94a3b8", // gray
];

const StatisticsChart = ({
  title,
  type,
  data,
  colors = defaultColors,
  className = "",
}: StatisticsChartProps) => {
  const formattedData = data.map((d) => ({
    name: d.name,
    value: d.value,
  }));

  const chartHeight = 300;

  return (
    <Card className={`p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="h-[300px]">
        {/* @ts-ignore */}
        <ResponsiveContainer width="100%" height={chartHeight}>
          {type === "pie" && (
            <PieChart>
              <Pie
                data={formattedData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={60}
                label
              >
                {formattedData.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}

          {type === "bar" && (
            <BarChart
              data={formattedData}
              layout="vertical"
              margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#60a5fa" />
            </BarChart>
          )}

          {type === "line" && (
            <LineChart
              data={formattedData}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          )}

          {type === "area" && (
            <AreaChart
              data={formattedData}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                fill="#c7d2fe"
                fillOpacity={0.5}
              />
            </AreaChart>
          )}

          {type === "radar" && (
            <RadarChart data={formattedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar
                name="נתונים"
                dataKey="value"
                stroke="#4f46e5"
                fill="#6366f1"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default StatisticsChart;
