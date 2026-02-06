const db = require("../../../db");

/**
 * Service layer for exam management.
 * Aligned with updated database schema (name, exam_type, class_room_id, duration_minutes, total_points, passing_score, description)
 */

async function createExam(data, userId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      name,
      exam_type,
      class_room_id,
      duration_minutes,
      total_points,
      passing_score,
      description,
      is_private,
      question_ids,
      practice_questions,
    } = data;

    if (!name) {
      throw { status: 400, message: "Exam name is required" };
    }

    const query = `
      INSERT INTO exam (
        name, 
        exam_type, 
        class_room_id, 
        duration_minutes, 
        total_points, 
        passing_score, 
        description, 
        is_private, 
        created_by, 
        created_date, 
        modified_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const [result] = await connection.execute(query, [
      name,
      exam_type || "QUIZ",
      class_room_id || null,
      duration_minutes || 60,
      total_points || 10,
      passing_score || 5,
      description || null,
      is_private ? 1 : 0,
      userId,
    ]);

    const examId = result.insertId;

    // Handle Question Mappings if QUIZ
    if (exam_type === "QUIZ" && Array.isArray(question_ids)) {
      for (const qId of question_ids) {
        await connection.execute(
          "INSERT INTO question_exam_mapping (exam_id, question_id) VALUES (?, ?)",
          [examId, qId],
        );
      }
    }

    // Handle Practice Questions if PRACTICE
    if (exam_type === "PRACTICE" && Array.isArray(practice_questions)) {
      for (const pq of practice_questions) {
        await connection.execute(
          "INSERT INTO vocabulary_exam_mapping (exam_id, vocabulary_id, content, created_date) VALUES (?, ?, ?, NOW())",
          [examId, pq.vocabularyId || null, pq.content || ""],
        );
      }
    }

    await connection.commit();

    return {
      id: examId,
      name,
      class_room_id,
      exam_type,
    };
  } catch (err) {
    await connection.rollback();
    throw { status: err.status || 500, message: err.message };
  } finally {
    connection.release();
  }
}

async function getExams(filters) {
  try {
    const {
      page = 1,
      limit = 1000,
      class_room_id,
      class_room_ids,
      exam_type,
    } = filters;
    const offset = (page - 1) * limit;

    let whereClause = " WHERE 1=1";
    const params = [];

    // Filter by single class_room_id
    if (class_room_id) {
      whereClause += " AND class_room_id = ?";
      params.push(class_room_id);
    }

    // Filter by multiple class_room_ids (comma-separated or array)
    if (class_room_ids) {
      let classIdsArray = Array.isArray(class_room_ids)
        ? class_room_ids.map((id) => parseInt(id))
        : class_room_ids.split(",").map((id) => parseInt(id.trim()));

      if (classIdsArray.length > 0) {
        const placeholders = classIdsArray.map(() => "?").join(",");
        whereClause += ` AND class_room_id IN (${placeholders})`;
        params.push(...classIdsArray);
      }
    }

    if (exam_type) {
      whereClause += " AND exam_type = ?";
      params.push(exam_type);
    }

    // Get total count
    const [countRows] = await db.execute(
      "SELECT COUNT(*) as total FROM exam" + whereClause,
      params,
    );
    const total = countRows[0].total;

    // Get paginated data
    const query = `SELECT * FROM exam ${whereClause} ORDER BY exam_id DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    const [exams] = await db.execute(query, params);

    return {
      data: exams,
      page: parseInt(page),
      limit: parseInt(limit),
      total: total,
    };
  } catch (err) {
    throw { status: 500, message: err.message };
  }
}

