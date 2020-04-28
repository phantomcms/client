import { Component, Host, h } from "@stencil/core";

@Component({
  tag: 'page-login',
  styleUrl: 'page-login.scss',
  shadow: true
})
export class LoginPage {
  render() {
    return (
      <Host>
        <div class="login">
          <div class="login__panel">
            Something else can go here
          </div>
          <div class="login__content">
            Something can go here
          </div>
        </div>
      </Host>
    );
  }
}