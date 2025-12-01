# 📋 **Task Tracker CLI** - Complete Documentation

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/vasei-me/task-tracker-cli)

## 🎯 **Key Features**

### **📝 Task Management**
- ✅ **Add tasks** with description, priority, deadline, and tags
- ✅ **Update tasks** - modify any task property
- ✅ **Delete tasks** - remove tasks permanently
- ✅ **Mark tasks** as todo/in-progress/done
- ✅ **Priority levels** - low, medium, high
- ✅ **Tag system** - add/remove tags for categorization

### **🔍 Search & Filter**
- ✅ **Advanced search** by keyword with status filtering
- ✅ **Multi-criteria filtering** by status, priority, tags
- ✅ **Date filters** - overdue, due today
- ✅ **Project/category filtering**

### **📊 Statistics & Reporting**
- ✅ **Task statistics** with bar chart visualization
- ✅ **Weekly reports** - progress tracking
- ✅ **Productivity analytics** - performance metrics
- ✅ **Burn-down charts** - project progress visualization
- ✅ **Persian calendar support** - jalali dates

### **📤 Import/Export**
- ✅ **JSON export/import** - full task structure
- ✅ **CSV export** - spreadsheet compatibility
- ✅ **Markdown export** - documentation ready
- ✅ **Table format** - beautiful terminal display
- ✅ **Batch operations** - filter and export specific tasks

### **🎨 User Experience**
- ✅ **Beautiful table display** with proper text alignment
- ✅ **Color-coded priorities** - visual distinction
- ✅ **Progress bars** - visual progress indicators
- ✅ **Multi-language support** - English and Persian
- ✅ **Responsive design** - adapts to terminal width

### **🛡️ Data Management**
- ✅ **JSON file storage** - persistent data
- ✅ **Backup system** - automatic backups
- ✅ **Data validation** - input sanitization
- ✅ **Error handling** - comprehensive error messages
- ✅ **Merge operations** - combine task lists

## 🚀 **Installation & Setup**

### **Prerequisites**
- Node.js 18 or higher
- npm or yarn package manager

### **Installation**
```bash
# Clone the repository
git clone https://github.com/vasei-me/task-tracker-cli.git
cd task-tracker-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

### **Quick Start**
```bash
# Run in development mode
npm run dev

# Or use directly
node dist/main.js
```

## 📖 **Usage Examples**

### **Basic Task Management**
```bash
# Add a task
task-cli add "Buy groceries" --priority high --tags "shopping,home"

# List all tasks
task-cli list

# Mark task as in-progress
task-cli mark-in-progress 1

# Update a task
task-cli update 1 "Buy groceries and vegetables" --priority medium

# Delete a task
task-cli delete 1
```

### **Advanced Features**
```bash
# Filter tasks
task-cli filter --priority high --overdue
task-cli filter --tag work --status in-progress

# Search tasks
task-cli search "meeting" --status todo
task-cli search "report" --limit 5

# View statistics
task-cli stats

# Print beautiful table
task-cli print
```

### **Import/Export Operations**
```bash
# Export to CSV
task-cli export --format csv --output tasks.csv

# Export to JSON
task-cli export done --format json --output completed.json

# Export to Markdown
task-cli export --format markdown --output report.md

# Import tasks
task-cli import tasks.json
task-cli import data.csv --format csv --merge
```

### **Reports & Analytics**
```bash
# Weekly report
task-cli report --type weekly

# Productivity report
task-cli report --type productivity

# Burn-down chart
task-cli report --type burn-down

# Export report to file
task-cli report --type weekly --output file
```

## 💻 **Available Commands**

| Command | Description | Options |
|---------|-------------|---------|
| `add <description>` | Add new task | `--deadline`, `--priority`, `--tags` |
| `list [status]` | List tasks | `[todo, in-progress, done]` |
| `print [status]` | Table view | Filter by status |
| `update <id> <description>` | Update task | `--deadline`, `--priority`, `--tags` |
| `delete <id>` | Delete task | - |
| `mark-in-progress <id>` | Mark as in-progress | - |
| `mark-done <id>` | Mark as done | - |
| `set-priority <id> <priority>` | Set priority | `[low, medium, high]` |
| `tag <action> <id> <tag>` | Manage tags | `[add, remove]` |
| `deadline <id> <date>` | Set deadline | Date or "clear" |
| `filter` | Filter tasks | `--status`, `--priority`, `--tag`, `--overdue`, `--due-today` |
| `stats` | Show statistics | - |
| `search <keyword>` | Search tasks | `--status`, `--limit` |
| `export [status]` | Export tasks | `--format`, `--output`, `--header` |
| `import <file>` | Import tasks | `--format`, `--merge` |
| `report` | Generate reports | `--type`, `--output` |
| `help [command]` | Show help | Command-specific help |

## 🏗️ **Project Architecture**

```
task-tracker-cli/
├── src/
│   ├── core/                    # Business logic
│   │   ├── entities/           # Domain entities
│   │   ├── interfaces/         # Contracts and interfaces
│   │   └── exceptions/         # Custom exceptions
│   ├── application/            # Use cases
│   │   ├── use-cases/         # Business use cases
│   │   └── dto/               # Data transfer objects
│   ├── infrastructure/         # External services
│   │   ├── repositories/      # Data storage
│   │   ├── file-system/       # File operations
│   │   └── logger/            # Logging system
│   ├── presentation/          # User interface
│   │   ├── cli/              # CLI commands
│   │   └── responses/        # Response formatting
│   └── main.ts                # Application entry point
├── tests/                     # Test suite
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # Documentation
```

## 🔧 **Development**

### **Scripts**
```bash
# Build the project
npm run build

# Development mode
npm run dev

# Run tests
npm test

# Watch mode for development
npm run build -- --watch

# Clean build directory
npm run clean
```

### **Adding New Features**
The project follows Clean Architecture principles:
1. **Domain Layer**: Business entities and rules
2. **Application Layer**: Use cases and application logic
3. **Infrastructure Layer**: External implementations
4. **Presentation Layer**: User interfaces

### **Code Quality**
- TypeScript for type safety
- ESLint for code linting
- Clean Code principles
- SOLID design patterns
- Comprehensive testing

## 📊 **Data Structure**

Tasks are stored in JSON format with the following structure:
```json
{
  "id": 1,
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "deadline": "2024-12-31",
  "tags": ["work", "urgent"],
  "created": "2024-01-01T10:00:00.000Z",
  "updated": "2024-01-02T10:00:00.000Z"
}
```

## 🌐 **Internationalization**

The CLI supports both English and Persian:
- Dates displayed in Persian (Jalali) calendar
- RTL text support in tables
- Bilingual error messages
- Configurable language settings

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### **Commit Convention**
```
feat: add new feature
fix: bug fix
docs: documentation update
style: formatting changes
refactor: code restructuring
test: add or update tests
chore: maintenance tasks
```
Project URL: https://roadmap.sh/projects/task-tracker
