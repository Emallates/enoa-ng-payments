import { addCard } from "./directives";

console.log('->addCard', addCard)

export default angular.module('stripe.directives', [])
  .directive('createSourceToStripe', addCard.Factory)
  ;