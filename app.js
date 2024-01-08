// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let assignmentMockDatabase = [...assignments];

let commentMockDatabase = [...comments];

app.get("/", (req, res) => {
  return res.json("Hello Mickey");
});

app.get("/assignment", (req, res) => {
  const limit = req.query.limit;
  if (limit > 10) {
    return res.json({
      message: "Invalid request, limit must not exceeds 10 assignments",
    });
  }
  const assignmentWithLimit = assignmentMockDatabase.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentWithLimit,
  });
});

app.get("/assignment/:assignmentId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentId);
  let assignmentData = assignmentMockDatabase.filter((item) => {
    return item.id === assignmentIdFromClient;
  });
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentData[0],
  });
});

app.post("/assignment", (req, res) => {
  let assignmentFromClient = req.body;
  assignmentMockDatabase.push({
    id: assignmentMockDatabase[assignmentMockDatabase.length - 1].id + 1,
    ...assignmentFromClient,
  });
  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentFromClient,
  });
});

app.put("/assignment/:assignmentId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentId);
  let assignmentFromClient = req.body;
  const assignmentIndex = assignmentMockDatabase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  assignmentMockDatabase[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...assignmentFromClient,
  };

  if (assignmentIndex === -1) {
    return res.json({
      message: "Cannot update, No data available!",
    });
  }

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
    data: assignmentMockDatabase[assignmentIndex],
  });
});

app.delete("/assignment/:assignmentId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentId);

  const newAssignments = assignmentMockDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  if (newAssignments.length === assignmentMockDatabase.length) {
    return res.json({
      message: `Cannot delete, No data available!`,
    });
  }

  assignmentMockDatabase = newAssignments;

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been deleted successfully`,
  });
});

app.get("/assignment/:assignmentId/comment", (req, res) => {
  let commentIdFromClient = Number(req.params.assignmentId);
  let commentsData = commentMockDatabase.filter((item) => {
    return item.assignmentId === commentIdFromClient;
  });
  return res.json({
    message: "Complete fetching comments",
    data: commentsData,
  });
});

app.post("/assignment/:assignmentId/comment", (req, res) => {
  let commentFromClient = req.body;
  commentMockDatabase.push({
    id: commentMockDatabase[commentMockDatabase.length - 1].id + 1,
    ...commentFromClient,
  });
  return res.json({
    message: "New comment has been created successfully",
    data: commentFromClient,
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
