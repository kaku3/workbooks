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
  
    function processLinkList(listNode) {
      if (!listNode || !listNode.children) return [];
  
      return listNode.children.map(item => {
        if (!item.children || !item.children[0] || !item.children[0].children) {
          return null;
        }
  
        const linkText = item.children[0].children[0].value;
        const [text, linkToId] = linkText.split(',').map(s => s.trim());
  
        const result = {
          text,
          linkToId,
        };
  
        if (item.children[1]) {
          result.children = processLinkList(item.children[1]);
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
        const [id, name, url, depth = -1, pos = -1] = headingText.split(',').map(s => s.trim());

        currentScreen = {
          id,
          name,
          url,
          depth: Number(depth),
          pos: Number(pos),
          descriptions: [],
          links: []
        };
        collectingDescription = true;
      } 
      else if (node.type === 'paragraph' && currentScreen && collectingDescription) {
        const paragraphText = node.children
          .map(child => child.value)
          .join('\n');
        
        currentScreen.descriptions.push(paragraphText);
      }
      else if (node.type === 'heading' && node.depth === 3) {
        collectingDescription = false;
        
        if (node.children[0].value.startsWith('link')) {
          try {
            const sectionName = node.children[0].value.split(',')[1]?.trim() || '';
            
            const nextNode = nodes[nodes.indexOf(node) + 1];
            if (nextNode && nextNode.type === 'list') {
              const processedLinks = processLinkList(nextNode);
              if (processedLinks.length > 0) {
                currentScreen.links.push(...processedLinks.map(o => ({ sectionName, ...o })));
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
      screens.push(currentScreen);
    }


    MarkdownUtil.#setDescription(screens);

    // 全画面、link から depth を計算する
    MarkdownUtil.#setScreensDepth(screens);

    // depth が求まったら、各 depth について pos を計算する
    MarkdownUtil.#setScreensPos(screens);
  
    console.log(screens);

    return screens;
  }

  static #findScreenBylinkToId(screens, id) {
    return screens.find(s => s.links.find(l => l.linkToId === id))
  }


  static #setScreensDepth(screens) {
    for(const screen of screens) {
      if(screen.depth !== -1) {
        continue;
      }

      // 親screenを親がなくなるまで検索
      // 深さが決まっている親が見つかったらそれに +1 して検索を終了
      let depth = 1;
      let _screen = MarkdownUtil.#findScreenBylinkToId(screens, screen.id);
      if(_screen) {
        screen.parentId = _screen.id;
      }
      while(_screen) {
        if(_screen.depth === -1) {
          depth++;
        } else {
          depth = _screen.depth + 1;
          break;
        }
        _screen = MarkdownUtil.#findScreenBylinkToId(screens, _screen.id);
      }
      screen.depth = depth;
    }
  }  

  static #setScreensPos(screens) {
    const depthMin = screens.reduce((a, c) => Math.min(a, c.depth), Number.MAX_SAFE_INTEGER);
    const depthMax = screens.reduce((a, c) => Math.max(a, c.depth), 0);

    // 各 depth について、指定がなければ連番を振る
    // ただし、親がある場合は親をの pos を優先
    // 指定があれば、そちらを優先

    for(let d = depthMin; d <= depthMax; d++) {
      const _screens = screens.filter(s => s.depth === d);
      let pos = 1;
      for(const s of _screens) {
        if(s.pos === -1) {
          const parentPos = screens.find(ss => ss.id === s.parentId)?.pos || -1;
          if(parentPos > pos) {
            pos = parentPos;
          }
          s.pos = pos;
        } else {
          pos = s.pos;
        }
        pos++;
      }
    }
  }

  static #setDescription(screens) {
    screens.forEach(screen => {
      screen.description = screen.descriptions.join("\r\n");
    })
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
