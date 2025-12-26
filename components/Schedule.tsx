import React, { useState } from 'react';
import { PhotographyEvent, EventStatus } from '../types';
import { PlusIcon, TrashIcon, XIcon } from './Icons';

interface ScheduleProps {
  events: PhotographyEvent[];
  setEvents?: React.Dispatch<React.SetStateAction<PhotographyEvent[]>>; // Optional for read-only
}

const Schedule: React.FC<ScheduleProps> = ({ events, setEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // YYYY-MM-DD
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Detail Modal State
  const [selectedEvent, setSelectedEvent] = useState<PhotographyEvent | null>(null);

  // Quick Add Form State
  const [organizer, setOrganizer] = useState('');
  const [theme, setTheme] = useState('');
  const [modelCount, setModelCount] = useState<number | ''>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date.startsWith(dateStr));
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowAddModal(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: PhotographyEvent) => {
    e.stopPropagation(); // Prevent opening the add modal
    setSelectedEvent(event);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent || !setEvents) return;
    if (confirm('确定要删除这个活动安排吗？')) {
      setEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id));
      setSelectedEvent(null);
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setEvents || !selectedDate) return;

    const newEvent: PhotographyEvent = {
      id: Date.now().toString(),
      title: theme,
      date: `${selectedDate}T09:00`, // Default to 9am
      location: '待定',
      description: `组织者: ${organizer}\n预计模特: ${modelCount}人`,
      status: EventStatus.UPCOMING,
      organizer: organizer,
      modelCount: Number(modelCount),
      requiredResources: []
    };

    setEvents(prev => [...prev, newEvent]);
    setShowAddModal(false);
    setOrganizer('');
    setTheme('');
    setModelCount('');
  };

  const renderCalendarGrid = () => {
    const cells = [];
    
    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-gray-50 border border-gray-100"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = getEventsForDay(d);
      const isToday = new Date().getDate() === d && new Date().getMonth() === month;

      cells.push(
        <div 
          key={d} 
          onClick={() => handleDayClick(d)}
          className={`h-24 md:h-32 border border-emerald-50 p-1 relative hover:bg-emerald-50 cursor-pointer transition flex flex-col gap-1 overflow-hidden ${isToday ? 'bg-emerald-50' : 'bg-white'}`}
        >
          <span className={`text-sm font-medium ml-1 ${isToday ? 'text-emerald-600' : 'text-gray-500'}`}>{d}</span>
          
          <div className="flex-1 overflow-y-auto space-y-1">
            {dayEvents.map(ev => (
              <div 
                key={ev.id} 
                onClick={(e) => handleEventClick(e, ev)}
                className="text-xs bg-emerald-100 text-emerald-800 p-1 rounded border-l-2 border-emerald-500 truncate hover:bg-emerald-200 cursor-pointer transition"
              >
                 {ev.title || '无主题'}
                 {ev.organizer && <span className="block text-[10px] opacity-75">@{ev.organizer}</span>}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-900">活动排期表</h2>
        <div className="text-lg font-medium text-gray-600">
           {year}年 {month + 1}月
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-lg border border-emerald-50 overflow-hidden">
        <div className="grid grid-cols-7 bg-emerald-600 text-white text-center py-2 text-sm font-semibold">
          {['日','一','二','三','四','五','六'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {renderCalendarGrid()}
        </div>
      </div>

      {/* Quick Add Modal */}
      {showAddModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
             <h3 className="text-lg font-bold text-gray-800 mb-4">
               添加活动安排 ({selectedDate})
             </h3>
             <form onSubmit={handleQuickAdd} className="space-y-4">
               <div>
                 <label className="block text-sm text-gray-600 mb-1">组织者名称</label>
                 <input 
                   required
                   className="w-full border rounded px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                   value={organizer}
                   onChange={e => setOrganizer(e.target.value)}
                 />
               </div>
               <div>
                 <label className="block text-sm text-gray-600 mb-1">活动主题</label>
                 <input 
                   required
                   className="w-full border rounded px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                   value={theme}
                   onChange={e => setTheme(e.target.value)}
                 />
               </div>
               <div>
                 <label className="block text-sm text-gray-600 mb-1">预计模特人数</label>
                 <input 
                   type="number"
                   className="w-full border rounded px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                   value={modelCount}
                   onChange={e => setModelCount(Number(e.target.value))}
                 />
               </div>
               <div className="flex justify-end gap-2 pt-2">
                 <button 
                   type="button" 
                   onClick={() => setShowAddModal(false)}
                   className="px-4 py-2 text-gray-600 bg-gray-100 rounded text-sm hover:bg-gray-200"
                 >
                   取消
                 </button>
                 <button 
                   type="submit" 
                   className="px-4 py-2 text-white bg-emerald-600 rounded text-sm hover:bg-emerald-700"
                 >
                   保存
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in relative">
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XIcon className="w-5 h-5"/>
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedEvent.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{new Date(selectedEvent.date).toLocaleDateString()} @ {selectedEvent.location}</p>
            
            <div className="bg-gray-50 p-3 rounded mb-4 text-sm text-gray-700 whitespace-pre-wrap">
              {selectedEvent.description}
            </div>
            
            <div className="flex justify-end pt-2">
               <button 
                 onClick={handleDeleteEvent}
                 className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded bg-red-50 hover:bg-red-100 transition"
               >
                 <TrashIcon className="w-4 h-4" />
                 删除此安排
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;