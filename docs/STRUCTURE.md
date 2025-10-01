skfsd-system/
├── README.md
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── .env.local
├── .env.example
├── .gitignore
├── .eslintrc.json
├── postcss.config.js
│
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── icons/
│       ├── mail.svg
│       ├── dashboard.svg
│       └── ...
│
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── metrics/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── daily/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── history/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── import/
│   │   │   │       └── page.tsx
│   │   │   ├── drm/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── review/
│   │   │   │       └── page.tsx
│   │   │   ├── targets/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── analytics/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── export/
│   │   │   │       └── page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── create/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── offices/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── create/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── audit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   │   └── route.ts
│   │       │   ├── register/
│   │       │   │   └── route.ts
│   │       │   ├── logout/
│   │       │   │   └── route.ts
│   │       │   ├── me/
│   │       │   │   └── route.ts
│   │       │   ├── google/
│   │       │   │   └── route.ts
│   │       │   ├── reset-password/
│   │       │   │   └── route.ts
│   │       │   └── verify-otp/
│   │       │       └── route.ts
│   │       ├── offices/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── users/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       └── roles/
│   │       │           └── route.ts
│   │       ├── metrics/
│   │       │   ├── daily/
│   │       │   │   ├── route.ts
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts
│   │       │   ├── import/
│   │       │   │   └── route.ts
│   │       │   └── export/
│   │       │       └── route.ts
│   │       ├── drm/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       ├── submit/
│   │       │       │   └── route.ts
│   │       │       ├── review/
│   │       │       │   └── route.ts
│   │       │       └── pdf/
│   │       │           └── route.ts
│   │       ├── targets/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── reports/
│   │       │   ├── dashboard/
│   │       │   │   └── route.ts
│   │       │   └── export/
│   │       │       └── route.ts
│   │       ├── audit/
│   │       │   └── route.ts
│   │       ├── health/
│   │       │   └── route.ts
│   │       └── files/
│   │           └── [...path]/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── data-table.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── forgot-password-form.tsx
│   │   │   ├── reset-password-form.tsx
│   │   │   ├── google-auth-button.tsx
│   │   │   └── auth-guard.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── nav-item.tsx
│   │   │   ├── user-menu.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── mobile-nav.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── stats-card.tsx
│   │   │   ├── metrics-chart.tsx
│   │   │   ├── target-progress.tsx
│   │   │   ├── recent-activity.tsx
│   │   │   ├── notifications.tsx
│   │   │   └── office-switcher.tsx
│   │   │
│   │   ├── metrics/
│   │   │   ├── daily-form.tsx
│   │   │   ├── metrics-stepper.tsx
│   │   │   ├── metrics-table.tsx
│   │   │   ├── metrics-chart.tsx
│   │   │   ├── csv-import.tsx
│   │   │   ├── lock-indicator.tsx
│   │   │   └── countdown-timer.tsx
│   │   │
│   │   ├── drm/
│   │   │   ├── drm-form.tsx
│   │   │   ├── drm-list.tsx
│   │   │   ├── drm-card.tsx
│   │   │   ├── workflow-stepper.tsx
│   │   │   ├── review-panel.tsx
│   │   │   ├── pdf-viewer.tsx
│   │   │   └── signature-pad.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── user-table.tsx
│   │   │   ├── user-form.tsx
│   │   │   ├── office-table.tsx
│   │   │   ├── office-form.tsx
│   │   │   ├── role-selector.tsx
│   │   │   ├── audit-log.tsx
│   │   │   └── system-settings.tsx
│   │   │
│   │   ├── reports/
│   │   │   ├── report-builder.tsx
│   │   │   ├── chart-container.tsx
│   │   │   ├── export-button.tsx
│   │   │   ├── date-range-picker.tsx
│   │   │   └── filter-panel.tsx
│   │   │
│   │   └── common/
│   │       ├── loading-state.tsx
│   │       ├── error-boundary.tsx
│   │       ├── confirm-dialog.tsx
│   │       ├── file-upload.tsx
│   │       ├── search-input.tsx
│   │       └── status-badge.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   ├── constants.ts
│   │   ├── api.ts
│   │   ├── permissions.ts
│   │   ├── email.ts
│   │   ├── pdf.ts
│   │   └── middleware.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── office.ts
│   │   ├── metrics.ts
│   │   ├── drm.ts
│   │   ├── target.ts
│   │   ├── audit.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-api.ts
│   │   ├── use-local-storage.ts
│   │   ├── use-debounce.ts
│   │   ├── use-pagination.ts
│   │   ├── use-socket.ts
│   │   └── use-permissions.ts
│   │
│   ├── context/
│   │   ├── auth-context.tsx
│   │   ├── theme-context.tsx
│   │   ├── office-context.tsx
│   │   └── notification-context.tsx
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── auth-slice.ts
│   │   ├── office-slice.ts
│   │   ├── metrics-slice.ts
│   │   └── ui-slice.ts
│   │
│   └── styles/
│       └── globals.css
│
├── scripts/
│   ├── db-setup.js
│   ├── db-seed.js
│   ├── db-migrate.js
│   └── build.js
│
├── docs/
│   ├── api.md
│   ├── deployment.md
│   ├── testing.md
│   └── contributing.md
│
└── tests/
    ├── __mocks__/
    ├── components/
    ├── pages/
    ├── api/
    └── utils/
