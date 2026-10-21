# PMSDotNet Product Requirements Document

Version 1.1 | 21 October 2026 | Status Updated baseline for product review

Audience Product owners, HR stakeholders, designers, engineers, and quality assurance

## 1 Executive summary

PMSDotNet is a performance management system for HR administrators, managers, and employees. It brings goals, reusable evaluation forms, review cycles, individual evaluator assignments, and released results into one workspace. It should help HR coordinate a consistent process, managers evaluate their permitted teams, and employees act on their goals and assigned feedback.

The MVP uses three roles and one shared application shell. HR owns templates, cycle setup, evaluator assignment, finalization, and result release. Managers evaluate assigned employees and monitor direct reports. Employees manage personal goals, update assigned goals, complete assigned assessments, and view their own released results. Review submission and workflow completion are separate events. Goals use a grouped creation form and expandable milestone rows within the existing table. Milestone tracking calculates goal progress automatically while preserving existing manual progress until a tracking change is confirmed.

This document defines the intended MVP behavior and its acceptance criteria. The current local HTML prototype demonstrates the interaction model with sample records and browser storage. Production controls described here are implementation requirements, not claims that a backend, identity provider, or live HRDotNet connection already exists. The latest approved UI direction takes precedence over earlier mockup variations.

## 2 Problem and objectives

Performance management needs clear ownership, visible deadlines, and consistent evaluation criteria. A cycle is an administrative container; each evaluator response is a separate review assignment. Confusing those concepts produces misleading completion counts and unclear responsibilities. The product must also protect confidential feedback and separate response submission from the release of evaluation outcomes.

### Product objectives

- Give each role a focused Dashboard and actionable next steps.
- Let HR configure and launch standard and 360 degree reviews using reusable templates.
- Let evaluators save drafts and submit complete, validated responses.
- Let employees distinguish personal goals from goals assigned by managers or HR.
- Provide consistent reporting from permitted assignment records and eligible finalized scores.
- Reuse HRDotNet employee identities and reporting relationships without overwriting official HR records.
- Keep navigation, page titles, and page actions available while long content scrolls.

### Proposed outcome measures

These measures require production instrumentation. They are proposed evaluation criteria, not existing measured results or approved contractual targets.

| Measure | Definition | Proposed target |
| --- | --- | --- |
| Workflow task success | Users complete representative goal and review tasks without assistance | At least 90 percent during usability testing |
| Assignment integrity | Generated assignments have a valid subject, evaluator, cycle, and template snapshot | 100 percent |
| Reporting reconciliation | KPI and chart totals reconcile to the same filtered permitted dataset | 100 percent of acceptance fixtures |
| Permission enforcement | Unauthorized navigation, reads, mutations, and exports are rejected | All negative authorization tests pass |
| Draft reliability | A successfully saved draft can be reopened with identical answers | All persistence acceptance tests pass |

## 3 Scope and release boundaries

### Included in the MVP

The MVP includes the application shell, navigation search, company selection, notifications, account preferences, role-specific Dashboards, Goals, Reviews, Templates, Cycles, Reports, My Team, and Employees. It includes form building and preview, evaluator selection, draft saving, submission, finalization, result release, confidentiality rules, manager assignment, and scoped CSV exports where supported.

The prototype includes a nested Preview as User Type menu to demonstrate Employee, Manager, and HR Administrator experiences. This menu is a demonstration feature. Production role authorization must come from authenticated identity and permissions.

### Outside the MVP

- Payroll, compensation decisions, salary calculations, and benefits administration.
- Recruitment, attendance, leave, inventory, and employee master-data authoring.
- AI-generated ratings, automatic employment decisions, calibration, succession planning, and forced ranking.
- Native mobile applications, offline synchronization, external evaluator portals, and advanced workflow customization.
- Production account impersonation and unrestricted organization administration.
- New sister-company records merely to populate the prototype switcher.

### Delivery constraints

Continue the existing PMSDotNet implementation and visual system. Preserve established forms, tables, filters, and review workflows. Current changes remain local unless a later instruction explicitly authorizes source-control publication or deployment. Documentation creation does not authorize staging, committing, pushing, or publishing the application.

## 4 Users and permission model

The MVP has three business roles. A separate platform operator may be needed for production infrastructure, but no fourth business-user workspace is required for this release. Authorization combines role, company, reporting relationship, assignment ownership, cycle state, release state, and confidentiality rules.

| Capability | HR Administrator | Manager | Employee |
| --- | --- | --- | --- |
| Dashboard | Organization scope | Permitted team and own assignments | Own goals and assigned reviews |
| Goals | Organization goals | Permitted team goals | Own personal and assigned goals |
| Review response | Authorized monitoring and own assigned work | Own assigned evaluations | Own assigned assessments |
| Templates | Create, edit, publish, archive, duplicate, preview | No access | No access |
| Cycles | Create, schedule, launch, monitor, finalize, release | No administration access | No administration access |
| Evaluator assignment | Manage during permitted setup or reassignment | No cycle setup authority | No cycle setup authority |
| Results | Authorized released results | Released team and own results | Own released results |
| Reports and exports | Authorized organization data | Authorized team and assigned data | No Reports module |
| Employees | HRDotNet directory and PMS manager assignments | My Team read-only records | No directory module |

### Permission requirements

PERM-01 Enforce permissions on page entry, record retrieval, action execution, and exports. Hiding a menu alone is insufficient. Production enforcement must occur on the server.

PERM-02 A user assigned peer or upward feedback may complete that response even when the subject is outside their normal directory scope. Assignment access must not grant broader team visibility.

PERM-03 Employees must not receive unreleased evaluation results merely because they are the evaluation subject. Their own evaluator responses remain accessible under response permissions.

PERM-04 HR monitoring must respect anonymous-response rules. The prototype does not expose unrestricted individual anonymous responses to HR; any exceptional production access requires an explicit policy and audited permission.

PERM-05 Switching preview roles must update modules, data scope, actions, and Dashboard immediately. Preserve the selected role across navigation. Redirect to Dashboard whenever the current page is not permitted.

## 5 Information architecture

### Sidebar navigation

