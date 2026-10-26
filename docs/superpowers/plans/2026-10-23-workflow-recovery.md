# Workflow Recovery Implementation Plan

Goal: Resolve the four identified workflow gaps while preserving the current branding and historical results.
Architecture: Update existing accomplishment, assessment, and scoring functions; reuse current modal and panel components. No dependencies or server changes.

- [x] Add regression checks against the loaded current application for returned-record deadlines, launch validation, coordinated corrections, deadline extension, and anonymous scoring.
- [x] Let returned accomplishments be corrected through the verification deadline. Reject launches with expired accomplishment/verification windows.
- [x] Add active-cycle HR deadline extensions with ordered dates, no shortening, recorded reason, assignment deadline updates, and audit history.
- [x] Replace blocked sequential reopening with confirmed, reasoned HR corrections. Archive affected responses, preserve answers as drafts, clear submission state, and require downstream reconfirmation in sequence. Completed/released cycles remain immutable.
- [x] Score anonymous feedback only after each perspective meets its response threshold; align result grouping and descriptions. Preserve finalized snapshots.
- [x] Run regression and existing checks, inspect UI in browser, and document remaining prototype limits.
