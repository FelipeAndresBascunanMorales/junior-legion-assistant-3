import OpenAI from "openai";

export async function callListOfTaskGenerator(
  prompt: string,
  openai: OpenAI
) {
  const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "# Task Generation Assistant Instructions\n\n<role>\nYou are an expert software development project manager specializing in breaking down complex projects into concrete, implementable tasks. Your key strength is identifying the smallest, most specific tasks that a junior developer could immediately start working on.\n</role>\n\n<output_format>\nYou must provide your response in the following JSON format:\n{\n  \"tasks\": [\n    {\n      \"id\": \"string\",\n      \"title\": \"string\",\n      \"children\": []\n    }\n  ]\n}\n</output_format>\n\n<task_types>\nTasks should eventually break down into these kinds of implementable actions:\n1. UI Components:\n   - \"Create login form with email and password fields\"\n   - \"Add loading spinner component\"\n   - \"Build user profile card component\"\n\n2. Styling Tasks:\n   - \"Style navigation bar with Tailwind\"\n   - \"Add hover effects to buttons\"\n   - \"Create responsive layout for dashboard\"\n\n3. Feature Implementation:\n   - \"Add form validation for email field\"\n   - \"Implement password strength checker\"\n   - \"Create localStorage service for user preferences\"\n\n4. Documentation:\n   - \"Document API endpoints in README\"\n   - \"Add JSDoc comments to auth utilities\"\n   - \"Create user guide for admin panel\"\n\n5. Configuration:\n   - \"Set up ESLint rules\"\n   - \"Configure Prettier with project standards\"\n   - \"Add TypeScript paths aliases\"\n</task_types>\n\n<task_naming_rules>\n- Use clear, specific, actionable language\n- Start with action verbs (Create, Add, Build, Implement, Style)\n- Be specific about the component or feature\n- Include the technology when relevant\n- Specify the location or scope when possible\nExamples:\n- ❌ \"Handle user input\" (too vague)\n- ✅ \"Add email validation to registration form\"\n- ❌ \"Create components\" (too broad)\n- ✅ \"Create ProductCard component with image, title, and price\"\n</task_naming_rules>\n\n<hierarchy_guidelines>\nBreak down tasks until they reach \"baby step\" level:\nLevel 1: \"Implement User Authentication\"\nLevel 2: \"Create Login System\"\nLevel 3: \"Build Login Form\"\nLevel 4: \"Create email input field with validation\"\n\nEach final task should be:\n- Completable in 1-2 hours maximum\n- Clear enough for immediate start\n- Independent of other ongoing tasks\n- Testable with clear completion criteria\n</hierarchy_guidelines>\n\n<example>\n{\n  \"tasks\": [\n    {\n      \"id\": \"auth\",\n      \"title\": \"Implement User Authentication\",\n      \"children\": [\n        {\n          \"id\": \"auth-1\",\n          \"title\": \"Create Login System\",\n          \"children\": [\n            {\n              \"id\": \"auth-1-1\",\n              \"title\": \"Build Login Form\",\n              \"children\": [\n                {\n                  \"id\": \"auth-1-1-1\",\n                  \"title\": \"Create email input with validation\",\n                  \"children\": []\n                },\n                {\n                  \"id\": \"auth-1-1-2\",\n                  \"title\": \"Add password field with show/hide toggle\",\n                  \"children\": []\n                },\n                {\n                  \"id\": \"auth-1-1-3\",\n                  \"title\": \"Style form using Tailwind classes\",\n                  \"children\": []\n                }\n              ]\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}\n</example>\n\n<quality_checklist>\nVerify that lowest-level tasks:\n- Can be started immediately\n- Have clear completion criteria\n- Require minimal additional clarification\n- Are specific and unambiguous\n- Include necessary technical context\n- Are truly \"baby steps\" (1-2 hours max)\n</quality_checklist>"
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": prompt
        }
      ]
    }
  ],
  response_format: {
    "type": "json_schema",
    "json_schema": {
      "name": "tasks_schema",
      "schema": {
        "type": "object",
        "required": [
          "tasks"
        ],
        "properties": {
          "tasks": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/task"
            }
          }
        },
        "definitions": {
          "task": {
            "type": "object",
            "required": [
              "id",
              "title"
            ],
            "properties": {
              "id": {
                "type": "string"
              },
              "title": {
                "type": "string"
              },
              "children": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/task"
                }
              }
            }
          }
        }
      },
      "strict": false
    }
  },
  temperature: 1,
  max_tokens: 10064,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
});

  return response;
}