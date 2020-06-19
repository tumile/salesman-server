/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */

class TrieNode {
  constructor() {
    this.children = Array(26).fill(null);
    this.endOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(key) {
    let node = this.root;
    for (let i = 0; i < key.length; i += 1) {
      const idx = key.charCodeAt(i) - 97;
      if (!node.children[idx]) {
        node.children[idx] = new TrieNode();
      }
      node = node.children[idx];
    }
    node.endOfWord = true;
  }

  isLastNode(node) {
    for (let i = 0; i < 26; i++) {
      if (node.children[i]) {
        return false;
      }
    }
    return true;
  }

  suggest(key) {
    let node = this.root;
    let i;
    for (i = 0; i < key.length; i += 1) {
      const idx = key.charCodeAt(i) - 97;
      if (!node.children[idx]) {
        return [];
      }
      node = node.children[idx];
    }
    if (this.isLastNode(node) && node.endOfWord) {
      return [key];
    }
    const res = [];
    const rec = (n, prefix) => {
      if (n.endOfWord) {
        res.push(prefix);
      }
      if (this.isLastNode(n)) {
        return;
      }
      for (i = 0; i < 26; i += 1) {
        if (n.children[i]) {
          const nextPrefix = prefix + String.fromCharCode(i + 97);
          rec(n.children[i], nextPrefix);
        }
      }
    };
    rec(node, key);
    return res;
  }
}

export default Trie;