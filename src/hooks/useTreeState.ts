import { useState, useCallback } from 'react';
import { TreeNode } from '../types/tree';
import { generateId } from '../utils/helpers';
import { useAIAssistant } from './useAIAssistant';
import { findNode, lockParentNodes } from '../utils/tree-utils';

export function useTreeState() {
  const [tree, setTree] = useState<TreeNode>({
    "id": "1",
    "title": "Develop Web Application",
    "description": "Create a web application based on user requirements with a structured task breakdown.",
    "order": 1,
    "solved": false,
    "isLocked": false,
    "parentId": null,
    "mustBeCodedInCodeBase": true,
    "levelOfGranularity": 10,
    "isReachableByLowLevelDevelopers": true,
    "children": [
      {
        "id": "1.1",
        "title": "Understand the Requirements",
        "description": "Thoroughly review and comprehend the user’s requirements and desired outcomes for the web application.",
        "order": 1,
        "solved": false,
        "isLocked": false,
        "parentId": "1",
        "mustBeCodedInCodeBase": false,
        "levelOfGranularity": 10,
        "isReachableByLowLevelDevelopers": true,
        "children": null
      },
      {
        "id": "1.2",
        "title": "Identify Main Components",
        "description": "Distill the user’s requirements into core components employing a technical perspective.",
        "order": 2,
        "solved": false,
        "isLocked": false,
        "parentId": "1",
        "mustBeCodedInCodeBase": false,
        "levelOfGranularity": 9,
        "isReachableByLowLevelDevelopers": true,
        "children": [
          {
            "id": "1.2.1",
            "title": "Component Analysis",
            "description": "Analyze the identified requirements and categorize them into structured components.",
            "order": 1,
            "solved": false,
            "isLocked": false,
            "parentId": "1.2",
            "mustBeCodedInCodeBase": false,
            "levelOfGranularity": 8,
            "isReachableByLowLevelDevelopers": true,
            "children": null
          }
        ]
      },
      {
        "id": "1.3",
        "title": "Decompose into Tasks and Subtasks",
        "description": "Break down each component into specific tasks and further into manageable subtasks.",
        "order": 3,
        "solved": false,
        "isLocked": false,
        "parentId": "1",
        "mustBeCodedInCodeBase": false,
        "levelOfGranularity": 8,
        "isReachableByLowLevelDevelopers": true,
        "children": [
          {
            "id": "1.3.1",
            "title": "Task Identification",
            "description": "Identify individual tasks required for each component.",
            "order": 1,
            "solved": false,
            "isLocked": false,
            "parentId": "1.3",
            "mustBeCodedInCodeBase": false,
            "levelOfGranularity": 7,
            "isReachableByLowLevelDevelopers": true,
            "children": null
          },
          {
            "id": "1.3.2",
            "title": "Subtask Decomposition",
            "description": "Further break down tasks into smaller, manageable subtasks.",
            "order": 2,
            "solved": false,
            "isLocked": false,
            "parentId": "1.3",
            "mustBeCodedInCodeBase": false,
            "levelOfGranularity": 6,
            "isReachableByLowLevelDevelopers": true,
            "children": [
              {
                "id": "1.3.2.1",
                "title": "Create Subtask Structure",
                "description": "Define a structure for organizing subtasks under each task.",
                "order": 1,
                "solved": false,
                "isLocked": false,
                "parentId": "1.3.2",
                "mustBeCodedInCodeBase": false,
                "levelOfGranularity": 6,
                "isReachableByLowLevelDevelopers": true,
                "children": null
              },
              {
                "id": "1.3.2.2",
                "title": "Document Subtasks",
                "description": "Create documentation detailing each subtask for clarity.",
                "order": 2,
                "solved": false,
                "isLocked": false,
                "parentId": "1.3.2",
                "mustBeCodedInCodeBase": false,
                "levelOfGranularity": 6,
                "isReachableByLowLevelDevelopers": true,
                "children": null
              }
            ]
          }
        ]
      },
      {
        "id": "1.4",
        "title": "Determine Task Order",
        "description": "Allocate a logical sequence to each task considering dependencies.",
        "order": 4,
        "solved": false,
        "isLocked": false,
        "parentId": "1",
        "mustBeCodedInCodeBase": false,
        "levelOfGranularity": 7,
        "isReachableByLowLevelDevelopers": true,
        "children": null
      },
      {
        "id": "1.5",
        "title": "Organize and Nest Tasks",
        "description": "Compile tasks and subtasks in a hierarchical structure.",
        "order": 5,
        "solved": false,
        "isLocked": false,
        "parentId": "1",
        "mustBeCodedInCodeBase": false,
        "levelOfGranularity": 7,
        "isReachableByLowLevelDevelopers": true,
        "children": null
      }
    ]
  });

  // const { generateContent, saveToGithub } = useAIAssistant();
  const { generateContent } = useAIAssistant();

  const generateWithAI = useCallback(async (parentId: string, aiPrompt?: string) => {
    const parentNode = findNode(tree, parentId);
    if (!parentNode) return;
    return await generateContent(parentNode, null, aiPrompt || '');
  }, [generateContent, tree]);

  const addChild = useCallback(async (parentId: string) => {
    try {
      const parentNode = findNode(tree, parentId);
      if (!parentNode) return;
      const newNode: TreeNode = {
        id: generateId(),
        title: 'New Node',
        description: 'Add a description',
        isLocked: false,
        children: null,
        parentId
      };

      setTree((current) => {
        function updateNode(node: TreeNode): TreeNode {
          if (node.id === parentId) {
            return {
              ...node,
              children: node.children ? [...node.children, newNode] : [newNode],
            };
          }

          return {
            ...node,
            children: node.children ? node.children.map(updateNode) : null,
          };
        }

        const updatedTree = updateNode(current);
        // saveToGithub(updatedTree).catch(console.error);
        return updatedTree;
      });
    } catch (error) {
      console.error('Failed to add child:', error);
    }
  }, [tree]);

  const updateNodeContent = useCallback((nodeId: string, title: string, description: string) => {
    setTree((current) => {
      function updateNode(node: TreeNode): TreeNode {
        if (node.id === nodeId) {
          return {
            ...node,
            title,
            description,
          };
        }

        return {
          ...node,
          children: node.children ? node.children.map(updateNode) : null,
        };
      }

      return updateNode(current);
    });
  }, []);

  const toggleLock = useCallback((nodeId: string) => {
    setTree((current) => {
      function updateNode(node: TreeNode): TreeNode {
        if (node.id === nodeId) {
          const newLockState = !node.isLocked;
          return {
            ...node,
            isLocked: newLockState
          };
        }

        return {
          ...node,
          children: node.children ? node.children.map(updateNode) : null,
        };
      }

      return updateNode(current);
    });


  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setTree((current) => {
      function updateNode(node: TreeNode): TreeNode {
        if (node.children) {
          const filteredChildren = node.children.filter(child => child.id !== nodeId);
          if (filteredChildren.length !== node.children.length) {
            return {
              ...node,
              children: filteredChildren.length > 0 ? filteredChildren : null,
            };
          }
          return {
            ...node,
            children: node.children.map(updateNode),
          };
        }
        return node;
      }

      return updateNode(current);
    });
  }, []);

  const zoomIn = useCallback((nodeId: string) => {
    const node = findNode(tree, nodeId);
    if (node) {
      // do something with the card to expand and show details
    }
  }, [tree]);

  return { tree, setTree, addChild, generateWithAI, updateNodeContent, toggleLock, deleteNode, zoomIn };
}