const db = require("../../../db");

/**
 * Service layer for Learn By Topic feature.
 * Provides topic-based learning with categories, items, lessons, vocabulary, and progress tracking.
 */

// ============================================================================
// CATEGORIES
// ============================================================================

async function getCategories() {
  const [categories] = await db.execute(
    `SELECT category_id as id, slug, title, color_class as colorClass, text_class as textClass, display_order
     FROM learn_category
     WHERE is_active = 1
     ORDER BY display_order ASC`
  );
  return categories;
}

async function getCategoryBySlug(slug) {
  const [rows] = await db.execute(
    `SELECT category_id as id, slug, title, color_class as colorClass, text_class as textClass
     FROM learn_category
     WHERE slug = ? AND is_active = 1`,
    [slug]
  );
  if (rows.length === 0) {
    throw { status: 404, message: "Category not found" };
  }
  return rows[0];
}

// ============================================================================
// CATEGORIES WITH ITEMS (main learn page data)
// ============================================================================

async function getCategoriesWithItems(userId) {
  const categories = await getCategories();

  for (const category of categories) {
    const [items] = await db.execute(
      `SELECT
        li.item_id as id,
        li.title,
        li.subtitle,
        li.description,
        li.total_lessons as lessons,
        li.duration,
        li.level,
        li.video_url as videoUrl,
        li.image_url as imageUrl
       FROM learn_item li
       WHERE li.category_id = ? AND li.is_active = 1
       ORDER BY li.display_order ASC`,
      [category.id]
    );

    // Attach user progress if userId is provided
    if (userId) {
      for (const item of items) {
        const [progress] = await db.execute(
          `SELECT progress_percent as progress, completed_lessons, last_activity_at
           FROM user_learn_progress
           WHERE user_id = ? AND item_id = ?`,
          [userId, item.id]
        );
        item.progress = progress.length > 0 ? progress[0].progress : 0;
        item.completedLessons = progress.length > 0 ? progress[0].completed_lessons : 0;
      }
    } else {
      items.forEach((item) => {
        item.progress = 0;
        item.completedLessons = 0;
      });
    }

    category.items = items;
  }

  return categories;
}

// ============================================================================
// LEARN ITEMS
// ============================================================================

async function getItemsByCategory(categoryId, limit = 20, offset = 0) {
  const [countResult] = await db.execute(
    "SELECT COUNT(*) as total FROM learn_item WHERE category_id = ? AND is_active = 1",
    [categoryId]
  );
  const total = countResult[0].total;

  const [items] = await db.execute(
    `SELECT
      li.item_id as id,
      li.title,
      li.subtitle,
      li.description,
      li.total_lessons as lessons,
      li.duration,
      li.level,
      li.video_url as videoUrl,
      li.image_url as imageUrl,
      li.category_id as categoryId
     FROM learn_item li
     WHERE li.category_id = ? AND li.is_active = 1
     ORDER BY li.display_order ASC
     LIMIT ? OFFSET ?`,
    [categoryId, limit, offset]
  );

  return { data: items, total, limit, offset };
}

