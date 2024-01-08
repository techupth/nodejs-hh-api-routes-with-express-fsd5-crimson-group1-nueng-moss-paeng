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
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }

  const assignments = assignmentsDatabase.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignments,
  });
});

app.get("/assignments/:assignmentsId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  let assignmentData = assignmentsDatabase.filter(
    (item) => item.id === assignmentIdFromClient
  );

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentData[0],
  });
});

app.post("/assignments", function (req, res) {
  assignmentsDatabase.push({
    id: assignmentsDatabase[assignmentsDatabase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "New assignment has been created successfully",
    id: assignmentsDatabase[assignmentsDatabase.length - 1].id + 1,
    data: req.body,
  });
});

app.delete("/assignments/:assignmentsId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  const assignmentExists = assignments.some(
    (item) => item.id === assignmentIdFromClient
  );

  if (!assignmentExists) {
    return res.status(401).json({
      message: "Cannot delete, No data available!",
    });
  }

  const newAssignments = assignmentsDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  assignmentsDatabase = newAssignments;

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient} has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentsId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  const assignmentExists = assignments.some(
    (item) => item.id === assignmentIdFromClient
  );

  if (!assignmentExists) {
    return res.status(401).json({
      message: "Cannot update, No data available!",
    });
  }

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
