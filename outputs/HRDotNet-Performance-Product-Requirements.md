# HRDotNet Performance — Product Requirements Document

Version 2.1 | Revision date 22 October 2026 | Product baseline for HR review

Audience: HR stakeholders, product owners, designers, engineers, and quality assurance.

HRDotNet Performance connects employee goals, sequential assessments, and documented performance outcomes in one workspace. This specification defines the current intended MVP, including position-specific Goals Templates, reusable Behavioral Templates, actual employee goal assignments, manager verification, and consolidated evaluation results. HR must confirm the policy decisions in Section 15 before production rollout.

## 1 Document Overview

### Product and purpose

The product supports HR Administrator, Manager, and Employee users. It helps HR administer review periods, managers monitor their permitted teams, and employees track goals and contribute assessments. The PRD is the shared baseline for implementation, testing, and stakeholder review. It supersedes conflicting earlier PeopleDotNet, PMSDotNet, and PulseDotNet requirements.

### Scope and delivery boundary

The MVP covers Dashboard, Goals, Reviews, Goals Templates, Behavioral Templates, Review Cycles, 202 Files, Reports, and the HRDotNet employee directory. It includes standard and 360-degree feedback, draft preservation, sequential stages, release controls, search, filtering, and numbered pagination. One application shell and design system serve all three roles.

The current deliverable is a local HTML interaction prototype with sample data and browser storage. Its role preview and HRDotNet records demonstrate the intended product; they do not provide production authentication, server authorization, live HR integration, durable multiuser storage, or a complete audit service. Production requirements in this document remain implementation obligations where those services are absent.

Payroll, compensation decisions, recruiting, attendance, leave management, automatic employment decisions, forced ranking, native mobile apps, external evaluator portals, and unrestricted cross-company administration are outside this MVP.

### Revision history

| Version | Date | Baseline change |
| --- | --- | --- |
| 1.2 | 21 October 2026 | PulseDotNet goals, permissions, shared tables, and numbered pagination baseline. |
| 2.0 | 22 October 2026 | HRDotNet Performance branding; Goals and Behavioral integration; six-step cycle wizard; sequential assessments; verified scoring; 202 Files; complete results; context-aware navigation; template status tabs; removal of temporary listing shortcuts. |
| 2.1 | 22 October 2026 | Five-step wizard; participants-only selection; stacked Goals and Behavioral setup; proposed fixed 50/50 calculation; draft migration retaining original configuration and historical results. |

## 2 Product Objectives

- Align employee-specific goals with published expectations for each position.
- Make goal progress, milestone completion, actual outcomes, and verification distinct and visible.
- Collect behavioral ratings and written feedback through reusable forms.
- Coordinate evaluator assignments and deadlines in an explicit assessment sequence.
- Preserve historical evaluation evidence and calculations after finalization.
- Give each role actionable information without exposing confidential organization-wide records.
- Provide reliable reporting whose totals reconcile to the permitted filtered records.

Product acceptance requires successful end-to-end goal, cycle, assessment, verification, finalization, and result navigation scenarios. Reporting reconciliation, authorization, snapshot integrity, and draft recovery are release gates. Numeric adoption or productivity targets require stakeholder agreement and production instrumentation; none are established company targets here.

## 3 User Roles and Permissions

Authorization combines role, active company, reporting relationships, record ownership, evaluator assignment, confidentiality settings, and workflow state. Hiding navigation is insufficient: every read, mutation, export, and related-record route must recheck access.

| Capability | HR Administrator | Manager | Employee |
| --- | --- | --- | --- |
| Dashboard and goals scope | Authorized company | Permitted team | Own records |
| Create and assign goals | Authorized employees | Permitted team | Personal goals for self |
| Configure existing goals | Authorized goals | Permitted team goals | Own editable personal goals |
| Update goal progress | Authorized scope | Permitted team | Own permitted goals, including assigned goals |
| Record cycle goal actuals | Own linked goals if eligible | Own linked goals if eligible | Own linked goals if eligible |
| Verify goal actuals | Monitor verification | Assigned, unlocked Manager stage for permitted employee | No verification authority |
| Manage templates and cycles | Create, edit, publish, archive, configure, launch | No management access | No management access |
| Complete assessments | Assigned HR or other permitted contribution | Assigned evaluations | Assigned self, peer, or upward contribution |
| Finalize and release | HR-controlled actions | No | No |
| View released results | Authorized company | Permitted team | Own results |
| 202 Files | Authorized employees | Permitted team | Unavailable |
| Reports and directory | Authorized reports and Employees | Permitted reports and My Team | No general reports or directory |

Employees cannot reassign their goals or edit manager/HR-assigned goal configuration. Progress permission does not imply configuration permission. Creator identity and original attribution remain unchanged after edits. Completed personal goals restrict configuration; milestone-based completion and returned-for-revision cases follow the existing progress permission checks.

Manager verification is tied to the assigned Manager evaluator and current stage, not merely possession of an HR role. HR monitors readiness and cannot silently substitute a different verifier. HR release is separate from completion. Released results do not grant access to confidential 202 Files or protected evaluator identities.

The profile menu provides Preview as User Type for demonstration. A production deployment must resolve roles from an authenticated identity and enforce equivalent rules on the server. A role or company change invalidates incompatible return context and prevents stale access.

## 4 System Modules

### Dashboard

Use a shared component structure with role-specific scope, metrics, panels, and actions. The header places the title and subtitle on the left and compact 44px toolbar filters on the right. Filters wrap cleanly on smaller screens without becoming a stacked form. HR has Period, Review Cycle, and Department; Managers have Period and Review Cycle; Employees have Period only. Custom periods require valid start and end dates.

