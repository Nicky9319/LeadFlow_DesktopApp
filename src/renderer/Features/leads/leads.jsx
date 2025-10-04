import React, { useState } from 'react';
import LeadsContainer from './components/LeadsContainer';

const Leads = () => {
  // Sample leads data - replace with actual data from your store/API
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'John Smith',
      company: 'Tech Solutions Inc.',
      email: 'john.smith@techsolutions.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      status: 'Hot',
      value: 50000,
      notes: 'Interested in our premium package. Follow up next week.',
      tags: ['Enterprise', 'High Value', 'Decision Maker']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'Marketing Pro',
      email: 'sarah@marketingpro.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      status: 'Warm',
      value: 25000,
      notes: 'Looking for a solution to streamline their marketing processes.',
      tags: ['SMB', 'Marketing', 'Quick Decision']
    },
    {
      id: 3,
      name: 'Mike Chen',
      company: 'StartupXYZ',
      email: 'mike@startupxyz.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      status: 'Cold',
      value: 15000,
      notes: 'Early stage startup, budget conscious but very interested.',
      tags: ['Startup', 'Budget Conscious', 'Tech Savvy']
    },
    {
      id: 4,
      name: 'Emily Davis',
      company: 'Global Corp',
      email: 'emily.davis@globalcorp.com',
      phone: '+1 (555) 321-0987',
      location: 'Chicago, IL',
      status: 'Hot',
      value: 75000,
      notes: 'Large enterprise client, multiple decision makers involved.',
      tags: ['Enterprise', 'High Value', 'Complex Sale']
    },
    {
      id: 5,
      name: 'David Wilson',
      company: 'Local Business',
      email: 'david@localbusiness.com',
      phone: '+1 (555) 654-3210',
      location: 'Miami, FL',
      status: 'Warm',
      value: 10000,
      notes: 'Small business owner looking to modernize their operations.',
      tags: ['SMB', 'Local', 'Traditional Business']
    }
  ]);


  return (
    <div className="leads-page p-6 bg-[#000000] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2">Leads</h1>
          <p className="text-[#8E8E93]">
            Browse through your leads one at a time with our card-based interface
          </p>
        </div>
        
        <LeadsContainer leads={leads} />
      </div>
    </div>
  );
};

export default Leads;