async function getItemById(itemId, userId) {
  const [rows] = await db.execute(
    `SELECT
      li.item_id as id,
      li.title,
      li.subtitle,
      li.description,
      li.total_lessons as lessons,
      li.duration,
      li.level,
      li.video_url as videoUrl,
      li.image_url as imageUrl,
      li.category_id as categoryId,
      lc.slug as categorySlug,
      lc.title as categoryTitle
     FROM learn_item li
     LEFT JOIN learn_category lc ON li.category_id = lc.category_id
     WHERE li.item_id = ? AND li.is_active = 1`,
    [itemId]
  );

  if (rows.length === 0) {
    throw { status: 404, message: "Learn item not found" };
  }

  const item = rows[0];

  // Get lessons for this item
  const [lessons] = await db.execute(
    `SELECT
      lil.lesson_id as id,
      lil.title,
      lil.description,
      lil.duration,
      lil.video_url as videoUrl,
      lil.display_order as 'order',
      lil.topic_id as topicId
     FROM learn_item_lesson lil
     WHERE lil.item_id = ? AND lil.is_active = 1
     ORDER BY lil.display_order ASC`,
    [itemId]
  );

  // Get vocabulary list for each lesson
  for (const lesson of lessons) {
    const [vocabs] = await db.execute(
      `SELECT word FROM learn_item_vocabulary WHERE lesson_id = ? ORDER BY display_order ASC`,
      [lesson.id]
    );
    lesson.vocabularyList = vocabs.map((v) => v.word);
  }

  item.lessonsList = lessons;

  // Get overall vocabulary list for the item (from first lesson or all)
  const allVocabs = [];
  lessons.forEach((l) => {
    if (l.vocabularyList) allVocabs.push(...l.vocabularyList);
  });
  item.vocabularyList = [...new Set(allVocabs)];

  // Attach progress if userId provided
  if (userId) {
    const [progress] = await db.execute(
      `SELECT progress_percent as progress, completed_lessons, last_activity_at
       FROM user_learn_progress
       WHERE user_id = ? AND item_id = ?`,
      [userId, itemId]
    );
    item.progress = progress.length > 0 ? progress[0].progress : 0;
    item.completedLessons = progress.length > 0 ? progress[0].completed_lessons : 0;
  }

  return item;
}

// ============================================================================
// LEARN ITEM LESSONS
// ============================================================================

async function getLessonsByItemId(itemId) {
  const [lessons] = await db.execute(
    `SELECT
      lil.lesson_id as id,
      lil.title,
      lil.description,
      lil.duration,
      lil.video_url as videoUrl,
      lil.display_order as 'order',
      lil.topic_id as topicId
     FROM learn_item_lesson lil
     WHERE lil.item_id = ? AND lil.is_active = 1
     ORDER BY lil.display_order ASC`,
    [itemId]
  );

  for (const lesson of lessons) {
    const [vocabs] = await db.execute(
      `SELECT word FROM learn_item_vocabulary WHERE lesson_id = ? ORDER BY display_order ASC`,
      [lesson.id]
    );
    lesson.vocabularyList = vocabs.map((v) => v.word);
  }

  return lessons;
}

async function getLessonById(lessonId) {
  const [rows] = await db.execute(
    `SELECT
      lil.lesson_id as id,
      lil.item_id as itemId,
      lil.title,
      lil.description,
      lil.duration,
      lil.video_url as videoUrl,
      lil.display_order as 'order',
      lil.topic_id as topicId
     FROM learn_item_lesson lil
     WHERE lil.lesson_id = ? AND lil.is_active = 1`,
    [lessonId]
  );

  if (rows.length === 0) {
    throw { status: 404, message: "Lesson not found" };
  }

  const lesson = rows[0];

  // Get vocabulary for this lesson
  const [vocabs] = await db.execute(
    `SELECT
      liv.id,
      liv.word,
      liv.vocabulary_id as vocabularyId,
      liv.display_order as 'order'
     FROM learn_item_vocabulary liv
     WHERE liv.lesson_id = ?
     ORDER BY liv.display_order ASC`,
    [lessonId]
  );

  // If vocabulary has linked vocabulary_id, get video/image from vocabulary table
  for (const vocab of vocabs) {
    if (vocab.vocabularyId) {
      const [vocabData] = await db.execute(
        `SELECT
          v.content,
          v.description,
          (SELECT vi.image_location FROM vocabulary_image vi WHERE vi.vocabulary_id = v.vocabulary_id ORDER BY vi.is_primary DESC LIMIT 1) as imageUrl,
          (SELECT vv.video_location FROM vocabulary_video vv WHERE vv.vocabulary_id = v.vocabulary_id ORDER BY vv.is_primary DESC LIMIT 1) as videoUrl
         FROM vocabulary v
         WHERE v.vocabulary_id = ?`,
        [vocab.vocabularyId]
      );
      if (vocabData.length > 0) {
        vocab.description = vocabData[0].description;
        vocab.imageUrl = vocabData[0].imageUrl;
        vocab.videoUrl = vocabData[0].videoUrl;
      }
    }
  }

  lesson.vocabularyList = vocabs;

  // If lesson has topic_id, also get vocabularies from that topic
  if (lesson.topicId) {
    const [topicVocabs] = await db.execute(
      `SELECT
        v.vocabulary_id as id,
        v.content as word,
        v.description,
        (SELECT vi.image_location FROM vocabulary_image vi WHERE vi.vocabulary_id = v.vocabulary_id ORDER BY vi.is_primary DESC LIMIT 1) as imageUrl,
        (SELECT vv.video_location FROM vocabulary_video vv WHERE vv.vocabulary_id = v.vocabulary_id ORDER BY vv.is_primary DESC LIMIT 1) as videoUrl
       FROM vocabulary v
       WHERE v.topic_id = ? AND v.status = 'APPROVED'
       ORDER BY v.vocabulary_id ASC`,
      [lesson.topicId]
    );
    lesson.topicVocabularies = topicVocabs;
  }

  return lesson;
}

