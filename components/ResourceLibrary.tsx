import React, { useState } from 'react';
import { ResourceItem, ResourceCategory } from '../types';
import { PlusIcon, TrashIcon, MapPinIcon, CalendarIcon, ImageIcon } from './Icons';

interface ResourceLibraryProps {
  resources: ResourceItem[];
  setResources: React.Dispatch<React.SetStateAction<ResourceItem[]>>;
}

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ resources, setResources }) => {
  const [activeTab, setActiveTab] = useState<ResourceCategory>(ResourceCategory.COSTUME);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);

  // New Resource State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTotal, setNewTotal] = useState(1);
  const [newLocation, setNewLocation] = useState('');
  const [newItemCode, setNewItemCode] = useState('');
  const [newImage, setNewImage] = useState('');

  const tabs = [
    { id: ResourceCategory.COSTUME, label: '服装 (Costume)', emoji: '👗' },
    { id: ResourceCategory.MAKEUP, label: '化妆 (Makeup)', emoji: '💄' },
    { id: ResourceCategory.PROP, label: '道具 (Props)', emoji: '🎬' },
    { id: ResourceCategory.ACCESSORY, label: '饰品 (Accessories)', emoji: '💍' },
  ];

  const filteredResources = resources.filter(r => r.category === activeTab);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
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
      imageUrl: newImage || `https://picsum.photos/200/200?random=${Date.now()}` 
    };
    setResources([...resources, newItem]);
    setIsAdding(false);
    setNewName('');
    setNewDesc('');
    setNewTotal(1);
    setNewLocation('');
    setNewItemCode('');
    setNewImage('');
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

  // Helper to render calendar grid
  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday

    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isBooked = selectedItem?.bookedDates?.includes(dateStr);
      
      days.push(
        <button
          key={dateStr}
          onClick={() => toggleDateBooking(dateStr)}
          className={`h-10 w-full rounded flex items-center justify-center text-sm font-medium transition-colors ${
             isBooked 
               ? 'bg-red-100 text-red-700 border border-red-200' 
               : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
          title={isBooked ? "Click to cancel" : "Click to book"}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-emerald-900">资源管理库</h2>
        <div className="flex bg-emerald-100 p-1 rounded-lg overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-emerald-600 hover:text-emerald-800'
              }`}
            >
              <span className="mr-2">{tab.emoji}</span>
              {tab.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Add Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          登记新{tabs.find(t => t.id === activeTab)?.label.split(' ')[0]}
        </button>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-100 animate-slide-down">
           <h3 className="text-lg font-semibold mb-4">
             添加新{tabs.find(t => t.id === activeTab)?.label.split(' ')[0]}
           </h3>
           <form onSubmit={handleAddResource} className="space-y-4">
             
             <div className="flex gap-4">
               {/* Image Upload Area */}
               <div className="flex-shrink-0">
                  <label className="w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-emerald-400 transition text-gray-400 hover:text-emerald-500 bg-gray-50 relative overflow-hidden">
                    {newImage ? (
                      <img src={newImage} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 mb-1"/>
                        <span className="text-xs text-center px-1">上传首图</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
               </div>

               <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">名称</label>
                    <input
                      required
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm border px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="资源名称"
                    />
                  </div>

                  {/* Only show Code field for Costumes */}
                  {activeTab === ResourceCategory.COSTUME && (
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">衣服编码</label>
                        <input
                          type="text"
                          value={newItemCode}
                          onChange={e => setNewItemCode(e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm border px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          placeholder="例如: C-2023001"
                        />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">物品所在地</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={e => setNewLocation(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm border px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="例如：A架2层 / 1号仓库"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">数量</label>
                      <input
                      type="number"
                      min="1"
                      value={newTotal}
                      onChange={e => setNewTotal(parseInt(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm border px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                  </div>
               </div>
             </div>

             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">描述/备注</label>
               <input
                 type="text"
                 value={newDesc}
                 onChange={e => setNewDesc(e.target.value)}
                 className="w-full rounded-md border-gray-300 shadow-sm border px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                 placeholder="尺寸、颜色、状况等详细信息..."
               />
             </div>

             <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
               <button
                 type="button"
                 onClick={() => setIsAdding(false)}
                 className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
               >
                 取消
               </button>
               <button
                 type="submit"
                 className="px-3 py-2 text-sm text-white bg-emerald-600 rounded hover:bg-emerald-700"
               >
                 确认添加
               </button>
             </div>
           </form>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredResources.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 py-8">
            该分类下暂无资源，请点击上方添加。
          </p>
        ) : (
          filteredResources.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-emerald-400 transition group"
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full ${
                  item.availableQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.availableQuantity > 0 ? '可用' : '借出'}
                </span>
                {item.itemCode && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs rounded bg-black/60 text-white font-mono">
                    {item.itemCode}
                  </span>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                  <button onClick={(e) => handleDelete(item.id, e)} className="text-gray-400 hover:text-red-500">
                    <TrashIcon className="w-4 h-4"/>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3 flex-1 line-clamp-2">{item.description || '无详细描述'}</p>
                 {item.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                       <MapPinIcon className="w-3 h-3"/> {item.location}
                    </div>
                )}
                <div className="flex justify-between items-center text-sm border-t pt-2">
                  <span className="text-gray-600">库存: {item.totalQuantity}</span>
                  <span className="font-medium text-emerald-600">剩余: {item.availableQuantity}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
             <button 
               onClick={() => setSelectedItem(null)}
               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
             >
               ✕
             </button>
             
             <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                   <img src={selectedItem.imageUrl} className="w-full h-full object-cover" alt={selectedItem.name}/>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedItem.name}</h3>
                  {selectedItem.itemCode && (
                    <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-1 rounded inline-block mb-1">
                      {selectedItem.itemCode}
                    </span>
                  )}
                  <p className="text-gray-500 text-sm mt-1">{selectedItem.description}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                     <span className={`px-2 py-0.5 text-xs rounded-full ${selectedItem.availableQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedItem.availableQuantity > 0 ? '目前可用' : '暂时借出'}
                     </span>
                     <span className="text-xs text-gray-500">总库存: {selectedItem.totalQuantity}</span>
                  </div>
                </div>
             </div>

             <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-1">物品所在地</label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={selectedItem.location || ''} 
                   onChange={(e) => updateItemLocation(e.target.value)}
                   className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:border-emerald-500 focus:outline-none"
                   placeholder="输入物品存放位置..."
                 />
                 <button className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-sm">保存</button>
               </div>
             </div>

             <div>
               <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                 <CalendarIcon className="w-4 h-4"/> 档期占用情况 ({new Date().getMonth()+1}月)
               </h4>
               <p className="text-xs text-gray-500 mb-2">点击日期标记为“已占用/被预定”</p>
               <div className="grid grid-cols-7 gap-2 text-center">
                 {['日','一','二','三','四','五','六'].map(d => (
                   <div key={d} className="text-xs text-gray-400">{d}</div>
                 ))}
                 {renderCalendar()}
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;