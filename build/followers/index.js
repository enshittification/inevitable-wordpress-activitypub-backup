(()=>{var e={184:(e,t)=>{var a;!function(){"use strict";var r={}.hasOwnProperty;function n(){for(var e=[],t=0;t<arguments.length;t++){var a=arguments[t];if(a){var l=typeof a;if("string"===l||"number"===l)e.push(a);else if(Array.isArray(a)){if(a.length){var o=n.apply(null,a);o&&e.push(o)}}else if("object"===l){if(a.toString!==Object.prototype.toString&&!a.toString.toString().includes("[native code]")){e.push(a.toString());continue}for(var i in a)r.call(a,i)&&a[i]&&e.push(i)}}}return e.join(" ")}e.exports?(n.default=n,e.exports=n):void 0===(a=function(){return n}.apply(t,[]))||(e.exports=a)}()}},t={};function a(r){var n=t[r];if(void 0!==n)return n.exports;var l=t[r]={exports:{}};return e[r](l,l.exports,a),l.exports}a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";const e=window.wp.blocks,t=window.wp.element,r=window.wp.primitives,n=(0,t.createElement)(r.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,t.createElement)(r.Path,{d:"M15.5 9.5a1 1 0 100-2 1 1 0 000 2zm0 1.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-2.25 6v-2a2.75 2.75 0 00-2.75-2.75h-4A2.75 2.75 0 003.75 15v2h1.5v-2c0-.69.56-1.25 1.25-1.25h4c.69 0 1.25.56 1.25 1.25v2h1.5zm7-2v2h-1.5v-2c0-.69-.56-1.25-1.25-1.25H15v-1.5h2.5A2.75 2.75 0 0120.25 15zM9.5 8.5a1 1 0 11-2 0 1 1 0 012 0zm1.5 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",fillRule:"evenodd"}));function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},l.apply(this,arguments)}const o=window.wp.components,i=window.wp.data,c=window.wp.blockEditor,s=window.wp.i18n,p=window.React,u=window.wp.apiFetch;var m=a.n(u);const v=window.wp.url;var b=a(184),w=a.n(b);function d(e){let{active:a,children:r,page:n,pageClick:l,className:o}=e;const i=w()("wp-block activitypub-pager",o,{current:a});return(0,t.createElement)("a",{className:i,onClick:e=>{e.preventDefault(),!a&&l(n)}},r)}const g={outlined:"outlined",minimal:"minimal"};function y(e){let{compact:a,nextLabel:r,page:n,pageClick:l,perPage:o,prevLabel:i,total:c,variant:s=g.outlined}=e;const p=((e,t)=>{let a=[1,e-2,e-1,e,e+1,e+2,t];a.sort(((e,t)=>e-t)),a=a.filter(((e,a,r)=>e>=1&&e<=t&&r.lastIndexOf(e)===a));for(let e=a.length-2;e>=0;e--)a[e]===a[e+1]&&a.splice(e+1,1);return a})(n,Math.ceil(c/o)),u=w()("alignwide wp-block-query-pagination is-content-justification-space-between is-layout-flex wp-block-query-pagination-is-layout-flex",`is-${s}`,{"is-compact":a});return(0,t.createElement)("nav",{className:u},i&&(0,t.createElement)(d,{key:"prev",page:n-1,pageClick:l,active:1===n,"aria-label":i,className:"wp-block-query-pagination-previous block-editor-block-list__block"},i),!a&&(0,t.createElement)("div",{className:"block-editor-block-list__block wp-block wp-block-query-pagination-numbers"},p.map((e=>(0,t.createElement)(d,{key:e,page:e,pageClick:l,active:e===n,className:"page-numbers"},e)))),r&&(0,t.createElement)(d,{key:"next",page:n+1,pageClick:l,active:n===Math.ceil(c/o),"aria-label":r,className:"wp-block-query-pagination-next block-editor-block-list__block"},r))}const{namespace:f}=window._activityPubOptions;function h(e){let{selectedUser:a,per_page:r,order:n,title:l,page:o,setPage:i,className:c=""}=e;const u="site"===a?0:a,[b,w]=(0,p.useState)([]),[d,g]=(0,p.useState)(0),[h,E]=(0,p.useState)(0),[_,x]=function(){const[e,t]=(0,p.useState)(1);return[e,t]}(),S=o||_,C=i||x,N=(0,t.createInterpolateElement)(/* translators: arrow for previous followers link */
(0,s.__)("<span>←</span> Less","activitypub"),{span:(0,t.createElement)("span",{class:"wp-block-query-pagination-previous-arrow is-arrow-arrow","aria-hidden":"true"})}),O=(0,t.createInterpolateElement)(/* translators: arrow for next followers link */
(0,s.__)("More <span>→</span>","activitypub"),{span:(0,t.createElement)("span",{class:"wp-block-query-pagination-next-arrow is-arrow-arrow","aria-hidden":"true"})});return(0,p.useEffect)((()=>{const e=function(e,t,a,r){const n=`/${f}/users/${e}/followers`,l={per_page:t,order:a,page:r,context:"full"};return(0,v.addQueryArgs)(n,l)}(u,r,n,S);m()({path:e}).then((e=>{g(Math.ceil(e.totalItems/r)),E(e.totalItems),w(e.orderedItems)})).catch((e=>console.error(e)))}),[u,r,n,S]),(0,t.createElement)("div",{className:"activitypub-follower-block "+c},(0,t.createElement)("h3",null,l),(0,t.createElement)("ul",null,b&&b.map((e=>(0,t.createElement)("li",{key:e.url},(0,t.createElement)(k,e))))),d>1&&(0,t.createElement)(y,{page:S,perPage:r,total:h,pageClick:C,nextLabel:O,prevLabel:N,compact:"is-style-compact"===c}))}function k(e){let{name:a,icon:r,url:n,preferredUsername:l}=e;const i=`@${l}`;return(0,t.createElement)(o.ExternalLink,{className:"activitypub-link",href:n,title:i,onClick:e=>e.preventDefault()},(0,t.createElement)("img",{width:"40",height:"40",src:r.url,class:"avatar activitypub-avatar"}),(0,t.createElement)("span",{class:"activitypub-actor"},(0,t.createElement)("strong",{className:"activitypub-name"},a),(0,t.createElement)("span",{class:"sep"},"/"),(0,t.createElement)("span",{class:"activitypub-handle"},i)))}(0,e.registerBlockType)("activitypub/followers",{edit:function(e){let{attributes:a,setAttributes:r}=e;const{order:n,per_page:p,selectedUser:u,className:m}=a,v=(0,c.useBlockProps)(),[b,w]=(0,t.useState)(1),d=[{label:(0,s.__)("New to old","activitypub"),value:"desc"},{label:(0,s.__)("Old to new","activitypub"),value:"asc"}],g=(0,i.useSelect)((e=>e("core").getUsers({who:"authors"}))),y=(0,t.useMemo)((()=>{if(!g)return[];const e=[{label:(0,s.__)("Whole Site","activitypub"),value:"site"}];return g.reduce(((e,t)=>(e.push({label:t.name,value:t.id}),e)),e)}),[g]),f=e=>t=>{w(1),r({[e]:t})};return(0,t.createElement)("div",v,(0,t.createElement)(c.InspectorControls,{key:"setting"},(0,t.createElement)(o.PanelBody,{title:(0,s.__)("Followers Options","activitypub")},(0,t.createElement)(o.SelectControl,{label:(0,s.__)("Select User","activitypub"),value:u,options:y,onChange:f("selectedUser")}),(0,t.createElement)(o.SelectControl,{label:(0,s.__)("Sort","activitypub"),value:n,options:d,onChange:f("order")}),(0,t.createElement)(o.RangeControl,{label:(0,s.__)("Number of Followers","activitypub"),value:p,onChange:f("per_page"),min:1,max:10}))),(0,t.createElement)(h,l({},a,{page:b,setPage:w})))},save:()=>null,icon:n})})()})();