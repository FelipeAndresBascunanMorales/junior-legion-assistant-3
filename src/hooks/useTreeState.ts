import { useState, useCallback } from 'react';
import { TreeNode } from '../types/tree';
import { generateId } from '../utils/helpers';
import { useAIAssistant } from './useAIAssistant';
import { findNode, lockParentNodes } from '../utils/tree-utils';

export function useTreeState() {
  const [tree, setTree] = useState<TreeNode>({
    id: generateId(),
    title: 'Root',
    description: 'Root node description',
    isLocked: false,
    children: null,
    parentId: null
  });

  // const { generateContent, saveToGithub } = useAIAssistant();
  const { generateContent } = useAIAssistant();

  const addChild = useCallback(async (parentId: string, aiPrompt?: string) => {
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

      if (aiPrompt) {
        const content = await generateContent(newNode, parentNode, aiPrompt);
        newNode.title = content.title;
        newNode.description = content.description;
      }

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
        return updatedTree;
      });
    } catch (error) {
      console.error('Failed to add child:', error);
    }
  }, [tree, generateContent]);

  // ... rest of the existing code ...
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
            isLocked: newLockState,
            children: node.children ? node.children.map(child => ({
              ...child,
              isLocked: newLockState ? true : child.isLocked
            })) : null,
          };
        }

        return {
          ...node,
          children: node.children ? node.children.map(updateNode) : null,
        };
      }

      let updatedTree = updateNode(current);
      updatedTree = lockParentNodes(updatedTree, nodeId);
      return updatedTree;
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

  return { tree, addChild, updateNodeContent, toggleLock, deleteNode, zoomIn };
}