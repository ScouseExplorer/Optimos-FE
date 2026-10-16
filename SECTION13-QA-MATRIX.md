# Section 13 QA Matrix

This checklist validates every required UX screen from section 13 and confirms route protection, core interactions, and expected API behavior.

## Preconditions

- Backend is running and reachable from the frontend API base URL.
- You have at least:
  - one normal user account
  - one admin account
- Browser devtools Network tab is open to confirm endpoint calls and status codes.

## 1) Auth: Register, Login, Logout

Route coverage:
- Register: /register
- Login: /login
- Logout action: available inside internal app shell top bar

UI files:
- [src/Login/createaccount.jsx](src/Login/createaccount.jsx)
- [src/Login/Login.jsx](src/Login/Login.jsx)
- [src/layout/InternalAppShell.jsx](src/layout/InternalAppShell.jsx)

Test steps:
1. Open /register, submit a new account.
2. Verify successful register flow and ability to sign in.
3. Open /login, sign in with valid credentials.
4. Confirm redirect into authenticated area.
5. Click Logout in internal app shell top bar.
6. Confirm redirect to /login and protected pages block access.

Expected API behavior:
- Register calls POST /api/auth/register
- Login calls POST /api/auth/login with form-url-encoded fields
- Logout calls POST /api/auth/logout and clears local auth state

Pass criteria:
- Register and login succeed with valid credentials.
- Invalid credentials show error message.
- Logout always removes authenticated access.

## 2) Dashboard: summary cards (subscription, credits, recent usage)

Route coverage:
- /dashboard

UI file:
- [src/functionality/dashboard.jsx](src/functionality/dashboard.jsx)

Test steps:
1. Sign in and open /dashboard.
2. Confirm account summary cards are visible:
   - Subscription
   - Credits
   - Recent usage
3. Confirm each card shows loading state then resolved values.

Expected API behavior:
- Subscription/usage/entitlement sources load through subscription hooks.
- Credits balance loads from wallet hook.
- Recent usage loads latest usage entry.

Pass criteria:
- All 3 required summary cards render with valid values or safe fallback text.

## 3) Chat composer + chat history

Route coverage:
- /aichat

UI file:
- [src/functionality/aichat.jsx](src/functionality/aichat.jsx)

Test steps:
1. Open /aichat.
2. Confirm historical chats load in list.
3. Enter prompt and submit.
4. Confirm new conversation appears and assistant response displays.
5. Delete a single chat entry.
6. Use Clear all to remove all history.

Expected API behavior:
- GET /api/chats?limit&offset for history
- POST /api/chats with user_message and idempotency key header
- DELETE /api/chats/{chat_id}
- DELETE /api/chats

Pass criteria:
- Composer sends prompt successfully.
- History list refreshes after create and delete actions.
- Clear all removes all chat items.

## 4) Profile/settings page (profile, notifications, security)

Route coverage:
- /settings

UI file:
- [src/functionality/settings.jsx](src/functionality/settings.jsx)

Test steps:
1. Open /settings.
2. Confirm profile section data loads.
3. Update profile fields and save.
4. Update notification preferences and save.
5. Update security settings and save.

Expected API behavior:
- GET/PATCH /api/users/me/profile
- GET/PATCH /api/users/me/notifications
- GET/PATCH /api/users/me/security

Pass criteria:
- Each section can load and save independently.
- Errors render clearly when a save fails.

## 5) Experiences manager (CRUD)

Route coverage:
- /experiences

UI file:
- [src/functionality/experiences.jsx](src/functionality/experiences.jsx)

Shared CRUD UI:
- [src/functionality/ResourceManagerPage.jsx](src/functionality/ResourceManagerPage.jsx)

Test steps:
1. Open /experiences.
2. Create a valid experience JSON payload.
3. Edit the created record and save.
4. Delete the record.
5. Use pagination controls.

Expected API behavior:
- GET /api/experiences?limit&offset
- POST /api/experiences
- PATCH /api/experiences/{experience_id}
- DELETE /api/experiences/{experience_id}

Pass criteria:
- Create, update, delete succeed and list refreshes after each action.

## 6) Opinions manager (CRUD)

