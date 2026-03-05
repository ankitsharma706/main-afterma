import { Camera, Check, ClipboardList, Info, MapPin, Phone, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { userAPI } from '../services/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://aftermabk.onrender.com';

const FormSection = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`p-6 lg:p-8 bg-[#f8f9fb]/50 border border-[#eef2f6] rounded-[1rem] space-y-6 transition-all hover:bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)] ${className}`}>
    <div className="flex items-center gap-3 pb-1">
      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-50 text-[#8b9bb4]">
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <h3 className="text-[11px] font-black text-[#8b9bb4] uppercase tracking-[0.25em]">{title}</h3>
    </div>
    {children}
  </div>
);

const PersonalDataForm = ({ profile, updateProfile, saveStatus }) => {
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [localSaveStatus, setLocalSaveStatus] = useState('idle');

  useEffect(() => {
    if (profile && !originalProfile) {
      setOriginalProfile({ ...profile });
    }
  }, [profile, originalProfile]);

  const saveProfile = async () => {
    setLocalSaveStatus("saving");

    try {
      const payload = {};
      
      // Map frontend profile fields → backend User model field names
      const mappings = {
        full_name:     profile.name,
        dob:           profile.dob,
        blood_group:   profile.bloodGroup,
        aadhar_number: profile.aadhaarNumber || profile.aadharNumber,
        phone:         profile.phone1 || profile.phone,        // model has single 'phone'
        height_cm:     profile.height,
        weight_kg:     profile.weight,
        address:       profile.address,
        city:          profile.city,
        state:         profile.state,
        pincode:       profile.pincode,
        phase:         profile.maternityStage || profile.phase,
        delivery_type: profile.deliveryType  || profile.delivery_type,
        symptoms:      profile.symptoms,
      };

      const originalMappings = originalProfile ? {
        full_name:     originalProfile.name,
        dob:           originalProfile.dob,
        blood_group:   originalProfile.bloodGroup,
        aadhar_number: originalProfile.aadhaarNumber || originalProfile.aadharNumber,
        phone:         originalProfile.phone1 || originalProfile.phone,
        height_cm:     originalProfile.height,
        weight_kg:     originalProfile.weight,
        address:       originalProfile.address,
        city:          originalProfile.city,
        state:         originalProfile.state,
        pincode:       originalProfile.pincode,
        phase:         originalProfile.maternityStage || originalProfile.phase,
        delivery_type: originalProfile.deliveryType  || originalProfile.delivery_type,
        symptoms:      originalProfile.symptoms,
      } : {};

      // Only send changed fields
      for (const [key, value] of Object.entries(mappings)) {
         if (value !== undefined && value !== null && value !== originalMappings[key]) {
            payload[key] = value;
         }
      }

      // Explicitly remove any photo/avatar inside the payload explicitly
      delete payload.avatar;
      delete payload.profile_picture;
      delete payload.photo;

      if (Object.keys(payload).length === 0) {
        setLocalSaveStatus("saved");
        console.log("No fields changed.");
        setTimeout(() => setLocalSaveStatus("idle"), 2000);
        return; 
      }

      console.log("Sending payload:", payload);

      await userAPI.updateMe(payload);

      setLocalSaveStatus("saved");
      setOriginalProfile({ ...profile });
      setTimeout(() => setLocalSaveStatus("idle"), 2000);

    } catch (err) {
      console.error("Profile update failed:", err?.message || err);
      setLocalSaveStatus("error");
      setTimeout(() => setLocalSaveStatus("idle"), 2000);
    }
  };

  const handleChange = (name, value) => {
    updateProfile({ [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        updateProfile({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (profile?.dob) {
      const birthDate = new Date(profile.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age >= 0 && age !== profile.age) {
        updateProfile({ age });
      }
    }
  }, [profile?.dob]);

  return (
    <div className="w-full animate-in fade-in duration-500 pb-2">
      <div className="bg-white rounded-[1rem] p-1 lg:p-2 relative overflow-hidden">
        
        {/* Header Section */}
        <div className="mb-2 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-3">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Personal Data
            </h2>
            <p className="text-sm lg:text-base text-slate-400 font-medium italic opacity-80">
              Essential information for personalized care logic.
            </p>
          </div>

          <div className="relative group shrink-0 self-center md:self-start">
            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-[1rem] border-4 border-white overflow-hidden bg-[#f8f9fb] flex flex-col items-center justify-center relative shadow-xl cursor-pointer transition-all hover:scale-105 active:scale-95 group-hover:shadow-rose-100">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#8b9bb4]">
                  <Camera size={28} strokeWidth={2} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                </div>
              )}
              
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white">
                <Camera size={28} />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-xl shadow-lg border border-slate-50 text-slate-400 group-hover:text-rose-400 transition-colors">
               <Camera size={14} />
            </div>
          </div>
        </div>

        {/* Unified Form Modules */}
        <div className="space-y-6">
          
          {/* Section 1: Identity */}
          <FormSection title="Basic Identity" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="md:col-span-2 lg:col-span-6 space-y-2">
                <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Full Name</label>
                <input 
                  type="text" 
                  value={profile?.name || ''} 
                  onChange={e => handleChange('name', e.target.value)} 
                  placeholder="e.g. Monalisa Devi"
                  className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm placeholder:text-slate-300" 
                />
              </div>
              
            <div className="md:col-span-2 lg:col-span-6 grid grid-cols-3 gap-6 relative">

  {/* DOB (Wider) */}
  <div className="col-span-2 space-y-2">
    <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">
      DOB
    </label>

    <input
      type="date"
      value={profile?.dob ? new Date(profile.dob).toISOString().split("T")[0] : ""}
      onChange={(e) => handleChange("dob", e.target.value)}
      className="w-full bg-white border border-[#eef2f6] rounded-2xl px-4 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all text-sm uppercase shadow-sm"
    />
  </div>

  {/* AGE (Smaller) */}
  <div className="col-span-1 space-y-2 relative">

    <div className="absolute -top-6 right-1 flex items-center gap-1">
      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full ring-2 ring-white whitespace-nowrap">
        Calculate
      </span>
    </div>

    <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">
      Age
    </label>

    <input
      type="number"
      value={profile?.age || ""}
      onChange={(e) => handleChange("age", parseInt(e.target.value) || 0)}
      className="w-full bg-white border border-[#eef2f6] rounded-2xl px-4 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm"
    />

  </div>

</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Blood Group</label>
                <select 
                  value={profile?.bloodGroup || ''} 
                  onChange={e => handleChange('bloodGroup', e.target.value)} 
                  className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all appearance-none cursor-pointer shadow-sm"
                >
                   <option value="AB+" disabled>Select</option>
                   {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Aadhaar Number</label>
                <input 
                  type="text" 
                  value={profile?.aadhaarNumber || '1234 3456 5678'} 
                  onChange={e => handleChange('aadhaarNumber', e.target.value)} 
                  placeholder="2342 4252 3445 245"
                  className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm placeholder:text-slate-300" 
                />
              </div>
            </div>
          </FormSection>

          {/* Section 2: Communication */}
          <FormSection title="Contacts & Vitals" icon={Phone}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Phone 1</label>
                <input type="tel" value={profile?.phone1 || '+91-9123456789'} onChange={e => handleChange('phone1', e.target.value)} className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Phone - 2</label>
                <input type="tel" value={profile?.phone2 || '+91-9123456789'} onChange={e => handleChange('phone2', e.target.value)} className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Height (cm)</label>
                <input type="text" value={profile?.height || '174 cm'} onChange={e => handleChange('height', e.target.value)} className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Weight (kg)</label>
                <input type="text" value={profile?.weight || '60 kg'} onChange={e => handleChange('weight', e.target.value)} className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm" />
              </div>
            </div>
          </FormSection>

          {/* Section 3: Location */}
          <FormSection title="Full Address" icon={MapPin}>
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Residential Address</label>
                <textarea 
                  value={profile?.address || 'Plot No 123, Gandamunda'} 
                  onChange={e => handleChange('address', e.target.value)} 
                  rows="2" 
                  className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all resize-none shadow-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">City</label>
                  <input type="text" value={profile?.city || 'Bhubaneswar'} onChange={e => handleChange('city', e.target.value)} className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Pincode</label>
                  <input type="text" value={profile?.pincode || '751030'} onChange={e => handleChange('pincode', e.target.value)} className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">State</label>
                  <input type="text" value={profile?.state || 'Odisha'} onChange={e => handleChange('state', e.target.value)} className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Country</label>
                  <input type="text" value={profile?.country || 'India'} onChange={e => handleChange('country', e.target.value)} className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm" />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Section 4: History */}
          <FormSection title="Clinical Profile" icon={ClipboardList}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#8b9bb4] uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                  <ClipboardList size={12} strokeWidth={3} /> Medical History
                </label>
                <textarea 
                  value={profile?.medicalHistory || 'No known medical history'} 
                  onChange={e => handleChange('medicalHistory', e.target.value)} 
                  rows="3" 
                  className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all resize-none shadow-sm"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#8b9bb4] uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                  <Info size={12} strokeWidth={3} /> Allergies
                </label>
                <textarea 
                  value={profile?.allergies || 'No known allergies'} 
                  onChange={e => handleChange('allergies', e.target.value)} 
                  rows="3" 
                  className="w-full bg-white border border-[#eef2f6] rounded-2xl px-5 py-3.5 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all resize-none shadow-sm"
                ></textarea>
              </div>
            </div>
          </FormSection>

          <div className="flex justify-end pt-8">
             <button onClick={saveProfile} className="bg-slate-900 text-white px-10 py-4 lg:py-5 rounded-[1rem] font-bold text-sm lg:text-base uppercase tracking-[0.2em] lg:tracking-[0.25em] shadow-[0_15px_40px_rgba(15,23,42,0.2)] hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-3 lg:gap-4 group">
               {localSaveStatus === 'saving' ? (
                 <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
               ) : localSaveStatus === 'saved' ? (
                 <Check size={20} />
               ) : (
                 <Save size={20} className="group-hover:rotate-12 transition-transform" />
               )}
               {localSaveStatus === 'saving' ? 'Syncing...' : localSaveStatus === 'saved' ? 'Saved' : 'Complete Profile'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDataForm;
