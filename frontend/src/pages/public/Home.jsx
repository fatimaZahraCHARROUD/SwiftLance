// Home.jsx
import React, { useState } from 'react';
import { useNavigate, Link} from "react-router-dom";

import { 
  Menu,
  X, 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Clock, 
  DollarSign, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Star,
  Calendar,
  MessageSquare,
  FileText,
  Zap,
} from 'lucide-react';
 
const Navbar =() =>{
    const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 const navigation = [
    { name: 'Transformation', href: '#transformation' },
    { name: 'Features', href: '#features' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
       <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SwiftLance
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <button className="text-gray-600 hover:text-gray-900 transition-colors" onClick={()=>navigate('/login')}>
                Log in
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all" onClick={()=>navigate('/register')}>
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <button className="block w-full text-left py-2 text-gray-600 hover:text-gray-900">
                Log in
              </button>
              <button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>
  );
}
const Home = () => {

 

  const features = [
    {
      icon: Users,
      title: 'Client Management',
      description: 'Never lose client info again — all contacts, history, and documents in one place.',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: FolderKanban,
      title: 'Project Tracking',
      description: 'Track every project phase, milestone, and deliverable with real-time updates.',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Clock,
      title: 'Task Timer',
      description: 'Track billable hours automatically — no more guessing or manual time logs.',
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: DollarSign,
      title: 'Payment Tracking',
      description: 'Get paid faster with automated invoices and payment reminders.',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Analytics',
      description: 'See your business health at a glance — revenue, project progress, and more.',
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      icon: Calendar,
      title: 'Smart Calendar',
      description: 'Never miss a deadline with integrated project and task scheduling.',
      color: 'bg-pink-50',
      iconColor: 'text-pink-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Freelance Developer',
      content: 'Before SwiftLance, I was lost in spreadsheets and WhatsApp messages. Now everything is organized in one dashboard. Saved me 10+ hours weekly!',
      rating: 5,
      avatar: 'SC'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Agency Owner',
      content: 'Managing 15+ clients used to be chaos. SwiftLance gave me back my sanity. The payment tracking alone is worth every penny.',
      rating: 5,
      avatar: 'MR'
    },
    {
      name: 'Emma Watson',
      role: 'UI/UX Designer',
      content: 'The before/after difference is unreal. I went from messy notes to a structured dashboard. My freelance business has never been more organized.',
      rating: 5,
      avatar: 'EW'
    }
  ];

  const painPoints = [
    'Messy Excel sheets that never match',
    'Lost client information and conversations',
    'Unpaid invoices slipping through cracks',
    'Tasks scattered across 5 different apps'
  ];

  const beforeItems = ['Excel spreadsheets', 'WhatsApp chaos', 'Lost files & notes', 'Manual time tracking', 'Late payments'];
  const afterItems = ['Unified dashboard', 'Centralized communication', 'Smart document storage', 'Automated timers', 'Payment reminders'];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                <Zap size={14} className="mr-1" />
                The #1 Tool for Freelancers
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Manage clients, projects and tasks in{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  one smart dashboard
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Save time, organize your freelance work, and get paid faster. Stop juggling multiple tools — everything you need is here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  🚀 Get Started Free
                  <ArrowRight size={18} />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                  🔐 Live Demo
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>14-day free trial</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  ⭐ Used by 5,000+ freelancers & small teams to simplify workflow
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 shadow-2xl">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-xs text-gray-500 ml-2">dashboard.swiftlance.app</span>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500">Active Projects</div>
                        <div className="text-xl font-bold text-gray-900">12</div>
                      </div>
                      <div className="bg-green-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500">This Month</div>
                        <div className="text-xl font-bold text-gray-900">$8,450</div>
                      </div>
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500">Tasks Due</div>
                        <div className="text-xl font-bold text-gray-900">8</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Website Redesign</span>
                        <span className="text-gray-900 font-medium">75%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">Mobile App Development</span>
                        <span className="text-gray-900 font-medium">45%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-2/4 bg-indigo-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-2xl opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The freelancer's reality 😫
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              You waste more time managing work than actually doing work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {painPoints.map((pain, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                  <AlertCircle size={24} className="text-red-400 flex-shrink-0" />
                  <span className="text-gray-700">{pain}</span>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-400 ml-2">chaos.xlsx</span>
              </div>
              <div className="space-y-3">
                {['Client A - pending', 'URGENT: Review contract', 'Invoice #234 - overdue', 'Project brief v5_final_FINAL', 'Task: Call client tomorrow'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText size={14} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-4">
              ✨ The Solution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              SwiftLance brings everything into{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                one simple dashboard
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Client Management', icon: Users, desc: 'All client data in one place' },
              { title: 'Project Tracking', icon: FolderKanban, desc: 'Real-time progress updates' },
              { title: 'Task Management', icon: CheckCircle, desc: 'Never miss a deadline' },
              { title: 'Payments Tracking', icon: DollarSign, desc: 'Get paid faster' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon size={32} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before vs After Section */}
      <section className="py-16 bg-gray-50" id="transformation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Before vs After
            </h2>
            <p className="text-xl text-gray-600">See the difference for yourself</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  😵 Before SwiftLance
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {beforeItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2">
                  😎 After SwiftLance
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {afterItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to run your freelance business
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to save you time and money
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} className={feature.iconColor} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by 5,000+ freelancers
            </h2>
            <p className="text-xl text-gray-600">Don't just take our word for it</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">⭐ Based on 500+ reviews • 4.9/5 average rating</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop managing chaos. Start managing growth.
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of freelancers who have transformed their workflow with SwiftLance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2">
              🚀 Get Started Free
              <ArrowRight size={18} />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              🔐 Login Now
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
     <footer className="bg-gray-900 text-gray-400 py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="grid md:grid-cols-3 gap-10">

      {/* Brand */}
      <div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          SwiftLance
        </span>
        <p className="mt-3 text-sm text-gray-400">
          The smart dashboard for freelancers to manage clients, projects, and payments in one place.
        </p>

        {/* Social links */}
        <div className="flex gap-4 mt-5">
  <a
    href="https://github.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-lg hover:bg-gray-800 hover:text-white transition"
  >
    Github
  </a>

  <a
    href="https://www.linkedin.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-lg hover:bg-gray-800 hover:text-white transition"
  >
    Linkedin
  </a>

  <a
    href="https://www.instagram.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-lg hover:bg-gray-800 hover:text-white transition"
  >
    Instagram
  </a>
</div> 
      </div>

      {/* Navigation */}
      <div>
        <h4 className="text-white font-semibold mb-4">Navigation</h4>
        <ul className="space-y-3 text-sm">
          <li>
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
          </li>
          <li>
            <a href="#transformation" className="hover:text-white transition">
              Transformation
            </a>
          </li>
          <li>
            <a href="#testimonials" className="hover:text-white transition">
              Testimonials
            </a>
          </li>
        </ul>
      </div>

      {/* Extra value section */}
      <div>
        <h4 className="text-white font-semibold mb-4">Why SwiftLance?</h4>
        <ul className="space-y-3 text-sm">
          <li>✔ Save 10+ hours per week</li>
          <li>✔ Organize all clients in one place</li>
          <li>✔ Track payments automatically</li>
          <li>✔ Built for freelancers & agencies</li>
        </ul>
      </div>

    </div>

    {/* Bottom */}
    <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
      <p>© {new Date().getFullYear()} SwiftLance. All rights reserved.</p>
    </div>

  </div>
</footer>
    </div>
  );
};

export default Home;