Route coverage:
- /opinions

UI file:
- [src/functionality/opinions.jsx](src/functionality/opinions.jsx)

Shared CRUD UI:
- [src/functionality/ResourceManagerPage.jsx](src/functionality/ResourceManagerPage.jsx)

Test steps:
1. Open /opinions.
2. Create, edit, and delete an opinion record.
3. Validate pagination behavior.

Expected API behavior:
- GET /api/opinions?limit&offset
- POST /api/opinions
- PATCH /api/opinions/{opinion_id}
- DELETE /api/opinions/{opinion_id}

Pass criteria:
- Full CRUD works and reflects server state after refresh.

## 7) Posts manager (CRUD)

Route coverage:
- /posts

UI file:
- [src/functionality/posts.jsx](src/functionality/posts.jsx)

Shared CRUD UI:
- [src/functionality/ResourceManagerPage.jsx](src/functionality/ResourceManagerPage.jsx)

Test steps:
1. Open /posts.
2. Create, edit, and delete a post record.
3. Validate pagination behavior.

Expected API behavior:
- GET /api/posts?limit&offset
- POST /api/posts
- PATCH /api/posts/{post_id}
- DELETE /api/posts/{post_id}

Pass criteria:
- Full CRUD works with clear success/error feedback.

## 8) Subscription page (tier, usage, upgrade)

Route coverage:
- /subscription

UI file:
- [src/functionality/subscription.jsx](src/functionality/subscription.jsx)

Test steps:
1. Open /subscription.
2. Confirm current tier and usage stats display.
3. Trigger upgrade action to another tier.
4. Verify post-upgrade values refresh.

Expected API behavior:
- GET /api/subscriptions/me
- GET /api/subscriptions/usage
- GET /api/subscriptions/entitlements
- POST /api/subscriptions/upgrade/{tier}

Pass criteria:
- Tier and usage render correctly.
- Upgrade action updates state after success.

## 9) Credits page (wallet, costs, transactions)

Route coverage:
- /credits

UI file:
- [src/functionality/credits.jsx](src/functionality/credits.jsx)

Test steps:
1. Open /credits.
2. Confirm wallet balance appears.
3. Confirm feature cost table appears.
4. Confirm transaction ledger appears.
5. Use previous/next pagination on transactions.

Expected API behavior:
- GET /api/credits/wallet
- GET /api/credits/feature-costs
- GET /api/credits/transactions?limit&offset

Pass criteria:
- Wallet, costs, and transactions are all visible and paginated.

## 10) Usage page (AI usage logs)

Route coverage:
- /usage

UI file:
- [src/functionality/usage.jsx](src/functionality/usage.jsx)

Test steps:
1. Open /usage.
2. Confirm rows include status, tokens, estimated cost, credits charged, timestamp.
3. Validate previous/next pagination.

Expected API behavior:
- GET /api/usage/me?limit&offset

Pass criteria:
- Usage table loads and paginates without UI breakage.

## 11) Admin page (stats, users, chat stats, credit adjustment)

Route coverage:
- /admin

UI file:
- [src/admin/admindashboard.jsx](src/admin/admindashboard.jsx)

Route guard:
- [src/auth/ProtectedRoute.jsx](src/auth/ProtectedRoute.jsx)

Test steps:
1. Sign in as normal user and open /admin.
2. Confirm redirect to not-authorized behavior.
3. Sign in as admin and open /admin.
4. Confirm stats cards, users table, and chat stats details load.
5. Submit a credit adjustment with valid payload.

Expected API behavior:
- GET /api/admin/stats
- GET /api/admin/users
- GET /api/admin/chat-stats?days=7
- POST /api/credits/admin/adjust

Pass criteria:
- Non-admin users are blocked.
- Admin users can view data and submit credit adjustments.

## Global route presence check

Routes are defined in:
- [src/App.js](src/App.js)

Required section 13 routes present:
- /login
- /register
- /dashboard
- /aichat
- /settings
- /experiences
- /opinions
- /posts
- /subscription
- /credits
- /usage
- /admin

## Result

Current codebase contains all section 13 required screens and route entries.
Use this checklist to validate behavior against live backend data end-to-end.