async function getExamById(examId) {
  try {
    const [results] = await db.execute("SELECT * FROM exam WHERE exam_id = ?", [
      examId,
    ]);
    if (results.length === 0) throw { status: 404, message: "Exam not found" };

    const exam = results[0];

    // Fetch associated content based on type
    if (exam.exam_type === "PRACTICE") {
      const [practiceQuestions] = await db.execute(
        `
        SELECT 
          vem.vocabulary_exam_id as id,
          vem.content,
          vem.vocabulary_id as vocabularyId,
          v.topic_id as topicId,
          t.content as topic_name,
          v.content as vocabulary_content
        FROM vocabulary_exam_mapping vem
        LEFT JOIN vocabulary v ON vem.vocabulary_id = v.vocabulary_id
        LEFT JOIN topic t ON v.topic_id = t.topic_id
        WHERE vem.exam_id = ?
      `,
        [examId],
      );

      return {
        ...exam,
        practiceQuestions,
      };
    } else {
      const [questions] = await db.execute(
        `
        SELECT q.* FROM question q
        JOIN question_exam_mapping qem ON q.question_id = qem.question_id
        WHERE qem.exam_id = ?
      `,
        [examId],
      );

      const questionsWithAnswers = await Promise.all(
        questions.map(async (q) => {
          const [answers] = await db.execute(
            "SELECT answer_id as answerId, content, is_correct as correct, video_location as videoLocation, NULL as imageLocation FROM answer WHERE question_id = ?",
            [q.question_id],
          );
          return {
            ...q,
            questionId: q.question_id,
            questionType: q.question_type,
            answerResList: answers.map((a) => ({
              ...a,
              correct: a.correct === 1, // Ensure boolean
            })),
          };
        }),
      );

      return {
        ...exam,
        questionsList: questionsWithAnswers,
      };
    }
  } catch (err) {
    throw { status: err.status || 500, message: err.message };
  }
}

async function updateExam(examId, data) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      name,
      class_room_id,
      is_private,
      exam_type,
      duration_minutes,
      total_points,
      passing_score,
      description,
      question_ids,
      practice_questions,
    } = data;

    let query = "UPDATE exam SET ";
    const params = [];
    const fields = [];

    if (name) {
      fields.push("name = ?");
      params.push(name);
    }
    if (class_room_id !== undefined) {
      fields.push("class_room_id = ?");
      params.push(class_room_id);
    }
    if (is_private !== undefined) {
      fields.push("is_private = ?");
      params.push(is_private ? 1 : 0);
    }
    if (exam_type) {
      fields.push("exam_type = ?");
      params.push(exam_type);
    }
    if (duration_minutes !== undefined) {
      fields.push("duration_minutes = ?");
      params.push(duration_minutes);
    }
    if (total_points !== undefined) {
      fields.push("total_points = ?");
      params.push(total_points);
    }
    if (passing_score !== undefined) {
      fields.push("passing_score = ?");
      params.push(passing_score);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      params.push(description);
    }

    if (fields.length > 0) {
      fields.push("modified_date = NOW()");
      query += fields.join(", ") + " WHERE exam_id = ?";
      params.push(examId);
      await connection.execute(query, params);
    }

    // Update question mapping if provided
    if (question_ids && Array.isArray(question_ids)) {
      await connection.execute(
        "DELETE FROM question_exam_mapping WHERE exam_id = ?",
        [examId],
      );
      for (const qId of question_ids) {
        await connection.execute(
          "INSERT INTO question_exam_mapping (exam_id, question_id) VALUES (?, ?)",
          [examId, qId],
        );
      }
    }

    // Update practice mapping if provided
    if (practice_questions && Array.isArray(practice_questions)) {
      await connection.execute(
        "DELETE FROM vocabulary_exam_mapping WHERE exam_id = ?",
        [examId],
      );
      for (const pq of practice_questions) {
        await connection.execute(
          "INSERT INTO vocabulary_exam_mapping (exam_id, vocabulary_id, content, created_date) VALUES (?, ?, ?, NOW())",
          [examId, pq.vocabularyId || null, pq.content || ""],
        );
      }
    }

    await connection.commit();
    return { success: true };
  } catch (err) {
    await connection.rollback();
    throw { status: 500, message: err.message };
  } finally {
    connection.release();
  }
}

async function submitExam(examId, studentId, answers) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insert into exam_attempt
    const [attemptResult] = await connection.execute(
      "INSERT INTO exam_attempt (exam_id, user_id, score, started_at, finished_at) VALUES (?, ?, ?, NOW(), NOW())",
      [examId, studentId, 0],
    );

    await connection.commit();
    return { success: true, attemptId: attemptResult.insertId };
  } catch (err) {
    await connection.rollback();
    throw { status: 500, message: err.message };
  } finally {
    connection.release();
  }
}

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  submitExam,
};
