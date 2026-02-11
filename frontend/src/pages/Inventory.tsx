import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { inventoryAPI } from '@/services/api';
import { Plus, AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const Inventory = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'medicine',
    quantity: '',
    unit: '',
    reorderLevel: '10',
    price: '',
    expiryDate: '',
    supplier: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchInventory();
    fetchLowStock();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await inventoryAPI.getAll();
      setInventory(data.data.inventory || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStock = async () => {
    try {
      const { data } = await inventoryAPI.getLowStock();
      setLowStockItems(data.data.items || []);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await inventoryAPI.update(selectedItem._id, formData);
        toast.success('Item updated successfully');
      } else {
        await inventoryAPI.create(formData);
        toast.success('Item added successfully');
      }
      setShowForm(false);
      resetForm();
      fetchInventory();
      fetchLowStock();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save item');
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit,
      reorderLevel: item.reorderLevel.toString(),
      price: item.price.toString(),
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      supplier: item.supplier || '',
      location: item.location || '',
      description: item.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await inventoryAPI.delete(id);
      toast.success('Item deleted');
      fetchInventory();
      fetchLowStock();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    }
  };

  const resetForm = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      category: 'medicine',
      quantity: '',
      unit: '',
      reorderLevel: '10',
      price: '',
      expiryDate: '',
      supplier: '',
      location: '',
      description: ''
    });
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'in-stock': 'bg-green-500',
      'low-stock': 'bg-yellow-500',
      'out-of-stock': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    return <Package className="h-5 w-5" />;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground mt-2">Track medicines, equipment, and supplies</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Alert ({lowStockItems.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {lowStockItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-3 bg-white dark:bg-background rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {item.quantity} {item.unit} | Reorder at: {item.reorderLevel} {item.unit}
                      </p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{inventory.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">
                    {inventory.filter(i => i.status === 'in-stock').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {inventory.filter(i => i.status === 'low-stock').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">
                    {inventory.filter(i => i.status === 'out-of-stock').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory List */}
        {loading ? (
          <div className="text-center py-12">Loading inventory...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inventory.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(item.category)}
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{item.quantity} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">₹{item.price}</span>
                    </div>
                    {item.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{item.location}</span>
                      </div>
                    )}
                    {item.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expiry:</span>
                        <span className="font-medium">{new Date(item.expiryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="flex-1">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)} className="flex-1">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Item Name *</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity *</Label>
                <Input 
                  type="number" 
                  value={formData.quantity} 
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <Label>Unit *</Label>
                <Input 
                  value={formData.unit} 
                  onChange={(e) => setFormData({...formData, unit: e.target.value})} 
                  placeholder="e.g., tablets, boxes, units"
                  required 
                />
              </div>
              <div>
                <Label>Reorder Level *</Label>
                <Input 
                  type="number" 
                  value={formData.reorderLevel} 
                  onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <Label>Price (₹) *</Label>
                <Input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input 
                  type="date" 
                  value={formData.expiryDate} 
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} 
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})} 
                  placeholder="e.g., Shelf A1"
                />
              </div>
            </div>
            <div>
              <Label>Supplier</Label>
              <Input 
                value={formData.supplier} 
                onChange={(e) => setFormData({...formData, supplier: e.target.value})} 
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">{selectedItem ? 'Update' : 'Add'} Item</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Inventory;