| Role | Four primary KPI cards | Main panels |
| --- | --- | --- |
| HR Administrator | Total Review Assignments; Review Completion Rate; Pending Reviews; Average Goal Progress | Review Status donut; Goal Progress by Department; Review Completion by Department; Next Actions and Upcoming Deadlines |
| Manager | Team Members; Pending Evaluations; Average Team Goal Progress; Overdue Goals | Team Goal Progress; Team Review Status; Pending Evaluations; Next Actions |
| Employee | My Goals; Average Goal Progress; Pending Reviews; Completed Reviews | My Goal Progress; My Pending Reviews; Upcoming Goal Deadlines; Next Actions |

Pending dashboard work means active-cycle assignments in Not Started or In Progress that still require an evaluator response. Overdue is an additional indicator within those states. Submitted, Completed, and Locked are separate categories. Manager Pending Evaluations is the selected manager's actionable assigned work, while team status panels use permitted team records. Completion rate is finalized assignments divided by all assignments in the selected scope, with no-data handling for a zero denominator. Goal averages use permitted goals in the period; the review-cycle filter affects review information, not unrelated goals. Actions open the relevant authorized goal, assessment, cycle, or team page.

### Goals

The existing full-width table remains the operational workspace for goals. HR and Managers see their permitted scope; Employees distinguish My Goals from Assigned Goals. Search, ownership/category/status/deadline filters, status badges, progress bars, and pagination remain available. Parent rows expand independently to show indented milestones. Expansion does not change the filtered goal count.

The grouped Create and Edit Goal form contains goal name, visible description, repeatable milestones, ownership and visibility, category, optional cycle, and required deadline. Milestone rows support an optional due date and removal. Employee ownership is fixed to the current employee; HR and Manager lookups search only eligible HRDotNet employees with initials or avatars. New goals start at zero progress and do not expose a manually editable creation progress field.

Authorized milestone completion controls update the parent progress; users without progress permission see disabled completion indicators. Listing child rows do not provide milestone configuration menus or inline Add, Edit, or Remove actions. Goal configuration is managed in the permitted Create or Edit form. Goal Details retains Close and the permission-appropriate Edit Goal or progress action, plus linked evaluation verification information where applicable.

### Reviews

One expandable Reviews sidebar parent contains All Reviews and, for HR only, Templates and Cycles. Templates expands into Goals Templates and Behavioral Templates. These are separate pages; there are no horizontal tabs switching between Reviews, Templates, and Cycles. The Reviews listing retains All Reviews, My Reviews, Completed, and the Manager's Team Reviews scope where available.

Rows represent individual evaluator assignments. Completed rows open the associated Employee Evaluation Results when result access is allowed. Other rows open assessment details or the existing restricted-response explanation. Results remain reachable through the normal listing; no standalone Completed Employee Evaluations shortcut card is displayed. Search and cycle/type/department/status filters compose with the selected scope.

### Templates

Both categories provide All Templates, Draft, and Published listing tabs, defaulting to All Templates on initial load. Goals Templates show name/version, applicable position, indicator count, status, and updated date. Behavioral Templates retain description, review type, question count, version, updated date, and status. Search applies within the selected category and tab; Behavioral Review Type filtering remains available.

All Templates includes Archived records. Its Status filter preserves Archived discoverability. Draft and Published tabs omit the redundant Status filter. A Draft row opens the existing editor; a Published row opens details or preview. Tab changes never change publication state and reset the relevant pagination to page 1.

### Review Cycles

HR creates and manages cycles through the five-step wizard. The listing retains All Cycles, Draft, Active, and Completed tabs plus search, review type, period filtering, and numbered pagination. All Cycles also exposes Scheduled and Cancelled through the status filter. Non-All tabs limit records to their named status. Clearing filters retains the selected status tab. The Connected workflow sample card and Open Sample Setup button are absent; their actual cycle and linked records remain available normally.

### 202 Files

A 202 File is an employee-specific performance journal for authorized HR and Managers. Entry types include Achievement, Performance Observation, Area for Improvement, Coaching / Feedback, Performance Incident, and Other. Store employee, title, description, observation date, author, creation timestamp, optional cycle, and type. Search, entry type, and date-range filters help locate supporting records. Entries are append-only in the MVP; no unsupported edit/delete history is implied.

Journal observations add context and do not automatically alter evaluation scores. Employees cannot open 202 Files. Opening a journal from results retains the precise originating evaluation; direct journal access retains the normal Back to 202 Files route.

### Reports

HR and Managers see only authorized records. Filters cover Review Cycle, Review Period, Department, and Review Type. Measures are unique employees with finalized evaluations, finalized assignment completion rate, average eligible finalized numerical rating on a five-point scale, and assignments not yet finalized. This report-level pending measure includes Submitted and Locked work that still requires process completion, whereas dashboard pending identifies work needing an evaluator response. Label the distinction clearly.

Present these measures within report content and charts; standalone summary KPI cards belong only on Dashboard. Charts include Review Completion by Department, Performance Rating Distribution, Review Status Breakdown, and Competency Performance Summary. Count employees uniquely within the filtered scope. Count assignments individually for completion rate; never count cycles as reviews. Exclude unanswered and Not Observed responses from numerical averages. Do not treat written feedback as a numerical score or count an employee's overall score once per assessment. Empty datasets show no-data messages, not invented averages or misleading zero ratings.

### Employees and application shell

Employees is the HR workspace for the existing HRDotNet directory and performance-manager assignment. My Team is the Manager's scoped view. Identity, position, department, and official reporting information originate from HRDotNet; a performance-manager override is distinct from an official HR reporting change. Employee search and filters, bulk assignment where permitted, profile details, and pagination remain intact.

