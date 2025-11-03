// components/VariantsManager.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

export interface Variant {
  color: string;
  size: string;
  stock: number;
}

interface VariantsManagerProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

export function VariantsManager({ variants, onChange }: VariantsManagerProps) {
  const addVariant = () => {
    onChange([
      ...variants,
      { color: '', size: '', stock: 0 }
    ]);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const updated = [...variants];
    updated[index] = { 
      ...updated[index], 
      [field]: field === 'stock' ? Number(value) : value 
    };
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Product Variants</span>
          <Button type="button" onClick={addVariant} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Variant
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {variants.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No variants added yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add color and size combinations with their stock levels
            </p>
          </div>
        ) : (
          variants.map((variant, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Variant {index + 1}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`color-${index}`}>Color *</Label>
                  <Input
                    id={`color-${index}`}
                    value={variant.color}
                    onChange={(e) => updateVariant(index, 'color', e.target.value)}
                    placeholder="e.g., Black, White"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor={`size-${index}`}>Size *</Label>
                  <Input
                    id={`size-${index}`}
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                    placeholder="e.g., Standard, Large, XL"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor={`stock-${index}`}>Stock *</Label>
                  <Input
                    id={`stock-${index}`}
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>
          ))
        )}
        
        {variants.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              {variants.length} variant{variants.length !== 1 ? 's' : ''} configured
            </span>
            <Button type="button" onClick={addVariant} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Variant
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}