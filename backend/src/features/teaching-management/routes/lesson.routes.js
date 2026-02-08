// Lesson Routes - Aggregator
const express = require("express");
const lessonController = require("../controllers/lesson.controller");
const { authRequired } = require("../../../middleware/auth.middleware");
const checkOrgRole = require("../../../middleware/orgRole.middleware");

const router = express.Router();

router.post(
  "/",
  authRequired,
  checkOrgRole(["TEACHER", "SUPER_ADMIN", "CENTER_ADMIN", "SCHOOL_ADMIN"]),
  lessonController.createLesson,
);

router.get("/", authRequired, lessonController.getLessons);
router.get("/statistics", authRequired, lessonController.getLessonStatistics);
router.get("/:lesson_id", authRequired, lessonController.getLessonById);

router.get(
  "/topic/:topic_id",
  authRequired,
  lessonController.getLessonsByTopic,
);
router.get(
  "/classroom/:classroom_id",
  authRequired,
  lessonController.getLessonsByClassroom,
);

router.put(
  "/:lesson_id",
  authRequired,
  checkOrgRole(["TEACHER", "SUPER_ADMIN", "CENTER_ADMIN", "SCHOOL_ADMIN"]),
  lessonController.updateLesson,
);

router.put(
  "/topic/:topic_id/reorder",
  authRequired,
  checkOrgRole(["TEACHER", "SUPER_ADMIN", "CENTER_ADMIN", "SCHOOL_ADMIN"]),
  lessonController.reorderLessons,
);

router.delete(
  "/:lesson_id",
  authRequired,
  checkOrgRole(["SUPER_ADMIN", "CENTER_ADMIN", "SCHOOL_ADMIN"]),
  lessonController.deleteLesson,
);

router.delete(
  "/topic/:topic_id",
  authRequired,
  checkOrgRole(["SUPER_ADMIN", "CENTER_ADMIN", "SCHOOL_ADMIN"]),
  lessonController.deleteLessonsByTopic,
);

module.exports = router;
