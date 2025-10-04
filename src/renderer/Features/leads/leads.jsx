import React, { useState, useEffect } from 'react';
import LeadsContainer from './components/LeadsContainer';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock API function to simulate fetching leads
  const fetchLeads = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data based on the API structure provided
    return {
      leads: [
        {
          leadId: "9ccae302-b638-4283-9714-d305c56a1280",
          url: "https://linkedin.com/in/johnsmith",
          username: "johnsmith",
          platform: "linkedin",
          status: "new",
          notes: "Tech executive interested in our solutions"
        },
        {
          leadId: "dc9b72bd-1f19-44e3-a978-fa7963c08156",
          url: "https://instagram.com/sarahjohnson_marketing",
          username: "sarahjohnson_marketing",
          platform: "insta",
          status: "contacted",
          notes: "Marketing influencer with 50k followers, responded positively to DM"
        },
        {
          leadId: "96eba49d-94c0-48c8-b60f-c9263330bb94",
          url: "https://reddit.com/u/mikechen_startup",
          username: "mikechen_startup",
          platform: "reddit",
          status: "qualified",
          notes: "Active in r/entrepreneur, shared interest in our product after discussion"
        },
        {
          leadId: "db6b9f6d-9837-4de4-9cfd-62b592e90721",
          url: "https://behance.net/emilydavis",
          username: "emilydavis",
          platform: "behance",
          status: "new",
          notes: "Creative director with impressive portfolio, potential design client"
        },
        {
          leadId: "3ae40387-6ca5-4bca-9001-629ae045043c",
          url: "https://pinterest.com/davidwilson_diy",
          username: "davidwilson_diy",
          platform: "pinterest",
          status: "contacted",
          notes: "DIY content creator, interested in our tools for small business"
        },
        {
          leadId: "7f8e9d1c-4b5a-6c7d-8e9f-0a1b2c3d4e5f",
          url: "https://x.com/alexreynolds",
          username: "alexreynolds",
          platform: "x",
          status: "qualified",
          notes: "Tech journalist with 25k followers, interested in featuring our product"
        },
        {
          leadId: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
          url: "mailto:jessica.martinez@techstartup.com",
          username: "jessica.martinez",
          platform: "email",
          status: "new",
          notes: "CEO of promising fintech startup, found us through cold outreach"
        }
      ]
    };
  };

  // Function to update lead notes
  const updateLeadNotes = (leadId, newNotes) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.leadId === leadId 
          ? { ...lead, notes: newNotes }
          : lead
      )
    );
  };

  // Function to update lead status
  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.leadId === leadId 
          ? { ...lead, status: newStatus }
          : lead
      )
    );
  };

  // Fetch leads on component mount
  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        const response = await fetchLeads();
        setLeads(response.leads);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);


  if (loading) {
    return (
      <div className="leads-page p-6 bg-[#000000] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#8E8E93]">Loading leads...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leads-page p-6 bg-[#000000] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2">Leads</h1>
          <p className="text-[#8E8E93]">
            Browse through your leads one at a time with our card-based interface
          </p>
        </div>
        
        <LeadsContainer leads={leads} updateLeadNotes={updateLeadNotes} updateLeadStatus={updateLeadStatus} />
      </div>
    </div>
  );
};

export default Leads;
