export type ComparisonValue = "yes" | "no" | "partial" | string;

export type ComparisonRow = {
  feature: string;
  compooss: ComparisonValue;
  compass: ComparisonValue;
  mongoExpress: ComparisonValue;
  studio3t: ComparisonValue;
};
