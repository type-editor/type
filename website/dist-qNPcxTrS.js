import{o as e}from"./default-plugins-DT7-pF91.js";var t=`
<main data-pmid="U0PgYFJcZ20EW2ltd3ZTb8" data-pmroot="true">
    <h3 data-pmid="X0PgYFJcZ20EW2ltd3ZTZ">Type - Another ProseMirror clone</h3>
    <p data-pmid="IyH_bOeHN2FwkpCM-K2i2" style="text-align: right;">
        <img
            src="https://d7hftxdivxxvm.cloudfront.net/?height=1440&amp;quality=60&amp;resize_to=fit&amp;src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2FkoWCsEKhB2S-KVlVOSEMsQ%252FBanksy_Girl%2Bwith%2BBalloon.jpeg&amp;width=1440"
            alt="Banksy - Girl with Balloon" title="Banksy - Girl with Balloon"
            class=" img50Float" data-pmsize="50" data-pmid="9d8BvJZPiFlpag4Bya_9j" data-pmtextaround="true"
            data-pmcaption="" contenteditable="false" draggable="true"></p>
    <p data-pmid="IyH_bOeHN2FwkpCM-K2i2">This is the demo page of the type editor. It is primarily a refactored version
        of
        the outstanding <a href="https://prosemirror.net/" title="ProseMirror" target="_blank" rel="noopener noreferrer"
                           data-pmid="1ZLlD9vMIUd1vubKupNnV">ProseMirror</a> editor.</p>
    <p data-pmid="CDtDLFYiXCR7lbyi7v0sB">Click the Edit button to make the text editable. Click the Save button to see
        the
        result (in this demo, nothing will actually be saved).</p>
    <p data-pmid="rDBvkIpV5bIZoMzpqJZ-v">This editor can also be used with React, Vue, and Svelte. For this purpose the
        <a
            href="https://github.com/prosekit/prosemirror-adapter" title="prosemirror-adapter" target="_blank"
            rel="noopener noreferrer" data-pmid="jvHHaquWZX_r8Nchk4Aom">prosemirror-adapter</a> is used.</p>
    <p data-pmid="XgJQHdqCVwa27n_qO2Zi9">Please note that using it with React, Vue, or Svelte requires some compromises.
        The
        ProseMirror editor code handles content updates synchronously, whereas React, Vue, and Svelte usually handle
        content
        updates asynchronously. Therefore, it does not fully align with the way React, Vue, and Svelte handle updates.
        Perhaps <a href="https://tiptap.dev/" title="TipTap" rel="noopener noreferrer"
                   data-pmid="7sQQV-lE8RqmyT-j0FAF3">TipTap</a>
        or <a href="https://prosekit.dev/" title="ProseKit" rel="noopener noreferrer" data-pmid="aDh83ibIKgz8tZw3Pfpml">ProseKit</a>
        offers a better approach.</p>
    <p data-pmid="rDBvkIpV5bIZoMzpqJZ-v">You can find separate demo pages for these frameworks and the source code here:&nbsp;<a
        href="../react/index.html" title="React" rel="noopener noreferrer" data-pmid="8G7ZPCVhxYV6p_H1w9euA">React</a>&nbsp;&nbsp;<a
        href="../vue/index.html" title="Vue" rel="noopener noreferrer" data-pmid="yJkE00hVvb2uK-iZxcEGX">Vue</a>&nbsp;&nbsp;<a
        href="../svelte/index.html" title="Svelte" rel="noopener noreferrer"
        data-pmid="xSE_gRlq09_eYdzJCcD5h">Svelte</a>&nbsp;&nbsp;<a
        href="https://github.com/type-editor/type" title="GitHub" rel="noopener noreferrer"
        data-pmid="BSE_0Jlq09_ePdzJCcDr9">GitHub</a>
    </p>
    <p data-pmid="1yErMZKQiV87vKXPk4Upt"><strong>Note</strong>: This is an early version of the Type Editor, and it may
        still have some issues.</p>
</main>
`,n=class{options;mark;view;inline;constructor(e){let{mark:t,view:n,inline:r,options:i}=e;this.mark=t,this.view=n,this.inline=r,this.options=i,this._dom=this.createElement(i.as),this._contentDOM=this.createElement(i.contentAs),this._dom.setAttribute(`data-mark-view-root`,`true`),this._contentDOM.setAttribute(`data-mark-view-content`,`true`),this._contentDOM.style.whiteSpace=`inherit`}_contentDOM;get contentDOM(){return this._contentDOM}_dom;get dom(){return this._dom}get component(){return this.options.component}ignoreMutation(e){if(!this.dom||!this._contentDOM)return!0;let t,n=this.options.ignoreMutation;return n&&(t=n(e)),typeof t!=`boolean`&&(t=this.shouldIgnoreMutation(e)),t}destroy(){this.options.destroy?.(),this._dom.remove(),this._contentDOM.remove()}shouldIgnoreMutation(e){return!this.dom||!this._contentDOM?!0:e.type===`selection`?!1:this._contentDOM===e.target&&e.type===`attributes`?!0:!this._contentDOM.contains(e.target)}createElement(t){let{inline:n,mark:r}=this;return e(t)?document.createElement(n?`span`:`div`):t instanceof HTMLElement?t:typeof t==`function`?t(r):document.createElement(t)}},r=class{getPosFunc;view;options;node;decorations;innerDecorations;selected=!1;_dom;_contentDOM;constructor(e){let{node:t,view:n,getPos:r,decorations:i,innerDecorations:a,options:o}=e;this.node=t,this.view=n,this.getPosFunc=r,this.decorations=i,this.innerDecorations=a,this.options=o,this._dom=this.createElement(o.as)??document.createElement(`div`),t.isLeaf?this._contentDOM=null:o.contentAs===`self`?this._contentDOM=this._dom:this._contentDOM=this.createElement(o.contentAs),this._dom.setAttribute(`data-node-view-root`,`true`),this._contentDOM&&this._contentDOM!==this._dom&&(this._contentDOM.setAttribute(`data-node-view-content`,`true`),this._contentDOM.style.whiteSpace=`inherit`),this.setSelection=o.setSelection,this.stopEvent=o.stopEvent}setSelection;stopEvent;get dom(){return this._dom}get contentDOM(){return this._contentDOM}get component(){return this.options.component}selectNode(){this.selected=!0,this.options.selectNode?.()}deselectNode(){this.selected=!1,this.options.deselectNode?.()}update(e,t,n){let r=this.options.update?.(e,t,n)??this.shouldUpdate(e);return this.node=e,this.decorations=t,this.innerDecorations=n,r&&this.options.onUpdate?.(),r}ignoreMutation(e){if(!this._dom||!this._contentDOM)return!0;let t,n=this.options.ignoreMutation;return n&&(t=n(e)),typeof t!=`boolean`&&(t=this.shouldIgnoreMutation(e)),t}destroy(){this.options.destroy?.(),this._dom.remove(),this._contentDOM&&this._contentDOM!==this._dom&&this._contentDOM.remove()}getPos(){return this.getPosFunc()}shouldUpdate(e){return e.type===this.node.type}shouldIgnoreMutation(e){return!this._dom||!this._contentDOM||this.node.isLeaf||this.node.isAtom?!0:e.type===`selection`?!1:this._contentDOM===e.target&&e.type===`attributes`?!0:!this._contentDOM.contains(e.target)}setAttrs(e){let t=this.getPos();typeof t==`number`&&this.view.dispatch(this.view.state.tr.setNodeMarkup(t,void 0,{...this.node.attrs,...e}))}createElement(t){let{node:n}=this;return e(t)?document.createElement(n.isInline?`span`:`div`):t instanceof HTMLElement?t:typeof t==`function`?t(n):document.createElement(t)}},i=class{view;prevState;options;constructor(e){this.view=e.view,this.options=e.options}get component(){return this.options.component}get root(){let e=this.options.root?.(this.view.dom);return e||=this.view.dom.parentElement??document.body,e}update(e,t){this.view=e,this.prevState=t,this.options.update?.(e,t)}destroy(){this.options.destroy?.()}},a=class{view;options;_dom;_pos;getPosFunc;constructor(e){let{pos:t,spec:n,options:r}=e;this._pos=t,this.options=r,this._spec=n,this._dom=this.createElement(r.as),this._dom.setAttribute(`data-widget-view-root`,`true`)}_spec;get spec(){return this._spec}set spec(e){this._spec=e}get dom(){return this._dom}get pos(){return this._pos}get component(){return this.options.component}bind(e,t){this.view=e,this.getPosFunc=t}getPos(){return this.getPosFunc?.()}createElement(e){return e instanceof HTMLElement?e:document.createElement(e)}};export{t as a,n as i,r as n,i as r,a as t};