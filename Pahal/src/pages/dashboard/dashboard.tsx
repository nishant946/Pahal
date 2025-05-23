import React, { useEffect } from 'react'
import Layout from '@/components/layout/layout'
import DashboardCard from '@/components/card/dashboardCard'
import { HomeworkSummary } from '@/components/homework/HomeworkSummary'
import { YesterdayHomeworkSummary } from '@/components/homework/YesterdayHomeworkSummary'
import { User, Calendar } from 'lucide-react'
import axios from 'axios'

interface todos {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}

function Dashboard() {
    const [DashboardCardContent, setDashboardCardContent] = React.useState<todos[]>([]);

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
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-700">Welcome to your dashboard!</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white overflow-hidden rounded-lg shadow transition-transform hover:scale-105">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-50 p-3 rounded-lg">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                                        <dd className="text-lg font-medium text-gray-900">120</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden rounded-lg shadow transition-transform hover:scale-105">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-50 p-3 rounded-lg">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Today's Attendance</dt>
                                        <dd className="text-lg font-medium text-gray-900">95%</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                {/* Today's Homework Summary */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <HomeworkSummary />
                </div>

                {/* Yesterday's Homework Summary */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <YesterdayHomeworkSummary />
                </div>

                {/* Tasks/Todos */}
                <div className="bg-white shadow rounded-lg">
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Tasks</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {DashboardCardContent.map((todo) => (
                                <DashboardCard 
                                    key={todo.id} 
                                    title={todo.todo} 
                                    content={todo.completed ? "Completed" : "Pending"} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard