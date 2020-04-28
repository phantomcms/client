import { Component, ComponentInterface, Host, h, Element, Prop, Watch, State } from '@stencil/core';

export type SpectreAnimationTrigger = 'enter' | 'leave' | 'both';

export interface SpectreAnimation {
  trigger: SpectreAnimationTrigger;
  query: string;
  states: Keyframe[];
  duration: number
  reverseStatesOnLeave?: boolean;
  reverseElementsOnLeave?: boolean,
  easing?: string;
  delay?: number;
  sequence?: boolean;
  stagger?: number;
}

@Component({
  tag: 'app-animate',
  shadow: true,
})
export class AppAnimate implements ComponentInterface {

  @Prop() animations: SpectreAnimation[];

  @Element() host: HTMLElement;
  parentNode: Node;

  // compiled animation states
  isCompiled: boolean;
  compiled: { enter: () => void, leave: () => void }[] = [];
  @State() duration: { enter: number, leave: number } = { enter: 0, leave: 0 }

  @Watch('animations')
  compileAnimations(animations: SpectreAnimation[], oldValue?: SpectreAnimation[]) {
    // if we have animations to work with and either 1) this is the initial compilation, or 2) this is a re-compilation, compile
    if (animations && (!this.isCompiled || !!oldValue)) {
      animations.forEach(animation => {
        const targets = Array.from(this.host.querySelectorAll(animation.query)) as HTMLElement[];

        targets.map((element, index) => {
          const compiledAnimation = { enter: undefined, leave: undefined };

          if (['enter', 'both'].includes(animation.trigger)) {
            compiledAnimation.enter = () => {
              // compile enter animations
              this.setElementInitialState(element, animation.states[0]);
              this.animateElement(element, animation, index);
            }
          }
          
          if (['leave', 'both'].includes(animation.trigger)) {
            const states = Array.from(animation.states);

            if (animation.reverseStatesOnLeave) {
              states.reverse();
            }

            compiledAnimation.leave = () => {
              // compile leave animations
              this.setElementInitialState(element, states[0]);
              this.animateElement(element, Object.assign({}, animation, { states }), animation.reverseElementsOnLeave ? targets.length - 1 - index : index);
            }
          }

          this.compiled.push(compiledAnimation);
          this.computeAnimationDelay(animation.trigger, targets, animation);
        })
      })
    }

    this.isCompiled = true;
  }

  setElementInitialState(element: HTMLElement, state: PropertyIndexedKeyframes) {
    Object.keys(state)
      .filter(p => !['composite', 'easing', 'offset'].includes(p))
      .forEach((property) => {
        element.style[property] = state[property];
      });
  }

  animateElement(element: HTMLElement, animation: SpectreAnimation, index: number) {
    let computedDelay = animation.delay || 0;

    if (animation.sequence) {
      computedDelay += (animation.duration * index);
    } else if (animation.stagger) {
      computedDelay += (animation.stagger * index)
    }

    return element.animate(animation.states, { easing: animation.easing || 'ease', fill: 'forwards', delay: computedDelay, duration: animation.duration });
  }

  computeAnimationDelay(trigger: SpectreAnimationTrigger, elements: HTMLElement[], animation: SpectreAnimation) {
    let duration = animation.duration;

    if (animation.sequence) {
      duration *= elements.length;
    } else if (animation.stagger) {
      duration += (animation.stagger * elements.length)
    }

    if (animation.delay) {
      duration += animation.delay
    }

    if (trigger !== 'both') {
      this.duration[trigger] = duration;
    } else {
      this.duration.enter = duration;
      this.duration.leave = duration;
    }
  }

  enter() {
    this.parentNode = this.host.parentNode;
    this.compiled.forEach(animation => {
      if (animation.enter) {
        animation.enter();
      }
    })
  }

  leave() {
    this.compiled.forEach(animation => {
      if (animation.leave) {
        animation.leave();
      }
    })
  }

  componentWillLoad() {
    // on initial load, compile animations
    this.compileAnimations(this.animations);
    this.enter();
  }

  componentWillUpdate() {
    console.log('updating')
  }

  componentWillUnload() {
    console.log('component about to unload')
  }

  componentDidUnload() {
    const nodes = Array.from(this.host.childNodes);

    // add nodes back to DOM
    nodes.forEach(node => {
      this.parentNode.appendChild(node)
    });

    // play any leave animations
    this.leave();

    // remove nodes from DOM when animations are complete
    setTimeout(() => {
      nodes.forEach(node => {
        this.parentNode.removeChild(node);
      });
    }, this.duration.leave)
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
