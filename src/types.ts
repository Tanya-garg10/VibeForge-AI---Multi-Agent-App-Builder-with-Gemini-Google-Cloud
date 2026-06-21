export interface AppRequirements {
  features: string[];
  pages: string[];
  components: string[];
  apis: string[];
  database: string[];
}

export interface MetricItem {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface MockDataSchema {
  primaryEntitySingular: string;
  primaryEntityPlural: string;
  headers: string[];
  items: any[];
  metrics: MetricItem[];
}

export interface GeneratedApp {
  appName: string;
  requirements: AppRequirements;
  uiCode: string;
  backendCode: string;
  dbSchema: string;
  tests: string;
  deployment: string;
  mockDataSchema: MockDataSchema;
}

export interface AgentProgress {
  id: string;
  name: string;
  status: "idle" | "running" | "completed" | "failed";
  progressText: string;
  durationMsEstimate: number;
}
