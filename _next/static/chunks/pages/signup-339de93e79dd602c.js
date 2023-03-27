(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[616],{7805:function(e,s,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/signup",function(){return t(3599)}])},772:function(e,s,t){"use strict";t.d(s,{Z:function(){return l}});var n=t(5893),r=t(1664),a=t.n(r),i=t(1954);function l(e){let{className:s,name:t,href:r,current:l}=e;null==l&&(l=!0);let c=r?(0,n.jsx)(a(),{href:r,className:"ml-1 sm:ml-4 text-2xl text-gray-500 hover:text-gray-700","aria-current":l?"page":void 0,children:t}):(0,n.jsx)("span",{className:"ml-1 sm:ml-4 text-3xl text-gray-700","aria-current":l?"page":void 0,children:t});return(0,n.jsx)("nav",{className:["flex",s].join(" "),"aria-label":"Breadcrumb",children:(0,n.jsxs)("ol",{role:"list",className:"flex items-center sm:space-x-4",children:[(0,n.jsx)("li",{children:(0,n.jsx)("div",{children:(0,n.jsxs)(a(),{href:"/",className:"text-gray-600 hover:text-gray-700",children:[(0,n.jsx)(i.JO,{icon:"mdi:home",className:"flex-shrink-0 h-8 w-8","aria-hidden":"true"}),(0,n.jsx)("span",{className:"sr-only",children:"Home"})]})})}),(0,n.jsx)("li",{children:(0,n.jsxs)("div",{className:"flex items-center",children:[(0,n.jsx)(i.JO,{icon:"mdi:chevron-right",className:"flex-shrink-0 h-8 w-8 text-gray-400","aria-hidden":"true"}),c]})})]})})}},2606:function(e,s,t){"use strict";var n=t(5893);let r=e=>{let{children:s}=e;return(0,n.jsx)("div",{className:"container mx-auto px-5",children:s})};s.Z=r},3447:function(e,s,t){"use strict";var n=t(5893),r=t(2606);let a=()=>(0,n.jsx)("footer",{className:"bg-accent-1 border-t border-accent-2",children:(0,n.jsx)(r.Z,{children:(0,n.jsxs)("div",{className:"py-28 flex flex-col lg:flex-row items-center",children:[(0,n.jsx)("h3",{className:"text-4xl lg:text-6xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2",children:"A ServiceStack Project"}),(0,n.jsxs)("div",{className:"flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2",children:[(0,n.jsx)("a",{href:"https://docs.servicestack.net",className:"mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0",children:"Read Documentation"}),(0,n.jsx)("a",{href:"https://github.com/NetCoreTemplates/nextjs",className:"mx-3 font-bold hover:underline",children:"View on GitHub"})]})]})})});s.Z=a},1225:function(e,s,t){"use strict";var n=t(5893),r=t(9008),a=t.n(r),i=t(8713),l=t(3447),c=t(7404),o=t(772),m=t(4184),x=t.n(m);let d=e=>{let{title:s,className:t,children:r}=e;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(c.Z,{}),(0,n.jsx)(a(),{children:(0,n.jsx)("title",{children:s})}),(0,n.jsx)(i.Z,{}),(0,n.jsx)("div",{className:"min-h-screen",children:(0,n.jsx)("main",{children:(0,n.jsxs)("div",{className:x()("container mx-auto px-5",t),children:[(0,n.jsx)(o.Z,{className:"my-8",name:s}),r]})})}),(0,n.jsx)(l.Z,{})]})};s.Z=d},7404:function(e,s,t){"use strict";var n=t(5893),r=t(9008),a=t.n(r),i=t(8038);let l=()=>(0,n.jsxs)(a(),{children:[(0,n.jsx)("link",{rel:"apple-touch-icon",sizes:"180x180",href:"/favicon/apple-touch-icon.png"}),(0,n.jsx)("link",{rel:"icon",type:"image/png",sizes:"32x32",href:"/favicon/favicon-32x32.png"}),(0,n.jsx)("link",{rel:"icon",type:"image/png",sizes:"16x16",href:"/favicon/favicon-16x16.png"}),(0,n.jsx)("link",{rel:"manifest",href:"/favicon/site.webmanifest"}),(0,n.jsx)("link",{rel:"mask-icon",href:"/favicon/safari-pinned-tab.svg",color:"#000000"}),(0,n.jsx)("link",{rel:"shortcut icon",href:"/favicon/favicon.ico"}),(0,n.jsx)("meta",{name:"msapplication-TileColor",content:"#000000"}),(0,n.jsx)("meta",{name:"msapplication-config",content:"/favicon/browserconfig.xml"}),(0,n.jsx)("meta",{name:"theme-color",content:"#000"}),(0,n.jsx)("link",{rel:"alternate",type:"application/rss+xml",href:"/feed.xml"}),(0,n.jsx)("meta",{name:"description",content:"A statically generated blog example using Next.js and ".concat(i.yf,".")}),(0,n.jsx)("meta",{property:"og:image",content:i.vC})]});s.Z=l},8713:function(e,s,t){"use strict";t.d(s,{Z:function(){return o}});var n=t(5893),r=t(1664),a=t.n(r),i=t(1163),l=t(2761),c=t(3475);function o(){let e=[{type:"Button",href:"/hosting",name:"$0.40 /mo"},{href:"/posts",name:"Blog"},{href:"/todomvc",name:"Todos"},{href:"/bookings-crud",name:"Bookings"},{href:"/features",name:"Features"}],{auth:s,attrs:t,signout:r}=(0,l.Z)(),o=(0,i.useRouter)();s?e.push(...[{href:"/profile",name:"Profile"},{href:"/admin",name:"Admin",show:"role:Admin"},{type:"Button",onClick:e=>r("/"),name:"Sign Out"}]):(e.push({type:"Button",href:"/signin",name:"Sign In"}),e.push({type:"PrimaryButton",href:"/signup",name:"Register"}));let m=e.filter(e=>!(e.show&&-1===t.indexOf(e.show)||e.hide&&t.indexOf(e.hide)>=0));return(0,n.jsx)("header",{className:"border-b border-gray-200 pr-3",children:(0,n.jsxs)("div",{className:"flex flex-wrap items-center",children:[(0,n.jsx)("div",{className:"flex-shrink flex-grow-0",children:(0,n.jsx)(a(),{href:"/",children:(0,n.jsx)("div",{className:"p-4 cursor-pointer",children:(0,n.jsx)("img",{className:"w-8 h-8",src:"/assets/img/logo.svg",alt:"MyApp logo"})})})}),(0,n.jsx)("div",{className:"flex flex-grow flex-shrink flex-nowrap justify-end items-center",children:(0,n.jsx)("nav",{className:"relative flex flex-grow",children:(0,n.jsx)("ul",{className:"flex flex-wrap items-center justify-end w-full m-0",children:m.map(e=>(0,n.jsx)("li",{className:"relative flex flex-wrap just-fu-start m-0",children:"Button"===e.type?(0,n.jsx)(c.kq,{className:"m-2",href:e.href,onClick:e.onClick,children:e.name}):"PrimaryButton"==e.type?(0,n.jsx)(c.KM,{className:"m-2",href:e.href,onClick:e.onClick,children:e.name}):(0,n.jsx)(a(),{href:e.href,className:"flex items-center justify-start mw-full p-4 hover:text-success".concat(o.asPath===e.href?" text-success":""),children:e.name})},e.name))})})})]})})}},8038:function(e,s,t){"use strict";t.d(s,{vC:function(){return r},yf:function(){return n}});let n="Markdown",r="https://og-image.vercel.app/Next.js%20Blog%20Starter%20Example.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg"},3599:function(e,s,t){"use strict";t.r(s);var n=t(5893),r=t(7294),a=t(1163),i=t.n(a),l=t(5548),c=t(1225),o=t(3475),m=t(9285),x=t(4321),d=t(2761);s.default=()=>{let e=(0,m.m8)(),[s,t]=(0,r.useState)(),[h,f]=(0,r.useState)(),[u,p]=(0,r.useState)(),g=e=>{let s=(0,l.leftPart)(e,"@"),n=(0,l.rightPart)((0,l.leftPart)(e,"."),"@");t((0,l.toPascalCase)(s)+" "+(0,l.toPascalCase)(n)),f(e),p("p@55wOrd")},{signedIn:j,revalidate:v}=(0,d.Z)(),N=(0,a.useRouter)();if((0,r.useEffect)(()=>{j&&i().replace((0,o.sX)()||"/")},[j]),j)return(0,n.jsx)(o.FS,{});let w=async s=>{s.preventDefault();let{displayName:t,userName:n,password:r,confirmPassword:a,autoLogin:i}=(0,l.serializeToObject)(s.currentTarget);if(r!==a){e.setError({fieldName:"confirmPassword",message:"Passwords do not match"});return}let c=await e.api(new x.aX({displayName:t,email:n,password:r,confirmPassword:a,autoLogin:i}));c.succeeded&&(await v(),await N.push("/signin"))},y=e=>s=>e(s.target.value);return(0,n.jsxs)(c.Z,{title:"Sign Up",children:[(0,n.jsx)(m.GS.Provider,{value:e,children:(0,n.jsx)("form",{onSubmit:w,className:"max-w-prose",children:(0,n.jsxs)("div",{className:"shadow overflow-hidden sm:rounded-md",children:[(0,n.jsx)(o.Xg,{except:"displayName,userName,password,confirmPassword"}),(0,n.jsx)("div",{className:"px-4 py-5 bg-white space-y-6 sm:p-6",children:(0,n.jsxs)("div",{className:"flex flex-col gap-y-4",children:[(0,n.jsx)(o.oi,{id:"displayName",help:"Your first and last name",value:s,onChange:y(t)}),(0,n.jsx)(o.oi,{id:"userName",value:h,onChange:y(f)}),(0,n.jsx)(o.oi,{id:"password",type:"password",help:"6 characters or more",value:u,onChange:y(p)}),(0,n.jsx)(o.oi,{id:"confirmPassword",type:"password",defaultValue:u}),(0,n.jsx)(o.XZ,{id:"autoLogin"})]})}),(0,n.jsx)("div",{className:"pt-5 px-4 py-3 bg-gray-50 text-right sm:px-6",children:(0,n.jsxs)("div",{className:"flex justify-end",children:[(0,n.jsx)(o.bz,{className:"flex-1"}),(0,n.jsx)(o.KM,{className:"ml-3",children:"Sign Up"})]})})]})})}),(0,n.jsxs)("div",{className:"flex mt-8 ml-8",children:[(0,n.jsx)("h3",{className:"mr-4 leading-8 text-gray-500",children:"Quick Links"}),(0,n.jsx)("span",{className:"relative z-0 inline-flex shadow-sm rounded-md",children:(0,n.jsx)("button",{type:"button",onClick:e=>g("new@user.com"),className:"-ml-px relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",children:"new@user.com"})})]})]})}},9008:function(e,s,t){e.exports=t(3121)}},function(e){e.O(0,[80,475,774,888,179],function(){return e(e.s=7805)}),_N_E=e.O()}]);