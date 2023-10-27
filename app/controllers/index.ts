import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Controller from '@ember/controller';

export default class Index extends Controller.extend({
  // anything which *must* be merged to prototype here
}) {
  // normal class body definition here
  @tracked counter: number | null = 0;
  timer: null | NodeJS.Timer = null;

  @action
  startCounter() {
    this.counter = 10;
    this.resetCounter();
    this.timer = setInterval( () => {
      this.counter--;
      if( this.counter <= 0 ) {
        this.counter = null;
        this.resetCounter();
	      window.location.assign("https://lokaalbeslist.vlaanderen.be");
      }
    }, 1000);
  }

  @action
  resetCounter() {
    if( this.timer ) clearInterval( this.timer );
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'index': Index;
  }
}
