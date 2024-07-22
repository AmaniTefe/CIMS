import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import mysqldump from "mysqldump";
import bluebird from "bluebird";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import AddClient from "./component/addclient.js";
import AddAdvocator from "./component/addadvocator.js";
import AddUser from "./component/adduser.js";
import Login from "./login.js";
import Getuser from "./component/getuser.js";
import Getrole from "./component/getrole.js";
import EditUser from "./component/editUser.js";
import FetchCasesByJudge from "./component/fetchfullcasebuyjudge.js";
import DeleteUser from "./component/deleteUser.js";
import EditUserStatus from "./component/EditUserStatus.js";
import { checkEmail } from "./component/checkemail.js";
import getJoinedClientData from "./component/getJoinedClientData.js";
import deleteClient from "./component/deleteClient.js";
import editClient from "./component/editclient.js";
import uploadImage from "./component/uploadimage.js";
import getUserImage from "./component/getuserimage.js";
import EditSpecificUser from "./component/editspecificuser.js";
import AddService from "./component/addservice.js";
import ViewServices from "./component/viewservices.js";
import EditService from "./component/editservice.js";
import DeleteService from "./component/deleteservice.js";
import AddCaseType from "./component/addcasetype.js";
import FetchCaseType from "./component/fetchcasetype.js";
import AddCasesubType from "./component/addcasesubtype.js";
import FetchCaseTypeGrid from "./component/fetchcasetypeGRID.js";
import GetCases from "./component/getcase.js";
import {
  GetPetitioners,
  GetRespondents,
} from "./component/getpetionerandrespondant.js";
import ResetPassword from "./user_forgot_password.js/password_reset.js";
import UpdateCase from "./component/editcase.js";
import { AddAppointment } from "./component/addappointment.js";
import getAdvocatorData from "./component/getadvocators.js";
import editAdvocator from "./component/editadvocator.js";
import deleteAdvocator from "./component/deleteadvocator.js";
import {
  getCaseAdvocates,
  getCaseClients,
  getCaseProsecutors,
} from "./component/getcaseclientandadvocator.js";
import deleteCase from "./component/deletecase.js";
import FetchAllCasesInformation from "./component/fetchfullcaseinfo.js";
import FetchCaseSubType from "./component/getsubcasetype.js";
import GetCaseCount from "./component/countcase.js";
import Fetchjudge from "./component/fetchjudge.js";
import uploadFilePath from "./component/uploadcasedocument.js";
import AddCase from "./component/addcase.js";
import assignJudgeToCase from "./component/assignedcase.js";
import UpdatePassword from "./user_forgot_password.js/password_update.js";
import GetUserById from "./component/getuserbyid.js";
const app = express();
import uploadOtherCases from "./component/uploadothercasedocument.js";
import uploadDocuments from "./component/othercase.js";
import uploadProscutorCaseDocument from "./component/uploadeproscutoercasedocument.js";
import InsertInvoiceAndItems from "./component/addinvoice.js";
import HighestInvoice from "./component/gethighestinvoice.js";
import GetInvoices from "./component/getinvoices.js";
import DeleteInvoice from "./component/deleteinvoice.js";
import AddInvoiceItem from "./component/editinvoice.js";
import GetInvoiceById from "./component/getinvoicebyid.js";
import DeleteInvoiceItem from "./component/deleteinvoiceitem.js";
import EditItem from "./component/edititem.js";
import EditSA from "./component/editinvoicestatusandamount.js";
import Notifications from "./component/notifications.js";
import DeleteCaseSubType from "./component/deleteCaseSubType.js";

const PORT = 8081;
import GetAppointmnetCases from "./component/getapppointmentcases.js";
import GetAppointment from "./component/getappointment.js";
import DeleteAppointment from "./component/deleteappointment.js";
import UpdateAppointment from "./component/updateappointment.js";
import FetchCasesByProsecutor from "./component/fetchfullcasebyproscutor.js";
import FethcProscutorDocuments from "./component/fetchproscutordocument.js";
import DeleteProscutorDocument from "./component/deleteproscutordocument.js";
import fetchAllProsecutorDocuments from "./component/fetchallcasedocuemtofproscutor.js";
import updateDocumentStatus from "./component/updatestatusofproscutordocument.js";
import CaseDecision from "./component/updatecasedecision.js";
import markAsRead from "./component/markasread.js";
import EditAdvocate from "./component/editadvocator.js";
import SendReminder from "./component/sendReminder.js";
const router = express.Router();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Origin",
      "X-Requested-With",
      "Accept",
      "x-client-key",
      "x-client-token",
      "x-client-secret",
      "Authorization",
    ],
    credentials: true,
  })
);
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
app.use(cors());

