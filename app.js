// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";


let assignmentMockDatabase = [...assignments];


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const app = express();
const port = 4000;
//ต้องไม่เกิน 10 ใช้ if 
app.get('/assignments', (req, res) => {
  if (req.query.limit>10) {
    return res.json({
        message: "Invalid request,limit must not exceeds 10 assignments",
        })
  }
  const assignmentResult = assignmentMockDatabase.slice(0, req.query.limit);

  return res.json({
    data: assignmentResult,
  });
});

app.get('/assignments/:assignmentsId',(req,res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  const newAssignment = assignments.filter((item) => {
    return item.id === assignmentIdFromClient;
  });
  return res.json({
    data: newAssignment[0],
  });
});

app.post('/assignments',((req,res) => {
  let assignmentDataFromClient;
  let newAssignmentId;
  if (!assignmentMockDatabase.length) {
    // ถ้าใน Mock Database ไม่มีข้อมูลอยู่เลย จะกำหนด newAssignmentId เป็น 1
    newAssignmentId = 1;
  } else {
    // ถ้าใน Mock Database มีข้อมูลอยู่แล้วจะกำหนด newAssignmentId เป็น Id ของ Assignment สุดท้ายเพิ่มขึ้น 1
    newAssignmentId =
      assignmentMockDatabase[assignmentMockDatabase.length - 1].id + 1;
  }

  // Assign ตัว Key id เข้าไปใน assignmentDataFromClient
  assignmentDataFromClient = {
    id: newAssignmentId,
    ...req.body,
  };

  // เพิ่มข้อมูลลงไปใน Mock Database
  assignmentMockDatabase.push(assignmentDataFromClient);
 return res.json({
  message: "New assignment has been created successfully",
})
}))

app.delete(	
  '/assignments/:assignmentsId',((req,res) => {
    const assignmentIdFromClient = Number(req.params.assignmentId);

  // หาข้อมูลใน Mock Database ก่อนกว่ามีไหม
  const hasFound = assignmentMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  // ถ้าไม่มีก็ให้ Return error response กลับไปให้ Client
  if (!hasFound) {
    return res.json({
      message: "No assignment to delete",
    });
  }

  // กรองเอา Assignment ที่จะลบออกไปจาก Mock Database
  const newAssignments = assignmentMockDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  assignmentMockDatabase = newAssignments;

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been deleted successfully`,
  });

  }))

  app.put("/assignments/:assignmentId", (req, res) => {
    const assignmentIdFromClient = Number(req.params.assignmentId);
  
    const updateAssignmentData = {
      ...req.body,
    };
  
    const hasFound = assignmentMockDatabase.find((item) => {
      return item.id === assignmentIdFromClient;
    });
  
    if (!hasFound) {
      return res.json({
        message: "No assignment to update",
      });
    }
  
    // หา Index ของข้อมูลใน Mock Database เพื่อที่จะเอามาใช้ Update ข้อมูล
    const assignmentIndex = assignmentMockDatabase.findIndex((item) => {
      return item.id === assignmentIdFromClient;
    });
  
    assignmentMockDatabase[assignmentIndex] = {
      id: assignmentIdFromClient,
      ...updateAssignmentData,
    };
  
    return res.json({
      message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
    });
  });
  
app.listen(port, () => {
  console.log(`Server is running at ${port}`)
});