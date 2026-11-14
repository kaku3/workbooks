const images=new Map();

// Retain decoded images so later portraits and CSS backgrounds reuse the cache.
export function preloadImages(paths, priority='low'){
  return Promise.all(paths.map(path=>{
    const url=new URL(path,document.baseURI).href;
    if(!images.has(url)){
      const image=new Image();image.decoding='async';image.fetchPriority=priority;
      const ready=new Promise(resolve=>{
        image.onload=()=>{Promise.resolve(image.decode?.()).catch(()=>{}).then(()=>resolve(image));};
        image.onerror=()=>resolve(null);
      });
      images.set(url,ready);image.src=url;
    }
    return images.get(url);
  }));
}
