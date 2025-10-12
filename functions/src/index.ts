/**
 * Firebase Cloud Functions for GTA Budget Painting
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import {Resend} from "resend";
import {generateCustomerEmail, generateAdminEmail, generateCartCustomerEmail, generateCartAdminEmail} from "./emailTemplates";

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
          from: "GTA Budget Painting <onboarding@resend.dev>",
          to: serviceRequestData.customerInfo.email,
          subject: `Your Order #${serviceRequestData.requestId} Has Been Received`,
          html: generateCartCustomerEmail(serviceRequestData),
        });

        adminEmail = await resend.emails.send({
          from: "GTA Budget Painting System <onboarding@resend.dev>",
          to: "info@gtabudgetpainting.ca",
          subject: `🛒 New Cart Order #${serviceRequestData.requestId} - $${serviceRequestData.totals.grandTotal.toFixed(2)}`,
          html: generateCartAdminEmail(serviceRequestData),
        });
      } else {
        // Single service emails
        customerEmail = await resend.emails.send({
          from: "GTA Budget Painting <onboarding@resend.dev>",
          to: serviceRequestData.customerInfo.email,
          subject: `Your Service Request #${serviceRequestData.requestId} Has Been Received`,
          html: generateCustomerEmail(serviceRequestData),
        });

        adminEmail = await resend.emails.send({
          from: "GTA Budget Painting System <onboarding@resend.dev>",
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
