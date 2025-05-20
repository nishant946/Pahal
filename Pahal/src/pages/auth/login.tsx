import Layout from '@/components/layout/layout'
import React from 'react'

function Login():React.ReactNode {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default Login