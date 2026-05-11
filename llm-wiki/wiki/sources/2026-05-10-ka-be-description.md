---
type: source
title: "KaBe (Base de Conhecimento IA)"
date: 2026-05-10
source_type: project_documentation
url: ""
images: 0
image_paths: []
sources: ["raw/articles/2026-05-10-ka-be-description.md"]
---

# KaBe Project Description

## Summary
Project KaBe aims to create a comprehensive AI knowledge base for the ADPV solution, containing information about data models, application architecture, technologies, business rules, libraries, naming conventions, and procedures. This base will enable AI to assist in identifying changes needed for new features, estimating development time, conducting code reviews, creating tests, and eventually performing codifications.

## Core Concepts

### Knowledge Bases
- **Vector Base (pgVector)**: For business rules descriptions and definitions
- **Graph Base (Neo4j)**: For creating relationships between items

### AI Integration
- Use AGENTS.md as "integration manual" for AI to understand the project in each session
- Include project descriptions, tech stack, available tools (MCP, agents, skills)
- Document naming patterns for folders, files, field names, procedure names
- Define Neo4j interaction patterns (nodes, content)
- Specify vector base contents
- Document application architecture and folder patterns

### Implementation Rules
- Use MCP for database interactions
- AI should always seek context first from knowledge bases
- Graph base requirements:
  - Nodes in English
  - Node types in graph
  - Relationships between tables
  - Fields belonging to tables
  - Details and information stored in fields
  - Relationships between files
  - Relationships between methods

### Vector Base Content
- Business rules details
- Feature descriptions
- Screen descriptions, fields, and contained information

### Skills and Tools
- Evaluate local embedding models (e.g., Ollama)
- Create custom skills for each function:
  - Code Reviewer
  - Evaluate ring project skills
- Memory skill (Auto healing)

## First Use Case: Client CRUD Implementation Plan

Create a complete implementation plan for a client registration and data editing screen. The plan must contain:

- What needs to be changed in screen development
- Necessary changes in CaseBusiness class
- Procedure code
- Test Plan
- Test scripts
- Follow naming patterns in objects, tables, fields, procedures

## Team Members
- Gustavo Leme
- Felipe Pinheiro
- Ivan/Sousa (Support and definitions)

## Solution
- Kilocode / Kilocli

## Related Entities
- [[client|Client]]
- [[database-schema|Database Schema]]
- [[business-logic|Business Logic]]
- [[testing-strategy|Testing Strategy]]

## Key Insights
- KaBe is a comprehensive knowledge base system for AI-assisted development
- Focuses on both vector and graph databases for different types of knowledge
- First implementation target is client CRUD functionality
- Emphasizes consistent naming conventions and structured documentation