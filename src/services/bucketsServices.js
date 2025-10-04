const getAllBuckets = async () => {
  try {
    // Mock data - replace with actual API call
    const mockBuckets = [
      { id: 'bucket-3', name: 'HighValue' },
      { id: 'a30a2267-9e94-44ba-bf6f-28b2a9343bf0', name: 'bucket-4' },
      { id: '54885a48-0031-4f41-8670-d5ba11100887', name: 'Renamed Bucket' },
      { id: '1f6a83a0-0c48-4f21-9f48-7cbc5a2f20af', name: 'new one' }
    ];

    return mockBuckets;
  } catch (error) {
    console.error('Error loading buckets:', error);
    throw error;
  }
};

const addNewBucket = async (bucketName) => {
  try {
    // Mock API call - replace with actual API call
    console.log('Mock API call: POST /api/main-service/buckets/add-bucket', { bucket_name: bucketName });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate a mock UUID for the new bucket
    const generateMockId = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const newBucket = {
      bucketId: generateMockId(),
      bucketName: bucketName
    };

    // Mock successful response
    return {
      status_code: 200,
      content: newBucket
    };
  } catch (error) {
    console.error('Error adding bucket:', error);
    throw error;
  }
};

const updateBucketName = async (bucketId, bucketName) => {
  try {
    // Mock API call - replace with actual API call
    console.log('Mock API call: PUT /api/main-service/buckets/update-bucket-name', { bucket_id: bucketId, bucket_name: bucketName });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedBucket = {
      bucketId: bucketId,
      bucketName: bucketName
    };

    // Mock successful response
    return {
      status_code: 200,
      content: updatedBucket
    };
  } catch (error) {
    console.error('Error updating bucket:', error);
    throw error;
  }
};

const deleteBucket = async (bucketId) => {
  try {
    // Mock API call - replace with actual API call
    console.log('Mock API call: DELETE /api/main-service/buckets/delete-bucket', { bucket_id: bucketId });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful response
    return {
      status_code: 200,
      content: { message: 'Bucket deleted successfully', bucketId: bucketId }
    };
  } catch (error) {
    console.error('Error deleting bucket:', error);
    throw error;
  }
};

export { getAllBuckets, addNewBucket, updateBucketName, deleteBucket };
