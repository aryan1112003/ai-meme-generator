export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  box_count: number;
  width: number;
  height: number;
}

export interface GeneratedMeme {
  id: string;
  url: string;
  template: MemeTemplate;
  captions: string[];
  timestamp: number;
}

export interface UserPreferences {
  darkMode: boolean;
  language: string;
}