# HRDotNet Performance Product Requirements

Current system baseline | Version 3.0 | 23 October 2026

## 1 Purpose and scope

HRDotNet Performance coordinates employee accomplishments, evaluator assessments, and released performance results. This PRD describes the current local application, including the workflow recovery changes. It gives product, HR, engineering, design, and QA teams a shared reference for what the system does today and what remains necessary for production.

The core journey is: HR publishes performance standards and launches a cycle; employees report accomplishments; managers verify them; evaluators submit assessments in sequence; HR finalizes the cycle and separately releases results.

This is an implementation baseline, not an approved company performance policy. The application is an interactive HTML, CSS, and JavaScript prototype with sample identities and browser-local persistence. It does not provide production sign-in, server authorization, shared storage, or a live HRDotNet connection.

### Product objectives

- Apply consistent position-specific performance expectations within a review cycle.
- Separate reported accomplishments, verified evidence, assessment submissions, and finalized results.
- Make ownership, next actions, deadlines, and confidentiality visible to each role.
- Recover from missed deadlines and incorrect submissions without discarding prior evidence.
- Preserve finalized scoring and employee context for historical review.

### Included capabilities

The baseline includes role-based dashboards, position KPI Goal Templates, Behavioral Assessment Templates, a five-step cycle wizard, accomplishment submission and verification, sequential assessments, HR recovery controls, released evaluations, 202 Files, Performance Improvement Plans (PIP), team and employee lookup, reports, and CSV exports.

### Excluded capabilities

Payroll, compensation administration, recruiting, attendance, leave, forced ranking, automatic employment decisions, native mobile applications, external evaluator portals, and unrestricted company administration are outside the current scope. Personal goal creation, operational milestone tracking, and progress editing are legacy concepts and are not the current Goals workflow.

### Baseline authority

This document reflects the current working tree on branch codex/workflow-recovery, based on commit 31b5e9a plus local workflow fixes. Current modules loaded by performance/dist/index.html take precedence over older PRDs and guides. Prior documents remain historical references; they have not been overwritten.

<!-- page -->

## 2 Users and workspace

The prototype previews three separate fictional identities: Employee Sofia Garcia, Manager Angela Reyes, and HR Administrator Maria Angeles. In a production product, one person may hold multiple responsibilities; this prototype switches sample identities to demonstrate the views.

### Role capability matrix

| Capability | Employee | Manager | HR Administrator |
| --- | --- | --- | --- |
| Dashboard | Own activity | Permitted team | Organization view |
| Goals | Report own accomplishments | Verify team submissions | Configure through templates and cycles |
| Assessments | Assigned contributions | Assigned contributions | Assigned contributions and monitoring |
| Templates and cycles | No administration | No administration | Manage configuration and lifecycle |
| Released results | Own results | Permitted team | Authorized organization scope |
| Workflow recovery | Resubmit returned work | Return accomplishments | Extend dates and reopen assessments |
| Employee lookup | No directory | My Team | Employees and manager assignment |
| Performance journals and Reports | Unavailable | Permitted team | Authorized organization scope |
| NTE Files | Own issued active and past notices; submit explanation | Read issued team notices | Create, edit drafts, issue, cancel, and close |
| PIP | View own plans; acknowledge and submit weekly updates | Configure and assess permitted team plans | Configure and assess plans within organization scope |

Participation and evaluator assignment are separate concepts. An employee is the subject being evaluated; the evaluator supplies a particular response. A manager's team visibility does not automatically permit reading anonymous responses or editing another evaluator's answers.

### Navigation and shell

Employee navigation contains Dashboard, Goals, Reviews, 202 Files (own NTEs only), and PIP. Manager navigation adds My Team, 202 Files, PIP, and Reports. HR navigation contains Dashboard, Reviews, 202 Files, PIP, Reports, and Employees. HR expands Reviews to access All Reviews, Templates, and Cycles; Templates expands into KPI Goal Templates and Behavioral Assessment Templates.

