// components/EditProductForm.tsx
'use client'

import { IProduct, Variant } from '@/types'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2, Upload, X } from 'lucide-react'
import { VariantsManager } from './VariantsManager'
import Image from 'next/image'
import { compressMultipleImages, getFileSizeMB } from '@/utils/imageCompression'

interface EditProductFormProps {
  product: IProduct
}

export const EditProductForm = ({ product }: EditProductFormProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: product.brand || '',
    category: product.category,
    price: product.price,
    discountPrice: product.discountPrice || '',
    stock: product.stock,
    tags: product.tags?.join(', ') || '',
    collections: product.collections?.join(', ') || '',
    isFeatured: product.isFeatured,
    isPublished: product.isPublished,
    metaTitle: product.metaTitle || '',
    metaDescription: product.metaDescription || '',
  })
  const [variants, setVariants] = useState<Variant[]>(product.variants as Variant[] || [])
  const [images, setImages] = useState<File[]>([])
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const compressAndSetImages = async (files: File[], type: 'images' | 'thumbnail') => {
    setCompressing(true);
    try {
      const compressedFiles = await compressMultipleImages(files, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
        maxSizeMB: 1
      });

      if (type === 'images') {
        setImages(prev => [...prev, ...compressedFiles]);
        
        // Create preview URLs for compressed images
        const newPreviewUrls = compressedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      } else {
        setThumbnail(compressedFiles[0]);
        setThumbnailPreview(URL.createObjectURL(compressedFiles[0]));
      }

      // Show compression results
      const originalSize = files.reduce((sum, file) => sum + file.size, 0);
      const compressedSize = compressedFiles.reduce((sum, file) => sum + file.size, 0);
      const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      if (compressedSize < originalSize) {
        toast.success(`Images compressed - ${savings}% smaller`);
      }
    } catch (error) {
      console.error('Compression error:', error);
      // Fallback to original files
      if (type === 'images') {
        setImages(prev => [...prev, ...files]);
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      } else {
        setThumbnail(files[0]);
        setThumbnailPreview(URL.createObjectURL(files[0]));
      }
      toast.warning("Compression failed, using original images");
    } finally {
      setCompressing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'thumbnail') => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files);
    
    // Validate file types
    const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast.error("Please select valid image files");
      return;
    }

    // Validate file sizes before compression
    const largeFiles = fileArray.filter(file => file.size > 20 * 1024 * 1024); // 20MB
    if (largeFiles.length > 0) {
      toast.error("Some files are too large (max 20MB)");
      return;
    }

    await compressAndSetImages(fileArray, type);
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])
    
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const removeThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview)
    }
    setThumbnail(null)
    setThumbnailPreview(null)
  }

  const handleVariantsChange = (newVariants: Variant[]) => {
    setVariants(newVariants)

    // If variants exist, calculate total stock from variants
    if (newVariants.length > 0) {
      const totalStock = newVariants.reduce((sum, variant) => sum + variant.stock, 0)
      setFormData(prev => ({
        ...prev,
        stock: totalStock
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('productId', product._id!)

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Handle empty discount price (set to null)
          if (key === 'discountPrice' && value === '') {
            formDataToSend.append(key, '')
          } else {
            formDataToSend.append(key, value.toString())
          }
        }
      })

      // Append variants if they exist
      if (variants.length > 0) {
        formDataToSend.append('variants', JSON.stringify(variants))
      }

      // Append compressed images
      images.forEach(image => {
        formDataToSend.append('images', image)
      })

      // Append compressed thumbnail
      if (thumbnail) {
        formDataToSend.append('thumbnail', thumbnail)
      }

      const response = await fetch('/api/products/put', {
        method: 'PUT',
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update product')
      }

      toast.success('Product updated successfully')
      router.push('/admin/products')
      router.refresh()
    } catch (error: unknown) {
      console.error('Error updating product:', error)
      let message = 'Something went wrong'
      if (typeof error === 'string') message = error
      else if (error instanceof Error) message = error.message

      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate total size of new images
  const totalNewImagesSizeMB = images.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024;
  const thumbnailSizeMB = thumbnail ? thumbnail.size / 1024 / 1024 : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variants Manager */}
      <VariantsManager
        variants={variants}
        onChange={handleVariantsChange}
      />

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPrice">Discount Price</Label>
              <Input
                id="discountPrice"
                name="discountPrice"
                type="number"
                step="0.01"
                value={formData.discountPrice}
                onChange={handleInputChange}
                placeholder="Leave empty for no discount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Total Stock *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
                disabled={variants.length > 0}
              />
              {variants.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Auto-calculated from variants
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Images</span>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
             
              <span>New images are automatically compressed</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Size Summary for New Images */}
          {(images.length > 0 || thumbnail) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span>New upload size:</span>
                <span className="font-medium">
                  {(totalNewImagesSizeMB + thumbnailSizeMB).toFixed(2)} MB
                </span>
              </div>
              {thumbnail && (
                <div className="flex justify-between text-sm mt-1">
                  <span>New thumbnail:</span>
                  <span>{thumbnailSizeMB.toFixed(2)} MB</span>
                </div>
              )}
              {images.length > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span>New images ({images.length}):</span>
                  <span>{totalNewImagesSizeMB.toFixed(2)} MB</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Thumbnail Image</Label>
            <div className="flex items-center gap-4">
              {thumbnailPreview ? (
                <div className="relative">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-32 h-32 object-cover rounded-lg"
                    width={128}
                    height={128}
                  />
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    {getFileSizeMB(thumbnail!)}MB
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                    onClick={removeThumbnail}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={product.thumbnail!}
                    alt="Current thumbnail"
                    className="w-32 h-32 object-cover rounded-lg"
                    width={128}
                    height={128}
                  />
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    Current
                  </div>
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'thumbnail')}
                  className="hidden"
                  id="thumbnail-upload"
                  disabled={compressing}
                />
                <Label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {compressing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {compressing ? "Compressing..." : "Change Thumbnail"}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  PNG, JPG, JPEG up to 20MB (automatically compressed)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Existing product images */}
              {product?.images?.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    width={150}
                    height={128}
                  />
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    Current
                  </div>
                </div>
              ))}
              
              {/* New compressed images with size badges */}
              {previewUrls.map((url, index) => (
                <div key={`new-${index}`} className="relative">
                  <Image
                    src={url}
                    alt={`New image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    width={150}
                    height={128}
                  />
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    {getFileSizeMB(images[index])}MB
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 w-6 h-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 'images')}
                className="hidden"
                id="images-upload"
                disabled={compressing}
              />
              <Label
                htmlFor="images-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {compressing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {compressing ? "Compressing..." : "Add More Images"}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, JPEG up to 20MB each (automatically compressed)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-sm text-gray-500">Separate tags with commas</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="collections">Collections</Label>
              <Input
                id="collections"
                name="collections"
                value={formData.collections}
                onChange={handleInputChange}
                placeholder="collection1, collection2"
              />
              <p className="text-sm text-gray-500">Separate collections with commas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isFeatured">Featured Product</Label>
              <p className="text-sm text-gray-500">
                Show this product in featured sections
              </p>
            </div>
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isPublished">Published</Label>
              <p className="text-sm text-gray-500">
                Make this product visible to customers
              </p>
            </div>
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => handleSwitchChange('isPublished', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              placeholder="Optional - defaults to product name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              rows={3}
              placeholder="Optional - defaults to product description"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          disabled={isLoading || compressing}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || compressing}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : compressing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          {compressing ? "Compressing Images..." : isLoading ? "Updating Product..." : "Update Product"}
        </Button>
      </div>
    </form>
  )
}