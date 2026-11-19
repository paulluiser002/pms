# KPI indicator matrices — implementation brief for Claude

## Task and design authority

Implement the indicator matrix feature in the PMS React frontend using shadcn/ui. Design the editor, setup flow, interactions, and component structure yourself. Use the existing PMS branding, Classic and Workspace themes, responsive conventions, and accessible controls. Preserve the existing repository folders and surrounding performance workflows.

The requirements below define the behavior that must survive your design choices. Choose practical presentation details without seeking approval for routine layout decisions. Deliver a working feature through its normal template, goal, and evaluation entry points, with verification against the acceptance cases in this document.

This brief concerns matrices inside **KPI Goal Templates**. Behavioral Assessment Templates continue to use their existing question and rating logic.

## Reference implementation

The React repository is https://github.com/paulluiser002/pms-be.

The behavior reviewed for this brief is pinned to commit `38e9e7b85647eabc339d612cb8f61e40c3d50983`. Inspect the current branch before changing code because it may have evolved.

Relevant React source is `frontend/src/performance.tsx` and `frontend/src/performance.test.tsx`. Locate `MatrixEditor`, `MatrixView`, `matrixError`, `validateGoalTemplate`, `indicatorScore`, `createCycle`, `finalizeEvaluation`, `releaseEvaluation`, and `legacyMatrix`.

The legacy reference is `frontend/legacy/indicator-matrix.js`, especially `mxMatrixErrors`, `mxScaleWarning`, `mxBoundaryPreview`, and `mxScaleScore`. Its equivalent in the original PMS workspace is `performance/dist/indicator-matrix.js`.

## Required product behavior

### Ownership and scope

- HR creates and revises matrices as part of KPI Goal Template authoring.
- Each indicator has zero or one matrix. Different indicators in the same template can use different formats and scoring settings.
- An indicator still has its own name, measurement unit, target, Higher/Lower performance direction, weight, target-met score, and below-target score.
- Managers and employees see the applicable criteria in authorized goal, accomplishment, assessment, and result views. Visibility follows existing company, employee, review-stage, and release permissions.
- Keep published-template versioning and historical evaluation behavior consistent with the PMS.

### Supported configurations

| Configuration | Evaluation behavior |
| --- | --- |
| No matrix | Existing target-met scoring |
| Custom reference table | Existing target-met scoring |
| Numeric scale with scoring disabled | Existing target-met scoring |
| Numeric scale with scoring enabled | Scale-derived score replaces target-met scoring for this indicator |

The “Use for scoring” setting is explicit per indicator. New matrices start in reference mode. Changing a format must never silently enable scoring.

### Custom reference table

Allow the creator to add, edit, and remove columns and rows, name columns, enter plain text in cells, and supply a matrix title.

A valid published table has at least one named column and one row. Every row has exactly one string cell per column. Blank cell text is allowed. Column names contain non-whitespace text.

Reference tables always have `scoring = false`. A column called “Score” or numeric-looking cell text remains descriptive content. Arbitrary table contents do not become formulas or executable expressions.

### Numeric threshold scale

Each row contains a boundary, a nonblank rating label, and a finite score from 1 through 5. Decimal boundaries and decimal scores are supported.

Support these two threshold modes.

#### Minimum actual, inclusive

Use strictly increasing nonnegative minimum boundaries, starting at zero. Select the score on the last row whose minimum is less than or equal to the actual result. The highest row covers all greater results.

Example for a satisfaction indicator measured in percentage points, with target 90 and Higher direction.

| Minimum actual | Label | Score |
| ---: | --- | ---: |
| 0 | Needs improvement | 1 |
| 70 | Developing | 2 |
| 80 | Approaching expectations | 3 |
| 90 | Meets expectations | 4 |
| 95 | Exceeds expectations | 5 |

Expected scores are 0 → 1, 76 → 2, 89.9 → 3, 90 → 4, and 97 → 5.

#### Maximum actual, inclusive

Use strictly increasing nonnegative finite maximum boundaries, followed by one final unlimited row represented by `null`. Select the first row whose maximum is greater than or equal to the actual result. The unlimited row catches all remaining results.

Example for response time measured in hours, with target 4 and Lower direction.

