# K-ONE SOLUTIONS Media

An earlier social-media prototype with a React frontend and an Express/MongoDB
backend. It explores feeds, profiles, following, notifications, messages, search,
and image uploads. These are implemented areas of the source, not a claim that
all flows work end to end.

## Current status

This is a historical experiment and is not ready for a public production
service. The nested applications under `src/frontend` and `src/backend` contain
the main implementation. The root Create React App manifest is an older setup
and contains a malformed dependency entry; do not use it as the install guide.

The backend has no working automated test command. Registration is exposed in
the UI but still needs a corresponding verified backend flow. Dependency
upgrades, authorization checks for messages and Socket.IO rooms, upload limits,
and startup validation need review before use with real accounts or data.

## Source layout

| Path | Purpose |
| --- | --- |
| `src/frontend` | React 19 / Create React App 5 application |
| `src/backend/server.js` | Express API, Socket.IO server, and MongoDB connection |
| `src/backend/routes` | Authentication, posts, messages, notifications, and search |
| `src/backend/models` | Mongoose data models |
| `src/backend/utils/upload.js` | Local image-upload storage prototype |
| Root `package.json` and `public` | Earlier scaffolding; needs consolidation |

## Local development starting point

Use an empty local MongoDB database and fictional accounts. Install each nested
application from its own lockfile:

```sh
cd src/backend
npm ci
```

Create a private `.env` in `src/backend` with `MONGO_URI`, `JWT_SECRET`, and
optionally `PORT`. Use a random JWT secret and a disposable local database. The
server defaults to port 5000. The frontend and Socket.IO origin use port 3000.
Create a local `uploads` directory if you exercise the upload prototype, then
start the backend with `npm start` from that directory.

In another terminal, start the frontend:

```sh
cd src/frontend
npm ci
npm start
```

These are source-derived starting instructions. Installation, browser behavior,
MongoDB workflows, and email or external integrations were not verified in the
repository documentation cleanup. Dependency or compatibility errors should be
recorded with the Node/npm version and reproduction steps.

## Maintenance priorities

1. Consolidate the duplicate root and nested frontend tooling; establish a
   supported Node version and reproducible clean install/build.
2. Add synthetic authentication, authorization, and message-isolation tests.
3. Validate configuration before accepting requests; finish registration.
4. Authenticate Socket.IO room membership and review upload handling.
5. Update dependencies and verify the main user flows on a disposable database.

Downloaded `node_modules`, `.env` files, uploads, and build outputs are local
artifacts. They are ignored, and the previously tracked backend dependencies
have been removed from the current source tree. Existing Git history is retained.

For contributions, open a focused issue or pull request with reproduction steps
and validation evidence. Never include real credentials or user data.
