export function get(key){
return new Promise(resolve=>{
chrome.storage.local.get([key],result=>{
resolve(result[key]);
});
});
}

export function set(key,value){
chrome.storage.local.set({[key]:value});
}