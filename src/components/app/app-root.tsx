import { Component, h } from '@stencil/core';
import { state } from '../../store';


@Component({
  tag: 'app-root',
  shadow: true
})
export class AppRoot {

  render() {
    return (
      <main>
        { 
          !state.authenticating ? (
            state.user ? (
              <app-main>main works!</app-main>
            ) : (
              <page-login></page-login>
            )
          ) : (
            /* TODO loading component */
            <div>Authenticating</div>
          )
        }
      </main>
    );
  }
}
