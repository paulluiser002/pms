> Updated role views, multiple cycles, and browser verification are documented in Role-views-and-modules.md. The single-cycle and unverified-browser notes below describe the original version.

# Performance management MVP

An interactive mockup using fictional employee data. Open `performance-mvp.html` directly in a modern browser, or use the hosted private preview. Changes save in the current browser. The MVP guide includes a reset option.

## Core features

| Feature | Included in mockup | Production acceptance criteria |
|---|---|---|
| Employee directory | Add/edit name, role, department, manager; search and filter | Unique employee identity, validated manager assignment, import and deactivation |
| Goals and KPIs | Assign a measurable goal, category, date, progress | Employee and manager can agree targets; track changes and evidence |
| Review cycle | Edit name, deadline, active/closed label | HR selects participants, opens/closes cycle, enforces deadlines |
| Self-assessment | Reflection, draft, submit | Employee sees only permitted records; submission locks employee inputs |
| Manager review | Three equally weighted ratings, feedback, completion | Assigned manager reviews direct reports; audit submission and changes |
| Acknowledgment | Employee acknowledgment recorded | Authenticated employee acknowledges receipt; acknowledgment does not imply agreement |
| Dashboard and reports | Completion, goal progress, status filters, CSV | Authorized reporting scope; consistent server calculations and safe CSV export |

## Review flow

1. HR configures a review cycle and employee reporting lines.
2. Employee and manager agree on measurable goals.
3. Employee saves a reflection, then submits the self-assessment.
4. Manager rates goal achievement, quality of work, and collaboration from 1–5 and records development feedback.
5. The review is completed; the employee acknowledges receipt.
6. HR tracks completion and follows up on outstanding reviews.

The overall rating is the arithmetic mean of the three manager ratings. Goal progress is reported separately and is not automatically converted into a rating.

## Production roles

- Employee: own goals, self-assessment, finalized review, acknowledgment.
- Manager: direct reports’ goals and reviews, team reporting.
- HR administrator: employee records, cycles, templates, completion reporting, audited administration.

## Minimum production work remaining

The current deliverable is a browser prototype, not a deployed HR records system. Add authentication, server-enforced permissions, persistent database storage, validation, audit history, backups, privacy/retention controls, deadline enforcement, and reminder delivery before real use. The mockup simulates roles in one session, supports one current cycle, and stores records in localStorage. Closing a cycle only changes its label. No emails are sent.

Recommended core records: Employee, Goal, ReviewCycle, Review, CriterionRating, Acknowledgment, AuditEvent. Give records stable IDs and reference employees and managers by ID in the production database.

## Later releases

360-degree feedback, calibration, competency libraries, dedicated development plans, HRIS integrations, advanced analytics, and compensation workflows. Keep these outside the first release.

## Suggested user acceptance walkthrough

Add an employee → create their goal → submit their self-assessment → complete the manager review → acknowledge as employee → inspect reports and export CSV → refresh to confirm browser persistence.

## Validation

JavaScript syntax validation passed. A DOM-stub logic check passed for six screen renders, employee and goal creation, goal progress, self-assessment submission, manager completion, and employee acknowledgment. Local browser preview and source publishing could not connect in this environment. Visual browser QA remains unverified; no hosted deployment was completed.


