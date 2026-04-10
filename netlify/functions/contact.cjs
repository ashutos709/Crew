const nodemailer = require("nodemailer");

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { success: false, message: "Method not allowed" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { success: false, message: "Invalid JSON" });
  }

  const { name, email, service, message, type } = payload;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);

  const transporterConfig = {
    host: smtpHost,
    port: Number.isNaN(smtpPort) ? 587 : smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  if (smtpHost.includes("gmail.com")) {
    delete transporterConfig.host;
    delete transporterConfig.port;
    delete transporterConfig.secure;
    transporterConfig.service = "gmail";
    transporterConfig.requireTLS = true;
  }

  const toAddress = process.env.CONTACT_TO_EMAIL || "avjha709@gmail.com";

  const mailOptions = {
    from: `"Urja Consultancy Website" <${process.env.SMTP_USER}>`,
    to: toAddress,
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
      console.log("Request Data:", payload);
      return jsonResponse(200, { success: true, message: "Request received (Logged)" });
    }

    const transporter = nodemailer.createTransport(transporterConfig);
    await transporter.sendMail(mailOptions);
    return jsonResponse(200, { success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    const msg = String(error?.message || error);
    let clientMessage = "Failed to send email";
    if (msg.includes("Application-specific password required")) {
      clientMessage =
        "Gmail requires an App Password. Please generate one in your Google Account settings and update SMTP_PASS.";
    } else if (msg.includes("Invalid login")) {
      clientMessage = "Invalid SMTP credentials. Please check your username and password.";
    }
    return jsonResponse(500, {
      success: false,
      message: clientMessage,
      error: String(error),
    });
  }
};
