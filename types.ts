
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

export type AspectRatio = 'video' | 'portrait' | 'square'; // 16:9, 3:4, 1:1

export interface ResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  imageUrl?: string; // Kept for backward compatibility, but UI will prefer images[0]
  images: string[]; // New: Multiple images
  displayAspect: AspectRatio; // New: Display orientation
  totalQuantity: number;
  availableQuantity: number;
  location?: string; 
  itemCode?: string;
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
  images: string[]; // New: Multiple images
}

export interface MakeupArtist {
  id: string;
  name: string;
  contact: string;
  baseLocation: string;
  rates: string;
  returnRequirements: string;
  portfolioImages: string[];
  notes?: string;
}

export interface ThemeItem {
  id: string;
  title: string;
  description: string;
  recommendLocation: string;
  images: string[];
}

export interface ThemePlan {
  month: number;
  themes: ThemeItem[];
}

export interface TabViewProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}
