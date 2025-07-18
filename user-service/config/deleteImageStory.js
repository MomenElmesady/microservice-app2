const cloudinary = require('./cloudinary');

const deleteExpiredStories = async () => {
  try {
    const { resources } = await cloudinary.api.resources_by_tag('story');

    const now = new Date();
    for (const resource of resources) {
      const createdAt = new Date(resource.created_at);
      if (now - createdAt > 24 * 60 * 60 * 1000) {
        await cloudinary.uploader.destroy(resource.public_id);
        console.log(`Deleted expired story: ${resource.public_id}`);
      }
    }
  } catch (error) {
    console.error('Error deleting expired stories:', error);
  }
};

// Run every 24 hours
setInterval(deleteExpiredStories, 24 * 60 * 60 * 1000);
