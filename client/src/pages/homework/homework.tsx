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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Homework
        </Button>
      </DialogTrigger>
      <DialogContent>
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
              className="w-full border border-gray-300 rounded-md p-2"
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full min-h-[100px] border border-gray-300 rounded-md p-2"
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
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
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
          <CardTitle>{group} Group</CardTitle>
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
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{group} Group</span>
          <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {homeworkList.length} Assignments
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {homeworkList.map(hw => (
            <div key={hw.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{hw.subject}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      hw.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {hw.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{hw.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      Due: {new Date(hw.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {hw.assignedBy?.name || 'Unknown Teacher'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusToggle(hw)}
                    className="text-xs"
                  >
                    {hw.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(hw.id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {homeworkList.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No homework assigned
            </p>
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Homework Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshHomework} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <AddHomeworkDialog />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HomeworkCard group="A" />
          <HomeworkCard group="B" />
          <HomeworkCard group="C" />
        </div>
      </div>
    </Layout>
  );
}