import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Receipt, User, Calendar, DollarSign, CreditCard, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';

interface InvoiceDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: any;
}

export const InvoiceDetailsDialog = ({ open, onClose, invoice }: InvoiceDetailsDialogProps) => {
  if (!invoice) return null;

  const getStatusColor = (status: string) => {
    const colors: any = {
      paid: 'bg-green-500',
      pending: 'bg-yellow-500',
      'partially-paid': 'bg-blue-500',
      overdue: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(16, 185, 129); // Primary color
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', 20, 20);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('MedCare Healthcare Management', 20, 28);
      doc.text('123 Medical Center Drive', 20, 33);
      
      // Invoice details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Invoice #: ${invoice.invoiceId}`, 150, 20);
      doc.text(`Date: ${format(new Date(invoice.createdAt), 'PP')}`, 150, 26);
      doc.text(`Status: ${invoice.paymentStatus.toUpperCase()}`, 150, 32);
      
      // Patient info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', 20, 55);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`${invoice.patient?.user?.firstName} ${invoice.patient?.user?.lastName}`, 20, 62);
      doc.text(`Patient ID: ${invoice.patient?.patientId}`, 20, 68);
      doc.text(`${invoice.patient?.user?.email}`, 20, 74);
      doc.text(`${invoice.patient?.user?.phone}`, 20, 80);
      
      // Items table
      const tableData = invoice.items?.map((item: any) => [
        item.description,
        item.quantity.toString(),
        `₹${item.unitPrice.toFixed(2)}`,
        `₹${item.amount.toFixed(2)}`
      ]) || [];
      
      (doc as any).autoTable({
        startY: 95,
        head: [['Description', 'Quantity', 'Unit Price', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], textColor: 255 },
        styles: { fontSize: 10 },
        columnStyles: {
          1: { halign: 'center' },
          2: { halign: 'right' },
          3: { halign: 'right' }
        }
      });
      
      // Totals
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text('Subtotal:', 130, finalY);
      doc.text(`₹${invoice.subtotal?.toFixed(2)}`, 180, finalY, { align: 'right' });
      
      doc.text('Tax:', 130, finalY + 6);
      doc.text(`₹${invoice.tax?.toFixed(2)}`, 180, finalY + 6, { align: 'right' });
      
      if (invoice.discount > 0) {
        doc.text('Discount:', 130, finalY + 12);
        doc.text(`-₹${invoice.discount?.toFixed(2)}`, 180, finalY + 12, { align: 'right' });
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      const totalY = invoice.discount > 0 ? finalY + 18 : finalY + 12;
      doc.text('Total Amount:', 130, totalY);
      doc.text(`₹${invoice.totalAmount?.toFixed(2)}`, 180, totalY, { align: 'right' });
      
      // Payment info
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Paid: ₹${invoice.paidAmount?.toFixed(2) || '0.00'}`, 130, totalY + 8);
      doc.text(`Due: ₹${invoice.dueAmount?.toFixed(2) || '0.00'}`, 130, totalY + 14);
      doc.text(`Payment Method: ${invoice.paymentMethod}`, 130, totalY + 20);
      
      // Footer
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text('Thank you for choosing MedCare Healthcare!', 105, 280, { align: 'center' });
      doc.text('For queries: billing@medcare.com', 105, 285, { align: 'center' });
      
      // Save PDF
      doc.save(`Invoice_${invoice.invoiceId}.pdf`);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download invoice');
    }
  };

  const handlePayNow = () => {
    // Placeholder for payment gateway integration
    toast.info('Payment gateway integration coming soon! This will integrate with Razorpay/Stripe for online payments.');
    // In production, this would open Razorpay/Stripe payment modal
    // Example: loadRazorpay(invoice.dueAmount, invoice.invoiceId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            Invoice Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="flex items-start justify-between p-6 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg">
            <div>
              <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
              <p className="text-white/80">Healthcare Management System</p>
              <p className="text-white/80">123 Medical Center Drive</p>
              <p className="text-white/80">Phone: +1 (555) 123-4567</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Invoice Number</p>
              <p className="text-2xl font-bold font-mono">{invoice.invoiceId}</p>
              <p className="text-sm text-white/80 mt-2">Date</p>
              <p className="font-semibold">{format(new Date(invoice.createdAt), 'PP')}</p>
            </div>
          </div>

          {/* Status & Payment Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge className={getStatusColor(invoice.paymentStatus)}>
                {invoice.paymentStatus}
              </Badge>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
              <p className="font-semibold capitalize">{invoice.paymentMethod}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Paid Amount</p>
              <p className="font-semibold text-green-600">₹{invoice.paidAmount?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Due Amount</p>
              <p className="font-semibold text-red-600">₹{invoice.dueAmount?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Bill To
            </h3>
            <div className="space-y-1">
              <p className="font-semibold">{invoice.patient?.user?.firstName} {invoice.patient?.user?.lastName}</p>
              <p className="text-sm text-muted-foreground">Patient ID: {invoice.patient?.patientId}</p>
              <p className="text-sm text-muted-foreground">{invoice.patient?.user?.email}</p>
              <p className="text-sm text-muted-foreground">{invoice.patient?.user?.phone}</p>
            </div>
          </div>

          <Separator />

          {/* Items Table */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services & Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-semibold">Description</th>
                    <th className="text-center p-4 font-semibold">Quantity</th>
                    <th className="text-right p-4 font-semibold">Unit Price</th>
                    <th className="text-right p-4 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="p-4">{item.description}</td>
                      <td className="p-4 text-center">{item.quantity}</td>
                      <td className="p-4 text-right">₹{item.unitPrice?.toFixed(2)}</td>
                      <td className="p-4 text-right font-semibold">₹{item.amount?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 space-y-3">
              <div className="flex justify-between p-3 bg-muted rounded">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold">₹{invoice.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded">
                <span className="text-muted-foreground">Tax:</span>
                <span className="font-semibold">₹{invoice.tax?.toFixed(2)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-semibold text-green-600">-₹{invoice.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between p-4 bg-primary text-white rounded-lg">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold">₹{invoice.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>Thank you for choosing our healthcare services!</p>
            <p className="mt-1">For any queries, please contact us at billing@healthcare.com</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {invoice.paymentStatus !== 'paid' && invoice.dueAmount > 0 && (
              <Button onClick={handlePayNow} className="flex-1 bg-green-600 hover:bg-green-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now ₹{invoice.dueAmount?.toFixed(2)}
              </Button>
            )}
            <Button onClick={downloadPDF} variant={invoice.paymentStatus !== 'paid' ? 'outline' : 'default'} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
