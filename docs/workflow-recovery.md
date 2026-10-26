# Workflow recovery changes

Updated October 23, 2026. These rules describe the current position-template accomplishment workflow and supersede conflicting details in the older MVP guide.

## Employee corrections

Employees save and submit actual accomplishments in Goals. A manager can verify the record or return it with a required correction reason. A returned record can be edited and resubmitted through the cycle's manager verification deadline, even after the original accomplishment deadline. The return notice shows the correction deadline. Submitted and verified records stay read-only.

If that correction window has also expired, HR can extend the active cycle's deadlines. Employees and managers cannot extend dates themselves.

## HR deadline recovery

Open Reviews → Cycles → an active cycle → Overview → Workflow Recovery → Extend Deadlines.

HR supplies a reason and keeps or extends the accomplishment, verification, and assessment deadlines. Dates cannot be shortened, verification must follow accomplishment submission, and assessment deadlines must stay in sequence. Verification cannot fall after the Manager assessment deadline. The accomplishment deadline must be today or later. At least one deadline must change.

The operation updates assignment deadlines without discarding answers. Cycle Details retains the extension history. Completed and released cycles cannot be extended.

Launch and scheduling now reject expired accomplishment and verification windows before creating assignments.

## Coordinated assessment correction

Open Cycle Details → Progress → Reopen beside a submitted assessment. HR must provide a reason and confirm the affected sequence.

The selected response and all later responses for that employee preserve their previous state, answers, feedback, actuals, submission date, reason, actor, and correction timestamp in response history. Submitted or started responses return to drafts; untouched later assignments remain Not Started. Submission markers are cleared, and the existing sequence locks later stages until earlier stages are resubmitted.

The assessment page shows the reason and previous response versions under the same response-access restrictions. HR cannot edit answers on an evaluator's behalf. Accomplishment verification is preserved because this action corrects assessment responses. Finalized/released results cannot be reopened by this feature.

## 360-degree scoring

For active connected cycles, eligible observed numerical ratings include anonymous Peer and Upward perspectives only when each perspective has the configured minimum number of distinct submitted evaluators. Anonymous stages for the same perspective are pooled in the result summary. Below-threshold groups contribute neither numerical scores nor written feedback to the summary. Anonymous evaluator identities remain hidden.

Not Observed and unanswered ratings remain excluded. Finalized score snapshots are preserved; this change does not recalculate historical scores.

## Verification and limits

Run `node work/check-workflow-recovery.cjs` for recovery and scoring regressions, including corrected assessment resubmission, finalization, release, permissions, and finalized snapshot preservation. The other `work/check*.cjs` scripts cover existing behavior. `python3 work/build-local-preview.py` refreshes exported browser assets and the standalone preview.

Brand colors, typography, CSS, and page layout are unchanged. New controls reuse the existing panels, dialogs, and form styles.

The existing prototype still uses its fixed sample date of October 19, 2026. Storage, role previews, and audit history remain browser-local; this work does not add authentication, a shared database, or background scheduling.