The shell uses the supplied HRDotNet Performance artwork, fixed navigation/header, company switcher, notifications, settings, and profile dropdown. Company selection uses actual available records rather than fabricated sister companies. There are no breadcrumbs. Page titles, supporting descriptions, primary actions, consistent chevrons, blue focus states, and unobtrusive Back controls preserve the existing design system.

## 5 Goals and Goals Templates Requirements

### Record relationships

A Goals Template defines reusable position-specific indicators, units, target defaults, achievement direction, indicator weights, and scoring criteria. It is not an employee's live goal and has no employee progress. An assigned employee goal is a real operational record with an owner, deadline, progress, milestones, actual outcomes, and verification history. The Goals module is the workspace for those records.

Evaluation Setup in a Review Cycle links each participant to a compatible published Goals Template and maps its required indicators to actual assigned goals. Each link retains the goal ID, indicator ID, employee-specific target, unit, direction, weight, score criteria, and verification requirement. One cycle may contain multiple positions and multiple Goals Templates. Position matching must use the existing employee position; one template must not be applied to every employee merely because they share a cycle.

The assignment dialog in Evaluation Setup can reuse an eligible existing goal or create a real assigned goal from an indicator. Existing goals must belong to the selected employee, be assigned rather than personal, and overlap the evaluation period. One employee's same goal cannot be mapped twice. Assignment saves actual goal records and links before launch. Launch snapshots configuration and generates assessments; it must not duplicate goals already assigned.

### Configuration and tracking

Goal name and deadline are required. Description is a visible multiline field. Category uses the existing Quality, Delivery, Growth, and Collaboration values. Cycle is optional for general goals; cycle-linked evaluation goals must meet readiness validation. Ownership lookups enforce company and role scope. Preserve original creator and creation date on edits, along with immutable employee identifiers.

For a milestone-based goal, Progress = completed milestones / total milestones × 100, rounded for display. Without milestones, retain manual progress constrained to finite values between 0 and 100. Existing sample progress must not be recalculated merely by loading or viewing the listing. Switching an existing manual goal to milestone tracking, or removing the last milestone and returning to manual tracking, requires the applicable confirmation before saving. Cancel leaves the existing goal intact.

Milestones store a stable ID, name, optional due date, completion state, and actual completion date. Incomplete milestones become Overdue after their own due date. Completion after that date displays Completed (Late). Reopening clears the applicable completion date. A late milestone does not make the goal overdue until the parent's own deadline has passed and progress is below 100. The listing preserves existing column alignment and child-row styling and displays No milestones added yet for an empty expansion.

### Actual achievement and verification

Progress describes work completion, not an approved evaluation rating. A goal at 100% is not automatically verified. Its owner records a finite nonnegative actual outcome for the cycle. Below 100%, the actual is Reported; at 100%, recording submits it as Pending verification. An eligible Manager evaluator may verify achievement or return it for revision with a reason. Partial completion may still receive a verified outcome and score under configured criteria.

Verification is cycle-specific and records actor, time, reason, and a signature of the relevant goal evidence. Changes to that evidence invalidate the old approval and display Changed — verify again. Managerial submission and HR finalization must reject goals with missing, returned, stale, or otherwise unverified outcomes. A returned goal allows the employee to correct permitted progress and evidence before re-verification.

## 6 Behavioral Templates Requirements

HR maintains reusable forms with a name, description, review type, category, version, and ordered questions. Questions support rating-scale and written responses, plus existing choice controls where configured. Rating questions retain labels, required flags, optional comments, and Not Observed support. Written questions collect strengths, improvement areas, recommendations, or other configured feedback and do not contribute numerical scores.

Drafts can be saved without satisfying every publication rule. Publishing validates required template information and question configuration. Only Published, position-compatible Behavioral Templates are eligible for new cycle configuration. Archived records remain discoverable but cannot be newly selected. Editing a published form creates the existing versioned draft workflow; launched assignments retain the question snapshot used at launch.

Evaluation Setup chooses a default Behavioral Template and optional explicit mappings by position. The cycle resolves a compatible published template for every participant. Each assessment stage collects that evaluator's own response against the resolved snapshot. Preview allows HR to inspect the form before use. Goals indicators remain in Goals Templates and are not merged into the Behavioral listing or question builder.

## 7 Review Cycle Creation

### Wizard structure and saved drafts

Use five steps: Cycle Details, Select Participants, Evaluation Setup, Assessment Workflow, and Review & Launch. There is no separate Results & Release step. Save as Draft, Back, Continue, stepper state, and validation use this sequence. Moving forward validates the required information for the preceding steps; validation errors identify the correct current step and field. Earlier steps remain revisitable without losing configured fields or selections.

Only new or editable draft cycles adopt the simplified MVP configuration. Preserve draft identity, cycle fields, participants, goal links, targets, templates, position mappings, evaluator assignments, deadlines, and confidentiality settings. Retain original component, weight, scoring, and saved-step settings as migration history before adopting the new defaults. Old steps 1–4 retain their numbers, old Results & Release step 5 resumes at Assessment Workflow step 4, and old Review & Launch step 6 resumes at step 5. Further saves use the five-step format. Migration is idempotent. Launched, scheduled, completed, and released cycles retain their existing calculation and snapshots.

### Step 1 Cycle Details

Purpose: establish the cycle identity, evaluation period, and assessment opening date. Required fields are Cycle Name, Review Type, Evaluation Period Start, Evaluation Period End, and Assessment Start Date. Description is optional. Supported types are Standard Performance Review, 360° Feedback, Probationary Review, and Project-Based Review.

Validate nonblank name, supported type, real calendar dates, and evaluation period end on or after its start. The assessment opening date is distinct from the performance evaluation period. The final deadline comes from the last assessment stage. HR can save an incomplete draft or Continue after valid cycle details. Later goal eligibility depends on this period and must be checked again if it changes.