| Role | Ordered navigation |
| --- | --- |
| HR Administrator | Dashboard; Goals; Reviews parent with All Reviews, Templates, Cycles; Reports; Employees |
| Manager | Dashboard; My Team; Goals; Reviews; Reports when permitted |
| Employee | Dashboard; Goals; Reviews |

NAV-01 HR Reviews is one expandable parent. Each child has a dedicated title, description, content, and relevant actions. Do not use horizontal tabs to switch between Reviews, Templates, and Cycles.

NAV-02 Manager and Employee Reviews are single non-collapsible links with no submenu chevron. Templates and Cycles must remain inaccessible to those roles.

NAV-03 Goals precedes Reviews. My Team immediately follows Dashboard for managers. Employees remains the final main HR module.

NAV-04 Sidebar search filters accessible page names only. Search must include HR submenu pages, automatically reveal the relevant parent context, and navigate directly from results. Restricted pages must never appear. Show No matching pages found when appropriate; clearing the input restores normal navigation.

NAV-05 Remove breadcrumbs everywhere. Nested pages use a Back button or arrow beside the title. All Reviews, My Reviews, Team Reviews, and Completed may remain listing scope controls; these do not replace the three sidebar destinations.

## 6 Application shell and visual requirements

### Branding and structure

UI-01 PMSDotNet is the sole application name in the logo, browser title, and account surfaces. Remove PeopleDotNet and People and Performance branding. Do not copy SIMSDotNet wording into the product.

UI-02 Sidebar order is logo, company switcher, navigation search, WORKSPACE label, role navigation, and bottom user information. Use outline icons, compact spacing, subtle dividers, rounded active states, and the established product-family typography.

UI-03 The top-right navbar contains Notifications, Settings, and Profile avatar only. Remove duplicate branding, SAMPLE WORKSPACE, MVP Guide, standalone role selectors, and large role cards.

### Colors and component geometry

| Element | Requirement |
| --- | --- |
| Primary actions | Solid blue #5B9FE2; hover #438CCD; white text; no gradient |
| Active sidebar item | Established blue-to-orange gradient with white text and icons |
| Parent of selected child | Subtle neutral or pale blue treatment without competing gradient |
| Sidebar search | 44px height; 18px icon; 16px side padding; 12px gap; centered contents |
| Profile action rows | 44px height; 18 to 20px icon; 16px gap; 16 to 20px side padding |
| Shared header height | Logo section and horizontal navbar use the same 80px token |
| Form focus | Consistent blue focus border and visible focus ring |

UI-04 Profile menu rows use left-aligned icon and label pairs. Only the Preview as User Type chevron belongs at the far right. Preserve the avatar, name, and role header and the nested role selection menu.

### Fixed layout and scrolling

UI-05 Use a viewport-height application shell with a fixed sidebar and a vertical main workspace. The navbar and dedicated page-header region must not shrink or scroll with content. The remaining content area has min-height zero and vertical overflow enabled. Avoid a second document-level vertical scrollbar.

UI-06 Page title, subtitle, and primary page action remain visible on Dashboard, Goals, Reviews, Templates, Cycles, Reports, Employees, My Team, and nested workflows. Dashboard toolbar filters stay with the Dashboard header. Long tables and form content scroll beneath this region.

UI-07 Menus, popovers, tooltips, and dialogs must remain visible without clipping. On narrow screens, wrap page controls cleanly, preserve access to navigation, and prevent header content from consuming the entire usable viewport. Responsive header behavior requires device testing before production release.

### Table standards

UI-08 A white listing card contains the search and filter toolbar, full-width table, and pagination. Only the toolbar receives container-level horizontal padding. Headers, rows, and dividers span the card width and respect rounded corners.

UI-09 Toolbar padding is 24px horizontally and 20 to 24px vertically, field gaps are 16px, and inputs are 44px tall. Add no empty spacer below filters. Cells use 20 to 24px horizontal padding. Preserve columns, search, filters, row actions, and pagination across all listing pages.

UI-10 Standalone summary KPI cards appear only on Dashboard. Reports retain filters and charts; other modules may show table totals, progress, and record metadata without introducing KPI card grids.

## 7 Company and account interactions

SHELL-01 The company trigger displays an avatar or initials, company name, Main Company label, status indicator, and chevron. It opens a custom rounded popover with a Switch Company title, MAIN COMPANY group, SISTER COMPANIES group, and selected checkmark.

SHELL-02 Reuse available company records. The current sample contains Mayon Consolidated Inc. and no sister companies. Show a clear empty state rather than inventing organizations. In production, selecting an authorized company refreshes all scoped data, clears incompatible filters, and prevents cross-company disclosure.

SHELL-03 Notifications open the existing assigned-review panel. Show actionable assigned work and deadlines under the user's permissions. Settings open permitted preferences; the prototype includes review-notification visibility.

SHELL-04 Profile menu items are Profile, Account Settings, Preview as User Type, a divider, and Log out. The nested preview offers Employee, Manager, and HR Administrator, highlights the selected role, and closes after selection. Keep company switching independent from role preview.

SHELL-05 Bottom sidebar user details update to match the selected role. Escape and outside click dismiss popovers. Keyboard users must be able to reach and activate every action.

SHELL-06 Production logout invalidates the authenticated session and clears sensitive cached data. The prototype's End preview reset is a demo interaction and does not constitute production logout.

## 8 Role specific Dashboards

Use one shared layout and component family with role-dependent data and panel configuration. Do not render identical content for all roles. Values must derive from permitted records and respond to applicable filters. KPI values are prominent, supporting text is readable, and unnecessary Live sample data badges or repetitive instructions are removed.

| Role | Four KPI cards | Supporting panels |
| --- | --- | --- |
| HR Administrator | Total Review Assignments; Review Completion Rate; Pending Reviews; Average Goal Progress | Review Status donut; Goal Progress by Department; Review Completion by Department; Next Actions and Upcoming Deadlines |
| Manager | Team Members; Pending Evaluations; Average Team Goal Progress; Overdue Goals | Team Goal Progress; Team Review Status; Pending Evaluations; Next Actions |
| Employee | My Goals; Average Goal Progress; Pending Reviews; Completed Reviews | My Goal Progress; My Pending Reviews; Upcoming Goal Deadlines; Next Actions |

