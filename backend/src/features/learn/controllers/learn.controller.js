const learnService = require("../services/learn.services");

/**
 * Learn By Topic Controller
 * Handles HTTP requests for the topic-based learning feature.
 */

// ============================================================================
// CATEGORIES
// ============================================================================

// GET /learn/categories - Get all categories with items and user progress
const getCategories = async (req, res) => {
  try {
    const userId = req.user ? req.user.user_id : null;
    const categories = await learnService.getCategoriesWithItems(userId);

    return res.status(200).json({
      success: true,
      data: categories,
      message: "Categories retrieved successfully",
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi lấy danh mục học tập",
    });
  }
};

// GET /learn/categories/:slug - Get a specific category with items
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user ? req.user.user_id : null;

    const category = await learnService.getCategoryBySlug(slug);

    // Get items for this category
    const result = await learnService.getItemsByCategory(category.id);

    return res.status(200).json({
      success: true,
      data: { ...category, items: result.data },
      message: "Category retrieved successfully",
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
        message: "Không tìm thấy danh mục",
      });
    }
    console.error("Get category error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi lấy danh mục",
    });
  }
};

// ============================================================================
// LEARN ITEMS
// ============================================================================

// GET /learn/items/:itemId - Get a learn item with lessons and vocabulary
const getItemById = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    if (!itemId || isNaN(itemId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid item ID",
        message: "ID không hợp lệ",
      });
    }

    const userId = req.user ? req.user.user_id : null;
    const item = await learnService.getItemById(itemId, userId);

    return res.status(200).json({
      success: true,
      data: item,
      message: "Learn item retrieved successfully",
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
        message: "Không tìm thấy mục học tập",
      });
    }
    console.error("Get item error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi lấy mục học tập",
    });
  }
};

// POST /learn/items - Create a new learn item
const createItem = async (req, res) => {
  try {
    const data = req.body;
    if (!data.title) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
        message: "Tên khóa học là bắt buộc",
      });
    }

    const newItem = await learnService.createItem(data);
    return res.status(201).json({
      success: true,
      data: newItem,
      message: "Tạo khóa học thành công",
    });
  } catch (error) {
    console.error("Create item error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi tạo khóa học",
    });
  }
};

// GET /learn/items/:itemId/lessons - Get lessons for a learn item
const getLessonsByItemId = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    if (!itemId || isNaN(itemId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid item ID",
        message: "ID không hợp lệ",
      });
    }

    const lessons = await learnService.getLessonsByItemId(itemId);

    return res.status(200).json({
      success: true,
      data: lessons,
      message: "Lessons retrieved successfully",
    });
  } catch (error) {
    console.error("Get lessons error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi lấy bài học",
    });
  }
};

// GET /learn/lessons/:lessonId - Get a specific lesson with vocabulary
const getLessonById = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    if (!lessonId || isNaN(lessonId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid lesson ID",
        message: "ID bài học không hợp lệ",
      });
    }

    const lesson = await learnService.getLessonById(lessonId);

    return res.status(200).json({
      success: true,
      data: lesson,
      message: "Lesson retrieved successfully",
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Lesson not found",
        message: "Không tìm thấy bài học",
      });
    }
    console.error("Get lesson error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi lấy bài học",
    });
  }
};

// GET /learn/lessons/:lessonId/steps - Get interactive learning steps for a lesson
const getStepsForLesson = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    if (!lessonId || isNaN(lessonId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid lesson ID",
        message: "ID bài học không hợp lệ",
      });
    }

    const steps = await learnService.getStepsForLesson(lessonId);

    return res.status(200).json({
      success: true,
      data: steps,
      total: steps.length,
      message: "Steps generated successfully",
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Lesson not found",
        message: "Không tìm thấy bài học",
      });
    }
    console.error("Get steps error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi tạo bước học tập",
    });
  }
};

// ============================================================================
// PROGRESS
// ============================================================================

// POST /learn/progress - Update learning progress
const updateProgress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { itemId, completedLessons, totalLessons, lastLessonId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        error: "itemId is required",
        message: "ID mục học tập là bắt buộc",
      });
    }

    const result = await learnService.updateProgress(userId, itemId, {
      completedLessons: completedLessons || 0,
      totalLessons: totalLessons || 0,
      lastLessonId,
    });

    return res.status(200).json({
      success: true,
      data: result,
      message: "Progress updated successfully",
    });
  } catch (error) {
    console.error("Update progress error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi cập nhật tiến độ",
    });
  }
};

