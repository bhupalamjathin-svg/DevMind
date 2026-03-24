# 🤖 DevMind — Multi-Agent Coding Assistant

> *Build Smarter. Code Faster. Debug Autonomously.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Track: Coding Agents](https://img.shields.io/badge/Track-Coding%20Agents-blue)](https://hackathon.ecellramaiah.in)
[![Hackathon: HACK'A'WAR](https://img.shields.io/badge/Hackathon-HACK'A'WAR%202025-red)](https://hackathon.ecellramaiah.in)

---

## 🚀 What is DevMind?

DevMind is a **multi-agent AI system** that takes your idea described in plain English and turns it into a working, tested, and debugged codebase — autonomously.

No more context switching between docs, Stack Overflow, and your IDE. Just describe what you want to build, and DevMind handles the rest.

---

## ⚡ How it Works

```
User Input (Plain English)
        ↓
  🧠 Planner Agent       →  Breaks task into architecture, file structure, subtasks
        ↓
  💻 Coder Agent         →  Writes clean, modular code per subtask
        ↓
  🐛 Debugger Agent      →  Runs tests, finds errors, patches or loops back to Coder
        ↓
  ✅ Final Output        →  Working, runnable codebase + design explanation
```

Unlike simple LLM chains, DevMind has:
- **Role-specialized agents** with distinct prompting strategies
- **Shared context layer** — agents share memory, task queue, and code state
- **Real feedback loop** — Debugger can route failing code back to Coder Agent
- **Orchestrator** — coordinates the full pipeline end-to-end

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   DevMind System                    │
│                                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌───────────┐ │
│  │   Planner   │──▶│    Coder    │──▶│  Debugger │ │
│  │    Agent    │   │    Agent    │   │   Agent   │ │
│  └─────────────┘   └─────────────┘   └─────┬─────┘ │
│                                             │       │
│                          ◀──── re-route ───┘       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │            Shared Context Layer             │   │
│  │  Agent Memory | Task Queue | Code State     │   │
│  │  Feedback Loop | Orchestrator               │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM | Claude API / GPT-4o |
| Agent Framework | LangGraph / CrewAI |
| Memory | Redis (short-term) + FAISS (semantic) |
| Code Execution | Docker sandbox (isolated runtime) |
| Backend | FastAPI + WebSocket (real-time streaming) |
| Frontend | React + Monaco Editor |

---

## 🎯 Demo — What DevMind Can Do

**Input:**
```
Build me a REST API with CRUD endpoints for a todo app using SQLite
```

**DevMind does:**
1. Planner outputs file structure, route plan, DB schema in ~3 seconds
2. Coder writes `main.py`, `models.py`, `routes.py`, `requirements.txt`
3. Debugger finds a missing foreign key constraint → auto-patches → re-runs → all tests pass
4. Final output: complete runnable project + explanation of every design decision

---

## 📦 Project Structure

```
DevMind/
├── agents/
│   ├── planner.py        # Planner Agent
│   ├── coder.py          # Coder Agent
│   └── debugger.py       # Debugger Agent
├── core/
│   ├── orchestrator.py   # Agent coordination
│   ├── memory.py         # Shared context layer
│   └── sandbox.py        # Docker code execution
├── api/
│   └── main.py           # FastAPI backend
├── frontend/             # React UI
├── requirements.txt
└── README.md
```

---

## 🌍 Use Cases

- 🎓 **Students** — Build projects faster without getting stuck
- 🚀 **Startups** — Prototype MVPs without a full dev team
- 🏗️ **Engineers** — Automate boilerplate across microservices
- 🧪 **Researchers** — Generate experiment code from paper descriptions

---

## 👤 Author

**Sai Jathin Bhupalam**
CSE AI & ML | Ramaiah Institute of Technology, Bengaluru
[GitHub](https://github.com/bhupalamjathin-svg)

---

## 🏆 Built For

**HACK'A'WAR 2025** — 24 Hour Hackathon
E-Cell Ramaiah | Coding Agents Track