The shell provides accessible-page search, a company selector, notifications, settings, and a profile menu. Profile actions include profile information, account settings, demo role preview, and ending the preview. Ending the preview returns to the Employee dashboard; it is not an identity-provider logout.

The company menu currently shows Mayon Consolidated Inc. and no available sister companies. A multi-company operating product is not established by this menu.

### Permission boundary

Ownership, team relationships, evaluator assignment, confidentiality, company context, and lifecycle state govern the intended access model. The current client-side guards demonstrate that model. They are not a security boundary against users inspecting or changing browser data.

<!-- page -->

## 3 Performance templates

HR establishes reusable performance standards before launching a cycle. Draft, Published, and Archived are the template lifecycle states. Only eligible published templates can be selected for new evaluation configurations. Published or used templates are versioned so existing assignments keep their original content.

### KPI Goal Templates

A KPI Goal Template defines the quantitative indicators applicable to a position. It includes a name, description, position, version, status, and a set of performance indicators.

Each indicator defines its name, description, measurement unit, target, direction of success, indicator weight, target-met score, and below-target score. A higher-is-better indicator succeeds when actual is at least target; a lower-is-better indicator succeeds when actual is at most target.

Indicators can also contain a custom reference matrix with editable columns and rows, or a numeric threshold scale with minimum actual values, rating labels, and scores. Numeric scales remain reference-only until HR enables “Use for scoring.” Enabled scales replace target-met / below-target scoring for that indicator. Minimum-threshold scales start at zero and increase strictly; each range ends below the next minimum. Maximum-threshold scales include each maximum and finish with an unlimited final range. Generated scales follow the achievement direction: lower-is-better uses inclusive maximums; higher-is-better uses inclusive minimums. Zero-target defaults are supported. Scores remain from 1 to 5. A boundary preview shows zero, just below target, exact target and just above target; direction warnings flag conflicting custom scales. Existing saved scales and cycle snapshots keep their original scoring. Reference matrices and scoring settings travel with frozen cycle template snapshots and are visible in accomplishments and evaluation results.

Publication requires valid indicator names, nonnegative targets, positive weights totaling 100 percent, and configured scores within the 1–5 scale. The template must identify its applicable position. This is a configured scoring rule, not evidence of a company-approved policy.

During cycle setup, the system matches published templates to participant positions. When more than one template matches, HR selects one applicable template for that position. Missing or invalid templates block readiness. Cycle-specific template snapshots prevent later template edits from changing participant expectations. Behavioral templates are frozen per participant at scheduling, independent of later position changes. Older scheduled cycles resolve retained snapshots using frozen employee context; missing original evidence blocks assignment generation and appears as a Cycle Details error rather than selecting a live template.

### Behavioral Assessment Templates

A Behavioral Assessment Template contains reusable sections and questions. Supported question types are Rating Scale, Short Answer, Paragraph, and Multiple Choice. Questions support titles, descriptions, required flags, duplication, deletion, and reordering; sections can be organized and renamed.

Rating questions use values 1–5 with labels Never, Rarely, Sometimes, Often, and Always. Not Observed is available where enabled and does not count as a numeric answer. Multiple-choice questions require valid, distinct options. Written and multiple-choice responses do not generate numerical performance scores.

HR can preview a form before publication. Review screens use the selected questionnaire snapshot. A cycle can select a default Behavioral Assessment Template and compatible overrides by position.

### Required behavior

- TPL-01: Publishing invalid template content must show the issue and prevent publication.
- TPL-02: Archiving a template must not rewrite existing cycle evidence.
- TPL-03: New cycles must use eligible published versions and preserve their selected content.
- TPL-04: Questionnaire changes for future use must not silently alter launched assessments.

<!-- page -->

## 4 Review cycle setup and lifecycle

HR owns cycle configuration, launch, scheduling, cancellation, finalization, and release. Managers and employees participate through their assigned records.

