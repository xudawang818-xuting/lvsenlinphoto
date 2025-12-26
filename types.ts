export enum ResourceCategory {
  COSTUME = 'COSTUME',
  MAKEUP = 'MAKEUP',
  PROP = 'PROP',
  ACCESSORY = 'ACCESSORY'
}

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  imageUrl?: string;
  totalQuantity: number;
  availableQuantity: number;
  location?: string; 
  itemCode?: string; // Added Item Code
  bookedDates?: string[]; 
}

export interface PhotographyEvent {
  id: string;
  title: string;
  date: string; 
  location: string;
  description: string;
  status: EventStatus;
  stageManager?: string; 
  organizer?: string; 
  modelCount?: number; 
  requiredResources: {
    resourceId: string;
    quantity: number;
  }[];
}

export interface LocationPartner {
  id: string;
  name: string;
  address: string;
  style: string;
  contact: string;
  cost: string;
  requirements: string;
  notes: string;
  imageUrl?: string;
}

export interface MakeupArtist {
  id: string;
  name: string;
  contact: string;
  baseLocation: string; // 化妆地点
  rates: string; // 收费标准
  returnRequirements: string; // 返图要求
  portfolioImages: string[]; // Base64 strings of portfolio
  notes?: string;
}

export interface ThemeItem {
  id: string;
  title: string;
  description: string;
  recommendLocation: string;
  images: string[]; // Base64 strings
}

export interface ThemePlan {
  month: number; // 1-12
  themes: ThemeItem[];
}

export interface TabViewProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}