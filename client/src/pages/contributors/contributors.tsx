import { useState, useEffect } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin, Globe, Github, Mail } from 'lucide-react';
import { getContributors, type Contributor } from '@/services/contributorService';

export default function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contributors on component mount
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        const data = await getContributors();
        setContributors(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching contributors:', err);
        setError('Failed to load contributors');
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contributors...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Contributors
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the passionate individuals who have made Pahal possible. Their dedication, 
            expertise, and commitment to education continue to drive our mission forward.
          </p>
        </div>

        {contributors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No contributors to display at the moment.</p>
          </div>
        ) : (
          <>
            {/* Initiators Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Initiative Founders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {contributors
                  .filter(contributor => contributor.role.toLowerCase().includes('founder') || 
                                       contributor.role.toLowerCase().includes('initiator'))
                  .map((contributor) => (
                    <ContributorCard key={contributor._id} contributor={contributor} isFounder={true} />
                  ))}
              </div>
            </div>

            {/* Other Contributors Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Contributors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {contributors
                  .filter(contributor => !contributor.role.toLowerCase().includes('founder') && 
                                       !contributor.role.toLowerCase().includes('initiator'))
                  .map((contributor) => (
                    <ContributorCard key={contributor._id} contributor={contributor} isFounder={false} />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

interface ContributorCardProps {
  contributor: Contributor;
  isFounder?: boolean;
}

function ContributorCard({ contributor, isFounder = false }: ContributorCardProps) {
  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      isFounder ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent' : ''
    }`}>
      <CardContent className="p-6">
        <div className="text-center">
          {/* Profile Image */}
          <div className="relative mx-auto mb-4 w-24 h-24">
            {contributor.image ? (
              <img
                src={contributor.image}
                alt={contributor.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {contributor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
            {isFounder && (
              <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full shadow-md">
                Founder
              </div>
            )}
          </div>

          {/* Name and Role */}
          <h3 className="text-xl font-bold text-gray-900 mb-1">{contributor.name}</h3>
          <p className="text-primary font-medium mb-2">{contributor.role}</p>

          {/* Batch and Branch */}
          {(contributor.batch || contributor.branch) && (
            <div className="mb-3 space-y-1">
              {contributor.batch && (
                <p className="text-sm text-gray-500 font-medium">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                    Batch: {contributor.batch}
                  </span>
                </p>
              )}
              {contributor.branch && (
                <p className="text-sm text-gray-500 font-medium">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
                    {contributor.branch}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Bio */}
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {contributor.description}
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-3">
            {contributor.linkedinUrl && (
              <a
                href={contributor.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {contributor.githubUrl && (
              <a
                href={contributor.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {contributor.websiteUrl && (
              <a
                href={contributor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                title="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
            {contributor.email && (
              <a
                href={`mailto:${contributor.email}`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}