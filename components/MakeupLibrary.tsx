import React, { useState } from 'react';
import { MakeupArtist } from '../types';
import { PlusIcon, MapPinIcon, ImageIcon, TrashIcon } from './Icons';

interface MakeupLibraryProps {
  artists: MakeupArtist[];
  setArtists: React.Dispatch<React.SetStateAction<MakeupArtist[]>>;
}

const MakeupLibrary: React.FC<MakeupLibraryProps> = ({ artists, setArtists }) => {
  const [isAdding, setIsAdding] = useState(false);
  
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
          if (reader.result) {
            setImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newArtist: MakeupArtist = {
      id: Date.now().toString(),
      name,
      contact,
      baseLocation: location,
      rates,
      returnRequirements: requirements,
      notes,
      portfolioImages: images
    };
    setArtists([...artists, newArtist]);
    setIsAdding(false);
    // Reset
    setName(''); setContact(''); setLocation(''); setRates(''); 
    setRequirements(''); setNotes(''); setImages([]);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要移除这位化妆师的档案吗？')) {
      setArtists(artists.filter(a => a.id !== id));
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="化妆师姓名/昵称" value={name} onChange={e => setName(e.target.value)} className="input-field" />
              <input required placeholder="联系方式 (电话/微信)" value={contact} onChange={e => setContact(e.target.value)} className="input-field" />
              <input placeholder="常驻地点/化妆地点" value={location} onChange={e => setLocation(e.target.value)} className="input-field" />
              <input placeholder="收费标准 (如：300/妆面)" value={rates} onChange={e => setRates(e.target.value)} className="input-field" />
            </div>
            <input placeholder="返图要求 (如：需9张精修返图)" value={requirements} onChange={e => setRequirements(e.target.value)} className="input-field w-full" />
            <textarea placeholder="备注信息 (擅长风格等)" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="input-field w-full" />
            
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">作品集 (妆面展示)</label>
               <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded overflow-hidden bg-gray-100 group">
                       <img src={img} className="w-full h-full object-cover" />
                       <button type="button" onClick={() => handleDeleteImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                         <TrashIcon className="w-3 h-3"/>
                       </button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 hover:border-emerald-400 transition text-gray-400 hover:text-emerald-500">
                     <ImageIcon className="w-6 h-6 mb-1"/>
                     <span className="text-xs">上传</span>
                     <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload}/>
                  </label>
               </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-100 rounded text-gray-600">取消</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">保存</button>
            </div>
          </form>
          <style>{`
            .input-field {
              width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; outline: none;
            }
            .input-field:focus { border-color: #10b981; }
          `}</style>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {artists.length === 0 && !isAdding && (
           <p className="col-span-full text-center text-gray-500 py-10">暂无合作化妆师，请点击右上角登记。</p>
        )}
        {artists.map(artist => (
          <div key={artist.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition relative group">
             <button 
               onClick={() => handleDelete(artist.id)}
               className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
             >
               <TrashIcon className="w-5 h-5" />
             </button>
             
             <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold flex-shrink-0">
                  {artist.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{artist.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPinIcon className="w-3 h-3"/> {artist.baseLocation || '位置未填写'}
                  </div>
                </div>
             </div>

             <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex justify-between">
                   <span className="text-gray-400">联系方式:</span>
                   <span className="font-medium">{artist.contact}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-400">收费标准:</span>
                   <span className="font-medium text-emerald-600">{artist.rates}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-400">返图要求:</span>
                   <span className="font-medium">{artist.returnRequirements || '无'}</span>
                </div>
             </div>
             
             {artist.notes && (
               <p className="text-xs text-gray-500 italic mb-3">备注: {artist.notes}</p>
             )}

             <div className="grid grid-cols-4 gap-2">
                {artist.portfolioImages.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="aspect-square rounded bg-gray-100 overflow-hidden border border-gray-100">
                    <img src={img} className="w-full h-full object-cover" />
                  </div>
                ))}
                {artist.portfolioImages.length > 4 && (
                  <div className="aspect-square rounded bg-emerald-50 flex items-center justify-center text-xs text-emerald-600 font-bold">
                    +{artist.portfolioImages.length - 4}
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MakeupLibrary;