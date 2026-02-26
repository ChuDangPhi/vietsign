const db = require("../../../db");

/**
 * Service layer for vocabulary management.
 * Aligned with verified database schema.
 */

async function createVocabulary(data, userId) {
  try {
    const {
      content,
      description,
      note,
      topic_id,
      classroom_id,
      vocabulary_type,
      is_private,
      images_path,
      videos_path,
    } = data;

    if (!content) {
      throw { status: 400, message: "Content is required" };
    }

    const query = `
      INSERT INTO vocabulary (
        content, 
        description, 
        note, 
        topic_id, 
        class_room_id, 
        vocabulary_type, 
        is_private, 
        images_path,
        videos_path,
        created_by,
        created_id,
        created_date,
        modified_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 'APPROVED')
    `;

    const [result] = await db.execute(query, [
      content,
      description || null,
      note || null,
      topic_id || null,
      classroom_id || null,
      vocabulary_type || "WORD",
      is_private ? 1 : 0,
      images_path || null,
      videos_path || null,
      userId ? String(userId) : null,
      userId || 0,
    ]);

    if (images_path) {
      await db.execute(
        "INSERT INTO vocabulary_image (vocabulary_id, image_location, is_primary) VALUES (?, ?, 1)",
        [result.insertId, images_path],
      );
    }

    if (videos_path) {
      await db.execute(
        "INSERT INTO vocabulary_video (vocabulary_id, video_location, is_primary) VALUES (?, ?, 1)",
        [result.insertId, videos_path],
      );
    }

    return {
      id: result.insertId,
      content,
      description,
      note,
      topic_id,
      classroom_id,
      vocabulary_type,
      status: "APPROVED",
    };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error creating vocabulary",
    };
  }
}

async function getVocabularies(filters) {
  try {
    const {
      page = 1,
      limit = 1000,
      q = "",
      topic_id,
      classroom_id,
      vocabulary_type,
      is_private,
      status,
    } = filters;
    const offset = (page - 1) * limit;

    let whereClause = " WHERE 1=1";
    const params = [];

    if (q) {
      whereClause += " AND (v.content LIKE ? OR v.description LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    if (topic_id) {
      whereClause += " AND v.topic_id = ?";
      params.push(topic_id);
    }

    if (classroom_id) {
      whereClause += " AND v.class_room_id = ?";
      params.push(classroom_id);
    }

    if (vocabulary_type) {
      whereClause += " AND v.vocabulary_type = ?";
      params.push(vocabulary_type);
    }

    if (is_private !== null && is_private !== undefined) {
      whereClause += " AND v.is_private = ?";
      params.push(is_private ? 1 : 0);
    }

    if (status) {
      whereClause += " AND v.status = ?";
      params.push(status);
    }

    // Get Total Count for pagination
    const countQuery =
      "SELECT COUNT(*) as total FROM vocabulary v" + whereClause;
    const [countResults] = await db.execute(countQuery, params);
    const total = countResults[0].total;

    // Get Paginated Data
    let sqlQuery =
      `
      SELECT 
        v.vocabulary_id as id,
        v.content,
        v.description as meaning,
        v.note,
        v.vocabulary_type as type,
        v.status,
        v.topic_id,
        v.class_room_id,
        (SELECT vi.image_location FROM vocabulary_image vi WHERE vi.vocabulary_id = v.vocabulary_id ORDER BY vi.is_primary DESC, vi.vocabulary_image_id ASC LIMIT 1) as images_path,
        (SELECT vv.video_location FROM vocabulary_video vv WHERE vv.vocabulary_id = v.vocabulary_id ORDER BY vv.is_primary DESC, vv.vocabulary_video_id ASC LIMIT 1) as videos_path,
        (SELECT COALESCE(SUM(vw.view_count), 0) FROM vocabulary_view vw WHERE vw.vocabulary_id = v.vocabulary_id) as view_count,
        t.content as topic_name,
        c.content as class_name
      FROM vocabulary v
      LEFT JOIN topic t ON v.topic_id = t.topic_id
      LEFT JOIN class_room c ON v.class_room_id = c.class_room_id
    ` + whereClause;

    sqlQuery += ` ORDER BY v.vocabulary_id DESC LIMIT ${parseInt(limit) || 1000} OFFSET ${parseInt(offset) || 0}`;

    const [vocabularies] = await db.execute(sqlQuery, params);

    return {
      data: vocabularies,
      page: parseInt(page),
      limit: parseInt(limit),
      total: total,
    };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error fetching vocabularies",
    };
  }
}

