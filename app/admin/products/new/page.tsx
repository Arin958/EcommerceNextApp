"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { VariantsManager, Variant } from "@/components/admin/VariantsManager";

const AddProductPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);

      // Append files to formData
      images.forEach((image) => {
        formData.append("images", image);
      });
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      // Append variants as JSON
      if (variants.length > 0) {
        // Validate variants before submitting
        const invalidVariants = variants.filter(v => 
          !v.color.trim() || !v.size.trim() || v.stock < 0
        );
        
        if (invalidVariants.length > 0) {
          throw new Error("Please fill all variant fields with valid values");
        }

        formData.append("variants", JSON.stringify(variants));
      }

      const res = await fetch("/api/products/create", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        throw new Error("Server did not return valid JSON");
      }

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to create product");
      }

      setMessage("✅ Product created successfully!");
      toast.success("Product created successfully!");

      form.reset();
      setImages([]);
      setThumbnail(null);
      setVariants([]);
      router.refresh();

      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      let message = "Something went wrong";
      if (typeof err === "string") message = err;
      else if (err instanceof Error) message = err.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'thumbnail') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'images') {
      setImages(prev => [...prev, ...Array.from(files)]);
    } else {
      setThumbnail(files[0]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
  };

  const openPreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground mt-2">
          Create a new product in your store
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    name="sku"
                    required
                    placeholder="SKU001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    placeholder="Brand name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    name="category"
                    required
                    placeholder="Category"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Discount Price</Label>
                  <Input
                    id="discountPrice"
                    name="discountPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Base Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                />
                <p className="text-sm text-muted-foreground">
                  Base stock level (can be overridden by variants)
                </p>
              </div>
            </div>

            <Separator />

            {/* Variants */}
            <VariantsManager
              variants={variants}
              onChange={setVariants}
            />

            <Separator />

            {/* Tags & Collections */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Organization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="summer, cotton, casual"
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate tags with commas
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collections">Collections</Label>
                  <Input
                    id="collections"
                    name="collections"
                    placeholder="New Arrivals, Trending"
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate collections with commas
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Settings</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isFeatured" name="isFeatured" value="true" />
                  <Label htmlFor="isFeatured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="isPublished" name="isPublished" defaultChecked />
                  <Label htmlFor="isPublished">Published</Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SEO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    placeholder="Meta title for SEO"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Input
                    id="metaDescription"
                    name="metaDescription"
                    placeholder="Meta description for SEO"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Images */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Images</h3>

              {/* Thumbnail Upload */}
              <div className="space-y-4">
                <Label>Thumbnail Image *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {thumbnail ? (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="relative group">
                        <Image
                          src={URL.createObjectURL(thumbnail)}
                          alt="Thumbnail preview"
                          className="h-20 w-20 object-cover rounded-lg"
                          width={80}
                          height={80}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white hover:bg-white hover:bg-opacity-20"
                                onClick={() => openPreview(thumbnail)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <Image
                                src={previewImage || ""}
                                alt="Preview"
                                className="w-full h-auto rounded-lg"
                                width={500}
                                height={500}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-white hover:bg-opacity-20"
                            onClick={removeThumbnail}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{thumbnail.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(thumbnail.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div>
                        <Label
                          htmlFor="thumbnail-upload"
                          className="cursor-pointer font-medium text-primary hover:text-primary/80"
                        >
                          Click to upload
                        </Label>
                        <Input
                          id="thumbnail-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'thumbnail')}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Images Upload */}
              <div className="space-y-4">
                <Label>Product Images *</Label>
                <div className="border-2 border-dashed rounded-lg p-6">
                  {images.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full object-cover rounded-lg"
                              width={80}
                              height={80}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-white hover:bg-white hover:bg-opacity-20"
                                    onClick={() => openPreview(image)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <Image
                                    src={previewImage || ""}
                                    alt="Preview"
                                    className="w-full h-auto rounded-lg"
                                    width={500}
                                    height={500}
                                  />
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white hover:bg-white hover:bg-opacity-20"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          {images.length} image{images.length !== 1 ? 's' : ''} selected
                        </Badge>
                        <Label
                          htmlFor="images-upload"
                          className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80"
                        >
                          Add More Images
                        </Label>
                        <Input
                          id="images-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'images')}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div>
                        <Label
                          htmlFor="images-upload"
                          className="cursor-pointer font-medium text-primary hover:text-primary/80"
                        >
                          Click to upload
                        </Label>
                        <Input
                          id="images-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'images')}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, JPEG up to 10MB each
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Product...
                </>
              ) : (
                "Create Product"
              )}
            </Button>

            {message && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-center">{message}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductPage;