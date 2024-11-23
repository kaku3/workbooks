import fs from 'fs';
import {
  unified
} from 'unified';
import remarkParse from 'remark-parse';

export default class MarkdownUtil {

  static loadAst(fileName) {
    const processor = unified().use(remarkParse);

    const markdown = fs.readFileSync(fileName, 'utf-8');
    const nodes = processor.parse(markdown);

    return nodes
  }

  static parseMarkdownToScreens(nodes) {
    let screens = [];
    let currentScreen = null;
    let collectingDescription = false;
    let screenMap = new Map();  // 画面IDをキーにしたマップ
    let depthPositionMap = new Map();  // depth毎の位置カウンター
  
    function processLinkList(listNode, parentScreenId = null, currentDepth = 1) {
      if (!listNode || !listNode.children) return [];
  
      return listNode.children.map(item => {
        if (!item.children || !item.children[0] || !item.children[0].children) {
          return null;
        }
  
        const linkText = item.children[0].children[0].value;
        const [text, screenId] = linkText.split(',').map(s => s.trim());
  
        if (screenId) {
          // depth の計算
          const depth = parentScreenId === 'SC001' ? 1 : currentDepth;
          
          // pos の計算
          if (!depthPositionMap.has(depth)) {
            depthPositionMap.set(depth, 0);
          }
          depthPositionMap.set(depth, depthPositionMap.get(depth) + 1);
          const pos = depthPositionMap.get(depth);
  
          // 画面情報を保存
          screenMap.set(screenId, {
            parentScreenId,
            depth,
            pos
          });
        }
  
        const result = {
          text,
          screenId
        };
  
        if (item.children[1]) {
          result.children = processLinkList(
            item.children[1], 
            screenId, 
            currentDepth + 1
          );
        }
  
        return result;
      }).filter(item => item !== null);
    }
  
    function processNode(node) {
      if (node.type === 'heading' && node.depth === 2) {
        if (currentScreen) {
          screens.push(currentScreen);
        }
        
        const headingText = node.children[0].value;
        const [id, title, path] = headingText.split(',').map(s => s.trim());
        
        // トップページの場合
        if (id === 'SC001') {
          screenMap.set(id, {
            parentScreenId: null,
            depth: 0,
            pos: 1
          });
        }
  
        currentScreen = {
          id,
          title,
          path,
          description: [],
          links: []
        };
        collectingDescription = true;
      } 
      else if (node.type === 'paragraph' && currentScreen && collectingDescription) {
        const paragraphText = node.children
          .map(child => child.value)
          .join('\n');
        
        currentScreen.description.push(paragraphText);
      }
      else if (node.type === 'heading' && node.depth === 3) {
        collectingDescription = false;
        
        if (node.children[0].value.startsWith('link')) {
          try {
            const linkSection = {};
            const sectionName = node.children[0].value.split(',')[1]?.trim() || 'default';
            
            const nextNode = nodes[nodes.indexOf(node) + 1];
            if (nextNode && nextNode.type === 'list') {
              const processedLinks = processLinkList(nextNode, currentScreen.id);
              if (processedLinks.length > 0) {
                linkSection[sectionName] = processedLinks;
                currentScreen.links.push(linkSection);
              }
            }
          } catch (error) {
            console.warn(`Warning: Error processing links in section ${currentScreen?.id}:`, error);
          }
        }
      }
    }
  
    nodes.forEach(processNode);
    
    if (currentScreen) {
      currentScreen.description = currentScreen.description.join('\n\n');
      screens.push(currentScreen);
    }
  
    // 画面情報にdepthとposを追加
    return screens.map(screen => {
      const screenInfo = screenMap.get(screen.id) || { depth: 0, pos: 1 };
      return {
        ...screen,
        parentScreenId: screenInfo.parentScreenId || null,
        depth: screenInfo.depth,
        pos: screenInfo.pos
      };
    });
  }
}



// // 特定のノードタイプを探す関数
// function findNodes(ast, type) {
//   const nodes = [];
  
//   function traverse(node) {
//     if (node.type === type) {
//       nodes.push(node);
//     }
    
//     if (node.children) {
//       node.children.forEach(traverse);
//     }
//   }
  
//   traverse(ast);
//   return nodes;
// }

// // 見出しを取得する例
// const headings = findNodes(ast, 'heading');
// console.log('\nHeadings:');
// headings.forEach(heading => {
//   console.log(`Level ${heading.depth}:`, heading.children[0].value);
// });

// // リストアイテムを取得する例
// const listItems = findNodes(ast, 'listItem');
// console.log('\nList Items:');
// listItems.forEach(item => {
//   if (item.children[0].children[0].value) {
//     console.log('-', item.children[0].children[0].value);
//   }
// });
