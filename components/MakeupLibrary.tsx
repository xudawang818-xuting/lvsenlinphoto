import React, { useState } from 'react';
import { MakeupArtist } from '../types';
import { PlusIcon, MapPinIcon, ImageIcon, TrashIcon } from './Icons';
import ImageViewer from './ImageViewer';

interface MakeupLibraryProps {
  artists: MakeupArtist[];
  setArtists: React.Dispatch<React.SetStateAction<MakeupArtist[]>>;
}

const MakeupLibrary: React.FC<MakeupLibraryProps> = ({ artists, setArtists }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<MakeupArtist | null>(null);

  // Viewer
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [rates, setRates] = useState('');
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
    const finalImages = images.length > 0 ? images : [`https://picsum.photos/300/400?random=${Date.now()}`];
    const newArtist: MakeupArtist = {
      id: Date.now().toString(),
      name, contact, baseLocation: location, rates, returnRequirements: requirements, notes,
      portfolioImages: finalImages
    };
    setArtists([...artists, newArtist]);
    setIsAdding(false);
    // Reset
    setName(''); setContact(''); setLocation(''); setRates(''); 
    setRequirements(''); setNotes(''); setImages([]);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm('确定要移除这位化妆师的档案吗？')) {
      setArtists(artists.filter(a => a.id !== id));
      if (selectedArtist?.id === id) setSelectedArtist(null);
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
        <h2 className="text-2xl font-bold text-emerald-900">化妆师合作资源</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            登记化妆师
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-100 animate-slide-down">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">登记合作化妆师</h3>
          <form onSubmit={handleAdd} className="space-y-4">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Left: Images */}
               <div className="lg:col-span-1 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">作品展示 (多图)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-[3/4] rounded overflow-hidden border border-gray-200">
                        <img src={img} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl">
                          <TrashIcon className="w-3 h-3"/>
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition aspect-[3/4]">
                      <ImageIcon className="w-6 h-6 text-gray-400"/>
                      <span className="text-xs text-gray-500 mt-1">上传</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
               </div>

               {/* Right: Info */}
               <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="化妆师姓名/昵称" value={name} onChange={e => setName(e.target.value)} className="input-field" />
                  <input required placeholder="联系方式 (电话/微信)" value={contact} onChange={e => setContact(e.target.value)} className="input-field" />
                  <input placeholder="常驻地点/化妆地点" value={location} onChange={e => setLocation(e.target.value)} className="input-field" />
                  <input placeholder="收费标准 (如：300/妆面)" value={rates} onChange={e => setRates(e.target.value)} className="input-field" />
                  <input placeholder="返图要求 (如：需9张精修返图)" value={requirements} onChange={e => setRequirements(e.target.value)} className="input-field w-full md:col-span-2" />
                  <textarea placeholder="备注信息 (擅长风格等)" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="input-field md:col-span-2" />
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.map(artist => {
          const cover = artist.portfolioImages[0];
          return (
          <div key={artist.id} onClick={() => setSelectedArtist(artist)} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col cursor-pointer hover:ring-2 hover:ring-emerald-400 transition group">
             <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                <img src={cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {artist.portfolioImages.length > 1 && (
                  <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                    +{artist.portfolioImages.length - 1}
                  </span>
                )}
             </div>
             <div className="p-3 flex-1">
                <h3 className="font-bold text-gray-800 text-sm">{artist.name}</h3>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                   <MapPinIcon className="w-3 h-3"/> {artist.baseLocation || '未填写'}
                </div>
                <div className="mt-2 text-xs font-medium text-emerald-600">{artist.rates}</div>
             </div>
          </div>
        )})}
      </div>

      {/* Detail Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative flex flex-col md:flex-row gap-6">
             <button onClick={() => setSelectedArtist(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">✕</button>
             
             {/* Gallery */}
             <div className="w-full md:w-1/2 flex flex-col gap-3">
                <div 
                  className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
                  onClick={() => openViewer(selectedArtist.portfolioImages, 0)}
                >
                   <img src={selectedArtist.portfolioImages[0]} className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-5 gap-2">
                   {selectedArtist.portfolioImages.map((img, idx) => (
                     <div 
                       key={idx} 
                       className="aspect-square rounded overflow-hidden cursor-pointer border hover:border-emerald-500"
                       onClick={() => openViewer(selectedArtist.portfolioImages, idx)}
                     >
                       <img src={img} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
             </div>

             {/* Details */}
             <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  {selectedArtist.name}
                </h3>
                
                <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                   <div className="flex justify-between border-b pb-2 border-gray-200">
                     <span className="text-gray-500">收费标准</span>
                     <span className="font-medium text-emerald-600">{selectedArtist.rates}</span>
                   </div>
                   <div className="flex justify-between border-b pb-2 border-gray-200">
                     <span className="text-gray-500">联系方式</span>
                     <span className="font-medium">{selectedArtist.contact}</span>
                   </div>
                   <div className="flex justify-between border-b pb-2 border-gray-200">
                     <span className="text-gray-500">常驻地</span>
                     <span className="font-medium">{selectedArtist.baseLocation}</span>
                   </div>
                   <div>
                      <span className="block text-gray-500 mb-1">返图要求</span>
                      <span className="font-medium">{selectedArtist.returnRequirements || '无'}</span>
                   </div>
                </div>

                <div className="text-sm">
                   <h4 className="font-bold mb-1 text-gray-700">备注:</h4>
                   <p className="text-gray-600 italic">{selectedArtist.notes || '无'}</p>
                </div>

                <div className="flex justify-end pt-4">
                   <button onClick={(e) => handleDelete(selectedArtist.id, e)} className="text-red-500 text-sm hover:underline flex gap-1">
                      <TrashIcon className="w-4 h-4"/> 删除档案
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeupLibrary;