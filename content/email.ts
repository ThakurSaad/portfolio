import type { Email } from "./types";

export const emails: Email[] = [
  {
    id: "server-setup-template",
    sender: "Personal Project",
    subject: "Production-Ready Express Starter",
    snippet:
      "A batteries-included Node/Express/MongoDB template with auth, error handling, and Zod validation",
    date: "Jul 20",
    labels: ["typescript", "node", "express", "mongodb"],
    starred: true,
    read: false,
    body: [
      {
        type: "paragraph",
        text: "Every new backend project started the same way: two days of copying auth, error handling, logging, and validation out of the last repo before writing a single line of real feature code. This template is that setup, done once and done right — clone it and you have a production-shaped Express API in minutes instead of days.",
      },
      {
        type: "callout",
        icon: "⚡",
        text: "Cuts new-project bootstrap from ~2 days to under 10 minutes, with auth, validation, and structured error handling already wired.",
      },
      {
        type: "paragraph",
        text: "The core design goal was a single, predictable request lifecycle. Every route flows through the same validate → handle → respond → catch pipeline, so a new endpoint is just a schema and a handler — the plumbing is already there. Errors never crash the process; they funnel into one global handler that returns a consistent JSON shape the frontend can always rely on.",
      },
      {
        type: "code",
        language: "typescript",
        code: `// Every route is wrapped once — no try/catch in handlers\nexport const catchAsync =\n  (fn: RequestHandler): RequestHandler =>\n  (req, res, next) =>\n    Promise.resolve(fn(req, res, next)).catch(next);\n\nrouter.post(\n  "/login",\n  validate(loginSchema), // Zod — rejects bad input before the handler runs\n  catchAsync(authController.login),\n);`,
      },
      {
        type: "paragraph",
        text: "Validation is handled by Zod at the edge of every write endpoint, so handlers can trust their inputs completely — no defensive checks, no unknown shapes. The same schemas are exported for the frontend to reuse, keeping the contract in one place.",
      },
      {
        type: "image",
        src: "/hello.jpg",
        alt: "Diagram of the request lifecycle: validate, handle, respond, global error handler",
        width: 1200,
        height: 630,
      },
      {
        type: "paragraph",
        text: "Auth uses short-lived access tokens with refresh rotation, bcrypt-hashed passwords, and a role check that collapses to a single middleware. Winston handles structured logging with daily rotation and a request-id on every line, so tracing a failing request across the logs is trivial.",
      },
      {
        type: "quote",
        text: "I forked this for a client project and shipped the first working endpoint the same afternoon. The error contract alone saved us a week of frontend guesswork.",
        attribution: "A developer who used the template",
      },
      {
        type: "paragraph",
        text: "It ships with Docker, a CI workflow, and an in-memory MongoDB test harness, so the tests run anywhere without a live database. The whole thing is deliberately boring — boring is what you want in the layer everything else is built on.",
      },
      {
        type: "attachment",
        filename: "server-setup-template.zip",
        href: "#",
        size: "48 KB",
      },
    ],
  },
  {
    "id": "react-admin-dashboard",
    "sender": "Client Work",
    "subject": "E-commerce Admin Panel",
    "snippet": "A responsive admin dashboard with charts, user management, and dark mode support",
    "date": "Jan 12",
    "labels": ["react", "tailwind", "redux"],
    "starred": true,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "python-web-scraper",
    "sender": "Personal Project",
    "subject": "Automated News Aggregator",
    "snippet": "A cron-scheduled web scraper that compiles tech news headlines and sends a daily digest",
    "date": "Feb 05",
    "labels": ["python", "beautifulsoup", "cron"],
    "starred": false,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "go-auth-microservice",
    "sender": "Open Source",
    "subject": "Fast JWT Auth Service",
    "snippet": "A high-performance authentication microservice using Go, Redis, and JWTs",
    "date": "Mar 18",
    "labels": ["go", "jwt", "redis"],
    "starred": true,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "react-native-fitness-app",
    "sender": "Startup Pitch",
    "subject": "FitTrack Mobile App",
    "snippet": "Cross-platform mobile application for tracking workouts and nutrition goals",
    "date": "Apr 22",
    "labels": ["react-native", "firebase", "expo"],
    "starred": false,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "rust-cli-tool",
    "sender": "Personal Project",
    "subject": "Fast File Renamer CLI",
    "snippet": "Blazing fast command-line interface tool for batch renaming files using Regex",
    "date": "May 03",
    "labels": ["rust", "cli", "regex"],
    "starred": true,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "graphql-weather-api",
    "sender": "Hackathon",
    "subject": "WeatherQL API Wrapper",
    "snippet": "GraphQL wrapper over standard REST weather APIs for selective data fetching",
    "date": "May 15",
    "labels": ["graphql", "node", "apollo"],
    "starred": false,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "vue-portfolio-theme",
    "sender": "Open Source",
    "subject": "Minimalist Vue Portfolio Theme",
    "snippet": "An elegant, customizable portfolio template built with Vue 3 and Vite",
    "date": "Jun 01",
    "labels": ["vue", "css", "vite"],
    "starred": false,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "django-blog-platform",
    "sender": "Personal Project",
    "subject": "Markdown Blog Engine",
    "snippet": "A full-featured blogging platform supporting markdown rendering and Postgresql search",
    "date": "Jun 14",
    "labels": ["python", "django", "postgresql"],
    "starred": true,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "nextjs-ecommerce-storefront",
    "sender": "Client Work",
    "subject": "Boutique Storefront UI",
    "snippet": "Server-side rendered e-commerce storefront with Stripe integration and Vercel hosting",
    "date": "Jul 02",
    "labels": ["nextjs", "stripe", "vercel"],
    "starred": true,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "docker-dev-env",
    "sender": "Internal Tool",
    "subject": "Universal Dev Container",
    "snippet": "A standardized Docker setup for onboarding new developers in minutes",
    "date": "Jul 21",
    "labels": ["docker", "bash", "linux"],
    "starred": false,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "svelte-chat-app",
    "sender": "Personal Project",
    "subject": "Real-time Chat Interface",
    "snippet": "Lightweight, reactive chat application built with Svelte and WebSockets",
    "date": "Aug 09",
    "labels": ["svelte", "websockets", "node"],
    "starred": true,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "machine-learning-model",
    "sender": "University Project",
    "subject": "Image Classification CNN",
    "snippet": "Convolutional Neural Network trained to classify medical images with 94% accuracy",
    "date": "Aug 25",
    "labels": ["python", "tensorflow", "keras"],
    "starred": false,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "ruby-on-rails-crm",
    "sender": "Client Work",
    "subject": "Small Business CRM",
    "snippet": "Custom Customer Relationship Manager with reporting and invoicing features",
    "date": "Sep 11",
    "labels": ["ruby", "rails", "postgresql"],
    "starred": true,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "angular-enterprise-app",
    "sender": "Corporate Job",
    "subject": "Inventory Management System",
    "snippet": "Large-scale enterprise inventory tracking app with RxJS state management",
    "date": "Sep 30",
    "labels": ["angular", "typescript", "rxjs"],
    "starred": false,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "aws-serverless-lambda",
    "sender": "Personal Project",
    "subject": "Image Thumbnail Generator",
    "snippet": "Event-driven AWS Lambda function that resizes images upon S3 bucket upload",
    "date": "Oct 14",
    "labels": ["aws", "lambda", "node"],
    "starred": true,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "flutter-expense-tracker",
    "sender": "Hackathon",
    "subject": "SpendSmart Mobile App",
    "snippet": "Offline-first personal finance app built with Flutter and local SQLite database",
    "date": "Oct 28",
    "labels": ["flutter", "dart", "sqlite"],
    "starred": false,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "kubernetes-cluster-setup",
    "sender": "Internal Tool",
    "subject": "K8s Boilerplate Configuration",
    "snippet": "Helm charts and YAML configurations for rapidly spinning up a secure cluster",
    "date": "Nov 05",
    "labels": ["kubernetes", "yaml", "helm"],
    "starred": true,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "php-laravel-forum",
    "sender": "Client Work",
    "subject": "Community Discussion Board",
    "snippet": "Modern forum software with threaded replies, user roles, and moderation tools",
    "date": "Nov 19",
    "labels": ["php", "laravel", "mysql"],
    "starred": false,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "d3-data-visualization",
    "sender": "Personal Project",
    "subject": "Global Population Dashboard",
    "snippet": "Interactive SVG maps and charts visualizing global census data over time",
    "date": "Dec 02",
    "labels": ["javascript", "d3", "svg"],
    "starred": true,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "chrome-extension-tab-manager",
    "sender": "Open Source",
    "subject": "TabTamer Extension",
    "snippet": "A lightweight browser extension to group, save, and restore tab sessions",
    "date": "Dec 16",
    "labels": ["javascript", "chrome-api", "html"],
    "starred": false,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "solidity-smart-contract",
    "sender": "Web3 Project",
    "subject": "NFT Minting Contract",
    "snippet": "ERC-721 compliant smart contract with presale logic and optimized gas usage",
    "date": "Jan 04",
    "labels": ["solidity", "ethereum", "hardhat"],
    "starred": true,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "electron-markdown-editor",
    "sender": "Personal Project",
    "subject": "Desktop Note Taker",
    "snippet": "Cross-platform desktop application for distraction-free markdown writing",
    "date": "Jan 22",
    "labels": ["electron", "react", "markdown"],
    "starred": false,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "spring-boot-inventory-api",
    "sender": "Corporate Job",
    "subject": "Warehouse REST API",
    "snippet": "Enterprise-grade Java backend for tracking warehouse shipments and stock levels",
    "date": "Feb 11",
    "labels": ["java", "spring", "mysql"],
    "starred": true,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "unity-2d-platformer",
    "sender": "Game Jam",
    "subject": "Pixel Jump Game",
    "snippet": "A fast-paced 2D platformer with custom physics and procedural level generation",
    "date": "Feb 28",
    "labels": ["c#", "unity", "gamedev"],
    "starred": false,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "nestjs-websocket-gateway",
    "sender": "Client Work",
    "subject": "Live Notifications Service",
    "snippet": "Scalable WebSocket gateway built with NestJS to push real-time alerts to users",
    "date": "Mar 14",
    "labels": ["nestjs", "typescript", "socket.io"],
    "starred": true,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "tailwind-component-library",
    "sender": "Open Source",
    "subject": "Accessible UI Kit",
    "snippet": "A collection of 50+ unstyled, fully accessible UI components for Tailwind CSS",
    "date": "Mar 29",
    "labels": ["css", "tailwind", "accessibility"],
    "starred": true,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "firebase-auth-wrapper",
    "sender": "Internal Tool",
    "subject": "Auth Helper Utility",
    "snippet": "A custom wrapper around Firebase Authentication to standardize auth flows across projects",
    "date": "Apr 07",
    "labels": ["firebase", "typescript", "auth"],
    "starred": false,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "elixir-phoenix-chat",
    "sender": "Personal Project",
    "subject": "Highly Concurrent Chat",
    "snippet": "A chat application leveraging Elixir and Phoenix Channels to handle millions of connections",
    "date": "Apr 19",
    "labels": ["elixir", "phoenix", "websockets"],
    "starred": true,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "fastapi-ml-serving",
    "sender": "Client Work",
    "subject": "Model Inference API",
    "snippet": "Asynchronous API for serving Machine Learning predictions with zero downtime",
    "date": "May 10",
    "labels": ["python", "fastapi", "docker"],
    "starred": false,
    "read": false,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  },
  {
    "id": "gatsby-static-blog",
    "sender": "Personal Project",
    "subject": "SEO Optimized Personal Site",
    "snippet": "Blazing fast static site generation for personal branding and technical writing",
    "date": "May 24",
    "labels": ["gatsby", "react", "graphql"],
    "starred": true,
    "read": true,
    "body": [{ "type": "paragraph", "text": "Placeholder — full case study in M3." }]
  }
  // ... more emails
];
