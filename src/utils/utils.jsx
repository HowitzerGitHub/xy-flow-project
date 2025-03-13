export function evaluateExpression(expression) {
  try {
    if (!/^[0-9%*+/\-]+$/.test(expression)) {
      return "Invalid expression";
    }

    let result = Function(`'use strict'; return (${expression});`)();
    return isFinite(result) ? result : "Invalid expression";
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return NaN;
  }
}

export function findIndividualChains(nodes) {
  let childMap = new Map();
  let allNodes = new Set();
  let targetNodes = new Set();

  for (let { source, target } of nodes) {
    childMap.set(source, target);
    allNodes.add(source);
    allNodes.add(target);
    targetNodes.add(target);
  }

  let rootNodes = [...allNodes].filter((node) => !targetNodes.has(node));

  let chains = [];
  for (let root of rootNodes) {
    let chain = [];
    let current = root;
    while (current !== undefined) {
      chain.push(current);
      current = childMap.get(current);
    }
    chains.push(chain);
  }

  return chains;
}

export function findIndividualChainCalculation(edges, nodes) {
  const chains = findIndividualChains(edges);

  const calculations = [];

  chains.forEach((chain) => {
    const chainInfo = {
      startNode: chain[0],
      endNode: chain[chain.length - 1],
    };
    let strToEval = "";
    for (let i = 0; i < chain.length; i++) {
      const { data } = nodes.find((node) => node.id === chain[i]);
      if (data.symbol === "__value__") strToEval = strToEval + data.value;
      else strToEval = strToEval + data.symbol;
    }
    chainInfo.strToEval = strToEval;
    chainInfo.evaluatedAns = evaluateExpression(strToEval);
    calculations.push(chainInfo);
  });
  return calculations;
}