async function getVocabularyById(vocabularyId) {
  try {
    if (!vocabularyId) {
      throw { status: 400, message: "Vocabulary ID is required" };
    }

    const query = `
      SELECT 
        v.vocabulary_id as id,
        v.content,
        v.description as meaning,
        v.note,
        v.vocabulary_type as type,
        v.status,
        v.topic_id,
        v.class_room_id,
        (SELECT vi.image_location FROM vocabulary_image vi WHERE vi.vocabulary_id = v.vocabulary_id ORDER BY vi.is_primary DESC, vi.vocabulary_image_id ASC LIMIT 1) as images_path,
        (SELECT vv.video_location FROM vocabulary_video vv WHERE vv.vocabulary_id = v.vocabulary_id ORDER BY vv.is_primary DESC, vv.vocabulary_video_id ASC LIMIT 1) as videos_path,
        (SELECT COALESCE(SUM(vw.view_count), 0) FROM vocabulary_view vw WHERE vw.vocabulary_id = v.vocabulary_id) as view_count,
        t.content as topic_name,
        c.content as class_name 
      FROM vocabulary v
      LEFT JOIN topic t ON v.topic_id = t.topic_id
      LEFT JOIN class_room c ON v.class_room_id = c.class_room_id
      WHERE v.vocabulary_id = ?
    `;
    const [results] = await db.execute(query, [vocabularyId]);

    if (results.length === 0) {
      throw { status: 404, message: "Vocabulary not found" };
    }

    return results[0];
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error fetching vocabulary",
    };
  }
}

async function getVocabulariesByTopicId(topicId) {
  try {
    const query = `SELECT 
        v.vocabulary_id as id,
        v.content,
        v.description as meaning,
        v.note,
        v.vocabulary_type as type,
        v.status,
        v.topic_id,
        v.class_room_id,
        (SELECT vi.image_location FROM vocabulary_image vi WHERE vi.vocabulary_id = v.vocabulary_id ORDER BY vi.is_primary DESC, vi.vocabulary_image_id ASC LIMIT 1) as images_path,
        (SELECT vv.video_location FROM vocabulary_video vv WHERE vv.vocabulary_id = v.vocabulary_id ORDER BY vv.is_primary DESC, vv.vocabulary_video_id ASC LIMIT 1) as videos_path,
        (SELECT COALESCE(SUM(vw.view_count), 0) FROM vocabulary_view vw WHERE vw.vocabulary_id = v.vocabulary_id) as view_count
      FROM vocabulary v
      WHERE v.topic_id = ? ORDER BY v.vocabulary_id ASC`;
    const [vocabularies] = await db.execute(query, [topicId]);
    return vocabularies;
  } catch (err) {
    throw { status: 500, message: err.message };
  }
}

async function getVocabulariesByClassroomId(classroomId) {
  try {
    const query = `SELECT 
        v.vocabulary_id as id,
        v.content,
        v.description as meaning,
        v.note,
        v.vocabulary_type as type,
        v.status,
        v.topic_id,
        v.class_room_id,
        (SELECT vi.image_location FROM vocabulary_image vi WHERE vi.vocabulary_id = v.vocabulary_id ORDER BY vi.is_primary DESC, vi.vocabulary_image_id ASC LIMIT 1) as images_path,
        (SELECT vv.video_location FROM vocabulary_video vv WHERE vv.vocabulary_id = v.vocabulary_id ORDER BY vv.is_primary DESC, vv.vocabulary_video_id ASC LIMIT 1) as videos_path,
        (SELECT COALESCE(SUM(vw.view_count), 0) FROM vocabulary_view vw WHERE vw.vocabulary_id = v.vocabulary_id) as view_count
      FROM vocabulary v
      WHERE v.class_room_id = ? ORDER BY v.vocabulary_id ASC`;
    const [vocabularies] = await db.execute(query, [classroomId]);
    return vocabularies;
  } catch (err) {
    throw { status: 500, message: err.message };
  }
}

