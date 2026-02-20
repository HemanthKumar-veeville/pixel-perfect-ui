// Sample data for dashboard - matching the actual project pages
// This data represents: Customers, Generations, Stores, Credits

export interface DashboardStats {
  totalStores: number;
  totalCustomers: number;
  totalGenerations: number;
  completedGenerations: number;
  changes: {
    stores: number;
    customers: number;
    generations: number;
  };
}

export interface ChartDataPoint {
  date: string;
  stores: number;
  customers: number;
  generations: number;
}

export const sampleDashboardStats: DashboardStats = {
  totalStores: 12,
  totalCustomers: 156,
  totalGenerations: 1247,
  completedGenerations: 1123,
  changes: {
    stores: 2,
    customers: 12,
    generations: 89,
  },
};

// Sample chart data showing stores, customers, and generations over time
// This represents data from Stores, Customers, and Generations pages
export const sampleChartData: ChartDataPoint[] = [
  { date: "22 JAN", stores: 8, customers: 12, generations: 45 },
  { date: "23 JAN", stores: 9, customers: 15, generations: 52 },
  { date: "24 JAN", stores: 8, customers: 13, generations: 38 },
  { date: "25 JAN", stores: 10, customers: 18, generations: 67 },
  { date: "26 JAN", stores: 9, customers: 16, generations: 58 },
  { date: "27 JAN", stores: 8, customers: 14, generations: 42 },
  { date: "28 JAN", stores: 10, customers: 17, generations: 61 },
  { date: "29 JAN", stores: 9, customers: 15, generations: 49 },
  { date: "30 JAN", stores: 8, customers: 13, generations: 44 },
  { date: "31 JAN", stores: 10, customers: 16, generations: 55 },
  { date: "01 FEB", stores: 11, customers: 19, generations: 63 },
  { date: "02 FEB", stores: 9, customers: 15, generations: 51 },
  { date: "03 FEB", stores: 11, customers: 20, generations: 68 },
  { date: "04 FEB", stores: 10, customers: 18, generations: 59 },
  { date: "05 FEB", stores: 9, customers: 14, generations: 46 },
  { date: "06 FEB", stores: 10, customers: 17, generations: 53 },
  { date: "07 FEB", stores: 11, customers: 19, generations: 62 },
  { date: "08 FEB", stores: 9, customers: 15, generations: 48 },
  { date: "09 FEB", stores: 10, customers: 18, generations: 57 },
  { date: "10 FEB", stores: 8, customers: 13, generations: 43 },
  { date: "11 FEB", stores: 10, customers: 16, generations: 54 },
  { date: "12 FEB", stores: 11, customers: 20, generations: 66 },
  { date: "13 FEB", stores: 9, customers: 15, generations: 50 },
  { date: "14 FEB", stores: 11, customers: 19, generations: 64 },
  { date: "15 FEB", stores: 9, customers: 14, generations: 47 },
  { date: "16 FEB", stores: 10, customers: 17, generations: 56 },
  { date: "17 FEB", stores: 10, customers: 18, generations: 60 },
  { date: "18 FEB", stores: 8, customers: 13, generations: 41 },
  { date: "19 FEB", stores: 10, customers: 16, generations: 52 },
];

// Helper to get chart data for different time periods
export const getChartDataForPeriod = (period: "daily" | "weekly" | "monthly" | "yearly"): ChartDataPoint[] => {
  if (period === "daily") {
    return sampleChartData;
  }
  
  // For other periods, aggregate the daily data
  // This is a simplified version - in production, you'd aggregate based on the actual period
  return sampleChartData;
};