### Step 2 Select Participants

Purpose: exclusively select the employees included in the cycle. Keep Employee search, Department and Position filters, the employee selection table, checkboxes, selected count, and functional numbered pagination. Require at least one unique employee within HR's authorized company scope. Selections persist across filters and pages. Save as Draft, Back, and Continue remain available.

Do not display Goals Templates, assigned-goal counts, goal readiness, or goal configuration actions here. This step depends on the cycle identity and period from Step 1, but unresolved goals do not prevent selecting participants or proceeding to Evaluation Setup. The next step resolves goal readiness for the selected employees.

### Step 3 Evaluation Setup

Purpose: review the actual goals included in the evaluation and select the reusable behavioral assessment. Goals Performance and Behavioral Performance are both standard required MVP components. Use two full-width, vertically stacked sections with normal section spacing. Do not display component toggles, percentage weighting inputs, scoring-policy dropdowns, or technical scoring configuration text.

Goals Performance uses the description Review the assigned goals that will be included in this evaluation. Its table columns are Employee, Applicable Goals Template, Assigned Goals, and Action. Show employee name and position, the applicable published position-specific template and version, and the number of eligible actual assigned goal records linked from Goals. The count is not the number of template indicators alone. Maria, James, and Sofia each have three linked assigned goals in the sample cycle.

Review Goals opens an inspection modal with the actual goal names, configured targets, progress, and deadlines. Back to Evaluation Setup or closing the modal preserves the current step and all wizard fields. The existing assignment dialog remains available through Manage Goal Assignment. If there are no eligible linked goals, show No goals assigned and Assign Goals. Assignment can reuse existing employee goals or create actual assigned goals from an eligible template. Preserve existing progress and avoid duplicate mappings. The existing dialog validates employee scope, compatible published template, finite nonnegative targets, required deadlines within the evaluation period, unique mappings, complete indicators, and indicator weights totaling 100%.

Show a compact readiness summary, for example 3 of 3 participants ready. Readiness requires valid employee ownership, published position-compatible template, actual linked goals in the period, all required indicators mapped, valid target/score criteria, and complete weights. Missing or stale mappings block valid forward progression and launch and point to Step 3. Saving an incomplete draft remains available. Assignment saves actual Goals module records and the draft mapping; launch does not create duplicate goals.

Behavioral Performance uses the description Select the behavioral template used to assess workplace behaviors. Provide one required Behavioral Template dropdown, selected version, question count, and Preview Template. New setup defaults to a published reusable template; saved explicit selections remain until HR changes them or resolves validation. If no suitable published template exists, show an empty selection and block launch until resolved. An optional collapsed Customize by Position section retains explicit position mappings. Every participant must resolve to a compatible published template through the default or override. Preview closes back to the same setup context without saving preview responses. Do not repeat template selectors for every assessment stage or repeat the full employee table in this section.

Internally, new and migrated draft setups use manager-verified goal criteria and average eligible observed numerical behavioral responses. Both dimension ratings use the five-point scale. Overall Performance Rating = (Goals Performance Rating + Behavioral Performance Rating) / 2. This proposed fixed equal-contribution default is pending HR confirmation and is not a permanent approved company scoring policy. Preserve the criteria and five-point conversion of Goals Templates; simplifying the wizard does not replace verified goal evidence with progress percentages.

### Step 4 Assessment Workflow

Purpose: define the assessment sequence, assigned evaluators, and individual stage deadlines. Preserve the default Self-Assessment → Managerial Assessment → HR Assessment sequence. Each stage needs a stable ID, name, supported type, valid deadline, and authorized evaluator for every selected employee. Keep separate responses and submission status for each stage. Stages use shared cycle Goals and Behavioral configuration rather than repeated template selectors.

Self resolves to the employee; a non-Self evaluator cannot be that same employee. Manager defaults use the performance reporting relationship; HR resolves to authorized HR. Deadlines must be real dates on or after assessment start and strictly increase through the configured sequence. The Manager verification stage remains required. Existing supported stage-management controls remain available, with production permission for additional stages still requiring HR confirmation.

Include the simple release statement Manual release by HR Administrator. Necessary prior-stage information and optional Peer/Upward confidentiality controls remain in a collapsed Feedback Visibility section. Default prior-stage access is status/submission metadata only; an optional setting allows authorized named responses from earlier submitted stages. Anonymous response minimum remains a whole number from 2 to 10 when applicable. Preserve saved access settings while validating them.

HR can Save as Draft, go Back, or Continue. Only the first eligible assessment opens initially; later stages unlock separately for each employee after the preceding submission. A deadline does not bypass a lock. Actual finalization and release are post-assessment actions and cannot be performed in creation. This step depends on the participants and shared evaluation setup.

### Step 5 Review and Launch

Purpose: confirm a concise summary before creating evaluator work. Show cycle name/type and evaluation period, assessment start, selected participants and assigned-goal readiness, default Behavioral Template/version/count and any explicit position overrides, assessment sequence, employee-to-evaluator mappings, individual deadlines, and manual HR result-release configuration. This step introduces no additional configuration fields or weighting choices.

Run whole-cycle validation and display actionable errors linking to the correct step and field. Reject missing required information, out-of-scope employees, missing or incompatible templates, incomplete/duplicate goal mappings, invalid targets or indicator criteria, missing verification stage, unauthorized evaluators, invalid deadline order, and a final deadline already past. Missing goals route to Evaluation Setup, not participant selection. Save as Draft remains available; launch is disabled until blocking issues are resolved.

