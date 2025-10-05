const ipAddress = "http://127.0.0.1:8000";

// Small helper to perform fetch and return a consistent shape:
// { status_code: number, content: any }
const request = async (path, options = {}) => {
  const url = `${ipAddress}${path}`;
  const fetchOptions = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  try {
    const resp = await fetch(url, fetchOptions);
    let content;
    try {
      content = await resp.json();
    } catch (err) {
      // Non-JSON response
      content = { detail: await resp.text() };
    }

    return { status_code: resp.status, content };
  } catch (error) {
    console.error('Network error while calling', url, error);
    // Keep a consistent return shape for network errors
    return { status_code: 503, content: { detail: String(error) } };
  }
};

// Get all leads, optionally filtered by bucket_id
const getAllLeads = async (bucketId = null) => {
  const params = new URLSearchParams();
  if (bucketId) {
    params.append('bucket_id', bucketId);
  }
  
  const path = `/api/main-service/leads/get-all-leads${params.toString() ? '?' + params.toString() : ''}`;
  const resp = await request(path, { method: 'GET' });

  if (!resp || resp.status_code !== 200) {
    console.error('Failed to fetch leads or non-200 response:', resp);
    return [];
  }

  const content = resp.content;

  // Normalize common response shapes to an array of leads
  if (Array.isArray(content)) return normalizeLeads(content);
  if (content && Array.isArray(content.leads)) return normalizeLeads(content.leads);
  if (content && Array.isArray(content.content)) return normalizeLeads(content.content);
  if (content && Array.isArray(content.data)) return normalizeLeads(content.data);

  console.warn('Unexpected leads response shape, returning empty list:', content);
  return [];
};

// Helper to normalize lead object fields
const normalizeLeads = (arr) => {
  return arr.map((lead) => {
    if (!lead || typeof lead !== 'object') return null;
    
    // Normalize lead fields
    const leadId = lead.leadId || lead.lead_id || lead.id || lead._id;
    const url = lead.url || '';
    const username = lead.username || lead.user_name || '';
    const platform = lead.platform || '';
    const status = lead.status || 'new';
    const notes = lead.notes || '';
    
    return {
      leadId: leadId ? String(leadId) : null,
      url,
      username,
      platform,
      status,
      notes,
      ...lead // Preserve other fields if needed
    };
  }).filter(Boolean);
};

// Update lead status
const updateLeadStatus = async (leadId, status) => {
  if (!leadId || !status) {
    return { status_code: 400, content: { detail: 'lead_id and status are required' } };
  }

  const resp = await request('/api/main-service/leads/update-lead-status', {
    method: 'PUT',
    body: JSON.stringify({ lead_id: leadId, status }),
  });

  return resp;
};

// Update lead notes
const updateLeadNotes = async (leadId, notes) => {
  if (!leadId) {
    return { status_code: 400, content: { detail: 'lead_id is required' } };
  }

  const resp = await request('/api/main-service/leads/update-lead-notes', {
    method: 'PUT',
    body: JSON.stringify({ lead_id: leadId, notes: notes || '' }),
  });

  return resp;
};

// Add lead by uploading an image file
const addLead = async (imageFile, bucketId = null) => {
  console.log('🔄 leadsService.addLead called with:', {
    fileName: imageFile?.name,
    fileSize: imageFile?.size,
    fileType: imageFile?.type,
    bucketId: bucketId
  });

  if (!imageFile) {
    console.error('❌ leadsService.addLead: No image file provided');
    return { status_code: 400, content: { detail: 'Image file is required' } };
  }

  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', imageFile);
    
    // Add bucket_id if provided
    if (bucketId) {
      formData.append('bucket_id', bucketId);
      console.log('✅ leadsService.addLead: Added bucket_id to FormData:', bucketId);
    }

    const url = `${ipAddress}/api/main-service/leads/add-lead`;
    console.log('📤 leadsService.addLead: Making request to:', url);
    
    const fetchOptions = {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary for FormData
    };

    console.log('⏳ leadsService.addLead: Sending request...');
    const resp = await fetch(url, fetchOptions);
    console.log('📥 leadsService.addLead: Response received - Status:', resp.status, 'OK:', resp.ok);
    
    let content;
    try {
      content = await resp.json();
      console.log('✅ leadsService.addLead: JSON response parsed:', content);
    } catch (err) {
      // Non-JSON response
      console.log('⚠️ leadsService.addLead: Non-JSON response, getting text...');
      const textContent = await resp.text();
      console.log('📄 leadsService.addLead: Text response:', textContent);
      content = { detail: textContent };
    }

    const result = { status_code: resp.status, content };
    console.log('🔙 leadsService.addLead: Returning result:', result);
    return result;
  } catch (error) {
    console.error('💥 leadsService.addLead: Network error:', error);
    console.error('💥 leadsService.addLead: Error stack:', error.stack);
    return { status_code: 503, content: { detail: String(error) } };
  }
};

export { getAllLeads, updateLeadStatus, updateLeadNotes, addLead };