### Five step setup

| Step | HR action | Required outcome |
| --- | --- | --- |
| Cycle Details | Set name, type, description, evaluation period, assessment start | Valid identity and dates |
| Select Participants | Search and filter existing employees and select participants | Authorized participant set |
| Evaluation Setup | Resolve position KPI Goal Templates and Behavioral Assessment Templates | Each participant is ready |
| Assessment Workflow | Set stages, evaluators, deadlines, and visibility | Complete ordered workflow |
| Review and Launch | Inspect summary and resolve validation issues | Confirm launch or scheduling |

Supported review types are Standard Performance Review, 360° Feedback, Probationary Review, and Project-Based Review. A type describes the review purpose; it does not replace template, participant, or evaluator configuration.

New simplified configurations include Goals Performance and Behavioral Performance with fixed 50/50 weighting. The standard assessment sequence includes Self, Manager, and HR. Optional peer/upward assessment perspectives are supported by the model; available optional-stage controls constrain what HR can add, remove, or reorder. Each stage has its own evaluator assignments and deadline.

### Schedule rules

The evaluation period identifies when performance occurred. Assessment start and response deadlines identify when people report and evaluate it. The accomplishment deadline must be on or after the evaluation-period end and assessment start. Verification must be on or after accomplishment submission and no later than the Manager assessment deadline. Assessment deadlines must be valid and strictly ordered.

Launch requires a current start, valid participants, eligible templates, authorized evaluator assignments, and deadlines that have not already closed the accomplishment or verification windows. Scheduling requires a future start. The wizard provides validation messages linked to the affected step.

### Cycle states

Draft cycles remain configurable. Scheduled cycles preserve the chosen configuration for future opening. Active cycles accept permitted work. Completed cycles are finalized and locked. Cancelled cycles preserve records but no longer accept submissions or expose results.

Draft cycles do not generate evaluator assignments. Launch generates cycle-specific accomplishment records and evaluator assignments. Scheduling preserves template content and creates the participant performance records; assessment availability follows the scheduling rules. No background scheduling service runs in this prototype.

<!-- page -->

## 5 Accomplishment submission and verification

Goals is the employee reporting workspace for a selected cycle. It is not a personal goal builder. Participants receive performance indicators from a frozen position-template snapshot. Launch does not create new operational goal or milestone records.

### Employee workflow

The employee selects a review cycle, reads each indicator and target, enters actual results and optional remarks, and saves a draft or submits accomplishments. Actual values must be valid nonnegative numbers; submission requires an actual result for every indicator. Each submitted accomplishment version preserves actuals, remarks, submitter, timestamp, and the correction reason that led to resubmission. The read-only Accomplishment Submission History appears in Goals and authorized evaluation results. Older records retain only their known latest submitted evidence; previously overwritten versions cannot be reconstructed. A draft may be saved before the evaluation period ends, but submission must wait until that period has ended.

Confirming submission locks the record while it awaits manager verification. Employees cannot alter targets, indicator weights, position mapping, or the selected template. Each cycle keeps its own values and reporting state.

### Manager workflow

The manager selects a cycle and team member, reviews reported actuals and remarks, then verifies the submitted record or returns it for correction. Returning requires a reason. Verification is limited to an eligible assigned Manager evaluator for a permitted employee within an active, unreleased cycle and the verification window.

Verification does not require the employee's self-assessment to have been submitted. It confirms the reported accomplishment evidence; it does not assert that every target was achieved. Below-target results can be verified and scored under the template criteria.

### Accomplishment states

| State | Meaning | Next permitted action |
| --- | --- | --- |
| Draft | Employee has not submitted | Save or submit within the window |
| Submitted | Actuals are locked for review | Manager verifies or returns |
| Returned | Correction reason supplied | Employee corrects and resubmits |
| Verified | Manager accepted reported actuals | Use evidence for scoring |