async function getVocabulariesByType(vocabularyType, filters) {
  try {
    const { topic_id, classroom_id } = filters;
    let query = `SELECT 
        v.vocabulary_id as id,
        v.content,
        v.description as meaning,
        v.note,
        v.vocabulary_type as type,
        v.status,
        v.topic_id,
        v.class_room_id,
        (SELECT vi.image_location FROM vocabulary_image vi WHERE vi.vocabulary_id = v.vocabulary_id ORDER BY vi.is_primary DESC, vi.vocabulary_image_id ASC LIMIT 1) as images_path,
        (SELECT vv.video_location FROM vocabulary_video vv WHERE vv.vocabulary_id = v.vocabulary_id ORDER BY vv.is_primary DESC, vv.vocabulary_video_id ASC LIMIT 1) as videos_path,
        (SELECT COALESCE(SUM(vw.view_count), 0) FROM vocabulary_view vw WHERE vw.vocabulary_id = v.vocabulary_id) as view_count
      FROM vocabulary v
      WHERE v.vocabulary_type = ?`;
    const params = [vocabularyType];

    if (topic_id) {
      query += " AND topic_id = ?";
      params.push(topic_id);
    }
    if (classroom_id) {
      query += " AND class_room_id = ?";
      params.push(classroom_id);
    }

    const [vocabularies] = await db.execute(query, params);
    return vocabularies;
  } catch (err) {
    throw { status: 500, message: err.message };
  }
}

