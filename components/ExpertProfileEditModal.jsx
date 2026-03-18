import { X, Upload, User, FileText, Building2, AlignLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { expertAPI } from '../services/api';

const ExpertProfileEditModal = ({ isOpen, onClose, initialData, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    registration_number: '',
    licensing_authority: '',
    specialization: 'General',
    years_experience: '',
    qualifications: '',
    clinic_name: '',
    practice_type: 'Clinic',
    address: '',
    city: '',
    state: '',
    country: '',
    bio: '',
    expertise: '',
    languages: '',
  });

  const [files, setFiles] = useState({
    profile_photo: null,
    registration_cert: null,
    degree_cert: null,
    id_proof: null,
  });

  const [previews, setPreviews] = useState({
    profile_photo: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        gender: initialData.gender || '',
        qualifications: initialData.qualifications || '',
        clinic_name: initialData.facility_name || initialData.clinic_name || '',
        practice_type: initialData.practice_type || 'Clinic',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || 'India',
        bio: initialData.bio || '',
        expertise: initialData.expertise ? (Array.isArray(initialData.expertise) ? initialData.expertise.join(', ') : initialData.expertise) : '',
        languages: initialData.languages || '',
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTextChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [fieldName]: 'File size must be under 5MB' }));
      return;
    }

    setErrors(prev => ({ ...prev, [fieldName]: null }));
    setFiles(prev => ({ ...prev, [fieldName]: file }));

    if (fieldName === 'profile_photo') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, profile_photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // scroll to top or alert roughly
      const firstError = Object.keys(errors)[0];
      const el = document.getElementsByName(firstError)[0];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      setIsSubmitting(true);
      
      {/* We upload text fields first. In a real app we'd construct a FormData with files. */}
      {/* Assuming REST API supports JSON for now: */}
      const payload = {
        ...formData,
        facility_name: formData.clinic_name, // Map back if needed
        designation: formData.specialization, // Map back to designation if used
        expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean),
      };

      const res = await expertAPI.updateProfile(payload);
      
      // Note: File uploads usually require a FormData post request. Placed placeholders here.
      // if (files.profile_photo) await uploadFile(files.profile_photo, 'profile'); ...

      if (res?.data?.doctor || res) {
        onSaveSuccess(res.data?.doctor || payload);
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3"><User size={20} className="text-blue-500" /> Edit Professional Profile</h2>
          <p className="text-sm font-medium text-slate-400 mt-2">Update your medical credentials and practice details</p>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-12">
            
            {errors.submit && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold text-sm">
                <AlertCircle size={20} /> {errors.submit}
              </div>
            )}

            {/* SECTION 1: BASIC INFO */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-50">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><User size={20} /></div>
                <h3 className="text-xl font-bold text-slate-800">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-1 md:col-span-2 flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md overflow-hidden flex items-center justify-center shrink-0">
                    {previews.profile_photo ? (
                      <img src={previews.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-slate-200">{formData.name?.[0] || 'U'}</span>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all">
                      <Upload size={14} /> Upload Photo
                      <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={(e) => handleFileChange(e, 'profile_photo')} />
                    </label>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-3 text-left">Max 5MB (JPG/PNG)</p>
                    {errors.profile_photo && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.profile_photo}</p>}
                  </div>
                </div>

                <InputField label="Full Name *" name="name" value={formData.name} onChange={handleTextChange} error={errors.name} />
                <InputField label="Email Address" name="email" value={formData.email} readOnly />
                <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleTextChange} />
                
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleTextChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  >
                    <option value="">Select (Optional)</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 2: ADDITIONAL PROFESSIONAL */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-50">
                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl"><ShieldCheck size={20} /></div>
                <h3 className="text-xl font-bold text-slate-800">Additional Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="col-span-1 md:col-span-2">
                  <InputField label="Qualifications" name="qualifications" value={formData.qualifications} onChange={handleTextChange} placeholder="e.g. MBBS, MD (Obstetrics)" />
                </div>
              </div>
            </section>

            {/* SECTION 3: PRACTICE */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-50">
                <div className="p-2 bg-purple-50 text-purple-500 rounded-xl"><Building2 size={20} /></div>
                <h3 className="text-xl font-bold text-slate-800">Practice Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Practice Type</label>
                  <select 
                    name="practice_type" 
                    value={formData.practice_type} 
                    onChange={handleTextChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  >
                    <option value="Clinic">Clinic</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Teleconsultation">Teleconsultation Only</option>
                    <option value="Mixed">Mixed (Offline + Online)</option>
                  </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <InputField label="Address" name="address" value={formData.address} onChange={handleTextChange} />
                </div>
                <InputField label="City" name="city" value={formData.city} onChange={handleTextChange} />
                <InputField label="State" name="state" value={formData.state} onChange={handleTextChange} />
                <InputField label="Country" name="country" value={formData.country} onChange={handleTextChange} />
              </div>
            </section>

            {/* SECTION 4: BIO */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-50">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><AlignLeft size={20} /></div>
                <h3 className="text-xl font-bold text-slate-800">Bio & Profile</h3>
              </div>

              <div className="grid grid-cols-1 gap-6 text-left">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Short Bio</label>
                  <textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleTextChange}
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                    placeholder="Tell us a bit about your medical journey and philosophy..."
                  />
                </div>
                <InputField label="Areas of Expertise (Comma Separated)" name="expertise" value={formData.expertise} onChange={handleTextChange} placeholder="e.g. Postpartum Care, PCOS, Nutrition" />
                <InputField label="Languages Spoken" name="languages" value={formData.languages} onChange={handleTextChange} placeholder="e.g. English, Hindi, Tamil" />
              </div>
            </section>

            {/* ACTIONS */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-4 sticky bottom-0 bg-white shadow-[-10px_-20px_20px_white]">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3.5 text-slate-500 font-bold text-sm tracking-wide hover:bg-slate-50 rounded-xl transition-all"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-slate-900 text-white font-bold text-sm tracking-wide rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <><CheckCircle2 size={18} /> Save Profile</>
                )}
              </button>
            </div>

      </form>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type = "text", error, readOnly, placeholder }) => (
  <div className="space-y-2 text-left w-full">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full px-5 py-3.5 bg-slate-50 border ${error ? 'border-rose-300' : 'border-slate-100'} rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
    />
    {error && <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest px-2">{error}</span>}
  </div>
);

const DocumentUploader = ({ label, name, file, onChange, error, accept }) => (
  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 border-dashed text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-300 hover:bg-blue-50/30 transition-all">
    <div className={`p-3 rounded-2xl mb-3 ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-300 group-hover:text-blue-500 shadow-sm'}`}>
      {file ? <CheckCircle2 size={24} /> : <Upload size={24} />}
    </div>
    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">{label}</h4>
    <p className="text-[10px] text-slate-400 font-medium">{file ? file.name : 'Max 5MB (PDF, JPG)'}</p>
    
    <input 
      type="file" 
      name={name}
      accept={accept}
      onChange={(e) => onChange(e, name)}
      className="absolute inset-0 opacity-0 cursor-pointer"
    />
    {error && <p className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{error}</p>}
  </div>
);

export default ExpertProfileEditModal;