DASH-01 Present Dashboard title and the supporting subtitle on the left, with compact toolbar-style filters on the right. Keep the current subtitle Monitor review activity and goal progress across your organization. Controls are rounded white triggers with neutral borders, 44px height, and no labels stacked above them. Accessible labels remain available to assistive technology.

DASH-02 HR filters are Period, Review Cycle, and Department. Manager filters are Period and Review Cycle. Employee has Period only. Period choices include This Month, This Quarter, This Year, and a validated custom date range.

DASH-03 Period filters review records by evaluation-period overlap, not submission date. Goals use their available start and end interval, falling back to due date where needed. Cycle selection affects review information; department selection affects organization-wide employee, goal, and review scope.

DASH-04 Pending means Not Started or In Progress assignments in active cycles. Manager Pending Evaluations and Employee Pending Reviews include only responses assigned to that user. HR Pending Reviews includes the permitted organizational active-cycle set. Submitted responses awaiting finalization are a separate state and do not require another evaluator response.

DASH-05 Team Members counts permitted direct reports, including those with no goals. Average goal progress is the arithmetic mean of scoped goal progress. Overdue Goals are incomplete scoped goals with due dates before the effective business date. Empty averages display a dash, not a fabricated zero.

DASH-06 Metric cards, chart rows, legends, and next actions link to the relevant permitted module or record. Examples include Continue Review, Start Review, View Goal, View Team, Open Cycle, and Create Cycle for HR.

DASH-07 Employees must not see organization-wide or confidential team charts. Display loading, no assignments, no goals, no deadlines, and invalid-period states without breaking the shell.

## 9 Goals

GOAL-01 Store a goal name, description, owner, creator, source, category, optional cycle association, visibility, start date where available, required parent deadline, tracking method, progress, milestones, status, and progress-update history. MVP categories are Quality, Delivery, Growth, and Collaboration. Progress must be a finite number from zero through 100.

GOAL-02 Employees have My Goals and Assigned Goals tabs. My Goals contains employee-created goals; Assigned Goals contains manager- or HR-created goals for that employee. Provenance must persist even when a goal is edited or completed.

GOAL-03 Employees may create and edit their own incomplete personal goals. They may update permitted progress, milestone completion, and comments on assigned goals, but cannot change the original target, owner, assigned-by information, parent deadline, milestone names, or milestone deadlines. Employees may manage milestone structure on their own editable personal goals. Completed employee goals open read-only for goal metadata; milestone-tracked goals allow permitted completion checkboxes to be reversed, which recalculates progress and can return a goal to Active.

GOAL-04 HR can create or update goals within authorized organization scope. Managers can create or update goals only for permitted direct reports. Direct calls or altered record identifiers must not bypass this scope.

GOAL-05 Validate required goal name, an authorized owner, category, required parent deadline, permitted cycle selection, and valid manual progress where editable. When editing a start date, it must not follow the parent deadline. Reject milestone rows that contain a deadline without a name. Preserve stable milestone identifiers, optional deadlines, and completion metadata across edits.

GOAL-06 Lists support name search, category, status, due-date filters, and pagination. HR and Manager views support owner filtering; Assigned Goals supports assigned-by filtering. Employee goal tabs retain the appropriate create action only in My Goals.

GOAL-07 Active, Pending Approval, and Completed are the visible goal states. Pending Approval takes precedence over progress-derived completion until resolved. New goals currently save as Active. The redesigned Create Goal form does not include an approval-request control. Existing Pending Approval records remain supported; a complete request, approval, rejection, and notification workflow requires product approval and implementation.

### Grouped Create Goal form

GOAL-08 Keep the header title Create Goal and subtitle Define a goal and set the details below. Use subtle section headings and open spacing, with no heavy nested cards. Retain the existing PMSDotNet colors, typography, inputs, dialog styling, and solid-blue primary action.

| Section | Fields and behavior |
| --- | --- |
| Title and Description | Required full-width Goal Name; visible full-width Description textarea; repeatable milestone rows with names, optional due dates, and remove icons |
| Ownership and Visibility | Required searchable Owned by employee lookup with initials or avatar; Visible for dropdown beside it |
| Additional Settings | Required Category or Goal Purpose; optional Cycle; required Deadline in one row |
| Footer | Right-aligned Cancel and solid-blue Save Goal |

GOAL-09 Goal Name replaces the old Goal or Measurable Target label and uses the placeholder e.g. Improve communication skills. Description is displayed directly with the placeholder Describe the expected outcome of this goal. Milestones appear immediately below Description with the helper Break this goal into smaller action steps. Show one blank milestone row initially, the placeholder Enter a milestone, and an Add Milestone button. Do not use a single milestone textarea or hide Description behind an action.

GOAL-10 Owned by searches existing HRDotNet sample records within role scope. HR can select authorized employees; Managers select permitted direct reports; Employee creation is restricted to the employee's own identity. Visible for currently offers Owner and manager can see this, with authorized HR administration access retained. Do not introduce a Contributors field or wider visibility permissions.

GOAL-11 Do not show a manually editable progress field during creation. Save every new goal at zero percent. New goals with named milestones use milestone tracking; new goals without milestones use manual tracking. Blank optional rows do not count toward the milestone total. Store Description, selected cycle, visibility, and goal provenance with the new record. A cycle association is metadata and does not make Dashboard goal data depend on the review-cycle filter.

### Expandable milestones within the existing listing

GOAL-12 Preserve the current page title, subtitle, Create Goal placement, toolbar, white table container, columns, widths, alignment, typography, spacing, colors, badges, progress bars, pagination, and row actions. Add only a small chevron beside the goal name and indented child rows on expansion. Use a subtle child-row background and maintain the existing column grid. Do not replace the table with cards or a new hierarchical table design.

GOAL-13 Only the chevron expands or collapses milestones. Goal Name continues to open goal details through the existing permitted dialog. Multiple goals may remain expanded independently. Filtering and pagination operate on parent goal records; milestone rows do not increase the goal count or consume pagination slots. A goal without milestones retains its existing zero-milestones text and offers Add Milestone on expansion where permitted.

