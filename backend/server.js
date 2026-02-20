import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/team.js';
import leaveRoutes from "./routes/leave.js"
import attendanceRoutes from "./routes/attendance.js"
import dashboardRoutes from "./routes/dashboard.js"
import projectRoutes from "./routes/project.js"
const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();
// Middleware

app.use(express.json());
app.use(cors());

// API Routes
app.get('/', (req, res) => res.send('server is Live'));
app.use('/api/auth', authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/project", projectRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));