import React, { useState } from 'react';
import { LocationPartner } from '../types';
import { PlusIcon, MapPinIcon, ImageIcon, TrashIcon } from './Icons';
import ImageViewer from './ImageViewer';

interface LocationLibraryProps {
  locations: LocationPartner[];
  setLocations: React.Dispatch<React.SetStateAction<LocationPartner[]>>;
}

const LocationLibrary: React.FC<LocationLibraryProps> = ({ locations, setLocations }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState<LocationPartner | null>(null);

  // Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  
  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [style, setStyle] = useState('');
  const [contact, setContact] = useState('');
  const [cost, setCost] = useState('');
  const [requirements, setRequirements] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const openViewer = (imgs: string[], idx: number = 0) => {
    if (imgs.length === 0) return;
    setViewerImages(imgs);
    setViewerIndex(idx);
    setIsViewerOpen(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImages = images.length > 0 ? images : [`https://picsum.photos/300/200?random=${Date.now()}`];
    const newLoc: LocationPartner = {
      id: Date.now().toString(),
      name, address, style, contact, cost, requirements, notes,
      imageUrl: finalImages[0], // fallback
      images: finalImages
    };
    setLocations([...locations, newLoc]);
    setIsAdding(false);
    // Reset
    setName(''); setAddress(''); setStyle(''); setContact('');
    setCost(''); setRequirements(''); setNotes(''); setImages([]);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm('确定要删除这个场地资源吗？')) {
      setLocations(locations.filter(l => l.id !== id));
      if (selectedLoc?.id === id) setSelectedLoc(null);
    }
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

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-900">场地资源</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            登记新场地
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-100 animate-slide-down">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">登记合作场地</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Left: Images */}
               <div className="lg:col-span-1 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">场地图片 (多图)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded overflow-hidden border border-gray-200">
                        <img src={img} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl">
                          <TrashIcon className="w-3 h-3"/>
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition aspect-square">
                      <ImageIcon className="w-6 h-6 text-gray-400"/>
                      <span className="text-xs text-gray-500 mt-1">上传</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
               </div>

               {/* Right: Fields */}
               <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="场地名称" value={name} onChange={e => setName(e.target.value)} className="input-field" />
                  <input required placeholder="具体地址" value={address} onChange={e => setAddress(e.target.value)} className="input-field" />
                  <input placeholder="适合风格 (如：复古、工业风)" value={style} onChange={e => setStyle(e.target.value)} className="input-field" />
                  <input required placeholder="联系人电话" value={contact} onChange={e => setContact(e.target.value)} className="input-field" />
                  <input placeholder="费用 (如：200/h)" value={cost} onChange={e => setCost(e.target.value)} className="input-field" />
                  <input placeholder="场地方要求" value={requirements} onChange={e => setRequirements(e.target.value)} className="input-field" />
                  <textarea placeholder="备注信息" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="input-field col-span-full" />
               </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-100 rounded text-gray-600">取消</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">保存</button>
            </div>
          </form>
          <style>{`.input-field { width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; outline: none; } .input-field:focus { border-color: #10b981; }`}</style>
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {locations.map(loc => {
           const coverImg = (loc.images && loc.images.length > 0) ? loc.images[0] : loc.imageUrl;
           const imgCount = loc.images ? loc.images.length : 1;
           return (
            <div 
              key={loc.id} 
              onClick={() => setSelectedLoc(loc)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-emerald-400 transition group"
            >
               <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                 <img src={coverImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={loc.name} />
                 {loc.style && (
                   <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                     {loc.style}
                   </span>
                 )}
                 {imgCount > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                      +{imgCount - 1}
                    </span>
                 )}
               </div>
               <div className="p-3 flex-1">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{loc.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                     <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                     <span className="truncate">{loc.address}</span>
                  </div>
                  <div className="mt-2 text-xs font-medium text-emerald-600">{loc.cost}</div>
               </div>
            </div>
           );
        })}
      </div>

      {/* Details Modal */}
      {selectedLoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative flex flex-col md:flex-row gap-6">
             <button onClick={() => setSelectedLoc(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">✕</button>
             
             {/* Gallery */}
             <div className="w-full md:w-1/2 flex flex-col gap-3">
                <div 
                  className="w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
                  onClick={() => openViewer(selectedLoc.images || [selectedLoc.imageUrl || ''], 0)}
                >
                   <img src={(selectedLoc.images && selectedLoc.images[0]) || selectedLoc.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-5 gap-2">
                   {selectedLoc.images?.map((img, idx) => (
                     <div 
                       key={idx} 
                       className="aspect-square rounded overflow-hidden cursor-pointer border hover:border-emerald-500"
                       onClick={() => openViewer(selectedLoc.images || [], idx)}
                     >
                       <img src={img} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
             </div>

             {/* Details */}
             <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">{selectedLoc.name}</h3>
                
                <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                   <div className="flex justify-between border-b pb-2 border-gray-200">
                     <span className="text-gray-500">费用</span>
                     <span className="font-medium text-emerald-600">{selectedLoc.cost}</span>
                   </div>
                   <div className="flex justify-between border-b pb-2 border-gray-200">
                     <span className="text-gray-500">风格</span>
                     <span className="font-medium">{selectedLoc.style}</span>
                   </div>
                   <div className="flex justify-between border-b pb-2 border-gray-200">
                     <span className="text-gray-500">联系人</span>
                     <span className="font-medium">{selectedLoc.contact}</span>
                   </div>
                   <div>
                      <span className="block text-gray-500 mb-1">地址</span>
                      <span className="font-medium">{selectedLoc.address}</span>
                   </div>
                </div>

                <div className="text-sm">
                   <h4 className="font-bold mb-1 text-gray-700">要求/限制:</h4>
                   <p className="text-gray-600">{selectedLoc.requirements || '无特殊要求'}</p>
                </div>
                <div className="text-sm">
                   <h4 className="font-bold mb-1 text-gray-700">备注:</h4>
                   <p className="text-gray-600 italic">{selectedLoc.notes || '无'}</p>
                </div>

                <div className="flex justify-end pt-4">
                   <button onClick={(e) => handleDelete(selectedLoc.id, e)} className="text-red-500 text-sm hover:underline flex gap-1">
                      <TrashIcon className="w-4 h-4"/> 删除场地
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationLibrary;