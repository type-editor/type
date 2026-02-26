import { CoreMarkView } from '@type-editor/adapter-core';
import { nanoid } from 'nanoid';
import type {ReactPortal} from 'react';
import { createPortal } from 'react-dom';

import type { ReactRenderer } from '../ReactRenderer';
import type { MarkViewContext } from './markViewContext';
import { markViewContext } from './markViewContext';
import type { ReactMarkViewComponent } from './ReactMarkViewOptions';

/**
 * React-specific mark view that bridges a {@link CoreMarkView} with the React
 * rendering pipeline.  Renders the user component inside a React portal and
 * provides mark context via React context.
 */
export class ReactMarkView extends CoreMarkView<ReactMarkViewComponent> implements ReactRenderer<MarkViewContext> {

    key: string = nanoid();

  context: MarkViewContext = {
    contentRef: (element: HTMLElement) => {
      if (element && this.contentDOM && element.firstChild !== this.contentDOM) {
          element.appendChild(this.contentDOM);
      }
    },
    view: this.view,

    mark: this.mark,
  };

  public updateContext(): void {
    Object.assign(this.context, {
      mark: this.mark,
    });
  }

  public render(): ReactPortal  {
    const UserComponent: ReactMarkViewComponent = this.component;

    return createPortal(
      <markViewContext.Provider value={this.context}>
        <UserComponent />
      </markViewContext.Provider>,
      this.dom,
      this.key,
    );
  }
}
