import { useState} from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useHomework } from '@/contexts/homeworkContext';
import { Plus, CalendarDays, User,Trash2, RefreshCw } from 'lucide-react';
import type { Homework } from '@/services/homeworkService';

type Group = 'A' | 'B' | 'C';

function AddHomeworkDialog() {
  const { addHomework } = useHomework();
  const [formData, setFormData] = useState({
    group: 'A' as Group,
    subject: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addHomework({
        ...formData,
        dateAssigned: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
      
      // Reset form and close dialog
      setFormData({
        group: 'A',
        subject: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding homework:', error);
      alert('Failed to add homework. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add New Homework</span>
          <span className="sm:hidden">Add Homework</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Homework</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group">Group</Label>
            <select
              id="group"
              value={formData.group}
              onChange={e => setFormData(prev => ({ ...prev, group: e.target.value as Group }))}
              className="w-full border border-gray-300 rounded-md p-3 text-base"
              required
            >
              <option value="A">Group A</option>
              <option value="B">Group B</option>
              <option value="C">Group C</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="p-3 text-base"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full min-h-[100px] border border-gray-300 rounded-md p-3 text-base resize-none"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="p-3 text-base"
              required
            />
          </div>
          <Button type="submit" className="w-full p-3 text-base" disabled={loading}>
            {loading ? 'Adding...' : 'Add Homework'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function HomeworkCard({ group }: { group: Group }) {
  const { getHomeworkByGroup, updateHomework, deleteHomework, loading } = useHomework();
  const homeworkList = getHomeworkByGroup(group);

  const handleStatusToggle = async (homework: Homework) => {
    try {
      await updateHomework(homework.id, {
        status: homework.status === 'pending' ? 'completed' : 'pending'
      });
    } catch (error) {
      console.error('Error updating homework status:', error);
      alert('Failed to update homework status. Please try again.');
    }
  };

  const handleDelete = async (homeworkId: string) => {
    if (window.confirm('Are you sure you want to delete this homework?')) {
      try {
        await deleteHomework(homeworkId);
      } catch (error) {
        console.error('Error deleting homework:', error);
        alert('Failed to delete homework. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{group} Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-lg font-semibold">{group} Group</span>
          <span className="text-sm font-normal bg-blue-100 text-blue-800 px-3 py-1 rounded-full w-fit">
            {homeworkList.length} Assignment{homeworkList.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {homeworkList.map((hw, idx) => (
            <div key={hw.id || hw.subject + hw.dueDate + idx} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h4 className="font-semibold text-base truncate">{hw.subject}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full w-fit ${
                        hw.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {hw.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hw.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{hw.assignedBy?.name || 'Unknown Teacher'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusToggle(hw)}
                    className="flex-1 sm:flex-none text-xs h-8"
                  >
                    {hw.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(hw.id)}
                    className="text-xs text-red-600 hover:text-red-800 h-8 px-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {homeworkList.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                No homework assigned
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Homework() {
  const { refreshHomework, loading } = useHomework();

  return (
    <Layout>
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Homework Management</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={refreshHomework} 
              disabled={loading} 
              className="w-full sm:w-auto h-10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <AddHomeworkDialog />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <HomeworkCard group="A" />
          <HomeworkCard group="B" />
          <HomeworkCard group="C" />
        </div>
      </div>
    </Layout>
  );
}