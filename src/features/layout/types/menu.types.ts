export interface MenuItem {
  id: string;
  code: string;
  name: string;
  icon: string;
  url: string | null;
  order: number;
  metadata: Record<string, any>;
  children: MenuItem[];
}

export interface UserMenuResponse {
  views: MenuItem[];
}
