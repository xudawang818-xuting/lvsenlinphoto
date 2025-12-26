import React, { useState } from 'react';
import { PhotographyEvent, EventStatus } from '../types';
import { generateEventDescription } from '../services/geminiService';
import { MagicWandIcon, PlusIcon, CalendarIcon } from './Icons';

interface EventBoardProps {
  events: PhotographyEvent[];
  setEvents: React.Dispatch<React.SetStateAction<PhotographyEvent[]>>;
}

const EventBoard: React.FC<EventBoardProps> = ({ events, setEvents }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [styleNotes, setStyleNotes] = useState('');
  const [stageManager, setStageManager] = useState(''); // Added field

  const handleAISuggestion = async () => {
    if (!title || !location) {
      alert("请先填写主题和地点，以便AI生成内容。");
      return;
    }
    setLoadingAI(true);
    const result = await generateEventDescription(title, location, styleNotes);
    setDescription(result);
    setLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: PhotographyEvent = {
      id: Date.now().toString(),
      title,
      date,
      location,
      description,
      status: EventStatus.UPCOMING,
      stageManager, // Save stage manager
      requiredResources: []
    };
    setEvents([...events, newEvent]);
    setIsCreating(false);
    // Reset form
    setTitle('');
    setDate('');
    setLocation('');
    setDescription('');
    setStyleNotes('');
    setStageManager('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-900">活动公告板</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          发布新活动
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-100 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">新建摄影活动</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">活动主题</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="例如：夏日森林人像"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">活动时间</label>
                <input
                  type="datetime-local"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">活动地点</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="集合地点或拍摄地点"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">场控 (可选)</label>
                  <input
                    type="text"
                    value={stageManager}
                    onChange={(e) => setStageManager(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="负责人姓名"
                  />
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">风格/备注 (用于AI生成)</label>
              <input
                type="text"
                value={styleNotes}
                onChange={(e) => setStyleNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="例如：小清新，日系，需要带反光板..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">活动详情文案</label>
                <button
                  type="button"
                  onClick={handleAISuggestion}
                  disabled={loadingAI}
                  className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-semibold disabled:opacity-50"
                >
                  <MagicWandIcon className="w-3 h-3" />
                  {loadingAI ? 'AI正在撰写...' : 'AI 帮我写'}
                </button>
              </div>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="活动具体流程、注意事项等..."
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
              >
                发布活动
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            暂无活动，点击右上角发布第一个活动吧！
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-emerald-50 overflow-hidden hover:shadow-md transition duration-300">
              <div className="h-32 bg-gradient-to-r from-emerald-400 to-teal-500 p-4 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold">{event.title}</h3>
                <span className="text-emerald-50 text-sm flex items-center gap-1">
                   <CalendarIcon className="w-3 h-3"/> {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-600">
                   <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs">
                     {event.status === EventStatus.UPCOMING ? '报名中' : '已结束'}
                   </span>
                   <span>📍 {event.location}</span>
                   {event.stageManager && (
                     <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs">
                       场控: {event.stageManager}
                     </span>
                   )}
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 whitespace-pre-wrap">{event.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">ID: {event.id.slice(-4)}</span>
                  <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    查看详情 &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventBoard;