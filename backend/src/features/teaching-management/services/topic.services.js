const db = require("../../../db");

/**
 * Service layer for topic management.
 * Aligned with verified database schema: topic table (topic_id, content, class_room_id, etc.)
 */

async function createTopic(
  name,
  classroomId,
  imageLocation,
  description,
  creatorId,
  isCommon,
) {
  try {
    if (!name) {
      throw {
        status: 400,
        message: "Topic name is required",
      };
    }

    const query = `
      INSERT INTO topic (content, class_room_id, image_location, description, created_id, is_private, created_date, modified_date)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const [result] = await db.execute(query, [
      name,
      classroomId || null,
      imageLocation || null,
      description || null,
      creatorId || null,
      isCommon ? 0 : 1, // is_private is bit(1), if common then is_private=0
    ]);

    return {
      id: result.insertId,
      name,
      classroom_id: classroomId,
      image_location: imageLocation,
      description,
      creator_id: creatorId,
      is_common: isCommon ? 1 : 0,
      created_at: new Date(),
    };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error creating topic",
    };
  }
}

async function getTopics(limit, offset, classroomId, creatorId, isCommon) {
  try {
    let whereClause = " WHERE 1=1";
    const params = [];

    if (classroomId) {
      whereClause += " AND class_room_id = ?";
      params.push(classroomId);
    }

    if (creatorId) {
      whereClause += " AND created_id = ?";
      params.push(creatorId);
    }

    if (isCommon !== null && isCommon !== undefined) {
      whereClause += " AND is_private = ?";
      params.push(isCommon ? 0 : 1);
    }

    const countQuery = "SELECT COUNT(*) as count FROM topic" + whereClause;

    const [countResults] = await db.execute(countQuery, params);
    const total = countResults[0].count;

    const query = `SELECT topic_id as id, content as name, class_room_id as classroom_id, image_location, description, is_private 
                   FROM topic ${whereClause} LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const [data] = await db.execute(query, params);

    return {
      data,
      total,
      limit,
      offset,
    };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error fetching topics",
    };
  }
}

async function getTopicById(topicId) {
  try {
    if (!topicId) {
      throw {
        status: 400,
        message: "Topic ID is required",
      };
    }

    const query =
      "SELECT topic_id as id, content as name, class_room_id as classroom_id, description, image_location FROM topic WHERE topic_id = ?";
    const [results] = await db.execute(query, [topicId]);

    if (results.length === 0) {
      throw {
        status: 404,
        message: "Topic not found",
      };
    }

    return results[0];
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error fetching topic",
    };
  }
}

async function getTopicsByClassroom(classroomId, limit, offset) {
  try {
    if (!classroomId) {
      throw {
        status: 400,
        message: "Classroom ID is required",
      };
    }

    const countQuery =
      "SELECT COUNT(*) as count FROM topic WHERE class_room_id = ?";
    const [countResults] = await db.execute(countQuery, [classroomId]);
    const total = countResults[0].count;

    const query = `SELECT topic_id as id, content as name, class_room_id as classroom_id, description, image_location 
                   FROM topic WHERE class_room_id = ? LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    const [data] = await db.execute(query, [classroomId]);

    return {
      data,
      total,
      limit,
      offset,
    };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error fetching topics by classroom",
    };
  }
}

async function getTopicsByCreator(creatorId, limit, offset) {
  try {
    if (!creatorId) {
      throw {
        status: 400,
        message: "Creator ID is required",
      };
    }

    const countQuery =
      "SELECT COUNT(*) as count FROM topic WHERE created_id = ?";
    const [countResults] = await db.execute(countQuery, [creatorId]);
    const total = countResults[0].count;

    const query = `SELECT topic_id as id, content as name, class_room_id as classroom_id, description, image_location 
                   FROM topic WHERE created_id = ? LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    const [data] = await db.execute(query, [creatorId]);

    return {
      data,
      total,
      limit,
      offset,
    };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error fetching topics by creator",
    };
  }
}

async function searchTopicsByName(name, limit, offset) {
  try {
    if (!name) {
      throw {
        status: 400,
        message: "Search name is required",
      };
    }

    const searchTerm = `%${name}%`;
    const countQuery =
      "SELECT COUNT(*) as count FROM topic WHERE content LIKE ?";
    const [countResults] = await db.execute(countQuery, [searchTerm]);
    const total = countResults[0].count;

    const query = `SELECT topic_id as id, content as name, class_room_id as classroom_id, description, image_location 
                   FROM topic WHERE content LIKE ? LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    const [data] = await db.execute(query, [searchTerm]);

    return {
      data,
      total,
      limit,
      offset,
    };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error searching topics",
    };
  }
}

async function updateTopic(topicId, updates) {
  try {
    if (!topicId) {
      throw {
        status: 400,
        message: "Topic ID is required",
      };
    }

    if (Object.keys(updates).length === 0) {
      throw {
        status: 400,
        message: "No fields to update",
      };
    }

    let query = "UPDATE topic SET ";
    const params = [];
    const fields = [];

    if (updates.name !== undefined) {
      fields.push("content = ?");
      params.push(updates.name);
    }

    if (updates.description !== undefined) {
      fields.push("description = ?");
      params.push(updates.description);
    }

    if (updates.image_location !== undefined) {
      fields.push("image_location = ?");
      params.push(updates.image_location);
    }

    if (updates.is_common !== undefined) {
      fields.push("is_private = ?");
      params.push(updates.is_common ? 0 : 1);
    }

    if (fields.length === 0) {
      throw {
        status: 400,
        message: "No valid fields to update",
      };
    }

    fields.push("modified_date = NOW()");
    query += fields.join(", ") + " WHERE topic_id = ?";
    params.push(topicId);

    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      throw {
        status: 404,
        message: "Topic not found",
      };
    }

    return {
      id: topicId,
      ...updates,
      updated_at: new Date(),
    };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error updating topic",
    };
  }
}

async function deleteTopic(topicId) {
  try {
    if (!topicId) {
      throw {
        status: 400,
        message: "Topic ID is required",
      };
    }

    const query = "DELETE FROM topic WHERE topic_id = ?";
    const [result] = await db.execute(query, [topicId]);

    if (result.affectedRows === 0) {
      throw {
        status: 404,
        message: "Topic not found",
      };
    }

    return {
      message: "Topic deleted successfully",
      id: topicId,
    };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error deleting topic",
    };
  }
}

async function deleteTopicsByClassroom(classroomId) {
  try {
    if (!classroomId) {
      throw {
        status: 400,
        message: "Classroom ID is required",
      };
    }

    const query = "DELETE FROM topic WHERE class_room_id = ?";
    const [result] = await db.execute(query, [classroomId]);

    return {
      message: "Topics deleted successfully",
      classroom_id: classroomId,
      deletedCount: result.affectedRows,
    };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error deleting topics",
    };
  }
}

async function getTopicStatistics(classroomId) {
  try {
    let query = "SELECT COUNT(*) as total FROM topic WHERE 1=1";
    const params = [];

    if (classroomId) {
      query += " AND class_room_id = ?";
      params.push(classroomId);
    }

    const [statsResults] = await db.execute(query, params);
    return statsResults[0] || { total: 0 };
  } catch (err) {
    throw {
      status: err.status || 500,
      message: err.message || "Error fetching topic statistics",
    };
  }
}

module.exports = {
  createTopic,
  getTopics,
  getTopicById,
  getTopicsByClassroom,
  getTopicsByCreator,
  searchTopicsByName,
  updateTopic,
  deleteTopic,
  deleteTopicsByClassroom,
  getTopicStatistics,
};
