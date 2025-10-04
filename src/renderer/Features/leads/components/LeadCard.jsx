import React from 'react';

const LeadCard = ({ lead, isActive }) => {
  if (!lead) return null;

  return (
    <div 
      className={`lead-card transition-all duration-300 ease-in-out ${
        isActive 
          ? 'opacity-100 scale-100 translate-x-0' 
          : 'opacity-0 scale-95 translate-x-4 pointer-events-none'
      }`}
    >
      <div className="bg-[#111111] rounded-lg shadow-lg border border-[#1C1C1E] p-6 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {lead.name?.charAt(0)?.toUpperCase() || 'L'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#FFFFFF]">
                {lead.name || 'Unknown Lead'}
              </h3>
              <p className="text-sm text-[#8E8E93]">
                {lead.company || 'No Company'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              lead.status === 'Hot' ? 'bg-[#FF3B30] text-white' :
              lead.status === 'Warm' ? 'bg-[#FF9500] text-white' :
              lead.status === 'Cold' ? 'bg-[#8E8E93] text-white' :
              'bg-[#00D09C] text-white'
            }`}>
              {lead.status || 'New'}
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          {lead.email && (
            <div className="flex items-center text-sm text-[#E5E5E7]">
              <svg className="w-4 h-4 mr-2 text-[#8E8E93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {lead.email}
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center text-sm text-[#E5E5E7]">
              <svg className="w-4 h-4 mr-2 text-[#8E8E93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {lead.phone}
            </div>
          )}
          {lead.location && (
            <div className="flex items-center text-sm text-[#E5E5E7]">
              <svg className="w-4 h-4 mr-2 text-[#8E8E93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {lead.location}
            </div>
          )}
        </div>

        {/* Notes/Description */}
        {lead.notes && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-[#E5E5E7] mb-2">Notes</h4>
            <p className="text-sm text-[#E5E5E7] bg-[#1C1C1E] p-3 rounded-md">
              {lead.notes}
            </p>
          </div>
        )}

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-[#E5E5E7] mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 text-xs font-medium bg-[#2D2D2F] text-[#E5E5E7] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Value */}
        {lead.value && (
          <div className="flex justify-between items-center pt-4 border-t border-[#1C1C1E]">
            <span className="text-sm font-medium text-[#E5E5E7]">Estimated Value</span>
            <span className="text-lg font-bold text-[#00D09C]">
              ${lead.value.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
