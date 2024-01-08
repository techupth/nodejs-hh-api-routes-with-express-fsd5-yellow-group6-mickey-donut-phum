import express from "express";
import {assignments} from "./data/assignments.js"
import {comments} from "./data/comments.js";

let assignmentsDatabase = [...assignments]
let commentsDatabase = [...comments];

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//assignment
app.get("/assignments", function (req, res) {
  let limit = req.query.limit;
  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  } else {
    const assignments = assignmentsDatabase.slice(0, limit);
    return res.json({
      message: "Complete Fetching assignments",
      data: assignments,
    });
  }
});

app.get("/assignments/:assignmentsId", function (req, res) {
  let assignmentsId = Number(req.params.assignmentsId);
  let assignmentsData = assignmentsDatabase.filter(
    (item) => item.id === assignmentsId
  );
    return res.json({
      message: "Complete fetching assignments",
      data: assignmentsData[0],
    });
});

app.post("/assignments", function (req, res) {
  assignmentsDatabase.push({
    id: assignmentsDatabase[assignmentsDatabase.length - 1].id + 1,
    ...req.body
  });
    return res.json({
      message: "New assignment has been created successfully",
      data: assignmentsDatabase,
    })
});

app.delete("/assignments/:assignmentsId", function (req, res) {
  let assignmentsId = Number(req.params.assignmentsId);
  let hasFoundData = assignmentsDatabase.find(
    (item) => item.id === assignmentsId)
      if (!hasFoundData) {
        return res.json({
          message: "Cannot delete, No data available!",
        });
      }
  let assignmentsData = assignmentsDatabase.filter(
    (item) => item.id !== assignmentsId
  );
  assignmentsDatabase = assignmentsData
    return res.json({
      message: `Assignment Id : ${assignmentsId} has been deleted successfully`,
    });
});

app.put("/assignments/:assignmentsId", function (req, res) {
  let assignmentsId = Number(req.params.assignmentsId);
  let updateAssignmentsData = {
  ...req.body,
  };
  let hasFoundData = assignmentsDatabase.find(
    (item) => item.id === assignmentsId)
      if (!hasFoundData) {
        return res.json({
          message: "Cannot update, No data available!",
        }); 
    }
  let AssignmentsIndex = assignmentsDatabase.findIndex(
    (item) => item.id === assignmentsId)
      assignmentsDatabase[AssignmentsIndex] = {
        id: assignmentsId,
        ...updateAssignmentsData
      };
    return res.json({
      message: `Assignment Id : ${assignmentsId} has been updated successfully`,
      data: updateAssignmentsData,
    });
});

//comment
app.get("/assignments/:assignmentsId/comments", function (req, res) {
  let commentId = Number(req.params.assignmentsId);
  let commentData = commentsDatabase.filter(
    (item) => item.assignmentId === commentId
  );
    if (commentData.length > 0) {
      return res.json({
        message: "Complete fetching comments",
        data: commentData,
      });
    } else {
      return res.json({
        message: "No data available!",
      });
    }
});

app.post("/assignments/:assignmentsId/comments", function (req, res) {
  let commentId = Number(req.params.assignmentsId);
  let newCommentId = 1;
    if (commentsDatabase.length > 0) {
      newCommentId = commentsDatabase[commentsDatabase.length - 1].id + 1;
    }
  commentsDatabase.push({
    id: newCommentId,
    assignmentId: commentId,
    ...req.body,
  });  
  return res.json({
    message: "New comment has been created successfully",
    data: commentsDatabase[commentsDatabase.length - 1],
  });
});

app.listen(port, () => {
    console.log(`Server ir running at ${port}`);
})