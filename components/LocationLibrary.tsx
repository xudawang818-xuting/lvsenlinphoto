import React, { useState } from 'react';
import { LocationPartner } from '../types';
import { PlusIcon, MapPinIcon, ImageIcon, TrashIcon } from './Icons';

interface LocationLibraryProps {
  locations: LocationPartner[];
  setLocations: React.Dispatch<React.SetStateAction<LocationPartner[]>>;
}

const LocationLibrary: React.FC<LocationLibraryProps> = ({ locations, setLocations }) => {
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [style, setStyle] = useState('');
  const [contact, setContact] = useState('');
  const [cost, setCost] = useState('');
  const [requirements, setRequirements] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoc: LocationPartner = {
      id: Date.now().toString(),
      name, address, style, contact, cost, requirements, notes,
      imageUrl: image || `https://picsum.photos/300/200?random=${Date.now()}`
    };
    setLocations([...locations, newLoc]);
    setIsAdding(false);
    // Reset
    setName(''); setAddress(''); setStyle(''); setContact('');
    setCost(''); setRequirements(''); setNotes(''); setImage('');
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个场地资源吗？')) {
      setLocations(locations.filter(l => l.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-900">场地合作资源</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="场地名称" value={name} onChange={e => setName(e.target.value)} className="input-field" />
              <input required placeholder="具体地址" value={address} onChange={e => setAddress(e.target.value)} className="input-field" />
              <input placeholder="适合风格 (如：复古、工业风)" value={style} onChange={e => setStyle(e.target.value)} className="input-field" />
              <input required placeholder="联系人电话" value={contact} onChange={e => setContact(e.target.value)} className="input-field" />
              <input placeholder="费用 (如：200/h)" value={cost} onChange={e => setCost(e.target.value)} className="input-field" />
              <input placeholder="场地方要求" value={requirements} onChange={e => setRequirements(e.target.value)} className="input-field" />
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
               <label className="cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-emerald-600 transition">
                 <ImageIcon className="w-8 h-8"/>
                 <span className="text-sm">点击上传场地图片</span>
                 <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>
               </label>
               {image && <img src={image} alt="preview" className="mt-3 h-32 object-cover rounded mx-auto border border-gray-200"/>}
            </div>

            <textarea placeholder="备注信息" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="input-field w-full" />
            
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-100 rounded text-gray-600">取消</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">保存</button>
            </div>
          </form>
          {/* Helper styles injected locally for brevity */}
          <style>{`
            .input-field {
              width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; outline: none;
            }
            .input-field:focus { border-color: #10b981; }
          `}</style>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {locations.map(loc => (
          <div key={loc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition relative group">
             <button 
               onClick={() => handleDelete(loc.id)}
               className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
             >
               <TrashIcon className="w-4 h-4" />
             </button>
             <div className="w-full md:w-1/3 h-48 md:h-auto bg-gray-100 relative">
               <img src={loc.imageUrl} className="w-full h-full object-cover" alt={loc.name} />
               <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                 {loc.style || '通用'}
               </span>
             </div>
             <div className="p-4 flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-800">{loc.name}</h3>
                  <span className="text-emerald-600 font-bold text-sm">{loc.cost}</span>
                </div>
                <div className="text-sm text-gray-600 flex items-start gap-1">
                   <MapPinIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                   {loc.address}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                   <div><span className="font-semibold">联系:</span> {loc.contact}</div>
                   <div><span className="font-semibold">要求:</span> {loc.requirements || '无'}</div>
                </div>
                {loc.notes && <p className="text-xs text-gray-500 italic mt-2">"{loc.notes}"</p>}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationLibrary;