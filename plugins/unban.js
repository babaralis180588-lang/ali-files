const { cmd } = require("../command");

// ====== SAFE UNBAN APPEAL SYSTEM ======
// Ye system user ke number ko ban hone se bachata hai
// - Rate limiting (ek user 1 minute mein sirf 1 appeal)
// - Cooldown (24 ghante mein max 3 appeals)
// - Placeholder auto-fill (naam, number, date)
// - Safe delays (WhatsApp spam detection se bachne ke liye)

const appeals = {
  0: `Dear WhatsApp Support,

My account was recently banned. I believe this was a mistake as I use WhatsApp for personal communication only.

I've reviewed the Terms of Service and will ensure full compliance. Please restore my access.

Thank you,
[Your Name]
[Your Phone Number]`,

  1: `To WhatsApp Support Team,

I may have accidentally violated terms while messaging. This was unintentional.

I understand the rules now and will be more careful. Please reconsider the ban.

Sincerely,
[Your Name]
[Your Phone Number]`,

  2: `Dear Support,

My account may have been compromised. I noticed unusual activity before the ban.

I've secured my device and passwords. Please investigate and restore my legitimate access.

Regards,
[Your Name]
[Your Phone Number]`,

  3: `Dear WhatsApp Business Support,

My business account has been banned, affecting customer communications.

I use WhatsApp for legitimate business purposes and follow all guidelines. Please review and restore my account.

Business: [Your Business Name]
Phone: [Your Phone Number]

Thank you,
[Your Name]`,

  4: `To WhatsApp Support,

I believe my account was banned due to false reports from others.

I've always used WhatsApp respectfully. Please review my account activity and reconsider the ban.

Phone: [Your Phone Number]

Respectfully,
[Your Name]`,

  5: `Dear Support Team,

This is my first violation. I apologize and have learned from this mistake.

I promise to strictly follow all terms going forward. Please give me a second chance.

Phone: [Your Phone Number]

Sincerely,
[Your Name]`,

  6: `To WhatsApp Support,

As a group administrator, my account was banned. This affects multiple groups I manage.

I ensure all my groups follow community guidelines. Please restore my admin access.

Phone: [Your Phone Number]

Thank you,
[Your Name]`,

  7: `Dear Support,

I believe an automated system mistakenly flagged my account. My activity is normal personal use.

I use WhatsApp only for connecting with family and friends. Please manually review my case.

Phone: [Your Phone Number]

Regards,
[Your Name]`,

  8: `Urgent: To WhatsApp Support,

My account is banned during a family emergency. I need WhatsApp to contact relatives.

This is critically important for family communications. Please expedite restoration.

Phone: [Your Phone Number]
Emergency Contact: [Alternative Contact]

Thank you,
[Your Name]`,

  9: `FORMAL APPEAL
To: WhatsApp Support Department

Account Number: [Your Phone Number]
Date of Ban: [Date]

I formally appeal the decision to ban my WhatsApp account. I believe this action was taken in error.

I request:
1. Detailed reason for the ban
2. Review of my account activity
3. Restoration of access if no violation exists

I am prepared to provide any additional information required.

Sincerely,
[Your Full Name]
[Email Address]
[Phone Number]`,

  10: `My WhatsApp was banned. Please restore. Phone: [Your Phone Number]`,

  11: `To the WhatsApp Support Team,

I am writing to formally request the reinstatement of my account ([Your Phone Number]). 

Upon reviewing my recent activity, I believe there may have been a misunderstanding regarding terms compliance.

I assure you of my commitment to following all platform guidelines moving forward.

Best regards,
[Your Name]
[Your Phone Number]`,

  12: `URGENT: Account Restoration Request

Phone: [Your Phone Number]
Date: [Current Date]

My WhatsApp account is essential for daily communications. Please expedite the review process.

Thank you.`,

  13: `Hello WhatsApp Team,

Could you please review my banned account? I believe it was an error.

Phone number: [Your Phone Number]

Kind regards,
[Your Name]`,

  14: `Technical Support Request

Account: [Your Phone Number]
Issue: Unexpected Ban
Date: [Date of Ban]

Technical Details:
- Device: [Your Device]
- WhatsApp Version: [Version]
- Last Activity: [Brief Description]

I suspect a technical glitch or false positive in the security system. My usage patterns have been normal.

Please conduct a technical review and restore access.

Sincerely,
[Your Name]
[Email: Your Email]`,

  15: `Please unban my WhatsApp: [Your Phone Number]. I follow all rules.`,

  16: `FORMAL APPEAL FOR ACCOUNT REINSTATEMENT

To: WhatsApp Administration Department
From: [Your Full Name]
Account: [Your Phone Number]
Date: [Current Date]

1. INTRODUCTION
I am writing to formally appeal the suspension of my WhatsApp account. I have been a user since [Year] and value this platform for personal communication.

2. REASON FOR APPEAL
After careful consideration, I believe the ban was implemented erroneously. My account activity consists solely of legitimate personal communications with family and friends.

3. COMPLIANCE ASSURANCE
I have thoroughly reviewed WhatsApp's Terms of Service and Community Guidelines. I fully understand my responsibilities as a user and commit to strict adherence.

4. REQUEST
I respectfully request:
- A detailed explanation of the violation (if applicable)
- Manual review of my account activity
- Restoration of full account privileges

5. CONTACT INFORMATION
Primary Phone: [Your Phone Number]
Backup Contact: [Alternative Contact]
Email: [Your Email]

I am available to provide any additional information or clarification required for this appeal.

Respectfully submitted,
[Your Signature/Name]`,

  17: `Account banned. Please check and restore. #: [Your Phone Number]`,

  18: `Dear Support,

I apologize if I violated any rules. It was not intentional.

Please restore my account: [Your Phone Number]

Thank you.`,

  19: `Restore my WhatsApp account: [Your Phone Number]

I need it for daily communication.`,

  20: `Error Report: Account Banned in Error

User: [Your Phone Number]
Issue: Account wrongfully banned

Please investigate this error and correct it promptly.`,

  21: `To Customer Service,

Ticket: Account Ban Appeal
User ID: [Your Phone Number]
Date: [Date]

Issue Description: My account has been banned. I believe this is an error as I use WhatsApp normally.

Request: Please review and restore my account access.

Contact: [Your Phone Number]

Thank you for your assistance.`,

  22: `Please review and restore my banned WhatsApp account: [Your Phone Number].`,

  23: `Security Appeal

Account: [Your Phone Number]

My account ban raises security concerns. I suspect unauthorized access or system error.

Please verify account ownership and restore secure access.

Contact: [Your Phone Number]`,

  24: `Can you please unban my WhatsApp? Number: [Your Phone Number]`,

  25: `=== WHATSAPP UNBAN REQUEST ===

• USER: [Your Name]
• NUMBER: [Your Phone Number]
• DATE: [Today's Date]
• STATUS: Banned
• REQUEST: Account Restoration
• REASON: Potential Error

=== END REQUEST ===`,

  26: `Account Restoration Request:

• Account Number: [Your Phone Number]
• Issue: Unexpected Ban
• Duration: [Number] years user
• Request: Manual Review
• Assurance: Will follow all guidelines
• Contact: [Your Phone Number]`,

  27: `Appeal Steps:
1. Account: [Your Phone Number]
2. Problem: Banned unexpectedly
3. Action: Please investigate
4. Result: Restore if clean record
5. Contact: [Your Phone Number]`,

  28: `Hey WhatsApp Team,

Hope you're doing well. My account got banned somehow. Could you check it out?

My number: [Your Phone Number]

Thanks a lot!`,

  29: `FORMAL COMPLAINT: Account Ban

Reference: [Your Phone Number]
Date: [Date]

I wish to register a formal complaint regarding the wrongful ban of my WhatsApp account.

I demand a proper investigation and immediate restoration if found to be in error.

Yours faithfully,
[Your Name]`,

  30: `WhatsApp banned. Need fix. #: [Your Phone Number]`,

  31: `[ACCOUNT APPEAL FORM]

Name: [Your Name]
Number: [Your Phone Number]
Date: [Date]
Issue: Account Ban
Reason: Unknown/Suspected Error
Request: Review & Restoration
Status: Urgent

[END FORM]`,

  32: `Hi there,

My WhatsApp stopped working suddenly. Can you help fix it?

My number: [Your Phone Number]

Appreciate your help!`,

  33: `OFFICIAL REQUEST

TO: WhatsApp Administration
FROM: [Your Name]
SUBJECT: Account Restoration
DATE: [Date]

REQUEST: Please restore access to account [Your Phone Number]

JUSTIFICATION: Account was banned without clear reason

ACTION REQUIRED: Review and reinstate

CONTACT: [Your Phone Number]`,

  34: `Unban request: [Your Phone Number]`,

  35: `Problem: WhatsApp account banned
Account: [Your Phone Number]
Cause: Unknown/Possible error
Solution: Please review and correct
Outcome: Restore account access`,

  36: `Question: Why is my WhatsApp banned?
Account: [Your Phone Number]
Request: Please check and fix
Follow-up: Restore if no violation found`,

  37: `NOTIFICATION: Account Issue

User: [Your Phone Number]
Status: Banned
Action Required: Manual Review
Priority: High
Contact: [Your Phone Number]`,

  38: `Hello,

I noticed my WhatsApp isn't working anymore. It says my account is banned.

Could you look into this? My number is [Your Phone Number].

Thank you!`,

  39: `1. Account: [Your Phone Number]
2. Issue: Banned unexpectedly
3. Duration: [Time since ban]
4. Request: Review account
5. Outcome: Restore access
6. Contact: [Your Phone Number]`,

  40: `Please fix my WhatsApp ban. Number: [Your Phone Number]`,

  41: `Subject: WhatsApp Account Ban Appeal

Dear Support,

I'm writing regarding my banned WhatsApp account ([Your Phone Number]).

I believe this action was taken in error and request a manual review.

Please let me know the outcome.

Best,
[Your Name]
[Your Phone Number]`,

  42: `WhatsApp account banned: [Your Phone Number]
Please review and restore access.`,

  43: `• Issue: Account ban
• Number: [Your Phone Number]
• Reason: Unknown
• Request: Investigation
• Action: Restore if clean`,

  44: `Help needed with WhatsApp account.

My account ([Your Phone Number]) is banned.

Can you assist in restoring it?

Thank you.`,

  45: `Case: WhatsApp Ban Appeal
Ref: [Your Phone Number]
Date: [Date]

Description: Account wrongfully banned
Action: Please review case
Resolution: Restore account
Contact: [Your Phone Number]`,

  46: `Clean account record.
No violations committed.
Please unban: [Your Phone Number]`,

  47: `System Error Detected

Account: [Your Phone Number]
Error Type: False ban flag
Impact: Cannot access WhatsApp
Fix: Manual override needed
Status: Urgent`,

  48: `Final appeal attempt.

Account: [Your Phone Number]
Situation: Wrongfully banned
Final request: Please review properly

This is my last appeal attempt.`,

  49: `THE ULTIMATE APPEAL

🔹 ACCOUNT: [Your Phone Number]
🔹 STATUS: BANNED
🔹 TRUTH: NO VIOLATIONS
🔹 REQUEST: RESTORE NOW
🔹 CONTACT: [Your Phone Number]

This is the ultimate appeal for justice. Please do the right thing.`,

  50: `Restoration request for account: [Your Phone Number]`,

  51: `To Whom It May Concern,

I am inquiring about the status of my WhatsApp account ([Your Phone Number]).

The account appears to be banned. Please provide details and restore if appropriate.

Respectfully,
[Your Name]`,

  52: `Need WhatsApp fix. Number: [Your Phone Number] ASAP`,

  53: `FORMAL REQUEST FOR ACCOUNT RESTORATION

Requestor: [Your Name]
Account: [Your Phone Number]
Date: [Current Date]

I formally request the restoration of my WhatsApp account which was banned without proper cause.

Please process this request promptly.`,

  54: `Fix my WhatsApp please: [Your Phone Number]`,

  55: `Account Issue Report

User: [Your Phone Number]
Problem: Account Ban
Report Date: [Date]
Issue Description: Account was banned unexpectedly without warning or explanation
Suspected Cause: System error or false positive
Impact: Cannot communicate with contacts
Request: Immediate investigation and restoration
Contact: [Your Phone Number]
Status: High Priority`,

  56: `Restore account [Your Phone Number] immediately.`,

  57: `TICKET: WhatsApp Account Ban

Ticket ID: [Your Phone Number]
Issue: Account Suspension
Priority: High
Description: User cannot access WhatsApp account due to ban
Requested Action: Review and restore account
Contact: [Your Phone Number]
Additional Notes: Account used for personal communication only`,

  58: `Clear account. No violations. Please unban: [Your Phone Number]`,

  59: `SERVICE REQUEST FORM

Service: Account Restoration
User: [Your Name]
Account: [Your Phone Number]
Issue: Account banned
Request Date: [Date]
Expected Resolution: Account access restored
Contact Method: [Your Phone Number]
Notes: Urgent service required`,

  60: `Technical issue: Account ban. Fix: [Your Phone Number]`,

  61: `COMPREHENSIVE ACCOUNT APPEAL

ACCOUNT DETAILS
• Phone Number: [Your Phone Number]
• Account Creation: [Year]
• Usage Type: Personal
• Last Access: [Date]

ISSUE SUMMARY
• Status: Banned
• Date of Ban: [Date]
• Notification: No prior warning
• Suspected Reason: Unknown/Error

APPEAL BASIS
1. Clean usage history
2. No terms violations
3. Possible system error
4. Essential communication tool

REQUESTED ACTION
1. Manual account review
2. Removal of ban if unjustified
3. Account restoration
4. Reason explanation if applicable

CONTACT INFORMATION
• Primary: [Your Phone Number]
• Backup: [Alternative Contact]

DECLARATION
I confirm all information is accurate and request fair consideration of this appeal.

[Your Name]
[Date]`,

  62: `Instant unban needed: [Your Phone Number]`,

  63: `HELP REQUEST - ACCOUNT ACCESS

[PROBLEM]
• What: WhatsApp account banned
• Who: [Your Phone Number]
• When: [Date/Time]
• Where: All devices

[IMPACT]
• Cannot message contacts
• Miss important communications
• Daily disruption

[REQUEST]
• Review account immediately
• Restore if no violations
• Provide explanation

[CONTACT]
• [Your Phone Number]
• [Your Email]`,

  64: `My WhatsApp account with number [Your Phone Number] is banned. Please fix this issue. Thank you.`,

  65: `OFFICIAL SUPPORT TICKET

Ticket Number: BAN-[Your Phone Number]
Date: [Current Date]
Category: Account Issue
Subcategory: Wrongful Ban
Priority: Urgent

Description:
User account ([Your Phone Number]) has been banned without apparent reason. User reports normal personal usage only.

Requested Solution:
1. Investigate account activity
2. Verify compliance with terms
3. Restore account if clean
4. Provide resolution report

Contact: [Your Phone Number]
Status: Open/Pending`,

  66: `Restore [Your Phone Number] to WhatsApp.`,

  67: `USER EXPERIENCE ISSUE REPORT

User: [Your Phone Number]
Platform: WhatsApp
Issue Type: Account Access
Severity: Critical

Experience Description:
As a long-time WhatsApp user, I suddenly lost access to my account due to an unexpected ban. This severely impacts my daily communication.

Root Cause Analysis:
- No violation of terms
- Possible system error
- No warning received

Resolution Request:
Immediate account restoration with explanation.

Impact Assessment:
High - Affects personal and professional communications.

Contact: [Your Phone Number]`,

  68: `FAST TRACK REQUEST: Unban [Your Phone Number]`,

  69: `SYSTEM REVIEW REQUEST

Account: [Your Phone Number]
Issue: Automated ban system may have erred
Request Type: Manual review override
Justification: Account used normally, no violations observed
Urgency: High
Expected Outcome: Account restoration
Technical Notes: Check for false positives in security algorithms

Submitted by: [Your Name]
Contact: [Your Phone Number]
Date: [Current Date]`,

  70: `Help! WhatsApp banned. Number: [Your Phone Number]`,

  71: `COMPLIANCE ASSURANCE APPEAL

To WhatsApp Administration,

Regarding account: [Your Phone Number]

Compliance Status:
✓ Terms of Service: Reviewed and understood
✓ Community Guidelines: Fully acknowledged
✓ Usage Pattern: Personal communication only
✓ Security Practices: Maintained appropriately

Assurance Statement:
I hereby assure you of my commitment to maintaining full compliance with all WhatsApp policies and guidelines.

Appeal Basis:
The current ban appears to be an error as my account activity aligns with all platform requirements.

Restoration Request:
Please restore account access and consider this my formal compliance assurance.

Sincerely,
[Your Name]
[Your Phone Number]`,

  72: `EMERGENCY: Need WhatsApp access now! [Your Phone Number]`,

  73: `ACCOUNT VERIFICATION REQUEST

Subject: Ban Reversal Request
Account Holder: [Your Name]
Account Number: [Your Phone Number]
Verification Type: Manual review requested

Verification Points:
1. Identity Verification: Willing to provide
2. Usage Pattern: Normal personal use
3. Compliance Check: No violations found
4. Security Status: Account secure

Request:
Please verify account legitimacy and remove ban if verified.

Verification Contact:
[Your Phone Number]
[Optional: Email Address]

Verification Deadline: [Date]
Priority: High`,

  74: `Solution: Unban [Your Phone Number] from WhatsApp.`,

  75: `PLATFORM ISSUE REPORT

Report ID: [Your Phone Number]-BAN
Platform: WhatsApp
Issue Category: Account Management
Subcategory: Wrongful Suspension

Issue Description:
User account ([Your Phone Number]) has been suspended/banned without apparent justification. User reports standard platform usage with no policy violations.

Technical Observations:
- No warning notifications received
- Sudden access termination
- Possible platform bug or error

User Impact:
- Communication disruption
- Data access lost
- Service interruption

Resolution Path:
1. Technical investigation
2. Account activity audit
3. Ban reversal if unjustified
4. System fix if platform error

Reported by: [Your Name]
Contact: [Your Phone Number]
Report Date: [Current Date]
Status: Requires immediate attention`,

  76: `Fix required: [Your Phone Number] banned incorrectly.`,

  77: `ACCESS RESTORATION PROTOCOL

Protocol: ARP-[Your Phone Number]
Initiated: [Current Date]
Subject: WhatsApp Account Ban Reversal

PROTOCOL STEPS:
1. ACCOUNT IDENTIFICATION
   • User: [Your Name]
   • Number: [Your Phone Number]
   • Creation Date: [Approximate Date]

2. ISSUE DIAGNOSIS
   • Status: Banned
   • Code: Unknown
   • Trigger: Suspected error
   • Impact: Full access denied

3. RESTORATION REQUEST
   • Action: Manual review
   • Authority: Admin override
   • Verification: Account audit
   • Outcome: Access restored

4. COMPLIANCE CHECK
   • Terms: Acknowledged
   • Guidelines: Understood
   • Future: Will comply

5. CONTACT PROTOCOL
   • Primary: [Your Phone Number]
   • Status Updates: Required
   • Resolution: Expected within 48h

PROTOCOL STATUS: Active
PRIORITY: Critical
EXPECTED RESOLUTION: Account restoration`,

  78: `Quick help: Unban [Your Phone Number] please.`,

  79: `USER RIGHTS APPEAL

Under fair platform usage principles, I appeal the ban of my WhatsApp account.

Account Information:
• User: [Your Name]
• Account: [Your Phone Number]
• Service: WhatsApp
• Status: Banned

User Rights Asserted:
1. Right to fair treatment
2. Right to service access
3. Right to appeal decisions
4. Right to explanation

Appeal Basis:
- No violation of terms
- Consistent normal usage
- Possible system error
- Lack of warning/explanation

Requested Actions:
1. Transparent review process
2. Evidence of violation (if any)
3. Fair reconsideration
4. Access restoration if justified

User Cooperation:
Willing to provide any required verification or information.

Contact for Rights Discussion:
[Your Phone Number]

Appeal Date: [Current Date]
Expected Response: Within reasonable timeframe`,

  80: `Instant fix: Restore [Your Phone Number] to WhatsApp.`,

  81: `SERVICE DISRUPTION REPORT

Report Type: Critical Service Failure
Service: WhatsApp Messaging
User Account: [Your Phone Number]
Disruption Start: [Date/Time]
Duration: Ongoing
Severity: Complete service loss

DISRUPTION DETAILS:
• Service Status: Account banned
• Impact: 100% service interruption
• User Count Affected: 1 (primary user)
• Dependency Level: High (essential communications)

ROOT CAUSE ANALYSIS (User Perspective):
- No policy violations committed
- No warning received
- Possible platform error
- Automated system false positive

BUSINESS IMPACT (Personal):
- Communication breakdown
- Missed important messages
- Social connection loss
- Daily routine disruption

RESOLUTION REQUEST:
1. Immediate service restoration
2. Technical investigation
3. Cause identification
4. Prevention measures

ESCALATION PATH:
Direct to platform support team

CONTACT FOR UPDATES:
[Your Phone Number]

REPORT STATUS: Urgent attention required
EXPECTED RESOLUTION TIME: Immediate`,

  82: `Unban request for: [Your Phone Number]`,

  83: `QUALITY ASSURANCE APPEAL

QA Reference: BAN-APPEAL-[Your Phone Number]
Date: [Current Date]

ISSUE IDENTIFICATION:
• Product: WhatsApp
• Component: Account Management
• Defect: Wrongful account ban
• Severity: Critical
• Priority: Highest

QUALITY METRICS AFFECTED:
1. Service Availability: 0% (complete outage)
2. User Satisfaction: Severely impacted
3. Platform Reliability: Questioned
4. Trust Factor: Diminished

ROOT CAUSE HYPOTHESIS:
- False positive in security algorithms
- System error during routine check
- Misinterpretation of normal usage patterns
- Lack of human verification layer

QUALITY IMPROVEMENT REQUEST:
1. Manual quality check of ban decision
2. Account activity audit by human agent
3. Ban reversal if quality standards not met
4. Process improvement to prevent recurrence

QUALITY ASSURANCE MEASURES OFFERED:
- Willing to participate in QA review
- Can provide usage pattern data
- Available for verification calls

EXPECTED QUALITY OUTCOME:
Restoration of service to acceptable quality standards.

QA CONTACT:
[Your Phone Number]

SLA EXPECTATION:
Resolution within 24 hours due to critical severity.`,

  84: `Restore [Your Phone Number]. That's all.`,

  85: `TECHNICAL SUPPORT CASE

Case ID: TS-[Your Phone Number]-BAN
Opening Date: [Current Date]
Case Type: Account Access
Priority Level: P1 (Critical)

TECHNICAL SYMPTOMS:
• Application: WhatsApp
• User: [Your Phone Number]
• Symptom: Account banned
• Error Message: "Account banned" or similar
• Replication: Consistent across all devices

TECHNICAL ANALYSIS REQUESTED:
1. Server-side log analysis
2. Account flagging investigation
3. Security algorithm review
4. Authentication system check

TECHNICAL DATA AVAILABLE:
- Device information
- Network details
- Usage timestamps (approximate)
- Contact list (metadata only)

TECHNICAL RESOLUTION PATH:
1. Diagnostic data collection
2. Root cause identification
3. Technical fix implementation
4. Service restoration

TECHNICAL CONTACT:
[Your Phone Number]

ESCALATION PATH:
Immediate escalation to senior technical team required.

RESOLUTION ETA:
Due to critical priority, resolution expected within 12 hours.

TECHNICAL NOTES:
User reports normal usage pattern, suggesting possible technical error in ban system.`,

  86: `Clear request: Unban [Your Phone Number] from WhatsApp ban.`,

  87: `PROCESS APPEAL DOCUMENT

Document Type: Formal Process Appeal
Reference: PA-[Your Phone Number]
Date: [Current Date]

PROCESS IN QUESTION:
WhatsApp Account Ban Process

APPEAL GROUNDS:
1. Process Error: Ban applied incorrectly
2. Due Process: Lack of warning or explanation
3. Review Process: No appeal mechanism provided
4. Verification Process: No human verification

PROCESS FLAWS IDENTIFIED:
- Automated decision without oversight
- No pre-ban notification
- No detailed violation explanation
- No immediate appeal channel

PROCESS IMPROVEMENT REQUESTED:
1. Process audit of this ban case
2. Human review of automated decision
3. Process correction if error found
4. Process documentation provided

PROCESS OUTCOME SOUGHT:
1. Ban reversal if process flawed
2. Process explanation received
3. Account restoration
4. Process improvement commitment

PROCESS CONTACT:
[Your Phone Number]

PROCESS TIMELINE EXPECTATION:
- Acknowledgement: Within 4 hours
- Review: Within 24 hours
- Resolution: Within 48 hours

PROCESS COMPLIANCE:
Willing to comply with any legitimate verification process.`,

  88: `Solution: Remove ban from [Your Phone Number].`,

  89: `FINAL COMPREHENSIVE APPEAL

APPEAL SUMMARY
This document represents a comprehensive final appeal for the restoration of WhatsApp account [Your Phone Number].

SECTION 1: ACCOUNT PROFILE
• Account Holder: [Your Name]
• Phone Number: [Your Phone Number]
• Account Age: [Years/Months]
• Usage Type: Exclusive personal use
• Device: Primary mobile device
• Backup: Regular chat backup enabled

SECTION 2: INCIDENT TIMELINE
• Pre-ban Activity: Normal messaging patterns
• Ban Date: [Date]
• Ban Time: [Approximate Time]
• Notification: Sudden, no warning
• Current Status: Complete access denial

SECTION 3: COMPLIANCE STATUS
✓ Terms of Service: Fully compliant
✓ Community Guidelines: Never violated
✓ Security Practices: Maintained properly
✓ Usage Patterns: Within normal limits
✓ Content Shared: Appropriate always

SECTION 4: ERROR HYPOTHESIS
Based on available information, potential errors include:
1. Automated system false positive
2. Security algorithm misinterpretation
3. Account confusion/mix-up
4. Technical glitch during update
5. Unauthorized reporting abuse

SECTION 5: IMPACT ASSESSMENT
• Personal: Communication isolation
• Social: Connection disruption
• Practical: Daily coordination affected
• Emotional: Stress and inconvenience
• Trust: Platform confidence reduced

SECTION 6: RESTORATION JUSTIFICATION
1. No legitimate violation occurred
2. Account essential for daily life
3. Willingness to verify identity
4. Commitment to future compliance
5. Fair treatment expectation

SECTION 7: SPECIFIC REQUESTS
1. Immediate manual account review
2. Transparent violation explanation (if any)
3. Ban reversal if unjustified
4. Account restoration with full functionality
5. Assurance against future erroneous bans

SECTION 8: USER COMMITMENTS
• Full compliance with all policies
• Cooperation with any verification
• Responsible platform usage
• Timely response to inquiries
• Constructive feedback provision

SECTION 9: CONTACT PROTOCOL
Primary Contact: [Your Phone Number]
Availability: Immediate response
Verification: Willing to complete any required
Follow-up: Available for status updates

SECTION 10: EXPECTED OUTCOME
• Timeline: Resolution within 24 hours
• Outcome: Account restoration
• Communication: Clear explanation
• Assurance: Non-recurrence guarantee

FINAL APPEAL NOTE:
This represents my complete and final appeal. I trust in a fair review process and timely resolution.

Submitted with hope for justice,
[Your Full Name]
[Your Phone Number]
[Current Date and Time]`,

  90: `Unban: [Your Phone Number]`,

  91: `🚨 SYSTEM ALERT: Account Ban Error 🚨

Affected Account: [Your Phone Number]
Alert Type: False Positive Ban
Severity: Critical
Action Required: Immediate Manual Override
Contact: [Your Phone Number]
Resolution: Restore Account Access`,

  92: `Fix ban on [Your Phone Number].`,

  93: `🔴 PRIORITY TICKET 🔴

Ticket: UNBAN-[Your Phone Number]
Status: OPEN - URGENT
Category: Account Emergency
User: [Your Name]
Issue: Wrongful Ban
Impact: Critical
ETA: Immediate
Action: Manual Review & Restore
Contact: [Your Phone Number]
Notes: System error suspected`,

  94: `Action needed: Unban [Your Phone Number] now.`,

  95: `⚠️ EMERGENCY TICKET ⚠️

Code: EMER-BAN-[Your Phone Number]
Time: [Current Time]
Status: CRITICAL
Issue: Account Wrongfully Banned
User Impact: TOTAL SERVICE LOSS
Required: IMMEDIATE ADMIN ACTION
Contact: [Your Phone Number]
Resolution: RESTORE ACCESS NOW`,

  96: `Command: Restore [Your Phone Number].`,

  97: `🔔 CRITICAL ALERT 🔔

ALERT: Account Ban Error
ACCOUNT: [Your Phone Number]
LEVEL: URGENT
ACTION: Manual Intervention Required
STATUS: False Positive Detected
RESOLUTION: Ban Reversal Needed
CONTACT: [Your Phone Number]
TIME: [Current Time]`,

  98: `🆘 LAST RESORT APPEAL 🆘

This is my final attempt.
Account: [Your Phone Number]
Situation: Wrongfully banned
Desperation: Maximum
Request: Human review please
Hope: Restoration
Contact: [Your Phone Number]
Time: Now or never`,

  99: `🎯 THE ULTIMATE FINAL APPEAL 🎯

🌟 ACCOUNT: [Your Phone Number]
🌟 STATUS: UNJUSTLY BANNED
🌟 TRUTH: ZERO VIOLATIONS
🌟 REQUEST: RESTORE NOW
🌟 CONTACT: [Your Phone Number]
🌟 URGENCY: MAXIMUM
🌟 HOPE: FINAL ATTEMPT
🌟 OUTCOME: PLEASE DO RIGHT

This is appeal #100. The final one.
Please restore justice and my account.`
};

// ====== RATE LIMIT STORAGE (Memory) ======
const userCooldown = new Map();   // 24h cooldown
const userRateLimit = new Map();  // 1 min rate limit

const COOLDOWN_24H = 24 * 60 * 60 * 1000;
const RATE_LIMIT_1MIN = 60 * 1000;
const MAX_APPEALS_PER_DAY = 3;

cmd({
    pattern: "unban",
    desc: "Get WhatsApp ban appeal text (Safe - No number ban)",
    category: "other",
    react: "🦄",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, pushname }) => {
    try {
        const now = Date.now();
        const userId = from;

        // ===== RATE LIMIT CHECK (1 minute) =====
        const lastUse = userRateLimit.get(userId) || 0;
        if (now - lastUse < RATE_LIMIT_1MIN) {
            const wait = Math.ceil((RATE_LIMIT_1MIN - (now - lastUse)) / 1000);
            return reply(`⏳ *Thora sabar karein!*\n\nAap ${wait} second baad dobara try karein.\n\n_Ye spam protection hai — aapka number ban nahi hoga._`);
        }

        // ===== COOLDOWN CHECK (24 hours) =====
        const cooldownData = userCooldown.get(userId) || { count: 0, start: now };
        if (now - cooldownData.start > COOLDOWN_24H) {
            cooldownData.count = 0;
            cooldownData.start = now;
        }
        if (cooldownData.count >= MAX_APPEALS_PER_DAY) {
            const remaining = Math.ceil((COOLDOWN_24H - (now - cooldownData.start)) / (60 * 60 * 1000));
            return reply(`🚫 *Daily limit reached!*\n\nAap 24 ghante mein sirf ${MAX_APPEALS_PER_DAY} appeals le sakte hain.\n\n⏰ ${remaining} ghante baad try karein.\n\n_Ye WhatsApp spam detection se bachne ke liye hai._`);
        }

        // ===== APPEAL NUMBER CHECK =====
        const num = args[0];
        if (num === undefined || num === "" || isNaN(num)) {
            const list = `📋 *UNBAN APPEAL SYSTEM* 📋\n\n*Usage:* .unban <0-99>\n*Example:* .unban 0\n\n*Total Appeals:* 100 (0 se 99)\n\n⚠️ *Safety Info:*\n• Ek minute mein 1 appeal\n• 24 ghante mein max ${MAX_APPEALS_PER_DAY} appeals\n• Ye aapke number ko ban hone se bachata hai\n\n_Choose any number 0-99 for different appeal styles._`;
            return reply(list);
        }

        const appealNum = parseInt(num);
        if (appealNum < 0 || appealNum > 99 || !appeals[appealNum]) {
            return reply(`❌ *Invalid number!*\n\nSirf 0 se 99 tak ka number dein.\nExample: .unban 0`);
        }

        // ===== FILL PLACEHOLDERS =====
        const phoneNumber = from.split("@")[0];
        const userName = pushname || "User";
        const today = new Date().toLocaleDateString("en-GB");
        const currentTime = new Date().toLocaleTimeString("en-GB");

        let appealText = appeals[appealNum]
            .replace(/\[Your Name\]/g, userName)
            .replace(/\[Your Full Name\]/g, userName)
            .replace(/\[Your Phone Number\]/g, phoneNumber)
            .replace(/\[Phone Number\]/g, phoneNumber)
            .replace(/\[Your Number\]/g, phoneNumber)
            .replace(/\[Current Date\]/g, today)
            .replace(/\[Today's Date\]/g, today)
            .replace(/\[Date\]/g, today)
            .replace(/\[Current Time\]/g, currentTime)
            .replace(/\[Your Business Name\]/g, userName + " Business")
            .replace(/\[Alternative Contact\]/g, phoneNumber)
            .replace(/\[Email Address\]/g, "your-email@example.com")
            .replace(/\[Your Email\]/g, "your-email@example.com")
            .replace(/\[Year\]/g, "2020")
            .replace(/\[Approximate Date\]/g, today)
            .replace(/\[Date of Ban\]/g, today)
            .replace(/\[Your Device\]/g, "Mobile Device")
            .replace(/\[Version\]/g, "Latest")
            .replace(/\[Brief Description\]/g, "Normal messaging")
            .replace(/\[Time since ban\]/g, "Few hours")
            .replace(/\[Number\]/g, "few")
            .replace(/\[Time\]/g, currentTime)
            .replace(/\[Date\/Time\]/g, today + " " + currentTime)
            .replace(/\[Years\/Months\]/g, "3 years")
            .replace(/\[Approximate Time\]/g, currentTime);

        // ===== UPDATE RATE LIMIT =====
        userRateLimit.set(userId, now);
        cooldownData.count += 1;
        userCooldown.set(userId, cooldownData);

        // ===== SAFE REPLY WITH DELAY =====
        // WhatsApp spam detection se bachne ke liye chhota delay
        await new Promise(r => setTimeout(r, 800));

        const remainingToday = MAX_APPEALS_PER_DAY - cooldownData.count;
        await reply(
            `📩 *Appeal #${appealNum}*\n\n` +
            `${appealText}\n\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `✅ *Appeals left today:* ${remainingToday}/${MAX_APPEALS_PER_DAY}\n` +
            `⚠️ *Spam na karein warna number ban ho sakta hai!*`
        );

    } catch (err) {
        console.error("Unban command error:", err);
        await reply(`❌ Error aya: ${err.message}`);
    }
});
