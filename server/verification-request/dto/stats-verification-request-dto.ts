
interface StatsCount {
  total: number;
  totalThisMonth: number;
  verified: number;
  inAnalysis: number;
  pending: number;
}


interface StatsSourceChannels {
  label: string;
  value: number;
  percentage: number;
}


interface StatsRecentActivity {
  id: string;
  status: string;
  sourceChannel: string;
  data_hash: string;
  timestamp: Date;
}


interface StatsDto {
  statsCount: StatsCount;
  statsSourceChannels: StatsSourceChannels[];
  statsRecentActivity: StatsRecentActivity[];
}

export {
  StatsCount,
  StatsSourceChannels,
  StatsRecentActivity,
  StatsDto,
};