A returned record remains editable through the manager verification deadline, even after the original accomplishment deadline. The correction notice displays that deadline. Once it expires, HR must extend the active cycle schedule before further corrections can proceed.

### Required behavior

- ACC-01: Other employees' accomplishment records must not become editable through stale selections.
- ACC-02: Submitted and verified records remain read-only to the employee.
- ACC-03: Manager assessment submission requires verified accomplishments when Goals Performance applies.
- ACC-04: Changes to reusable templates must not modify the cycle's recorded targets or values.

<!-- page -->

## 6 Assessments and result release

Reviews lists individual evaluator assignments. Users can search, filter, open assigned responses, save drafts, and submit completed questionnaires. Manager views also expose permitted team metadata. HR monitors cycle-wide progress without taking over another evaluator's answers.

### Sequential assessment workflow

A stage opens for an employee only when all assignments in the preceding configured stages are Submitted or Completed. A missed deadline does not bypass that dependency. Assignments can remain locked even if their own due date has passed.

The evaluator opens the available assignment, answers required questions, adds optional feedback, saves a draft if needed, and confirms submission. Questionnaire answers must match their question type. Submitted responses are read-only until an authorized HR correction action reopens them.

| Display state | Meaning |
| --- | --- |
| Not Started | Assignment exists with no saved draft |
| In Progress | A response draft exists or correction reopened it |
| Submitted | Evaluator confirmed the response |
| Completed | HR finalized the cycle workflow |
| Locked | Earlier stages are not yet submitted |
| Overdue | Unsubmitted available work has passed its deadline |

Assessment deadlines are distinct from accomplishment deadlines. Overdue assessments may still be submitted while the cycle is Active and the stage is otherwise eligible. Accomplishment editing and verification have explicit date-window guards and use HR deadline extension for recovery.

### Finalization and release

HR can finalize only when every required evaluator assignment is Submitted or Completed and required accomplishments are verified. Finalization locks the workflow and preserves result evidence, component scores, and weights in snapshots. Results remain unreleased immediately after finalization.

HR then confirms a separate Release Results action. Employees receive their own authorized evaluation summaries; managers receive permitted team results. Anonymous response protections still apply. Finalization and release are separate events and must not be presented as interchangeable completion states.

### Evaluation summary

The released evaluation includes employee context, evaluation period, Goals Performance, Behavioral Performance, overall score and weighted contributions, assessment summary, and eligible written feedback. Managers can record final comments on permitted released results. Authorized manager/HR navigation can open related 202 Files or assessments and return to the originating evaluation context. Employees can open only their own issued NTEs in 202 Files; performance journals remain restricted to authorized managers and HR.

<!-- page -->

## 7 Recovery and exception handling

Recovery operates on active, unreleased cycles. It preserves prior evidence and records why HR changed the workflow. It does not unlock finalized or released evaluations.

### Deadline extension

HR opens Reviews → Cycles → Cycle Details → Overview → Workflow Recovery → Extend Deadlines. The dialog shows accomplishment, verification, and assessment dates and requires a reason.

HR may retain or extend each deadline, but cannot shorten it. The accomplishment deadline must be today or later and cannot precede the evaluation-period end. Verification must follow accomplishment submission and cannot exceed the Manager assessment deadline. Assessment dates remain valid and strictly sequential. At least one date must change.

Saving updates the cycle and assignment deadlines without discarding answers. The cycle retains before/after schedules, the reason, actor, and timestamp. Cycle Details displays extension history. Employees and managers cannot perform this action.

### Coordinated assessment correction

From Cycle Details → Progress, HR chooses Reopen for a submitted assessment and supplies a correction reason. Confirmation explains that the selected assessment and all later responses for that employee must be submitted again in sequence.

For every affected response, the application preserves its prior state, answers, recorded actuals, written feedback, submission date, reason, actor, and correction timestamp in response history. The selected response and started/submitted later responses return to In Progress. Untouched later assignments remain Not Started. Submission markers are removed so previous submissions cannot satisfy the finalization gate.

