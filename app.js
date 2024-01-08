// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentsDatabase = [...assignments];

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  const assignment = assignmentsDatabase.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignment,
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let assignmentsData = assignmentsDatabase.filter(
    (item) => item.id === assignmentsIdFromClient
  );

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsData[0],
  });
});

app.post("/assignments", (req, res) => {
  assignmentsDatabase.push({
    id: assignmentsDatabase[assignmentsDatabase.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: req.body,
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);

  const assignmentToDelete = assignmentsDatabase.find(
    (item) => item.id === assignmentsIdFromClient
  );

  if (!assignmentToDelete) {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }

  const newAssignment = assignmentsDatabase.filter((item) => {
    return item.id !== assignmentsIdFromClient;
  });

  assignmentsDatabase = newAssignment;

  return res.json({
    message: `Assignment Id : ${assignmentsIdFromClient} has been delete successfully`,
  });
});

app.put("/assignments/:assignmentId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentId);
  const assignmentIndex = assignmentsDatabase.findIndex((item) => {
    return item.id === assignmentsIdFromClient;
  });

  if (assignmentIndex === -1) {
    return res.json({
      message: "Cannot update, No data available!",
    });
  }

  assignmentsDatabase[assignmentIndex] = {
    id: assignmentsIdFromClient,
    ...req.body,
  };

  return res.json({
    message: `Assignment Id : ${assignmentsIdFromClient} has been update successfully`,
    data: req.body,
  });
});

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let commentsData = comments.filter(
    (item) => item.assignmentId === assignmentsIdFromClient
  );

  return res.json({
    message: "Complete Fetching comments",
    data: commentsData,
  });
});