HR confirms Launch Cycle for a current assessment start or Schedule Cycle for a future start. Retain the confirmation modal. Snapshot templates, goal links, criteria, internal proposed 50/50 calculation, and evaluator mappings; generate individual assignments while retaining actual goal IDs. Open only the first eligible stage when the cycle is active. Finalization and release occur later through their existing authorized actions. Managers and Employees cannot invoke administrative creation or launch directly.

## 8 Sequential Assessment Workflow

A Review Cycle coordinates a period and participants. An Employee Evaluation is the complete cycle-plus-employee record. An Assessment is a single evaluator's assigned contribution. Three default stages for three employees therefore create three employee evaluations and nine assessment assignments; those counts must never be interchanged.

The default sequence is Self-Assessment → Managerial Assessment → HR Assessment. Sequential eligibility is evaluated for each employee. One employee's self submission can unlock that employee's Manager stage without unlocking another employee's stage. Locked assignments show their dependency and cannot be edited. Deadlines flag late work and do not bypass dependencies.

Opening an actionable assessment or saving answers marks it In Progress. Evaluators can save drafts without submission. Submission validates required answers, allowed rating values and choices, and any Manager goal-verification prerequisites. A confirmation precedes the committed submission. The submitted response becomes read-only and the next stage becomes eligible. The final stage's submission does not itself finalize or release an employee evaluation.

HR monitors assignment progress and overdue work, maintains authorized evaluator mappings, and performs finalization only after the required submitted contributions and current verified goal results exist. The current finalization action operates through the cycle and completes its required employee evaluations together. Independent per-employee administrative finalization is not promised by this MVP. Reopening submitted work must use the existing controlled workflow and cannot be assumed to be an evaluator's unrestricted right.

## 9 Evaluation Scoring and Results

### Goals Performance

Only linked goals with current verified actual outcomes are eligible for the configured goal score. In the current explicit criteria model, Higher direction meets target when actual is at least target; Lower meets target when actual is at most target. The template/link supplies a five-point score for target met and another for below target. Each indicator contributes its configured score multiplied by its weight; weights total 100%. Goals Performance is the sum of these weighted scores.

For Higher indicators, achievement percentage can be displayed as actual / target × 100 for positive targets. Zero targets use a Target Met determination rather than division by zero. Lower indicators use their direction-aware comparison; no misleading inverse achievement division is used. Progress percentage is displayed separately and is never substituted for the performance rating.

Example only: three indicators weighted 34%, 33%, and 33%, with scores 5.0, 5.0, and 3.5, produce 4.505 out of 5, displayed as 4.51. These target-met scores and weights demonstrate the configurable mockup policy. HR has not approved them as a universal company formula.

### Behavioral Performance

Rating questions use the five-point scale. New and migrated draft cycles average eligible observed numerical answers across the required assessment contributions. This aggregation default is internal and has no wizard policy selector. Existing launched and historical cycles retain their previously selected averaging or authoritative-evaluator policy. Unanswered and Not Observed values are excluded from both numerator and denominator. Written and choice responses do not become numerical scores. No eligible numerical data means unavailable, not zero.

Prior-stage visibility does not determine which evaluator supplies the official score. A last-submitted evaluator must not silently override the cycle's saved behavioral aggregation rule. Anonymous feedback follows its confidentiality threshold, and protected identities must remain protected in results and exports.

### Overall calculation and preservation

For new and migrated draft cycles, both dimensions are required and Overall = (Goals Score + Behavioral Score) / 2. Both inputs must be eligible five-point ratings. Internally this equals 50% for each dimension; users do not configure percentages in creation. Use unrounded component values and round displayed ratings to two decimals. If either required dimension lacks a valid score, do not fabricate a consolidated result.

This 50/50 calculation is a proposed MVP default pending HR confirmation, not an approved permanent policy. Previously launched, scheduled, and completed cycles retain their original component settings, configured weights, and frozen results; existing single-component history remains valid as historical data.

A new cycle with Goals 4.5 and Behavioral 3.5 produces 4.0 overall using the proposed equal-contribution default. The preserved historical sample uses its original 60/40 weighting: Goals 4.505 plus Behavioral 4.0666667 produce approximately 4.33 overall. This is a demonstration calculation, not an approved rating classification or employment decision. Rating bands and production precision rules require HR confirmation.

HR finalization validates submission and verification prerequisites and freezes the evaluation evidence. Preserve employee/cycle identifiers, template versions, linked goal criteria and targets, actuals, milestones/progress at evaluation, verification, assessment responses, component scores, selected scoring policy, weights, and consolidated result. Later live goal or template edits must not rewrite finalized historical results. Explicit HR release controls subsequent result visibility. Audit records should identify who submitted, verified, finalized, released, or reopened work and when; durable server audit storage is a production dependency.

## 10 Employee Evaluation Results

The existing results page follows this order and preserves employee and cycle identity throughout:

| Order | Section | Required content |
| --- | --- | --- |
| 1 | Employee and Evaluation Overview | Name, employee ID, position, department, cycle, evaluation period, completion state, release visibility, overall rating. |
| 2 | Performance Overview | Goals and Behavioral scores with configured weights and applicable context. |
| 3 | Goals Performance | Linked assigned goals, target/unit, recorded actual, achievement where meaningful, progress, verification, indicator score and contribution. |
| 4 | Behavioral Performance | Competencies/questions, permitted evaluator contributions, eligible ratings, comments, aggregation context. |
| 5 | Assessment Summary | Individual stages, evaluators subject to confidentiality, deadlines, submission/completion states, authorized detail links. |
| 6 | Overall Performance Summary | Enabled components, scores, weights, contributions, and transparent consolidated calculation. |
| 7 | Written Feedback | Available strengths, improvement areas, and recommendations, with response confidentiality retained. |
| 8 | Supporting Performance Records | View 202 File for authorized HR and Managers only; journal evidence does not automatically alter scores. |