// ============================================================================
// LEARNING STEPS (generate interactive steps from vocabulary)
// Matches frontend lessonsData.ts generateStepsForLesson() exactly
// Step types: vocabulary, sentence, quiz-text-to-video, quiz-video-to-text,
//   quiz-input, practice-video, practice-matrix, match-video-image,
//   match-video-word, drag-drop-video-word, match-horizontal, quiz-choice
// ============================================================================

function getWord(vocab) {
  return vocab.word || vocab.content || "";
}

function getVideo(vocab) {
  return vocab.videoUrl || null;
}

function getImage(vocab) {
  return vocab.imageUrl || null;
}

function generateStepsFromVocabulary(vocabularies, lessonId) {
  const steps = [];
  let stepOrder = 1;

  if (!vocabularies || vocabularies.length === 0) return steps;

  // Get 3-5 vocabulary words for this lesson (matching FE: 3 + lessonOrder % 3)
  const vocabCount = Math.min(vocabularies.length, Math.max(3, vocabularies.length));
  const vocabSlice = vocabularies.slice(0, vocabCount);

  // ---- Step 1: Vocabulary steps (learn each word) ----
  for (const vocab of vocabSlice) {
    steps.push({
      id: lessonId * 100 + stepOrder,
      lessonId,
      title: `Từ vựng: ${getWord(vocab)}`,
      type: "vocabulary",
      order: stepOrder,
      completed: stepOrder <= 2,
      word: getWord(vocab),
      videoUrl: getVideo(vocab),
      imageUrl: getImage(vocab),
      description: vocab.description || `Học ký hiệu cho từ "${getWord(vocab)}"`,
    });
    stepOrder++;
  }

  // ---- Step 2: Sentence building ----
  const sentenceWords = vocabSlice.slice(0, 3).map((v) => ({
    word: getWord(v),
    videoUrl: getVideo(v),
  }));
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Luyện tập: Cấu trúc câu",
    type: "sentence",
    order: stepOrder,
    completed: false,
    sentence: sentenceWords.map((w) => w.word).join(" "),
    words: sentenceWords,
    videoUrl: getVideo(vocabSlice[0]),
  });
  stepOrder++;

  // Prepare quiz data
  const quizVocab = vocabSlice.length > 1 ? vocabSlice[1] : vocabSlice[0];
  const wrongOptions = vocabularies
    .filter((v) => getWord(v) !== getWord(quizVocab))
    .slice(0, 3);

  // ---- Step 3: quiz-text-to-video (Nhìn chữ chọn video) ----
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Kiểm tra: Nhìn chữ chọn video",
    type: "quiz-text-to-video",
    order: stepOrder,
    completed: false,
    question: getWord(quizVocab),
    options: [
      { id: 1, videoUrl: getVideo(quizVocab), isCorrect: true },
      { id: 2, videoUrl: getVideo(wrongOptions[0]) || getVideo(quizVocab), isCorrect: false },
      { id: 3, videoUrl: getVideo(wrongOptions[1]) || getVideo(quizVocab), isCorrect: false },
      { id: 4, videoUrl: getVideo(wrongOptions[2]) || getVideo(quizVocab), isCorrect: false },
    ],
  });
  stepOrder++;

  // ---- Step 4: quiz-video-to-text (Nhìn video chọn đáp án) ----
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Kiểm tra: Nhìn video chọn đáp án",
    type: "quiz-video-to-text",
    order: stepOrder,
    completed: false,
    questionVideoUrl: getVideo(quizVocab),
    options: [
      { id: 1, text: getWord(quizVocab), isCorrect: true },
      { id: 2, text: getWord(wrongOptions[0]) || "Khác", isCorrect: false },
      { id: 3, text: getWord(wrongOptions[1]) || "Khác", isCorrect: false },
      { id: 4, text: getWord(wrongOptions[2]) || "Khác", isCorrect: false },
    ],
  });
  stepOrder++;

  // ---- Step 5: quiz-input (Tự gõ đáp án) ----
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Kiểm tra: Gõ đáp án",
    type: "quiz-input",
    order: stepOrder,
    completed: false,
    questionVideoUrl: getVideo(quizVocab),
    correctAnswer: getWord(quizVocab),
    hint: getWord(quizVocab).charAt(0) + "...",
  });
  stepOrder++;

  // ---- Step 6: practice-video (Quay video thực hành) ----
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Luyện tập: Quay video ký hiệu",
    type: "practice-video",
    order: stepOrder,
    completed: false,
    word: getWord(quizVocab),
    videoUrl: getVideo(quizVocab),
    description: `Hãy xem video mẫu và thực hành ký hiệu từ "${getWord(quizVocab)}"`,
  });
  stepOrder++;

  // ---- Step 7: practice-matrix (Ma trận thẻ 6-8 items) ----
  const matrixItems = vocabularies.slice(0, Math.min(8, vocabularies.length)).map((v, idx) => ({
    id: idx + 1,
    label: getWord(v),
    videoUrl: getVideo(v),
    word: getWord(v),
    imageUrl: getImage(v),
  }));
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Luyện tập: Ma trận ký hiệu",
    type: "practice-matrix",
    order: stepOrder,
    completed: false,
    matrixItems,
    description: "Chọn một thẻ để xem video và thực hành lại.",
  });
  stepOrder++;

  // ---- Step 8: match-video-image (Nối video - hình ảnh) ----
  const matchPairsImage = vocabSlice.slice(0, 4).map((v, idx) => ({
    id: idx + 1,
    videoUrl: getVideo(v),
    targetUrl: getImage(v),
    targetText: getWord(v),
  }));
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Nối: Video - Hình ảnh",
    type: "match-video-image",
    order: stepOrder,
    completed: false,
    matchPairs: matchPairsImage,
  });
  stepOrder++;

  // ---- Step 9: match-video-word (Nối video - từ vựng) ----
  const matchPairsWord = vocabSlice.slice(0, Math.min(4, vocabSlice.length)).map((v, idx) => ({
    id: idx + 1,
    videoUrl: getVideo(v),
    targetText: getWord(v),
  }));
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Nối: Video - Từ vựng",
    type: "match-video-word",
    order: stepOrder,
    completed: false,
    matchPairs: matchPairsWord,
  });
  stepOrder++;

  // ---- Step 10: drag-drop-video-word (Kéo thả từ vào ô video, 6 items) ----
  const dragDropItems = vocabularies.slice(0, Math.min(6, vocabularies.length)).map((v, idx) => ({
    id: idx + 1,
    videoUrl: getVideo(v),
    correctWord: getWord(v),
  }));
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Kéo thả: Ghép từ vào video",
    type: "drag-drop-video-word",
    order: stepOrder,
    completed: false,
    dragDropItems,
    availableWords: dragDropItems.map((i) => i.correctWord),
  });
  stepOrder++;

  // ---- Step 11: match-horizontal (Nối từ hàng ngang, 3 items) ----
  const matchHorizontalItems = vocabSlice.slice(0, 3).map((v, idx) => ({
    id: idx + 1,
    videoUrl: getVideo(v),
    targetText: getWord(v),
  }));
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Thực hành: Nối từ (Hàng ngang)",
    type: "match-horizontal",
    order: stepOrder,
    completed: false,
    matchPairs: matchHorizontalItems,
  });
  stepOrder++;

  // ---- Step 12: quiz-choice (Chọn video đúng - có nút bấm riêng) ----
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Kiểm tra: Chọn video đúng",
    type: "quiz-choice",
    order: stepOrder,
    completed: false,
    question: getWord(quizVocab),
    options: [
      { id: 1, videoUrl: getVideo(quizVocab), isCorrect: true },
      { id: 2, videoUrl: getVideo(wrongOptions[0]) || getVideo(quizVocab), isCorrect: false },
      { id: 3, videoUrl: getVideo(wrongOptions[1]) || getVideo(quizVocab), isCorrect: false },
      { id: 4, videoUrl: getVideo(wrongOptions[2]) || getVideo(quizVocab), isCorrect: false },
    ],
  });
  stepOrder++;

  return steps;
}

