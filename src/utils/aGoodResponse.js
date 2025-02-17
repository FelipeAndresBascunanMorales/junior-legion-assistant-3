export const aGoodResponse = {
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