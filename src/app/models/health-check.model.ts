export interface HealthCheckEntry {
  data: any;
  duration: string;
  status: string;
  tags: string[];
}

export interface HealthCheckResponse {
  status: string;
  totalDuration: string;
  entries: {
    [key: string]: HealthCheckEntry;
  };
}