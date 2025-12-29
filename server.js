import express from "express";
import createAllTables from "./queries/creatDatabase/creatDatabase.js"
import seedUsers from "./queries/creatDatabase/seedUsers.js"
import users from "./queries/editor/users.js";
import createUser from "./queries/general/sinup.js";
import login from "./queries/general/login.js";
import research_create from "./queries/author/research_create.js";
import research_in_review from "./queries/reviewer/research_in_review_rutern.js";
import assignReviewer from "./queries/editor/Assign_reviewer_for_research.js";
import addRating from "./queries/reviewer/rating.js";
import myResearch from "./queries/author/myResearch.js";
import createFeedback from "./queries/author/createFeedback.js";
import feedback from "./queries/editor/feedback.js";
import postedResearches from "./queries/general/postedResearches.js";
import information from "./queries/general/profile/information.js"
import countResearchAuthot from "./queries/general/profile/countResearchAuthot.js"
import countPublishedResearch from "./queries/general/profile/countPublishedResearch.js"
import getReviewers from "./queries/editor/getReviewers.js"
import getResearch from "./queries/editor/getResearch.js"
import getReviewedResearches from "./queries/editor/getReviewedResearches.js"
import updateStatusResearch from "./queries/editor/finalDecision.js"
import authorPromotion from "./queries/editor/authorPromotion.js"
import viewNotifications from "./queries/general/viewNotifications.js";
import journalStats from "./queries/general/journalStats.js"
import updateProfilePhoto from "./queries/general/profile/updateProfilePhoto.js"


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
createAllTables();//لي انشاء جداول البيانات اذا لم تكن موجوده
seedUsers();//انشاء مستخدمين اذا لم يكن اي مستخدم

//------API-------
//genreal
app.use("/login", login);//login
app.use("/createUser", createUser);//sinUp
app.use("/postedResearches", postedResearches);// الابحاث الموافق على نشرها لي تم عرضها على الصفحه
app.use("/viewNotifications",viewNotifications);// مشاهده الشعارات
app.use("/journalStats",journalStats);// احصاءيات عامة للمجله
//author
app.use("/create-research", research_create);// انشاء بحث
app.use("/myResearch", myResearch);// عرض ابحاثي
app.use("/createFeedback", createFeedback);// اضافة تغذية راجعه او تعليق
//reviwer
app.use("/research_in_review", research_in_review);// عرض الابحاث المخصصه للمراجع لكي يقيمها
app.use("/addRating", addRating);// اضافة التقيم للبحث
//editor
app.use("/users", users);// صفحة عرض جميع المستخدمين
app.use("/feedback", feedback);// صفحة عرض الافيد باك من المستخدمين
app.use("/authorPromotion", authorPromotion);// صفحة ترقية باحث الى مراجع
    //editor  صفحة ارسال البحث الى مراجع
app.use("/getResearch", getResearch);// ارجاع الابحاث التي ليس لها مراجع
app.use("/getReviewers", getReviewers);// ارجاع جميع المراجعين
app.use("/assignReviewer", assignReviewer);// تعين مراجع لبحث
    //editor  صفحة اعطاء القرار النهائي للبح
app.use("/getReviewedResearches", getReviewedResearches);//ارجاع الابحاث التي تم تقيمها من المراجع
app.use("/updateStatusResearch", updateStatusResearch);// اعطاء قرار نهائي للبحث للنشر او الرفض

//general profile
app.use("/information", information);// معلومات لي يتم عرضها
app.use("/countResearchAuthot", countResearchAuthot);// اعحصائات كم بحث رفع
app.use("/countPublishedResearch", countPublishedResearch);// احصائيات كم بحث تم نشره
app.use("/updateProfilePhoto",updateProfilePhoto);// هون بضيف صوره المستخدم او بغيرها

app.listen(8080, () => {
  console.log("I am listening in port 8080");
});