Existing answers remain available as drafts. Earlier unaffected stages and other employees' responses remain unchanged. The normal stage dependency rules lock later work until the corrected earlier stage is resubmitted. The assessment page shows the correction reason and accessible prior versions. History follows the response's existing visibility restrictions.

This operation corrects assessment responses; it preserves accomplishment verification and does not authorize HR to change reported actuals or verified records directly. It is not a general administrative override.

### Other exceptions

Cancelled cycles remain read-only. Missing templates, unresolved participant positions, invalid date order, missing evaluators, and incomplete required answers block the corresponding action with validation feedback. HR cancellation retains existing responses rather than deleting them. Recovery after finalization, result withdrawal, appeals, and delegated substitute evaluators are not implemented workflows.

<!-- page -->

## 8 Scoring and confidentiality

New simplified cycles use 50 percent Goals Performance and 50 percent Behavioral Performance. Existing historical cycles retain their recorded configuration and finalized score snapshots. The application does not automatically recalculate historical results under the new policy.

### Goals Performance calculation

For each indicator, compare the verified actual against the preserved target and direction. Assign the configured target-met or below-target score. Average these scores using the indicator weights. A numeric Goals Performance score is unavailable until required actuals exist and the accomplishment record is Verified.

For a 60/40 indicator split with configured scores of 5 for meeting target and 3 for falling below target, one achieved indicator and one below-target indicator produce a goals score of 4.2 out of 5. These values illustrate the calculation, not a fixed company rule.

### Behavioral Performance calculation

For the default average policy, collect eligible observed numeric answers from submitted/completed assessments and average those answers. This averages individual eligible rating answers; it does not guarantee equal weight per evaluator if questionnaires contain different numbers of observed ratings. Not Observed and unanswered optional questions are excluded. Narrative and multiple-choice answers do not add numeric points.

Historical configurations may retain an authoritative evaluator policy instead of the new default. Component availability and missing-score states must be respected; an absent score is not silently treated as zero.

### Anonymous perspectives

Anonymous Peer and Upward responses are evaluated independently by perspective for each employee and cycle. A perspective contributes only after the configured threshold of distinct submitted evaluators is met. Anonymous stages belonging to that perspective are pooled for the summary. The configurable threshold is between 2 and 10.

Below-threshold anonymous feedback contributes neither scores nor narratives to the result summary. Eligible anonymous feedback is aggregated without evaluator identities. A respondent can access their own response; team visibility does not grant access to another person's raw anonymous response.

### Overall result

For a new 50/50 cycle, Overall = Goals score × 0.50 + Behavioral score × 0.50. For example, goals at 4.2 and behavior at 3.8 produce 4.0 out of 5. Display rounding must not change stored evidence. Finalized snapshots preserve the scores used at completion.

Scoring policy, anonymity thresholds, and the interpretation of ratings require formal HR approval before use with real employee outcomes. This PRD records implemented behavior, not that approval.

<!-- page -->

## 9 Dashboards reports and supporting records

### Dashboard

Role-specific dashboards show visible review activity and accomplishment status. Filters include period and review cycle, with applicable department filtering for broader views. Period controls support standard ranges and a custom range. Cards and charts link to related records or pending tasks where supported.

Employee views focus on personal accomplishments and assigned assessments. Manager views include team members, pending evaluations, submitted accomplishments awaiting verification, and overdue verification. HR views summarize cycle activity and verified accomplishment rates. Sequential assessment panels distinguish available stages, locked stages, and completed evaluations with released results.

Dashboard is the primary location for standalone KPI cards. Other pages emphasize listings, detail records, filters, and actions.

### Reports and exports

Managers and HR can filter reports by cycle, review period, department, and review type. Charts show review completion by department, rating distribution, workflow status, and competency performance. Submitted and Completed remain separate states. Empty or insufficient filtered data produces an empty state rather than invented scores.