Completed demonstration records contain both Goals and Behavioral data. For an existing single-component historical evaluation, show an appropriate Not configured or unavailable explanation for the absent dimension rather than inventing historical evidence. Snapshot data governs historical results even if live templates change. Results are available only under the authorized release rules. Back to Reviews retains the normal listing workflow.

## 11 Navigation and Interaction Requirements

### Listing structure and pagination

Affected listings use the existing page header, description, primary create action where permitted, status/scope tabs, toolbar, full-width white table, and footer. Tables retain their columns, typography, borders, status badges, and row styling. Toolbar padding is approximately 24px horizontally and 20–24px vertically; fields are 44px tall with 16px gaps. No large gap separates toolbar and table. Main listings have no Actions column; authorized record actions live in details.

The footer shows Showing X–Y of Z records on the left, with 10/20/50 rows per page, Previous, clickable numbered pages, and Next on the right. Default is 10. The current number has blue active styling and current-page semantics. Use ellipses for large page counts. Disable boundary navigation; retain page 1 and footer for a single page or an empty set. Empty range is Showing 0–0 of 0 records. Search and filter changes reset or clamp the page; tab and page-size changes reset to page 1. Count parent records, never expanded milestones.

Search composes with filters and tabs. Reset controls clear applicable filters without changing publication states or records. Row activation supports pointer and keyboard Enter/Space; nested controls must not also activate the parent row. Parent goal chevrons alone expand milestones; goal name/row activation still opens details. Reuse the shared outline chevron consistently in navigation, lookups, and filters with centered alignment and blue focus.

### Context-aware return navigation

When results open a related 202 File or assessment, retain employee ID, cycle ID, evaluation record ID, source page, applicable listing state, role/company context, and practical scroll position. The related page displays Back to Evaluation Results and returns to that exact originating evaluation. Maria's related record must never return to James's evaluation or a generic first result. Permission and identity checks run again on return.

Direct 202 Files navigation retains Back to 202 Files. Direct assessment navigation retains its normal review workflow. Normal results Back to Reviews returns to Reviews. Do not create duplicate detail pages or rely only on generic browser history. Changes in user role, company, or unrelated navigation clear incompatible return context. Unsaved-response protection continues to apply before navigation.

### Forms and confirmations

Draft saves preserve configured fields and answers; current draft storage is local browser storage. The five-step migration preserves original draft settings as history while adopting the proposed fixed 50/50 MVP defaults for editable setup. Old saved steps map to the revised sequence; subsequent saves and reloads retain the selected new step. Unsaved-change dialogs offer keep editing or discard rather than silently losing edits. Required markers remain inline with their labels. Validation identifies the field and reason and preserves entered values. Real dates, numeric bounds, weight totals, compatible templates, scoped employees, and workflow prerequisites are checked before saving or launching where relevant.

Retain confirmations for destructive milestone removal, tracking-method changes, archive, assessment submission, cycle launch, finalization, and release as provided by their existing workflows. Modal X and Close controls work, focus is visible, and buttons remain aligned with the current design. No breadcrumbs or temporary demo shortcut containers are introduced.

## 12 Status Definitions

| Record | States or indicators | Meaning and transition |
| --- | --- | --- |
| Goal | Active; Completed; legacy Pending Approval | Progress below 100 is active; 100 is progress-complete. Pending Approval remains for existing records and does not replace cycle verification. |
| Goal deadline | Overdue indicator | Parent deadline has passed and progress is below 100; independent from child milestone lateness. |
| Milestone | Pending; Overdue; Completed; Completed (Late) | Derived from completion flag, optional deadline, and actual completion date. |
| Goal verification | Not submitted; Reported; Pending; Verified; Returned | No actual; actual reported below full progress; submitted for verification; Manager accepted; Manager requested revision with a reason. |
| Verification validity | Changed — verify again; Configuration changed | Evidence signature changed, or linked goal is no longer valid; old verification cannot authorize scoring. |
| Template | Draft; Published; Archived | Editable unpublished configuration; eligible published version; retained but unavailable for new selection. |
| Review Cycle | Draft; Scheduled; Active; Completed; Cancelled | Configuring; future start; open assessment workflow; HR-finalized required work; cancelled workflow retained for discovery. |
| Assessment | Locked; Not Started; In Progress; Submitted; Completed | Dependency not met; available but untouched; opened/saved; response submitted; finalized workflow state. |
| Assessment deadline | Overdue indicator | Available unsubmitted work past deadline; does not unlock later work or count as a separate assignment. |
| Employee Evaluation | Awaiting required stages; awaiting HR finalization; Completed | Employee-level aggregation of required assessments and verified goal outcomes; finalization is separate from last submission. |
| Result visibility | Not released; Released | Completed evidence may remain withheld until explicit HR release; release does not bypass scope or confidentiality. |

Assessment Summary can display a submitted stage even after its parent cycle is finalized. Preserve its submission metadata while recognizing finalized assignment completion. Completed assessments, completed employee evaluations, and completed cycles are different record levels, even when a single finalization operation advances all of them.

## 13 Sample Data and Demonstration Scenarios

The preserved Annual Performance Review 2026 example includes Maria Cruz, James Santos, and Sofia Garcia in one cycle, using their respective published position-specific Goals Templates. Each employee has three linked assigned goals. Reuse actual goal IDs where appropriate rather than duplicating them at launch. Separate completed and historical cycles retain their original evaluation periods and frozen result evidence.

