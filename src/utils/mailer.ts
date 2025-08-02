import nodemailer from "nodemailer";

type CompanyEmailParams = {
  companyName: string;
  email: string;
  website?: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT ? parseInt(process.env.MAILTRAP_PORT) : 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const sendNewCompanyEmail = async ({
  companyName,
  email,
  website,
}: CompanyEmailParams): Promise<void> => {
  try {
    await transporter.sendMail({
      from: '"MINI CRM App" <no-reply@jetzy.com>',
      to: "admin@admin.com", // send only to admin
      subject: "A New Company Has Been Registered",
      html: `
        <h3>New Company Registered</h3>
        <p><strong>Name:</strong> ${companyName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${website ? `<p><strong>Website:</strong> ${website}</p>` : ""}
        <p>Please log in to the CRM dashboard for more details.</p>
      `,
    });
    console.log(`Admin notified about new company: ${companyName}`);
  } catch (error) {
    console.error("Error sending new company email to admin:", error);
    throw error;
  }
};

export { sendNewCompanyEmail };
