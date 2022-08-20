export const getUiNode = (flow, attributeType, nodeKey, returnType = "attributes" ) => {
  if (flow?.ui?.nodes) {
      const { nodes } = flow?.ui;
      const content = nodes.find(
          (node) =>
              node.attributes[attributeType] === nodeKey
      )[returnType];
      return content
  }
};