GOAL-14 Each milestone child row shows a completion checkbox, milestone name, optional due date, completion status, and a contextual action menu where permitted. Do not show milestone percentage bars. Authorized milestone managers may add, edit, or remove milestones. Assigned employees may complete their own assigned milestones without editing milestone structure. Protect the same permissions in action handlers and production endpoints.

### Progress calculation and tracking changes

GOAL-15 For milestone tracking, Goal Progress equals Completed Milestones divided by Total Milestones multiplied by 100. Count Completed and Completed Late milestones as completed. The current UI rounds to the nearest whole percentage for the existing progress display. Recalculate after completion, reversal, addition, or removal. Automatic progress is read-only in the existing update dialog and is persisted so the goal table and Dashboard use the same value.

GOAL-16 Preserve every existing sample goal's saved progress when loading or expanding records. Existing records without an explicit milestone-tracking method remain on their legacy manual method, even when they already contain milestone records. Do not silently replace a saved 35 percent with a calculated 50 percent. When an operation would move such a goal to milestone tracking, show its current and proposed percentages and require explicit confirmation before saving either the milestone change or tracking change. Cancel or dismiss leaves the stored goal unchanged.

GOAL-17 Goals without milestones retain manual progress updates. When removing the final milestone from an automatic goal, require confirmation before switching to manual tracking and retain the last saved goal percentage. Do not reset progress to zero merely because the denominator becomes empty. If the goal changes while a tracking confirmation is open, require the user to reopen the goal rather than saving a stale pending change.

### Milestone deadlines and completion states

| Milestone status | Rule |
| --- | --- |
| Pending | Incomplete with no deadline, or not yet past its optional deadline |
| Overdue | Incomplete and its own due date is earlier than the current business date |
| Completed | Checked with no deadline, or completed on or before its due date |
| Completed Late | Checked after its own deadline; display the badge Completed (Late) |

GOAL-18 Parent Goal Deadline remains required; milestone deadlines are optional. An overdue milestone remains completable. On completion, record the actual completion date. Unchecking clears that completion date and recalculates automatic progress. Rechecking records the new actual completion date. For historical completed milestones with no recorded completion date, retain the unknown date and do not invent a date or infer late completion.

GOAL-19 Missing a milestone deadline must not independently make the parent goal overdue. Determine parent overdue status from the parent's own deadline and incomplete state. Use the current local business date for milestone deadline evaluation in the prototype and an authoritative organizational clock in production. Due today is not overdue, and completion on the due date is not late.

GOAL-20 Preserve Create Goal's grouped structure while adding optional milestone due-date inputs and removal controls to its individual rows. Keep existing Update Goal, personal-goal, and assigned-goal dialogs available. Integrate deadline-aware milestone inputs and automatic progress rules into those dialogs without changing the unrelated goal fields or role restrictions.

## 10 Review assignment workspace

REV-01 A review is one evaluator assignment for one subject, cycle, and perspective. A cycle with six subjects and Self plus Manager perspectives normally generates 12 assignments. KPI and progress calculations count these assignments, not six subjects or one cycle.

REV-02 The listing contains Employee, Review Cycle, Review Type, Reviewer, Due Date, Status, and Actions. Provide role-appropriate listing scopes and search by subject or visible evaluator. Filters include cycle, perspective, department, and status, with clear/reset and pagination.

REV-03 Each permitted detail view shows subject, role, department, cycle, perspective, due date, state, template version, and the dynamic questionnaire. Required-answer progress updates as the evaluator responds. Unsaved changes prompt the user to save or discard before leaving.

REV-04 Assigned evaluators can save incomplete drafts in active cycles. Submission requires every required question to have a valid response. Not Observed satisfies a required rating when enabled. Show specific validation feedback and confirmation before submission.

REV-05 Submit locks the response as Submitted. HR may reopen a submitted response before cycle finalization and release, returning it to editable work under the assigned evaluator. Finalized responses are Completed and locked.

REV-06 Preserve submission, update, and finalization timestamps separately in production. Opening a review should mark an untouched assignment In Progress if the agreed workflow requires opened work to count; the prototype currently changes state on draft save. This behavior must be reconciled before final acceptance.

### Review state definitions

| State or indicator | Meaning | Allowed next event |
| --- | --- | --- |
| Not Started | No response work recorded | Open or save draft; submit valid response |
| In Progress | Started or saved response without submission | Save draft or submit |
| Submitted | Evaluator response received and locked | HR reopens or finalizes cycle |
| Completed | Assignment finalized by the cycle workflow | Released summary may become available |
| Overdue indicator | Unsubmitted assignment past its due date | Retains underlying Not Started or In Progress state |

REV-07 Overdue is derived, not an additional persisted lifecycle state. Do not double-count an overdue draft in both a base-state total and an independent mutually exclusive status bucket. Submitted and Completed remain distinct in all tables, charts, and exports.

## 11 Review template builder

TPL-01 HR can create, edit, duplicate, preview, publish, and archive templates. Managers and employees have no template administration permissions. Template metadata includes name, description, perspective, category, status, version, updated date, sections, and questions.

TPL-02 Support Rating, Paragraph, Short text, and Choice questions. Each question has a stable identifier, title, section, optional guidance, required flag, and type-specific configuration. Choice questions have valid options. Rating questions can offer Not Observed.

TPL-03 The standard behavior scale is 1 Never, 2 Rarely, 3 Sometimes, 4 Often, and 5 Always. The same labels and numeric interpretation must appear in authoring, preview, completion, and results. Narrative and choice answers are not converted to ratings.

TPL-04 HR can add or reorder sections and questions and remove items while editing permitted drafts. Validate publishing rules, including a meaningful template name, usable sections, valid question titles, and valid choice options. Preview must render the actual question structure without generating review assignments or saving respondent answers.

TPL-05 Published templates used in launched cycles are immutable snapshots. Changes create a new version for future assignments and cannot alter existing questionnaires or answers. Archived templates remain available for historical records and cannot be newly selected for launch.

TPL-06 The template list provides search, perspective and status filters, question count, last updated date, and appropriate actions. Publication and archival must record actor, timestamp, template identifier, and version.

## 12 Review cycle setup and management

