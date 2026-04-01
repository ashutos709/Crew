import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Request Logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Email Configuration
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  
  const transporterConfig: any = {
    host: smtpHost,
    port: isNaN(smtpPort) ? 587 : smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // Optimization for Gmail
  if (smtpHost.includes("gmail.com")) {
    delete transporterConfig.host;
    delete transporterConfig.port;
    delete transporterConfig.secure;
    transporterConfig.service = "gmail";
  }

  const transporter = nodemailer.createTransport(transporterConfig);

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Endpoint for Contact Form
  app.post("/api/contact", async (req, res) => {
    const { name, email, service, message, type } = req.body;

    const mailOptions = {
      from: `"Urja Consultancy Website" <${process.env.SMTP_USER}>`,
      to: "avjha709@gmail.com",
      subject: `New ${type || "Consultation"} Request from ${name}`,
      text: `
        New Request Details:
        -------------------
        Type: ${type || "Consultation"}
        Name: ${name}
        Email: ${email}
        Service: ${service || "N/A"}
        Message: ${message || "No message provided"}
      `,
      html: `
        <h3>New ${type || "Consultation"} Request</h3>
        <p><strong>Type:</strong> ${type || "Consultation"}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service || "N/A"}</p>
        <p><strong>Message:</strong> ${message || "No message provided"}</p>
      `,
    };

    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not configured. Logging request instead.");
        console.log("Request Data:", req.body);
        return res.status(200).json({ success: true, message: "Request received (Logged)" });
      }

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      
      let clientMessage = "Failed to send email";
      if (error.message?.includes("Application-specific password required")) {
        clientMessage = "Gmail requires an App Password. Please generate one in your Google Account settings and update SMTP_PASS.";
      } else if (error.message?.includes("Invalid login")) {
        clientMessage = "Invalid SMTP credentials. Please check your username and password.";
      }

      res.status(500).json({ 
        success: false, 
        message: clientMessage, 
        error: String(error) 
      });
    }
  });

  // Catch-all error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: String(err) });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
