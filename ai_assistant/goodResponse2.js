export const aGoodResponse2 = {
    "id": "inspirational-app",
    "title": "Build Daily Inspirational Message Web App",
    "description": "Develop a web application that delivers a daily inspirational message from God, with a corresponding background color and social media sharing.",
    "relevance": 10,
    "order": 1,
    "solved": false,
    "isLocked": false,
    "parentId": null,
    "mustBeCodedInCodeBase": true,
    "levelOfGranularity": 2,
    "isReachableByEntryLevelDevelopers": false,
    "children": [
      {
        "id": "inspirational-app-1",
        "title": "Set Up Database for Messages",
        "description": "Implement a database to store daily messages and their associated colors.",
        "relevance": 10,
        "order": 1,
        "solved": false,
        "isLocked": false,
        "parentId": "inspirational-app",
        "mustBeCodedInCodeBase": true,
        "levelOfGranularity": 3,
        "isReachableByEntryLevelDevelopers": false,
        "children": [
          {
            "id": "inspirational-app-1-1",
            "title": "Design Database Schema",
            "description": "Create a schema for storing messages, colors, and any other related metadata.",
            "relevance": 10,
            "order": 1,
            "solved": false,
            "isLocked": false,
            "parentId": "inspirational-app-1",
            "mustBeCodedInCodeBase": true,
            "levelOfGranularity": 7,
            "isReachableByEntryLevelDevelopers": true,
            "children": null
          },
          {
            "id": "inspirational-app-1-2",
            "title": "Implement CRUD Operations",
            "description": "Develop functions for creating, reading, updating, and deleting messages in the database.",
            "relevance": 9,
            "order": 2,
            "solved": false,
            "isLocked": false,
            "parentId": "inspirational-app-1",
            "mustBeCodedInCodeBase": true,
            "levelOfGranularity": 6,
            "isReachableByEntryLevelDevelopers": true,
            "children": null
          }
        ]
      },
      {
        "id": "inspirational-app-2",
        "title": "Develop User Interface",
        "description": "Create a user-friendly interface to display the daily message and background color.",
        "relevance": 10,
        "order": 2,
        "solved": false,
        "isLocked": false,
        "parentId": "inspirational-app",
        "mustBeCodedInCodeBase": true,
        "levelOfGranularity": 3,
        "isReachableByEntryLevelDevelopers": false,
        "children": [
          {
            "id": "inspirational-app-2-1",
            "title": "Implement Message Display Component",
            "description": "Build a component that fetches and displays today's inspirational message and associated background color.",
            "relevance": 10,
            "order": 1,
            "solved": false,
            "isLocked": false,
            "parentId": "inspirational-app-2",
            "mustBeCodedInCodeBase": true,
            "levelOfGranularity": 7,
            "isReachableByEntryLevelDevelopers": true,
            "children": null
          },
          {
            "id": "inspirational-app-2-2",
            "title": "Create Share Button Functionality",
            "description": "Develop functionality for the share button to allow users to share the daily message on social media.",
            "relevance": 9,
            "order": 2,
            "solved": false,
            "isLocked": false,
            "parentId": "inspirational-app-2",
            "mustBeCodedInCodeBase": true,
            "levelOfGranularity": 6,
            "isReachableByEntryLevelDevelopers": true,
            "children": null
          }
        ]
      },
      {
        "id": "inspirational-app-3",
        "title": "Configure Web Hosting and Deployment",
        "description": "Set up the hosting environment to deploy the web app and ensure accessibility.",
        "relevance": 8,
        "order": 3,
        "solved": false,
        "isLocked": false,
        "parentId": "inspirational-app",
        "mustBeCodedInCodeBase": false,
        "levelOfGranularity": 4,
        "isReachableByEntryLevelDevelopers": false,
        "children": null
      }
    ]
  }