CYCLE-01 HR owns cycle creation, scheduling, launch, monitoring, cancellation, finalization, and release. Managers do not create or launch cycles in the MVP. Cycles display in a table with name, review type, period, participants, progress, deadline, status, and actions.

CYCLE-02 Setup captures name, description, cycle type, evaluation-period dates, opening date, deadline, participants, evaluator groups, evaluator mappings, templates, and confidentiality settings. Types include Standard Performance Review, 360 degree Feedback, Probationary Review, and Project-Based Review.

CYCLE-03 The wizard must support basic cycle details, employee selection, evaluator selection, template assignment, and final confirmation. HR can save setup progress and resume. Returning to a previous step must preserve input.

CYCLE-04 Employee lookup uses authorized HRDotNet identities with search, department filters, selection, visible selection totals, and pagination. Evaluator lookup selects existing eligible people. Self maps to the subject; Manager maps to the applicable PMS performance manager. Peer and Upward mappings are explicitly selected.

CYCLE-05 Validate period and operating-date order, nonempty participants, valid evaluator mappings, and a published compatible template for each enabled group. Prevent duplicate subject/evaluator/perspective assignments. Missing configuration blocks launch with specific errors.

CYCLE-06 Launch creates independent assignment records with immutable template versions. Generation must be idempotent. Scheduling must not make future work editable early. Production scheduling must be server-driven rather than dependent on opening the browser.

### Cycle lifecycle

| State | Meaning | Management behavior |
| --- | --- | --- |
| Draft | Setup incomplete or intentionally saved | HR edits and resumes |
| Scheduled | Valid cycle awaits opening date | No early response submission |
| Active | Assignments accept evaluator work | HR monitors, permitted reopen, or cancellation |
| Completed | All assignments finalized | Responses locked; release remains separate |
| Cancelled | Work discontinued | Existing responses retained read-only; results not released |

CYCLE-07 HR finalization requires all generated assignments to be Submitted or Completed and a nonempty assignment set. Finalization marks assignments Completed and leaves results unreleased. Release is a separate HR action available only after completion.

CYCLE-08 HR can monitor overview, participants, progress, and results in cycle detail. These detail sections are permitted tabs within a cycle; they are distinct from the prohibited Reviews, Templates, Cycles page tabs.

## 13 Results and confidentiality

RESULT-01 Release gates access to evaluation summaries. Employees see only their own released outcomes. Managers see released outcomes for permitted direct reports and their own applicable records. HR sees authorized released outcomes without bypassing anonymous protections.

RESULT-02 Summaries include overall observed rating, competency ratings, Self versus Manager comparison, aggregated peer and upward feedback, written strengths, improvement areas, other narrative feedback, and manager final comments where permitted.

RESULT-03 Calculate a response score as the arithmetic mean of answered numeric Rating questions. Exclude blanks and Not Observed. A response with no observed numeric ratings has no numeric score. Calculate overall eligible result scores from eligible response means; do not infer zero from missing data.

RESULT-04 Peer and upward anonymity can be configured independently. The sample minimum group threshold is three completed responses. Withhold both scores and written feedback for groups below threshold. Do not disclose evaluator identities in anonymous summaries, search text, export rows, or chart labels.

RESULT-05 Aggregate anonymous groups only after release and threshold satisfaction. The respondent may see their own submitted answer under response permissions; this does not authorize a manager or subject to identify other anonymous evaluators.

RESULT-06 Managers may save final comments only for authorized released team results. Record the author and timestamp. Production policy must decide whether editing a released comment creates a new version and whether recipients are notified.

## 14 Reports and metric definitions

REPORT-01 Reports is available to HR and permitted Managers. Filters are Review Cycle, Review Period, Department, and Review Type. Apply permission scope before filters and calculations. Empty selections render helpful empty states instead of misleading values.

REPORT-02 Include Review Completion by Department, Performance Rating Distribution, Review Status Breakdown, and Competency Performance Summary. Charts must offer complementary detail and use the same filtered records as any accompanying report measures.

REPORT-03 Do not show standalone KPI cards outside Dashboard. The following measures remain reporting definitions for exports, chart detail, or an approved inline summary presentation. This supersedes the earlier request for four report KPI cards.

| Measure | Calculation and inclusion rule |
| --- | --- |
| Total Employees Reviewed | Unique subjects with all required cycle assignments Completed in the selected period; deduplicate employees across matching cycles |
| Review Completion Rate | Completed assignments divided by all filtered permitted assignments, multiplied by 100; no denominator means no rate |
| Average Performance Rating | Mean of eligible released finalized response scores on the 1 to 5 scale; exclude missing and Not Observed ratings and withheld groups |
| Outstanding Reviews | All filtered assignments not Completed, including Submitted responses awaiting finalization |
| Average Goal Progress | Arithmetic mean of progress across scoped goals in the selected Dashboard period |

REPORT-04 Use Outstanding Reviews for the broad unfinished-work measure in Reports. Reserve Dashboard Pending Reviews for active assignments requiring evaluator action. If the original report label Pending Reviews is retained, explicitly describe that it includes submitted work awaiting finalization. Never compare these measures as though they share one denominator.

REPORT-05 Department completion uses each department's filtered finalized assignments divided by its total filtered assignments. Status breakdown uses Not Started, In Progress, Submitted, and Completed; overdue is an annotation on unsubmitted work. Rating distribution groups eligible response scores consistently; competency summary averages eligible observed question scores.

REPORT-06 CSV export must honor current permissions, filters, confidentiality, and scoring rules. Escape separators and quotes and neutralize spreadsheet formula prefixes. Do not include hidden identities or unreleased ratings. Production exports require authorization and an audit event.

REPORT-07 Goal averages use the persisted progress of each included goal: calculated progress for goals already using milestone tracking, and the unchanged saved manual progress for legacy or manual goals. A late milestone must not be counted as a separate overdue goal when the parent's deadline has not passed.

## 15 Employees and HRDotNet integration

HRDotNet is the intended source of employee identity, position, department, and official reporting manager. PMSDotNet owns performance configuration and performance-manager overrides. The prototype uses local sample lookups rather than a live integration.

HR-01 HR Employees is a directory and performance-assignment workspace. Do not add employee master records here. Managers use My Team for read-only employee information and permitted goal and review context.

