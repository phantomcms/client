import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-main',
  styleUrl: 'app-main.scss',
  shadow: true
})
export class AppMain {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    )
  }
}