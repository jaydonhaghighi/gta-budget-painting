// Email Templates for GTA Budget Painting

interface ServiceRequestData {
  serviceId: string;
  serviceName: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    preferredContact: string;
    bestTimeToCall: string;
    howDidYouHear: string;
    additionalNotes: string;
  };
  estimate?: {
    totalHours: number;
    laborCost: number;
    paintGallons: number;
    paintCost: number;
    suppliesCost: number;
    prepFee: number;
    travelFee: number;
    subtotal: number;
    totalCost: number;
    breakdown: string[];
  };
  formData: any;
  requestId: string;
  createdAt: Date;
}

export const generateCustomerEmail = (data: ServiceRequestData): string => {
  const {customerInfo, serviceName, estimate, requestId, createdAt} = data;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Request Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 20px;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: #a6b2b5; padding: 40px 30px; text-align: center;">
                    <img src="https://gtabudgetpainting.ca/logo.png" alt="GTA Budget Painting" style="height: 100px; width: auto; margin-bottom: 0;" />
                  </td>
                </tr>

                <!-- Success Banner -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; text-align: center;">
                    <div style="display: inline-block; background-color: #10b981; border-radius: 50%; width: 60px; height: 60px; line-height: 60px; margin-bottom: 15px;">
                      <span style="font-size: 32px; color: white;">✓</span>
                    </div>
                    <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Request Received!</h2>
                    <p style="margin: 10px 0 0; color: #e7e6e3; font-size: 16px;">Thank you for choosing GTA Budget Painting</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; color: #4a5355; font-size: 16px; line-height: 1.6;">
                      Hi ${customerInfo.firstName},
                    </p>
                    
                    <p style="margin: 0 0 25px; color: #4a5355; font-size: 16px; line-height: 1.6;">
                      We've received your service request for <strong>${serviceName}</strong> and our team will review it shortly. Here's a summary of your request:
                    </p>

                    <!-- Request Details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                      <tr>
                        <td>
                          <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                              <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Request ID:</td>
                              <td style="color: #4a5355; font-size: 14px; text-align: right;">${requestId}</td>
                            </tr>
                            <tr>
                              <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Date:</td>
                              <td style="color: #4a5355; font-size: 14px; text-align: right;">${createdAt.toLocaleDateString()}</td>
                            </tr>
                            <tr>
                              <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Service:</td>
                              <td style="color: #4a5355; font-size: 14px; text-align: right;">${serviceName}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    ${estimate ? `
                    <!-- Cost Estimate -->
                    <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 20px; font-weight: 600;">Preliminary Estimate</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid #a6b2b5; border-radius: 8px; overflow: hidden; margin-bottom: 25px;">
                      <tr>
                        <td style="background-color: #f5f7fa; padding: 15px;">
                          <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                              <td style="color: #4a5355; font-size: 14px;">Labor (${estimate.totalHours} hours):</td>
                              <td style="color: #4a5355; font-size: 14px; text-align: right;">$${estimate.laborCost.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td style="color: #4a5355; font-size: 14px;">Paint (${estimate.paintGallons} gallons):</td>
                              <td style="color: #4a5355; font-size: 14px; text-align: right;">$${estimate.paintCost.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td style="color: #4a5355; font-size: 14px;">Supplies:</td>
                              <td style="color: #4a5355; font-size: 14px; text-align: right;">$${estimate.suppliesCost.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td style="color: #4a5355; font-size: 14px;">Other Fees:</td>
                              <td style="color: #4a5355; font-size: 14px; text-align: right;">$${(estimate.prepFee + estimate.travelFee).toFixed(2)}</td>
                            </tr>
                            <tr style="border-top: 2px solid #a6b2b5;">
                              <td style="color: #1a1a1a; font-size: 18px; font-weight: 700; padding-top: 12px;">Total Estimate:</td>
                              <td style="color: #1a1a1a; font-size: 18px; font-weight: 700; text-align: right; padding-top: 12px;">$${estimate.totalCost.toFixed(2)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    <!-- Next Steps -->
                    <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 20px; font-weight: 600;">What Happens Next?</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 30px; vertical-align: top;">
                                <div style="background-color: #a6b2b5; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">1</div>
                              </td>
                              <td style="padding-left: 12px; color: #4a5355; font-size: 14px; line-height: 1.6;">
                                Our team will review your request within 24 hours
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 30px; vertical-align: top;">
                                <div style="background-color: #a6b2b5; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">2</div>
                              </td>
                              <td style="padding-left: 12px; color: #4a5355; font-size: 14px; line-height: 1.6;">
                                You'll receive a detailed quote via ${customerInfo.preferredContact}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 30px; vertical-align: top;">
                                <div style="background-color: #a6b2b5; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">3</div>
                              </td>
                              <td style="padding-left: 12px; color: #4a5355; font-size: 14px; line-height: 1.6;">
                                Once approved, we'll schedule your service at a convenient time
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 30px; vertical-align: top;">
                                <div style="background-color: #a6b2b5; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 600;">4</div>
                              </td>
                              <td style="padding-left: 12px; color: #4a5355; font-size: 14px; line-height: 1.6;">
                                Our professional team completes your project to perfection!
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Contact Section -->
                <tr>
                  <td style="background-color: #f5f7fa; padding: 30px; text-align: center;">
                    <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">Need to Make Changes?</h3>
                    <p style="margin: 0 0 20px; color: #4a5355; font-size: 14px;">Contact us anytime and we'll be happy to help!</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="tel:6473907181" style="display: inline-block; padding: 12px 24px; background-color: #a6b2b5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 5px;">📞 Call (647) 390-7181</a>
                          <a href="mailto:info@gtabudgetpainting.ca" style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 5px;">✉️ Email Us</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px; color: #e7e6e3; font-size: 14px;">GTA Budget Painting</p>
                    <p style="margin: 0; color: #a6b2b5; font-size: 12px;">Professional Painting Services in the Greater Toronto Area</p>
                    <p style="margin: 15px 0 0; color: #a6b2b5; font-size: 12px;">
                      <a href="mailto:info@gtabudgetpainting.ca" style="color: #a6b2b5; text-decoration: none;">info@gtabudgetpainting.ca</a> | 
                      <a href="tel:6473907181" style="color: #a6b2b5; text-decoration: none;">(647) 390-7181</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

// Cart order email templates
export const generateCartCustomerEmail = (data: any): string => {
  const {customerInfo, lineItems, totals, requestId, createdAt} = data;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - GTA Budget Painting</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 20px;">
          <tr>
            <td align="center">
              <!-- Invoice Container -->
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: #2b2b2b; padding: 24px 32px; text-align: center;">
                    <img src="https://gtabudgetpainting.ca/logo.png" alt="GTA Budget Painting" style="height: 80px; width: auto; margin-bottom: 0;" />
                  </td>
                </tr>

                <!-- Invoice Header -->
                <tr>
                  <td style="padding: 24px 32px 16px; background: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 50%; vertical-align: top;">
                          <h2 style="margin: 0 0 8px; color: #1a1a1a; font-size: 18px; font-weight: 600;">ORDER CONFIRMATION</h2>
                          <p style="margin: 0; color: #6b7577; font-size: 13px;">Order #${requestId}</p>
                          <p style="margin: 4px 0 0; color: #6b7577; font-size: 13px;">${createdAt.toLocaleDateString()}</p>
                        </td>
                        <td style="width: 50%; vertical-align: top; text-align: right;">
                          <p style="margin: 0 0 4px; color: #6b7577; font-size: 13px; font-weight: 600;">Bill To:</p>
                          <p style="margin: 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${customerInfo.firstName} ${customerInfo.lastName}</p>
                          <p style="margin: 2px 0 0; color: #4a5355; font-size: 13px;">${customerInfo.email}</p>
                          <p style="margin: 2px 0 0; color: #4a5355; font-size: 13px;">${customerInfo.phone}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Services Table -->
                <tr>
                  <td style="padding: 0 32px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb;">
                      <!-- Table Header -->
                      <tr style="background-color: #f8f9fa;">
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Service</td>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: right;">Amount</td>
                      </tr>
                      
                      <!-- Service Items -->
                      ${lineItems.map((item: any, index: number) => `
                        <tr>
                          <td style="padding: 16px; border-bottom: 1px solid #f3f4f6; color: #1a1a1a; font-size: 14px; font-weight: 500;">${item.serviceName}</td>
                          <td style="padding: 16px; border-bottom: 1px solid #f3f4f6; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">$${item.estimate ? item.estimate.totalCost.toFixed(2) : '0.00'}</td>
                        </tr>
                      `).join('')}
                    </table>
                  </td>
                </tr>

                <!-- Totals -->
                <tr>
                  <td style="padding: 0 32px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 70%;"></td>
                        <td style="width: 30%;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0; color: #6b7577; font-size: 14px;">Subtotal:</td>
                              <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 500; text-align: right;">$${totals.itemsSubtotal.toFixed(2)}</td>
                            </tr>
                            ${totals.travelFeeAdjustment > 0 ? `
                            <tr>
                              <td style="padding: 8px 0; color: #6b7577; font-size: 14px;">Travel Fee:</td>
                              <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 500; text-align: right;">$${totals.travelFeeAdjustment.toFixed(2)}</td>
                            </tr>
                            ` : ''}
                            ${totals.discount > 0 ? `
                            <tr>
                              <td style="padding: 8px 0; color: #10b981; font-size: 14px; font-weight: 600;">Discount (15%):</td>
                              <td style="padding: 8px 0; color: #10b981; font-size: 14px; font-weight: 600; text-align: right;">-$${totals.discount.toFixed(2)}</td>
                            </tr>
                            ` : ''}
                            <tr style="border-top: 2px solid #1a1a1a;">
                              <td style="padding: 12px 0 8px; color: #1a1a1a; font-size: 16px; font-weight: 700;">TOTAL:</td>
                              <td style="padding: 12px 0 8px; color: #1a1a1a; font-size: 16px; font-weight: 700; text-align: right;">$${totals.grandTotal.toFixed(2)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Status & Next Steps -->
                <tr>
                  <td style="padding: 24px 32px; background-color: #f8f9fa; border-top: 1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 60%; vertical-align: top;">
                          <h3 style="margin: 0 0 12px; color: #1a1a1a; font-size: 16px; font-weight: 600;">Order Status</h3>
                          <p style="margin: 0 0 8px; color: #4a5355; font-size: 14px; line-height: 1.5;">
                            <strong>✓ Order Received</strong> - We've received your order and our team will review it within 24 hours.
                          </p>
                          <p style="margin: 0; color: #4a5355; font-size: 14px; line-height: 1.5;">
                            You'll receive a detailed quote via ${customerInfo.preferredContact} once reviewed.
                          </p>
                        </td>
                        <td style="width: 40%; vertical-align: top; text-align: right;">
                          <h3 style="margin: 0 0 12px; color: #1a1a1a; font-size: 16px; font-weight: 600;">Contact Us</h3>
                          <p style="margin: 0 0 4px; color: #4a5355; font-size: 14px;">
                            <a href="tel:6473907181" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">(647) 390-7181</a>
                          </p>
                          <p style="margin: 0; color: #4a5355; font-size: 14px;">
                            <a href="mailto:info@gtabudgetpainting.ca" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">info@gtabudgetpainting.ca</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #2b2b2b; padding: 20px 32px; text-align: center;">
                    <p style="margin: 0; color: #a6b2b5; font-size: 12px; line-height: 1.4;">
                      GTA Budget Painting • Professional Painting Services in the Greater Toronto Area<br>
                      This is a preliminary estimate. Final pricing will be confirmed by our professionals.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export const generateCartAdminEmail = (data: any): string => {
  const {customerInfo, lineItems, totals, requestId, createdAt} = data;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Cart Order - GTA Budget Painting</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 20px;">
          <tr>
            <td align="center">
              <!-- Admin Alert Container -->
              <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Alert Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 20px 32px; text-align: center;">
                    <img src="https://gtabudgetpainting.ca/logo.png" alt="GTA Budget Painting" style="height: 70px; width: auto; margin-bottom: 8px; filter: brightness(0) invert(1);" />
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700;">New Cart Order</h1>
                    <p style="margin: 4px 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">${lineItems.length} service${lineItems.length > 1 ? 's' : ''} • $${totals.grandTotal.toFixed(2)}</p>
                  </td>
                </tr>

                <!-- Urgent Action Banner -->
                <tr>
                  <td style="background-color: #fef3c7; padding: 16px 32px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                      Please review and respond within 24 hours
                    </p>
                  </td>
                </tr>

                <!-- Order Summary -->
                <tr>
                  <td style="padding: 24px 32px; background: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 50%; vertical-align: top;">
                          <h2 style="margin: 0 0 8px; color: #1a1a1a; font-size: 18px; font-weight: 600;">ORDER SUMMARY</h2>
                          <p style="margin: 0; color: #6b7577; font-size: 13px;">Order #${requestId}</p>
                          <p style="margin: 4px 0 0; color: #6b7577; font-size: 13px;">${createdAt.toLocaleString()}</p>
                        </td>
                        <td style="width: 50%; vertical-align: top; text-align: right;">
                          <p style="margin: 0 0 4px; color: #6b7577; font-size: 13px; font-weight: 600;">Customer:</p>
                          <p style="margin: 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${customerInfo.firstName} ${customerInfo.lastName}</p>
                          <p style="margin: 2px 0 0; color: #4a5355; font-size: 13px;">${customerInfo.email}</p>
                          <p style="margin: 2px 0 0; color: #4a5355; font-size: 13px;">${customerInfo.phone}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Services Table -->
                <tr>
                  <td style="padding: 0 32px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb;">
                      <!-- Table Header -->
                      <tr style="background-color: #f8f9fa;">
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Service</td>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: right;">Amount</td>
                      </tr>
                      
                      <!-- Service Items -->
                      ${lineItems.map((item: any, index: number) => `
                        <tr>
                          <td style="padding: 16px; border-bottom: 1px solid #f3f4f6; color: #1a1a1a; font-size: 14px; font-weight: 500;">${item.serviceName}</td>
                          <td style="padding: 16px; border-bottom: 1px solid #f3f4f6; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">$${item.estimate ? item.estimate.totalCost.toFixed(2) : '0.00'}</td>
                        </tr>
                      `).join('')}
                    </table>
                  </td>
                </tr>

                <!-- Totals -->
                <tr>
                  <td style="padding: 0 32px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 70%;"></td>
                        <td style="width: 30%;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0; color: #6b7577; font-size: 14px;">Subtotal:</td>
                              <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 500; text-align: right;">$${totals.itemsSubtotal.toFixed(2)}</td>
                            </tr>
                            ${totals.travelFeeAdjustment > 0 ? `
                            <tr>
                              <td style="padding: 8px 0; color: #6b7577; font-size: 14px;">Travel Fee:</td>
                              <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 500; text-align: right;">$${totals.travelFeeAdjustment.toFixed(2)}</td>
                            </tr>
                            ` : ''}
                            ${totals.discount > 0 ? `
                            <tr>
                              <td style="padding: 8px 0; color: #10b981; font-size: 14px; font-weight: 600;">Discount (15%):</td>
                              <td style="padding: 8px 0; color: #10b981; font-size: 14px; font-weight: 600; text-align: right;">-$${totals.discount.toFixed(2)}</td>
                            </tr>
                            ` : ''}
                            <tr style="border-top: 2px solid #dc2626;">
                              <td style="padding: 12px 0 8px; color: #dc2626; font-size: 16px; font-weight: 700;">TOTAL:</td>
                              <td style="padding: 12px 0 8px; color: #dc2626; font-size: 16px; font-weight: 700; text-align: right;">$${totals.grandTotal.toFixed(2)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Customer Details -->
                <tr>
                  <td style="padding: 24px 32px; background-color: #f8f9fa; border-top: 1px solid #e5e7eb;">
                    <h3 style="margin: 0 0 16px; color: #1a1a1a; font-size: 16px; font-weight: 600;">Customer Details</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 50%; vertical-align: top; padding-right: 16px;">
                          <p style="margin: 0 0 4px; color: #6b7577; font-size: 13px; font-weight: 600;">Contact Information</p>
                          <p style="margin: 0 0 2px; color: #1a1a1a; font-size: 14px; font-weight: 600;">${customerInfo.firstName} ${customerInfo.lastName}</p>
                          <p style="margin: 0 0 2px; color: #4a5355; font-size: 13px;">
                            <a href="mailto:${customerInfo.email}" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">${customerInfo.email}</a>
                          </p>
                          <p style="margin: 0 0 2px; color: #4a5355; font-size: 13px;">
                            <a href="tel:${customerInfo.phone}" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">${customerInfo.phone}</a>
                          </p>
                          <p style="margin: 4px 0 0; color: #4a5355; font-size: 13px;">${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}</p>
                        </td>
                        <td style="width: 50%; vertical-align: top; padding-left: 16px;">
                          <p style="margin: 0 0 4px; color: #6b7577; font-size: 13px; font-weight: 600;">Preferences</p>
                          <p style="margin: 0 0 2px; color: #4a5355; font-size: 13px;">Preferred Contact: ${customerInfo.preferredContact}</p>
                          ${customerInfo.bestTimeToCall ? `<p style="margin: 0 0 2px; color: #4a5355; font-size: 13px;">Best Time: ${customerInfo.bestTimeToCall}</p>` : ''}
                          ${customerInfo.howDidYouHear ? `<p style="margin: 0 0 2px; color: #4a5355; font-size: 13px;">Source: ${customerInfo.howDidYouHear}</p>` : ''}
                        </td>
                      </tr>
                    </table>
                    
                    ${customerInfo.additionalNotes ? `
                    <div style="margin-top: 16px; padding: 12px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                      <p style="margin: 0 0 4px; color: #92400e; font-size: 13px; font-weight: 600;">Additional Notes:</p>
                      <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.4;">${customerInfo.additionalNotes}</p>
                    </div>
                    ` : ''}
                  </td>
                </tr>

                <!-- Action Buttons -->
                <tr>
                  <td style="padding: 24px 32px; background: #ffffff; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="https://gtabudgetpainting.ca/admin" style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 8px;">View in Admin Page</a>
                          <a href="tel:${customerInfo.phone}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 8px;">Call Customer</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #2b2b2b; padding: 16px 32px; text-align: center;">
                    <p style="margin: 0; color: #a6b2b5; font-size: 12px; line-height: 1.4;">
                      GTA Budget Painting Admin System • Automated notification
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

// Invoice email template
export const generateInvoiceEmail = (invoiceData: any): string => {
  const { invoiceNumber, clientInfo, total, dueDate, items, subtotal, tax } = invoiceData;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceNumber}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #EDEAEO;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #EDEAEO; padding: 20px;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table width="800" cellpadding="0" cellspacing="0" style="background-color: #EDEAEO; border-radius: 8px; overflow: hidden;">
                
                <!-- Header with Company Info -->
                <tr>
                  <td style="padding: 30px; background-color: #EDEAEO;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 60%; vertical-align: top;">
                          <img src="https://gtabudgetpainting.ca/logo.png" alt="GTA Budget Painting" style="height: 70px; width: auto; margin-bottom: 15px;" />
                          <div>
                            <p style="margin: 0 0 4px; color: #1E1E1E; font-size: 14px; font-weight: 700;">GTA Budget Painting</p>
                            <p style="margin: 0 0 4px; color: #1E1E1E; font-size: 14px;">48 Fancamp Drive</p>
                            <p style="margin: 0 0 4px; color: #1E1E1E; font-size: 14px;">Phone: (647) 334-1234</p>
                            <p style="margin: 0; color: #1E1E1E; font-size: 14px;">Email: peter@gtahomepainting.ca</p>
                          </div>
                        </td>
                        <td style="width: 40%; vertical-align: top; text-align: right;">
                          <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 2px solid #1E1E1E;">
                            <h2 style="margin: 0 0 12px; color: #1E1E1E; font-size: 18px; font-weight: 700;">INVOICE</h2>
                            <p style="margin: 0 0 6px; color: #1E1E1E; font-size: 13px;"><strong>Invoice #:</strong> ${invoiceNumber}</p>
                            <p style="margin: 0 0 6px; color: #1E1E1E; font-size: 13px;"><strong>Date Issued:</strong> ${new Date().toLocaleDateString()}</p>
                            <p style="margin: 0 0 6px; color: #1E1E1E; font-size: 13px;"><strong>Due On:</strong> ${dueDate}</p>
                            <p style="margin: 0; color: #1E1E1E; font-size: 15px; font-weight: 700;"><strong>Balance:</strong> $${total.toFixed(2)}</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Bill To Section -->
                <tr>
                  <td style="padding: 0 30px 20px;">
                    <h3 style="margin: 0 0 10px; color: #1E1E1E; font-size: 16px; font-weight: 700;">Bill To:</h3>
                    <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 2px solid #1E1E1E;">
                      <p style="margin: 0 0 6px; color: #1E1E1E; font-size: 14px; font-weight: 700;">${clientInfo.name}</p>
                      <p style="margin: 0 0 6px; color: #1E1E1E; font-size: 13px;">${clientInfo.address}</p>
                      <p style="margin: 0 0 6px; color: #1E1E1E; font-size: 13px;">Phone: ${clientInfo.phone}</p>
                      <p style="margin: 0; color: #1E1E1E; font-size: 13px;">Email: ${clientInfo.email}</p>
                    </div>
                  </td>
                </tr>

                <!-- Services Table -->
                <tr>
                  <td style="padding: 0 30px 20px;">
                    <h3 style="margin: 0 0 10px; color: #1E1E1E; font-size: 16px; font-weight: 700;">Services Purchased</h3>
                    <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #ffffff; border: 2px solid #1E1E1E; border-radius: 6px;">
                      <tr style="background-color: #f5f5f5;">
                        <th style="text-align: left; font-size: 13px; font-weight: 700; padding: 10px; color: #1E1E1E;">Service</th>
                        <th style="text-align: left; font-size: 13px; font-weight: 700; padding: 10px; color: #1E1E1E;">Description</th>
                        <th style="text-align: center; font-size: 13px; font-weight: 700; padding: 10px; color: #1E1E1E;">Qty</th>
                        <th style="text-align: right; font-size: 13px; font-weight: 700; padding: 10px; color: #1E1E1E;">Amount</th>
                      </tr>
                      ${items.map((item: any) => `
                        <tr style="border-top: 1px solid #1E1E1E;">
                          <td style="padding: 10px; font-size: 13px; font-weight: 600; color: #1E1E1E;">${item.serviceName}</td>
                          <td style="padding: 10px; font-size: 13px; color: #1E1E1E;">${item.description}</td>
                          <td style="padding: 10px; text-align: center; font-size: 13px; color: #1E1E1E;">${item.quantity}</td>
                          <td style="padding: 10px; text-align: right; font-size: 13px; font-weight: 600; color: #1E1E1E;">$${item.total.toFixed(2)}</td>
                        </tr>
                      `).join('')}
                      <tr style="border-top: 2px solid #1E1E1E; background-color: #f5f5f5;">
                        <td colspan="3" style="padding: 10px; font-size: 13px; font-weight: 600; color: #1E1E1E; text-align: right;">Subtotal:</td>
                        <td style="padding: 10px; text-align: right; font-size: 13px; font-weight: 600; color: #1E1E1E;">$${subtotal.toFixed(2)}</td>
                      </tr>
                      <tr style="background-color: #f5f5f5;">
                        <td colspan="3" style="padding: 10px; font-size: 13px; font-weight: 600; color: #1E1E1E; text-align: right;">HST (13%):</td>
                        <td style="padding: 10px; text-align: right; font-size: 13px; font-weight: 600; color: #1E1E1E;">$${tax.toFixed(2)}</td>
                      </tr>
                      <tr style="background-color: #f5f5f5; color: #1E1E1E;">
                        <td colspan="3" style="padding: 10px; font-size: 14px; font-weight: 700; text-align: right;">TOTAL:</td>
                        <td style="padding: 10px; text-align: right; font-size: 14px; font-weight: 700;">$${total.toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Terms & Conditions -->
                <tr>
                  <td style="padding: 0 30px 20px;">
                    <h3 style="margin: 0 0 10px; color: #1E1E1E; font-size: 16px; font-weight: 700;">Terms & Conditions</h3>
                    <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 2px solid #1E1E1E; font-size: 11px; line-height: 1.5; color: #1E1E1E;">
                      <p style="margin: 0 0 10px; font-weight: 600;">By paying the due balance on invoices provided, the Client hereby acknowledges that all requested service items for this date and/or any other dates listed above in the description section of the table, have been performed and have been tested showing successful satisfactory install/repair, unless otherwise stated on the invoice, in which labor service charges still apply if any repairs have been made. By accepting this invoice, the Client agrees to pay in full the amount listed in the Total section of the invoice.</p>
                      
                      <p style="margin: 0 0 6px; font-weight: 600;">Payment Terms:</p>
                      <p style="margin: 0 0 4px;">• Payment is due within 30 days of invoice date</p>
                      <p style="margin: 0 0 4px;">• Accepted payment methods: Cash, Check, E-Transfer, Credit Card</p>
                      <p style="margin: 0 0 6px;">• Late payment fee: 1.5% per month on overdue accounts</p>
                      
                      <p style="margin: 0 0 6px; font-weight: 600;">Warranty:</p>
                      <p style="margin: 0 0 4px;">• All work guaranteed for 2 years from completion date</p>
                      <p style="margin: 0 0 4px;">• Materials and supplies included in quoted price</p>
                      <p style="margin: 0;">• GTA Budget Painting is fully insured and bonded</p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #EDEAEO; text-align: center;">
                    <h3 style="margin: 0 0 10px; color: #1E1E1E; font-size: 16px; font-weight: 700;">Contact Information</h3>
                    <p style="margin: 0 0 8px; color: #1E1E1E; font-size: 14px; font-weight: 600;">Thank you for choosing GTA Budget Painting!</p>
                    <p style="margin: 0 0 12px; color: #1E1E1E; font-size: 13px; font-style: italic;">We paint your home like it's our own — with quality work that fits your budget</p>
                    <p style="margin: 0 0 6px; color: #1E1E1E; font-size: 13px;">Phone: (647) 334-1234</p>
                    <p style="margin: 0; color: #1E1E1E; font-size: 13px;">Email: peter@gtahomepainting.ca</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export const generateAdminEmail = (data: ServiceRequestData): string => {
  const {customerInfo, serviceName, estimate, formData, requestId, createdAt} = data;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Service Request</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 20px;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
                    <img src="https://gtabudgetpainting.ca/logo.png" alt="GTA Budget Painting" style="height: 80px; width: auto; margin-bottom: 12px; filter: brightness(0) invert(1);" />
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">New Service Request</h1>
                    <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; opacity: 0.95;">${serviceName}</p>
                  </td>
                </tr>

                <!-- Alert Banner -->
                <tr>
                  <td style="background-color: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                      Action Required: Review and respond within 24 hours
                    </p>
                  </td>
                </tr>

                <!-- Request Info -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 22px; font-weight: 700;">Request Details</h2>
                    
                    <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f5f7fa; border-radius: 8px; margin-bottom: 25px;">
                      <tr>
                        <td style="width: 40%; color: #6b7577; font-size: 14px; font-weight: 600;">Request ID:</td>
                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 700;">${requestId}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Received:</td>
                        <td style="color: #4a5355; font-size: 14px;">${createdAt.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Service:</td>
                        <td style="color: #4a5355; font-size: 14px; font-weight: 700;">${serviceName}</td>
                      </tr>
                    </table>

                    <!-- Customer Information -->
                    <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 700;">Customer Information</h3>
                    <table width="100%" cellpadding="12" cellspacing="0" style="border: 2px solid #a6b2b5; border-radius: 8px; margin-bottom: 25px;">
                      <tr>
                        <td style="width: 40%; color: #6b7577; font-size: 14px; font-weight: 600;">Name:</td>
                        <td style="color: #4a5355; font-size: 14px;">${customerInfo.firstName} ${customerInfo.lastName}</td>
                      </tr>
                      <tr style="background-color: #f5f7fa;">
                        <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Email:</td>
                        <td style="color: #4a5355; font-size: 14px;"><a href="mailto:${customerInfo.email}" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">${customerInfo.email}</a></td>
                      </tr>
                      <tr>
                        <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Phone:</td>
                        <td style="color: #4a5355; font-size: 14px;"><a href="tel:${customerInfo.phone}" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">${customerInfo.phone}</a></td>
                      </tr>
                      <tr style="background-color: #f5f7fa;">
                        <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Address:</td>
                        <td style="color: #4a5355; font-size: 14px;">${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Preferred Contact:</td>
                        <td style="color: #4a5355; font-size: 14px;">${customerInfo.preferredContact}</td>
                      </tr>
                      ${customerInfo.bestTimeToCall ? `
                      <tr style="background-color: #f5f7fa;">
                        <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Best Time to Call:</td>
                        <td style="color: #4a5355; font-size: 14px;">${customerInfo.bestTimeToCall}</td>
                      </tr>
                      ` : ''}
                      ${customerInfo.howDidYouHear ? `
                      <tr>
                        <td style="color: #6b7577; font-size: 14px; font-weight: 600;">Referral Source:</td>
                        <td style="color: #4a5355; font-size: 14px;">${customerInfo.howDidYouHear}</td>
                      </tr>
                      ` : ''}
                    </table>

                    ${estimate ? `
                    <!-- Cost Estimate -->
                    <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 700;">Preliminary Estimate</h3>
                    <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; color: white; margin-bottom: 25px;">
                      <tr>
                        <td style="font-size: 14px;">Labor (${estimate.totalHours} hours):</td>
                        <td style="text-align: right; font-size: 14px;">$${estimate.laborCost.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px;">Paint (${estimate.paintGallons} gallons):</td>
                        <td style="text-align: right; font-size: 14px;">$${estimate.paintCost.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px;">Supplies:</td>
                        <td style="text-align: right; font-size: 14px;">$${estimate.suppliesCost.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px;">Other Fees:</td>
                        <td style="text-align: right; font-size: 14px;">$${(estimate.prepFee + estimate.travelFee).toFixed(2)}</td>
                      </tr>
                      <tr style="border-top: 2px solid #a6b2b5;">
                        <td style="font-size: 18px; font-weight: 700; padding-top: 12px;">Total Estimate:</td>
                        <td style="text-align: right; font-size: 18px; font-weight: 700; padding-top: 12px;">$${estimate.totalCost.toFixed(2)}</td>
                      </tr>
                    </table>
                    ` : ''}

                    <!-- Job Details -->
                    <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 700;">Job Details</h3>
                    <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f5f7fa; border-radius: 8px; margin-bottom: 25px;">
                      ${Object.entries(formData).map(([key, value]) => `
                        <tr>
                          <td style="width: 40%; color: #6b7577; font-size: 13px; font-weight: 600; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1').trim()}:</td>
                          <td style="color: #4a5355; font-size: 13px;">${typeof value === 'object' ? JSON.stringify(value) : value}</td>
                        </tr>
                      `).join('')}
                    </table>

                    ${customerInfo.additionalNotes ? `
                    <!-- Additional Notes -->
                    <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 700;">Additional Notes</h3>
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
                      <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">${customerInfo.additionalNotes}</p>
                    </div>
                    ` : ''}

                    <!-- Action Buttons -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                      <tr>
                        <td align="center">
                          <a href="https://gtabudgetpainting.ca/admin" style="display: inline-block; padding: 14px 32px; background-color: #1a1a1a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 0 8px;">View in Admin Page</a>
                          <a href="tel:${customerInfo.phone}" style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 0 8px;">Call Customer</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                    <p style="margin: 0; color: #a6b2b5; font-size: 12px;">
                      This is an automated notification from GTA Budget Painting booking system
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

