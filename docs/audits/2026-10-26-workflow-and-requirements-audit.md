# PMS logical and requirements audit — 26 October 2026

What this repo does: HRDotNet Performance models KPI/behavioral evaluations, sequential reviews, confidential journals/NTEs, and weekly PIPs. This audit treats it as a working browser-local prototype intended to demonstrate realistic HR workflows. Shared production operation is a separate delivery requirement.

Method: inspect current screens, trace source and existing PRD, run all 22 current verification scripts, and exercise edge cases in isolated Node VM fixtures. All existing scripts passed. The cases below expose missing regression coverage; passing tests do not invalidate them. No product code or browser records were edited for this audit.

## Must fix

1. **Manager changes can leave nobody able to verify accomplishments.**
   - What this is: accomplishment verification requires both current team membership and the corresponding assigned Manager assessment.
   - Problem: reassignment keeps an In Progress assessment with the old evaluator. The old manager loses team scope; the new manager lacks that assessment. Verification and cycle finalization become blocked.
   - Fix: explicitly transfer verification responsibility, or preserve narrowly scoped authority for the frozen evaluator with an HR reassignment/recovery action.
   - If skipped: an otherwise valid cycle can remain unfinished indefinitely.
   - Evidence: `performance/dist/position-goals.js:52`, `performance/dist/revisions.js:97`. Reproduced allowed verification becoming disallowed after reassignment.

2. **A new failed indicator cannot be added to an active PIP through the screen.**
   - What this is: later failed evaluations join an existing open plan as additional referrals.
   - Problem: the follow-up editor requires an existing week, copies its indicator and disables the focus selector. If a new referral concerns C but the plan contains only A, C cannot receive a weekly section. A review note can clear the referral flag without resolving that limitation.
   - Fix: support a new weekly section from an additional referral as well as a linked follow-up to an existing week.
   - If skipped: the system records a new improvement need that staff cannot operationalize.
   - Evidence: `performance/dist/pip-ui.js:37`, `:56`, `:57`, `:58`. Isolated fixture: A-only active plan plus C referral.

3. **Different evaluation indicators can collapse into one PIP option.**
   - What this is: PIP sources preserve multiple frozen evaluations.
   - Problem: the selector deduplicates by indicator ID alone. The same ID in two evaluations with changed names or targets resolves to the first source; the other criteria are hidden from planning.
   - Fix: identify a source indicator by evaluation ID plus indicator ID, and retain that identity on the weekly section.
   - If skipped: staff can plan against the wrong historical criteria.
   - Evidence: `performance/dist/pip-ui.js:14`, `performance/dist/pip-workflow.js:73`. Reproduced Accuracy/10 hiding a different KPI/99 under the same ID.

4. **Lower-is-better indicators receive reversed default matrix scores.**
   - What this is: choosing a numeric scale generates initial thresholds and labels.
   - Problem: the generated scale always rewards higher actual values. For a maximum five-day target, enabling the default scale awards zero days 1/5 and ten days 5/5. Publication accepts it.
   - Fix: generate direction-aware defaults and preview boundary scores before publication, including zero-target cases.
   - If skipped: a creator can unintentionally publish the opposite scoring policy.
   - Evidence: `performance/dist/indicator-matrix.js:4`, `:20`, `:30`. Reproduced valid publication and inverted scores.

5. **Scheduled behavioral assessments can lose their frozen template.**
   - What this is: templates are frozen when the cycle is scheduled.
   - Problem: assignment generation looks up the snapshot using the employee's current position. A position change before activation misses the saved key and falls back to a live template.
   - Fix: freeze and resolve template assignment per employee, independent of later directory changes.
   - If skipped: a scheduled evaluation can launch with different questions from those HR approved.
   - Evidence: `performance/dist/cycle-workflow.js:185`, `:187`. Reproduced a live template being selected instead of the frozen fixture.

6. **Corrected accomplishments overwrite the previous submission evidence.**
   - What this is: returned accomplishments can be corrected and resubmitted.
   - Problem: resubmission replaces submittedValues; history preserves the action but not the earlier actuals. In a fixture, submitted 111 was replaced by 222 with no 111 remaining in the record.
   - Fix: retain immutable submission versions and correction reasons, with a history viewer like the assessment correction workflow.
   - If skipped: HR cannot reconstruct what changed between submissions.
   - Evidence: `performance/dist/position-goals.js:71`.

7. **NTE closure can remove an employee's response opportunity early.**
   - What this is: HR may close an issued notice and employees can respond only while it is Issued.
   - Problem: HR can close immediately, before the explanation deadline, without a response or read receipt. A subsequent employee explanation is rejected.
   - Fix: require a response or an expired response window before ordinary closure; define a separate exceptional closure reason if early closure is necessary. Cancellation should remain a distinct action.
   - If skipped: the deadline shown to an employee does not guarantee that the response facility stays available.
   - Evidence: `performance/dist/nte-files.js:32`, `:38`. Isolated fixture: issue with deadline 30 October; close before deadline succeeds, response then fails. This is a workflow safeguard recommendation, not a legal compliance conclusion.

## Requirements to settle

