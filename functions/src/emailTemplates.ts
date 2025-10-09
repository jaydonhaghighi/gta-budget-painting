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
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">GTA Budget Painting</h1>
                    <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Professional Painting Services in the GTA</p>
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
                          <a href="mailto:info@gtabudgetpainting.com" style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 5px;">✉️ Email Us</a>
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
                      <a href="mailto:info@gtabudgetpainting.com" style="color: #a6b2b5; text-decoration: none;">info@gtabudgetpainting.com</a> | 
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
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">🔔 New Service Request</h1>
                    <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; opacity: 0.95;">${serviceName}</p>
                  </td>
                </tr>

                <!-- Alert Banner -->
                <tr>
                  <td style="background-color: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                      ⚡ Action Required: Review and respond within 24 hours
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
                          <a href="https://console.firebase.google.com/project/gta-budget-painting/firestore" style="display: inline-block; padding: 14px 32px; background-color: #1a1a1a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 0 8px;">View in Firestore</a>
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

