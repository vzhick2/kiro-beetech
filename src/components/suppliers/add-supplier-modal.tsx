'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createSupplier } from '@/app/actions/suppliers';
import { CreateSupplierSchema } from '@/lib/validations';

interface AddSupplierModalProps {
  onSupplierAdded?: () => void;
}

export function AddSupplierModal({ onSupplierAdded }: AddSupplierModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    website: '', // Changed from contactEmail to website
    contactPhone: '',
    address: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data with Zod schema
      const validationResult = CreateSupplierSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      // Create supplier data object, filtering out empty strings
      const supplierData = {
        name: validationResult.data.name,
        ...(validationResult.data.website && validationResult.data.website.trim() && { website: validationResult.data.website.trim() }),
        ...(validationResult.data.contactPhone && validationResult.data.contactPhone.trim() && { contactPhone: validationResult.data.contactPhone.trim() }),
        ...(validationResult.data.address && validationResult.data.address.trim() && { address: validationResult.data.address.trim() }),
        ...(validationResult.data.notes && validationResult.data.notes.trim() && { notes: validationResult.data.notes.trim() }),
      };

      const result = await createSupplier(supplierData);
      if (result.success) {
        setIsOpen(false);
        setFormData({
          name: '',
          website: '', // Changed from contactEmail to website
          contactPhone: '',
          address: '',
          notes: '',
        });
        setErrors({});
        onSupplierAdded?.();
      } else {
        setErrors({ submit: result.error || 'Failed to create supplier' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Supplier
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Supplier Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter supplier name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Website
              </label>
              <input
                type="text"
                id="website"
                value={formData.website}
                onChange={e =>
                  handleInputChange('website', e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.website ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="www.supplier-website.com"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">{errors.website}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contactPhone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                value={formData.contactPhone}
                onChange={e =>
                  handleInputChange('contactPhone', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={e => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full address"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about this supplier"
            />
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Creating...' : 'Create Supplier'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
