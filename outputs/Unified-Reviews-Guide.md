# PMSDotNet — Performance Management MVP

Updated October 19, 2026. This guide describes the current interactive mockup and supersedes the earlier scope documents.

## Open the prototype

Use the browser preview at `http://127.0.0.1:4180/performance-mvp.html` while its local server is running, or open `performance-mvp.html` in a modern browser. The ZIP contains the same application as editable HTML, CSS, and JavaScript. Records save in the current browser under the existing workspace storage key. The prototype uses a fixed sample date of October 19, 2026 so overdue and scheduled examples remain reproducible.

## Reviews navigation

| Sidebar page | Records | Main workflow |
|---|---|---|
| Reviews | Individual evaluator assignments | Start / continue → draft → confirmation → submit → finalized workflow → released results |
| Templates | Reusable, versioned questionnaires | Build → preview → publish → reuse; duplicate or version for future changes |
| Cycles | Evaluation configurations and periods | Configure employees, evaluators, templates, dates → save / schedule / launch → monitor → finalize → release results |

Reviews is one expandable sidebar parent for HR Administrators, with All Reviews, Templates, and Cycles beneath it. Managers and Employees have a single direct Reviews item. These are dedicated pages, without horizontal tabs between them.

Sidebar order is HR: Dashboard → Goals → Reviews → Reports → Employees; Manager: Dashboard → My Team → Goals → Reviews → Reports; Employee: Dashboard → Goals → Reviews. Roles & Access is not a module in this prototype. The role-switching tabs remain available for demonstration.

## Employee goals

Employee Goals has two tabs. **My Goals** is selected by default and contains employee-created performance and development goals, including those awaiting manager approval. Sofia's sample personal goal demonstrates milestones and progress. Create Goal opens the personal goal form with category, dates, progress, and milestones. Completed personal goals are read-only.

**Assigned Goals** contains goals created for the employee by a manager or HR administrator. The employee can view the original target, assigner, and dates, then update progress, comment, and mark existing milestones complete. The target, assigner, and deadline are read-only. Each goal appears in exactly one tab according to its creator. Assigned Goals has no Create Goal action.

## Role behavior

- **Employee / Sofia Garcia:** assigned self-assessments, peer and upward reviews; own released review results and goals. There is no separate profile module.
- **Manager / Angela Reyes:** assigned evaluations and permitted direct-report review metadata; My Team, goals, reports, and released results. Does not edit HR templates or launch cycles.
- **HR Administrator / Maria Angeles:** manage templates and cycles, assign evaluators and PMSDotNet performance managers, monitor assignments, reopen submitted responses before finalization, finalize cycles, and explicitly release results.

Managers and HR staff may also be employees in production. Use the top-right profile avatar menu to preview three separate fictional identities. The selected user type stays active while navigating. These UI rules demonstrate permissions; they are not server authorization.

The top bar has outline Notifications and Settings icons beside the profile avatar. Notifications lists assigned review responses that still need action. Settings opens a browser-local notification preference. The former horizontal role cards and MVP Guide button are removed.

The page actions enforce the same role rules as the sidebar. Employees and managers cannot open the template builder or cycle wizard, launch cycles, or reach HR cycle details. The prototype has no login page; sign-in is production work.

## Dashboard-only KPI cards and Reports

Dashboard is the only page with standalone KPI/count cards. Reviews, Templates, Cycles, Goals, Reports, Employees, and My Team go directly from their header to their main content. Record counts inside listings, progress indicators, detail pages, and chart values remain.

The Reviews listing starts with its tabs directly below the page title and description. Search and filter fields use 44px controls with a consistently inset dropdown chevron; existing filters still update the listing.

Reports provides Review Cycle, Review Period, Department, and Review Type filters. Charts show department completion, rating distribution, status breakdown, and competency performance. Unanswered and Not Observed ratings, plus anonymous groups below their response threshold, do not contribute to scores. Charts display an empty state when their filtered data is insufficient. Submitted remains a separate workflow state from Completed.

## HRDotNet employee lookup and manager assignment

The HR Employees page simulates a searchable HRDotNet source with Department, Position, Assigned Manager, and Assignment Status filters. It has no Add Employee form. HR can select one or several existing employees and use Assign Manager. The modal uses searchable employee and eligible-manager lists, validates self-assignment and reporting cycles, and records an effective date.

PMSDotNet stores performance manager overrides separately from HRDotNet identity and official reporting fields. My Team, review visibility, future cycle evaluator defaults, and not-started manager review assignments use the PMSDotNet relationship. In-progress and submitted reviews keep their original evaluator. The mockup does not write to a live HRDotNet system.

## Templates

The full-page builder supports Rating Scale (1–5), Short Answer, Paragraph, and Multiple Choice. Question cards include title, description, required setting, duplicate, delete, and reorder actions. Multiple-choice options can be edited, added, and removed. Sections can be added, renamed, and reordered. Preview and live review screens use the same question components.

Rating labels are Never, Rarely, Sometimes, Often, and Always. Not Observed is accepted where enabled and excluded from numeric averages. Publishing validates names, question titles, section contents, and distinct multiple-choice options.

Statuses are Draft, Published, and Archived. Only Published templates can be selected for launch. Editing a published or used template creates a new version with a new identifier; existing published versions remain available until archived. Launch snapshots the exact template in each assignment. Scheduling also snapshots the chosen forms, so later template edits do not change scheduled questionnaires.

## Cycle setup

Five steps: General Information → Select Employees → Assign Evaluators → Select Templates → Review & Launch.