// MySQL Connection
const db = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  Promise: bluebird,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then((connection) => {
    console.log("Connected to the database");
    global.pool = bluebird.promisifyAll(connection);
  })
  .catch((err) => {
    console.error("Database connection failed: ", err);
  });

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const uploadFolder = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    cb(null, uploadFolder); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Generate unique filenames
  },
});

const upload = multer({ storage: storage });

// Handle file upload route
app.post("/api/uploaddocument", upload.single("file"), (req, res) =>
  uploadFilePath(db, req, res)
);
app.post("/api/uploaddocumentss", upload.single("file"), (req, res) =>
  uploadDocuments(db, req, res)
);

app.post("/api/uploadproscutordocumentss", upload.single("file"), (req, res) =>
  uploadProscutorCaseDocument(db, req, res)
);
app.post("/api/uploadothercase", upload.single("file"), (req, res) =>
  uploadOtherCases(db, req, res)
);

app.post("/api/upload", upload.single("file"), (req, res) =>
  uploadImage(db, req, res)
);
app.post("/api/login", async (req, res) => {
  await Login(db, req, res);
});

app.get("/api/getUsers", async (req, res) => {
  await Getuser(req, res);
});

app.get("/api/proscutorcasedocuments", async (req, res) => {
  await fetchAllProsecutorDocuments(req, res);
});
app.post("/api/getUserbyid", async (req, res) => {
  await GetUserById(req, res);
});

app.get("/api/getinvoicebyid/:invoiceId", async (req, res) => {
  await GetInvoiceById(db, req, res);
});
app.get("/api/getServices", async (req, res) => {
  await ViewServices(req, res);
});

app.get("/api/getCaseType", async (req, res) => {
  await FetchCaseType(req, res);
});
app.get("/api/judge", async (req, res) => {
  await Fetchjudge(req, res);
});

app.get("/api/fetchcaseinformation", async (req, res) => {
  await FetchAllCasesInformation(req, res);
});

app.post("/api/fetchcasebyjudge", async (req, res) => {
  await FetchCasesByJudge(req, db, res);
});

app.post("/api/fetchcasebyproscutor", async (req, res) => {
  await FetchCasesByProsecutor(req, db, res);
});
app.post("/api/fetchproscutorcases", async (req, res) => {
  await FethcProscutorDocuments(req, db, res);
});
app.get("/api/getCaseTypeGrid", async (req, res) => {
  await FetchCaseTypeGrid(req, res);
});

app.get("/api/getRole/:id", async (req, res) => {
  await Getrole(req, res);
});
app.post("/api/editUserStatus", async (req, res) => {
  await EditUserStatus(db, req, res);
});

app.post("/api/editcasedecition", async (req, res) => {
  await CaseDecision(db, req, res);
});
app.post("/api/updateDocumentStatus", async (req, res) => {
  await updateDocumentStatus(db, req, res);
});
app.post("/api/edititem", async (req, res) => {
  await EditItem(db, req, res);
});

app.post("/api/updateappointment", async (req, res) => {
  await UpdateAppointment(db, req, res);
});
app.post("/user/resetPassword", async (req, res) => {
  await ResetPassword(db, req, res);
});

app.post("/user/updatePassword", async (req, res) => {
  await UpdatePassword(db, req, res);
});

app.post("/api/editea", async (req, res) => {
  await EditSA(db, req, res);
});
app.post("/api/editUser", async (req, res) => {
  await EditUser(db, req, res);
});

app.post("/api/editservice", async (req, res) => {
  await EditService(db, req, res);
});
app.get("/api/getUserImage/:userId", (req, res) => {
  getUserImage(db, req, res); // Call getUserImage function with db, req, and res parameters
});

app.get("/api/getinvoices", async (req, res) => {
  await GetInvoices(db, req, res);
});

app.post("/api/addservice", async (req, res) => {
  await AddService(db, req, res);
});

app.post("/api/addcasetype", async (req, res) => {
  await AddCaseType(db, req, res);
});

app.post("/api/addinvoice", async (req, res) => {
  await InsertInvoiceAndItems(db, req, res);
});
app.post("/api/sendreminder", async (req, res) => {
  await SendReminder(db, req, res);
});
app.post("/api/deleteinvoiceitem", async (req, res) => {
  await DeleteInvoiceItem(db, req, res);
});

app.post("/api/addcase", async (req, res) => {
  await AddCase(db, req, res);
});

