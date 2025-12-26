import React, { useState } from 'react';
import { ThemePlan, ThemeItem } from '../types';
import { PlusIcon, ImageIcon, MapPinIcon, TrashIcon } from './Icons';
import ImageViewer from './ImageViewer';
import { compressImage } from '../utils/imageCompressor';

interface ThemeTimelineProps {
  plans: ThemePlan[];
  setPlans: React.Dispatch<React.SetStateAction<ThemePlan[]>>;
}

const ThemeTimeline: React.FC<ThemeTimelineProps> = ({ plans, setPlans }) => {
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [editingTheme, setEditingTheme] = useState<ThemeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingImg, setIsProcessingImg] = useState(false);

  // Viewer
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const months = [
    { num: 1, name: '一月 (Jan)' }, { num: 2, name: '二月 (Feb)' },
    { num: 3, name: '三月 (Mar)' }, { num: 4, name: '四月 (Apr)' },
    { num: 5, name: '五月 (May)' }, { num: 6, name: '六月 (Jun)' },
    { num: 7, name: '七月 (Jul)' }, { num: 8, name: '八月 (Aug)' },
    { num: 9, name: '九月 (Sep)' }, { num: 10, name: '十月 (Oct)' },
    { num: 11, name: '十一月 (Nov)' }, { num: 12, name: '十二月 (Dec)' },
  ];

  const getMonthThemes = (month: number) => {
    return plans.find(p => p.month === month)?.themes || [];
  };

  const handleOpenAdd = (month: number) => {
    setEditingMonth(month);
    setEditingTheme(null);
    setTitle('');
    setDesc('');
    setLocation('');
    setImages([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (month: number, theme: ThemeItem) => {
    setEditingMonth(month);
    setEditingTheme(theme);
    setTitle(theme.title);
    setDesc(theme.description);
    setLocation(theme.recommendLocation);
    setImages(theme.images || []);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsProcessingImg(true);
      const newCompressedImages: string[] = [];
      try {
        for (let i = 0; i < files.length; i++) {
          const compressed = await compressImage(files[i]);
          newCompressedImages.push(compressed);
        }
        setImages(prev => [...prev, ...newCompressedImages]);
      } catch (err) {
        console.error(err);
        alert('图片处理失败');
      } finally {
        setIsProcessingImg(false);
      }
    }
  };

  const openViewer = (imgs: string[], idx: number) => {
    if (imgs.length === 0) return;
    setViewerImages(imgs);
    setViewerIndex(idx);
    setIsViewerOpen(true);
  };

  const handleSave = () => {
    if (editingMonth === null) return;
    
    const newTheme: ThemeItem = {
      id: editingTheme?.id || Date.now().toString(),
      title,
      description: desc,
      recommendLocation: location,
      images
    };

    setPlans(prevPlans => {
      const monthPlanIndex = prevPlans.findIndex(p => p.month === editingMonth);
      let updatedPlans = [...prevPlans];

      if (monthPlanIndex >= 0) {
        // Existing month plan
        const currentThemes = updatedPlans[monthPlanIndex].themes;
        if (editingTheme) {
          // Edit existing theme
          updatedPlans[monthPlanIndex].themes = currentThemes.map(t => t.id === editingTheme.id ? newTheme : t);
        } else {
          // Add new theme
          updatedPlans[monthPlanIndex].themes = [...currentThemes, newTheme];
        }
      } else {
        // New month plan
        updatedPlans.push({ month: editingMonth, themes: [newTheme] });
      }
      return updatedPlans;
    });

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingMonth === null || !editingTheme) return;
    if (!confirm('确认删除该主题推荐吗？')) return;

    setPlans(prevPlans => {
      return prevPlans.map(p => {
        if (p.month === editingMonth) {
          return { ...p, themes: p.themes.filter(t => t.id !== editingTheme.id) };
        }
        return p;
      });
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {isViewerOpen && (
        <ImageViewer 
          images={viewerImages} 
          initialIndex={viewerIndex} 
          onClose={() => setIsViewerOpen(false)} 
        />
      )}

      <h2 className="text-2xl font-bold text-emerald-900">活动主题推荐</h2>
      <p className="text-gray-500">规划全年的拍摄主题灵感与视觉参考</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((m) => {
          const themes = getMonthThemes(m.num);
          return (
            <div key={m.num} className="bg-white rounded-xl shadow-sm border border-emerald-100 flex flex-col h-full hover:shadow-md transition">
              <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex justify-between items-center">
                <span className="font-bold text-emerald-800 text-lg">{m.num}月</span>
                <span className="text-xs text-emerald-600 font-mono">{m.name}</span>
              </div>
              <div className="p-3 flex-1 space-y-2 min-h-[120px]">
                {themes.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">暂无推荐主题</p>
                )}
                {themes.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => handleOpenEdit(m.num, t)}
                    className="bg-white border border-gray-200 rounded p-2 text-sm text-gray-700 hover:bg-emerald-50 cursor-pointer shadow-sm group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-emerald-700">{t.title}</div>
                      {t.images && t.images.length > 0 && <ImageIcon className="w-3 h-3 text-gray-400"/>}
                    </div>
                    <div className="text-xs text-gray-500 truncate mb-1">{t.recommendLocation}</div>
                    
                    {/* Tiny preview */}
                    {t.images && t.images.length > 0 && (
                      <div className="flex gap-1 overflow-hidden mt-1 h-8">
                        {t.images.slice(0, 3).map((img, i) => (
                           <img key={i} src={img} className="h-full w-auto rounded-sm object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => handleOpenAdd(m.num)}
                className="w-full py-2 bg-gray-50 text-emerald-600 text-sm font-medium hover:bg-emerald-100 border-t border-emerald-100 flex items-center justify-center gap-1"
              >
                <PlusIcon className="w-4 h-4" /> 添加主题
              </button>
            </div>
          );
        })}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-gray-800">
                 {editingTheme ? '编辑主题' : '添加新主题'} - {months.find(m => m.num === editingMonth)?.name}
               </h3>
               {editingTheme && (
                 <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                   <TrashIcon className="w-5 h-5"/>
                 </button>
               )}
             </div>

             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">主题名称</label>
                 <input 
                   className="w-full border rounded px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                   value={title}
                   onChange={e => setTitle(e.target.value)}
                   placeholder="例如：雪柳花海"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">推荐地点</label>
                 <div className="flex gap-2">
                   <MapPinIcon className="w-5 h-5 text-gray-400 mt-2"/>
                   <input 
                     className="w-full border rounded px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                     value={location}
                     onChange={e => setLocation(e.target.value)}
                     placeholder="例如：奥林匹克森林公园"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">详细描述/策划思路</label>
                 <textarea 
                   rows={4}
                   className="w-full border rounded px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                   value={desc}
                   onChange={e => setDesc(e.target.value)}
                   placeholder="描述一下拍摄风格、服化道建议..."
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">视觉参考板 (上传图片)</label>
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                   {images.map((img, idx) => (
                     <div key={idx} className="relative aspect-square bg-gray-100 rounded overflow-hidden group">
                       <img 
                         src={img} 
                         alt="mood board" 
                         className="w-full h-full object-cover cursor-zoom-in" 
                         onClick={() => openViewer(images, idx)}
                       />
                       <button 
                         onClick={() => setImages(images.filter((_, i) => i !== idx))}
                         className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                       >
                         <TrashIcon className="w-3 h-3"/>
                       </button>
                     </div>
                   ))}
                   <label className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 hover:border-emerald-400 transition text-gray-400 hover:text-emerald-500 ${isProcessingImg ? 'opacity-50 cursor-wait' : ''}`}>
                     {isProcessingImg ? (
                        <span className="text-xs">处理中...</span>
                     ) : (
                        <>
                          <ImageIcon className="w-6 h-6 mb-1"/>
                          <span className="text-xs">上传图片</span>
                        </>
                     )}
                     <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isProcessingImg}/>
                   </label>
                 </div>
               </div>
             </div>

             <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
               >
                 取消
               </button>
               <button 
                 onClick={handleSave}
                 disabled={isProcessingImg}
                 className="px-4 py-2 text-white bg-emerald-600 rounded hover:bg-emerald-700 disabled:opacity-50"
               >
                 保存主题
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeTimeline;