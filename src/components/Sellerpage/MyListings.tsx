"use client"
import React, { useEffect, useMemo, useState } from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'
import Image from 'next/image'
import {
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
  type Vehicle
} from '../../services/Vehicle'
import {
  getMyBatteries,
  updateBattery,
  deleteBattery,
  type Battery
} from '../../services/Battery'
import { useToast } from '../../hooks/useToast'
import { ToastContainer } from '../common/Toast'

type ListingType = 'vehicle' | 'battery'

function MyListings() {
  const { t } = useI18nContext()
  const { toasts, success, error: showError, removeToast } = useToast()
  const [filter, setFilter] = useState<'all' | 'active' | 'sold'>('all')
  const [tab, setTab] = useState<ListingType>('vehicle')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [batteries, setBatteries] = useState<Battery[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editType, setEditType] = useState<ListingType>('vehicle')
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<any>({ 
    title: '', 
    price: '', 
    year: '', 
    mileage: '', 
    description: '', 
    brand: '',
    model: '',
    status: 'AVAILABLE',
    capacity: '', 
    health: '' 
  })
  const [editImages, setEditImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const inputClass = "w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all font-medium"

  // Image handling functions
  const openFilePicker = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = () => {
      const files = Array.from(input.files || [])
      handleNewFiles(files)
    }
    input.click()
  }

  const handleNewFiles = (files: File[]) => {
    if (!files.length) return
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setNewImages(prev => [...prev, ...files])
    setImagePreviews(prev => [...prev, ...newPreviews])
    success(t('toast.imageUploadSuccess', `Uploaded ${files.length} image${files.length > 1 ? 's' : ''} successfully!`))
  }

  const removeExistingImage = (index: number) => {
    setEditImages(prev => prev.filter((_, i) => i !== index))
    success(t('toast.imageRemoveSuccess', 'Image removed successfully!'))
  }

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    success(t('toast.imageRemoveSuccess', 'Image removed successfully!'))
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [vRes, bRes] = await Promise.all([getMyVehicles(), getMyBatteries()])
        if (vRes.success) setVehicles(vRes.data?.vehicles || [])
        if (bRes.success) setBatteries(bRes.data?.batteries || [])
        if (!vRes.success || !bRes.success) setError(vRes.message || bRes.message)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load listings')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const listings = useMemo(() => {
    if (tab === 'vehicle') return vehicles.map(v => ({
      id: v.id,
      type: 'vehicle' as const,
      title: v.title,
      price: `$${Number(v.price).toLocaleString()}`,
      status: v.status === 'SOLD' ? 'sold' : 'active',
      image: v.images?.[0] || '/Homepage/TopCar.png',
      specs: { 
        mileage: `${v.mileage?.toLocaleString()} km`, 
        battery: v.specifications?.batteryAndCharging?.range ? `${v.specifications.batteryAndCharging.range} km range` : '', 
        year: v.year ? `${v.year}` : '',
        brand: v.brand || '',
        model: v.model || ''
      }
    }))
    return batteries.map(b => ({
      id: b.id,
      type: 'battery' as const,
      title: b.title,
      price: `$${Number(b.price).toLocaleString()}`,
      status: b.status === 'SOLD' ? 'sold' : 'active',
      image: b.images?.[0] || '/Homepage/Car.png',
      specs: { 
        capacity: b.capacity ? `${b.capacity} kWh` : '', 
        health: `${b.health}% health`, 
        year: b.year ? `${b.year}` : '',
        brand: b.brand || ''
      }
    }))
  }, [tab, vehicles, batteries])

  const filteredListings = listings.filter(l => (filter === 'all' ? true : l.status === filter))

  const openEdit = (item: { id: string, type: ListingType }) => {
    setEditType(item.type)
    setEditId(item.id)
    if (item.type === 'vehicle') {
      const v = vehicles.find(v => v.id === item.id)
      const formData = {
        title: v?.title || '',
        price: String(v?.price ?? ''),
        year: String(v?.year ?? ''),
        mileage: String(v?.mileage ?? ''),
        description: v?.description || '',
        brand: v?.brand || '',
        model: v?.model || '',
        status: v?.status || 'AVAILABLE'
      }
      setForm(formData)
      // Set existing images
      setEditImages(v?.images || [])
      setNewImages([])
      setImagePreviews([])
    } else {
      const b = batteries.find(b => b.id === item.id)
      const formData = {
        title: b?.title || '',
        price: String(b?.price ?? ''),
        year: String(b?.year ?? ''),
        capacity: String(b?.capacity ?? ''),
        health: String(b?.health ?? ''),
        description: b?.description || ''
      }
      setForm(formData)
      // Set existing images
      setEditImages(b?.images || [])
      setNewImages([])
      setImagePreviews([])
    }
    setIsModalOpen(true)
  }

  const onDelete = async (item: { id: string, type: ListingType }) => {
    if (!confirm('Xóa tin này?')) return
    try {
      if (item.type === 'vehicle') {
        const res = await deleteVehicle(item.id)
        if (!res.success) throw new Error(res.message)
        setVehicles(prev => prev.filter(v => v.id !== item.id))
        success(t('toast.vehicleDeleteSuccess', 'Vehicle deleted successfully!'))
      } else {
        const res = await deleteBattery(item.id)
        if (!res.success) throw new Error(res.message)
        setBatteries(prev => prev.filter(b => b.id !== item.id))
        success(t('toast.batteryDeleteSuccess', 'Battery deleted successfully!'))
      }
    } catch (e) {
      showError(e instanceof Error ? e.message : t('toast.deleteFailed', 'Delete failed'))
    }
  }

  const onSave = async () => {
    if (!editId) return
    try {
      if (editType === 'vehicle') {
        const res = await updateVehicle(editId, {
          title: form.title,
          price: Number(form.price) || undefined,
          year: Number(form.year) || undefined,
          mileage: Number(form.mileage) || undefined,
          description: form.description,
          brand: form.brand,
          model: form.model,
          status: form.status,
          images: newImages.length > 0 ? newImages : undefined // Only send new images if there are any
        })
        if (!res.success) throw new Error(res.message)
        // Fix: Handle nested data structure properly
        const updatedVehicle = (res.data as any)?.vehicle || res.data
        setVehicles(prev => prev.map(v => v.id === editId ? { ...v, ...updatedVehicle } : v))
        success(t('toast.vehicleUpdateSuccess', 'Vehicle updated successfully!'))
      } else {
        const res = await updateBattery(editId, {
          title: form.title,
          price: Number(form.price) || undefined,
          year: Number(form.year) || undefined,
          capacity: Number(form.capacity) || undefined,
          health: Number(form.health) || undefined,
          description: form.description,
          images: newImages.length > 0 ? newImages : undefined // Only send new images if there are any
        })
        if (!res.success) throw new Error(res.message)
        // Fix: Handle nested data structure properly - battery data is in res.data.battery
        const updatedBattery = (res.data as any)?.battery || res.data
        setBatteries(prev => prev.map(b => b.id === editId ? { ...b, ...updatedBattery } : b))
        success(t('toast.batteryUpdateSuccess', 'Battery updated successfully!'))
      }
      setIsModalOpen(false)
    } catch (e) {
      showError(e instanceof Error ? e.message : t('toast.updateFailed', 'Update failed'))
    }
  }

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'active':
  //       return 'bg-green-100 text-green-800'
  //     case 'sold':
  //       return 'bg-gray-100 text-gray-800'
  //     default:
  //       return 'bg-gray-100 text-gray-800'
  //   }
  // }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.Text }}>{t('seller.listings.title')}</h2>
          <p className="text-sm mt-1" style={{ color: colors.SubText }}>{t('seller.listings.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTab('vehicle')} 
            className={`px-3 py-2 rounded font-medium transition-colors ${
              tab==='vehicle'
                ?'bg-blue-600 text-white shadow-md'
                :'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            Vehicle
          </button>
          <button 
            onClick={() => setTab('battery')} 
            className={`px-3 py-2 rounded font-medium transition-colors ${
              tab==='battery'
                ?'bg-blue-600 text-white shadow-md'
                :'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            Battery
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => setFilter('all')} 
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
            filter==='all'
              ?'bg-blue-600 text-white shadow-md'
              :'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {t('seller.listings.all')}
        </button>
        <button 
          onClick={() => setFilter('active')} 
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
            filter==='active'
              ?'bg-blue-600 text-white shadow-md'
              :'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {t('seller.listings.active')}
        </button>
        <button 
          onClick={() => setFilter('sold')} 
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
            filter==='sold'
              ?'bg-blue-600 text-white shadow-md'
              :'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {t('seller.listings.sold')}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
            {/* Image Section */}
            <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                  item.status === 'active' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {item.status === 'active' ? ' Còn hàng' : ' Đã bán'}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
                  {item.type === 'vehicle' ? ' Xe điện' : ' Pin'}
                </span>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                  {item.specs.brand && (
                    <p className="text-sm text-gray-600 font-medium">
                      {item.specs.brand} 
                      {'model' in item.specs && item.specs.model ? ` ${item.specs.model}` : ''}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600">{item.price}</span>
                </div>
              </div>
              
              {/* Specifications */}
              <div className="space-y-2 mb-6">
                {item.type === 'vehicle' ? (
                  <>
                    {item.specs.year && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.year}</span>
                      </div>
                    )}
                    {item.specs.mileage && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.mileage}</span>
                      </div>
                    )}
                    {item.specs.battery && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.battery}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {item.specs.year && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.year}</span>
                      </div>
                    )}
                    {item.specs.capacity && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.capacity}</span>
                      </div>
                    )}
                    {item.specs.health && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.health}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => openEdit({ id: item.id, type: tab })} 
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Chỉnh sửa
                </button>
                <button 
                  onClick={() => onDelete({ id: item.id, type: tab })} 
                  className="px-4 py-3 border-2 border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium" style={{ color: colors.Text }}>{t('seller.listings.noListings')}</h3>
          <p className="text-sm" style={{ color: colors.SubText }}>{t('seller.listings.noListingsDesc')}</p>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-gray-800 mb-2 font-semibold">{editType === 'vehicle' ? 'Chỉnh sửa xe' : 'Chỉnh sửa pin'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Tiêu đề <span className="text-red-600 font-bold">*</span>
                </label>
                <input className={inputClass} value={form.title} onChange={e=>setForm((p:any)=>({...p,title:e.target.value}))} placeholder="Nhập tiêu đề xe/pin" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Giá (VNĐ) <span className="text-red-600 font-bold">*</span>
                </label>
                <input type="number" className={inputClass} value={form.price} onChange={e=>setForm((p:any)=>({...p,price:e.target.value}))} placeholder="Nhập giá" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Năm sản xuất <span className="text-red-600 font-bold">*</span>
                </label>
                <input type="number" className={inputClass} value={form.year} onChange={e=>setForm((p:any)=>({...p,year:e.target.value}))} placeholder="Nhập năm" />
              </div>
              {editType === 'vehicle' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Số km đã chạy <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input type="number" className={inputClass} value={form.mileage || ''} onChange={e=>setForm((p:any)=>({...p,mileage:e.target.value}))} placeholder="Nhập số km" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Hãng xe <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input className={inputClass} value={form.brand || ''} onChange={e=>setForm((p:any)=>({...p,brand:e.target.value}))} placeholder="Nhập hãng xe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Dòng xe <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input className={inputClass} value={form.model || ''} onChange={e=>setForm((p:any)=>({...p,model:e.target.value}))} placeholder="Nhập dòng xe" />
                  </div>
                 
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Dung lượng (kWh) <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input type="number" className={inputClass} value={form.capacity || ''} onChange={e=>setForm((p:any)=>({...p,capacity:e.target.value}))} placeholder="Nhập dung lượng" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Tình trạng (%) <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input type="number" className={inputClass} value={form.health || ''} onChange={e=>setForm((p:any)=>({...p,health:e.target.value}))} placeholder="Nhập tình trạng" />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Mô tả <span className="text-red-600 font-bold">*</span>
                </label>
                <textarea className={inputClass} rows={4} value={form.description} onChange={e=>setForm((p:any)=>({...p,description:e.target.value}))} placeholder="Nhập mô tả chi tiết..." />
              </div>
              
              {/* Image Management Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">Hình ảnh</label>
                
                {/* Existing Images */}
                {editImages.length > 0 && (
                  <div className="mb-4">
                    {/* <h4 className="text-sm font-medium mb-2">Hình ảnh hiện tại:</h4> */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {editImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`existing-${index}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Images */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">Hình ảnh mới</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`new-${index}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            onClick={() => removeNewImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add Images Button */}
                <button
                  onClick={openFilePicker}
                  className="w-full py-4 px-6 border-2 border-dashed border-gray-400 rounded-lg text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Thêm hình ảnh mới</span>
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={()=>setIsModalOpen(false)} 
                className="px-6 py-3 border-2 border-gray-400 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-500 transition-colors font-semibold"
              >
                Hủy
              </button>
              <button 
                onClick={onSave} 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyListings
