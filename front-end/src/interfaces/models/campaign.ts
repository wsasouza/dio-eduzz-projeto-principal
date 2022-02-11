export interface ICampaign {
  id: number;
  source_id: number;
  name: string;
  link?: string;
  investment: number;
  revenues?: number;
  beginDate: Date;
  endDate?: Date;
  roi: number;
}
