# PMS React migration design

## Goal
Convert the entire existing PMS frontend to React and shadcn/ui while preserving the existing business rules, workflows, fields, roles, visual themes, responsive behavior, and user data where feasible.

## Repository placement
The destination is the fork of iti-vin/pms-be. Preserve the backend's existing folders and behavior. Add the frontend in an independent directory without moving existing backend files. Bring over existing frontend assets and workflow behavior from the current PMS repository as migration references.

## Approach
Use React with TypeScript, Vite, and shadcn/ui components. Retain the existing visual identity and both themes. Migrate screens and shared controls to React components, extracting business rules and persistence into testable modules. Avoid mounting the existing application inside a React wrapper as the final implementation. Keep existing browser storage keys and provide migration handling where data shapes change.

Migrate the application shell and role navigation, employee and organization administration, KPI and behavioral templates and matrices, review cycles, accomplishments and assessments, results, journals and notices, improvement plans, reporting, notifications, and the workflow guide. Preserve permission checks, validations, failure and recovery paths, and existing data behavior. Backend integration is outside this stack-only migration unless required to preserve an existing frontend behavior.

## Validation and delivery
Record current workflow behavior as acceptance tests before conversion. Test role-specific workflows, calculations, storage migration, both themes, mobile layouts, and keyboard accessibility. Run frontend and existing backend checks. Commit logical changes to the fork and report the commit and any remaining limitations.

## Origin and compatibility
Browser storage is origin-specific. Preserve the existing storage keys on the same origin; if deployment changes origin, provide an explicit export/import path for existing prototype data. Compare all roles and workflows against the current prototype. The frontend directory is additive, and existing backend paths remain untouched.