async function getVocabularyByContent(content) {
  try {
    const query = `SELECT 
        v.vocabulary_id as id,
        v.content,
        v.description as meaning,
        v.note,
        v.vocabulary_type as type,
        v.status,
        v.topic_id,
        v.class_room_id,
        (SELECT vi.image_location FROM vocabulary_image vi WHERE vi.vocabulary_id = v.vocabulary_id ORDER BY vi.is_primary DESC, vi.vocabulary_image_id ASC LIMIT 1) as images_path,
        (SELECT vv.video_location FROM vocabulary_video vv WHERE vv.vocabulary_id = v.vocabulary_id ORDER BY vv.is_primary DESC, vv.vocabulary_video_id ASC LIMIT 1) as videos_path,
        (SELECT COALESCE(SUM(vw.view_count), 0) FROM vocabulary_view vw WHERE vw.vocabulary_id = v.vocabulary_id) as view_count
      FROM vocabulary v
      WHERE v.content = ? LIMIT 1`;
    const [results] = await db.execute(query, [content]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    throw { status: 500, message: err.message };
  }
}

async function updateVocabulary(vocabularyId, data, userId) {
  try {
    const { content, description, note, status, images_path, videos_path } =
      data;
    let updateQuery = "UPDATE vocabulary SET ";
    const params = [];
    const fields = [];

    if (content !== undefined) {
      fields.push("content = ?");
      params.push(content);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      params.push(description);
    }
    if (note !== undefined) {
      fields.push("note = ?");
      params.push(note);
    }
    if (status !== undefined) {
      fields.push("status = ?");
      params.push(status);
    }
    if (images_path !== undefined) {
      fields.push("images_path = ?");
      params.push(images_path);
    }
    if (videos_path !== undefined) {
      fields.push("videos_path = ?");
      params.push(videos_path);
    }

    if (fields.length === 0)
      throw { status: 400, message: "No fields to update" };

    fields.push("modified_date = NOW()");
    updateQuery += fields.join(", ") + " WHERE vocabulary_id = ?";
    params.push(vocabularyId);

    const [result] = await db.execute(updateQuery, params);
    if (result.affectedRows === 0)
      throw { status: 404, message: "Vocabulary not found" };

    if (images_path !== undefined) {
      await db.execute("DELETE FROM vocabulary_image WHERE vocabulary_id = ?", [
        vocabularyId,
      ]);
      if (images_path) {
        await db.execute(
          "INSERT INTO vocabulary_image (vocabulary_id, image_location, is_primary) VALUES (?, ?, 1)",
          [vocabularyId, images_path],
        );
      }
    }

    if (videos_path !== undefined) {
      await db.execute("DELETE FROM vocabulary_video WHERE vocabulary_id = ?", [
        vocabularyId,
      ]);
      if (videos_path) {
        await db.execute(
          "INSERT INTO vocabulary_video (vocabulary_id, video_location, is_primary) VALUES (?, ?, 1)",
          [vocabularyId, videos_path],
        );
      }
    }

    return { id: vocabularyId, ...data };
  } catch (err) {
    throw { status: err.status || 500, message: err.message };
  }
}

async function deleteVocabulary(vocabularyId) {
  try {
    // Delete child dependencies manually to circumvent foreign key constraint failures
    await db.execute("DELETE FROM vocabulary_image WHERE vocabulary_id = ?", [
      vocabularyId,
    ]);
    await db.execute("DELETE FROM vocabulary_video WHERE vocabulary_id = ?", [
      vocabularyId,
    ]);
    await db.execute("DELETE FROM vocabulary_view WHERE vocabulary_id = ?", [
      vocabularyId,
    ]);

    // Some other tables might have references, but the main ones are above.
    const [result] = await db.execute(
      "DELETE FROM vocabulary WHERE vocabulary_id = ?",
      [vocabularyId],
    );
    if (result.affectedRows === 0)
      throw { status: 404, message: "Vocabulary not found" };
    return { success: true };
  } catch (err) {
    throw { status: err.status || 500, message: err.message };
  }
}

async function deleteVocabulariesByTopicId(topicId) {
  try {
    // Delete all child data related to vocabularies of this topic first
    // Note: We need a subquery for MySQL DELETE, wrapped in a double SELECT to avoid the 'target table is specified for update' error OR just use JOIN deletes, but this is simpler.

    // Quick approach: select all vocabulary_ids for this topic first
    const [vocabularies] = await db.execute(
      "SELECT vocabulary_id FROM vocabulary WHERE topic_id = ?",
      [topicId],
    );

    if (vocabularies.length > 0) {
      const vocabIds = vocabularies.map((v) => v.vocabulary_id);

      // We can chunk them safely if there are many, but since IN clause works for 3000
      // It's safer to just do a JOIN delete:
      await db.execute(
        "DELETE vi FROM vocabulary_image vi INNER JOIN vocabulary v ON vi.vocabulary_id = v.vocabulary_id WHERE v.topic_id = ?",
        [topicId],
      );
      await db.execute(
        "DELETE vv FROM vocabulary_video vv INNER JOIN vocabulary v ON vv.vocabulary_id = v.vocabulary_id WHERE v.topic_id = ?",
        [topicId],
      );
      await db.execute(
        "DELETE vw FROM vocabulary_view vw INNER JOIN vocabulary v ON vw.vocabulary_id = v.vocabulary_id WHERE v.topic_id = ?",
        [topicId],
      );
    }

    await db.execute("DELETE FROM vocabulary WHERE topic_id = ?", [topicId]);
    return { success: true };
  } catch (err) {
    throw { status: 500, message: err.message };
  }
}

async function getVocabularyStatistics(classroomId, topicId) {
  try {
    let query =
      "SELECT COUNT(*) as total, SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved FROM vocabulary WHERE 1=1";
    const params = [];
    if (classroomId) {
      query += " AND class_room_id = ?";
      params.push(classroomId);
    }
    if (topicId) {
      query += " AND topic_id = ?";
      params.push(topicId);
    }
    const [results] = await db.execute(query, params);
    return results[0];
  } catch (err) {
    throw { status: 500, message: err.message };
  }
}

module.exports = {
  createVocabulary,
  getVocabularies,
  getVocabularyById,
  getVocabulariesByTopicId,
  getVocabulariesByClassroomId,
  getVocabulariesByType,
  getVocabularyByContent,
  updateVocabulary,
  deleteVocabulary,
  deleteVocabulariesByTopicId,
  getVocabularyStatistics,
};
