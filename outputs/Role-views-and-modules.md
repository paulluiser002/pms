# Performance management: role views and modules

The original sample mixed HR administration and manager evaluation. The revised mockup has three separate role tabs, with separate fictional identities:

| User type | Demo identity | Modules | Ownership |
|---|---|---|---|
| Employee | Sofia Garcia | Dashboard, My Goals, My Reviews, My Profile | Own goals, self-assessment, acknowledgment; read own employment details |
| Manager | Angela Reyes | Dashboard, My Team, Team Goals, Team Reviews, Review Cycles, Reports | Direct report goals and evaluations; assigned cycle visibility; team export |
| HR Administrator | Maria Angeles | Dashboard, Employees, Goals & KPIs, Performance Reviews, Review Cycles, Reports, Roles & Access | Employee records, company cycle setup, participants, dates, process monitoring |

## Cycle ownership

For this MVP, HR creates, edits, activates, and closes formal review cycles. Managers conduct evaluations within assigned cycles. Employees cannot create cycles. This keeps company dates, rating criteria, and participant rules consistent. Manager-created departmental cycles could be added later as an explicit delegated permission with HR approval.

Review cycles now use a table with cycle name, participant scope, start date, self-assessment deadline, manager deadline, status, completion, Open, and Edit. HR has a Create Review Cycle modal. Participants can be all employees or a department and are captured at creation. Date validation enforces start ≤ self-assessment deadline ≤ manager deadline. Draft and Closed cycles are read only for assessments. Each cycle keeps its own review statuses, drafts, ratings, and acknowledgments; goals are shared outside cycles.

## Dashboard charts

- Review status donut: participant counts in the selected cycle.
- Horizontal goal progress chart: personal goals for employees, department averages for managers and HR.
- Goal progress distribution: goal counts by progress range.
- KPI cards and next actions adapt to the selected role.

Charts calculate from the sample records. No invented historical trend is shown.

## Try the shared workflow

1. Employee → My Reviews: submit Sofia’s self-assessment.
2. Manager → Team Reviews: open Sofia’s review, provide three ratings and feedback, then complete it.
3. Employee → My Reviews: read the completed feedback and acknowledge receipt.
4. HR Administrator → Review Cycles: create another cycle; select it to inspect its separate review records.

Managers and HR staff are also employees in production, so a real account can hold multiple roles. These prototype tabs switch sample identities to make the views easy to compare. A separate System Administrator permission should handle accounts, integrations, and security without automatically granting review-content access; it is outside these performance screens.

## Verification and limits

Syntax checks and logic checks passed for every role module, role scope, charts, cross-role review submission, acknowledgment, date validation, and independent cycle records. Browser review confirmed the Dashboard charts, Employee navigation and personal metrics, HR cycle table, and Create Review Cycle modal. This remains a browser-local prototype; role tabs demonstrate access rules but do not replace server authorization or authentication.