HR-02 HR may select one or several existing employees and assign an eligible performance manager, with an effective date. Search both employee and manager lookup lists. Reject missing selections, invalid managers, self-management, and circular reporting relationships.

HR-03 Preserve the official HRDotNet hierarchy. PMS manager changes affect PMS team scope. Reassign only untouched Not Started manager reviews in active cycles; preserve In Progress, Submitted, and Completed evaluator ownership. Update future draft or scheduled cycle mappings where permitted.

HR-04 Production integration requires stable employee and company identifiers, mapping rules, synchronization status, retry behavior, and clear ownership for corrections. Handle inactive or transferred employees without losing historical review provenance.

HR-05 Future effective assignments require a defined activation mechanism. The prototype records an effective date but applies its override immediately. Production must either implement deferred activation or restrict the field to the current business date until that behavior is available.

## 16 Logical data requirements

Use stable identifiers and company scoping for all production entities. Historical snapshots must remain independent of later employee, template, and reporting-line changes. The current prototype's use of employee names in some goal records must not become a production relational key.

| Entity | Essential attributes |
| --- | --- |
| Company | ID, name, parent relationship, status, authorized membership |
| User and role grant | User ID, identity-provider subject, role, company, effective permissions |
| Employee | HRDotNet ID, name, position, department ID, official manager ID, employment status |
| Performance manager assignment | Employee ID, manager ID, effective dates, actor, change history |
| Goal | ID, owner ID, creator ID, source, name, description, category, dates, cycle association, visibility, tracking method, progress, status |
| Goal milestone and update | Stable milestone ID, parent goal ID, name, optional due date, completion flag, actual completion date; update author, timestamp, and comment |
| Template version and question | Template ID, version, state, sections, stable question IDs, types, rules |
| Review cycle | ID, type, evaluation interval, operating dates, state, release metadata, confidentiality |
| Evaluator mapping | Cycle ID, subject ID, reviewer ID, perspective, template version reference |
| Review assignment and answer | ID, mapping, template snapshot, state, answers, due date, lifecycle timestamps |
| Released result and comment | Cycle and subject IDs, eligibility, score provenance, withheld-group flags, comment history |
| Audit event | Actor, company, action, target ID, timestamp, result, trace reference |

DATA-01 Prevent duplicate assignment generation with a unique cycle, subject, reviewer, and perspective constraint. Preserve template snapshot integrity and retain cancelled or completed historical records according to an approved retention policy.

DATA-02 Record production timestamps with a consistent timezone strategy. Display dates using the organization's business timezone. The prototype's review calendar remains fixed at 19 October 2026, while milestone status and completion dates use the current local date. Production must use one authoritative business clock for deadlines and timestamps.

DATA-03 Store response content as sensitive access-controlled application data. Keep operational logs free of full answers and private written feedback. Limit exports to purpose-appropriate fields.

DATA-04 Persist milestone identities and completion dates. Derive milestone status from completion, optional due date, and actual completion date. A legacy record with missing tracking metadata must preserve its existing percentage until an authorized tracking conversion is confirmed. Record tracking changes and milestone mutations durably in the production audit trail; the current milestone prototype persists changes locally without a dedicated immutable milestone audit history.

## 17 Production quality requirements

The following are proposed production acceptance targets. They require implementation and testing beyond the browser-only mockup.

NFR-01 Security and isolation: authenticate every session, enforce server-side authorization and company isolation, protect against object-identifier tampering, escape user content, validate inputs, and protect state-changing requests. Role preview must not exist as a permission bypass.

NFR-02 Persistence and concurrency: save drafts durably, report errors honestly, prevent duplicate submissions, use version or conflict detection for simultaneous edits, and preserve user input after recoverable failures. A success message must follow confirmed persistence.

NFR-03 Confidentiality: enforce release and anonymity rules before serializing responses. Remove restricted records and identity fields from client payloads rather than relying on hidden HTML. Apply identical restrictions to charts, search, notifications, and exports.

NFR-04 Accessibility: target keyboard-complete operation, visible focus, meaningful labels, semantic headings and tables, modal focus management, descriptive chart alternatives, and error messages linked to affected controls. Status must not rely on color alone.

NFR-05 Performance: proposed target is useful page content within two seconds for typical filtered listings and Dashboard calculations with 10,000 assignments in a production-like test environment, excluding initial identity-provider redirects. Paginate server responses and define export limits before scaling.

NFR-06 Reliability: define backup, recovery, monitoring, and incident ownership before launch. Scheduled opening, finalization, and release operations must be transactionally consistent and auditable. Product and operations owners must approve availability and recovery targets.

NFR-07 Compatibility: validate desktop Chrome and Edge, tablet layouts, and a narrow mobile viewport. Dropdowns must stay visible and fixed page headers must not obscure form validation or reduce content height to zero.

NFR-08 Maintainability: reuse shell, table, filter, chart, modal, and permission components. Centralize metric definitions and business-date handling. Avoid independent calculations with different inclusion logic for the same named measure.

## 18 Acceptance scenarios

Each scenario must pass using realistic fixtures, including empty data, invalid input, anonymous groups, submitted work, and completed unreleased cycles. UI checks supplement server-side authorization tests in the production implementation.

### Shell and navigation

AC-01 Given any role on a long listing, scrolling moves only the content region. The sidebar, logo, navbar, page title, subtitle, and page primary action remain visible. Both desktop header dividers align at 80px.

AC-02 Given the profile menu, every icon sits beside its label with consistent spacing. Opening Preview as User Type shows three roles and an active checkmark. Selecting Employee from Templates closes the menu and opens the Employee Dashboard.

AC-03 Given Manager navigation search, Templates yields no matching page. Given HR search, Templates reveals the Reviews context and opens Review Templates. Clearing search restores correct ordered navigation.

AC-04 Primary buttons use solid blue in all roles and dialogs. Only the selected sidebar link or submenu uses the gradient; parent and child do not show competing active gradients.

### Goals and people

AC-05 Given an employee-created goal, it appears only under My Goals. A manager-assigned goal appears only under Assigned Goals. Updating its progress cannot modify its target or due date.

