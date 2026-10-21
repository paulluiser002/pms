from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
s = (root/'outputs/PMSDotNet-Product-Requirements.md').read_text(encoding='utf-8').replace('PMSDotNet', 'PulseDotNet')
s = s.replace('Version 1.1 |', 'Version 1.2 |')
def requirement(key, text):
    global s
    s, n = re.subn(r'^'+re.escape(key)+r' .*$', key+' '+text, s, flags=re.M)
    assert n == 1, (key,n)

s = s.replace('Milestone tracking calculates goal progress automatically while preserving existing manual progress until a tracking change is confirmed.', 'Milestone tracking calculates goal progress automatically. Existing saved manual values are preserved when records are opened or viewed. Configuration and progress updates are separate permissions, and a first milestone on an existing goal with positive manual progress requires a staged tracking-change confirmation.')
requirement('NAV-05', 'Remove breadcrumbs everywhere. Dedicated nested pages use a subtle Back link above the page title with clear spacing. Goal Details is a modal with X and Close controls and no Back to Goals link. Review listing scope controls remain separate from the three Reviews sidebar destinations.')
requirement('UI-01', 'PulseDotNet is the sole application name in the logo, browser title, and account surfaces. Use the supplied logo mark and wordmark artwork. Align the wordmark text and the tagline clear goals. better performance. to the left, with the tagline directly beneath the wordmark. Preserve the original logo colors and mark; remove obsolete product branding.')
requirement('UI-09', 'Toolbar padding is 24px horizontally and 20 to 24px vertically, field gaps are 16px, and inputs are 44px tall. Add no empty spacer below filters. Cells use 20 to 24px horizontal padding. Preserve existing search, filters, column alignment, and progress styling; move record actions into their authorized details views rather than retaining a main-listing Actions column.')
s = s.replace('## 7 Company and account interactions', '''### Listing interactions and pagination

UI-11 Remove Actions columns from the main Goals, Reviews, Templates, Cycles, Employees, and My Team listings. Clicking a record opens its authorized details page or modal. Make record rows keyboard focusable and support Enter and Space with visible blue focus styling. Buttons, accordion chevrons, checkboxes, labels, and other nested controls must not trigger parent-row navigation. Preserve search and filter state on return.

UI-12 Use one shared numbered-pagination component across main listings and applicable existing participant, cycle-detail, and setup tables. The footer shows Showing X–Y of Z records on the left. The right side contains a rows-per-page dropdown, Previous, individual page buttons, and Next. Default to 10 rows; retain 10, 20, and 50 options. Highlight the selected page in solid blue and expose its current-page state to assistive technology. For larger page counts, show first and last pages, nearby pages, and non-interactive ellipses.

UI-13 Page-number buttons navigate directly; Previous and Next disable at their respective boundaries. Search, filters, and rows-per-page changes reset to the first page when necessary. Calculate ranges and totals from filtered parent records. Expanded milestone rows do not count as goals. Retain the footer, page 1, and disabled navigation even with one page or zero results; zero results show Showing 0–0 of 0 records.

UI-14 Standardize dropdown, lookup, filter, and expandable navigation chevrons using the same 16px outline SVG, 1.8 stroke weight, centered alignment, and consistent right inset. Rotate the shared chevron for expansion rather than mixing text glyphs or native arrow shapes. Keep role-specific navigation behavior unchanged.

UI-15 Modal close controls use a consistent neutral 20px X within a 40px target, a neutral hover state, and blue keyboard focus. Confirmation titles and action buttons are text-only. Use solid blue for affirmative actions and red for destructive removal. Preserve modal dimensions and established layout; do not add decorative header or button icons.

## 7 Company and account interactions''')
start=s.index('## 9 Goals\n')
end=s.index('## 10 Review assignment workspace',start)
s=s[:start]+'''## 9 Goals

### Identity, ownership, and permissions

GOAL-01 Store a stable goal ID, name, description, owner ID, original creator ID and display name, creation timestamp, source, original assigned-by attribution, category, optional cycle, visibility, original start date where available, required deadline, tracking method, progress, milestones, status, and update history. Categories remain Quality, Delivery, Growth, and Collaboration. Progress must be finite and between zero and 100.

GOAL-02 Created by is automatically populated and immutable; it is never a selectable user field. Owned by identifies the employee responsible for the goal and may differ from its creator. Use existing HRDotNet employee IDs rather than duplicate employee records. Preserve creator, creation timestamp, source, and original assignment attribution through configuration and progress updates. Legacy records with unknown creators show Not recorded or their recorded assignment attribution; never substitute the current editor as the creator.

GOAL-03 Employee My Goals contains goals both created for and owned by that employee. Assigned Goals contains goals owned by that employee but created by authorized HR or a Manager. For legacy records lacking creator metadata, use the saved source classification. Editing or completing a goal must not move it between tabs. Being the original creator alone does not grant access outside current organizational scope.

GOAL-04 HR can configure goals within authorized company scope. Managers can configure goals only for employees in their permitted My Team scope, using HR-configured performance-manager assignments. Employees can configure their own incomplete personal goals. Assigned employees may update their own progress and milestone completion but cannot change the assigned goal configuration. Enforce these rules in action handlers as well as visible controls; production requires equivalent server authorization.

GOAL-05 Validate required name, authorized owner, category, required parent deadline, cycle selection, and permitted manual progress. Preserve an existing start date and reject a deadline before it. Reject a milestone date without a name. Preserve stable milestone IDs, dates, and completion metadata. Reject attempts to mutate creator/source metadata, access out-of-scope goals, or change assigned-goal structure through a progress-only action.

GOAL-06 Preserve name search, category, status, due-date filters, owner filtering for HR and Managers, and assigned-by filtering in Assigned Goals. Create Goal remains available in Employee My Goals. Use the shared numbered pagination and count only parent records.

GOAL-07 Visible states remain Active, Pending Approval, and Completed. Pending Approval takes precedence until resolved. New goals save as Active; the form has no approval-request control. Completed employee goals are read-only for configuration. Authorized milestone completion reversal remains available for automatic goals and can return them to Active. A full approval/rejection workflow remains a product decision.

### Shared Create Goal and Edit Goal forms

GOAL-08 Reuse one form structure and the established design system. Create Goal uses the subtitle Define a goal and set the details below. Edit Goal loads the selected record into the same grouped form. Use subtle section headings, open spacing, and no heavy nested cards.

| Section | Fields and behavior |
| --- | --- |
| Goal Details | Required full-width Goal Name; visible full-width Description; repeatable milestone rows with optional dates and removal; permitted completion controls while editing |
| Goal Assignment | Owned by and Visible for in one row; read-only Created by attribution |
| Goal Configuration | Required Category / Goal Purpose, optional Cycle, and required Deadline in one row |
| Footer | Right-aligned Cancel and solid-blue Save Goal |

GOAL-09 Use Goal Name with placeholder e.g. Improve communication skills. Description uses Describe the expected outcome of this goal. Place Milestones immediately below Description with helper Break this goal into smaller action steps. Show one blank milestone row initially, placeholder Enter a milestone, optional per-row date, a remove control, and Add Milestone. Blank unnamed rows do not count as milestones. Do not use a single milestone textarea, hide Description, or introduce Contributors.

GOAL-10 HR Owned by is a searchable lookup of authorized company HRDotNet employees. Manager lookup searches only permitted My Team employees. Show identifying names and initials or avatars. Employee creation automatically sets the current employee as both owner and creator, displays the owner read-only, and exposes no employee lookup or dropdown. The Goal Assignment layout remains shared. Visible for retains the existing owner/manager visibility option and authorized HR access; do not invent wider grants.

GOAL-11 Create shows no manually editable progress field and saves a new goal at zero percent, with all new milestones pending. Named milestones select milestone tracking; no named milestones select manual tracking. Edit permits manual progress only for a goal without milestones; otherwise show read-only overall progress. Preserve saved legacy percentages on open and unchanged save. Store description, cycle, visibility, and provenance. Goal cycle association is metadata and does not make Dashboard goal metrics respond to the Review Cycle filter.

### Existing listing and milestone completion

GOAL-12 Preserve the existing Goals table, toolbar, column widths, badges, progress bars, and full-width card. The targeted global removal of the Actions column uses row-to-details navigation. A small chevron beside Goal Name independently expands or collapses each goal. Parent row/name opens Goal Details. Multiple expansions may remain open; only parent records count for pagination.

GOAL-13 Expanded milestone rows keep the subtle indented layout and show name, optional due date, completion checkbox, status, and actual completion date when known. Show no individual percentage bar, ellipsis menu, Add, Edit, or Remove action. With no milestones display No milestones added yet. Milestone configuration is available only through Create Goal or authorized Edit Goal.

GOAL-14 Completion checkboxes remain interactive for HR within company scope, Managers within team scope, and Employees on their own personal or assigned goals. Others cannot mutate them. Checking or unchecking updates the parent progress and status immediately and must not open Goal Details. Revalidate permissions in mutation handlers; do not rely on a disabled checkbox alone.

### Progress and tracking transitions

GOAL-15 For milestone tracking, progress equals completed milestones divided by total milestones multiplied by 100, rounded to a whole percentage for display. Completed and Completed (Late) count equally. Three milestones therefore produce 0, 33, 67, and 100 percent. Recalculate after an authorized completion or structural change and persist the result consistently across listing, details, and Dashboard.

GOAL-16 Preserve existing manual sample progress on load, expansion, and unchanged edit, including legacy records already containing milestones. An actual milestone change activates the calculated method. The Change Goal Progress? confirmation is specifically required when an existing goal with positive manual progress receives its first milestone. Show actual Current Progress and New Progress, explain replacement occurs on save, and provide Cancel and Add Milestone. Confirmation stages the edit; only Save Goal persists it. Cancel or X leaves stored data unchanged. New goals, zero-percent manual goals, additional automatic milestones, and viewing do not trigger this confirmation.

GOAL-17 Removing a milestone in Edit Goal opens Remove Milestone? with its name, relevant progress impact, Cancel, and a red Remove Milestone action. Removal changes the form draft only until Save Goal. Removing the final milestone explicitly warns about switching to manual tracking and retaining the last saved percentage; confirm the final transition on save. Do not reset to zero or restore an older manual percentage. Reject stale pending changes if the saved milestone/progress snapshot has changed. Keep the parent form intact behind confirmation dialogs.

### Deadlines and completion dates

| Milestone status | Rule |
| --- | --- |
| Pending | Incomplete with no deadline, or not past its optional deadline |
| Overdue | Incomplete and its own deadline is before the current business date |
| Completed | Complete without a deadline, or completed on or before it |
| Completed (Late) | Actual completion date is later than the milestone deadline |

GOAL-18 Parent deadline is required; milestone dates are optional. Overdue milestones remain completable. Checking records the actual completion date, unchecking clears it, and checking again records a new actual date. Keep historical unknown completion dates unknown; do not invent dates or infer late completion.

GOAL-19 A milestone deadline does not independently make the parent overdue. Parent overdue depends on its own deadline and incomplete state. Due today is not overdue, and completion on the due date is not late. Use the current local date in the prototype and an authoritative organizational business clock in production.

### Goal Details and progress-only updates

GOAL-20 Retain Goal Details dimensions, information layout, functional X, and goal name subtitle. Show Created by and Owned by distinctly. Do not show Back to Goals or an Add Milestone footer action. Right-align Close plus Edit Goal for authorized HR, team Managers, and owners of editable personal goals. Assigned employees see Close plus Update Progress. Respect completed and restricted states; show no unavailable configuration action. Authorized reversal of a completed automatic goal remains available through progress controls.

GOAL-21 Update Progress is a simplified modal, not the full Edit Goal form. Show the goal name, display-only description, owner/deadline, overall progress, and existing progress comment/history. For no milestones, allow a validated numeric 0–100 progress value. For milestone goals, display names, dates, and statuses with completion checkboxes and live aggregate progress. Do not expose goal configuration, owner lookup, or milestone adding, renaming, dating, or removal. Save Progress persists only permitted completion/progress/comment changes and preserves creator, source, and configuration. Closing without saving does not persist draft changes.

''' + s[end:]
requirement('REV-02', 'The listing contains Employee, Review Cycle, Review Type, Reviewer, Due Date, and Status, without an Actions column. Open permitted details through the record row. Provide role-appropriate scopes, search by subject or visible evaluator, cycle/perspective/department/status filters, clear/reset, and shared numbered pagination. Restricted metadata views must not disclose confidential response content.')
s = s.replace('## 12 Review cycle setup and management', '''TPL-07 The builder has a fixed page header with Preview, Save as Draft, and solid-blue Publish actions, plus a subtle draft/question count. Do not duplicate these controls in a bottom action bar. Back to Templates appears above the title and invokes the existing unsaved-change confirmation when necessary.

TPL-08 Preview is a distinct Template Preview mode with the subtitle Preview how the questionnaire will appear to respondents. Back to Builder restores the editor with its name, description, and questions intact. Do not show Save or Publish controls in preview or save preview answers as review responses. Template Details remains separate, with authorized Edit, Preview, Duplicate, and Archive actions.

## 12 Review cycle setup and management''')
s = s.replace('Goal | ID, owner ID, creator ID, source,', 'Goal | ID, owner ID, immutable creator ID/name and creation timestamp, original assigned-by attribution, source,')
requirement('DATA-04', 'Persist milestone IDs and actual completion dates and derive their status from completion and due dates. Preserve legacy percentages until an actual authorized tracking change; apply GOAL-16 for the positive-manual first-milestone confirmation. Store ownership separately from immutable creator and source metadata. Production requires atomic goal/milestone changes, durable audit events, and conflict protection; local snapshots and browser history are prototype safeguards only.')
requirement('AC-05', 'An employee-created self-owned goal appears under My Goals; a Manager/HR-assigned goal appears under Assigned Goals. Editing or updating completion preserves its original creator/source and tab classification. Creator status alone does not grant access outside current scope.')
requirement('AC-18', 'Create Goal and Edit Goal show Goal Details, Goal Assignment, and Goal Configuration in order. Create shows visible Description, one initial milestone row with optional date, Cancel, and Save Goal; no manual progress or Contributors. HR lookup is company scoped, Manager lookup is My Team scoped, and Employee owner is automatically self and read-only. Valid creation records its original creator and saves zero progress.')
requirement('AC-19', 'Expand two goal chevrons independently without changing record counts. Parent row/name opens Goal Details; checkboxes never open it. Expanded rows show no ellipsis, Add, Edit, Remove, or child percentage bars. An empty expansion says No milestones added yet. Search, filters, pagination, deadlines, and existing table alignment remain intact.')
requirement('AC-21', 'A legacy goal saved at 35 percent retains that value on load, expansion, and unchanged save. For an existing positive-manual goal with no milestones, adding the first milestone opens Change Goal Progress? with actual before/after values. Confirming stages the change without persistence; Cancel or X leaves stored data unchanged. Only Save Goal applies the new milestones and calculated tracking. Zero-progress and already-automatic goals do not show that first-add confirmation.')
requirement('AC-23', 'Adding or removing an automatic goal milestone changes the denominator only when saved. Remove Milestone confirmation names the selected row and preserves the parent form. Cancelling removal leaves the draft intact. Removing the final milestone confirms manual fallback and retains the last saved percentage. No-milestone progress remains manually editable for authorized users.')
s = s.replace('## 19 Prototype coverage and known delivery gaps', '''### Latest shell, pagination, and goal permissions

AC-27 Every main listing has no Actions column and supports row click and keyboard activation. Nested controls remain isolated. Details expose only permitted actions, and returning preserves the existing filter/search context.

AC-28 With 40 filtered records and 10 per page, page 3 shows records 21–30 and highlights 3. Previous/Next disable at boundaries. Changing to 20 rows or changing a filter resets page state appropriately. Large page counts use ellipses. One-page and empty results retain page 1 and disabled navigation. Expanded milestones never affect totals.

AC-29 HR cannot select an owner outside the authorized company. Manager lookup includes only current My Team employees. Employee Create has no owner lookup and saves the current employee as owner and creator. Direct calls attempting to change immutable provenance or assign outside scope are rejected.

AC-30 Goal Details shows Close and Edit Goal for permitted configuration editors, or Close and Update Progress for assigned employees. It contains no Add Milestone or Back to Goals control. Update Progress cannot change configuration or milestone structure; it validates manual progress or calculates milestone progress and preserves provenance on save.

AC-31 Authorized HR, Managers, personal-goal owners, and assigned-goal owners can check/uncheck their permitted listing milestones. Unrelated employees and out-of-team Managers cannot. Three milestones calculate 33, 67, and 100 percent as completions increase; reversal and late-completion dates remain correct.

AC-32 Template builder header actions stay available while editing. Preview shows no authoring actions, and Back to Builder preserves all draft fields. Leaving a dirty builder invokes the existing discard confirmation. Branding and tagline are left aligned; dropdown chevrons and modal X controls use the shared visual rules.

## 19 Prototype coverage and known delivery gaps''')
old='The latest goal enhancements are local changes. Browser checks verified'
a=s.index(old); b=s.index('\n\n| Gap',a)
s=s[:a]+'''The latest local revisions include shared Create/Edit Goal forms, company/team-scoped owner lookups, immutable creator metadata, progress-only updates for assigned employees, completion-only milestone interactions in listings, staged tracking and removal confirmations, numbered pagination, row-to-details navigation without main Actions columns, consistent chevrons and modal controls, and updated template header/preview navigation.

Existing regression scripts cover owner scope, immutable provenance, assigned-goal restrictions, manual and automatic progress, staged confirmations, milestone dates and reversals, pagination boundaries and ellipses, template navigation, and review/Dashboard behavior. Browser verification covers role-specific owner fields, Goal Details actions, progress-only interfaces, listing completion, and retained layout. These checks validate prototype behavior; full responsive, accessibility, authenticated authorization, backend persistence, and multi-user acceptance remain release dependencies.''' + s[b:]
s = s.replace('| Tracking conversion | Confirmed change from manual to milestone progress, or to manual after final-milestone removal |', '| Tracking conversion | Authorized change between manual and milestone calculation, with first-add and final-removal confirmations under GOAL-16 and GOAL-17 |')
s = s.replace('Checks in work/check-unified.cjs, work/check-dashboard.cjs, and work/check-goal-milestones.cjs', 'Checks in work/check-unified.cjs, work/check-dashboard.cjs, work/check-goal-milestones.cjs, work/check-ui-refinements.cjs, and work/check-goal-permissions.cjs')
a=s.index('Version precedence is explicit:');b=s.index('\n\n### Revision history',a)
s=s[:a]+'''Version precedence is explicit: PulseDotNet branding and its left-aligned supplied logo/tagline replace older names. HR-only template and cycle administration, sidebar destinations, Dashboard-only KPI cards, solid-blue primary actions, and local-only delivery remain in force. Shared Goal Details / Goal Assignment / Goal Configuration sections replace earlier form headings. Main-row navigation replaces main Actions columns; numbered pagination replaces Page N of M text. The latest milestone requirement permits completion checkboxes in the listing and supersedes the earlier view-only direction; adding, editing, and removing milestone definitions remains restricted to authorized forms. The role-based owner lookup, immutable creator/source, and simplified Update Progress behavior supersede earlier generic goal-edit dialogs. GOAL-16 defines the specific first-milestone confirmation and staged-save behavior.''' + s[b:]
s += '| 1.2 | 21 October 2026 | PulseDotNet branding; shared numbered pagination; row-to-details actions; consistent chevrons/modal controls; template header and preview; role-scoped ownership; immutable creator/source; shared Create/Edit forms; progress-only updates; completion-only listing interactions; staged milestone confirmations; expanded acceptance coverage |\n'
(root/'outputs/PulseDotNet-Product-Requirements.md').write_text(s,encoding='utf-8')
p=root/'work/build-prd.py'
p.write_text(p.read_text(encoding='utf-8').replace('PMSDotNet','PulseDotNet'),encoding='utf-8')
print('Updated PRD v1.2:',len(s.split()),'words')
