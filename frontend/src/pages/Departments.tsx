import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { departmentAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DepartmentForm } from '@/components/DepartmentForm';

const Departments = () => {
  const { role } = useAuth();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await departmentAPI.getAll();
      setDepartments(data.data.departments || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      await departmentAPI.delete(id);
      toast.success('Department deleted');
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete department');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Departments</h1>
            <p className="text-muted-foreground mt-2">Manage hospital departments</p>
          </div>
          {role === 'admin' && (
            <Button onClick={() => { setSelectedDept(null); setShowForm(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading departments...</div>
        ) : departments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No departments found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <Card key={dept._id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {dept.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{dept.description || 'No description'}</p>
                  {dept.location && <p className="text-sm"><span className="font-medium">Location:</span> {dept.location}</p>}
                  {dept.contactNumber && <p className="text-sm"><span className="font-medium">Contact:</span> {dept.contactNumber}</p>}
                  {role === 'admin' && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedDept(dept); setShowForm(true); }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(dept._id)}>Delete</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DepartmentForm open={showForm} onClose={() => { setShowForm(false); setSelectedDept(null); }} onSuccess={fetchDepartments} department={selectedDept} />
    </AppLayout>
  );
};

export default Departments;
