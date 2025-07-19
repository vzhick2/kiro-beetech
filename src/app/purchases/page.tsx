import { PurchaseMasterDetail } from '@/components/purchases/purchase-master-detail';

export default function PurchasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Purchases</h1>
        <p className="text-gray-600">
          Manage your purchase orders and invoices
        </p>
      </div>

      <PurchaseMasterDetail />
    </div>
  );
}
