const db = require("../../../db");

/**
 * Service layer for question management.
 * Aligned with verified database schema.
 */

async function createQuestion(data, userId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      content,
      explanation,
      class_room_id,
      image_location,
      video_location,
      question_type,
      file_type,
      answers, // Expected as array of { content, is_correct, video_location }
    } = data;

    if (!content) {
      throw { status: 400, message: "Content is required" };
    }

    const query = `
      INSERT INTO question (
        content, explanation, class_room_id, image_location, video_location, 
        question_type, file_type, created_by, created_date, modified_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const [result] = await connection.execute(query, [
      content,
      explanation || null,
      class_room_id || null,
      image_location || null,
      video_location || null,
      question_type || "ONE_ANSWER",
      file_type || "TEXT",
      userId,
    ]);

    const questionId = result.insertId;

    if (Array.isArray(answers) && answers.length > 0) {
      for (const ans of answers) {
        await connection.execute(
          "INSERT INTO answer (content, is_correct, video_location, question_id, created_by, created_date, modified_date) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
          [
            ans.content,
            ans.is_correct ? 1 : 0,
            ans.video_location || null,
            questionId,
            userId,
          ],
        );
      }
    }

    await connection.commit();
    return { id: questionId, content };
  } catch (err) {
    await connection.rollback();
    throw { status: 500, message: err.message };
  } finally {
    connection.release();
  }
}

async function getQuestions(filters) {
  try {
    const { page = 1, limit = 1000, class_room_id, class_room_ids } = filters;
    const offset = (page - 1) * limit;

    let whereClause = " WHERE 1=1";
    const params = [];

    // Filter by single class_room_id
    if (class_room_id && class_room_id !== 0) {
      whereClause +=
        " AND (class_room_id = ? OR class_room_id = 20 OR class_room_id IS NULL)";
      params.push(class_room_id);
    }

    // Filter by multiple class_room_ids (comma-separated or array)
    if (class_room_ids) {
      let classIdsArray = Array.isArray(class_room_ids)
        ? class_room_ids.map((id) => parseInt(id))
        : class_room_ids.split(",").map((id) => parseInt(id.trim()));

      if (classIdsArray.length > 0) {
        const placeholders = classIdsArray.map(() => "?").join(",");
        whereClause += ` AND (class_room_id IN (${placeholders}) OR class_room_id IS NULL)`;
        params.push(...classIdsArray);
      }
    }

    // Get total count
    const [countRows] = await db.execute(
      "SELECT COUNT(*) as total FROM question" + whereClause,
      params,
    );
    const total = countRows[0].total;

    // Get paginated data
    const query = `SELECT * FROM question ${whereClause} ORDER BY question_id DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    const [questions] = await db.execute(query, params);

    // Fetch answers for each question
    const questionsWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const [answers] = await db.execute(
          "SELECT answer_id as id, content, CAST(is_correct AS UNSIGNED) as correct, video_location as videoLocation FROM answer WHERE question_id = ?",
          [q.question_id],
        );
        return {
          ...q,
          answerResList: answers,
        };
      }),
    );

    return {
      data: questionsWithAnswers,
      page: parseInt(page),
      limit: parseInt(limit),
      total: total,
    };
  } catch (err) {
    throw { status: 500, message: err.message };
  }
}

async function getQuestionById(questionId) {
  try {
    const [results] = await db.execute(
      "SELECT * FROM question WHERE question_id = ?",
      [questionId],
    );
    if (results.length === 0)
      throw { status: 404, message: "Question not found" };

    const q = results[0];
    const [answers] = await db.execute(
      "SELECT answer_id as id, content, is_correct as correct, video_location as videoLocation FROM answer WHERE question_id = ?",
      [questionId],
    );

    return {
      ...q,
      answerResList: answers,
    };
  } catch (err) {
    throw { status: err.status || 500, message: err.message };
  }
}

async function updateQuestion(questionId, data) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { content, explanation, class_room_id, question_type, answers } =
      data;

    let query = "UPDATE question SET ";
    const params = [];
    const fields = [];

    if (content) {
      fields.push("content = ?");
      params.push(content);
    }
    if (explanation !== undefined) {
      fields.push("explanation = ?");
      params.push(explanation);
    }
    if (class_room_id) {
      fields.push("class_room_id = ?");
      params.push(class_room_id);
    }
    if (question_type) {
      fields.push("question_type = ?");
      params.push(question_type);
    }

    if (fields.length > 0) {
      fields.push("modified_date = NOW()");
      query += fields.join(", ") + " WHERE question_id = ?";
      params.push(questionId);
      await connection.execute(query, params);
    }

    if (Array.isArray(answers)) {
      await connection.execute("DELETE FROM answer WHERE question_id = ?", [
        questionId,
      ]);
      for (const ans of answers) {
        await connection.execute(
          "INSERT INTO answer (content, is_correct, video_location, question_id, modified_date) VALUES (?, ?, ?, ?, NOW())",
          [
            ans.content,
            ans.is_correct ? 1 : 0,
            ans.video_location || null,
            questionId,
          ],
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

async function deleteQuestion(questionId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute("DELETE FROM answer WHERE question_id = ?", [
      questionId,
    ]);
    const [result] = await connection.execute(
      "DELETE FROM question WHERE question_id = ?",
      [questionId],
    );
    await connection.commit();
    return { success: result.affectedRows > 0 };
  } catch (err) {
    await connection.rollback();
    throw { status: 500, message: err.message };
  } finally {
    connection.release();
  }
}

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
