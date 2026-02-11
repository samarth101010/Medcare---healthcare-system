import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { billingAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Plus, CreditCard, DollarSign, Eye, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { BillingForm } from '@/components/BillingForm';
import { InvoiceDetailsDialog } from '@/components/InvoiceDetailsDialog';

const Billing = () => {
  const { role } = useAuth();
  const [billings, setBillings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchBillings();
  }, []);

  const fetchBillings = async () => {
    try {
      const { data } = await billingAPI.getAll();
      setBillings(data.data.billings || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch billings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDetails(true);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      paid: 'bg-green-500',
      pending: 'bg-yellow-500',
      'partially-paid': 'bg-blue-500',
      overdue: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/95 via-amber-800/90 to-yellow-900/85"></div>
          </div>
          
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Billing & Payments</h1>
                <p className="text-white/90 text-lg">Manage invoices and track payments</p>
              </div>
              {role === 'admin' && (
                <Button onClick={() => setShowForm(true)} className="bg-white text-primary hover:bg-white/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading billings...</div>
        ) : billings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No billing records found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {billings.map((billing) => (
              <Card 
                key={billing._id}
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                onClick={() => handleViewInvoice(billing)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <Receipt className="h-6 w-6 text-primary" />
                        <h3 className="font-semibold text-lg font-mono">{billing.invoiceId}</h3>
                        <Badge className={getStatusColor(billing.paymentStatus)}>
                          {billing.paymentStatus}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Total Amount</p>
                          <p className="text-lg font-bold">₹{billing.totalAmount?.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <p className="text-xs text-muted-foreground">Paid</p>
                          <p className="text-lg font-bold text-green-600">₹{billing.paidAmount?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <p className="text-xs text-muted-foreground">Due</p>
                          <p className="text-lg font-bold text-red-600">₹{billing.dueAmount?.toFixed(2) || '0.00'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span>📅 {format(new Date(billing.createdAt), 'PPP')}</span>
                        <span>💳 {billing.paymentMethod}</span>
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => handleViewInvoice(billing)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Invoice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BillingForm open={showForm} onClose={() => setShowForm(false)} onSuccess={fetchBillings} />
      <InvoiceDetailsDialog 
        open={showDetails} 
        onClose={() => { setShowDetails(false); setSelectedInvoice(null); }} 
        invoice={selectedInvoice}
      />
    </AppLayout>
  );
};

export default Billing;