8. **PIP completion does not guarantee every failed indicator was addressed.**
   - What this is: initial planning proposes one section per failed focus.
   - Problem: staff can remove B from a plan referred for A and B, activate A alone, and eventually complete the plan. Validation checks that chosen focuses are permitted, not that all failures are covered.
   - Fix: require coverage or a documented exclusion/deferral for every failed source indicator. Decide whether successful PIP means all failures resolved or only the selected scope.
   - If skipped: “Completed” can imply a broader recovery than was measured.
   - Evidence: `performance/dist/pip-ui.js:23`, `performance/dist/pip-workflow.js:72`, `:83`, `:116`. Reproduced; current spec leaves coverage implicit.

9. **A seven-day PIP can finish on its first day.**
   - What this is: employee progress opens on the section start date.
   - Problem: submission, final assessment and plan closure have no period-end requirement for submitted weeks. A 19–25 October plan can become Completed on 19 October. Non-submission assessments, by contrast, wait until after deadline.
   - Fix: choose whether these are full-week observation periods or deliverable-based goals that allow early completion. For full-week metrics, allow progress drafts but defer final submission/assessment until period end; permit documented exceptions only if intended.
   - If skipped: weekly rates and sustained behavior can be judged from an incomplete period.
   - Evidence: `performance/dist/pip-workflow.js:88`, `:100`, `:118`. Reproduced first-day completion.

10. **Calendar behavior is still demonstration behavior.**
   - What this is: deadline rules and effective manager assignments depend on dates.
   - Problem: urToday is fixed to 19 October 2026; the audit was run on 26 October. Future-effective manager assignments are applied immediately, and scheduled cycle activation runs at script load rather than through a reliable scheduler.
   - Fix: separate an explicit demo clock from a real company-timezone clock, honor effective dates, and define recurring activation/reminder processing for shared deployment.
   - If skipped: dates look meaningful but do not advance or take effect consistently. This is a known prototype boundary that now affects nearly every workflow.
   - Evidence: `performance/dist/reviews.js:17`, `performance/dist/revisions.js:71`, `:97`, `performance/dist/cycle-workflow.js:234`. Future assignment dated January 2027 applied immediately in a fixture.

## Further requirements before operational use

- PIP: declare an accountable owner and assessor, pause/reschedule for leave, reassignment/departed-evaluator recovery, assessment correction and employee disagreement handling. Activated weeks currently cannot be rescheduled or corrected; adding a follow-up or cancelling is not equivalent.
- NTE: define deadline extension, request-for-clarification/additional response, HR response queue/notifications, evidence attachments, and structured closure outcomes. Employee explanations currently lock after one submission and HR receives no corresponding response notification.
- Evaluation: define post-release correction, withdrawal, appeal and replacement snapshot behavior, including how an invalidated failed evaluation affects a linked PIP.
- Production: the repo explicitly documents browser-local storage and role preview. Real shared records, authenticated users, server-enforced permissions, delivery, concurrent edits, backups, retention and audit integrity remain prerequisites. These are known delivery boundaries, not newly discovered regressions.

## Captured screen steps

1. Dashboard — useful status counts, but next actions omit PIP/NTE work and use the frozen workflow clock. Screenshot: `/tmp/pms-audit-2026-10-26/01-dashboard.png`.
2. PIP register — clear status counts and scoped enrollment navigation; underlying referral/coverage cases require fixes 2, 3 and decision 8. Screenshot: `/tmp/pms-audit-2026-10-26/02-pip-list.png`.
3. PIP planning — goal/target/actions/support fields exist; calendar and completion rules remain incomplete. Screenshot: `/tmp/pms-audit-2026-10-26/03-pip-planning.png`.
4. NTE masterlist — scoped employee navigation exists; closure/response protection must be enforced underneath it. Screenshot: `/tmp/pms-audit-2026-10-26/04-nte-masterlist.png`.

Screenshots were captured in this run and inspected. Findings about transitions are based on source and isolated VM cases, not inferred from screenshots. Native labels and roles were inspected in the current view; a complete keyboard/screen-reader accessibility audit was not performed.

Verdict: the main flows are demonstrable, but exception handling, evidence preservation and PIP scope need another hardening pass before these workflows should govern real employee records. Prioritize 1–7, then settle 8–10.

Not checked: real HRDotNet integration, production auth/database/delivery (not present), full mobile/device matrix, every legacy sample flow, legal/policy compliance, or load testing. No fixes were applied.


## Implementation follow-up — 26 October 2026

The user authorized fixes 1–7 after this audit. Those fixes are implemented with regression coverage:

- 1: current-manager verification responsibility, while retained evaluators keep narrowly scoped read-only evidence.
- 2–3: active-plan additional source sections and evaluation-qualified indicator identities; legacy criteria preserved.
- 4: direction-aware default scales, exact inclusive maximums, zero-target support and boundary preview; original saved policies unchanged.
- 5: behavioral template snapshots per participant; missing original snapshots fail safely with visible guidance.
- 6: immutable accomplishment submission versions and scoped history screens.
- 7: protected NTE response windows, with a separate documented early-closure exception and confirmation.

Policy decisions 8–10 and the further production requirements above remain outside this fix scope. Historical evidence already overwritten by older code cannot be reconstructed. See `docs/superpowers/plans/2026-10-26-audit-gap-fixes.md` for verification progress.