| Employee | Position | Example assigned goals |
| --- | --- | --- |
| Maria Cruz | Product Designer | Timely Completion of Design Deliverables; Accurate Design Documentation; Developer Handoff Completion. |
| James Santos | Software Engineer | Sprint Deliverable Completion; Code Quality Compliance; Timely Resolution of Assigned Bugs. |
| Sofia Garcia | Marketing Specialist | Campaign Delivery; Marketing Lead Generation; Campaign Reporting. |

The completed annual example contains Self, Manager, and HR contributions, verified actual goal results, Behavioral ratings, and written feedback. Under its illustrative 60/40 policy, the displayed Goals score is 4.51 for each employee; Behavioral scores are about 4.07, 4.20, and 3.80, producing overall ratings of 4.33, 4.38, and 4.22 respectively. These are sample outcomes, not real personnel findings or official benchmarks.

Other completed demonstration evaluations retain their own goal evidence, behavioral answers, employee identities, and history. Record totals can vary with previously saved local prototype activity; the interface derives counts from current records rather than a fixed “8 evaluations” label. Removing shortcut cards changes no cycle, assigned goal, assessment, snapshot, or completed result.

Demonstrate the normal route Reviews → Completed → select the employee assignment → Employee Evaluation Results. Also demonstrate the draft annual cycle through Cycles, the three employees' live goals through Goals, and supporting journal entries through authorized 202 Files navigation.

## 14 Functional Requirements and Acceptance Criteria

Each identifier defines a required behavior and a testable acceptance condition. The criteria below specify product acceptance; they are not a claim that every production requirement is implemented or verified.

### Identity and access

FR-ACCESS-001 — Enforce role, company, record, and workflow authorization. Given an Employee or Manager, direct invocation of template/cycle management must be rejected as well as hidden in navigation. Given a different company or unauthorized employee, related records and exports must remain inaccessible.

FR-NAV-001 — Retain one Reviews parent. HR sees All Reviews, Templates with separate Goals/Behavioral children, and Cycles. Manager and Employee do not see administrative template or cycle routes. All roles retain their appropriate Dashboard.

FR-DASH-001 — Render the selected role's four KPI cards and panels from permitted filtered records. Switching role updates immediately. Submitted and Locked work must not increase Completed or actionable Pending counts. Zero-data filters show an empty state.

### Goals and templates

FR-GOAL-001 — Create an owned goal with required name, category, and deadline. Given Employee creation, ownership is fixed to that employee and saved progress starts at zero. HR/Manager lookup cannot select an out-of-scope employee.

FR-GOAL-002 — Preserve configuration and progress permissions separately. Given an employee's assigned goal, the employee can perform permitted progress updates but cannot reassign it or change assigned configuration. Saving an edit preserves original creator identity.

FR-GOAL-003 — Calculate milestone progress and preserve manual tracking. Given two of four milestones completed, show 50%; no milestone bars appear. Cancelling first/last-milestone tracking conversion leaves the saved goal unchanged.

FR-GOAL-004 — Preserve dates and independent overdue logic. Completing a milestone after its optional due date records completion and shows Completed (Late); the parent remains current unless its own deadline has passed. Expanded rows do not change parent pagination counts.

FR-GOAL-005 — Separate actual achievement from progress. Recording actuals must not silently change progress. Manager verification stores current evidence; modifying relevant evidence invalidates verification and blocks dependent finalization until verified again.

FR-TPL-001 — Keep Goals and Behavioral categories separate with All Templates, Draft, Published tabs. Selecting Draft filters only drafts and resets to page 1. Search and Behavioral Review Type combine with the selected tab. All Templates plus Archived still locates archived records.

FR-TPL-002 — Route Draft rows to editing and Published rows to details/preview. Tab switching leaves all publication states unchanged. Create, Save as Draft, Publish, Preview, Archive, and version history behavior remain available under HR permissions.

FR-TPL-003 — Validate publishable criteria and preserve snapshots. Goal indicator weights total 100 and scores lie from 1 to 5. A launched assessment's template remains unchanged when HR later publishes another version.

### Cycles and assessments

FR-CYCLE-001 — Provide all five wizard stages in order, with Select Participants limited to employee selection and all goal readiness in Evaluation Setup. An incomplete draft can be saved and resumed; an invalid launch shows linked step/field errors. Future assessment start schedules rather than immediately opens the cycle.

FR-CYCLE-002 — Support mixed-position participants with compatible published Goals Templates. Maria, James, and Sofia can share one cycle with three different template mappings. Missing goals, incompatible position, duplicate mapping, and unauthorized employees block valid launch and link to Step 3 for goal corrections.

FR-CYCLE-003 — Link actual goals before launch and retain their progress. Reusing the sample mappings must not increase the number of existing goals during launch. Creating a new assigned goal through the dialog must make it visible in Goals.

FR-CYCLE-005 — Migrate editable drafts without losing employee, goal, template, evaluator, deadline, or confidentiality data. Old step 6 resumes at new step 5; old release step 5 resumes at workflow step 4. Saving and reopening uses the revised step. Launched and completed records retain their existing snapshots and calculation.

FR-CYCLE-004 — Preserve All Cycles, Draft, Active, Completed tabs and discover Cancelled/Scheduled in All Cycles. Changing tabs resets the page. No Connected workflow sample card or empty residual container remains.

FR-ASMT-001 — Enforce employee-specific sequential unlocking. With Maria's Self stage unsubmitted, her Manager stage cannot be edited. After Maria submits, her Manager stage opens while James's remains locked if his Self stage is unsubmitted.

FR-ASMT-002 — Validate submission and preserve drafts. Missing required answers or invalid ratings block submission without losing answers. A successful submit becomes read-only, records submission time, and does not automatically finalize or release results.

