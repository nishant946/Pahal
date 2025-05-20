import React from 'react'

function DashboardCard({ title, content }) {
  return (
    <div>
        <div className="bg-white shadow-md p-4 rounded-lg">
            <p>{title}</p>
            <h2 className="text-xl font-semibold">{content}</h2>
            </div>
    </div>
  )
}

export default DashboardCard