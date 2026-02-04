import { orgDivisions } from '../data/sampleData';

let _divisions = JSON.parse(JSON.stringify(orgDivisions));

// Tree helpers
function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getAllDescendantIds(node) {
  const ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...getAllDescendantIds(child));
    }
  }
  return ids;
}

function getAllNodeIds(node) {
  return getAllDescendantIds(node);
}

function collectNodesByLevel(nodes, level) {
  const result = [];
  for (const node of nodes) {
    if (node.level === level) result.push(node);
    if (node.children?.length) {
      result.push(...collectNodesByLevel(node.children, level));
    }
  }
  return result;
}

// Mock: 향후 api.get('/departments/tree') 등으로 교체
export const departmentService = {
  async getTree() {
    return JSON.parse(JSON.stringify(_divisions));
  },

  async create(data) {
    const { name, level, parentId } = data;
    const newNode = {
      id: `${level}-${Date.now()}`,
      name,
      level,
      parentId: parentId || null,
      children: [],
    };
    // 실제 API에서는 서버가 처리
    return newNode;
  },

  async update(id, data) {
    return { id, ...data };
  },

  async remove(id) {
    return { success: true };
  },

  async move(id, newParentId) {
    return { success: true };
  },

  async assignEmployees(deptId, employeeIds) {
    return { success: true };
  },

  // 유틸리티: 트리에서 노드 찾기 (프론트에서 사용)
  findNode,
  getAllDescendantIds,
  getAllNodeIds,
  collectNodesByLevel,
};

export default departmentService;