Employee selection supports search, department filter, checkboxes, select-all-filtered, and selection counts. Self and manager assignments are suggested. HR may change the manager evaluator and add multiple peer or upward evaluators. Duplicate employee + evaluator + review-type combinations are prevented.

Peer and upward groups can be anonymous. The minimum response threshold is configurable from 2–10, independently enforced for each anonymous perspective within each employee result. A group below threshold contributes neither scores nor narratives to the summary or export. Anonymous grouped results omit evaluator identities.

Draft cycles are editable and do not generate assignments. Scheduled cycles are configured for a future start. Active cycles accept submissions. Completed cycles are finalized and locked. Cancelled cycles retain records without accepting submissions or exposing results. Scheduling advances when the prototype’s sample calendar reaches the start date; no background scheduler or notification delivery runs in this browser-only version.

Launching requires a valid participant set, enabled evaluator types, complete evaluator assignments, published templates, ordered dates, and an eligible current start/deadline. A confirmation precedes assignment generation. Generated assignments are unique and are visible under Reviews for their assigned evaluators.

Cycle Details contains Overview, Participants, Progress, and Results. Progress distinguishes submitted responses from completed workflows. HR can finalize only when every assignment is Submitted or already Completed. Result release is a separate confirmed action after finalization.

## Review statuses and visibility

| Status | Meaning |
|---|---|
| Not Started | Assignment exists; no draft saved |
| In Progress | Evaluator saved a draft |
| Submitted | Evaluator confirmed and submitted a response; read only |
| Completed | HR finalized the relevant review workflow; locked |
| Overdue | Unsubmitted assignment has passed its deadline; underlying draft state is retained |

Overdue is derived from the assignment deadline and sample date. The prototype permits late submission while the cycle remains Active. Submitted reviews can only be reopened by HR before the cycle is finalized or results are released. HR cannot reopen finalized cycles through this MVP.

Employees cannot see another evaluator’s unsubmitted response. Managers see team metadata but do not gain raw anonymous response access. Anonymous evaluators can view their own responses; others see a restricted-response label. Released summaries respect role scope and anonymous response thresholds.

## Scoring and results

Average observed numeric ratings within each evaluator response, then average eligible response averages for the overall result. Not Observed, unanswered optional ratings, and below-threshold anonymous groups are excluded. Competency bars average observed answers to the same question title across eligible responses. Narratives and multiple-choice answers do not produce numeric ratings.

Employee Review Summary includes overall rating, competency bars, self-versus-manager comparison, eligible grouped 360° feedback, strengths, improvement areas, written feedback, and manager final comments. The manager can save final comments for a released direct-report result. Results exports include only authorized employee summaries and apply the same anonymity thresholds.

## Sample records and useful walkthroughs

- Q4 Performance Review 2026: active self and manager assignments, draft and submitted responses, and an overdue example.
- Mid-Year Performance Review: completed and released employee summaries.
- Leadership 360° Feedback: active self, manager, peer, and upward assignments; Sofia has a peer review to complete.
- Mid-Year 360° Feedback: completed, released grouped results; peer feedback meets the threshold, upward feedback is withheld.
- Annual Performance Review 2026: saved draft cycle.
- Probationary Evaluation — October 2026: future scheduled cycle.

Try HR → Templates → Create Template, publish a small form, then HR → Cycles → Create Cycle. Select Sofia, keep the suggested Self and Manager evaluators, map the published form, and launch. Employee → Reviews → My Reviews shows Sofia’s assignment. Submit it, switch to Manager and submit Angela’s assignment, then use HR → Cycle Details to finalize and release. Employee can then see the released result.

## Developer notes

The existing shell remains in `app.js`, `views.js`, and `style.css`. The unified module remains in `reviews.js` / `reviews.css`; `revisions.js` / `revisions.css` applies the PMSDotNet navigation, HRDotNet lookup simulation, and reporting changes after the module loads. Records are under `data.unifiedReviews`; PMS-specific manager overrides are under `data.pmsManagerAssignments`. Existing employee and goal records are reused. Legacy sample records remain in browser storage for compatibility.

Core production entities: TemplateVersion, Question, Section, Cycle, CycleParticipant, EvaluatorAssignment, ReviewResponse, ResultRelease, and AuditEvent. Use stable IDs, immutable questionnaire snapshots, server-enforced unique assignment constraints, and validated state transitions. The prototype includes a browser-local action log; production requires durable and tamper-resistant audit storage.

Before use with real employee records, implement authentication, server authorization, persistent database storage, concurrency handling, a scheduling service, notifications, retention rules, backups, and accessible notification/error patterns. No emails or external messages are sent by this demo.

## Validation

JavaScript syntax and logic checks passed for role navigation and HR page guards, profile-menu switching, Dashboard-only KPI cards, HRDotNet lookup and manager assignment behavior, employee goal classification, create/edit and restricted progress actions, report filters/charts, template publishing/versioning, question snapshots, cycle configuration/launch, required answers, draft/submission transitions, Not Observed scores, finalization/release gates, anonymous thresholds, and scheduled assignment gating. Browser checks covered the top bar controls, profile menu, simplified Reviews listing and filters, Employee Goals tabs and assigned-goal modal, Employees lookup, bulk assignment modal, and Reports charts.

Functional inspiration: Leapsome’s reusable review templates and cycle workflow; Lattice’s separation of cycle administration and results visibility; Betterworks’ support for multiple feedback perspectives. The existing inventory-derived visual design is retained.

- https://leapsome.zendesk.com/hc/en-us/articles/360024273253-How-to-use-Review-templates
- https://lattice.com/product-updates
- https://www.betterworks.com/product/employee-feedback-software