AC-06 Given invalid manual progress or reversed goal dates, saving fails with useful validation. Completed employee goal metadata remains read-only. On a completed milestone-tracked goal, an authorized completion reversal recalculates progress and may reopen the goal as Active.

AC-07 Given an HR performance-manager change, reject self-management and reporting cycles. Save a valid assignment without modifying HRDotNet's official manager. Reassign untouched manager evaluations and preserve begun or submitted responses.

### Templates and cycles

AC-08 Given a published template used by an assignment, editing creates a later version. The existing assignment's questions, scale, required flags, and answers remain unchanged.

AC-09 Given six selected subjects and Self plus Manager evaluators, launch generates 12 unique assignments. Repeating the launch request does not create another 12. Invalid participants, dates, mappings, or templates block launch.

AC-10 Given a future scheduled cycle, no evaluator may submit early. At the opening date, the production scheduler activates the cycle once and makes its intended assignments available.

### Submission and results

AC-11 Given an incomplete response, Save Draft persists the answers and shows In Progress. Submit identifies missing required answers. Valid submission locks the response as Submitted and does not increment Completed Reviews.

AC-12 Given a cycle with an unsubmitted assignment, HR cannot finalize. After all responses are submitted, finalization marks them Completed but keeps results hidden. Release makes only permitted summaries available.

AC-13 Given a threshold of three and two completed peer responses, hide peer scores and written feedback from results and exports. With three eligible responses and released results, show aggregated content without evaluator identities.

AC-14 Given rating answers 4, 5, Not Observed, and blank, the response score is 4.5. A response containing only Not Observed has no numeric score and must not lower the overall average.

### Metrics and filters

AC-15 Given eight filtered assignments with three Completed, two Submitted, two In Progress, and one Not Started, completion is 37.5 percent before display rounding. Outstanding Reviews is five. If the cycle is active, Dashboard Pending Reviews is three. Overdue labels do not change these base counts.

AC-16 Given period, cycle, and department filters, every Dashboard review chart and KPI reconciles to the same permitted filtered assignment set. Goal information responds to period and department, not cycle. Employee sees Period only.

AC-17 Given no eligible numeric results, the rating chart displays an insufficient-data state. Given no assignments, completion displays no rate rather than an invented percentage. Exports reconcile with visible scope and conceal restricted identities.

### Goal builder and milestone enhancements

AC-18 Given Create Goal in any role, show the three grouped sections in the agreed order, visible Description, one initial milestone row, optional milestone deadlines, and Cancel and Save Goal. Show no manual progress field and no Contributors field. Save a valid goal at zero percent with its Description, authorized owner, category, parent deadline, optional cycle, and visibility.

AC-19 Given the unchanged Goals table, expanding two goal chevrons reveals both milestone lists independently. Clicking a name opens its details without toggling expansion. Search, filters, clear, and pagination continue to operate on parent goals. Child dates and status align with the existing grid and no child percentage bars appear.

AC-20 Given an automatic goal with four milestones, checking one sets goal progress to 25 percent, checking two sets it to 50 percent, and completing all sets it to 100 percent. Reversing one completion sets it to 75 percent. Persist the percentage and show the same value after reload and in the applicable Dashboard average.

AC-21 Given a legacy goal saved at 35 percent with one of two milestones complete, loading and expanding must leave 35 percent unchanged. Completing its second milestone opens a confirmation showing 35 percent and the proposed 100 percent. Cancel or dismiss leaves stored progress and milestone completion unchanged; confirm commits the new completion and milestone-tracking method together.

AC-22 Given an incomplete milestone due yesterday, show Overdue and permit completion. Completing it today records today's date and shows Completed (Late). A milestone due today can be completed today as Completed. A milestone without a due date remains Pending until completed. None of these conditions makes an incomplete parent due next month overdue.

AC-23 Given an automatic goal, adding or removing a milestone updates its denominator and percentage. Removing the final milestone asks for confirmation, switches to manual only after approval, and retains the last saved percentage. A manually tracked goal with zero milestones still permits manual progress updates.

AC-24 Given an assigned employee, allow completion updates on that employee's milestones but reject changes to milestone names, deadlines, structure, or goal ownership. An authorized Manager or HR user can manage milestone structure within their scope. An unrelated manager cannot mutate the goal, even through a direct action call.

AC-25 Given existing completed milestones without completion dates, leave those dates unknown. Editing the milestone preserves its identifier and known dates. Unchecking a milestone clears its completion date; completing it again records the new actual date. Do not infer late completion for undated historical completion records.

AC-26 Given a valid goal created without named milestones, save zero percent with manual tracking. Given a milestone row containing a due date but no name, block saving with a useful message. Blank optional rows do not become milestones. In both cases, preserve the grouped form and the required parent deadline.

## 19 Prototype coverage and known delivery gaps

The local implementation includes role-specific navigation and Dashboards, grouped goal creation, goal provenance and updates, expandable milestone child rows, optional milestone deadlines, actual completion dates, late-completion badges, confirmed tracking conversion, and automatic goal progress. It also includes review listing and dynamic forms, template versions, the cycle wizard, release gates, anonymity thresholds, filtered charts, browser storage, shell styling, and a local preview route at http://127.0.0.1:4180/performance-mvp.html.

The latest goal enhancements are local changes. Browser checks verified the retained Goals layout, independent milestone expansion, name-to-details navigation, search, tracking-change confirmation, contextual actions, and optional-deadline editor. Automated milestone checks cover preserved legacy progress, confirmed conversion, automatic calculation and reversal, optional deadlines, late completion dates, role scope, last-milestone fallback, and dated goal creation. Existing review and Dashboard regression checks also pass. Full responsive, accessibility, production authorization, and end-to-end persistence acceptance remain release dependencies.

| Gap | Required resolution before production |
| --- | --- |
| Browser storage and role simulation | Backend persistence, authenticated identity, server authorization |
| Local employee and company records | Live HRDotNet contract and authorized company membership |
| Goal approval workflow incomplete | Decide request entry point in the grouped form and implement approve or reject workflow, notifications, and state transitions |
| Effective date applied immediately | Deferred manager assignment activation or current-date restriction |
| Started state recorded on draft save | Decide and implement open-to-In-Progress behavior consistently |
| Mixed prototype clocks | Use one authoritative business clock; reviews retain the fixed sample date while milestone deadlines and completion use the current local date |
| Prototype notifications and logout | Real delivery preferences, session termination, cache clearing |
| Client-side audit collection | Durable protected audit storage and operational monitoring |
| Fixed shell and responsive layout | Complete visual and interaction verification across devices |
| Milestone history stored locally | Add durable server-side milestone records, atomic progress updates, audit history, and concurrency protection |

