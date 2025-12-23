# Contributing to Chati 🧠

Thank you for your interest in contributing to Chati, an AI-powered mental health chatbot designed to support users with compassionate conversations, mood tracking, journaling, and interactive games. We're excited to have you join our community!

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful, kind, and constructive in all interactions. This is a mental health project, so we take a compassionate approach to all community members.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/chati.git
   cd chati
   ```
3. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Set up the development environment** (see below)

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL or MongoDB (depending on your setup)
- Git

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory with the following:
   ```
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   MISTRAL_API_KEY=your_mistral_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Set up Prisma:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## How to Contribute

### Types of Contributions

We welcome the following types of contributions:

- **Bug Fixes**: Report and fix bugs
- **Features**: Implement new features from the roadmap
- **UI/UX Improvements**: Enhance the user interface and experience
- **Documentation**: Improve README, comments, and docs
- **Tests**: Add unit and integration tests
- **Performance**: Optimize code and improve performance
- **Accessibility**: Improve accessibility features
- **Mental Health Content**: Help develop supportive content and messaging

### Areas for Contribution

Check out our [Development Roadmap](README.md#-development-roadmap) for planned features:
- AI Chatbot improvements with NLP tuning
- Games Corner expansion
- Mood Tracking and Journal features
- Emergency Support integration
- Privacy & Security enhancements
- Daily affirmations

## Coding Guidelines

### Style & Standards

- **Language**: Use TypeScript for type safety
- **Framework**: Follow Next.js best practices
- **Styling**: Use Tailwind CSS for consistency
- **Components**: Use React functional components with hooks
- **UI Components**: Leverage existing Radix UI components in `src/components/ui/`

### Code Style

- Follow the existing code style in the project
- Use ESLint configuration: `npm run lint`
- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused on a single responsibility

### Naming Conventions

- **Files**: Use kebab-case for filenames (e.g., `chat-components.js`)
- **Components**: Use PascalCase for React components
- **Variables/Functions**: Use camelCase
- **Constants**: Use UPPER_SNAKE_CASE

### File Organization

```
src/
├── app/                    # Next.js pages and API routes
├── components/             # Reusable React components
│   ├── ui/                # UI component library (Radix)
│   └── *-components.js    # Feature-specific components
├── lib/                   # Utility functions
└── ...
```

## Commit Guidelines

- Use clear, descriptive commit messages
- Format: `[type]: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Examples

```bash
git commit -m "feat: add mood tracking persistence to database"
git commit -m "fix: correct authentication flow for NextAuth"
git commit -m "docs: update setup instructions in README"
git commit -m "refactor: simplify chat component structure"
```

## Pull Request Process

1. **Update your branch** with the latest changes from main:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Test your changes:**
   ```bash
   npm run lint
   npm run build
   npm run dev
   ```

3. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub with:
   - A clear title describing the changes
   - A detailed description of what was changed and why
   - Reference to any related issues (e.g., "Closes #123")
   - Screenshots for UI changes
   - Any breaking changes noted

5. **Address feedback** from reviewers:
   - Respond to comments thoughtfully
   - Make requested changes
   - Re-request review after updates

6. **Wait for approval** before merging

### PR Description Template

```markdown
## Description
Brief description of your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List key changes
- Use bullet points

## How to Test
1. Step by step instructions
2. For testing the changes

## Screenshots (if applicable)
Add before/after screenshots for UI changes

## Related Issues
Closes #(issue number)
```

## Reporting Issues

### Before Creating an Issue

- Check if the issue already exists
- Ensure you have the latest version
- Provide reproducible steps

### Issue Report Template

```markdown
## Description
A clear description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. ...

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: (e.g., Windows 10)
- Node.js version:
- Browser: (if applicable)

## Additional Context
Any other relevant information
```

## Mental Health Considerations

As this is a mental health support tool, please keep in mind:

- Ensure all chatbot responses are compassionate and supportive
- Avoid any content that could be harmful or triggering
- Include appropriate crisis resources and professional help redirects
- Test edge cases with vulnerable users in mind
- Document any emergency support features clearly

## Questions?

If you have questions or need clarification:

- Check existing issues and discussions
- Open a discussion in GitHub Discussions
- Reach out to the maintainers

## License

By contributing to Chati, you agree that your contributions will be licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

Thank you for helping us support mental health! 💙
