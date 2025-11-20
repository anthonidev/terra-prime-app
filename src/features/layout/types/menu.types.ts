export interface MenuItem {
  id: number;
  code: string;
  name: string;
  icon: string;
  url: string | null;
  order: number;
  metadata: Record<string, unknown> | null;
  children: MenuItem[];
}

export interface UserMenuResponse {
  views: MenuItem[];
}
