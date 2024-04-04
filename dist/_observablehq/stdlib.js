var I=Object.defineProperty;var i=(t,e)=>I(t,"name",{value:e,configurable:!0});var f,d,m,T=Object.defineProperty,l=i((t,e)=>T(t,"name",{value:e,configurable:!0}),"s$2");const p=new Map;function P(t,e){const r=new URL(t,location).href;e==null?p.delete(r):p.set(r,e)}i(P,"d$3"),l(P,"registerFile");function v(t,e=location){if(new.target!==void 0)throw new TypeError("FileAttachment is not a constructor");const r=new URL(t,e).href,n=p.get(r);if(!n)throw new Error(`File not found: ${t}`);const{path:a,mimeType:o,lastModified:c}=n;return new w(new URL(a,location).href,t.split("/").pop(),o,c)}i(v,"m$1"),l(v,"FileAttachment");async function s(t){const e=await fetch(await t.url());if(!e.ok)throw new Error(`Unable to load file: ${t.name}`);return e}i(s,"i$5"),l(s,"remote_fetch");async function b(t,e,{array:r=!1,typed:n=!1}={}){const[a,o]=await Promise.all([t.text(),import("../_npm/d3-dsv@3.0.1/_esm.js")]);return(e==="	"?r?o.tsvParseRows:o.tsvParse:r?o.csvParseRows:o.csvParse)(a,n&&o.autoType)}i(b,"p"),l(b,"dsv");const $=(f=class{constructor(e,r="application/octet-stream",n){Object.defineProperty(this,"name",{value:`${e}`,enumerable:!0}),Object.defineProperty(this,"mimeType",{value:`${r}`,enumerable:!0}),n!==void 0&&Object.defineProperty(this,"lastModified",{value:Number(n),enumerable:!0})}async blob(){return(await s(this)).blob()}async arrayBuffer(){return(await s(this)).arrayBuffer()}async text(e){return e===void 0?(await s(this)).text():new TextDecoder(e).decode(await this.arrayBuffer())}async json(){return(await s(this)).json()}async stream(){return(await s(this)).body}async csv(e){return b(this,",",e)}async tsv(e){return b(this,"	",e)}async image(e){const r=await this.url();return new Promise((n,a)=>{const o=new Image;new URL(r,document.baseURI).origin!==new URL(location).origin&&(o.crossOrigin="anonymous"),Object.assign(o,e),o.onload=()=>n(o),o.onerror=()=>a(new Error(`Unable to load file: ${this.name}`)),o.src=r})}async arrow(){const[e,r]=await Promise.all([import("../_npm/apache-arrow@15.0.2/_esm.js"),s(this)]);return e.tableFromIPC(r)}async parquet(){const[e,r,n]=await Promise.all([import("../_npm/apache-arrow@15.0.2/_esm.js"),import("../_npm/parquet-wasm@0.5.0/esm/arrow1.js").then(async a=>(await a.default(),a)),this.arrayBuffer()]);return e.tableFromIPC(r.readParquet(new Uint8Array(n)).intoIPCStream())}async sqlite(){const[{SQLiteDatabaseClient:e},r]=await Promise.all([import("./stdlib/sqlite.js"),this.arrayBuffer()]);return e.open(r)}async zip(){const[{ZipArchive:e},r]=await Promise.all([import("./stdlib/zip.js"),this.arrayBuffer()]);return e.from(r)}async xml(e="application/xml"){return new DOMParser().parseFromString(await this.text(),e)}async html(){return this.xml("text/html")}async xlsx(){const[{Workbook:e},r]=await Promise.all([import("./stdlib/xlsx.js"),this.arrayBuffer()]);return e.load(r)}},i(f,"f"),f);l($,"AbstractFile");let O=$;const j=(d=class extends O{constructor(e,r,n,a){super(r,n,a),Object.defineProperty(this,"href",{value:e})}async url(){return this.href}},i(d,"w"),d);l(j,"FileAttachmentImpl");let w=j;Object.defineProperty(w,"name",{value:"FileAttachment"}),v.prototype=w.prototype;var q=Object.defineProperty,D=i((t,e)=>q(t,"name",{value:e,configurable:!0}),"r$3");async function*u(t){let e,r,n=!1;const a=t(o=>(r=o,e?(e(o),e=null):n=!0,o));if(a!=null&&typeof a!="function")throw new Error(typeof a.then=="function"?"async initializers are not supported":"initializer returned something, but not a dispose function");try{for(;;)yield n?(n=!1,r):new Promise(o=>e=o)}finally{a?.()}}i(u,"u"),D(u,"observe");var S=Object.defineProperty,x=i((t,e)=>S(t,"name",{value:e,configurable:!0}),"o$3");function F(){return u(t=>{let e;const r=matchMedia("(prefers-color-scheme: dark)"),n=x(()=>{const a=getComputedStyle(document.body).getPropertyValue("color-scheme")==="dark";e!==a&&t(e=a)},"changed");return n(),r.addEventListener("change",n),()=>r.removeEventListener("change",n)})}i(F,"m"),x(F,"dark");var N=Object.defineProperty,y=i((t,e)=>N(t,"name",{value:e,configurable:!0}),"e$2");function A(t){return u(e=>{const r=E(t);let n=g(t);const a=y(()=>e(g(t)),"inputted");return t.addEventListener(r,a),n!==void 0&&e(n),()=>t.removeEventListener(r,a)})}i(A,"o$2"),y(A,"input");function g(t){switch(t.type){case"range":case"number":return t.valueAsNumber;case"date":return t.valueAsDate;case"checkbox":return t.checked;case"file":return t.multiple?t.files:t.files[0];case"select-multiple":return Array.from(t.selectedOptions,e=>e.value);default:return t.value}}i(g,"a"),y(g,"valueof");function E(t){switch(t.type){case"button":case"submit":case"checkbox":return"click";case"file":return"change";default:return"input"}}i(E,"f$1"),y(E,"eventof");var _=Object.defineProperty,G=i((t,e)=>_(t,"name",{value:e,configurable:!0}),"e$1");async function*L(){for(;;)yield Date.now()}i(L,"i$3"),G(L,"now");var Q=Object.defineProperty,V=i((t,e)=>Q(t,"name",{value:e,configurable:!0}),"r$2");async function*R(t){let e;const r=[],n=t(a=>(r.push(a),e&&(e(r.shift()),e=null),a));if(n!=null&&typeof n!="function")throw new Error(typeof n.then=="function"?"async initializers are not supported":"initializer returned something, but not a dispose function");try{for(;;)yield r.length?r.shift():new Promise(a=>e=a)}finally{n?.()}}i(R,"l"),V(R,"queue");var W=Object.defineProperty,Z=i((t,e)=>W(t,"name",{value:e,configurable:!0}),"i$2");function k(t,e){return u(r=>{let n;const a=new ResizeObserver(([o])=>{const c=o.contentRect.width;c!==n&&r(n=c)});return a.observe(t,e),()=>a.disconnect()})}i(k,"d$1"),Z(k,"width");var H=Object.freeze({__proto__:null,dark:F,input:A,now:L,observe:u,queue:R,width:k}),J=Object.defineProperty,K=i((t,e)=>J(t,"name",{value:e,configurable:!0}),"r$1");function z(t){let e;return Object.defineProperty(u(r=>{e=r,t!==void 0&&e(t)}),"value",{get:()=>t,set:r=>void e(t=r)})}i(z,"f"),K(z,"Mutable");var X=Object.defineProperty,U=i((t,e)=>X(t,"name",{value:e,configurable:!0}),"o$1");function B(t,e){const r=document.createElement("div");r.style.position="relative",t.length!==1&&(r.style.height="100%");const n=new ResizeObserver(([a])=>{const{width:o,height:c}=a.contentRect;for(;r.lastChild;)r.lastChild.remove();if(o>0){const h=t(o,c);t.length!==1&&C(h)&&(h.style.position="absolute"),r.append(h)}});return n.observe(r),e?.then(()=>n.disconnect()),r}i(B,"d"),U(B,"resize");function C(t){return t.nodeType===1}i(C,"v"),U(C,"isElement");var Y=Object.defineProperty,ee=i((t,e)=>Y(t,"name",{value:e,configurable:!0}),"o");const M=(m=class{},i(m,"e"),m);ee(M,"Library");let te=M;const re=void 0;export{O as AbstractFile,v as FileAttachment,re as FileAttachments,H as Generators,te as Library,z as Mutable,P as registerFile,B as resize};
