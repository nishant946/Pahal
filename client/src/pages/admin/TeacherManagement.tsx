import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import { 
  CheckCircle2, 
  Trash2, 
  Search, 
  ArrowUpDown,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  Grid,
  List,
  Mail,
  Phone,
  Building,
  Clock,
  Eye,
  EyeOff,
  XCircle,
  CheckCircle
} from "lucide-react";
import { useTeacherAuth } from '@/contexts/teacherAuthContext';
import api from '@/services/api';
import { SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";

interface Teacher {
  _id: string;
  rollNo: string;
  name: string;
  email: string;
  mobileNo?: string;
  department: string;
  designation: string;
  qualification?: string;
  preferredDays?: string[];
  subjectChoices?: string[];
  joiningDate: string;
  isVerified: boolean;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'email' | 'department' | 'createdAt' | 'isVerified' | 'isActive';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'verified' | 'unverified' | 'active' | 'inactive';

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Enhanced UI state
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  const [verifying, setVerifying] = useState<string | null>(null);
  
  const { verifyTeacher } = useTeacherAuth();

  useEffect(() => {
    fetchTeachers();
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

  // Filtered and sorted teachers
  const filteredAndSortedTeachers = useMemo(() => {
    let filtered = teachers.filter(teacher => {
      const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'verified' && teacher.isVerified) ||
                           (filterStatus === 'unverified' && !teacher.isVerified) ||
                           (filterStatus === 'active' && teacher.isActive) ||
                           (filterStatus === 'inactive' && !teacher.isActive);
      
      return matchesSearch && matchesFilter;
    });

    // Sort teachers
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
  }, [teachers, searchTerm, filterStatus, sortField, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = teachers.length;
    const verified = teachers.filter(t => t.isVerified).length;
    const unverified = total - verified;
    const active = teachers.filter(t => t.isActive).length;
    const inactive = total - active;
    return { total, verified, unverified, active, inactive };
  }, [teachers]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/teachers');
      setTeachers(response.data.teachers || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
      setError(err.response?.data?.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (teacherId: string, teacherName: string) => {
    try {
      setVerifying(teacherId);
      await verifyTeacher(teacherId);
      setSuccess(`Teacher "${teacherName}" verified successfully!`);
      // Update the local state
      setTeachers(prev => prev.map(teacher => 
        teacher._id === teacherId 
          ? { ...teacher, isVerified: true }
          : teacher
      ));
    } catch (err: any) {
      console.error('Error verifying teacher:', err);
      setError(err.response?.data?.message || 'Failed to verify teacher');
    } finally {
      setVerifying(null);
    }
  };

  const handleDeactivate = async (teacherId: string, teacherName: string) => {
    try {
      await api.patch(`/admin/teachers/${teacherId}/deactivate`);
      setSuccess(`Teacher "${teacherName}" deactivated successfully!`);
      // Update the local state
      setTeachers(prev => prev.map(teacher => 
        teacher._id === teacherId 
          ? { ...teacher, isActive: false }
          : teacher
      ));
    } catch (err: any) {
      console.error('Error deactivating teacher:', err);
      setError(err.response?.data?.message || 'Failed to deactivate teacher');
    }
  };

  // Bulk operations
  const handleBulkVerify = async () => {
    try {
      const promises = Array.from(selectedTeachers)
        .filter(id => {
          const teacher = teachers.find(t => t._id === id);
          return teacher && !teacher.isVerified;
        })
        .map(id => verifyTeacher(id));
      
      await Promise.all(promises);
      const count = promises.length;
      setSuccess(`${count} teacher(s) verified successfully!`);
      setSelectedTeachers(new Set());
      await fetchTeachers();
    } catch (err: any) {
      console.error('Error in bulk verify:', err);
      setError('Failed to verify some teachers');
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      const promises = Array.from(selectedTeachers)
        .filter(id => {
          const teacher = teachers.find(t => t._id === id);
          return teacher && teacher.isActive;
        })
        .map(id => api.patch(`/admin/teachers/${id}/deactivate`));
      
      await Promise.all(promises);
      const count = promises.length;
      setSuccess(`${count} teacher(s) deactivated successfully!`);
      setSelectedTeachers(new Set());
      await fetchTeachers();
    } catch (err: any) {
      console.error('Error in bulk deactivate:', err);
      setError('Failed to deactivate some teachers');
    }
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
      setSelectedTeachers(new Set(filteredAndSortedTeachers.map(t => t._id)));
    } else {
      setSelectedTeachers(new Set());
    }
  };

  const handleSelectTeacher = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedTeachers);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedTeachers(newSelected);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} showButton={false} />
          ))}
        </div>

        {/* Controls Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex gap-2">
                <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SkeletonTable rows={8} columns={7} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600 mt-1">Manage teachers, verification, and access control</p>
        </div>
        
        {/* Stats Cards */}
        <div className="flex gap-4">
          <Card className="min-w-[80px]">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="min-w-[80px]">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.verified}</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </CardContent>
          </Card>
          <Card className="min-w-[80px]">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.unverified}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card className="min-w-[80px]">
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
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter */}
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Teachers</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Pending Verification</option>
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
          {selectedTeachers.size > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkVerify}
                className="text-green-600"
                disabled={Array.from(selectedTeachers).every(id => {
                  const teacher = teachers.find(t => t._id === id);
                  return teacher?.isVerified;
                })}
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Verify ({selectedTeachers.size})
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <UserX className="h-4 w-4 mr-1" />
                    Deactivate ({selectedTeachers.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate Teachers</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to deactivate {selectedTeachers.size} teacher(s)? They will lose access to the platform.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDeactivate} className="bg-red-600 hover:bg-red-700">
                      Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          
          <Button onClick={fetchTeachers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-md">
          <div className="flex">
            <XCircle className="h-5 w-5 text-destructive mr-2" />
            <div className="text-destructive">{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-400 dark:border-green-600 p-4 rounded-md">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <div className="text-green-800 dark:text-green-200">{success}</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {filteredAndSortedTeachers.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No teachers found' : 'No teachers yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Teachers will appear here after they register.'}
            </p>
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
                        checked={selectedTeachers.size === filteredAndSortedTeachers.length && filteredAndSortedTeachers.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded"
                      />
                    </TableHead>
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
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('department')}
                    >
                      <div className="flex items-center">
                        Department
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedTeachers.map((teacher) => (
                    <TableRow key={teacher._id} className={!teacher.isActive ? 'opacity-50' : ''}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedTeachers.has(teacher._id)}
                          onChange={(e) => handleSelectTeacher(teacher._id, e.target.checked)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {teacher.name}
                            {teacher.isAdmin && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{teacher.designation}</div>
                          <div className="text-xs text-gray-400">Roll: {teacher.rollNo}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-sm">{teacher.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-sm">{teacher.department}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {teacher.mobileNo && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-sm">{teacher.mobileNo}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {teacher.isVerified ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {teacher.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Eye className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {!teacher.isVerified && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(teacher._id, teacher.name)}
                              disabled={verifying === teacher._id}
                              className="h-8 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            >
                              {verifying === teacher._id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          {teacher.isActive && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Deactivate Teacher</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to deactivate <strong>{teacher.name}</strong>? They will lose access to the platform.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeactivate(teacher._id, teacher.name)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Deactivate
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
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
              {filteredAndSortedTeachers.map((teacher) => (
                <Card key={teacher._id} className={`transition-all hover:shadow-lg ${!teacher.isActive ? 'opacity-50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTeachers.has(teacher._id)}
                          onChange={(e) => handleSelectTeacher(teacher._id, e.target.checked)}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            {teacher.name}
                            {teacher.isAdmin && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                Admin
                              </span>
                            )}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{teacher.designation}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-2" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="h-3 w-3 mr-2" />
                        {teacher.department}
                      </div>
                      {teacher.mobileNo && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-2" />
                          {teacher.mobileNo}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        Roll: {teacher.rollNo} • Joined: {new Date(teacher.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      {teacher.isVerified ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      )}
                      
                      {teacher.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Eye className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!teacher.isVerified && (
                        <Button
                          size="sm"
                          onClick={() => handleVerify(teacher._id, teacher.name)}
                          disabled={verifying === teacher._id}
                          className="flex-1 text-xs"
                        >
                          {verifying === teacher._id ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verify
                            </>
                          )}
                        </Button>
                      )}
                      {teacher.isActive && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Deactivate
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deactivate Teacher</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to deactivate <strong>{teacher.name}</strong>? They will lose access to the platform.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeactivate(teacher._id, teacher.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Deactivate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && filteredAndSortedTeachers.length === 0 && (searchTerm || filterStatus !== 'all') && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            No teachers match your search criteria.
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
  );
};

export default TeacherManagement;
