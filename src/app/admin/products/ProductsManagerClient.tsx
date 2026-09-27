"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ProductItem } from "@/types";
import { Plus, Edit2, Trash2, Upload, Check, X, Star, AlertCircle, Loader2 } from "lucide-react";

export default function ProductsManagerClient({
  initialProducts,
}: {
  initialProducts: ProductItem[];
}) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    compareAtPrice: "",
    category: "UNISEX",
    stock: "50",
    size: "30ml EDP",
    shortDescription: "",
    description: "",
    topNotes: "",
    middleNotes: "",
    baseNotes: "",
    featured: false,
    active: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: `RAZ-${Date.now().toString().slice(-4)}`,
      price: "2350",
      compareAtPrice: "2645",
      category: "UNISEX",
      stock: "50",
      size: "30ml EDP",
      shortDescription: "",
      description: "",
      topNotes: "",
      middleNotes: "",
      baseNotes: "",
      featured: false,
      active: true,
    });
    setImages(["/razen-assets/relma1.png"]);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      price: p.price.toString(),
      compareAtPrice: p.compareAtPrice ? p.compareAtPrice.toString() : "",
      category: p.category,
      stock: p.stock.toString(),
      size: p.size,
      shortDescription: p.shortDescription,
      description: p.description,
      topNotes: p.topNotes,
      middleNotes: p.middleNotes,
      baseNotes: p.baseNotes,
      featured: p.featured,
      active: p.active,
    });
    setImages(p.images?.map((i) => i.imageUrl) || ["/razen-assets/relma1.png"]);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleToggleActive = async (p: ProductItem) => {
    if (togglingId) return; // Prevent double-click
    setTogglingId(p.id);
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, active: !p.active } : item))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return; // Prevent double-click
    if (!confirm("Are you sure you wish to delete this fragrance?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError("");

    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setImages((prev) => [...prev, data.imageUrl]);
    } catch (err: any) {
      setFormError(err.message || "Could not upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return; // Prevent double submission
    setIsSaving(true);
    setFormError("");

    const payload = {
      ...formData,
      images: images.map((url, idx) => ({ imageUrl: url, sortOrder: idx })),
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data.product } : p))
        );
      } else {
        setProducts((prev) => [data.product, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fragrance Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your signature flacons, pricing, stock allocation, and Cloudflare R2 images.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-razen-gold hover:bg-razen-gold-dark text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>Add New Perfume</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Flacon</th>
                <th className="py-3.5 px-6">Name / SKU</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Stock</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const img = p.images?.[0]?.imageUrl || "/razen-assets/relma1.png";
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="relative w-12 h-14 bg-slate-50 rounded border border-slate-100 p-1 flex items-center justify-center">
                        <Image src={img} alt={p.name} fill className="object-contain" />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                        <span>{p.name}</span>
                        {p.featured && (
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">{p.sku}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-semibold ${
                          p.stock < 10 ? "text-red-600 font-bold" : "text-slate-800"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(p)}
                        disabled={togglingId === p.id}
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border transition-colors inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                          p.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {togglingId === p.id && <Loader2 size={10} className="animate-spin" />}
                        <span>{p.active ? "Active" : "Disabled"}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded text-slate-600 hover:text-razen-gold hover:bg-slate-100 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Product"
                      >
                        {deletingId === p.id ? (
                          <Loader2 size={15} className="animate-spin text-red-600" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? `Edit ${editingProduct.name}` : "Create Signature Perfume"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center space-x-2">
                  <AlertCircle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Perfume Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elma"
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-razen-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="RAZ-01"
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-razen-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2350"
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-razen-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Compare-at Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="2645"
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-razen-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-razen-gold bg-white"
                  >
                    <option value="UNISEX">Unisex</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Available Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-razen-gold"
                  />
                </div>
              </div>

              {/* Fragrance Notes (Section 6) */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs">Fragrance Notes Architecture</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">
                      Top Notes *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.topNotes}
                      onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                      placeholder="Apple blossom, Bergamot"
                      className="w-full p-2 border rounded-md text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">
                      Heart Notes *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.middleNotes}
                      onChange={(e) => setFormData({ ...formData, middleNotes: e.target.value })}
                      placeholder="Rose absolute, Amber"
                      className="w-full p-2 border rounded-md text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">
                      Base Notes *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.baseNotes}
                      onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                      placeholder="White cedar, Musk"
                      className="w-full p-2 border rounded-md text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Warm golden sunlight captured in glass."
                  className="w-full p-2.5 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Full Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border rounded-lg text-xs resize-none"
                />
              </div>

              {/* R2 Image Upload Section */}
              <div className="space-y-3">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Cloudflare R2 / S3 Product Imagery
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 p-1 flex items-center justify-center group"
                    >
                      <Image src={img} alt="Product image" fill className="object-contain" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  <label className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 hover:border-razen-gold flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Upload size={16} className="text-slate-400" />
                    <span className="text-[9px] text-slate-500 mt-1">
                      {isUploading ? "..." : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 pt-2 border-t border-slate-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-razen-gold focus:ring-razen-gold"
                  />
                  <span className="font-semibold text-slate-800">Featured on Homepage</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-razen-gold focus:ring-razen-gold"
                  />
                  <span className="font-semibold text-slate-800">Active in Storefront</span>
                </label>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-lg bg-slate-900 hover:bg-razen-gold text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  <span>{isSaving ? "Saving Fragrance..." : "Save Fragrance"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
