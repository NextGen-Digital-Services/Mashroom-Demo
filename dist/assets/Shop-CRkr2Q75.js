import{c as b,j as e,u as P,b as I,r as l,X as m}from"./index-C_tGTYLJ.js";import{u as B}from"./useDocumentTitle-3dBXRq-d.js";import{P as R}from"./ProductGrid-BgkRTO7b.js";import"./ProductCard-DoOrVr99.js";import"./star-B1S6YpTo.js";import"./EmptyState-l94mlRns.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=b("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=b("List",[["line",{x1:"8",x2:"21",y1:"6",y2:"6",key:"7ey8pc"}],["line",{x1:"8",x2:"21",y1:"12",y2:"12",key:"rjfblc"}],["line",{x1:"8",x2:"21",y1:"18",y2:"18",key:"c3b1m8"}],["line",{x1:"3",x2:"3.01",y1:"6",y2:"6",key:"1g7gq3"}],["line",{x1:"3",x2:"3.01",y1:"12",y2:"12",key:"1pjlvk"}],["line",{x1:"3",x2:"3.01",y1:"18",y2:"18",key:"28t2mc"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=b("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]),z=({categories:y,selectedCategory:x,onCategoryChange:s,priceRange:c,onPriceChange:i,maxPrice:p=7e3,selectedTag:a,onTagChange:u,inStockOnly:n,onInStockChange:g,onReset:o})=>e.jsxs("div",{style:{background:"var(--white)",padding:"20px",borderRadius:"var(--radius-md)",border:"1px solid var(--line)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",borderBottom:"1px solid var(--line)",paddingBottom:"10px"},children:[e.jsx("h4",{style:{fontFamily:"var(--font-heading)",fontSize:"1.2rem"},children:"Filters"}),e.jsx("button",{onClick:o,style:{fontSize:"0.75rem",color:"var(--terracotta)",fontWeight:600,cursor:"pointer"},children:"Reset All"})]}),e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsx("label",{className:"eyebrow",children:"Category"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",marginTop:"8px"},children:[e.jsxs("label",{style:{fontSize:"0.85rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("input",{type:"radio",name:"cat",checked:!x,onChange:()=>s("")}),e.jsx("span",{children:"All Categories"})]}),y.map(r=>e.jsxs("label",{style:{fontSize:"0.85rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("input",{type:"radio",name:"cat",checked:x===r.slug,onChange:()=>s(r.slug)}),e.jsx("span",{children:r.name})]},r.id))]})]}),e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"},children:[e.jsx("label",{className:"eyebrow",style:{margin:0},children:"Max Price"}),e.jsxs("span",{style:{fontSize:"0.85rem",fontWeight:700,color:"var(--olive)"},children:["₹",c]})]}),e.jsx("input",{type:"range",min:"200",max:p,step:"100",value:c,onChange:r=>i(Number(r.target.value)),style:{width:"100%",accentColor:"var(--olive)"}})]}),e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsx("label",{className:"eyebrow",children:"Product Tag"}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px",marginTop:"8px"},children:["Bestseller","New","Organic"].map(r=>e.jsx("button",{onClick:()=>u(a===r?"":r),style:{padding:"4px 10px",borderRadius:"var(--radius-full)",fontSize:"0.75rem",border:"1px solid var(--line)",background:a===r?"var(--olive)":"var(--parchment)",color:a===r?"var(--ivory)":"var(--espresso)",cursor:"pointer"},children:r},r))})]}),e.jsx("div",{children:e.jsxs("label",{style:{fontSize:"0.85rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",fontWeight:600},children:[e.jsx("input",{type:"checkbox",checked:n,onChange:r=>g(r.target.checked)}),e.jsx("span",{children:"In-Stock Only"})]})})]}),O=({sortBy:y,onSortChange:x,layout:s,onLayoutChange:c,totalResults:i})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px",marginBottom:"20px",background:"var(--white)",padding:"12px 16px",borderRadius:"var(--radius-md)",border:"1px solid var(--line)"},children:[e.jsxs("span",{style:{fontSize:"0.85rem",color:"#666",fontWeight:500},children:["Showing ",e.jsx("strong",{children:i})," gourmet products"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("label",{style:{fontSize:"0.8rem",fontWeight:600,color:"var(--espresso)"},children:"Sort By:"}),e.jsxs("select",{value:y,onChange:p=>x(p.target.value),className:"form-select",style:{width:"auto",padding:"4px 10px",fontSize:"0.8rem"},children:[e.jsx("option",{value:"featured",children:"Featured Harvests"}),e.jsx("option",{value:"price-low",children:"Price: Low to High"}),e.jsx("option",{value:"price-high",children:"Price: High to Low"}),e.jsx("option",{value:"rating",children:"Customer Rating"}),e.jsx("option",{value:"newest",children:"Newest Additions"})]})]}),e.jsxs("div",{style:{display:"flex",border:"1px solid var(--line)",borderRadius:"4px",overflow:"hidden"},children:[e.jsx("button",{onClick:()=>c("grid"),style:{padding:"6px 10px",background:s==="grid"?"var(--parchment)":"var(--white)",cursor:"pointer"},title:"Grid view",children:e.jsx(F,{size:16,color:"var(--espresso)"})}),e.jsx("button",{onClick:()=>c("list"),style:{padding:"6px 10px",background:s==="list"?"var(--parchment)":"var(--white)",cursor:"pointer"},title:"List view",children:e.jsx(L,{size:16,color:"var(--espresso)"})})]})]})]}),X=()=>{B("All Gourmet Fungi Products & Preserves");const{products:y,categories:x}=P(),[s,c]=I(),[i,p]=l.useState(s.get("category")||""),[a,u]=l.useState(Number(s.get("price"))||7e3),[n,g]=l.useState(s.get("tag")||""),[o,r]=l.useState(s.get("stock")==="true"),[d,k]=l.useState(s.get("sort")||"featured"),[w,N]=l.useState("grid"),[f,v]=l.useState(!1);l.useEffect(()=>{const t={};i&&(t.category=i),a<7e3&&(t.price=a),n&&(t.tag=n),o&&(t.stock="true"),d!=="featured"&&(t.sort=d),c(t,{replace:!0})},[i,a,n,o,d]),l.useEffect(()=>(document.body.style.overflow=f?"hidden":"",()=>{document.body.style.overflow=""}),[f]);let j=y.filter(t=>!(i&&t.categorySlug!==i||t.price>a||n&&(!t.tags||!t.tags.includes(n))||o&&t.stock<=0));j.sort((t,h)=>d==="price-low"?t.price-h.price:d==="price-high"?h.price-t.price:d==="rating"?h.rating-t.rating:d==="newest"?h.id.localeCompare(t.id):0);const S=()=>{p(""),u(7e3),g(""),r(!1),k("featured")},C={categories:x,selectedCategory:i,onCategoryChange:p,priceRange:a,onPriceChange:u,selectedTag:n,onTagChange:g,inStockOnly:o,onInStockChange:r,onReset:S};return e.jsxs("div",{className:"section-padding",children:[e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"page-hero page-hero-card",style:{marginBottom:"32px"},children:[e.jsx("span",{className:"eyebrow",children:"Pantry Catalog"}),e.jsx("h1",{style:{fontFamily:"var(--font-heading)",fontSize:"var(--text-4xl)"},children:"Gourmet Mushroom Shop"})]}),(i||n||o||a<7e3)&&e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"20px",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"0.8rem",fontWeight:700,color:"#666"},children:"Active Filters:"}),i&&e.jsxs("span",{style:{background:"var(--parchment)",padding:"4px 10px",borderRadius:"var(--radius-full)",fontSize:"0.78rem",display:"inline-flex",alignItems:"center",gap:"6px",border:"1px solid var(--line)"},children:["Category: ",i," ",e.jsx(m,{size:12,style:{cursor:"pointer"},onClick:()=>p("")})]}),n&&e.jsxs("span",{style:{background:"var(--parchment)",padding:"4px 10px",borderRadius:"var(--radius-full)",fontSize:"0.78rem",display:"inline-flex",alignItems:"center",gap:"6px",border:"1px solid var(--line)"},children:["Tag: ",n," ",e.jsx(m,{size:12,style:{cursor:"pointer"},onClick:()=>g("")})]}),o&&e.jsxs("span",{style:{background:"var(--parchment)",padding:"4px 10px",borderRadius:"var(--radius-full)",fontSize:"0.78rem",display:"inline-flex",alignItems:"center",gap:"6px",border:"1px solid var(--line)"},children:["In Stock ",e.jsx(m,{size:12,style:{cursor:"pointer"},onClick:()=>r(!1)})]}),e.jsx("button",{onClick:S,style:{fontSize:"0.75rem",color:"var(--terracotta)",textDecoration:"underline",cursor:"pointer",border:"none",background:"none"},children:"Clear All"})]}),e.jsxs("button",{className:"shop-filter-edge",onClick:()=>v(!0),"aria-label":"Open filters",children:[e.jsx(W,{size:12}),"Filter"]}),f&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"filter-drawer-backdrop",onClick:()=>v(!1)}),e.jsxs("aside",{className:"filter-drawer",children:[e.jsxs("div",{className:"filter-drawer-head",children:[e.jsx("span",{className:"eyebrow",style:{marginBottom:0},children:"Refine"}),e.jsx("button",{onClick:()=>v(!1),"aria-label":"Close filters",style:{color:"var(--espresso)"},children:e.jsx(m,{size:22})})]}),e.jsx(z,{...C})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"260px 1fr",gap:"32px"},className:"shop-grid",children:[e.jsx("aside",{className:"shop-sidebar",children:e.jsx(z,{...C})}),e.jsxs("main",{children:[e.jsx(O,{sortBy:d,onSortChange:k,layout:w,onLayoutChange:N,totalResults:j.length}),e.jsx(R,{products:j,layout:w})]})]})]}),e.jsx("style",{children:`
        .shop-filter-edge { display: none; }
        .filter-drawer-backdrop { display: none; }
        .filter-drawer { display: none; }

        @media (max-width: 850px) {
          .shop-grid { grid-template-columns: 1fr !important; }
          .shop-sidebar { display: none !important; }

          /* edge tab — slim, hugging the phone edge so it barely takes space */
          .shop-filter-edge {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            position: fixed;
            left: 0;
            top: 42%;
            transform: translateY(-50%);
            z-index: 850;
            background: var(--olive-deep);
            color: var(--ivory);
            padding: 11px 5px;
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            writing-mode: vertical-rl;
            transform: translateY(-50%) rotate(180deg);
            font-size: 0.56rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            box-shadow: var(--shadow-sm);
          }

          .filter-drawer-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(42, 33, 26, 0.45);
            z-index: 1000;
          }
          .filter-drawer {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: min(320px, 86vw);
            background: var(--ivory);
            z-index: 1001;
            overflow-y: auto;
            padding: 20px 16px 40px;
            box-shadow: var(--shadow-lg);
            animation: filter-drawer-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .filter-drawer-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
          }
        }
        @keyframes filter-drawer-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .filter-drawer { animation: none; }
        }
      `})]})};export{X as Shop};