async function getStepsForLesson(lessonId) {
  const lesson = await getLessonById(lessonId);

  // Combine vocabulary from learn_item_vocabulary and topic vocabularies
  let allVocabularies = [];

  if (lesson.topicVocabularies && lesson.topicVocabularies.length > 0) {
    allVocabularies = lesson.topicVocabularies;
  } else if (lesson.vocabularyList && lesson.vocabularyList.length > 0) {
    allVocabularies = lesson.vocabularyList;
  }

  return generateStepsFromVocabulary(allVocabularies, lessonId);
}

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

async function updateProgress(userId, itemId, data) {
  const { completedLessons, totalLessons, lastLessonId } = data;

  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const [existing] = await db.execute(
    "SELECT progress_id FROM user_learn_progress WHERE user_id = ? AND item_id = ?",
    [userId, itemId]
  );

  if (existing.length > 0) {
    await db.execute(
      `UPDATE user_learn_progress
       SET progress_percent = ?, completed_lessons = ?, total_lessons = ?,
           last_lesson_id = ?, last_activity_at = NOW(), modified_date = NOW()
       WHERE user_id = ? AND item_id = ?`,
      [progressPercent, completedLessons, totalLessons, lastLessonId || null, userId, itemId]
    );
  } else {
    await db.execute(
      `INSERT INTO user_learn_progress
       (user_id, item_id, progress_percent, completed_lessons, total_lessons, last_lesson_id, last_activity_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, itemId, progressPercent, completedLessons, totalLessons, lastLessonId || null]
    );
  }

  return {
    userId,
    itemId,
    progressPercent,
    completedLessons,
    totalLessons,
  };
}

async function getUserProgress(userId) {
  const [progress] = await db.execute(
    `SELECT
      ulp.item_id as itemId,
      ulp.progress_percent as progress,
      ulp.completed_lessons as completedLessons,
      ulp.total_lessons as totalLessons,
      ulp.last_activity_at as lastActivityAt,
      li.title as itemTitle,
      lc.title as categoryTitle,
      lc.slug as categorySlug
     FROM user_learn_progress ulp
     LEFT JOIN learn_item li ON ulp.item_id = li.item_id
     LEFT JOIN learn_category lc ON li.category_id = lc.category_id
     WHERE ulp.user_id = ?
     ORDER BY ulp.last_activity_at DESC`,
    [userId]
  );

  // Calculate overall stats
  const totalItems = progress.length;
  const completedItems = progress.filter((p) => p.progress >= 100).length;
  const averageProgress =
    totalItems > 0
      ? Math.round(progress.reduce((sum, p) => sum + p.progress, 0) / totalItems)
      : 0;

  return {
    items: progress,
    summary: {
      totalItems,
      completedItems,
      inProgressItems: totalItems - completedItems,
      averageProgress,
    },
  };
}

async function getItemProgress(userId, itemId) {
  const [rows] = await db.execute(
    `SELECT
      ulp.progress_percent as progress,
      ulp.completed_lessons as completedLessons,
      ulp.total_lessons as totalLessons,
      ulp.last_lesson_id as lastLessonId,
      ulp.last_activity_at as lastActivityAt
     FROM user_learn_progress ulp
     WHERE ulp.user_id = ? AND ulp.item_id = ?`,
    [userId, itemId]
  );

  if (rows.length === 0) {
    return {
      progress: 0,
      completedLessons: 0,
      totalLessons: 0,
      lastLessonId: null,
      lastActivityAt: null,
    };
  }

  return rows[0];
}

// ============================================================================
// VOCABULARY PROGRESS
// ============================================================================

async function markVocabularyLearned(userId, vocabularyId) {
  const [existing] = await db.execute(
    "SELECT id FROM user_vocabulary_progress WHERE user_id = ? AND vocabulary_id = ?",
    [userId, vocabularyId]
  );

  if (existing.length > 0) {
    await db.execute(
      `UPDATE user_vocabulary_progress
       SET is_learned = 1, learned_at = NOW(), review_count = review_count + 1, last_review_at = NOW()
       WHERE user_id = ? AND vocabulary_id = ?`,
      [userId, vocabularyId]
    );
  } else {
    await db.execute(
      `INSERT INTO user_vocabulary_progress (user_id, vocabulary_id, is_learned, learned_at, review_count, last_review_at)
       VALUES (?, ?, 1, NOW(), 1, NOW())`,
      [userId, vocabularyId]
    );
  }

  return { userId, vocabularyId, isLearned: true };
}

async function getUserVocabularyProgress(userId, topicId) {
  let query = `
    SELECT
      uvp.vocabulary_id as vocabularyId,
      uvp.is_learned as isLearned,
      uvp.learned_at as learnedAt,
      uvp.review_count as reviewCount,
      v.content as word
    FROM user_vocabulary_progress uvp
    LEFT JOIN vocabulary v ON uvp.vocabulary_id = v.vocabulary_id
    WHERE uvp.user_id = ?
  `;
  const params = [userId];

  if (topicId) {
    query += " AND v.topic_id = ?";
    params.push(topicId);
  }

  query += " ORDER BY uvp.learned_at DESC";

  const [rows] = await db.execute(query, params);

  const learnedCount = rows.filter((r) => r.isLearned).length;

  return {
    vocabularies: rows,
    summary: {
      total: rows.length,
      learned: learnedCount,
      remaining: rows.length - learnedCount,
    },
  };
}

// ============================================================================
// SEARCH
// ============================================================================

async function searchItems(query, limit = 20, offset = 0) {
  const searchTerm = `%${query}%`;

  const [countResult] = await db.execute(
    `SELECT COUNT(*) as total FROM learn_item
     WHERE is_active = 1 AND (title LIKE ? OR subtitle LIKE ? OR description LIKE ?)`,
    [searchTerm, searchTerm, searchTerm]
  );
  const total = countResult[0].total;

  const [items] = await db.execute(
    `SELECT
      li.item_id as id,
      li.title,
      li.subtitle,
      li.description,
      li.total_lessons as lessons,
      li.duration,
      li.level,
      li.video_url as videoUrl,
      li.image_url as imageUrl,
      lc.title as categoryTitle,
      lc.slug as categorySlug
     FROM learn_item li
     LEFT JOIN learn_category lc ON li.category_id = lc.category_id
     WHERE li.is_active = 1 AND (li.title LIKE ? OR li.subtitle LIKE ? OR li.description LIKE ?)
     ORDER BY li.display_order ASC
     LIMIT ? OFFSET ?`,
    [searchTerm, searchTerm, searchTerm, limit, offset]
  );

  return { data: items, total, limit, offset };
}

// ============================================================================
// TOPICS-BASED LEARNING (using existing topic + vocabulary tables)
// ============================================================================

async function getTopicsForLearning(classroomId, limit = 20, offset = 0) {
  let whereClause = "WHERE t.is_active = 1";
  const params = [];

  if (classroomId) {
    whereClause += " AND t.class_room_id = ?";
    params.push(classroomId);
  }

  const [countResult] = await db.execute(
    `SELECT COUNT(*) as total FROM topic t ${whereClause}`,
    params
  );
  const total = countResult[0].total;

  const [topics] = await db.execute(
    `SELECT
      t.topic_id as id,
      t.content as name,
      t.description,
      t.image_location as imageUrl,
      t.video_location as videoUrl,
      t.class_room_id as classroomId,
      c.content as classroomName,
      (SELECT COUNT(*) FROM vocabulary v WHERE v.topic_id = t.topic_id AND v.status = 'APPROVED') as vocabularyCount
     FROM topic t
     LEFT JOIN class_room c ON t.class_room_id = c.class_room_id
     ${whereClause}
     ORDER BY t.topic_id ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: topics, total, limit, offset };
}

async function getTopicWithVocabularies(topicId) {
  const [topicRows] = await db.execute(
    `SELECT
      t.topic_id as id,
      t.content as name,
      t.description,
      t.image_location as imageUrl,
      t.video_location as videoUrl,
      t.class_room_id as classroomId
     FROM topic t
     WHERE t.topic_id = ? AND t.is_active = 1`,
    [topicId]
  );

  if (topicRows.length === 0) {
    throw { status: 404, message: "Topic not found" };
  }

  const topic = topicRows[0];

  const [vocabularies] = await db.execute(
    `SELECT
      v.vocabulary_id as id,
      v.content as word,
      v.description,
      v.vocabulary_type as type,
      (SELECT vi.image_location FROM vocabulary_image vi WHERE vi.vocabulary_id = v.vocabulary_id ORDER BY vi.is_primary DESC LIMIT 1) as imageUrl,
      (SELECT vv.video_location FROM vocabulary_video vv WHERE vv.vocabulary_id = v.vocabulary_id ORDER BY vv.is_primary DESC LIMIT 1) as videoUrl,
      (SELECT COALESCE(SUM(vw.view_count), 0) FROM vocabulary_view vw WHERE vw.vocabulary_id = v.vocabulary_id) as viewCount
     FROM vocabulary v
     WHERE v.topic_id = ? AND v.status = 'APPROVED'
     ORDER BY v.vocabulary_id ASC`,
    [topicId]
  );

  topic.vocabularies = vocabularies;
  topic.vocabularyCount = vocabularies.length;

  return topic;
}

async function getTopicLearningSteps(topicId) {
  const topic = await getTopicWithVocabularies(topicId);
  return generateStepsFromVocabulary(topic.vocabularies, topicId);
}

module.exports = {
  // Categories
  getCategories,
  getCategoryBySlug,
  getCategoriesWithItems,
  // Items
  getItemsByCategory,
  getItemById,
  // Lessons
  getLessonsByItemId,
  getLessonById,
  getStepsForLesson,
  // Progress
  updateProgress,
  getUserProgress,
  getItemProgress,
  // Vocabulary Progress
  markVocabularyLearned,
  getUserVocabularyProgress,
  // Search
  searchItems,
  // Topics-based Learning
  getTopicsForLearning,
  getTopicWithVocabularies,
  getTopicLearningSteps,
};
