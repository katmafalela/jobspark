"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Heart,
  ExternalLink,
  Filter,
  Search,
  Building2,
  Users,
  TrendingUp,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import Link from "next/link";

const JobMatchesPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set([1, 3]));

  const filters = [
    { id: "all", label: "All Jobs", count: 24 },
    { id: "recommended", label: "Recommended", count: 8 },
    { id: "recent", label: "Recent", count: 12 },
    { id: "saved", label: "Saved", count: 2 }
  ];

  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Takealot",
      location: "Cape Town, WC",
      type: "Full-time",
      salary: "R45,000 - R65,000",
      posted: "2 days ago",
      match: 95,
      description: "We're looking for a Senior Software Engineer to join our growing team. You'll work on scalable web applications using modern technologies.",
      requirements: ["5+ years experience", "React/Node.js", "AWS knowledge"],
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Discovery",
      location: "Johannesburg, GP",
      type: "Full-time",
      salary: "R55,000 - R75,000",
      posted: "1 day ago",
      match: 88,
      description: "Join our product team to drive innovation in financial services. Lead cross-functional teams to deliver exceptional user experiences.",
      requirements: ["3+ years PM experience", "Agile methodology", "Financial services background"],
      logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=64&h=64&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Naspers",
      location: "Cape Town, WC",
      type: "Full-time",
      salary: "R35,000 - R50,000",
      posted: "3 days ago",
      match: 92,
      description: "Create intuitive and engaging user experiences for our digital products. Work closely with product and engineering teams.",
      requirements: ["Portfolio required", "Figma/Sketch", "User research experience"],
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center"
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "Standard Bank",
      location: "Johannesburg, GP",
      type: "Full-time",
      salary: "R50,000 - R70,000",
      posted: "1 week ago",
      match: 85,
      description: "Analyze complex datasets to drive business insights and build predictive models for our banking operations.",
      requirements: ["Python/R", "Machine Learning", "SQL expertise"],
      logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=64&h=64&fit=crop&crop=center"
    }
  ];

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const filteredJobs = jobs.filter(job => {
    if (selectedFilter === "saved") return savedJobs.has(job.id);
    if (selectedFilter === "recommended") return job.match >= 90;
    if (selectedFilter === "recent") return job.posted.includes("day");
    return true;
  }).filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <Briefcase className="w-8 h-8 text-green-500" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Job Matches</h1>
                  <p className="text-sm text-slate-600">Find your perfect role</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-4">Filter Jobs</h2>
              <nav className="space-y-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedFilter === filter.id
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className="text-sm bg-slate-100 px-2 py-1 rounded-full">
                      {filter.id === "saved" ? savedJobs.size : filter.count}
                    </span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Profile Views</span>
                    <span className="font-semibold text-slate-900">127</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Applications</span>
                    <span className="font-semibold text-slate-900">12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Response Rate</span>
                    <span className="font-semibold text-green-600">25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedFilter === "all" ? "All Job Matches" : 
                   selectedFilter === "recommended" ? "Recommended for You" :
                   selectedFilter === "recent" ? "Recent Postings" : "Saved Jobs"}
                </h2>
                <p className="text-slate-600">{filteredJobs.length} jobs found</p>
              </div>
              <select className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Sort by Match</option>
                <option>Sort by Date</option>
                <option>Sort by Salary</option>
              </select>
            </div>

            <div className="space-y-6">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-1">{job.title}</h3>
                        <div className="flex items-center space-x-4 text-slate-600 text-sm">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.posted}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold text-slate-900">{job.match}% match</span>
                        </div>
                        <div className="text-sm text-slate-600">{job.type}</div>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        {savedJobs.has(job.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-green-500" />
                        ) : (
                          <Bookmark className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center space-x-1 mb-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-slate-900">{job.salary}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{job.description}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-slate-900 mb-2">Key Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>50+ applicants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Growing company</span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                        Learn More
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <span>Apply Now</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-600">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatchesPage;