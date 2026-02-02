// Vocabulary Routes - Aggregator
const express = require("express");
const vocabularyController = require("../controllers/vocabulary.controller");
const { authRequired } = require("../../../middleware/auth.middleware");
const checkOrgRole = require("../../../middleware/orgRole.middleware");

const router = express.Router();

router.post(
  "/",
  authRequired,
  checkOrgRole(["TEACHER", "SUPER_ADMIN", "CENTER_ADMIN", "SCHOOL_ADMIN"]),
  vocabularyController.createVocabulary,
);

router.get("/", vocabularyController.getVocabularies);
router.get("/:vocabulary_id", vocabularyController.getVocabularyById);

router.put(
  "/:vocabulary_id",
  authRequired,
  checkOrgRole(["TEACHER", "SUPER_ADMIN", "CENTER_ADMIN", "SCHOOL_ADMIN"]),
  vocabularyController.updateVocabulary,
);

router.delete(
  "/:vocabulary_id",
  authRequired,
  checkOrgRole(["SUPER_ADMIN", "CENTER_ADMIN", "SCHOOL_ADMIN"]),
  vocabularyController.deleteVocabulary,
);

router.delete(
  "/topic/:topic_id",
  authRequired,
  checkOrgRole(["SUPER_ADMIN", "CENTER_ADMIN", "SCHOOL_ADMIN"]),
  vocabularyController.deleteVocabulariesByTopic,
);

module.exports = router;
