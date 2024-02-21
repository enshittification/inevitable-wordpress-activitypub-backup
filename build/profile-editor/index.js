(()=>{"use strict";var e,t={692:(e,t,a)=>{const r=window.wp.element,n=window.wp.domReady;var i=a.n(n);const o=window.wp.components,l=function(e){let{icon:t,size:a=24,...n}=e;return(0,r.cloneElement)(t,{width:a,height:a,...n})},c=window.wp.primitives,u=(0,r.createElement)(c.SVG,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},(0,r.createElement)(c.Path,{d:"M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM15.5303 8.46967C15.8232 8.76256 15.8232 9.23744 15.5303 9.53033L13.0607 12L15.5303 14.4697C15.8232 14.7626 15.8232 15.2374 15.5303 15.5303C15.2374 15.8232 14.7626 15.8232 14.4697 15.5303L12 13.0607L9.53033 15.5303C9.23744 15.8232 8.76256 15.8232 8.46967 15.5303C8.17678 15.2374 8.17678 14.7626 8.46967 14.4697L10.9393 12L8.46967 9.53033C8.17678 9.23744 8.17678 8.76256 8.46967 8.46967C8.76256 8.17678 9.23744 8.17678 9.53033 8.46967L12 10.9393L14.4697 8.46967C14.7626 8.17678 15.2374 8.17678 15.5303 8.46967Z"})),s=(0,r.createElement)(c.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,r.createElement)(c.Path,{d:"M16.7 7.1l-6.3 8.5-3.3-2.5-.9 1.2 4.5 3.4L17.9 8z"})),d=window.wp.i18n,p=window.wp.mediaUtils,v=window.wp.apiFetch;var m=a.n(v);const{namespace:f}=window._activityPubOptions,h={avatar:"",resource:"@well@hello.dolly",name:(0,d.__)("Hello Dolly Fan Account","activitypub"),url:"#"};function w(e){var t,a;if(!e)return h;const r={...h,...e};return r.avatar=null==r||null===(t=r.icon)||void 0===t?void 0:t.url,r.header=null==r||null===(a=r.image)||void 0===a?void 0:a.url,r}const y=/<\/?[a-z][^>]*?>/gi;function b(e){let{update:t,value:a,className:n,placeholder:i=""}=e;const[l,c]=(0,r.useState)(!1),u=l?n:`${n} not-editing`;return(0,r.createElement)("div",{className:u},(0,r.createElement)(o.TextControl,{value:a,placeholder:i,onChange:t,onBlur:()=>c(!1),onFocus:()=>c(!0)}))}function E(e){let{update:t,value:a,className:n,buttonText:i,mediaText:l}=e;const c=(0,r.useRef)();return(0,r.createElement)("div",{className:n},a&&(0,r.createElement)("img",{src:a,alt:""}),(0,r.createElement)(p.MediaUpload,{title:l,onClose:()=>c.current.blur(),onSelect:e=>t(e.url,e.id),type:"image",value:0,render:e=>{let{open:t}=e;return(0,r.createElement)(o.Button,{ref:c,onClick:t,className:"activitypub-hover-button",isPrimary:!0},i)}}))}function _(e){let{url:t,update:a}=e;return(0,r.createElement)(E,{className:"activitypub-profile-editor__avatar",buttonText:(0,d.__)("Upload Avatar","activitypub"),mediaText:(0,d.__)("Select or Upload Avatar","activitypub"),value:t,update:a})}function g(e){let{url:t,update:a}=e;return(0,r.createElement)(E,{className:"activitypub-profile-editor__header",buttonText:(0,d.__)("Upload Header","activitypub"),mediaText:(0,d.__)("Select or Upload Header","activitypub"),value:t,update:a})}function C(e){let{name:t,update:a}=e;return(0,r.createElement)(b,{className:"activitypub-profile-editor__name",value:t,update:a})}function x(e){let{description:t,update:a}=e;const n=(i=t)?i.replace(y,""):"";var i;const o=(0,d.__)("Optional: provide a description for this profile","activitypub");return(0,r.createElement)(b,{className:"activitypub-profile-editor__description",value:n,update:a,placeholder:o})}function O(e){let{id:t}=e;const{profile:a,isDirty:n,isLoading:i,error:c,updateProfile:p,saveProfile:v,resetProfile:h}=function(e){const[t,a]=(0,r.useState)(w()),[n,i]=(0,r.useState)(!1),[o,l]=(0,r.useState)(null),[c,u]=(0,r.useState)({}),s={...t,...c},d=!!Object.keys(c).length;function p(e){e=w(e),a(e),v()}function v(){u({})}return(0,r.useEffect)((()=>{"number"==typeof e&&(i(!0),function(e){const t={headers:{Accept:"application/activity+json"},path:`/${f}/users/${e}`};return m()(t)}(e).then(p).catch(l).finally((()=>i(!1))))}),[e]),{profile:s,isLoading:n,error:o,updateProfile:function(e,t){const a={...c};a[e]=t,!(arguments.length<=2)&&arguments.length-2&&"avatar"===e&&(a.avatarId=arguments.length<=2?void 0:arguments[2]),u(a)},saveProfile:async function(){i(!0);const t={method:"PUT",headers:{"Content-Type":"application/activity+json"},path:`/${f}/users/${e}`,data:c};return m()(t).then((e=>{p(e)})).catch(l).finally((()=>i(!1)))},resetProfile:v,isDirty:d}}(t),{avatar:y,header:b,name:E,handle:O,summary:P}=a;function L(e){return function(t){for(var a=arguments.length,r=new Array(a>1?a-1:0),n=1;n<a;n++)r[n-1]=arguments[n];return p(e,t,...r)}}return(0,r.useEffect)((()=>{const e=e=>{n&&(e.preventDefault(),e.returnValue="")};return window.addEventListener("beforeunload",e),()=>window.removeEventListener("beforeunload",e)}),[n]),c?(0,r.createElement)(o.Card,{className:"activitypub-profile-editor"},(0,r.createElement)("p",null,(0,d.__)("There was an error loading your profile.","activitypub"))):(0,r.createElement)(o.Card,{className:"activitypub-profile-editor"},n&&(0,r.createElement)("div",{className:"activitypub-profile-editor__actions"},(0,r.createElement)(o.Button,{onClick:h},(0,r.createElement)(l,{icon:u})),(0,r.createElement)(o.Button,{isPrimary:!0,onClick:v},(0,r.createElement)(l,{icon:s}))),(0,r.createElement)(g,{url:b,update:L("header")}),(0,r.createElement)(_,{url:y,update:L("avatar")}),(0,r.createElement)("div",{className:"activitypub-profile-editor__text-wrap"},(0,r.createElement)(C,{name:E,handle:O,update:L("name")}),(0,r.createElement)(x,{description:P,update:L("summary")})))}i()((()=>{document.querySelectorAll(".activitypub-profile-editor").forEach((e=>{const t=parseInt(e.dataset.id,10);(0,r.createRoot)(e).render((0,r.createElement)(O,{id:t}))}))}))}},a={};function r(e){var n=a[e];if(void 0!==n)return n.exports;var i=a[e]={exports:{}};return t[e](i,i.exports,r),i.exports}r.m=t,e=[],r.O=(t,a,n,i)=>{if(!a){var o=1/0;for(s=0;s<e.length;s++){for(var[a,n,i]=e[s],l=!0,c=0;c<a.length;c++)(!1&i||o>=i)&&Object.keys(r.O).every((e=>r.O[e](a[c])))?a.splice(c--,1):(l=!1,i<o&&(o=i));if(l){e.splice(s--,1);var u=n();void 0!==u&&(t=u)}}return t}i=i||0;for(var s=e.length;s>0&&e[s-1][2]>i;s--)e[s]=e[s-1];e[s]=[a,n,i]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var a in t)r.o(t,a)&&!r.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={446:0,44:0};r.O.j=t=>0===e[t];var t=(t,a)=>{var n,i,[o,l,c]=a,u=0;if(o.some((t=>0!==e[t]))){for(n in l)r.o(l,n)&&(r.m[n]=l[n]);if(c)var s=c(r)}for(t&&t(a);u<o.length;u++)i=o[u],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(s)},a=globalThis.webpackChunkwordpress_activitypub=globalThis.webpackChunkwordpress_activitypub||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))})();var n=r.O(void 0,[44],(()=>r(692)));n=r.O(n)})();