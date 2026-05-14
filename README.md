# CraftKit

CraftKit is an interactive scaffolding CLI for building practical fullstack starter projects with a Go backend and a modern React or Next.js frontend.

It is meant for the moment when you want to start building, but you do not want to spend the first hour creating folders, wiring a health route, setting up Vite or Next.js, and deciding where Docker files should live. CraftKit asks a few focused questions and creates a clean project structure you can actually grow from.

<img width="795" height="171" alt="image" src="https://github.com/user-attachments/assets/9b9e7609-5d85-446e-a3cf-2de726fb1e23" />


## What It Creates

CraftKit generates an intermediate fullstack project with:

- A frontend app using React or Next.js
- TypeScript or JavaScript frontend templates
- A Go backend using Gin or Fiber
- A simple backend health route
- Shared project metadata in `craft.config.json`
- Optional Docker and Docker Compose setup
- A tidy `frontend`, `backend`, and `infra` folder layout

## Preview

```bash
craftkit create
```

You will be prompted for:

- Project name
- Frontend language
- Frontend framework
- Backend language
- Backend framework
- Docker support

The generated project looks like this:

```text
my-app/
  frontend/
  backend/
  infra/
  craft.config.json
  README.md
  .gitignore
```

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/VIM4L-M/CraftKIT.git
cd CraftKIT
npm install
```

CraftKit expects Node.js 20.12 or newer.

Build the CLI:

```bash
npm run build
```

Run it locally:

```bash
npm start -- create
```

You can also link it while developing:

```bash
npm link
craftkit create
```

## Generated Project Workflow

After creating a project:

```bash
cd my-app
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Start the backend:

```bash
cd backend
go run ./cmd/server
```

The backend includes a default health endpoint at:

```text
/api/health
```

## Scripts

```bash
npm run build
```

Compiles the TypeScript source into `dist`.

```bash
npm start -- create
```

Runs the built CLI locally.

## Tech Stack

CraftKit itself uses:

- Node.js
- TypeScript
- Commander
- Clack prompts
- Chalk
- Figlet
- Gradient String
- Ora

## Contributing

Contributions are welcome. The best way to help is to keep the CLI simple, predictable, and pleasant to use.

Good first contributions include:

- Adding validation for project names
- Improving the generated README files
- Adding tests around project generation
- Adding new backend or frontend template options

Before opening a pull request:

```bash
npm install
npm run build
```

Please keep changes focused. If you are adding a new template, try to keep it small, documented, and consistent with the existing `frontend`, `backend`, and `infra` layout.

