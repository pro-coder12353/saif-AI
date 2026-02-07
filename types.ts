
export type Language = 'English' | 'Arabic' | 'Hindi' | 'Urdu' | 'Tagalog';

export type AppView = 'landing' | 'scanner' | 'map' | 'voice' | 'gov' | 'delivery' | 'training';

export interface TranslationSet {
  app_title: string;
  sidebar_subtitle: string;
  tab_image: string;
  tab_text: string;
  upload_text: string;
  text_input_placeholder: string;
  analyze_btn: string;
  investigating: string;
  threat_detected: string;
  safe_verdict: string;
  error_high_traffic: string;
  police_report_label: string;
  send_sms_btn: string;
  copy_btn: string;
  select_lang_label: string;
  disclaimer: string;
  // New Feature Labels
  nav_scanner: string;
  nav_map: string;
  nav_voice: string;
  nav_gov: string;
  nav_delivery: string;
  nav_training: string;
  map_title: string;
  voice_status: string;
  gov_status: string;
  delivery_title: string;
  training_title: string;
  // Analysis Headers
  tactical_analysis: string;
  risk_score_label: string;
  // Landing Page
  landing_title: string;
  landing_subtitle: string;
  landing_cta: string;
  live_stat_1: string;
  live_stat_2: string;
  // Police
  police_section: string;
  call_police: string;
  email_police: string;
}

export interface AnalysisResult {
  verdict: 'SCAM' | 'SAFE' | 'UNKNOWN';
  explanation: string;
  policeReport: any;
  rawText: string;
}
