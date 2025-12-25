import createUsersTable from "./users.js";
import createResearchTable from "./research.js";
import createFeedbackTable from "./feedback.js";
import createRatingsTable from "./ratings.js";
import createReviewsTable from "./reviews.js";
import createNotificationsTable from "./notifications .js";
import createAfterUserUpdateTrigger from "./trigger.js";

async function createAllTables() {
  createUsersTable();
  createResearchTable();
  createFeedbackTable();
  createRatingsTable();
  createReviewsTable();
  createNotificationsTable();
  createAfterUserUpdateTrigger();
  console.log("All tables and triggers created successfully.");
}

export default createAllTables;