app.post("/api/editcase", async (req, res) => {
  await UpdateCase(db, req, res);
});
app.post("/api/addcasesubtype", async (req, res) => {
  await AddCasesubType(db, req, res);
});
app.post("/api/addclient", async (req, res) => {
  await AddClient(db, req, res);
});
app.post("/api/addadvocator", async (req, res) => {
  await AddAdvocator(db, req, res);
});

app.post("/api/addappointments", async (req, res) => {
  await AddAppointment(db, req, res);
});
app.get("/api/getJoinedClientData", async (req, res) => {
  await getJoinedClientData(db, req, res);
});
app.get("/api/getAdvocatorData", async (req, res) => {
  await getAdvocatorData(db, req, res);
});
app.get("/api/caseclients", async (req, res) => {
  await getCaseClients(db, req, res);
});
app.get("/api/caseadvocators", async (req, res) => {
  await getCaseAdvocates(db, req, res);
});
app.get("/api/caseproscuter", async (req, res) => {
  await getCaseProsecutors(db, req, res);
});
app.get("/api/checkemail", async (req, res) => {
  await checkEmail(db, req, res);
});
app.get("/api/checkuseremail", async (req, res) => {
  await checkEmail(db, req, res);
});
app.post("/api/deleteClient", async (req, res) => {
  await deleteClient(db, req, res);
});

app.post("/api/deleteproscutordocument", async (req, res) => {
  await DeleteProscutorDocument(db, req, res);
});
app.post("/api/deleteinvoice", async (req, res) => {
  await DeleteInvoice(db, req, res);
});

app.post("/api/deletecasesubtype", async (req, res) => {
  await DeleteCaseSubType(db, req, res);
});

app.post("/api/judgeassign", async (req, res) => {
  await assignJudgeToCase(db, req, res);
});
app.post("/api/deletecase", async (req, res) => {
  await deleteCase(db, req, res);
});

app.post("/api/deleteadvocator", async (req, res) => {
  await deleteAdvocator(db, req, res);
});
app.post("/api/deleteUser", async (req, res) => {
  await DeleteUser(db, req, res);
});
app.post("/api/deleteappointment", async (req, res) => {
  await DeleteAppointment(db, req, res);
});
app.post("/api/deleteService", async (req, res) => {
  await DeleteService(db, req, res);
});
app.post("/api/editClient", async (req, res) => {
  await editClient(db, req, res);
});

app.post("/api/addinvoiceitemforinvoice/:invoiceId", async (req, res) => {
  await AddInvoiceItem(db, req, res);
});

app.post("/api/editAdvocator", async (req, res) => {
  await EditAdvocate(db, req, res);
});
app.post("/api/adduser", async (req, res) => {
  await AddUser(db, req, res);
});
app.get("/api/cases", async (req, res) => {
  await GetCases(req, res); // Call GetCases function with req and res parameters
});

app.get("/api/gethighestinvoice", async (req, res) => {
  await HighestInvoice(db, req, res);
});

app.post("/api/appointmentcases", async (req, res) => {
  await GetAppointmnetCases(req, res); // Call GetCases function with req and res parameters
});

app.post("/api/getappointment", async (req, res) => {
  await GetAppointment(req, res); // Call GetCases function with req and res parameters
});
app.post("/api/updateUser/:userId", async (req, res) => {
  await EditSpecificUser(db, req, res);
});
app.get("/api/petitioners/:caseId", async (req, res) => {
  await GetPetitioners(db, req, res);
});
app.get("/api/notifications", (req, res) => {
  Notifications(db, req, res);
});

app.get("/api/respondents/:caseId", async (req, res) => {
  await GetRespondents(db, req, res);
});

app.post("/api/notifications/markallasread", async (req, res) => {
  await markAsRead(db, req, res);
});

// New endpoint to fetch case sub types based on case type
app.get("/api/getCaseSubType", async (req, res) => {
  await FetchCaseSubType(req, res);
});
app.get("/api/getcasecout", async (req, res) => {
  await GetCaseCount(req, res);
});
app.get("/api/backup", async (req, res) => {
  try {
    // Perform the database backup
    const dump = await mysqldump({
      connection: {
        host: "localhost",
        user: "root",
        password: "1234",
        database: "court",
      },
    });

    // Convert backup data to string
    const backupString = JSON.stringify(dump.dump);

    // Write the backup data to a file
    const backupFilePath = path.join(process.cwd(), "backup.sql");
    fs.writeFileSync(backupFilePath, backupString);

    // Set response headers for file download
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=backup.sql");

    // Send the backup file as response
    res.sendFile(backupFilePath);
  } catch (error) {
    console.error("Database backup failed:", error);
    // Send response indicating failure
    res.status(500).send("Database backup failed. Please try again later.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
