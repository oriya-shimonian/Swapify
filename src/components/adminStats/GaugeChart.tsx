import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface GaugeChartProps {
  value: number; // אחוז מ־0 עד 100
  title: string;
  color?: string; // hex או טווח Tailwind
}

const GaugeChart = ({ value, title, color = "#34d399" }: GaugeChartProps) => {
  const data = [
    { name: "אחוז אישור", value },
    { name: "שאר", value: 100 - value },
  ];

  return (
    <Card className="px-4 pt-6 border-none shadow-none pb-0">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="h-[200px] w-[200px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
            data={data}
            startAngle={180}
            endAngle={0}
          >
                  
            <RadialBar
            //  @ts-ignore   
              minAngle={15}
              clockWise
              dataKey="value"
              fill={color}
            />
            {/* <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ marginTop: 10 }}
            /> */}
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute text-2xl font-bold text-gray-700">
          {value.toFixed(0)}%
        </div>
      </div>
    </Card>
  );
};

export default GaugeChart;
