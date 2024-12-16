export const aGoodResponse = {
  "id": "motivation-app",
  "title": "Build Daily Motivational Message Web App",
  "description": "Develop a web application that delivers a daily motivational message, along with a corresponding background color, and allows users to share the message on social media.",
  "relevance": 10,
  "order": 1,
  "solved": false,
  "isLocked": false,
  "parentId": null,
  "mustBeCodedInCodeBase": true,
  "levelOfGranularity": 3,
  "isReachableByEntryLevelDevelopers": false,
  "children": [
    {
      "id": "motivation-app-1",
      "title": "Set Up Development Environment",
      "description": "Establish the project repository and configure the development setup.",
      "relevance": 9,
      "order": 1,
      "solved": false,
      "isLocked": false,
      "parentId": "motivation-app",
      "mustBeCodedInCodeBase": true,
      "levelOfGranularity": 8,
      "isReachableByEntryLevelDevelopers": true,
      "children": [
        {
          "id": "motivation-app-1-1",
          "title": "Initialize Git Repository",
          "description": "Create a new Git repository for version control.",
          "relevance": 8,
          "order": 1,
          "solved": false,
          "isLocked": false,
          "parentId": "motivation-app-1",
          "mustBeCodedInCodeBase": true,
          "levelOfGranularity": 9,
          "isReachableByEntryLevelDevelopers": true,
          "children": null
        },
        {
          "id": "motivation-app-1-2",
          "title": "Set Up Project Structure",
          "description": "Organize the project directories for components, styles, and utilities.",
          "relevance": 8,
          "order": 2,
          "solved": false,
          "isLocked": false,
          "parentId": "motivation-app-1",
          "mustBeCodedInCodeBase": true,
          "levelOfGranularity": 9,
          "isReachableByEntryLevelDevelopers": true,
          "children": null
        }
      ]
    },
    {
      "id": "motivation-app-2",
      "title": "Develop Database Schema",
      "description": "Design and implement the database to store daily messages and their corresponding colors.",
      "relevance": 10,
      "order": 2,
      "solved": false,
      "isLocked": false,
      "parentId": "motivation-app",
      "mustBeCodedInCodeBase": true,
      "levelOfGranularity": 6,
      "isReachableByEntryLevelDevelopers": false,
      "children": [
        {
          "id": "motivation-app-2-1",
          "title": "Create Database",
          "description": "Set up a simple database to store messages and colors.",
          "relevance": 9,
          "order": 1,
          "solved": false,
          "isLocked": false,
          "parentId": "motivation-app-2",
          "mustBeCodedInCodeBase": true,
          "levelOfGranularity": 9,
          "isReachableByEntryLevelDevelopers": false,
          "children": null
        },
        {
          "id": "motivation-app-2-2",
          "title": "Define Schema for Messages",
          "description": "Create a schema defining the message structure and color association.",
          "relevance": 9,
          "order": 2,
          "solved": false,
          "isLocked": false,
          "parentId": "motivation-app-2",
          "mustBeCodedInCodeBase": true,
          "levelOfGranularity": 8,
          "isReachableByEntryLevelDevelopers": false,
          "children": null
        }
      ]
    },
    {
      "id": "motivation-app-3",
      "title": "Build User Interface",
      "description": "Create the front-end of the web application to display messages and background colors.",
      "relevance": 10,
      "order": 3,
      "solved": false,
      "isLocked": false,
      "parentId": "motivation-app",
      "mustBeCodedInCodeBase": true,
      "levelOfGranularity": 5,
      "isReachableByEntryLevelDevelopers": true,
      "children": [
        {
          "id": "motivation-app-3-1",
          "title": "Design Message Display Component",
          "description": "Develop the component that shows the daily motivational message and background color.",
          "relevance": 10,
          "order": 1,
          "solved": false,
          "isLocked": false,
          "parentId": "motivation-app-3",
          "mustBeCodedInCodeBase": true,
          "levelOfGranularity": 7,
          "isReachableByEntryLevelDevelopers": true,
          "children": null
        },
        {
          "id": "motivation-app-3-2",
          "title": "Implement Share Functionality",
          "description": "Add a button that allows sharing the daily message on social media.",
          "relevance": 9,
          "order": 2,
          "solved": false,
          "isLocked": false,
          "parentId": "motivation-app-3",
          "mustBeCodedInCodeBase": true,
          "levelOfGranularity": 7,
          "isReachableByEntryLevelDevelopers": true,
          "children": null
        }
      ]
    },
    {
      "id": "motivation-app-4",
      "title": "Deploy the Application",
      "description": "Publish the web application so users can access it.",
      "relevance": 9,
      "order": 4,
      "solved": false,
      "isLocked": false,
      "parentId": "motivation-app",
      "mustBeCodedInCodeBase": true,
      "levelOfGranularity": 5,
      "isReachableByEntryLevelDevelopers": false,
      "children": [
        {
          "id": "motivation-app-4-1",
          "title": "Choose Hosting Solution",
          "description": "Select a hosting service for deployment (e.g., Heroku, Netlify).",
          "relevance": 8,
          "order": 1,
          "solved": false,
          "isLocked": false,
          "parentId": "motivation-app-4",
          "mustBeCodedInCodeBase": true,
          "levelOfGranularity": 6,
          "isReachableByEntryLevelDevelopers": false,
          "children": null
        },
        {
          "id": "motivation-app-4-2",
          "title": "Deploy Application Code",
          "description": "Upload the application files to the chosen hosting service.",
          "relevance": 8,
          "order": 2,
          "solved": false,
          "isLocked": false,
          "parentId": "motivation-app-4",
          "mustBeCodedInCodeBase": true,
          "levelOfGranularity": 7,
          "isReachableByEntryLevelDevelopers": false,
          "children": null
        }
      ]
    }
  ]
}