FR-ASMT-003 — Require current verified actual goals before Manager submission in a goal-enabled workflow. An unverified or stale goal prevents submission; returning the goal requires a reason and allows correction under the owner's permissions.

### Results and reporting

FR-RESULT-001 — Freeze finalized evidence and calculate configured components. Given the 34/33/33 example, the goal score is 4.505 before display rounding. Given a new cycle with Goals 4.5 and Behavioral 3.5, the proposed equal-contribution result is 4.0. No weighting or policy selectors appear in creation. Historical 60/40 results remain unchanged; all totals use unrounded component scores. Missing enabled dimensions do not become zero or an invented final rating.

FR-RESULT-002 — Separate finalization and release. After all required stages submit, HR finalization is still required. A completed but unreleased evaluation remains unavailable to employee result access. Release exposes only the authorized employee/team results.

FR-RESULT-003 — Retain eight results sections in the prescribed order and all sample evidence. Completed demonstration records show linked Goals and Behavioral results. Written feedback and authorized supporting records remain available after shortcut removal.

FR-NAV-002 — Preserve exact return context. Test Maria results → 202 File → Back to Maria results; Maria results → each readable assessment → Back to Maria; James results → 202 File → Back to James; direct 202 File → Back to listing; results → Back to Reviews. Restore practical scroll context and reject stale role/company return access.

FR-JOURNAL-001 — Allow scoped HR/Manager journal access and append-only observations. An Employee cannot access a 202 File through either normal navigation or a related-record route. Adding an observation must not change numerical evaluation scores.

FR-REPORT-001 — Reconcile filtered reporting. Given the same permitted assignment set, completion percentage equals Completed / total × 100; employee totals are unique; Not Observed and unanswered responses do not lower numerical averages. No-data conditions display an appropriate empty state.

### Shared interactions and preservation

FR-UI-001 — Retain numbered pagination across main listings. Page 2 opens directly, Previous/Next disable at boundaries, and 10/20/50 options update ranges correctly. Single-page and empty tables retain footer and page 1. Tabs reset to page 1 without losing the selected tab.

FR-UI-002 — Preserve existing table design and row interactions. Columns, full-width header/rows, filters, focus states, details, and modal controls remain intact. Nested chevrons, checkboxes, and buttons do not trigger parent-row navigation.

FR-DATA-001 — Remove only temporary shortcut rendering. Before and after the listing cleanup, cycle IDs, employee IDs, assigned goals, templates, assessments, and result snapshots remain unchanged. Every authorized completed evaluation remains reachable through Reviews → Completed.

FR-PROD-001 — Implement server-backed identity, authorization, persistence, concurrency protection, audit history, backup, and secure exports before production. Acceptance requires negative permission tests, stale-write handling, persistent draft recovery, and deployment-specific security and accessibility review; local role-preview success alone does not satisfy this requirement.

## 15 Assumptions Dependencies and Open Decisions

### HR decisions required

| Decision | Current prototype behavior | Confirmation required |
| --- | --- | --- |
| Official Goals formula | Direction-aware target-met/below criteria with five-point scores and indicator weights | Approved formula, thresholds, treatment of partial or exceptional outcomes, and rating bands. |
| Default component weighting | Both components are required; proposed fixed 50% Goals / 50% Behavioral for new and migrated draft cycles, without wizard percentage fields | HR approval or revision of the proposed equal-contribution MVP default; any future override authority. Historical weights remain unchanged. |
| Behavioral aggregation | New and migrated draft cycles internally average eligible observed ratings; older launched records retain their saved policy | Confirm the MVP averaging default, evaluator weighting if needed, and handling no observed ratings. |
| Reopening submitted work | Controlled existing workflow; submitted responses are read-only | Authorized initiator, reason, audit, downstream invalidation, and post-release restrictions. |
| Additional assessment stages | Existing configuration represents Peer and Upward as well as Self/Manager/HR | Approved stage types, repetition, evaluator conflicts, anonymity thresholds, and sequence rules. |
| Result release | HR explicitly releases after cycle finalization; employee and permitted manager visibility retained | Named production release authority, delegated roles, exceptions, notification policy, and per-employee release need. |
| Verification and finalization | Assigned Manager verifies; current HR action finalizes required cycle work together | Delegation/absence handling, correction authority, independent employee finalization, and late-cycle exceptions. |
| Historical correction | Frozen results stay unchanged by later live edits | Approved amendment/version process, evidence retention, and correction visibility. |
| Calendar and deadlines | Local sample workspace dates drive the demonstration | Production timezone, date boundaries, reminders, grace periods, and leave/absence handling. |

### Dependencies and implementation boundaries

HRDotNet must provide stable employee identifiers, active-company access, positions, departments, and official reporting relationships. Performance-manager overrides need an agreed synchronization and conflict policy. Production identity, server persistence, transaction safety, notifications, file retention, and audit services must be selected and integrated. Drafts, submissions, verification signatures, and finalized snapshots require durable storage and concurrency protection.

Results and exports must preserve confidentiality and tenant scope. Production accessibility must cover keyboard operation, focus restoration, associated errors, dialog focus behavior, and readable contrast. Larger data volumes require server filtering/pagination with totals equivalent to the current local interaction model. Backup, restoration, retention, service availability, and measurable response-time targets require deployment decisions.

The supplied logo artwork is the branding reference. Existing local sample dates, names, ratings, observations, and example scoring values support demonstrations only. Earlier requirements for a separate Results & Release creation step, optional evaluation components and user-configured cycle weighting/scoring selectors are superseded for new setup. Earlier requirements for manager-created cycles, horizontal Reviews/Templates/Cycles page tabs, organization charts for Employees, standalone listing KPI cards, and automatically finalized submissions are superseded by the role, navigation, dashboard, and sequential workflow rules in this specification.