## 20 Open decisions and dependencies

OD-01 Product owner and HR must approve goal approval behavior, including the request entry point, who can approve, whether pending goals may be edited, rejection reasons, and resubmission. The grouped Create Goal form currently has no approval-request control.

OD-02 HR must approve anonymity thresholds, treatment of small groups, narrative disclosure rules, and any exceptional access. No exception is assumed by this PRD.

OD-03 Product and engineering must confirm report naming for Outstanding Reviews versus the earlier Pending Reviews label, eligible-score aggregation, weighting, and display rounding. Default MVP scoring is unweighted unless explicitly changed.

OD-04 HRDotNet owners must define identity, company, department, manager, employment-state, and synchronization contracts, including future-dated changes and correction ownership.

OD-05 Product must approve deadline enforcement after due date, late-submission policy, reassignment of begun work, and whether completed or released cycles can ever be amended. The MVP has no general amendment flow.

OD-06 Security and operations owners must approve retention, export limits, recovery targets, observability, and production role provisioning. No jurisdiction-specific compliance certification is asserted.

OD-07 Designers and engineers must complete responsive fixed-header acceptance and determine any narrow-screen header token changes. Logo and navbar alignment must remain consistent within each supported layout.

OD-08 Product and engineering must confirm production business-timezone handling and any policy limits on reversing completed milestones. Current prototype behavior permits authorized reversals for milestone-tracked goals and uses the local calendar date. Migration must preserve existing manual values and historical completion dates that are unknown.

## 21 Delivery plan and release gate

### Phase 1 Product baseline and prototype acceptance

Review this PRD with HR and product stakeholders, resolve blocking decisions, verify the local visual corrections, and complete all role-specific interaction scenarios. Produce an approved permission matrix, metric definitions, and acceptance checklist.

### Phase 2 Production foundation

Implement authenticated identity, company isolation, backend schemas, HRDotNet integration, durable draft storage, audit logging, and transactional assignment generation. Verify direct-request permissions independently of UI visibility.

### Phase 3 Workflow and reporting completion

Implement scheduled opening, effective-dated manager changes, agreed goal approval behavior, review submission and finalization, release rules, confidentiality, reporting reconciliation, scoped exports, and error recovery.

### Phase 4 Pilot and release readiness

Run a controlled pilot using authorized participants and representative cycles. Complete visual, accessibility, performance, security, and recovery checks. Obtain product, HR, engineering, and QA approval against the release criteria.

Release requires all MVP acceptance scenarios to pass, no unresolved critical permission or confidentiality defects, reconciled metrics, a verified integration path, durable audit history, documented support ownership, and approved handling for every blocking open decision. These phases describe dependencies and deliverables; no calendar dates or staffing commitments are implied.

## 22 Glossary and traceability

| Term | Meaning |
| --- | --- |
| Review cycle | Administrative configuration and timeline for a set of assignments |
| Review assignment | One evaluator response for one subject, cycle, and perspective |
| Subject | Employee whose performance or behavior is being evaluated |
| Evaluator | Person assigned to answer a questionnaire |
| Perspective | Self, Manager, Peer, or Upward feedback type |
| Submitted | Response received and locked, pending final workflow steps |
| Completed | Assignment finalized by the cycle workflow |
| Released | HR has made authorized result summaries available |
| Pending on Dashboard | Active-cycle assignments requiring evaluator response |
| Outstanding in Reports | Filtered assignments not yet finalized, including Submitted |
| Not Observed | Valid nonnumeric rating response excluded from averages |
| Performance manager | PMS assignment governing performance scope without changing official HR hierarchy |
| Manual goal tracking | Goal progress is updated directly; existing saved percentages are preserved |
| Milestone goal tracking | Goal progress is calculated from completed milestones divided by all milestones |
| Completed Late milestone | Milestone completed after its own optional deadline; badge reads Completed (Late) |
| Tracking conversion | Confirmed change from manual to milestone progress, or to manual after final-milestone removal |

### Requirement families

PERM covers authorization; NAV covers information architecture; UI covers visual and layout rules; SHELL covers company and account controls; DASH covers role Dashboards; GOAL covers objectives; REV covers assignments; TPL covers templates; CYCLE covers administration; RESULT covers scoring and confidentiality; REPORT covers analytics; HR covers integration; DATA covers records; NFR covers production quality; AC covers acceptance scenarios; OD covers unresolved decisions.

### Baseline references

The requirements consolidate PMSDotNet requests through 21 October 2026 and the current local implementation. The implementation reference is performance/dist with app.js, views.js, reviews.js, revisions.js, tables.js, dashboard.js, shell.js, and their styles. The standalone preview is outputs/performance-mvp.html. Checks in work/check-unified.cjs, work/check-dashboard.cjs, and work/check-goal-milestones.cjs provide logical regression coverage. Browser verification supplements these checks for the goal builder and retained listing; neither establishes production authorization.

Version precedence is explicit: PMSDotNet branding replaces earlier names; HR-only template and cycle administration replaces the original manager-cycle proposal; the three sidebar destinations replace horizontal Reviews module tabs; Dashboard-only KPI cards replace earlier module card grids; solid-blue primary actions and gradient active navigation replace the earlier reversed colors; local-only changes override previous general publication authorization for the current revision set. Grouped goal creation replaces the generic creation form. Expandable milestones enhance the existing table without redesigning it. Automatic progress applies to new milestone-tracked goals and explicitly confirmed legacy conversions, superseding the previous assumption that manual progress and milestone completion are always independent.

### Revision history

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 20 October 2026 | Initial consolidated PRD |
| 1.1 | 21 October 2026 | Grouped goal builder, retained listing with expandable milestones, optional deadlines, completion dates and statuses, automatic tracking and conversion confirmation, updated permissions, data, acceptance criteria, and prototype gaps |
