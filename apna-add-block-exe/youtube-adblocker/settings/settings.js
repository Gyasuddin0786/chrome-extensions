const domainInput = document.getElementById("domain");
const list = document.getElementById("list");

function load(){

chrome.storage.local.get(["whitelist"],(data)=>{

list.innerHTML="";

(data.whitelist || []).forEach(domain=>{

const li=document.createElement("li");

li.innerHTML=`
<span>${domain}</span>
<button class="remove">Remove</button>
`;

li.querySelector(".remove").onclick=()=>remove(domain);

list.appendChild(li);

});

});

}

function remove(domain){

chrome.storage.local.get(["whitelist"],(data)=>{

const updated=(data.whitelist || []).filter(d=>d!==domain);

chrome.storage.local.set({whitelist:updated},load);

});

}

document.getElementById("add").onclick=()=>{

const domain=domainInput.value.trim();

if(!domain) return;

chrome.storage.local.get(["whitelist"],(data)=>{

const updated=[...(data.whitelist || []),domain];

chrome.storage.local.set({whitelist:updated},load);

});

domainInput.value="";

};

load();