import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { sampleChartData, getChartDataForPeriod } from "@/data/dashboardSampleData";
import type { ChartDataPoint } from "@/data/dashboardSampleData";
import { Skeleton } from "@/components/ui/skeleton";

type TimePeriod = "daily" | "weekly" | "monthly" | "yearly";

const chartConfig = {
  generations: {
    label: "Generations",
    color: "hsl(142.1, 76.2%, 36.3%)", // Green
  },
  customers: {
    label: "Customers",
    color: "hsl(221.2, 83.2%, 53.3%)", // Blue
  },
  stores: {
    label: "Stores",
    color: "hsl(24.6, 95%, 53.1%)", // Orange
  },
};

const timePeriodOptions: { value: TimePeriod; label: string; description: string }[] = [
  { value: "daily", label: "Daily", description: "View daily statistics" },
  { value: "weekly", label: "Weekly", description: "View weekly statistics" },
  { value: "monthly", label: "Monthly", description: "View monthly statistics" },
  { value: "yearly", label: "Yearly", description: "View yearly statistics" },
];

export const StatisticsChart = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("daily");
  const [isLoading] = useState(false);

  // Get chart data based on selected period
  const chartData = getChartDataForPeriod(timePeriod);


  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[450px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl sm:text-2xl font-semibold">Statistics</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Analyze your data across different time periods
              </CardDescription>
            </div>
            <div className="flex items-center justify-end">
              <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
                <SelectTrigger className="w-full sm:w-[200px] h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timePeriodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="font-medium text-sm">{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barCategoryGap="15%"
              barGap={2}
            >
              <defs>
                <linearGradient id="colorStores" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(24.6, 95%, 53.1%)" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(24.6, 95%, 53.1%)" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(221.2, 83.2%, 53.3%)" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(221.2, 83.2%, 53.3%)" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="colorGenerations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142.1, 76.2%, 36.3%)" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(142.1, 76.2%, 36.3%)" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
                tickLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={1}
                tickMargin={8}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
                tickLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                domain={[0, 25]}
                tickMargin={8}
                width={50}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
                tickLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                domain={[0, 70]}
                tickMargin={8}
                width={50}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  
                  const data = payload[0].payload as ChartDataPoint;
                  return (
                    <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
                      <div className="font-semibold text-sm mb-2 text-foreground">{data.date}</div>
                      <div className="space-y-2">
                        {payload.map((entry, index) => {
                          const config = chartConfig[entry.dataKey as keyof typeof chartConfig];
                          return (
                            <div key={index} className="flex items-center justify-between gap-4 min-w-[140px]">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: config.color }}
                                />
                              <span className="text-xs text-muted-foreground font-medium">
                                {config.label}
                              </span>
                            </div>
                            <span className="font-semibold text-sm text-foreground">
                              {Math.round(entry.value as number).toLocaleString()}
                            </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="stores"
                fill="url(#colorStores)"
                radius={[6, 6, 0, 0]}
                name="stores"
              />
              <Bar
                yAxisId="left"
                dataKey="customers"
                fill="url(#colorCustomers)"
                radius={[6, 6, 0, 0]}
                name="customers"
              />
              <Bar
                yAxisId="right"
                dataKey="generations"
                fill="url(#colorGenerations)"
                radius={[6, 6, 0, 0]}
                name="generations"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