| Maximum actual | Label | Score |
| ---: | --- | ---: |
| 1 | Outstanding | 5 |
| 2 | Exceeds expectations | 4 |
| 4 | Meets expectations | 3 |
| 8 | Needs improvement | 2 |
| No upper limit | Unsatisfactory | 1 |

Expected scores are 0.8 → 5, 2 → 4, 3 → 3, 4 → 3, 6 → 2, and 12 → 1.

The final unlimited maximum row is structural. Preserve coverage when rows are inserted or removed. Its displayed boundary is read-only.

### Actuals, units, and baseline scoring

Compare thresholds against the raw actual in the indicator's measurement unit. An actual of 90 means 90 percentage points for a percentage indicator, 90 cases for a count indicator, or 90 hours for an hours indicator. Do not automatically convert actuals into percentage achievement against target.

Actuals must be finite, nonnegative numbers. Zero is a valid actual. Missing, blank, invalid, or unverified actuals cannot be treated as zero to finish an evaluation.

When matrix scoring is disabled or unavailable, preserve the baseline calculation.

- Higher direction meets target when `actual >= target`.
- Lower direction meets target when `actual <= target`.
- Use the configured target-met score when target is met and the configured below-target score otherwise.

Both baseline scores range from 1 through 5. Matrix labels explain the selected row and do not change the calculation. Threshold mode determines range matching independently of the indicator's Higher/Lower direction.

### Scoring toggle and previews

Show whether a matrix is reference-only or used for scoring everywhere criteria are displayed.

For numeric scales, make the consequence of enabling scoring clear. The scale becomes the source of the indicator rating instead of its two baseline scores.

Provide a preview that demonstrates the selected score for a supplied actual and at the exact indicator target. Include boundary examples immediately below, at, and above thresholds. Choose sample differences appropriate to the displayed precision. Compute with the original numeric value and round only the display.

When scoring is disabled, identify preview values as proposed scale scores. Display the currently effective baseline score separately or make the distinction equally clear in your design.

### Validation and warnings

Validate all affected indicators before publication and all numeric data at scoring boundaries.

- Require a supported matrix format and threshold mode.
- Require named scale rows and finite scores within 1–5.
- Reject negative, duplicate, descending, missing, or nonfinite finite boundaries.
- Require the zero starting row for minimum scales.
- Require one final unlimited row for maximum scales and reject unlimited rows elsewhere.
- Require valid table dimensions and named columns.
- Require positive indicator weights whose template total is 100%, allowing the existing small floating-point tolerance.
- Keep an invalid scoring scale from producing an official score. Report which indicator and row need correction.

Provide a warning when scores conflict with performance direction. For Higher indicators, scores normally stay equal or rise as actuals increase. For Lower indicators, scores normally stay equal or fall as actuals increase. Preserve intentionally configured scores and explain the conflict instead of silently rewriting them. This warning exists in the legacy implementation and must survive the redesign.

Draft handling may follow the existing template workflow. Incomplete drafts remain visibly incomplete and cannot be published, assigned as valid published standards, or used for official scoring.

### Safe editing

Preserve work when changing rows, columns, titles, and scoring settings. Adding or removing a table column updates every row consistently.

The reviewed React editor resets rows when the user switches threshold type or matrix format. Treat this as a data-loss hazard to resolve in the new setup. Preserve compatible data when possible. For destructive conversions, explain the effect and obtain confirmation within the editor before replacing existing rows.

Changing an indicator target or unit must not silently rescale custom thresholds. Let the creator review their matrix against the new target and unit. A valid but unusual target-to-score relationship should remain visible in the preview.

## Evaluation and PIP integration

1. HR publishes a valid KPI Goal Template.
2. Goal assignment retains the applicable indicator criteria.
3. Review-cycle creation freezes the applicable template version, indicator target, weight, matrix contents, and scoring mode for each participant.
4. The employee submits accomplishments and evidence through the existing workflow.
5. The manager verifies actual results.
6. Finalization computes indicator scores from verified actuals using the frozen criteria.
7. Each indicator contributes `indicatorScore × indicatorWeight / 100` to the KPI score.
8. Existing cycle component weights combine KPI and behavioral scores.
9. HR releases finalized results through the existing release action.
10. The existing PIP referral workflow evaluates failed verified indicators independently of matrix ratings.

For example, scores 4 and 3 weighted 60% and 40% produce a KPI score of 3.60. With a behavioral score of 4.00 and cycle weights of 70% KPI and 30% behavioral, the overall score is 3.72.