// GET /learn/progress - Get current user's overall learning progress
const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const progress = await learnService.getUserProgress(userId);

    return res.status(200).json({
      success: true,
      data: progress,
      message: "Progress retrieved successfully",
    });
  } catch (error) {
    console.error("Get progress error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi lấy tiến độ học tập",
    });
  }
};

// GET /learn/progress/:itemId - Get progress for a specific item
const getItemProgress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const itemId = parseInt(req.params.itemId);

    if (!itemId || isNaN(itemId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid item ID",
        message: "ID không hợp lệ",
      });
    }

    const progress = await learnService.getItemProgress(userId, itemId);

    return res.status(200).json({
      success: true,
      data: progress,
      message: "Item progress retrieved successfully",
    });
  } catch (error) {
    console.error("Get item progress error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi lấy tiến độ",
    });
  }
};

// ============================================================================
// VOCABULARY PROGRESS
// ============================================================================

// POST /learn/vocabulary/learned - Mark a vocabulary as learned
const markVocabularyLearned = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { vocabularyId } = req.body;

    if (!vocabularyId) {
      return res.status(400).json({
        success: false,
        error: "vocabularyId is required",
        message: "ID từ vựng là bắt buộc",
      });
    }

    const result = await learnService.markVocabularyLearned(
      userId,
      vocabularyId,
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: "Vocabulary marked as learned",
    });
  } catch (error) {
    console.error("Mark vocabulary error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi đánh dấu từ vựng đã học",
    });
  }
};

// GET /learn/vocabulary/progress - Get vocabulary learning progress
const getVocabularyProgress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const topicId = req.query.topic_id ? parseInt(req.query.topic_id) : null;

    const progress = await learnService.getUserVocabularyProgress(
      userId,
      topicId,
    );

    return res.status(200).json({
      success: true,
      data: progress,
      message: "Vocabulary progress retrieved successfully",
    });
  } catch (error) {
    console.error("Get vocabulary progress error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi lấy tiến độ từ vựng",
    });
  }
};

// ============================================================================
// SEARCH
// ============================================================================

// GET /learn/search?q=keyword - Search learn items
const searchItems = async (req, res) => {
  try {
    const q = req.query.q || "";
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'q' is required",
        message: "Từ khóa tìm kiếm là bắt buộc",
      });
    }

    const result = await learnService.searchItems(q, limit, offset);

    return res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      message: "Search completed successfully",
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi tìm kiếm",
    });
  }
};

// ============================================================================
// TOPIC-BASED LEARNING (using existing topics)
// ============================================================================

// GET /learn/topics - Get topics available for learning
const getTopicsForLearning = async (req, res) => {
  try {
    const classroomId = req.query.classroom_id
      ? parseInt(req.query.classroom_id)
      : null;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await learnService.getTopicsForLearning(
      classroomId,
      limit,
      offset,
    );

    return res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      message: "Topics retrieved successfully",
    });
  } catch (error) {
    console.error("Get topics error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi lấy danh sách chủ đề",
    });
  }
};

// GET /learn/topics/:topicId - Get a topic with its vocabularies for learning
const getTopicWithVocabularies = async (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId);
    if (!topicId || isNaN(topicId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid topic ID",
        message: "ID chủ đề không hợp lệ",
      });
    }

    const topic = await learnService.getTopicWithVocabularies(topicId);

    return res.status(200).json({
      success: true,
      data: topic,
      message: "Topic retrieved successfully",
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Topic not found",
        message: "Không tìm thấy chủ đề",
      });
    }
    console.error("Get topic error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi lấy chủ đề",
    });
  }
};

// GET /learn/topics/:topicId/steps - Get learning steps generated from topic vocabulary
const getTopicLearningSteps = async (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId);
    if (!topicId || isNaN(topicId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid topic ID",
        message: "ID chủ đề không hợp lệ",
      });
    }

    const steps = await learnService.getTopicLearningSteps(topicId);

    return res.status(200).json({
      success: true,
      data: steps,
      total: steps.length,
      message: "Learning steps generated successfully",
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Topic not found",
        message: "Không tìm thấy chủ đề",
      });
    }
    console.error("Get topic steps error:", error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: "Lỗi khi tạo bước học tập",
    });
  }
};

module.exports = {
  // Categories
  getCategories,
  getCategoryBySlug,
  // Items
  getItemById,
  createItem,
  getLessonsByItemId,
  // Lessons
  getLessonById,
  getStepsForLesson,
  // Progress
  updateProgress,
  getUserProgress,
  getItemProgress,
  // Vocabulary
  markVocabularyLearned,
  getVocabularyProgress,
  // Search
  searchItems,
  // Topics
  getTopicsForLearning,
  getTopicWithVocabularies,
  getTopicLearningSteps,
};
