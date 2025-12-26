import React, { useState, useEffect } from 'react';
import { CameraIcon, BoxIcon, CalendarIcon, StarIcon, MapPinIcon, UserIcon } from './components/Icons';
import EventBoard from './components/EventBoard';
import ResourceLibrary from './components/ResourceLibrary';
import Schedule from './components/Schedule';
import ThemeTimeline from './components/ThemeTimeline';
import LocationLibrary from './components/LocationLibrary';
import MakeupLibrary from './components/MakeupLibrary';
import { PhotographyEvent, ResourceItem, ResourceCategory, ThemePlan, LocationPartner, MakeupArtist } from './types';

// Mock initial data
const INITIAL_EVENTS: PhotographyEvent[] = [
  {
    id: '1',
    title: '初夏森林写真',
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    location: '奥林匹克森林公园北园',
    description: '捕捉夏日的第一缕阳光，主打清新自然风格。',
    status: 'UPCOMING' as any,
    requiredResources: []
  }
];

const INITIAL_RESOURCES: ResourceItem[] = [
  { id: '101', name: '日系学生制服(L)', category: ResourceCategory.COSTUME, description: '深蓝色西装外套+格子裙', totalQuantity: 2, availableQuantity: 2, imageUrl: 'https://picsum.photos/200/200?random=1', location: 'A区衣柜', itemCode: 'C-001' },
  { id: '102', name: '复古手提箱', category: ResourceCategory.PROP, description: '棕色皮质，适合复古风', totalQuantity: 1, availableQuantity: 1, imageUrl: 'https://picsum.photos/200/200?random=2', location: '道具间B2' },
];

function App() {
  const [currentView, setCurrentView] = useState<'events' | 'resources' | 'schedule' | 'themes' | 'locations' | 'makeup'>('events');
  
  // State
  const [events, setEvents] = useState<PhotographyEvent[]>(() => {
    const saved = localStorage.getItem('gf_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('gf_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [themePlans, setThemePlans] = useState<ThemePlan[]>(() => {
    const saved = localStorage.getItem('gf_themes');
    return saved ? JSON.parse(saved) : [{month: 1, themes: []}];
  });

  const [locations, setLocations] = useState<LocationPartner[]>(() => {
    const saved = localStorage.getItem('gf_locations');
    return saved ? JSON.parse(saved) : [];
  });

  const [makeupArtists, setMakeupArtists] = useState<MakeupArtist[]>(() => {
    const saved = localStorage.getItem('gf_makeup');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => { localStorage.setItem('gf_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('gf_resources', JSON.stringify(resources)); }, [resources]);
  useEffect(() => { localStorage.setItem('gf_themes', JSON.stringify(themePlans)); }, [themePlans]);
  useEffect(() => { localStorage.setItem('gf_locations', JSON.stringify(locations)); }, [locations]);
  useEffect(() => { localStorage.setItem('gf_makeup', JSON.stringify(makeupArtists)); }, [makeupArtists]);

  const NavItem = ({ view, label, icon: Icon }: any) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-inner' 
          : 'text-gray-600 hover:bg-emerald-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-emerald-50 text-gray-800 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="bg-white w-full md:w-64 md:h-screen md:fixed flex-shrink-0 border-r border-emerald-100 shadow-sm z-20 overflow-y-auto">
        <div className="p-6 flex items-center gap-3 border-b border-emerald-50 sticky top-0 bg-white z-10">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
            🌲
          </div>
          <h1 className="text-xl font-bold text-emerald-900 tracking-tight">绿森林摄影</h1>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem view="events" label="活动发布" icon={CameraIcon} />
          <NavItem view="schedule" label="活动排期表" icon={CalendarIcon} />
          <NavItem view="resources" label="资源登记" icon={BoxIcon} />
          
          <div className="pt-4 border-t border-emerald-50">
            <p className="px-4 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">策划与合作</p>
            <NavItem view="themes" label="活动主题推荐" icon={StarIcon} />
            <NavItem view="locations" label="场地合作资源" icon={MapPinIcon} />
            <NavItem view="makeup" label="化妆师合作" icon={UserIcon} />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-20">
          {currentView === 'events' && <EventBoard events={events} setEvents={setEvents} />}
          {currentView === 'resources' && <ResourceLibrary resources={resources} setResources={setResources} />}
          {currentView === 'schedule' && <Schedule events={events} setEvents={setEvents} />}
          {currentView === 'themes' && <ThemeTimeline plans={themePlans} setPlans={setThemePlans} />}
          {currentView === 'locations' && <LocationLibrary locations={locations} setLocations={setLocations} />}
          {currentView === 'makeup' && <MakeupLibrary artists={makeupArtists} setArtists={setMakeupArtists} />}
        </div>
      </main>
    </div>
  );
}

export default App;