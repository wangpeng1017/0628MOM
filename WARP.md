# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- This repository is a static HTML/CSS/JS application for a “数字工厂一体化平台 (Digital Factory Platform)”.
- There is no package manager, build system, linter, or automated test framework configured in the repo.
- The app is served as static files (index.html is the entry point) and loads Tailwind CSS and FontAwesome via CDN.
- README.md contains the canonical quickstart and version notes; consult it for release-specific details.

Development commands (Windows, PowerShell)
- Preview locally (no build step; serve static files):
  - Python (if installed)
    ```bash path=null start=null
    python -m http.server 8081
    ```
  - Node.js (if installed)
    ```bash path=null start=null
    npx serve -p 8081
    ```
  - Then open http://localhost:8081/
- Build: Not applicable (static site; no bundling configured)
- Lint: Not configured
- Tests: Not configured

How to run a single test
- There is no automated test framework in this repository. Validation is done by opening specific HTML verification pages (e.g., v1.1.0-verification-test.html, complete-404-fix-verification.html) in a browser while serving the repo via a local HTTP server.

High-level architecture and structure
- Entry point and shell
  - index.html is the main SPA-like shell. It renders:
    - Top navigation with primary modules (首页/计划管理/生产管理/…)
    - A collapsible left sidebar for secondary/tertiary menus
    - A main content area that loads pages via a single iframe (#content-frame)
  - Styling: Tailwind CSS (via CDN) + custom CSS in assets/css/*.css
  - Icons: FontAwesome (via CDN)

- Navigation and routing (in index.html)
  - The app uses a JavaScript configuration object moduleConfig to define modules, their titles, optional direct URLs, and subMenus lists.
  - switchModule(moduleId)
    - Updates active state in the top nav
    - Shows/hides the left sidebar and page title bar depending on the module
    - Populates the left sidebar with subMenus (including optional “subItems” for third-level menus)
    - Loads the first subpage into the iframe by default
  - updateSubMenu(subMenus)
    - Renders the left sidebar items and wires clicks to loadSubPage(url, name)
    - Adds/initializes the sidebar collapse/expand control
  - loadSubPage(url, name)
    - Changes the iframe src and updates the page title to the selected item
  - The top navigation supports horizontal scrolling controls; state is updated based on overflow.

- Global functions for deep-linking and AI assistant integration
  - Exposed on window in index.html so other pages (or the AI assistant script) can navigate:
    - window.navigateToModule(moduleId)
    - window.navigateToDocumentPage(moduleId, url, title)
    - window.switchModule and window.loadSubPage are also exposed
  - The AI assistant script lives under assets/js/ai-assistant.js and can call the above functions to control navigation without reloading the shell.

- Login and versioning behavior
  - login.html handles a basic, front-end only “authentication” and records loginData in localStorage/sessionStorage
    - README notes default credentials: admin / admin
  - On app load, index.html checks for loginData; if missing or invalid it redirects to login.html
  - Industry version selection (general, automotive, optoelectronics, inverter) modifies the UI title/description and toggles visibility of the “智慧园区” related top-level modules
  - Current user, login time, and selected version are displayed in a header dropdown

- Persistent UI state
  - Sidebar collapsed/expanded state is saved in localStorage (key: sidebarCollapsed) and applied on load

- Content pages
  - Business modules and their pages live under pages/…
    - Example: pages/production/index.html, pages/production/production-monitoring.html, pages/quality/…, pages/equipment/… (with optional third-level subfolders)
  - The main shell loads these into the iframe; ensure relative paths are correct from index.html when adding pages

- Documentation and manual verification pages
  - README.md provides quickstart, architecture notes, and release notes
  - process.md and process-les.md describe business processes and compliance
  - A set of verification/test HTML files (e.g., v1.1.0-verification-test.html) exist for manual checks of features and navigation integrity

Common development workflows
- Add a new module
  1) Create the new page(s) under pages/<module>/ (or a single pages/<module>.html if the module is flat)
  2) Extend the moduleConfig in index.html with the new module id, title, and either url (flat) or subMenus (with optional subItems for third level)
  3) If the module should be hidden for certain industry versions, integrate it with updateSmartParkVisibility (or the version visibility logic)
  4) Serve locally and navigate via the top bar to validate the new module loads into the iframe and left sidebar

- Add a new subpage to an existing module
  1) Create the HTML file under the proper pages/<module>/… subfolder
  2) Update moduleConfig for that module’s subMenus (or subItems) to point to the new file
  3) Validate via local server; ensure the left sidebar highlights correctly and the page title updates

- Adjust industry version behavior
  1) Update the industryVersions config in index.html
  2) Update updateSmartParkVisibility to show/hide relevant top-level modules
  3) If necessary, adjust login.html to capture and store the chosen version in loginData

Important references
- README.md — quickstart commands (local server via Python/Node), release notes, and module overviews
- process.md / process-les.md — business process compliance reference

Notes for Warp
- There is no build step; do not attempt npm/pnpm/yarn installs or builds unless you are explicitly adding tooling.
- For local preview or verification scripts, prefer starting a simple static server (Python or Node as above) on Windows PowerShell.
- When editing navigation or module structure, make coordinated changes to:
  - moduleConfig (index.html)
  - pages/… files and their relative paths
  - version visibility logic (if affected)