Report ratings use eligible released results. Confidentiality and Not Observed exclusions apply. Report exports and released-result CSVs respect their respective visible scopes and available columns. Report views are not a separate approval or release mechanism.

### Employees and My Team

HR searches simulated HRDotNet employee records and assigns performance managers individually or in bulk. Lookup filters include department, position, manager, and assignment status. There is no employee creation form in this workflow.

A performance-manager assignment records an effective date, prevents self-assignment and reporting loops, and is stored separately from the source employee identity. Future assignments remain pending until their company effective date. On activation, HRDotNet Performance revalidates employee eligibility, company scope and the projected reporting graph; invalid changes are blocked for HR review. HR can cancel a pending assignment. Not-started Manager responses are reassigned when the change takes effect; in-progress and submitted responses retain their evaluator. Accomplishment verification belongs to the eligible current performance manager, even when a retained in-progress assessment belongs to the previous manager. That retained evaluator can read accomplishment evidence and submission history only for their exact assigned cycle; this does not restore team or journal access or grant verification authority. These are browser-local changes, not writes to the source HRDotNet hierarchy.

### 202 Files

202 Files contains Journal Entries and NTE Files tabs for HR and managers. Employees see only their own NTE records.

Managers and HR maintain performance journals for permitted employees. Entries include date, type, title, description, author, and an optional related cycle. Types cover achievements, observations, improvement areas, coaching/feedback, incidents, and other notes. Journals provide context for assessments; they do not generate numeric ratings automatically.

NTE Files provides an employee masterlist and searchable active, past, and HR-only draft notices. HR creates notices with category, subject, body, explanation deadline, optional incident date and reference; saves and reviews a draft; then explicitly issues it. Issuance locks the notice and creates an employee in-app notification. Opening the notice records a read receipt. Employees can submit one explanation, including after the deadline while the notice remains issued. Submission changes the status to Responded and locks the explanation. HR normally closes a notice with an outcome after an employee explanation or after the explanation deadline has expired. The response window remains open throughout the deadline day. Earlier closure requires a separate exception reason, explicit confirmation that the response opportunity ends early, and retained exception history visible in the notice. Cancellation remains a distinct action requiring its own reason. Unissued cancelled drafts remain hidden from employees and managers. Managers can read issued records for employees in their scope and cannot create or resolve notices. There is no automatic disciplinary outcome.

### Performance Improvement Plan (PIP)

PIP is available to all roles. Employees read only their own records, acknowledge active plans, and submit weekly progress; Manager/HR configure and assess permitted employees. Managers cannot configure their own plans or employees outside their reporting scope. Current-company scope applies to all reads and actions.

A completed and released KPI evaluation automatically refers an employee when any verified indicator is below its direction-specific target. Behavioral ratings, incomplete results and unverified KPI records do not trigger referral. Enrollment copies the authoritative evaluation indicators, actuals, targets, matrix criteria, score and failure rule. A source evaluation cannot enroll the same employee twice, even after closure; a later failed evaluation joins an existing open plan with a visible review requirement. HR/Manager can also enroll manually with a reason and an optional completed KPI evaluation.

Automatic records start Awaiting Planning; manual records start Draft. Manager/HR declares weekly sections, normally one measured indicator per week, with improvement goal, target, measurement unit, direction, actions/deliverables and manager support. Sections span seven inclusive days, cannot overlap, and must start on or after the system workflow date on activation. Partial planning drafts can be saved. Activation requires complete sections, locks the criteria and surfaces an employee notification.

Every failed indicator from each linked, released KPI evaluation must have its own weekly section or a documented Manager/HR exclusion reason. Coverage is tied to both evaluation and indicator, shown to the employee, and checked before plan activation, referral review, or closure. Adding another failed evaluation to an open plan reopens referral review and coverage. Exclusions are preserved in the plan history and visible to employees. If all assessed included work meets its targets, a plan with exclusions closes as Completed with Exclusions; any unmet final outcome closes as Not Met. This does not erase or rewrite KPI results.

