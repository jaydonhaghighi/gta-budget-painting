/**
 * Firebase Cloud Functions for GTA Budget Painting
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import {Resend} from "resend";
import {generateCustomerEmail, generateAdminEmail, generateCartCustomerEmail, generateCartAdminEmail, generateInvoiceEmail} from "./emailTemplates";

// Set global options for cost control
setGlobalOptions({maxInstances: 10});

// Define the Resend API key as a secret
const resendApiKey = defineSecret("RESEND_API_KEY");

/**
 * Send emails when a new service request is submitted
 * This function sends confirmation email to customer and notification to admin
 */
export const sendServiceRequestEmails = onRequest(
  {cors: true, secrets: [resendApiKey]},
  async (request, response) => {
    try {
      // Validate request method
      if (request.method !== "POST") {
        response.status(405).json({error: "Method not allowed"});
        return;
      }

      // Initialize Resend with the secret API key
      const resend = new Resend(resendApiKey.value());

      // Extract data from request body
      const serviceRequestData = request.body;

      // Convert createdAt string back to Date object
      serviceRequestData.createdAt = new Date(serviceRequestData.createdAt);

      // Check if this is a cart order (has lineItems) or single service
      const isCartOrder = serviceRequestData.lineItems && Array.isArray(serviceRequestData.lineItems);

      logger.info("Sending service request emails", {
        requestId: serviceRequestData.requestId,
        customerEmail: serviceRequestData.customerInfo.email,
        isCartOrder: isCartOrder,
        itemCount: isCartOrder ? serviceRequestData.lineItems.length : 1
      });

      let customerEmail, adminEmail;

      if (isCartOrder) {
        // Cart order emails
        customerEmail = await resend.emails.send({
          from: "GTA Budget Painting <noreply@gtabudgetpainting.ca>",
          to: serviceRequestData.customerInfo.email,
          subject: `Your Order #${serviceRequestData.requestId} is Being Reviewed by our Team`,
          html: generateCartCustomerEmail(serviceRequestData),
        });

        adminEmail = await resend.emails.send({
          from: "GTA Budget Painting System <system@gtabudgetpainting.ca>",
          to: "info@gtabudgetpainting.ca",
          subject: `🛒 New Cart Order #${serviceRequestData.requestId} - $${serviceRequestData.totals.grandTotal.toFixed(2)}`,
          html: generateCartAdminEmail(serviceRequestData),
        });
      } else {
        // Single service emails
        customerEmail = await resend.emails.send({
          from: "GTA Budget Painting <noreply@gtabudgetpainting.ca>",
          to: serviceRequestData.customerInfo.email,
          subject: `Your Order #${serviceRequestData.requestId} is Being Reviewed by our Team`,
          html: generateCustomerEmail(serviceRequestData),
        });

        adminEmail = await resend.emails.send({
          from: "GTA Budget Painting System <system@gtabudgetpainting.ca>",
          to: "info@gtabudgetpainting.ca",
          subject: `🔔 New Service Request #${serviceRequestData.requestId} - ${serviceRequestData.serviceName}`,
          html: generateAdminEmail(serviceRequestData),
        });
      }

      logger.info("Customer email sent", {emailId: customerEmail.data?.id});
      logger.info("Admin email sent", {emailId: adminEmail.data?.id});

      // Return success response
      response.status(200).json({
        success: true,
        customerEmailId: customerEmail.data?.id,
        adminEmailId: adminEmail.data?.id,
        message: "Emails sent successfully",
      });
    } catch (error) {
      logger.error("Error sending emails", {error});
      response.status(500).json({
        success: false,
        error: "Failed to send emails",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

/**
 * Send invoice email to client
 * This function sends a professional invoice email to the client
 */
export const sendInvoiceEmail = onRequest(
  {cors: true, secrets: [resendApiKey]},
  async (request, response) => {
    try {
      // Validate request method
      if (request.method !== "POST") {
        response.status(405).json({error: "Method not allowed"});
        return;
      }

      // Initialize Resend with the secret API key
      const resend = new Resend(resendApiKey.value());

      // Extract invoice data from request body
      const invoiceData = request.body;

      logger.info("Sending invoice email", {
        invoiceNumber: invoiceData.invoiceNumber,
        clientEmail: invoiceData.clientInfo.email,
        total: invoiceData.total
      });

      // Send invoice email to client
      logger.info("Attempting to send invoice email to", {email: invoiceData.clientInfo.email});
      const invoiceEmail = await resend.emails.send({
        from: "GTA Budget Painting <invoices@gtabudgetpainting.ca>",
        to: invoiceData.clientInfo.email,
        subject: `Your Order #${invoiceData.invoiceNumber} Has Been Accepted`,
        html: generateInvoiceEmail(invoiceData),
      });

      logger.info("Invoice email result", {
        success: invoiceEmail.data ? true : false,
        emailId: invoiceEmail.data?.id,
        error: invoiceEmail.error
      });

      // Send notification to admin
      logger.info("Attempting to send admin notification to", {email: "info@gtabudgetpainting.ca"});
      const adminEmail = await resend.emails.send({
        from: "GTA Budget Painting System <system@gtabudgetpainting.ca>",
        to: "info@gtabudgetpainting.ca",
        subject: `📄 Invoice #${invoiceData.invoiceNumber} Sent to ${invoiceData.clientInfo.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2C3D4B;">Invoice Sent</h2>
            <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
            <p><strong>Client:</strong> ${invoiceData.clientInfo.name}</p>
            <p><strong>Email:</strong> ${invoiceData.clientInfo.email}</p>
            <p><strong>Amount:</strong> $${invoiceData.total.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${invoiceData.dueDate}</p>
            <p><strong>Sent:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      });

      logger.info("Admin email result", {
        success: adminEmail.data ? true : false,
        emailId: adminEmail.data?.id,
        error: adminEmail.error
      });

      // Return success response
      response.status(200).json({
        success: true,
        invoiceEmailId: invoiceEmail.data?.id,
        adminEmailId: adminEmail.data?.id,
        message: "Invoice email sent successfully",
      });
    } catch (error) {
      logger.error("Error sending invoice email", {error});
      response.status(500).json({
        success: false,
        error: "Failed to send invoice email",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
);
