import React, {useEffect } from 'react'
import Layout from '@/components/layout/layout';
import DashboardCard from '@/components/card/dashboardCard';
import axios from 'axios';

// {
//   "todos": [
//     {
//       "id": 1,
//       "todo": "Do something nice for someone I care about",
//       "completed": true,
//       "userId": 26
//     },
//     {...},
//     {...}
//     // 30 items
//   ],
//   "total": 150,
//   "skip": 0,
//   "limit": 30
// }

interface todos{
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}




function Dashboard() {
    const [DashboardCardContent,setDashboardCardContent] = React.useState<todos[]>([]);
useEffect(() => {
        const fetchDashboardCardContent = async () => {
    try {
        const response = await axios.get('https://dummyjson.com/todos');
        const data = response.data;
        setDashboardCardContent(data.todos);
    } catch (error) {
        console.error('Error fetching dashboard card content:', error);
    }
    }

    fetchDashboardCardContent();
}, []);
  return (
    <Layout>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4">Welcome to the dashboard!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
           {DashboardCardContent.map((todo) => (
               <DashboardCard key={todo.id} title={todo.todo} content={todo.completed ? "Completed" : "Not Completed"} />
           ))}
        </div>
    </Layout>
    
  )
}

export default Dashboard;