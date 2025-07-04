import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import pahalLogo from "../../assets/pahalLogo.png";
import { useTeacherAuth } from "@/contexts/teacherAuthContext";

function Landing() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const { teacher } = useTeacherAuth();

  useEffect(() => {
    if (teacher) {
      navigate("/dashboard");
    }
    setIsVisible(true);
  }, [teacher, navigate]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section with Animated Background */}
      <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>

        <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-black/10">
          <h1
            className={`text-3xl font-bold transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              <img
                src={pahalLogo}
                alt="Pahal Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-contain bg-white shadow"
              />

              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                पहल
              </span>
            </div>
          </h1>
          <div
            className={`space-x-4 transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="text-black border-white/50 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Teacher Login
            </Button>
          </div>
        </nav>

        <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div
              className={`transition-all duration-1000 delay-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h1 className="text-5xl lg:text-8xl font-bold leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Empowering Through
                <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  Education
                </span>
              </h1>
            </div>

            <div
              className={`transition-all duration-1000 delay-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Bridging hearts and hopes connecting MIT volunteers with
                underprivileged children through free, quality education to
                build a brighter tomorrow.
              </p>
            </div>

            <div
              className={`flex flex-col sm:flex-row justify-center gap-4 pt-8 transition-all duration-1000 delay-900 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="relative z-10">Volunteer as Teacher</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Mission Section with Animated Cards */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Impact
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From the classrooms of MIT to the hearts of a community creating
              change, one child at a time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AnimatedImpactCard
              number="200+"
              title="Students Reached"
              description="Over the past 3 years, Pahal has become a beacon of hope for the underprivileged children around MIT Muzaffarpur offering them not just education, but a chance at a brighter future. Many of them have excelled in board exams and cracked scholarship tests, turning dreams into reality."
              icon="🎓"
              delay={0}
            />
            <AnimatedImpactCard
              number="50+"
              title="MIT Volunteers"
              description="Every week, passionate MITians step up giving just one hour of their time to teach, mentor and inspire. These students turned teachers bring compassion, creativity, and consistency, ensuring every child feels seen, heard, and uplifted."
              icon="👨‍🏫"
              delay={200}
            />
            <AnimatedImpactCard
              number="3+"
              title="Years of Service"
              description="What began as a small initiative by the 2020 batch has now grown into a legacy. Carried forward by 2021, now led by the 2022 batch Pahal continues to thrive with collective commitment, building not just students but responsible citizens."
              icon="⭐"
              delay={400}
            />
          </div>
        </div>
      </div>

      {/* Programs Section with Interactive Cards */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Programs
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More than education nurturing young minds with knowledge, skills,
              and values for life. Pahal's programs are thoughtfully designed to
              offer holistic development. From academic support to life skills,
              we ensure every child grows with confidence, curiosity, and care.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <AnimatedProgramCard
              title="Academic Support"
              description="Strengthening school foundations through personalized and curriculum-aligned learning."
              icon="📚"
              features={[
                "One-on-one attention based on each child's pace and understanding",
                "Core subject guidance: Mathematics, Science, and Languages",
                "Regular progress tracking and feedback",
                "Many students have excelled in board exams and earned scholarships",
              ]}
              delay={0}
            />
            <AnimatedProgramCard
              title=" Life Skills & Extra Curriculars"
              description="Empowering students with essential life skills and enriching extracurricular activities."
              icon="🌟"
              features={[
                "Cleanliness, discipline, time management, and basic life values",
                "Public speaking, storytelling, drawing, dance, and games",
                "Activities that build communication skills, confidence, and curiosity",
              ]}
              delay={200}
            />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Community
              </span>{" "}
              Says
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              quote="पहल has transformed the way our children learn. The dedication of MIT volunteers is truly inspiring."
              author="Parent"
              role="Student guardian"
              delay={0}
            />
            <TestimonialCard
              quote="Teaching here has been one of the most rewarding experiences of my life. The students are eager to learn."
              author="MIT Volunteer"
              role="Teacher"
              delay={200}
            />
            <TestimonialCard
              quote="I love coming to class every day. The teachers make learning fun and interesting!"
              author="Student"
              role="Grade 8"
              delay={400}
            />
          </div>
        </div>
      </div>

      {/* Join Us Section with CTA */}
      <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Join Our{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Teaching
            </span>{" "}
            Community
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            One hour a week. A lifetime of impact. At Pahal, you don't need to
            be a professional teacher just a passionate MITian with the heart to
            help. With just one hour a week, you can light up the path of a
            child who's eager to learn but can't afford a classroom. Join a
            growing family of 40+ MIT volunteers who are not only teaching
            lessons, but shaping futures one student, one smile, one
            breakthrough at a time.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="relative z-10">Start Teaching Today</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                पहल Initiative
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-md">
                A student led journey of hope, learning, and transformation.
                Pahal is a student-driven initiative by MIT Muzaffarpur that
                provides free education to underprivileged children living near
                the campus especially those who cannot afford formal learning.
                Our goal is not just to teach, but to show them what education
                can truly do how it can open doors, build dreams, and transform
                lives. Because education isn't just a subject it's a spark that
                can change everything.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  pahalmit@gmail.com
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} पहल Initiative. All rights
              reserved. | Empowering through education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Animated Impact Card Component
function AnimatedImpactCard({
  number,
  title,
  description,
  icon,
  delay,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10 text-center space-y-4">
        <div className="text-6xl mb-4">{icon}</div>
        <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
          {number}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Animated Program Card Component
function AnimatedProgramCard({
  title,
  description,
  icon,
  features,
  delay,
}: {
  title: string;
  description: string;
  icon: string;
  features: string[];
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="text-5xl mb-6">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <svg
                className="h-5 w-5 text-green-500 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({
  quote,
  author,
  role,
  delay,
}: {
  quote: string;
  author: string;
  role: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="absolute top-4 left-4 text-4xl text-gray-200 group-hover:text-gray-300 transition-colors duration-300">
        "
      </div>
      <div className="relative z-10">
        <p className="text-gray-700 leading-relaxed mb-6 mt-4 italic">
          "{quote}"
        </p>
        <div className="border-t border-gray-200 pt-4">
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
