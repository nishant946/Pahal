import { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Pencil, 
  Trash, 
  Plus, 
  Globe, 
  Github, 
  Linkedin, 
  Mail, 
  Search,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  Grid,
  List
} from 'lucide-react';
import api from '@/services/api';
import { SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";

interface Contributor {
  _id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  email?: string;
  batch?: string;
  branch?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContributorFormData {
  name: string;
  role: string;
  description: string;
  image?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  email?: string;
  batch?: string;
  branch?: string;
  order: number;
  isActive: boolean;
}

const initialFormData: ContributorFormData = {
  name: '',
  role: '',
  description: '',
  image: '',
  linkedinUrl: '',
  githubUrl: '',
  websiteUrl: '',
  email: '',
  batch: '',
  branch: '',
  order: 0,
  isActive: true
};

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'role' | 'order' | 'createdAt' | 'isActive';
type SortOrder = 'asc' | 'desc';

export default function AdminContributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContributor, setEditingContributor] = useState<Contributor | null>(null);
  const [formData, setFormData] = useState<ContributorFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  
  // Enhanced UI state
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<SortField>('order');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedContributors, setSelectedContributors] = useState<Set<string>>(new Set());
  const [showValidation, setShowValidation] = useState(false);

  // Fetch contributors
  const fetchContributors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contributors/admin/all');
      setContributors(response.data.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching contributors:', err);
      setError('Failed to fetch contributors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Filtered and sorted contributors
  const filteredAndSortedContributors = useMemo(() => {
    let filtered = contributors.filter(contributor => {
      const matchesSearch = contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contributor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contributor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (contributor.batch && contributor.batch.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (contributor.branch && contributor.branch.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'active' && contributor.isActive) ||
                           (filterStatus === 'inactive' && !contributor.isActive);
      
      return matchesSearch && matchesFilter;
    });

    // Sort contributors
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [contributors, searchTerm, filterStatus, sortField, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = contributors.length;
    const active = contributors.filter(c => c.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [contributors]);

  // Form validation
  const formErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.role.trim()) {
      errors.role = 'Role is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    const urlFields = ['linkedinUrl', 'githubUrl', 'websiteUrl'];
    urlFields.forEach(field => {
      const value = formData[field as keyof ContributorFormData] as string;
      if (value && !/^https?:\/\/.+/.test(value)) {
        errors[field] = 'URL must start with http:// or https://';
      }
    });
    
    return errors;
  }, [formData]);

  const isFormValid = Object.keys(formErrors).length === 0 && formData.name && formData.role && formData.description;

  // Handle form changes
  const handleInputChange = (field: keyof ContributorFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save contributor
  const handleSave = async () => {
    setShowValidation(true);
    
    if (!isFormValid) {
      setError('Please fix the validation errors before saving.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      if (editingContributor) {
        // Update existing contributor
        await api.put(`/contributors/${editingContributor._id}`, formData);
        setSuccess('Contributor updated successfully!');
      } else {
        // Create new contributor
        await api.post('/contributors', formData);
        setSuccess('Contributor created successfully!');
      }
      
      await fetchContributors();
      resetForm();
      setIsDialogOpen(false);
      setShowValidation(false);
    } catch (err: any) {
      console.error('Error saving contributor:', err);
      setError(err.response?.data?.message || 'Failed to save contributor');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete contributor with enhanced confirmation
  const deleteContributor = async (id: string, name: string) => {
    try {
      await api.delete(`/contributors/${id}`);
      setSuccess(`Contributor "${name}" deleted successfully!`);
      await fetchContributors();
    } catch (err: any) {
      console.error('Error deleting contributor:', err);
      setError(err.response?.data?.message || 'Failed to delete contributor');
    }
  };

  // Toggle contributor status
  const toggleStatus = async (id: string, currentStatus: boolean, name: string) => {
    try {
      await api.patch(`/contributors/${id}/toggle-status`);
      const newStatus = currentStatus ? 'deactivated' : 'activated';
      setSuccess(`Contributor "${name}" ${newStatus} successfully!`);
      await fetchContributors();
    } catch (err: any) {
      console.error('Error toggling status:', err);
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  // Bulk operations
  const handleBulkToggle = async (activate: boolean) => {
    try {
      const promises = Array.from(selectedContributors).map(id => 
        api.patch(`/contributors/${id}/toggle-status`)
      );
      await Promise.all(promises);
      const action = activate ? 'activated' : 'deactivated';
      setSuccess(`${selectedContributors.size} contributors ${action} successfully!`);
      setSelectedContributors(new Set());
      await fetchContributors();
    } catch (err: any) {
      console.error('Error in bulk operation:', err);
      setError('Failed to update contributors');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const promises = Array.from(selectedContributors).map(id => 
        api.delete(`/contributors/${id}`)
      );
      await Promise.all(promises);
      setSuccess(`${selectedContributors.size} contributors deleted successfully!`);
      setSelectedContributors(new Set());
      await fetchContributors();
    } catch (err: any) {
      console.error('Error in bulk delete:', err);
      setError('Failed to delete contributors');
    }
  };

  // Open edit dialog
  const openEditDialog = (contributor: Contributor) => {
    setEditingContributor(contributor);
    setFormData({
      name: contributor.name,
      role: contributor.role,
      description: contributor.description,
      image: contributor.image || '',
      linkedinUrl: contributor.linkedinUrl || '',
      githubUrl: contributor.githubUrl || '',
      websiteUrl: contributor.websiteUrl || '',
      email: contributor.email || '',
      batch: contributor.batch || '',
      branch: contributor.branch || '',
      order: contributor.order,
      isActive: contributor.isActive
    });
    setIsDialogOpen(true);
    setShowValidation(false);
  };

  // Open add dialog
  const openAddDialog = () => {
    setEditingContributor(null);
    setFormData({
      ...initialFormData,
      order: contributors.length + 1
    });
    setIsDialogOpen(true);
    setShowValidation(false);
  };

  // Reset form
  const resetForm = () => {
    setEditingContributor(null);
    setFormData(initialFormData);
    setShowValidation(false);
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContributors(new Set(filteredAndSortedContributors.map(c => c._id)));
    } else {
      setSelectedContributors(new Set());
    }
  };

  const handleSelectContributor = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedContributors);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedContributors(newSelected);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contributors Management</h1>
            <p className="text-gray-600 mt-1">Manage and organize your contributors</p>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-4">
            <Card className="min-w-[100px]">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </CardContent>
            </Card>
            <Card className="min-w-[100px]">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </CardContent>
            </Card>
            <Card className="min-w-[100px]">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
                <div className="text-sm text-gray-600">Inactive</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search contributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filter */}
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-l-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {selectedContributors.size > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkToggle(true)}
                  className="text-green-600"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Activate ({selectedContributors.size})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkToggle(false)}
                  className="text-orange-600"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivate ({selectedContributors.size})
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash className="h-4 w-4 mr-1" />
                      Delete ({selectedContributors.size})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Contributors</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedContributors.size} contributor(s)? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            
            <Button onClick={fetchContributors} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contributor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {editingContributor ? 'Edit Contributor' : 'Add New Contributor'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Full name"
                          className={showValidation && formErrors.name ? 'border-red-500' : ''}
                        />
                        {showValidation && formErrors.name && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="role" className="text-sm font-medium">
                          Role <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="role"
                          value={formData.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          placeholder="e.g., Lead Developer, Designer"
                          className={showValidation && formErrors.role ? 'border-red-500' : ''}
                        />
                        {showValidation && formErrors.role && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.role}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="batch" className="text-sm font-medium">Batch</Label>
                        <Input
                          id="batch"
                          value={formData.batch}
                          onChange={(e) => handleInputChange('batch', e.target.value)}
                          placeholder="e.g., 2021-2025, 2020-2024"
                        />
                        <p className="text-xs text-gray-500 mt-1">Academic batch or graduation year</p>
                      </div>
                      <div>
                        <Label htmlFor="branch" className="text-sm font-medium">Branch</Label>
                        <Input
                          id="branch"
                          value={formData.branch}
                          onChange={(e) => handleInputChange('branch', e.target.value)}
                          placeholder="e.g., Computer Science, Electronics"
                        />
                        <p className="text-xs text-gray-500 mt-1">Field of study or specialization</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Brief description of the contributor's role and contributions"
                        rows={4}
                        className={`flex w-full rounded-md border ${showValidation && formErrors.description ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      />
                      {showValidation && formErrors.description && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact & Social Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Contact & Social Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="email@example.com"
                          className={showValidation && formErrors.email ? 'border-red-500' : ''}
                        />
                        {showValidation && formErrors.email && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <ImageUpload
                          value={formData.image}
                          onChange={(value) => handleInputChange('image', value)}
                          label="Profile Image"
                          placeholder="Enter image URL or upload a file"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedinUrl" className="text-sm font-medium">LinkedIn URL</Label>
                        <Input
                          id="linkedinUrl"
                          value={formData.linkedinUrl}
                          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className={showValidation && formErrors.linkedinUrl ? 'border-red-500' : ''}
                        />
                        {showValidation && formErrors.linkedinUrl && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.linkedinUrl}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="githubUrl" className="text-sm font-medium">GitHub URL</Label>
                        <Input
                          id="githubUrl"
                          value={formData.githubUrl}
                          onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                          placeholder="https://github.com/username"
                          className={showValidation && formErrors.githubUrl ? 'border-red-500' : ''}
                        />
                        {showValidation && formErrors.githubUrl && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.githubUrl}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="websiteUrl" className="text-sm font-medium">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        placeholder="https://personalwebsite.com"
                        className={showValidation && formErrors.websiteUrl ? 'border-red-500' : ''}
                      />
                      {showValidation && formErrors.websiteUrl && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.websiteUrl}</p>
                      )}
                    </div>
                  </div>

                  {/* Display Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Display Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="order" className="text-sm font-medium">Display Order</Label>
                        <Input
                          id="order"
                          type="number"
                          value={formData.order}
                          onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                        />
                        <Label htmlFor="isActive" className="text-sm font-medium">
                          Active Status
                        </Label>
                        <span className="text-xs text-gray-500">
                          ({formData.isActive ? 'Visible on public page' : 'Hidden from public page'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      disabled={submitting}
                      className="order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={submitting || (showValidation && !isFormValid)}
                      className="order-1 sm:order-2"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          {editingContributor ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          {editingContributor ? 'Update Contributor' : 'Create Contributor'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400 mr-2" />
              <div className="text-red-800">{error}</div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <div className="text-green-800">{success}</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="space-y-6">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} showButton={false} />
              ))}
            </div>

            {/* Controls and Table Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex gap-2">
                    <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SkeletonTable rows={8} columns={6} />
              </CardContent>
            </Card>
          </div>
        ) : filteredAndSortedContributors.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No contributors found' : 'No contributors yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Get started by adding your first contributor.'}
              </p>
              {(!searchTerm && filterStatus === 'all') && (
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Contributor
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Table View */}
            {viewMode === 'table' && (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedContributors.size === filteredAndSortedContributors.length && filteredAndSortedContributors.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded"
                        />
                      </TableHead>
                      <TableHead>Profile</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Name
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('role')}
                      >
                        <div className="flex items-center">
                          Role
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Social Links</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('order')}
                      >
                        <div className="flex items-center">
                          Order
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('isActive')}
                      >
                        <div className="flex items-center">
                          Status
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedContributors.map((contributor) => (
                      <TableRow key={contributor._id} className={!contributor.isActive ? 'opacity-50' : ''}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedContributors.has(contributor._id)}
                            onChange={(e) => handleSelectContributor(contributor._id, e.target.checked)}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell>
                          {contributor.image ? (
                            <img 
                              src={contributor.image} 
                              alt={contributor.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{contributor.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{contributor.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {contributor.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          {contributor.batch ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {contributor.batch}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {contributor.branch ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {contributor.branch}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {contributor.linkedinUrl && (
                              <a href={contributor.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Linkedin className="h-3 w-3 text-blue-600" />
                                </Button>
                              </a>
                            )}
                            {contributor.githubUrl && (
                              <a href={contributor.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Github className="h-3 w-3 text-gray-700" />
                                </Button>
                              </a>
                            )}
                            {contributor.websiteUrl && (
                              <a href={contributor.websiteUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Globe className="h-3 w-3 text-green-600" />
                                </Button>
                              </a>
                            )}
                            {contributor.email && (
                              <a href={`mailto:${contributor.email}`}>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Mail className="h-3 w-3 text-red-600" />
                                </Button>
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono">{contributor.order}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStatus(contributor._id, contributor.isActive, contributor.name)}
                            className={`${contributor.isActive ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}
                          >
                            {contributor.isActive ? (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" />
                                Inactive
                              </>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(contributor)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Contributor</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete <strong>{contributor.name}</strong>? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteContributor(contributor._id, contributor.name)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedContributors.map((contributor) => (
                  <Card key={contributor._id} className={`transition-all hover:shadow-lg ${!contributor.isActive ? 'opacity-50' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedContributors.has(contributor._id)}
                            onChange={(e) => handleSelectContributor(contributor._id, e.target.checked)}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-base font-semibold">{contributor.name}</CardTitle>
                            <p className="text-sm text-gray-600">{contributor.role}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(contributor)}
                            className="h-7 w-7 p-0"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Contributor</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete <strong>{contributor.name}</strong>? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteContributor(contributor._id, contributor.name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {contributor.image && (
                        <div className="text-center mb-3">
                          <img 
                            src={contributor.image} 
                            alt={contributor.name}
                            className="w-16 h-16 rounded-full object-cover mx-auto"
                          />
                        </div>
                      )}
                      <p className="text-sm text-gray-700 mb-3 line-clamp-3">{contributor.description}</p>
                      
                      {/* Batch and Branch */}
                      {(contributor.batch || contributor.branch) && (
                        <div className="mb-3 space-y-1">
                          {contributor.batch && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                              Batch: {contributor.batch}
                            </span>
                          )}
                          {contributor.branch && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {contributor.branch}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {contributor.linkedinUrl && (
                          <a href={contributor.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                              <Linkedin className="h-3 w-3 text-blue-600" />
                            </Button>
                          </a>
                        )}
                        {contributor.githubUrl && (
                          <a href={contributor.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                              <Github className="h-3 w-3 text-gray-700" />
                            </Button>
                          </a>
                        )}
                        {contributor.websiteUrl && (
                          <a href={contributor.websiteUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                              <Globe className="h-3 w-3 text-green-600" />
                            </Button>
                          </a>
                        )}
                        {contributor.email && (
                          <a href={`mailto:${contributor.email}`}>
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                              <Mail className="h-3 w-3 text-red-600" />
                            </Button>
                          </a>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Order: {contributor.order}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(contributor._id, contributor.isActive, contributor.name)}
                          className={`text-xs ${contributor.isActive ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}
                        >
                          {contributor.isActive ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && filteredAndSortedContributors.length === 0 && (searchTerm || filterStatus !== 'all') && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              No contributors match your search criteria.
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}