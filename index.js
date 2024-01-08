import express from "express";
import { assignments } from "./data/assignments.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let assignmentsDatabase = assignments;

app.get("/assignments", function (req, res) {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request. Can fetch up to 10 assignments per request.",
    });
  }

  const assignments = assignmentsDatabase.slice(0, limit);
  return res.json({
    data: assignments,
  });
});

app.get("/assignments/:assignmentsId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  let assignmentData = assignmentsDatabase.filter(
    (item) => item.id === assignmentIdFromClient
  );

  return res.json({
    data: assignmentData[0],
  });
});

app.post("/assignments", function (req, res) {
  assignmentsDatabase.push({
    id: assignmentsDatabase[assignmentsDatabase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "Assignment has been created successfully",
  });
});

app.delete("/assignments/:assignmentsId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  const newAssignments = assignmentsDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  assignmentsDatabase = newAssignments;

  return res.json({
    message: "Assignment has been deleted successfully",
  });
});

app.put("/assignments/:assignmentsId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  const assignmentIndex = assignmentsDatabase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  assignmentsDatabase[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...req.body,
  };

  return res.json({
    message: "Assignment has been updated successfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${4000}`);
});