Employees acknowledge the active plan and save weekly actuals, progress narrative and optional evidence/reference as drafts during the observation period. Final submission and staff assessment open on or after the seven-day inclusive weekly period end date; same-day activity is allowed through that date. Future weeks are locked, but late updates remain available while active. Submitted updates become read-only. Manager/HR can return a submission with a correction reason or assess it using verified actuals and remarks; the weekly result is derived from the declared target. If an employee misses a submission, staff can assess after the weekly deadline only with an explicit reason, verified actual and remarks; missing submissions are not automatically scored as zero. Plans cannot close while a week is still in progress or an indicator remains unaddressed.

Additional weekly sections require a reason and start after existing weeks. They can be new unlinked sections for a newly referred source indicator, or follow-ups linked to an earlier weekly focus. Every selected source uses the evaluation ID plus indicator ID, so reused indicator IDs with different historical targets remain distinct. A follow-up retains the original source evaluation. Older active/closed criteria are not rewritten; ambiguous historical associations are labeled while existing evidence remains readable. Earlier failures and submissions remain recorded. A successful follow-up can resolve an earlier failed assessment. All weeks require assessment and additional referrals require review before closure. The final review previews Completed when all final linked outcomes meet target, or Not Met otherwise; staff records a closure note. Cancellation requires a reason. Closed plans remain read-only. These are improvement-plan outcomes, with no automatic disciplinary or employment action.

Screens include a scoped searchable listing with status counts and filters, manual enrollment, weekly planning builder, evidence and plan detail, employee progress, Manager/HR assessment, follow-up editor, correction/cancellation/referral review and final outcome dialogs, notifications, and event history. Related KPI result screens link to the PIP. The implementation uses the existing browser-local persistence and workflow clock.

### Notifications and common controls

The notification menu lists PIP planning, acknowledgement and weekly assessment actions, unread issued NTEs for the employee, and actionable assigned review responses and supports a browser-local notification preference. Dashboard next actions also surface accomplishment work. No external email, push delivery, or escalation service runs. Listings provide relevant search, filtering, empty states, and numbered pagination. The existing HRDotNet visual identity remains the design baseline.

<!-- page -->

## 10 Data model and delivery boundary

The entities below describe the current conceptual model. They are not a deployed database schema.

| Entity | Responsibility |
| --- | --- |
| Employee and manager relationship | Identity, position, team scope, performance-manager override |
| Template version and indicator | Published quantitative standards and scoring criteria |
| Behavioral question and section | Questionnaire content and response validation |
| Review cycle and participant | Evaluation period, configuration, state, and inclusion |
| Accomplishment record | Employee/template snapshot, actuals, remarks, verification history |
| Evaluator assignment and response | Subject, evaluator, stage, questionnaire, answers, submission |
| Response version | Evidence retained when HR reopens assessments |
| Schedule history | Before/after dates, reason, actor, and time |
| Pending performance-manager assignment | Effective date, employee, manager, company scope, status, and application history |
| PIP plan, referral, focus week, exclusion and event | Evaluation/indicator provenance, coverage, weekly targets and evidence, decisions, reason and actor history |
| Evaluation snapshot and release | Final scores, evidence, and result visibility |
| Journal entry, NTE and action log | Supporting observations; confidential notice lifecycle, explanation, read receipt and local event history |

### Current implementation

The application is served as static assets from performance/dist. Its ordered JavaScript modules extend earlier behavior; the last-loaded position-goals module establishes the current accomplishment experience. Browser storage holds sample records, configuration, preferences, and action history. Changes in one browser are not a shared multiuser workflow.

