import React, { useState } from 'react';
import { ResourceItem, ResourceCategory, AspectRatio } from '../types';
import { PlusIcon, TrashIcon, MapPinIcon, CalendarIcon, ImageIcon } from './Icons';
import ImageViewer from './ImageViewer';
import { compressImage } from '../utils/imageCompressor';

interface ResourceLibraryProps {
  resources: ResourceItem[];
  setResources: React.Dispatch<React.SetStateAction<ResourceItem[]>>;
}

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ resources, setResources }) => {
  const [activeTab, setActiveTab] = useState<ResourceCategory>(ResourceCategory.COSTUME);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  
  // Viewer State
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // New Resource State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTotal, setNewTotal] = useState(1);
  const [newLocation, setNewLocation] = useState('');
  const [newItemCode, setNewItemCode] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newAspect, setNewAspect] = useState<AspectRatio>('portrait');

  const tabs = [
    { id: ResourceCategory.COSTUME, label: '服装 (Costume)', emoji: '👗' },
    { id: ResourceCategory.MAKEUP, label: '化妆 (Makeup)', emoji: '💄' },
    { id: ResourceCategory.PROP, label: '道具 (Props)', emoji: '🎬' },
    { id: ResourceCategory.ACCESSORY, label: '饰品 (Accessories)', emoji: '💍' },
  ];

  const filteredResources = resources.filter(r => r.category === activeTab);

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
        setNewImages(prev => [...prev, ...newCompressedImages]);
      } catch (err) {
        console.error(err);
        alert('图片处理失败，请重试');
      } finally {
        setIsProcessingImg(false);
      }
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const openViewer = (images: string[], index: number = 0) => {
    setViewerImages(images);
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImages = newImages.length > 0 ? newImages : [`https://picsum.photos/300/400?random=${Date.now()}`];
    
    const newItem: ResourceItem = {
      id: Date.now().toString(),
      name: newName,
      category: activeTab,
      description: newDesc,
      totalQuantity: newTotal,
      availableQuantity: newTotal, 
      location: newLocation,
      itemCode: activeTab === ResourceCategory.COSTUME ? newItemCode : undefined,
      bookedDates: [],
      images: finalImages,
      imageUrl: finalImages[0], // fallback
      displayAspect: newAspect
    };
    setResources([...resources, newItem]);
    setIsAdding(false);
    // Reset
    setNewName(''); setNewDesc(''); setNewTotal(1); setNewLocation('');
    setNewItemCode(''); setNewImages([]); setNewAspect('portrait');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个资源吗？')) {
      setResources(resources.filter(r => r.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    }
  };
  
  const toggleDateBooking = (dateStr: string) => {
    if (!selectedItem) return;
    
    let newBookedDates = [...(selectedItem.bookedDates || [])];
    if (newBookedDates.includes(dateStr)) {
      newBookedDates = newBookedDates.filter(d => d !== dateStr);
    } else {
      newBookedDates.push(dateStr);
    }

    const updatedItem = { ...selectedItem, bookedDates: newBookedDates };
    setSelectedItem(updatedItem);
    setResources(resources.map(r => r.id === selectedItem.id ? updatedItem : r));
  };

  const updateItemLocation = (newLoc: string) => {
      if (!selectedItem) return;
      const updatedItem = { ...selectedItem, location: newLoc };
      setSelectedItem(updatedItem);
      setResources(resources.map(r => r.id === selectedItem.id ? updatedItem : r));
  };

  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isBooked = selectedItem?.bookedDates?.includes(dateStr);
      days.push(
        <button
          key={dateStr}
          onClick={() => toggleDateBooking(dateStr)}
          className={`h-10 w-full rounded flex items-center justify-center text-sm font-medium transition-colors ${
             isBooked ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
          title={isBooked ? "点击取消占用" : "点击标记为占用"}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const getAspectRatioClass = (aspect: AspectRatio) => {
    switch (aspect) {
      case 'video': return 'aspect-video'; // 16:9
      case 'portrait': return 'aspect-[3/4]'; // 3:4
      case 'square': return 'aspect-square'; // 1:1
      default: return 'aspect-[3/4]';
    }
  };

  return (
    <div className="space-y-6 relative">
      {isViewerOpen && (
        <ImageViewer 
          images={viewerImages} 
          initialIndex={viewerIndex} 
          onClose={() => setIsViewerOpen(false)} 
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-emerald-900">资源管理库</h2>
        <div className="flex bg-emerald-100 p-1 rounded-lg overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-600 hover:text-emerald-800'
              }`}
            >
              <span className="mr-2">{tab.emoji}</span>
              {tab.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          登记新{tabs.find(t => t.id === activeTab)?.label.split(' ')[0]}
        </button>
      )}

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-100 animate-slide-down">
           <h3 className="text-lg font-semibold mb-4">
             添加新{tabs.find(t => t.id === activeTab)?.label.split(' ')[0]}
           </h3>
           <form onSubmit={handleAddResource} className="space-y-4">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Left: Image Upload */}
               <div className="lg:col-span-1 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">图片展示 (多图)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {newImages.map((img, idx) => (
                      <div key={idx} className={`relative rounded overflow-hidden border border-gray-200 ${getAspectRatioClass(newAspect)}`}>
                        <img src={img} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl">
                          <TrashIcon className="w-3 h-3"/>
                        </button>
                      </div>
                    ))}
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition ${getAspectRatioClass(newAspect)} ${isProcessingImg ? 'opacity-50 cursor-wait' : ''}`}>
                      {isProcessingImg ? (
                        <span className="text-xs text-gray-500">处理中...</span>
                      ) : (
                        <>
                          <ImageIcon className="w-6 h-6 text-gray-400"/>
                          <span className="text-xs text-gray-500 mt-1">上传</span>
                        </>
                      )}
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isProcessingImg} />
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">首图展示比例</label>
                    <div className="flex gap-2">
                       {[
                         { id: 'portrait', label: '竖屏 (3:4)' },
                         { id: 'video', label: '横屏 (16:9)' },
                         { id: 'square', label: '正方 (1:1)' }
                       ].map(opt => (
                         <button
                           key={opt.id}
                           type="button"
                           onClick={() => setNewAspect(opt.id as AspectRatio)}
                           className={`flex-1 py-1 text-xs border rounded ${newAspect === opt.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-300'}`}
                         >
                           {opt.label}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>

               {/* Right: Info */}
               <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <label className="block text-xs font-medium text-gray-500 mb-1">资源名称</label>
                    <input required value={newName} onChange={e => setNewName(e.target.value)} className="input-field" placeholder="资源名称" />
                  </div>

                  {activeTab === ResourceCategory.COSTUME && (
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">衣服编码</label>
                        <input value={newItemCode} onChange={e => setNewItemCode(e.target.value)} className="input-field" placeholder="例如: C-001" />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">物品所在地</label>
                    <input value={newLocation} onChange={e => setNewLocation(e.target.value)} className="input-field" placeholder="例如：A架2层" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">总库存</label>
                    <input type="number" min="1" value={newTotal} onChange={e => setNewTotal(parseInt(e.target.value))} className="input-field" />
                  </div>

                  <div className="col-span-full">
                    <label className="block text-xs font-medium text-gray-500 mb-1">描述/备注</label>
                    <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3} className="input-field" placeholder="详细信息..." />
                  </div>
               </div>
             </div>

             <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
               <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded">取消</button>
               <button type="submit" disabled={isProcessingImg} className="px-4 py-2 text-sm text-white bg-emerald-600 rounded disabled:opacity-50">保存</button>
             </div>
           </form>
           <style>{`.input-field { width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; font-size: 0.875rem; outline: none; } .input-field:focus { border-color: #10b981; }`}</style>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredResources.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-emerald-400 transition group"
            >
              <div className={`bg-gray-100 relative overflow-hidden ${getAspectRatioClass(item.displayAspect || 'portrait')}`}>
                <img
                  src={item.images?.[0] || item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full ${
                  item.availableQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.availableQuantity > 0 ? '可用' : '借出'}
                </span>
                {item.images?.length > 1 && (
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] rounded bg-black/50 text-white">
                    +{item.images.length - 1}
                  </span>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-800 truncate text-sm">{item.name}</h4>
                </div>
                 {item.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                       <MapPinIcon className="w-3 h-3"/> {item.location}
                    </div>
                )}
              </div>
            </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative flex flex-col md:flex-row gap-6">
             <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">✕</button>
             
             {/* Left: Gallery */}
             <div className="w-full md:w-1/2 flex flex-col gap-3">
                <div 
                  className={`w-full bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in ${getAspectRatioClass(selectedItem.displayAspect || 'portrait')}`}
                  onClick={() => openViewer(selectedItem.images || [selectedItem.imageUrl || ''], 0)}
                >
                   <img src={selectedItem.images?.[0] || selectedItem.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-5 gap-2">
                   {selectedItem.images?.map((img, idx) => (
                     <div 
                       key={idx} 
                       className="aspect-square rounded overflow-hidden cursor-pointer border hover:border-emerald-500"
                       onClick={() => openViewer(selectedItem.images || [], idx)}
                     >
                       <img src={img} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
             </div>

             {/* Right: Details */}
             <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedItem.name}</h3>
                  <div className="flex gap-2 mt-2">
                    {selectedItem.itemCode && <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-1 rounded">{selectedItem.itemCode}</span>}
                    <span className={`px-2 py-1 text-xs rounded ${selectedItem.availableQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        库存: {selectedItem.availableQuantity} / {selectedItem.totalQuantity}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 leading-relaxed">
                   {selectedItem.description || '暂无描述'}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">物品所在地</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={selectedItem.location || ''} 
                      onChange={(e) => updateItemLocation(e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4"/> 档期表
                  </h4>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['日','一','二','三','四','五','六'].map(d => <div key={d} className="text-xs text-gray-400">{d}</div>)}
                    {renderCalendar()}
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                   <button 
                     onClick={(e) => handleDelete(selectedItem.id, e)} 
                     className="text-red-500 text-sm hover:underline flex items-center gap-1"
                   >
                     <TrashIcon className="w-4 h-4"/> 删除此资源
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;