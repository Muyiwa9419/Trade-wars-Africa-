export interface Trader {
  id: number;
  trader_id: string; // This is now the nickname
  return_pct: number;
  max_drawdown: number;
  consistency_score: number;
  total_trades: number;
  risk_score: number;
  overall_score: number;
  votes?: number;
  season_id?: number;
}

export interface RegistrationData {
  fullName: string;
  nickname: string;
  email: string;
  phone: string;
  platform: string;
  broker: string;
  accountNumber: string;
  tier: string;
}
