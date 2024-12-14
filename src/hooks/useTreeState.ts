import { useState, useCallback } from 'react';
import { TreeNode } from '../types/tree';
import { generateId } from '../utils/helpers';
import { findNode, lockParentNodes } from '../utils/tree-utils';
import { useAIAssistant } from './useAIAssistant'
import { aGoodResponse } from '../../ai_assistant/aGoodResponse';

export function useTreeState() {
  const [tree, setTree] = useState<TreeNode>( aGoodResponse || {
    id: generateId(),
    title: 'Root',
    description: 'Add a description',
    isLocked: false,
    children: null,
    parentId: null,
    order: 0,
    readyForDevelopment: false,
    indicationsForDevelopment: {
      instructions: '',
      suggestion: '',
      filesRelated: [],
      conditionsForSolved: ''
    }
  })

  const setTreeWithDebug = useCallback((newTree: TreeNode) => {
    setTree(newTree);
  }, []);


  // const { generateContent, saveToGithub } = useAIAssistant();
  const { generateContent, generateTree, addReadyForDevelopmentAttributes, solveATaskWithAI } = useAIAssistant();

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
        parentId,
        indicationsForDevelopment: {
          instructions: '',
          suggestion: '',
          filesRelated: [],
          conditionsForSolved: ''
        }
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

        return updateNode(current);
      });
    } catch (error) {
      console.error('Failed to add child:', error);
    }
  }, [tree]);

  const addChildrenWithAI = useCallback(async (parentId: string, prompt?: string) => {
    const parentNode = findNode(tree, parentId);
    if (!parentNode) return;
    const updatedSubtask = await generateTree(`separate this task in subtasks please: ${JSON.stringify(parentNode)} ${prompt ? `And consider: ${prompt}` : ''}`, null, tree);
    
    setTree((current) => {
      const updatedTree = (currentTree: TreeNode, parentId: string): TreeNode => {
        if (currentTree.id === parentId) {
          return {
            ...currentTree,
            children: currentTree.children 
              ? [...currentTree.children, ...(updatedSubtask.children || [])]
              : updatedSubtask.children || []
          }
        }
        return {
          ...currentTree,
          children: currentTree.children ? currentTree.children.map(child => updatedTree(child, parentId)) : null
        }
      }
      return updatedTree(current, parentId);
    });
  }, [generateTree, tree]);

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

  const prepare = useCallback(async (nodeId: string) => {
    const node = findNode(tree, nodeId);
    if (node) {
      const newTree = await addReadyForDevelopmentAttributes(node, tree);
      setTree(prev => {
        const updatedTree = (currentNode: TreeNode): TreeNode => {
          if (currentNode.id === nodeId) {
            return {
              ...currentNode,
              ...newTree
            };
          }
          return {
            ...currentNode,
            children: currentNode.children ? currentNode.children?.map(child => updatedTree(child)) : null
          };
        };
        return updatedTree(prev);
      });
    }
  }, [addReadyForDevelopmentAttributes, tree]);

  const solveWithAI = useCallback(async (nodeId: string) => {
    const node = findNode(tree, nodeId);
    if (node) {
      const newTree = await solveATaskWithAI(tree, node);
    }
  }, [solveATaskWithAI, tree]);

  const zoomIn = useCallback((nodeId: string) => {
    const node = findNode(tree, nodeId);
    if (node) {
      // do something with the card to expand and show details
    }
  }, [tree]);

  return { tree, setTree: setTreeWithDebug, addChild, addChildrenWithAI, generateWithAI, updateNodeContent, toggleLock, deleteNode, prepare, solveWithAI, zoomIn };
}