A matrix must not determine whether the target was achieved. A Higher indicator with target 90 and verified actual 88 is below target even if its matrix awards 3 or 4. A Lower indicator with target 4 and actual 5 also fails target. A high overall score does not suppress a failed-indicator PIP referral.

Preserve the implemented referral point on release of a finalized evaluation. Releasing an already released evaluation must not duplicate its referral. The employee enters Awaiting Planning, and Manager/HR defines the improvement plan before activation. Behavioral-only evaluations have no KPI-indicator referral.

Preserve result visibility and assessment-stage permissions when showing matrices. Employee results follow the existing release rules. A matrix editor must never become a route for changing a finalized evaluation's criteria.

## Persistence, compatibility, and audit

The current prototype uses browser-local persistence. Preserve its integration while implementing this feature. Apply the same validation in a future API when backend persistence is connected.

The reviewed React matrix shape is conceptually the following. Internal representation can change if migration preserves behavior.

```ts
type Matrix =
  | {
      kind: "table";
      title: string;
      scoring: false;
      columns: string[];
      rows: string[][];
    }
  | {
      kind: "scale";
      title: string;
      scoring: boolean;
      bound: "minimum" | "maximum";
      rows: {
        boundary: number | null;
        label: string;
        score: number;
      }[];
    };
```

Legacy scales store each boundary under `minimum` or `maximum`. The React shape uses `boundary`. Account for both when importing existing templates and snapshots. Preserve `null` as the unlimited maximum and preserve `scoring = false` without coercing it to true.

Existing indicators without matrices continue using baseline scoring. Migration preserves template IDs, versions, published status, company scope, labels, weights, targets, historical snapshots, and official stored results. Keep malformed source data recoverable and explain conversion problems. A failed save or migration must not partially replace records.

Changes to current templates must not recompute previous official results. Track matrix changes through the existing version and audit conventions. Include changes to rows, boundaries, scores, titles, formats, and scoring mode.

## Acceptance criteria

Verify through both domain tests and the normal UI entry points.

| Case | Expected outcome |
| --- | --- |
| One template has a scale indicator, table indicator, and indicator without a matrix | All three persist and use the correct scoring behavior |
| Numeric scale is newly created | Scoring starts disabled |
| Reference scale includes actual 90 in a row scored 4, baseline target-met score is 5 | Actual 90 receives 5 until scoring is enabled, then 4 |
| Satisfaction scale uses the minimum example above | All listed actuals produce the listed scores |
| Response-time scale uses the maximum example above | All listed actuals produce the listed scores |
| Actual equals a boundary, is just below it, or just above it | Inclusive matching selects the correct row without premature rounding |
| Actual is zero | It is treated as a genuine result |
| Actual is missing, negative, invalid, or unverified | Official scoring/finalization is prevented appropriately |
| Scale has duplicate boundaries, a missing zero minimum, or missing unlimited maximum | Publication fails with actionable row-level feedback |
| Reference table has a column called Score | Cells remain descriptive and baseline scoring still applies |
| Table column is added or removed | Every row remains aligned |
| A configured score conflicts with performance direction | Warning appears and the entered scores remain intact |
| Indicator weights are 60% and 40%, scores are 4 and 3 | KPI score is 3.60 |
| Target is changed after configuring custom thresholds | Custom rows remain intact and preview uses the new target |
| Switching format or threshold type would discard data | User sees the effect before confirming the conversion |
| Template matrix changes after a cycle snapshot | Existing cycle criteria and results remain unchanged |
| Actual fails target while matrix awards an acceptable-looking score | Existing failed-indicator referral occurs on result release |
| Released evaluation is released again | No duplicate PIP referral |
| Legacy minimum/maximum rows are imported | Boundaries, labels, scores, and scoring mode are preserved |
| Company or role changes | Matrix visibility and authoring follow the new authorized scope |
| Save fails or source data is malformed | Previously saved records remain recoverable |
| Editor is used on mobile or with keyboard only | Fields, table controls, validation, and scoring toggle remain usable |

## Completion report

After implementation, report the changed screens and workflow behavior, verification performed, compatibility handling, and any unmet requirement or known limitation. Explicitly identify any business rule you could not preserve. Include the actual remaining work instead of assuming that passing component tests proves the whole feature is complete.
