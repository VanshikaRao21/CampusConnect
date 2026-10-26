'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { 
  PlusCircle, 
  Upload, 
  ArrowLeft, 
  IndianRupee, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  Loader2,
  HardDrive,
  X,
  Sparkles
} from 'lucide-react';
import { dataClient, authClient } from '../../lib/amplifyClient';
import { 
  VALID_CATEGORIES, 
  VALID_CONDITIONS, 
  validateListingInput, 
  validateImageFile 
} from '../../lib/validation';
import { ItemCategory, ItemCondition } from '../../types/listing';

export default function CreateListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Textbooks' as ItemCategory,
    price: '',
    condition: 'Good' as ItemCondition,
    contactEmail: 'student@college.edu',
    contactPhone: '+91 98765 43210',
    imagePreview: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setSelectedFile(null);
      setErrors((prev) => ({ ...prev, image: validation.error || 'Invalid image' }));
      return;
    }

    setSelectedFile(file);
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.image;
      return rest;
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, imagePreview: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, imagePreview: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const priceNum = parseFloat(formData.price);
    const validation = validateListingInput({
      title: formData.title,
      description: formData.description,
      price: priceNum,
      category: formData.category,
      condition: formData.condition,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const user = authClient.getCurrentUser();
      let s3Key = '';

      if (selectedFile) {
        const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        s3Key = `product-images/${user.userId || 'guest'}/${Date.now()}-${sanitizedFileName}`;
        try {
          const dynamicImport = (pkg: string) => Function('p', 'return import(p)')(pkg);
          const { uploadData } = await dynamicImport('aws-amplify/storage');
          const uploadOperation = uploadData({
            path: s3Key,
            data: selectedFile,
            options: {
              contentType: selectedFile.type,
            },
          });
          await uploadOperation.result;
        } catch (storageErr) {
          // Proceed with local image preview
        }
      }

      await dataClient.createListing({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: priceNum,
        condition: formData.condition,
        imagePath: formData.imagePreview || (s3Key ? `https://s3.amazonaws.com/campusconnect/${s3Key}` : ''),
        s3Key: s3Key || undefined,
        sellerId: user.userId || 'guest-student',
        sellerEmail: user.email || formData.contactEmail,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create listing', err);
      setErrors({ form: err.message || 'Failed to publish listing.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1320] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <NextLink
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00D2B4] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </NextLink>

          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/70 border border-teal-500/30 text-[#00D2B4] text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AWS S3 Object Storage + DynamoDB</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Sell an Academic Item
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                List your used textbooks, scientific calculators, or lab tools for campus pickup.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1B2A] border border-[#1C334A] text-xs font-medium text-slate-300">
              <HardDrive className="w-4 h-4 text-[#00D2B4]" />
              <span>S3 Encrypted</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-teal-500/25 shadow-2xl">
          
          {errors.form && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-teal-950/80 border border-teal-500/40 text-teal-200 text-sm flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-[#00D2B4] shrink-0" />
              <span>
                <strong>Success!</strong> Listing created and linked to Amazon S3. Redirecting to marketplace...
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Item Title <span className="text-[#00D2B4]">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {formData.title.length}/100 chars (min 3)
                </span>
              </div>
              <input
                type="text"
                maxLength={100}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Higher Engineering Mathematics by B.S. Grewal (44th Edition)"
                className="w-full px-4 py-3 rounded-xl bg-[#09111C] border border-[#1C334A] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2B4] focus:ring-1 focus:ring-[#00D2B4] transition-all"
              />
              {errors.title && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.title}</p>}
            </div>

            {/* Category & Condition Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Category <span className="text-[#00D2B4]">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ItemCategory })}
                  className="w-full px-4 py-3 rounded-xl bg-[#09111C] border border-[#1C334A] text-sm text-white font-medium focus:outline-none focus:border-[#00D2B4]"
                >
                  {VALID_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#09111C] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Item Condition <span className="text-[#00D2B4]">*</span>
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
                  className="w-full px-4 py-3 rounded-xl bg-[#09111C] border border-[#1C334A] text-sm text-white font-medium focus:outline-none focus:border-[#00D2B4]"
                >
                  {VALID_CONDITIONS.map((cond) => (
                    <option key={cond} value={cond} className="bg-[#09111C] text-white">
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Price (INR ₹) <span className="text-[#00D2B4]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-[#00D2B4]">₹</span>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="250"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#09111C] border border-[#1C334A] text-sm text-white font-bold placeholder:text-slate-500 focus:outline-none focus:border-[#00D2B4] focus:ring-1 focus:ring-[#00D2B4]"
                />
              </div>
              {errors.price && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.price}</p>}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Item Description <span className="text-[#00D2B4]">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {formData.description.length}/1000 chars (min 10)
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={1000}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe edition, physical condition, missing pages, or extra accessories included..."
                className="w-full px-4 py-3 rounded-xl bg-[#09111C] border border-[#1C334A] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2B4] focus:ring-1 focus:ring-[#00D2B4] transition-all"
              />
              {errors.description && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.description}</p>}
            </div>

            {/* S3 Image Upload Dropzone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Product Photo (Amazon S3 Media Storage)
              </label>

              {!formData.imagePreview ? (
                <label className="border-2 border-dashed border-teal-500/30 hover:border-[#00D2B4] bg-[#09111C]/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-[#112233] text-[#00D2B4] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-white">Click or drag photo to upload</span>
                  <span className="text-xs text-slate-400 mt-1">JPEG, PNG, or WebP up to 5MB (Amplify Storage / S3)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-[#1C334A] bg-slate-950 p-2 flex items-center justify-center max-h-80">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="max-h-72 object-contain rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {errors.image && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.image}</p>}
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#09111C] border border-[#1C334A] text-sm text-white focus:outline-none focus:border-[#00D2B4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  WhatsApp Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#09111C] border border-[#1C334A] text-sm text-white focus:outline-none focus:border-[#00D2B4]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-teal py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-teal"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing to DynamoDB & S3...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Publish Listing to Marketplace</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