export const aOldGoodResponse = {
  "id": "daily-divine-message",
  "title": "Develop Daily Divine Message Web Application",
  "description": "Create a web application that displays a daily divine message, with user engagement features and an archive for past messages.",
  "order": 1,
  "solved": false,
  "isLocked": false,
  "parentId": null,
  "mustBeCodedInCodeBase": true,
  "levelOfGranularity": 3,
  "isReachableByEntryLevelDevelopers": false,
  "children": [
    {
      "id": "daily-divine-message-1",
      "title": "Implement Daily Message Display",
      "description": "Create functionality to display a new divine message daily with a timestamp.",
      "order": 1,
      "solved": false,
      "isLocked": false,
      "parentId": "daily-divine-message",
      "mustBeCodedInCodeBase": true,
      "levelOfGranularity": 7,
      "isReachableByEntryLevelDevelopers": false,
      "children": [
        {
          "id": "daily-divine-message-1-1",
          "title": "Create Message Retrieval Logic",
          "description": "Implement backend logic to fetch the current day's message from the database.",
          "order": 1,
          "solved": false,
          "isLocked": false,
          "parentId": "daily-divine-message-1",
          "mustBeCodedInCodeBase": true,
          "levelOfGranularity": 7,
          "isReachableByEntryLevelDevelopers": false,
          "children": null
        }
      ]
    },
    {
      "id": "daily-divine-message-2",
      "title": "Add Background Color Customization",
      "description": "Implement functionality to change background color based on the divine message theme.",
      "order": 2,
      "solved": false,
      "isLocked": false,
      "parentId": "daily-divine-message",
      "mustBeCodedInCodeBase": true,
      "levelOfGranularity": 7,
      "isReachableByEntryLevelDevelopers": true,
      "children": null
    },
    {
      "id": "daily-divine-message-3",
      "title": "Create Message Archive Feature",
      "description": "Develop an archive section to display past divine messages for user reference.",
      "order": 3,
      "solved": false,
      "isLocked": false,
      "parentId": "daily-divine-message",
      "mustBeCodedInCodeBase": true,
      "levelOfGranularity": 6,
      "isReachableByEntryLevelDevelopers": false,
      "children": [
        {
          "id": "daily-divine-message-3-1",
          "title": "Implement Archive Retrieval Logic",
          "description": "Create backend logic to fetch archived messages from the database.",
          "order": 1,
          "solved": false,
          "isLocked": false,
          "parentId": "daily-divine-message-3",
          "mustBeCodedInCodeBase": true,
          "levelOfGranularity": 7,
          "isReachableByEntryLevelDevelopers": false,
          "children": null
        }
      ]
    },
    {
      "id": "daily-divine-message-4",
      "title": "Implement User Rating System",
      "description": "Create a system for users to rate daily messages and store ratings in the database.",
      "order": 4,
      "solved": false,
      "isLocked": false,
      "parentId": "daily-divine-message",
      "mustBeCodedInCodeBase": true,
      "levelOfGranularity": 6,
      "isReachableByEntryLevelDevelopers": false,
      "children": null
    },
    {
      "id": "daily-divine-message-5",
      "title": "Create Share Functionality",
      "description": "Develop options for users to share messages on social media platforms.",
      "order": 5,
      "solved": false,
      "isLocked": false,
      "parentId": "daily-divine-message",
      "mustBeCodedInCodeBase": true,
      "levelOfGranularity": 6,
      "isReachableByEntryLevelDevelopers": true,
      "children": null
    },
    {
      "id": "daily-divine-message-6",
      "title": "Implement User Subscription Notifications",
      "description": "Create a feature for users to subscribe for notifications when a new message is available.",
      "order": 6,
      "solved": false,
      "isLocked": false,
      "parentId": "daily-divine-message",
      "mustBeCodedInCodeBase": true,
      "levelOfGranularity": 6,
      "isReachableByEntryLevelDevelopers": false,
      "children": null
    },
    {
      "id": "daily-divine-message-7",
      "title": "Design User Interface",
      "description": "Develop a simple and intuitive interface for users to interact with the application.",
      "order": 7,
      "solved": false,
      "isLocked": false,
      "parentId": "daily-divine-message",
      "mustBeCodedInCodeBase": false,
      "levelOfGranularity": 5,
      "isReachableByEntryLevelDevelopers": true,
      "children": null
    },
    {
      "id": "daily-divine-message-8",
      "title": "Ensure Mobile Responsiveness",
      "description": "Implement CSS and layout adjustments to ensure the application is accessible on various devices.",
      "order": 8,
      "solved": false,
      "isLocked": false,
      "parentId": "daily-divine-message",
      "mustBeCodedInCodeBase": false,
      "levelOfGranularity": 5,
      "isReachableByEntryLevelDevelopers": true,
      "children": null
    }
  ]
}