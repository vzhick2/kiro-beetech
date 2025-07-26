'use client';

import { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateSupplier } from '@/hooks/use-suppliers';
import { CreateSupplierRequest } from '@/types';

interface AddSupplierModalProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AddSupplierModal = ({ 
  trigger, 
  isOpen: externalIsOpen,
  onClose: externalOnClose 
}: AddSupplierModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose !== undefined 
    ? (open: boolean) => {
        if (!open) externalOnClose();
      }
    : setInternalIsOpen;

  const createMutation = useCreateSupplier();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }
    
    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const supplierData: CreateSupplierRequest = {
        name: formData.name.trim()
      };

      if (formData.website.trim()) supplierData.website = formData.website.trim();
      if (formData.phone.trim()) supplierData.contactphone = formData.phone.trim();
      if (formData.email.trim()) supplierData.email = formData.email.trim();

      await createMutation.mutateAsync(supplierData);
      
      // Reset form and close modal
      setFormData({ name: '', website: '', phone: '', email: '' });
      setErrors({});
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create supplier:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', website: '', phone: '', email: '' });
    setErrors({});
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" className="gap-2">
      <Plus className="h-4 w-4" />
      Add New Supplier
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Supplier Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="Enter supplier name"
              className={errors.name ? 'border-red-300' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Website
            </label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Phone
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="contact@supplier.com"
              className={errors.email ? 'border-red-300' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="flex-1"
          >
            {createMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Add Supplier
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