The default workflow date is the live Asia/Manila company date. HR can explicitly switch to a labeled demo date for walkthroughs; clock changes do not reverse prior actions. A browser-local due processor checks on load, every 30 seconds, on focus and when the workspace becomes visible. It applies due manager assignments before opening scheduled cycles, validates cycle snapshots and dates, and shows HR recovery actions for malformed or expired schedules. Dirty forms and open modal tasks defer processing until safe. Settings expose pending and blocked manager changes. Deadline actions catch up when the workspace is reopened, but nothing runs while every browser session is closed; no external worker or shared backend is connected.

### Production work not implemented

Real deployment requires authentication, server-enforced authorization, tenant isolation, durable shared storage, concurrent-write handling, backups, reliable scheduling, notification delivery, and tamper-resistant audit records. HRDotNet identity/reporting integration and any write-back contract require separate implementation.

The client-side role preview, company selector, local history, and sample identities must not be presented as production access controls. Production readiness also requires accessibility and responsive validation, retention/deletion policy, privacy review, operational monitoring, and security testing. No measured service-level, availability, throughput, or adoption targets have been established here.

### Policy decisions still needed

HR must approve the 50/50 split, indicator score mappings, rating meanings, anonymous thresholds, late-submission rules, correction authority, and evidence retention. A product decision is also needed for post-release appeals, withdrawn results, reassignment during an active response, and recovery from a departed evaluator. These are open decisions, not completed features.

<!-- page -->

## 11 Acceptance and traceability

The following scenarios define the current baseline's principal acceptance checks. They complement the existing check scripts and do not establish production security or organizational policy approval.

| ID | Scenario | Expected outcome |
| --- | --- | --- |
| AT-01 | Publish an invalid template | Publication blocked with validation |
| AT-02 | Launch with missing position template | Participant readiness blocks launch |
| AT-03 | Launch with expired accomplishment window | Launch blocked before assignments are created |
| AT-04 | Launch a valid cycle | Snapshot records and unique evaluator assignments created |
| AT-05 | Edit a source template after launch | Existing cycle content remains unchanged |
| AT-06 | Submit incomplete accomplishments | Submission blocked; draft retained |
| AT-07 | Return work after original employee deadline | Employee can correct through verification deadline |
| AT-08 | Submit Manager assessment before verification | Submission blocked |
| AT-09 | Open a stage before earlier submissions | Stage remains locked |
| AT-10 | Extend active dates with a reason | Ordered dates and assignments updated; history retained |
| AT-11 | Shorten dates or omit extension reason | No schedule change saved |
| AT-12 | Reopen an earlier submitted assessment | Affected evidence archived; downstream resubmission required |
| AT-13 | Attempt employee use of HR recovery | Action rejected |
| AT-14 | Anonymous group below threshold | Scores and narratives withheld |
| AT-15 | Anonymous perspective reaches threshold | Eligible aggregate ratings contribute without identities |
| AT-16 | Finalize and release a corrected sequence | Finalization waits for resubmission; release remains separate |
| AT-17 | Attempt recovery on completed results | Locked snapshots remain unchanged |

### Verification record

On October 23, 2026, all 18 work/check*.cjs scripts passed against the current working tree. They include workflow recovery, position accomplishments, connected cycles, results, navigation, roles, layout expectations, and export-package consistency. These are application logic and packaging checks with simulated browser environments; they are not a full production browser, integration, load, or security test suite.

The recovery change also received browser inspection of the HR deadline dialog and an independent code review. This records the checks performed; it does not imply every path is free of defects.

### Source map

The primary sources are performance/dist/position-goals.js for current accomplishments and extensions; cycle-workflow.js for setup, gates, scoring, and finalization; evaluations.js for templates, stages, journals, and corrections; evaluation-results.js for summaries and historical evidence; shell.js, dashboard.js, revisions.js, and tables.js for navigation, reporting, lookup, and shared behavior. The entry point is performance/dist/index.html.

The supplemental workflow explanation is docs/workflow-recovery.md. Regression coverage for the latest fixes is work/check-workflow-recovery.cjs. Older documents in outputs are historical context and may describe replaced behavior. This PRD is a current-system description, not a commitment to an implementation roadmap or launch date.
