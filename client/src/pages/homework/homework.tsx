import { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useHomework } from '@/contexts/homeworkContext';
import { Plus, CalendarDays } from 'lucide-react';

type Group = 'A' | 'B' | 'C';

function AddHomeworkDialog() {
  const { addHomework } = useHomework();
  const [formData, setFormData] = useState({
    group: 'A' as Group,
    subject: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHomework({
      ...formData,
      dateAssigned: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
  };

  return (
    <Dialog>
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
          <Button type="submit" className="w-full">Add Homework</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function HomeworkCard({ group }: { group: Group }) {
  const { getHomeworkByGroup } = useHomework();
  const homeworkList = getHomeworkByGroup(group);

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
                <div>
                  <h4 className="font-semibold">{hw.subject}</h4>
                  <p className="text-sm text-gray-600 mt-1">{hw.description}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  {new Date(hw.dueDate).toLocaleDateString()}
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
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Homework Management</h1>
          <AddHomeworkDialog />
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