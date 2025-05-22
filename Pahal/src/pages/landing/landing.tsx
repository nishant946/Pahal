import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-b from-blue-900 to-blue-700 text-white">
        <nav className="absolute top-0 left-0 right-0 z-10 px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">पहल</h1>          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-white border-white relative inline-flex items-center gap-2 transition-all duration-300 ease-in-out overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:text-red-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="relative z-10 group-hover:text-red-900">Teacher Login</span>
            </Button>
          </div>
        </nav>

        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl lg:text-7xl font-bold leading-tight">
              Empowering Through Education
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100">
              A bridge between MIT volunteers and the children of Asrong MIT, 
              providing free quality education to shape tomorrow's leaders.
            </p>            <div className="flex justify-center pt-8">              <Button
                size="lg"
                onClick={() => navigate('/teacher-login')}
                className="text-white border-2 border-white relative inline-flex items-center gap-3 transition-all duration-300 ease-in-out overflow-hidden group px-8 py-4 hover:scale-105 shadow-lg hover:shadow-white/20"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10 group-hover:text-red-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-lg font-semibold relative z-10 group-hover:text-red-900">Volunteer as Teacher</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ImpactCard
              number="500+"
              title="Students Reached"
              description="Providing free education to children from Asrong MIT"
            />
            <ImpactCard
              number="50+"
              title="MIT Volunteers"
              description="Dedicated teachers sharing knowledge and expertise"
            />
            <ImpactCard
              number="5+"
              title="Years of Service"
              description="Committed to transforming lives through education"
            />
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Our Programs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">            <ProgramCard
              title="Academic Support"
              description="Core subject tutoring aligned with school curriculum"
              icon="📚"
            />
            <ProgramCard
              title="Digital Literacy"
              description="Essential computer and internet skills for the modern world"
              icon="💻"
            />
          </div>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">          <h2 className="text-3xl font-bold mb-8">Join Our Teaching Community</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Share your knowledge and make a difference in the lives of students at Asrong MIT.
            Join our community of dedicated MIT volunteers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/contact')}
              className="text-white border-2 border-white relative inline-flex items-center gap-2 transition-all duration-300 hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-white/20 px-8 py-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact Us</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About पहल</h3>
              <p className="text-gray-400">
                A volunteer-driven initiative providing free education to empower 
                the children of Asrong MIT through quality education and mentorship.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/about')} className="hover:text-white">About Us</button></li>
                <li><button onClick={() => navigate('/programs')} className="hover:text-white">Programs</button></li>
                <li><button onClick={() => navigate('/volunteer')} className="hover:text-white">Volunteer</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: contact@pahal.org<br />
                Location: Asrong MIT Campus<br />
                Phone: +91 XXXXXXXXXX
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} पहल Initiative. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Impact Card Component
function ImpactCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center space-y-4">
      <div className="text-5xl font-bold text-blue-600">{number}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

// Program Card Component
function ProgramCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default Landing
